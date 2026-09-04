FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the solution file and project files
COPY *.sln ./
COPY src/SmartWallet.API/*.csproj ./src/SmartWallet.API/
COPY src/SmartWallet.Application/*.csproj ./src/SmartWallet.Application/
COPY src/SmartWallet.Domain/*.csproj ./src/SmartWallet.Domain/
COPY src/SmartWallet.Infrastructure/*.csproj ./src/SmartWallet.Infrastructure/
COPY src/Contracts/*.csproj ./src/Contracts/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . ./

# Build and publish the application
RUN dotnet publish src/SmartWallet.API/SmartWallet.API.csproj -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose the port the app runs on
EXPOSE 8080

# Configure environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Create a directory for the database to allow mounting a volume
RUN mkdir -p /app/data

# Run the application
ENTRYPOINT ["dotnet", "SmartWallet.API.dll"]
