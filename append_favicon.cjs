const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const injection = `
  useEffect(() => {
    if (siteSettings?.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings?.faviconUrl]);
`;

// Insert it after `const [isMobile, setIsMobile] = useState(false);` or just before `return (` of the App component.
c = c.replace('return (', injection + '\n  return (');

fs.writeFileSync('src/App.jsx', c);
