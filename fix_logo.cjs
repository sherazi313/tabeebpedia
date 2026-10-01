const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

const logoStart = `              {(siteSettings?.logoUrl || '/logo3.png') ? (`;
const logoEnd = `              </div>`;

const logoNew = `              {(siteSettings?.logoUrl || '/logo3.png') ? (
                <img src={siteSettings?.logoUrl || '/logo3.png'} alt={brandName} className="h-10 sm:h-12 w-auto max-w-[200px] object-contain" />
              ) : (
                <div className={\`w-12 h-12 rounded-2xl \${isNavy ? 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 shadow-blue-900/20' : 'bg-gradient-to-br from-emerald-600 to-teal-800 shadow-emerald-700/20'} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform\`}>
                  <Leaf className={\`w-7 h-7 \${isNavy ? 'text-blue-200' : 'text-emerald-200'}\`} />
                </div>
              )}
              {!(siteSettings?.logoUrl || '/logo3.png') && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={\`text-2xl font-bold \${isNavy ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900' : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950'} bg-clip-text text-transparent tracking-tight font-heading\`}>
                      {brandName}
                    </span>
                  </div>
                  <span className={\`text-[10px] \${isNavy ? 'text-slate-500' : 'text-emerald-600/80'} font-medium tracking-wide font-nastaliq leading-none mt-0.5\`}>
                    {tagline}
                  </span>
                </div>
              )}`;

const lStartIdx = c.indexOf(logoStart);
// we need to find the NEXT '</div>' after 'tagline}\n                </span>\n              </div>'
const taglineIdx = c.indexOf('{tagline}');
const lEndIdx = c.indexOf('</div>', taglineIdx) + 6;

c = c.substring(0, lStartIdx) + logoNew + c.substring(lEndIdx);

fs.writeFileSync('src/components/Navbar.jsx', c);
console.log("Done");
