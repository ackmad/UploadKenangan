'use client';

import Link from 'next/link';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const MAJORS = [
  {
    slug: 'rpl',
    name: 'RPL',
    full: 'Rekayasa Perangkat Lunak',
    emoji: '💻',
    color: '#89C4E1',
    tagline: 'Code hard, dream bigger.',
    desc: 'Jurusan yang melahirkan para developer, desainer aplikasi, dan inovator digital. RPL adalah rumah bagi mereka yang berpikir logis, suka memecahkan masalah, dan percaya bahwa teknologi bisa mengubah dunia.',
    skills: ['Web Development', 'Mobile App', 'Database', 'UI/UX Design', 'Algorithm'],
    insideJoke: 'Bug? Itu bukan bug, itu undocumented feature.',
    chaosLevel: '⚡⚡⚡',
    gradient: 'linear-gradient(135deg, #89C4E1 0%, #5BAED0 100%)',
  },
  {
    slug: 'tkj',
    name: 'TKJ',
    full: 'Teknik Komputer dan Jaringan',
    emoji: '🔌',
    color: '#FFD166',
    tagline: 'Connected. Always.',
    desc: 'Jurusan yang menjaga dunia tetap terhubung. TKJ adalah rumah bagi mereka yang tidak takut kabel, suka ngulik hardware, dan bisa setting jaringan dalam kondisi apapun — bahkan saat deadline.',
    skills: ['Networking', 'Server Admin', 'Hardware', 'Cybersecurity', 'Cloud'],
    insideJoke: 'Ping dulu, baru ngomong.',
    chaosLevel: '⚡⚡⚡⚡',
    gradient: 'linear-gradient(135deg, #FFD166 0%, #F0A800 100%)',
  },
  {
    slug: 'dkv',
    name: 'DKV',
    full: 'Desain Komunikasi Visual',
    emoji: '🎨',
    color: '#E8A0BF',
    tagline: 'Chaos is art.',
    desc: 'Jurusan yang mewarnai semesta. DKV adalah rumah bagi mereka yang melihat keindahan di mana-mana, tahu perbedaan font serif dan sans-serif, dan bisa bikin konten yang bikin orang berhenti scroll.',
    skills: ['Graphic Design', 'Illustration', 'Photography', 'Video Production', 'Branding'],
    insideJoke: 'Comic Sans is a war crime.',
    chaosLevel: '⚡⚡⚡⚡⚡',
    gradient: 'linear-gradient(135deg, #E8A0BF 0%, #C36B8A 100%)',
  },
];

export default function MajorsPage() {
  const totalByJurusan = (j: string) => biodata.siswa.filter(s => s.jurusan === j).length;

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroTag}>🏫 Jurusan SKINFA</div>
          <h1 className={styles.heroTitle}>Three Majors.<br />One Universe.</h1>
          <p className={styles.heroSub}>
            RPL, TKJ, DKV — tiga dunia yang berbeda, tapi satu angkatan yang sama.
            Di sinilah identitas terbentuk dan keahlian diasah selama tiga tahun.
          </p>
        </header>

        {/* MAJORS GRID */}
        <div className={styles.grid}>
          {MAJORS.map((major, i) => (
            <Link
              key={major.slug}
              href={`/majors/${major.slug}`}
              className={styles.majorCard}
              style={{
                '--major-color': major.color,
                '--rot': `${(i % 2 === 0 ? 1 : -1) * (i % 2 + 1)}deg`
              } as React.CSSProperties}
            >
              {/* Tape */}
              <div className={styles.tape} />

              {/* Banner */}
              <div className={styles.cardBanner} style={{ background: major.gradient }}>
                <span className={styles.cardEmoji}>{major.emoji}</span>
                <div className={styles.chaosLabel}>
                  Chaos Level: {major.chaosLevel}
                </div>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.cardName}>{major.name}</h2>
                    <p className={styles.cardFull}>{major.full}</p>
                  </div>
                  <span className={styles.cardCount}>{totalByJurusan(major.name)} siswa</span>
                </div>

                <p className={styles.cardTagline}>&quot;{major.tagline}&quot;</p>
                <p className={styles.cardDesc}>{major.desc.slice(0, 120)}…</p>

                <div className={styles.skillTags}>
                  {major.skills.slice(0, 3).map(s => (
                    <span key={s} className={styles.skill}>{s}</span>
                  ))}
                  <span className={styles.skill}>+{major.skills.length - 3} more</span>
                </div>

                <div className={styles.insideJoke}>
                  <span>🤫</span>
                  <p>&quot;{major.insideJoke}&quot;</p>
                </div>

                <div className={styles.cardCta}>Explore {major.name} →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Closing */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p>&quot;Jurusan apapun yang kamu pilih — kalian semua adalah bagian dari cerita yang sama.&quot;</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
