const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/if \(siteSettings\?\.faviconUrl\) \{/g, "if (siteSettings?.faviconUrl || '/logo1.png') {");
c = c.replace(/link\.href = siteSettings\.faviconUrl;/g, "link.href = siteSettings?.faviconUrl || '/logo1.png';");

fs.writeFileSync('src/App.jsx', c);
