const http = require('node:http');

const port = Number.parseInt(process.env.PORT || '3000', 10) || 3000;

const req = http.get(
  {
    host: '127.0.0.1',
    port,
    path: '/api/health',
    timeout: 4000,
  },
  (res) => {
    res.resume();
    if (res.statusCode === 200) {
      process.exit(0);
    }
    console.error(`healthcheck failed: HTTP ${res.statusCode} on 127.0.0.1:${port}/api/health`);
    process.exit(1);
  }
);

req.on('timeout', () => {
  console.error(`healthcheck timeout on 127.0.0.1:${port}/api/health`);
  req.destroy();
  process.exit(1);
});

req.on('error', (err) => {
  console.error(`healthcheck error on 127.0.0.1:${port}/api/health: ${err.message}`);
  process.exit(1);
});
