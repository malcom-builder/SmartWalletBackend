# TDD 08: Identity & User Management

**Type:** Technical Design Document

## Context
User management handles identity lifecycle, profile management, and role assignment.

## Implementation Details
- **Registration:** Users register via /api/auth/register. Passwords are immediately hashed using a cryptographically secure algorithm (e.g., BCrypt/PBKDF2) with a unique salt per user.
- **Role-Based Access Control (RBAC):**
  - \User\: Standard permissions (can only view/transact on their own wallets).
  - \Admin\: Elevated permissions (can view all ledgers, ban users, cancel transactions).
- **Soft Deletion:** Admins can ban or suspend users by toggling the \IsActive\ flag. Soft-deleted users are immediately rejected by the JWT middleware on subsequent requests.
