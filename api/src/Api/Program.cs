using Sovos.Invoiceware.Api.Extensions;
using Sovos.Invoiceware.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(opt =>
    {
        opt.SuppressModelStateInvalidFilter = false;
    });

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddAuth(builder.Configuration);
builder.Services.AddSwaggerDocs();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sovos Invoiceware API v1"));
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
