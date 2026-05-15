'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './FilmPlayer.module.css';

interface Props {
  onClose: () => void;
}

export default function FilmPlayer({ onClose }: Props) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simulate Netflix-style loading
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        // Faster initial load, slower near end (realistic buffering)
        const increment = prev < 30 ? 8 : prev < 70 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    // Video event listeners
    const handleLoadStart = () => {
      console.log('📹 Video loading started');
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsBuffering(false);
    };

    const handleCanPlayThrough = () => {
      console.log('✅ Video can play through');
      setIsReady(true);
      setIsBuffering(false);
      setLoadingProgress(100);
      clearInterval(loadingInterval);
      
      // Auto play after loading
      setTimeout(() => {
        video.play().then(() => {
          setIsPlaying(true);
          console.log('▶️ Video playing');
        }).catch(err => {
          console.error('❌ Video play failed:', err);
        });
      }, 500);
    };

    const handleWaiting = () => {
      console.log('⏳ Video buffering...');
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      console.log('▶️ Video playing');
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      setIsBuffering(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Preload video
    video.load();

    return () => {
      clearInterval(loadingInterval);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const handleClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    onClose();
  };

  return (
    <div className={styles.playerOverlay}>
      {/* Netflix-style Loading Screen */}
      {!isReady && (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingContent}>
            {/* Netflix N logo animation */}
            <div className={styles.netflixLogo}>
              <div className={styles.nLetter}>N</div>
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

      {/* Video Player */}
      <div className={`${styles.videoContainer} ${isReady ? styles.videoVisible : ''}`}>
        <video
          ref={videoRef}
          className={styles.video}
          preload="auto"
          playsInline
          controls={isReady}
        >
          <source src="/assets/video/FiilmAngkatan-3Tahun1Cerita1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Buffering indicator */}
        {isBuffering && isReady && (
          <div className={styles.bufferingIndicator}>
            <div className={styles.spinner} />
            <p>Buffering...</p>
          </div>
        )}

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
