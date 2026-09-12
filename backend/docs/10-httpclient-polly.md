# ADR 010: External API Integrations & Resilience Patterns

**Status:** Accepted  
**Type:** Architecture Decision Record

## Context
SmartWallet relies on external providers, such as the DolarApi, to fetch real-time currency exchange rates. External networks are inherently unreliable. Without fault tolerance, a timeout from the DolarApi would cause our internal threads to block, potentially leading to Thread Pool Starvation and cascading system failures.

## Decision
We integrated **Polly**, a .NET resilience and transient-fault-handling library, directly into our HttpClient factory registrations.

## Implementation Details
### 1. Exponential Backoff Retry Policy
- **Logic:** If an external request fails due to a transient error (e.g., HTTP 500, Timeout), Polly will automatically retry the request up to 3 times.
- **Backoff:** The wait time between retries grows exponentially (e.g., 2s, 4s, 8s). This prevents our system from hammering an already struggling external server.

### 2. Circuit Breaker Policy
- **Logic:** If the external API fails consecutively beyond a threshold (e.g., 5 times), the Circuit Breaker "Trips" (opens).
- **Behavior:** While open, all subsequent requests to that API fail immediately without attempting a network call. This saves internal resources and allows the external system time to recover.
- **Recovery:** After a set duration (e.g., 30 seconds), the circuit allows a "half-open" test request. If successful, the circuit closes, and normal operations resume.

### 3. Configuration via \IOptions\
- All Polly parameters (RetryCount, CircuitBreakerDurationSeconds) are bound strongly-typed via ppsettings.json, allowing DevOps to tweak resiliency thresholds without recompiling the application.

## Consequences
- **Positive:** Massive improvement in system stability. The backend will never crash due to a third-party outage.
- **Negative:** Requires careful tuning of timeout thresholds to avoid false positives.
