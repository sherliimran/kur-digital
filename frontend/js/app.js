
/* =========================================================
   KUR DIGITAL
   APP.JS
   Versi 2.0
   Sistem Frontend Nasabah
   ========================================================= */


/* =========================================================
   KONFIGURASI API
   ========================================================= */

const API_BASE =
    window.KUR_API_BASE ||
    "http://localhost:3000/api";


/* =========================================================
   HELPER UMUM
   ========================================================= */

function getElement(id){

    return document.getElementById(id);

}


function getValue(id){

    const element = getElement(id);

    return element
        ? element.value.trim()
        : "";

}


function setText(id, text){

    const element = getElement(id);

    if(element){

        element.textContent =
            text ?? "";

    }

}


function setHTML(id, html){

    const element = getElement(id);

    if(element){

        element.innerHTML =
            html ?? "";

    }

}


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(angka){

    const nilai =
        Number(angka || 0);

    return "Rp " +
        nilai.toLocaleString("id-ID");

}


/* =========================================================
   FORMAT TANGGAL
   ========================================================= */

function formatTanggal(tanggal){

    if(!tanggal){

        return "-";

    }

    try{

        return new Date(tanggal)
            .toLocaleString(
                "id-ID",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }catch(error){

        return tanggal;

    }

}


/* =========================================================
   REQUEST API
   ========================================================= */

async function apiRequest(
    endpoint,
    options = {}
){

    try{

        const response =
            await fetch(
                API_BASE + endpoint,
                {
                    ...options,

                    headers:{
                        "Content-Type":
                            "application/json",

                        ...(options.headers || {})
                    }
                }
            );


        let data = null;

        try{

            data =
                await response.json();

        }catch(error){

            data = null;

        }


        if(!response.ok){

            throw new Error(
                data?.message ||
                `HTTP ${response.status}`
            );

        }


        return data;

    }catch(error){

        console.error(
            "API ERROR:",
            endpoint,
            error
        );

        throw error;

    }

}


/* =========================================================
   CEK BACKEND
   ========================================================= */

async function cekBackend(){

    try{

        const data =
            await apiRequest(
                "/health"
            );


        console.log(
            "✅ Backend aktif:",
            data
        );


        return true;

    }catch(error){

        console.warn(
            "⚠️ Backend tidak dapat diakses."
        );


        return false;

    }

}


/* =========================================================
   RIWAYAT AKTIVITAS LOCAL
   ========================================================= */

function tambahRiwayat(
    judul,
    detail
){

    let riwayat = [];


    try{

        riwayat =
            JSON.parse(
                localStorage.getItem(
                    "riwayatAktivitas"
                )
            ) || [];

    }catch(error){

        riwayat = [];

    }


    riwayat.unshift({

        judul:

            judul,

        detail:

            detail,

        tanggal:

            new Date()
                .toLocaleString(
                    "id-ID"
                )

    });


    /*
       Maksimal 100 aktivitas
    */

    if(riwayat.length > 100){

        riwayat =
            riwayat.slice(0, 100);

    }


    localStorage.setItem(

        "riwayatAktivitas",

        JSON.stringify(
            riwayat
        )

    );

}


/* =========================================================
   AMBIL RIWAYAT AKTIVITAS
   ========================================================= */

function ambilRiwayat(){

    try{

        return JSON.parse(

            localStorage.getItem(
                "riwayatAktivitas"
            )

        ) || [];

    }catch(error){

        return [];

    }

}


/* =========================================================
   SIMPAN DATA LOGIN
   ========================================================= */

function simpanLogin(data){

    localStorage.setItem(
        "login",
        "true"
    );


    if(data){

        if(data.id){

            localStorage.setItem(
                "nasabah_id",
                data.id
            );

        }


        if(data.nama){

            localStorage.setItem(
                "nama",
                data.nama
            );

        }


        if(data.email){

            localStorage.setItem(
                "email",
                data.email
            );

        }


        if(data.no_hp){

            localStorage.setItem(
                "hp",
                data.no_hp
            );

        }

    }

}


/* =========================================================
   CEK LOGIN
   ========================================================= */

function isLogin(){

    return (
        localStorage.getItem(
            "login"
        ) === "true"
    );

}


/* =========================================================
   PROTEKSI HALAMAN
   ========================================================= */

function cekLogin(){

    const halaman =
        location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const halamanPublik = [

        "",
        "index.html",
        "login.html",
        "register.html",
        "daftar.html"

    ];


    if(

        !halamanPublik.includes(
            halaman
        )

        &&

        !isLogin()

    ){

        window.location.href =
            "login.html";

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

async function login(){

    const emailElement =
        getElement("email");

    const passwordElement =
        getElement("password");

    const pinElement =
        getElement("pin");


    /*
       LOGIN EMAIL + PASSWORD
    */

    if(
        emailElement &&
        passwordElement
    ){

        const email =
            emailElement.value
                .trim();

        const password =
            passwordElement.value;


        if(
            !email ||
            !password
        ){

            alert(
                "Email dan Password wajib diisi."
            );

            return;

        }


        /*
           Backend versi sekarang
           belum memiliki endpoint login.

           Untuk sementara menggunakan
           data lokal hasil pendaftaran.
        */

        const emailTersimpan =
            localStorage.getItem(
                "email"
            );


        const passwordTersimpan =
            localStorage.getItem(
                "password"
            );


        if(

            email === emailTersimpan &&

            password === passwordTersimpan

        ){

            simpanLogin({

                nama:
                    localStorage.getItem(
                        "nama"
                    ),

                email:
                    email

            });


            tambahRiwayat(

                "Login",

                "Nasabah berhasil masuk ke KUR Digital."

            );


            window.location.href =
                "dashboard.html";


        }else{

            alert(
                "Email atau Password salah!"
            );

        }


        return;

    }


    /*
       LOGIN PIN
    */

    if(pinElement){

        const pin =
            pinElement.value.trim();


        const pinTersimpan =
            localStorage.getItem(
                "pin"
            );


        if(

            pinTersimpan &&
            pin === pinTersimpan

        ){

            simpanLogin({

                nama:
                    localStorage.getItem(
                        "nama"
                    )

            });


            tambahRiwayat(

                "Login",

                "Login menggunakan PIN berhasil."

            );


            window.location.href =
                "dashboard.html";


        }else{

            alert(
                "PIN salah atau belum terdaftar."
            );

        }

    }

}


/* =========================================================
   DAFTAR NASABAH
   ========================================================= */

async function daftar(){

    const nama =
        getValue("nama");

    const email =
        getValue("email");

    const hp =
        getValue("hp");

    const passwordElement =
        getElement("password");

    const konfirmasiElement =
        getElement("konfirmasi");


    const password =
        passwordElement
            ? passwordElement.value
            : "";


    const konfirmasi =
        konfirmasiElement
            ? konfirmasiElement.value
            : "";


    if(

        !nama ||
        !email ||
        !hp ||
        !password ||
        !konfirmasi

    ){

        alert(
            "Semua data harus diisi!"
        );

        return;

    }


    if(password.length < 6){

        alert(
            "Password minimal 6 karakter."
        );

        return;

    }


    if(password !== konfirmasi){

        alert(
            "Password tidak sama!"
        );

        return;

    }


    /*
       Simpan lokal terlebih dahulu.
       Endpoint POST nasabah belum tersedia
       pada server.js versi sekarang.
    */

    localStorage.setItem(
        "nama",
        nama
    );


    localStorage.setItem(
        "email",
        email
    );


    localStorage.setItem(
        "hp",
        hp
    );


    localStorage.setItem(
        "password",
        password
    );


    tambahRiwayat(

        "Akun Dibuat",

        "Akun KUR Digital berhasil dibuat."

    );


    alert(
        "Pendaftaran berhasil!"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout(){

    const yakin =
        confirm(
            "Apakah Anda yakin ingin keluar?"
        );


    if(!yakin){

        return;

    }


    tambahRiwayat(

        "Logout",

        "Nasabah keluar dari aplikasi."

    );


    localStorage.removeItem(
        "login"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   DATA NASABAH DARI BACKEND
   ========================================================= */

async function ambilDataNasabah(){

    try{

        const response =
            await apiRequest(
                "/nasabah"
            );


        if(

            response &&
            Array.isArray(
                response.data
            )

        ){

            return response.data;

        }


        return [];

    }catch(error){

        return [];

    }

}


/* =========================================================
   CARI DATA NASABAH LOGIN
   ========================================================= */

async function cariNasabahLogin(){

    const nasabahId =
        Number(
            localStorage.getItem(
                "nasabah_id"
            )
        );


    if(!nasabahId){

        return null;

    }


    try{

        const data =
            await ambilDataNasabah();


        return (

            data.find(
                nasabah =>
                    Number(
                        nasabah.id
                    ) === nasabahId
            ) || null

        );

    }catch(error){

        return null;

    }

}


/* =========================================================
   PENGAJUAN KUR
   ========================================================= */

async function kirimPengajuan(){

    const nama =
        getValue("nama");

    const nik =
        getValue("nik");

    const hp =
        getValue("hp");

    const alamat =
        getValue("alamat");

    const usaha =
        getValue("usaha");

    const jenisUsaha =
        getValue("jenisUsaha");

    const lamaUsaha =
        getValue("lamaUsaha");

    const penghasilan =
        getValue("penghasilan");

    const jenisKur =
        getValue("jenisKur");

    const pinjaman =
        getValue("pinjaman");

    const tenor =
        getValue("tenor");


    if(

        !nama ||
        !nik ||
        !hp ||
        !pinjaman ||
        !tenor

    ){

        alert(
            "Mohon lengkapi data pengajuan terlebih dahulu."
        );

        return;

    }


    const jumlahPinjaman =
        Number(
            pinjaman
                .replace(/\D/g, "")
        );


    if(
        !jumlahPinjaman ||
        jumlahPinjaman <= 0
    ){

        alert(
            "Jumlah pinjaman tidak valid."
        );

        return;

    }


    const data = {

        nama:

            nama,

        nik:

            nik,

        hp:

            hp,

        alamat:

            alamat,

        usaha:

            usaha,

        jenisUsaha:

            jenisUsaha,

        lamaUsaha:

            lamaUsaha,

        penghasilan:

            penghasilan,

        jenis_kur:

            jenisKur,

        pinjaman:

            jumlahPinjaman,

        tenor:

            Number(tenor),

        status:

            "Menunggu Verifikasi",

        progress:

            20

    };


    /*
       Simpan data pengajuan lokal.
    */

    localStorage.setItem(

        "pengajuan",

        JSON.stringify(
            data
        )

    );


    localStorage.setItem(

        "nama",

        nama

    );


    localStorage.setItem(

        "pinjaman",

        jumlahPinjaman

    );


    localStorage.setItem(

        "tenor",

        tenor

    );


    localStorage.setItem(

        "status",

        "Menunggu Verifikasi"

    );


    localStorage.setItem(

        "progress",

        "20"

    );


    tambahRiwayat(

        "Pengajuan KUR Dibuat",

        "Pengajuan sebesar " +

        formatRupiah(
            jumlahPinjaman
        ) +

        " dengan tenor " +

        tenor +

        " bulan telah berhasil dibuat."

    );


    alert(
        "Pengajuan berhasil dikirim."
    );


    window.location.href =
        "status.html";

}


/* =========================================================
   AMBIL DATA PENGAJUAN DARI BACKEND
   ========================================================= */

async function ambilPengajuan(){

    try{

        const response =
            await apiRequest(
                "/pengajuan"
            );


        if(

            response &&
            Array.isArray(
                response.data
            )

        ){

            return response.data;

        }


        return [];

    }catch(error){

        return [];

    }

}


/* =========================================================
   UPDATE STATUS
   ========================================================= */

function updateStatus(progress){

    progress =
        Number(progress || 0);


    let status;


    if(progress <= 0){

        status =
            "Belum Mengajukan";

    }else if(progress === 20){

        status =
            "Menunggu Verifikasi";

    }else if(progress === 40){

        status =
            "Verifikasi Dokumen";

    }else if(progress === 60){

        status =
            "Survey Lapangan";

    }else if(progress === 80){

        status =
            "Persetujuan Kredit";

    }else if(progress >= 100){

        status =
            "Dana Dicairkan";

        progress = 100;

    }else{

        status =
            "Dalam Proses";

    }


    localStorage.setItem(
        "progress",
        progress
    );


    localStorage.setItem(
        "status",
        status
    );


    setText(
        "statusJudul",
        status
    );


    setText(
        "statusText",
        status
    );


    const bar =
        getElement(
            "progressBar"
        );


    if(bar){

        bar.style.width =
            progress + "%";


        if(
            "textContent" in bar
        ){

            bar.textContent =
                progress + "%";

        }

    }


    setText(
        "progressText",
        progress + "%"
    );


    setText(
        "statusBadge",
        status
    );

}


/* =========================================================
   LOAD STATUS
   ========================================================= */

function loadStatus(){

    const progress =
        Number(
            localStorage.getItem(
                "progress"
            ) || 0
        );


    updateStatus(
        progress
    );


    const pengajuan =
        localStorage.getItem(
            "pengajuan"
        );


    if(pengajuan){

        try{

            const data =
                JSON.parse(
                    pengajuan
                );


            setText(
                "nomorPengajuan",
                data.nomor_pengajuan ||
                data.nomorPengajuan ||
                "-"
            );


            setText(
                "jumlahPinjaman",
                formatRupiah(
                    data.pinjaman ||
                    data.jumlah_pinjaman
                )
            );


            setText(
                "tenor",
                data.tenor +
                " bulan"
            );

        }catch(error){

            console.warn(
                "Data pengajuan tidak valid."
            );

        }

    }

}


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

async function updateDashboard(){

    const nama =
        localStorage.getItem(
            "nama"
        ) ||
        "Nasabah";


    const saldo =
        Number(
            localStorage.getItem(
                "saldo"
            ) || 0
        );


    const status =
        localStorage.getItem(
            "status"
        ) ||
        "Belum Mengajukan";


    const progress =
        Number(
            localStorage.getItem(
                "progress"
            ) || 0
        );


    /*
       Nama
    */

    setText(
        "namaUser",
        nama
    );


    setText(
        "namaNasabah",
        nama
    );


    /*
       Saldo
    */

    setText(
        "saldoPinjaman",
        formatRupiah(
            saldo
        )
    );


    /*
       Status
    */

    setText(
        "statusBadge",
        status
    );


    setText(
        "statusNasabah",
        status
    );


    /*
       Progress
    */

    const progressBar =
        getElement(
            "progressBar"
        );


    if(progressBar){

        progressBar.style.width =
            progress + "%";

    }


    setText(
        "progressText",
        progress + "%"
    );


    /*
       Tanggal dan waktu
    */

    updateTanggalWaktu();

}


/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

async function loadDashboard(){

    await updateDashboard();

}


/* =========================================================
   TANGGAL DAN WAKTU
   ========================================================= */

function updateTanggalWaktu(){

    const sekarang =
        new Date();


    const hari = [

        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"

    ];


    const bulan = [

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];


    const tanggalText =

        hari[
            sekarang.getDay()
        ]

        + ", "

        +

        sekarang.getDate()

        +

        " "

        +

        bulan[
            sekarang.getMonth()
        ]

        +

        " "

        +

        sekarang.getFullYear();


    const jam =

        String(
            sekarang.getHours()
        ).padStart(2, "0")

        +

        ":"

        +

        String(
            sekarang.getMinutes()
        ).padStart(2, "0")

        +

        ":"

        +

        String(
            sekarang.getSeconds()
        ).padStart(2, "0");


    setText(
        "tanggalSekarang",
        tanggalText
    );


    setText(
        "tanggal",
        tanggalText
    );


    setText(
        "jam",
        jam
    );


    setText(
        "clock",
        jam
    );

}


/* =========================================================
   JAM DIGITAL
   ========================================================= */

function mulaiJam(){

    updateTanggalWaktu();


    setInterval(

        updateTanggalWaktu,

        1000

    );

}


/* =========================================================
   TOGGLE SALDO
   ========================================================= */

function toggleSaldo(){

    const saldoElement =
        getElement(
            "saldoPinjaman"
        );


    if(!saldoElement){

        return;

    }


    const saldo =
        Number(
            localStorage.getItem(
                "saldo"
            ) || 0
        );


    const sedangTampil =

        saldoElement.dataset
            .visible === "true";


    if(sedangTampil){

        saldoElement.textContent =
            "Rp ••••••••";

        saldoElement.dataset.visible =
            "false";

    }else{

        saldoElement.textContent =
            formatRupiah(
                saldo
            );

        saldoElement.dataset.visible =
            "true";

    }

}


/* =========================================================
   REKENING PEMBAYARAN
   ========================================================= */

async function loadRekeningPembayaran(){

    try{

        const response =
            await apiRequest(
                "/rekening-pembayaran"
            );


        if(

            !response ||
            !response.data

        ){

            return;

        }


        const data =
            response.data;


        setText(
            "namaBank",
            data.bank
        );


        setText(
            "bank",
            data.bank
        );


        setText(
            "nomorRekening",
            data.nomor_rekening
        );


        setText(
            "rekening",
            data.nomor_rekening
        );


        setText(
            "atasNama",
            data.atas_nama
        );


        setText(
            "rekeningAtasNama",
            data.atas_nama
        );


        /*
           Simpan cache lokal
        */

        localStorage.setItem(

            "rekeningPembayaran",

            JSON.stringify(
                data
            )

        );

    }catch(error){

        console.warn(
            "Rekening pembayaran belum dapat dimuat."
        );

    }

}


/* =========================================================
   PEMBAYARAN
   ========================================================= */

async function kirimPembayaran(){

    const nasabahId =
        Number(
            localStorage.getItem(
                "nasabah_id"
            )
        );


    const pinjamanId =
        Number(
            localStorage.getItem(
                "pinjaman_id"
            )
        ) || null;


    const angsuranKe =
        Number(
            getValue(
                "angsuranKe"
            ) || 1
        );


    const jumlahRaw =
        getValue(
            "jumlahPembayaran"
        );


    const jumlah =
        Number(
            jumlahRaw
                .replace(/\D/g, "")
        );


    const buktiFile =
        getValue(
            "buktiFile"
        );


    if(!nasabahId){

        alert(
            "ID nasabah belum tersedia."
        );

        return;

    }


    if(!jumlah || jumlah <= 0){

        alert(
            "Jumlah pembayaran wajib diisi."
        );

        return;

    }


    try{

        const response =
            await apiRequest(

                "/pembayaran",

                {

                    method:
                        "POST",

                    body:
                        JSON.stringify({

                            nasabah_id:
                                nasabahId,

                            pinjaman_id:
                                pinjamanId,

                            angsuran_ke:
                                angsuranKe,

                            jumlah:
                                jumlah,

                            bukti_file:
                                buktiFile

                        })

                }

            );


        if(
            response.success
        ){

            tambahRiwayat(

                "Pembayaran Dikirim",

                "Pembayaran sebesar " +

                formatRupiah(
                    jumlah
                ) +

                " berhasil dikirim untuk verifikasi."

            );


            alert(
                "Pembayaran berhasil dikirim dan menunggu verifikasi admin."
            );


            if(
                typeof loadRiwayatPembayaran ===
                "function"
            ){

                await loadRiwayatPembayaran();

            }

        }

    }catch(error){

        alert(

            "Gagal mengirim pembayaran.\n\n" +

            error.message

        );

    }

}


/* =========================================================
   RIWAYAT PEMBAYARAN
   ========================================================= */

async function loadRiwayatPembayaran(){

    const nasabahId =
        Number(
            localStorage.getItem(
                "nasabah_id"
            )
        );


    if(!nasabahId){

        return;

    }


    try{

        const response =
            await apiRequest(

                "/pembayaran/nasabah/" +
                nasabahId

            );


        if(
            !response.success
        ){

            return;

        }


        const data =
            response.data || [];


        const container =
            getElement(
                "riwayatPembayaran"
            );


        if(!container){

            return;

        }


        if(data.length === 0){

            container.innerHTML = `

                <div class="empty-state">

                    <span>
                        Belum ada riwayat pembayaran.
                    </span>

                </div>

            `;

            return;

        }


        container.innerHTML =

            data.map(
                pembayaran => `

                    <div class="payment-item">

                        <div>

                            <strong>
                                Angsuran ke-
                                ${pembayaran.angsuran_ke}
                            </strong>

                            <small>
                                ${formatTanggal(
                                    pembayaran.tanggal_pembayaran
                                )}
                            </small>

                        </div>

                        <div>

                            <strong>
                                ${formatRupiah(
                                    pembayaran.jumlah
                                )}
                            </strong>

                            <span>
                                ${pembayaran.status}
                            </span>

                        </div>

                    </div>

                `
            ).join("");


    }catch(error){

        console.error(
            "Gagal memuat pembayaran:",
            error
        );

    }

}


/* =========================================================
   NOTIFIKASI
   ========================================================= */

async function loadNotifikasi(){

    const nasabahId =
        Number(
            localStorage.getItem(
                "nasabah_id"
            )
        );


    if(!nasabahId){

        return;

    }


    try{

        const response =
            await apiRequest(

                "/notifikasi/" +
                nasabahId

            );


        if(
            !response.success
        ){

            return;

        }


        const data =
            response.data || [];


        const container =
            getElement(
                "listNotifikasi"
            );


        if(!container){

            return;

        }


        if(data.length === 0){

            container.innerHTML = `

                <div class="empty-state">

                    Tidak ada notifikasi.

                </div>

            `;

            return;

        }


        container.innerHTML =

            data.map(
                item => `

                    <div class="notification-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.judul
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    item.pesan
                                )}
                            </p>

                            <small>
                                ${formatTanggal(
                                    item.tanggal
                                )}
                            </small>

                        </div>

                    </div>

                `
            ).join("");


    }catch(error){

        console.error(
            "Gagal memuat notifikasi:",
            error
        );

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================================
   TAMPILKAN RIWAYAT AKTIVITAS
   ========================================================= */

function loadRiwayatAktivitas(){

    const container =
        getElement(
            "listRiwayat"
        );


    if(!container){

        return;

    }


    const data =
        ambilRiwayat();


    if(data.length === 0){

        container.innerHTML = `

            <div class="empty-state">

                Belum ada aktivitas.

            </div>

        `;

        return;

    }


    container.innerHTML =

        data.map(
            item => `

                <div class="history-item">

                    <strong>
                        ${escapeHTML(
                            item.judul
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            item.detail
                        )}
                    </p>

                    <small>
                        ${escapeHTML(
                            item.tanggal
                        )}
                    </small>

                </div>

            `
        ).join("");

}


/* =========================================================
   LOAD PROFIL
   ========================================================= */

async function loadProfil(){

    const nama =
        localStorage.getItem(
            "nama"
        ) || "-";


    const email =
        localStorage.getItem(
            "email"
        ) || "-";


    const hp =
        localStorage.getItem(
            "hp"
        ) || "-";


    setText(
        "profilNama",
        nama
    );


    setText(
        "profilEmail",
        email
    );


    setText(
        "profilHP",
        hp
    );


    setText(
        "namaProfil",
        nama
    );


    setText(
        "emailProfil",
        email
    );


    setText(
        "hpProfil",
        hp
    );

}


/* =========================================================
   NAVIGASI HALAMAN
   ========================================================= */

function showPage(id){

    /*
       Untuk sistem halaman terpisah,
       langsung arahkan berdasarkan nama.
    */

    const pages = {

        home:
            "dashboard.html",

        dashboard:
            "dashboard.html",

        ajukan:
            "pengajuan.html",

        pengajuan:
            "pengajuan.html",

        status:
            "status.html",

        riwayat:
            "riwayat.html",

        pembayaran:
            "bayar.html",

        profil:
            "profil.html",

        notifikasi:
            "notifikasi.html"

    };


    if(
        pages[id]
    ){

        window.location.href =
            pages[id];

        return;

    }


    /*
       Untuk sistem SPA jika ada
       elemen .page
    */

    const sections =
        document.querySelectorAll(
            ".page"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        getElement(id);


    if(target){

        target.classList.add(
            "active"
        );

    }

}


/* =========================================================
   SIMULASI ANGSURAN
   ========================================================= */

function hitungSimulasi(){

    const pinjamanRaw =
        getValue(
            "jumlahPinjaman"
        ) ||

        getValue(
            "pinjaman"
        );


    const tenorRaw =
        getValue(
            "tenor"
        );


    const pinjaman =
        Number(
            pinjamanRaw
                .replace(/\D/g, "")
        );


    const tenor =
        Number(
            tenorRaw
        );


    if(
        !pinjaman ||
        !tenor
    ){

        alert(
            "Jumlah pinjaman dan tenor wajib diisi."
        );

        return;

    }


    /*
       Simulasi sederhana.
       Suku bunga hanya simulasi tampilan,
       bukan perhitungan resmi kredit.
    */

    const bunga =
        0.06;


    const total =
        pinjaman *
        (1 + bunga);


    const angsuran =
        total /
        tenor;


    setText(

        "hasilAngsuran",

        formatRupiah(
            Math.round(
                angsuran
            )
        )

    );


    setText(

        "totalPembayaran",

        formatRupiah(
            Math.round(
                total
            )
        )

    );


    setText(

        "jumlahCicilan",

        tenor +
        " bulan"

    );


    tambahRiwayat(

        "Simulasi Angsuran",

        "Simulasi pinjaman " +

        formatRupiah(
            pinjaman
        ) +

        " selama " +

        tenor +

        " bulan."

    );

}


/* =========================================================
   LOAD SEMUA DATA HALAMAN
   ========================================================= */

async function loadPageData(){

    const halaman =
        location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    switch(halaman){

        case "dashboard.html":

            await loadDashboard();

            break;


        case "status.html":

            loadStatus();

            break;


        case "bayar.html":

            await loadRekeningPembayaran();

            await loadRiwayatPembayaran();

            break;


        case "riwayat-pembayaran.html":

            await loadRiwayatPembayaran();

            break;


        case "notifikasi.html":

            await loadNotifikasi();

            break;


        case "riwayat.html":

            loadRiwayatAktivitas();

            break;


        case "profil.html":

            await loadProfil();

            break;

    }

}


/* =========================================================
   INISIALISASI APLIKASI
   ========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    async function(){

        console.log(
            "================================="
        );

        console.log(
            "KUR DIGITAL APP.JS v2.0"
        );

        console.log(
            "================================="
        );


        /*
           Cek login
        */

        cekLogin();


        /*
           Mulai jam
        */

        mulaiJam();


        /*
           Cek backend
        */

        await cekBackend();


        /*
           Load data sesuai halaman
        */

        await loadPageData();

    }

);


/* =========================================================
   AUTO REFRESH DASHBOARD
   ========================================================= */

setInterval(

    function(){

        const halaman =
            location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        if(
            halaman ===
            "dashboard.html"
        ){

            updateDashboard();

        }

    },

    30000

);


/* =========================================================
   EXPORT GLOBAL
   Untuk tombol HTML onclick=""
   ========================================================= */

window.login =
    login;

window.daftar =
    daftar;

window.logout =
    logout;

window.kirimPengajuan =
    kirimPengajuan;

window.updateStatus =
    updateStatus;

window.loadStatus =
    loadStatus;

window.updateDashboard =
    updateDashboard;

window.loadDashboard =
    loadDashboard;

window.toggleSaldo =
    toggleSaldo;

window.showPage =
    showPage;

window.hitungSimulasi =
    hitungSimulasi;

window.kirimPembayaran =
    kirimPembayaran;

window.loadRiwayatPembayaran =
    loadRiwayatPembayaran;

window.loadNotifikasi =
    loadNotifikasi;

window.loadProfil =
    loadProfil;

window.tambahRiwayat =
    tambahRiwayat;


/* =========================================================
   SELESAI
   ========================================================= */

console.log(
    "✅ KUR Digital app.js v2.0 siap."
);