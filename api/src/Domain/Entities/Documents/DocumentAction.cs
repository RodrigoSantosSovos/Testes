namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentAction
{
    public int ActionId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
    public string? Username { get; set; }
    public string ActionDescription { get; set; } = string.Empty;
    public Document Document { get; set; } = null!;
}
