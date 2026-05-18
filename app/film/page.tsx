'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import FilmPlayer from '@/components/ui/FilmPlayer';
import filmData from '@/data/film.json';

const CAST_COLORS = ['#FF9B9B', '#FFD166', '#A8E6CF'];

export default function FilmPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [btsVideos, setBtsVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/film/bts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBtsVideos(data.videos);
        }
      })
      .catch(console.error);
  }, []);

  const handlePlayClick = async () => {
    try {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        await (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }

      // Lock orientation to landscape
      if (screen.orientation && (screen.orientation as any).lock) {
        try {
          await (screen.orientation as any).lock('landscape');
        } catch (err) {
          console.log('Orientation lock not supported:', err);
        }
      }
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }

    // Open the player
    setIsPlaying(true);
  };

  const titleParts = filmData.title.split(' ');
  const firstHalf = titleParts.slice(0, 2).join(' ');
  const secondHalf = titleParts.slice(2).join(' ');

  return (
    <>
      <ScrapbookNav />
      
      {/* Film Player Modal */}
      {isPlaying && (
        <FilmPlayer onClose={() => setIsPlaying(false)} />
      )}
      
      <main className={styles.main}>
        {/* NETFLIX-STYLE HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroGradient} />
            <div className={styles.heroVignette} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.netflixBadge}>
              <span className={styles.nIcon}>V</span>
              <span className={styles.nText}>{filmData.production.toUpperCase()} ORIGINAL</span>
            </div>

            <h1 className={styles.filmTitle}>
              {firstHalf}<br/>{secondHalf}
            </h1>
            
            <div className={styles.metaData}>
              <span className={styles.match}>98% Match</span>
              <span className={styles.year}>2026</span>
              <span className={styles.age}>15+</span>
              <span className={styles.duration}>1h 45m</span>
              <span className={styles.hd}>HD</span>
            </div>

            <p className={styles.synopsis}>
              Tiga tahun di SKINFA bukan hanya tentang belajar. Di balik seragam putih abu-abu, tersimpan ribuan cerita — persahabatan, tugas deadline, hingga perpisahan yang datang terlalu cepat. Ini adalah arsip perjalanan Angkatan 21.
            </p>

            <div className={styles.heroActions}>
              <button 
                className={`${styles.playBtn}`}
                onClick={handlePlayClick}
              >
                <span className={styles.btnIcon}>▶</span>
                <span>Play</span>
              </button>
              <button className={styles.infoBtn} onClick={() => setIsInfoModalOpen(true)}>
                <span className={styles.btnIcon}>ℹ️</span>
                <span>More Info</span>
              </button>
            </div>

            <p className={styles.genres}>
              <span className={styles.genreLabel}>Genres:</span> Nostalgia, Persahabatan, Sekolah, Komedi
            </p>
          </div>
        </section>

        {/* CAROUSEL ROWS */}
        <section className={styles.rowSection}>
          <h2 className={styles.rowTitle}>Lead Cast</h2>
          <div className={styles.rowScroller}>
            <div className={styles.castRow}>
              {filmData.leadCast.map((member, i) => (
                <div key={i} className={styles.castCard} style={{ '--bg': CAST_COLORS[i % CAST_COLORS.length] } as React.CSSProperties}>
                  <div className={styles.castTape} />
                  <div className={styles.castImage}>👤</div>
                  <div className={styles.castInfo}>
                    <p className={styles.castName}>{member.name}</p>
                    <p className={styles.castRole}>{member.class}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.rowSection}>
          <h2 className={styles.rowTitle}>Behind The Scenes</h2>
          <div className={styles.rowScroller}>
            <div className={styles.btsRow}>
              {btsVideos.length > 0 ? (
                btsVideos.map((item, i) => (
                  <div key={i} className={styles.btsCard} onClick={() => setSelectedVideo(item)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.posterUrl} alt={item.title} className={styles.btsImg} loading="lazy" />
                    <div className={styles.btsOverlay}>
                      <span className={styles.playIconSm}>▶</span>
                    </div>
                    <p className={styles.btsTitle}>{item.title}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.5)', padding: '0 20px' }}>
                  Memuat video Behind the Scenes...
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.rowSection}>
          <h2 className={styles.rowTitle}>Production Team</h2>
          <div className={styles.rowScroller}>
            <div className={styles.teamGrid}>
              <div className={styles.teamColumn}>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Sutradara</span>
                  <span className={styles.teamName}>{filmData.productionTeam.sutradara}</span>
                </div>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Astrada</span>
                  <span className={styles.teamName}>{filmData.productionTeam.astrada}</span>
                </div>
              </div>
              <div className={styles.teamColumn}>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Penulis Naskah</span>
                  <span className={styles.teamNames}>{filmData.productionTeam.penulisNaskah.join(', ')}</span>
                </div>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Unit Kamera</span>
                  <span className={styles.teamNames}>{filmData.productionTeam.unitKamera.join(', ')}</span>
                </div>
              </div>
              <div className={styles.teamColumn}>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Editing</span>
                  <span className={styles.teamNames}>{filmData.productionTeam.unitEditing.join(', ')}</span>
                </div>
                <div className={styles.teamItem}>
                  <span className={styles.teamRole}>Post-Produksi</span>
                  <span className={styles.teamNames}>{filmData.productionTeam.unitPostProduksi.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.rowSection} style={{ paddingBottom: '80px' }}>
          <h2 className={styles.rowTitle}>Soundtrack & Info</h2>
          <div className={styles.infoFooter}>
            <div className={styles.infoCard}>
              <h3>📍 Location</h3>
              <p>{filmData.location}</p>
            </div>
            <div className={styles.infoCard}>
              <h3>🎵 Music & License</h3>
              <a href={filmData.musicLicense} target="_blank" rel="noopener noreferrer" className={styles.licenseLink}>
                View Licenses & Soundtrack
              </a>
            </div>
          </div>
        </section>

        {/* Video Modal */}
        {selectedVideo && (
          <div className={styles.videoModalOverlay} onClick={() => setSelectedVideo(null)}>
            <div className={styles.videoModalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeVideoBtn} onClick={() => setSelectedVideo(null)}>✕</button>
              <video 
                src={selectedVideo.url} 
                className={styles.modalVideoPlayer} 
                controls 
                autoPlay
              />
              <h3 className={styles.modalVideoTitle}>{selectedVideo.title}</h3>
            </div>
          </div>
        )}

        {/* Netflix-style More Info Modal */}
        {isInfoModalOpen && (
          <div className={styles.videoModalOverlay} onClick={() => setIsInfoModalOpen(false)}>
            <div className={styles.infoModalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeVideoBtn} onClick={() => setIsInfoModalOpen(false)}>✕</button>
              
              <div className={styles.infoModalHero}>
                <div className={styles.infoModalHeroBg} />
                <div className={styles.infoModalHeroGradient} />
                <div className={styles.infoModalTitleWrapper}>
                  <h2 className={styles.infoModalTitle}>{filmData.title}</h2>
                  <div className={styles.infoModalActions}>
                    <button className={styles.playBtnModal} onClick={() => { setIsInfoModalOpen(false); handlePlayClick(); }}>
                      <span className={styles.btnIcon}>▶</span> Play
                    </button>
                    <button className={styles.circleBtn}>+</button>
                    <button className={styles.circleBtn}>👍</button>
                  </div>
                </div>
              </div>

              <div className={styles.infoModalBody}>
                <div className={styles.infoModalLeft}>
                  <div className={styles.metaData} style={{ marginBottom: '20px' }}>
                    <span className={styles.match}>98% Match</span>
                    <span className={styles.year}>2026</span>
                    <span className={styles.age}>15+</span>
                    <span className={styles.duration}>1h 45m</span>
                    <span className={styles.hd}>HD</span>
                  </div>
                  <p className={styles.infoModalSynopsis}>
                    Tiga tahun di SKINFA bukan hanya tentang belajar. Di balik seragam putih abu-abu, tersimpan ribuan cerita — persahabatan, tugas deadline, hingga perpisahan yang datang terlalu cepat. Ini adalah arsip perjalanan Angkatan 21. Sebuah mahakarya bersama untuk mengenang masa-masa yang tidak akan pernah kembali.
                  </p>
                </div>
                <div className={styles.infoModalRight}>
                  <div className={styles.infoModalMetaRow}>
                    <span className={styles.infoModalMetaLabel}>Cast:</span>
                    <span className={styles.infoModalMetaText}>{filmData.leadCast.map(c => c.name).join(', ')}, and more</span>
                  </div>
                  <div className={styles.infoModalMetaRow}>
                    <span className={styles.infoModalMetaLabel}>Genres:</span>
                    <span className={styles.infoModalMetaText}>Nostalgia, Persahabatan, Sekolah, Komedi</span>
                  </div>
                  <div className={styles.infoModalMetaRow}>
                    <span className={styles.infoModalMetaLabel}>Sutradara:</span>
                    <span className={styles.infoModalMetaText}>{filmData.productionTeam.sutradara}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
