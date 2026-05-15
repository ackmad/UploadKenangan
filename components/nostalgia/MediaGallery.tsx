'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CldImage } from 'next-cloudinary';
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

  // Memoize handlers to prevent re-renders
  const handleOpenLightbox = useCallback((item: NostalgiaMedia) => {
    setLightbox(item);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  // Memoize media items to prevent unnecessary re-renders
  const mediaItems = useMemo(() => {
    return media.map((item, idx) => {
      const isImage = item.type === 'image';
      
      return (
        <MediaCard
          key={item.id}
          item={item}
          index={idx}
          isImage={isImage}
          onOpen={handleOpenLightbox}
        />
      );
    });
  }, [media, handleOpenLightbox]);

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
      {/* Masonry Grid with Mixed Visuals */}
      <div className={styles.masonryGrid}>
        {mediaItems}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          item={lightbox}
          onClose={handleCloseLightbox}
        />
      )}
    </>
  );
}

// Separate MediaCard component for better performance
interface MediaCardProps {
  item: NostalgiaMedia;
  index: number;
  isImage: boolean;
  onOpen: (item: NostalgiaMedia) => void;
}

function MediaCard({ item, index, isImage, onOpen }: MediaCardProps) {
  const handleClick = useCallback(() => {
    onOpen(item);
  }, [item, onOpen]);

  return (
    <div
      className={`${styles.gridItem} ${isImage ? styles.polaroidItem : styles.filmItem}`}
      style={{ 
        animationDelay: `${(index % 20) * 0.05}s`,
        ...(isImage && { '--rot': `${Math.random() * 6 - 3}deg` } as React.CSSProperties)
      }}
      onClick={handleClick}
    >
      <div className={`${styles.mediaCard} ${isImage ? styles.polaroidCard : styles.filmCard}`}>
        
        {/* Film Strip Holes Top */}
        {!isImage && (
          <div className={styles.filmHoles}>
            {Array.from({length: 6}).map((_, i) => <div key={`t-${i}`} className={styles.hole} />)}
          </div>
        )}

        <div className={styles.mediaContainer}>
          {isImage ? (
            <CldImage
              src={item.publicId}
              alt="Nostalgia"
              width={400}
              height={400}
              crop="fill"
              gravity="auto"
              quality="auto:low"
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
              <div className={styles.playIcon}>
                 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          )}
        </div>

        {/* Film Strip Holes Bottom */}
        {!isImage && (
          <div className={styles.filmHoles}>
            {Array.from({length: 6}).map((_, i) => <div key={`b-${i}`} className={styles.hole} />)}
          </div>
        )}

        {/* Polaroid Bottom Area */}
        {isImage && (
          <div className={styles.polaroidBottom}>
            <span className={styles.polaroidTape}></span>
          </div>
        )}

      </div>
    </div>
  );
}

// Separate Lightbox component for better performance
interface LightboxProps {
  item: NostalgiaMedia;
  onClose: () => void;
}

function Lightbox({ item, onClose }: LightboxProps) {
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Generate Cloudinary video URL
  const getVideoUrl = (publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg2kguctm';
    return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${publicId}`;
  };

  // Generate multiple video sources for better compatibility
  const getVideoSources = (publicId: string) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg2kguctm';
    const baseUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;
    
    return [
      {
        src: `${baseUrl}/q_auto,f_mp4/${publicId}`,
        type: 'video/mp4'
      },
      {
        src: `${baseUrl}/q_auto,f_webm/${publicId}`,
        type: 'video/webm'
      }
    ];
  };

  return (
    <div className={styles.lightbox} onClick={handleBackdropClick}>
      <button
        className={styles.lightboxClose}
        onClick={onClose}
        aria-label="Tutup"
      >
        ✕
      </button>
      <div className={styles.lightboxContent} onClick={handleContentClick}>
        {item.type === 'image' ? (
          <CldImage
            src={item.publicId}
            alt="Nostalgia"
            width={1200}
            height={1200}
            crop="limit"
            quality="auto:good"
            format="auto"
            className={styles.lightboxImage}
          />
        ) : (
          <video
            className={styles.lightboxVideo}
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={item.thumbnailUrl}
          >
            {getVideoSources(item.publicId).map((source, idx) => (
              <source key={idx} src={source.src} type={source.type} />
            ))}
            Browser Anda tidak mendukung video HTML5.
          </video>
        )}
      </div>
    </div>
  );
}
