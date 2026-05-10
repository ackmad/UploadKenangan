'use client';

import { useState } from 'react';
import Link from 'next/link';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const PAGES = [
  {
    id: 'cover',
    label: 'Cover',
    emoji: '📚',
    bg: '#1a1a1a',
    content: { type: 'cover' }
  },
  {
    id: 'sambutan',
    label: 'Sambutan',
    emoji: '🏫',
    bg: '#F9F5EE',
    content: { type: 'sambutan' }
  },
  {
    id: 'rpl',
    label: 'Kelas RPL',
    emoji: '💻',
    bg: '#EBF6FF',
    content: { type: 'kelas', jurusan: 'RPL', color: '#89C4E1' }
  },
  {
    id: 'tkj',
    label: 'Kelas TKJ',
    emoji: '🔌',
    bg: '#FFFAEB',
    content: { type: 'kelas', jurusan: 'TKJ', color: '#FFD166' }
  },
  {
    id: 'dkv',
    label: 'Kelas DKV',
    emoji: '🎨',
    bg: '#FFF0F5',
    content: { type: 'kelas', jurusan: 'DKV', color: '#E8A0BF' }
  },
  {
    id: 'memories',
    label: 'Kenangan',
    emoji: '📷',
    bg: '#F0FFF4',
    content: { type: 'memories' }
  },
  {
    id: 'penutup',
    label: 'Penutup',
    emoji: '🎓',
    bg: '#1a1a1a',
    content: { type: 'penutup' }
  }
];

const siswaRPL = biodata.siswa.filter(s => s.jurusan === 'RPL').slice(0, 6);
const siswaTKJ = biodata.siswa.filter(s => s.jurusan === 'TKJ').slice(0, 6);
const siswaDKV = biodata.siswa.filter(s => s.jurusan === 'DKV').slice(0, 6);

function getSiswa(jurusan: string) {
  if (jurusan === 'RPL') return siswaRPL;
  if (jurusan === 'TKJ') return siswaTKJ;
  return siswaDKV;
}

export default function YearbookPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPage = (idx: number, dir: 'next' | 'prev') => {
    if (isFlipping || idx < 0 || idx >= PAGES.length) return;
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(idx);
      setIsFlipping(false);
    }, 400);
  };

  const page = PAGES[currentPage];

  return (
    <>
      {!isFullscreen && <ScrapbookNav />}
      <main className={`${styles.main} ${isFullscreen ? styles.fullscreen : ''}`}>

        {/* HERO */}
        {!isFullscreen && (
          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.heroTag}>📚 Album Digital</div>
              <h1 className={styles.heroTitle}>Every Page Holds<br />A Memory.</h1>
              <p className={styles.heroSub}>
                Bukan sekadar buku tahunan. Ini kapsul waktu Angkatan 21.
              </p>
            </div>
            <div className={styles.heroPreview}>
              <div className={styles.bookCover}>
                <div className={styles.bookSpine} />
                <div className={styles.bookFace}>
                  <p className={styles.bookYear}>2026</p>
                  <p className={styles.bookTitle}>SKINFAVERSE</p>
                  <p className={styles.bookTitle21}>21</p>
                  <p className={styles.bookSub}>Album Kenangan Digital</p>
                  <div className={styles.bookStar}>⭐</div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* ACTION BUTTONS */}
        {!isFullscreen && (
          <div className={styles.actionRow}>
            <button className="btn btn-black btn-lg" onClick={() => setIsFullscreen(true)}>
              📖 Buka Album
            </button>
            <button className="btn btn-yellow btn-lg">
              ⬇️ Download PDF
            </button>
            <button className="btn btn-coral btn-lg">
              🖨️ Print Version
            </button>
          </div>
        )}

        {/* BOOK READER */}
        <div className={`${styles.reader} ${isFullscreen ? styles.readerFullscreen : ''}`}>

          {/* Fullscreen Controls */}
          {isFullscreen && (
            <div className={styles.fsBar}>
              <button className={styles.fsClose} onClick={() => setIsFullscreen(false)}>
                ✕ Tutup
              </button>
              <span className={styles.fsTitle}>SKINFAVERSE21 — Album Kenangan Digital</span>
              <button className="btn btn-yellow btn-sm">⬇️ Download</button>
            </div>
          )}

          {/* Page Navigation Tabs */}
          <div className={styles.pageTabs}>
            {PAGES.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.pageTab} ${currentPage === i ? styles.pageTabActive : ''}`}
                onClick={() => goToPage(i, i > currentPage ? 'next' : 'prev')}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          {/* Book Pages */}
          <div className={`${styles.bookWrap} ${isFlipping ? (flipDir === 'next' ? styles.flipNext : styles.flipPrev) : ''}`}>
            <div className={styles.bookPage} style={{ background: page.bg }}>

              {/* COVER PAGE */}
              {page.content.type === 'cover' && (
                <div className={styles.coverPage}>
                  <div className={styles.coverGrain} />
                  <p className={styles.coverYear}>2023 — 2026</p>
                  <h2 className={styles.coverTitle}>SKINFAVERSE</h2>
                  <h3 className={styles.cover21}>21</h3>
                  <p className={styles.coverSub}>Album Kenangan Digital · Angkatan 21</p>
                  <p className={styles.coverSchool}>SMK Informatika Al-Irsyad Al-Islamiyyah</p>
                  <div className={styles.coverQuote}>
                    &quot;Suatu hari nanti, kita akan membuka halaman ini lagi…<br />
                    dan sadar kalau ternyata kita pernah sebahagia itu.&quot;
                  </div>
                  <div className={styles.coverDoodles}>
                    <span>⭐</span><span>📚</span><span>🎓</span><span>💛</span><span>✨</span>
                  </div>
                </div>
              )}

              {/* SAMBUTAN PAGE */}
              {page.content.type === 'sambutan' && (
                <div className={styles.sambutanPage}>
                  <div className={styles.tape} />
                  <h2 className={styles.sambutanTitle}>Kata Pengantar</h2>
                  <div className={styles.sambutanGrid}>
                    <div className={styles.sambutanCard}>
                      <div className={styles.sambutanEmoji}>🏫</div>
                      <h3>Sambutan Kepala Sekolah</h3>
                      <p>
                        Selamat kepada Angkatan 21 atas seluruh pencapaian selama tiga tahun ini.
                        Kalian telah membuktikan bahwa SKINFA bukan sekadar sekolah —
                        ini adalah rumah kedua yang membentuk karakter dan masa depan kalian.
                      </p>
                      <p className={styles.sambutanSign}>— Kepala Sekolah SKINFA</p>
                    </div>
                    <div className={styles.sambutanCard}>
                      <div className={styles.sambutanEmoji}>❤️</div>
                      <h3>Dari Angkatan 21</h3>
                      <p>
                        Album ini adalah bentuk cinta kami kepada setiap momen,
                        setiap tawa, setiap air mata, dan setiap cerita yang terjadi
                        di antara kita. Untuk tiga tahun yang tidak akan pernah kami lupakan.
                      </p>
                      <p className={styles.sambutanSign}>— Angkatan 21, SKINFA 2026</p>
                    </div>
                  </div>
                  <div className={styles.sambutanStats}>
                    <div className={styles.sambutanStat}>
                      <span>{biodata.siswa.length}</span>
                      <p>Siswa</p>
                    </div>
                    <div className={styles.sambutanStat}>
                      <span>3</span>
                      <p>Jurusan</p>
                    </div>
                    <div className={styles.sambutanStat}>
                      <span>3</span>
                      <p>Tahun</p>
                    </div>
                    <div className={styles.sambutanStat}>
                      <span>∞</span>
                      <p>Kenangan</p>
                    </div>
                  </div>
                </div>
              )}

              {/* KELAS PAGE */}
              {page.content.type === 'kelas' && (
                <div className={styles.kelasPage}>
                  <div className={styles.kelasHeader} style={{ background: (page.content as {type:string;jurusan:string;color:string}).color }}>
                    <h2 className={styles.kelasTitle}>{(page.content as {type:string;jurusan:string;color:string}).jurusan}</h2>
                    <p>Angkatan 21 · SKINFA 2026</p>
                  </div>
                  <div className={styles.kelasGrid}>
                    {getSiswa((page.content as {type:string;jurusan:string;color:string}).jurusan).map((s, i) => (
                      <div key={s.id} className={styles.siswaCard} style={{ animationDelay: `${i * 0.05}s` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.foto} alt={s.nama_panggilan} className={styles.siswaPhoto} />
                        <p className={styles.siswaNick}>{s.nama_panggilan}</p>
                        <p className={styles.siswaKelas}>{s.kelas}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/students`} className={styles.kelasLink}>
                    Lihat semua siswa →
                  </Link>
                </div>
              )}

              {/* MEMORIES PAGE */}
              {page.content.type === 'memories' && (
                <div className={styles.memoriesPage}>
                  <div className={styles.tape} style={{ left: '30%' }} />
                  <h2 className={styles.memoriesTitle}>Momen Terbaik Kita</h2>
                  <div className={styles.memoriesGrid}>
                    {['🏫', '⚽', '💼', '🚌', '🎬', '🎓'].map((emoji, i) => (
                      <div key={i} className={styles.memoryCard} style={{ transform: `rotate(${(i%2===0?1:-1)*(i%3+1)}deg)` }}>
                        <div className={styles.memoryCardTape} />
                        <div className={styles.memoryPhoto}>{emoji}</div>
                        <p className={styles.memoryLabel}>
                          {['MPLS', 'Classmeet', 'PKL', 'Study Tour', 'Film', 'Wisuda'][i]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PENUTUP PAGE */}
              {page.content.type === 'penutup' && (
                <div className={styles.penutupPage}>
                  <div className={styles.penutupGrain} />
                  <div className={styles.penutupContent}>
                    <p className={styles.penutupSub}>Angkatan 21 · SKINFA · 2026</p>
                    <h2 className={styles.penutupTitle}>Terima Kasih.</h2>
                    <p className={styles.penutupText}>
                      Untuk setiap pagi yang terasa berat untuk dijalani.
                      Untuk setiap tugas yang hampir membuat menyerah.
                      Untuk setiap tawa yang terasa tidak akan berhenti.
                      Untuk setiap momen yang kita pikir biasa — yang ternyata luar biasa.
                    </p>
                    <div className={styles.penutupQuote}>
                      &quot;Suatu hari nanti, kita akan membuka halaman ini lagi…
                      dan sadar kalau ternyata kita pernah sebahagia itu.&quot;
                    </div>
                    <div className={styles.penutupEmojis}>
                      ❤️ 💛 ✨ 🎓 📚 🌟
                    </div>
                  </div>
                </div>
              )}

              {/* Page number */}
              <div className={styles.pageNum}>
                {currentPage + 1} / {PAGES.length}
              </div>
            </div>
          </div>

          {/* Prev / Next Nav */}
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => goToPage(currentPage - 1, 'prev')}
              disabled={currentPage === 0}
            >
              ← Halaman Sebelumnya
            </button>
            <button
              className={styles.navBtn}
              onClick={() => goToPage(currentPage + 1, 'next')}
              disabled={currentPage === PAGES.length - 1}
            >
              Halaman Selanjutnya →
            </button>
          </div>
        </div>

        {!isFullscreen && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
          </div>
        )}
      </main>
    </>
  );
}
