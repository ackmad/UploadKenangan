'use client';
import { useState } from 'react';
import Link from 'next/link';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';

const { gallery } = content;

export default function NostalgiaPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [lightbox, setLightbox] = useState<typeof gallery.photos[0] | null>(null);

  const filtered = activeFilter === 'Semua' ? gallery.photos : gallery.photos.filter(p => p.cat === activeFilter);

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className="tag" style={{ background: 'var(--rose)', boxShadow: 'var(--shadow-sm)' }}>{gallery.sectionTag}</span>
          <h1 className={styles.title}>Nostalgia Angkatan</h1>
          <p className={styles.subtitle}>Telusuri setiap kategori kenangan yang pernah kita ukir bersama.</p>
        </div>

        <div className={styles.filters}>
          {gallery.categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              className={`${styles.polaroid} ${photo.wide ? styles.polaroidWide : ''}`}
              style={{ '--rot': photo.rot, animationDelay: `${(i % 10) * 0.05}s` } as React.CSSProperties}
              onClick={() => setLightbox(photo)}
              aria-label={`Lihat foto: ${photo.caption}`}
            >
              <div className={styles.tape} />
              <div className={styles.photoArea} style={{ background: photo.bg }}>
                <span className={styles.photoEmoji}>{photo.emoji}</span>
              </div>
              <p className={styles.caption}>{photo.caption}</p>
              <span className={styles.catTag}>{photo.cat}</span>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/" className="btn btn-black btn-lg">
            Kembali ke Beranda
          </Link>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
            <div className={styles.lightboxCard} onClick={e => e.stopPropagation()}>
              <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Tutup">✕</button>
              <div className={styles.lightboxPhoto} style={{ background: lightbox.bg }}>
                <span className={styles.lightboxEmoji}>{lightbox.emoji}</span>
              </div>
              <div className={styles.lightboxInfo}>
                <p className={styles.lightboxCaption}>{lightbox.caption}</p>
                <span className={`tag ${styles.lightboxTag}`} style={{ background: 'var(--yellow)' }}>{lightbox.cat}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
