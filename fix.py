
import re

with open('src/components/Navbar.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# navItems update
c = c.replace(
    \x22{ id: 'herb-calculator', label: '???? ????????? (HEC)', icon: Calculator },\x22,
    \x22{ id: 'calculators', label: '?????????', icon: Calculator, children: [{ id: 'pulse-calculator', label: '??? ?????????' }, { id: 'herb-calculator', label: '???? ???? ?????????' }] },\x22
)

c = c.replace(
    \x22ChevronLeft,\x22,
    \x22ChevronLeft,\n  ChevronDown,\x22
)

desktop_nav_old = \x22\x22\x22<nav className=\x22hidden lg:flex items-center gap-1\x22>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target=\x22_blank\x22
                      rel=\x22noopener noreferrer\x22
                      className=\x22relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50\x22
                    >
                      <Icon className=\x22w-4 h-4 text-emerald-600\x22 />
                      <span>{item.label}</span>
                      <ExternalLink className=\x22w-3.5 h-3.5 text-slate-400\x22 />
                    </a>
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
                    className={elative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all }
                  >
                    <Icon className={w-4 h-4 } />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={bsolute bottom-0 left-3 right-3 h-0.5  rounded-full} />
                    )}
                  </button>
                );
              })}
            </nav>\x22\x22\x22

desktop_nav_new = \x22\x22\x22<nav className=\x22hidden lg:flex items-center gap-1\x22>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id));
                if (item.isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target=\x22_blank\x22
                      rel=\x22noopener noreferrer\x22
                      className=\x22relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50\x22
                    >
                      <Icon className=\x22w-4 h-4 text-emerald-600\x22 />
                      <span>{item.label}</span>
                      <ExternalLink className=\x22w-3.5 h-3.5 text-slate-400\x22 />
                    </a>
                  );
                }
                if (item.children) {
                  return (
                    <div key={item.id} className=\x22relative group\x22>
                      <button
                        className={elative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all }
                      >
                        <Icon className={w-4 h-4 } />
                        <span>{item.label}</span>
                        <ChevronDown className=\x22w-3.5 h-3.5 opacity-50\x22 />
                        {isActive && (
                          <span className={bsolute bottom-0 left-3 right-3 h-0.5  rounded-full} />
                        )}
                      </button>
                      <div className=\x22absolute top-full right-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50\x22>
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            onClick={() => setActiveTab(child.id)}
                            className={w-full text-right px-4 py-2 text-sm font-semibold transition-colors }
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
                    className={elative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all }
                  >
                    <Icon className={w-4 h-4 } />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={bsolute bottom-0 left-3 right-3 h-0.5  rounded-full} />
                    )}
                  </button>
                );
              })}
            </nav>\x22\x22\x22

c = c.replace(desktop_nav_old, desktop_nav_new)


mobile_nav_old = \x22\x22\x22<nav className=\x22flex flex-col gap-1 p-3\x22>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target=\x22_blank\x22
                    rel=\x22noopener noreferrer\x22
                    className=\x22flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all text-slate-600 hover:bg-slate-50\x22
                  >
                    <Icon className=\x22w-5 h-5 text-emerald-600\x22 />
                    <span>{item.label}</span>
                    <ExternalLink className=\x22w-4 h-4 text-slate-400\x22 />
                  </a>
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
                  className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all }
                >
                  <Icon className={w-5 h-5 } />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>\x22\x22\x22

mobile_nav_new = \x22\x22\x22<nav className=\x22flex flex-col gap-1 p-3\x22>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id));
              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target=\x22_blank\x22
                    rel=\x22noopener noreferrer\x22
                    className=\x22flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all text-slate-600 hover:bg-slate-50\x22
                  >
                    <Icon className=\x22w-5 h-5 text-emerald-600\x22 />
                    <span>{item.label}</span>
                    <ExternalLink className=\x22w-4 h-4 text-slate-400\x22 />
                  </a>
                );
              }
              if (item.children) {
                return (
                  <div key={item.id} className=\x22flex flex-col\x22>
                    <div className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all }>
                      <Icon className={w-5 h-5 } />
                      <span>{item.label}</span>
                    </div>
                    <div className=\x22flex flex-col pl-10 pr-2 pb-2\x22>
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                            setMobileMenuOpen(false);
                          }}
                          className={lex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all text-right }
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
                  className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all }
                >
                  <Icon className={w-5 h-5 } />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>\x22\x22\x22

c = c.replace(mobile_nav_old, mobile_nav_new)

with open('src/components/Navbar.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

