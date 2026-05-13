const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'biodata_siswa.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Define class order
const kelasOrder = { 'DKV': 1, 'RPL': 2, 'TKJ': 3 };

// Sort: first by kelas (DKV, RPL, TKJ), then by nama alphabetically
data.sort((a, b) => {
  const kelasA = kelasOrder[a.kelas] || 99;
  const kelasB = kelasOrder[b.kelas] || 99;
  if (kelasA !== kelasB) return kelasA - kelasB;
  return a.nama.localeCompare(b.nama, 'id');
});

// Re-assign IDs sequentially
data.forEach((item, index) => {
  item.id = index + 1;
});

// Print summary
const dkv = data.filter(s => s.kelas === 'DKV');
const rpl = data.filter(s => s.kelas === 'RPL');
const tkj = data.filter(s => s.kelas === 'TKJ');

console.log('=== SORTING SUMMARY ===');
console.log(`Total: ${data.length} siswa`);
console.log(`DKV: ${dkv.length} (ID ${dkv[0].id}-${dkv[dkv.length-1].id})`);
console.log(`RPL: ${rpl.length} (ID ${rpl[0].id}-${rpl[rpl.length-1].id})`);
console.log(`TKJ: ${tkj.length} (ID ${tkj[0].id}-${tkj[tkj.length-1].id})`);

console.log('\n--- DKV (A-Z) ---');
dkv.forEach(s => console.log(`  ${s.id}. ${s.nama}`));
console.log('\n--- RPL (A-Z) ---');
rpl.forEach(s => console.log(`  ${s.id}. ${s.nama}`));
console.log('\n--- TKJ (A-Z) ---');
tkj.forEach(s => console.log(`  ${s.id}. ${s.nama}`));

// Write back
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('\n✅ File saved successfully!');
