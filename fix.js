const fs = require('fs');
let text = fs.readFileSync('actions.txt', 'utf8');
text = text.replace(/hover:text-white'\)}\`/g, "hover:text-white')}");
fs.writeFileSync('actions.txt', text);
