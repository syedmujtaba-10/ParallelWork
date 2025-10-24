# Claude 3 Todo List - Database & Infrastructure

**Responsibility:** MongoDB schemas, seed data, database utilities, infrastructure setup

**Working Directory:** `/database`

---

## 🚀 Phase 1: Project Initialization

- [ ] Initialize Node.js project
  ```bash
  cd database
  npm init -y
  ```

- [ ] Install dependencies
  ```bash
  npm install mongoose mongodb dotenv
  npm install -D typescript @types/node ts-node
  ```

- [ ] Initialize TypeScript
  ```bash
  npx tsc --init
  ```

- [ ] Configure `tsconfig.json`
  - Set `"outDir": "./dist"`
  - Set `"rootDir": "./src"`
  - Enable `"esModuleInterop": true`

- [ ] Create folder structure
  ```
  /database
    /src
      /schemas      # Mongoose schemas
      /seed         # Seed scripts
      /utils        # Database utilities
      /data         # JSON data files
      index.ts      # Main entry point
    .env.example
    .env
  ```

- [ ] Create `.env.example`
  ```
  MONGODB_URI=mongodb://localhost:27017/flight-booking
  NODE_ENV=development
  ```

- [ ] Update `package.json` scripts
  ```json
  "scripts": {
    "seed": "ts-node src/seed/index.ts",
    "seed:flights": "ts-node src/seed/flights.ts",
    "seed:users": "ts-node src/seed/users.ts",
    "seed:bookings": "ts-node src/seed/bookings.ts",
    "clear": "ts-node src/seed/clear.ts"
  }
  ```

---

## 🗄️ Phase 2: MongoDB Schema Definitions

### User Schema
- [ ] Create User schema (`src/schemas/User.ts`)
  ```typescript
  {
    email: String (unique, required)
    password: String (required, hashed)
    name: String (required)
    createdAt: Date (default: now)
  }
  ```
  - Add indexes: email (unique)
  - Pre-save hook for password hashing
  - Method to compare passwords
  - Method to generate JWT

### Flight Schema
- [ ] Create Flight schema (`src/schemas/Flight.ts`)
  ```typescript
  {
    flightNumber: String (unique, required, e.g., "AA123")
    airline: String (required, e.g., "American Airlines")
    origin: String (required, e.g., "JFK")
    destination: String (required, e.g., "LAX")
    departureTime: Date (required)
    arrivalTime: Date (required)
    status: String (enum: ["on-time", "delayed", "cancelled"], default: "on-time")
    price: Number (required)
    availableSeats: Number (default: 180)
  }
  ```
  - Add indexes: flightNumber (unique)
  - Virtual property for duration

### Booking Schema
- [ ] Create Booking schema (`src/schemas/Booking.ts`)
  ```typescript
  {
    userId: ObjectId (ref: User, required)
    flightNumber: String (required)
    confirmationNumber: String (unique, required, auto-generated)
    status: String (enum: ["confirmed", "cancelled"], default: "confirmed")
    passengerName: String (required)
    passengerEmail: String (required)
    bookingDate: Date (default: now)
    travelDate: Date (required)
  }
  ```
  - Add compound index: userId + flightNumber (for duplicate detection)
  - Add index: confirmationNumber (unique)
  - Pre-save hook to generate confirmation number
  - Method to generate confirmation number (e.g., "BK-ABC123")

---

## 📦 Phase 3: Sample Data Creation

### Flight Data
- [ ] Create flight data file (`src/data/flights.json`)
  - 20-30 sample flights
  - Various airlines (American, Delta, United, Southwest, etc.)
  - Popular routes (NYC-LAX, SFO-CHI, MIA-SEA, etc.)
  - Mix of domestic and international
  - Varied departure times (spread across day)
  - Different price points ($150-$800)
  - Example:
    ```json
    {
      "flightNumber": "AA101",
      "airline": "American Airlines",
      "origin": "JFK",
      "destination": "LAX",
      "departureTime": "2024-02-15T08:00:00Z",
      "arrivalTime": "2024-02-15T11:30:00Z",
      "status": "on-time",
      "price": 350,
      "availableSeats": 150
    }
    ```

### User Data
- [ ] Create user data file (`src/data/users.json`)
  - 5-10 test users
  - Include: name, email, password (will be hashed)
  - Example:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

### Booking Data
- [ ] Create booking data file (`src/data/bookings.json`)
  - 10-15 sample bookings
  - Link to test users (by email)
  - Link to flights (by flightNumber)
  - Mix of confirmed and cancelled
  - Example:
    ```json
    {
      "userEmail": "john@example.com",
      "flightNumber": "AA101",
      "passengerName": "John Doe",
      "passengerEmail": "john@example.com",
      "status": "confirmed",
      "travelDate": "2024-02-15T08:00:00Z"
    }
    ```

---

## 🌱 Phase 4: Seed Scripts

### Database Connection Utility
- [ ] Create connection utility (`src/utils/connection.ts`)
  - Connect to MongoDB
  - Handle connection errors
  - Close connection gracefully

### Seed Flights
- [ ] Create flight seed script (`src/seed/flights.ts`)
  - Read from `flights.json`
  - Clear existing flights (optional)
  - Insert flights into database
  - Log success/failure

### Seed Users
- [ ] Create user seed script (`src/seed/users.ts`)
  - Read from `users.json`
  - Hash passwords before insertion
  - Clear existing users (optional)
  - Insert users into database
  - Log created user IDs

### Seed Bookings
- [ ] Create booking seed script (`src/seed/bookings.ts`)
  - Read from `bookings.json`
  - Look up user IDs by email
  - Generate confirmation numbers
  - Insert bookings into database
  - Log success/failure

### Master Seed Script
- [ ] Create master seed script (`src/seed/index.ts`)
  - Run all seed scripts in order:
    1. Clear all collections (optional)
    2. Seed users
    3. Seed flights
    4. Seed bookings
  - Handle errors gracefully
  - Log completion status

### Clear Database Script
- [ ] Create clear script (`src/seed/clear.ts`)
  - Drop all collections
  - Confirm action (prevent accidents)
  - Log what was cleared

---

## 🛠️ Phase 5: Database Utilities

- [ ] Create confirmation number generator (`src/utils/generateConfirmation.ts`)
  - Format: "BK-" + 6 random alphanumeric characters
  - Ensure uniqueness

- [ ] Create database helpers (`src/utils/helpers.ts`)
  - `checkDuplicateBooking(userId, flightNumber)`
  - `getFlightByNumber(flightNumber)`
  - `getBookingByConfirmation(confirmationNumber)`
  - `getUserBookings(userId)`

- [ ] Create validation utilities (`src/utils/validators.ts`)
  - Email validation
  - Flight number format validation
  - Date validation

---

## 📋 Phase 6: Shared Types

- [ ] Create shared types file (`../shared/types.ts`)
  ```typescript
  export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: Date;
  }

  export interface Flight {
    _id: string;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    status: "on-time" | "delayed" | "cancelled";
    price: number;
    availableSeats: number;
  }

  export interface Booking {
    _id: string;
    userId: string;
    flightNumber: string;
    confirmationNumber: string;
    status: "confirmed" | "cancelled";
    passengerName: string;
    passengerEmail: string;
    bookingDate: Date;
    travelDate: Date;
  }

  export interface ChatMessage {
    id: string;
    text: string;
    sender: "user" | "agent";
    timestamp: Date;
    bookingData?: Partial<Booking>;
  }
  ```

---

## 🧪 Phase 7: Testing & Validation

- [ ] Test database connection
  - Connect to local MongoDB
  - Verify connection success

- [ ] Test seed scripts
  - Run `npm run seed`
  - Verify data in database (MongoDB Compass or mongosh)
  - Check user count, flight count, booking count

- [ ] Test data integrity
  - Verify foreign key relationships (userId in bookings)
  - Check unique constraints (emails, flightNumbers, confirmationNumbers)
  - Validate data formats

- [ ] Test duplicate detection
  - Try to create booking with same userId + flightNumber
  - Should fail or be caught by backend

- [ ] Test clear script
  - Run `npm run clear`
  - Verify all data deleted

---

## 📝 Phase 8: Documentation

- [ ] Create README in `/database` folder
  - Purpose of this folder
  - Schema documentation
  - How to run seed scripts
  - Sample data overview

- [ ] Document seed scripts
  - What each script does
  - Order of execution
  - How to customize data

- [ ] Add JSDoc comments to schemas
  - Explain each field
  - Document methods

- [ ] Create data documentation (`SAMPLE_DATA.md`)
  - List all sample users with credentials
  - List sample flights
  - List sample bookings

---

## 🚀 Phase 9: MongoDB Atlas Setup (Cloud Database)

- [ ] Create MongoDB Atlas account (free tier)
  - Sign up at mongodb.com/cloud/atlas

- [ ] Create cluster
  - Choose free tier (M0)
  - Select region closest to deployment

- [ ] Configure network access
  - Add IP whitelist (allow all: 0.0.0.0/0 for development)
  - Add specific IPs for production

- [ ] Create database user
  - Username and password
  - Read/write permissions

- [ ] Get connection string
  - Copy connection string
  - Replace <password> with actual password
  - Save in `.env`

- [ ] Upload seed data to Atlas
  - Modify connection string in `.env`
  - Run seed scripts
  - Verify data in Atlas UI

- [ ] Provide connection string to Claude 1 (backend)

---

## 🔗 Integration Points

**Provides to Backend (Claude 1):**
- MongoDB schemas in `/database/src/schemas`
- Seed data for testing
- MongoDB connection string (Atlas)
- Sample user credentials for testing

**Provides to All:**
- Shared TypeScript types in `../shared/types.ts`

---

## Environment Variables

**Local Development:**
```env
MONGODB_URI=mongodb://localhost:27017/flight-booking
NODE_ENV=development
```

**Production (MongoDB Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flight-booking?retryWrites=true&w=majority
NODE_ENV=production
```

---

## Quick Start Commands

**Local MongoDB:**
```bash
cd database
npm install
cp .env.example .env
npm run seed
```

**MongoDB Atlas:**
```bash
# Update MONGODB_URI in .env to Atlas connection string
npm run seed
```

---

## Progress Tracker

- [ ] Phase 1: Project Initialization (0/6)
- [ ] Phase 2: Schema Definitions (0/3)
- [ ] Phase 3: Sample Data (0/3)
- [ ] Phase 4: Seed Scripts (0/6)
- [ ] Phase 5: Database Utilities (0/3)
- [ ] Phase 6: Shared Types (0/1)
- [ ] Phase 7: Testing (0/5)
- [ ] Phase 8: Documentation (0/4)
- [ ] Phase 9: MongoDB Atlas (0/6)

**Total: 0/37 tasks completed**

---

## Sample Data Overview

**Flights:** 25 flights across major US routes
**Users:** 10 test users (password: "password123" for all)
**Bookings:** 15 sample bookings (10 confirmed, 5 cancelled)

**Test User Credentials (for frontend testing):**
- john@example.com / password123
- jane@example.com / password123
- bob@example.com / password123
