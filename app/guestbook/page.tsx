'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/app/components/ScrapbookNav';

const INITIAL_ENTRIES = [
  { id: 1, name: "Alumni SKINFA", message: "Suatu hari nanti ketika kalian baca ini lagi… semoga sudah jadi orang-orang yang luar biasa. We're proud of you all 🥺", color: "#FFD166", rot: "-2deg" },
  { id: 2, name: "Anonim", message: "Angkatan 21 — yang ramenya nggak ada obat. Kangen banget sama kalian semua. Keep going, jangan pernah lupa dari mana kalian berasal.", color: "#A8E6CF", rot: "1.5deg" },
  { id: 3, name: "Wali Kelas XII RPL", message: "Kebanggaan bapak/ibu guru melihat kalian tumbuh. Semoga ilmu yang kalian pelajari selama 3 tahun menjadi bekal terbaik untuk masa depan kalian.", color: "#C3B1E1", rot: "-1deg" },
  { id: 4, name: "Anonim", message: "SKINFA 2026 akan selalu jadi bagian dari cerita kita. Jangan lupakan hari-hari itu 💛", color: "#FF9B9B", rot: "3deg" },
];

const NOTE_COLORS = ['#FFD166', '#A8E6CF', '#FF9B9B', '#89C4E1', '#C3B1E1', '#FFCBA4', '#B5EAD7', '#E8A0BF'];

export default function GuestbookPage() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const rot = `${(Math.random() * 6 - 3).toFixed(1)}deg`;

    setEntries([{
      id: Date.now(),
      name: name.trim() || 'Anonim',
      message: message.trim(),
      color,
      rot
    }, ...entries]);

    setName('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>

        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Leave Something Behind.</h1>
          <p className={styles.subtitle}>
            Kalau suatu hari nanti kembali lagi… baca pesan ini dan ingat bahwa kita pernah ada di sini.
          </p>
        </header>

        {/* Form */}
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formTape} />
            <h2 className={styles.formTitle}>📝 Tinggalkan Pesanmu</h2>
            <p className={styles.formSubtitle}>Tulis apa saja — doa, harapan, ucapan, atau kenangan kecil.</p>

            {submitted && (
              <div className={styles.successBanner}>
                ✅ Pesanmu sudah tertempel! Terima kasih sudah meninggalkan jejak di sini 💛
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                className={styles.input}
                placeholder="Namamu (atau biarkan kosong untuk anonim)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <textarea
                className={styles.textarea}
                placeholder="Tulis pesanmu untuk Angkatan 21…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
              />
              <button type="submit" className="btn btn-coral btn-lg" style={{ justifyContent: 'center' }}>
                📌 Tempel Pesanku
              </button>
            </form>
          </div>
        </section>

        {/* Guestbook Wall */}
        <section className={styles.wallSection}>
          <h2 className={styles.wallTitle}>Pesan yang Ditinggalkan</h2>
          <div className={styles.wall}>
            {entries.map(entry => (
              <div
                key={entry.id}
                className={styles.note}
                style={{ backgroundColor: entry.color, transform: `rotate(${entry.rot})` }}
              >
                <div className={styles.pin} />
                <p className={styles.noteMessage}>{entry.message}</p>
                <div className={styles.noteAuthor}>— {entry.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <div className={styles.closing}>
          <p>&quot;Website ini mungkin selesai dibangun… tapi cerita Angkatan 21 tidak akan pernah benar-benar berakhir.&quot;</p>
        </div>

        <div className={styles.backNav}>
          <Link href="/" className="btn btn-black">← Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
