const fs = require('fs');
let c = fs.readFileSync('src/components/PulseDiagnosis.jsx', 'utf8');

c = c.replace(/name=\{q-\\\}/g, 'name={`q-${q.id}`}');

fs.writeFileSync('src/components/PulseDiagnosis.jsx', c);
