# TDD 03: EF Core & Database Configuration

**Type:** Technical Design Document

## Context
Efficient database access is critical for a FinTech backend.

## Implementation Details
1. **Fluent API Configuration:**
   - All entity configurations (Table names, max lengths, relationships) are extracted into separate \IEntityTypeConfiguration<T>\ classes (e.g., \WalletConfiguration\) instead of bloating the \OnModelCreating\ method.
2. **Interceptors:**
   - Implemented a \SaveChangesInterceptor\ to automatically inject \UpdatedAt\ UTC timestamps whenever an entity is modified, removing this responsibility from the Application layer.
3. **Connection Resiliency:**
   - Configured EF Core EnableRetryOnFailure to automatically handle transient SQL Server connection drops.
4. **Data Seeding:**
   - Basic roles and admin users are seeded conditionally during migration execution.
