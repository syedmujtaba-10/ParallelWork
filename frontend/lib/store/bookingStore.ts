import { create } from 'zustand';
import { Booking } from '@/lib/types';
import { getBookings, getBookingByConfirmation } from '@/lib/api/bookings';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: (token: string) => Promise<void>;
  getBookingById: (confirmationNumber: string, token: string) => Promise<Booking | null>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getBookings(token);
      set({ bookings, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch bookings'
        : 'Failed to fetch bookings';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  getBookingById: async (confirmationNumber: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await getBookingByConfirmation(confirmationNumber, token);
      set({ isLoading: false });
      return booking;
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch booking'
        : 'Failed to fetch booking';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
