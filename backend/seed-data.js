const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false,
  bufferMaxEntries: 0
})
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully!');
    
    // Sample module data
    const sampleModules = [
      {
        title: "Earthquake Safety Basics",
        description: "Learn the fundamental safety procedures during an earthquake including the Drop, Cover, and Hold technique.",
        dueDate: "2024-01-15",
        estimatedTime: "15 minutes",
        targetClasses: ["Class 9", "Class 10", "Class 11", "Class 12"],
        teacherName: "Dr. Sarah Johnson",
        files: {
          video: {
            originalName: "earthquake-safety-basics.mp4",
            filename: "earthquake-safety-basics.mp4",
            size: 15728640,
            type: "video/mp4",
            url: "http://localhost:5000/uploads/earthquake-safety-basics.mp4"
          },
          pdf: {
            originalName: "earthquake-safety-guide.pdf",
            filename: "earthquake-safety-guide.pdf",
            size: 2048576,
            type: "application/pdf",
            url: "http://localhost:5000/uploads/earthquake-safety-guide.pdf"
          }
        },
        type: "module_assignment",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Fire Evacuation Procedures",
        description: "Comprehensive guide on fire safety, evacuation routes, and emergency response procedures.",
        dueDate: "2024-01-20",
        estimatedTime: "20 minutes",
        targetClasses: ["Class 8", "Class 9", "Class 10"],
        teacherName: "Prof. Michael Chen",
        files: {
          video: {
            originalName: "fire-evacuation-procedures.mp4",
            filename: "fire-evacuation-procedures.mp4",
            size: 25165824,
            type: "video/mp4",
            url: "http://localhost:5000/uploads/fire-evacuation-procedures.mp4"
          }
        },
        type: "module_assignment",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sample drill data
    const sampleDrills = [
      {
        title: "Monthly Earthquake Drill",
        description: "Practice earthquake safety procedures including evacuation and assembly point procedures.",
        scheduledDate: "2024-01-25",
        scheduledTime: "10:00",
        location: "Main Assembly Hall",
        drillType: "Earthquake",
        targetClasses: ["All Classes"],
        teacherName: "Dr. Sarah Johnson",
        type: "drill_confirmation",
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Fire Safety Drill",
        description: "Emergency evacuation drill to test fire safety procedures and assembly point protocols.",
        scheduledDate: "2024-01-30",
        scheduledTime: "14:30",
        location: "School Grounds",
        drillType: "Fire Safety",
        targetClasses: ["Class 9", "Class 10", "Class 11", "Class 12"],
        teacherName: "Prof. Michael Chen",
        type: "drill_confirmation",
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    try {
      // Insert sample modules
      const moduleResult = await mongoose.connection.db.collection('assigned_modules').insertMany(sampleModules);
      console.log(`✅ Inserted ${moduleResult.insertedCount} sample modules`);

      // Insert sample drills
      const drillResult = await mongoose.connection.db.collection('confirmed_drills').insertMany(sampleDrills);
      console.log(`✅ Inserted ${drillResult.insertedCount} sample drills`);

      console.log('🎉 Sample data seeded successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

