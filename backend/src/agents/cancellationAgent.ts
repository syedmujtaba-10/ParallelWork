import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Booking } from '../models/Booking';
import { Flight } from '../models/Flight';

/**
 * Extracted cancellation query information
 */
interface CancellationQuery {
  confirmationNumber?: string;
  flightNumber?: string;
}

/**
 * Cancellation Agent
 * Handles booking cancellation requests
 */
export class CancellationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Extract cancellation query information from user message
   */
  private async extractCancellationQuery(
    userMessage: string
  ): Promise<CancellationQuery> {
    const systemPrompt = `Extract cancellation information from the user's message.

Return a JSON object with these fields (use null if not mentioned):
- confirmationNumber: string (e.g., "BK-ABC123" or "ABC123")
- flightNumber: string (e.g., "AA101")

Example:
User: "Cancel booking BK-ABC123"
Response: {"confirmationNumber": "BK-ABC123", "flightNumber": null}

User: "Cancel my flight AA101"
Response: {"confirmationNumber": null, "flightNumber": "AA101"}`;

    try {
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage),
      ]);

      const content = response.content.toString();
      const jsonMatch = content.match(/\{[^}]+\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {};
    } catch (error) {
      console.error('Error extracting cancellation query:', error);
      return {};
    }
  }

  /**
   * Process cancellation request
   */
  async handleCancellation(
    userMessage: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Extract query information
      const query = await this.extractCancellationQuery(userMessage);

      let booking = null;

      // Find booking by confirmation number (preferred)
      if (query.confirmationNumber) {
        const confirmationNumber = query.confirmationNumber.toUpperCase().trim();

        booking = await Booking.findOne({
          confirmationNumber,
          userId, // Ensure user can only cancel their own bookings
        });

        if (!booking) {
          return {
            success: false,
            message: `No booking found with confirmation number ${confirmationNumber}. Please check the number and try again.`,
          };
        }
      }
      // Find booking by flight number
      else if (query.flightNumber) {
        const flightNumber = query.flightNumber.toUpperCase().trim();

        booking = await Booking.findOne({
          userId,
          flightNumber,
          status: 'confirmed', // Only find confirmed bookings
        });

        if (!booking) {
          return {
            success: false,
            message: `You don't have a confirmed booking for flight ${flightNumber}. Please provide your confirmation number for more accurate cancellation.`,
          };
        }
      } else {
        return {
          success: false,
          message: 'Please provide a confirmation number or flight number to cancel. Example: "Cancel booking BK-ABC123"',
        };
      }

      // Check if already cancelled
      if (booking.status === 'cancelled') {
        return {
          success: false,
          message: `This booking (${booking.confirmationNumber}) has already been cancelled.`,
        };
      }

      // Get flight details for confirmation message
      const flight = await Flight.findOne({ flightNumber: booking.flightNumber });

      // Update booking status to cancelled
      booking.status = 'cancelled';
      await booking.save();

      let flightDetails = '';
      if (flight) {
        flightDetails = `\nFlight: ${flight.airline} ${flight.flightNumber}
Route: ${flight.origin} → ${flight.destination}
Departure: ${flight.departureTime.toLocaleString()}`;
      }

      return {
        success: true,
        message: `✅ Booking Cancelled Successfully

Confirmation Number: ${booking.confirmationNumber}
Passenger: ${booking.passengerName}${flightDetails}

Your booking has been cancelled. If you need to rebook, please create a new booking.`,
      };
    } catch (error: any) {
      console.error('Cancellation Agent error:', error);
      return {
        success: false,
        message: `Sorry, there was an error cancelling the booking: ${error.message}`,
      };
    }
  }
}
