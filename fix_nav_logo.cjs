const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(/\{siteSettings\?\.logoUrl \? \(/g, "{(siteSettings?.logoUrl || '/logo3.png') ? (");
c = c.replace(/<img src=\{siteSettings\.logoUrl\}/g, "<img src={siteSettings?.logoUrl || '/logo3.png'}");

fs.writeFileSync('src/components/Navbar.jsx', c);
