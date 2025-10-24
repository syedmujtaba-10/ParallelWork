'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import ChatMessage from './ChatMessage';
import Spinner from '@/components/ui/Spinner';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="max-w-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Welcome to Flight Booking Assistant
            </h3>
            <p className="text-gray-600 mb-6">
              I can help you with booking flights, checking your bookings, and managing your
              reservations. Try asking me:
            </p>
            <div className="space-y-2 text-sm text-gray-600 text-left bg-white rounded-lg p-4 shadow-sm">
              <p className="font-medium text-gray-700">Sample queries:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>&quot;Book a flight to New York&quot;</li>
                <li>&quot;Check my booking status&quot;</li>
                <li>&quot;Cancel my reservation&quot;</li>
                <li>&quot;What flights are available to London?&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <Spinner size="sm" />
              </div>
              <div className="bg-gray-200 rounded-lg rounded-tl-none px-4 py-2">
                <p className="text-sm text-gray-600">Agent is typing...</p>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
