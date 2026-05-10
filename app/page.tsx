'use client';

import ScrapbookNav from './components/ScrapbookNav';
import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import GallerySection from './components/GallerySection';
import ConfessionsSection from './components/ConfessionsSection';
import HallOfFameSection from './components/HallOfFameSection';
import NotesSection from './components/NotesSection';
import ProfileSection from './components/ProfileSection';

export default function ScrapbookPage() {
  return (
    <>
      <ScrapbookNav />
      <HeroSection />
      <TimelineSection />
      <GallerySection />
      <ConfessionsSection />
      <HallOfFameSection />
      <NotesSection />
      <ProfileSection />
    </>
  );
}
