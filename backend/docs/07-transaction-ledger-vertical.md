# ADR 007: Implementation of Double-Entry Ledger for Transaction Integrity

**Status:** Accepted  
**Date:** 2025-12-03 (Updated)  
**Context:**  
Standard CRUD operations for digital wallets typically involve directly updating a Balance field. However, this approach is highly susceptible to race conditions, lacks historical auditability, and fails to meet financial compliance standards. If a system crashes mid-transfer, funds can be permanently lost or duplicated.

**Decision:**  
We decided to implement a **Double-Entry Transaction Ledger** combined with the **Unit of Work** pattern.

## Architecture & Implementation

### 1. The Domain Entities
- **\Transaction\**: Represents the user's intent (e.g., Transfer  from Wallet A to Wallet B).
- **\TransactionLedger\**: Represents the immutable accounting lines. Every transaction generates at least two ledger entries: a Credit (+) and a Debit (-).

### 2. Unit of Work (ACID Compliance)
All financial movements are wrapped in an Entity Framework Core database transaction (IDbContextTransaction).
The TransactionService orchestrates this:
1. Validates funds and business rules.
2. Creates the Transaction record.
3. Mutates the Wallet balances.
4. Generates the TransactionLedger entries.
5. Commits the transaction to SQL Server atomically.

### 3. API Endpoints
| Method | Endpoint | Description |
|--------|--------------------------------------|------------------------------------------|
| POST   | /api/transactions/deposit            | Cash-in operation |
| POST   | /api/transactions/withdraw           | Cash-out operation |
| POST   | /api/transactions/transfer           | Internal atomic transfer |
| GET    | /api/transactions/{id}               | Fetch transaction details |
| GET    | /api/transactionledgers/{txId}       | Fetch ledger lines for a specific transaction |

## Consequences
- **Positive:** 100% financial traceability. Zero risk of partial transfers. Easy reconciliation for accounting.
- **Negative:** Increased database storage requirements (each transfer generates 3 rows instead of 1). Read-heavy operations on the ledger require strict pagination and indexing.
