//buka tabel simdasi https://simdasi.bps.go.id/tabel/daftar

(function() {

    const progress = {};

    function getRows(kode) {
        return $('tr').filter(function() {
            return $(this).find(`td .label:contains("${kode}")`).length > 0;
        });
    }

    window.bukaNext = function(kode) {

        if (!kode) {
            console.log("%cMasukkan kode. Contoh: bukaNext('5.1.1')", "color: red; font-weight: bold;");
            return;
        }

        const rows = getRows(kode);

        if (!rows.length) {
            console.log(`%cTidak ditemukan baris untuk ${kode}`, "color: red;");
            return;
        }

        if (!progress[kode]) progress[kode] = 0;

        const currentIndex = progress[kode];

        if (currentIndex >= rows.length) {
            console.log(`%cSemua baris ${kode} sudah diproses!`, "color: green; font-weight: bold;");
            return;
        }

        const currentRow = $(rows[currentIndex]);
        const targetLink = currentRow.find('a[href^="/tabel/view_table/"]').first();

        currentRow.css({
            'background-color': '#ffff00',
            'border': '3px solid red',
            'transition': 'all 0.3s'
        });

        currentRow[0].scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (targetLink.length) {
            console.log(`%cMembuka ${kode} ke-${currentIndex + 1}`, "color: lightblue; font-weight: bold;");
            window.open(targetLink.attr('href'), '_blank');
        }

        progress[kode]++;
        console.log(
            `%cProgress ${kode}: ${progress[kode]}/${rows.length}`,
            "color: purple;"
        );
    };


    // ==============================
    // RESET PER KODE
    // ==============================
    window.reset = function(kode) {

        if (!kode) {
            console.log("%cMasukkan kode. Contoh: reset('5.1.1')", "color: red;");
            return;
        }

        progress[kode] = 0;
        console.log(`%cProgress ${kode} direset ke 0`, "color: orange; font-weight: bold;");
    };


    // ==============================
    // RESET SEMUA
    // ==============================
    window.resetAll = function() {
        Object.keys(progress).forEach(k => progress[k] = 0);
        console.log("%cSemua progress berhasil direset", "color: orange; font-weight: bold;");
    };


    // ==============================
    // SYSTEM READY LOG
    // ==============================
    console.log("%cSystem Ready!", "color: white; background: green; padding: 6px; font-weight: bold;");

    console.log("%cFitur yang tersedia:", "color: cyan; font-weight: bold;");

    console.log(
        "%cbukaNext('5.1.1')%c  → Membuka baris berikutnya sesuai kode (progress tersimpan per kode)",
        "color: yellow; font-weight: bold;",
        "color: white;"
    );

    console.log(
        "%creset('5.1.1')%c     → Reset progress untuk satu kode saja",
        "color: orange; font-weight: bold;",
        "color: white;"
    );

    console.log(
        "%cresetAll()%c         → Reset semua progress kode",
        "color: red; font-weight: bold;",
        "color: white;"
    );

})();
