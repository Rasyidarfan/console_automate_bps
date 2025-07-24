# Console Automate BPS

🚀 **Otomatisasi Web BPS melalui Browser Console**

Repository ini berisi koleksi script JavaScript untuk mengotomatisasi berbagai proses di website BPS (Badan Pusat Statistik) Indonesia melalui browser console.

## 📋 Deskripsi

Script-script dalam repository ini dirancang khusus untuk mengotomatisasi tugas-tugas repetitif pada platform web BPS, sehingga meningkatkan efisiensi dan mengurangi kesalahan manual dalam proses manajemen mitra dan download dokumen.

## 🎯 Target Platform

### 1. Manajemen Mitra BPS
- **URL:** `manajemen-mitra.bps.go.id`
- **Fungsi:** Otomatisasi proses alokasi dan penerimaan mitra survei

### 2. SIPW (Sistem Informasi Pengolahan Web)
- **URL:** `sipw.bps.go.id`  
- **Fungsi:** Otomatisasi download dokumen secara massal

## 📁 File dalam Repository

```
console_automate_bps/
├── README.md                        # Dokumentasi ini
├── SIPW_download_all_document.js    # Auto download dokumen SIPW
├── alokasi mitra.js                 # Auto input email untuk alokasi mitra
└── terima mitra.js                  # Auto approval/penerimaan mitra
```

## 🚀 Cara Penggunaan

### Persiapan Umum
1. Buka browser Chrome/Firefox/Edge
2. Login ke platform BPS yang sesuai
3. Navigasi ke halaman yang akan diautomasi
4. Buka Developer Tools (tekan **F12**)
5. Masuk ke tab **Console**

---

## 📄 Dokumentasi Script

### 1. `SIPW_download_all_document.js`
**Platform:** sipw.bps.go.id

#### Fungsi:
Mengotomatisasi proses download dokumen dari semua halaman di SIPW dengan mengklik tombol download secara berurutan.

#### Fitur:
- ✅ Auto-click tombol download di setiap baris tabel
- ✅ Navigasi otomatis ke halaman berikutnya
- ✅ Progress tracking dengan log detail
- ✅ Delay 5 detik antar klik untuk menghindari overload server
- ✅ Berhenti otomatis jika sudah mencapai halaman terakhir

#### Cara Penggunaan:
```javascript
// 1. Buka halaman daftar dokumen di SIPW
// 2. Pastikan tabel dokumen sudah dimuat
// 3. Copy-paste script SIPW_download_all_document.js ke console
// 4. Tekan Enter untuk menjalankan
// 5. Script akan berjalan otomatis untuk semua halaman
```

#### Target Selector:
- **Tombol Download:** `#root > div > div > main > div > div.p-6.pt-0 > div > div.rounded-md.border > div > table > tbody > tr > td:nth-child(6) > div > button`
- **Tombol Next Page:** `#root > div > div > main > div > div.p-6.pt-0 > div > div.flex.items-center.justify-end.space-x-2.py-4 > div:nth-child(3) > button:nth-child(3)`

---

### 2. `alokasi mitra.js`
**Platform:** manajemen-mitra.bps.go.id

#### Fungsi:
Mengotomatisasi input email mitra untuk proses alokasi dengan mensimulasikan pengetikan dan klik tombol.

#### Fitur:
- ✅ Input email otomatis dari list yang telah didefinisikan
- ✅ Simulasi pengetikan natural (character by character)
- ✅ Auto-click tombol setelah input email
- ✅ Delay 3 detik antar proses untuk stabilitas
- ✅ Progress log untuk tracking

#### Data Email:
Script ini menggunakan 10 email yang sudah terdefinisi:
```javascript
const emails = [
    'nikodemusmandowen1622@gmail.com',
    'juliakoibur@gmail.com',
    'rudytehupuring@gmail.com',
    'alinawenda69@gmail.com',
    'eleminamatuan7721@gmail.com',
    'hadjierrahman@gmail.com',
    'jovantamelab@transformnation.is',
    'mekiwanimbo9734@gmail.com',
    'bandargombo9723@gmail.com',
    'slametnf17@gmail.com'
];
```

#### Cara Penggunaan:
```javascript
// 1. Buka halaman alokasi mitra
// 2. Pastikan form input email sudah terlihat
// 3. Edit array emails jika diperlukan
// 4. Copy-paste script alokasi mitra.js ke console
// 5. Tekan Enter untuk menjalankan
// 6. Script akan memproses semua email secara berurutan
```

#### Target Selector:
- **Input Email:** `#tabs-home-ex1 input.form-control`
- **Tombol Click:** `#tabs-home-ex1 .cursor-pointer:nth(2)`

---

### 3. `terima mitra.js`
**Platform:** manajemen-mitra.bps.go.id

#### Fungsi:
Mengotomatisasi proses penerimaan/approval mitra secara massal dengan menangani button success, SweetAlert confirmations, dan navigasi.

#### Fitur:
- ✅ Auto-click semua tombol "success" di tabel mitra
- ✅ Otomatis handle SweetAlert2 confirmation dialogs
- ✅ Smart waiting dengan MutationObserver
- ✅ Loop sampai semua mitra diproses
- ✅ Auto-navigation setelah selesai
- ✅ Error handling untuk stabilitas

#### Alur Kerja:
1. Mencari semua `button.btn-success` di tabel
2. Klik semua tombol success
3. Handle SweetAlert2 confirmation pertama
4. Handle SweetAlert2 confirmation kedua  
5. Klik `button.btn-primary`
6. Ulangi proses sampai tidak ada tombol success lagi
7. Otomatis navigasi ke halaman logout/login

#### Cara Penggunaan:
```javascript
// 1. Buka halaman daftar mitra yang perlu diterima
// 2. Pastikan tabel dengan tombol success sudah dimuat
// 3. Copy-paste script terima mitra.js ke console
// 4. Jalankan fungsi: autoClick()
// 5. Script akan berjalan sampai semua mitra diproses
```

#### Target Selector:
- **Tombol Success:** `#vgt-table button.btn-success`
- **SweetAlert Confirm:** `body > div.swal2-container > div > div.swal2-actions > button.swal2-confirm`
- **Tombol Primary:** `button.btn-primary`

---

## ⚙️ Konfigurasi

### Delay Settings
Setiap script memiliki delay yang dapat disesuaikan:

```javascript
// SIPW_download_all_document.js
await delay(5000);  // 5 detik antar download
await delay(3000);  // 3 detik tunggu halaman dimuat

// alokasi mitra.js  
await new Promise(resolve => setTimeout(resolve, 3000)); // 3 detik antar email

// terima mitra.js
await sleep(1000);  // 1 detik antar iterasi
await sleep(500);   // 500ms antar klik
```

### Customization Email List
Untuk mengubah daftar email di `alokasi mitra.js`:
```javascript
const emails = [
    'email1@domain.com',
    'email2@domain.com',
    // tambahkan email baru di sini
];
```

## 🔧 Troubleshooting

### Error Umum

#### "Element not found"
- **Penyebab:** Selector berubah atau halaman belum dimuat
- **Solusi:** 
  - Refresh halaman dan coba lagi
  - Update selector jika ada perubahan UI
  - Pastikan sudah di halaman yang benar

#### "Too many requests" atau website slow
- **Penyebab:** Server overload karena terlalu banyak request
- **Solusi:**
  - Tingkatkan delay antar aksi
  - Jalankan script saat server tidak sibuk
  - Bagi proses menjadi batch kecil

#### SweetAlert tidak muncul
- **Penyebab:** Dialog sudah ditangani atau ada error sebelumnya
- **Solusi:**
  - Refresh halaman dan mulai ulang
  - Check console log untuk error detail

### Tips Debugging
1. Buka Console untuk melihat log progress
2. Jika script berhenti, check error message
3. Pastikan internet stabil
4. Jangan switch tab saat script berjalan

## ⚠️ Peringatan Penting

### Penggunaan Bertanggung Jawab
- **⚠️ Backup Data:** Selalu backup data sebelum menjalankan script
- **⚠️ Test Environment:** Test di environment development dulu jika memungkinkan  
- **⚠️ Rate Limiting:** Jangan spam server - gunakan delay yang cukup
- **⚠️ Monitor Usage:** Awasi proses untuk memastikan berjalan normal

### Disclaimer
- Script ini dibuat untuk membantu otomatisasi tugas repetitif BPS
- Pengguna bertanggung jawab penuh atas penggunaan script
- Tidak ada garansi script akan bekerja 100% di semua kondisi
- Perubahan UI website dapat mempengaruhi fungsi script
- Selalu gunakan dengan bijak dan sesuai kebijakan organisasi

## 🤝 Kontribusi

### Cara Berkontribusi
1. **Fork** repository ini
2. **Edit** script sesuai kebutuhan
3. **Test** perubahan dengan teliti
4. **Submit** Pull Request dengan deskripsi jelas

### Bug Report
Jika menemukan bug atau script tidak berfungsi:
1. Buat **Issue** di GitHub
2. Sertakan **screenshot** error
3. Jelaskan **langkah reproduce** bug
4. Cantumkan **browser** dan **OS** yang digunakan

## 📝 Changelog

### v1.0.0 (Current)
- ✅ SIPW document download automation
- ✅ Mitra allocation email automation  
- ✅ Mitra acceptance/approval automation
- ✅ Error handling dan progress logging
- ✅ Smart delays untuk server stability

---

**📧 Email dalam `alokasi mitra.js` dapat disesuaikan sesuai kebutuhan**

**🔄 Script dapat dimodifikasi untuk selector yang berbeda jika UI berubah**

**⭐ Jika project ini membantu, berikan star di GitHub!**