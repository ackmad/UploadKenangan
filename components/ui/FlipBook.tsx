'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './FlipBook.module.css';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface Props {
  pages: Page[];
  onClose: () => void;
}

export default function FlipBook({ pages, onClose }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  // Total pages (including cover)
  const totalPages = pages.length;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  const handleNextPage = () => {
    if (isLastPage || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('next');
    
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };

  const handlePrevPage = () => {
    if (isFirstPage || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('prev');
    
    setTimeout(() => {
      setCurrentPage(prev => prev - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next page
        handleNextPage();
      } else {
        // Swipe right - prev page
        handlePrevPage();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      {/* Close button */}
      <button className={styles.closeBtn} onClick={onClose}>
        ✕
      </button>

      {/* Page counter */}
      <div className={styles.pageCounter}>
        <span className={styles.currentPageNum}>{currentPage + 1}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalPageNum}>{totalPages}</span>
      </div>

      {/* Book container */}
      <div 
        ref={bookRef}
        className={styles.bookContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.book}>
          {/* Current page (left side) */}
          <div className={styles.pageLeft}>
            {currentPage > 0 && (
              <div className={styles.pageContent}>
                <img 
                  src={pages[currentPage - 1]?.imageUrl} 
                  alt={`Page ${currentPage}`}
                  className={styles.pageImage}
                />
                <div className={styles.pageNumber}>{currentPage}</div>
              </div>
            )}
          </div>

          {/* Flipping page */}
          <div 
            className={`${styles.pageFlip} ${
              isFlipping && flipDirection === 'next' ? styles.flippingNext : ''
            } ${
              isFlipping && flipDirection === 'prev' ? styles.flippingPrev : ''
            }`}
          >
            <div className={styles.pageFront}>
              <div className={styles.pageContent}>
                <img 
                  src={pages[currentPage]?.imageUrl} 
                  alt={`Page ${currentPage + 1}`}
                  className={styles.pageImage}
                />
                <div className={styles.pageNumber}>{currentPage + 1}</div>
              </div>
            </div>
            <div className={styles.pageBack}>
              <div className={styles.pageContent}>
                {pages[currentPage + 1] && (
                  <>
                    <img 
                      src={pages[currentPage + 1]?.imageUrl} 
                      alt={`Page ${currentPage + 2}`}
                      className={styles.pageImage}
                    />
                    <div className={styles.pageNumber}>{currentPage + 2}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Current page (right side) */}
          <div className={styles.pageRight}>
            {currentPage < totalPages - 1 && (
              <div className={styles.pageContent}>
                <img 
                  src={pages[currentPage + 1]?.imageUrl} 
                  alt={`Page ${currentPage + 2}`}
                  className={styles.pageImage}
                />
                <div className={styles.pageNumber}>{currentPage + 2}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button 
        className={`${styles.navBtn} ${styles.navBtnPrev}`}
        onClick={handlePrevPage}
        disabled={isFirstPage || isFlipping}
        aria-label="Previous page"
      >
        ‹
      </button>
      <button 
        className={`${styles.navBtn} ${styles.navBtnNext}`}
        onClick={handleNextPage}
        disabled={isLastPage || isFlipping}
        aria-label="Next page"
      >
        ›
      </button>

      {/* Instructions */}
      <div className={styles.instructions}>
        <p>Gunakan tombol panah atau swipe untuk membalik halaman</p>
        <p className={styles.instructionsSub}>Tekan ESC untuk keluar</p>
      </div>
    </div>
  );
}
