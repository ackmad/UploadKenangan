'use client';

import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import biodataList from '@/data/biodata_siswa.json';

// Calculate class statistics
const getClassStats = (kelas: string) => {
  const siswa = biodataList.filter(s => s.kelas === kelas);
  const laki = siswa.filter(s => s.jenis_kelamin === 'Laki-laki').length;
  const perempuan = siswa.filter(s => s.jenis_kelamin === 'Perempuan').length;
  return { total: siswa.length, laki, perempuan };
};

// Compute metadata dynamically from the flat JSON array
const totalSiswa = biodataList.length;
const uniqueKelas = [...new Set(biodataList.map(s => s.kelas))];

const KELAS_DATA = [
  {
    id: 'rpl',
    nama: 'RPL',
    namaLengkap: 'Rekayasa Perangkat Lunak',
    tagline: 'Kelas paling ribut tapi paling susah dilupain',
    warna: '#FF6B6B',
    warnaSecondary: '#FFE66D',
    emoji: '💻',
    doodles: ['⚡', '🚀', '💡', '🎮'],
    stats: getClassStats('RPL'),
    funFact: 'Kelas dengan jumlah laptop terbanyak',
  },
  {
    id: 'tkj',
    nama: 'TKJ',
    namaLengkap: 'Teknik Komputer & Jaringan',
    tagline: 'Tempat semua cerita random dimulai',
    warna: '#4ECDC4',
    warnaSecondary: '#95E1D3',
    emoji: '🔧',
    doodles: ['🌐', '⚙️', '🔌', '📡'],
    stats: getClassStats('TKJ'),
    funFact: 'Kelas paling sering ngoprek hardware',
  },
  {
    id: 'dkv',
    nama: 'DKV',
    namaLengkap: 'Desain Komunikasi Visual',
    tagline: 'Kelas paling aesthetic dan kreatif',
    warna: '#C77DFF',
    warnaSecondary: '#E0AAFF',
    emoji: '🎨',
    doodles: ['✨', '🖌️', '🎭', '📸'],
    stats: getClassStats('DKV'),
    funFact: 'Kelas dengan hasil karya paling banyak',
  },
];

export default function StudentsPage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>🎓 Angkatan 21</span>
            <h1 className={styles.title}>
              Kelas & <em>Siswa</em>
            </h1>
            <p className={styles.subtitle}>
              Setiap kelas punya cerita, karakter, dan kenangan sendiri. 
              Pilih kelasmu dan buka kapsul waktu digital yang penuh nostalgia.
            </p>
          </div>
          
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{totalSiswa}</span>
              <span className={styles.statLabel}>Total Siswa</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{uniqueKelas.length}</span>
              <span className={styles.statLabel}>Jurusan</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Tahun Bersama</span>
            </div>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className={styles.classGrid}>
          {KELAS_DATA.map((kelas, idx) => (
            <Link
              key={kelas.id}
              href={`/students/class/${kelas.id}`}
              className={styles.classCard}
              style={{
                '--card-color': kelas.warna,
                '--card-secondary': kelas.warnaSecondary,
                animationDelay: `${idx * 0.15}s`,
              } as React.CSSProperties}
            >
              {/* Decorative elements */}
              <div className={styles.cardDoodles}>
                {kelas.doodles.map((doodle, i) => (
                  <span
                    key={i}
                    className={styles.doodle}
                    style={{
                      '--doodle-delay': `${i * 0.5}s`,
                    } as React.CSSProperties}
                  >
                    {doodle}
                  </span>
                ))}
              </div>

              {/* Card Content */}
              <div className={styles.cardHeader}>
                <span className={styles.cardEmoji}>{kelas.emoji}</span>
                <div>
                  <h2 className={styles.cardTitle}>{kelas.nama}</h2>
                  <p className={styles.cardSubtitle}>{kelas.namaLengkap}</p>
                </div>
              </div>

              <p className={styles.cardTagline}>&quot;{kelas.tagline}&quot;</p>

              {/* Stats */}
              <div className={styles.cardStats}>
                <div className={styles.cardStat}>
                  <span className={styles.cardStatIcon}>👥</span>
                  <span className={styles.cardStatValue}>{kelas.stats.total}</span>
                  <span className={styles.cardStatLabel}>Siswa</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.cardStatIcon}>👨</span>
                  <span className={styles.cardStatValue}>{kelas.stats.laki}</span>
                  <span className={styles.cardStatLabel}>Laki-laki</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.cardStatIcon}>👩</span>
                  <span className={styles.cardStatValue}>{kelas.stats.perempuan}</span>
                  <span className={styles.cardStatLabel}>Perempuan</span>
                </div>
              </div>

              {/* Fun Fact */}
              <div className={styles.cardFunFact}>
                <span className={styles.funFactIcon}>💡</span>
                <span className={styles.funFactText}>{kelas.funFact}</span>
              </div>

              {/* CTA */}
              <div className={styles.cardCta}>
                <span>Buka Semesta Kelas</span>
                <span className={styles.cardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomCard}>
            <h3 className={styles.bottomTitle}>Cari Siswa Tertentu?</h3>
            <p className={styles.bottomText}>
              Masuk ke halaman kelas untuk melihat seluruh siswa dan detail profil mereka.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
