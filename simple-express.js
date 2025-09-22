// Simple Express server based on ultra-minimal success
console.log('🚀 Starting simple Express server...');

const express = require('express');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const app = express();

// Basic middleware
app.use(express.json());

// Health check endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test endpoint hit');
  res.json({ 
    message: 'Simple Express server is responding!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit');
  res.json({ 
    message: 'Simple Express server is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

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
  console.log(`✅ Simple Express server running on http://[::]:${PORT}`);
  console.log(`✅ Health check: http://[::]:${PORT}/api/test`);
  console.log(`✅ Root: http://[::]:${PORT}/`);
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
