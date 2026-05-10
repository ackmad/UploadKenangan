'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ScrapbookNav.module.css';

const NAV_LINKS = [
  { href: '/',          label: '🏠 Home' },
  { href: '/students',  label: '🎓 Kelas & Siswa' },
  { href: '/nostalgia', label: '📷 Nostalgia' },
  { href: '/stories',   label: '💬 Stories' },
  { href: '/yearbook',  label: '📚 Yearbook' },
];

export default function ScrapbookNav() {
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

  return (
    <>
      {/* Scroll progress washi tape */}
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>📓</span>
          <span className={styles.logoText}>SKINFA<strong>VERSE21</strong></span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

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
          </ul>
        </div>
      </div>
    </>
  );
}
