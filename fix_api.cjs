const fs = require('fs');
let c = fs.readFileSync('src/api.js', 'utf8');

c = c.replace(/export const saveSettingsApi = async \(settings\) => \{[\s\S]*?return res\.ok;\r?\n    \} catch \(e\) \{\r?\n      return false;\r?\n    \}/, 
`export const saveSettingsApi = async (settings) => {
    try {
      localStorage.setItem('tabeeb_settings', JSON.stringify(settings));
      let res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        res = await fetch('/api/settings.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
      }
      return res.ok;
    } catch (e) {
      return true; // Return true because it saved locally
    }`);

c = c.replace(/export const fetchSettingsApi = async \(\) => \{[\s\S]*?return data;\r?\n  \};/,
`export const fetchSettingsApi = async () => {
    try {
      const saved = localStorage.getItem('tabeeb_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch(e) {}

    let data = await apiFetch(\`/api/settings.php?v=\${Date.now()}\`);
    if (!data || typeof data !== 'object') {
      data = await apiFetch(\`/data/settings.json?v=\${Date.now()}\`);
    }
    return data;
  };`);

fs.writeFileSync('src/api.js', c);
console.log("api.js updated");
