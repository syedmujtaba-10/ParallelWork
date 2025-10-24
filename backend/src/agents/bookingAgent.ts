import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Flight, IFlight } from '../models/Flight';
import { Booking, IBooking } from '../models/Booking';

/**
 * Extracted booking information from user message
 */
interface BookingInfo {
  flightNumber?: string;
  passengerName?: string;
  passengerEmail?: string;
  travelDate?: string;
  destination?: string;
  origin?: string;
}

/**
 * Booking Agent
 * Handles flight booking requests with duplicate detection
 * Now supports intelligent flight search and suggestions
 */
export class BookingAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Extract booking information from user message
   */
  private async extractBookingInfo(userMessage: string): Promise<BookingInfo> {
    const systemPrompt = `Extract flight booking information from the user's message.

Return a JSON object with these fields (use null if not mentioned):
- flightNumber: string (e.g., "AA101") - ONLY if explicitly mentioned
- passengerName: string (full name)
- passengerEmail: string (email address)
- travelDate: string (ISO date format if mentioned)
- destination: string (city name or airport code like "New York", "NYC", "JFK", "LAX")
- origin: string (departure city or airport code)

Example:
User: "Book flight AA101 for John Doe on 2024-02-15"
Response: {"flightNumber": "AA101", "passengerName": "John Doe", "passengerEmail": null, "travelDate": "2024-02-15", "destination": null, "origin": null}

User: "Book a flight to New York for John Doe"
Response: {"flightNumber": null, "passengerName": "John Doe", "passengerEmail": null, "travelDate": null, "destination": "New York", "origin": null}`;

    try {
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage),
      ]);

      const content = response.content.toString();
      const jsonMatch = content.match(/\{[^}]+\}/);

      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]);
        console.log('📝 Extracted booking info:', extracted);
        return extracted;
      }

      return {};
    } catch (error: any) {
      console.error('❌ Error extracting booking info:', error.message);
      return {};
    }
  }

  /**
   * Search for flights to a destination
   */
  private async searchFlightsByDestination(destination: string): Promise<IFlight[]> {
    // Common city to airport code mappings
    const cityToAirport: { [key: string]: string[] } = {
      'new york': ['JFK', 'EWR', 'LGA'],
      'nyc': ['JFK', 'EWR', 'LGA'],
      'newyork': ['JFK', 'EWR', 'LGA'],
      'los angeles': ['LAX'],
      'la': ['LAX'],
      'chicago': ['ORD', 'MDW'],
      'san francisco': ['SFO'],
      'miami': ['MIA'],
      'boston': ['BOS'],
      'seattle': ['SEA'],
      'denver': ['DEN'],
      'atlanta': ['ATL'],
      'dallas': ['DFW'],
      'phoenix': ['PHX'],
      'las vegas': ['LAS'],
      'vegas': ['LAS'],
    };

    const normalizedDestination = destination.toLowerCase().trim();
    let airportCodes: string[] = [];

    // Check if it's a city name
    if (cityToAirport[normalizedDestination]) {
      airportCodes = cityToAirport[normalizedDestination];
    } else {
      // Assume it's already an airport code
      airportCodes = [destination.toUpperCase()];
    }

    console.log(`🔍 Searching flights to: ${destination} (codes: ${airportCodes.join(', ')})`);

    // Search for flights to any of these airports
    const flights = await Flight.find({
      destination: { $in: airportCodes },
      status: { $ne: 'cancelled' },
      availableSeats: { $gt: 0 },
    })
      .sort({ departureTime: 1 })
      .limit(5);

    return flights;
  }

  /**
   * Format flight suggestions for user
   */
  private formatFlightSuggestions(flights: IFlight[], destination: string): string {
    if (flights.length === 0) {
      return `Sorry, I couldn't find any available flights to ${destination} in our database.

Available destinations in our system include:
• New York (JFK, EWR)
• Los Angeles (LAX)
• Chicago (ORD)
• San Francisco (SFO)
• Miami (MIA)
• Seattle (SEA)
• Boston (BOS)
• Denver (DEN)
• Atlanta (ATL)
• Phoenix (PHX)
• Las Vegas (LAS)

Please specify a flight number from our available flights, or ask about flights to one of these destinations.`;
    }

    const suggestions = flights
      .map(
        (f, i) =>
          `${i + 1}. Flight ${f.flightNumber} - ${f.airline}
   Route: ${f.origin} → ${f.destination}
   Departure: ${new Date(f.departureTime).toLocaleString()}
   Price: $${f.price}
   Available Seats: ${f.availableSeats}`
      )
      .join('\n\n');

    return `I found ${flights.length} available flight(s) to ${destination}:

${suggestions}

To book one of these flights, please say:
"Book flight [FLIGHT_NUMBER] for [YOUR_NAME]"

For example: "Book flight ${flights[0].flightNumber} for John Doe"`;
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

      // Case 1: No flight number provided, but destination is mentioned
      if (!bookingInfo.flightNumber && bookingInfo.destination) {
        console.log(`🔍 No flight number provided. Searching flights to: ${bookingInfo.destination}`);

        const availableFlights = await this.searchFlightsByDestination(bookingInfo.destination);
        const suggestionMessage = this.formatFlightSuggestions(
          availableFlights,
          bookingInfo.destination
        );

        return {
          success: false,
          message: suggestionMessage,
        };
      }

      // Case 2: Neither flight number nor destination provided
      if (!bookingInfo.flightNumber && !bookingInfo.destination) {
        return {
          success: false,
          message: `I need more information to book a flight for you. Please provide either:

1. A specific flight number: "Book flight AA101 for John Doe"
2. A destination: "Book a flight to New York for John Doe"

You can also check available flights by asking: "Show me flights to Los Angeles"`,
        };
      }

      // Case 3: Flight number provided but no passenger name
      if (bookingInfo.flightNumber && !bookingInfo.passengerName) {
        const flightNum = bookingInfo.flightNumber;
        return {
          success: false,
          message: `Please provide the passenger name. For example: "Book flight ${flightNum} for John Doe"`,
        };
      }

      // Case 4: Proceed with booking (flight number and passenger name provided)
      if (!bookingInfo.flightNumber || !bookingInfo.passengerName) {
        // This shouldn't happen given earlier checks, but TypeScript needs reassurance
        return {
          success: false,
          message: 'Unable to process booking. Please provide both a flight number and passenger name.',
        };
      }

      // TypeScript now knows both flightNumber and passengerName are defined
      const flightNumber = bookingInfo.flightNumber.toUpperCase().trim();

      console.log(`✈️ Attempting to book flight ${flightNumber} for ${bookingInfo.passengerName}`);

      // Check if flight exists
      const flight = await Flight.findOne({ flightNumber });

      if (!flight) {
        // Flight not found - suggest alternatives
        console.log(`❌ Flight ${flightNumber} not found in database`);

        return {
          success: false,
          message: `Sorry, flight ${flightNumber} was not found in our system.

Please double-check the flight number, or ask me to search for flights:
• "Show me flights to New York"
• "What flights are available to Los Angeles?"
• "Find flights to Miami"

You can also list all available flights by asking: "Show me all flights"`,
        };
      }

      // Check if flight is available
      if (flight.status === 'cancelled') {
        return {
          success: false,
          message: `Flight ${flightNumber} has been cancelled and is no longer available for booking.

Would you like me to suggest alternative flights to ${flight.destination}?`,
        };
      }

      if (flight.availableSeats <= 0) {
        return {
          success: false,
          message: `Sorry, flight ${flightNumber} is fully booked (no available seats).

Would you like me to search for alternative flights to ${flight.destination}?`,
        };
      }

      // Check for duplicate booking (same user + same flight)
      const existingBooking = await Booking.findOne({
        userId,
        flightNumber,
        status: 'confirmed',
      });

      if (existingBooking) {
        console.log(`⚠️ Duplicate booking detected for user ${userId} and flight ${flightNumber}`);

        return {
          success: false,
          message: `You already have a confirmed booking for flight ${flightNumber}!

Your existing booking details:
• Confirmation Number: ${existingBooking.confirmationNumber}
• Passenger: ${existingBooking.passengerName}
• Travel Date: ${new Date(existingBooking.travelDate).toLocaleDateString()}

If you want to make changes, please cancel this booking first using:
"Cancel booking ${existingBooking.confirmationNumber}"`,
        };
      }

      // Use provided email or default to user's email
      const passengerEmail = bookingInfo.passengerEmail || userEmail;

      // Use travel date or flight departure date
      const travelDate = bookingInfo.travelDate
        ? new Date(bookingInfo.travelDate)
        : flight.departureTime;

      console.log(`💾 Creating booking: ${flightNumber} for ${bookingInfo.passengerName}`);

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

      console.log(`✅ Booking created successfully: ${booking.confirmationNumber}`);

      // Calculate flight duration for display
      const durationMinutes = Math.floor(
        (flight.arrivalTime.getTime() - flight.departureTime.getTime()) / (1000 * 60)
      );
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      return {
        success: true,
        message: `✅ Booking Confirmed Successfully!

📋 Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confirmation Number: ${booking.confirmationNumber}
Status: CONFIRMED

✈️ Flight Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Flight: ${flight.airline} ${flightNumber}
Route: ${flight.origin} → ${flight.destination}
Departure: ${new Date(flight.departureTime).toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
Arrival: ${new Date(flight.arrivalTime).toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
Duration: ${hours}h ${minutes}m
Price: $${flight.price}

👤 Passenger Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${booking.passengerName}
Email: ${booking.passengerEmail}

⚠️ Important: Save your confirmation number (${booking.confirmationNumber}) for future reference.

You can check your booking status anytime by saying:
"Check booking ${booking.confirmationNumber}"`,
        booking,
      };
    } catch (error: any) {
      console.error('❌ Booking Agent error:', error);

      // Handle specific errors
      if (error.code === 11000) {
        // Duplicate key error
        return {
          success: false,
          message: `A booking with these details already exists. Please check your existing bookings or try a different flight.`,
        };
      }

      if (error.name === 'ValidationError') {
        return {
          success: false,
          message: `Validation error: ${error.message}. Please check your input and try again.`,
        };
      }

      if (error.message?.includes('timeout')) {
        return {
          success: false,
          message: `The booking request timed out. Please try again. If the problem persists, the flight may not be available.`,
        };
      }

      return {
        success: false,
        message: `Sorry, I encountered an error while processing your booking. Please try again or contact support if the problem persists.

Error details: ${error.message}`,
      };
    }
  }
}
