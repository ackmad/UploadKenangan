'use client';

import { useState } from 'react';
import Link from 'next/link';
import content from '@/data/content.json';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';

const CATEGORIES = ["Semua", "Lucu", "Sedih", "Random", "Crush", "Persahabatan", "PKL", "Kelas", "Rahasia 😭"];

// We will augment the initial notes with some fake categories and likes
const initialStories = content.confessions.initialNotes.map((note, idx) => ({
  ...note,
  category: CATEGORIES[(idx % (CATEGORIES.length - 1)) + 1], // skip "Semua"
  likes: Math.floor(Math.random() * 50) + 5,
  reaction: ['😂', '🥺', '👀', '❤️', '🔥'][idx % 5]
}));

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [stories, setStories] = useState(initialStories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStoryText, setNewStoryText] = useState("");
  const [newStoryCat, setNewStoryCat] = useState("Random");
  const [newStoryAuthor, setNewStoryAuthor] = useState("Anonim");

  const filteredStories = activeCategory === "Semua" 
    ? stories 
    : stories.filter(s => s.category === activeCategory);

  const handleLike = (id: number) => {
    setStories(stories.map(s => 
      s.id === id ? { ...s, likes: s.likes + 1 } : s
    ));
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim()) return;

    const colors = ["#FFD166", "#FF9B9B", "#A8E6CF", "#C3B1E1", "#89C4E1", "#FFCBA4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRot = (Math.random() * 6 - 3).toFixed(1) + "deg";

    const newStory = {
      id: Date.now(),
      text: newStoryText,
      color: randomColor,
      rot: randomRot,
      author: newStoryAuthor || "Anonim",
      category: newStoryCat,
      likes: 0,
      reaction: '✨'
    };

    setStories([newStory, ...stories]);
    setNewStoryText("");
    setIsModalOpen(false);
  };

  return (
    <>
      <ScrapbookNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Things We Never Said Out Loud.</h1>
          <p className={styles.subtitle}>Semua orang menyimpan cerita. Beberapa cerita terlalu personal untuk dilupakan.</p>
        </div>

        <div className={styles.controls}>
          <button className={`btn btn-black ${styles.addBtn}`} onClick={() => setIsModalOpen(true)}>
            + Tulis Cerita Baru
          </button>
          
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* The Sticky Wall */}
        <div className={styles.wall}>
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <div 
                key={story.id} 
                className={styles.note} 
                style={{ 
                  backgroundColor: story.color, 
                  transform: `rotate(${story.rot})` 
                }}
              >
                <div className={styles.pin} />
                <div className={styles.noteCategory}>{story.category}</div>
                <p className={styles.noteText}>{story.text}</p>
                <div className={styles.noteFooter}>
                  <span className={styles.noteAuthor}>- {story.author}</span>
                  <div className={styles.reactions}>
                    <button onClick={() => handleLike(story.id)} className={styles.likeBtn}>
                      {story.reaction} {story.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>👻</span>
              <p>Belum ada cerita di kategori ini.</p>
            </div>
          )}
        </div>

        {/* Add Story Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>✕</button>
              <h2 className={styles.modalTitle}>📝 Tulis Ceritamu</h2>
              <p className={styles.modalSubtitle}>Anonim. Bebas. Jujur. Tidak ada yang tahu kamu yang nulis.</p>
              
              <form onSubmit={handleAddStory} className={styles.form}>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Hal-hal yang dulu nggak sempat diucapkan..."
                  value={newStoryText}
                  onChange={e => setNewStoryText(e.target.value)}
                  rows={5}
                  required
                />
                <div className={styles.formRow}>
                  <select 
                    className={styles.select}
                    value={newStoryCat}
                    onChange={e => setNewStoryCat(e.target.value)}
                  >
                    {CATEGORIES.filter(c => c !== "Semua").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Nama / Inisial (Opsional)" 
                    value={newStoryAuthor}
                    onChange={e => setNewStoryAuthor(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-coral btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  📌 Tempel ke Papan!
                </button>
              </form>
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <Link href="/" className="btn btn-black">Kembali ke Beranda</Link>
        </div>
      </main>
    </>
  );
}
