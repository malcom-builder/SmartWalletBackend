# TDD 01: System Architecture & Design Principles

**Date:** 2025-10-15 (Updated)  
**Type:** Technical Design Document (TDD)

## Overview
SmartWallet is built using **Clean Architecture** to ensure the core business logic remains framework-agnostic, testable, and highly maintainable. The application is divided into four strictly decoupled layers.

## Layer Definitions

### 1. Domain Layer (\SmartWallet.Domain\)
The absolute core of the system. Contains all enterprise business rules.
- **Entities:** Rich domain models (e.g., Wallet, Transaction, User).
- **Interfaces:** Contracts for Repositories and external services.
- **Rules:** Zero dependencies on external libraries (no EF Core, no ASP.NET).

### 2. Application Layer (\SmartWallet.Application\)
Orchestrates business use cases.
- **CQRS:** Separates Commands (mutations) and Queries (reads).
- **Services:** E.g., TransactionService, AuthService.
- **Validation:** Utilizes FluentValidation for strict input sanitization.

### 3. Infrastructure Layer (\SmartWallet.Infrastructure\)
Implements the interfaces defined in the Domain.
- **Data Access:** EF Core DbContext, Repository implementations, Unit of Work.
- **External Services:** Polly-wrapped HTTP clients, Azure Key Vault integration.

### 4. Presentation Layer (\SmartWallet.API\)
The RESTful entry point.
- **Controllers:** Thin controllers that map HTTP requests to Application services.
- **Middleware:** Global Exception Handling, JWT Authentication.

## Key Design Principles
- **SOLID:** Strictly adhered to, heavily utilizing Dependency Inversion.
- **Fail-Fast:** Inputs are validated at the boundaries before reaching domain logic.
