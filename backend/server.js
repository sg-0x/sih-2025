const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow video and PDF files
    const allowedTypes = /video\/|application\/pdf/;
    const extname = allowedTypes.test(file.mimetype);
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video and PDF files are allowed'));
    }
  }
});

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user to their role room
  socket.on('join-role', (role) => {
    socket.join(`role_${role}`);
    console.log(`User joined role: ${role}`);
  });
  
  // Join user to their institution room
  socket.on('join-institution', (institution) => {
    socket.join(`institution_${institution}`);
    console.log(`User joined institution: ${institution}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Additional route to serve files with proper headers
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Set appropriate headers based on file type
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
  } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(ext)) {
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
  }
  
  res.sendFile(filePath);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Get alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const { region, alertType, severity, page = 1, limit = 10 } = req.query;
    
    // Check if collection exists, if not return empty array
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'alerts');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: {
          alerts: [],
          pagination: {
            current: parseInt(page),
            pages: 0,
            total: 0
          }
        }
      });
    }
    
    const filter = { status: 'active' };
    if (region) filter.region = region;
    if (alertType) filter.alertType = alertType;
    if (severity) filter.severity = severity;
    
    const alerts = await mongoose.connection.db.collection('alerts')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .toArray();
    
    const total = await mongoose.connection.db.collection('alerts').countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create alert
app.post('/api/alerts', async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      status: 'active',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ensure collection exists
    await mongoose.connection.db.createCollection('alerts');
    
    const result = await mongoose.connection.db.collection('alerts').insertOne(alertData);
    
    // Broadcast to all users
    io.emit('newAlert', {
      type: 'alert',
      id: result.insertedId,
      title: alertData.title,
      description: alertData.description,
      alertType: alertData.alertType,
      severity: alertData.severity,
      region: alertData.region,
      affectedAreas: alertData.affectedAreas,
      validFrom: alertData.validFrom,
      validUntil: alertData.validUntil,
      createdAt: alertData.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Alert created and broadcasted successfully',
      data: { _id: result.insertedId, ...alertData }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create drill announcement
app.post('/api/drill-announcements', async (req, res) => {
  try {
    const announcementData = {
      ...req.body,
      type: 'drill_announcement',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ensure collection exists
    await mongoose.connection.db.createCollection('drill_announcements');
    
    const result = await mongoose.connection.db.collection('drill_announcements').insertOne(announcementData);
    
    // Broadcast to all users
    io.emit('newDrillAnnouncement', {
      type: 'drill_announcement',
      id: result.insertedId,
      title: announcementData.title,
      message: announcementData.message,
      drillType: announcementData.drillType,
      priority: announcementData.priority,
      targetClasses: announcementData.targetClasses,
      teacherName: announcementData.teacherName,
      institution: announcementData.institution,
      createdAt: announcementData.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Drill announcement created and broadcasted successfully',
      data: { _id: result.insertedId, ...announcementData }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create emergency alert
app.post('/api/emergency-alerts', async (req, res) => {
  try {
    const emergencyData = {
      ...req.body,
      type: 'emergency_alert',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ensure collection exists
    await mongoose.connection.db.createCollection('emergency_alerts');
    
    const result = await mongoose.connection.db.collection('emergency_alerts').insertOne(emergencyData);
    
    // Broadcast to all users
    io.emit('newEmergencyAlert', {
      type: 'emergency_alert',
      id: result.insertedId,
      title: emergencyData.title,
      message: emergencyData.message,
      severity: emergencyData.severity,
      region: emergencyData.region,
      affectedAreas: emergencyData.affectedAreas,
      createdAt: emergencyData.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Emergency alert created and broadcasted successfully',
      data: { _id: result.insertedId, ...emergencyData }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get drill announcements
app.get('/api/drill-announcements', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Check if collection exists, if not return empty array
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'drill_announcements');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: {
          announcements: [],
          pagination: {
            current: parseInt(page),
            pages: 0,
            total: 0
          }
        }
      });
    }
    
    const announcements = await mongoose.connection.db.collection('drill_announcements')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .toArray();
    
    const total = await mongoose.connection.db.collection('drill_announcements').countDocuments({ status: 'active' });
    
    res.json({
      success: true,
      data: {
        announcements,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get emergency alerts
app.get('/api/emergency-alerts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Check if collection exists, if not return empty array
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'emergency_alerts');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: {
          alerts: [],
          pagination: {
            current: parseInt(page),
            pages: 0,
            total: 0
          }
        }
      });
    }
    
    const alerts = await mongoose.connection.db.collection('emergency_alerts')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .toArray();
    
    const total = await mongoose.connection.db.collection('emergency_alerts').countDocuments({ status: 'active' });
    
    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get alert statistics
app.get('/api/alerts/stats', async (req, res) => {
  try {
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'alerts');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: {
          stats: {
            total: 0,
            active: 0,
            byType: {},
            bySeverity: {},
            byRegion: {},
            recent: 0
          }
        }
      });
    }
    
    const alerts = await mongoose.connection.db.collection('alerts').find({}).toArray();
    
    const stats = {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      byType: {},
      bySeverity: {},
      byRegion: {},
      recent: alerts.filter(a => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(a.createdAt) > weekAgo;
      }).length
    };

    alerts.forEach(alert => {
      // Count by type
      stats.byType[alert.alertType] = (stats.byType[alert.alertType] || 0) + 1;
      
      // Count by severity
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;
      
      // Count by region
      stats.byRegion[alert.region] = (stats.byRegion[alert.region] || 0) + 1;
    });

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Teacher Actions Endpoints

// Assign module to classes
app.post('/api/teacher-actions/assign-module', async (req, res) => {
  try {
    const moduleData = {
      ...req.body,
      type: 'module_assignment',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ensure collection exists
    await mongoose.connection.db.createCollection('assigned_modules');
    
    const result = await mongoose.connection.db.collection('assigned_modules').insertOne(moduleData);
    
    // Broadcast to all users
    io.emit('moduleAssigned', {
      type: 'module_assignment',
      id: result.insertedId,
      title: moduleData.title,
      description: moduleData.description,
      dueDate: moduleData.dueDate,
      estimatedTime: moduleData.estimatedTime,
      targetClasses: moduleData.targetClasses,
      teacherName: moduleData.teacherName,
      files: moduleData.files,
      assignedAt: moduleData.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Module assigned successfully',
      data: { _id: result.insertedId, ...moduleData }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirm drill slot
app.post('/api/teacher-actions/confirm-drill', async (req, res) => {
  try {
    const drillData = {
      ...req.body,
      type: 'drill_confirmation',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ensure collection exists
    await mongoose.connection.db.createCollection('confirmed_drills');
    
    const result = await mongoose.connection.db.collection('confirmed_drills').insertOne(drillData);
    
    // Broadcast to all users
    io.emit('drillConfirmed', {
      type: 'drill_confirmation',
      id: result.insertedId,
      title: drillData.title,
      description: drillData.description,
      scheduledDate: drillData.scheduledDate,
      scheduledTime: drillData.scheduledTime,
      location: drillData.location,
      drillType: drillData.drillType,
      targetClasses: drillData.targetClasses,
      teacherName: drillData.teacherName,
      confirmedAt: drillData.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Drill confirmed successfully',
      data: { _id: result.insertedId, ...drillData }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get assigned modules for students
app.get('/api/teacher-actions/assigned-modules', async (req, res) => {
  try {
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'assigned_modules');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: { modules: [] }
      });
    }
    
    const modules = await mongoose.connection.db.collection('assigned_modules')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Add full URLs to files
    const modulesWithUrls = modules.map(module => {
      if (module.files) {
        if (module.files.video) {
          // If URL already exists, keep it; otherwise construct it
          if (!module.files.video.url) {
            if (module.files.video.filename) {
              module.files.video.url = `http://localhost:5000/uploads/${module.files.video.filename}`;
            } else {
              // For existing data without filename, use a default approach
              // Try to match by file type and size
              try {
                const uploadsDir = path.join(__dirname, 'uploads');
                if (fs.existsSync(uploadsDir)) {
                  const videoFiles = fs.readdirSync(uploadsDir)
                    .filter(file => file.includes('mp4') || file.includes('avi') || file.includes('mov') || file.includes('wmv'));
                  if (videoFiles.length > 0) {
                    module.files.video.url = `http://localhost:5000/uploads/${videoFiles[0]}`;
                  }
                }
              } catch (error) {
                console.error('Error reading uploads directory:', error);
              }
            }
          }
        }
        if (module.files.pdf) {
          // If URL already exists, keep it; otherwise construct it
          if (!module.files.pdf.url) {
            if (module.files.pdf.filename) {
              module.files.pdf.url = `http://localhost:5000/uploads/${module.files.pdf.filename}`;
            } else {
              // For existing data without filename, use a default approach
              try {
                const uploadsDir = path.join(__dirname, 'uploads');
                if (fs.existsSync(uploadsDir)) {
                  const pdfFiles = fs.readdirSync(uploadsDir)
                    .filter(file => file.includes('pdf'));
                  if (pdfFiles.length > 0) {
                    module.files.pdf.url = `http://localhost:5000/uploads/${pdfFiles[0]}`;
                  }
                }
              } catch (error) {
                console.error('Error reading uploads directory:', error);
              }
            }
          }
        }
      }
      return module;
    });
    
    res.json({
      success: true,
      data: { modules: modulesWithUrls }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get confirmed drills for students
app.get('/api/teacher-actions/confirmed-drills', async (req, res) => {
  try {
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'confirmed_drills');
    
    if (!collectionExists) {
      return res.json({
        success: true,
        data: { drills: [] }
      });
    }
    
    const drills = await mongoose.connection.db.collection('confirmed_drills')
      .find({ status: 'confirmed' })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: { drills }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`�� Server running on http://localhost:${PORT}`);
});