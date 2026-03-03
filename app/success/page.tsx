'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './success.module.css';

function Confetti() {
    const pieces = Array.from({ length: 30 }, (_, i) => i);
    const colors = ['#c9a96e', '#e4c68d', '#d4884a', '#5b8dee', '#48bb78', '#ed8936', '#f5efe6'];

    return (
        <div className={styles.confettiContainer} aria-hidden="true">
            {pieces.map((i) => (
                <div
                    key={i}
                    className={styles.confettiPiece}
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                        background: colors[i % colors.length],
                        width: `${6 + Math.random() * 6}px`,
                        height: `${6 + Math.random() * 6}px`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

export default function SuccessPage() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <main className={styles.page}>
            <Confetti />

            <div className={`${styles.card} ${visible ? styles.cardVisible : ''}`}>
                {/* Icon */}
                <div className={styles.iconWrap}>
                    <div className={styles.iconRing} />
                    <svg
                        className={styles.checkIcon}
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>

                {/* Text */}
                <h1 className={styles.title}>Kenanganmu sudah tersimpan.</h1>
                <p className={styles.message}>
                    Terima kasih sudah menjadi bagian dari cerita ini.
                    <br />
                    Foto yang kamu bagikan akan selalu ada,
                    <br />
                    sebagai pengingat betapa indahnya perjalanan kita bersama.
                </p>

                {/* Divider */}
                <div className={styles.divider}>
                    <span>✦</span>
                </div>

                <p className={styles.year}>SMK · Angkatan 2026</p>

                {/* Actions */}
                <div className={styles.actions}>
                    <Link href="/upload" className="btn btn-outline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload Lagi
                    </Link>
                    <Link href="/gallery" className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Lihat Galeri
                    </Link>
                </div>
            </div>
        </main>
    );
}
