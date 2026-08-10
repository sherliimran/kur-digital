// ========================================
// KUR DIGITAL - ADMIN LOGIN
// Supabase Authentication
// ========================================


// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://binojniwitsdhnhqmneq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_yX4gQ30MAXnmrVAUIL1bZQ_f6E1hnNV";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// LOGIN ADMIN
// ========================================

async function loginAdmin() {

    const username =
        document
        .getElementById("username")
        .value
        .trim();


    const password =
        document
        .getElementById("password")
        .value;


    const error =
        document.getElementById("error");


    // Sembunyikan error
    if (error) {

        error.style.display = "none";

    }


    // Validasi input
    if (!username || !password) {

        if (error) {

            error.textContent =
                "Username dan password wajib diisi.";

            error.style.display =
                "block";

        }

        return;

    }


    try {

        // ========================================
        // LOGIN SUPABASE
        // ========================================

        const {
            data,
            error: loginError
        } =
            await supabaseClient.auth
            .signInWithPassword({

                email: username,

                password: password

            });


        // Login gagal
        if (loginError) {

            throw loginError;

        }


        // ========================================
        // LOGIN BERHASIL
        // ========================================

        console.log(
            "Login admin berhasil:",
            data.user
        );


        // Simpan status lokal
        localStorage.setItem(
            "adminLogin",
            "true"
        );


        // Simpan email admin
        localStorage.setItem(
            "adminEmail",
            data.user.email || username
        );


        // ========================================
        // MASUK KE DASHBOARD ADMIN
        // ========================================

        window.location.href =
            "dashboard-admin.html";


    } catch (err) {

        console.error(
            "Login admin error:",
            err
        );


        if (error) {

            error.textContent =
                "Username/email atau password salah.";

            error.style.display =
                "block";

        }

    }

}



// ========================================
// CEK LOGIN ADMIN
// ========================================

async function cekLoginAdmin() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
            .getSession();


        // Jika terjadi error
        if (error) {

            console.error(
                "Gagal mengecek session:",
                error
            );

            window.location.href =
                "login.html";

            return;

        }


        // Tidak ada session Supabase
        if (!data.session) {

            localStorage.removeItem(
                "adminLogin"
            );


            window.location.href =
                "login.html";

            return;

        }


        // Simpan status login
        localStorage.setItem(
            "adminLogin",
            "true"
        );


        localStorage.setItem(
            "adminEmail",
            data.session.user.email || ""
        );


        console.log(
            "Admin sedang login:",
            data.session.user.email
        );


    } catch (err) {

        console.error(
            "Cek login admin error:",
            err
        );


        window.location.href =
            "login.html";

    }

}



// ========================================
// LOGOUT ADMIN
// ========================================

async function logoutAdmin() {

    const yakin =
        confirm(
            "Apakah Anda yakin ingin keluar dari Panel Admin?"
        );


    if (!yakin) {

        return;

    }


    try {

        // Logout dari Supabase
        await supabaseClient.auth.signOut();

    } catch (err) {

        console.error(
            "Logout Supabase error:",
            err
        );

    }


    // Hapus login lokal
    localStorage.removeItem(
        "adminLogin"
    );


    localStorage.removeItem(
        "adminEmail"
    );


    // Kembali ke halaman login
    window.location.href =
        "login.html";

}



// ========================================
// FUNGSI BUKA HALAMAN ADMIN
// ========================================

function bukaHalaman(namaFile) {

    window.location.href =
        namaFile;

}



// ========================================
// DETEKSI HALAMAN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const halaman =
            window.location.pathname
            .split("/")
            .pop();


        // ========================================
        // DASHBOARD ADMIN
        // ========================================

        if (
            halaman ===
            "dashboard-admin.html"
        ) {

            cekLoginAdmin();

        }


        // ========================================
        // VERIFIKASI PEMBAYARAN
        // ========================================

        if (
            halaman ===
            "verifikasi-pembayaran.html"
        ) {

            cekLoginAdmin();

        }

    }
);
