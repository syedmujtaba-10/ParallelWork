import { connectDB, disconnectDB } from '../utils/connection';
import Flight from '../schemas/Flight';
import flightsData from '../data/flights.json';

export const seedFlights = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding flights...');

    // Clear existing flights
    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing flights');

    // Insert new flights
    const flights = await Flight.insertMany(flightsData);
    console.log(`✅ Successfully seeded ${flights.length} flights`);

    // Display sample flights
    console.log('\n📋 Sample flights:');
    flights.slice(0, 5).forEach(flight => {
      console.log(`   ✈️  ${flight.flightNumber} - ${flight.origin} → ${flight.destination} ($${flight.price})`);
    });
    if (flights.length > 5) {
      console.log(`   ... and ${flights.length - 5} more flights`);
    }
  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedFlights();
    await disconnectDB();
  })();
}
