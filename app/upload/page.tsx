'use client';

import { useState, useRef, DragEvent, ChangeEvent, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './upload.module.css';

const CLASSES = ['RPL', 'TKJ', 'DKV'];

// ── Batas kapasitas ──────────────────────────────────────────────────────────
const MAX_FILES = 20;                // maks jumlah file per sesi upload
const MAX_TOTAL_MB = 80;               // maks total ukuran per sesi upload (MB)
const MAX_IMAGE_SIZE_MB = 10;               // maks ukuran per foto (MB)
const MAX_VIDEO_SIZE_MB = 50;               // maks ukuran per video (MB)
const MAX_TOTAL_SIZE = MAX_TOTAL_MB * 1024 * 1024;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mov', 'video/avi', 'video/webm', 'video/x-m4v', 'video/3gpp'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

function isVideo(file: File) { return file.type.startsWith('video/'); }

function formatMB(bytes: number, decimals = 1) {
    return (bytes / (1024 * 1024)).toFixed(decimals);
}

const CLASS_DESC: Record<string, string> = {
    RPL: 'Rekayasa Perangkat Lunak',
    TKJ: 'Teknik Komputer & Jaringan',
    DKV: 'Desain Komunikasi Visual',
};

interface PreviewFile {
    file: File;
    url: string;
}

// ── Tipe pesan error kapasitas ───────────────────────────────────────────────
interface CapacityError {
    type: 'too_many_files' | 'total_size_exceeded' | 'both';
    currentFiles: number;
    currentSizeMB: number;
    excessFiles: number;
    excessSizeMB: number;
    photoCount: number;
    videoCount: number;
    avgPhotoPx: number; // avg photo size estimate in MB
    avgVideoPx: number; // avg video size estimate in MB
}

function buildCapacityError(previews: PreviewFile[]): CapacityError | null {
    const fileCount = previews.length;
    const totalBytes = previews.reduce((s, p) => s + p.file.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    const tooManyFiles = fileCount > MAX_FILES;
    const tooBig = totalBytes > MAX_TOTAL_SIZE;

    if (!tooManyFiles && !tooBig) return null;

    const photoCount = previews.filter(p => !isVideo(p.file)).length;
    const videoCount = previews.filter(p => isVideo(p.file)).length;

    // average sizes
    const photoBytes = previews.filter(p => !isVideo(p.file)).reduce((s, p) => s + p.file.size, 0);
    const videoBytes = previews.filter(p => isVideo(p.file)).reduce((s, p) => s + p.file.size, 0);
    const avgPhotoPx = photoCount > 0 ? photoBytes / photoCount / (1024 * 1024) : 3;
    const avgVideoPx = videoCount > 0 ? videoBytes / videoCount / (1024 * 1024) : 20;

    return {
        type: tooManyFiles && tooBig ? 'both' : tooManyFiles ? 'too_many_files' : 'total_size_exceeded',
        currentFiles: fileCount,
        currentSizeMB: totalMB,
        excessFiles: Math.max(0, fileCount - MAX_FILES),
        excessSizeMB: Math.max(0, totalMB - MAX_TOTAL_MB),
        photoCount,
        videoCount,
        avgPhotoPx,
        avgVideoPx,
    };
}

function buildErrorMessage(err: CapacityError): { title: string; body: string; tip: string } {
    const { type, currentFiles, currentSizeMB, excessFiles, excessSizeMB, photoCount, videoCount, avgPhotoPx, avgVideoPx } = err;

    if (type === 'too_many_files') {
        // Exactly how many to remove
        const removeCount = excessFiles;
        return {
            title: `📁 Terlalu banyak file!`,
            body: `Kamu memilih ${currentFiles} file, tapi batas sekali upload adalah ${MAX_FILES} file.\nKamu perlu hapus ${removeCount} file lagi agar bisa diupload.`,
            tip: `💡 Tip: Hapus ${removeCount} foto paling bawah di preview, lalu klik "Simpan Kenangan". File yang belum diupload bisa kamu upload di sesi berikutnya!`,
        };
    }

    if (type === 'total_size_exceeded') {
        // Calculate how many photos/videos to remove to be under limit
        const excessBytes = excessSizeMB * 1024 * 1024;

        let tip = '';
        if (videoCount > 0 && avgVideoPx > 0) {
            const videosToRemove = Math.ceil(excessBytes / (avgVideoPx * 1024 * 1024));
            const photosToRemove = Math.ceil(excessBytes / (avgPhotoPx * 1024 * 1024));
            if (videosToRemove <= videoCount) {
                tip = `💡 Tip: Hapus ${videosToRemove} video (hemat sekitar ${(videosToRemove * avgVideoPx).toFixed(0)} MB), atau hapus ${photosToRemove} foto untuk bisa upload sekarang. Sisanya bisa diupload setelah ini selesai!`;
            } else {
                tip = `💡 Tip: Hapus ${photosToRemove} foto untuk bisa upload sekarang. Sisanya bisa diupload setelah ini selesai!`;
            }
        } else if (photoCount > 0 && avgPhotoPx > 0) {
            const photosToRemove = Math.ceil(excessBytes / (avgPhotoPx * 1024 * 1024));
            tip = `💡 Tip: Hapus sekitar ${photosToRemove} foto agar total ukuran turun di bawah ${MAX_TOTAL_MB} MB. Foto yang belum diupload bisa kamu kirim lagi nanti!`;
        } else {
            tip = `💡 Tip: Kurangi beberapa file hingga total ukuran di bawah ${MAX_TOTAL_MB} MB. Sisa file bisa diupload di sesi berikutnya!`;
        }

        return {
            title: `📦 Ukuran file terlalu besar!`,
            body: `Total ${currentSizeMB.toFixed(1)} MB melebihi batas ${MAX_TOTAL_MB} MB per sekali upload (kelebihan ${excessSizeMB.toFixed(1)} MB).`,
            tip,
        };
    }

    // both
    const removeCount = excessFiles;
    const excessBytes = excessSizeMB * 1024 * 1024;
    const photosToRemove = Math.ceil(excessBytes / (avgPhotoPx > 0 ? avgPhotoPx * 1024 * 1024 : 3 * 1024 * 1024));
    return {
        title: `⚠️ File terlalu banyak & ukurannya terlalu besar!`,
        body: `Kamu memilih ${currentFiles} file dengan total ${currentSizeMB.toFixed(1)} MB.\nBatasnya: ${MAX_FILES} file & ${MAX_TOTAL_MB} MB per sekali upload.`,
        tip: `💡 Tip: Hapus minimal ${Math.max(removeCount, photosToRemove)} file (mulai dari yang paling besar) agar bisa upload sekarang. Sisa file bisa diupload berikutnya!`,
    };
}

export default function UploadPage() {
    const router = useRouter();
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [previews, setPreviews] = useState<PreviewFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadPhase, setUploadPhase] = useState<'preparing' | 'uploading' | 'processing' | 'done'>('preparing');
    const [uploadedSize, setUploadedSize] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const [capacityError, setCapacityError] = useState<CapacityError | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Derived capacity stats ────────────────────────────────────────────────
    const capacityStats = useMemo(() => {
        const totalBytes = previews.reduce((s, p) => s + p.file.size, 0);
        const totalMB = totalBytes / (1024 * 1024);
        const pct = Math.min(100, (totalMB / MAX_TOTAL_MB) * 100);
        const filePct = Math.min(100, (previews.length / MAX_FILES) * 100);
        const remaining = MAX_TOTAL_MB - totalMB;
        const remainingFiles = MAX_FILES - previews.length;
        return { totalMB, pct, filePct, remaining, remainingFiles, totalBytes };
    }, [previews]);

    const addFiles = useCallback((newFiles: File[]) => {
        setError('');
        setCapacityError(null);
        const valid: PreviewFile[] = [];
        const errors: string[] = [];

        for (const file of newFiles) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`"${file.name}" tidak didukung. Gunakan foto atau video (MP4/MOV).`);
                continue;
            }
            const maxSize = isVideo(file) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
            const maxLabel = isVideo(file) ? `${MAX_VIDEO_SIZE_MB}MB` : `${MAX_IMAGE_SIZE_MB}MB`;
            if (file.size > maxSize) {
                errors.push(`"${file.name}" melebihi batas ukuran ${maxLabel} per file.`);
                continue;
            }
            valid.push({ file, url: URL.createObjectURL(file) });
        }

        if (errors.length > 0) {
            setError(errors[0]);
        }

        setPreviews((prev) => {
            const combined = [...prev, ...valid];
            return combined;
        });
    }, []);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    };

    const removeFile = (index: number) => {
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
        setCapacityError(null);
        setError('');
    };

    const handleSubmit = async () => {
        setError('');
        setCapacityError(null);

        if (!selectedClass) {
            setError('Pilih kelasmu terlebih dahulu, ya ✦');
            return;
        }
        if (previews.length === 0) {
            setError('Tambahkan setidaknya satu foto kenangan.');
            return;
        }

        // ── Validasi kapasitas sebelum upload ──────────────────────────────
        const capErr = buildCapacityError(previews);
        if (capErr) {
            setCapacityError(capErr);
            // scroll to error
            setTimeout(() => {
                document.getElementById('capacity-error-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        setIsLoading(true);
        setUploadProgress(0);
        setUploadPhase('preparing');
        setUploadedSize(0);

        const formData = new FormData();
        formData.append('class', selectedClass);
        let totalBytes = 0;
        previews.forEach(({ file }) => {
            formData.append('files', file);
            totalBytes += file.size;
        });
        setTotalSize(totalBytes);

        // Short delay to show "Menyiapkan..." phase
        await new Promise(r => setTimeout(r, 400));
        setUploadPhase('uploading');

        // Use XMLHttpRequest for real progress
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<{ ok: boolean; data: Record<string, unknown> }>((resolve, reject) => {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 90); // 0-90% is upload
                    setUploadProgress(pct);
                    setUploadedSize(e.loaded);
                }
            });

            xhr.addEventListener('load', () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve({ ok: xhr.status >= 200 && xhr.status < 300, data });
                } catch {
                    reject(new Error('Gagal membaca respons server.'));
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Koneksi terputus. Pastikan internetmu stabil dan coba lagi.')));
            xhr.addEventListener('abort', () => reject(new Error('Upload dibatalkan.')));

            xhr.open('POST', '/api/upload');
            xhr.send(formData);
        });

        try {
            // Upload phase done, now processing
            const { ok, data } = await uploadPromise;

            setUploadPhase('processing');
            setUploadProgress(95);

            if (!ok) {
                setError((data.error as string) ?? 'Gagal menyimpan kenangan. Coba lagi.');
                setIsLoading(false);
                setUploadProgress(0);
                return;
            }

            // Done!
            setUploadPhase('done');
            setUploadProgress(100);
            await new Promise(r => setTimeout(r, 800)); // Brief pause to show 100%

            router.push('/success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat upload.');
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const phaseLabel: Record<string, string> = {
        preparing: 'Menyiapkan file...',
        uploading: 'Mengunggah kenangan...',
        processing: 'Memproses di server...',
        done: 'Selesai! ✦',
    };

    // ── Capacity bar colour ───────────────────────────────────────────────────
    const capacityColour = capacityStats.pct >= 100
        ? 'var(--cap-danger)'
        : capacityStats.pct >= 80
            ? 'var(--cap-warn)'
            : 'var(--cap-ok)';

    const capMsgData = capacityError ? buildErrorMessage(capacityError) : null;

    return (
        <main className={styles.page}>
            {/* Nav */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Kembali
                </Link>
                <span className={styles.navTitle}>Upload Kenangan</span>
            </nav>

            <div className={styles.container}>
                {/* Header */}
                <div className={`${styles.header} animate-fade-in-up`}>
                    <h1 className={styles.title}>Bagikan Momenmu</h1>
                    <p className={styles.subtitle}>
                        Foto &amp; video yang kamu upload akan tersimpan di arsip digital angkatan 2026.
                        <br />
                        Galeri akan dibuka pada waktu yang sudah ditentukan — jadi simpen dulu semangatnya! ✦
                    </p>
                </div>

                {/* Card */}
                <div className={`${styles.card} card animate-fade-in-scale delay-1`}>
                    {/* Class Selector */}
                    <section className={styles.section}>
                        <label className={styles.sectionLabel}>
                            <span className={styles.labelIcon}>🎓</span>
                            Kelas kamu
                        </label>
                        <div className={styles.classGrid}>
                            {CLASSES.map((cls) => (
                                <button
                                    key={cls}
                                    className={`${styles.classBtn} ${selectedClass === cls ? styles.classBtnActive : ''}`}
                                    onClick={() => { setSelectedClass(cls); setError(''); }}
                                    type="button"
                                    data-class={cls}
                                >
                                    <span className={styles.className}>{cls}</span>
                                    <span className={styles.classDesc}>{CLASS_DESC[cls]}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Dropzone */}
                    <section className={styles.section}>
                        <label className={styles.sectionLabel}>
                            <span className={styles.labelIcon}>📸</span>
                            Foto &amp; Video kenangan
                            <span className={styles.labelHint}>Maks. {MAX_FILES} file · Foto {MAX_IMAGE_SIZE_MB}MB · Video {MAX_VIDEO_SIZE_MB}MB</span>
                        </label>

                        <div
                            className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''} ${previews.length > 0 ? styles.dropzoneHasFiles : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                            aria-label="Klik atau seret foto ke sini"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                className={styles.hiddenInput}
                                onChange={handleFileChange}
                            />
                            {previews.length === 0 ? (
                                <div className={styles.dropzoneEmpty}>
                                    <div className={styles.uploadIcon}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <p className={styles.dropzoneText}>Seret foto atau video ke sini</p>
                                    <p className={styles.dropzoneHint}>atau <span className={styles.dropzoneLink}>klik untuk pilih</span></p>
                                    <p className={styles.dropzoneFormats}>JPG · PNG · WEBP · MP4 · MOV</p>
                                </div>
                            ) : (
                                <div className={styles.previewGrid} onClick={(e) => e.stopPropagation()}>
                                    {previews.map(({ file, url }, i) => (
                                        <div key={i} className={styles.previewItem}>
                                            {isVideo(file) ? (
                                                <video
                                                    src={url}
                                                    className={styles.previewImg}
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={url} alt={`Preview ${i + 1}`} className={styles.previewImg} loading="lazy" />
                                            )}
                                            {/* file size badge */}
                                            <span className={styles.fileSizeBadge}>{formatBytes(file.size)}</span>
                                            {isVideo(file) && (
                                                <div className={styles.videoIndicator}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                                        <polygon points="5 3 19 12 5 21 5 3" />
                                                    </svg>
                                                </div>
                                            )}
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => removeFile(i)}
                                                type="button"
                                                aria-label="Hapus file ini"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {previews.length < MAX_FILES && (
                                        <button
                                            className={styles.addMoreBtn}
                                            onClick={() => fileInputRef.current?.click()}
                                            type="button"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            <span>Tambah</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Capacity Meter ─────────────────────────────────────────── */}
                        {previews.length > 0 && (
                            <div className={styles.capacityMeter}>
                                {/* Row: file count + size */}
                                <div className={styles.capacityRow}>
                                    <div className={styles.capacityStat}>
                                        <span className={styles.capacityStatIcon}>📄</span>
                                        <span className={styles.capacityStatLabel}>File:</span>
                                        <span className={`${styles.capacityStatVal} ${previews.length > MAX_FILES ? styles.capDanger : ''}`}>
                                            {previews.length}
                                        </span>
                                        <span className={styles.capacityStatOf}>/ {MAX_FILES}</span>
                                    </div>
                                    <div className={styles.capacityStat}>
                                        <span className={styles.capacityStatIcon}>⚖️</span>
                                        <span className={styles.capacityStatLabel}>Ukuran:</span>
                                        <span className={`${styles.capacityStatVal} ${capacityStats.pct >= 100 ? styles.capDanger : capacityStats.pct >= 80 ? styles.capWarn : ''}`}>
                                            {capacityStats.totalMB.toFixed(1)} MB
                                        </span>
                                        <span className={styles.capacityStatOf}>/ {MAX_TOTAL_MB} MB</span>
                                    </div>
                                    <div className={styles.capacityStat}>
                                        <span className={styles.capacityStatIcon}>✅</span>
                                        <span className={styles.capacityStatLabel}>Sisa:</span>
                                        <span className={`${styles.capacityStatVal} ${capacityStats.remaining < 0 ? styles.capDanger : ''}`}>
                                            {capacityStats.remaining < 0
                                                ? `-${Math.abs(capacityStats.remaining).toFixed(1)} MB`
                                                : `${capacityStats.remaining.toFixed(1)} MB`
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Total size progress bar */}
                                <div className={styles.capBarWrap}>
                                    <div className={styles.capBarLabels}>
                                        <span>Kapasitas Upload</span>
                                        <span style={{ color: capacityColour }}>{capacityStats.pct.toFixed(0)}%</span>
                                    </div>
                                    <div className={styles.capBarTrack}>
                                        <div
                                            className={styles.capBarFill}
                                            style={{
                                                width: `${Math.min(100, capacityStats.pct)}%`,
                                                background: capacityColour,
                                            }}
                                        />
                                        {/* overflow indicator */}
                                        {capacityStats.pct > 100 && (
                                            <div className={styles.capBarOverflow} />
                                        )}
                                    </div>
                                    {/* markers */}
                                    <div className={styles.capBarMarkers}>
                                        <span>0</span>
                                        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{MAX_TOTAL_MB / 2} MB</span>
                                        <span>{MAX_TOTAL_MB} MB</span>
                                    </div>
                                </div>

                                {/* File count bar */}
                                <div className={styles.capBarWrap} style={{ marginTop: 8 }}>
                                    <div className={styles.capBarLabels}>
                                        <span>Jumlah File</span>
                                        <span style={{ color: previews.length > MAX_FILES ? 'var(--cap-danger)' : 'var(--color-text-muted)' }}>
                                            {previews.length} / {MAX_FILES} file
                                        </span>
                                    </div>
                                    <div className={styles.capBarTrack}>
                                        <div
                                            className={styles.capBarFill}
                                            style={{
                                                width: `${Math.min(100, capacityStats.filePct)}%`,
                                                background: previews.length > MAX_FILES ? 'var(--cap-danger)' : previews.length >= MAX_FILES * 0.8 ? 'var(--cap-warn)' : 'var(--cap-ok)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ── Capacity Error Banner ────────────────────────────── */}
                    {capacityError && capMsgData && (
                        <div id="capacity-error-banner" className={styles.capErrorBanner} role="alert">
                            <div className={styles.capErrorHeader}>
                                <span className={styles.capErrorTitle}>{capMsgData.title}</span>
                                <button
                                    className={styles.capErrorDismiss}
                                    onClick={() => setCapacityError(null)}
                                    aria-label="Tutup pesan ini"
                                    type="button"
                                >
                                    ×
                                </button>
                            </div>
                            <p className={styles.capErrorBody}>{capMsgData.body}</p>
                            <div className={styles.capErrorStats}>
                                <div className={styles.capStat}>
                                    <span className={styles.capStatIcon}>📁</span>
                                    <div>
                                        <div className={styles.capStatNum}>{capacityError.currentFiles} file</div>
                                        <div className={styles.capStatSub}>dari maks. {MAX_FILES}</div>
                                    </div>
                                </div>
                                <div className={styles.capStatDivider} />
                                <div className={styles.capStat}>
                                    <span className={styles.capStatIcon}>⚖️</span>
                                    <div>
                                        <div className={styles.capStatNum}>{capacityError.currentSizeMB.toFixed(1)} MB</div>
                                        <div className={styles.capStatSub}>dari maks. {MAX_TOTAL_MB} MB</div>
                                    </div>
                                </div>
                                <div className={styles.capStatDivider} />
                                <div className={styles.capStat}>
                                    <span className={styles.capStatIcon}>🔴</span>
                                    <div>
                                        <div className={styles.capStatNum} style={{ color: 'var(--cap-danger)' }}>
                                            {capacityError.type !== 'too_many_files'
                                                ? `+${capacityError.excessSizeMB.toFixed(1)} MB`
                                                : `+${capacityError.excessFiles} file`}
                                        </div>
                                        <div className={styles.capStatSub}>kelebihan</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.capErrorTip}>
                                {capMsgData.tip}
                            </div>
                            <p className={styles.capErrorAction}>
                                👆 Klik tanda <strong>×</strong> pada preview foto/video di atas untuk menghapusnya, lalu coba upload lagi.
                            </p>
                        </div>
                    )}

                    {/* Simple file-level error */}
                    {error && !capacityError && (
                        <p className={`error-msg ${styles.errorMsg}`} role="alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        className={`btn btn-primary ${styles.submitBtn} ${capacityError ? styles.submitBtnWarn : ''}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="button"
                        id="submit-upload"
                    >
                        {isLoading ? (
                            <span className="btn-loading">
                                <span className="spinner" />
                                Mengunggah...
                            </span>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                Simpan Kenangan
                            </>
                        )}
                    </button>

                    {/* Upload Progress Overlay */}
                    {isLoading && (
                        <div className={styles.progressOverlay}>
                            <div className={styles.progressCard}>
                                {/* Animated icon */}
                                <div className={styles.progressIconWrap}>
                                    {uploadPhase === 'done' ? (
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.uploadingIcon}>
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    )}
                                </div>

                                {/* Percentage */}
                                <div className={styles.progressPct}>{uploadProgress}%</div>

                                {/* Progress bar */}
                                <div className={styles.progressBarTrack}>
                                    <div
                                        className={`${styles.progressBarFill} ${uploadPhase === 'done' ? styles.progressDone : ''}`}
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>

                                {/* Phase label */}
                                <p className={styles.progressLabel}>{phaseLabel[uploadPhase]}</p>

                                {/* Size info */}
                                {uploadPhase === 'uploading' && totalSize > 0 && (
                                    <p className={styles.progressSize}>
                                        {formatBytes(uploadedSize)} / {formatBytes(totalSize)}
                                    </p>
                                )}

                                {/* File count */}
                                <p className={styles.progressFileCount}>
                                    {previews.length} file · {selectedClass}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={styles.infoNote}>
                        <span className={styles.infoIcon}>📁</span>
                        <p>
                            Foto &amp; video tersimpan aman di arsip digital angkatan 2026.
                            Galeri akan dibuka pada waktu yang sudah ditentukan, dan bisa dilihat bersama-sama.
                        </p>
                    </div>

                    {/* Upload limit info */}
                    <div className={styles.limitNote}>
                        <span className={styles.infoIcon}>📊</span>
                        <div>
                            <p className={styles.limitTitle}>Batas upload per sesi:</p>
                            <ul className={styles.limitList}>
                                <li>📄 Maks. <strong>{MAX_FILES} file</strong> per sekali upload</li>
                                <li>⚖️ Total maks. <strong>{MAX_TOTAL_MB} MB</strong> per sesi</li>
                                <li>🖼️ Foto maks. <strong>{MAX_IMAGE_SIZE_MB} MB</strong> per file</li>
                                <li>🎬 Video maks. <strong>{MAX_VIDEO_SIZE_MB} MB</strong> per file</li>
                                <li>✨ Boleh upload beberapa kali kalau masih punya banyak!</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.warningNote}>
                        <span className={styles.infoIcon}>⚠️</span>
                        <p>
                            Harap upload foto &amp; video yang <strong>layak dan sopan</strong>.
                            Jangan upload konten yang mengandung unsur <strong>kekerasan, pornografi, SARA,
                                bullying, atau hal negatif lainnya</strong>. Konten yang melanggar dapat dihapus
                            dan dikenakan sanksi sesuai peraturan sekolah.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
