# Claude 1 Todo List - Backend & Multi-Agent System

**Responsibility:** Express.js backend, LangGraph orchestration, 4 OpenAI agents

**Working Directory:** `/backend`

---

## 🚀 Phase 1: Project Initialization

- [ ] Initialize Node.js project
  ```bash
  cd backend
  npm init -y
  ```

- [ ] Install core dependencies
  ```bash
  npm install express cors dotenv jsonwebtoken bcryptjs mongoose
  npm install @langchain/core @langchain/openai langgraph
  ```

- [ ] Install TypeScript & dev dependencies
  ```bash
  npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node nodemon
  ```

- [ ] Initialize TypeScript configuration
  ```bash
  npx tsc --init
  ```

- [ ] Configure `tsconfig.json`
  - Set `"outDir": "./dist"`
  - Set `"rootDir": "./src"`
  - Enable `"esModuleInterop": true`
  - Set `"target": "ES2020"`

- [ ] Create folder structure
  ```
  /backend
    /src
      /agents         # LangGraph agents
      /models         # MongoDB models
      /routes         # Express routes
      /middleware     # Auth & validation
      /utils          # Helper functions
      /config         # Configuration files
      server.ts       # Main entry point
    .env.example
    .env
  ```

- [ ] Create `.env.example` file with required variables
  ```
  PORT=5000
  MONGODB_URI=
  JWT_SECRET=
  OPENAI_API_KEY=
  CORS_ORIGIN=http://localhost:3000
  NODE_ENV=development
  ```

- [ ] Update `package.json` scripts
  ```json
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
  ```

---

## 🗄️ Phase 2: Database Models & Connection

- [ ] Create MongoDB connection utility (`src/config/database.ts`)
  - Connection string from env
  - Error handling
  - Connection pooling

- [ ] Create User model (`src/models/User.ts`)
  - Fields: email, password (hashed), name, createdAt
  - Password hashing methods
  - JWT token generation method

- [ ] Create Flight model (`src/models/Flight.ts`)
  - Fields: flightNumber, airline, origin, destination, departureTime, arrivalTime, status, price
  - Validation

- [ ] Create Booking model (`src/models/Booking.ts`)
  - Fields: userId, flightNumber, confirmationNumber, status, passengerName, bookingDate
  - Reference to User
  - Unique confirmation number generation
  - Index on userId + flightNumber for duplicate prevention

---

## 🔐 Phase 3: Authentication System

- [ ] Create auth middleware (`src/middleware/auth.ts`)
  - JWT verification
  - Extract user from token
  - Protect routes

- [ ] Create auth routes (`src/routes/auth.ts`)
  - POST `/api/auth/register` - User registration
  - POST `/api/auth/login` - User login
  - GET `/api/auth/me` - Get current user

- [ ] Implement password hashing (bcrypt)

- [ ] Implement JWT token generation and verification

---

## 🤖 Phase 4: LangGraph Multi-Agent System

### Router Agent (Agent 0)
- [ ] Create `src/agents/routerAgent.ts`
  - Analyze user intent
  - Route to: BookingAgent, StatusAgent, or CancellationAgent
  - Handle unclear queries with clarification
  - OpenAI function calling for intent detection

### Booking Agent (Agent 1)
- [ ] Create `src/agents/bookingAgent.ts`
  - Extract: flightNumber, passengerName, date
  - Check if booking already exists for user
  - Verify flight exists in database
  - Create new booking if no duplicate
  - Generate confirmation number
  - Return booking details

- [ ] Implement duplicate detection logic
  - Query: same userId + flightNumber
  - Inform user if duplicate found

### Status Agent (Agent 2)
- [ ] Create `src/agents/statusAgent.ts`
  - Extract: confirmationNumber OR flightNumber
  - Look up booking by confirmationNumber
  - Return: booking status, flight details, confirmation number
  - Handle not found cases

### Cancellation Agent (Agent 3)
- [ ] Create `src/agents/cancellationAgent.ts`
  - Extract: confirmationNumber OR flightNumber
  - Find booking for user
  - Update booking status to "cancelled"
  - Return confirmation of cancellation
  - Handle not found cases

### LangGraph Orchestration
- [ ] Create `src/agents/graphOrchestrator.ts`
  - Define agent nodes
  - Define edges (routing logic)
  - Compile graph
  - Create execution function

- [ ] Implement state management
  - Message history
  - Current agent
  - User context (userId)
  - Extracted entities

- [ ] Create agent tools
  - Database query tools
  - Booking creation tool
  - Booking update tool
  - Flight lookup tool

---

## 🛣️ Phase 5: API Routes

- [ ] Create chat route (`src/routes/chat.ts`)
  - POST `/api/chat` - Send message to agent system
  - Middleware: authenticate user
  - Body: { message: string }
  - Response: { reply: string, bookingData?: object }

- [ ] Create booking routes (`src/routes/bookings.ts`)
  - GET `/api/bookings` - Get user's bookings
  - GET `/api/bookings/:id` - Get specific booking
  - GET `/api/bookings/confirmation/:confirmationNumber` - Get by confirmation

- [ ] Create flight routes (`src/routes/flights.ts`)
  - GET `/api/flights` - List available flights
  - GET `/api/flights/:flightNumber` - Get flight details

---

## 🔧 Phase 6: Server Setup & Configuration

- [ ] Create main server file (`src/server.ts`)
  - Initialize Express app
  - Configure middleware (CORS, JSON parser)
  - Connect to MongoDB
  - Mount routes
  - Error handling middleware
  - Start server

- [ ] Configure CORS
  - Allow frontend origin from env
  - Credentials support

- [ ] Add request logging (morgan or custom)

- [ ] Add error handling middleware
  - Catch async errors
  - Format error responses
  - Log errors

- [ ] Create shared types (`../shared/types.ts`)
  - User interface
  - Booking interface
  - Flight interface
  - Chat message interface

---

## 🧪 Phase 7: Testing & Validation

- [ ] Test agent routing
  - Send booking requests
  - Send status check requests
  - Send cancellation requests
  - Verify correct agent handling

- [ ] Test duplicate prevention
  - Create booking
  - Try to create same booking again
  - Verify rejection

- [ ] Test authentication
  - Register new user
  - Login
  - Access protected routes
  - Invalid token handling

- [ ] Test error cases
  - Invalid flight number
  - Invalid confirmation number
  - Missing required fields

- [ ] Create test script for agents (`src/test-agents.ts`)
  - Mock user requests
  - Test each agent independently

---

## 📝 Phase 8: Documentation & Polish

- [ ] Add JSDoc comments to all functions

- [ ] Create API documentation
  - List all endpoints
  - Request/response examples
  - Authentication requirements

- [ ] Add README in `/backend` folder
  - Setup instructions
  - Environment variables
  - Running locally
  - Agent architecture explanation

- [ ] Add input validation
  - Validate request bodies
  - Sanitize inputs
  - Proper error messages

---

## 🚀 Phase 9: Deployment Preparation (Render)

- [ ] Create `Procfile` or ensure start script works

- [ ] Verify environment variables are documented

- [ ] Test production build
  ```bash
  npm run build
  npm start
  ```

- [ ] Optimize for production
  - Connection pooling
  - Rate limiting (optional)
  - Compression

- [ ] Create deployment checklist in comments

---

## 🔗 Integration Points

**Dependencies:**
- MongoDB schemas from Claude 3 (`../database/schemas`)
- Shared types (`../shared/types.ts`)

**Provides to Frontend:**
- API endpoints at `http://localhost:5000/api/*`
- Authentication tokens
- Chat responses
- Booking data

---

## Environment Variables Needed

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flight-booking
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=sk-...
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## Quick Start Commands

```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

---

## Progress Tracker

- [ ] Phase 1: Project Initialization (0/6)
- [ ] Phase 2: Database Models (0/4)
- [ ] Phase 3: Authentication (0/4)
- [ ] Phase 4: Multi-Agent System (0/11)
- [ ] Phase 5: API Routes (0/3)
- [ ] Phase 6: Server Setup (0/5)
- [ ] Phase 7: Testing (0/5)
- [ ] Phase 8: Documentation (0/4)
- [ ] Phase 9: Deployment Prep (0/4)

**Total: 0/46 tasks completed**
