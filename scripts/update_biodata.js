const fs = require('fs');
const path = './data/biodata_siswa.json';

try {
  const rawData = fs.readFileSync(path, 'utf8');
  const data = JSON.parse(rawData);

  data.siswa = data.siswa.map(s => {
    // Generate derived or default fields
    const nama_panggilan = s.nama.split(' ')[0];
    const jurusan = s.kelas; // e.g., 'DKV', 'RPL', 'TKJ'
    // Give a dummy class number, or just XII + jurusan
    const kelas_full = `XII ${jurusan}`; 
    
    // Construct new object with desired fields
    return {
      id: s.id,
      nama_lengkap: s.nama,
      nama_panggilan: nama_panggilan,
      kelas: kelas_full,
      jurusan: jurusan,
      jenis_kelamin: s.jenis_kelamin,
      tempat_tanggal_lahir: s.tempat_tanggal_lahir,
      alamat: s.alamat,
      no_hp: s.no_hp,
      hobi: s.hobi,
      cita_cita: "Menjadi orang sukses dan bermanfaat", // Default
      pesan: "Terima kasih untuk semua kenangannya. See you on top!", // Default
      quote: s.quote_favorit,
      motto_hidup: s.motto_hidup,
      foto: `/images/students/placeholder-${s.jenis_kelamin === 'Laki-laki' ? 'cowok' : 'cewek'}.jpg`, // Default placeholder
      sosial_media: {
        instagram: s.instagram || "",
        tiktok: "",
        twitter: ""
      },
      nostalgia: {
        momen_favorit: "Bercanda bareng teman-teman di kelas.",
        cerita_lucu: "",
        pesan_untuk_angkatan: "Semoga angkatan kita sukses semua!"
      },
      timestamp: s.timestamp,
      catatan: s.catatan
    };
  });

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated biodata_siswa.json!');
} catch (error) {
  console.error('Error:', error);
}
