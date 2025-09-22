// Working Express server based on ultra-minimal success
console.log('🚀 Starting working Express server...');

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const app = express();

// Middleware
app.use(express.json());

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  console.log('✅ Serving static files from build directory');
}

// Health check endpoint (simple, no dependencies)
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test endpoint hit');
  res.json({ 
    message: 'Working Express server is responding!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ /api/health endpoint hit');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit');
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    res.json({ 
      message: 'Working Express server is running!',
      status: 'OK',
      timestamp: new Date().toISOString(),
      port: PORT
    });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    console.log(`📄 Serving React app for route: ${req.url}`);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
  console.log(`✅ Working Express server running on http://[::]:${PORT}`);
  console.log(`✅ Health check: http://[::]:${PORT}/api/test`);
  console.log(`✅ Root: http://[::]:${PORT}/`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
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
