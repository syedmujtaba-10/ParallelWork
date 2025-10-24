'use client';

import React from 'react';
import { Booking } from '@/lib/types';
import BookingCard from './BookingCard';
import Spinner from '@/components/ui/Spinner';
import { FiInbox } from 'react-icons/fi';

interface BookingListProps {
  bookings: Booking[];
  isLoading: boolean;
}

export default function BookingList({ bookings, isLoading }: BookingListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FiInbox className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
        <p className="text-gray-600 max-w-md">
          You haven&apos;t made any bookings yet. Head over to the chat to book your first flight!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
}
