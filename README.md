# 💳 SmartWallet - Enterprise-Grade Digital Banking Ecosystem

![.NET 8](https://img.shields.io/badge/.NET-8.0-512bd4?style=for-the-badge&logo=dotnet)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white)
![Security](https://img.shields.io/badge/Security-JWT_&_KeyVault-critical?style=for-the-badge&logo=lock)

**SmartWallet** is a high-performance digital banking infrastructure designed with **Clean Architecture** and **SOLID** principles. It was architected from scratch to solve critical FinTech challenges: data integrity, system resilience, and enterprise scalability.

> **Key Differentiator:** Unlike standard wallet apps, SmartWallet implements a double-entry **Transaction Ledger** to ensure 100% traceability and auditability of all financial movements, combined with **Circuit Breaker** patterns (Polly) to guarantee fault tolerance during third-party API outages.

## 📸 Application Previews

*A modern, Web3-inspired dark mode UI built with Next.js and TailwindCSS.*

<p align="center">
  <img src="./assets/images/mockup/compressed/hero.webp" width="48%" alt="Hero Section" />
  <img src="./assets/images/mockup/compressed/dashboard.webp" width="48%" alt="Dashboard" />
</p>
<p align="center">
  <img src="./assets/images/mockup/compressed/swap.webp" width="48%" alt="Swap Modal" />
  <img src="./assets/images/mockup/compressed/virtual-card.webp" width="48%" alt="Virtual Card" />
</p>
<p align="center">
  <img src="./assets/images/mockup/compressed/transactions.webp" width="48%" alt="Transactions" />
  <img src="./assets/images/mockup/compressed/swap-receipt.webp" width="48%" alt="Transaction Receipt" />
</p>

---

## 🌐 Live Demo & Deployment Note

**Frontend:** The UI is deployed on Vercel for visual showcase purposes.  
**Backend:** For security and performance reasons, the high-performance .NET backend is containerized (Docker + SQL Server). To experience the full functionality (login, transfers, ledger), the backend must be deployed locally using the instructions in the [Getting Started](#-getting-started) section.

---

## 🏗️ System Architecture

The solution implements a strict **Clean Architecture** pattern to decouple business rules from infrastructure and UI, ensuring maintainability and testability.

`mermaid
graph TD
    subgraph "Clients"
        UI[Web / Mobile Frontend]
    end

    subgraph "Presentation Layer (API)"
        Controllers[API Controllers]
        AuthMiddleware[JWT Auth Middleware]
        Swagger[Swagger / OpenAPI]
    end

    subgraph "Application Layer"
        Services[Business Services]
        CQRS[Transactions & Ledger Logic]
        Validators[FluentValidation]
    end

    subgraph "Domain Layer (Core)"
        Entities[Core Entities<br/>User, Wallet, Ledger]
        Interfaces[Repository Interfaces]
    end

    subgraph "Infrastructure Layer"
        EF[EF Core / Data Access]
        Polly[Polly Resiliency<br/>Circuit Breaker]
    end

    subgraph "External Services & Data"
        SQL[(SQL Server)]
        AKV[[Azure Key Vault]]
        FX[[FX Rate APIs]]
    end

    UI -- "HTTPS / REST" --> Controllers
    Controllers --> AuthMiddleware
    Controllers --> Services
    Services --> Validators
    Services --> CQRS
    CQRS --> Interfaces
    EF -. "Implements" .-> Interfaces
    Services --> EF
    EF --> SQL
    AuthMiddleware --> AKV
    Polly --> FX
    Services --> Polly

    classDef frontend fill:#f3f4f6,stroke:#374151,stroke-width:2px
    classDef api fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000
    classDef app fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#000
    classDef domain fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000
    classDef infra fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#000
    classDef external fill:#e5e7eb,stroke:#4b5563,stroke-width:2px,color:#000

    class UI frontend
    class Controllers,AuthMiddleware,Swagger api
    class Services,CQRS,Validators app
    class Entities,Interfaces domain
    class EF,Polly infra
    class SQL,AKV,FX external
`

### Layered Structure
* **SmartWallet.Domain**: The core. Contains Entities (User, Wallet, Transaction, Ledger), business rules, and repository interfaces. No external dependencies.
* **SmartWallet.Application**: Orchestrates use cases, services (AuthService, LedgerService), DTOs, and FluentValidation rules.
* **SmartWallet.Infrastructure**: Implements persistence with **EF Core**, SQL Server, Migrations, and external service integrations (Azure Key Vault).
* **SmartWallet.API**: RESTful entry point with Controllers, Middlewares, DI configuration, and Swagger documentation.

---

## 🛠️ Tech Stack & Patterns

| Category | Technologies |
|----------|--------------|
| **Core** | .NET 8, C#, ASP.NET Core Web API |
| **Data** | SQL Server, Azure SQL, Entity Framework Core (Code First) |
| **Patterns** | Clean Architecture, Repository, Unit of Work, CQRS (Basic), DTO/Mappers |
| **Security** | JWT Auth, Role-Based Access Control (RBAC), Azure Key Vault |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD) |
| **Docs** | Swagger/OpenAPI |
| **Resilience** | Polly (Retry & Circuit Breaker policies) |

---

## 🚀 Key Features

### 🔐 Security & Identity
* **Secure Authentication:** JWT implementation with custom claims.
* **User Management (Full CRUD):** Admin-level controls with pagination and soft-delete (IsActive flags).
* **Data Protection:** Password hashing (Salted) and strict validation rules. Secrets managed via **Azure Key Vault** in production.

### 💰 Financial Core
* **Zero-Loss Traceability:** Every transaction generates an immutable TransactionLedger record (Double-Entry Accounting) for reconciliation and auditing.
* **Transactional Integrity:** Unit of Work and ACID compliance for atomic operations on deposits, withdrawals, and transfers.
* **Multi-Wallet Support:** Users can manage multiple wallets simultaneously.

### ⚡ Performance & Scalability
* **Optimized Queries:** Database indexing on critical fields (Email, WalletId, TransactionId).
* **Pagination:** Implemented on all list endpoints (page, pageSize) to handle large datasets.
* **Async/Await:** Fully asynchronous architecture to handle high concurrency with minimal latency.

### 🌐 High Availability & Fault Tolerance
The system integrates with external providers (e.g., Dollar Exchange Rates API) and is architected to handle network instability using **Polly policies**:
- **Retry Pattern:** Automatically retries failed HTTP requests with exponential backoff logic.
- **Circuit Breaker:** Prevents the application from repeatedly trying to execute an operation that's likely to fail, preserving system resources.
- **Graceful Error Handling:** Catches critical failures and returns standardized 502 Bad Gateway responses.

---

## 📚 Deep Dive Documentation

For a detailed look into the core mechanics of the backend, refer to the internal documentation:
- [07 - Transaction Ledger Vertical](./backend/docs/07-transaction-ledger-vertical.md)
- [09 - Wallet Management](./backend/docs/09-wallet-management.md)

---

## 🔌 API Endpoints Overview

The API is secured using **JWT Bearer Tokens**. Authorization policies (SameUserOrAdmin) ensure data privacy, while specific administrative actions are restricted to the Admin role.

### 🔐 Authentication & Identity
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | /api/auth/login | Authenticate user and retrieve JWT Token. | Public |
| POST | /api/user/register | Register a new user account. | Public |
| POST | /api/user/create | Create a specialized Admin user. | **Admin** |

### 👤 User Management
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | /api/user | Retrieve all registered users. | **Admin** |
| GET | /api/user/{id} | Get user profile details. | Owner/Admin |
| GET | /api/user/by-email/{email} | Look up a user by their email address. | Owner/Admin |
| PUT | /api/user/{id} | Update user profile information. | Owner/Admin |
| PUT | /api/user/{id}/active | Toggle user activation status (Soft Delete/Ban). | **Admin** |

### 💰 Wallet Operations
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | /api/wallet | Create a new wallet for a specific user. | Owner/Admin |
| GET | /api/wallet/by-user/{userId} | List all wallets owned by a user. | Owner/Admin |
| GET | /api/wallet/by-alias/{alias} | Find a wallet using its unique CBU/Alias. | Owner/Admin |
| GET | /api/wallet/{id} | Get wallet balance and details. | Owner/Admin |

### 💸 Transactions & Movements
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | /api/transactions/deposits | Perform a cash-in operation. | User |
| POST | /api/transactions/withdrawals | Perform a cash-out operation. | User |
| POST | /api/transactions/transfers | Transfer funds between internal wallets. | User |
| GET | /api/transactions/wallet/{id} | Get transaction history for a specific wallet. | User |
| PATCH | /api/transactions/{id}/cancel | Force-cancel a transaction (Rollback scenario). | **Admin** |

### 📜 Financial Ledger (Auditing)
*Immutable records for accounting reconciliation.*
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | /api/transactionledgers/{id} | Retrieve a specific ledger entry. | **Admin** |
| GET | /api/transactionledgers/transaction/{txId} | Trace ledger entries for a specific transaction. | **Admin** |
| GET | /api/transactionledgers/range | Export ledger entries by date range. | **Admin** |

### 💱 Integrations (External APIs)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/dolares/{tipo} | Fetches real-time exchange rates from external providers. |

### 🔄 Transaction Lifecycle & Integrity
The following diagram illustrates the strict state machine governing financial movements, ensuring that the **Ledger** always reflects the final state of operations.

`mermaid
graph TD
    subgraph "Transaction State Machine"
        direction TB
        
        %% Definition of Nodes
        Init((Start)) --> Created[Created / Pending]
        Created --> Validate{Validations}
        
        %% Paths
        Validate -- "Funds & Rules OK" --> Completed[Completed]
        Validate -- "Insufficient Funds" --> Failed[Failed]
        Created -- "Admin Cancellation" --> Canceled[Canceled]

        %% Ledger Impact
        Completed -.->|Commit Record| Ledger[(Transaction<br/>Ledger)]
        Failed -.->|Audit Log| Ledger
        Canceled -.->|Audit Log| Ledger
    end

    %% Styling for Aesthetic Impact
    classDef green fill:#e6fffa,stroke:#28a745,stroke-width:2px,color:#155724;
    classDef red fill:#ffe6e6,stroke:#dc3545,stroke-width:2px,color:#721c24;
    classDef blue fill:#e7f5ff,stroke:#007bff,stroke-width:2px,color:#004085;
    classDef database fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#856404;

    %% Applying Styles
    class Completed green;
    class Failed,Canceled red;
    class Created,Validate blue;
    class Ledger database;
`

## 🐳 Getting Started

### Prerequisites
- .NET 8 SDK
- Docker Desktop
- SQL Server Management Studio (Optional)

### Run with Docker (Recommended)
The project includes a docker-compose.yml for instant setup of the API and SQL Server.

`ash
# 1. Clone the repository
git clone https://github.com/your-username/smart-wallet.git

# 2. Navigate to directory
cd smart-wallet

# 3. Build and Run
docker-compose up -d --build
`

Access the API documentation at: http://localhost:8080/swagger (Port may vary based on your config).

---

## 🤝 Contribution & License

This project was developed as a Capstone Project for the University Technician in Programming (UTN) degree. Contributions are welcome. Please open an issue to discuss proposed changes.

---

Developed by: m 4 l c o m - Backend Developer (.NET)
