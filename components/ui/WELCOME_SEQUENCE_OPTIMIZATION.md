# Welcome Sequence - Optimasi Cinematic & Performance

## 🎬 Overview
Halaman "✦ Buka Semesta Kenangan Kita" telah dioptimalkan untuk memberikan pengalaman cinematic yang smooth, emosional, dan sinkron sempurna antara audio, lirik, dan slideshow foto.

## ✨ Fitur Utama

### 1. **Sinkronisasi Audio-Lirik Presisi**
- ✅ Audio instrument dan voice dimulai bersamaan tanpa delay
- ✅ Lirik muncul dengan timing presisi (toleransi ±50ms)
- ✅ Throttle optimized: 100ms untuk responsivitas maksimal
- ✅ Fade in/out lirik lebih smooth (500ms dengan cubic-bezier easing)
- ✅ Audio reset ke `currentTime = 0` setiap fase untuk konsistensi

**Timing:**
- Voice 1: ~43 detik, 7 foto → 6.1s per foto
- Voice 2: ~39 detik, 8 foto → 4.9s per foto
- Total: 15 foto seimbang

### 2. **Animasi Foto Bervariasi (Ken Burns Effect)**
Setiap foto memiliki animasi unik untuk menghindari monoton:

| Variasi | Efek | Durasi | Foto |
|---------|------|--------|------|
| **kb1** | Zoom in center | 20s | 1, 7, 13 |
| **kb2** | Pan left + zoom | 22s | 2, 8, 14 |
| **kb3** | Pan right + zoom | 22s | 3, 9, 15 |
| **kb4** | Diagonal movement | 24s | 4, 10 |
| **kb5** | Zoom out to in | 21s | 5, 11 |
| **kb6** | Subtle rotate + zoom | 23s | 6, 12 |

**Mobile:** Animasi lebih subtle (scale 1.04, durasi 15s) untuk performa optimal.

### 3. **Transisi Crossfade Cinematic**
- ✅ Durasi: 2 detik (lebih smooth dari sebelumnya)
- ✅ Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)` untuk natural motion
- ✅ Opacity-only transition (GPU accelerated)
- ✅ Tidak ada cut kasar, semua dissolve halus

### 4. **Lirik Display**
- **Lirik Utama (EN):** 
  - Posisi: Center screen
  - Font: Georgia serif, 1.5-2.6rem (responsive)
  - Warna: Putih (rgba(255, 252, 245, 0.97))
  - Shadow: Heavy untuk readability
  
- **Terjemahan (ID):**
  - Posisi: Bottom screen
  - Font: Georgia italic, 0.85-1.2rem
  - Warna: Kuning (rgba(255, 215, 85, 0.76))
  - Style: Italic untuk diferensiasi

### 5. **Optimasi Performa**

#### Preloading Strategy
```typescript
1. Load lirik JSON terlebih dahulu (2 files)
2. Load critical images (3 foto pertama) dengan priority HIGH
3. Load non-critical images (12 foto sisanya) dengan priority LOW
4. Load audio files (4 files) dengan canplaythrough event
5. Progress bar real-time untuk UX
```

#### Image Optimization
- `loading="eager"` untuk foto aktif
- `decoding="async"` untuk non-blocking decode
- `fetchPriority="high"` untuk foto pertama
- `contentVisibility: auto` untuk rendering optimization
- CSS: `backface-visibility: hidden` untuk GPU acceleration

#### Audio Optimization
- Volume fade menggunakan `requestAnimationFrame` (smooth 60fps)
- Step size: 0.015 untuk balance antara smooth & responsive
- Ducking otomatis: instrument turun saat voice aktif
- Reset `currentTime = 0` setiap fase untuk konsistensi

#### CSS Performance
- Transform-only animations (GPU accelerated)
- No blur, no mix-blend-mode pada animasi
- Static grain texture (no animation)
- Minimal compositor layers
- `will-change` hanya pada elemen yang benar-benar animasi

### 6. **Ending Sequence**
Sequence emosional dengan 5 fase:

1. **Silence** (2.5s): Keheningan untuk impact
2. **Memories** (15.5s): Polaroid, quotes, timestamps muncul dengan variasi animasi
3. **Freeze** (3s): Memories blur & fade
4. **Gold Fade** (3s): Cahaya emas muncul
5. **Logo** (7s): Logo final dengan glow effect

**Animasi Memories:**
- `fallTop`: Jatuh dari atas dengan bounce
- `slideLeft/Right`: Slide dari samping
- `riseBottom`: Naik dari bawah
- `zoomIn`: Zoom dari center
- `fadeFloat`: Fade dengan slight movement

## 📊 Performance Metrics

### Target Performance
- **FPS:** 60fps stabil (desktop & mobile)
- **Load Time:** <3 detik untuk semua assets
- **Memory:** <150MB total
- **Smooth Playback:** No lag, no stutter

### Optimizations Applied
✅ Lazy loading untuk non-critical images  
✅ Async decoding untuk images  
✅ GPU-accelerated transforms only  
✅ Throttled event handlers (100ms)  
✅ RequestAnimationFrame untuk smooth animations  
✅ Minimal DOM mutations  
✅ Static textures (no animated grain)  
✅ Preload critical assets first  

## 🎨 Design Principles

1. **Cinematic Feel:** Seperti short movie dengan pacing yang tepat
2. **Emotional Impact:** Timing dan transisi yang menyentuh
3. **Smooth & Seamless:** Tidak ada jank, lag, atau cut kasar
4. **Responsive:** Desktop dan mobile sama-sama smooth
5. **Immersive:** Fullscreen, no distractions

## 🔧 Technical Stack

- **React 18+** dengan hooks optimization
- **CSS Modules** untuk scoped styling
- **Web Audio API** untuk volume control
- **RequestAnimationFrame** untuk smooth animations
- **Intersection Observer** (via contentVisibility)
- **Modern Image APIs** (fetchPriority, decoding)

## 📱 Mobile Optimization

- Animasi lebih subtle (scale 1.04 vs 1.08)
- Durasi lebih pendek (15s vs 20-24s)
- Font sizes responsive dengan clamp()
- Touch-friendly (no hover effects)
- Reduced motion support (prefers-reduced-motion)

## 🎯 User Experience

### Loading Screen
- Progress bar dengan percentage
- Status text untuk feedback
- Smooth fade in/out
- Grain texture untuk aesthetic

### Main Sequence
- Projector countdown (5-4-3-2-1)
- Flash transition
- Voice + instrument synchronized
- Lirik fade in/out smooth
- Photo crossfade cinematic
- Interlude dengan dim overlay
- Outro dengan quote
- Ending sequence emosional

### Exit
- Smooth fade out (2.4s)
- Callback ke homepage
- No abrupt cuts

## 🚀 Future Enhancements

Potential improvements:
- [ ] WebP format support dengan fallback
- [ ] Service Worker untuk offline caching
- [ ] Adaptive quality based on network speed
- [ ] Analytics untuk track engagement
- [ ] A/B testing untuk timing optimization

## 📝 Notes

- Semua timing telah disesuaikan dengan durasi audio aktual
- Lirik JSON sudah diperbaiki (removed error text)
- 15 foto terdistribusi seimbang (7 + 8)
- Animasi bervariasi untuk menghindari monoton
- Performa dioptimalkan untuk desktop & mobile

---

**Last Updated:** May 15, 2026  
**Version:** 2.0 - Cinematic Optimization
