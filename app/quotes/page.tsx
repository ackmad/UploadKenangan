'use client';

import { useState } from 'react';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const { quotes } = content;
const CATEGORIES = ["Semua", "Persahabatan", "Perpisahan", "Lucu", "Random", "PKL", "Motivasi", "Cinta 😭"];

export default function QuotesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [randomIdx, setRandomIdx] = useState<number | null>(null);

  const filtered = activeCategory === "Semua"
    ? quotes.list
    : quotes.list.filter(q => q.category === activeCategory);

  const handleRandom = () => {
    const idx = Math.floor(Math.random() * quotes.list.length);
    setRandomIdx(idx);
  };

  const randomQuote = randomIdx !== null ? quotes.list[randomIdx] : null;

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Some Words Stay Forever.</h1>
          <p className={styles.subtitle}>
            Kadang satu kalimat bisa bikin kangen satu masa.<br />
            <em>Beberapa kalimat ternyata menetap lebih lama dari yang kita kira.</em>
          </p>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={`btn btn-coral`} onClick={handleRandom}>
            ✨ Generate Quote Random
          </button>
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => { setActiveCategory(cat); setRandomIdx(null); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Random Quote Spotlight */}
        {randomQuote && (
          <div className={styles.spotlight} style={{ '--spot-color': randomQuote.color } as React.CSSProperties}>
            <div className={styles.spotTape} />
            <div className={styles.spotCategory}>{randomQuote.category}</div>
            <p className={styles.spotText}>&quot;{randomQuote.text}&quot;</p>
            <span className={styles.spotAuthor}>— {randomQuote.author}</span>
            <button className={styles.closeSpot} onClick={() => setRandomIdx(null)}>✕</button>
          </div>
        )}

        {/* Quotes Wall */}
        <div className={styles.wall}>
          {filtered.map((quote, i) => {
            const rot = (i % 2 === 0 ? 1 : -1) * (i % 4);
            return (
              <div
                key={quote.id}
                className={styles.quoteCard}
                style={{
                  backgroundColor: quote.color,
                  transform: `rotate(${rot}deg)`,
                  animationDelay: `${i * 0.07}s`
                }}
              >
                <div className={styles.pin} />
                <span className={styles.categoryBadge}>{quote.category}</span>
                <p className={styles.quoteText}>&quot;{quote.text}&quot;</p>
                <div className={styles.quoteFooter}>
                  <span className={styles.quoteAuthor}>— {quote.author}</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <span>🕊️</span>
              <p>Belum ada quote di kategori ini.</p>
            </div>
          )}
        </div>

        {/* Closing */}
        <div className={styles.closing}>
          <p className={styles.closingText}>
            &quot;Mungkin kata-katanya sederhana… tapi ternyata menyimpan seluruh perasaan yang tidak sempat terucap.&quot;
          </p>
        </div>
      </main>
    </>
  );
}
