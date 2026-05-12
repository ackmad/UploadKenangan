'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WelcomeSequence.module.css';

type Segment   = { start: number; end: number; text: string; text_id: string };
type Phase     = 'projector' | 'flash' | 'playing1' | 'interlude' | 'playing2' | 'outro';
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
    // Hapus quoteShow agar CSS transition opacity 3s berjalan balik ke 0
    const t2 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.remove(styles.quoteShow);
      instrTargetRef.current = -1;
      fadeInstrTo(0, true); // instrument fade out bersamaan
    }, 14940);

    // t3 = 14940 + 3000ms = 17940ms → setelah fade selesai, exit sequence
    const t3 = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 2400);
    }, 17940);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, onComplete, fadeInstrTo, hideLyric, stopSlideshow]);

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
    </div>
  );
}
