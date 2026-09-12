# Coding Standards & Conventions

1. **Dependency Injection:** All services must be registered via Extension Methods (e.g., \AddInfrastructureLayer()\) to keep \Program.cs\ clean.
2. **Async/Await:** Suffix all asynchronous methods with \Async\ (e.g., \GetWalletByIdAsync\). Never use \.Result\ or \.Wait()\ to avoid deadlocks.
3. **DTOs:** Never expose Domain Entities directly to the API response. Always map Entities to Response DTOs.
4. **Validation:** Use FluentValidation. Keep validation logic completely out of Controllers and Domain Entities.
5. **Exceptions:** Do not use try-catch blocks in Controllers. Let exceptions bubble up to the Global Exception Handling Middleware to maintain standardized error responses.
