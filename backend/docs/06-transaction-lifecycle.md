# TDD 06: State Machine & Transaction Lifecycle

**Type:** Technical Design Document

## Overview
Financial transactions are not binary (Success/Fail). They go through a strict state machine to guarantee consistency, especially during network latency.

## The State Machine
1. **Pending:** The transaction intent is created. Funds are locked but not yet settled.
2. **Processing:** The Unit of Work begins evaluating business rules (e.g., sufficient funds, account limits).
3. **Completed:** The transaction passes all rules, balances are mutated, and the Double-Entry Ledger is written. The DB transaction is committed.
4. **Failed:** If any rule fails, or a concurrency exception occurs, the DB transaction rolls back. The transaction record is marked as Failed.
5. **Canceled (Admin Only):** A manual override state for reversing erroneous operations.

This lifecycle ensures that even if the server crashes during \Processing\, the database will automatically rollback to \Pending\ or drop the transaction, preventing "money printer" bugs.
