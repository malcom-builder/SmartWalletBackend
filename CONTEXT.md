# CONTEXT.md — SmartWallet

> Memoria local del repositorio y documentación del contexto técnico, arquitectura y stack del proyecto.

## 01 — Overview del Proyecto

- **Cliente / Proyecto:** SmartWallet
- **Tipo:** Backend API
- **Descripción:** Sistema de gestión de billeteras virtuales, usuarios, registro de transacciones (Ledger) y consulta de cotización de moneda extranjera.

## 02 — Arquitectura y Stack Técnico

- **Framework Core:** .NET 8 (C#)
- **Arquitectura:** Clean Architecture
- **Persistencia:** Entity Framework Core 8 (SQL Server / SQLite)
- **Autenticación & Seguridad:** JWT (JSON Web Tokens) + Autorización por Políticas y Roles (SameUserOrAdmin).
- **Documentación API:** OpenAPI via Swashbuckle + Interfaz gráfica **Scalar** (Tema: DeepSpace).
- **Resiliencia & Llamadas Externas:** Uso de **Polly** (Retry & Circuit Breaker) para el consumo de la DolarApi vía `HttpClient`.

## 03 — Capas del Sistema (Clean Architecture)

1. **SmartWallet.Domain:** 
   - Entidades núcleo del negocio (`User`, `Wallet`, `Transaction`, `TransactionLedger`).
   - Lógica de dominio encapsulada y Enums (`UserRole`, `CurrencyCode`).
2. **Contracts:** 
   - DTOs para Request y Response (ej. `UserRegisterRequest`, `LoginRequest`).
3. **SmartWallet.Application:** 
   - Abstracciones de Repositorios y Servicios (`IUserRepository`, `IWalletService`, `IAuthenticationService`).
   - Implementación de casos de uso (Servicios directos sin MediatR temporalmente).
4. **SmartWallet.Infrastructure:** 
   - Contexto de Base de Datos (`SmartWalletDbContext`) y configuraciones de EF Core.
   - Implementaciones concretas de Repositorios y Servicios Externos (DolarAPI, Autenticación JWT).
   - Métodos de extensión para Inyección de Dependencias centralizada (`DependencyInjection`).
5. **SmartWallet.API:** 
   - Controladores RESTful.
   - Configuración del pipeline y middleware de la aplicación en `Program.cs`.

## 04 — Decisiones Técnicas y Estado Actual

- El sistema no cuenta aún con un middleware de manejo global de excepciones.
- Las contraseñas están siendo procesadas en texto plano en la capa de servicios (requiere mitigación urgente con Hashing, ej. BCrypt).
- El mapeo de entidades a DTOs se maneja de forma manual en los servicios.
- No se ha implementado FluentValidation ni validaciones complejas fuera de los DataAnnotations del modelo.

## 05 — Log de Intervenciones (LIFO)
- **Septiembre 2026:** Rediseño integral del frontend (Dashboard y Modales).
  - Implementación de la estética monocromática minimalista (Deep Obsidian & Pure White) en toda la UI del Dashboard.
  - Refactorización de layout, corrigiendo alineaciones de flexbox (evitando encogimiento del Header con `shrink-0`) y estabilizando el canvas de fondo mediante tarjetas opacas `#0a0a0a`.
  - Rediseño de la Smart Card a formato vertical inmersivo (`aspect-[1/1.586]`), resolviendo desbordamiento de números, superposición del logo con el CVV, y vinculando correctamente el endpoint de usuario (`/User/{id}`).
  - Compactación extrema de modales transaccionales (Send, Receive, Swap) para encaje perfecto sin scroll vertical en laptops, y ocultamiento global de spin buttons en inputs numéricos.

- **Agosto 2026:** Refactorización arquitectónica y de seguridad integral tras auditoría (`/new-project`).
  - Migración al patrón **CQRS con MediatR** en el 100% de la aplicación, eliminando servicios monolíticos.
  - Integración de **FluentValidation** para la validación automática de contratos/DTOs.
  - Implementación de **Mapster** automatizando el mapeo de Entidades a DTOs.
  - Configuración del **Manejo Global de Excepciones** (`IExceptionHandler` + `ProblemDetails`).
  - Hashing seguro de contraseñas con **BCrypt.Net-Next**, resolviendo vulnerabilidad crítica.

