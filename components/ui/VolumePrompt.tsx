'use client';

import { useState } from 'react';
import styles from './VolumePrompt.module.css';

interface Props {
  onReady: () => void;
}

export default function VolumePrompt({ onReady }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  const handleReady = () => {
    // Unlock audio context by playing a silent sound
    // This ensures subsequent audio plays will work
    const unlockAudio = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      console.log('✅ Audio context unlocked');
    };
    
    try {
      unlockAudio();
    } catch (e) {
      console.warn('⚠️ Could not unlock audio context:', e);
    }
    
    setIsExiting(true);
    setTimeout(() => onReady(), 400);
  };

  return (
    <div className={`${styles.overlay} ${isExiting ? styles.overlayExit : ''}`}>
      <div className={`${styles.modal} ${isExiting ? styles.modalExit : ''}`}>
        <div className={styles.icon}>🔊</div>
        
        <h2 className={styles.title}>Satu Hal Lagi...</h2>
        
        <p className={styles.desc}>
          Pastikan <strong>volume</strong> kamu sudah cukup keras ya, biar pengalaman audiovisualnya lebih terasa! 🎵
        </p>

        <div className={styles.volumeVisual}>
          <div className={styles.volumeBars}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
          <div className={styles.volumeText}>🔊</div>
        </div>

        <button onClick={handleReady} className={styles.btn}>
          <span className={styles.btnIcon}>✨</span>
          Siap, Mulai Sekarang!
        </button>

        <p className={styles.hint}>
          Gunakan headphone untuk pengalaman terbaik
        </p>
      </div>
    </div>
  );
}
