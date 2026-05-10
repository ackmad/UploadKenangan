'use client';
import Link from 'next/link';
import styles from './FilmSection.module.css';

export default function FilmSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.container}>
        {/* Washi tape decor */}
        <div className={styles.tape} />
        
        {/* Netflix-style banner but neo-brutalism */}
        <div className={styles.banner}>
          <div className={styles.bgImage}>
            <div className={styles.gradientOverlay} />
            <div className={styles.vignette} />
          </div>

          <div className={styles.content}>
            <div className={styles.badge}>
              <span className={styles.nIcon}>N</span>
              <span className={styles.badgeText}>SKINFA ORIGINAL</span>
            </div>

            <h2 className={styles.title}>
              3 TAHUN<br/>
              1 CERITA
            </h2>

            <div className={styles.meta}>
              <span className={styles.match}>98% Match</span>
              <span className={styles.year}>2026</span>
              <span className={styles.age}>15+</span>
              <span className={styles.hd}>HD</span>
            </div>

            <p className={styles.desc}>
              Tiga tahun penuh cerita dalam satu film dokumenter. Dari masa orientasi yang canggung, tugas yang menumpuk, hingga perpisahan yang tak terelakkan. Tonton kisah lengkap Angkatan 21.
            </p>

            <div className={styles.actions}>
              <Link href="/film" className={styles.playBtn}>
                <span className={styles.btnIcon}>▶</span>
                <span>Watch Trailer</span>
              </Link>
              <Link href="/film" className={styles.infoBtn}>
                <span className={styles.btnIcon}>ℹ️</span>
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
