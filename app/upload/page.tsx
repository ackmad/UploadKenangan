'use client';

import { useState, useRef, DragEvent, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './upload.module.css';

const CLASSES = ['RPL', 'TKJ', 'DKV'];
const MAX_FILES = 10;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 30;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mov', 'video/avi', 'video/webm', 'video/x-m4v', 'video/3gpp'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

function isVideo(file: File) { return file.type.startsWith('video/'); }

const CLASS_DESC: Record<string, string> = {
    RPL: 'Rekayasa Perangkat Lunak',
    TKJ: 'Teknik Komputer & Jaringan',
    DKV: 'Desain Komunikasi Visual',
};

interface PreviewFile {
    file: File;
    url: string;
}

export default function UploadPage() {
    const router = useRouter();
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [previews, setPreviews] = useState<PreviewFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addFiles = useCallback((newFiles: File[]) => {
        setError('');
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
                errors.push(`"${file.name}" melebihi batas ukuran ${maxLabel}.`);
                continue;
            }
            valid.push({ file, url: URL.createObjectURL(file) });
        }

        if (errors.length > 0) {
            setError(errors[0]);
        }

        setPreviews((prev) => {
            const combined = [...prev, ...valid];
            if (combined.length > MAX_FILES) {
                setError(`Maksimal ${MAX_FILES} foto. Beberapa foto dilewati.`);
                return combined.slice(0, MAX_FILES);
            }
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
    };

    const handleSubmit = async () => {
        setError('');

        if (!selectedClass) {
            setError('Pilih kelasmu terlebih dahulu, ya ✦');
            return;
        }
        if (previews.length === 0) {
            setError('Tambahkan setidaknya satu foto kenangan.');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('class', selectedClass);
            previews.forEach(({ file }) => formData.append('files', file));

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? 'Gagal menyimpan kenangan. Coba lagi.');
                setIsLoading(false);
                return;
            }

            // Success — redirect to success page
            router.push('/success');
        } catch {
            setError('Koneksi terputus. Pastikan internetmu stabil dan coba lagi.');
            setIsLoading(false);
        }
    };

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
                        Foto & video yang kamu upload akan tersimpan di arsip digital angkatan 2026.
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
                            Foto & Video kenangan
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
                    </section>

                    {/* Error */}
                    {error && (
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
                        className={`btn btn-primary ${styles.submitBtn}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="button"
                        id="submit-upload"
                    >
                        {isLoading ? (
                            <span className="btn-loading">
                                <span className="spinner" />
                                Menyimpan kenangan...
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

                    <div className={styles.infoNote}>
                        <span className={styles.infoIcon}>📁</span>
                        <p>
                            Foto & video tersimpan aman di arsip digital angkatan 2026.
                            Galeri akan dibuka pada waktu yang sudah ditentukan, dan bisa dilihat bersama-sama.
                        </p>
                    </div>

                    <div className={styles.warningNote}>
                        <span className={styles.infoIcon}>⚠️</span>
                        <p>
                            Harap upload foto & video yang <strong>layak dan sopan</strong>.
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
