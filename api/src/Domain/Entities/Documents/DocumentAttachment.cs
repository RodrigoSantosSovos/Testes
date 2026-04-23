namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentAttachment
{
    public int AttachmentId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public string AttachmentName { get; set; } = string.Empty;
    public string Type { get; set; } = "Text";
    public DateTime CreationDate { get; set; }
    public string? ContentType { get; set; }
    public string? Content { get; set; }
    public Document Document { get; set; } = null!;
}
