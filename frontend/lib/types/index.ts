// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
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
  message: string;
  booking?: Booking;
}

export interface BookingsResponse {
  bookings: Booking[];
}

export interface ErrorResponse {
  error: string;
  message: string;
}
