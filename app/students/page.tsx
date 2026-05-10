'use client';
import { useState } from 'react';
import Link from 'next/link';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const JURUSAN_LIST = ["Semua", "RPL", "TKJ", "DKV"];
const BG_COLORS = ['#FF9B9B', '#A8E6CF', '#C3B1E1', '#FFD166', '#89C4E1', '#FFCBA4'];
const DOODLES = ['⭐', '✨', '⚡', '💫', '🎨', '🚀', '🌟', '🎮'];

export default function StudentsPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSiswa = (biodata.siswa || []).filter((s) => {
    const matchJurusan = activeFilter === "Semua" || s.jurusan === activeFilter;
    const safeSearch = searchQuery.toLowerCase();
    const matchSearch = (s.nama_lengkap || '').toLowerCase().includes(safeSearch) || 
                        (s.nama_panggilan || '').toLowerCase().includes(safeSearch) ||
                        (s.kelas || '').toLowerCase().includes(safeSearch) ||
                        (s.jurusan || '').toLowerCase().includes(safeSearch);
    return matchJurusan && matchSearch;
  });

  const renderGrid = (siswaList: typeof biodata.siswa) => {
    if (siswaList.length === 0) return null;
    return (
      <div className={styles.grid}>
        {siswaList.map((siswa, i) => {
          const randomBg = BG_COLORS[i % BG_COLORS.length];
          const randomDoodle = DOODLES[i % DOODLES.length];
          const rotation = (i % 2 === 0 ? 1 : -1) * ((i % 3) + 1);

          return (
            <Link 
              href={`/students/${siswa.id}`} 
              key={siswa.id} 
              className={styles.card} 
              style={{ 
                animationDelay: `${(i % 10) * 0.05}s`,
                '--rot': `${rotation}deg`,
                '--card-bg': randomBg 
              } as React.CSSProperties}
            >
              <div className={styles.tape} />
              <div className={styles.doodle}>{randomDoodle}</div>
              
              <div className={styles.photoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={siswa.foto} alt={siswa.nama_panggilan} className={styles.photo} loading="lazy" />
                <span className={styles.kelasBadge}>{siswa.kelas}</span>
              </div>
              
              <div className={styles.info}>
                <h3 className={styles.name}>{siswa.nama_panggilan}</h3>
                <p className={styles.fullName}>{siswa.nama_lengkap}</p>
                <blockquote className={styles.quote}>&quot;{siswa.quote || siswa.motto_hidup}&quot;</blockquote>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet The Universe.</h1>
          <p className={styles.subtitle}>Angkatan 21 bukan sekadar kumpulan nama. Mereka adalah bagian dari cerita besar SKINFAVERSE.</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <input 
              type="text" 
              placeholder="Cari nama, kelas, atau jurusan..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <div className={styles.filters}>
            {JURUSAN_LIST.map(j => (
              <button 
                key={j} 
                className={`${styles.filterBtn} ${activeFilter === j ? styles.active : ''}`}
                onClick={() => setActiveFilter(j)}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.contentArea}>
          {filteredSiswa.length > 0 ? (
            <>
              {(activeFilter === 'Semua' || activeFilter === 'RPL') && filteredSiswa.filter(s => s.jurusan === 'RPL').length > 0 && (
                <div className={styles.jurusanSection}>
                  <h2 className={styles.jurusanTitle}>RPL <span className={styles.jurusanDot}>•</span> Rekayasa Perangkat Lunak</h2>
                  {renderGrid(filteredSiswa.filter(s => s.jurusan === 'RPL'))}
                </div>
              )}
              
              {(activeFilter === 'Semua' || activeFilter === 'TKJ') && filteredSiswa.filter(s => s.jurusan === 'TKJ').length > 0 && (
                <div className={styles.jurusanSection}>
                  <h2 className={styles.jurusanTitle}>TKJ <span className={styles.jurusanDot}>•</span> Teknik Komputer & Jaringan</h2>
                  {renderGrid(filteredSiswa.filter(s => s.jurusan === 'TKJ'))}
                </div>
              )}
              
              {(activeFilter === 'Semua' || activeFilter === 'DKV') && filteredSiswa.filter(s => s.jurusan === 'DKV').length > 0 && (
                <div className={styles.jurusanSection}>
                  <h2 className={styles.jurusanTitle}>DKV <span className={styles.jurusanDot}>•</span> Desain Komunikasi Visual</h2>
                  {renderGrid(filteredSiswa.filter(s => s.jurusan === 'DKV'))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>👻</span>
              <p>Yah, tidak ada siswa yang cocok dengan pencarianmu.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
