'use client';
import { useState } from 'react';
import styles from './ConfessionsSection.module.css';
import content from '@/data/content.json';

const { confessions } = content;
const NOTE_COLORS = ['#FFD166', '#FF9B9B', '#A8E6CF', '#C3B1E1', '#89C4E1', '#FFCBA4', '#E8A0BF', '#B5EAD7'];

export default function ConfessionsSection() {
  const [notes, setNotes] = useState(confessions.initialNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newNote = {
      id: Date.now(),
      text: text.trim(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      rot: `${(Math.random() * 6 - 3).toFixed(1)}deg`,
      author: 'Anonim',
    };
    setNotes(prev => [newNote, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setModalOpen(false); setText(''); }, 1500);
  };

  return (
    <section id="confessions" className={`section ${styles.section}`}>
      {/* Corkboard texture */}
      <div className={styles.cork} aria-hidden="true" />

      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--peach)', boxShadow: 'var(--shadow-sm)' }}>{confessions.sectionTag}</span>
        <h2 className={styles.title}>{confessions.title}<br /><em>&amp; Nostalgia</em></h2>
        <p className={styles.subtitle}>{confessions.subtitle}</p>

        <button className={`btn btn-yellow ${styles.addBtn}`} onClick={() => setModalOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          {confessions.addBtn}
        </button>
      </div>

      {/* Notes board */}
      <div className={styles.board}>
        {notes.map(note => (
          <div
            key={note.id}
            className={styles.note}
            style={{ background: note.color, transform: `rotate(${note.rot})` }}
          >
            <div className={styles.pin} />
            <p className={styles.noteText}>{note.text}</p>
            <span className={styles.noteAuthor}>— {note.author}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTape} />
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>✕</button>
            <h3 className={styles.modalTitle}>{confessions.modal.title}</h3>
            <p className={styles.modalSub}>{confessions.modal.subtitle}</p>
            {submitted ? (
              <div className={styles.successMsg}>{confessions.modal.successMsg}</div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                  className={`input-notebook ${styles.textarea}`}
                  placeholder={confessions.modal.placeholder}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={5}
                  maxLength={280}
                  required
                />
                <div className={styles.charCount}>{text.length}/280</div>
                <button type="submit" className="btn btn-coral" style={{ width: '100%', justifyContent: 'center' }}>
                  {confessions.modal.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
