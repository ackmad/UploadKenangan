import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMK Angkatan 2026 – Digital Memory Archive',
  description:
    'Arsip digital kenangan seluruh siswa angkatan 2026 SMK — kelas RPL, TKJ, dan DKV. Simpan dan lihat kembali momen terbaik tiga tahun perjalanan kita.',
  openGraph: {
    title: 'SMK Angkatan 2026 – Digital Memory Archive',
    description: 'Tiga Tahun. Seribu Cerita. Satu Kenangan.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
