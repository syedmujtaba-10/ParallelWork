import apiClient from './client';
import { ChatResponse } from '@/lib/types';

export async function sendChatMessage(
  message: string,
  token: string
): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>(
    '/api/chat',
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
