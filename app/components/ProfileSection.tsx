'use client';
import styles from './ProfileSection.module.css';
import content from '@/data/content.json';
import biodata from '@/data/biodata_siswa.json';

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
            <span className="tag" style={{ background: 'var(--coral)', color: 'white', boxShadow: 'var(--shadow-sm)' }}>{profile.sectionTag}</span>
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

        {/* Manifesto */}
        <div className={styles.manifestoWrap}>
          <div className={styles.manifestoCard}>
            <div className={styles.manifestoTape} />
            <h3 className={styles.manifestoTitle}>{profile.manifestoTitle}</h3>
            {profile.manifesto.map((para, i) => (
              <p key={i} className={styles.manifestoPara}>{para}</p>
            ))}
            <div className={styles.manifestoSig}>
              <svg viewBox="0 0 200 50" className={styles.sigSvg} fill="none">
                <path d="M10 35 C20 10 40 45 60 25 C80 5 100 40 120 20 C140 0 160 35 190 25" stroke="var(--coral)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span>{profile.manifestoSig}</span>
            </div>
          </div>
        </div>

        {/* Classes grid */}
        <div className={styles.classesWrap}>
          <h3 className={styles.classesTitle}>Preview Angkatan</h3>
          <div className={styles.previewGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {biodata.siswa.slice(0, 4).map((siswa) => (
              <div key={siswa.id} className={styles.cardBrutal} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-sm)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={siswa.foto} alt={siswa.nama_panggilan} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', border: 'var(--border)' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>{siswa.nama_panggilan}</h4>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{siswa.kelas}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <div className={styles.ctaWrap}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>{profile.cta.title}</h3>
            <p className={styles.ctaSub}>{profile.cta.subtitle}</p>
            <div className={styles.ctaBtns}>
              <a href="/kelas" className="btn btn-coral btn-lg">
                Masuk ke Semesta Kelas
              </a>
              <a href="/upload" className="btn btn-yellow btn-lg">
                {profile.cta.btnUpload}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className={styles.footer}>
        <p>{profile.footer.credit}</p>
        <p className={styles.footerSub}>{profile.footer.slogan}</p>
        <p className={styles.footerSub} style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.35 }}>{profile.footer.address}</p>
      </div>
    </section>
  );
}
