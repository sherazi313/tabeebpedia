const fs = require('fs');

const apiFile = `const API_BASE = 'https://himalayan.tabeebpedia.com/api';

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(\`\${API_BASE}\${endpoint}\`, options);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const fetchLiveDoctors = () => apiFetch('/doctors.php');
export const fetchLiveArticles = () => apiFetch('/articles.php');
`;
fs.writeFileSync('src/api.js', apiFile);
console.log('src/api.js created');
