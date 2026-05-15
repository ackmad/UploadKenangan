import Link from 'next/link';
import { APP_AUTHOR, VERSION_LABEL } from '@/lib/version';
import styles from './Footer.module.css';
import content from '@/data/content.json';

const { school } = content.site;

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.schoolInfo}>
                    <h3 className={styles.schoolName}>{school.name}</h3>
                    <p className={styles.schoolAddress}>{school.address}</p>
                </div>

                <div className={styles.metaInfo}>
                    <span className={styles.credit}>
                        Dirancang &amp; Dikembangkan oleh{' '}
                        <strong>Ackmad Elfan Purnama</strong>
                    </span>
                    <span className={styles.dot} aria-hidden="true">·</span>
                    <span className={styles.year}>
                        Dibuat Tahun {currentYear}
                    </span>
                </div>
            </div>
        </footer>
    );
}
