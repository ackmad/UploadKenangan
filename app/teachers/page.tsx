'use client';

import { useState } from 'react';
import Link from 'next/link';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const { teachers } = content;

const DOODLES = ['⭐', '💫', '✨', '🌟', '❤️', '🎯', '🔥', '💡'];

export default function TeachersPage() {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleFlip = (id: number) => {
    setFlipped(flipped === id ? null : id);
  };

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* ── HERO ── */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.heroTag}>🍎 Untuk Para Guru Kami</div>
            <h1 className={styles.heroTitle}>The People Behind<br />Our Story.</h1>
            <p className={styles.heroSubtitle}>
              Mereka yang mengajarkan lebih dari sekadar pelajaran.
            </p>
            <p className={styles.heroCopywriting}>
              Beberapa guru mungkin dulu terasa menyeramkan, cerewet, atau sering kasih tugas
              mendadak… tapi sekarang justru jadi bagian yang paling dirindukan dari masa sekolah.
            </p>
          </div>
          <div className={styles.heroDecor}>
            <div className={styles.chalkboard}>
              <p className={styles.chalkText}>Dulu pengen cepat pulang pas pelajarannya…</p>
              <p className={styles.chalkText2}>sekarang malah kangen suasananya.</p>
              <div className={styles.chalkSmear} />
            </div>
          </div>
        </header>

        {/* ── GURU CARDS ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionBar} />
            Guru-Guru Angkatan 21
          </h2>
          <p className={styles.sectionSub}>Klik kartu untuk melihat pesan & momen lucu bersama mereka.</p>

          <div className={styles.grid}>
            {teachers.list.map((guru, i) => {
              const rot = (i % 2 === 0 ? 1 : -1) * (i % 3 + 1);
              const doodle = DOODLES[i % DOODLES.length];
              const isFlipped = flipped === guru.id;

              return (
                <div
                  key={guru.id}
                  className={`${styles.cardWrap} ${isFlipped ? styles.cardWrapFlipped : ''}`}
                  style={{ '--rot': `${rot}deg`, '--card-color': guru.color } as React.CSSProperties}
                  onClick={() => handleFlip(guru.id)}
                >
                  {/* FRONT */}
                  <div className={styles.cardFront}>
                    <div className={styles.tape} />
                    <div className={styles.doodle}>{doodle}</div>

                    {/* Role badge */}
                    <span className={styles.roleBadge}>{guru.role}</span>

                    {/* Photo area */}
                    <div className={styles.photoWrap} style={{ background: guru.color }}>
                      <span className={styles.photoEmoji}>{guru.emoji}</span>
                    </div>

                    {/* Info */}
                    <div className={styles.cardInfo}>
                      <p className={styles.nickname}>{guru.nickname}</p>
                      <h3 className={styles.namaGuru}>{guru.nama}</h3>
                      <span className={styles.mapelBadge}>{guru.mapel}</span>
                      <blockquote className={styles.quoteKhas}>
                        &quot;{guru.quote_khas}&quot;
                      </blockquote>
                    </div>

                    <div className={styles.flipHint}>Klik untuk cerita →</div>
                  </div>

                  {/* BACK */}
                  <div className={styles.cardBack} style={{ background: guru.color }}>
                    <div className={styles.backTape} />
                    <h3 className={styles.backName}>{guru.nickname}</h3>

                    <div className={styles.backSection}>
                      <h4 className={styles.backLabel}>💌 Pesan untuk Angkatan 21:</h4>
                      <p className={styles.backText}>{guru.pesan}</p>
                    </div>

                    <div className={styles.backSection}>
                      <h4 className={styles.backLabel}>😂 Momen Paling Lucu:</h4>
                      <p className={styles.backText}>{guru.momen_lucu}</p>
                    </div>

                    <div className={styles.flipHintBack}>← Klik untuk kembali</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── ICONIC QUOTES ── */}
        <section className={styles.quotesSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionBar} />
            Quotes Guru Paling Iconic
          </h2>
          <p className={styles.sectionSub}>Kalimat-kalimat yang sudah jadi inside jokes Angkatan 21.</p>

          <div className={styles.quotesGrid}>
            {teachers.iconic_quotes.map((q, i) => {
              const colors = ['#FFD166', '#FF9B9B', '#A8E6CF', '#89C4E1', '#C3B1E1', '#FFCBA4'];
              const rot = (i % 2 === 0 ? 1.5 : -1.5) * (i % 3 + 0.5);
              return (
                <div
                  key={i}
                  className={styles.iconicNote}
                  style={{ background: colors[i % colors.length], transform: `rotate(${rot}deg)` }}
                >
                  <div className={styles.noteDash} />
                  <p className={styles.iconicText}>&quot;{q.text}&quot;</p>
                  <span className={styles.iconicSource}>— {q.source}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── BEBERAPA PELAJARAN ── */}
        <section className={styles.lessonSection}>
          <div className={styles.lessonInner}>
            <span className={styles.lessonEmoji}>📚</span>
            <h2 className={styles.lessonTitle}>Beberapa pelajaran ternyata nggak cuma tentang nilai.</h2>
            <p className={styles.lessonSub}>
              Terima kasih sudah hadir bukan hanya sebagai guru,<br />
              tapi juga sebagai bagian dari cerita besar Angkatan 21.
            </p>
          </div>
        </section>

        {/* ── CLOSING QUOTE ── */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p>&quot;Mungkin dulu sering dimarahin… tapi sekarang malah jadi yang paling dirindukan.&quot;</p>
          <span>— Angkatan 21, SKINFA 2026</span>
        </div>

        <div className={styles.backNav}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>

      </main>
    </>
  );
}
