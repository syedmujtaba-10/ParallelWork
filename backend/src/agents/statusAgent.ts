import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Flight } from '../models/Flight';
import { Booking } from '../models/Booking';

/**
 * Extracted status query information
 */
interface StatusQuery {
  confirmationNumber?: string;
  flightNumber?: string;
}

/**
 * Status Agent
 * Handles flight status and booking confirmation queries
 */
export class StatusAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Extract status query information from user message
   */
  private async extractStatusQuery(userMessage: string): Promise<StatusQuery> {
    const systemPrompt = `Extract status query information from the user's message.

Return a JSON object with these fields (use null if not mentioned):
- confirmationNumber: string (e.g., "BK-ABC123" or "ABC123")
- flightNumber: string (e.g., "AA101")

Example:
User: "What's the status of booking BK-ABC123?"
Response: {"confirmationNumber": "BK-ABC123", "flightNumber": null}

User: "Check flight AA101"
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
      console.error('Error extracting status query:', error);
      return {};
    }
  }

  /**
   * Process status check request
   */
  async handleStatusCheck(
    userMessage: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Extract query information
      const query = await this.extractStatusQuery(userMessage);

      // Check by confirmation number first (more specific)
      if (query.confirmationNumber) {
        const confirmationNumber = query.confirmationNumber.toUpperCase().trim();

        const booking = await Booking.findOne({
          confirmationNumber,
          userId, // Ensure user can only see their own bookings
        });

        if (!booking) {
          return {
            success: false,
            message: `No booking found with confirmation number ${confirmationNumber}. Please check the number and try again.`,
          };
        }

        // Get flight details
        const flight = await Flight.findOne({ flightNumber: booking.flightNumber });

        if (!flight) {
          return {
            success: true,
            message: `📋 Booking Status

Confirmation Number: ${booking.confirmationNumber}
Status: ${booking.status.toUpperCase()}
Passenger: ${booking.passengerName}
Flight: ${booking.flightNumber}
Travel Date: ${booking.travelDate.toLocaleDateString()}

(Flight details not available)`,
          };
        }

        const statusIcon = booking.status === 'confirmed' ? '✅' : '❌';

        return {
          success: true,
          message: `${statusIcon} Booking Status

Confirmation Number: ${booking.confirmationNumber}
Status: ${booking.status.toUpperCase()}
Passenger: ${booking.passengerName}

Flight Details:
Flight: ${flight.airline} ${flight.flightNumber}
Route: ${flight.origin} → ${flight.destination}
Departure: ${flight.departureTime.toLocaleString()}
Arrival: ${flight.arrivalTime.toLocaleString()}
Flight Status: ${flight.status.toUpperCase()}
Price: $${flight.price}`,
        };
      }

      // Check by flight number
      if (query.flightNumber) {
        const flightNumber = query.flightNumber.toUpperCase().trim();

        const flight = await Flight.findOne({ flightNumber });

        if (!flight) {
          return {
            success: false,
            message: `Flight ${flightNumber} not found. Please check the flight number and try again.`,
          };
        }

        // Check if user has bookings for this flight
        const userBooking = await Booking.findOne({
          userId,
          flightNumber,
          status: 'confirmed',
        });

        let bookingInfo = '';
        if (userBooking) {
          bookingInfo = `\n\n📋 Your Booking:
Confirmation Number: ${userBooking.confirmationNumber}
Passenger: ${userBooking.passengerName}
Status: CONFIRMED`;
        }

        return {
          success: true,
          message: `✈️ Flight Information

Flight: ${flight.airline} ${flight.flightNumber}
Route: ${flight.origin} → ${flight.destination}
Departure: ${flight.departureTime.toLocaleString()}
Arrival: ${flight.arrivalTime.toLocaleString()}
Status: ${flight.status.toUpperCase()}
Price: $${flight.price}
Available Seats: ${flight.availableSeats}${bookingInfo}`,
        };
      }

      // No specific query found - show user's bookings
      const userBookings = await Booking.find({
        userId,
        status: 'confirmed',
      }).limit(5);

      if (userBookings.length === 0) {
        return {
          success: false,
          message: 'You have no confirmed bookings. To check a specific booking, provide your confirmation number (e.g., "Check booking BK-ABC123").',
        };
      }

      const bookingsList = userBookings
        .map(
          (b) =>
            `• ${b.confirmationNumber} - Flight ${b.flightNumber} - ${b.passengerName}`
        )
        .join('\n');

      return {
        success: true,
        message: `📋 Your Recent Bookings:\n\n${bookingsList}\n\nTo see details, use: "Check booking [confirmation number]"`,
      };
    } catch (error: any) {
      console.error('Status Agent error:', error);
      return {
        success: false,
        message: `Sorry, there was an error checking the status: ${error.message}`,
      };
    }
  }
}
