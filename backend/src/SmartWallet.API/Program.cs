using SmartWallet.Infrastructure.Extensions;
using Scalar.AspNetCore; // Asegurate de tener el using
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// --- validar configuración ---
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? builder.Configuration["Jwt:Key"];

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// --- setear variables en configuracion ---
builder.Configuration["Jwt:Key"] = jwtSecret;
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// --- servicios ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSmartWalletInfrastructure(builder.Configuration);

// --- manejo de errores global ---
builder.Services.AddExceptionHandler<SmartWallet.API.Middlewares.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// --- validaciones fluídas ---
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<SmartWallet.Application.Validations.UserRegisterRequestValidator>();

// --- CQRS / MediatR ---
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SmartWallet.Application.Users.GetAllUsersQuery).Assembly));

var app = builder.Build();

// --- validar configuración ---
if (!app.Environment.IsDevelopment())
{
    if (string.IsNullOrEmpty(jwtSecret) || string.IsNullOrEmpty(connectionString))
        throw new InvalidOperationException("Faltan variables en configuración: Jwt:Key o ConnectionStrings:DefaultConnection.");
}

// --- pipeline ---
if (app.Environment.IsDevelopment())
{
    // 1. Swashbuckle genera el documento en modo invisible
    app.UseSwagger(options =>
    {
        options.RouteTemplate = "openapi/{documentName}.json";
    });

    // 2. Scalar toma el control de la interfaz gráfica
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("SmartWallet API Reference")
               .WithTheme(ScalarTheme.DeepSpace) // El tema oscuro premium
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
               .HideModels(); // <-- Acá está la corrección
    });
}

app.UseExceptionHandler(); // <-- Manejo global de excepciones
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();