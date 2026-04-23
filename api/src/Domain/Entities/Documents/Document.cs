namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class Document
{
    public string DocumentId { get; set; } = Guid.NewGuid().ToString();
    public string DocumentType { get; set; } = string.Empty;
    public int ProcessType { get; set; }
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    public DateTime? UpdateDate { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string OwnerSearchCode { get; set; } = string.Empty;
    public string Receiver { get; set; } = string.Empty;
    public string ReceiverSearchCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string StatusDescription { get; set; } = string.Empty;
    public int Semaphore { get; set; }
    public string? ConfigVersion { get; set; }
    public string? ProcessVersion { get; set; }
    public int Historic { get; set; }
    public string? StorePath { get; set; }

    public string? TagVarchar1 { get; set; }
    public string? TagVarchar2 { get; set; }
    public string? TagVarchar3 { get; set; }
    public string? TagVarchar4 { get; set; }
    public string? TagVarchar5 { get; set; }
    public string? TagVarchar6 { get; set; }
    public string? TagVarchar7 { get; set; }
    public string? TagVarchar8 { get; set; }
    public string? TagVarchar9 { get; set; }
    public string? TagVarchar10 { get; set; }
    public int? TagInt1 { get; set; }
    public int? TagInt2 { get; set; }
    public int? TagInt3 { get; set; }
    public int? TagInt4 { get; set; }
    public int? TagInt5 { get; set; }
    public int? TagInt6 { get; set; }
    public int? TagInt7 { get; set; }
    public int? TagInt8 { get; set; }
    public int? TagInt9 { get; set; }
    public int? TagInt10 { get; set; }
    public double? TagFloat1 { get; set; }
    public double? TagFloat2 { get; set; }
    public double? TagFloat3 { get; set; }
    public DateTime? TagDate1 { get; set; }
    public DateTime? TagDate2 { get; set; }
    public DateTime? TagDate3 { get; set; }
    public bool? TagBit1 { get; set; }
    public bool? TagBit2 { get; set; }

    public List<DocumentHistoryFlow> HistoryFlows { get; set; } = [];
    public List<DocumentError> Errors { get; set; } = [];
    public List<DocumentAttachment> Attachments { get; set; } = [];
    public List<DocumentAction> Actions { get; set; } = [];
    public List<DocumentMessage> Messages { get; set; } = [];
    public List<DocumentFlag> Flags { get; set; } = [];
}
