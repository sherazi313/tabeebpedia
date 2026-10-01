const fs = require('fs');
let c = fs.readFileSync('src/components/AdminCMS.jsx', 'utf8');

const regex = /alt="Logo Preview" className="h-10 object-contain" \/>\s*<\/div>\s*\)\}\s*<\/div>/;

const newBlock = `alt="Logo Preview" className="h-10 object-contain" />
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 font-simple mt-4">آئیکن (Favicon - Browser Tab)</label>
                            <div className="flex flex-col sm:flex-row gap-2 relative">
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={settingsForm.faviconUrl || ''} 
                                  onChange={e => setSettingsForm({...settingsForm, faviconUrl: e.target.value})} 
                                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-left dir-ltr" 
                                  placeholder="URL" 
                                />
                              </div>
                              <div className="relative overflow-hidden shrink-0">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleSettingImageUpload(e, 'faviconUrl')} 
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                <button type="button" className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                  <Upload className="w-4 h-4" /> اپلوڈ کریں
                                </button>
                              </div>
                            </div>
                            {settingsForm.faviconUrl && (
                              <div className="mt-3 inline-block bg-white p-2 rounded-xl shadow-sm border border-slate-700">
                                <img src={settingsForm.faviconUrl} alt="Favicon Preview" className="h-10 w-10 object-contain" />
                              </div>
                            )}
                          </div>`;

c = c.replace(regex, newBlock);
fs.writeFileSync('src/components/AdminCMS.jsx', c);
