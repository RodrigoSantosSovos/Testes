namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentMessage
{
    public int MessageId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
    public string? MessageType { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? CustomReturn { get; set; }
    public bool Sent { get; set; }
    public bool Error { get; set; }
    public string? ProcessType { get; set; }
    public string? TagVarchar1 { get; set; }
    public string? TagVarchar2 { get; set; }
    public string? TagVarchar3 { get; set; }
    public Document Document { get; set; } = null!;
}
