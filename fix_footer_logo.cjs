const fs = require('fs');
let c = fs.readFileSync('src/components/Footer.jsx', 'utf8');
c = c.replace(/className="w-12 h-12 object-contain rounded-2xl bg-white\/10 p-1"/g, 'className="h-10 sm:h-12 w-auto max-w-[200px] object-contain rounded-2xl bg-white/10 p-1"');
fs.writeFileSync('src/components/Footer.jsx', c);
