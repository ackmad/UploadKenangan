'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ScrapbookNav from './components/ScrapbookNav';
import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import GallerySection from './components/GallerySection';
import ConfessionsSection from './components/ConfessionsSection';
import FilmSection from './components/FilmSection';
import ProfileSection from './components/ProfileSection';

// Lazy-load splash so it doesn't block first paint
const SplashScreen = dynamic(() => import('./components/SplashScreen'), { ssr: false });

export default function ScrapbookPage() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <ScrapbookNav />
        <HeroSection />
        <TimelineSection />
        <GallerySection />
        <FilmSection />
        <ConfessionsSection />
        <ProfileSection />
      </div>
    </>
  );
}
