const fs = require('fs');
let c = fs.readFileSync('src/components/AdminCMS.jsx', 'utf8');

c = c.replace("ArrowDown\r\n} from 'lucide-react';", "ArrowDown,\n  Upload\n} from 'lucide-react';");
c = c.replace("ArrowDown\n} from 'lucide-react';", "ArrowDown,\n  Upload\n} from 'lucide-react';");

fs.writeFileSync('src/components/AdminCMS.jsx', c);
console.log("Done");
