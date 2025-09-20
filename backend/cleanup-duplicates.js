const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

async function cleanupDuplicates() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = mongoose.connection.db;
    
    // Get all user_points documents
    const allPoints = await db.collection('user_points').find({}).toArray();
    console.log(`📊 Found ${allPoints.length} total documents`);
    
    // Group by userId and videoId
    const grouped = {};
    allPoints.forEach(doc => {
      const key = `${doc.userId}-${doc.videoId}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(doc);
    });
    
    console.log(`📊 Found ${Object.keys(grouped).length} unique user-video combinations`);
    
    // Process each group
    let deletedCount = 0;
    let updatedCount = 0;
    
    for (const [key, docs] of Object.entries(grouped)) {
      if (docs.length > 1) {
        console.log(`\n🔍 Processing ${key}: ${docs.length} documents`);
        
        // Sort by completion percentage (highest first)
        docs.sort((a, b) => b.completionPercentage - a.completionPercentage);
        
        // Keep the highest completion percentage document
        const keepDoc = docs[0];
        const deleteDocs = docs.slice(1);
        
        console.log(`  ✅ Keeping document with ${keepDoc.completionPercentage}% completion`);
        console.log(`  🗑️  Deleting ${deleteDocs.length} duplicate documents`);
        
        // Delete duplicate documents
        const deleteIds = deleteDocs.map(doc => doc._id);
        await db.collection('user_points').deleteMany({ _id: { $in: deleteIds } });
        deletedCount += deleteDocs.length;
        
        // Update the kept document to have the correct total points
        const userAllPoints = await db.collection('user_points')
          .find({ userId: keepDoc.userId })
          .toArray();
        
        const correctTotalPoints = userAllPoints.reduce((sum, entry) => sum + entry.points, 0);
        
        await db.collection('user_points').updateOne(
          { _id: keepDoc._id },
          { $set: { totalPoints: correctTotalPoints, lastUpdated: new Date() } }
        );
        
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Cleanup complete!`);
    console.log(`  🗑️  Deleted ${deletedCount} duplicate documents`);
    console.log(`  🔄 Updated ${updatedCount} documents with correct totals`);
    
    // Final count
    const finalCount = await db.collection('user_points').countDocuments();
    console.log(`📊 Final document count: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupDuplicates();
