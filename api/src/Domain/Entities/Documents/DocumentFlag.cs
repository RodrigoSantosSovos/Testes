namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentFlag
{
    public int FlagId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public string FlagName { get; set; } = string.Empty;
    public string FlagValue { get; set; } = string.Empty;
    public Document Document { get; set; } = null!;
}
