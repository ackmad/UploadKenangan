'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = content.events.list.find(e => e.slug === slug);

  if (!event) notFound();

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* Back Nav */}
        <div className={styles.backNav}>
          <Link href="/events" className="btn btn-black btn-sm">← Semua Event</Link>
        </div>

        {/* Hero Banner */}
        <header className={styles.hero} style={{ '--event-color': event.color } as React.CSSProperties}>
          <div className={styles.heroBanner} style={{ background: event.color }}>
            <span className={styles.heroEmoji}>{event.emoji}</span>
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroMeta}>
              <span className={styles.metaBadge}>📅 {event.date}</span>
              <span className={styles.metaBadge}>📍 {event.location}</span>
            </div>
            <h1 className={styles.heroTitle}>{event.title}</h1>
            <p className={styles.heroDesc}>{event.description}</p>
            <div className={styles.heroStats}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{event.stats.photos}</span>
                <span className={styles.statLabel}>📷 Foto</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{event.stats.videos}</span>
                <span className={styles.statLabel}>🎥 Video</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{event.stats.attendees}</span>
                <span className={styles.statLabel}>👥 Hadir</span>
              </div>
            </div>
          </div>
        </header>

        {/* Things We Still Remember */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Things We Still Remember</h2>
            <p className={styles.sectionSub}>Hal-hal kecil yang ternyata paling diingat.</p>
          </div>
          <div className={styles.memoryGrid}>
            {event.things_we_remember.map((thing, i) => (
              <div
                key={i}
                className={styles.memoryNote}
                style={{
                  backgroundColor: ['#FFD166', '#FF9B9B', '#A8E6CF', '#89C4E1'][i % 4],
                  transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i % 3 + 1)}deg)`
                }}
              >
                <div className={styles.memPin} />
                <p>{thing}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chaos Moment */}
        <section className={styles.chaosSection}>
          <div className={styles.chaosInner}>
            <h3 className={styles.chaosTitle}>🔥 Momen Paling Chaos</h3>
            <p className={styles.chaosText}>&quot;{event.chaos_moment}&quot;</p>
          </div>
        </section>

        {/* Caption Quote */}
        <div className={styles.captionQuote}>
          <div className={styles.tape} />
          <p>&quot;{event.caption}&quot;</p>
          <span>Dulu capek jalaninnya. Sekarang malah jadi cerita favorit.</span>
        </div>

        {/* Navigation */}
        <div className={styles.navSection}>
          <Link href="/events" className="btn btn-black">← Kembali ke Events</Link>
          <Link href="/nostalgia" className="btn btn-coral">Lihat Galeri Nostalgia →</Link>
        </div>
      </main>
    </>
  );
}
