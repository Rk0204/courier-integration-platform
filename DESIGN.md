# System Design — Courier Integration Platform

---

# 1. Overview

The Courier Integration Platform is a scalable backend system designed to integrate multiple courier partners behind a unified API abstraction layer.

The system allows clients to:
- Create shipments
- Process bulk shipments asynchronously
- Track shipments
- Cancel shipments

without worrying about courier-specific implementations.

The platform is designed for:
- Scalability
- Extensibility
- Fault tolerance
- Async processing
- Enterprise-grade integrations

---

# 2. Goals

The primary goals of the system are:

- Unified courier-agnostic APIs
- Easy onboarding of new courier providers
- High-throughput bulk processing
- Reliable async architecture
- Retry-safe processing
- Extensible modular design

---

# 3. High-Level Architecture

```text
                Client / Frontend
                        |
                        v
               Express API Layer
                        |
        --------------------------------
        |                              |
        v                              v
  Order Service                BullMQ Queue
        |                              |
        |                              v
        |                       Redis/Memurai
        |                              |
        |                              v
        |                        Worker Process
        |                              |
        --------------------------------
                        |
                        v
                Courier Factory
                        |
        --------------------------------
        |                              |
        v                              v
   Mock Adapter                UrbaneBolt Adapter
                                       |
                                       v
                           UrbaneBolt External APIs
                                       |
                                       v
                                   MongoDB
```

---

# 4. Architecture Explanation

---

## API Layer

Built using:
- Express.js

Responsibilities:
- Request handling
- Validation
- Error normalization
- Routing

---

## Service Layer

Responsibilities:
- Business logic
- Idempotency checks
- Courier selection
- Database operations

---

## Queue Layer

Implemented using:
- BullMQ
- Redis/Memurai

Responsibilities:
- Async order processing
- Bulk order handling
- Retry handling
- Worker decoupling

---

## Worker Layer

Background workers consume queue jobs and:
- Process orders
- Call courier adapters
- Persist responses
- Update statuses

This prevents API blocking during bulk operations.

---

## Courier Layer

Implemented using:
- Adapter Pattern
- Factory Pattern

Each courier implements:
- createOrder()
- trackOrder()
- cancelOrder()

Benefits:
- Easy extensibility
- Decoupled integrations
- Cleaner codebase

---

## Database Layer

MongoDB is used for:
- Orders
- Shipment metadata
- Courier responses
- Tracking history
- Audit records

---

# 5. Design Patterns Used

---

# Adapter Pattern

Each courier integration is isolated behind a common interface.

Example:

```js
createOrder()
trackOrder()
cancelOrder()
```

Benefits:
- Easy integration onboarding
- Separation of concerns
- Replaceable courier implementations

---

# Factory Pattern

CourierFactory dynamically returns the correct adapter.

Example:

```js
CourierFactory.getAdapter('urbanebolt')
```

Benefits:
- Open/Closed Principle
- Cleaner service layer
- Extensible architecture

---

# Queue-Based Processing

Implemented using BullMQ.

Benefits:
- Async processing
- Better throughput
- Retry support
- Scalable worker architecture

---

# 6. Bulk Processing Design

Bulk APIs immediately return:

```json
{
  "batchId": "123456"
}
```

Orders are pushed into BullMQ queues.

Workers process orders asynchronously.

Benefits:
- Non-blocking APIs
- Better responsiveness
- Supports high concurrency
- Horizontal scalability

---

# 7. Idempotency Strategy

To prevent duplicate shipment creation:

- `orderId` is unique in MongoDB
- Existing orders are checked before processing

Example:

```js
const existing = await Order.findOne({
  orderId: payload.orderId
});
```

Benefits:
- Prevents duplicate courier calls
- Retry-safe architecture

---

# 8. Error Handling Strategy

The platform normalizes all errors into a common format.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

---

# Error Categories

| Type | Example |
|---|---|
| Validation Errors | Missing fields |
| Courier Errors | Invalid pincode |
| Network Errors | Timeout |
| Queue Errors | Redis unavailable |
| Database Errors | Duplicate order |

---

# 9. Retry Strategy

BullMQ retries failed jobs automatically.

Configuration:

```js
attempts: 3,
backoff: {
  type: 'exponential',
  delay: 5000
}
```

Benefits:
- Resilience
- Reduced transient failures
- Automatic recovery

---

# 10. Token Refresh Strategy

Courier auth tokens are cached in memory.

On receiving:
```http
401 Unauthorized
```

System automatically:
1. Re-authenticates
2. Generates new token
3. Retries request once

Benefits:
- Better reliability
- Reduced downtime

---

# 11. Tracking History Design

Tracking updates are append-only.

Every status update creates a new tracking document.

Example:

```json
{
  "orderId": "ORD1001",
  "status": "IN_TRANSIT",
  "timestamp": "2026-05-07T10:00:00Z"
}
```

Benefits:
- Auditability
- Shipment lifecycle visibility
- Historical tracking

---

# 12. Scalability Considerations

---

# Horizontal Scaling

Supported because:
- Stateless APIs
- Redis distributed queues
- Independent workers

Multiple API servers and workers can run simultaneously.

---

# Queue Scalability

BullMQ supports:
- Multiple workers
- Concurrent consumers
- Retry jobs
- Delayed jobs

---

# Database Scalability

MongoDB supports:
- High write throughput
- Flexible schemas
- Horizontal scaling

Indexes are added on:
- orderId
- batchId
- tracking status

---

# 13. Security Considerations

Implemented:
- Environment-based secrets
- Token authentication
- Validation middleware
- Error sanitization

Future improvements:
- JWT authentication
- Rate limiting
- API Gateway
- IP whitelisting

---

# 14. Logging Strategy

Structured logs contain:
- orderId
- courierPartner
- requestId
- API response
- worker failures

Benefits:
- Easier debugging
- Traceability
- Monitoring support

---

# 15. Assumptions

- Courier APIs are stable.
- Redis/Memurai is available.
- MongoDB runs locally.
- UAT credentials are valid.

---

# 16. Tradeoffs

---

## Why BullMQ?

Chosen because:
- Redis-backed
- Reliable
- Retry support
- Production-ready

Alternative:
- RabbitMQ
- Kafka

---

## Why MongoDB?

Chosen because:
- Flexible courier schemas
- Easy nested payload storage
- High write throughput

Alternative:
- PostgreSQL

---

## Why Adapter Pattern?

Because courier APIs differ heavily.

Adapters isolate:
- Payload mapping
- Error handling
- Authentication logic

---

# 17. Future Improvements

- Docker support
- Kubernetes deployment
- Swagger/OpenAPI
- Metrics dashboards
- Distributed tracing
- Webhook ingestion
- Circuit breaker
- Dead-letter queues
- Prometheus/Grafana monitoring

---

# 18. Final Outcome

Successfully implemented:

- Unified courier APIs
- Real UrbaneBolt integration
- Mock courier integration
- Queue-based bulk processing
- Worker architecture
- MongoDB persistence
- Retry-safe processing
- Extensible adapter-based design

The system is production-oriented and scalable for enterprise logistics integrations.