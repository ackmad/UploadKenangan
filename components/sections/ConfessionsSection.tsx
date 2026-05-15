'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ConfessionsSection.module.css';
import content from '@/data/content.json';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const { confessions } = content;

interface Story {
  id: string;
  text: string;
  color: string;
  rot: string;
  author: string;
  category: string;
}

export default function ConfessionsSection() {
  const [notes, setNotes] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for Firestore (only limit to 8 for the homepage preview)
  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedStories: Story[] = [];
      snapshot.forEach((doc) => {
        fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
      });
      setNotes(fetchedStories);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching stories: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="confessions" className={`section ${styles.section}`}>
      {/* Corkboard texture */}
      <div className={styles.cork} aria-hidden="true" />

      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--peach)', boxShadow: 'var(--shadow-sm)' }}>Papan Pesan</span>
        <h2 className={styles.title}>Confessions<br /><em>&amp; Nostalgia</em></h2>
        <p className={styles.subtitle}>Cerita yang tidak pernah diceritakan langsung — akhirnya punya tempatnya.</p>

        <Link href="/stories" className={`btn btn-yellow ${styles.addBtn}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Ke Papan Pesan Utama
        </Link>
      </div>

      {/* Notes board preview */}
      <div className={styles.board}>
        {loading ? (
          <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', fontFamily: 'var(--font-hand)', fontSize: '1.5rem' }}>
            ⏳ Mengambil kenangan dari server...
          </div>
        ) : notes.length > 0 ? (
          notes.map(note => (
            <div
              key={note.id}
              className={styles.note}
              style={{ background: note.color, transform: `rotate(${note.rot})` }}
            >
              <div className={styles.pin} />
              <p className={styles.noteText}>{note.text}</p>
              <span className={styles.noteAuthor}>— {note.author}</span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', fontFamily: 'var(--font-hand)', fontSize: '1.5rem' }}>
            Belum ada cerita. Jadilah yang pertama di halaman Papan Pesan!
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
         <Link href="/stories" className="btn btn-black">Baca Seluruh {notes.length > 0 ? 'Cerita' : ''} &amp; Rahasia Angkatan</Link>
      </div>
    </section>
  );
}
