'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './CountdownGate.module.css';
import WelcomeSequence from './WelcomeSequence';

type Phase = 'loading' | 'countdown' | 'welcome' | 'sequence' | 'unlocked';

export default function CountdownGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Dev mode states
  const [showDevInput, setShowDevInput] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Read config from env (falls back to defaults)
  const graduationDateStr = process.env.NEXT_PUBLIC_GRADUATION_DATE || '2026-05-16T00:00:00+07:00';
  const initialGateMode = process.env.NEXT_PUBLIC_GATE_MODE || 'auto';
  const expectedDevPassword = process.env.NEXT_PUBLIC_DEV_PASSWORD || '22150108';
  const targetDate = new Date(graduationDateStr).getTime();

  const [gateMode, setGateMode] = useState(initialGateMode);

  const checkDevBypass = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('skip=1') || 
           localStorage.getItem('skip_countdown') === '1';
  }, []);

  useEffect(() => {
    // ── ENV-based forced modes ──
    if (gateMode === 'open') {
      setPhase('unlocked');
      return;
    }
    if (gateMode === 'countdown') {
      setPhase('countdown');
      // Still tick the timer so you can see it working
      const fakeTarget = Date.now() + 5 * 24 * 60 * 60 * 1000; // 5 days from now
      setTimeLeft({
        days: 5, hours: 0, minutes: 0, seconds: 0
      });
      const interval = setInterval(() => {
        const diff = fakeTarget - Date.now();
        if (diff <= 0) return;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    if (gateMode === 'welcome') {
      setPhase('welcome');
      return;
    }

    // ── Auto mode (production default) ──
    const checkTime = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (checkDevBypass()) {
        setPhase('unlocked');
        return;
      }

      if (difference <= 0) {
        const hasSeenWelcome = sessionStorage.getItem('seen_welcome') === '1';
        if (hasSeenWelcome) {
          setPhase('unlocked');
        } else {
          setPhase(prev => prev === 'unlocked' ? 'unlocked' : 'welcome');
        }
      } else {
        setPhase('countdown');
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, gateMode, checkDevBypass]);

  // Handle entering the site from welcome screen → start cinematic sequence
  const handleEnterSite = () => {
    setPhase('sequence');
  };

  // Handle sequence completion → unlock the site
  const handleSequenceComplete = useCallback(() => {
    sessionStorage.setItem('seen_welcome', '1');
    setPhase('unlocked');
  }, []);

  // Secret dev bypass: double-click badge
  const handleSecretBypass = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skip_countdown', '1');
      setPhase('unlocked');
    }
  };

  // Dev Mode Interactions
  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setShowDevInput(true);
    }, 5000);
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleDevPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (devPassword === expectedDevPassword) {
      setShowDevMenu(true);
      setShowDevInput(false);
    } else {
      setShowDevInput(false);
      setDevPassword('');
    }
  };

  const changeMode = (newMode: string) => {
    setGateMode(newMode);
    setShowDevMenu(false);
  };

  // ── LOADING STATE ──
  if (phase === 'loading') {
    return <div style={{ background: '#050505', minHeight: '100dvh' }} />;
  }

  // ── UNLOCKED: show actual site ──
  if (phase === 'unlocked') {
    return <>{children}</>;
  }

  // ── CINEMATIC SEQUENCE ──
  if (phase === 'sequence') {
    return <WelcomeSequence onComplete={handleSequenceComplete} />;
  }

  // Floating nostalgia elements (subtle, cinematic)
  const floatingItems = [
    { emoji: '📷', cls: styles.fl1 },
    { emoji: '🎓', cls: styles.fl2 },
    { emoji: '⭐', cls: styles.fl3 },
    { emoji: '🎞️', cls: styles.fl4 },
    { emoji: '📝', cls: styles.fl5 },
  ];

  // ── WELCOME SCREEN (Hari H) ──
  if (phase === 'welcome') {
    return (
      <div className={styles.gate}>
        <div className={styles.bgBase} />
        <div className={styles.bgGlowWelcome} />
        <div className={styles.bgVignette} />
        <div className={styles.bgGrain} />

        {/* Dust Particles */}
        <div className={styles.dustLayer}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={styles.dust}
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${6 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Icons */}
        <div className={styles.floatingLayer}>
          {floatingItems.map((item, i) => (
            <div key={i} className={`${styles.floatIcon} ${item.cls}`}>
              {item.emoji}
            </div>
          ))}
        </div>

        <div className={styles.main}>
          <div className={styles.badgeWelcome}>🎓 16 Mei 2026</div>

          <h1 className={styles.headline}>
            <span className={styles.headlineSmall}>Gak kerasa, ya?</span>
            <span className={styles.headlineBig}>
              Hari yang kita tunggu-tunggu… <em className={styles.glow}>akhirnya tiba.</em>
            </span>
          </h1>

          <p className={styles.welcomeMsg}>
            Tiga tahun penuh tawa, tangis, tugas dadakan, jam kosong, dan cerita yang nggak bakal habis 
            kalau diceritain. Sekarang semuanya jadi kapsul waktu digital yang bisa kamu buka kapan pun kamu kangen.
          </p>

          <p className={styles.welcomeQuote}>
            &quot;Suatu hari nanti, kita bakal buka halaman ini lagi…<br />
            dan sadar kalau ternyata kita pernah sebahagia itu.&quot;
          </p>

          <button onClick={handleEnterSite} className={styles.enterBtn}>
            <span className={styles.ctaIcon}>✦</span>
            Buka Semesta Kenangan Kita
          </button>

          <p className={styles.footer}>
            Selamat Wisuda, Angkatan 21. Kita berhasil. 💛
          </p>
        </div>
      </div>
    );
  }

  // ── COUNTDOWN SCREEN (Sebelum Hari H) ──
  return (
    <div className={styles.gate}>

      {/* Cinematic Background Layers */}
      <div className={styles.bgBase} />
      <div className={styles.bgGlow} />
      <div className={styles.bgVignette} />
      <div className={styles.bgGrain} />

      {/* Dust Particles */}
      <div className={styles.dustLayer}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={styles.dust}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Nostalgia Icons */}
      <div className={styles.floatingLayer}>
        {floatingItems.map((item, i) => (
          <div key={i} className={`${styles.floatIcon} ${item.cls}`}>
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.main}>

        {/* Small badge */}
        <div className={styles.badge} onDoubleClick={handleSecretBypass}>
          SKINFAVERSE21 · Angkatan 21
        </div>

        {/* Emotional Headline */}
        <h1 className={styles.headline}>
          <span className={styles.headlineSmall}>Ternyata…</span>
          <span className={styles.headlineBig}>kita beneran mau <em className={styles.glow}>selesai.</em></span>
        </h1>

        <p className={styles.tagline}>
          3 tahun yang dulu terasa lama — sekarang tinggal hitungan hari.
        </p>

        {/* Countdown */}
        <div className={styles.countdown}>
          <div className={styles.timeCard}>
            <span className={styles.num}>{timeLeft.days}</span>
            <span className={styles.label}>Hari</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.timeCard}>
            <span className={styles.num}>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Jam</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.timeCard}>
            <span className={styles.num}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Menit</span>
          </div>
          <span className={styles.sep}>:</span>
          <div className={styles.timeCard}>
            <span className={styles.num}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className={styles.label}>Detik</span>
          </div>
        </div>

        {/* Emotional Message */}
        <p className={styles.emotionalMsg}>
          Nanti kita bakal sibuk dengan hidup masing-masing…<br />
          tapi semoga kita nggak lupa rasanya jadi <span className={styles.highlight}>anak SKINFA.</span>
        </p>

        {/* CTA Button / Dev Input / Dev Menu */}
        <div className={styles.ctaContainer}>
          {showDevMenu ? (
            <div className={styles.devMenu}>
              <p className={styles.devMenuTitle}>Developer Mode</p>
              <div className={styles.devMenuButtons}>
                <button onClick={() => changeMode('countdown')}>Countdown</button>
                <button onClick={() => changeMode('welcome')}>Welcome</button>
                <button onClick={() => changeMode('open')}>Unlocked</button>
                <button onClick={() => changeMode('auto')}>Auto</button>
              </div>
            </div>
          ) : showDevInput ? (
            <form onSubmit={handleDevPasswordSubmit} className={styles.devForm}>
              <input 
                type="password" 
                value={devPassword} 
                onChange={(e) => setDevPassword(e.target.value)} 
                placeholder="Enter Dev Code"
                className={styles.devInput}
                autoFocus
              />
              <button type="submit" className={styles.devSubmit}>&gt;</button>
            </form>
          ) : (
            <a
              href="https://forms.gle/zvbJDUUmMYMtAvVH7"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
            >
              <span className={styles.ctaIcon}>✦</span>
              Titipin Kenangan Sebelum Lulus
            </a>
          )}
        </div>

        {/* Footer line */}
        <p className={styles.footer}>
          16 Mei 2026 — Gerbang semesta ini terbuka. ✨
        </p>
      </div>
    </div>
  );
}
