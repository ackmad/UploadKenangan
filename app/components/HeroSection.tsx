'use client';
import styles from './HeroSection.module.css';

const Doodle = ({ d, size = 40, color = 'var(--coral)', className = '' }: { d: string; size?: number; color?: string; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path d={d} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      {/* Polka dot BG */}
      <div className={styles.polkaBg} aria-hidden="true" />

      {/* Floating decorations */}
      <div className={styles.decorations} aria-hidden="true">
        {/* Star doodle */}
        <div className={styles.deco1}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 4 L27.5 17H42L30.5 25.5L34 38.5L24 30.5L14 38.5L17.5 25.5L6 17H20.5Z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2.5" strokeLinejoin="round"/></svg>
        </div>
        {/* Heart */}
        <div className={styles.deco2}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 30S6 22 6 13a7 7 0 0 1 12-4.9A7 7 0 0 1 30 13c0 9-12 17-12 17Z" fill="var(--coral)" stroke="var(--black)" strokeWidth="2.5" strokeLinejoin="round"/></svg>
        </div>
        {/* Zigzag arrow */}
        <div className={styles.deco3}>
          <Doodle d="M5 35 C10 25 15 30 20 20 C25 10 30 15 35 5M30 5 L35 5 L35 10" size={44} color="var(--sage-dark)" />
        </div>
        {/* Flower */}
        <div className={styles.deco4}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="5" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2"/>
            {[0,60,120,180,240,300].map((deg,i) => (
              <ellipse key={i} cx="22" cy="22" rx="4" ry="9" fill="var(--rose)" stroke="var(--black)" strokeWidth="1.5" transform={`rotate(${deg} 22 22) translate(0 -10)`}/>
            ))}
          </svg>
        </div>
        {/* Spiral */}
        <div className={styles.deco5}>
          <Doodle d="M20 20 C20 14 26 14 26 20 C26 28 12 28 12 20 C12 8 32 8 32 20 C32 34 8 34 8 20" size={44} color="var(--sky-dark)" />
        </div>
        {/* Lightning bolt */}
        <div className={styles.deco6}>
          <svg width="32" height="48" viewBox="0 0 32 48" fill="none"><path d="M20 2L4 26H16L12 46L28 20H16L20 2Z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2.5" strokeLinejoin="round"/></svg>
        </div>
        {/* Smiley */}
        <div className={styles.deco7}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="18" fill="var(--peach)" stroke="var(--black)" strokeWidth="2.5"/>
            <circle cx="16" cy="18" r="2.5" fill="var(--black)"/>
            <circle cx="28" cy="18" r="2.5" fill="var(--black)"/>
            <path d="M14 27 Q22 35 30 27" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        {/* Rainbow */}
        <div className={styles.deco8}>
          <svg width="60" height="36" viewBox="0 0 60 36" fill="none">
            <path d="M5 33 Q30 2 55 33" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M10 33 Q30 7 50 33" stroke="var(--yellow)" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M15 33 Q30 12 45 33" stroke="var(--sage)" strokeWidth="4" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Floating polaroids */}
      <div className={styles.polaroids} aria-hidden="true">
        <div className={`${styles.polFrame} ${styles.pol1}`}>
          <div className={styles.polImg} style={{ background: 'linear-gradient(135deg, #FFB3B3 0%, #FF6B6B 100%)' }}>
            <span className={styles.polEmoji}>📸</span>
          </div>
          <p className={styles.polCaption}>PKL 2024</p>
          <div className={styles.tapeTop} />
        </div>
        <div className={`${styles.polFrame} ${styles.pol2}`}>
          <div className={styles.polImg} style={{ background: 'linear-gradient(135deg, #A8E6CF 0%, #7EC8A4 100%)' }}>
            <span className={styles.polEmoji}>🎉</span>
          </div>
          <p className={styles.polCaption}>Class Meeting!</p>
          <div className={styles.tapeTop} />
        </div>
        <div className={`${styles.polFrame} ${styles.pol3}`}>
          <div className={styles.polImg} style={{ background: 'linear-gradient(135deg, #C3B1E1 0%, #9B85D4 100%)' }}>
            <span className={styles.polEmoji}>🎓</span>
          </div>
          <p className={styles.polCaption}>Wisuda ✨</p>
          <div className={styles.tapeTop} />
        </div>
        <div className={`${styles.polFrame} ${styles.pol4}`}>
          <div className={styles.polImg} style={{ background: 'linear-gradient(135deg, #89C4E1 0%, #5BAED0 100%)' }}>
            <span className={styles.polEmoji}>🏆</span>
          </div>
          <p className={styles.polCaption}>Juara Lomba!</p>
          <div className={styles.tapeTop} />
        </div>
        <div className={`${styles.polFrame} ${styles.pol5}`}>
          <div className={styles.polImg} style={{ background: 'linear-gradient(135deg, #FFCBA4 0%, #FF9D6C 100%)' }}>
            <span className={styles.polEmoji}>🌟</span>
          </div>
          <p className={styles.polCaption}>Study Tour</p>
          <div className={styles.tapeTop} />
        </div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={`${styles.badge} anim-fade-in-up`}>
          <span>✦</span> Angkatan 21 · SKINFAVERSE21 · Cirebon <span>✦</span>
        </div>

        <h1 className={`${styles.headline} anim-fade-in-up anim-delay-1`}>
          <span className={styles.lineA}>Tiga</span>
          <span className={styles.lineB}>Tahun.</span>
          <span className={styles.lineC}>Seribu</span>
          <span className={styles.lineD}>Cerita. <svg className={styles.underlineSvg} viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 9 Q50 2 100 8 Q150 14 198 7" stroke="var(--coral)" strokeWidth="3.5" strokeLinecap="round" fill="none"/></svg></span>
          <span className={styles.lineE}>Satu Kenangan.</span>
        </h1>

        <p className={`${styles.sub} anim-fade-in-up anim-delay-2`}>
          Ini bukan sekadar arsip foto — ini adalah dunia digital yang menjaga setiap tawa, air mata, dan momen berharga kalian selama tiga tahun bersama.
        </p>

        <div className={`${styles.cta} anim-fade-in-up anim-delay-3`}>
          <a href="#timeline" className="btn btn-coral btn-lg" onClick={e => { e.preventDefault(); document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span>🗓️</span> Jelajahi Kenangan
          </a>
          <a href="#gallery" className="btn btn-white btn-lg" onClick={e => { e.preventDefault(); document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span>📷</span> Lihat Galeri
          </a>
        </div>

        <div className={`${styles.jurusan} anim-fade-in-up anim-delay-4`}>
          <span className={styles.tagRpl}>RPL</span>
          <span className={styles.dot}>×</span>
          <span className={styles.tagTkj}>TKJ</span>
          <span className={styles.dot}>×</span>
          <span className={styles.tagDkv}>DKV</span>
        </div>

        <div className={`${styles.scrollHint} anim-fade-in anim-delay-4`}>
          <span>scroll ke bawah</span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 2 L8 14 M3 10 L8 16 L13 10" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Torn paper bottom edge */}
      <div className={styles.tornEdge} aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L0 40 Q30 55 60 38 Q90 20 120 45 Q150 60 180 42 Q210 24 240 50 Q270 60 300 40 Q330 22 360 48 Q390 60 420 38 Q450 20 480 46 Q510 58 540 36 Q570 18 600 44 Q630 60 660 38 Q690 20 720 50 Q750 60 780 40 Q810 22 840 48 Q870 60 900 38 Q930 18 960 45 Q990 58 1020 36 Q1050 18 1080 44 Q1110 60 1140 38 Q1170 20 1200 50 Q1230 60 1260 40 Q1290 22 1320 48 Q1350 60 1380 38 Q1410 20 1440 45 L1440 60 L0 60 Z" fill="var(--cream)"/>
        </svg>
      </div>
    </section>
  );
}
