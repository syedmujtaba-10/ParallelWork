import { create } from 'zustand';
import { Message } from '@/lib/types';
import { sendChatMessage } from '@/lib/api/chat';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, token: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (text: string, token: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendChatMessage(text, token);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'agent',
        timestamp: new Date(),
        bookingData: response.booking,
      };

      set((state) => ({
        messages: [...state.messages, agentMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send message'
        : 'Failed to send message';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
