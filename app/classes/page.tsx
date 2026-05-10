'use client';

import Link from 'next/link';
import content from '@/data/content.json';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

// Compute class counts from biodata dynamically
const classMap = biodata.siswa.reduce<Record<string, { siswa: typeof biodata.siswa; jurusan: string }>>((acc, s) => {
  if (!acc[s.kelas]) acc[s.kelas] = { siswa: [], jurusan: s.jurusan };
  acc[s.kelas].siswa.push(s);
  return acc;
}, {});

const CLASSES = Object.entries(classMap).map(([kelas, data]) => ({
  kelas,
  jurusan: data.jurusan,
  count: data.siswa.length,
})).sort((a, b) => a.kelas.localeCompare(b.kelas));

const CLASS_META: Record<string, { color: string; emoji: string; quote: string; walikelas: string }> = {
  'XII RPL 1': { color: '#89C4E1', emoji: '💻', quote: 'Code hard, dream bigger.', walikelas: 'Wali Kelas RPL 1' },
  'XII RPL 2': { color: '#A8E6CF', emoji: '🖥️', quote: 'Bug hari ini, feature besok.', walikelas: 'Wali Kelas RPL 2' },
  'XII TKJ 1': { color: '#FFD166', emoji: '🔌', quote: 'Ping 0ms, semangat 100%.', walikelas: 'Wali Kelas TKJ 1' },
  'XII TKJ 2': { color: '#FFCBA4', emoji: '🌐', quote: 'Connected. Always.', walikelas: 'Wali Kelas TKJ 2' },
  'XII DKV':   { color: '#E8A0BF', emoji: '🎨', quote: 'Chaos is art.', walikelas: 'Wali Kelas DKV' },
};

function getClassMeta(kelas: string) {
  return CLASS_META[kelas] ?? { color: '#C3B1E1', emoji: '📚', quote: 'Kenangan terbaik dibuat di sini.', walikelas: 'Wali Kelas' };
}

export default function ClassesPage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.heroTag}>🏫 Ruang Kelas Digital</div>
            <h1 className={styles.heroTitle}>Every Class Has<br />Its Own Chaos.</h1>
            <p className={styles.heroSub}>
              Setiap kelas punya cerita, inside jokes, dan legend-nya sendiri.
              Di sinilah sebagian besar kenangan itu dibuat.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{biodata.siswa.length}</span>
              <span className={styles.statLabel}>Total Siswa</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{CLASSES.length}</span>
              <span className={styles.statLabel}>Total Kelas</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>3</span>
              <span className={styles.statLabel}>Jurusan</span>
            </div>
          </div>
        </header>

        {/* CLASSES GRID */}
        <section className={styles.grid}>
          {CLASSES.map((cls, i) => {
            const meta = getClassMeta(cls.kelas);
            const rot = (i % 2 === 0 ? 1 : -1) * (i % 3 + 1);
            const slug = cls.kelas.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link
                key={cls.kelas}
                href={`/classes/${slug}`}
                className={styles.classCard}
                style={{
                  '--cls-color': meta.color,
                  '--rot': `${rot}deg`
                } as React.CSSProperties}
              >
                {/* Tape */}
                <div className={styles.tape} />

                {/* Emoji Banner */}
                <div className={styles.cardBanner} style={{ background: meta.color }}>
                  <span className={styles.cardEmoji}>{meta.emoji}</span>
                  <span className={styles.cardJurusan}>{cls.jurusan}</span>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{cls.kelas}</h2>
                  <p className={styles.cardQuote}>&quot;{meta.quote}&quot;</p>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>👥 {cls.count} siswa</span>
                    <span className={styles.metaItem}>👨‍🏫 {meta.walikelas}</span>
                  </div>

                  <div className={styles.cardCta}>Masuk ke Kelas →</div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* CLOSING */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p>&quot;Kelas ini mungkin chaos… tapi di sinilah sebagian besar cerita dimulai.&quot;</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
