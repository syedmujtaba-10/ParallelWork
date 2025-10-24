import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

/**
 * Agent types available for routing
 */
export type AgentType = 'booking' | 'status' | 'cancellation' | 'unclear';

/**
 * Router Agent
 * Analyzes user intent and routes to the appropriate specialist agent
 */
export class RouterAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Determine user intent and route to appropriate agent
   */
  async route(userMessage: string): Promise<AgentType> {
    const systemPrompt = `You are a routing agent for a flight booking system. Your job is to analyze the user's message and determine which specialist agent should handle it.

Available agents:
1. "booking" - Handles booking new flights. Keywords: book, reserve, schedule, buy ticket, make reservation
2. "status" - Handles checking flight status and booking confirmations. Keywords: status, check, confirmation, when is, flight information
3. "cancellation" - Handles cancelling existing bookings. Keywords: cancel, remove, delete reservation
4. "unclear" - When the user's intent is not clear or doesn't match any category

Respond with ONLY ONE WORD: booking, status, cancellation, or unclear

Examples:
User: "I want to book flight AA101 for John Doe" -> booking
User: "What's the status of my booking BK-ABC123?" -> status
User: "Cancel my reservation BK-ABC123" -> cancellation
User: "Hello there" -> unclear`;

    try {
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage),
      ]);

      const intent = response.content.toString().toLowerCase().trim();

      // Validate and return intent
      if (
        intent === 'booking' ||
        intent === 'status' ||
        intent === 'cancellation' ||
        intent === 'unclear'
      ) {
        return intent as AgentType;
      }

      // Fallback to unclear if unexpected response
      return 'unclear';
    } catch (error) {
      console.error('Router Agent error:', error);
      return 'unclear';
    }
  }

  /**
   * Generate clarification message when intent is unclear
   */
  getClarificationMessage(): string {
    return `I'm here to help you with flight bookings! I can assist you with:

1. 📝 Booking new flights (e.g., "Book flight AA101 for John Doe")
2. 🔍 Checking flight status or booking confirmations (e.g., "What's the status of booking BK-ABC123?")
3. ❌ Cancelling existing bookings (e.g., "Cancel my reservation BK-ABC123")

How can I help you today?`;
  }
}
