'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import biodataList from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import StudentImage from '@/components/ui/StudentImage';
import { useRouter } from 'next/navigation';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const student = biodataList.find(s => s.id.toString() === studentId);
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultPlaceholder = '/images/placeholder-student.jpg';

  useEffect(() => {
    async function fetchPhoto() {
      if (!student) return;
      try {
        const response = await fetch(`/api/students/photos?jurusan=${student.kelas}`);
        const data = await response.json();
        if (data.success && data.photos) {
          // Find photo by ID first
          const matched = data.photos.find((p: any) => p.studentId === student.id);
          if (matched) {
            setPhoto(matched.url);
          } else {
            // Fallback to name match
            const normalizedName = student.nama.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            const nameMatched = data.photos.find((p: any) => {
              const photoName = p.studentName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
              return photoName.includes(normalizedName) || normalizedName.includes(photoName);
            });
            if (nameMatched) setPhoto(nameMatched.url);
          }
        }
      } catch (error) {
        console.error('Error fetching student photo:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhoto();
  }, [student, studentId]);

  if (!student) {
    notFound();
  }

  // Generate some pseudo-random but consistent elements based on ID
  const seed = parseInt(studentId);
  const randomTape = seed % 2 === 0 ? styles.tapeYellow : styles.tapePink;
  const rotation = (seed % 5) - 2; // -2 to +2
  const isDKV = student.kelas === 'DKV';
  const isRPL = student.kelas === 'RPL';
  
  const themeClass = isDKV ? styles.themeDkv : isRPL ? styles.themeRpl : styles.themeTkj;

  const handleSaveBirthday = () => {
    if (!student) return;
    const name = student.nama;
    const dateStr = student.tempat_tanggal_lahir.split(',').pop()?.trim() || '';
    
    const months: Record<string, string> = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12',
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'jun': '06', 'jul': '07', 'agu': '08', 'sep': '09',
      'okt': '10', 'nov': '11', 'des': '12'
    };

    const parts = dateStr.split(' ');
    let yyyymmdd = '';
    
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1].toLowerCase();
      const year = parts[2];
      
      let month = '01';
      for (const [key, val] of Object.entries(months)) {
        if (monthStr.startsWith(key)) {
          month = val;
          break;
        }
      }
      
      const startDate = new Date(`${year}-${month}-${day}T00:00:00`);
      if (!isNaN(startDate.getTime())) {
        const startStr = `${year}${month}${day}`;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const endYear = endDate.getFullYear();
        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDate.getDate()).padStart(2, '0');
        const endStr = `${endYear}${endMonth}${endDay}`;
        yyyymmdd = `${startStr}/${endStr}`;
      }
    }

    if (!yyyymmdd) {
      const today = new Date();
      const startYear = today.getFullYear();
      const startMonth = String(today.getMonth() + 1).padStart(2, '0');
      const startDay = String(today.getDate()).padStart(2, '0');
      const startStr = `${startYear}${startMonth}${startDay}`;
      today.setDate(today.getDate() + 1);
      const endYear = today.getFullYear();
      const endMonth = String(today.getMonth() + 1).padStart(2, '0');
      const endDay = String(today.getDate()).padStart(2, '0');
      const endStr = `${endYear}${endMonth}${endDay}`;
      yyyymmdd = `${startStr}/${endStr}`;
    }

    const title = encodeURIComponent(`Ulang Tahun ${name}`);
    const details = encodeURIComponent(`Ulang tahun ${name} dari SKINFA Angkatan 21! 🎉`);
    
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${yyyymmdd}&recur=RRULE:FREQ=YEARLY&details=${details}&transp=transparent`;
    window.open(url, '_blank');
  };

  return (
    <>
      <ScrapbookNav />
      <main className={`${styles.main} ${themeClass}`}>
        
        {/* Navigation Back */}
        <div className={styles.backNav}>
          <button onClick={() => router.back()} className="btn btn-black btn-sm">
            ← Kembali
          </button>
        </div>

        {/* HERO SECTION */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.tagline}>Beberapa orang hadir bukan cuma untuk lewat… tapi untuk jadi bagian dari cerita.</span>
            <h1 className={styles.nickname}>{student.nama}</h1>
            
            <div className={styles.badges}>
              <span className={styles.badgeClass}>{student.kelas}</span>
            </div>
            
            <div className={styles.quoteBox}>
              <div className={styles.tape} />
              <p>&quot;{student.quote_favorit || student.motto_hidup || 'Jalani saja sebaik mungkin.'}&quot;</p>
            </div>
          </div>

          <div className={styles.heroImageWrap} style={{ transform: `rotate(${rotation}deg)` }}>
            <div className={`${styles.tape} ${randomTape}`} />
            <StudentImage 
              src={photo || defaultPlaceholder} 
              alt={student.nama} 
              fallback={defaultPlaceholder}
              className={styles.heroImage}
            />
            <div className={styles.doodleStar}>✨</div>
          </div>
        </header>

        {/* DETAILS SECTION */}
        <div className={styles.detailsGrid}>
          
          {/* Tentang Saya Sticky Note */}
          <section className={`${styles.stickyNote} ${styles.noteBlue}`}>
            <div className={styles.pin} />
            <h3 className={styles.noteTitle}>Tentang Saya 📌</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🎂</span>
                <div className={styles.infoContent}>
                  <label>Tempat/Tgl Lahir</label>
                  <p>{student.tempat_tanggal_lahir}</p>
                  <button 
                    className={styles.saveBirthdayBtn}
                    onClick={handleSaveBirthday}
                  >
                    Simpan Ulang Tahun 🔔
                  </button>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🏠</span>
                <div className={styles.infoContent}>
                  <label>Alamat</label>
                  <p>{student.alamat}</p>
                </div>
              </div>

              {student.instagram && student.instagram !== '-' && student.instagram !== '.' && (
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📸</span>
                  <div className={styles.infoContent}>
                    <label>Instagram</label>
                    <a 
                      href={`https://www.instagram.com/${student.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.igLink}
                    >
                      @{student.instagram.replace('@', '')}
                    </a>
                  </div>
                </div>
              )}

              {student.no_hp && (
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📱</span>
                  <div className={styles.infoContent}>
                    <label>No. HP</label>
                    <p>{student.no_hp}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Hobi & Motto Scrapbook Paper */}
          <section className={styles.scrapPaper}>
            <div className={`${styles.tape} ${styles.tapeYellow} ${styles.tapeTopLeft}`} />
            <h3 className={styles.scrapTitle}>Hobi & Motto 🚀</h3>
            <div className={styles.scrapContent}>
              <div className={styles.scrapBlock}>
                <h4>Hobi:</h4>
                <p>{student.hobi || 'Rebahan sambil scroll TikTok'}</p>
              </div>
              <div className={styles.scrapBlock}>
                <h4>Motto Hidup:</h4>
                <p>{student.motto_hidup || 'Jalani hidup sebaik mungkin'}</p>
              </div>
            </div>
          </section>

          {/* Quote Favorit Torn Paper */}
          <section className={styles.tornPaper}>
            <h3 className={styles.tornTitle}>Quote Favorit 💬</h3>
            <p className={styles.tornText}>
              {student.quote_favorit || 'Semoga kita semua sukses ya! Jangan lupakan kenangan selama di SKINFA.'}
            </p>
            <div className={styles.doodleHeart}>❤️</div>
          </section>

        </div>
        
        <div className={styles.bottomNav}>
          <Link href={`/students/${parseInt(resolvedParams.id) + 1}`} className="btn btn-coral">
            Lihat Siswa Selanjutnya →
          </Link>
        </div>
      </main>
    </>
  );
}
