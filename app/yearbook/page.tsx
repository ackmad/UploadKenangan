'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import FlipBook from '@/components/ui/FlipBook';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

export default function YearbookPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch pages from Cloudinary
  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/yearbook?folder=SKINFAVERSE21/AlbumKenangan');
      const data = await response.json();
      
      if (data.success) {
        setPages(data.pages);
        setPdfUrl(data.pdfUrl);
        console.log(`✅ Loaded ${data.totalPages} pages`);
      } else {
        console.error('❌ Failed to load pages:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBook = async () => {
    if (pages.length === 0) {
      await fetchPages();
    }
    setIsBookOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!pdfUrl) {
      alert('PDF belum tersedia');
      return;
    }

    setIsDownloading(true);
    try {
      // Download from Cloudinary
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SKINFAVERSE21-Album-Kenangan.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ PDF downloaded');
    } catch (error) {
      console.error('❌ Download failed:', error);
      alert('Gagal mendownload PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintVersion = () => {
    if (!pdfUrl) {
      alert('PDF belum tersedia');
      return;
    }
    
    // Open PDF in new tab for printing
    window.open(pdfUrl, '_blank');
  };

  return (
    <>
      <ScrapbookNav />
      
      {/* FlipBook Modal */}
      {isBookOpen && pages.length > 0 && (
        <FlipBook 
          pages={pages} 
          onClose={() => setIsBookOpen(false)} 
        />
      )}
      
      <main className={styles.main}>

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.heroTag}>📚 Album Digital</div>
            <h1 className={styles.heroTitle}>Every Page Holds<br />A Memory.</h1>
            <p className={styles.heroSub}>
              Bukan sekadar buku tahunan. Ini kapsul waktu Angkatan 21.
            </p>
          </div>
          <div className={styles.heroPreview}>
            <div className={styles.bookCover}>
              <div className={styles.bookSpine} />
              <div className={styles.bookFace}>
                <p className={styles.bookYear}>2026</p>
                <p className={styles.bookTitle}>SKINFAVERSE</p>
                <p className={styles.bookTitle21}>21</p>
                <p className={styles.bookSub}>Album Kenangan Digital</p>
                <div className={styles.bookStar}>⭐</div>
              </div>
            </div>
          </div>
        </header>

        {/* ACTION BUTTONS */}
        <div className={styles.actionRow}>
          <button 
            className="btn btn-black btn-lg"
            onClick={handleOpenBook}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Memuat...' : '📖 Buka Album'}
          </button>
          <button 
            className="btn btn-yellow btn-lg"
            onClick={handleDownloadPDF}
            disabled={isDownloading || !pdfUrl}
          >
            {isDownloading ? '⏳ Downloading...' : '⬇️ Download PDF'}
          </button>
          <button 
            className="btn btn-coral btn-lg"
            onClick={handlePrintVersion}
            disabled={!pdfUrl}
          >
            🖨️ Print Version
          </button>
        </div>

      </main>
    </>
  );
}
