const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function createUserPointsCollection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create the user_points collection
    console.log('🔄 Creating user_points collection...');
    
    const db = mongoose.connection.db;
    
    // Check if collection already exists
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'user_points');
    
    if (collectionExists) {
      console.log('⚠️  Collection user_points already exists');
    } else {
      // Create the collection
      await db.createCollection('user_points');
      console.log('✅ Collection user_points created successfully!');
    }
    
    // Create indexes for better performance
    console.log('🔄 Creating indexes...');
    
    await db.collection('user_points').createIndex({ userId: 1 });
    await db.collection('user_points').createIndex({ videoId: 1 });
    await db.collection('user_points').createIndex({ userId: 1, videoId: 1, completionPercentage: 1 });
    await db.collection('user_points').createIndex({ awardedAt: -1 });
    
    console.log('✅ Indexes created successfully!');
    
    // Insert a sample document to verify the collection works
    console.log('🔄 Inserting sample document...');
    
    const sampleDocument = {
      userId: 'sample-user',
      videoId: 'sample-video',
      videoType: 'drill',
      completionPercentage: 100,
      points: 100,
      totalPoints: 100,
      awardedAt: new Date()
    };
    
    const result = await db.collection('user_points').insertOne(sampleDocument);
    console.log('✅ Sample document inserted with ID:', result.insertedId);
    
    // Count documents in the collection
    const count = await db.collection('user_points').countDocuments();
    console.log(`📊 Collection user_points now has ${count} document(s)`);
    
    console.log('🎉 Collection setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating collection:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the function
createUserPointsCollection();
