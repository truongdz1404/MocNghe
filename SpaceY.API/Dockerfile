# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["SpaceY.API/SpaceY.API.csproj", "SpaceY.API/"]
COPY ["SpaceY.Application/SpaceY.Application.csproj", "SpaceY.Application/"]
COPY ["SpaceY.Domain/SpaceY.Domain.csproj", "SpaceY.Domain/"]
COPY ["SpaceY.Infrastructure/SpaceY.Infrastructure.csproj", "SpaceY.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "SpaceY.API/SpaceY.API.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/SpaceY.API"
RUN dotnet build "SpaceY.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "SpaceY.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

# Copy published application
COPY --from=publish /app/publish .

# Set ownership and permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "SpaceY.API.dll"]