import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full border-x border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Flight Booking Assistant</h1>
        <p className="text-sm text-gray-600">Chat with our AI to book and manage your flights</p>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <ChatContainer />
      </div>
    </div>
  );
}
