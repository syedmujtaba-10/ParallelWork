'use client';

import React, { useEffect } from 'react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useAuthStore } from '@/lib/store/authStore';
import BookingList from '@/components/bookings/BookingList';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { FiRefreshCw } from 'react-icons/fi';

export default function BookingsPage() {
  const { bookings, isLoading, error, fetchBookings, clearError } = useBookingStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchBookings(token);
    }
  }, [token, fetchBookings]);

  const handleRefresh = () => {
    if (token) {
      fetchBookings(token);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage your flight reservations</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert type="error" onClose={clearError} className="mb-6">
            {error}
          </Alert>
        )}

        <BookingList bookings={bookings} isLoading={isLoading} />
      </div>
    </div>
  );
}
