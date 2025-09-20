const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function testMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test database operations
    const db = mongoose.connection.db;
    
    // Create mailing_list collection with sample data
    console.log('🔄 Creating mailing_list collection...');
    await db.createCollection('mailing_list');
    
    const mailingListData = {
      email: 'test@example.com',
      subscribedAt: new Date(),
      status: 'active'
    };
    
    await db.collection('mailing_list').insertOne(mailingListData);
    console.log('✅ Mailing list collection created with sample data');
    
    // Create drill_announcements collection with sample data
    console.log('🔄 Creating drill_announcements collection...');
    await db.createCollection('drill_announcements');
    
    const drillData = {
      title: 'Monthly Fire Drill',
      message: 'Scheduled fire drill for all students and staff',
      type: 'fire_drill',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('drill_announcements').insertOne(drillData);
    console.log('✅ Drill announcements collection created with sample data');
    
    // Create emergency_alerts collection with sample data
    console.log('🔄 Creating emergency_alerts collection...');
    await db.createCollection('emergency_alerts');
    
    const emergencyData = {
      title: 'Weather Alert',
      message: 'Heavy rain expected in the region',
      severity: 'medium',
      region: 'Mumbai',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('emergency_alerts').insertOne(emergencyData);
    console.log('✅ Emergency alerts collection created with sample data');
    
    // Create assigned_modules collection
    console.log('🔄 Creating assigned_modules collection...');
    await db.createCollection('assigned_modules');
    console.log('✅ Assigned modules collection created');
    
    // Create confirmed_drills collection
    console.log('🔄 Creating confirmed_drills collection...');
    await db.createCollection('confirmed_drills');
    console.log('✅ Confirmed drills collection created');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testMongoDB();
