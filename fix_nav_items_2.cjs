const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

c = c.replace(/\{ id: 'herb-calculator', label: '[^']*', icon: Calculator \},/, `{ id: 'calculators', label: 'کیلکولیٹر', icon: Calculator, children: [
      { id: 'pulse-calculator', label: 'نبض کیلکولیٹر' },
      { id: 'herb-calculator', label: 'نسخہ مزاج کیلکولیٹر' }
    ]},`);

fs.writeFileSync('src/components/Navbar.jsx', c);
