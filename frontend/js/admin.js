// ========================================
// KUR DIGITAL - ADMIN LOGIN
// Supabase Authentication
// ========================================

const SUPABASE_URL = "https://binojniwitsdhnhqmneq.supabase.co";
const SUPABASE_KEY = "sb_publishable_yX4gQ30MAXnmrVAUIL1bZQ_f6E1hnNV";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// LOGIN ADMIN
// ========================================

async function loginAdmin() {

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const error = document.getElementById("error");

    // Sembunyikan pesan error
    if (error) {
        error.style.display = "none";
    }

    // Periksa input
    if (!username || !password) {

        if (error) {
            error.textContent = "Username dan password wajib diisi.";
            error.style.display = "block";
        }

        return;
    }

    try {

        // Login ke Supabase
        const { data, error: loginError } =
            await supabaseClient.auth.signInWithPassword({
                email: username,
                password: password
            });

        // Jika login gagal
        if (loginError) {
            throw loginError;
        }

        // Login berhasil
        console.log("Login berhasil:", data.user);

        // Simpan status login lokal
        localStorage.setItem("adminLogin", "true");

        // Buka dashboard admin
        window.location.href = "dashboard-admin.html";

    } catch (err) {

        console.error("Login error:", err);

        if (error) {
            error.textContent =
                "Username/email atau password salah.";
            error.style.display = "block";
        }
    }
}


// ========================================
// CEK LOGIN SAAT DASHBOARD DIBUKA
// ========================================

async function cekLoginAdmin() {

    const { data } =
        await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "admin-login.html";

        return;
    }

    console.log(
        "Admin sedang login:",
        data.session.user.email
    );
}


// ========================================
// LOGOUT ADMIN
// ========================================

async function logoutAdmin() {

    await supabaseClient.auth.signOut();

    localStorage.removeItem("adminLogin");

    window.location.href = "admin-login.html";
}
