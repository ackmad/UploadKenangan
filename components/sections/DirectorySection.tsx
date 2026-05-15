'use client';

import Link from 'next/link';
import styles from './DirectorySection.module.css';

export default function DirectorySection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="tag" style={{ background: 'var(--blue)', color: 'white' }}>Direktori</span>
          <h2 className={styles.title}>Jelajahi<br/><em>Kenangan Kita</em></h2>
          <p className={styles.subtitle}>Pilih destinasi memori yang ingin kamu kunjungi hari ini.</p>
        </div>

        <div className={styles.grid}>
          {/* Card: Kelas & Siswa */}
          <Link href="/students" className={styles.card}>
            <div className={styles.cardContent} style={{ background: 'var(--yellow)' }}>
              <span className={styles.emoji}>🎓</span>
              <h3>Kelas &amp; Siswa</h3>
              <p>Jelajahi galaksi yang berisi profil lengkap seluruh teman-teman angkatan 21.</p>
              <div className={styles.arrow}>→</div>
            </div>
            <div className={styles.cardShadow}></div>
          </Link>

          {/* Card: Guru */}
          <Link href="/guru" className={styles.card}>
            <div className={styles.cardContent} style={{ background: 'var(--peach)' }}>
              <span className={styles.emoji}>👨‍🏫</span>
              <h3>Guru Kita</h3>
              <p>Mengingat kembali pahlawan tanpa tanda jasa yang membimbing kita selama ini.</p>
              <div className={styles.arrow}>→</div>
            </div>
            <div className={styles.cardShadow}></div>
          </Link>

          {/* Card: Yearbook */}
          <Link href="/yearbook" className={styles.card}>
            <div className={styles.cardContent} style={{ background: 'var(--blue)', color: 'white' }}>
              <span className={styles.emoji}>📖</span>
              <h3 style={{ color: 'white' }}>Digital Yearbook</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)' }}>Buka buku kenangan virtual dengan desain scrapbook yang interaktif.</p>
              <div className={styles.arrow} style={{ color: 'white' }}>→</div>
            </div>
            <div className={styles.cardShadow}></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
