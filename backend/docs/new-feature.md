# Feature Development Workflow

When adding a new feature (Vertical Slice) to the system, strictly follow this flow:

1. **Domain:** Define the Entity and its business rules.
2. **Application (Contracts):** Create the Request/Response DTOs and Validator classes.
3. **Application (Interfaces):** Define the Repository and Service interfaces.
4. **Infrastructure:** Implement the Repository and configure EF Core mappings.
5. **Application (Implementation):** Implement the Service logic.
6. **API:** Create the Controller, endpoints, and Swagger annotations.
7. **Tests:** Write unit tests for the domain rules and integration tests for the endpoints.
