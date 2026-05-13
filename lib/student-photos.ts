/**
 * Utility functions for matching student photos from Cloudinary
 */

interface StudentPhoto {
  publicId: string;
  url: string;
  studentName: string;
  jurusan: string;
}

interface Student {
  id: number;
  kelas: string;
  nama: string;
  jenis_kelamin: string;
  tempat_tanggal_lahir: string;
  alamat: string;
  no_hp: string;
  instagram: string;
  hobi: string;
  motto_hidup: string;
  quote_favorit: string;
  timestamp: string;
}

const DEFAULT_PLACEHOLDER = '/images/placeholder-student.jpg';

/**
 * Normalize string for comparison (lowercase, remove special chars, trim spaces)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);

  if (s1 === s2) return 1;

  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }

  // Check word overlap
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const commonWords = words1.filter(w => words2.includes(w));
  
  if (commonWords.length > 0) {
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  return 0;
}

/**
 * Find best matching photo for a student
 */
export function findStudentPhoto(
  student: Student,
  photos: StudentPhoto[]
): string {
  // Filter photos by kelas first
  const kelasPhotos = photos.filter(p => p.jurusan === student.kelas);

  if (kelasPhotos.length === 0) {
    return DEFAULT_PLACEHOLDER; // Return default placeholder
  }

  let bestMatch: StudentPhoto | null = null;
  let bestScore = 0;

  for (const photo of kelasPhotos) {
    // Match with nama
    const nameScore = calculateSimilarity(student.nama, photo.studentName);

    if (nameScore > bestScore) {
      bestScore = nameScore;
      bestMatch = photo;
    }
  }

  // Only use matched photo if confidence is high enough (>0.5)
  if (bestMatch && bestScore > 0.5) {
    return bestMatch.url;
  }

  return DEFAULT_PLACEHOLDER; // Return default placeholder if no good match
}

/**
 * Match all students with their photos
 */
export function matchStudentsWithPhotos(
  students: Student[],
  photos: StudentPhoto[]
): (Student & { matchedPhoto: string })[] {
  return students.map(student => ({
    ...student,
    matchedPhoto: findStudentPhoto(student, photos),
  }));
}

/**
 * Get photo URL from Cloudinary public ID
 */
export function getCloudinaryPhotoUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,g_face,q_auto,f_auto/${publicId}`;
}
