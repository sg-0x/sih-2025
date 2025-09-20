const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function createUsersCollection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = mongoose.connection.db;
    
    // Create the users collection
    console.log('🔄 Creating users collection...');
    await db.createCollection('users');
    console.log('✅ Collection users created successfully!');
    
    // Insert sample users
    console.log('🔄 Inserting sample users...');
    
    const sampleUsers = [
      {
        name: 'Sahil dewani',
        email: 'sahildewani75@gmail.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543210',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'teacher1@d-prep.edu',
        role: 'teacher',
        institution: 'Delhi University',
        phone: '9876543211',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Prof. Rajesh Kumar',
        email: 'teacher2@d-prep.edu',
        role: 'teacher',
        institution: 'IIT Delhi',
        phone: '9876543212',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Ms. Priya Sharma',
        email: 'teacher3@d-prep.edu',
        role: 'teacher',
        institution: 'JNU',
        phone: '9876543213',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'System Administrator',
        email: 'admin@d-prep.edu',
        role: 'admin',
        institution: 'D-Prep Platform',
        phone: '9876543214',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543215',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543216',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543217',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543218',
        createdAt: new Date(),
        isActive: true
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'student',
        institution: 'BML Munjal University',
        phone: '9876543219',
        createdAt: new Date(),
        isActive: true
      }
    ];
    
    const result = await db.collection('users').insertMany(sampleUsers);
    console.log(`✅ Inserted ${result.insertedCount} users successfully!`);
    
    // Create indexes for better performance
    console.log('🔄 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ institution: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    console.log('✅ Indexes created successfully!');
    
    console.log('🎉 Users collection setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createUsersCollection();
