const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes("import { fetchLiveDoctors, fetchLiveArticles }")) {
  app = app.replace(
    "import AdminCMS from './components/AdminCMS';",
    "import AdminCMS from './components/AdminCMS';\nimport { fetchLiveDoctors, fetchLiveArticles } from './api';"
  );
  
  // Add useEffect to fetch live data
  const insertionPoint = "const [doctorAuthModalOpen, setDoctorAuthModalOpen] = useState(false);";
  const replacement = `const [doctorAuthModalOpen, setDoctorAuthModalOpen] = useState(false);

  // --- LIVE DATABASE SYNC ---
  useEffect(() => {
    const syncData = async () => {
      try {
        const liveDoctors = await fetchLiveDoctors();
        if (liveDoctors && liveDoctors.length > 0) {
          // Transform if needed or just set
          setDoctorsList(liveDoctors);
        }
        
        const liveArticles = await fetchLiveArticles();
        if (liveArticles && liveArticles.length > 0) {
          setArticlesList(liveArticles);
        }
      } catch(e) {
        console.error("Live sync failed", e);
      }
    };
    syncData();
  }, []);
  // -------------------------
  `;
  
  app = app.replace(insertionPoint, replacement);
  fs.writeFileSync('src/App.jsx', app, 'utf8');
  console.log("App.jsx updated with live sync.");
} else {
  console.log("App.jsx already has live sync.");
}
