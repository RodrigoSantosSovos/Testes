using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sovos.Invoiceware.Api.Controllers;

[ApiController]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    [HttpGet("/health")]
    public IActionResult Liveness() => Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });

    [HttpGet("/health/ready")]
    public IActionResult Readiness() => Ok(new { status = "Ready", timestamp = DateTime.UtcNow });

    [HttpGet("/version")]
    public IActionResult Version() => Ok(new
    {
        version = "1.0.0",
        environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
        dotnetVersion = Environment.Version.ToString()
    });
}
