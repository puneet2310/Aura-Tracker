import ClassSchedule from './models/ClassSchedule.models.js';
import classData from './utils/classData.js';
const seedDatabase = async () => {
  try {

    // Clear existing data
    await ClassSchedule.deleteMany({});
    console.log('Existing data cleared');

    // Insert classSchedule data
    await ClassSchedule.insertMany(classData);
    console.log('Sample data seeded successfully');

    } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Execute the seeding function
export default seedDatabase;
