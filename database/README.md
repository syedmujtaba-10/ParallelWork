# Database Module - Flight Booking System

MongoDB schemas, seed data, and database utilities for the flight booking multi-agent system.

## Overview

This module contains:
- Mongoose schemas for User, Flight, and Booking collections
- Sample demo data (users, flights, bookings)
- Seed scripts to populate the database
- Database connection utilities

## Database: MongoDB Atlas

**Database Name:** `flight_db`

**Connection:** MongoDB Atlas (Cloud)

## Collections

### 1. Users
- **Count:** 10 test users
- **Password (all users):** `password123`
- **Fields:** email (unique), password (hashed), name, createdAt

### 2. Flights
- **Count:** 25 flights
- **Routes:** Major US airports (JFK, LAX, SFO, ORD, MIA, SEA, etc.)
- **Airlines:** American, Delta, United, Southwest
- **Fields:** flightNumber (unique), airline, origin, destination, departureTime, arrivalTime, status, price, availableSeats

### 3. Bookings
- **Count:** 15 sample bookings
- **Status:** 10 confirmed, 5 cancelled
- **Fields:** userId, flightNumber, confirmationNumber (auto-generated), status, passengerName, passengerEmail, bookingDate, travelDate

## Folder Structure

```
/database
  /src
    /schemas         # Mongoose schema definitions
      User.ts        # User schema with password hashing
      Flight.ts      # Flight schema with validation
      Booking.ts     # Booking schema with auto-confirmation number
    /seed            # Seed scripts
      index.ts       # Master seed script (runs all)
      users.ts       # Seed users
      flights.ts     # Seed flights
      bookings.ts    # Seed bookings
      clear.ts       # Clear all data
    /data            # JSON demo data
      users.json     # 10 test users
      flights.json   # 25 sample flights
      bookings.json  # 15 sample bookings
    /utils           # Utilities
      connection.ts  # MongoDB connection helper
  .env.example       # Environment template
  .env               # Environment variables (not committed)
  package.json       # Dependencies and scripts
  tsconfig.json      # TypeScript configuration
```

## Setup & Installation

```bash
cd database
npm install
```

## Environment Variables

Create a `.env` file (use `.env.example` as template):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flight_db?appName=Cluster0
NODE_ENV=development
```

## Available Scripts

### Seed All Collections
Populates users, flights, and bookings in order:

```bash
npm run seed
```

### Seed Individual Collections

```bash
npm run seed:users      # Seed only users
npm run seed:flights    # Seed only flights
npm run seed:bookings   # Seed only bookings
```

### Clear Database

```bash
npm run clear           # Delete all data from all collections
```

## Test User Credentials

All test users have the same password: `password123`

**Sample accounts:**
- john@example.com
- jane@example.com
- bob@example.com
- alice@example.com
- charlie@example.com

## Schema Features

### User Schema
- Email validation and uniqueness
- Password hashing with bcrypt (auto-hashed on save)
- Method: `comparePassword(password)` for authentication

### Flight Schema
- Flight number format validation (e.g., AA101, DL1234)
- Airport code validation (3 letters)
- Virtual property: `duration` (calculated in minutes)
- Indexes on origin/destination and departureTime

### Booking Schema
- Auto-generated confirmation numbers (format: BK-XXXXXX)
- Compound index on userId + flightNumber (prevents duplicates)
- Email validation for passenger
- Status: confirmed or cancelled

## Sample Data

**Flights:**
- 25 flights across major US routes
- Prices range: $150-$490
- Various departure times
- Mix of statuses (on-time, delayed, cancelled)

**Bookings:**
- 15 bookings linked to test users and flights
- 10 confirmed, 5 cancelled
- Each has a unique confirmation number

## Integration

The backend (Claude 1) will import these schemas:

```typescript
import User from '../database/src/schemas/User';
import Flight from '../database/src/schemas/Flight';
import Booking from '../database/src/schemas/Booking';
```

Shared TypeScript types are available in `/shared/types.ts` for use across all modules.

## Database Seeded

The MongoDB Atlas database has been successfully seeded with:
- ✅ 10 users
- ✅ 25 flights
- ✅ 15 bookings

You can verify in MongoDB Atlas dashboard at: https://cloud.mongodb.com

## Next Steps

1. ✅ Database setup complete
2. Backend (Claude 1) can now use these schemas
3. Frontend (Claude 2) can use the shared types
4. All systems can connect to the same MongoDB Atlas instance
