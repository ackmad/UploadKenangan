'use client';

import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';

export default function YearbookPage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.heroTag}>📚 Album Digital</div>
            <h1 className={styles.heroTitle}>Every Page Holds<br />A Memory.</h1>
            <p className={styles.heroSub}>
              Bukan sekadar buku tahunan. Ini kapsul waktu Angkatan 21.
            </p>
          </div>
          <div className={styles.heroPreview}>
            <div className={styles.bookCover}>
              <div className={styles.bookSpine} />
              <div className={styles.bookFace}>
                <p className={styles.bookYear}>2026</p>
                <p className={styles.bookTitle}>SKINFAVERSE</p>
                <p className={styles.bookTitle21}>21</p>
                <p className={styles.bookSub}>Album Kenangan Digital</p>
                <div className={styles.bookStar}>⭐</div>
              </div>
            </div>
          </div>
        </header>

        {/* ACTION BUTTONS */}
        <div className={styles.actionRow}>
          <button className="btn btn-black btn-lg">
            📖 Buka Album
          </button>
          <button className="btn btn-yellow btn-lg">
            ⬇️ Download PDF
          </button>
          <button className="btn btn-coral btn-lg">
            🖨️ Print Version
          </button>
        </div>

      </main>
    </>
  );
}
