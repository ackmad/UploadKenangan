'use client';

import Link from 'next/link';
import styles from './hero.module.css';

export default function HeroPage() {
  return (
    <main className={styles.hero}>
      {/* Background image with blur + overlay */}
      <div className={styles.heroBg} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Vignette */}
      <div className={styles.heroVignette} aria-hidden="true" />

      {/* Content */}
      <div className={styles.heroContent}>
        {/* Badge */}
        <p className={`${styles.badge} animate-fade-in-up delay-1`}>
          ✦ Angkatan 2026 · SMK
        </p>

        {/* Headline */}
        <h1 className={`${styles.headline} animate-fade-in-up delay-2`}>
          Tiga Tahun.
          <br />
          <em>Seribu Cerita.</em>
          <br />
          Satu Kenangan.
        </h1>

        {/* Subheadline */}
        <p className={`${styles.subheadline} animate-fade-in-up delay-3`}>
          Simpan foto terbaik masa SMK-mu di sini.
          <br />
          Bersama RPL, TKJ, dan DKV — satu arsip untuk semua cerita.
        </p>

        {/* CTA Buttons */}
        <div className={`${styles.ctaGroup} animate-fade-in-up delay-4`}>
          <Link href="/upload" className="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Kenangan
          </Link>
          <Link href="/gallery" className="btn btn-outline btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Lihat Galeri
          </Link>
        </div>

        {/* Scroll hint */}
        <div className={`${styles.scrollHint} animate-fade-in delay-4`}>
          <span>RPL</span>
          <span className={styles.dot}>·</span>
          <span>TKJ</span>
          <span className={styles.dot}>·</span>
          <span>DKV</span>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </main>
  );
}
