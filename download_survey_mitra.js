// https://manajemen-mitra.bps.go.id/mitra/kepka
// const id = [] // array kosong untuk ambil semua
const id = ['9702xxxxxxxx','9702xxxxxxxx','Sobat ID','atau buat array kosong untuk ambil semua'];

const elements = document.querySelectorAll("#vgt-table > tbody > tr > td.vgt-left-align.moveColumnRight > span > div > button:nth-child(1)");

console.log(`Ditemukan ${elements.length} elemen untuk diklik`);
console.log(`Array ID berisi ${id.length} item`);

for (let i = 0; i < elements.length; i++) {
    try {
        let shouldClick = true;
        
        // Jika array tidak kosong, lakukan pengecekan
        if (id.length > 0) {
            // Ambil text dari kolom ke-3 pada row yang sesuai
            const textElement = document.querySelector(`#vgt-table > tbody > tr:nth-child(${i + 1}) > td:nth-child(3) > span > div > div > span`);
            
            if (textElement) {
                const textValue = textElement.innerText.trim();
                console.log(`Row ke-${i + 1}: Text ditemukan = "${textValue}"`);
                
                // Cek apakah text ada di array
                shouldClick = id.includes(textValue);
                
                if (shouldClick) {
                    console.log(`✓ Text "${textValue}" ditemukan di array, akan diklik`);
                } else {
                    console.log(`✗ Text "${textValue}" tidak ditemukan di array, skip`);
                }
            } else {
                console.log(`Row ke-${i + 1}: Text element tidak ditemukan, skip`);
                shouldClick = false;
            }
        } else {
            console.log(`Array kosong, klik semua elemen`);
        }
        
        if (shouldClick) {
            // Scroll ke elemen agar terlihat
            elements[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Tunggu sebentar agar scroll selesai
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Klik elemen
            elements[i].click();
            console.log(`Elemen ke-${i + 1} berhasil diklik`);
            
            // Jeda 3 detik sebelum klik berikutnya (kecuali elemen terakhir)
            if (i < elements.length - 1) {
                console.log(`Menunggu 3 detik sebelum proses berikutnya...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } else {
            console.log(`Elemen ke-${i + 1} dilewati (tidak diklik)`);
            // Tidak ada jeda jika tidak diklik
        }
        
    } catch (error) {
        console.error(`Error saat memproses elemen ke-${i + 1}:`, error);
    }
}

console.log('Proses selesai');
