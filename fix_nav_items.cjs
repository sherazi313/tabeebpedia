const fs = require('fs');
let c = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

const oldNav = `  const navItems = [
    { id: 'home', label: 'ہوم', icon: Sparkles },
    { id: 'doctors', label: 'اطباء و حکماء ڈائریکٹری', icon: Stethoscope },
    { id: 'blog', label: 'طبی مضامین و ریسرچ', icon: BookOpen },
    { id: 'farhang', label: 'فرہنگ اطباء', icon: BookOpen },
    { id: 'pdf-books', label: 'پی ڈی ایف کتب', icon: BookOpen, isPage: true },
    { id: 'calculators', label: 'کیلکولیٹر', icon: Calculator, children: [
      { id: 'pulse-calculator', label: 'نبض کیلکولیٹر' },
      { id: 'herb-calculator', label: 'نسخہ مزاج کیلکولیٹر' }
    ]},
    { id: 'store', label: 'ہمالین پنسار', icon: ShoppingBag, isExternal: true, url: 'https://www.himalayanpansar.com' }
  ];`;

const newNav = `  const navItems = [
    { id: 'home', label: 'ہوم', icon: Sparkles },
    { id: 'doctors', label: 'اطباء ڈائریکٹری', icon: Stethoscope },
    { id: 'resources', label: 'علمی وسائل', icon: BookOpen, children: [
      { id: 'blog', label: 'طبی مضامین و ریسرچ' },
      { id: 'farhang', label: 'فرہنگ اطباء' },
      { id: 'pdf-books', label: 'پی ڈی ایف کتب', isPage: true }
    ]},
    { id: 'calculators', label: 'کیلکولیٹر', icon: Calculator, children: [
      { id: 'pulse-calculator', label: 'نبض کیلکولیٹر' },
      { id: 'herb-calculator', label: 'نسخہ مزاج کیلکولیٹر' }
    ]},
    { id: 'store', label: 'ہمالین پنسار', icon: ShoppingBag, isExternal: true, url: 'https://www.himalayanpansar.com' }
  ];`;

if (c.indexOf("const navItems = [") !== -1) {
  const start = c.indexOf("const navItems = [");
  const end = c.indexOf("];", start) + 2;
  c = c.substring(0, start) + newNav + c.substring(end);
  fs.writeFileSync('src/components/Navbar.jsx', c);
  console.log("NavItems updated!");
} else {
  console.log("Not found!");
}
