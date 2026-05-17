'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './FilmPlayer.module.css';

interface Props {
  onClose: () => void;
}

export default function FilmPlayer({ onClose }: Props) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube video ID
  const YOUTUBE_VIDEO_ID = 'tR3KkDRbop8';
  
  // YouTube embed URL with maximum quality parameters
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080&quality=hd1080&hd=1&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  useEffect(() => {
    // Simulate Netflix-style loading
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        // Faster initial load, slower near end
        const increment = prev < 30 ? 10 : prev < 70 ? 5 : 3;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // Set ready after loading animation
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
      clearInterval(loadingInterval);
      setLoadingProgress(100);
    }, 2000);

    return () => {
      clearInterval(loadingInterval);
      clearTimeout(readyTimeout);
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.playerOverlay}>
      {/* Netflix-style Loading Screen */}
      {!isReady && (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            {/* VISIONINE V logo animation */}
            <div className={styles.netflixLogo}>
              <div className={styles.nLetter}>V</div>
            </div>
            
            {/* Loading bar */}
            <div className={styles.loadingBarContainer}>
              <div className={styles.loadingBar}>
                <div 
                  className={styles.loadingBarFill} 
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className={styles.loadingText}>
                {loadingProgress < 100 ? 'Memuat film...' : 'Siap diputar'}
              </div>
            </div>

            {/* Loading percentage */}
            <div className={styles.loadingPercentage}>
              {Math.round(loadingProgress)}%
            </div>
          </div>

          {/* Animated background */}
          <div className={styles.loadingBg}>
            <div className={styles.loadingBgGradient} />
          </div>
        </div>
      )}

      {/* YouTube Player */}
      <div className={`${styles.videoContainer} ${isReady ? styles.videoVisible : ''}`}>
        <iframe
          ref={iframeRef}
          className={styles.youtubePlayer}
          src={youtubeEmbedUrl}
          title="SKINFAVERSE21 - 3 Tahun 1 Cerita"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Close button */}
        {isReady && (
          <button className={styles.closeBtn} onClick={handleClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
