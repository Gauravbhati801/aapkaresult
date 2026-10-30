const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function resolveFilePath(urlStr, rootDir = ROOT_DIR) {
  let cleanUrl = (urlStr || '/').split('?')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';

  let filePath = path.join(rootDir, decodeURIComponent(cleanUrl));

  // If path has no extension and file.html exists, serve that
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let cleanUrl = req.url.split('?')[0];

  // API: Save News directly to data/news.json on disk
  if (req.method === 'POST' && cleanUrl === '/api/save-news') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const dataDir = path.join(ROOT_DIR, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const dataPath = path.join(dataDir, 'news.json');
        fs.writeFileSync(dataPath, JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`[API] Saved ${parsed.length} news items to data/news.json`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: parsed.length }));
      } catch (err) {
        console.error('[API Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Save Vacancies directly to data/vacancies.json on disk
  if (req.method === 'POST' && cleanUrl === '/api/save-vacancies') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const dataDir = path.join(ROOT_DIR, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const dataPath = path.join(dataDir, 'vacancies.json');
        fs.writeFileSync(dataPath, JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`[API] Saved ${parsed.length} vacancies to data/vacancies.json`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: parsed.length }));
      } catch (err) {
        console.error('[API Vacancies Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Upload Image directly to disk
  if (req.method === 'POST' && cleanUrl === '/api/upload-image') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const { filename, base64Data } = parsed;
        const cleanName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
        const targetPath = path.join(ROOT_DIR, cleanName);
        const pureBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(pureBase64, 'base64');
        fs.writeFileSync(targetPath, buffer);
        console.log(`[API] Saved uploaded image to ${cleanName} (${buffer.length} bytes)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filename: cleanName }));
      } catch (err) {
        console.error('[API Image Upload Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let filePath = resolveFilePath(req.url, ROOT_DIR);

  // Security check: ensure path is inside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested file does not exist locally.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log('========================================================');
    console.log('       AAPKA RESULT - LOCAL PREVIEW SERVER RUNNING       ');
    console.log('========================================================');
    console.log(`\n1. Computer Browser:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n2. Mobile Phone (Same Wi-Fi):`);
    console.log(`   http://${localIp}:${PORT}`);
    console.log(`\nDirect Links:`);
    console.log(`   http://localhost:${PORT}/ssc-cgl.html`);
    console.log(`   http://localhost:${PORT}/up-police-constable.html`);
    console.log(`   http://localhost:${PORT}/latest-jobs.html`);
    console.log('\n(Press Ctrl + C in this terminal to stop the server)\n');
  });
}

module.exports = { server, MIME_TYPES, resolveFilePath, PORT };

