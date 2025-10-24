# Flight Booking Multi-Agent System

A sophisticated flight booking application powered by LangGraph and OpenAI agents, built with TypeScript, Next.js, Express.js, and MongoDB.

## 🎯 Project Overview

This application demonstrates a multi-agent AI system where specialized agents handle different aspects of flight booking:

1. **Router Agent** - Analyzes user intent and routes to the appropriate specialist
2. **Booking Agent** - Creates new flight bookings with duplicate prevention
3. **Status Agent** - Retrieves flight status and booking information
4. **Cancellation Agent** - Handles flight cancellations

## 🏗️ Architecture

### Frontend (Next.js)
- **Location:** `/frontend`
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Deployment:** Vercel

### Backend (Express.js + LangGraph)
- **Location:** `/backend`
- **Framework:** Express.js with TypeScript
- **AI:** LangGraph orchestration with OpenAI agents
- **Auth:** JWT-based authentication
- **Deployment:** Render

### Database (MongoDB)
- **Location:** `/database`
- **ODM:** Mongoose
- **Schemas:** Users, Flights, Bookings
- **Deployment:** MongoDB Atlas

### Shared
- **Location:** `/shared`
- **Purpose:** TypeScript types and interfaces shared across all projects

## 📁 Project Structure

```
/ParallelWork
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   └── lib/              # API clients, stores, utilities
├── backend/              # Express.js + LangGraph
│   ├── src/
│   │   ├── agents/      # 4 LangGraph agents
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Auth & validation
├── database/             # MongoDB schemas & seed data
│   ├── src/
│   │   ├── schemas/     # Mongoose schemas
│   │   ├── seed/        # Seed scripts
│   │   └── data/        # Sample JSON data
├── shared/               # Shared TypeScript types
├── todo.md               # Master task list
├── claude1-todo.md       # Backend tasks
├── claude2-todo.md       # Frontend tasks
└── claude3-todo.md       # Database tasks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas account)
- OpenAI API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/syedmujtaba-10/ParallelWork.git
   cd ParallelWork
   ```

2. **Set up Database (Claude 3)**
   ```bash
   cd database
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm run seed
   cd ..
   ```

3. **Set up Backend (Claude 1)**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with MongoDB URI and OpenAI API key
   npm run dev
   # Backend runs on http://localhost:5000
   cd ..
   ```

4. **Set up Frontend (Claude 2)**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with backend URL
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flight-booking
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-...
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Database (.env)
```env
MONGODB_URI=mongodb://localhost:27017/flight-booking
NODE_ENV=development
```

## 🤖 Agent System

### How It Works

1. User sends a message via chat interface
2. **Router Agent** analyzes the message to determine intent
3. Router delegates to the appropriate specialist:
   - **Booking Agent**: "I want to book flight AA101 for John Doe"
   - **Status Agent**: "What's the status of booking BK-ABC123?"
   - **Cancellation Agent**: "Cancel my flight reservation BK-ABC123"
4. Specialist agent processes the request and returns a response
5. Response is displayed to the user

### Duplicate Prevention

The Booking Agent checks if a user already has an existing booking for the same flight before creating a new one, preventing accidental duplicate bookings.

## 📝 Development Workflow

This project is designed for **parallel development** with three independent work streams:

- **Claude 1** works on `/backend` (see `claude1-todo.md`)
- **Claude 2** works on `/frontend` (see `claude2-todo.md`)
- **Claude 3** works on `/database` (see `claude3-todo.md`)

Each stream can work independently with minimal conflicts. See `todo.md` for the master task list and dependencies.

## 🧪 Testing

### Sample Users (Password: "password123" for all)
- john@example.com
- jane@example.com
- bob@example.com

### Testing Flow
1. Register/login with a test user
2. Try booking a flight: "Book flight AA101 for John Doe on Feb 15th"
3. Check status: "What's my booking confirmation number?"
4. Cancel: "Cancel my booking BK-ABC123"

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory: `frontend/`
3. Add environment variable: `NEXT_PUBLIC_API_URL` (Render backend URL)
4. Deploy

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `backend/`
4. Add environment variables (MongoDB Atlas URI, OpenAI key, etc.)
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Deploy

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Configure network access (allow all IPs: 0.0.0.0/0)
3. Create database user
4. Get connection string
5. Run seed scripts with Atlas URI

## 📚 Documentation

- [Master Todo List](./todo.md)
- [Backend Tasks](./claude1-todo.md)
- [Frontend Tasks](./claude2-todo.md)
- [Database Tasks](./claude3-todo.md)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios

**Backend:**
- Express.js
- TypeScript
- LangGraph
- OpenAI API
- Mongoose
- JWT

**Database:**
- MongoDB
- Mongoose ODM

## 🤝 Contributing

Each Claude instance should:
1. Review their respective todo file (`claude1/2/3-todo.md`)
2. Work only in their designated folder
3. Update progress in their todo file
4. Commit changes with clear messages

## 📄 License

MIT

## 👥 Authors

Developed as a demonstration of multi-agent AI systems and parallel development workflows.

---

**Status:** 🚧 In Development

See `todo.md` for current progress.
