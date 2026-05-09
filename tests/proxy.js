const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const TARGET = 'https://web-dashboard-omega-cyan.vercel.app';

console.log('Starting proxy server...');
console.log('Target:', TARGET);
console.log('Port:', PORT);

const server = http.createServer((req, res) => {
  const targetUrl = url.parse(TARGET + req.url);
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${targetUrl.href}`);
  
  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.path,
    method: req.method,
    headers: {
      ...req.headers,
      'Host': targetUrl.hostname,
      'User-Agent': 'TestSprite-Proxy/1.0'
    }
  };

  const protocol = https;
  
  const proxyReq = protocol.request(options, (proxyRes) => {
    // Handle redirects
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      const redirectUrl = url.resolve(TARGET, proxyRes.headers.location);
      console.log('Redirect to:', redirectUrl);
      res.writeHead(proxyRes.statusCode, { 'Location': redirectUrl });
      res.end();
      return;
    }
    
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log('Proxy server running at http://localhost:' + PORT);
  console.log('Press Ctrl+C to stop');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});