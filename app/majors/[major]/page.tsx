'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const MAJOR_DATA: Record<string, {
  name: string; full: string; emoji: string; color: string;
  tagline: string; desc: string; skills: string[];
  insideJoke: string; chaosLevel: string; gradient: string;
  funFacts: string[]; philosophy: string;
}> = {
  rpl: {
    name: 'RPL', full: 'Rekayasa Perangkat Lunak', emoji: '💻',
    color: '#89C4E1', gradient: 'linear-gradient(135deg, #89C4E1 0%, #5BAED0 100%)',
    tagline: 'Code hard, dream bigger.',
    desc: 'Jurusan yang melahirkan para developer, desainer aplikasi, dan inovator digital. RPL adalah rumah bagi mereka yang berpikir logis, suka memecahkan masalah, dan percaya bahwa teknologi bisa mengubah dunia.',
    skills: ['Web Development', 'Mobile App', 'Database', 'UI/UX Design', 'Algorithm', 'Version Control'],
    insideJoke: 'Bug? Itu bukan bug, itu undocumented feature.',
    chaosLevel: '⚡⚡⚡',
    funFacts: [
      'Rata-rata tidur 5 jam saat deadline project',
      'Google dan Stack Overflow adalah guru nomor dua',
      'Pernah debug 3 jam, ternyata salah titik koma',
      'IDE gelap adalah identitas, bukan pilihan',
    ],
    philosophy: 'If it works, don\'t touch it. If it\'s broken, coffee first.',
  },
  tkj: {
    name: 'TKJ', full: 'Teknik Komputer dan Jaringan', emoji: '🔌',
    color: '#FFD166', gradient: 'linear-gradient(135deg, #FFD166 0%, #F0A800 100%)',
    tagline: 'Connected. Always.',
    desc: 'Jurusan yang menjaga dunia tetap terhubung. TKJ adalah rumah bagi mereka yang tidak takut kabel, suka ngulik hardware, dan bisa setting jaringan dalam kondisi apapun.',
    skills: ['Networking', 'Server Admin', 'Hardware Troubleshooting', 'Cybersecurity', 'Cloud Computing', 'VoIP'],
    insideJoke: 'Ping dulu, baru ngomong. Kalau timeout, coba lagi.',
    chaosLevel: '⚡⚡⚡⚡',
    funFacts: [
      'Bisa bedain kabel cat5 dan cat6 hanya dari lihat',
      'Punya koleksi kabel lebih banyak dari pakaian',
      'Ping 0ms adalah mimpi yang dikejar tiap hari',
      'Pernah setting server sampai subuh buat tugas',
    ],
    philosophy: 'The network is only as strong as its weakest node.',
  },
  dkv: {
    name: 'DKV', full: 'Desain Komunikasi Visual', emoji: '🎨',
    color: '#E8A0BF', gradient: 'linear-gradient(135deg, #E8A0BF 0%, #C36B8A 100%)',
    tagline: 'Chaos is art.',
    desc: 'Jurusan yang mewarnai semesta. DKV adalah rumah bagi mereka yang melihat keindahan di mana-mana, tahu perbedaan font serif dan sans-serif, dan bisa bikin konten yang bikin orang berhenti scroll.',
    skills: ['Graphic Design', 'Illustration', 'Photography', 'Video Production', 'Branding', 'Typography'],
    insideJoke: 'Comic Sans is a war crime. Arial is acceptable. Helvetica is religion.',
    chaosLevel: '⚡⚡⚡⚡⚡',
    funFacts: [
      'Deadline besok = mulai sekarang adalah mitos',
      'Punya opini kuat tentang setiap font di dunia',
      'Referensi desain lebih banyak dari memori HP',
      'Bisa lihat kesalahan alignment 0.5px dari jauh',
    ],
    philosophy: 'Design is not just what it looks like. Design is how it works.',
  },
};

const BG_COLORS = ['#FF9B9B', '#A8E6CF', '#C3B1E1', '#FFD166', '#89C4E1', '#FFCBA4'];

export default function MajorDetailPage({ params }: { params: Promise<{ major: string }> }) {
  const { major: majorSlug } = use(params);
  const data = MAJOR_DATA[majorSlug];
  if (!data) notFound();

  const siswa = biodata.siswa.filter(s => s.jurusan === data.name);

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main} style={{ '--major-color': data.color } as React.CSSProperties}>

        <div className={styles.backNav}>
          <Link href="/majors" className="btn btn-black btn-sm">← Semua Jurusan</Link>
        </div>

        {/* HERO */}
        <header className={styles.hero} style={{ background: data.gradient }}>
          <div className={styles.heroGrain} />
          <div className={styles.heroEmoji}>{data.emoji}</div>
          <div className={styles.heroCopy}>
            <p className={styles.heroFull}>{data.full}</p>
            <h1 className={styles.heroName}>{data.name}</h1>
            <p className={styles.heroTagline}>&quot;{data.tagline}&quot;</p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statBox}>
              <span>{siswa.length}</span>
              <p>Siswa</p>
            </div>
            <div className={styles.statBox}>
              <span>{data.skills.length}</span>
              <p>Kompetensi</p>
            </div>
          </div>
        </header>

        {/* DESC */}
        <div className={styles.descCard}>
          <div className={styles.tape} />
          <p className={styles.descText}>{data.desc}</p>
          <p className={styles.philosophy}>&quot;{data.philosophy}&quot;</p>
        </div>

        {/* SKILLS + FUN FACTS */}
        <div className={styles.twoCol}>
          <section className={styles.skillsSection}>
            <h2 className={styles.secTitle}>🛠️ Kompetensi Utama</h2>
            <div className={styles.skillList}>
              {data.skills.map((s, i) => (
                <div key={i} className={styles.skillItem} style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className={styles.skillDot} />
                  {s}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.factsSection}>
            <h2 className={styles.secTitle}>🎯 Fun Facts</h2>
            <div className={styles.factList}>
              {data.funFacts.map((f, i) => (
                <div key={i} className={styles.factItem} style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className={styles.factNum}>{String(i+1).padStart(2,'0')}</span>
                  <p>{f}</p>
                </div>
              ))}
            </div>
            <div className={styles.jokeBox}>
              <span>🤫</span>
              <p>&quot;{data.insideJoke}&quot;</p>
            </div>
          </section>
        </div>

        {/* STUDENTS */}
        <section className={styles.studentsSection}>
          <h2 className={styles.secTitle}>👥 Siswa {data.name} ({siswa.length} orang)</h2>
          <div className={styles.studentsGrid}>
            {siswa.map((s, i) => (
              <Link
                key={s.id}
                href={`/students/${s.id}`}
                className={styles.studentCard}
                style={{
                  '--rot': `${(i%2===0?1:-1)*(i%3+1)}deg`,
                  '--bg': BG_COLORS[i % BG_COLORS.length]
                } as React.CSSProperties}
              >
                <div className={styles.cardTape} />
                <div className={styles.cardPhotoWrap} style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.foto} alt={s.nama_panggilan} className={styles.cardPhoto} loading="lazy" />
                </div>
                <p className={styles.cardNick}>{s.nama_panggilan}</p>
                <p className={styles.cardKelas}>{s.kelas}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p>&quot;{data.name} bukan sekadar jurusan. Ini identitas.&quot;</p>
        </div>

        <div style={{ textAlign:'center', marginTop:'40px', display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/majors" className="btn btn-black">← Semua Jurusan</Link>
          <Link href="/students" className="btn btn-coral">Meet The Universe →</Link>
        </div>
      </main>
    </>
  );
}
