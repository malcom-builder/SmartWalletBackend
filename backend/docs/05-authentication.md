# ADR 005: JWT Authentication & Identity Management

**Status:** Accepted  
**Type:** Architecture Decision Record

## Context
SmartWallet requires a stateless, scalable, and secure authentication mechanism to manage user sessions and authorize financial operations. Traditional session-based authentication is not suitable for a containerized, RESTful API environment.

## Decision
We implemented **JSON Web Tokens (JWT)** as the primary authentication mechanism, coupled with **Role-Based Access Control (RBAC)**.

## Implementation Details
1. **Token Generation (\AuthenticationService\):**
   - Emits signed JWTs using a strong symmetric key (managed via Azure Key Vault in production).
   - Injects custom claims (sub, email, 
ame, ole) to prevent database hits for basic user identity checks during requests.
2. **Security Enhancements:**
   - Passwords are securely hashed before database insertion.
   - Tokens have a short expiration window to minimize the impact of token theft.
3. **Authorization:**
   - Applied [Authorize] attributes globally where required.
   - Defined custom policies (e.g., AdminOnly, SameUserOrAdmin) to strictly control access to sensitive endpoints (like viewing another user's ledger).

## Consequences
- **Positive:** Fully stateless authentication allows the backend to scale horizontally without sticky sessions.
- **Negative:** Token revocation (logout) is complex in stateless JWT. A token blocklist (Redis) must be implemented in future iterations to handle manual logouts.
