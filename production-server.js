// Production server - serves React app with all fixes
console.log('🚀 Starting production server...');

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
  res.json({ 
    message: 'Production server is responding!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    port: PORT,
    buildExists: buildExists,
    env: process.env.NODE_ENV,
    serverTime: new Date().toISOString()
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

// Start server with all interfaces binding (Railway requirement)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Production server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/test`);
  console.log(`✅ Root: http://0.0.0.0:${PORT}/`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Build exists: ${buildExists}`);
  console.log(`✅ Server is ready to accept connections!`);
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