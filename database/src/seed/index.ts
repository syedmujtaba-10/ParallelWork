import { connectDB, disconnectDB } from '../utils/connection';
import { seedUsers } from './users';
import { seedFlights } from './flights';
import { seedBookings } from './bookings';

const seedAll = async (): Promise<void> => {
  try {
    console.log('\n🚀 Starting database seeding process...\n');

    await connectDB();

    // Seed in order: Users first (required for bookings), then flights, then bookings
    await seedUsers();
    console.log('');

    await seedFlights();
    console.log('');

    await seedBookings();
    console.log('');

    console.log('✨ All data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   👥 10 test users created');
    console.log('   ✈️  25 flights available');
    console.log('   🎫 15 bookings created');
    console.log('\n🔑 Test User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Email: jane@example.com');
    console.log('   Email: bob@example.com');
    console.log('   Password (all users): password123\n');

    await disconnectDB();
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

// Run
seedAll();
