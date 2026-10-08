import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_SECRET_KEY = 'tabeeb_pedia_secure_persistent_secret_key_2026_x87f63d9a1e4b8c2';

function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let cleaned = (str || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
  let binary = '';
  for (let i = 0; i < cleaned.length; i++) {
    let val = alphabet.indexOf(cleaned[i]);
    if (val === -1) continue;
    binary += val.toString(2).padStart(5, '0');
  }
  let bytes = [];
  for (let i = 0; i + 8 <= binary.length; i += 8) {
    bytes.push(parseInt(binary.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function verifyTotp(secret, code, discrepancy = 1) {
  try {
    const key = base32Decode(secret);
    if (!key || key.length === 0) return false;
    const timeStep = Math.floor(Date.now() / 1000 / 30);
    for (let i = -discrepancy; i <= discrepancy; i++) {
      const step = timeStep + i;
      const buf = Buffer.alloc(8);
      buf.writeUInt32BE(0, 0);
      buf.writeUInt32BE(step, 4);
      const hmac = crypto.createHmac('sha1', key).update(buf).digest();
      const offset = hmac[hmac.length - 1] & 0x0f;
      const binCode = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
      const calculated = binCode.toString().padStart(6, '0');
      if (calculated === String(code).trim()) return true;
    }
  } catch (e) {
    console.error('TOTP verification error:', e);
  }
  return false;
}

function generateBase32(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

function localApiPlugin() {
  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://localhost:3000');
        const pathname = parsedUrl.pathname;
        const match = pathname.match(/^\/api\/([a-zA-Z0-9_-]+)(\.php)?$/);
        if (match) {
          const endpoint = match[1];

          // Handle Auth Endpoints in Dev Server
          if (endpoint === 'auth' || endpoint === 'admin_auth') {
            const settingsFile = path.resolve(__dirname, 'public', 'data', 'settings.json');
            const tokensFile = path.resolve(__dirname, 'public', 'data', 'admin_2fa_tokens.json');
            const devicesFile = path.resolve(__dirname, 'public', 'data', 'admin_trusted_devices.json');
            const resetsFile = path.resolve(__dirname, 'public', 'data', 'password_resets.json');

            const getSettings = () => {
              let defaults = {
                adminUsername: 'sherazi313',
                adminPassword: '5903911a',
                adminSecretSlug: 'tabeeb-7860',
                twoFactorType: 'disabled',
                totpSecret: '',
                adminEmails: ['sherazi313@gmail.com', 'nukta313@gmail.com'],
                adminRecoveryEmails: 'sherazi313@gmail.com, nukta313@gmail.com'
              };
              if (fs.existsSync(settingsFile)) {
                try {
                  const s = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
                  defaults = { ...defaults, ...s };
                } catch (e) {}
              }
              return defaults;
            };

            const saveSettings = (updates) => {
              const current = getSettings();
              const merged = { ...current, ...updates };
              const dir = path.dirname(settingsFile);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2), 'utf8');
              return merged;
            };

            const readJson = (file) => {
              if (fs.existsSync(file)) {
                try {
                  return JSON.parse(fs.readFileSync(file, 'utf8'));
                } catch (e) {}
              }
              return [];
            };

            const writeJson = (file, data) => {
              const dir = path.dirname(file);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
            };

            const actionParam = parsedUrl.searchParams.get('action') || '';

            const handleAuthRequest = (bodyStr) => {
              let payload = {};
              try { payload = JSON.parse(bodyStr || '{}'); } catch (e) {}
              const action = actionParam || payload.action || (req.method === 'GET' ? 'get_2fa_setup' : 'login');

              res.setHeader('Content-Type', 'application/json; charset=UTF-8');

              if (action === 'login') {
                const username = (payload.username || '').trim().toLowerCase();
                const password = (payload.password || '').trim();
                const deviceToken = (req.headers['x-device-token'] || payload.device_token || payload.hp_2fa_device_token || '').trim();
                const settings = getSettings();

                const validUser = (settings.adminUsername || 'sherazi313').toLowerCase();
                const adminEmails = (settings.adminEmails || []).map(e => String(e).toLowerCase());
                const userMatched = username === validUser || adminEmails.includes(username);
                const passMatched = password === (settings.adminPassword || '5903911a');

                if (!userMatched || !passMatched) {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ status: 'error', message: 'یوزر نیم یا پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔' }));
                  return;
                }

                // Check 30-Day Trusted Device
                let isDeviceTrusted = false;
                if (deviceToken) {
                  const devices = readJson(devicesFile);
                  const now = Date.now();
                  isDeviceTrusted = devices.some(d => d.device_token === deviceToken && new Date(d.expires_at).getTime() > now);
                }

                const twoFactorType = settings.twoFactorType || 'disabled';

                if (isDeviceTrusted || twoFactorType === 'disabled') {
                  const adminToken = crypto.createHash('sha256').update(`${settings.adminUsername}:tabeeb_secret_salt_2026:${AUTH_SECRET_KEY}`).digest('hex');
                  res.end(JSON.stringify({
                    status: 'success',
                    token: adminToken,
                    username: settings.adminUsername,
                    twoFactorType,
                    trusted_device: isDeviceTrusted,
                    message: 'لاگ ان کامیاب!'
                  }));
                  return;
                }

                // 2FA is required
                const tempToken = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

                if (twoFactorType === 'email_otp') {
                  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                  const codeHash = crypto.createHmac('sha256', AUTH_SECRET_KEY).update(otpCode).digest('hex');
                  const tokens = readJson(tokensFile);
                  tokens.push({ temp_token: tempToken, code_hash: codeHash, type: 'email_otp', expires_at: expiresAt, debug_code: otpCode });
                  writeJson(tokensFile, tokens);

                  console.log(`\n========================================\n[2FA EMAIL OTP CODE]: ${otpCode}\n========================================\n`);

                  res.end(JSON.stringify({
                    status: '2fa_required',
                    requires_2fa: true,
                    twoFactorType: 'email_otp',
                    temp_token: tempToken,
                    message: `آپ کی ای میل پر 6 ہندسوں کا تصدیقی کوڈ بھیج دیا گیا ہے۔ (Dev Code: ${otpCode})`
                  }));
                  return;
                }

                if (twoFactorType === 'totp') {
                  const tokens = readJson(tokensFile);
                  tokens.push({ temp_token: tempToken, code_hash: 'totp', type: 'totp', expires_at: expiresAt });
                  writeJson(tokensFile, tokens);

                  res.end(JSON.stringify({
                    status: '2fa_required',
                    requires_2fa: true,
                    twoFactorType: 'totp',
                    temp_token: tempToken,
                    message: 'براہ کرم گوگل اتھینٹیکیٹر ایپ سے 6 ہندسوں کا کوڈ درج کریں۔'
                  }));
                  return;
                }
              }

              if (action === 'verify_2fa') {
                const tempToken = (payload.temp_token || '').trim();
                const code = (payload.code || '').trim();
                const rememberDevice = Boolean(payload.remember_device);
                const tokens = readJson(tokensFile);
                const now = Date.now();
                const tokenRecord = tokens.find(t => t.temp_token === tempToken && new Date(t.expires_at).getTime() > now);

                if (!tokenRecord) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ status: 'error', message: 'تصدیقی ٹوکن ختم ہو چکا ہے، دوبارہ لاگ ان کریں۔' }));
                  return;
                }

                const settings = getSettings();
                let isValid = false;

                if (tokenRecord.type === 'email_otp') {
                  const enteredHash = crypto.createHmac('sha256', AUTH_SECRET_KEY).update(code).digest('hex');
                  if (enteredHash === tokenRecord.code_hash || (tokenRecord.debug_code && tokenRecord.debug_code === code)) {
                    isValid = true;
                  }
                } else if (tokenRecord.type === 'totp') {
                  isValid = verifyTotp(settings.totpSecret, code);
                }

                if (!isValid) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ status: 'error', message: 'درج کردہ کوڈ غلط ہے یا اس کی میعاد ختم ہو چکی ہے۔' }));
                  return;
                }

                // Delete used temp token
                writeJson(tokensFile, tokens.filter(t => t.temp_token !== tempToken));

                let newDeviceToken = null;
                if (rememberDevice) {
                  newDeviceToken = crypto.randomBytes(32).toString('hex');
                  const devices = readJson(devicesFile);
                  devices.push({
                    device_token: newDeviceToken,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                  });
                  writeJson(devicesFile, devices);
                }

                const adminToken = crypto.createHash('sha256').update(`${settings.adminUsername}:tabeeb_secret_salt_2026:${AUTH_SECRET_KEY}`).digest('hex');
                res.end(JSON.stringify({
                  status: 'success',
                  token: adminToken,
                  device_token: newDeviceToken,
                  username: settings.adminUsername,
                  message: '2FA تصدیق کامیاب! خوش آمدید۔'
                }));
                return;
              }

              if (action === 'get_2fa_setup') {
                const settings = getSettings();
                let totpSecret = settings.totpSecret;
                if (!totpSecret) {
                  totpSecret = generateBase32(16);
                  saveSettings({ totpSecret });
                }

                const adminUser = settings.adminUsername || 'admin';
                const otpAuthUrl = `otpauth://totp/TabeebPedia:${encodeURIComponent(adminUser)}?secret=${totpSecret}&issuer=TabeebPedia&period=30&digits=6`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpAuthUrl)}`;

                res.end(JSON.stringify({
                  status: 'success',
                  totpSecret,
                  otpAuthUrl,
                  qr_url: qrUrl,
                  adminUsername: settings.adminUsername,
                  adminSecretSlug: settings.adminSecretSlug || 'tabeeb-7860',
                  twoFactorType: settings.twoFactorType || 'disabled',
                  adminEmails: settings.adminEmails || ['sherazi313@gmail.com', 'nukta313@gmail.com']
                }));
                return;
              }

              if (action === 'change_credentials') {
                const updates = {};
                if (payload.username) updates.adminUsername = payload.username.trim();
                if (payload.newPassword) updates.adminPassword = payload.newPassword.trim();
                if (payload.adminSecretSlug) {
                  updates.adminSecretSlug = payload.adminSecretSlug.trim().replace(/[^a-zA-Z0-9_-]/g, '');
                }
                if (payload.twoFactorType) updates.twoFactorType = payload.twoFactorType;
                if (payload.totpSecret) updates.totpSecret = payload.totpSecret.trim().toUpperCase();
                if (payload.adminEmails) {
                  const arr = Array.isArray(payload.adminEmails) ? payload.adminEmails : payload.adminEmails.split(/[\s,;]+/);
                  updates.adminEmails = arr.map(e => e.trim()).filter(Boolean);
                  updates.adminRecoveryEmails = updates.adminEmails.join(', ');
                }

                const saved = saveSettings(updates);
                res.end(JSON.stringify({
                  status: 'success',
                  message: 'ایڈمن سیکیورٹی سیٹنگز کامیابی سے محفوظ ہو گئیں۔',
                  adminUsername: saved.adminUsername,
                  adminSecretSlug: saved.adminSecretSlug,
                  twoFactorType: saved.twoFactorType
                }));
                return;
              }

              if (action === 'revoke_devices') {
                writeJson(devicesFile, []);
                res.end(JSON.stringify({
                  status: 'success',
                  message: 'تمام ڈیوائسز کی تصدیق منسوخ کر دی گئی ہے۔ آئندہ لاگ ان پر 2FA لازمی ہوگا۔'
                }));
                return;
              }

              if (action === 'forgot_password') {
                const email = (payload.email || '').trim().toLowerCase();
                const settings = getSettings();
                const adminEmails = (settings.adminEmails || []).map(e => String(e).toLowerCase());

                if (!adminEmails.includes(email)) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ status: 'error', message: 'یہ ای میل ایڈریس ایڈمن ریکارڈ میں موجود نہیں ہے۔' }));
                  return;
                }

                const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
                const codeHash = crypto.createHmac('sha256', AUTH_SECRET_KEY).update(resetCode).digest('hex');
                const resets = readJson(resetsFile);
                resets.push({ email, code_hash: codeHash, expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), debug_code: resetCode });
                writeJson(resetsFile, resets);

                console.log(`\n========================================\n[PASSWORD RESET CODE]: ${resetCode}\n========================================\n`);

                res.end(JSON.stringify({
                  status: 'success',
                  message: `6 ہندسوں کا پاس ورڈ ری سیٹ کوڈ ای میل پر بھیج دیا گیا ہے۔ (Dev Code: ${resetCode})`
                }));
                return;
              }

              if (action === 'reset_password') {
                const email = (payload.email || '').trim().toLowerCase();
                const code = (payload.code || '').trim();
                const newPassword = (payload.new_password || '').trim();

                const resets = readJson(resetsFile);
                const now = Date.now();
                const record = resets.find(r => r.email === email && new Date(r.expires_at).getTime() > now);

                if (!record) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ status: 'error', message: 'ری سیٹ کوڈ کی میعاد ختم ہو چکی ہے، دوبارہ درخواست کریں۔' }));
                  return;
                }

                const enteredHash = crypto.createHmac('sha256', AUTH_SECRET_KEY).update(code).digest('hex');
                if (enteredHash !== record.code_hash && record.debug_code !== code) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ status: 'error', message: 'درج کردہ ری سیٹ کوڈ غلط ہے۔' }));
                  return;
                }

                saveSettings({ adminPassword: newPassword });
                writeJson(resetsFile, resets.filter(r => r.email !== email));

                res.end(JSON.stringify({
                  status: 'success',
                  message: 'پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا۔ اب آپ نئے پاس ورڈ سے لاگ ان کر سکتے ہیں۔'
                }));
                return;
              }

              if (action === 'logout') {
                res.end(JSON.stringify({ status: 'success', message: 'کامیابی سے لاگ آؤٹ ہو گیا۔' }));
                return;
              }

              res.statusCode = 400;
              res.end(JSON.stringify({ status: 'error', message: 'درخواست کی نوعیت (action) نامعلوم ہے۔' }));
            };

            if (req.method === 'GET') {
              handleAuthRequest('');
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => { handleAuthRequest(body); });
              return;
            }
          }

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

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
