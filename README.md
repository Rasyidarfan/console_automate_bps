# Console Automate BPS

🚀 **Otomatisasi Web BPS melalui Browser Console**

Repository ini berisi koleksi script JavaScript untuk mengotomatisasi berbagai proses di website BPS (Badan Pusat Statistik) Indonesia melalui browser console.

## 📋 Deskripsi

Script-script dalam repository ini dirancang khusus untuk mengotomatisasi tugas-tugas repetitif pada platform web BPS, sehingga meningkatkan efisiensi dan mengurangi kesalahan manual dalam proses manajemen mitra dan download dokumen.

## 🎯 Target Platform

### 1. Manajemen Mitra BPS
- **URL:** `manajemen-mitra.bps.go.id`
- **Fungsi:** Otomatisasi proses alokasi, penerimaan mitra, dan download dokumen survei

### 2. SIPW (Sistem Informasi Pengolahan Web)
- **URL:** `sipw.bps.go.id`  
- **Fungsi:** Otomatisasi download dokumen secara massal

## 📁 File dalam Repository

```
console_automate_bps/
├── README.md                        # Dokumentasi ini
├── SIPW_download_all_document.js    # Auto download dokumen SIPW
├── alokasi mitra.js                 # Auto input data untuk alokasi mitra
├── terima mitra.js                  # Auto approval/penerimaan mitra
├── wilkerBlok1                      # Auto fill form numerik dengan data array
└── download_survey_mitra            # Download selektif berdasarkan Sobat ID
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
Mengotomatisasi input data mitra untuk proses alokasi dengan mensimulasikan pengetikan dan klik tombol.

#### Fitur:
- ✅ Input data otomatis dari list yang telah didefinisikan
- ✅ Simulasi pengetikan natural (character by character)
- ✅ Auto-click tombol setelah input data
- ✅ Delay 3 detik antar proses untuk stabilitas
- ✅ Progress log untuk tracking

#### Data Template:
Script ini menggunakan template data yang perlu disesuaikan:
```javascript
const emails = [
    'sobat_id',          // Sobat ID mitra
    'NIK',              // Nomor Induk Kependudukan
    '|',                // Delimiter
    'nama_lengkap',     // Nama lengkap mitra
    'email@email.com'   // Email mitra
];
```

#### Cara Penggunaan:

1. Buka halaman alokasi mitra
2. Pastikan form input sudah terlihat
3. Edit array dengan data real sesuai kebutuhan
4. Copy-paste script alokasi mitra.js ke console
5. Tekan Enter untuk menjalankan
6. Script akan memproses semua data secara berurutan


#### Target Selector:
- **Input Field:** `#tabs-home-ex1 input.form-control`
- **Tombol Click:** `#tabs-home-ex1 .cursor-pointer:nth(2)`

---

### 3. `terima mitra.js`
**Platform:** manajemen-mitra.bps.go.id

#### Fungsi:
Mengotomatisasi proses penerimaan/approval mitra secara massal dengan menangani button success, SweetAlert confirmations, dan navigasi otomatis.

#### Fitur:
- ✅ Auto-click semua tombol "success" di tabel mitra
- ✅ Otomatis handle SweetAlert2 confirmation dialogs
- ✅ Smart waiting dengan MutationObserver
- ✅ Loop sampai semua mitra diproses
- ✅ Auto-navigation ke logout setelah selesai
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

### 4. `wilkerBlok1`
**Platform:** manajemen-mitra.bps.go.id (Form Wilayah Kerja)

#### Fungsi:
Mengotomatisasi pengisian form input numerik dengan data array yang telah ditentukan.

#### Fitur:
- ✅ Auto-fill semua input type="number" secara berurutan
- ✅ Event handling lengkap (input, change, focus, blur)
- ✅ Visual feedback dengan highlighting
- ✅ Functions untuk refill dan clear semua input
- ✅ DOM ready handling

#### Data Array:
```javascript
const numberArray = [4,4,4,4,18,21,6,6,7,7,15,15,5,5,6,6,4,4,7,7,4,4];
```

#### Cara Penggunaan:
```javascript
// 1. Buka halaman form dengan input numerik
// 2. Sesuaikan numberArray dengan data yang dibutuhkan
// 3. Copy-paste script wilkerBlok1 ke console
// 4. Script akan otomatis mengisi semua input number
// 5. Gunakan refillInputs() untuk mengisi ulang jika diperlukan
// 6. Gunakan clearAllInputs() untuk mengosongkan semua input
```

#### Functions Tersedia:
- `refillInputs()` - Mengisi ulang semua input
- `clearAllInputs()` - Mengosongkan semua input
- `addInputListeners()` - Menambah event listeners

---

### 5. `download_survey_mitra`
**Platform:** manajemen-mitra.bps.go.id/mitra/kepka

#### Fungsi:
Download dokumen survei mitra dengan filtering berdasarkan Sobat ID atau download semua dokumen.

#### Fitur:
- ✅ Filter berdasarkan Sobat ID tertentu
- ✅ Mode "download semua" jika array kosong
- ✅ Smart text matching untuk validasi ID
- ✅ Scroll otomatis ke elemen target
- ✅ Progress logging dan error handling
- ✅ Delay 3 detik antar download

#### Konfigurasi ID:
```javascript
// Untuk Sobat ID tertentu
const id = ['9702xxxxxxxx','9702xxxxxxxx','SobatID123'];

// Atau array kosong untuk download semua
const id = [];
```

#### Cara Penggunaan:
```javascript
// 1. Buka halaman https://manajemen-mitra.bps.go.id/mitra/kepka
// 2. Pastikan tabel mitra sudah dimuat
// 3. Edit array id sesuai kebutuhan (kosong untuk semua)
// 4. Copy-paste script download_survey_mitra ke console
// 5. Script akan memproses download sesuai filter
```

#### Target Selector:
- **Tombol Download:** `#vgt-table > tbody > tr > td.vgt-left-align.moveColumnRight > span > div > button:nth-child(1)`
- **Text ID:** `#vgt-table > tbody > tr:nth-child(n) > td:nth-child(3) > span > div > div > span`

---

## ⚙️ Konfigurasi

### Delay Settings
Setiap script memiliki delay yang dapat disesuaikan:

```javascript
// SIPW_download_all_document.js
await delay(5000);  // 5 detik antar download
await delay(3000);  // 3 detik tunggu halaman dimuat

// alokasi mitra.js  
await new Promise(resolve => setTimeout(resolve, 3000)); // 3 detik antar data

// terima mitra.js
await sleep(1000);  // 1 detik antar iterasi
await sleep(500);   // 500ms antar klik

// download_survey_mitra
await new Promise(resolve => setTimeout(resolve, 3000)); // 3 detik antar download
```

### Customization Data
Untuk mengubah data di setiap script:

#### alokasi mitra.js:
```javascript
const emails = [
    'sobat_id_real',
    'NIK_real', 
    '|',
    'nama_lengkap_real',
    'email@domain.com'
];
```

#### wilkerBlok1:
```javascript
const numberArray = [1,2,3,4,5]; // Sesuaikan dengan kebutuhan
```

#### download_survey_mitra:
```javascript
const id = ['ID1','ID2','ID3']; // Atau [] untuk semua
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

#### SweetAlert tidak muncul (terima mitra.js)
- **Penyebab:** Dialog sudah ditangani atau ada error sebelumnya
- **Solusi:**
  - Refresh halaman dan mulai ulang
  - Check console log untuk error detail

#### Input tidak terisi (wilkerBlok1)
- **Penyebab:** DOM belum ready atau selector tidak tepat
- **Solusi:**
  - Tunggu halaman sepenuhnya dimuat
  - Gunakan refillInputs() manual
  - Check apakah input type="number" tersedia

#### Download tidak berjalan (download_survey_mitra)
- **Penyebab:** ID tidak ditemukan atau selector berubah
- **Solusi:**
  - Verify ID exists in the table
  - Check console log untuk matching results
  - Test dengan array kosong untuk download semua

### Tips Debugging
1. **Monitor Console:** Selalu buka console untuk melihat log progress
2. **Check Network:** Monitor tab Network untuk melihat request/response
3. **Inspect Elements:** Verify selector masih valid dengan inspect element
4. **Test Step by Step:** Jalankan parts of script secara manual untuk isolate error
5. **Check Data:** Verify input data format sesuai dengan requirement

### Performance Tips
1. **Internet Stable:** Pastikan koneksi internet stabil
2. **Don't Switch Tabs:** Jangan berpindah tab saat script berjalan
3. **Close Other Apps:** Close aplikasi lain untuk free up resources
4. **Monitor Memory:** Refresh halaman jika browser jadi lambat

## ⚠️ Peringatan Penting

### Penggunaan Bertanggung Jawab
- **⚠️ Backup Data:** Selalu backup data sebelum menjalankan script
- **⚠️ Test Environment:** Test di environment development dulu jika memungkinkan  
- **⚠️ Rate Limiting:** Jangan spam server - gunakan delay yang cukup
- **⚠️ Monitor Usage:** Awasi proses untuk memastikan berjalan normal
- **⚠️ Data Validation:** Selalu validate data sebelum mass processing

### Disclaimer
- Script ini dibuat untuk membantu otomatisasi tugas repetitif BPS
- Pengguna bertanggung jawab penuh atas penggunaan script
- Tidak ada garansi script akan bekerja 100% di semua kondisi
- Perubahan UI website dapat mempengaruhi fungsi script
- Selalu gunakan dengan bijak dan sesuai kebijakan organisasi
- Author tidak bertanggung jawab atas kerusakan data atau sistem

### Compliance & Security
- Script mengikuti best practices untuk web automation
- Menggunakan delays yang wajar untuk server stability
- Tidak mengakses data yang tidak authorized
- Tidak melakukan harmful operations
- Menggunakan legitimate browser APIs saja

## 🤝 Kontribusi

### Cara Berkontribusi
1. **Fork** repository ini
2. **Create feature branch** untuk perubahan
3. **Edit** script sesuai kebutuhan
4. **Test** perubahan dengan teliti
5. **Document** perubahan di README
6. **Submit** Pull Request dengan deskripsi jelas

### Bug Report
Jika menemukan bug atau script tidak berfungsi:
1. Buat **Issue** di GitHub dengan template:
   - **Browser & OS:** Chrome 120 on Windows 11
   - **Script:** Nama script yang bermasalah
   - **Steps to Reproduce:** Langkah-langkah detail
   - **Expected:** Yang diharapkan terjadi
   - **Actual:** Yang benar-benar terjadi
   - **Screenshot:** Error message atau behavior
   - **Console Log:** Copy paste console output

### Feature Request
Untuk request fitur baru:
1. Buat **Issue** dengan label "enhancement"
2. Jelaskan **use case** dan **benefit**
3. Berikan **mockup** atau **example** jika memungkinkan

## 📚 Learning Resources

### JavaScript Console
- [Chrome DevTools Console](https://developer.chrome.com/docs/devtools/console/)
- [Firefox Web Console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console)

### DOM Manipulation
- [MDN DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [JavaScript Event Handling](https://developer.mozilla.org/en-US/docs/Web/Events)

### CSS Selectors
- [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)
- [Complex CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

## 📝 Changelog

### v1.2.0 (Latest)
- ✅ Added `wilkerBlok1` for numeric form automation
- ✅ Added `download_survey_mitra` for selective downloads
- ✅ Enhanced error handling across all scripts
- ✅ Improved documentation with troubleshooting guide
- ✅ Added performance tips and debugging guidelines

### v1.1.0
- ✅ Enhanced `terima mitra.js` with better SweetAlert handling
- ✅ Added auto-navigation after completion
- ✅ Improved MutationObserver implementation

### v1.0.0 (Initial)
- ✅ SIPW document download automation
- ✅ Mitra allocation data automation  
- ✅ Mitra acceptance/approval automation
- ✅ Basic error handling dan progress logging
- ✅ Smart delays untuk server stability

## 📊 Statistics & Metrics

### Script Performance (Estimated)
- **SIPW Download:** ~5-10 documents per minute
- **Alokasi Mitra:** ~20 entries per minute  
- **Terima Mitra:** ~15-30 approvals per minute
- **WilkerBlok1:** ~22 fields in 5 seconds
- **Download Survey:** ~20 downloads per minute

### Server Load Considerations
- Delays designed to respect server capacity
- Rate limiting prevents overload
- Smart error handling reduces failed requests
- Progressive backoff on errors (future enhancement)

---

**📧 Data template dalam scripts dapat disesuaikan sesuai kebutuhan real**

**🔄 Scripts dapat dimodifikasi untuk selector yang berbeda jika UI berubah**

**⭐ Jika project ini membantu, berikan star di GitHub!**

**🚀 Happy Automating!**
