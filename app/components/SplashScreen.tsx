'use client';

import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Phase 1: enter animation
    const t1 = setTimeout(() => setPhase('hold'), 600);
    // Phase 2: hold & animate counter
    const t2 = setTimeout(() => {
      let n = 0;
      const interval = setInterval(() => {
        n += Math.floor(Math.random() * 8) + 3;
        if (n >= 100) { n = 100; clearInterval(interval); }
        setCount(n);
      }, 30);
    }, 800);
    // Phase 3: exit
    const t3 = setTimeout(() => setPhase('exit'), 3200);
    // Phase 4: unmount
    const t4 = setTimeout(() => onDone(), 4000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div className={`${styles.splash} ${phase === 'exit' ? styles.exit : ''}`}>
      {/* Grain overlay */}
      <div className={styles.grain} />

      {/* Floating doodles */}
      <div className={`${styles.doodle} ${styles.d1}`}>⭐</div>
      <div className={`${styles.doodle} ${styles.d2}`}>📚</div>
      <div className={`${styles.doodle} ${styles.d3}`}>✨</div>
      <div className={`${styles.doodle} ${styles.d4}`}>🎓</div>
      <div className={`${styles.doodle} ${styles.d5}`}>💛</div>
      <div className={`${styles.doodle} ${styles.d6}`}>📷</div>

      {/* Center content */}
      <div className={styles.center}>
        {/* Washi tape */}
        <div className={styles.tape} />

        <p className={styles.year}>2023 — 2026</p>

        <h1 className={styles.title}>
          <span className={styles.skinfa}>SKINFA</span>
          <span className={styles.verse}>VERSE</span>
          <span className={styles.num}>21</span>
        </h1>

        <p className={styles.tagline}>Semesta Digital Angkatan 21</p>

        {/* Loading bar */}
        <div className={styles.loaderWrap}>
          <div className={styles.loaderBar} style={{ width: `${count}%` }} />
        </div>
        <p className={styles.loaderText}>{count < 100 ? 'Memuat kenangan…' : 'Selamat datang ✨'}</p>

        {/* School name */}
        <p className={styles.school}>SMK Informatika Al-Irsyad Al-Islamiyyah · Cirebon</p>
      </div>

      {/* Bottom film strip */}
      <div className={styles.filmStrip}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={styles.filmHole} />
        ))}
      </div>
    </div>
  );
}
