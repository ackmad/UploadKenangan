'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import content from '@/data/content.json';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

// Build a pool of all memories
const MEMORY_POOL = [
  // Quotes
  ...content.quotes.list.map(q => ({
    type: 'quote' as const,
    emoji: '💬',
    title: 'Quote Nostalgia',
    content: q.text,
    sub: `— ${q.author}`,
    category: q.category,
    color: q.color,
  })),
  // Confessions
  ...content.confessions.initialNotes.map(n => ({
    type: 'confession' as const,
    emoji: '📌',
    title: 'Confession Anonim',
    content: n.text,
    sub: `— ${n.author}`,
    category: 'Confession',
    color: n.color,
  })),
  // Events
  ...content.events.list.map(e => ({
    type: 'event' as const,
    emoji: e.emoji,
    title: e.short,
    content: e.caption,
    sub: `📅 ${e.date} · 📍 ${e.location}`,
    category: 'Event',
    color: e.color,
  })),
  // Teacher quotes
  ...content.teachers.iconic_quotes.map((q, i) => ({
    type: 'teacher' as const,
    emoji: '🍎',
    title: 'Kata-kata Guru',
    content: q.text,
    sub: `— ${q.source}`,
    category: 'Guru',
    color: ['#FFD166','#FF9B9B','#A8E6CF','#89C4E1','#C3B1E1','#FFCBA4'][i % 6],
  })),
  // Students
  ...biodata.siswa.slice(0, 20).map(s => ({
    type: 'student' as const,
    emoji: '🎓',
    title: s.nama_panggilan,
    content: s.quote || s.motto_hidup || 'Bagian dari cerita besar SKINFAVERSE21.',
    sub: `${s.kelas} · ${s.jurusan}`,
    category: 'Siswa',
    color: ['#FF9B9B','#A8E6CF','#FFD166','#89C4E1','#C3B1E1'][parseInt(s.id.toString()) % 5],
  })),
];

function getRandomMemory() {
  return MEMORY_POOL[Math.floor(Math.random() * MEMORY_POOL.length)];
}

export default function RandomPage() {
  const [memory, setMemory] = useState(getRandomMemory);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandom = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => {
      setMemory(getRandomMemory());
      setIsSpinning(false);
    }, 500);
  }, []);

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>You Never Know What You&apos;ll Remember Today.</h1>
          <p className={styles.subtitle}>
            Hari ini semesta memilih kenangan ini untuk kamu.
          </p>
        </header>

        {/* MEMORY CARD */}
        <div className={styles.stage}>
          <div
            className={`${styles.memoryCard} ${isSpinning ? styles.spinning : ''}`}
            style={{ '--mem-color': memory.color } as React.CSSProperties}
          >
            {/* Tape */}
            <div className={styles.tape} />

            {/* Type Badge */}
            <div className={styles.typeBadge}>
              {memory.emoji} {memory.category}
            </div>

            {/* Title */}
            <h2 className={styles.memTitle}>{memory.title}</h2>

            {/* Content */}
            <p className={styles.memContent}>&quot;{memory.content}&quot;</p>

            {/* Sub */}
            <p className={styles.memSub}>{memory.sub}</p>

            {/* Doodles */}
            <div className={styles.doodle1}>✨</div>
            <div className={styles.doodle2}>⭐</div>
          </div>

          {/* Counter info */}
          <p className={styles.poolInfo}>
            {MEMORY_POOL.length} kenangan tersimpan di semesta SKINFAVERSE21
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className={styles.actions}>
          <button className={`btn btn-coral btn-lg ${styles.randomBtn}`} onClick={handleRandom}>
            🎲 Kasih Kenangan Lain
          </button>
          <button className={`btn btn-yellow btn-lg`} onClick={handleRandom}>
            ✨ Surprise Me
          </button>
        </div>

        {/* EXPLORE MORE */}
        <section className={styles.exploreSection}>
          <h2 className={styles.exploreTitle}>Jelajahi Lebih Banyak Kenangan</h2>
          <div className={styles.exploreGrid}>
            {[
              { href: '/stories', emoji: '📌', label: 'Confession Board' },
              { href: '/quotes', emoji: '💬', label: 'Wall of Quotes' },
              { href: '/events', emoji: '📋', label: 'Semua Event' },
              { href: '/nostalgia', emoji: '📷', label: 'Galeri Nostalgia' },
              { href: '/students', emoji: '🎓', label: 'Meet The Universe' },
              { href: '/teachers', emoji: '🍎', label: 'Para Guru' },
            ].map(item => (
              <Link key={item.href} href={item.href} className={styles.exploreCard}>
                <span className={styles.exploreEmoji}>{item.emoji}</span>
                <span className={styles.exploreLabel}>{item.label}</span>
                <span className={styles.exploreArrow}>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <div className={styles.closing}>
          <p>&quot;Setiap kenangan punya waktunya sendiri untuk muncul kembali.&quot;</p>
        </div>

      </main>
    </>
  );
}
