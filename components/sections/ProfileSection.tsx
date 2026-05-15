'use client';
import styles from './ProfileSection.module.css';
import content from '@/data/content.json';
import Link from 'next/link';

const { profile } = content;

export default function ProfileSection() {
  return (
    <section id="profile" className={`section ${styles.section}`}>
      {/* Big decorative background text */}
      <div className={styles.bgText} aria-hidden="true">2026</div>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.stampBadge}>
            <span className={styles.stampText}>{profile.stamp.line1}</span>
            <span className={styles.stampYear}>{profile.stamp.year}</span>
            <span className={styles.stampText}>{profile.stamp.line2}</span>
          </div>

          <div className={styles.headerText}>
            <span className="tag" style={{ background: 'var(--coral)', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
              {profile.sectionTag}
            </span>
            <h2 className={styles.title}>{profile.title}<br /><em>{profile.titleEm}</em></h2>
            <p className={styles.school}>{profile.school}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {profile.stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statEmoji}>{s.emoji}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Big CTA */}
        <div className={styles.ctaWrap}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>{profile.cta.title}</h3>
            <p className={styles.ctaSub}>{profile.cta.subtitle}</p>
            <div className={styles.ctaBtns}>
              <a href="/UniverseMemoriez.html" className="btn btn-coral btn-lg">
                👥 Meet The Universe
              </a>
              <Link href="/yearbook" className="btn btn-yellow btn-lg">
                📚 Buka Yearbook
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className={styles.footer}>
        <p>{profile.footer.credit}</p>
        <p className={styles.footerSub}>{profile.footer.slogan}</p>
        <p className={styles.footerSub} style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.35 }}>
          {profile.footer.address}
        </p>
      </div>
    </section>
  );
}
