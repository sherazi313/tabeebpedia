const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(/<nav className="hidden lg:flex items-center gap-1">[\s\S]*?<\/nav>/, 
    '<nav className="hidden lg:flex items-center gap-1">\n' +
    '            {navItems.map((item) => {\n' +
    '              const Icon = item.icon;\n' +
    '              const isActive = activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id));\n' +
    '              \n' +
    '              if (item.isExternal) {\n' +
    '                return (\n' +
    '                  <a\n' +
    '                    key={item.id}\n' +
    '                    href={item.url}\n' +
    '                    target="_blank"\n' +
    '                    rel="noopener noreferrer"\n' +
    '                    className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"\n' +
    '                  >\n' +
    '                    <Icon className="w-4 h-4 text-emerald-600" />\n' +
    '                    <span>{item.label}</span>\n' +
    '                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />\n' +
    '                  </a>\n' +
    '                );\n' +
    '              }\n' +
    '              \n' +
    '              if (item.children) {\n' +
    '                return (\n' +
    '                  <div key={item.id} className="relative group">\n' +
    '                    <button\n' +
    '                      className={elative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all }\n' +
    '                    >\n' +
    '                      <Icon className={w-4 h-4 } />\n' +
    '                      <span>{item.label}</span>\n' +
    '                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />\n' +
    '                      {isActive && (\n' +
    '                        <span className={bsolute bottom-0 left-3 right-3 h-0.5  rounded-full} />\n' +
    '                      )}\n' +
    '                    </button>\n' +
    '                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">\n' +
    '                      {item.children.map(child => (\n' +
    '                        <button\n' +
    '                          key={child.id}\n' +
    '                          onClick={() => setActiveTab(child.id)}\n' +
    '                          className={w-full text-right px-4 py-2 text-sm font-semibold transition-colors }\n' +
    '                        >\n' +
    '                          {child.label}\n' +
    '                        </button>\n' +
    '                      ))}\n' +
    '                    </div>\n' +
    '                  </div>\n' +
    '                );\n' +
    '              }\n' +
    '              return (\n' +
    '                <button\n' +
    '                  key={item.id}\n' +
    '                  onClick={() => {\n' +
    '                    if (item.isPage && onSelectPage) {\n' +
    '                      onSelectPage(item.id);\n' +
    '                    } else {\n' +
    '                      setActiveTab(item.id);\n' +
    '                    }\n' +
    '                  }}\n' +
    '                  className={elative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all }\n' +
    '                >\n' +
    '                  <Icon className={w-4 h-4 } />\n' +
    '                  <span>{item.label}</span>\n' +
    '                  {isActive && (\n' +
    '                    <span className={bsolute bottom-0 left-3 right-3 h-0.5  rounded-full} />\n' +
    '                  )}\n' +
    '                </button>\n' +
    '              );\n' +
    '            })}\n' +
    '          </nav>'
);

c = c.replace(/<nav className="flex flex-col gap-1 p-3">[\s\S]*?<\/nav>/, 
    '<nav className="flex flex-col gap-1 p-3">\n' +
    '            {navItems.map((item) => {\n' +
    '              const Icon = item.icon;\n' +
    '              const isActive = activeTab === item.id || (item.children && item.children.some(child => activeTab === child.id));\n' +
    '              if (item.isExternal) {\n' +
    '                return (\n' +
    '                  <a\n' +
    '                    key={item.id}\n' +
    '                    href={item.url}\n' +
    '                    target="_blank"\n' +
    '                    rel="noopener noreferrer"\n' +
    '                    className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all text-slate-600 hover:bg-slate-50}\n' +
    '                  >\n' +
    '                    <Icon className="w-5 h-5 text-emerald-600" />\n' +
    '                    <span>{item.label}</span>\n' +
    '                    <ExternalLink className="w-4 h-4 text-slate-400" />\n' +
    '                  </a>\n' +
    '                );\n' +
    '              }\n' +
    '              if (item.children) {\n' +
    '                return (\n' +
    '                  <div key={item.id} className="flex flex-col">\n' +
    '                    <div className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all }>\n' +
    '                      <Icon className={w-5 h-5 } />\n' +
    '                      <span>{item.label}</span>\n' +
    '                    </div>\n' +
    '                    <div className="flex flex-col pl-10 pr-2 pb-2">\n' +
    '                      {item.children.map(child => (\n' +
    '                        <button\n' +
    '                          key={child.id}\n' +
    '                          onClick={() => {\n' +
    '                            setActiveTab(child.id);\n' +
    '                            setMobileMenuOpen(false);\n' +
    '                          }}\n' +
    '                          className={lex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all text-right }\n' +
    '                        >\n' +
    '                          {child.label}\n' +
    '                        </button>\n' +
    '                      ))}\n' +
    '                    </div>\n' +
    '                  </div>\n' +
    '                );\n' +
    '              }\n' +
    '              return (\n' +
    '                <button\n' +
    '                  key={item.id}\n' +
    '                  onClick={() => {\n' +
    '                    if (item.isPage && onSelectPage) {\n' +
    '                      onSelectPage(item.id);\n' +
    '                    } else {\n' +
    '                      setActiveTab(item.id);\n' +
    '                    }\n' +
    '                    setMobileMenuOpen(false);\n' +
    '                  }}\n' +
    '                  className={lex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all }\n' +
    '                >\n' +
    '                  <Icon className={w-5 h-5 } />\n' +
    '                  <span>{item.label}</span>\n' +
    '                </button>\n' +
    '              );\n' +
    '            })}\n' +
    '          </nav>'
);

fs.writeFileSync('src/components/Navbar.jsx', c);
