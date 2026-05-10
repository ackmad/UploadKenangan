'use client';

import Link from 'next/link';
import biodata from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const MILESTONES = [
  { emoji: '💡', title: 'Ide Awal', desc: 'Awalnya cuma iseng mikirin tempat menyimpan kenangan yang nggak bakal hilang.' },
  { emoji: '📐', title: 'Desain Pertama', desc: 'Sketch pertama di kertas buram dengan pulpen. Penuh corat-coret dan revisi.' },
  { emoji: '💻', title: 'Mulai Coding', desc: 'Baris kode pertama ditulis. Sekaligus bug pertama yang bikin frustasi.' },
  { emoji: '🐛', title: 'Bug Marathon', desc: 'Seminggu nge-debug hal yang ternyata cuma masalah typo satu huruf 😭' },
  { emoji: '🎨', title: 'Design System', desc: 'Lahirnya Neo-Brutalism Scrapbook — tema yang bikin website ini jadi dirinya sendiri.' },
  { emoji: '🚀', title: 'Launching', desc: 'Deploy pertama. Tangan gemetar, tapi berhasil. SKINFAVERSE21 resmi ada.' },
];

export default function AboutPage() {
  const totalSiswa = biodata.siswa.length;
  const totalKelas = new Set(biodata.siswa.map(s => s.kelas)).size;

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.heroTag}>🌌 Tentang Website</div>
            <h1 className={styles.heroTitle}>This Is More Than<br />Just A Website.</h1>
            <p className={styles.heroSub}>
              Semesta Digital Angkatan 21.
            </p>
          </div>
          <div className={styles.heroDecor}>
            <div className={styles.stickyNote} style={{ background: '#FFD166', transform: 'rotate(-3deg)' }}>
              <div className={styles.stickyPin} />
              <p>Dibuat dengan 💛 dan sedikit begadang</p>
            </div>
            <div className={styles.stickyNote} style={{ background: '#A8E6CF', transform: 'rotate(2deg)' }}>
              <div className={styles.stickyPin} />
              <p>Next.js + Scrapbook + Nostalgia = SKINFAVERSE21</p>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className={styles.statsRow}>
          {[
            { num: totalSiswa, label: 'Siswa Angkatan 21', emoji: '👥' },
            { num: totalKelas, label: 'Kelas', emoji: '🏫' },
            { num: 3, label: 'Jurusan', emoji: '📚' },
            { num: '3', label: 'Tahun Bersama', emoji: '📅' },
            { num: '∞', label: 'Kenangan', emoji: '💛' },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <span className={styles.statEmoji}>{s.emoji}</span>
              <span className={styles.statNum}>{s.num}</span>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* APA ITU SKINFAVERSE */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionText}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBar} />
                Apa itu SKINFAVERSE21?
              </h2>
              <p className={styles.bodyText}>
                Awalnya ini cuma tempat upload kenangan. Tapi ternyata…
                cerita anak-anak SKINFA terlalu besar untuk disimpan dalam folder biasa.
              </p>
              <p className={styles.bodyText}>
                SKINFAVERSE21 adalah <strong>arsip digital</strong>, ruang nostalgia,
                tempat cerita, dan kapsul waktu untuk seluruh siswa Angkatan 21
                SMK Informatika Al-Irsyad Al-Islamiyyah (SKINFA) Cirebon.
              </p>
              <p className={styles.bodyText}>
                Website ini dibuat sebagai bentuk cinta dan penghargaan kepada
                setiap momen, setiap orang, dan setiap cerita yang membentuk
                Angkatan 21 menjadi apa yang mereka adanya hari ini.
              </p>
            </div>
            <div className={styles.sectionDecor}>
              <div className={styles.chalkboard}>
                <p className={styles.chalkText}>SKINFAVERSE21</p>
                <p className={styles.chalkSub}>= SKINFA + Universe + 21</p>
                <div className={styles.chalkLine} />
                <p className={styles.chalkDesc}>Semesta Digital Angkatan 21</p>
              </div>
            </div>
          </div>
        </section>

        {/* FILOSOFI */}
        <section className={styles.philosophySection}>
          <div className={styles.philosophyInner}>
            <h2 className={styles.philosophyTitle}>Filosofi SKINFAVERSE21</h2>
            <div className={styles.philosophyGrid}>
              {[
                { emoji: '📚', title: 'Arsip Digital', desc: 'Setiap momen yang tersimpan adalah sejarah yang tidak boleh hilang. Website ini menjaga agar kenangan tetap hidup.' },
                { emoji: '🌌', title: 'Ruang Nostalgia', desc: 'Bukan sekadar gallery foto. Ini adalah tempat di mana perasaan bisa kembali, dan ingatan bisa disentuh kembali.' },
                { emoji: '📖', title: 'Tempat Cerita', desc: 'Setiap orang punya cerita. Dan setiap cerita layak untuk didengar dan diingat, termasuk yang paling kecil sekalipun.' },
                { emoji: '⏳', title: 'Kapsul Waktu', desc: 'Suatu hari nanti, ketika semua orang membuka website ini lagi, semoga mereka bisa tersenyum dan berkata: "Kita pernah sebahagia itu."' },
              ].map((item, i) => (
                <div key={i} className={styles.philosophyCard} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className={styles.philosophyEmoji}>{item.emoji}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERJALANAN PEMBUATAN */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionBar} />
            Perjalanan Pembuatan
          </h2>
          <div className={styles.milestoneList}>
            {MILESTONES.map((m, i) => (
              <div key={i} className={styles.milestone} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.milestoneEmoji}>{m.emoji}</div>
                <div className={styles.milestoneInfo}>
                  <h3 className={styles.milestoneTitle}>{m.title}</h3>
                  <p className={styles.milestoneDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section className={styles.techSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionBar} />
            Dibangun Dengan
          </h2>
          <div className={styles.techGrid}>
            {['Next.js 15', 'TypeScript', 'CSS Modules', 'Vercel', 'JSON Data', 'Love & Nostalgia 💛'].map((t, i) => (
              <div key={i} className={styles.techBadge}>{t}</div>
            ))}
          </div>
        </section>

        {/* SURAT CINTA */}
        <div className={styles.loveLetter}>
          <div className={styles.letterTape} />
          <h2 className={styles.letterTitle}>💌 Surat Untuk Angkatan 21</h2>
          <div className={styles.letterBody}>
            <p>Kepada seluruh siswa Angkatan 21 SKINFA,</p>
            <p>
              Website ini dibuat bukan cuma dengan coding… tapi juga dengan kenangan.
              Setiap baris kode yang ditulis terinspirasi dari cerita-cerita kalian,
              dari momen-momen yang kalian bagikan, dan dari semangat Angkatan 21
              yang tidak pernah padam.
            </p>
            <p>
              Semoga suatu hari nanti, ketika kalian membuka website ini lagi,
              kalian bisa tersenyum dan berkata:
              <em> &quot;Kita pernah sebahagia itu.&quot;</em>
            </p>
            <p className={styles.letterSign}>Dengan penuh kenangan,<br />Tim SKINFAVERSE21 🌟</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
