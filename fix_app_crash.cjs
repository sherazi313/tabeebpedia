const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const badBlock = `  useEffect(() => {
    if (siteSettings?.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings?.faviconUrl]);\n`;

// First remove the bad block completely
c = c.replace(badBlock, "");

// Then append it correctly just before the final return of App
c = c.replace("return (\n    <div className=\"min-h-screen", badBlock + "  return (\n    <div className=\"min-h-screen");

fs.writeFileSync('src/App.jsx', c);
