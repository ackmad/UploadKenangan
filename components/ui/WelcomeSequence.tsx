'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WelcomeSequence.module.css';

type Segment   = { start: number; end: number; text: string; text_id: string };
type Phase     = 'projector' | 'flash' | 'playing1' | 'interlude' | 'playing2' | 'outro' | 'ending';
type KbClass   = 'kb1' | 'kb2' | 'kb3' | 'kb4' | 'kb5' | 'kb6';
type SlotState = { src: string; kb: KbClass };

// Semua foto dari folder WelcomeSequenceImages
const ALL_LOCAL_PHOTOS = [
  '/assets/images/WelcomeSequenceImages/1.jpg',
  '/assets/images/WelcomeSequenceImages/2.jpg',
  '/assets/images/WelcomeSequenceImages/3.jpg',
  '/assets/images/WelcomeSequenceImages/5.jpg',
  '/assets/images/WelcomeSequenceImages/6.jpg',
  '/assets/images/WelcomeSequenceImages/7.jpg',
  '/assets/images/WelcomeSequenceImages/8.jpg',
  '/assets/images/WelcomeSequenceImages/9.jpg',
  '/assets/images/WelcomeSequenceImages/10.jpg',
  '/assets/images/WelcomeSequenceImages/11.jpg',
  '/assets/images/WelcomeSequenceImages/12.jpg',
  '/assets/images/WelcomeSequenceImages/13.jpg',
  '/assets/images/WelcomeSequenceImages/14.jpg',
  '/assets/images/WelcomeSequenceImages/15.jpg',
  '/assets/images/WelcomeSequenceImages/16.jpg',
];

// Split untuk 2 fase: 7 foto pertama, 8 foto kedua
const FALLBACK_MEDIA_1 = ALL_LOCAL_PHOTOS.slice(0, 7);
const FALLBACK_MEDIA_2 = ALL_LOCAL_PHOTOS.slice(7, 15);

// ── Timing - Disesuaikan dengan durasi audio untuk sinkronisasi sempurna ──
// Voice1 duration: ~43s, 7 photos = ~6.1s per photo
const IMAGE_DUR_1       = 6100;
// Voice2 duration: ~39s, 8 photos = ~4.9s per photo  
const IMAGE_DUR_2       = 4900;
const INTERLUDE_MS      = 5000;
const VOICE_DELAY       = 3000;
const COUNT_NUMS        = [5, 4, 3, 2, 1];
// Variasi animasi Ken Burns untuk setiap foto
const KB_CLASSES: KbClass[] = ['kb1', 'kb2', 'kb3', 'kb4', 'kb5', 'kb6'];
const LYRIC_THROTTLE_MS = 100; // Lebih responsif untuk sinkronisasi presisi

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

// Function to generate memory items from photo URLs
function generateMemoryItems(photoUrls: string[]) {
  const captions = [
    'Kelas XII', 'Masa indah', 'Bersama', 'Kenangan', 'Teman',
    'Senyuman', 'Canda tawa', 'Kebersamaan', 'Cerita kita', 'Momen',
    'Perjalanan', 'Angkatan 21', 'Selamanya', 'Tak terlupa', 'Kita',
    'Bersama', 'Selamanya', 'Nostalgia', 'Memori', 'Abadi'
  ];
  
  const animTypes = ['fallTop', 'slideLeft', 'slideRight', 'riseBottom', 'zoomIn', 'fadeFloat'];
  
  const items: any[] = [];
  
  // Add polaroids from photos
  photoUrls.forEach((url, idx) => {
    if (idx < 20) { // Max 20 polaroids
      items.push({
        type: 'polaroid',
        caption: captions[idx % captions.length],
        img: url,
        rotate: Math.random() * 30 - 15, // Random rotation -15 to 15
        animType: animTypes[idx % animTypes.length]
      });
    }
  });
  
  // Add quotes
  items.push(
    { type: 'quote', text: 'Gak nyangka kita bisa sampai sini...', animType: 'fadeFloat' },
    { type: 'quote', text: 'Terima kasih untuk semua kenangan ini', animType: 'slideLeft' },
    { type: 'quote', text: 'Sampai jumpa di lain waktu...', animType: 'slideRight' },
    { type: 'quote', text: 'Kita akan selalu ingat masa ini', animType: 'zoomIn' },
    { type: 'quote', text: 'Selamat tinggal, masa SMA', animType: 'riseBottom' }
  );
  
  // Add timestamps
  items.push(
    { type: 'timestamp', text: '2023 - 2026', animType: 'fadeFloat' },
    { type: 'timestamp', text: 'Angkatan 21', animType: 'zoomIn' },
    { type: 'timestamp', text: '16 Mei 2026', animType: 'slideLeft' },
    { type: 'timestamp', text: 'SKINFA', animType: 'slideRight' }
  );
  
  return items;
}

// ── Volume levels ──
const VOL_FULL = 0.6;  // Volume penuh untuk instrument (tidak ada ducking lagi)

interface Props { onComplete: () => void; }

// Helper function: Shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function: Get Cloudinary optimized URL
function getCloudinaryUrl(publicId: string, width = 1200): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg2kguctm';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${width},c_fill,g_auto,q_auto:good,f_auto/${publicId}`;
}

export default function WelcomeSequence({ onComplete }: Props) {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Mempersiapkan...');
  
  // Dynamic media from Cloudinary
  const [MEDIA_1, setMEDIA_1] = useState<string[]>(FALLBACK_MEDIA_1);
  const [MEDIA_2, setMEDIA_2] = useState<string[]>(FALLBACK_MEDIA_2);
  const [ALL_MEDIA, setALL_MEDIA] = useState<string[]>([...FALLBACK_MEDIA_1, ...FALLBACK_MEDIA_2]);
  const [MEMORY_ITEMS, setMEMORY_ITEMS] = useState<any[]>([]);
  
  const [phase, setPhase]       = useState<Phase>('projector');
  const [countNum, setCountNum] = useState(5);
  const [exiting, setExiting]   = useState(false);
  const [endingPhase, setEndingPhase] = useState<'silence' | 'memories' | 'freeze' | 'gold' | 'logo'>('silence');

  // Dynamic lyrics state
  const [segments1, setSegments1] = useState<Segment[]>([]);
  const [segments2, setSegments2] = useState<Segment[]>([]);

  const [slotA, setSlotA]     = useState<SlotState>({ src: FALLBACK_MEDIA_1[0], kb: 'kb1' });
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

  // Comprehensive preloading with progress tracking
  useEffect(() => {
    const preloadEverything = async () => {
      try {
        let totalSteps = 0;
        let completedSteps = 0;

        const updateProgress = (status: string) => {
          completedSteps++;
          const progress = Math.round((completedSteps / totalSteps) * 100);
          setLoadProgress(progress);
          setLoadingStatus(status);
        };

        // 0. Use local photos directly - skip Cloudinary for better performance
        setLoadingStatus('Mempersiapkan foto...');
        setMEDIA_1(FALLBACK_MEDIA_1);
        setMEDIA_2(FALLBACK_MEDIA_2);
        setALL_MEDIA(ALL_LOCAL_PHOTOS);
        setMEMORY_ITEMS(generateMemoryItems(ALL_LOCAL_PHOTOS));
        
        console.log('✅ Using local photos:', ALL_LOCAL_PHOTOS.length);

        // Calculate total steps
        totalSteps = ALL_LOCAL_PHOTOS.length + 4 + 2; // images + audio files + lyrics

        // 1. Load lyrics first
        setLoadingStatus('Memuat lirik...');
        const [res1, res2] = await Promise.all([
          fetch('/assets/lirik/lirik1.json'),
          fetch('/assets/lirik/lirik2.json')
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        setSegments1(data1.segments || []);
        setSegments2(data2.segments || []);
        updateProgress('Lirik 1 siap');
        updateProgress('Lirik 2 siap');

        // 2. Preload all images with progress - optimized loading
        setLoadingStatus('Memuat foto...');
        
        // Preload critical images first (first 3 photos for immediate display)
        const criticalImages = ALL_LOCAL_PHOTOS.slice(0, 3);
        const nonCriticalImages = ALL_LOCAL_PHOTOS.slice(3);
        
        // Load critical images first
        await Promise.all(
          criticalImages.map((src, idx) => 
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                updateProgress(`Foto ${idx + 1}/${ALL_LOCAL_PHOTOS.length}`);
                resolve();
              };
              img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                updateProgress(`Foto ${idx + 1}/${ALL_LOCAL_PHOTOS.length} (error)`);
                resolve();
              };
              // High priority for critical images
              img.fetchPriority = 'high';
              img.decoding = 'async';
              img.src = src;
            })
          )
        );
        
        // Load non-critical images in parallel
        await Promise.all(
          nonCriticalImages.map((src, idx) => 
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                updateProgress(`Foto ${idx + 4}/${ALL_LOCAL_PHOTOS.length}`);
                resolve();
              };
              img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                updateProgress(`Foto ${idx + 4}/${ALL_LOCAL_PHOTOS.length} (error)`);
                resolve();
              };
              // Lower priority for non-critical images
              img.fetchPriority = 'low';
              img.decoding = 'async';
              img.src = src;
            })
          )
        );

        // 3. Preload audio files
        setLoadingStatus('Memuat audio...');
        const audioFiles = [
          { ref: voice1Ref, src: '/assets/audio/voice1.mp3', name: 'Voice 1' },
          { ref: voice2Ref, src: '/assets/audio/voice2.mp3', name: 'Voice 2' },
          { ref: instrRef, src: '/assets/audio/instrument-full.mp3', name: 'Instrument' },
          { ref: sfxRef, src: '/assets/audio/coundown-sfx.wav', name: 'SFX' },
        ];

        await Promise.all(
          audioFiles.map(({ ref, src, name }) =>
            new Promise<void>((resolve) => {
              const audio = ref.current;
              if (!audio) {
                updateProgress(`${name} (skip)`);
                resolve();
                return;
              }
              
              audio.preload = 'auto';
              audio.src = src;
              
              const handleCanPlay = () => {
                updateProgress(`${name} siap`);
                audio.removeEventListener('canplaythrough', handleCanPlay);
                audio.removeEventListener('error', handleError);
                resolve();
              };
              
              const handleError = () => {
                updateProgress(`${name} (error)`);
                audio.removeEventListener('canplaythrough', handleCanPlay);
                audio.removeEventListener('error', handleError);
                resolve();
              };
              
              audio.addEventListener('canplaythrough', handleCanPlay);
              audio.addEventListener('error', handleError);
              audio.load();
            })
          )
        );

        // 4. Final delay to ensure everything is ready
        setLoadingStatus('Semua siap!');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 5. Prepare audio for playback (unlock audio context)
        // This ensures audio will play when projector phase starts
        try {
          const allAudio = [voice1Ref.current, voice2Ref.current, instrRef.current, sfxRef.current];
          allAudio.forEach(audio => {
            if (audio) {
              // Set volume to 0 and play briefly to unlock
              const originalVolume = audio.volume;
              audio.volume = 0;
              audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = originalVolume;
                console.log(`✅ Audio unlocked: ${audio.src}`);
              }).catch(() => {
                // Silently fail, will retry on actual play
              });
            }
          });
        } catch (e) {
          console.warn('⚠️ Audio unlock failed:', e);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Preload error:', err);
        setLoadingStatus('Error, melanjutkan...');
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    preloadEverything();
  }, []);

  // ── Smooth volume fade via rAF ──
  const fadeInstrTo = useCallback((target: number, force = false) => {
    if (!force && Math.abs(instrTargetRef.current - target) < 0.01) return;
    instrTargetRef.current = target;
    const STEP = 0.015; // Slightly faster fade untuk responsivitas
    const tick = () => {
      const instr = instrRef.current;
      if (!instr || instrTargetRef.current !== target) return; // cancelled
      const diff = target - instr.volume;
      if (Math.abs(diff) < STEP) { 
        instr.volume = Math.max(0, Math.min(1, target)); 
        return; 
      }
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
    el.style.transform = 'translateY(8px)';
  }, []);

  const showLyric = useCallback((seg: Segment) => {
    if (lyricEnRef.current) lyricEnRef.current.textContent = seg.text;
    if (lyricIdRef.current) lyricIdRef.current.textContent = seg.text_id;
    const el = lyricWrapRef.current;
    if (!el) return;
    // Smooth fade in dengan slight movement
    requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  // ── Lyric sync (tanpa voice ducking) ──
  const syncLyric = useCallback((segs: Segment[], t: number) => {
    const now = performance.now();
    if (now - lastCheckRef.current < LYRIC_THROTTLE_MS) return;
    lastCheckRef.current = now;

    let found = -1;
    for (let i = 0; i < segs.length; i++) {
      // Toleransi 50ms untuk sinkronisasi lebih presisi
      const clampedStart = Math.max(0, segs[i].start - 0.05);
      const clampedEnd = segs[i].end + 0.05;
      if (t >= clampedStart && t <= clampedEnd) { found = i; break; }
    }

    // Tidak ada ducking - musik tetap full volume

    if (found === prevSegRef.current) return;
    prevSegRef.current = found;

    if (lyricTimer.current) { clearTimeout(lyricTimer.current); lyricTimer.current = null; }
    hideLyric();
    if (found >= 0) {
      // Fade in lebih cepat untuk responsivitas
      lyricTimer.current = setTimeout(() => showLyric(segs[found]), 280);
    }
  }, [hideLyric, showLyric]);

  // ── Phase effects ──

  useEffect(() => {
    if (phase !== 'projector') return;
    
    // Wait for audio element to be ready
    const waitForAudio = () => {
      const sfx = sfxRef.current;
      if (!sfx) {
        console.warn('⚠️ SFX audio element not ready, waiting...');
        // Retry after a short delay
        setTimeout(waitForAudio, 50);
        return;
      }
      
      // Audio element is ready, play countdown sound
      sfx.currentTime = 0; 
      sfx.volume = 1;
      
      // Function to attempt playing
      const attemptPlay = (retryCount = 0) => {
        const playPromise = sfx.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Countdown SFX playing successfully');
            })
            .catch((error) => {
              console.warn(`⚠️ Countdown SFX play attempt ${retryCount + 1} failed:`, error.message);
              
              // Retry up to 3 times with increasing delays
              if (retryCount < 3) {
                const delay = (retryCount + 1) * 100; // 100ms, 200ms, 300ms
                setTimeout(() => attemptPlay(retryCount + 1), delay);
              } else {
                console.error('❌ Countdown SFX failed after 3 retries');
              }
            });
        }
      };
      
      // Start first attempt immediately
      attemptPlay();
    };
    
    // Start waiting for audio
    waitForAudio();
    
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

    // Start instrument at full volume
    const instr = instrRef.current;
    if (instr) { 
      instr.volume = VOL_FULL; 
      instr.currentTime = 0;
      instr.loop = false; // Tidak loop, play sekali saja
      instr.play().catch(() => {}); 
    }
    
    startSlideshow(MEDIA_1, IMAGE_DUR_1);

    // Start voice after delay
    const vt = setTimeout(() => {
      const v1 = voice1Ref.current;
      if (v1) { 
        v1.currentTime = 0;
        v1.volume = 1; 
        v1.play().catch(() => {}); 
      }
    }, VOICE_DELAY);

    return () => { clearTimeout(vt); stopSlideshow(); };
  }, [phase, MEDIA_1, hideLyric, startSlideshow, stopSlideshow]);

  useEffect(() => {
    if (phase !== 'interlude') return;
    prevSegRef.current = -1;
    hideLyric();
    // Musik tetap jalan dengan volume penuh, tidak ada perubahan
    const t = setTimeout(() => setPhase('playing2'), INTERLUDE_MS);
    return () => clearTimeout(t);
  }, [phase, hideLyric]);

  useEffect(() => {
    if (phase !== 'playing2') return;
    prevSegRef.current = -1;
    lastCheckRef.current = 0;
    hideLyric();
    // Musik tetap jalan dengan volume penuh
    startSlideshow(MEDIA_2, IMAGE_DUR_2);
    const v2 = voice2Ref.current;
    if (v2) { 
      v2.currentTime = 0;
      v2.volume = 1; 
      v2.play().catch(() => {}); 
    }
    return () => stopSlideshow();
  }, [phase, MEDIA_2, hideLyric, startSlideshow, stopSlideshow]);

  useEffect(() => {
    if (phase !== 'outro') return;
    hideLyric();
    stopSlideshow();

    // Musik tetap jalan dengan volume penuh sampai habis natural

    // t1 = 3.2s → quote fade IN
    const t1 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.add(styles.quoteShow);
    }, 3200);

    // t2 = 3200 + 11740 = 14940ms → quote fade OUT (musik tetap jalan)
    const t2 = setTimeout(() => {
      if (quoteRef.current) quoteRef.current.classList.remove(styles.quoteShow);
    }, 14940);

    // t3 = 14940 + 3000ms = 17940ms → masuk ending sequence (musik tetap jalan sampai habis)
    const t3 = setTimeout(() => {
      setPhase('ending');
    }, 17940);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, hideLyric, stopSlideshow]);

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

  // Show loading screen if still loading
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingLogo}>
            <h1 className={styles.loadingTitle}>SKINFAVERSE21</h1>
            <p className={styles.loadingSubtitle}>Mempersiapkan kenangan...</p>
          </div>
          
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBar}>
              <div 
                className={styles.loadingBarFill} 
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className={styles.loadingPercentage}>{loadProgress}%</div>
          </div>
          
          <p className={styles.loadingStatus}>{loadingStatus}</p>
          
          <div className={styles.loadingDots}>
            <span className={styles.dot} style={{ animationDelay: '0s' }} />
            <span className={styles.dot} style={{ animationDelay: '0.2s' }} />
            <span className={styles.dot} style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
        
        <div className={styles.loadingGrain} />
      </div>
    );
  }

  return (
    <div className={`${styles.seq} ${exiting ? styles.seqExiting : ''}`}>

      <audio ref={voice1Ref} preload="auto" src="/assets/audio/voice1.mp3"
             onTimeUpdate={handleTime1} onEnded={handleV1End} />
      <audio ref={voice2Ref} preload="auto" src="/assets/audio/voice2.mp3"
             onTimeUpdate={handleTime2} onEnded={handleV2End} />
      <audio ref={instrRef} preload="auto" src="/assets/audio/instrument-full.mp3" />
      <audio ref={sfxRef} preload="auto" src="/assets/audio/coundown-sfx.wav" />

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
            {slotA.src && (
              <img 
                src={slotA.src} 
                alt="" 
                className={styles.photoImg} 
                loading="eager" 
                decoding="async" 
                fetchPriority="high"
                style={{ contentVisibility: 'auto' }}
              />
            )}
          </div>
          <div className={`${styles.slide} ${activeSlot === 'B' ? styles.slideIn : styles.slideOut}`}>
            {slotB.src && (
              <img 
                src={slotB.src} 
                alt="" 
                className={styles.photoImg} 
                loading="eager" 
                decoding="async"
                style={{ contentVisibility: 'auto' }}
              />
            )}
          </div>

          <div className={styles.sceneOverlay} />
          <div className={styles.vign} />
          {phase === 'interlude' && <div className={styles.interludeOverlay} />}
          {phase === 'outro'     && <div className={styles.outroDimOverlay}  />}

          <div
            ref={lyricWrapRef}
            className={styles.lyricWrap}
            style={{ 
              opacity: 0, 
              transform: 'translateY(8px)', 
              transition: 'opacity 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)', 
              willChange: 'opacity, transform' 
            }}
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
