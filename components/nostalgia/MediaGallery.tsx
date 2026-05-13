'use client';

import { useState, useEffect } from 'react';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import styles from './MediaGallery.module.css';

export interface NostalgiaMedia {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  createdAt: string;
  folder: string;
  format: string;
}

interface Props {
  folder?: string;
}

export default function MediaGallery({ folder = 'skinfaverse21/nostalgia' }: Props) {
  const [media, setMedia] = useState<NostalgiaMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<NostalgiaMedia | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        const response = await fetch(`/api/nostalgia?folder=${encodeURIComponent(folder)}`);
        const data = await response.json();

        if (data.success) {
          setMedia(data.media);
          setError(null);
        } else {
          setError(data.error || 'Failed to load media');
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Gagal memuat kenangan. Silakan refresh halaman.');
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [folder]);

  const filteredMedia = filter === 'all' ? media : media.filter(m => m.type === filter);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Memuat kenangan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>📷</span>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>📸</span>
        <h3 className={styles.emptyTitle}>Kenangan belum diupload…</h3>
        <p className={styles.emptyText}>
          Ruang ini menunggu untuk diisi dengan momen-momen indah kita bersama.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter buttons */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          Semua ({media.length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'image' ? styles.filterActive : ''}`}
          onClick={() => setFilter('image')}
        >
          📷 Foto ({media.filter(m => m.type === 'image').length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'video' ? styles.filterActive : ''}`}
          onClick={() => setFilter('video')}
        >
          🎬 Video ({media.filter(m => m.type === 'video').length})
        </button>
      </div>

      {/* Masonry Grid */}
      <div className={styles.masonryGrid}>
        {filteredMedia.map((item, idx) => (
          <div
            key={item.id}
            className={styles.gridItem}
            style={{ animationDelay: `${(idx % 20) * 0.03}s` }}
            onClick={() => setLightbox(item)}
          >
            <div className={styles.mediaCard}>
              {item.type === 'image' ? (
                <CldImage
                  src={item.publicId}
                  alt="Nostalgia"
                  width={600}
                  height={600}
                  crop="fill"
                  gravity="auto"
                  quality="auto"
                  format="auto"
                  loading="lazy"
                  className={styles.mediaImage}
                />
              ) : (
                <div className={styles.videoThumb}>
                  <img
                    src={item.thumbnailUrl}
                    alt="Video thumbnail"
                    className={styles.mediaImage}
                    loading="lazy"
                  />
                  <div className={styles.playIcon}>▶</div>
                </div>
              )}
              <div className={styles.mediaOverlay}>
                <span className={styles.mediaType}>
                  {item.type === 'image' ? '📷' : '🎬'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button
            className={styles.lightboxClose}
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            ✕
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            {lightbox.type === 'image' ? (
              <CldImage
                src={lightbox.publicId}
                alt="Nostalgia"
                width={1200}
                height={1200}
                crop="limit"
                quality="auto"
                format="auto"
                className={styles.lightboxImage}
              />
            ) : (
              <CldVideoPlayer
                src={lightbox.publicId}
                width={1200}
                height={675}
                controls
                autoPlay
                className={styles.lightboxVideo}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
