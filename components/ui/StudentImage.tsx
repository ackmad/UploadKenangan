'use client';

import { useState } from 'react';
import styles from './StudentImage.module.css';

interface StudentImageProps {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
}

export default function StudentImage({ src, alt, fallback, className }: StudentImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${styles.imageContainer} ${className || ''}`}>
      {!loaded && <div className={styles.skeleton} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${loaded ? styles.loaded : ''}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src !== fallback) {
            target.src = fallback;
          }
          setLoaded(true);
        }}
        loading="lazy"
      />
    </div>
  );
}
