const fs = require('fs');
let c = fs.readFileSync('src/components/AdminCMS.jsx', 'utf8');

c = c.replace(/const handleSaveSettings = \(e\) => \{\r?\n\s*e\.preventDefault\(\);\r?\n\s*if \(setSiteSettings\) \{\r?\n\s*setSiteSettings\(settingsForm\);\r?\n\s*\}\r?\n\s*showNotification\(/,
`const handleSaveSettings = async (e) => {
      e.preventDefault();
      if (setSiteSettings) {
        setSiteSettings(settingsForm);
      }
      await saveSettingsApi(settingsForm);
      showNotification(`);

fs.writeFileSync('src/components/AdminCMS.jsx', c);
console.log("AdminCMS updated");
