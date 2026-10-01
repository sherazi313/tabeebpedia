const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

const replacement = \<nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id));
              
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
                    <button
                      className={\\\elative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \\\\}
                    >
                      <Icon className={\\\w-4 h-4 \\\\} />
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                      {isActive && (
                        <span className={\\\bsolute bottom-0 left-3 right-3 h-0.5 \ rounded-full\\\} />
                      )}
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                          }}
                          className={\\\w-full text-right px-4 py-2 text-sm font-semibold transition-colors \\\\}
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
                  className={\\\elative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \\\\}
                >
                  <Icon className={\\\w-4 h-4 \\\\} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className={\\\bsolute bottom-0 left-3 right-3 h-0.5 \ rounded-full\\\} />
                  )}
                </button>
              );
            })}
          </nav>\;

c = c.replace(/<nav className="hidden lg:flex items-center gap-1">[\s\S]*?<\/nav>/, replacement);
fs.writeFileSync('src/components/Navbar.jsx', c);
