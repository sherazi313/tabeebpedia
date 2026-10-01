const fs = require('fs');

let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(
    "{ id: 'herb-calculator', label: '???? ????????? (HEC)', icon: Calculator },",
    "{ id: 'calculators', label: '?????????', icon: Calculator, children: [{ id: 'pulse-calculator', label: '??? ?????????' }, { id: 'herb-calculator', label: '???? ???? ?????????' }] },"
);

c = c.replace(
    "ChevronLeft,",
    "ChevronLeft,\n  ChevronDown,"
);

const desktopNavRegex = /<nav className="hidden lg:flex items-center gap-1">[\s\S]*?<\/nav>/;
const desktopNavNew = \<nav className="hidden lg:flex items-center gap-1">
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
                        className={\elative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \\}
                      >
                        <Icon className={\w-4 h-4 \\} />
                        <span>{item.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        {isActive && (
                          <span className={\bsolute bottom-0 left-3 right-3 h-0.5 \ rounded-full\} />
                        )}
                      </button>
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => setActiveTab(child.id)}
                            className={\w-full text-right px-4 py-2 text-sm font-semibold transition-colors \\}
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
                    className={\elative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all \\}
                  >
                    <Icon className={\w-4 h-4 \\} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={\bsolute bottom-0 left-3 right-3 h-0.5 \ rounded-full\} />
                    )}
                  </button>
                );
              })}
            </nav>\;
c = c.replace(desktopNavRegex, desktopNavNew);

const mobileNavRegex = /<nav className="flex flex-col gap-1 p-3">[\s\S]*?<\/nav>/;
const mobileNavNew = \<nav className="flex flex-col gap-1 p-3">
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
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all text-slate-600 hover:bg-slate-50"
                  >
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                );
              }
              if (item.children) {
                return (
                  <div key={item.id} className="flex flex-col">
                    <div className={\lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all \\}>
                      <Icon className={\w-5 h-5 \\} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex flex-col pl-10 pr-2 pb-2">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                            setMobileMenuOpen(false);
                          }}
                          className={\lex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all text-right \\}
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
                  className={\lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all \\}
                >
                  <Icon className={\w-5 h-5 \\} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>\;
c = c.replace(mobileNavRegex, mobileNavNew);

fs.writeFileSync('src/components/Navbar.jsx', c);
