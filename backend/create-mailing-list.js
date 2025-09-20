const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function createMailingListCollection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log('✅ Connected to MongoDB!');
    
    const db = mongoose.connection.db;
    
    // Check if mailing_list collection exists
    const collections = await db.listCollections({ name: 'mailing_list' }).toArray();
    
    if (collections.length > 0) {
      console.log('✅ mailing_list collection already exists!');
    } else {
      console.log('🔄 Creating mailing_list collection...');
      await db.createCollection('mailing_list');
      console.log('✅ mailing_list collection created successfully!');
    }
    
    // Add a sample document
    const sampleData = {
      email: 'test@example.com',
      subscribedAt: new Date(),
      status: 'active'
    };
    
    const result = await db.collection('mailing_list').insertOne(sampleData);
    console.log('✅ Sample data inserted with ID:', result.insertedId);
    
    // List all collections to confirm
    const allCollections = await db.listCollections().toArray();
    console.log('📋 All collections in disaster-prep database:');
    allCollections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMailingListCollection();
