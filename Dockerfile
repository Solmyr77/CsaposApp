# Use the official ASP.NET runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Expose ports (optional if you bind to host ports directly)
EXPOSE 80
EXPOSE 443

# Use the official .NET SDK to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CsaposApi.csproj", "."]
RUN dotnet restore "CsaposApi.csproj"

COPY . .
RUN dotnet build "CsaposApi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "CsaposApi.csproj" -c Release -o /app/publish

# Final stage: runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CsaposApi.dll"]
