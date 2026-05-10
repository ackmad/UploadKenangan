'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const student = biodata.siswa.find(s => s.id.toString() === resolvedParams.id);

  if (!student) {
    notFound();
  }

  // Generate some pseudo-random but consistent elements based on ID
  const seed = parseInt(resolvedParams.id);
  const randomTape = seed % 2 === 0 ? styles.tapeYellow : styles.tapePink;
  const rotation = (seed % 5) - 2; // -2 to +2
  const isDKV = student.jurusan === 'DKV';
  const isRPL = student.jurusan === 'RPL';
  
  const themeClass = isDKV ? styles.themeDkv : isRPL ? styles.themeRpl : styles.themeTkj;

  return (
    <>
      <ScrapbookNav />
      <main className={`${styles.main} ${themeClass}`}>
        
        {/* Navigation Back */}
        <div className={styles.backNav}>
          <Link href="/students" className="btn btn-black btn-sm">
            ← Kembali ke Semesta
          </Link>
        </div>

        {/* HERO SECTION */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.tagline}>Beberapa orang hadir bukan cuma untuk lewat… tapi untuk jadi bagian dari cerita.</span>
            <h1 className={styles.nickname}>{student.nama_panggilan}</h1>
            <h2 className={styles.fullname}>{student.nama_lengkap}</h2>
            
            <div className={styles.badges}>
              <span className={styles.badgeClass}>{student.kelas}</span>
              <span className={styles.badgeMajor}>{student.jurusan}</span>
            </div>
            
            <div className={styles.quoteBox}>
              <div className={styles.tape} />
              <p>&quot;{student.quote || student.motto_hidup || 'Jalani saja sebaik mungkin.'}&quot;</p>
            </div>
          </div>

          <div className={styles.heroImageWrap} style={{ transform: `rotate(${rotation}deg)` }}>
            <div className={`${styles.tape} ${randomTape}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={student.foto} alt={student.nama_lengkap} className={styles.heroImage} />
            <div className={styles.polaroidCaption}>
              {student.nama_panggilan} • 2026
            </div>
            <div className={styles.doodleStar}>✨</div>
          </div>
        </header>

        {/* DETAILS SECTION */}
        <div className={styles.detailsGrid}>
          
          {/* Tentang Saya Sticky Note */}
          <section className={`${styles.stickyNote} ${styles.noteBlue}`}>
            <div className={styles.pin} />
            <h3 className={styles.noteTitle}>Tentang Saya 📌</h3>
            <ul className={styles.infoList}>
              <li><strong>Tempat/Tgl Lahir:</strong> {student.tempat_tanggal_lahir}</li>
              <li><strong>Alamat:</strong> {student.alamat}</li>
              {/* @ts-ignore */}
              {student.sosial_media && student.sosial_media.instagram && (
                // @ts-ignore
                <li><strong>Instagram:</strong> {student.sosial_media.instagram}</li>
              )}
            </ul>
          </section>

          {/* Hobi & Cita-cita Scrapbook Paper */}
          <section className={styles.scrapPaper}>
            <div className={`${styles.tape} ${styles.tapeYellow} ${styles.tapeTopLeft}`} />
            <h3 className={styles.scrapTitle}>Visi & Misi 🚀</h3>
            <div className={styles.scrapContent}>
              <div className={styles.scrapBlock}>
                <h4>Hobi:</h4>
                <p>{student.hobi || 'Rebahan sambil scroll TikTok'}</p>
              </div>
              <div className={styles.scrapBlock}>
                <h4>Cita-cita:</h4>
                <p>{student.cita_cita || 'Menjadi orang kaya raya'}</p>
              </div>
            </div>
          </section>

          {/* Pesan & Kesan Torn Paper */}
          <section className={styles.tornPaper}>
            <h3 className={styles.tornTitle}>Pesan untuk Angkatan 21 💌</h3>
            <p className={styles.tornText}>
              {student.pesan || 'Semoga kita semua sukses ya! Jangan lupakan kenangan selama di SKINFA.'}
            </p>
            <div className={styles.doodleHeart}>❤️</div>
          </section>

        </div>
        
        <div className={styles.bottomNav}>
          <Link href={`/students/${parseInt(resolvedParams.id) + 1}`} className="btn btn-coral">
            Lihat Siswa Selanjutnya →
          </Link>
        </div>
      </main>
    </>
  );
}
