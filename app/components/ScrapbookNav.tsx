'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ScrapbookNav.module.css';
import content from '@/data/content.json';

const { nav } = content;

export default function ScrapbookNav() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll progress washi tape */}
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <a href="#hero" className={styles.logo} onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}>
          <span className={styles.logoIcon}>{nav.logoIcon}</span>
          <span className={styles.logoText}>{nav.logoText} <strong>{nav.logoHighlight}</strong></span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {nav.links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.link}
                onClick={e => { 
                  if (link.href.startsWith('#')) {
                    e.preventDefault(); 
                    handleNavClick(link.href);
                  } else {
                    setMenuOpen(false);
                  }
                }}
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
            {nav.links.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={e => { 
                    if (link.href.startsWith('#')) {
                      e.preventDefault(); 
                      handleNavClick(link.href);
                    } else {
                      setMenuOpen(false);
                    }
                  }}
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
