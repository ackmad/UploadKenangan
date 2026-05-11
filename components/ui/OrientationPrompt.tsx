'use client';

import { useState } from 'react';
import styles from './OrientationPrompt.module.css';

interface Props {
  onChoose: (wantsLandscape: boolean) => void;
}

export default function OrientationPrompt({ onChoose }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  const handleChoice = (wantsLandscape: boolean) => {
    setIsExiting(true);
    setTimeout(() => onChoose(wantsLandscape), 400);
  };

  return (
    <div className={`${styles.overlay} ${isExiting ? styles.overlayExit : ''}`}>
      <div className={`${styles.modal} ${isExiting ? styles.modalExit : ''}`}>
        <div className={styles.icon}>📱 ↔️ 🖼️</div>
        
        <h2 className={styles.title}>Pengalaman Terbaik</h2>
        
        <p className={styles.desc}>
          Untuk pengalaman visual yang lebih immersive, kami sarankan menonton dalam mode <strong>landscape</strong> (layar horizontal).
        </p>

        <div className={styles.buttons}>
          <button 
            onClick={() => handleChoice(true)} 
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <span className={styles.btnIcon}>✨</span>
            Ya, Mode Landscape
          </button>
          
          <button 
            onClick={() => handleChoice(false)} 
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Tetap Portrait
          </button>
        </div>

        <p className={styles.hint}>
          Kamu bisa ubah orientasi kapan saja nanti
        </p>
      </div>
    </div>
  );
}
