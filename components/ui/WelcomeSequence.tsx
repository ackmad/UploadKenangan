'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './WelcomeSequence.module.css';

// ── SLIDE DATA ──
const SLIDES = [
  {
    id: 'intro',
    type: 'text' as const,
    textSmall: 'Tiga tahun lalu…',
    textBig: 'semuanya dimulai dari sini.',
    duration: 3500,
  },
  {
    id: 'awal',
    type: 'polaroid' as const,
    emoji: '🏫',
    caption: 'Hari pertama MPLS',
    quote: 'Masih canggung, masih malu-malu.',
    rotation: -3,
    duration: 3800,
  },
  {
    id: 'kelas',
    type: 'polaroid' as const,
    emoji: '📚',
    caption: 'Kelas yang jadi rumah kedua',
    quote: 'Tapi perlahan… kelas ini jadi tempat paling nyaman.',
    rotation: 2,
    duration: 3800,
  },
  {
    id: 'gabut',
    type: 'text' as const,
    textSmall: 'Jam kosong, tugas dadakan,',
    textBig: 'ketawa tanpa alasan.',
    duration: 3200,
  },
  {
    id: 'pkl',
    type: 'polaroid' as const,
    emoji: '💼',
    caption: 'PKL — dunia nyata pertama',
    quote: 'Kita tumbuh tanpa sadar.',
    rotation: -2,
    duration: 3800,
  },
  {
    id: 'drama',
    type: 'polaroid' as const,
    emoji: '🎬',
    caption: 'Film angkatan, classmeet, study tour',
    quote: 'Semua momen yang dulu biasa aja — ternyata luar biasa.',
    rotation: 3,
    duration: 4000,
  },
  {
    id: 'refleksi',
    type: 'text' as const,
    textSmall: 'Beberapa orang mungkin',
    textBig: 'bakal jarang ketemu lagi setelah ini.',
    duration: 4000,
  },
  {
    id: 'montage',
    type: 'montage' as const,
    items: ['🏫', '📷', '⚽', '🎓', '💛', '🎞️', '📝', '🌟', '🎵'],
    duration: 4500,
  },
  {
    id: 'klimaks',
    type: 'finale' as const,
    duration: 4500,
  },
];

interface WelcomeSequenceProps {
  onComplete: () => void;
}

export default function WelcomeSequence({ onComplete }: WelcomeSequenceProps) {
  const [currentSlide, setCurrentSlide] = useState(-1); // -1 = initial fade to black
  const [transitioning, setTransitioning] = useState(false);
  const [exiting, setExiting] = useState(false);

  const goToNextSlide = useCallback(() => {
    setTransitioning(true);

    setTimeout(() => {
      setCurrentSlide(prev => {
        const next = prev + 1;
        if (next >= SLIDES.length) {
          // Sequence complete — begin exit
          setExiting(true);
          setTimeout(() => onComplete(), 1500);
          return prev;
        }
        return next;
      });
      setTransitioning(false);
    }, 600); // dissolve duration
  }, [onComplete]);

  // Auto-advance slides
  useEffect(() => {
    if (currentSlide === -1) {
      // Initial black screen, wait then start
      const t = setTimeout(() => {
        setCurrentSlide(0);
      }, 1200);
      return () => clearTimeout(t);
    }

    if (currentSlide >= SLIDES.length || exiting) return;

    const slide = SLIDES[currentSlide];
    const t = setTimeout(() => {
      goToNextSlide();
    }, slide.duration);

    return () => clearTimeout(t);
  }, [currentSlide, exiting, goToNextSlide]);

  // Allow skip with click/tap
  const handleSkip = () => {
    if (exiting) return;
    if (currentSlide >= SLIDES.length - 1) {
      setExiting(true);
      setTimeout(() => onComplete(), 1000);
    } else {
      goToNextSlide();
    }
  };

  const slide = currentSlide >= 0 && currentSlide < SLIDES.length ? SLIDES[currentSlide] : null;

  return (
    <div
      className={`${styles.sequence} ${exiting ? styles.exiting : ''}`}
      onClick={handleSkip}
    >
      {/* Background & Atmosphere */}
      <div className={styles.bg} />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      {/* Dust Particles */}
      <div className={styles.dustLayer}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={styles.dust}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${7 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Skip hint */}
      <div className={styles.skipHint}>
        ketuk untuk lanjut
      </div>

      {/* Slide Content */}
      <div className={`${styles.slideContainer} ${transitioning ? styles.dissolveOut : styles.dissolveIn}`}>

        {/* TEXT SLIDE */}
        {slide && slide.type === 'text' && (
          <div className={styles.textSlide}>
            <p className={styles.textSmall}>{slide.textSmall}</p>
            <h2 className={styles.textBig}>{slide.textBig}</h2>
          </div>
        )}

        {/* POLAROID SLIDE */}
        {slide && slide.type === 'polaroid' && (
          <div className={styles.polaroidSlide}>
            <div
              className={styles.polaroid}
              style={{ '--rot': `${slide.rotation}deg` } as React.CSSProperties}
            >
              <div className={styles.polaroidPhoto}>
                <span className={styles.polaroidEmoji}>{slide.emoji}</span>
              </div>
              <p className={styles.polaroidCaption}>{slide.caption}</p>
            </div>
            <p className={styles.slideQuote}>{slide.quote}</p>
          </div>
        )}

        {/* MONTAGE SLIDE */}
        {slide && slide.type === 'montage' && (
          <div className={styles.montageSlide}>
            <div className={styles.montageGrid}>
              {slide.items.map((emoji, i) => (
                <div
                  key={i}
                  className={styles.montageItem}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (1 + (i % 3))}deg)`,
                  }}
                >
                  <span>{emoji}</span>
                </div>
              ))}
            </div>
            <p className={styles.montageText}>
              Tiga tahun. Seribu cerita. Satu angkatan.
            </p>
          </div>
        )}

        {/* FINALE SLIDE */}
        {slide && slide.type === 'finale' && (
          <div className={styles.finaleSlide}>
            <div className={styles.finaleLogo}>
              <span className={styles.finaleSkinfa}>SKINFA</span>
              <span className={styles.finaleVerse}>VERSE</span>
              <span className={styles.finale21}>21</span>
            </div>
            <p className={styles.finaleSubtitle}>
              Terima kasih sudah tumbuh bersama.
            </p>
            <p className={styles.finaleYear}>2023 — 2026</p>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className={styles.progress}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''} ${i < currentSlide ? styles.dotDone : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
