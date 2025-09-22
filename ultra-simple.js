// Ultra simple server - no dependencies, just Node.js built-ins
console.log('🚀 Starting ultra simple server...');

const http = require('http');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const server = http.createServer((req, res) => {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/test') {
    console.log('✅ /api/test hit!');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Ultra simple server is working!',
      timestamp: new Date().toISOString(),
      status: 'OK',
      port: PORT
    }));
  } else {
    console.log('✅ Root hit!');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Ultra simple server is running!',
      timestamp: new Date().toISOString(),
      status: 'OK',
      port: PORT
    }));
  }
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Ultra simple server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/test`);
  console.log(`✅ Server ready!`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});
