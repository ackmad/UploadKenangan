'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import biodataList from '@/data/biodata_siswa.json';
import styles from './page.module.css';
import ScrapbookNav from '@/components/ui/ScrapbookNav';
import StudentImage from '@/components/ui/StudentImage';
import { useRouter } from 'next/navigation';

const CLASS_INFO: Record<string, any> = {
  rpl: {
    nama: 'RPL',
    namaLengkap: 'Rekayasa Perangkat Lunak',
    tagline: 'Kelas paling ribut tapi paling susah dilupain',
    warna: '#FF6B6B',
    warnaSecondary: '#FFE66D',
    emoji: '💻',
    deskripsi: 'Tempat dimana kode bukan cuma angka dan huruf, tapi jadi solusi. Kelas yang penuh dengan debugging, error 404, dan tawa di tengah deadline.',
  },
  tkj: {
    nama: 'TKJ',
    namaLengkap: 'Teknik Komputer & Jaringan',
    tagline: 'Tempat semua cerita random dimulai',
    warna: '#4ECDC4',
    warnaSecondary: '#95E1D3',
    emoji: '🔧',
    deskripsi: 'Kelas yang selalu sibuk ngoprek hardware, crimping kabel, dan troubleshooting jaringan. Tapi di balik keseriusan itu, banyak cerita absurd yang bikin ngakak.',
  },
  dkv: {
    nama: 'DKV',
    namaLengkap: 'Desain Komunikasi Visual',
    tagline: 'Kelas paling aesthetic dan kreatif',
    warna: '#C77DFF',
    warnaSecondary: '#E0AAFF',
    emoji: '🎨',
    deskripsi: 'Kelas yang penuh warna, kreativitas tanpa batas, dan hasil karya yang selalu bikin wow. Dari poster sampai video, semuanya jadi masterpiece.',
  },
};

interface StudentPhoto {
  publicId: string;
  url: string;
  studentName: string;
  studentId: number | null;
  jurusan: string;
}

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.classId.toLowerCase();
  const classInfo = CLASS_INFO[classId];
  const router = useRouter();

  const [photos, setPhotos] = useState<StudentPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  if (!classInfo) {
    notFound();
  }

  // Get students for this class
  const jurusan = classInfo.nama;
  const siswaKelas = biodataList.filter(s => s.kelas === jurusan);
  const laki = siswaKelas.filter(s => s.jenis_kelamin === 'Laki-laki').length;
  const perempuan = siswaKelas.filter(s => s.jenis_kelamin === 'Perempuan').length;

  // Get Wali Kelas from content.json
  const allContent = require('@/data/content.json');
  const waliKelas = allContent.teachers.list.find((t: any) => 
    t.role === 'Wali Kelas' && t.mapel.includes(jurusan)
  );

  // Fetch photos from Cloudinary
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/students/photos?jurusan=${jurusan}`);
        const data = await response.json();
        if (data.success) {
          setPhotos(data.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [jurusan]);

  // Match student with photo
  const defaultPlaceholder = '/images/placeholder-student.jpg';

  const getStudentPhoto = (student: typeof siswaKelas[0]) => {
    if (loading || photos.length === 0) {
      return defaultPlaceholder; // Use placeholder while loading
    }

    // Try to find matching photo by ID first (most accurate)
    const idMatched = photos.find(photo => photo.studentId === student.id);
    if (idMatched) {
      return idMatched.url;
    }

    // Fallback: Try to find matching photo by name
    const normalizedName = student.nama.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    const matchedPhoto = photos.find(photo => {
      const photoName = photo.studentName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      return photoName.includes(normalizedName) || 
             normalizedName.includes(photoName);
    });

    return matchedPhoto ? matchedPhoto.url : defaultPlaceholder;
  };

  return (
    <>
      <ScrapbookNav />
      
      {/* Cinematic Background Layer */}
      <div className={styles.grainOverlay}></div>
      <div className={styles.vignette}></div>

      {/* Floating Decorations */}
      <div className={styles.decorations}>
        <span className={styles.decor} style={{ top: '15%', left: '5%', '--d': '25s', '--r': '5deg' } as any}>📚</span>
        <span className={styles.decor} style={{ top: '45%', right: '8%', '--d': '30s', '--r': '-8deg' } as any}>✨</span>
        <span className={styles.decor} style={{ top: '75%', left: '10%', '--d': '22s', '--r': '12deg' } as any}>📷</span>
        <span className={styles.decor} style={{ bottom: '15%', right: '12%', '--d': '28s', '--r': '-5deg' } as any}>🎨</span>
        <span className={styles.decor} style={{ top: '30%', left: '85%', '--d': '35s', '--r': '15deg' } as any}>✏️</span>
      </div>

      <main className={styles.main} style={{ '--class-color': classInfo.warna, '--class-secondary': classInfo.warnaSecondary } as React.CSSProperties}>
        
        {/* Back Navigation */}
        <div className={styles.backNav}>
          <button onClick={() => router.back()} className="btn btn-black btn-sm">
            ← Kembali
          </button>
        </div>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroGlow}></div>
          <div className={styles.heroEmoji}>{classInfo.emoji}</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroKelas}>{classInfo.nama}</span>
            <span className={styles.heroNamaLengkap}>{classInfo.namaLengkap}</span>
          </h1>
          <p className={styles.heroTagline}>&quot;{classInfo.tagline}&quot;</p>
          <p className={styles.heroDeskripsi}>{classInfo.deskripsi}</p>

          {/* Stats */}
          <div className={styles.heroStats}>
            <div className={styles.statBox}>
              <span className={styles.statIcon}>👥</span>
              <span className={styles.statNumber}>{siswaKelas.length}</span>
              <span className={styles.statLabel}>Total Siswa</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statIcon}>👨</span>
              <span className={styles.statNumber}>{laki}</span>
              <span className={styles.statLabel}>Laki-laki</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statIcon}>👩</span>
              <span className={styles.statNumber}>{perempuan}</span>
              <span className={styles.statLabel}>Perempuan</span>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerIcon}>🎞️</span>
        </div>

        {/* Wali Kelas Section */}
        {waliKelas && (
          <section className={styles.teacherSection}>
            <div className={styles.teacherCard}>
              <div className={styles.teacherTape}></div>
              <div className={styles.teacherImageWrap}>
                <img src={waliKelas.foto} alt={waliKelas.nama} className={styles.teacherImage} />
              </div>
              <div className={styles.teacherContent}>
                <span className={styles.teacherRole}>Wali Kelas {jurusan}</span>
                <h2 className={styles.teacherName}>{waliKelas.nama}</h2>
                <blockquote className={styles.teacherQuote}>
                  &quot;{waliKelas.quote_khas}&quot;
                </blockquote>
                <div className={styles.teacherMessage}>
                  <p>{waliKelas.pesan}</p>
                </div>
              </div>
              <div className={styles.tornEdge}></div>
            </div>
          </section>
        )}

        {/* Section Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerIcon}>📓</span>
        </div>

        {/* Students Section */}
        <section className={styles.studentsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Isi Semesta Kelas Ini</h2>
            <p className={styles.sectionSubtitle}>
              Kenalan dengan setiap individu yang bikin kelas ini spesial
            </p>
          </div>

          <div className={styles.studentsGrid}>
            {siswaKelas.map((siswa, idx) => {
              const photoSource = getStudentPhoto(siswa);

              return (
                <Link
                  key={siswa.id}
                  href={`/students/${siswa.id}`}
                  className={styles.studentCard}
                  style={{
                    animationDelay: `${(idx % 20) * 0.04}s`,
                    '--rotation': `${(idx % 2 === 0 ? 1 : -1) * (1 + (idx % 3))}deg`,
                    '--sticky-color': ['#FFF740', '#FF7EB9', '#7AFCFF', '#FEFF9C', '#FF9B9B'][idx % 5],
                  } as React.CSSProperties}
                >
                  <div className={styles.cardPhotoWrap}>
                    <StudentImage 
                      src={photoSource} 
                      alt={siswa.nama} 
                      fallback={defaultPlaceholder} 
                      className={styles.cardPhoto}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardId}>#{siswa.id}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{siswa.nama}</h3>
                    
                    <div className={styles.cardFooter}>
                      <span className={styles.viewProfile}>Lihat Profil →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <Link href="/students" className="btn btn-coral btn-lg">
            Lihat Kelas Lainnya
          </Link>
        </div>
      </main>
    </>
  );
}
