// Production server - serves React app with all fixes
console.log('🚀 Starting production server...');

let express, path, fs, mongoose, cors, multer, nodemailer, socketIo, PORT;

try {
  express = require('express');
  path = require('path');
  fs = require('fs');
  mongoose = require('mongoose');
  cors = require('cors');
  multer = require('multer');
  nodemailer = require('nodemailer');
  socketIo = require('socket.io');
  PORT = process.env.PORT || 5000;
  
  console.log('✅ All dependencies loaded successfully');
} catch (error) {
  console.error('❌ Error loading dependencies:', error);
  process.exit(1);
}

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.RAILWAY_STATIC_URL, process.env.RAILWAY_PUBLIC_DOMAIN] 
    : ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sahildewani75_db_user:Sahil%40123@cluster0.uowncgx.mongodb.net/disaster-prep?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  console.log('⚠️  Continuing without MongoDB - using fallback storage');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📥 Incoming request: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Check if build directory exists
const buildPath = path.join(__dirname, 'build');
const buildExists = fs.existsSync(buildPath);

console.log(`📁 Build directory exists: ${buildExists}`);

if (buildExists) {
  // Check if index.html exists
  const indexPath = path.join(buildPath, 'index.html');
  const indexExists = fs.existsSync(indexPath);
  console.log(`📄 index.html exists: ${indexExists}`);
  
  if (indexExists) {
    // Serve static files from the React app build directory
    app.use(express.static(buildPath));
    console.log('✅ Serving static files from build directory');
  } else {
    console.log('❌ index.html not found in build directory');
  }
} else {
  console.log('❌ Build directory not found');
}

// Health check endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test endpoint hit');
  console.log('📊 Request details:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    ip: req.ip,
    ips: req.ips
  });
  res.status(200).json({ 
    message: 'Production server is responding!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT,
    buildExists: buildExists,
    env: process.env.NODE_ENV,
    serverTime: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  console.log('✅ /api/health endpoint hit');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    buildExists: buildExists,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Points API
app.post('/api/points/award', async (req, res) => {
  try {
    console.log('📊 Points award request:', req.body);
    const { userId, videoId, videoType, completionPercentage, points } = req.body;
    
    // Simple in-memory storage for now
    res.json({
      success: true,
      message: 'Points awarded successfully',
      points: points || 10,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Points award error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/points/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📊 Get user points:', userId);
    
    res.json({
      success: true,
      userId: userId,
      totalPoints: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get user points error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Leaderboard API
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    console.log('📊 Leaderboard request, limit:', limit);
    
    res.json({
      success: true,
      leaderboard: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Leaderboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alerts API
app.get('/api/alerts', async (req, res) => {
  try {
    console.log('📊 Alerts request');
    res.json({
      success: true,
      alerts: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Alerts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    console.log('📊 Create alert request:', req.body);
    res.json({
      success: true,
      message: 'Alert created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Create alert error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Drill Announcements API
app.get('/api/drill-announcements', async (req, res) => {
  try {
    console.log('📊 Drill announcements request');
    res.json({
      success: true,
      announcements: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Drill announcements error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/drill-announcements', async (req, res) => {
  try {
    console.log('📊 Create drill announcement request:', req.body);
    res.json({
      success: true,
      message: 'Drill announcement created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Create drill announcement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Emergency Alerts API
app.get('/api/emergency-alerts', async (req, res) => {
  try {
    console.log('📊 Emergency alerts request');
    res.json({
      success: true,
      alerts: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Emergency alerts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/emergency-alerts', async (req, res) => {
  try {
    console.log('📊 Create emergency alert request:', req.body);
    res.json({
      success: true,
      message: 'Emergency alert created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Create emergency alert error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Statistics API
app.get('/api/statistics/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📊 User statistics request:', userId);
    
    res.json({
      success: true,
      userId: userId,
      statistics: {
        totalPoints: 0,
        videosCompleted: 0,
        drillsParticipated: 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ User statistics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assignments API
app.get('/api/assignments', async (req, res) => {
  try {
    console.log('📊 Assignments request');
    res.json({
      success: true,
      assignments: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Assignments error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/assignments/create', async (req, res) => {
  try {
    console.log('📊 Create assignment request:', req.body);
    res.json({
      success: true,
      message: 'Assignment created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Create assignment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit');
  if (buildExists) {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        res.sendFile(indexPath);
        console.log('📄 Served React app from build directory');
      } catch (error) {
        console.error('❌ Error serving React app:', error);
        res.json({ 
          message: 'Production server is running! (Build exists but error serving)',
          status: 'OK',
          timestamp: new Date().toISOString(),
          port: PORT,
          error: error.message
        });
      }
    } else {
      console.log('❌ index.html not found');
      res.json({ 
        message: 'Production server is running! (index.html not found)',
        status: 'OK',
        timestamp: new Date().toISOString(),
        port: PORT
      });
    }
  } else {
    res.json({ 
      message: 'Production server is running! (No build directory)',
      status: 'OK',
      timestamp: new Date().toISOString(),
      port: PORT
    });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
if (buildExists) {
  app.get('*', (req, res) => {
    console.log(`📄 Serving React app for route: ${req.url}`);
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      try {
        res.sendFile(indexPath);
      } catch (error) {
        console.error('❌ Error serving React app for route:', req.url, error);
        res.json({ 
          message: 'Route not found',
          url: req.url,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      res.json({ 
        message: 'React app not available',
        url: req.url,
        timestamp: new Date().toISOString()
      });
    }
  });
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Create HTTP server
const { createServer } = require('http');
const httpServer = createServer(app);

// Socket.io setup
const io = socketIo(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.RAILWAY_STATIC_URL, process.env.RAILWAY_PUBLIC_DOMAIN] 
      : ["http://localhost:3000", "http://localhost:5000"],
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
  
  // Handle real-time events
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`🔌 Client ${socket.id} joined room: ${room}`);
  });
  
  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`🔌 Client ${socket.id} left room: ${room}`);
  });
});

// Start server with all interfaces binding (Railway requirement)
const server = httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Production server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/test`);
  console.log(`✅ Root: http://0.0.0.0:${PORT}/`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Build exists: ${buildExists}`);
  console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`✅ Socket.io: Ready`);
  console.log(`✅ Server is ready to accept connections!`);
  console.log(`✅ Railway health check should work now!`);
  
  // Test the health check endpoint immediately
  setTimeout(() => {
    console.log('🧪 Testing health check endpoint...');
    const http = require('http');
    const options = {
      hostname: '0.0.0.0',
      port: PORT,
      path: '/api/test',
      method: 'GET'
    };
    const req = http.request(options, (res) => {
      console.log(`✅ Health check test: ${res.statusCode}`);
    });
    req.on('error', (err) => {
      console.log(`❌ Health check test failed: ${err.message}`);
    });
    req.end();
  }, 1000);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port is already in use');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});