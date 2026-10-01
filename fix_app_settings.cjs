const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/helplinePhone: '0300-1234567'/g, "helplinePhone: '0347-0005578'");
c = c.replace(/whatsappNumber: '923001234567'/g, "whatsappNumber: '03470005578'");
// Replace "مفت" in heroTitle
c = c.replace("heroTitle: 'مستند اطباء اور حکماء سے \\nمفت آن لائن رہنمائی اور فوری رابطہ'", "heroTitle: 'مستند اطباء اور حکماء سے \\nآن لائن رہنمائی اور فوری رابطہ'");

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log("App settings updated");
