using Sovos.Invoiceware.Application.DTOs.Documents;

namespace Sovos.Invoiceware.Application.Interfaces;

public interface IDocumentService
{
    Task<List<DocumentTypeDto>> GetDocumentTypesAsync(CancellationToken ct = default);
    Task<DocumentTypeFiltersResponse> GetFiltersForTypeAsync(string documentType, CancellationToken ct = default);
    Task<DocumentSearchResponse> SearchAsync(DocumentSearchRequest request, CancellationToken ct = default);
    Task<DocumentDetailDto?> GetByIdAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<AttachmentListResponse?> GetAttachmentsAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<AttachmentContentResponse?> GetAttachmentContentAsync(string documentId, string attachmentName, int historic = 0, CancellationToken ct = default);
    Task<byte[]?> DownloadAttachmentAsync(string documentId, string attachmentName, int historic = 0, CancellationToken ct = default);
    Task<HistoryResponse?> GetHistoryAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<ErrorsResponse?> GetErrorsAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<AuditResponse?> GetAuditAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<FlagsResponse?> GetFlagsAsync(string documentId, int historic = 0, CancellationToken ct = default);
    Task<MessagesResponse?> GetMessagesAsync(string documentId, int historic = 0, CancellationToken ct = default);
}
