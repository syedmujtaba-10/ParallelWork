/**
 * Shared TypeScript types for the Flight Booking Multi-Agent System
 * These types are used across frontend, backend, and database
 */

// User Interface
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Flight Interface
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

// Booking Interface
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

// Chat Message Interface
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  bookingData?: Partial<Booking>;
  flightData?: Partial<Flight>;
}

// API Response Types
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  bookingData?: Booking;
  flightData?: Flight;
  error?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  bookings?: Booking[];
  message?: string;
  error?: string;
}

export interface FlightResponse {
  success: boolean;
  flight?: Flight;
  flights?: Flight[];
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
}

// Agent-specific types
export type AgentType = "router" | "booking" | "status" | "cancellation";

export interface AgentState {
  messages: ChatMessage[];
  currentAgent: AgentType | null;
  userId: string;
  extractedData?: {
    flightNumber?: string;
    confirmationNumber?: string;
    passengerName?: string;
    passengerEmail?: string;
    travelDate?: Date;
  };
}

// Request body types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChatRequest {
  message: string;
}

export interface BookingCreateRequest {
  flightNumber: string;
  passengerName: string;
  passengerEmail: string;
  travelDate: Date;
}
