# Courier Integration Platform

A scalable multi-courier backend integration platform built using Node.js, Express.js, MongoDB, Redis (Memurai), and BullMQ.

The system provides a unified courier-agnostic API layer for integrating multiple courier partners such as:

- UrbaneBolt
- Delhivery (future)
- Shiprocket (future)
- Bluedart (future)
- DTDC (future)

The current implementation includes:
- Real UrbaneBolt integration
- Mock courier integration
- Queue-based bulk processing
- Background workers
- MongoDB persistence
- Retry-safe architecture

---

# Features

## Unified Courier APIs

Expose a single normalized API regardless of courier partner.

Supported APIs:

- Create Order
- Bulk Order Creation
- Track Shipment
- Cancel Shipment

---

## Pluggable Courier Architecture

Implemented using:
- Adapter Pattern
- Factory Pattern

Adding a new courier requires:
- Creating a new adapter only
- No controller/service modifications

---

## Async Bulk Processing

Bulk orders are processed using:
- BullMQ
- Redis/Memurai
- Background workers

Benefits:
- Non-blocking APIs
- Better scalability
- Retry support
- Partial failure handling

---

## Persistence

MongoDB stores:
- Orders
- Courier responses
- Shipment statuses
- Tracking history
- Audit payloads

---

# Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Database | MongoDB |
| Queue | BullMQ |
| Redis | Memurai |
| ODM | Mongoose |
| HTTP Client | Axios |
| Validation | Joi |

---

# Project Structure

```bash
courier-integration-platform/
│
├── docs/
│   ├── Documentation.docx
├── postman/
│   ├── collection.json
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── couriers/
│   │   ├── courier.factory.js
│   │   │
│   │   ├── mock/
│   │   │   └── mock.adapter.js
│   │   │
│   │   └── urbanebolt/
│   │       ├── urbanebolt.adapter.js
│   │       ├── urbanebolt.client.js
│   │       └── urbanebolt.mapper.js
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── order.model.js
│   │   └── tracking.model.js
│   │
│   ├── orders/
│   │   ├── order.controller.js
│   │   ├── order.routes.js
│   │   ├── order.service.js
│   │   └── order.validation.js
│   │
│   ├── queues/
│   │   ├── order.queue.js
│   │   └── order.worker.js
│   │
│   ├── test/
│   │   ├── test-auth.js
│   │   ├── test-create-order.js
│   │   └── test-endpoints.js
│   │
│   └── utils/
│       ├── apiError.js
│       └── asyncHandler.js
│
├── .env
├── package.json
├── README.md
└── DESIGN.md
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/courier

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

UB_BASE_URL=https://uat.urbanebolt.in/api/v1

UB_USERNAME=info@urbanebolt.com
UB_PASSWORD=EKIcygsLVV5RCtPZ
```

---

# Windows Setup Guide

## Step 1: Install Node.js

Download:
https://nodejs.org

Recommended:
- Node.js v18+

Verify:

```bash
node -v
npm -v
```

---

## Step 2: Install MongoDB

Download:
https://www.mongodb.com/try/download/community

Install MongoDB Community Edition.

Start MongoDB:

```bash
net start MongoDB
```

Verify:

```bash
mongosh
```

---

## Step 3: Install Memurai (Redis for Windows)

Download:
https://www.memurai.com/get-memurai

Install Memurai Developer Edition.

Start Memurai:

```bash
net start Memurai
```

Verify:

```bash
memurai-cli ping
```

Expected:

```bash
PONG
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd courier-integration-platform
```

---

## Install Dependencies

```bash
npm install
```

---

# Running the Application

## Terminal 1 — Start Backend

```bash
npm run dev
```

Expected:

```bash
MongoDB connected
Server running on 3000
```

---

## Terminal 2 — Start Worker

```bash
npm run worker
```

Expected:

```bash
Worker started
```

---

# API Endpoints

---

# Create Order

## Endpoint

```http
POST /api/v1/orders
```

## Sample Payload

```json
{
  "orderId": "ORD1001",
  "courierPartner": "urbanebolt",

  "customerName": "Roshan Kumar",
  "customerPhone": 9999999999,

  "deliveryAddress": "Delhi Sector 21",
  "deliveryCity": "Delhi",
  "deliveryState": "DL",
  "deliveryPincode": 110001,

  "paymentType": "COD",
  "collectableValue": 100
}
```

---

# Bulk Orders

## Endpoint

```http
POST /api/v1/orders/bulk
```

## Sample Payload

```json
{
  "orders": [
    {
      "orderId": "ORD2001",
      "courierPartner": "mock",
      "pickupAddress": "A",
      "deliveryAddress": "B"
    },
    {
      "orderId": "ORD2002",
      "courierPartner": "urbanebolt",
      "customerName": "Roshan",
      "customerPhone": 9999999999,
      "deliveryAddress": "Delhi",
      "paymentType": "COD",
      "collectableValue": 100
    }
  ]
}
```

---

# Track Shipment

## Endpoint

```http
GET /api/v1/orders/:orderId/track
```

---

# Cancel Shipment

## Endpoint

```http
POST /api/v1/orders/:orderId/cancel
```

---

# Design Patterns Used

## Adapter Pattern

Each courier implements a standardized interface.

Example:
- createOrder()
- trackOrder()
- cancelOrder()

Benefits:
- Extensible
- Clean separation
- Easy maintenance

---

## Factory Pattern

CourierFactory dynamically returns the correct courier adapter.

Benefits:
- Decoupled architecture
- Open/Closed Principle
- Future scalability

---

# Error Handling

Implemented:
- Validation errors
- Courier API errors
- Retry-safe processing
- Automatic token refresh
- Queue failure handling

Normalized error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload"
  }
}
```

---

# Retry Strategy

BullMQ retry configuration:

```js
attempts: 3,
backoff: {
  type: 'exponential',
  delay: 5000
}
```

---

# How to Add a New Courier

## Step 1

Create new adapter:

```bash
src/couriers/delhivery/delhivery.adapter.js
```

---

## Step 2

Implement methods:

```js
createOrder()
trackOrder()
cancelOrder()
```

---

## Step 3

Register in:

```bash
courier.factory.js
```

No controller/service changes required.

---

# Future Improvements

- Swagger/OpenAPI docs
- Docker support
- Kubernetes deployment
- Structured logging
- Webhook ingestion
- Distributed tracing
- Metrics and monitoring
- Circuit breaker
- Dead-letter queues

---

# Assumptions

- UrbaneBolt UAT APIs remain stable.
- Redis/Memurai is available locally.
- MongoDB is running locally.
- Shipment statuses are courier-controlled.

---

# Author

Roshan Kumar