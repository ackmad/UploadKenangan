'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const CATEGORIES = ["Semua", "Lucu", "Sedih", "Random", "Crush", "Persahabatan", "PKL", "Kelas", "Rahasia 😭"];

interface Story {
  id: string;
  text: string;
  color: string;
  rot: string;
  author: string;
  category: string;
  likes: number;
  reaction: string;
  createdAt?: any;
}

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStoryText, setNewStoryText] = useState("");
  const [newStoryCat, setNewStoryCat] = useState("Random");
  const [newStoryAuthor, setNewStoryAuthor] = useState("Anonim");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus note state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Mouse tilt logic for popup
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Real-time listener for Firestore
  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedStories: Story[] = [];
      snapshot.forEach((doc) => {
        fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
      });
      setStories(fetchedStories);
      
      // Update selected story if it changes in background (like count)
      setSelectedStory(prev => {
        if (!prev) return null;
        const updated = fetchedStories.find(s => s.id === prev.id);
        return updated || prev;
      });

      setLoading(false);
    }, (error) => {
      console.error("Error fetching stories: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStories = activeCategory === "Semua" 
    ? stories 
    : stories.filter(s => s.category === activeCategory);

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const storyRef = doc(db, 'stories', id);
      await updateDoc(storyRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking story: ", error);
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const colors = ["#FFD166", "#FF9B9B", "#A8E6CF", "#C3B1E1", "#89C4E1", "#FFCBA4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRot = (Math.random() * 6 - 3).toFixed(1) + "deg";
    const reactions = ['😂', '🥺', '👀', '❤️', '🔥', '✨'];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

    try {
      await addDoc(collection(db, 'stories'), {
        text: newStoryText,
        color: randomColor,
        rot: randomRot,
        author: newStoryAuthor.trim() || "Anonim",
        category: newStoryCat,
        likes: 0,
        reaction: randomReaction,
        createdAt: serverTimestamp()
      });
      
      setNewStoryText("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding story: ", error);
      alert("Gagal menambahkan cerita. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScrapbookNav />
      <main className={`${styles.main} ${selectedStory ? styles.blurBackground : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Papan Pesan & Cerita.</h1>
          <p className={styles.subtitle}>Tinggalkan catatan, pesan anonim, curhat, atau fun fact masa SMK. Bebas cerita apa saja, ini ruang kosong kita bersama.</p>
        </div>

        <div className={styles.controls}>
          <button className={`btn btn-black ${styles.addBtn}`} onClick={() => setIsModalOpen(true)}>
            + Tulis di Papan
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
          {loading ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⏳</span>
              <p>Memuat kenangan dari server...</p>
            </div>
          ) : filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <motion.div 
                key={story.id} 
                layoutId={`story-container-${story.id}`}
                className={styles.note} 
                style={{ 
                  backgroundColor: story.color, 
                  rotate: story.rot,
                  // We apply rotate here via framer-motion so layoutId works perfectly
                }}
                whileHover={{ scale: 1.05, rotate: 0, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStory(story)}
              >
                <motion.div layoutId={`pin-${story.id}`} className={styles.pin} />
                <motion.div layoutId={`cat-${story.id}`} className={styles.noteCategory}>{story.category}</motion.div>
                <motion.p layoutId={`text-${story.id}`} className={styles.noteText}>{story.text}</motion.p>
                <div className={styles.noteFooter}>
                  <motion.span layoutId={`author-${story.id}`} className={styles.noteAuthor}>- {story.author}</motion.span>
                  <div className={styles.reactions}>
                    <button onClick={(e) => handleLike(story.id, e)} className={styles.likeBtn}>
                      {story.reaction} {story.likes}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>👻</span>
              <p>Belum ada pesan atau cerita di kategori ini.</p>
            </div>
          )}
        </div>

        {/* Add Story Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>✕</button>
              <h2 className={styles.modalTitle}>📝 Tulis Pesan / Ceritamu</h2>
              <p className={styles.modalSubtitle}>Bisa anonim, bisa pakai nama. Curhat, kasih fun fact, atau sampaikan pesan yang belum pernah terucap.</p>
              
              <form onSubmit={handleAddStory} className={styles.form}>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Tulis pesan, fun fact, atau uneg-uneg masa SMK..."
                  value={newStoryText}
                  onChange={e => setNewStoryText(e.target.value)}
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
                <div className={styles.formRow}>
                  <select 
                    className={styles.select}
                    value={newStoryCat}
                    onChange={e => setNewStoryCat(e.target.value)}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <button type="submit" className="btn btn-coral btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                  {isSubmitting ? "Menempel..." : "📌 Tempel ke Papan!"}
                </button>
              </form>
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <Link href="/" className="btn btn-black">Kembali ke Beranda</Link>
        </div>
      </main>

      {/* Cinematic Focused Note Popup */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            className={styles.focusOverlay}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            onClick={() => setSelectedStory(null)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Background Glow matching the card color */}
            <motion.div 
              className={styles.ambientGlow}
              style={{ backgroundColor: selectedStory.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
            />

            <motion.div
              layoutId={`story-container-${selectedStory.id}`}
              className={styles.focusCard}
              style={{ 
                backgroundColor: selectedStory.color,
                rotateX,
                rotateY,
                rotate: 0 // Reset any rotation from wall
              }}
              ref={cardRef}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative tape for focus view */}
              <motion.div 
                className={styles.focusTape}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              />

              <motion.div layoutId={`pin-${selectedStory.id}`} className={styles.focusPin} />
              
              <div className={styles.focusContentWrapper}>
                <motion.div 
                  layoutId={`cat-${selectedStory.id}`} 
                  className={styles.focusCategory}
                >
                  {selectedStory.category}
                </motion.div>
                
                <motion.p 
                  layoutId={`text-${selectedStory.id}`} 
                  className={styles.focusText}
                >
                  {selectedStory.text}
                </motion.p>
                
                <motion.div layoutId={`author-${selectedStory.id}`} className={styles.focusAuthor}>
                  — {selectedStory.author}
                </motion.div>
              </div>

              {/* Interaction Bar */}
              <motion.div 
                className={styles.interactionBar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              >
                <motion.button 
                  className={styles.focusLikeBtn}
                  onClick={(e) => handleLike(selectedStory.id, e)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9, y: 2 }}
                >
                  <span className={styles.likeIcon}>{selectedStory.reaction}</span> 
                  <span className={styles.likeCount}>{selectedStory.likes}</span>
                </motion.button>

                <motion.button 
                  className={styles.shareBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(`Lihat cerita anonim ini: "${selectedStory.text.substring(0, 50)}..." di Papan Pesan SKINFAVERSE21`);
                    alert('Teks cerita disalin!');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  Share
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
