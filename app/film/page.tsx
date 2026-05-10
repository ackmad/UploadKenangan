'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';

const CAST = [
  { role: 'Sutradara', name: 'Tim Produksi DKV', emoji: '🎬', bg: '#FF9B9B' },
  { role: 'Penulis', name: 'Tim RPL & DKV', emoji: '✍️', bg: '#FFD166' },
  { role: 'Kamera', name: 'Tim DKV', emoji: '🎥', bg: '#A8E6CF' },
  { role: 'Editor', name: 'Tim RPL', emoji: '🖥️', bg: '#89C4E1' },
  { role: 'Musik', name: 'Tim Musikalisasi', emoji: '🎵', bg: '#C3B1E1' },
  { role: 'Talent', name: 'Angkatan 21', emoji: '🌟', bg: '#FFCBA4' },
];

const BTS = [
  { img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400&h=250', title: 'Day 1: Awal Mula' },
  { img: 'https://images.unsplash.com/photo-1527011045974-45b958fb44d3?auto=format&fit=crop&q=80&w=400&h=250', title: 'Insiden Mic Mati' },
  { img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400&h=250', title: 'Editing Sampai Pagi' },
  { img: 'https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?auto=format&fit=crop&q=80&w=400&h=250', title: 'Wrap Up!' },
];

export default function FilmPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        {/* NETFLIX-STYLE HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroGradient} />
            <div className={styles.heroVignette} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.netflixBadge}>
              <span className={styles.nIcon}>N</span>
              <span className={styles.nText}>SKINFA ORIGINAL</span>
            </div>

            <h1 className={styles.filmTitle}>3 TAHUN<br/>1 CERITA</h1>
            
            <div className={styles.metaData}>
              <span className={styles.match}>98% Match</span>
              <span className={styles.year}>2026</span>
              <span className={styles.age}>15+</span>
              <span className={styles.duration}>1h 45m</span>
              <span className={styles.hd}>HD</span>
            </div>

            <p className={styles.synopsis}>
              Tiga tahun di SKINFA bukan hanya tentang belajar. Di balik seragam putih abu-abu, tersimpan ribuan cerita — persahabatan, tugas deadline, cinta monyet, hingga perpisahan yang datang terlalu cepat. Ini adalah arsip perjalanan Angkatan 21.
            </p>

            <div className={styles.heroActions}>
              <button 
                className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <span className={styles.btnIcon}>{isPlaying ? '⏸' : '▶'}</span>
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button className={styles.infoBtn}>
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
          <h2 className={styles.rowTitle}>Top Cast</h2>
          <div className={styles.rowScroller}>
            <div className={styles.castRow}>
              {CAST.map((member, i) => (
                <div key={i} className={styles.castCard} style={{ '--bg': member.bg } as React.CSSProperties}>
                  <div className={styles.castTape} />
                  <div className={styles.castImage}>{member.emoji}</div>
                  <div className={styles.castInfo}>
                    <p className={styles.castName}>{member.name}</p>
                    <p className={styles.castRole}>{member.role}</p>
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
              {BTS.map((item, i) => (
                <div key={i} className={styles.btsCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.title} className={styles.btsImg} loading="lazy" />
                  <div className={styles.btsOverlay}>
                    <span className={styles.playIconSm}>▶</span>
                  </div>
                  <p className={styles.btsTitle}>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.rowSection} style={{ paddingBottom: '80px' }}>
          <h2 className={styles.rowTitle}>Soundtrack</h2>
          <div className={styles.rowScroller}>
            <div className={styles.castRow}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className={styles.ostCard}>
                  <div className={styles.ostDisc}>💿</div>
                  <div className={styles.ostInfo}>
                    <p className={styles.ostTitle}>Track {i}</p>
                    <p className={styles.ostArtist}>Angkatan 21</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
