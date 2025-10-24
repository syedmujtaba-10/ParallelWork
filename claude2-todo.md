# Claude 2 Todo List - Frontend Development

**Responsibility:** Next.js frontend with chat interface and authentication

**Working Directory:** `/frontend`

---

## 🚀 Phase 1: Project Initialization

- [ ] Create Next.js app with TypeScript and Tailwind
  ```bash
  cd frontend
  npx create-next-app@latest . --typescript --tailwind --app --eslint
  ```
  - Choose: Yes to TypeScript, Tailwind, App Router
  - Choose: No to src/ directory (optional)
  - Choose: Yes to import alias (@/*)

- [ ] Install additional dependencies
  ```bash
  npm install axios zustand
  npm install react-icons
  ```

- [ ] Create folder structure
  ```
  /frontend
    /app
      /api           # API route handlers (optional)
      /(auth)
        /login       # Login page
        /register    # Register page
      /(dashboard)
        /chat        # Main chat interface
        /bookings    # Booking history
      layout.tsx     # Root layout
      page.tsx       # Landing page
    /components
      /auth          # Auth components
      /chat          # Chat components
      /ui            # Reusable UI components
    /lib
      /api           # API client
      /store         # Zustand stores
      /types         # TypeScript types
      /utils         # Utility functions
    .env.local
    .env.example
  ```

- [ ] Create `.env.example`
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```

- [ ] Create `.env.local` with actual values

---

## 🎨 Phase 2: UI Components & Styling

- [ ] Configure Tailwind with custom theme (`tailwind.config.ts`)
  - Colors for chat bubbles
  - Custom spacing
  - Dark mode support (optional)

- [ ] Create base UI components
  - [ ] Button component (`/components/ui/Button.tsx`)
  - [ ] Input component (`/components/ui/Input.tsx`)
  - [ ] Card component (`/components/ui/Card.tsx`)
  - [ ] Loading spinner (`/components/ui/Spinner.tsx`)
  - [ ] Alert/Toast component (`/components/ui/Alert.tsx`)

- [ ] Create layout components
  - [ ] Header/Navbar (`/components/layout/Header.tsx`)
  - [ ] Footer (`/components/layout/Footer.tsx`)
  - [ ] Sidebar (optional, `/components/layout/Sidebar.tsx`)

---

## 🔐 Phase 3: Authentication System

### Auth Store (Zustand)
- [ ] Create auth store (`/lib/store/authStore.ts`)
  - State: user, token, isAuthenticated, isLoading
  - Actions: login, register, logout, checkAuth
  - Persist token in localStorage

### Auth API Client
- [ ] Create auth API (`/lib/api/auth.ts`)
  - `registerUser(email, password, name)` → POST /api/auth/register
  - `loginUser(email, password)` → POST /api/auth/login
  - `getCurrentUser(token)` → GET /api/auth/me
  - Error handling

### Auth Components
- [ ] Create Login form (`/components/auth/LoginForm.tsx`)
  - Email and password inputs
  - Form validation
  - Error display
  - Submit handler
  - Link to register

- [ ] Create Register form (`/components/auth/RegisterForm.tsx`)
  - Name, email, password inputs
  - Password confirmation
  - Form validation
  - Error display
  - Submit handler
  - Link to login

- [ ] Create auth guard HOC or middleware (`/components/auth/AuthGuard.tsx`)
  - Redirect to login if not authenticated
  - Protect chat and bookings pages

### Auth Pages
- [ ] Create login page (`/app/(auth)/login/page.tsx`)
  - Render LoginForm
  - Handle redirect after login

- [ ] Create register page (`/app/(auth)/register/page.tsx`)
  - Render RegisterForm
  - Handle redirect after registration

- [ ] Update root layout (`/app/layout.tsx`)
  - Check auth status on mount
  - Show loading state while checking

---

## 💬 Phase 4: Chat Interface

### Chat Store
- [ ] Create chat store (`/lib/store/chatStore.ts`)
  - State: messages, isLoading, error
  - Actions: sendMessage, clearMessages
  - Message format: { id, text, sender: 'user' | 'agent', timestamp }

### Chat API Client
- [ ] Create chat API (`/lib/api/chat.ts`)
  - `sendMessage(message, token)` → POST /api/chat
  - Return agent response
  - Handle errors

### Chat Components
- [ ] Create ChatMessage component (`/components/chat/ChatMessage.tsx`)
  - Display message text
  - Show sender (user/agent)
  - Timestamp
  - Different styling for user vs agent
  - Support for booking data display

- [ ] Create ChatInput component (`/components/chat/ChatInput.tsx`)
  - Text input
  - Send button
  - Handle Enter key
  - Disable while loading
  - Character limit (optional)

- [ ] Create ChatWindow component (`/components/chat/ChatWindow.tsx`)
  - Message list (scrollable)
  - Auto-scroll to bottom on new message
  - Loading indicator
  - Empty state
  - Integrate ChatMessage components

- [ ] Create ChatContainer (`/components/chat/ChatContainer.tsx`)
  - Combine ChatWindow + ChatInput
  - Connect to chat store
  - Handle message sending
  - Show typing indicator while agent responds

### Chat Page
- [ ] Create chat page (`/app/(dashboard)/chat/page.tsx`)
  - Render ChatContainer
  - Protected route (requires auth)
  - Welcome message
  - Sample prompts (optional)
    - "Book a flight to New York"
    - "Check my booking status"
    - "Cancel my reservation"

---

## 📋 Phase 5: Booking Management

### Booking Store
- [ ] Create booking store (`/lib/store/bookingStore.ts`)
  - State: bookings, isLoading, error
  - Actions: fetchBookings, getBookingById

### Booking API Client
- [ ] Create booking API (`/lib/api/bookings.ts`)
  - `getBookings(token)` → GET /api/bookings
  - `getBookingByConfirmation(confirmationNumber, token)` → GET /api/bookings/confirmation/:confirmationNumber

### Booking Components
- [ ] Create BookingCard component (`/components/bookings/BookingCard.tsx`)
  - Display: flightNumber, confirmation, status, passenger, date
  - Status badge (confirmed/cancelled)
  - Action buttons (view details, cancel)

- [ ] Create BookingList component (`/components/bookings/BookingList.tsx`)
  - Map through bookings
  - Render BookingCard for each
  - Empty state (no bookings)
  - Loading state

### Booking Page
- [ ] Create bookings page (`/app/(dashboard)/bookings/page.tsx`)
  - Fetch bookings on mount
  - Render BookingList
  - Protected route
  - Refresh button

---

## 🌐 Phase 6: API Integration & HTTP Client

- [ ] Create axios instance (`/lib/api/client.ts`)
  - Base URL from env
  - Default headers
  - Token interceptor (add JWT to requests)
  - Error interceptor (handle 401, refresh token, etc.)

- [ ] Create API types (`/lib/types/api.ts`)
  - AuthResponse
  - ChatResponse
  - BookingResponse
  - FlightResponse
  - ErrorResponse

- [ ] Import shared types from `/shared/types.ts`
  - User, Booking, Flight, Message interfaces

---

## 🏠 Phase 7: Landing & Navigation

- [ ] Create landing page (`/app/page.tsx`)
  - Hero section
  - Features list
  - CTA buttons (Login/Register)
  - Brief explanation of AI agents

- [ ] Update Header component
  - Logo/branding
  - Navigation links (Chat, Bookings)
  - User menu (logout, profile)
  - Show/hide based on auth state

- [ ] Add navigation logic
  - Redirect authenticated users from landing to chat
  - Redirect unauthenticated users to login

---

## ✨ Phase 8: User Experience Enhancements

- [ ] Add loading states
  - Skeleton loaders for chat messages
  - Loading spinners for bookings
  - Button loading states

- [ ] Add error handling
  - Toast notifications for errors
  - Retry buttons
  - Network error messages

- [ ] Add success feedback
  - Success toasts for bookings
  - Confirmation messages
  - Visual feedback for actions

- [ ] Add responsive design
  - Mobile-friendly chat interface
  - Responsive navigation
  - Touch-friendly buttons

- [ ] Add keyboard shortcuts (optional)
  - Cmd+K to focus chat input
  - Esc to close modals

- [ ] Add accessibility
  - ARIA labels
  - Keyboard navigation
  - Focus management

---

## 🧪 Phase 9: Testing & Validation

- [ ] Test authentication flow
  - Register new user
  - Login existing user
  - Logout
  - Protected route access

- [ ] Test chat interface
  - Send messages
  - Receive responses
  - Handle errors
  - Long message handling

- [ ] Test booking display
  - View all bookings
  - Empty state
  - Error state

- [ ] Test with mock data (before backend is ready)
  - Create mock API responses
  - Test UI components in isolation

- [ ] Cross-browser testing
  - Chrome, Firefox, Safari
  - Mobile browsers

---

## 📝 Phase 10: Documentation & Polish

- [ ] Add README in `/frontend` folder
  - Setup instructions
  - Environment variables
  - Running locally
  - Building for production

- [ ] Add code comments
  - Complex logic explanation
  - Component prop documentation

- [ ] Optimize performance
  - Image optimization (Next.js Image)
  - Code splitting
  - Lazy loading

- [ ] Add meta tags for SEO
  - Title, description
  - Open Graph tags

---

## 🚀 Phase 11: Deployment Preparation (Vercel)

- [ ] Verify build succeeds
  ```bash
  npm run build
  ```

- [ ] Test production build locally
  ```bash
  npm start
  ```

- [ ] Prepare environment variables for Vercel
  - `NEXT_PUBLIC_API_URL` (backend URL on Render)

- [ ] Create `vercel.json` for configuration (if needed)

- [ ] Add deployment instructions to README

---

## 🔗 Integration Points

**Dependencies:**
- Backend API at `http://localhost:5000/api/*` (from Claude 1)
- Shared types from `../shared/types.ts`

**Provides:**
- User interface for flight booking system
- Chat interface to interact with agents
- Authentication UI

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Quick Start Commands

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

---

## Progress Tracker

- [ ] Phase 1: Project Initialization (0/4)
- [ ] Phase 2: UI Components (0/7)
- [ ] Phase 3: Authentication (0/11)
- [ ] Phase 4: Chat Interface (0/10)
- [ ] Phase 5: Booking Management (0/8)
- [ ] Phase 6: API Integration (0/3)
- [ ] Phase 7: Landing & Navigation (0/3)
- [ ] Phase 8: UX Enhancements (0/6)
- [ ] Phase 9: Testing (0/5)
- [ ] Phase 10: Documentation (0/4)
- [ ] Phase 11: Deployment Prep (0/5)

**Total: 0/66 tasks completed**

---

## Design Notes

**Color Scheme Suggestion:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- User messages: Light blue background
- Agent messages: Gray background

**Typography:**
- Headings: Bold, larger font
- Body: Regular, readable size (16px base)
- Code/confirmation numbers: Monospace font
