'use client';

import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import MediaGallery from '@/components/nostalgia/MediaGallery';

export default function NostalgiaPage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className="tag" style={{ background: 'var(--rose)', boxShadow: 'var(--shadow-sm)' }}>
            📷 Galeri Kenangan
          </span>
          <h1 className={styles.title}>Nostalgia Angkatan</h1>
          <p className={styles.subtitle}>
            Telusuri setiap momen indah yang pernah kita ukir bersama. Foto dan video kenangan kita tersimpan di sini.
          </p>
        </div>

        {/* Cloudinary Media Gallery */}
        <MediaGallery folder="skinfaverse21/nostalgia" />

        <div className={styles.footer}>
          <Link href="/" className="btn btn-black btn-lg">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </>
  );
}
