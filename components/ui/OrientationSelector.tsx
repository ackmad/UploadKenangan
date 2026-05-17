'use client';

import { useState } from 'react';
import styles from './OrientationSelector.module.css';

interface Props {
  onSelect: (orientation: 'portrait' | 'landscape') => void;
  onCancel: () => void;
}

export default function OrientationSelector({ onSelect, onCancel }: Props) {
  const [selected, setSelected] = useState<'portrait' | 'landscape' | null>(null);

  const handleSelect = async (orientation: 'portrait' | 'landscape') => {
    setSelected(orientation);
    
    try {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        await (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }

      // Lock orientation
      if (screen.orientation && screen.orientation.lock) {
        try {
          await screen.orientation.lock(orientation);
        } catch (err) {
          console.log('Orientation lock not supported:', err);
        }
      }
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }

    // Proceed with selected orientation
    onSelect(orientation);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel}>✕</button>
        
        <h2 className={styles.title}>Pilih Orientasi Layar</h2>
        <p className={styles.subtitle}>Untuk pengalaman terbaik, pilih orientasi yang Anda inginkan</p>
        
        <div className={styles.options}>
          <button 
            className={`${styles.optionBtn} ${selected === 'portrait' ? styles.selected : ''}`}
            onClick={() => handleSelect('portrait')}
          >
            <div className={styles.iconPortrait}>
              <div className={styles.phoneIcon}>📱</div>
            </div>
            <span className={styles.optionLabel}>Portrait</span>
            <span className={styles.optionDesc}>Vertikal</span>
          </button>
          
          <button 
            className={`${styles.optionBtn} ${selected === 'landscape' ? styles.selected : ''}`}
            onClick={() => handleSelect('landscape')}
          >
            <div className={styles.iconLandscape}>
              <div className={styles.phoneIcon}>📱</div>
            </div>
            <span className={styles.optionLabel}>Landscape</span>
            <span className={styles.optionDesc}>Horizontal</span>
          </button>
        </div>
        
        <p className={styles.note}>
          💡 Layar akan otomatis masuk ke mode fullscreen
        </p>
      </div>
    </div>
  );
}
