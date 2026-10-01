const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace('              {!(siteSettings?.logoUrl || \'/logo3.png\') && (\r\n                  <div className="flex flex-col">', 
`              {!(siteSettings?.logoUrl || '/logo3.png') && (
                <div className="flex flex-col">`);

c = c.replace('                )}\r\n  \r\n            {/* Desktop Navigation Links */}',
`              )}
            </div>
  
            {/* Desktop Navigation Links */}`);

fs.writeFileSync('src/components/Navbar.jsx', c);
console.log("Done fixing div");
