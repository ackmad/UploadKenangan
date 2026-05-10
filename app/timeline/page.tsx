'use client';

import Link from 'next/link';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const TIMELINE = [
  { year: '2023', month: 'Juli', title: 'MPLS', desc: 'Hari pertama resmi jadi bagian dari SKINFA. Canggung, deg-degan, tapi penuh semangat.', emoji: '🏫' },
  { year: '2023', month: 'Agustus', title: 'Mulai Belajar', desc: 'Pelajaran mulai, teman baru, suasana kelas yang masih asing tapi pelan-pelan jadi rumah.', emoji: '📚' },
  { year: '2023', month: 'Desember', title: 'Class Meeting', desc: 'RPL vs TKJ vs DKV — dan semua orang pura-pura serius.', emoji: '⚽' },
  { year: '2024', month: 'Februari', title: 'PKL Dimulai', desc: 'Mulai magang! Pengalaman nyata pertama di industri.', emoji: '💼' },
  { year: '2024', month: 'Juni', title: 'PKL Selesai', desc: 'Setelah berbulan-bulan, akhirnya balik ke sekolah. Welcome back, gang!', emoji: '🎉' },
  { year: '2024', month: 'Oktober', title: 'Study Tour', desc: 'Perjalanan bareng seluruh angkatan. Kenangan yang nggak terlupakan.', emoji: '🚌' },
  { year: '2025', month: 'Februari', title: 'Ujian Akhir', desc: 'Musim ujian paling intense. Semua orang belajar keras.', emoji: '📖' },
  { year: '2026', month: 'Mei', title: 'WISUDA! 🎓', desc: 'Toga, air mata, tawa, dan pelukan. Tiga tahun terasa singkat.', emoji: '🎓', special: true },
];

export default function TimelinePage() {
  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Three Years.<br />Thousands Of Stories.</h1>
          <p className={styles.subtitle}>
            Perjalanan yang awalnya terasa panjang… sekarang jadi kenangan.
          </p>
          <p className={styles.copywriting}>
            &quot;Dulu pengen cepat lulus. Sekarang pengen balik lima menit sebelumnya.&quot;
          </p>
        </header>

        {/* TIMELINE */}
        <div className={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right} ${item.special ? styles.special : ''}`}
            >
              {/* Connector line dot */}
              <div className={styles.dot}>
                <span>{item.emoji}</span>
              </div>

              {/* Card */}
              <div
                className={styles.card}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.cardTape} />
                <div className={styles.cardDate}>
                  {item.month} {item.year}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                {item.special && (
                  <div className={styles.specialBadge}>🌟 Momen Paling Bersejarah</div>
                )}
              </div>
            </div>
          ))}

          {/* End dot */}
          <div className={styles.endDot}>
            <span>∞</span>
          </div>
        </div>

        {/* Closing */}
        <div className={styles.closing}>
          <div className={styles.closingTape} />
          <p>&quot;Mungkin momennya sudah selesai… tapi rasanya masih tinggal.&quot;</p>
          <span>— Angkatan 21, SKINFA 2026</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
