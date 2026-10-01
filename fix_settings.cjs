const fs = require('fs');

let settings = JSON.parse(fs.readFileSync('public/data/settings.json', 'utf8'));

settings.helplinePhone = '0347-0005578';
settings.whatsappNumber = '03470005578';
settings.heroTitle = 'مستند اطباء اور حکماء سے \nآن لائن رہنمائی اور فوری رابطہ';

fs.writeFileSync('public/data/settings.json', JSON.stringify(settings, null, 2), 'utf8');
console.log("public settings updated");
