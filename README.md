# Console Automate BPS

🚀 **Otomatisasi Web BPS melalui Browser Console**

Repository ini berisi koleksi script JavaScript untuk mengotomatisasi berbagai proses di website BPS (Badan Pusat Statistik) Indonesia melalui browser console.

## 📋 Deskripsi

Script-script dalam repository ini dirancang khusus untuk mengotomatisasi tugas-tugas repetitif pada platform web BPS, sehingga meningkatkan efisiensi dan mengurangi kesalahan manual.

## 🎯 Target Platform

### 1. Manajemen Mitra BPS
- **URL:** `manajemen-mitra.bps.go.id`
- **Fungsi:** Otomatisasi proses alokasi dan manajemen mitra survei

### 2. SIPW (Sistem Informasi Pengolahan Web)
- **URL:** `sipw.bps.go.id`
- **Fungsi:** Otomatisasi proses pengolahan data dan workflow

## 📁 Struktur File

```
console_automate_bps/
├── README.md                 # Dokumentasi utama
├── mitra-management/         # Script untuk manajemen-mitra.bps.go.id
│   ├── alokasi-mitra.js     # Otomatisasi alokasi mitra
│   ├── bulk-assignment.js   # Assignment massal mitra
│   ├── status-checker.js    # Pengecekan status mitra
│   └── data-export.js       # Export data mitra
├── sipw-automation/          # Script untuk sipw.bps.go.id
│   ├── data-entry.js        # Otomatisasi input data
│   ├── validation.js        # Validasi data otomatis
│   ├── workflow.js          # Otomatisasi workflow
│   └── report-generator.js  # Generate laporan otomatis
└── utils/                   # Utility functions
    ├── common-functions.js  # Fungsi umum yang sering digunakan
    ├── logger.js           # Sistem logging
    └── config.js           # Konfigurasi global
```

## 🚀 Cara Penggunaan

### Persiapan
1. Buka browser (Chrome/Firefox/Edge)
2. Login ke platform BPS yang diinginkan
3. Buka Developer Tools (F12)
4. Masuk ke tab **Console**

### Menjalankan Script

#### Untuk Manajemen Mitra:
```javascript
// 1. Copy script yang diperlukan dari folder mitra-management/
// 2. Paste di console browser
// 3. Tekan Enter untuk menjalankan

// Contoh: Alokasi Mitra Otomatis
// [Paste script alokasi-mitra.js di sini]
```

#### Untuk SIPW:
```javascript
// 1. Copy script yang diperlukan dari folder sipw-automation/
// 2. Paste di console browser  
// 3. Tekan Enter untuk menjalankan

// Contoh: Data Entry Otomatis
// [Paste script data-entry.js di sini]
```

## 📝 Deskripsi File

### Manajemen Mitra (`mitra-management/`)

#### `alokasi-mitra.js`
- **Fungsi:** Mengotomatisasi proses alokasi mitra ke berbagai wilayah kerja
- **Fitur:**
  - Alokasi mitra berdasarkan kriteria tertentu
  - Bulk assignment ke multiple wilayah
  - Validasi otomatis sebelum assignment
  - Progress tracking dengan log detail

#### `bulk-assignment.js`
- **Fungsi:** Assignment massal mitra dalam jumlah besar
- **Fitur:**
  - Import data dari CSV/Excel
  - Batch processing dengan delay
  - Error handling dan retry mechanism
  - Summary report hasil assignment

#### `status-checker.js`
- **Fungsi:** Monitoring status mitra secara berkala
- **Fitur:**
  - Pengecekan status real-time
  - Alert untuk perubahan status penting
  - Export hasil monitoring
  - Dashboard sederhana di console

#### `data-export.js`
- **Fungsi:** Export data mitra dalam berbagai format
- **Fitur:**
  - Export ke CSV, JSON, atau Excel
  - Filter data berdasarkan kriteria
  - Kompresi data untuk file besar
  - Backup otomatis

### SIPW Automation (`sipw-automation/`)

#### `data-entry.js`
- **Fungsi:** Otomatisasi input data ke sistem SIPW
- **Fitur:**
  - Auto-fill form dari data source
  - Validasi data sebelum submit
  - Batch data entry
  - Error detection dan correction

#### `validation.js`
- **Fungsi:** Validasi data otomatis sesuai business rules
- **Fitur:**
  - Rule-based validation
  - Cross-field validation
  - Data integrity checking
  - Automated correction suggestions

#### `workflow.js`
- **Fungsi:** Otomatisasi alur kerja dalam SIPW
- **Fitur:**
  - Auto-approval untuk kriteria tertentu
  - Workflow routing otomatis
  - Status tracking
  - Notification handling

#### `report-generator.js`
- **Fungsi:** Generate laporan otomatis dari data SIPW
- **Fitur:**
  - Template-based reporting
  - Scheduled report generation
  - Multiple output formats
  - Data visualization

### Utilities (`utils/`)

#### `common-functions.js`
- **Fungsi:** Kumpulan fungsi utility yang sering digunakan
- **Isi:**
  - DOM manipulation helpers
  - Date/time utilities
  - String formatting functions
  - HTTP request helpers

#### `logger.js`
- **Fungsi:** Sistem logging untuk debugging dan monitoring
- **Fitur:**
  - Colored console output
  - Log levels (ERROR, WARN, INFO, DEBUG)
  - Timestamp automatic
  - Log export functionality

#### `config.js`
- **Fungsi:** Konfigurasi global untuk semua script
- **Isi:**
  - URL endpoints
  - Timing settings
  - Default parameters
  - Environment variables

## ⚙️ Konfigurasi

### Setting Default
```javascript
// Delay antar aksi (milliseconds)
const DEFAULT_DELAY = 5000;

// Timeout untuk request (milliseconds)  
const REQUEST_TIMEOUT = 30000;

// Maximum retry attempts
const MAX_RETRIES = 3;

// Batch size untuk processing
const BATCH_SIZE = 50;
```

### Customization
Setiap script dapat dikustomisasi dengan mengubah parameter di bagian atas file:

```javascript
// Contoh kustomisasi di alokasi-mitra.js
const CONFIG = {
    delay: 3000,           // Delay antar klik (ms)
    batchSize: 25,         // Jumlah item per batch
    autoRetry: true,       // Auto retry jika error
    logLevel: 'INFO'       // Level logging
};
```

## 🔧 Troubleshooting

### Error Umum

#### "Cannot find element"
- **Penyebab:** Perubahan struktur HTML halaman
- **Solusi:** Update selector di script

#### "Request timeout"
- **Penyebab:** Koneksi lambat atau server overload
- **Solusi:** Tingkatkan nilai `REQUEST_TIMEOUT`

#### "Too many requests"
- **Penyebab:** Rate limiting dari server
- **Solusi:** Tingkatkan delay antar request

### Tips Debug
1. Buka console untuk melihat log detail
2. Gunakan `debugger;` untuk breakpoint
3. Check network tab untuk failed requests
4. Pastikan login session masih aktif

## ⚠️ Peringatan & Disclaimer

### Penggunaan yang Bertanggung Jawab
- **Rate Limiting:** Jangan spam server dengan request berlebihan
- **Data Backup:** Selalu backup data sebelum menjalankan script
- **Testing:** Test script di environment development terlebih dahulu
- **Monitoring:** Monitor penggunaan untuk menghindari abuse

### Disclaimer
- Script ini dibuat untuk membantu otomatisasi tugas repetitif
- Pengguna bertanggung jawab penuh atas penggunaan script
- Tidak ada garansi bahwa script akan bekerja 100% sempurna
- Perubahan pada website BPS dapat mempengaruhi fungsi script

## 🤝 Kontribusi

### Cara Berkontribusi
1. Fork repository ini
2. Buat branch baru untuk fitur/perbaikan
3. Commit changes dengan pesan yang jelas
4. Push ke branch
5. Buat Pull Request

### Guidelines
- Ikuti coding style yang sudah ada
- Tambahkan dokumentasi untuk fungsi baru
- Test script sebelum submit PR
- Update README jika diperlukan

## 📞 Support

### Pelaporan Bug
- Buat issue di GitHub dengan label "bug"
- Sertakan screenshot dan error message
- Jelaskan langkah untuk reproduce bug

### Feature Request
- Buat issue dengan label "enhancement"
- Jelaskan kebutuhan dan use case
- Berikan contoh implementasi jika memungkinkan

## 📄 License

Project ini menggunakan MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📚 Changelog

### v1.0.0 (Latest)
- Initial release
- Basic automation untuk manajemen mitra
- SIPW automation framework
- Utility functions dan logging system

---

**⭐ Jika project ini membantu pekerjaan Anda, jangan lupa berikan star!**

**💡 Ada saran atau improvement? Silakan buat issue atau pull request!**