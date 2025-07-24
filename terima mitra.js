// Fungsi untuk menunggu (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk menunggu elemen muncul
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} tidak ditemukan dalam ${timeout}ms`));
        }, timeout);
    });
}

// Fungsi utama
async function autoClick() {
    try {
        console.log('Memulai proses auto click...');

        // Loop utama - ulangi sampai tidak ada lagi button.btn-success
        while (true) {
            // 1. Klik semua $('#vgt-table button.btn-success')
            const successButtons = $('#vgt-table button.btn-success');
            if (successButtons.length === 0) {
                console.log('Tidak ada lagi button.btn-success yang ditemukan. Proses selesai.');
                break;
            }

            console.log(`Ditemukan ${successButtons.length} button.btn-success`);
            
            // Klik semua button success
            successButtons.each(function(index) {
                console.log(`Mengklik button success ke-${index + 1}`);
                $(this).click();
            });

            // Tunggu sebentar agar dialog muncul
            await sleep(500);

            // 2. Klik SweetAlert2 confirm button pertama
            try {
                const confirmButton1 = await waitForElement("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled", 3000);
                console.log('Mengklik SweetAlert2 confirm button pertama');
                confirmButton1.click();
                await sleep(300);
            } catch (e) {
                console.log('SweetAlert2 confirm button pertama tidak ditemukan:', e.message);
            }

            // 3. Klik SweetAlert2 confirm button kedua
            try {
                const confirmButton2 = await waitForElement("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled", 3000);
                console.log('Mengklik SweetAlert2 confirm button kedua');
                confirmButton2.click();
                await sleep(300);
            } catch (e) {
                console.log('SweetAlert2 confirm button kedua tidak ditemukan:', e.message);
            }

            // 4. Tunggu 1 detik
            console.log('Menunggu 1 detik...');
            await sleep(1000);

            // 5. Klik button.btn-primary
            try {
                const primaryButton = $('button.btn-primary');
                if (primaryButton.length > 0) {
                    console.log('Mengklik button.btn-primary');
                    primaryButton.first().click();
                    await sleep(500);
                } else {
                    console.log('button.btn-primary tidak ditemukan');
                }
            } catch (e) {
                console.log('Error saat mengklik button.btn-primary:', e.message);
            }

            // Tunggu sebentar sebelum iterasi berikutnya
            await sleep(1000);
        }

        console.log('Proses auto click selesai!');
        document.querySelector("#sticky-nav > div.navbar.navbar-expand-md.navbar-light.d-print-none > div > div > div:nth-child(2)").click()
        await(300)
        document.querySelector("#sticky-nav > div.navbar.navbar-expand-md.navbar-light.d-print-none > div > div > div:nth-child(2) > div > a:nth-child(13)").click()
        await(500)
        window.open("https://mitra.bps.go.id/login","_self")

    } catch (error) {
        console.error('Terjadi error:', error);
    }
}