import React from 'react';
import { Booking } from '@/lib/types';
import { FiCalendar, FiUser, FiCheckCircle, FiXCircle, FiHash } from 'react-icons/fi';
import Card from '@/components/ui/Card';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const isConfirmed = booking.status === 'confirmed';
  const formattedDate = new Date(booking.departureDate).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <FiHash className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">{booking.flightNumber}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            isConfirmed
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isConfirmed ? (
            <>
              <FiCheckCircle className="h-3 w-3" />
              Confirmed
            </>
          ) : (
            <>
              <FiXCircle className="h-3 w-3" />
              Cancelled
            </>
          )}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FiUser className="h-4 w-4 text-gray-400" />
          <span className="font-medium">Passenger:</span>
          <span>{booking.passengerName}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium">Departure:</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiHash className="h-4 w-4 text-gray-400" />
          <span className="font-medium">Confirmation:</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
            {booking.confirmationNumber}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <p>
          Booked on {new Date(booking.createdAt).toLocaleDateString('en-US')}
        </p>
      </div>
    </Card>
  );
}
