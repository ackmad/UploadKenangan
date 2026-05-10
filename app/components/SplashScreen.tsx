'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);
  const splashRef = useRef<HTMLDivElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!splashRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      splashRef.current.style.setProperty('--px', `${x}px`);
      splashRef.current.style.setProperty('--py', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Timers
  useEffect(() => {
    // Reveal and load
    const t1 = setTimeout(() => setPhase('hold'), 1200);
    
    // Simulate loading
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 15;
        return next >= 100 ? 100 : next;
      });
    }, 300);

    // Transition out
    const t2 = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setPhase('exit');
    }, 4500); // 4.5 seconds of immersive intro

    // Unmount
    const t3 = setTimeout(() => onDone(), 5800);

    return () => { clearTimeout(t1); clearInterval(interval); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  // Floating Elements Data
  const floatingElements = [
    { id: 1, icon: '📷', cls: styles.float1 },
    { id: 2, icon: '🎓', cls: styles.float2 },
    { id: 3, icon: '📓', cls: styles.float3 },
    { id: 4, icon: '✨', cls: styles.float4 },
    { id: 5, icon: '💛', cls: styles.float5 },
    { id: 6, icon: '🎞️', cls: styles.float6 },
    { id: 7, icon: '📝', cls: styles.float7 },
    { id: 8, icon: '🌟', cls: styles.float8 },
  ];

  return (
    <div ref={splashRef} className={`${styles.splash} ${phase === 'exit' ? styles.exitPhase : ''}`}>
      
      {/* Background Layers */}
      <div className={styles.bgDark} />
      <div className={styles.bgGlow} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
      <div className={styles.flicker} />

      {/* Floating Dust Particles */}
      <div className={styles.particlesContainer}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className={styles.dust} 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Floating Nostalgia Icons (Parallax) */}
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
          <div className={styles.lightSweep} />
          <h1 className={styles.mainLogo}>
            <span className={styles.skinfa}>SKINFA</span>
            <span className={styles.verse}>VERSE</span>
            <span className={styles.num21}>21</span>
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
