const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected successfully!');
    
    const db = mongoose.connection.db;
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    // Try to create user_points collection
    try {
      await db.createCollection('user_points');
      console.log('✅ user_points collection created!');
    } catch (err) {
      if (err.code === 48) {
        console.log('⚠️  Collection user_points already exists');
      } else {
        throw err;
      }
    }
    
    // Test inserting a document
    const testDoc = {
      userId: 'test-user',
      videoId: 'test-video',
      videoType: 'drill',
      completionPercentage: 100,
      points: 100,
      totalPoints: 100,
      awardedAt: new Date()
    };
    
    const result = await db.collection('user_points').insertOne(testDoc);
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Count documents
    const count = await db.collection('user_points').countDocuments();
    console.log(`📊 Collection has ${count} documents`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

testConnection();
