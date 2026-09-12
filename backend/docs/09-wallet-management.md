# ADR 009: Wallet Aggregate Root and Concurrency Control

**Status:** Accepted  
**Date:** 2026-01-06 (Updated)  
**Context:**  
The Wallet entity is a highly contested resource. In a high-concurrency environment, multiple requests might attempt to withdraw funds simultaneously. Without strict concurrency control, this leads to the "Double-Spending" anomaly, where a user spends more money than they actually have.

**Decision:**  
We decided to implement **Domain-Driven Design (DDD)** principles for the Wallet entity and **Optimistic Concurrency Control** at the database level.

## Architecture & Implementation

### 1. Wallet as an Aggregate Root (DDD)
The Wallet class is designed as an Aggregate Root to prevent "Anemic Domain Models".
- **Encapsulation:** The Balance property has a private set. It cannot be arbitrarily modified by application services.
- **Behavior:** Balances can only be changed via domain methods: Deposit(amount), Withdraw(amount), which contain internal invariants and business rule validations.

### 2. Optimistic Concurrency Control
We implemented a RowVersion (Timestamp) concurrency token on the Wallet entity using Entity Framework Core.
- When two concurrent requests fetch the same wallet state and attempt to update it, the database compares the RowVersion.
- The first transaction succeeds. The second transaction fails with a DbUpdateConcurrencyException.
- The application catches this exception and returns an appropriate HTTP 409 Conflict (or retries the operation).

### 3. Layered Responsibility
- **Repository (\IWalletRepository\):** Strictly handles data access (GetByIdAsync, UpdateAsync).
- **Service (\IWalletService\):** Orchestrates the workflow, loading the entity, invoking domain methods, and saving.
- **Controller (\WalletController\):** Handles HTTP mapping, FluentValidation, and status code generation.

## Consequences
- **Positive:** Total protection against double-spending and race conditions. Business logic is easily unit-testable since it lives directly in the Domain entity.
- **Negative:** Requires handling DbUpdateConcurrencyException in the application layer, potentially necessitating retry mechanisms for high-frequency trading scenarios.
