# 🚗 Toll Helper - Asisten & Kalkulator Tarif Tol Indonesia

Aplikasi web modern, interaktif, dan komprehensif untuk menghitung tarif tol resmi di Indonesia, merencanakan rute perjalanan antar kota/provinsi, memantau kecukupan saldo kartu e-Money, mencari fasilitas rest area (termasuk SPKLU mobil listrik), serta mengakses panggilan darurat jalan tol secara instan.

---

## ✨ Fitur Unggulan

1. **Kalkulator Tarif Tol Akurat (Golongan I - V):**
   - Mendukung perhitungan tarif resmi BPJT & Kementerian PUPR untuk seluruh golongan kendaraan:
     - **Golongan I:** Sedan, Jip, Pick Up, Bus, Minibus.
     - **Golongan II - V:** Truk 2 As hingga Truk Gandeng & Kontainer 5+ As.
     - **Golongan VI:** Sepeda Motor (Khusus Tol Bali Mandara).
   - Rincian biaya per segmen jalan tol dan operator (Jasa Marga, Astra Tol, Hutama Karya, dkk).

2. **Peta Interaktif (Leaflet):**
   - Visualisasi posisi gerbang tol (Origin, Waypoints, Destination).
   - Penarikan garis rute (*polyline route*) otomatis.
   - Penanda Rest Area lengkap dengan pop-up fasilitas.
   - Klik gerbang tol pada peta untuk langsung menjadikannya titik asal atau tujuan.

3. **Manajemen Saldo e-Money & Peringatan Saldo:**
   - Pencatat saldo multi-kartu (Mandiri e-Money, BCA Flazz, BRI Brizzi, BNI TapCash).
   - Peringatan otomatis (*alert*) jika saldo tidak mencukupi, lengkap dengan nominal kekurangan dan panduan Top Up via NFC / Minimarket.

4. **Direktori Rest Area & SPKLU:**
   - Filter rest area berdasarkan ketersediaan **⚡ SPKLU (EV Fast Charging)**, **⛽ SPBU**, **🕌 Masjid**, **🍴 Food Court**, dan **🔧 Bengkel**.
   - Filter berdasarkan arah lajur (Arah A: Keluar Kota, Arah B: Masuk Jakarta).

5. **Hotline Darurat 24 Jam:**
   - Panggilan 1-klik ke Call Center Jasa Marga (`14080`), BPJT (`151`), PJR Polisi (`110`), Derek Tol Gratis, dan Ambulans.
   - Panduan keselamatan saat kendaraan mengalami kendala teknis di tol.

6. **Struk Tol Digital & Cetak Reimbursement:**
   - Pembuat struk tol digital format resmi dengan nomor referensi, plat nomor kendaraan, nama driver, rincian biaya, dan validasi QR code yang siap dicetak (*print / save PDF*).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS + Google Fonts (Plus Jakarta Sans & JetBrains Mono)
- **Icons:** Lucide React
- **Mapping:** Leaflet & OpenStreetMap / CartoDB Dark Tiles
- **Storage:** LocalStorage API untuk persistensi data kartu dan riwayat rute

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Masuk ke direktori frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka browser Anda di `http://localhost:3000` untuk menjalankan aplikasi.

### 4. Build untuk Production
```bash
npm run build
```
