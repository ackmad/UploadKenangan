# Welcome Sequence - Panduan Penggunaan

## 🎬 Cara Kerja

### Flow Sequence

```
User Click "✨ Siap, Mulai Sekarang!"
         ↓
    Loading Screen (preload assets)
         ↓
    Projector Countdown (5-4-3-2-1)
         ↓
    Flash Transition
         ↓
    Playing Phase 1 (Voice 1 + 7 photos)
         ↓
    Interlude (5 seconds)
         ↓
    Playing Phase 2 (Voice 2 + 8 photos)
         ↓
    Outro (Quote + fade out)
         ↓
    Ending Sequence (Memories → Logo)
         ↓
    Exit to Homepage
```

## 🎵 Audio Synchronization

### Audio Files
1. **voice1.mp3** - Narasi pertama (~43s)
2. **voice2.mp3** - Narasi kedua (~39s)
3. **instrument-full.mp3** - Background music (full duration)
4. **countdown-sfx.wav** - Sound effect untuk countdown

### Volume Levels
```typescript
VOL_SPEAKING  = 0.15  // Instrument saat voice aktif (ducking)
VOL_GAP       = 0.45  // Instrument saat jeda antar kalimat
VOL_INTERLUDE = 0.08  // Instrument saat interlude (very low)
VOL_QUOTE     = 0.80  // Instrument full saat quote muncul
```

### Timing
- **Voice Delay:** 3 detik setelah instrument mulai
- **Interlude:** 5 detik antara voice 1 dan voice 2
- **Outro Quote:** Muncul 3.2s, fade out 14.9s

## 📸 Photo Management

### Struktur Foto
```
public/assets/images/WelcomeSequenceImages/
├── 1.jpg   → Phase 1, Photo 1
├── 2.jpg   → Phase 1, Photo 2
├── 3.JPG   → Phase 1, Photo 3
├── 5.jpg   → Phase 1, Photo 4
├── 6.jpg   → Phase 1, Photo 5
├── 7.JPG   → Phase 1, Photo 6
├── 8.jpg   → Phase 1, Photo 7
├── 9.jpg   → Phase 2, Photo 1
├── 10.jpg  → Phase 2, Photo 2
├── 11.jpg  → Phase 2, Photo 3
├── 12.jpg  → Phase 2, Photo 4
├── 13.jpg  → Phase 2, Photo 5
├── 14.jpg  → Phase 2, Photo 6
├── 15.jpg  → Phase 2, Photo 7
└── 16.jpg  → Phase 2, Photo 8
```

### Mengganti Foto
1. Simpan foto baru di folder `WelcomeSequenceImages/`
2. Update array `MEDIA_1` atau `MEDIA_2` di `WelcomeSequence.tsx`
3. Pastikan total tetap 15 foto untuk timing optimal

### Rekomendasi Foto
- **Resolusi:** 1920x1080 atau lebih tinggi
- **Format:** JPG (atau WebP untuk performa lebih baik)
- **Aspect Ratio:** 16:9 atau 4:3
- **File Size:** <500KB per foto (compressed)
- **Orientation:** Landscape preferred

## 📝 Lyrics Management

### Format JSON
```json
{
  "language": "en",
  "segments": [
    {
      "start": 0.000,      // Waktu mulai (detik)
      "end": 0.773,        // Waktu selesai (detik)
      "text": "English",   // Lirik utama (center)
      "text_id": "Indo",   // Terjemahan (bottom, kuning)
      "words": [...]       // Word-level timing (optional)
    }
  ]
}
```

### Mengedit Lirik
1. Edit file `public/assets/lirik/lirik1.json` atau `lirik2.json`
2. Sesuaikan timing `start` dan `end` dengan audio
3. Test sinkronisasi dengan play audio

### Tips Timing
- Gunakan audio editor (Audacity) untuk cek timing
- Tambahkan toleransi ±50ms untuk smooth transition
- Pastikan tidak ada overlap antar segment
- Gap antar segment = instrument naik, speaking = instrument turun

## 🎨 Customization

### Mengubah Durasi Foto
```typescript
// Di WelcomeSequence.tsx
const IMAGE_DUR_1 = 6100;  // Durasi per foto phase 1 (ms)
const IMAGE_DUR_2 = 4900;  // Durasi per foto phase 2 (ms)
```

**Formula:**
```
Durasi per foto = (Total durasi voice / Jumlah foto) * 1000
```

### Mengubah Animasi Foto
Edit CSS di `WelcomeSequence.module.css`:

```css
/* Contoh: Ubah zoom level */
@keyframes kenBurnsZoom {
  from { transform: scale(1) translateZ(0); }
  to   { transform: scale(1.12) translateZ(0); }  /* Lebih zoom */
}
```

### Mengubah Warna Lirik
```css
.lyricEn {
  color: rgba(255, 252, 245, 0.97);  /* Putih */
}

.lyricId {
  color: rgba(255, 215, 85, 0.76);   /* Kuning */
}
```

### Mengubah Transisi Speed
```css
.slide {
  transition: opacity 2s cubic-bezier(0.4, 0.0, 0.2, 1);
  /* Ubah 2s ke nilai lain untuk lebih cepat/lambat */
}
```

## 🐛 Troubleshooting

### Audio tidak sinkron dengan lirik
1. Cek timing di JSON (start/end values)
2. Pastikan audio file tidak corrupt
3. Test di browser berbeda (Chrome recommended)
4. Clear cache dan reload

### Foto tidak muncul
1. Cek path file di array MEDIA_1/MEDIA_2
2. Pastikan file ada di folder WelcomeSequenceImages
3. Cek console untuk error 404
4. Pastikan case-sensitive (JPG vs jpg)

### Animasi lag/stutter
1. Reduce image file size (<500KB)
2. Disable Ken Burns di mobile (sudah auto)
3. Close other tabs/apps
4. Test di device dengan GPU lebih baik

### Loading terlalu lama
1. Compress images (TinyPNG, Squoosh)
2. Convert ke WebP format
3. Reduce jumlah foto (tidak recommended)
4. Check network speed

### Lirik tidak muncul
1. Cek JSON format (valid JSON)
2. Pastikan segments array tidak kosong
3. Cek timing tidak negative
4. Test dengan console.log di syncLyric

## 🔧 Development

### Local Testing
```bash
npm run dev
# Open http://localhost:3000
# Navigate to welcome sequence
```

### Build Production
```bash
npm run build
npm start
```

### Performance Testing
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Performance tab
3. Record sequence
4. Check FPS, memory, network
```

## 📊 Performance Checklist

- [ ] All images <500KB
- [ ] Audio files preloaded
- [ ] FPS stays at 60
- [ ] No console errors
- [ ] Smooth on mobile
- [ ] Loading <3 seconds
- [ ] Memory <150MB
- [ ] No layout shifts

## 🎯 Best Practices

1. **Always test on real devices** (not just emulator)
2. **Test on slow network** (throttle to 3G)
3. **Test on low-end devices** (old phones)
4. **Check accessibility** (screen readers)
5. **Monitor performance** (Chrome DevTools)
6. **Backup before changes** (git commit)
7. **Document changes** (update this file)

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check dokumentasi ini
2. Check WELCOME_SEQUENCE_OPTIMIZATION.md
3. Check console errors
4. Test di browser lain
5. Contact developer

---

**Last Updated:** May 15, 2026  
**Version:** 2.0
