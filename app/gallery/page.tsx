'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './gallery.module.css';
import lockedStyles from './locked.module.css';

interface GalleryFile {
    id: string;
    name: string;
    className: string;
    thumbnailUrl: string;
    fullUrl: string;
    createdAt: string;
    resourceType: 'image' | 'video';
    width: number;
    height: number;
}

const FILTERS = ['Semua', 'RPL', 'TKJ', 'DKV'] as const;
type Filter = typeof FILTERS[number];

const CLASS_COLORS: Record<string, string> = {
    RPL: '#5b8dee',
    TKJ: '#48bb78',
    DKV: '#ed8936',
};

// Warna badge kelas di card gelap — cukup terang agar terbaca di dark parchment
const CLASS_COLORS_DARK: Record<string, string> = {
    RPL: '#7da2f0',   // soft blue — varian terang dari #5b8dee
    TKJ: '#5ecf8a',   // soft green — varian terang dari #48bb78
    DKV: '#f0a060',   // soft amber — varian terang dari #ed8936
};

const TAPE_VARIANTS = ['tapeCenter', 'tapeLeft', 'tapeRight'] as const;

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

// Generate unique z-index based on item position for stacking
function getZIndex(i: number, total: number): number {
    return Math.floor((i / total) * 10) + 1;
}

// Format time for video player mm:ss
function formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Skeleton Polaroid ──────────────────────────────────
function SkeletonCard() {
    return (
        <div className={styles.skeleton} aria-hidden="true">
            <div className={styles.skeletonInner} />
        </div>
    );
}

// ─── Video Player Controls ──────────────────────────────
function VideoPlayer({ src, autoPlay }: { src: string; autoPlay?: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay ?? true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const hideTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const onTimeUpdate = () => setCurrentTime(v.currentTime);
        const onLoadedMetadata = () => setDuration(v.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        v.addEventListener('timeupdate', onTimeUpdate);
        v.addEventListener('loadedmetadata', onLoadedMetadata);
        v.addEventListener('play', onPlay);
        v.addEventListener('pause', onPause);
        v.addEventListener('ended', onEnded);

        return () => {
            v.removeEventListener('timeupdate', onTimeUpdate);
            v.removeEventListener('loadedmetadata', onLoadedMetadata);
            v.removeEventListener('play', onPlay);
            v.removeEventListener('pause', onPause);
            v.removeEventListener('ended', onEnded);
        };
    }, []);

    // Auto-hide controls
    useEffect(() => {
        if (isPlaying) {
            hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
        } else {
            setControlsVisible(true);
        }
        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [isPlaying, currentTime]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) { v.play(); } else { v.pause(); }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const v = videoRef.current;
        const bar = progressRef.current;
        if (!v || !bar) return;
        const rect = bar.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        v.currentTime = x * v.duration;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            setIsMuted(val === 0);
        }
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        if (isMuted) {
            v.muted = false;
            setIsMuted(false);
            v.volume = volume || 0.5;
        } else {
            v.muted = true;
            setIsMuted(true);
        }
    };

    const changeSpeed = (s: number) => {
        setSpeed(s);
        if (videoRef.current) videoRef.current.playbackRate = s;
        setShowSpeedMenu(false);
    };

    const skip = (seconds: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + seconds));
    };

    const toggleFullscreen = () => {
        const v = videoRef.current;
        if (!v) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            v.requestFullscreen?.();
        }
    };

    const handleMouseMove = () => {
        setControlsVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (isPlaying) {
            hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className={styles.lightboxVideoWrap}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setControlsVisible(true)}
            onClick={(e) => {
                // Only toggle play if clicking the video area, not controls
                const target = e.target as HTMLElement;
                if (target.tagName === 'VIDEO') togglePlay();
            }}
        >
            <video
                ref={videoRef}
                src={src}
                autoPlay={autoPlay}
                playsInline
                preload="metadata"
            />
            <div className={`${styles.videoControls} ${controlsVisible ? styles.videoControlsVisible : ''}`}>
                {/* Progress bar */}
                <div
                    ref={progressRef}
                    className={styles.videoProgress}
                    onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
                >
                    <div className={styles.videoProgressFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.videoControlsRow}>
                    <div className={styles.videoControlsLeft}>
                        {/* Play / Pause */}
                        <button className={styles.videoControlBtn} onClick={(e) => { e.stopPropagation(); togglePlay(); }} aria-label={isPlaying ? 'Pause' : 'Play'}>
                            {isPlaying ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                        </button>

                        {/* Rewind 10s */}
                        <button className={styles.videoControlBtn} onClick={(e) => { e.stopPropagation(); skip(-10); }} aria-label="Mundur 10 detik">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 4v6h6" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                        </button>

                        {/* Forward 10s */}
                        <button className={styles.videoControlBtn} onClick={(e) => { e.stopPropagation(); skip(10); }} aria-label="Maju 10 detik">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 4v6h-6" />
                                <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                            </svg>
                        </button>

                        {/* Volume */}
                        <div className={styles.volumeControl}>
                            <button className={styles.videoControlBtn} onClick={(e) => { e.stopPropagation(); toggleMute(); }} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                                {isMuted || volume === 0 ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <line x1="23" y1="9" x2="17" y2="15" />
                                        <line x1="17" y1="9" x2="23" y2="15" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className={styles.volumeSlider}
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Volume"
                            />
                        </div>

                        {/* Time */}
                        <span className={styles.videoTime}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className={styles.videoControlsRight}>
                        {/* Speed */}
                        <div className={styles.speedSelector}>
                            {showSpeedMenu && (
                                <div className={styles.speedMenu} onClick={(e) => e.stopPropagation()}>
                                    {SPEED_OPTIONS.map((s) => (
                                        <button
                                            key={s}
                                            className={`${styles.speedOption} ${speed === s ? styles.speedOptionActive : ''}`}
                                            onClick={() => changeSpeed(s)}
                                        >
                                            {s}x
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                className={styles.speedBtn}
                                onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                            >
                                {speed}x
                            </button>
                        </div>

                        {/* Fullscreen */}
                        <button className={styles.videoControlBtn} onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} aria-label="Fullscreen">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Lightbox Modal ─────────────────────────────────────
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
            if (e.key === ' ') e.preventDefault(); // space for video play/pause
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Use the thumbnail as the blurred background
    const bgImage = file.thumbnailUrl || file.fullUrl;

    return (
        <div className={styles.lightbox} onClick={onClose} role="dialog" aria-modal="true" aria-label="Pratinjau media">
            {/* Blurred background */}
            <div
                className={styles.lightboxBackdrop}
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className={styles.lightboxBackdropOverlay} />

            {/* Close */}
            <button className={styles.lightboxClose} onClick={onClose} aria-label="Tutup">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Prev */}
            <button
                className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Sebelumnya"
                disabled={index === 0}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Content */}
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                {file.resourceType === 'video' ? (
                    <VideoPlayer src={file.fullUrl} autoPlay />
                ) : (
                    <img
                        src={file.fullUrl || file.thumbnailUrl}
                        alt={file.name}
                        className={styles.lightboxMedia}
                        loading="lazy"
                    />
                )}
                <div className={styles.lightboxMeta}>
                    <div>
                        <span className={styles.lightboxFileName}>{file.name}</span>
                        <span
                            className={styles.lightboxClass}
                            style={{ color: CLASS_COLORS[file.className] ?? 'var(--color-gold)', marginLeft: '12px' }}
                        >
                            ● {file.className}
                        </span>
                    </div>
                    <span className={styles.lightboxCounter}>
                        {index + 1} / {files.length}
                    </span>
                </div>
            </div>

            {/* Next */}
            <button
                className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Berikutnya"
                disabled={index === files.length - 1}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}

// ─── Main Gallery Page ──────────────────────────────────
export default function GalleryPage() {
    const [allFiles, setAllFiles] = useState<GalleryFile[]>([]);
    const [filter, setFilter] = useState<Filter>('Semua');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isLocked, setIsLocked] = useState<boolean | null>(null);

    // Cek status lock
    useEffect(() => {
        async function checkLock() {
            try {
                const res = await fetch('/api/gallery-status');
                const data = await res.json();
                setIsLocked(data.locked === true);
            } catch {
                setIsLocked(false);
            }
        }
        checkLock();
    }, []);

    useEffect(() => {
        if (isLocked === false) {
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
        }
    }, [isLocked]);

    const filteredFiles = filter === 'Semua'
        ? allFiles
        : allFiles.filter((f) => f.className === filter);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const prevPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
    const nextPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i < filteredFiles.length - 1 ? i + 1 : i)), [filteredFiles.length]);

    // ─── Loading check ──────────────────────────────────
    if (isLocked === null) {
        return (
            <main className={lockedStyles.lockedPage}>
                <div className={lockedStyles.lockedCard} style={{ padding: '60px 40px' }}>
                    <div className={lockedStyles.lockIconWrap}>
                        <div className={lockedStyles.lockIconBg}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Memuat...</p>
                </div>
            </main>
        );
    }

    // ─── Locked state ───────────────────────────────────
    if (isLocked) {
        return (
            <main className={lockedStyles.lockedPage}>
                <span className={lockedStyles.star}>✦</span>
                <span className={lockedStyles.star}>✦</span>
                <span className={lockedStyles.star}>✦</span>
                <span className={lockedStyles.star}>✦</span>
                <span className={lockedStyles.star}>✦</span>

                <div className={lockedStyles.lockedCard}>
                    <div className={lockedStyles.lockIconWrap}>
                        <div className={lockedStyles.pulseRing} />
                        <div className={lockedStyles.pulseRing} />
                        <div className={lockedStyles.lockIconBg}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                    </div>

                    <div className={lockedStyles.badge}>
                        <span>✦</span>
                        SMK Angkatan 2026
                    </div>

                    <h1 className={lockedStyles.headline}>
                        Sabar dulu,{' '}
                        <span className={lockedStyles.headlineAccent}>ya~</span>
                    </h1>

                    <p className={lockedStyles.message}>
                        Saat ini kamu{' '}
                        <span className={lockedStyles.messageHighlight}>belum bisa lihat foto-fotonya dulu.</span>
                        <br />
                        Galeri masih kami tutup sementara.
                    </p>

                    <p className={lockedStyles.submessage}>
                        Kumpulin aja foto sebanyak-banyaknya! 📸
                        <br />
                        Setelah galeri dibuka, semua kenangan kita bisa dilihat bersama.
                    </p>

                    <div className={lockedStyles.divider} />

                    <div className={lockedStyles.actions}>
                        <Link href="/upload" className={lockedStyles.btnUpload}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload Fotomu Sekarang
                        </Link>
                        <Link href="/" className={lockedStyles.btnBack}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                <p className={lockedStyles.footerNote}>SMK · Angkatan 2026</p>
            </main>
        );
    }

    // ─── Main Gallery ───────────────────────────────────
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

                {/* Loading state — polaroid skeletons */}
                {isLoading && (
                    <div className={styles.polaroidGrid}>
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
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

                {/* ═══ Polaroid Scattered Grid ═══ */}
                {!isLoading && !error && filteredFiles.length > 0 && (
                    <div className={styles.polaroidGrid}>
                        {filteredFiles.map((file, i) => {
                            // Determine tape style — cycle through variants, some cards get no tape
                            const hasTape = i % 3 !== 2; // ~66% have tape
                            const tapeVariant = TAPE_VARIANTS[i % TAPE_VARIANTS.length];
                            const z = getZIndex(i, filteredFiles.length);

                            return (
                                <button
                                    key={file.id}
                                    className={styles.polaroidCard}
                                    onClick={() => openLightbox(i)}
                                    aria-label={`Lihat ${file.resourceType === 'video' ? 'video' : 'foto'} ${file.name} dari kelas ${file.className}`}
                                    style={{
                                        zIndex: z,
                                        width: file.width && file.height
                                            ? `${Math.min(450, Math.max(240, (file.width / file.height) * 320))}px`
                                            : '280px'
                                    }}
                                >
                                    {/* Tape decoration */}
                                    {hasTape && (
                                        <div className={`${styles.tapeStrip} ${styles[tapeVariant]}`} />
                                    )}

                                    {/* Image area */}
                                    <div className={styles.polaroidImgWrap}>
                                        <img
                                            src={file.thumbnailUrl || '/placeholder.svg'}
                                            alt={`Kenangan ${file.className}`}
                                            className={styles.polaroidImg}
                                            loading="lazy"
                                        />
                                        {/* Video play badge */}
                                        {file.resourceType === 'video' && (
                                            <div className={styles.videoPlayBadge}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Caption — handwriting style */}
                                    <div className={styles.polaroidCaption}>
                                        <span className={styles.polaroidFileName}>
                                            {file.name}
                                        </span>
                                        <span
                                            className={styles.polaroidClass}
                                            style={{ color: CLASS_COLORS_DARK[file.className] ?? '#5a4e3e' }}
                                        >
                                            {file.className}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
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
