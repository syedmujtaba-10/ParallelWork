import { connectDB, disconnectDB } from '../utils/connection';
import User from '../schemas/User';
import usersData from '../data/users.json';

export const seedUsers = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding users...');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert new users (passwords will be hashed by the pre-save hook)
    const users = await User.insertMany(usersData);
    console.log(`✅ Successfully seeded ${users.length} users`);

    // Display created users (without passwords)
    users.forEach(user => {
      console.log(`   📧 ${user.email} - ${user.name}`);
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedUsers();
    await disconnectDB();
  })();
}
