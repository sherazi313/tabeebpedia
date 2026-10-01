const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/مفت آن لائن رہنمائی/g, 'آن لائن رہنمائی');

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log("App settings updated");
