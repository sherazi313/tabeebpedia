const fs = require('fs');
let c = fs.readFileSync('src/components/PulseDiagnosis.jsx', 'utf8');
c = c.replace(/bg-white'\}`/g, "bg-white'}`}");
fs.writeFileSync('src/components/PulseDiagnosis.jsx', c);
