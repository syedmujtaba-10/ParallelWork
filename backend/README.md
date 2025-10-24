# Flight Booking Backend - Multi-Agent System

Express.js backend with LangGraph orchestration and 4 specialized OpenAI agents for intelligent flight booking management.

## Architecture

### Multi-Agent System

1. **Router Agent** - Analyzes user intent and routes to appropriate specialist
2. **Booking Agent** - Creates flight bookings with duplicate detection
3. **Status Agent** - Retrieves flight and booking status information
4. **Cancellation Agent** - Handles booking cancellations

### Tech Stack

- **Framework:** Express.js with TypeScript
- **AI:** LangGraph + OpenAI GPT-4
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flight-booking
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=sk-your-openai-api-key-here
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Chat (Multi-Agent Interface)

#### Send Message to Agents
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Book flight AA101 for John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Booking confirmed! Flight: American Airlines AA101...",
  "agentType": "booking",
  "bookingData": {
    "confirmationNumber": "BK-ABC123",
    "flightNumber": "AA101",
    ...
  }
}
```

**Example Messages:**
- "Book flight AA101 for John Doe on Feb 15th"
- "What's the status of my booking BK-ABC123?"
- "Cancel my reservation BK-ABC123"
- "Check flight AA101"

#### Get Agent Status
```http
GET /api/chat/status
Authorization: Bearer <token>
```

### Bookings

#### Get All User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

#### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

#### Get Booking by Confirmation Number
```http
GET /api/bookings/confirmation/:confirmationNumber
Authorization: Bearer <token>
```

### Flights

#### Get All Flights
```http
GET /api/flights?origin=JFK&destination=LAX&status=on-time
```

**Query Parameters:**
- `origin` (optional) - Airport code (e.g., "JFK")
- `destination` (optional) - Airport code (e.g., "LAX")
- `status` (optional) - "on-time", "delayed", or "cancelled"

#### Get Flight by Flight Number
```http
GET /api/flights/:flightNumber
```

## Agent Behavior

### Router Agent

Analyzes user messages and determines intent:

```
"Book flight AA101" → routes to Booking Agent
"Check my booking" → routes to Status Agent
"Cancel BK-ABC123" → routes to Cancellation Agent
"Hello" → returns clarification message
```

### Booking Agent

1. Extracts: flight number, passenger name, email, date
2. Validates flight exists
3. Checks for duplicate bookings (same user + same flight)
4. Creates booking if no duplicate
5. Returns confirmation number

**Duplicate Prevention:** Users cannot book the same flight twice

### Status Agent

1. Accepts: confirmation number OR flight number
2. Retrieves booking/flight information
3. Returns formatted status with details

### Cancellation Agent

1. Accepts: confirmation number OR flight number
2. Finds user's booking
3. Updates status to "cancelled"
4. Returns cancellation confirmation

## Database Models

### User
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  createdAt: Date
}
```

### Flight
```typescript
{
  flightNumber: string (unique, required)
  airline: string (required)
  origin: string (required)
  destination: string (required)
  departureTime: Date (required)
  arrivalTime: Date (required)
  status: "on-time" | "delayed" | "cancelled"
  price: number (required)
  availableSeats: number
}
```

### Booking
```typescript
{
  userId: ObjectId (ref: User, required)
  flightNumber: string (required)
  confirmationNumber: string (unique, auto-generated)
  status: "confirmed" | "cancelled"
  passengerName: string (required)
  passengerEmail: string (required)
  bookingDate: Date (default: now)
  travelDate: Date (required)
}
```

**Indexes:**
- User: email (unique)
- Flight: flightNumber (unique)
- Booking: userId + flightNumber (compound, duplicate prevention)
- Booking: confirmationNumber (unique)

## Development

### Project Structure

```
/backend
  /src
    /agents           # LangGraph agents
      routerAgent.ts
      bookingAgent.ts
      statusAgent.ts
      cancellationAgent.ts
      graphOrchestrator.ts
    /config           # Configuration
      database.ts
    /middleware       # Express middleware
      auth.ts
    /models           # Mongoose models
      User.ts
      Flight.ts
      Booking.ts
    /routes           # API routes
      auth.ts
      chat.ts
      bookings.ts
      flights.ts
    server.ts         # Main entry point
  .env
  .env.example
  tsconfig.json
  package.json
```

### Scripts

```bash
npm run dev     # Start development server (with nodemon)
npm run build   # Compile TypeScript to JavaScript
npm start       # Start production server
```

### Testing

**Manual Testing:**

1. Register a user:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. Login and get token:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. Chat with agents:
   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message":"Book flight AA101 for John Doe"}'
   ```

## Deployment (Render)

### Build Command
```bash
npm install && npm run build
```

### Start Command
```bash
npm start
```

### Environment Variables

Set these in Render dashboard:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key for JWT
- `OPENAI_API_KEY` - Your OpenAI API key
- `CORS_ORIGIN` - Frontend URL (Vercel)
- `NODE_ENV=production`

## Troubleshooting

### MongoDB Connection Issues

1. Check `MONGODB_URI` is correct
2. For Atlas: Ensure IP whitelist includes 0.0.0.0/0
3. Check network access in Atlas dashboard

### OpenAI API Errors

1. Verify `OPENAI_API_KEY` is set correctly
2. Check API quota/billing on OpenAI dashboard
3. Ensure GPT-4 access is enabled

### CORS Errors

1. Set `CORS_ORIGIN` to frontend URL
2. For development: `http://localhost:3000`
3. For production: Your Vercel URL

## License

MIT
