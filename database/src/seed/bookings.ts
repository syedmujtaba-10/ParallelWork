import { connectDB, disconnectDB } from '../utils/connection';
import Booking from '../schemas/Booking';
import User from '../schemas/User';
import bookingsData from '../data/bookings.json';

export const seedBookings = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding bookings...');

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing bookings');

    // Create bookings with proper userId references
    const bookings = [];
    for (const bookingData of bookingsData) {
      // Find user by email
      const user = await User.findOne({ email: bookingData.userEmail });

      if (!user) {
        console.warn(`⚠️  User not found: ${bookingData.userEmail}, skipping booking`);
        continue;
      }

      // Create booking
      const booking = new Booking({
        userId: user._id,
        flightNumber: bookingData.flightNumber,
        passengerName: bookingData.passengerName,
        passengerEmail: bookingData.passengerEmail,
        status: bookingData.status,
        travelDate: bookingData.travelDate
      });

      await booking.save();
      bookings.push(booking);
    }

    console.log(`✅ Successfully seeded ${bookings.length} bookings`);

    // Display sample bookings
    console.log('\n📋 Sample bookings:');
    bookings.slice(0, 5).forEach(booking => {
      console.log(`   🎫 ${booking.confirmationNumber} - ${booking.flightNumber} (${booking.status})`);
    });
    if (bookings.length > 5) {
      console.log(`   ... and ${bookings.length - 5} more bookings`);
    }
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedBookings();
    await disconnectDB();
  })();
}
