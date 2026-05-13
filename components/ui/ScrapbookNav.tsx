'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ScrapbookNav.module.css';

const NAV_LINKS = [
  { href: '/',          label: '🏠 Home' },
  { href: '/students',  label: '🎓 Kelas & Siswa' },
  { href: '/nostalgia', label: '📷 Nostalgia' },
  { href: '/stories',   label: '💬 Papan Pesan' },
  { href: '/yearbook',  label: '📚 Yearbook' },
];

interface Props {
  onReplaySequence?: () => void;
}

export default function ScrapbookNav({ onReplaySequence }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(progress);
      setScrolled(el.scrollTop > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isNetflix = pathname === '/film';

  return (
    <>
      {/* Scroll progress washi tape - Hidden in Netflix mode */}
      {!isNetflix && <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />}

      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''} ${isNetflix ? styles.netflixNav : ''} ${isNetflix && scrolled ? styles.netflixNavScrolled : ''}`}>
        <Link href="/" className={styles.logo}>
          {!isNetflix && <span className={styles.logoIcon}>📓</span>}
          <span className={styles.logoText}>SKINFA<strong>VERSE21</strong></span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(link => {
            // Strip emojis for Netflix mode
            const label = isNetflix ? link.label.replace(/[^\w\s&]/gi, '').trim() : link.label;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.rightActions}>
          {/* Replay button - only show if callback provided */}
          {onReplaySequence && (
            <button
              onClick={onReplaySequence}
              className={styles.replayBtn}
              title="Putar Ulang Welcome Sequence"
              aria-label="Putar Ulang Welcome Sequence"
            >
              <span className={styles.replayIcon}>🎬</span>
            </button>
          )}

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuInner}>
          <p className={styles.mobileMenuTitle}>📖 Menu</p>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Replay in mobile menu */}
            {onReplaySequence && (
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onReplaySequence();
                  }}
                  className={styles.mobileReplayBtn}
                >
                  🎬 Putar Ulang Intro
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
