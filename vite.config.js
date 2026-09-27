import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];
        const match = url.match(/^\/api\/([a-zA-Z0-9_-]+)(\.php)?$/);
        if (match) {
          const endpoint = match[1];
          const dataFile = path.resolve(__dirname, 'public', 'data', `${endpoint}.json`);

          if (req.method === 'GET') {
            if (fs.existsSync(dataFile)) {
              const data = fs.readFileSync(dataFile, 'utf8');
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              res.end(data);
              return;
            } else {
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              res.end('[]');
              return;
            }
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                if (endpoint === 'upload') {
                  const parsed = JSON.parse(body);
                  const base64Data = parsed.image || parsed.data;
                  if (!base64Data) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                    res.end(JSON.stringify({ status: 'error', message: 'No image data provided' }));
                    return;
                  }
                  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
                  let ext = 'jpg';
                  let buffer;
                  if (matches) {
                    ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
                    buffer = Buffer.from(matches[2], 'base64');
                  } else {
                    buffer = Buffer.from(base64Data, 'base64');
                  }
                  const rawFilename = (parsed.filename || 'img').replace(/\.[^/.]+$/, '');
                  const cleanName = rawFilename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
                  const fileName = `${Date.now()}_${cleanName || 'img'}.${ext}`;

                  const uploadDir = path.resolve(__dirname, 'public', 'uploads');
                  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                  fs.writeFileSync(path.resolve(uploadDir, fileName), buffer);

                  const distUploadDir = path.resolve(__dirname, 'dist', 'uploads');
                  if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                    if (!fs.existsSync(distUploadDir)) fs.mkdirSync(distUploadDir, { recursive: true });
                    fs.writeFileSync(path.resolve(distUploadDir, fileName), buffer);
                  }

                  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                  res.end(JSON.stringify({ status: 'success', url: `/uploads/${fileName}` }));
                  return;
                }

                // Safeguard: Never let dummy mock articles or doctors overwrite real database
                if (endpoint === 'articles' && body.includes('کلونجی اور شہد') && body.length < 50000) {
                  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                  res.end(JSON.stringify({ status: 'ignored', message: 'Ignored dummy articles payload' }));
                  return;
                }
                if (endpoint === 'doctors' && body.length < 50000) {
                  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                  res.end(JSON.stringify({ status: 'ignored', message: 'Ignored dummy doctors payload' }));
                  return;
                }

                const dir = path.dirname(dataFile);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(dataFile, body, 'utf8');

                const distDataFile = path.resolve(__dirname, 'dist', 'data', `${endpoint}.json`);
                if (fs.existsSync(path.dirname(distDataFile))) {
                  fs.writeFileSync(distDataFile, body, 'utf8');
                }

                // If doctors endpoint, also write directly to src/data/doctorsData.json to permanently preserve admin edits in source code
                if (endpoint === 'doctors') {
                  const srcDocsFile = path.resolve(__dirname, 'src', 'data', 'doctorsData.json');
                  const srcDir = path.dirname(srcDocsFile);
                  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
                  fs.writeFileSync(srcDocsFile, body, 'utf8');
                }

                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({ status: 'success', message: `${endpoint} saved to file database` }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
