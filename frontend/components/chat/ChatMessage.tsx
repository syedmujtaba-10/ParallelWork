import React from 'react';
import { Message } from '@/lib/types';
import { FiUser, FiCpu } from 'react-icons/fi';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-gray-400'
        }`}
      >
        {isUser ? (
          <FiUser className="w-4 h-4 text-white" />
        ) : (
          <FiCpu className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-gray-200 text-gray-900 rounded-tl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>

          {/* Booking Data Display */}
          {message.bookingData && (
            <div className="mt-2 pt-2 border-t border-opacity-20 border-white">
              <p className="text-xs font-semibold mb-1">Booking Details:</p>
              <div className="text-xs space-y-0.5">
                <p>Flight: {message.bookingData.flightNumber}</p>
                <p>Confirmation: {message.bookingData.confirmationNumber}</p>
                <p>Passenger: {message.bookingData.passengerName}</p>
                <p>Status: {message.bookingData.status}</p>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-1">{formattedTime}</span>
      </div>
    </div>
  );
}
