using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sovos.Invoiceware.Application.DTOs.Documents;
using Sovos.Invoiceware.Application.Interfaces;

namespace Sovos.Invoiceware.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _svc;
    public DocumentsController(IDocumentService svc) => _svc = svc;

    [HttpGet("document-types")]
    public async Task<IActionResult> GetDocumentTypes(CancellationToken ct)
        => Ok(new { documentTypes = await _svc.GetDocumentTypesAsync(ct) });

    [HttpGet("document-types/{documentType}/filters")]
    public async Task<IActionResult> GetFilters(string documentType, CancellationToken ct)
        => Ok(await _svc.GetFiltersForTypeAsync(documentType, ct));

    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] DocumentSearchRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.DocumentType))
            return BadRequest(new ProblemDetails { Title = "Validation error", Status = 400, Detail = "DocumentType is required." });
        return Ok(await _svc.SearchAsync(request, ct));
    }

    [HttpGet("{documentId}")]
    public async Task<IActionResult> GetById(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetByIdAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = $"Document '{documentId}' not found." }) : Ok(result);
    }

    [HttpGet("{documentId}/attachments")]
    public async Task<IActionResult> GetAttachments(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetAttachmentsAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = $"Document '{documentId}' not found." }) : Ok(result);
    }

    [HttpGet("{documentId}/attachments/{attachmentName}/download")]
    public async Task<IActionResult> DownloadAttachment(string documentId, string attachmentName, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var bytes = await _svc.DownloadAttachmentAsync(documentId, attachmentName, historic, ct);
        if (bytes == null) return NotFound(new ProblemDetails { Title = "Not Found", Status = 404, Detail = $"Attachment '{attachmentName}' not found." });
        return File(bytes, "application/octet-stream", attachmentName);
    }

    [HttpGet("{documentId}/attachments/{attachmentName}/content")]
    public async Task<IActionResult> GetAttachmentContent(string documentId, string attachmentName, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetAttachmentContentAsync(documentId, attachmentName, historic, ct);
        if (result == null) return BadRequest(new ProblemDetails { Title = "Bad Request", Status = 400, Detail = $"Cannot retrieve text content for '{attachmentName}'." });
        return Ok(result);
    }

    [HttpGet("{documentId}/history")]
    public async Task<IActionResult> GetHistory(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetHistoryAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404 }) : Ok(result);
    }

    [HttpGet("{documentId}/errors")]
    public async Task<IActionResult> GetErrors(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetErrorsAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404 }) : Ok(result);
    }

    [HttpGet("{documentId}/audit")]
    public async Task<IActionResult> GetAudit(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetAuditAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404 }) : Ok(result);
    }

    [HttpGet("{documentId}/flags")]
    public async Task<IActionResult> GetFlags(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetFlagsAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404 }) : Ok(result);
    }

    [HttpGet("{documentId}/messages")]
    public async Task<IActionResult> GetMessages(string documentId, [FromQuery] int historic = 0, CancellationToken ct = default)
    {
        var result = await _svc.GetMessagesAsync(documentId, historic, ct);
        return result == null ? NotFound(new ProblemDetails { Title = "Not Found", Status = 404 }) : Ok(result);
    }
}
