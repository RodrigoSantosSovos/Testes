using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Sovos.Invoiceware.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config) => _config = config;

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username == "admin" && request.Password == "admin")
        {
            var token = GenerateToken(request.Username, "Rodrigo Santos",
                ["UI::Main::Menu_Dashboards", "UI::Main::Menu_Reports", "UI::Main::Menu_Settings",
                 "UI::Main::Menu_Security", "UI::Main::Menu_ReceptionLog",
                 "UI::Main::Document_Support", "UI::Main::Document_Delete"]);

            return Ok(new LoginResponse(token, request.Username, "Rodrigo Santos"));
        }

        return Unauthorized(new ProblemDetails
        {
            Type = "https://httpstatuses.com/401",
            Title = "Unauthorized",
            Status = 401,
            Detail = "Invalid username or password."
        });
    }

    private string GenerateToken(string username, string name, string[] permissions)
    {
        var key = _config["Jwt:Key"] ?? "sovos-invoiceware-dev-key-min-32-chars!!";
        var issuer = _config["Jwt:Issuer"] ?? "Sovos.Invoiceware";

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new("fullName", name),
            new(JwtRegisteredClaimNames.Sub, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        claims.AddRange(permissions.Select(p => new Claim("permission", p)));

        var token = new JwtSecurityToken(
            issuer: issuer,
            expires: DateTime.UtcNow.AddHours(8),
            claims: claims,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string Username, string Name);
