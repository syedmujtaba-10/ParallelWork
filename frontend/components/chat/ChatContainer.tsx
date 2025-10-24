'use client';

import React from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import Alert from '@/components/ui/Alert';

export default function ChatContainer() {
  const { messages, isLoading, error, sendMessage, clearError } = useChatStore();
  const { token } = useAuthStore();

  const handleSendMessage = async (text: string) => {
    if (token) {
      await sendMessage(text, token);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="p-4 border-b border-gray-200">
          <Alert type="error" onClose={clearError}>
            {error}
          </Alert>
        </div>
      )}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
