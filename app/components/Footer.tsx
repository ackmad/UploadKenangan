import Link from 'next/link';
import { APP_AUTHOR, VERSION_LABEL } from '@/lib/version';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* Made with love */}
                <span className={styles.credit}>
                    Made with{' '}
                    <span className={styles.heart} aria-label="love">♥</span>
                    {' '}by{' '}
                    <a
                        href={APP_AUTHOR.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.authorLink}
                        aria-label={`Instagram ${APP_AUTHOR.handle}`}
                    >
                        {APP_AUTHOR.name}
                    </a>
                </span>

                <span className={styles.dot} aria-hidden="true">·</span>

                {/* Version badge */}
                <span className={styles.version} title={`Versi aplikasi ${VERSION_LABEL}`}>
                    {VERSION_LABEL}
                </span>
            </div>
        </footer>
    );
}
