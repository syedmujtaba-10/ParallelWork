import { connectDB, disconnectDB } from '../utils/connection';
import User from '../schemas/User';
import Flight from '../schemas/Flight';
import Booking from '../schemas/Booking';

const clearDatabase = async (): Promise<void> => {
  try {
    console.log('🗑️  Clearing all collections...');

    const usersDeleted = await User.deleteMany({});
    console.log(`   ✅ Deleted ${usersDeleted.deletedCount} users`);

    const flightsDeleted = await Flight.deleteMany({});
    console.log(`   ✅ Deleted ${flightsDeleted.deletedCount} flights`);

    const bookingsDeleted = await Booking.deleteMany({});
    console.log(`   ✅ Deleted ${bookingsDeleted.deletedCount} bookings`);

    console.log('\n✨ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

// Run
(async () => {
  await connectDB();
  await clearDatabase();
  await disconnectDB();
})();
