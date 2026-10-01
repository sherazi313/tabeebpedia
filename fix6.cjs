const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(/\)\}\s*\{\/\* Desktop Navigation Links \*\/\}/g, `)}
            </div>
            
            {/* Desktop Navigation Links */}`);

fs.writeFileSync('src/components/Navbar.jsx', c);
console.log("Done");
