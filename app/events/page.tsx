'use client';

import Link from 'next/link';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const { events } = content;

const STAMP_COLORS = ['#FF6B6B', '#2D2D2D', '#7EC8A4', '#E8BB44', '#5BAED0'];

export default function EventsPage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.stampLabel}>📋 ARSIP KEGIATAN</div>
            <h1 className={styles.title}>Every Event<br />Left A Story.</h1>
            <p className={styles.subtitle}>
              Karena ternyata… yang paling diingat bukan acaranya,<br />
              tapi orang-orang dan suasananya.
            </p>
          </div>
          <div className={styles.heroDecor}>
            <div className={styles.ticketStub}>
              <span>SKINFA</span>
              <span className={styles.ticketYear}>2023–2026</span>
              <span>ANGKATAN 21</span>
            </div>
          </div>
        </header>

        {/* Events Grid */}
        <section className={styles.grid}>
          {events.list.map((event, i) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className={styles.card}
              style={{
                '--card-color': event.color,
                '--rot': `${(i % 2 === 0 ? 1 : -1) * (i % 3)}deg`
              } as React.CSSProperties}
            >
              {/* Tape */}
              <div className={styles.tape} />

              {/* Date Stamp */}
              <div
                className={styles.dateStamp}
                style={{ background: STAMP_COLORS[i % STAMP_COLORS.length] }}
              >
                {event.date}
              </div>

              {/* Cover Area */}
              <div className={styles.coverArea} style={{ background: event.color }}>
                <span className={styles.coverEmoji}>{event.emoji}</span>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h2 className={styles.eventTitle}>{event.short}</h2>
                <p className={styles.eventCaption}>&quot;{event.caption}&quot;</p>

                <div className={styles.eventMeta}>
                  <span className={styles.metaItem}>📍 {event.location}</span>
                  <span className={styles.metaItem}>📷 {event.stats.photos} foto</span>
                  <span className={styles.metaItem}>🎥 {event.stats.videos} video</span>
                </div>

                <div className={styles.readMore}>
                  Buka Kenangan →
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Closing Quote */}
        <div className={styles.closingQuote}>
          <div className={styles.tape} />
          <p>&quot;Dulu capek jalaninnya. Sekarang malah jadi cerita favorit.&quot;</p>
          <span>— Angkatan 21, SKINFA</span>
        </div>
      </main>
    </>
  );
}
