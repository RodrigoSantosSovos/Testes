namespace Sovos.Invoiceware.Application.DTOs.Documents;

public record DocumentTypeDto(string Name, string Description, List<ProcessDto> Processes);
public record ProcessDto(int Id, string Name);

public record FilterDefinitionDto(
    string Name, string Description, string Type,
    bool IsFilter, bool IsColumn, bool IsRadioButton,
    string? Format, List<ChoiceDto> Choices);

public record ChoiceDto(string Value, string Label);

public record ColumnDefinitionDto(string Name, string Description, string Type, string? Format);

public record DocumentTypeFiltersResponse(
    string DocumentType, List<FilterDefinitionDto> Filters, List<ColumnDefinitionDto> Columns);

public record SearchFilterDto(string Name, string Type, string? Value, List<string>? Values);

public record SearchSortDto(string Field = "CreationDate", string Direction = "desc");

public record PaginationDto(int Page = 1, int PageSize = 25);

public record DocumentSearchRequest(
    string DocumentType,
    int Process = -1,
    int Situation = -1,
    bool Historic = false,
    List<SearchFilterDto>? Filters = null,
    PaginationDto? Pagination = null,
    SearchSortDto? Sort = null);

public record DocumentSearchResponse(
    int TotalRecords, int Page, int PageSize,
    List<ColumnDefinitionDto> Columns,
    List<DocumentListItemDto> Documents);

public record DocumentListItemDto(
    string DocumentId, string StatusDescription, int Semaphore,
    int ProcessType, int Historic,
    Dictionary<string, object?> Tags);

public record DocumentDetailDto(
    string DocumentId, string DocumentType, int ProcessType,
    DateTime CreationDate, DateTime? UpdateDate,
    string Owner, string? OwnerSearchCode,
    string Receiver, string? ReceiverSearchCode,
    int StatusId, string StatusCode, string StatusDescription, int Semaphore,
    string? ConfigVersion, string? ProcessVersion, int Historic,
    Dictionary<string, object?> Tags,
    List<FilterDefinitionDto> TagDefinitions,
    List<ActionDto> AvailableActions,
    Dictionary<string, string> Links);

public record ActionDto(int Id, string Name, string Description, bool HasForm, List<ActionFieldDto> FormFields);
public record ActionFieldDto(string Name, string Description, string Type, bool Required);

public record AttachmentDto(
    int AttachmentId, string AttachmentName, string? TranslatedName,
    string Type, DateTime CreationDate, string? ContentType,
    bool CanCopyContent, string DownloadUrl, string? ContentUrl);

public record AttachmentListResponse(string DocumentId, List<AttachmentDto> Attachments);

public record AttachmentContentResponse(string AttachmentName, string? ContentType, string Content);

public record HistoryFlowDto(
    int HistoryId, DateTime CreationDate, string? ProcessName, int FlowId,
    int StatusId, string StatusCode, string StatusDescription, string? StatusDetail,
    string? QueueName, int Semaphore, string? LoteId);

public record HistoryResponse(string DocumentId, List<HistoryFlowDto> History);

public record DocumentErrorDto(int ErrorId, DateTime CreationDate, string Method, string? Code, string Message);
public record ErrorsResponse(string DocumentId, List<DocumentErrorDto> Errors);

public record ActionAuditDto(int ActionId, DateTime CreationDate, string? Username, string ActionDescription);
public record AuditResponse(string DocumentId, List<ActionAuditDto> Actions);

public record FlagDto(string FlagName, string FlagValue);
public record FlagsResponse(string DocumentId, List<FlagDto> Flags);

public record MessageDto(
    int MessageId, DateTime CreationDate, string? MessageType, string? Code,
    string? Description, string? CustomReturn, bool Sent, bool Error,
    string? ProcessType, string? TagVarchar1, string? TagVarchar2, string? TagVarchar3);
public record MessagesResponse(string DocumentId, List<MessageDto> Messages);
