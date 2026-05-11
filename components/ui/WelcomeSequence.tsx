'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WelcomeSequence.module.css';

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type Segment   = { start: number; end: number; text: string; text_id: string };
type Phase     = 'projector' | 'flash' | 'playing1' | 'interlude' | 'playing2' | 'outro';
type KbClass   = 'kb1' | 'kb2' | 'kb3' | 'kb4';
type SlotState = { src: string; kb: KbClass };

// ─────────────────────────────────────────────────────────
// PHOTO LISTS
// ─────────────────────────────────────────────────────────
const MEDIA_1 = [
  '/assets/images/1.jpg',
  '/assets/images/2.jpg',
  '/assets/images/3.jpg',
  '/assets/images/4.jpg',
  '/assets/images/5.jpg',
  '/assets/images/6.jpg',
  '/assets/images/7.jpg',
];
const MEDIA_2 = [
  '/assets/images/8.jpg',
  '/assets/images/9.jpg',
  '/assets/images/10.jpg',
  '/assets/images/11.jpg',
  '/assets/images/5.jpg',
  '/assets/images/3.jpg',
];
const ALL_MEDIA = [...new Set([...MEDIA_1, ...MEDIA_2])];

// ─────────────────────────────────────────────────────────
// LYRICS — inlined (no fetch = no network round-trip)
// ─────────────────────────────────────────────────────────
const SEGMENTS_1: Segment[] = [
  { start: 0.031,  end: 1.273,  text: "After graduating",                                                                            text_id: "Setelah kelulusan itu tiba" },
  { start: 1.293,  end: 4.778,  text: "we come to realize that there will be no more next weeks",                                    text_id: "kita baru tersadar — tak ada lagi \"minggu depan\" yang sama" },
  { start: 5.519,  end: 8.343,  text: "no more lunch together with our classmates",                                                   text_id: "tak ada lagi makan siang yang ramai bersama mereka" },
  { start: 8.363,  end: 10.065, text: "no more street food after class",                                                              text_id: "tak ada lagi jajan di pinggir jalan sepulang sekolah" },
  { start: 10.787, end: 12.93,  text: "and no more moments of breaking down with them",                                               text_id: "dan tak ada lagi momen menangis bersama, saling menguatkan" },
  { start: 13.651, end: 14.552, text: "Instead of saying",                                                                            text_id: "Bukan lagi kalimat" },
  { start: 14.592, end: 17.356, text: "see you tomorrow or next school year",                                                         text_id: "sampai jumpa besok, atau tahun ajaran depan" },
  { start: 17.376, end: 18.498, text: "it will be",                                                                                   text_id: "yang terucap, melainkan" },
  { start: 18.518, end: 20.841, text: "I hope to see you one day again",                                                              text_id: "semoga kita masih bisa bertemu, entah kapan" },
  { start: 20.821, end: 26.67,  text: "It is in this realization that someday we will look back on this moment with sadness",         text_id: "Dan dalam kesadaran itulah kita tahu — suatu hari nanti, kita akan mengenang ini dengan dada yang sesak" },
  { start: 27.451, end: 31.077, text: "as this chapter of our lives will only be a part of our stories",                             text_id: "karena babak ini dalam hidup kita hanya akan menjadi kenangan dalam cerita masing-masing" },
  { start: 32.099, end: 35.384, text: "this thought feels sad because as we grow older",                                              text_id: "pikiran itu terasa menyakitkan, sebab semakin dewasa kita" },
  { start: 35.404, end: 39.47,  text: "we realize that our paths may go in different directions",                                     text_id: "semakin kita sadar bahwa jalan kita mungkin tak lagi beriringan" },
  { start: 40.332, end: 43.757, text: "and there is a chance we might never see each other again",                                    text_id: "dan ada kemungkinan — yang tak ingin kita akui — bahwa kita tak akan pernah bertemu lagi" },
];

const SEGMENTS_2: Segment[] = [
  { start: 0.031,  end: 3.517,  text: "There are moments when you suddenly realize that one day",        text_id: "Ada saat-saat ketika kamu tiba-tiba tersadar bahwa suatu hari nanti" },
  { start: 3.537,  end: 6.543,  text: "you and your friends will take different paths",                   text_id: "kamu dan sahabat-sahabatmu akan melangkah ke jalan yang berbeda" },
  { start: 7.144,  end: 8.847,  text: "each of you will lead your own lives",                             text_id: "masing-masing akan menjalani hidupnya sendiri" },
  { start: 9.468,  end: 10.971, text: "attending different universities",                                  text_id: "berkuliah di tempat yang tak lagi sama" },
  { start: 11.432, end: 13.716, text: "and leaving your hometown to follow your dreams",                   text_id: "dan meninggalkan kota ini demi mengejar mimpi masing-masing" },
  { start: 14.357, end: 16.02,  text: "your friends may become distant",                                   text_id: "dan perlahan, mereka pun akan terasa semakin jauh" },
  { start: 16.621, end: 18.505, text: "and you'll be unsure of when you'll meet again",                   text_id: "dan kamu tak lagi tahu kapan — atau apakah — kalian akan bertemu lagi" },
  { start: 18.525, end: 21.33,  text: "or create new shared experiences",                                 text_id: "atau menciptakan kenangan baru bersama seperti dulu" },
  { start: 21.31,  end: 24.556, text: "Everyone will find themselves entangled in the demands",            text_id: "Semua orang akan terlarut dalam tuntutan" },
  { start: 24.656, end: 27.421, text: "and hectic nature of pursuing success",                             text_id: "dan kesibukan yang datang saat mengejar keberhasilan" },
  { start: 27.962, end: 30.086, text: "and striving to fulfill their aspirations",                         text_id: "dan berjuang habis-habisan demi mewujudkan harapan mereka" },
  { start: 30.968, end: 31.428, text: "So now",                                                            text_id: "Maka sekarang" },
  { start: 31.469, end: 33.793, text: "as we are in this moment",                                          text_id: "selagi kita masih ada di sini, di momen ini" },
  { start: 34.394, end: 35.716, text: "let us enjoy the little things",                                    text_id: "nikmati hal-hal kecil itu sepenuhnya" },
  { start: 35.736, end: 36.418, text: "with our friends",                                                  text_id: "bersama mereka yang masih ada di sisimu" },
  { start: 37.119, end: 39.403, text: "and dig them deep within our hearts",                               text_id: "dan simpan dalam-dalam di relung hati yang paling dalam" },
];

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────
const IMAGE_DUR_1  = 6500;  // ms per slide — part 1
const IMAGE_DUR_2  = 7200;  // ms per slide — part 2
const INTERLUDE_MS = 5000;
const VOICE_DELAY  = 3000;
const COUNT_NUMS   = [5, 4, 3, 2, 1];
const KB_CLASSES: KbClass[] = ['kb1', 'kb2', 'kb3', 'kb4'];

// Throttle: only check lyrics every N ms to avoid hammering main thread
const LYRIC_THROTTLE_MS = 150;

interface Props { onComplete: () => void; }

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export default function WelcomeSequence({ onComplete }: Props) {

  const [phase, setPhase]       = useState<Phase>('projector');
  const [countNum, setCountNum] = useState(5);
  const [exiting, setExiting]   = useState(false);

  // Two-slot crossfade
  const [slotA, setSlotA]   = useState<SlotState>({ src: MEDIA_1[0], kb: 'kb1' });
  const [slotB, setSlotB]   = useState<SlotState>({ src: '',          kb: 'kb2' });
  const [activeSlot, setActive] = useState<'A' | 'B'>('A');

  const slideIdxRef  = useRef(0);
  const slideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lyric DOM refs — direct mutation, zero React state per frame
  const lyricWrapRef = useRef<HTMLDivElement>(null);
  const lyricEnRef   = useRef<HTMLParagraphElement>(null);
  const lyricIdRef   = useRef<HTMLParagraphElement>(null);
  const prevSegRef   = useRef(-1);
  const lyricTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckRef = useRef(0); // for onTimeUpdate throttle

  const quoteRef  = useRef<HTMLDivElement>(null);
  const voice1Ref = useRef<HTMLAudioElement>(null);
  const voice2Ref = useRef<HTMLAudioElement>(null);
  const instrRef  = useRef<HTMLAudioElement>(null);
  const sfxRef    = useRef<HTMLAudioElement>(null);

  // ── Preload all images immediately on mount ──────────────
  useEffect(() => {
    ALL_MEDIA.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ── Smooth volume via rAF (no setInterval) ───────────────
  const fadeInstrTo = useCallback((target: number) => {
    const instr = instrRef.current;
    if (!instr) return;
    const STEP = 0.015;
    const tick = () => {
      if (!instrRef.current) return;
      const diff = target - instrRef.current.volume;
      if (Math.abs(diff) < STEP) { instrRef.current.volume = target; return; }
      instrRef.current.volume = Math.max(0, Math.min(1, instrRef.current.volume + (diff > 0 ? STEP : -STEP)));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // ─────────────────────────────────────────────────────────
  // SLIDESHOW ENGINE
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // LYRIC ENGINE — direct DOM mutations (zero React re-renders)
  // ─────────────────────────────────────────────────────────
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

  // Throttled lyric sync — called from onTimeUpdate at ~4-8Hz
  const syncLyric = useCallback((segs: Segment[], t: number) => {
    // Throttle: skip if called too recently
    const now = performance.now();
    if (now - lastCheckRef.current < LYRIC_THROTTLE_MS) return;
    lastCheckRef.current = now;

    let found = -1;
    for (let i = 0; i < segs.length; i++) {
      if (t >= segs[i].start && t <= segs[i].end) { found = i; break; }
    }
    if (found === prevSegRef.current) return;
    prevSegRef.current = found;

    if (lyricTimer.current) { clearTimeout(lyricTimer.current); lyricTimer.current = null; }
    hideLyric();
    if (found >= 0) {
      lyricTimer.current = setTimeout(() => showLyric(segs[found]), 380);
    }
  }, [hideLyric, showLyric]);

  // ─────────────────────────────────────────────────────────
  // PHASE EFFECTS
  // ─────────────────────────────────────────────────────────

  // 1. PROJECTOR
  useEffect(() => {
    if (phase !== 'projector') return;
    const sfx = sfxRef.current;
    if (sfx) { sfx.currentTime = 0; sfx.volume = 1; sfx.play().catch(() => {}); }
    const ts: ReturnType<typeof setTimeout>[] = [];
    COUNT_NUMS.forEach((n, i) => ts.push(setTimeout(() => setCountNum(n), i * 1000)));
    ts.push(setTimeout(() => setPhase('flash'), 5200));
    return () => ts.forEach(clearTimeout);
  }, [phase]);

  // 1b. FLASH → PLAYING1
  useEffect(() => {
    if (phase !== 'flash') return;
    const t = setTimeout(() => setPhase('playing1'), 750);
    return () => clearTimeout(t);
  }, [phase]);

  // 2. PLAYING1
  useEffect(() => {
    if (phase !== 'playing1') return;
    prevSegRef.current = -1;
    lastCheckRef.current = 0;
    hideLyric();

    const instr = instrRef.current;
    if (instr) { instr.volume = 0; instr.play().catch(() => {}); }
    fadeInstrTo(0.5);
    startSlideshow(MEDIA_1, IMAGE_DUR_1);

    const vt = setTimeout(() => {
      voice1Ref.current?.play().catch(() => {});
      if (voice1Ref.current) voice1Ref.current.volume = 1;
    }, VOICE_DELAY);

    return () => { clearTimeout(vt); stopSlideshow(); };
  }, [phase, fadeInstrTo, hideLyric, startSlideshow, stopSlideshow]);

  // 3. INTERLUDE
  useEffect(() => {
    if (phase !== 'interlude') return;
    prevSegRef.current = -1;
    hideLyric();
    fadeInstrTo(0.1);
    const t = setTimeout(() => setPhase('playing2'), INTERLUDE_MS);
    return () => clearTimeout(t);
  }, [phase, fadeInstrTo, hideLyric]);

  // 4. PLAYING2
  useEffect(() => {
    if (phase !== 'playing2') return;
    prevSegRef.current = -1;
    lastCheckRef.current = 0;
    hideLyric();
    fadeInstrTo(0.42);
    startSlideshow(MEDIA_2, IMAGE_DUR_2);
    const v2 = voice2Ref.current;
    if (v2) { v2.volume = 1; v2.play().catch(() => {}); }
    return () => stopSlideshow();
  }, [phase, fadeInstrTo, hideLyric, startSlideshow, stopSlideshow]);

  // 5. OUTRO
  useEffect(() => {
    if (phase !== 'outro') return;
    hideLyric();
    stopSlideshow();
    fadeInstrTo(0);
    const t1 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.add(styles.quoteShow);
    }, 3200);
    const t2 = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 2400);
    }, 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, onComplete, fadeInstrTo, hideLyric, stopSlideshow]);

  // ─────────────────────────────────────────────────────────
  // AUDIO HANDLERS
  // ─────────────────────────────────────────────────────────
  const handleTime1 = useCallback(() => {
    const t = voice1Ref.current?.currentTime;
    if (t !== undefined) syncLyric(SEGMENTS_1, t);
  }, [syncLyric]);

  const handleTime2 = useCallback(() => {
    const t = voice2Ref.current?.currentTime;
    if (t !== undefined) syncLyric(SEGMENTS_2, t);
  }, [syncLyric]);

  const handleV1End = useCallback(() => setPhase('interlude'), []);
  const handleV2End = useCallback(() => setPhase('outro'),     []);

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  const isPlayPhase = phase === 'playing1' || phase === 'interlude'
                   || phase === 'playing2' || phase === 'outro';

  return (
    <div className={`${styles.seq} ${exiting ? styles.seqExiting : ''}`}>

      {/* ── Audio — always mounted, never re-created ── */}
      <audio ref={voice1Ref} src="/assets/audio/voice1.mp3" preload="auto"
             onTimeUpdate={handleTime1} onEnded={handleV1End} />
      <audio ref={voice2Ref} src="/assets/audio/voice2.mp3" preload="auto"
             onTimeUpdate={handleTime2} onEnded={handleV2End} />
      <audio ref={instrRef}  src="/assets/audio/instrument-full.mp3" preload="auto" />
      <audio ref={sfxRef}    src="/assets/audio/coundown-sfx.wav"    preload="auto" />

      {/* ══ PROJECTOR ══ */}
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

      {/* ══ PLAYING / INTERLUDE / OUTRO ══ */}
      {isPlayPhase && (
        <div className={styles.playing}>

          {/* Slot A */}
          <div className={`${styles.slide} ${activeSlot === 'A' ? styles.slideIn : styles.slideOut}`}>
            {slotA.src && (
              <img src={slotA.src} alt="" className={styles.photoImg}
                   loading="eager" decoding="async" fetchPriority="high" />
            )}
          </div>

          {/* Slot B */}
          <div className={`${styles.slide} ${activeSlot === 'B' ? styles.slideIn : styles.slideOut}`}>
            {slotB.src && (
              <img src={slotB.src} alt="" className={styles.photoImg}
                   loading="eager" decoding="async" />
            )}
          </div>

          {/* Single combined overlay (vignette + dark) — one layer */}
          <div className={styles.sceneOverlay} />
          <div className={styles.vign} />

          {/* Interlude dim */}
          {phase === 'interlude' && <div className={styles.interludeOverlay} />}

          {/* Outro dim */}
          {phase === 'outro' && <div className={styles.outroDimOverlay} />}

          {/* ── Lyric block: single DOM node mutated directly ── */}
          <div
            ref={lyricWrapRef}
            className={styles.lyricWrap}
            style={{
              opacity: 0,
              transform: 'translateY(6px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              willChange: 'opacity, transform',
            }}
          >
            <div className={styles.lyricEnArea}>
              <p ref={lyricEnRef} className={styles.lyricEn}>&nbsp;</p>
            </div>
            <div className={styles.lyricIdArea}>
              <p ref={lyricIdRef} className={styles.lyricId}>&nbsp;</p>
            </div>
          </div>

          {/* ── Quote ── */}
          <div ref={quoteRef} className={styles.quoteWrap}>
            <p className={styles.quoteText}>anyway don&apos;t be a stranger.....</p>
          </div>
        </div>
      )}
    </div>
  );
}
