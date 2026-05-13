'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WelcomeSequence.module.css';

type Segment   = { start: number; end: number; text: string; text_id: string };
type Phase     = 'projector' | 'flash' | 'playing1' | 'interlude' | 'playing2' | 'outro' | 'ending';
type KbClass   = 'kb1' | 'kb2' | 'kb3' | 'kb4';
type SlotState = { src: string; kb: KbClass };

const MEDIA_1 = [
  '/assets/images/1.jpg', '/assets/images/2.jpg', '/assets/images/3.jpg',
  '/assets/images/4.jpg', '/assets/images/5.jpg', '/assets/images/6.jpg',
  '/assets/images/7.jpg',
];
const MEDIA_2 = [
  '/assets/images/8.jpg', '/assets/images/9.jpg', '/assets/images/10.jpg',
  '/assets/images/11.jpg', '/assets/images/5.jpg', '/assets/images/3.jpg',
];
const ALL_MEDIA = [...new Set([...MEDIA_1, ...MEDIA_2])];

// ── Timing ──
const IMAGE_DUR_1       = 6500;
const IMAGE_DUR_2       = 7200;
const INTERLUDE_MS      = 5000;
const VOICE_DELAY       = 3000;
const COUNT_NUMS        = [5, 4, 3, 2, 1];
const KB_CLASSES: KbClass[] = ['kb1', 'kb2', 'kb3', 'kb4'];
const LYRIC_THROTTLE_MS = 150;

// ── Ending sequence data ──
const EMOTIONAL_TEXTS = [
  { text: "dulu kita pikir waktu masih panjang.", position: { top: '20%', left: '50%' } },
  { text: "ternyata ini terakhir kalinya.", position: { top: '35%', left: '50%' } },
  { text: "kelas yang dulu pengen cepet ditinggalin…", position: { top: '50%', left: '50%' } },
  { text: "sekarang malah pengen diulang.", position: { top: '30%', left: '50%' } },
  { text: "ternyata kita benar-benar tumbuh di tempat ini.", position: { top: '45%', left: '50%' } },
  { text: "dan setelah ini… semuanya bakal beda.", position: { top: '40%', left: '50%' } },
  { text: "suatu hari nanti kita bakal kangen suasana ini.", position: { top: '55%', left: '50%' } },
  { text: "3 tahun ternyata bisa secepat itu.", position: { top: '38%', left: '50%' } },
];

const MEMORY_ITEMS = [
  // Layer 1 - Background polaroids (falling from top)
  { type: 'polaroid', caption: 'Kelas XII', img: '/assets/images/1.jpg', rotate: -8, animType: 'fallTop' },
  { type: 'polaroid', caption: 'Masa indah', img: '/assets/images/2.jpg', rotate: 12, animType: 'fallTop' },
  { type: 'polaroid', caption: 'Bersama', img: '/assets/images/3.jpg', rotate: -5, animType: 'fallTop' },
  { type: 'polaroid', caption: 'Kenangan', img: '/assets/images/4.jpg', rotate: 7, animType: 'fallTop' },
  { type: 'polaroid', caption: 'Teman', img: '/assets/images/5.jpg', rotate: -10, animType: 'fallTop' },
  
  // Layer 2 - Side entries (sliding from left/right)
  { type: 'polaroid', caption: 'Senyuman', img: '/assets/images/6.jpg', rotate: 15, animType: 'slideLeft' },
  { type: 'polaroid', caption: 'Canda tawa', img: '/assets/images/7.jpg', rotate: -12, animType: 'slideRight' },
  { type: 'polaroid', caption: 'Kebersamaan', img: '/assets/images/8.jpg', rotate: 6, animType: 'slideLeft' },
  { type: 'polaroid', caption: 'Cerita kita', img: '/assets/images/9.jpg', rotate: -7, animType: 'slideRight' },
  { type: 'polaroid', caption: 'Momen', img: '/assets/images/10.jpg', rotate: 9, animType: 'slideLeft' },
  
  // Layer 3 - Rising from bottom
  { type: 'polaroid', caption: 'Perjalanan', img: '/assets/images/11.jpg', rotate: -6, animType: 'riseBottom' },
  { type: 'polaroid', caption: 'Angkatan 21', img: '/assets/images/1.jpg', rotate: 11, animType: 'riseBottom' },
  { type: 'polaroid', caption: 'Selamanya', img: '/assets/images/2.jpg', rotate: -9, animType: 'riseBottom' },
  { type: 'polaroid', caption: 'Tak terlupa', img: '/assets/images/3.jpg', rotate: 8, animType: 'riseBottom' },
  
  // Layer 4 - Zoom in effects
  { type: 'polaroid', caption: 'Kita', img: '/assets/images/4.jpg', rotate: -4, animType: 'zoomIn' },
  { type: 'polaroid', caption: 'Bersama', img: '/assets/images/5.jpg', rotate: 13, animType: 'zoomIn' },
  { type: 'polaroid', caption: 'Selamanya', img: '/assets/images/6.jpg', rotate: -11, animType: 'zoomIn' },
  
  // Layer 5 - Fade float (subtle entries)
  { type: 'polaroid', caption: 'Nostalgia', img: '/assets/images/7.jpg', rotate: 5, animType: 'fadeFloat' },
  { type: 'polaroid', caption: 'Memori', img: '/assets/images/8.jpg', rotate: -14, animType: 'fadeFloat' },
  { type: 'polaroid', caption: 'Abadi', img: '/assets/images/9.jpg', rotate: 10, animType: 'fadeFloat' },
  
  // Quotes scattered between photos
  { type: 'quote', text: 'Gak nyangka kita bisa sampai sini...', animType: 'fadeFloat' },
  { type: 'quote', text: 'Terima kasih untuk semua kenangan ini', animType: 'slideLeft' },
  { type: 'quote', text: 'Sampai jumpa di lain waktu...', animType: 'slideRight' },
  { type: 'quote', text: 'Kita akan selalu ingat masa ini', animType: 'zoomIn' },
  { type: 'quote', text: 'Selamat tinggal, masa SMA', animType: 'riseBottom' },
  
  // Timestamps
  { type: 'timestamp', text: '2023 - 2026', animType: 'fadeFloat' },
  { type: 'timestamp', text: 'Angkatan 21', animType: 'zoomIn' },
  { type: 'timestamp', text: '16 Mei 2026', animType: 'slideLeft' },
  { type: 'timestamp', text: 'SKINFA', animType: 'slideRight' },
];

// ── Volume levels ──
const VOL_SPEAKING  = 0.15;  // instrument saat voice sedang ngomong
const VOL_GAP       = 0.45;  // instrument saat hening/jeda antar kalimat
const VOL_INTERLUDE = 0.08;  // instrument saat interlude
const VOL_QUOTE     = 0.80;  // instrument full saat quote muncul

interface Props { onComplete: () => void; }

export default function WelcomeSequence({ onComplete }: Props) {
  const [phase, setPhase]       = useState<Phase>('projector');
  const [countNum, setCountNum] = useState(5);
  const [exiting, setExiting]   = useState(false);
  const [endingPhase, setEndingPhase] = useState<'silence' | 'memories' | 'freeze' | 'gold' | 'logo'>('silence');

  // Dynamic lyrics state
  const [segments1, setSegments1] = useState<Segment[]>([]);
  const [segments2, setSegments2] = useState<Segment[]>([]);

  const [slotA, setSlotA]     = useState<SlotState>({ src: MEDIA_1[0], kb: 'kb1' });
  const [slotB, setSlotB]     = useState<SlotState>({ src: '',          kb: 'kb2' });
  const [activeSlot, setActive] = useState<'A' | 'B'>('A');

  const slideIdxRef  = useRef(0);
  const slideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lyricWrapRef = useRef<HTMLDivElement>(null);
  const lyricEnRef   = useRef<HTMLParagraphElement>(null);
  const lyricIdRef   = useRef<HTMLParagraphElement>(null);
  const prevSegRef   = useRef(-1);
  const lyricTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckRef = useRef(0);

  const quoteRef  = useRef<HTMLDivElement>(null);
  const voice1Ref = useRef<HTMLAudioElement>(null);
  const voice2Ref = useRef<HTMLAudioElement>(null);
  const instrRef  = useRef<HTMLAudioElement>(null);
  const sfxRef    = useRef<HTMLAudioElement>(null);

  // Track current fade target to avoid redundant rAF chains
  const instrTargetRef = useRef(-1);

  // Preload all images and FETCH lyrics on mount
  useEffect(() => {
    // Preload images
    ALL_MEDIA.forEach(src => { const img = new Image(); img.src = src; });

    // Fetch lyrics
    const loadLyrics = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch('/assets/lirik/lirik1.json'),
          fetch('/assets/lirik/lirik2.json')
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        setSegments1(data1.segments || []);
        setSegments2(data2.segments || []);
      } catch (err) {
        console.error('Failed to load lyrics:', err);
      }
    };
    loadLyrics();
  }, []);

  // ── Smooth volume fade via rAF ──
  const fadeInstrTo = useCallback((target: number, force = false) => {
    if (!force && Math.abs(instrTargetRef.current - target) < 0.01) return;
    instrTargetRef.current = target;
    const STEP = 0.012;
    const tick = () => {
      const instr = instrRef.current;
      if (!instr || instrTargetRef.current !== target) return; // cancelled
      const diff = target - instr.volume;
      if (Math.abs(diff) < STEP) { instr.volume = Math.max(0, Math.min(1, target)); return; }
      instr.volume = Math.max(0, Math.min(1, instr.volume + (diff > 0 ? STEP : -STEP)));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // ── Slideshow engine ──
  const stopSlideshow = useCallback(() => {
    if (slideTimer.current) { clearTimeout(slideTimer.current); slideTimer.current = null; }
  }, []);

  const startSlideshow = useCallback((list: string[], dur: number) => {
    stopSlideshow();
    slideIdxRef.current = 0;
    setSlotA({ src: list[0], kb: 'kb1' });
    setSlotB({ src: '',      kb: 'kb2' });
    setActive('A');
    const next = () => {
      const ni = slideIdxRef.current + 1;
      if (ni >= list.length) return;
      slideIdxRef.current = ni;
      const src = list[ni];
      const kb: KbClass = KB_CLASSES[ni % KB_CLASSES.length];
      setActive(prev => {
        if (prev === 'A') { setSlotB({ src, kb }); return 'B'; }
        else              { setSlotA({ src, kb }); return 'A'; }
      });
      slideTimer.current = setTimeout(next, dur);
    };
    slideTimer.current = setTimeout(next, dur);
  }, [stopSlideshow]);

  // ── Lyric DOM mutations ──
  const hideLyric = useCallback(() => {
    const el = lyricWrapRef.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(6px)';
  }, []);

  const showLyric = useCallback((seg: Segment) => {
    if (lyricEnRef.current) lyricEnRef.current.textContent = seg.text;
    if (lyricIdRef.current) lyricIdRef.current.textContent = seg.text_id;
    const el = lyricWrapRef.current;
    if (!el) return;
    el.style.opacity   = '1';
    el.style.transform = 'translateY(0)';
  }, []);

  // ── Lyric sync + voice ducking (throttled) ──
  const syncLyric = useCallback((segs: Segment[], t: number) => {
    const now = performance.now();
    if (now - lastCheckRef.current < LYRIC_THROTTLE_MS) return;
    lastCheckRef.current = now;

    let found = -1;
    for (let i = 0; i < segs.length; i++) {
      const clampedStart = Math.max(0, segs[i].start);
      if (t >= clampedStart && t <= segs[i].end) { found = i; break; }
    }

    // Duck/raise instrument based on whether voice is speaking
    fadeInstrTo(found >= 0 ? VOL_SPEAKING : VOL_GAP);

    if (found === prevSegRef.current) return;
    prevSegRef.current = found;

    if (lyricTimer.current) { clearTimeout(lyricTimer.current); lyricTimer.current = null; }
    hideLyric();
    if (found >= 0) {
      lyricTimer.current = setTimeout(() => showLyric(segs[found]), 380);
    }
  }, [fadeInstrTo, hideLyric, showLyric]);

  // ── Phase effects ──

  useEffect(() => {
    if (phase !== 'projector') return;
    const sfx = sfxRef.current;
    if (sfx) { sfx.currentTime = 0; sfx.volume = 1; sfx.play().catch(() => {}); }
    const ts: ReturnType<typeof setTimeout>[] = [];
    COUNT_NUMS.forEach((n, i) => ts.push(setTimeout(() => setCountNum(n), i * 1000)));
    ts.push(setTimeout(() => setPhase('flash'), 5200));
    return () => ts.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'flash') return;
    const t = setTimeout(() => setPhase('playing1'), 750);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing1') return;
    prevSegRef.current = -1;
    lastCheckRef.current = 0;
    hideLyric();
    instrTargetRef.current = -1;

    const instr = instrRef.current;
    if (instr) { instr.volume = 0; instr.play().catch(() => {}); }
    fadeInstrTo(VOL_GAP, true); // start at gap volume before voice
    startSlideshow(MEDIA_1, IMAGE_DUR_1);

    const vt = setTimeout(() => {
      const v1 = voice1Ref.current;
      if (v1) { v1.volume = 1; v1.play().catch(() => {}); }
    }, VOICE_DELAY);

    return () => { clearTimeout(vt); stopSlideshow(); };
  }, [phase, fadeInstrTo, hideLyric, startSlideshow, stopSlideshow]);

  useEffect(() => {
    if (phase !== 'interlude') return;
    prevSegRef.current = -1;
    hideLyric();
    fadeInstrTo(VOL_INTERLUDE, true);
    const t = setTimeout(() => setPhase('playing2'), INTERLUDE_MS);
    return () => clearTimeout(t);
  }, [phase, fadeInstrTo, hideLyric]);

  useEffect(() => {
    if (phase !== 'playing2') return;
    prevSegRef.current = -1;
    lastCheckRef.current = 0;
    hideLyric();
    instrTargetRef.current = -1;
    fadeInstrTo(VOL_GAP, true);
    startSlideshow(MEDIA_2, IMAGE_DUR_2);
    const v2 = voice2Ref.current;
    if (v2) { v2.volume = 1; v2.play().catch(() => {}); }
    return () => stopSlideshow();
  }, [phase, fadeInstrTo, hideLyric, startSlideshow, stopSlideshow]);

  useEffect(() => {
    if (phase !== 'outro') return;
    hideLyric();
    stopSlideshow();

    // Instrument naik penuh untuk quote (lirik lagu)
    instrTargetRef.current = -1;
    fadeInstrTo(VOL_QUOTE, true);

    // t1 = 3.2s → quote fade IN
    const t1 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.add(styles.quoteShow);
    }, 3200);

    // t2 = 3200 + 11740 = 14940ms → quote + instrument mulai fade OUT bareng
    const t2 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.remove(styles.quoteShow);
      instrTargetRef.current = -1;
      fadeInstrTo(0, true); // instrument fade out bersamaan
    }, 14940);

    // t3 = 14940 + 3000ms = 17940ms → setelah fade selesai, masuk ending sequence
    const t3 = setTimeout(() => {
      setPhase('ending');
    }, 17940);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, fadeInstrTo, hideLyric, stopSlideshow]);

  // ── Audio handlers ──
  const handleTime1 = useCallback(() => {
    const t = voice1Ref.current?.currentTime;
    if (t !== undefined) syncLyric(segments1, t);
  }, [syncLyric, segments1]);

  const handleTime2 = useCallback(() => {
    const t = voice2Ref.current?.currentTime;
    if (t !== undefined) syncLyric(segments2, t);
  }, [syncLyric, segments2]);

  const handleV1End = useCallback(() => setPhase('interlude'), []);
  const handleV2End = useCallback(() => setPhase('outro'),     []);

  // ── ENDING SEQUENCE ORCHESTRATION ──
  useEffect(() => {
    if (phase !== 'ending') return;
    
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // 1. Silence (2.5s) - longer silence for emotional impact
    setEndingPhase('silence');
    
    // 2. Memories start appearing (after 2.5s)
    timers.push(setTimeout(() => {
      setEndingPhase('memories');
    }, 2500));
    
    // 3. Freeze memories (after 18s total) - longer to see all memories
    timers.push(setTimeout(() => {
      setEndingPhase('freeze');
    }, 18000));
    
    // 4. Gold fade (after 21s total)
    timers.push(setTimeout(() => {
      setEndingPhase('gold');
    }, 21000));
    
    // 5. Logo reveal (after 24s total)
    timers.push(setTimeout(() => {
      setEndingPhase('logo');
    }, 24000));
    
    // 6. Exit to homepage (after 31s total) - hold logo longer
    timers.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 2400);
    }, 31000));
    
    return () => timers.forEach(clearTimeout);
  }, [phase, onComplete]);

  const isPlayPhase = phase === 'playing1' || phase === 'interlude'
                   || phase === 'playing2' || phase === 'outro';

  return (
    <div className={`${styles.seq} ${exiting ? styles.seqExiting : ''}`}>

      <audio ref={voice1Ref} src="/assets/audio/voice1.mp3" preload="auto"
             onTimeUpdate={handleTime1} onEnded={handleV1End} />
      <audio ref={voice2Ref} src="/assets/audio/voice2.mp3" preload="auto"
             onTimeUpdate={handleTime2} onEnded={handleV2End} />
      <audio ref={instrRef}  src="/assets/audio/instrument-full.mp3" preload="auto" />
      <audio ref={sfxRef}    src="/assets/audio/coundown-sfx.wav"    preload="auto" />

      {(phase === 'projector' || phase === 'flash') && (
        <div className={`${styles.proj} ${phase === 'flash' ? styles.projFlash : ''}`}>
          <div className={styles.filmStrip}>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.sprocket} />)}
          </div>
          <div className={styles.projCenter}>
            <div className={styles.filmFrame}>
              <div className={`${styles.tick} ${styles.tTL}`} />
              <div className={`${styles.tick} ${styles.tTR}`} />
              <div className={`${styles.tick} ${styles.tBL}`} />
              <div className={`${styles.tick} ${styles.tBR}`} />
              <div className={styles.crossH} />
              <div className={styles.crossV} />
              <div className={styles.crossCircle} />
              <span key={countNum} className={styles.countNum}>{countNum}</span>
            </div>
          </div>
          <div className={styles.filmStrip}>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.sprocket} />)}
          </div>
          <div className={styles.flicker} />
          <div className={styles.grain}   />
          <div className={styles.vign}    />
        </div>
      )}

      {isPlayPhase && (
        <div className={styles.playing}>
          <div className={`${styles.slide} ${activeSlot === 'A' ? styles.slideIn : styles.slideOut}`}>
            {slotA.src && <img src={slotA.src} alt="" className={styles.photoImg} loading="eager" decoding="async" fetchPriority="high" />}
          </div>
          <div className={`${styles.slide} ${activeSlot === 'B' ? styles.slideIn : styles.slideOut}`}>
            {slotB.src && <img src={slotB.src} alt="" className={styles.photoImg} loading="eager" decoding="async" />}
          </div>

          <div className={styles.sceneOverlay} />
          <div className={styles.vign} />
          {phase === 'interlude' && <div className={styles.interludeOverlay} />}
          {phase === 'outro'     && <div className={styles.outroDimOverlay}  />}

          <div
            ref={lyricWrapRef}
            className={styles.lyricWrap}
            style={{ opacity: 0, transform: 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease', willChange: 'opacity, transform' }}
          >
            <div className={styles.lyricEnArea}>
              <p ref={lyricEnRef} className={styles.lyricEn}>&nbsp;</p>
            </div>
            <div className={styles.lyricIdArea}>
              <p ref={lyricIdRef} className={styles.lyricId}>&nbsp;</p>
            </div>
          </div>

          <div ref={quoteRef} className={styles.quoteWrap}>
            <p className={styles.quoteText}>anyway don&apos;t be a stranger.....</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ENDING SEQUENCE - Emotional Closure
          ═══════════════════════════════════════════════════════════ */}
      {phase === 'ending' && (
        <div className={`${styles.endingWrap} ${styles.endingShow}`}>
          {/* Dark silence */}
          <div className={styles.endingSilence} />

          {/* Memories layer */}
          {(endingPhase === 'memories' || endingPhase === 'freeze' || endingPhase === 'gold' || endingPhase === 'logo') && (
            <div className={styles.memoriesLayer}>
              {MEMORY_ITEMS.map((item, idx) => {
                // More chaotic and overlapping positions
                const positions = [
                  { top: '8%', left: '5%', zIndex: 5 },
                  { top: '12%', right: '8%', zIndex: 8 },
                  { top: '25%', left: '15%', zIndex: 3 },
                  { top: '18%', right: '22%', zIndex: 12 },
                  { top: '35%', left: '8%', zIndex: 7 },
                  { top: '32%', right: '12%', zIndex: 4 },
                  { top: '45%', left: '25%', zIndex: 10 },
                  { top: '42%', right: '28%', zIndex: 6 },
                  { top: '55%', left: '12%', zIndex: 9 },
                  { top: '52%', right: '18%', zIndex: 11 },
                  { top: '65%', left: '20%', zIndex: 2 },
                  { top: '62%', right: '15%', zIndex: 13 },
                  { top: '75%', left: '8%', zIndex: 5 },
                  { top: '72%', right: '25%', zIndex: 7 },
                  { top: '15%', left: '45%', zIndex: 14 },
                  { top: '28%', left: '52%', zIndex: 4 },
                  { top: '48%', left: '48%', zIndex: 8 },
                  { top: '58%', left: '55%', zIndex: 6 },
                  { top: '38%', left: '38%', zIndex: 15 },
                  { top: '68%', left: '42%', zIndex: 3 },
                  // Quotes and timestamps positions
                  { top: '22%', left: '35%', zIndex: 16 },
                  { top: '50%', right: '35%', zIndex: 17 },
                  { bottom: '25%', left: '30%', zIndex: 18 },
                  { top: '60%', left: '65%', zIndex: 19 },
                  { bottom: '35%', right: '40%', zIndex: 20 },
                  { top: '40%', left: '70%', zIndex: 9 },
                  { bottom: '45%', left: '15%', zIndex: 10 },
                  { top: '80%', right: '35%', zIndex: 11 },
                  { top: '10%', left: '65%', zIndex: 12 },
                ];
                
                const pos = positions[idx % positions.length];
                const delay = idx * 0.15; // Faster cascade
                
                // Random rotation variations for animation
                const rotateStart = item.rotate ? item.rotate + (Math.random() * 20 - 10) : (Math.random() * 30 - 15);
                const rotateMid = item.rotate ? item.rotate + (Math.random() * 10 - 5) : (Math.random() * 15 - 7.5);

                return (
                  <div
                    key={idx}
                    className={`${styles.memoryItem} ${styles[item.animType || 'fadeFloat']} ${endingPhase === 'freeze' || endingPhase === 'gold' || endingPhase === 'logo' ? styles.freeze : ''}`}
                    style={{
                      ...pos,
                      animationDelay: `${delay}s`,
                      // @ts-ignore - CSS custom properties
                      '--rotate': `${item.rotate || 0}deg`,
                      '--rotate-start': `${rotateStart}deg`,
                      '--rotate-mid': `${rotateMid}deg`,
                    }}
                  >
                    {item.type === 'polaroid' && (
                      <div className={styles.polaroid} style={{ '--rotate': `${item.rotate}deg` } as React.CSSProperties}>
                        <div className={styles.polaroidImg} style={{ backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className={styles.polaroidCaption}>{item.caption}</div>
                      </div>
                    )}
                    {item.type === 'quote' && (
                      <div className={styles.quoteBubble}>
                        <p className={styles.quoteBubbleText}>&quot;{item.text}&quot;</p>
                      </div>
                    )}
                    {item.type === 'timestamp' && (
                      <div className={styles.timestamp}>{item.text}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Emotional texts cycling - MORE VARIED */}
          {endingPhase === 'memories' && EMOTIONAL_TEXTS.map((item, idx) => (
            <div
              key={idx}
              className={styles.emotionalText}
              style={{ 
                ...item.position,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${idx * 1.8}s`,
              }}
            >
              <p>{item.text}</p>
            </div>
          ))}

          {/* Gold fade effect */}
          {(endingPhase === 'gold' || endingPhase === 'logo') && (
            <div className={styles.goldFade} />
          )}

          {/* Final logo */}
          {endingPhase === 'logo' && (
            <div className={styles.finalLogo}>
              <h1 className={styles.logoMain}>SKINFAVERSE21</h1>
              <p className={styles.logoSubtitle}>
                Semesta ini akan selalu menyimpan cerita kita.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
