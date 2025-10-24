import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Flight } from '../models/Flight';
import { Booking, IBooking } from '../models/Booking';

/**
 * Extracted booking information from user message
 */
interface BookingInfo {
  flightNumber?: string;
  passengerName?: string;
  passengerEmail?: string;
  travelDate?: string;
}

/**
 * Booking Agent
 * Handles flight booking requests with duplicate detection
 */
export class BookingAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Extract booking information from user message
   */
  private async extractBookingInfo(userMessage: string): Promise<BookingInfo> {
    const systemPrompt = `Extract flight booking information from the user's message.

Return a JSON object with these fields (use null if not mentioned):
- flightNumber: string (e.g., "AA101")
- passengerName: string (full name)
- passengerEmail: string (email address)
- travelDate: string (ISO date format if mentioned)

Example:
User: "Book flight AA101 for John Doe on 2024-02-15"
Response: {"flightNumber": "AA101", "passengerName": "John Doe", "passengerEmail": null, "travelDate": "2024-02-15"}`;

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
      console.error('Error extracting booking info:', error);
      return {};
    }
  }

  /**
   * Process booking request
   */
  async handleBooking(
    userMessage: string,
    userId: string,
    userEmail: string
  ): Promise<{ success: boolean; message: string; booking?: IBooking }> {
    try {
      // Extract booking information
      const bookingInfo = await this.extractBookingInfo(userMessage);

      // Validate required fields
      if (!bookingInfo.flightNumber) {
        return {
          success: false,
          message: 'Please provide a flight number. For example: "Book flight AA101"',
        };
      }

      if (!bookingInfo.passengerName) {
        return {
          success: false,
          message: 'Please provide the passenger name. For example: "Book flight AA101 for John Doe"',
        };
      }

      // Normalize flight number
      const flightNumber = bookingInfo.flightNumber.toUpperCase().trim();

      // Check if flight exists
      const flight = await Flight.findOne({ flightNumber });

      if (!flight) {
        return {
          success: false,
          message: `Flight ${flightNumber} not found. Please check the flight number and try again.`,
        };
      }

      // Check for duplicate booking (same user + same flight)
      const existingBooking = await Booking.findOne({
        userId,
        flightNumber,
        status: 'confirmed',
      });

      if (existingBooking) {
        return {
          success: false,
          message: `You already have a confirmed booking for flight ${flightNumber} (Confirmation: ${existingBooking.confirmationNumber}). If you want to make changes, please cancel the existing booking first.`,
        };
      }

      // Use provided email or default to user's email
      const passengerEmail = bookingInfo.passengerEmail || userEmail;

      // Use travel date or flight departure date
      const travelDate = bookingInfo.travelDate
        ? new Date(bookingInfo.travelDate)
        : flight.departureTime;

      // Create booking
      const booking = await Booking.create({
        userId,
        flightNumber,
        passengerName: bookingInfo.passengerName,
        passengerEmail,
        travelDate,
        status: 'confirmed',
      });

      // Populate booking with flight details
      await booking.populate('userId');

      return {
        success: true,
        message: `✅ Booking confirmed!

Flight: ${flight.airline} ${flightNumber}
Route: ${flight.origin} → ${flight.destination}
Departure: ${flight.departureTime.toLocaleString()}
Passenger: ${booking.passengerName}
Confirmation Number: ${booking.confirmationNumber}

Your booking has been successfully created. Save your confirmation number for future reference.`,
        booking,
      };
    } catch (error: any) {
      console.error('Booking Agent error:', error);
      return {
        success: false,
        message: `Sorry, there was an error processing your booking: ${error.message}`,
      };
    }
  }
}
