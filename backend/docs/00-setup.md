# Local Development Setup Guide

## Prerequisites
- .NET 8.0 SDK
- Docker Desktop
- SQL Server Management Studio (SSMS) or Azure Data Studio (Optional)

## Docker Environment (Recommended)
The fastest way to spin up the entire ecosystem (SQL Server + Backend API) is via Docker Compose.

`ash
# Build and run the containers in detached mode
docker-compose up -d --build
`
*The database will be automatically seeded with the latest EF Core migrations on startup.*

## Manual Setup (Without Docker)
1. Ensure a local SQL Server instance is running.
2. Duplicate .env.example to .env (or configure ppsettings.Development.json) with your local connection string.
3. Run Entity Framework Migrations:
   `ash
   dotnet ef database update --project src/SmartWallet.Infrastructure --startup-project src/SmartWallet.API
   `
4. Start the API:
   `ash
   dotnet run --project src/SmartWallet.API
   `
"@

    "02-domain-base-model.md" = @"
# TDD 02: Domain Base Entities & Auditing

**Type:** Technical Design Document

## Context
To avoid repeating primary keys and audit fields across the domain, we implemented a generic Base Entity pattern.

## Implementation
All domain entities inherit from \BaseEntity<TId>\.

### The BaseEntity Contract
- \Id\: Strongly typed primary key (usually \Guid\ to prevent ID guessing and support distributed generation).
- \CreatedAt\: UTC Timestamp marking entity creation.
- \UpdatedAt\: UTC Timestamp updated automatically by the EF Core Interceptor during \SaveChangesAsync\.
- \IsActive\: Soft-delete flag. Instead of hard-deleting records (which destroys financial audit trails), entities are marked inactive.

## Consequences
- Guarantees strict historical auditing for every table.
- Simplifies generic repository implementations since all entities share a common contract.
