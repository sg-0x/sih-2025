// Ultra-minimal server - no dependencies, no build required
console.log('🚀 Starting ultra-minimal server (no build)...');

const http = require('http');
const PORT = process.env.PORT || 5000;

console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🌐 Port: ${PORT}`);

const server = http.createServer((req, res) => {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Ultra-minimal server working!',
    timestamp: new Date().toISOString(),
    url: req.url,
    port: PORT
  }));
});

server.listen(PORT, '::', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
