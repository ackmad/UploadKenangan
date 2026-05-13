'use client';
import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import styles from './GallerySection.module.css';

interface NostalgiaMedia {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  createdAt: string;
}

export default function GallerySection() {
  const [media, setMedia] = useState<NostalgiaMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<NostalgiaMedia | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetch('/api/nostalgia?folder=skinfaverse21/nostalgia');
        const data = await response.json();
        if (data.success) {
          // Get first 6 images only for preview
          const images = data.media.filter((m: NostalgiaMedia) => m.type === 'image').slice(0, 6);
          setMedia(images);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  return (
    <section id="gallery" className={`section ${styles.gallerySection}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--rose)', boxShadow: 'var(--shadow-sm)' }}>
          📷 Galeri Kenangan
        </span>
        <h2 className={styles.title}>
          Nostalgia <br /><em>Angkatan</em>
        </h2>
        <p className={styles.subtitle}>
          Setiap foto adalah cerita. Setiap cerita adalah kenangan yang tak terlupakan.
        </p>
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className={styles.grid}>
          {media.map((item, idx) => (
            <button
              key={item.id}
              className={styles.polaroid}
              style={{ 
                '--rot': `${(idx % 3 - 1) * 3}deg`,
                animationDelay: `${idx * 0.1}s`
              } as React.CSSProperties}
              onClick={() => setLightbox(item)}
              aria-label="Lihat foto"
            >
              <div className={styles.tape} />
              <div className={styles.photoArea}>
                <CldImage
                  src={item.publicId}
                  alt="Nostalgia"
                  width={400}
                  height={400}
                  crop="fill"
                  gravity="auto"
                  quality="auto"
                  format="auto"
                  loading="lazy"
                  className={styles.photoImg}
                />
              </div>
              <p className={styles.caption}>
                {new Date(item.createdAt).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📸</span>
          <p className={styles.emptyText}>Kenangan sedang dalam perjalanan...</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/nostalgia" className="btn btn-coral btn-lg">
          Lihat Semua Kenangan
        </Link>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxCard} onClick={e => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Tutup">
              ✕
            </button>
            <div className={styles.lightboxPhoto}>
              <CldImage
                src={lightbox.publicId}
                alt="Nostalgia"
                width={1200}
                height={1200}
                crop="limit"
                quality="auto"
                format="auto"
                className={styles.lightboxImg}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
