using Microsoft.EntityFrameworkCore;
using Sovos.Invoiceware.Application.DTOs.Documents;
using Sovos.Invoiceware.Application.Interfaces;
using Sovos.Invoiceware.Domain.Entities.Documents;
using Sovos.Invoiceware.Infrastructure.Data;

namespace Sovos.Invoiceware.Infrastructure.Services;

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _db;
    public DocumentService(AppDbContext db) => _db = db;

    private static readonly List<DocumentTypeDto> DocTypes =
    [
        new("ide", "BR - Nota Fiscal Mercantil NF-e", [new(0, "Outbound"), new(1, "Inbound")]),
        new("CFDI", "MX - CFDI", [new(0, "Outbound"), new(1, "Inbound")]),
        new("DTE", "CL - Documento Tributario Electrónico", [new(0, "Outbound"), new(1, "Inbound")]),
        new("NFSe", "BR - Nota Fiscal de Serviço Eletrônica", [new(0, "Outbound")]),
        new("cteProc", "BR - Conhecimento de Transporte Eletrônico", [new(0, "Outbound"), new(1, "Inbound")]),
    ];

    private static readonly Dictionary<string, List<FilterDefinitionDto>> FilterDefs = new()
    {
        ["ide"] =
        [
            new("TagVarchar1", "CNPJ Emissor", "TF.Integration.Types.String", true, true, false, null, []),
            new("TagVarchar2", "CNPJ Receptor", "TF.Integration.Types.String", true, true, false, null, []),
            new("TagVarchar3", "Chave de Acesso", "TF.Integration.Types.String", true, true, false, null, []),
            new("TagInt1", "Série", "TF.Integration.Types.Integer", true, true, false, null, []),
            new("TagInt2", "Número NF", "TF.Integration.Types.Integer", true, true, false, null, []),
            new("TagFloat1", "Valor Total", "TF.Integration.Types.Double", true, true, false, "#,##0.00", []),
            new("TagDate1", "Data Emissão", "TF.Integration.Types.DateTime", true, true, false, null, []),
            new("TagInt5", "Status SEFAZ", "TF.Integration.Types.Integer", true, true, true, null,
                [new("-1", "Ignorar"), new("1", "Aprovado"), new("2", "Rejeitado"), new("0", "Não Contém")]),
        ],
        ["CFDI"] =
        [
            new("TagVarchar1", "RFC Emisor", "TF.Integration.Types.String", true, true, false, null, []),
            new("TagVarchar2", "RFC Receptor", "TF.Integration.Types.String", true, true, false, null, []),
            new("TagInt2", "Folio", "TF.Integration.Types.Integer", true, true, false, null, []),
            new("TagDate1", "Fecha Emisión", "TF.Integration.Types.DateTime", true, true, false, null, []),
        ],
    };

    public Task<List<DocumentTypeDto>> GetDocumentTypesAsync(CancellationToken ct = default)
        => Task.FromResult(DocTypes);

    public Task<DocumentTypeFiltersResponse> GetFiltersForTypeAsync(string documentType, CancellationToken ct = default)
    {
        var filters = FilterDefs.GetValueOrDefault(documentType, []);
        var columns = filters.Where(f => f.IsColumn).Select(f => new ColumnDefinitionDto(f.Name, f.Description, f.Type, f.Format)).ToList();
        return Task.FromResult(new DocumentTypeFiltersResponse(documentType, filters, columns));
    }

    public async Task<DocumentSearchResponse> SearchAsync(DocumentSearchRequest req, CancellationToken ct = default)
    {
        var page = req.Pagination?.Page ?? 1;
        var pageSize = Math.Min(req.Pagination?.PageSize ?? 25, 100);

        IQueryable<Document> query = _db.Set<Document>().AsNoTracking();

        query = query.Where(d => d.DocumentType == req.DocumentType);
        if (req.Process >= 0) query = query.Where(d => d.ProcessType == req.Process);
        if (req.Situation >= 0) query = query.Where(d => d.Semaphore == req.Situation);
        if (req.Historic) query = query.Where(d => d.Historic == 1);

        if (req.Filters != null)
        {
            foreach (var f in req.Filters)
            {
                query = ApplyFilter(query, f);
            }
        }

        var total = await query.CountAsync(ct);
        var dir = req.Sort?.Direction?.ToLower() == "asc";
        query = dir ? query.OrderBy(d => d.CreationDate) : query.OrderByDescending(d => d.CreationDate);
        var docs = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        var filterDefs = FilterDefs.GetValueOrDefault(req.DocumentType, []);
        var columns = filterDefs.Where(f => f.IsColumn).Select(f => new ColumnDefinitionDto(f.Name, f.Description, f.Type, f.Format)).ToList();

        var items = docs.Select(d => new DocumentListItemDto(
            d.DocumentId, d.StatusDescription, d.Semaphore, d.ProcessType, d.Historic,
            BuildTags(d, filterDefs)
        )).ToList();

        return new DocumentSearchResponse(total, page, pageSize, columns, items);
    }

    public async Task<DocumentDetailDto?> GetByIdAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var doc = await _db.Set<Document>().AsNoTracking().FirstOrDefaultAsync(d => d.DocumentId == documentId, ct);
        if (doc == null) return null;

        var filterDefs = FilterDefs.GetValueOrDefault(doc.DocumentType, []);
        var tags = BuildTags(doc, filterDefs);
        var tagDefs = filterDefs.Where(f => f.IsColumn).ToList();

        var actions = new List<ActionDto>
        {
            new(1, "Action::Reprint", "Re-imprimir", false, []),
            new(2, "Action::Cancel", "Cancelar", true, [new("xJustCanc", "Justificativa", "String", true)]),
        };

        var links = new Dictionary<string, string>
        {
            ["self"] = $"/api/v1/documents/{documentId}?historic={historic}",
            ["history"] = $"/api/v1/documents/{documentId}/history?historic={historic}",
            ["errors"] = $"/api/v1/documents/{documentId}/errors?historic={historic}",
            ["attachments"] = $"/api/v1/documents/{documentId}/attachments?historic={historic}",
            ["flags"] = $"/api/v1/documents/{documentId}/flags?historic={historic}",
            ["messages"] = $"/api/v1/documents/{documentId}/messages?historic={historic}",
        };

        return new DocumentDetailDto(
            doc.DocumentId, doc.DocumentType, doc.ProcessType,
            doc.CreationDate, doc.UpdateDate,
            doc.Owner, doc.OwnerSearchCode, doc.Receiver, doc.ReceiverSearchCode,
            doc.StatusId, doc.StatusCode, doc.StatusDescription, doc.Semaphore,
            doc.ConfigVersion, doc.ProcessVersion, doc.Historic,
            tags, tagDefs, actions, links);
    }

    public async Task<AttachmentListResponse?> GetAttachmentsAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;

        var attachments = await _db.Set<DocumentAttachment>().AsNoTracking()
            .Where(a => a.DocumentId == documentId)
            .OrderByDescending(a => a.CreationDate)
            .ToListAsync(ct);

        var items = attachments.Select(a => new AttachmentDto(
            a.AttachmentId, a.AttachmentName, a.AttachmentName,
            a.Type, a.CreationDate, a.ContentType,
            a.Type == "Text",
            $"/api/v1/documents/{documentId}/attachments/{a.AttachmentName}/download?historic={historic}",
            a.Type == "Text" ? $"/api/v1/documents/{documentId}/attachments/{a.AttachmentName}/content?historic={historic}" : null
        )).ToList();

        return new AttachmentListResponse(documentId, items);
    }

    public async Task<AttachmentContentResponse?> GetAttachmentContentAsync(string documentId, string attachmentName, int historic = 0, CancellationToken ct = default)
    {
        var att = await _db.Set<DocumentAttachment>().AsNoTracking()
            .FirstOrDefaultAsync(a => a.DocumentId == documentId && a.AttachmentName == attachmentName, ct);
        if (att == null) return null;
        if (att.Type != "Text") return null;
        return new AttachmentContentResponse(att.AttachmentName, att.ContentType, att.Content ?? "");
    }

    public async Task<byte[]?> DownloadAttachmentAsync(string documentId, string attachmentName, int historic = 0, CancellationToken ct = default)
    {
        var att = await _db.Set<DocumentAttachment>().AsNoTracking()
            .FirstOrDefaultAsync(a => a.DocumentId == documentId && a.AttachmentName == attachmentName, ct);
        if (att == null) return null;
        return System.Text.Encoding.UTF8.GetBytes(att.Content ?? "");
    }

    public async Task<HistoryResponse?> GetHistoryAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;
        var items = await _db.Set<DocumentHistoryFlow>().AsNoTracking()
            .Where(h => h.DocumentId == documentId).OrderByDescending(h => h.CreationDate).ToListAsync(ct);
        return new HistoryResponse(documentId, items.Select(h =>
            new HistoryFlowDto(h.HistoryId, h.CreationDate, h.ProcessName, h.FlowId, h.StatusId, h.StatusCode, h.StatusDescription, h.StatusDetail, h.QueueName, h.Semaphore, h.LoteId)).ToList());
    }

    public async Task<ErrorsResponse?> GetErrorsAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;
        var items = await _db.Set<DocumentError>().AsNoTracking()
            .Where(e => e.DocumentId == documentId).OrderByDescending(e => e.CreationDate).ToListAsync(ct);
        return new ErrorsResponse(documentId, items.Select(e =>
            new DocumentErrorDto(e.ErrorId, e.CreationDate, e.Method, e.Code, e.Message)).ToList());
    }

    public async Task<AuditResponse?> GetAuditAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;
        var items = await _db.Set<DocumentAction>().AsNoTracking()
            .Where(a => a.DocumentId == documentId).OrderByDescending(a => a.CreationDate).ToListAsync(ct);
        return new AuditResponse(documentId, items.Select(a =>
            new ActionAuditDto(a.ActionId, a.CreationDate, a.Username, a.ActionDescription)).ToList());
    }

    public async Task<FlagsResponse?> GetFlagsAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;
        var items = await _db.Set<DocumentFlag>().AsNoTracking()
            .Where(f => f.DocumentId == documentId).ToListAsync(ct);
        return new FlagsResponse(documentId, items.Select(f => new FlagDto(f.FlagName, f.FlagValue)).ToList());
    }

    public async Task<MessagesResponse?> GetMessagesAsync(string documentId, int historic = 0, CancellationToken ct = default)
    {
        var exists = await _db.Set<Document>().AnyAsync(d => d.DocumentId == documentId, ct);
        if (!exists) return null;
        var items = await _db.Set<DocumentMessage>().AsNoTracking()
            .Where(m => m.DocumentId == documentId).OrderByDescending(m => m.CreationDate).ToListAsync(ct);
        return new MessagesResponse(documentId, items.Select(m =>
            new MessageDto(m.MessageId, m.CreationDate, m.MessageType, m.Code, m.Description, m.CustomReturn, m.Sent, m.Error, m.ProcessType, m.TagVarchar1, m.TagVarchar2, m.TagVarchar3)).ToList());
    }

    private static IQueryable<Document> ApplyFilter(IQueryable<Document> query, SearchFilterDto f)
    {
        if (f.Type.Contains("String") && !string.IsNullOrWhiteSpace(f.Value))
        {
            var val = f.Value;
            if (f.Name == "TagVarchar1") query = val.Contains('%') ? query.Where(d => d.TagVarchar1 != null && d.TagVarchar1.Contains(val.Replace("%", ""))) : query.Where(d => d.TagVarchar1 == val);
            else if (f.Name == "TagVarchar2") query = query.Where(d => d.TagVarchar2 == val);
            else if (f.Name == "TagVarchar3") query = query.Where(d => d.TagVarchar3 == val);
        }
        else if (f.Type.Contains("Integer") && f.Values is { Count: 2 })
        {
            if (int.TryParse(f.Values[0], out var min) && int.TryParse(f.Values[1], out var max))
            {
                if (f.Name == "TagInt1") query = query.Where(d => d.TagInt1 >= min && d.TagInt1 <= max);
                else if (f.Name == "TagInt2") query = query.Where(d => d.TagInt2 >= min && d.TagInt2 <= max);
            }
        }
        else if (f.Type.Contains("DateTime") && f.Values is { Count: 2 })
        {
            if (DateTime.TryParse(f.Values[0], out var from) && DateTime.TryParse(f.Values[1], out var to))
            {
                if (f.Name == "TagDate1") query = query.Where(d => d.TagDate1 >= from && d.TagDate1 <= to.Date.AddDays(1).AddTicks(-1));
            }
        }
        return query;
    }

    private static Dictionary<string, object?> BuildTags(Document d, List<FilterDefinitionDto> defs)
    {
        var tags = new Dictionary<string, object?>();
        foreach (var def in defs.Where(f => f.IsColumn))
        {
            tags[def.Name] = def.Name switch
            {
                "TagVarchar1" => d.TagVarchar1, "TagVarchar2" => d.TagVarchar2, "TagVarchar3" => d.TagVarchar3,
                "TagVarchar4" => d.TagVarchar4, "TagVarchar5" => d.TagVarchar5,
                "TagInt1" => d.TagInt1, "TagInt2" => d.TagInt2, "TagInt3" => d.TagInt3,
                "TagInt5" => d.TagInt5,
                "TagFloat1" => d.TagFloat1,
                "TagDate1" => d.TagDate1,
                _ => null
            };
        }
        return tags;
    }
}
