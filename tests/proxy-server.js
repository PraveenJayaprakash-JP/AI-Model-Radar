const http = require('http');
const https = require('https');

const TARGET_URL = 'https://web-dashboard-omega-cyan.vercel.app';
const PORT = 3000;

const proxy = http.createServer((req, res) => {
  const url = TARGET_URL + req.url;
  
  console.log(`Proxying: ${req.method} ${req.url} -> ${url}`);
  
  const protocol = url.startsWith('https') ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: url.hostname
    }
  };
  
  const proxyReq = protocol.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  
  req.pipe(proxyReq, { end: true });
  
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502);
    res.end('Bad Gateway');
  });
});

proxy.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Forwarding to: ${TARGET_URL}`);
});