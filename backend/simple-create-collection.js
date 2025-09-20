const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function createCollection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = mongoose.connection.db;
    
    // Create the user_points collection
    console.log('🔄 Creating user_points collection...');
    await db.createCollection('user_points');
    console.log('✅ Collection user_points created successfully!');
    
    // Create indexes
    console.log('🔄 Creating indexes...');
    await db.collection('user_points').createIndex({ userId: 1 });
    await db.collection('user_points').createIndex({ videoId: 1 });
    await db.collection('user_points').createIndex({ userId: 1, videoId: 1, completionPercentage: 1 });
    console.log('✅ Indexes created successfully!');
    
    console.log('🎉 Collection setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

createCollection();
