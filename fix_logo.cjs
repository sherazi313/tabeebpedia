const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
c = c.replace(/className="w-12 h-12 object-contain rounded-2xl bg-white shadow-sm p-1 border border-slate-200"/g, 'className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"');
fs.writeFileSync('src/components/Navbar.jsx', c);
