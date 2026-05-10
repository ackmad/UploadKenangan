const fs = require('fs');
const contentPath = './data/content.json';
const biodataPath = './data/biodata_siswa.json';

let contentRaw = fs.readFileSync(contentPath, 'utf8');
const biodataRaw = fs.readFileSync(biodataPath, 'utf8');
const biodata = JSON.parse(biodataRaw);

// 1. Replace PPLG with RPL and TJKT with TKJ globally in the string
let modified = contentRaw.replace(/PPLG/g, "RPL").replace(/TJKT/g, "TKJ");

const contentObj = JSON.parse(modified);

// 2. Update stats to match biodata
contentObj.profile.stats = [
  { "label": "Siswa Terdata", "value": biodata.metadata.total_siswa.toString(), "emoji": "👥" },
  { "label": "Jurusan", "value": "3", "emoji": "📚" },
  { "label": "Tahun Bersama", "value": "3", "emoji": "🗓️" }
];

// Let's also adjust the classes list in profile to not have made up counts
// Or maybe just deduce from biodata
const rplCount = biodata.siswa.filter(s => s.jurusan === 'RPL').length;
const tkjCount = biodata.siswa.filter(s => s.jurusan === 'TKJ').length;
const dkvCount = biodata.siswa.filter(s => s.jurusan === 'DKV').length;

contentObj.profile.classes = [
  { "name": "RPL", "count": rplCount, "color": "var(--coral-light)", "icon": "💻" },
  { "name": "TKJ", "count": tkjCount, "color": "var(--mint)", "icon": "🔧" },
  { "name": "DKV", "count": dkvCount, "color": "var(--lavender)", "icon": "🎨" }
];

fs.writeFileSync(contentPath, JSON.stringify(contentObj, null, 2), 'utf8');
console.log("Updated content.json successfully");
