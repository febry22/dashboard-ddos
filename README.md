# Security Testing · Service Selector (Demo)

Demo dashboard. User memasukkan alamat website, "AI" (disimulasikan) menganalisa
targetnya, lalu merekomendasikan service mana yang paling cocok (Service A vs
Service B). User lalu memilih salah satu.

> **Demo only.** Semua analisa adalah **data dummy**. Tidak ada request, scan,
> atau traffic apa pun yang dikirim ke alamat yang dimasukkan. `POST /api/analyze`
> hanya menjalankan simulasi lokal di `lib/mock.ts`. Pakai tes nyata hanya pada
> sistem yang Anda miliki atau sudah mendapat otorisasi.

## Alur

1. **Input** — user mengetik alamat website.
2. **Analyzing** — animasi langkah-langkah "AI" (dummy).
3. **Results** — ringkasan + sinyal sintetis + alasan + 2 kartu service
   (yang direkomendasikan ditandai "Recommended").
4. **Confirm** — user memilih service dan menekan Continue.

## Menjalankan lokal

```bash
npm install
npm run dev     # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

## Deploy ke Vercel

Project ini Next.js standar — tanpa konfigurasi tambahan.

**Lewat dashboard Vercel:** push ke GitHub, lalu "Import Project" di Vercel.
Framework terdeteksi otomatis (Next.js), langsung Deploy.

**Lewat CLI:**

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Menyesuaikan

- **Nama / deskripsi / kelebihan service** → `SERVICES` di `lib/mock.ts`.
- **Logika rekomendasi & sinyal** → fungsi `analyze()` di `lib/mock.ts`.
- **Mengganti dummy dengan API nyata** → ganti isi `app/api/analyze/route.ts`
  agar memanggil service backend Anda (Service A / B) dan/atau model AI,
  lalu kembalikan bentuk `AnalysisResult` yang sama.
- **Tampilan** → `app/globals.css`.

## Struktur

```
app/
  layout.tsx            # root layout
  page.tsx              # UI utama (alur 4 tahap)
  globals.css           # styling dashboard
  api/analyze/route.ts  # endpoint dummy analysis
lib/
  mock.ts               # simulasi "AI" + definisi service
```
