'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import HeroSection from '@/components/sections/HeroSection';
import TimelineSection from '@/components/sections/TimelineSection';
import GallerySection from '@/components/sections/GallerySection';
import ConfessionsSection from '@/components/sections/ConfessionsSection';
import FilmSection from '@/components/sections/FilmSection';
import DirectorySection from '@/components/sections/DirectorySection';
import Footer from '@/components/ui/Footer';
import { VERSION_LABEL, APP_BUILD_DATE } from '@/lib/version';

// Lazy-load splash so it doesn't block first paint
const SplashScreen = dynamic(() => import('@/components/ui/SplashScreen'), { ssr: false });
const WelcomeSequence = dynamic(() => import('@/components/ui/WelcomeSequence'), { ssr: false });
const OrientationSelector = dynamic(() => import('@/components/ui/OrientationSelector'), { ssr: false });

export default function ScrapbookPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showSequence, setShowSequence] = useState(false);
  const [showOrientationSelector, setShowOrientationSelector] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<'portrait' | 'landscape' | null>(null);

  // Log version info on mount
  useState(() => {
    console.log(`%c🎓 SKINFAVERSE21 ${VERSION_LABEL}`, 'font-size: 16px; font-weight: bold; color: #FFD700;');
    console.log(`%c📅 Build Date: ${APP_BUILD_DATE}`, 'font-size: 12px; color: #888;');
    console.log(`%c✨ Lyrics Display: Enhanced`, 'font-size: 12px; color: #4CAF50;');
  });

  const handleSplashDone = useCallback(() => setShowSplash(false), []);
  
  const handleReplaySequence = useCallback(() => {
    // Show orientation selector first
    setShowOrientationSelector(true);
  }, []);

  const handleOrientationSelect = useCallback((orientation: 'portrait' | 'landscape') => {
    setSelectedOrientation(orientation);
    setShowOrientationSelector(false);
    setShowSequence(true);
  }, []);

  const handleOrientationCancel = useCallback(() => {
    setShowOrientationSelector(false);
  }, []);

  const handleSequenceComplete = useCallback(() => {
    setShowSequence(false);
    setSelectedOrientation(null);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {showOrientationSelector && (
        <OrientationSelector 
          onSelect={handleOrientationSelect} 
          onCancel={handleOrientationCancel}
        />
      )}
      {showSequence && <WelcomeSequence onComplete={handleSequenceComplete} />}

      {/* Version Badge - Fixed position */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        color: '#FFD700',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        fontFamily: 'monospace',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        {VERSION_LABEL} • {APP_BUILD_DATE}
      </div>

      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <ScrapbookNav onReplaySequence={handleReplaySequence} />
        <HeroSection />
        {/* <TimelineSection /> */}
        <GallerySection />
        <FilmSection />
        <ConfessionsSection />
        <DirectorySection />
        <Footer />
      </div>
    </>
  );
}
