// Final server with React build support - based on working Express simple server
console.log('🚀 Starting final server with React build support...');

const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const app = express();

// Middleware
app.use(express.json());

// Check if build directory exists
const buildPath = path.join(__dirname, 'build');
const buildExists = fs.existsSync(buildPath);

console.log(`📁 Build directory exists: ${buildExists}`);

// Serve static files from the React app build directory (if it exists)
if (buildExists) {
  app.use(express.static(buildPath));
  console.log('✅ Serving static files from build directory');
} else {
  console.log('⚠️  Build directory not found, serving JSON responses only');
}

// Health check endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test endpoint hit');
  res.json({ 
    message: 'Final server with React build support is responding!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT,
    buildExists: buildExists,
    env: process.env.NODE_ENV
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ /api/health endpoint hit');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    buildExists: buildExists
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit');
  if (buildExists) {
    try {
      res.sendFile(path.join(buildPath, 'index.html'));
      console.log('📄 Served React app from build directory');
    } catch (error) {
      console.error('❌ Error serving React app:', error);
      res.json({ 
        message: 'Final server is running! (Build exists but error serving)',
        status: 'OK',
        timestamp: new Date().toISOString(),
        port: PORT,
        error: error.message
      });
    }
  } else {
    res.json({ 
      message: 'Final server is running! (No build directory)',
      status: 'OK',
      timestamp: new Date().toISOString(),
      port: PORT
    });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing (if build exists)
if (buildExists) {
  app.get('*', (req, res) => {
    console.log(`📄 Serving React app for route: ${req.url}`);
    try {
      res.sendFile(path.join(buildPath, 'index.html'));
    } catch (error) {
      console.error('❌ Error serving React app for route:', req.url, error);
      res.json({ 
        message: 'Route not found',
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

// Start server with IPv6 binding (Railway requirement)
const server = app.listen(PORT, '::', () => {
  console.log(`✅ Final server running on http://[::]:${PORT}`);
  console.log(`✅ Health check: http://[::]:${PORT}/api/test`);
  console.log(`✅ Root: http://[::]:${PORT}/`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Build exists: ${buildExists}`);
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
