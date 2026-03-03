'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './gallery.module.css';

interface GalleryFile {
    id: string;
    name: string;
    className: string;
    thumbnailUrl: string;
    fullUrl: string;
    createdAt: string;
    resourceType: 'image' | 'video';
}

const FILTERS = ['Semua', 'RPL', 'TKJ', 'DKV'] as const;
type Filter = typeof FILTERS[number];

const CLASS_COLORS: Record<string, string> = {
    RPL: '#5b8dee',
    TKJ: '#48bb78',
    DKV: '#ed8936',
};

// Skeleton card for loading state
function SkeletonCard() {
    return <div className={styles.skeleton} aria-hidden="true" />;
}

// Lightbox Modal
function Lightbox({
    files,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    files: GalleryFile[];
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const file = files[index];

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div className={styles.lightbox} onClick={onClose} role="dialog" aria-modal="true" aria-label="Pratinjau foto">
            <button className={styles.lightboxClose} onClick={onClose} aria-label="Tutup">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <button
                className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Foto sebelumnya"
                disabled={index === 0}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                {file.resourceType === 'video' ? (
                    <video
                        src={file.fullUrl}
                        className={styles.lightboxImg}
                        controls
                        autoPlay
                        playsInline
                    />
                ) : (
                    <img
                        src={file.fullUrl || file.thumbnailUrl}
                        alt={file.name}
                        className={styles.lightboxImg}
                        loading="lazy"
                    />
                )}
                <div className={styles.lightboxMeta}>
                    <span
                        className={styles.lightboxClass}
                        style={{ color: CLASS_COLORS[file.className] ?? 'var(--color-gold)' }}
                    >
                        ● {file.className}
                    </span>
                    <span className={styles.lightboxCounter}>
                        {index + 1} / {files.length}
                    </span>
                </div>
            </div>

            <button
                className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Foto berikutnya"
                disabled={index === files.length - 1}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}

export default function GalleryPage() {
    const [allFiles, setAllFiles] = useState<GalleryFile[]>([]);
    const [filter, setFilter] = useState<Filter>('Semua');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchGallery() {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? 'Gagal memuat galeri');
                setAllFiles(data.files ?? []);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchGallery();
    }, []);

    const filteredFiles = filter === 'Semua'
        ? allFiles
        : allFiles.filter((f) => f.className === filter);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const prevPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
    const nextPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i < filteredFiles.length - 1 ? i + 1 : i)), [filteredFiles.length]);

    return (
        <main className={styles.page}>
            {/* Nav */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Beranda
                </Link>
                <div className={styles.navCenter}>
                    <span className={styles.navTitle}>Galeri Kenangan</span>
                    {!isLoading && (
                        <span className={styles.navCount}>{allFiles.length} foto</span>
                    )}
                </div>
                <Link href="/upload" className="btn btn-primary btn-sm" id="gallery-upload-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload
                </Link>
            </nav>

            <div className={styles.container}>
                {/* Hero accent */}
                <div className={`${styles.galleryHeader} animate-fade-in-up`}>
                    <h1 className={styles.title}>Semua Kenangan Kita</h1>
                    <p className={styles.subtitle}>
                        Arsip digital angkatan 2026 — RPL, TKJ, DKV
                    </p>
                </div>

                {/* Filter tabs */}
                <div className={`${styles.filters} animate-fade-in-up delay-1`} role="tablist" aria-label="Filter kelas">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter(f)}
                            role="tab"
                            aria-selected={filter === f}
                            style={
                                filter === f && f !== 'Semua'
                                    ? { borderColor: CLASS_COLORS[f], color: CLASS_COLORS[f], background: `${CLASS_COLORS[f]}18` }
                                    : {}
                            }
                        >
                            {f}
                            {f !== 'Semua' && !isLoading && (
                                <span className={styles.filterCount}>
                                    {allFiles.filter((x) => x.className === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className={styles.masonry}>
                        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Error state */}
                {!isLoading && error && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyIcon}>⚠️</p>
                        <p className={styles.emptyTitle}>Gagal memuat galeri</p>
                        <p className={styles.emptyDesc}>{error}</p>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && filteredFiles.length === 0 && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyIcon}>📷</p>
                        <p className={styles.emptyTitle}>Belum ada foto di sini</p>
                        <p className={styles.emptyDesc}>
                            Jadilah yang pertama berbagi kenangan kelas {filter !== 'Semua' ? filter : ''}!
                        </p>
                        <Link href="/upload" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Upload Kenangan
                        </Link>
                    </div>
                )}

                {/* Masonry Grid */}
                {!isLoading && !error && filteredFiles.length > 0 && (
                    <div className={styles.masonry}>
                        {filteredFiles.map((file, i) => (
                            <button
                                key={file.id}
                                className={styles.photoCard}
                                onClick={() => openLightbox(i)}
                                aria-label={`Lihat foto ${i + 1} dari kelas ${file.className}`}
                            >
                                <img
                                    src={file.thumbnailUrl || '/placeholder.svg'}
                                    alt={`Kenangan ${file.className}`}
                                    className={styles.photoImg}
                                    loading="lazy"
                                />
                                {file.resourceType === 'video' && (
                                    <div className={styles.videoPlayBadge}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                )}
                                <div className={styles.photoOverlay}>
                                    <span
                                        className={styles.photoClass}
                                        style={{ color: CLASS_COLORS[file.className] ?? 'var(--color-gold)' }}
                                    >
                                        {file.className}
                                    </span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    files={filteredFiles}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                />
            )}
        </main>
    );
}
