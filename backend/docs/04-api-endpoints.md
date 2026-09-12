# TDD 04: API Contracts & Routing Conventions

**Type:** Technical Design Document

## RESTful Conventions
The API strictly adheres to REST principles for predictability and ease of integration.

### Rules
1. **Nouns, not verbs:** Routes use plural nouns (e.g., /api/transactions, not /api/getTransactions).
2. **Versioning:** The API is structured to support future versioning via URL path (e.g., /api/v1/wallets).
3. **HTTP Status Codes:**
   - \200 OK\: Successful reads.
   - \201 Created\: Resource successfully created (returns \Location\ header).
   - \400 Bad Request\: Validation failures (FluentValidation).
   - \401 Unauthorized\: Missing or invalid JWT.
   - \403 Forbidden\: Valid JWT, but lacking role permissions.
   - \404 Not Found\: Resource does not exist.
   - \409 Conflict\: Concurrency exceptions (e.g., Double-spending attempts).
   - \500 Internal Server Error\: Handled gracefully by the Global Exception Middleware.

### Pagination
All collection endpoints implement offset pagination using \Page\ and \PageSize\ query parameters, returning a standardized \PagedResponse<T>\ object.
