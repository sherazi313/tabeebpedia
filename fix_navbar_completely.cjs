const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

// Hide text next to logo
const logoTextRegex = /<div className="flex flex-col">[\s\S]*?<\/div>\s*<\/div>/;
c = c.replace(logoTextRegex, `
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
              )}
            </div>`);

// Desktop Nav replacement
const desktopNavRegex = /\{navItems\.map\(\(item\) => \{[\s\S]*?\}\)\}/;

const newDesktopNav = `{navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.children && item.children.some(c => c.id === activeTab));
                
                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span>{item.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  );
                }

                if (item.children) {
                  return (
                    <div key={item.id} className="relative group">
                      <button className={\`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \${
                        isActive
                          ? isNavy 
                            ? 'text-blue-900 bg-blue-50/90 font-bold shadow-xs' 
                            : 'text-emerald-900 bg-emerald-50/90 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }\`}>
                        <Icon className={\`w-4 h-4 \${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}\`} />
                        <span>{item.label}</span>
                        {isActive && (
                          <span className={\`absolute bottom-0 left-3 right-3 h-0.5 \${isNavy ? 'bg-blue-600' : 'bg-emerald-600'} rounded-full\`} />
                        )}
                      </button>
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => setActiveTab(child.id)}
                            className={\`w-full text-right px-4 py-2 text-sm font-semibold transition-colors \${activeTab === child.id ? (isNavy ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-emerald-50') : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}\`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isPage && onSelectPage) {
                        onSelectPage(item.id);
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={\`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \${
                      isActive
                        ? isNavy 
                          ? 'text-blue-900 bg-blue-50/90 font-bold shadow-xs' 
                          : 'text-emerald-900 bg-emerald-50/90 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }\`}
                  >
                    <Icon className={\`w-4 h-4 \${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}\`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={\`absolute bottom-0 left-3 right-3 h-0.5 \${isNavy ? 'bg-blue-600' : 'bg-emerald-600'} rounded-full\`} />
                    )}
                  </button>
                );
              })}`;

c = c.replace(desktopNavRegex, newDesktopNav);

// Mobile Nav replacement
const mobileNavRegex = /\{navItems\.map\(\(item\) => \{[\s\S]*?\}\)\}/;
const newMobileNav = `{navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.children && item.children.some(c => c.id === activeTab));
                
                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-emerald-600" />
                        <span>{item.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  );
                }

                if (item.children) {
                  return (
                    <div key={item.id} className="flex flex-col">
                      <div className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all \${isActive ? (isNavy ? 'text-blue-900 bg-blue-50/90 font-bold' : 'text-emerald-900 bg-emerald-50/90 font-bold') : 'text-slate-700 hover:bg-slate-50'}\`}>
                        <Icon className={\`w-5 h-5 \${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}\`} />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex flex-col pr-12 pb-2 pt-1">
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => {
                              setActiveTab(child.id);
                              setMobileMenuOpen(false);
                            }}
                            className={\`flex justify-end items-center px-4 py-2 rounded-lg text-sm transition-all \${activeTab === child.id ? (isNavy ? 'text-blue-700 font-bold' : 'text-emerald-700 font-bold') : 'text-slate-600 hover:text-slate-900'}\`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isPage && onSelectPage) {
                        onSelectPage(item.id);
                      } else {
                        setActiveTab(item.id);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all \${
                      isActive
                        ? isNavy 
                          ? 'text-blue-900 bg-blue-50/90 font-bold' 
                          : 'text-emerald-900 bg-emerald-50/90 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }\`}
                  >
                    <Icon className={\`w-5 h-5 \${isActive ? (isNavy ? 'text-blue-600' : 'text-emerald-600') : 'text-slate-400'}\`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}`;

c = c.replace(mobileNavRegex, newMobileNav);

fs.writeFileSync('src/components/Navbar.jsx', c);
