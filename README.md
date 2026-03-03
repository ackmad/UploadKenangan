# SMK Angkatan 2026 – Digital Memory Archive

Website arsip digital kenangan angkatan 2026 — kelas RPL, TKJ, dan DKV.

## 🚀 Setup & Menjalankan

### 1. Install dependensi
```bash
npm install
```

### 2. Konfigurasi environment variables

Salin file contoh dan isi dengan credential Google Drive kamu:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GDRIVE_ROOT_FOLDER_ID=xxxx
GDRIVE_RPL_FOLDER_ID=xxxx
GDRIVE_TKJ_FOLDER_ID=xxxx
GDRIVE_DKV_FOLDER_ID=xxxx
```

### 3. Jalankan dev server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

---

## ☁️ Setup Google Drive (Wajib Dilakukan Manual)

1. **Buat Google Cloud Project** → aktifkan **Google Drive API**
2. **Buat Service Account** → download JSON key
3. **Buat folder di Google Drive:**
   - `SMK-ANGKATAN-2026/` (root)
     - `RPL/`
     - `TKJ/`
     - `DKV/`
4. **Share semua folder** ke service account email dengan role **Editor**
5. **Aktifkan "Anyone with link can view"** agar galeri bisa menampilkan foto tanpa login
6. Copy folder ID dari URL Drive dan isi ke `.env.local`

---

## 📁 Struktur Proyek

```
├── app/
│   ├── page.tsx              # Hero / Landing page
│   ├── hero.module.css
│   ├── upload/
│   │   ├── page.tsx          # Halaman upload foto
│   │   └── upload.module.css
│   ├── success/
│   │   ├── page.tsx          # Halaman sukses upload
│   │   └── success.module.css
│   ├── gallery/
│   │   ├── page.tsx          # Galeri masonry + lightbox
│   │   └── gallery.module.css
│   └── api/
│       ├── upload/route.ts   # POST: upload ke Google Drive
│       └── gallery/route.ts  # GET: list foto dari Drive
├── lib/
│   └── google-drive.ts       # Helper Google Drive API
├── public/
│   ├── hero-bg.jpg           # Background hero cinematic
│   └── placeholder.svg       # Fallback gambar
└── .env.local.example        # Template environment variables
```

---

## 🔒 Keamanan

- Credential Google (private key) **tidak pernah** dikirim ke frontend
- Semua operasi Drive dilakukan di server-side (API route)
- Validasi MIME type di backend — hanya `image/*` yang diterima
- Tidak ada login user, tidak ada database — sepenuhnya stateless

---

## 📦 Deploy ke Vercel

1. Push ke GitHub
2. Connect repo di [vercel.com](https://vercel.com)
3. Tambahkan semua env vars di **Settings → Environment Variables**
4. Deploy!

> **Catatan:** `GOOGLE_PRIVATE_KEY` harus diisi dengan nilai **tanpa** escape `\n` — Vercel mengurai newline secara otomatis di env vars.

---

## 🎨 Teknologi

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Vanilla CSS Modules |
| Storage | Google Drive API v3 |
| Auth | Service Account (server-side) |
| Font | Playfair Display · Inter |
| Deploy | Vercel |
