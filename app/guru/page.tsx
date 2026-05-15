'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import styles from './GuruPage.module.css';
import guruData from '@/data/data_guru.json';

gsap.registerPlugin(ScrollTrigger);

// Grouping Logic
const kepalaSekolah = guruData.find(g => g.id === 1);
const bpp = guruData.find(g => g.id === 2);
const waka = guruData.filter(g => [3, 4, 5, 9].includes(g.id));
const komp = [
  guruData.find(g => g.id === 8), // DKV
  guruData.find(g => g.id === 7), // RPL
  guruData.find(g => g.id === 6), // TKJ
].filter((t): t is NonNullable<typeof t> => t !== undefined);
const dudiSpiritual = guruData.filter(g => [10, 11].includes(g.id));
const bk = guruData.find(g => g.id === 14);
const qiroati = guruData.filter(g => [12, 26, 27, 28, 29, 30].includes(g.id));
const admin = guruData.filter(g => [31, 32].includes(g.id));
const walasDKV = guruData.filter(g => [15, 18, 9].includes(g.id));
const walasRPL = guruData.filter(g => [5, 19, 20].includes(g.id));
const walasTKJ = guruData.filter(g => [17, 16, 13].includes(g.id));
const k5 = guruData.filter(g => [33, 34, 35, 36].includes(g.id));
const satpam = guruData.find(g => g.id === 37);

const usedIds = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37
]);
const mapel = guruData.filter(g => !usedIds.has(g.id));

const TeacherImage = ({ teacher, photos, className, priority = false }: { teacher: any; photos: Record<number, string>; className?: string; priority?: boolean }) => {
  const [error, setError] = useState(false);
  const photoUrl = photos[teacher?.id];
  let src = photoUrl || (teacher ? `/images/guru/${teacher.nama_file}.jpg` : '/placeholder.svg');
  if (error) src = '/placeholder.svg';
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Image src={src} alt={teacher?.nama || 'Teacher'} fill className={className} onError={() => setError(true)} sizes="(max-width: 768px) 100vw, 50vw" priority={priority} style={{ objectFit: 'cover' }} />
    </div>
  );
};

export default function GuruPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapelWallRef = useRef<HTMLDivElement>(null);
  const [teacherPhotos, setTeacherPhotos] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const fetchAndPreload = async () => {
      try {
        const res = await fetch('/api/nostalgia?folder=SKINFAVERSE21/personal/guru');
        const data = await res.json();
        const mapping: Record<number, string> = {};
        const urls: string[] = [];
        guruData.forEach(t => {
          const idPrefix = `${t.id}_`;
          const match = data.media?.find((m: any) => m.publicId.split('/').pop()?.toLowerCase().startsWith(idPrefix));
          if (match) {
            const transformed = match.url.replace('/upload/', '/upload/w_800,h_1000,c_fill,g_auto,q_auto,f_auto/');
            mapping[t.id] = transformed;
            urls.push(transformed);
          } else {
            urls.push(`/images/guru/${t.nama_file}.jpg`);
          }
        });
        setTeacherPhotos(mapping);
        let loaded = 0;
        await Promise.all(urls.map(url => new Promise(r => {
          const img = new (window as any).Image();
          img.src = url;
          img.onload = img.onerror = () => { loaded++; setLoadProgress((loaded / urls.length) * 100); r(null); };
        })));
        setTimeout(() => setIsLoading(false), 500);
      } catch (e) { setIsLoading(false); }
    };
    fetchAndPreload();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    function raf(t: number) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    let ctx = gsap.context(() => {
      // 1. Kepala Sekolah
      const tlKS = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneKepalaSekolah}`, start: 'top top', end: '+=150%', scrub: 1, pin: true } });
      tlKS.to(`.${styles.ksName}`, { opacity: 1, y: -20, duration: 1 })
          .to(`.${styles.ksPhotoWrapper}`, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5 }, '-=0.5')
          .to(`.${styles.ksQuote}`, { opacity: 1, y: -10, duration: 1 });

      // 2. BPP
      const tlBPP = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneBPP}`, start: 'top top', end: '+=150%', scrub: 1, pin: true } });
      tlBPP.fromTo(`.${styles.bppName}`, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
           .fromTo(`.${styles.bppRole}`, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, '-=0.5')
           .fromTo(`.${styles.bppPhotoWrapper}`, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5 }, '-=1');

      // 3. Waka (Multi-card cinematic)
      const tlWaka = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneWaka}`, start: 'top top', end: '+=200%', scrub: 1, pin: true } });
      const wakaCards = gsap.utils.toArray(`.${styles.wakaCard}`) as HTMLElement[];
      tlWaka.fromTo(wakaCards, 
        { opacity: 0, y: (i) => i === 0 ? -100 : i === 1 ? 100 : -100, x: (i) => i === 1 ? -100 : 100, filter: 'blur(10px)' },
        { opacity: 1, y: 0, x: 0, filter: 'blur(0px)', stagger: 0.5, duration: 2 }
      );

      // 4. Kepala Program (Horizontal cinematic)
      const tlKomp = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneKomp}`, start: 'top top', end: '+=300%', scrub: 1, pin: true } });
      tlKomp.to(`.${styles.kompHorizontal}`, { x: '-200vw', ease: 'none' });

      // 5. DuDi & Spiritual (Calm fade)
      const tlFormal = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneFormal}`, start: 'top 60%', end: 'bottom 40%', scrub: 1 } });
      tlFormal.fromTo(`.${styles.formalCard}`, { opacity: 0, filter: 'blur(5px)' }, { opacity: 1, filter: 'blur(0px)', stagger: 0.3, duration: 1 });

      // 6. BK (Emotional blur to focus)
      const tlBK = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneBK}`, start: 'top top', end: '+=150%', scrub: 1, pin: true } });
      tlBK.to(`.${styles.bkBgBlur}`, { filter: 'blur(0px)', opacity: 0.5, duration: 2 })
          .to(`.${styles.bkPhotoWrapper}`, { opacity: 1, filter: 'blur(0px)', scale: 1.05, duration: 2 }, '<')
          .to(`.${styles.bkKeyword}`, { opacity: 1, y: -20, stagger: 0.5, duration: 1 }, '-=1');

      // 7. Qiroati (Forming from bottom)
      const tlQiroati = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneQiroati}`, start: 'top 70%', end: 'bottom 30%', scrub: 1 } });
      tlQiroati.fromTo(`.${styles.qiroatiCard}`, { opacity: 0, scale: 0.8, y: 100 }, { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 1.5 });

      // 8. Admin (Structural glassmorphism)
      const tlAdmin = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneAdmin}`, start: 'top 70%', end: 'bottom 30%', scrub: 1 } });
      tlAdmin.to(`.${styles.glassCard}`, { opacity: 1, y: 0, stagger: 0.2, duration: 1 });

      // 9. Wali Kelas (DKV, RPL, TKJ)
      const walasScenes = gsap.utils.toArray(`.${styles.walasSection}`) as HTMLElement[];
      walasScenes.forEach((scene) => {
        const title = scene.querySelector(`.${styles.walasTitle}`);
        const cards = scene.querySelectorAll(`.${styles.wakaCard}`);
        const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 60%', end: 'bottom 40%', scrub: 1 } });
        tl.fromTo(title, { opacity: 0, letterSpacing: '10px' }, { opacity: 1, letterSpacing: '5px', duration: 1 })
          .fromTo(cards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, '-=0.5');
      });

      // 10. Mapel Wall (Scroll to grid)
      const tlMapel = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneMapel}`, start: 'top top', end: '+=100%', scrub: 1, pin: true } });
      tlMapel.fromTo(`.${styles.mapelHeroText}`, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 })
             .to(`.${styles.mapelWall}`, { y: '-100vh', duration: 2 });
      
      const tlMapelGrid = gsap.timeline({ scrollTrigger: { trigger: mapelWallRef.current, start: 'top 80%', end: 'bottom 20%', scrub: 1 } });
      tlMapelGrid.to(`.${styles.mapelItem}`, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 1 });

      // 11. K5 (Earthy)
      const tlK5 = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneK5}`, start: 'top 70%', end: 'bottom 30%', scrub: 1 } });
      tlK5.fromTo(`.${styles.k5Card}`, { opacity: 0, rotationY: 90 }, { opacity: 1, rotationY: 0, stagger: 0.2, duration: 1 });

      // 12. Satpam & Ending
      const tlEnding = gsap.timeline({ scrollTrigger: { trigger: `.${styles.sceneSatpam}`, start: 'top top', end: '+=200%', scrub: 1, pin: true } });
      tlEnding.fromTo(`.${styles.satpamContent}`, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 2 })
              .to(`.${styles.satpamContent}`, { opacity: 0, scale: 0.8, filter: 'blur(10px)', duration: 1 })
              .to(`.${styles.mosaicEnding}`, { opacity: 1, duration: 1 })
              .to(`.${styles.closingOverlay}`, { opacity: 1, duration: 1 });

      ScrollTrigger.refresh();
    }, containerRef);
    return () => { ctx.revert(); lenis.destroy(); };
  }, [isLoading]);

  if (isLoading) return <div className={styles.loaderContainer}><h2 className={styles.loaderTitle}>SKINFAVERSE GURU</h2><div className={styles.loaderBar}><div className={styles.loaderProgress} style={{ width: `${loadProgress}%` }} /></div></div>;

  return (
    <div ref={containerRef} className={styles.container}>
      <Link href="/" className={styles.backNav}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Kembali
      </Link>

      {/* 1. Kepala Sekolah */}
      <section className={`${styles.section} ${styles.sceneKepalaSekolah}`}>
        <div className={styles.grainOverlay} />
        <div className={styles.warmGlow} />
        {kepalaSekolah && (
          <div className={styles.ksContent}>
            <h1 className={styles.ksName}>{kepalaSekolah.nama}</h1>
            <div className={styles.ksPhotoWrapper} style={{ transform: 'scale(1.1)', filter: 'blur(20px)' }}>
              <TeacherImage teacher={kepalaSekolah} photos={teacherPhotos} priority />
            </div>
            <p className={styles.ksQuote}>“Satu arah. Satu tujuan. Satu keluarga.”</p>
          </div>
        )}
      </section>

      {/* 2. BPP */}
      <section className={`${styles.section} ${styles.sceneBPP}`}>
        <div className={styles.paperGrid} />
        <div className={styles.floatingLight} />
        <div className={styles.bppSplit}>
          <div className={styles.bppLeft}>
            <h2 className={styles.bppName}>{bpp?.nama}</h2>
            <p className={styles.bppRole}>{bpp?.peran[0]}</p>
          </div>
          <div className={styles.bppRight}>
            <div className={styles.bppPhotoWrapper}>
              {bpp && <TeacherImage teacher={bpp} photos={teacherPhotos} />}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waka */}
      <section className={`${styles.section} ${styles.sceneWaka}`}>
        <div className={styles.abstractLines} />
        <div className={styles.wakaContainer}>
          {waka.map(t => (
            <div key={`waka-${t.id}`} className={styles.wakaCard}>
              <div className={styles.wakaPhotoWrapper}>
                <TeacherImage teacher={t} photos={teacherPhotos} />
              </div>
              <h3 className={styles.wakaName}>{t.nama}</h3>
              <p className={styles.wakaRole}>{t.peran[0]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Kepala Program */}
      <section className={`${styles.section} ${styles.sceneKomp}`}>
        <div className={styles.kompHorizontal}>
          {komp.map((t, i) => (
            <div key={t.id} className={`${styles.kompSection} ${i === 0 ? styles.kompAccentDKV : i === 1 ? styles.kompAccentRPL : styles.kompAccentTKJ}`}>
              <div className={styles.kompPillar}>PILAR</div>
              <div className={styles.kompContent}>
                <div className={styles.kompPhotoWrapper}>
                  <TeacherImage teacher={t} photos={teacherPhotos} />
                </div>
                <h2 className={styles.ksName} style={{ opacity: 1 }}>{t.nama}</h2>
                <p className={styles.ksQuote} style={{ opacity: 1 }}>{t.peran[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DuDi & Spiritual */}
      <section className={`${styles.section} ${styles.sceneFormal}`}>
        <div className={styles.formalGlow} />
        <div className={styles.particles} />
        <div className={styles.formalContainer}>
          {dudiSpiritual.map(t => (
            <div key={t.id} className={styles.formalCard}>
               <div className={styles.formalPhotoWrapper}>
                <TeacherImage teacher={t} photos={teacherPhotos} />
               </div>
               <h4 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '5px' }}>{t.nama}</h4>
               <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{t.peran[0]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BK */}
      <section className={`${styles.section} ${styles.sceneBK}`}>
        <div className={styles.bkBgBlur} />
        <div className={styles.bkKeyword} style={{ top: '15%', left: '10%' }}>didengar</div>
        <div className={styles.bkKeyword} style={{ bottom: '15%', right: '10%' }}>dibimbing</div>
        <div className={styles.bkKeyword} style={{ top: '40%', right: '15%' }}>dipahami</div>
        <div className={styles.ksContent}>
          <div className={styles.bkPhotoWrapper}>
            {bk && <TeacherImage teacher={bk} photos={teacherPhotos} />}
          </div>
          <h2 style={{ marginTop: '2rem', fontSize: '2rem', fontFamily: "'Cormorant Garamond', serif" }}>{bk?.nama}</h2>
        </div>
      </section>

      {/* 7. Qiroati */}
      <section className={`${styles.section} ${styles.sceneQiroati}`}>
        <div className={styles.qiroatiGrid}>
          {qiroati.map(t => (
            <div key={t.id} className={styles.qiroatiCard}>
               <div className={styles.qiroatiPhotoWrapper}>
                <TeacherImage teacher={t} photos={teacherPhotos} />
               </div>
               <h4>{t.nama}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Admin */}
      <section className={`${styles.section} ${styles.sceneAdmin}`}>
        <div className={styles.adminGridBg} />
        <div className={styles.adminContainer}>
          {admin.map(t => (
            <div key={t.id} className={styles.glassCard}>
              <div className={styles.adminPhotoWrapper}>
                <TeacherImage teacher={t} photos={teacherPhotos} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{t.nama}</h3>
                <p style={{ color: '#666' }}>{t.peran[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Wali Kelas DKV */}
      <section className={`${styles.walasSection} ${styles.walasBgDKV}`}>
         <h2 className={styles.walasTitle}>WALI KELAS DKV</h2>
         <div className={styles.walasGrid}>
           {walasDKV.map(t => (
             <div key={`walas-${t.id}`} className={styles.wakaCard}>
                <div className={styles.wakaPhotoWrapper} style={{ boxShadow: '0 20px 40px rgba(197, 166, 124, 0.2)' }}>
                  <TeacherImage teacher={t} photos={teacherPhotos} />
                </div>
                <h3 className={styles.wakaName}>{t.nama}</h3>
                <p className={styles.wakaRole}>{t.peran.find(p => p.includes('Wali Kelas'))}</p>
             </div>
           ))}
         </div>
      </section>

      {/* 9. Wali Kelas RPL */}
      <section className={`${styles.walasSection} ${styles.walasBgRPL}`}>
         <h2 className={styles.walasTitle}>WALI KELAS RPL</h2>
         <div className={styles.walasGrid}>
           {walasRPL.map(t => (
             <div key={`walas-${t.id}`} className={styles.wakaCard}>
                <div className={styles.wakaPhotoWrapper} style={{ boxShadow: '0 20px 40px rgba(100, 150, 255, 0.2)' }}>
                  <TeacherImage teacher={t} photos={teacherPhotos} />
                </div>
                <h3 className={styles.wakaName}>{t.nama}</h3>
                <p className={styles.wakaRole}>{t.peran.find(p => p.includes('Wali Kelas'))}</p>
             </div>
           ))}
         </div>
      </section>

      {/* 9. Wali Kelas TKJ */}
      <section className={`${styles.walasSection} ${styles.walasBgTKJ}`}>
         <h2 className={styles.walasTitle}>WALI KELAS TKJ</h2>
         <div className={styles.walasGrid}>
           {walasTKJ.map(t => (
             <div key={`walas-${t.id}`} className={styles.wakaCard}>
                <div className={styles.wakaPhotoWrapper} style={{ boxShadow: '0 20px 40px rgba(200, 100, 50, 0.2)' }}>
                  <TeacherImage teacher={t} photos={teacherPhotos} />
                </div>
                <h3 className={styles.wakaName}>{t.nama}</h3>
                <p className={styles.wakaRole}>{t.peran.find(p => p.includes('Wali Kelas'))}</p>
             </div>
           ))}
         </div>
      </section>

      {/* 10. Mapel Wall */}
      <section className={`${styles.section} ${styles.sceneMapel}`}>
        <div className={styles.mapelHero}>
          <h2 className={styles.mapelHeroText}>GURU MATA PELAJARAN</h2>
        </div>
        <div className={styles.mapelWall} ref={mapelWallRef}>
          {mapel.map(t => (
            <div key={t.id} className={styles.mapelItem}>
              <TeacherImage teacher={t} photos={teacherPhotos} />
              <div className={styles.mentorOverlay}>
                <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>{t.nama}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. K5 */}
      <section className={`${styles.section} ${styles.sceneK5}`}>
        <div className={styles.earthyGlow} />
        <div className={styles.k5Grid}>
          {k5.map(t => (
            <div key={t.id} className={styles.k5Card}>
               <div className={styles.k5PhotoWrapper}>
                <TeacherImage teacher={t} photos={teacherPhotos} />
               </div>
               <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.nama}</p>
               <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>{t.peran[0]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Satpam & Ending */}
      <section className={`${styles.section} ${styles.sceneSatpam}`}>
        <div className={styles.satpamContainer}>
          <div className={styles.satpamContent}>
             <div className={styles.ksPhotoWrapper} style={{ opacity: 1, filter: 'none', transform: 'none', width: '300px' }}>
              {satpam && <TeacherImage teacher={satpam} photos={teacherPhotos} />}
             </div>
             <h2 style={{ fontSize: '3rem', margin: '20px 0' }}>{satpam?.nama}</h2>
             <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>“Mereka yang menjaga cerita ini tetap aman.”</p>
          </div>
        </div>
        
        <div className={styles.mosaicEnding}>
           {guruData.map(t => <img key={`mosaic-${t.id}`} src={teacherPhotos[t.id] || `/images/guru/${t.nama_file}.jpg`} className={styles.mosaicPhoto} />)}
        </div>
        
        <div className={styles.closingOverlay}>
          <h1 className={styles.endingText}>Terima kasih sudah menjadi bagian dari perjalanan kami.</h1>
        </div>
      </section>
    </div>
  );
}
