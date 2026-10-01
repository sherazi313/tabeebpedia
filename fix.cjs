const fs = require('fs');
let c = fs.readFileSync('src/components/PulseDiagnosis.jsx', 'utf8');
c = c.replace(/className=\{[\s\S]*?lex items-start gap-3 p-4/g, "className={`flex items-start gap-3 p-4");
c = c.replace(/transition-all \\\n/g, "transition-all ${answers[q.id] === opt.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 bg-white'}`\n");
fs.writeFileSync('src/components/PulseDiagnosis.jsx', c);
