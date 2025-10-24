import apiClient from './client';
import { Booking } from '@/lib/types';

export async function getBookings(token: string): Promise<Booking[]> {
  const response = await apiClient.get<{ success: boolean; count: number; bookings: Booking[] }>('/api/bookings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.bookings;
}

export async function getBookingByConfirmation(
  confirmationNumber: string,
  token: string
): Promise<Booking> {
  const response = await apiClient.get<{ success: boolean; booking: Booking; flight?: any }>(
    `/api/bookings/confirmation/${confirmationNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.booking;
}
