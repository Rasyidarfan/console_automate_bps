async function autoClickAllPages() {
    console.log("🚀 Memulai proses auto-click untuk semua halaman...");
    
    const buttonSelector = "#root > div > div > main > div > div.p-6.pt-0 > div > div.rounded-md.border > div > table > tbody > tr > td:nth-child(6) > div > button";
    const nextPageSelector = "#root > div > div > main > div > div.p-6.pt-0 > div > div.flex.items-center.justify-end.space-x-2.py-4 > div:nth-child(3) > button:nth-child(3)";
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    let currentPage = 1;
    
    while (true) {
        console.log(`\n📄 === HALAMAN ${currentPage} ===`);
        
        // Tunggu halaman dimuat
        await delay(2000);
        
        const buttons = document.querySelectorAll(buttonSelector);
        
        if (buttons.length === 0) {
            console.log("❌ Tidak ada tombol di halaman ini");
            break;
        }
        
        console.log(`📋 Ditemukan ${buttons.length} tombol di halaman ${currentPage}`);
        
        // Klik semua tombol di halaman ini
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            button.click();
            
            console.log(`✅ Halaman ${currentPage} - Tombol ${i + 1}/${buttons.length} diklik`);
            
            if (i < buttons.length - 1) {
                console.log("⏱️ Menunggu 5 detik...");
                await delay(5000);
            }
        }
        
        console.log(`🎉 Halaman ${currentPage} selesai!`);
        
        // Cek tombol next page
        const nextButton = document.querySelector(nextPageSelector);
        
        if (nextButton && !nextButton.disabled) {
            console.log(`➡️ Pindah ke halaman ${currentPage + 1}...`);
            await delay(2000);
            nextButton.click();
            currentPage++;
            await delay(3000); // Tunggu halaman baru dimuat
        } else {
            console.log("🏁 Sudah mencapai halaman terakhir atau tombol next tidak tersedia");
            break;
        }
    }
    
    console.log(`\n🎊 SELESAI! Total ${currentPage} halaman telah diproses`);
}

// Jalankan fungsi untuk semua halaman
autoClickAllPages();
