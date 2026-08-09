// ========================================
// KUR DIGITAL - ADMIN JAVASCRIPT
// ========================================

// LOGIN ADMIN
function loginAdmin() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("error");

    // Sembunyikan pesan error terlebih dahulu
    if (error) {
        error.style.display = "none";
    }

    // Login sementara untuk tahap pengembangan
    if (username === "admin" && password === "123456") {

        // Simpan status login
        localStorage.setItem("adminLogin", "true");

        // Masuk ke dashboard admin
        window.location.href = "dashboard-admin.html";

    } else {

        // Tampilkan pesan kesalahan
        if (error) {
            error.style.display = "block";
        }
    }
}


// ========================================
// CEK LOGIN ADMIN
// ========================================

function checkAdminLogin() {

    const adminLogin =
        localStorage.getItem("adminLogin");

    if (adminLogin !== "true") {

        window.location.href = "login.html";
    }
}


// ========================================
// LOGOUT ADMIN
// ========================================

function logoutAdmin() {

    localStorage.removeItem("adminLogin");

    window.location.href = "login.html";
}
