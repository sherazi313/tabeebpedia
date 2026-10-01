const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(/onClick=\{\(\) \=\> \{\n\s*setActiveTab\(child\.id\);\n\s*setMobileMenuOpen\(false\);\n\s*\}\}/g, `onClick={() => {
                              if (child.isPage && onSelectPage) {
                                onSelectPage(child.id);
                              } else {
                                setActiveTab(child.id);
                              }
                              setMobileMenuOpen(false);
                            }}`);

fs.writeFileSync('src/components/Navbar.jsx', c);
console.log("Done");
