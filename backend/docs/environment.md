# Environment Variables & Configuration

The application relies on the following environment variables (defined in \.env\ or Azure Key Vault).

- \ConnectionStrings__DefaultConnection\: The SQL Server connection string.
- \Jwt__SecretKey\: 256-bit symmetric key for signing tokens (Must never be committed to source control).
- \Jwt__Issuer\: The issuing server URL.
- \Jwt__Audience\: The intended audience.
- \Jwt__ExpirationInMinutes\: Token lifespan.
- \DolarApi__BaseUrl\: URL for the external FX integration.
