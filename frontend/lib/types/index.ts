// User types
export interface User {
  id: string;         // Backend uses "id" not "_id"
  _id?: string;       // Keep for compatibility
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// Message types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  bookingData?: Booking;
}

// Booking types
export interface Booking {
  _id: string;
  userId: string;
  flightNumber: string;
  confirmationNumber: string;
  passengerName: string;
  status: 'confirmed' | 'cancelled';
  departureDate: string;
  createdAt: string;
  updatedAt: string;
}

// Flight types
export interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

// API response types
export interface ChatResponse {
  success: boolean;
  reply: string;           // Backend uses "reply" not "message"
  agentType?: string;
  bookingData?: Booking;   // Backend uses "bookingData" not "booking"
}

export interface BookingsResponse {
  success: boolean;
  count: number;
  bookings: Booking[];
}

export interface ErrorResponse {
  success: boolean;
  error: string;
}
