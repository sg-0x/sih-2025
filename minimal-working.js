// Minimal working server for Railway
console.log('🚀 Starting minimal working server...');

const express = require('express');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const app = express();

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 Request: ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ /api/test hit!');
  res.json({ 
    message: 'Minimal server is working!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root hit!');
  res.json({ 
    message: 'Minimal server is running!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/test`);
  console.log(`✅ Server ready!`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});
