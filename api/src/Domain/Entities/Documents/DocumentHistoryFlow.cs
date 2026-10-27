namespace Sovos.Invoiceware.Domain.Entities.Documents;

public class DocumentHistoryFlow
{
    public int HistoryId { get; set; }
    public string DocumentId { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
    public string? ProcessName { get; set; }
    public int FlowId { get; set; }
    public int StatusId { get; set; }
    public string StatusCode { get; set; } = string.Empty;
    public string StatusDescription { get; set; } = string.Empty;
    public string? StatusDetail { get; set; }
    public string? QueueName { get; set; }
    public int Semaphore { get; set; }
    public string? LoteId { get; set; }
    public Document Document { get; set; } = null!;
}
