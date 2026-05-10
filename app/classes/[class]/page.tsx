'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const CLASS_META: Record<string, { color: string; emoji: string; quote: string; walikelas: string; insideJoke: string; chaos: string }> = {
  'xii-rpl-1': { color: '#89C4E1', emoji: '💻', quote: 'Code hard, dream bigger.', walikelas: 'Wali Kelas RPL 1', insideJoke: 'Bug? Itu bukan bug, itu feature yang belum didokumentasikan.', chaos: 'Waktu seluruh kelas deadline bareng jam 23:59 dan WiFi sekolah tiba-tiba mati 😭' },
  'xii-rpl-2': { color: '#A8E6CF', emoji: '🖥️', quote: 'Bug hari ini, feature besok.', walikelas: 'Wali Kelas RPL 2', insideJoke: 'Ctrl+Z is life.', chaos: 'Git conflict yang bikin project hampir nggak jadi 😂' },
  'xii-tkj-1': { color: '#FFD166', emoji: '🔌', quote: 'Ping 0ms, semangat 100%.', walikelas: 'Wali Kelas TKJ 1', insideJoke: 'Sudah di-ping belum? Konek dulu baru ngobrol.', chaos: 'Praktikum jaringan dan semua kabel malah ketuker seisi lab 😭' },
  'xii-tkj-2': { color: '#FFCBA4', emoji: '🌐', quote: 'Connected. Always.', walikelas: 'Wali Kelas TKJ 2', insideJoke: '404: Not Found — termasuk motivasi pagi Senin.', chaos: 'Server sekolah down pas presentasi final 😂' },
  'xii-dkv':   { color: '#E8A0BF', emoji: '🎨', quote: 'Chaos is art.', walikelas: 'Wali Kelas DKV', insideJoke: 'Font itu penting. Comic Sans is a war crime.', chaos: 'Deadline poster besok tapi masih debat pilihan warna 3 jam 😭' },
};

const BG_COLORS = ['#FF9B9B', '#A8E6CF', '#C3B1E1', '#FFD166', '#89C4E1', '#FFCBA4'];
const DOODLES = ['⭐', '✨', '⚡', '💫', '🎨', '🚀'];

export default function ClassDetailPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classSlug } = use(params);
  const meta = CLASS_META[classSlug];

  if (!meta) notFound();

  // Convert slug back to class name
  const kelasName = classSlug
    .split('-')
    .map(w => w.toUpperCase())
    .join(' ')
    .replace('XII ', 'XII ');

  const siswaKelas = biodata.siswa.filter(s =>
    s.kelas.toLowerCase().replace(/\s+/g, '-') === classSlug
  );

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main} style={{ '--cls-color': meta.color } as React.CSSProperties}>

        {/* Back */}
        <div className={styles.backNav}>
          <Link href="/classes" className="btn btn-black btn-sm">← Semua Kelas</Link>
        </div>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroBanner} style={{ background: meta.color }}>
            <span className={styles.heroEmoji}>{meta.emoji}</span>
            <div className={styles.heroOverlay}>
              <h1 className={styles.heroTitle}>{kelasName}</h1>
              <p className={styles.heroQuote}>&quot;{meta.quote}&quot;</p>
            </div>
          </div>

          <div className={styles.heroMeta}>
            <div className={styles.metaBox}>
              <span className={styles.metaNum}>{siswaKelas.length}</span>
              <span className={styles.metaLabel}>👥 Siswa</span>
            </div>
            <div className={styles.metaBox}>
              <span className={styles.metaNum} style={{ fontSize: '1.1rem' }}>{meta.walikelas}</span>
              <span className={styles.metaLabel}>👨‍🏫 Wali Kelas</span>
            </div>
          </div>
        </header>

        {/* INSIDE JOKE */}
        <div className={styles.jokeCard}>
          <div className={styles.tape} />
          <p className={styles.jokeLabel}>🤫 Inside Joke Kelas</p>
          <p className={styles.jokeText}>&quot;{meta.insideJoke}&quot;</p>
        </div>

        {/* CHAOS MOMENT */}
        <div className={styles.chaosCard}>
          <h3 className={styles.chaosTitle}>🔥 Momen Paling Chaos</h3>
          <p className={styles.chaosText}>&quot;{meta.chaos}&quot;</p>
        </div>

        {/* STUDENTS GRID */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionBar} style={{ background: meta.color }} />
            Penghuni Kelas
          </h2>

          {siswaKelas.length > 0 ? (
            <div className={styles.studentsGrid}>
              {siswaKelas.map((siswa, i) => {
                const bg = BG_COLORS[i % BG_COLORS.length];
                const doodle = DOODLES[i % DOODLES.length];
                const rot = (i % 2 === 0 ? 1 : -1) * (i % 3 + 1);

                return (
                  <Link
                    href={`/students/${siswa.id}`}
                    key={siswa.id}
                    className={styles.studentCard}
                    style={{ '--rot': `${rot}deg`, '--bg': bg } as React.CSSProperties}
                  >
                    <div className={styles.cardTape} />
                    <div className={styles.cardDoodle}>{doodle}</div>
                    <div className={styles.cardPhoto} style={{ background: bg }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={siswa.foto} alt={siswa.nama_panggilan} className={styles.cardImg} loading="lazy" />
                    </div>
                    <div className={styles.cardInfo}>
                      <p className={styles.cardNick}>{siswa.nama_panggilan}</p>
                      <p className={styles.cardName}>{siswa.nama_lengkap}</p>
                      <p className={styles.cardQuote}>&quot;{(siswa.quote || siswa.motto_hidup || '').slice(0, 60)}&quot;</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>Belum ada data siswa di kelas ini.</p>
            </div>
          )}
        </section>

        {/* CLOSING */}
        <div className={styles.closing}>
          <div className={styles.tape} />
          <p>&quot;Kelas ini mungkin chaos… tapi di sinilah sebagian besar cerita dimulai.&quot;</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/classes" className="btn btn-black">← Semua Kelas</Link>
          <Link href="/students" className="btn btn-coral">Semua Siswa →</Link>
        </div>
      </main>
    </>
  );
}
