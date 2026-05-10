'use client';
import { useState } from 'react';
import styles from './NotesSection.module.css';
import content from '@/data/content.json';

const { notes: notesContent } = content;
const NOTE_COLORS = ['#FFF8E1', '#F3E5F5', '#E3F2FD', '#E8F5E9', '#FCE4EC', '#FFF3E0'];

export default function NotesSection() {
  const [notes, setNotes] = useState(notesContent.initialNotes);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const newNote = {
      id: Date.now(),
      name: name.trim(),
      msg: msg.trim(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      time: 'Baru saja',
    };
    setNotes(prev => [newNote, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setName(''); setMsg(''); }, 2000);
  };

  return (
    <section id="notes" className={`section ${styles.section}`}>
      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--mint)', boxShadow: 'var(--shadow-sm)' }}>{notesContent.sectionTag}</span>
        <h2 className={styles.title}>{notesContent.title}<br /><em>{notesContent.titleEm}</em></h2>
        <p className={styles.subtitle}>{notesContent.subtitle}</p>
      </div>

      <div className={styles.layout}>
        {/* Form */}
        <div className={styles.formWrap}>
          <div className={styles.formCard}>
            <div className={styles.formTape} />
            <h3 className={styles.formTitle}>{notesContent.form.title}</h3>
            <p className={styles.formSub}>{notesContent.form.subtitle}</p>

            {submitted ? (
              <div className={styles.successMsg}>
                <span>💌</span>
                <p>{notesContent.form.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Namamu</label>
                  <input
                    type="text"
                    className="input-notebook"
                    placeholder={notesContent.form.namePlaceholder}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={40}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Pesanmu</label>
                  <textarea
                    className="input-notebook"
                    placeholder={notesContent.form.msgPlaceholder}
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    rows={4}
                    maxLength={300}
                    required
                  />
                  <span className={styles.charCount}>{msg.length}/300</span>
                </div>
                <button type="submit" className="btn btn-sage" style={{ width: '100%', justifyContent: 'center' }}>
                  {notesContent.form.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Notes masonry */}
        <div className={styles.masonry}>
          {notes.map((note, i) => (
            <div key={note.id} className={styles.noteCard} style={{ background: note.color, animationDelay: `${i * 0.05}s` }}>
              <div className={styles.noteHeader}>
                <div className={styles.avatar}>{note.name[0].toUpperCase()}</div>
                <div>
                  <p className={styles.noteName}>{note.name}</p>
                  <p className={styles.noteTime}>{note.time}</p>
                </div>
              </div>
              <p className={styles.noteMsg}>{note.msg}</p>
              {/* Fold corner effect */}
              <div className={styles.foldCorner} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
