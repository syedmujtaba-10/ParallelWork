import { RouterAgent, AgentType } from './routerAgent';
import { BookingAgent } from './bookingAgent';
import { StatusAgent } from './statusAgent';
import { CancellationAgent } from './cancellationAgent';

/**
 * Agent execution result
 */
export interface AgentResponse {
  success: boolean;
  message: string;
  agentType: AgentType;
  booking?: any;
}

/**
 * Graph Orchestrator
 * Coordinates the multi-agent system using a router-based approach
 */
export class GraphOrchestrator {
  private routerAgent: RouterAgent;
  private bookingAgent: BookingAgent;
  private statusAgent: StatusAgent;
  private cancellationAgent: CancellationAgent;

  constructor() {
    this.routerAgent = new RouterAgent();
    this.bookingAgent = new BookingAgent();
    this.statusAgent = new StatusAgent();
    this.cancellationAgent = new CancellationAgent();
  }

  /**
   * Process user message through the multi-agent system
   */
  async processMessage(
    userMessage: string,
    userId: string,
    userEmail: string
  ): Promise<AgentResponse> {
    try {
      // Step 1: Route to appropriate agent
      const agentType = await this.routerAgent.route(userMessage);

      console.log(`🔀 Router determined intent: ${agentType}`);

      // Step 2: Execute appropriate agent
      switch (agentType) {
        case 'booking':
          const bookingResult = await this.bookingAgent.handleBooking(
            userMessage,
            userId,
            userEmail
          );
          return {
            success: bookingResult.success,
            message: bookingResult.message,
            agentType: 'booking',
            booking: bookingResult.booking,
          };

        case 'status':
          const statusResult = await this.statusAgent.handleStatusCheck(
            userMessage,
            userId
          );
          return {
            success: statusResult.success,
            message: statusResult.message,
            agentType: 'status',
          };

        case 'cancellation':
          const cancellationResult = await this.cancellationAgent.handleCancellation(
            userMessage,
            userId
          );
          return {
            success: cancellationResult.success,
            message: cancellationResult.message,
            agentType: 'cancellation',
          };

        case 'unclear':
        default:
          return {
            success: false,
            message: this.routerAgent.getClarificationMessage(),
            agentType: 'unclear',
          };
      }
    } catch (error: any) {
      console.error('Graph Orchestrator error:', error);
      return {
        success: false,
        message: `Sorry, I encountered an error processing your request: ${error.message}`,
        agentType: 'unclear',
      };
    }
  }

  /**
   * Get orchestrator status
   */
  getStatus(): {
    agents: string[];
    status: string;
  } {
    return {
      agents: ['router', 'booking', 'status', 'cancellation'],
      status: 'operational',
    };
  }
}

// Export singleton instance
export const orchestrator = new GraphOrchestrator();
