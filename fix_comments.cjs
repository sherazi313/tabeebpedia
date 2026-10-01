const fs = require('fs');
let c = fs.readFileSync('src/components/AdminCMS.jsx', 'utf8');

c = c.replace('<span>????? ??? ?????</span>', '<span>قارئین کے تبصرے</span>');
c = c.replace('>????? ????</button>', '>منظور کریں</button>');
c = c.replace('>??? ????</button>', '>حذف کریں</button>');

fs.writeFileSync('src/components/AdminCMS.jsx', c);
console.log("Comments fixed");
