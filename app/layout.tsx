import type { Metadata } from 'next';
import './globals.css';
import CountdownGate from '@/components/ui/CountdownGate';

export const metadata: Metadata = {
  title: 'SKINFAVERSE21 — Semesta Digital Angkatan 21',
  description: 'Platform digital interaktif Angkatan 21 SMK Informatika Al-Irsyad Al-Islamiyyah (SKINFA) Cirebon. RPL, TKJ, DKV — Tiga tahun perjalanan yang tidak terlupakan.',
  openGraph: {
    title: 'SKINFAVERSE21 — Semesta Digital Angkatan 21',
    description: 'Tiga Tahun. Seribu Cerita. Satu Kenangan. — SKINFA Angkatan 21 · 2026',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CountdownGate>
          {children}
        </CountdownGate>
      </body>
    </html>
  );
}
