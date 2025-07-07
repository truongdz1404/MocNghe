using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SpaceY.API;
using SpaceY.Application.Mappings;
using SpaceY.Domain.Configs;
using SpaceY.Domain.Entities;
using SpaceY.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
var jwtSection = builder.Configuration.GetSection("JWT");
builder.Services.Configure<JwtConfig>(jwtSection);
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập 'Bearer' [space] và token JWT của bạn."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddHttpClient();
var jwtConfig = jwtSection.Get<JwtConfig>()
    ?? throw new Exception("Jwt options have not been set!");
var configuration = builder.Configuration;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        var connectionString = configuration.GetConnectionString("DbConnection");
        options.UseNpgsql(connectionString);
    }
);
builder.Services.AddAutoMapper(typeof(AddressMappingProfile));
builder.Services.AddAutoMapper(typeof(OrderMappingProfile));

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
});
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = false;

        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = false;
        options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;
        // options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
        options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultEmailProvider;
    }
).AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAutoMapper(typeof(ApplicationDbContext).Assembly);

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

if (corsOrigins == null || corsOrigins.Length == 0)
{
    throw new InvalidOperationException("CORS AllowedOrigins configuration is missing or empty.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod() 
            .SetPreflightMaxAge(TimeSpan.FromSeconds(3600)); 
    });
});

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            options.DefaultChallengeScheme =
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new()
        {
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            ValidIssuer = jwtConfig.Issuer,
            ValidAudience = jwtConfig.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig.SigningKey)
            )
        };
        option.Events = new()
        {
            OnMessageReceived = context =>
            {
                context.Request.Cookies.TryGetValue(jwtConfig.AccessTokenKey, out var accessToken);
                if (!string.IsNullOrEmpty(accessToken))
                    context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.RegisterService();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // await app.InitialiseDatabaseAsync();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => "SpaceY API is running!");

app.UseCors("CorsPolicy");
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();