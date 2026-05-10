'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const CAST = [
  { role: 'Sutradara', name: 'Tim Produksi DKV', emoji: '🎬', color: '#FF9B9B' },
  { role: 'Penulis Cerita', name: 'Tim RPL & DKV', emoji: '✍️', color: '#FFD166' },
  { role: 'Videographer', name: 'Tim DKV', emoji: '🎥', color: '#A8E6CF' },
  { role: 'Editor Video', name: 'Tim RPL', emoji: '🖥️', color: '#89C4E1' },
  { role: 'Soundtrack', name: 'Tim Musikalisasi', emoji: '🎵', color: '#C3B1E1' },
  { role: 'Behind The Scene', name: 'Seluruh Angkatan 21', emoji: '📸', color: '#FFCBA4' },
];

const SOUNDTRACK = [
  { no: 1, title: 'Lagu Pembuka', artist: 'Playlist Angkatan 21', duration: '3:45', emoji: '🎵' },
  { no: 2, title: 'Scene PKL', artist: 'Soundtrack Perjalanan', duration: '4:12', emoji: '💼' },
  { no: 3, title: 'Kenangan Kelas', artist: 'Memory Acoustic', duration: '3:28', emoji: '🏫' },
  { no: 4, title: 'Study Tour Vibes', artist: 'Road Trip Mix', duration: '3:55', emoji: '🚌' },
  { no: 5, title: 'Graduation Theme', artist: 'Angkatan 21 Orchestra', duration: '5:20', emoji: '🎓' },
];

const BTS = [
  { emoji: '🎬', caption: 'Syuting jam 6 pagi sebelum sekolah dimulai', chaos: true },
  { emoji: '😂', caption: 'Kru lebih banyak dari pemain utama' },
  { emoji: '🎭', caption: 'Improvisasi dialog yang jadi adegan terbaik', chaos: true },
  { emoji: '📱', caption: 'Rekaman ulang 10x karena ada yang ketawa terus' },
  { emoji: '🌙', caption: 'Editing semalam suntuk H-1 deadline' },
  { emoji: '🎤', caption: 'Mic mati pas adegan paling emosional 😭', chaos: true },
];

const FUN_FACTS = [
  'Total jam syuting lebih dari 72 jam',
  'Adegan yang paling banyak di-take ulang: adegan perpisahan (17 kali)',
  'Semua aktor adalah siswa Angkatan 21 sendiri',
  'Lokasi syuting: dalam dan luar sekolah, jalanan Cirebon, hingga tempat PKL',
  'Soundtrack dipilih voting dari seluruh angkatan',
  'Film ini dikerjakan di sela-sela belajar dan PKL',
];

export default function FilmPage() {
  const [activeTab, setActiveTab] = useState<'synopsis' | 'cast' | 'bts' | 'soundtrack'>('synopsis');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* ── CINEMATIC HERO ── */}
        <header className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroGrain} />
            <div className={styles.heroOverlay} />

            {/* Film strip top */}
            <div className={styles.filmStrip}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={styles.filmHole} />
              ))}
            </div>

            <div className={styles.heroCenterContent}>
              <div className={styles.filmBadge}>🎬 SKINFA ANGKATAN 21 PRESENTS</div>
              <h1 className={styles.filmTitle}>SKINFAVERSE</h1>
              <p className={styles.filmSubtitle}>21</p>
              <p className={styles.tagline}>
                &quot;Some Stories Deserve To Be Remembered Forever.&quot;
              </p>
              <p className={styles.taglineSub}>
                Sebuah film tentang perjalanan, tawa, kehilangan,<br />
                dan cerita anak-anak SKINFA Angkatan 21.
              </p>

              {/* Play Button */}
              <button
                className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <span className={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</span>
                <span>{isPlaying ? 'Pause Trailer' : 'Watch Trailer'}</span>
              </button>
            </div>

            {/* Film strip bottom */}
            <div className={styles.filmStrip}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={styles.filmHole} />
              ))}
            </div>
          </div>

          {/* Hero CTA Row */}
          <div className={styles.heroCta}>
            <div className={styles.ctaBadge}>
              <span className={styles.ctaEmoji}>🎬</span>
              <div>
                <p className={styles.ctaLabel}>Film Angkatan</p>
                <p className={styles.ctaValue}>SKINFAVERSE21</p>
              </div>
            </div>
            <div className={styles.ctaBadge}>
              <span className={styles.ctaEmoji}>📅</span>
              <div>
                <p className={styles.ctaLabel}>Tahun Produksi</p>
                <p className={styles.ctaValue}>2025 — 2026</p>
              </div>
            </div>
            <div className={styles.ctaBadge}>
              <span className={styles.ctaEmoji}>👥</span>
              <div>
                <p className={styles.ctaLabel}>Dibuat Oleh</p>
                <p className={styles.ctaValue}>Angkatan 21 SKINFA</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── ACTION BUTTONS ── */}
        <div className={styles.actionRow}>
          <button className="btn btn-coral btn-lg">
            🎬 Watch Trailer
          </button>
          <button className="btn btn-black btn-lg">
            🎥 Full Movie
          </button>
          <button className="btn btn-yellow btn-lg">
            📸 Behind The Scene
          </button>
        </div>

        {/* ── TABS ── */}
        <div className={styles.tabs}>
          {(['synopsis', 'cast', 'bts', 'soundtrack'] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {{ synopsis: '📋 Sinopsis', cast: '🎭 Cast', bts: '🎬 BTS', soundtrack: '🎵 Soundtrack' }[tab]}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div className={styles.tabContent}>

          {/* SYNOPSIS */}
          {activeTab === 'synopsis' && (
            <div className={styles.synopsisWrap}>
              <div className={styles.synopsisPaper}>
                <div className={styles.paperTape} />
                <h2 className={styles.synopsisTitle}>📖 Sinopsis</h2>
                <p className={styles.synopsisText}>
                  Tiga tahun di SKINFA bukan hanya tentang belajar.
                  Di balik seragam putih abu-abu, tersimpan ribuan cerita — tentang persahabatan yang tidak direncanakan,
                  tentang PKL yang mengubah cara pandang, tentang classmeet yang penuh drama,
                  dan tentang hari-hari terakhir yang datang terlalu cepat.
                </p>
                <p className={styles.synopsisText}>
                  Film ini adalah arsip perjalanan Angkatan 21.
                  Bukan yang sempurna — tapi yang paling jujur.
                  Karena yang paling berharga bukan hanya momennya,
                  tapi perasaan yang tersisa setelah momen itu berlalu.
                </p>
                <p className={styles.synopsisQuote}>
                  &quot;Karena masa sekolah bukan cuma tentang belajar.&quot;
                </p>
              </div>

              {/* Fun Facts */}
              <div className={styles.factsSection}>
                <h3 className={styles.factsTitle}>🎯 Fun Facts Produksi</h3>
                <div className={styles.factsGrid}>
                  {FUN_FACTS.map((fact, i) => (
                    <div key={i} className={styles.factCard} style={{ animationDelay: `${i * 0.1}s` }}>
                      <span className={styles.factNum}>{String(i + 1).padStart(2, '0')}</span>
                      <p className={styles.factText}>{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CAST */}
          {activeTab === 'cast' && (
            <div className={styles.castGrid}>
              {CAST.map((member, i) => (
                <div
                  key={i}
                  className={styles.castCard}
                  style={{
                    '--cast-color': member.color,
                    transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i % 3 + 1)}deg)`
                  } as React.CSSProperties}
                >
                  <div className={styles.castTape} />
                  <div className={styles.castEmoji} style={{ background: member.color }}>
                    {member.emoji}
                  </div>
                  <div className={styles.castInfo}>
                    <p className={styles.castRole}>{member.role}</p>
                    <h3 className={styles.castName}>{member.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BTS */}
          {activeTab === 'bts' && (
            <div className={styles.btsSection}>
              <p className={styles.btsCopy}>
                &quot;Kadang yang paling dirindukan justru hal-hal kecil di balik layar.&quot;
              </p>
              <div className={styles.btsGrid}>
                {BTS.map((item, i) => (
                  <div
                    key={i}
                    className={`${styles.btsCard} ${item.chaos ? styles.btsCardChaos : ''}`}
                    style={{
                      transform: `rotate(${(i % 2 === 0 ? 1.5 : -1.5) * (i % 3 + 0.5)}deg)`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  >
                    <div className={styles.btsTape} />
                    <div className={styles.btsEmoji}>{item.emoji}</div>
                    <p className={styles.btsCaption}>{item.caption}</p>
                    {item.chaos && <span className={styles.chaosTag}>🔥 Chaos Moment</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOUNDTRACK */}
          {activeTab === 'soundtrack' && (
            <div className={styles.soundtrackSection}>
              <div className={styles.playerHeader}>
                <div className={styles.playerLabel}>🎵 Playlist Film Angkatan 21</div>
                <p className={styles.playerDesc}>Lagu-lagu yang jadi soundtrack perjalanan Angkatan 21</p>
              </div>
              <div className={styles.trackList}>
                {SOUNDTRACK.map(track => (
                  <div key={track.no} className={styles.trackItem}>
                    <span className={styles.trackNo}>{String(track.no).padStart(2, '0')}</span>
                    <span className={styles.trackEmoji}>{track.emoji}</span>
                    <div className={styles.trackInfo}>
                      <p className={styles.trackTitle}>{track.title}</p>
                      <p className={styles.trackArtist}>{track.artist}</p>
                    </div>
                    <span className={styles.trackDuration}>{track.duration}</span>
                    <button className={styles.trackPlay}>▶</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── CLOSING QUOTE ── */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p className={styles.closingText}>
            &quot;Filmnya mungkin selesai… tapi ceritanya nggak pernah benar-benar berakhir.&quot;
          </p>
          <span className={styles.closingAuthor}>— Angkatan 21, SKINFA 2026</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
