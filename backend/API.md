# API Documentation

## Base URL

**Development:** `http://localhost:5000`
**Production:** `https://your-backend.onrender.com`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Health Check

#### GET /health

Check if server is running.

**Access:** Public

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Register User

#### POST /api/auth/register

Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- **400:** Missing required fields
- **400:** User already exists

---

### Login

#### POST /api/auth/login

Authenticate existing user.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- **400:** Missing email or password
- **401:** Invalid credentials

---

### Get Current User

#### GET /api/auth/me

Get authenticated user's information.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Chat Endpoints (Multi-Agent System)

### Send Message

#### POST /api/chat

Send a message to the multi-agent system. The router will determine which specialist agent handles the request.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "Book flight AA101 for John Doe on Feb 15th"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "reply": "✅ Booking confirmed!\n\nFlight: American Airlines AA101\nRoute: JFK → LAX\nDeparture: 2/15/2024, 8:00:00 AM\nPassenger: John Doe\nConfirmation Number: BK-A1B2C3\n\nYour booking has been successfully created.",
  "agentType": "booking",
  "bookingData": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "confirmationNumber": "BK-A1B2C3",
    "flightNumber": "AA101",
    "passengerName": "John Doe",
    "status": "confirmed",
    ...
  }
}
```

**Agent Routing Examples:**

| User Message | Agent Type | Action |
|--------------|------------|--------|
| "Book flight AA101 for John Doe" | `booking` | Creates new booking |
| "What's the status of BK-ABC123?" | `status` | Checks booking status |
| "Cancel my reservation BK-ABC123" | `cancellation` | Cancels booking |
| "Hello" | `unclear` | Returns clarification message |

---

### Get Agent Status

#### GET /api/chat/status

Get the status of the multi-agent system.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "agents": ["router", "booking", "status", "cancellation"],
  "status": "operational"
}
```

---

## Booking Endpoints

### Get All Bookings

#### GET /api/bookings

Get all bookings for the authenticated user.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "bookings": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "userId": "60d5ec49f1b2c72b8c8e4f1b",
      "flightNumber": "AA101",
      "confirmationNumber": "BK-A1B2C3",
      "status": "confirmed",
      "passengerName": "John Doe",
      "passengerEmail": "john@example.com",
      "bookingDate": "2024-01-15T10:30:00.000Z",
      "travelDate": "2024-02-15T08:00:00.000Z"
    },
    ...
  ]
}
```

---

### Get Booking by ID

#### GET /api/bookings/:id

Get a specific booking by its ID.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Booking ID

**Success Response (200):**
```json
{
  "success": true,
  "booking": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "userId": "60d5ec49f1b2c72b8c8e4f1b",
    "flightNumber": "AA101",
    "confirmationNumber": "BK-A1B2C3",
    "status": "confirmed",
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "bookingDate": "2024-01-15T10:30:00.000Z",
    "travelDate": "2024-02-15T08:00:00.000Z"
  },
  "flight": {
    "flightNumber": "AA101",
    "airline": "American Airlines",
    "origin": "JFK",
    "destination": "LAX",
    "departureTime": "2024-02-15T08:00:00.000Z",
    "arrivalTime": "2024-02-15T11:30:00.000Z",
    "status": "on-time",
    "price": 350
  }
}
```

**Error Responses:**
- **404:** Booking not found

---

### Get Booking by Confirmation Number

#### GET /api/bookings/confirmation/:confirmationNumber

Get a booking by its confirmation number.

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `confirmationNumber` - Booking confirmation number (e.g., "BK-A1B2C3")

**Success Response (200):**
```json
{
  "success": true,
  "booking": { ... },
  "flight": { ... }
}
```

**Error Responses:**
- **404:** Booking not found

---

## Flight Endpoints

### Get All Flights

#### GET /api/flights

Get all available flights with optional filtering.

**Access:** Public

**Query Parameters:**
- `origin` (optional) - Filter by origin airport (e.g., "JFK")
- `destination` (optional) - Filter by destination airport (e.g., "LAX")
- `status` (optional) - Filter by status ("on-time", "delayed", "cancelled")

**Example Request:**
```
GET /api/flights?origin=JFK&destination=LAX&status=on-time
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "flights": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "flightNumber": "AA101",
      "airline": "American Airlines",
      "origin": "JFK",
      "destination": "LAX",
      "departureTime": "2024-02-15T08:00:00.000Z",
      "arrivalTime": "2024-02-15T11:30:00.000Z",
      "status": "on-time",
      "price": 350,
      "availableSeats": 150
    },
    ...
  ]
}
```

---

### Get Flight by Number

#### GET /api/flights/:flightNumber

Get a specific flight by its flight number.

**Access:** Public

**URL Parameters:**
- `flightNumber` - Flight number (e.g., "AA101")

**Success Response (200):**
```json
{
  "success": true,
  "flight": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "flightNumber": "AA101",
    "airline": "American Airlines",
    "origin": "JFK",
    "destination": "LAX",
    "departureTime": "2024-02-15T08:00:00.000Z",
    "arrivalTime": "2024-02-15T11:30:00.000Z",
    "status": "on-time",
    "price": 350,
    "availableSeats": 150
  }
}
```

**Error Responses:**
- **404:** Flight not found

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes

- **200:** Success
- **201:** Created
- **400:** Bad Request (validation error)
- **401:** Unauthorized (authentication required)
- **404:** Not Found
- **500:** Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. May be added in production.

---

## CORS

The API allows requests from the configured `CORS_ORIGIN` (frontend URL).

Development: `http://localhost:3000`
Production: Your Vercel URL
