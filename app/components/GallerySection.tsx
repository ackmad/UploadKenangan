'use client';
import { useState } from 'react';
import styles from './GallerySection.module.css';
import content from '@/data/content.json';

const { gallery } = content;

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [lightbox, setLightbox] = useState<typeof gallery.photos[0] | null>(null);

  const filtered = activeFilter === 'Semua' ? gallery.photos : gallery.photos.filter(p => p.cat === activeFilter);
  const previewPhotos = filtered.slice(0, 6);

  return (
    <section id="gallery" className={`section ${styles.gallerySection}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--rose)', boxShadow: 'var(--shadow-sm)' }}>{gallery.sectionTag}</span>
        <h2 className={styles.title}>{gallery.title}<br /><em>{gallery.titleEm}</em></h2>
        <p className={styles.subtitle}>{gallery.subtitle}</p>
      </div>

      {/* Filter tabs */}
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

      {/* Photo grid */}
      <div className={styles.grid}>
        {previewPhotos.map(photo => (
          <button
            key={photo.id}
            className={`${styles.polaroid} ${photo.wide ? styles.polaroidWide : ''}`}
            style={{ '--rot': photo.rot } as React.CSSProperties}
            onClick={() => setLightbox(photo)}
            aria-label={`Lihat foto: ${photo.caption}`}
          >
            {/* Tape */}
            <div className={styles.tape} />
            {/* Photo area */}
            <div className={styles.photoArea} style={{ background: photo.bg }}>
              <span className={styles.photoEmoji}>{photo.emoji}</span>
            </div>
            {/* Caption */}
            <p className={styles.caption}>{photo.caption}</p>
            {/* Category tag */}
            <span className={styles.catTag}>{photo.cat}</span>
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a href="/nostalgia" className="btn btn-coral btn-lg">
          Lihat Semua Kenangan
        </a>
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
    </section>
  );
}
