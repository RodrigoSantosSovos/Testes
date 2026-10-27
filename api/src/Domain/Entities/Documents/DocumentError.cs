namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentError
{
    public int ErrorId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
    public string Method { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public Document Document { get; set; } = null!;
}
