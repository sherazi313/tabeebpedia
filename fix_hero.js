const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSearch.jsx', 'utf8');
content = content.replace(/<h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-snug text-white">[\s\S]*?<\/h1>/m, \<h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-snug text-white">
            {titleParts[0]} <br className="hidden sm:inline" />
            <span className={\\\g-gradient-to-r \ bg-clip-text text-transparent\\\}>
              {titleParts[1]}
            </span>
          </h1>\);
content = content.replace(/<p className="text-sm sm:text-lg text-slate-200\\/90 max-w-3xl mx-auto leading-relaxed">[\s\S]*?<\/p>/m, \<p className="text-sm sm:text-lg text-slate-200/90 max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>\);
fs.writeFileSync('src/components/HeroSearch.jsx', content);
