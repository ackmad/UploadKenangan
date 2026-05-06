import Link from 'next/link';
import styles from './upload.module.css';

export default function UploadPage() {
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
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <div className={styles.uploadIcon} style={{ width: '80px', height: '80px' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Upload via Google Drive</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            Untuk menjaga kualitas dan memudahkan pengumpulan, silakan upload foto dan video kenangan kamu melalui link Google Forms berikut.
                        </p>
                        
                        <a 
                            href="https://forms.gle/BgzdSJZC5PkkTeiG9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            style={{ display: 'inline-flex', width: 'auto', padding: '1rem 2.5rem', textDecoration: 'none', alignItems: 'center', gap: '0.5rem', borderRadius: '100px', fontWeight: 600 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            Buka Link Upload
                        </a>
                    </div>

                    <div className={styles.infoNote} style={{ marginTop: '1rem' }}>
                        <span className={styles.infoIcon}>📁</span>
                        <p>
                            Foto &amp; video tersimpan aman di arsip digital angkatan 2026.
                            Galeri akan dibuka pada waktu yang sudah ditentukan, dan bisa dilihat bersama-sama.
                        </p>
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
