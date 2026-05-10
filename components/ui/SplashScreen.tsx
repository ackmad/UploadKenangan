'use client';

import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);

  // Timers optimized for 2-3 seconds total duration
  useEffect(() => {
    // Reveal and hold phase
    const t1 = setTimeout(() => setPhase('hold'), 300);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 30;
        return next >= 100 ? 100 : next;
      });
    }, 150);

    // Transition out (Exit phase)
    const t2 = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setPhase('exit');
    }, 2000); // 2 seconds total hold time

    // Unmount completely
    const t3 = setTimeout(() => onDone(), 2800);

    return () => { 
      clearTimeout(t1); 
      clearInterval(interval); 
      clearTimeout(t2); 
      clearTimeout(t3); 
    };
  }, [onDone]);

  // Floating Elements Data (Reduced count and simple icons)
  const floatingElements = [
    { id: 1, icon: '📷', cls: styles.float1 },
    { id: 2, icon: '🎓', cls: styles.float2 },
    { id: 3, icon: '✨', cls: styles.float3 },
    { id: 4, icon: '🎞️', cls: styles.float4 },
  ];

  return (
    <div className={`${styles.splash} ${phase === 'exit' ? styles.exitPhase : ''}`}>
      
      {/* Background Layers */}
      <div className={styles.bgDark} />
      <div className={styles.bgGlow} />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      {/* Floating Dust Particles (Reduced count) */}
      <div className={styles.particlesContainer}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className={styles.dust} 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Floating Nostalgia Icons */}
      <div className={styles.parallaxLayer}>
        {floatingElements.map(el => (
          <div key={el.id} className={`${styles.iconBase} ${el.cls}`}>
            {el.icon}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={styles.contentCenter}>
        
        {/* Logo Text */}
        <div className={styles.logoContainer}>
          <h1 className={styles.mainLogo}>
            <span className={`${styles.fontSkinfa} ${styles.colorSkinfa}`}>SKINFA</span>
            <span className={`${styles.fontVerse} ${styles.colorVerse}`}>VERSE</span>
            <span className={`${styles.fontNum21} ${styles.colorNum21}`}>21</span>

            {/* Shiny Overlay Masked Exactly to Text */}
            <span className={styles.mainLogoShine} aria-hidden="true">
              <span className={styles.fontSkinfa}>SKINFA</span>
              <span className={styles.fontVerse}>VERSE</span>
              <span className={styles.fontNum21}>21</span>
            </span>
          </h1>
        </div>

        {/* Timeline & Subtitle */}
        <div className={styles.bottomInfo}>
          <p className={styles.timeline}>2023 — 2026</p>
          <p className={styles.subtitle}>Semesta Digital Angkatan 21</p>
          
          {/* Cinematic Loading Line */}
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingGlowLine} style={{ width: `${progress}%` }} />
            <div className={styles.loadingCoreLine} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

    </div>
  );
}
