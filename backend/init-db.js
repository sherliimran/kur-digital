const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(
    __dirname,
    "../database/kur.db"
);

console.log("====================================");
console.log("     KUR DIGITAL DATABASE SETUP");
console.log("====================================");
console.log("Database:", databasePath);

const db = new sqlite3.Database(databasePath, (error) => {

    if (error) {
        console.error("❌ Gagal membuka database:");
        console.error(error.message);
        process.exit(1);
    }

    console.log("✅ Database berhasil dibuka.");
});


db.serialize(() => {

    // =====================================
    // NASABAH
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS nasabah (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nama TEXT NOT NULL,

            nik TEXT UNIQUE,

            no_hp TEXT,

            email TEXT,

            alamat TEXT,

            password TEXT NOT NULL,

            status TEXT DEFAULT 'Aktif',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // =====================================
    // PENGAJUAN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS pengajuan (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nasabah_id INTEGER NOT NULL,

            nomor_pengajuan TEXT UNIQUE NOT NULL,

            jenis_kur TEXT,

            jumlah_pinjaman INTEGER DEFAULT 0,

            tenor INTEGER DEFAULT 0,

            status TEXT DEFAULT 'Diajukan',

            progress INTEGER DEFAULT 0,

            tanggal_pengajuan DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (nasabah_id)
                REFERENCES nasabah(id)

        )
    `);


    // =====================================
    // PINJAMAN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS pinjaman (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nasabah_id INTEGER NOT NULL,

            pengajuan_id INTEGER,

            jumlah_pinjaman INTEGER DEFAULT 0,

            sisa_pinjaman INTEGER DEFAULT 0,

            jumlah_angsuran INTEGER DEFAULT 0,

            tenor INTEGER DEFAULT 0,

            angsuran_ke INTEGER DEFAULT 0,

            status TEXT DEFAULT 'Aktif',

            tanggal_mulai DATE,

            jatuh_tempo DATE,

            FOREIGN KEY (nasabah_id)
                REFERENCES nasabah(id),

            FOREIGN KEY (pengajuan_id)
                REFERENCES pengajuan(id)

        )
    `);


    // =====================================
    // PEMBAYARAN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS pembayaran (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nasabah_id INTEGER NOT NULL,

            pinjaman_id INTEGER,

            angsuran_ke INTEGER DEFAULT 1,

            jumlah INTEGER DEFAULT 0,

            bukti_file TEXT,

            status TEXT DEFAULT
                'Menunggu Verifikasi Admin',

            alasan_penolakan TEXT,

            tanggal_pembayaran DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            tanggal_verifikasi DATETIME,

            diverifikasi INTEGER DEFAULT 0,

            FOREIGN KEY (nasabah_id)
                REFERENCES nasabah(id),

            FOREIGN KEY (pinjaman_id)
                REFERENCES pinjaman(id)

        )
    `);


    // =====================================
    // REKENING PEMBAYARAN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS rekening_pembayaran (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            bank TEXT NOT NULL,

            nomor_rekening TEXT NOT NULL,

            atas_nama TEXT NOT NULL,

            aktif INTEGER DEFAULT 1,

            updated_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // =====================================
    // ADMIN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS admin (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            nama TEXT,

            aktif INTEGER DEFAULT 1,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // =====================================
    // AKTIVITAS ADMIN
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS aktivitas_admin (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            admin_id INTEGER,

            judul TEXT,

            detail TEXT,

            tanggal DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (admin_id)
                REFERENCES admin(id)

        )
    `);


    // =====================================
    // NOTIFIKASI
    // =====================================

    db.run(`
        CREATE TABLE IF NOT EXISTS notifikasi (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nasabah_id INTEGER,

            judul TEXT NOT NULL,

            pesan TEXT NOT NULL,

            dibaca INTEGER DEFAULT 0,

            tanggal DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (nasabah_id)
                REFERENCES nasabah(id)

        )
    `);


    // =====================================
    // DATA REKENING PEMBAYARAN
    // =====================================

    db.run(`
        INSERT INTO rekening_pembayaran
        (
            bank,
            nomor_rekening,
            atas_nama,
            aktif
        )

        SELECT
            'BRI',
            '000000000000',
            'KUR Digital DEMO',
            1

        WHERE NOT EXISTS (

            SELECT 1
            FROM rekening_pembayaran

        )
    `);


    // =====================================
    // ADMIN DEMO
    // =====================================

    db.run(`
        INSERT INTO admin
        (
            username,
            password,
            nama,
            aktif
        )

        SELECT
            'admin',
            'admin123',
            'Administrator KUR Digital',
            1

        WHERE NOT EXISTS (

            SELECT 1
            FROM admin
            WHERE username = 'admin'

        )
    `);


    // =====================================
    // NASABAH DEMO
    // =====================================

    db.run(`
        INSERT INTO nasabah
        (
            nama,
            nik,
            no_hp,
            email,
            alamat,
            password,
            status
        )

        SELECT
            'Nasabah Demo',
            '0000000000000000',
            '080000000000',
            'demo@kurdigital.local',
            'Alamat Demo',
            'demo123',
            'Aktif'

        WHERE NOT EXISTS (

            SELECT 1
            FROM nasabah
            WHERE email = 'demo@kurdigital.local'

        )
    `);

});


setTimeout(() => {

    console.log("");
    console.log("====================================");
    console.log("✅ DATABASE KUR DIGITAL SIAP");
    console.log("====================================");
    console.log("");
    console.log("Tabel yang dibuat:");
    console.log("- nasabah");
    console.log("- pengajuan");
    console.log("- pinjaman");
    console.log("- pembayaran");
    console.log("- rekening_pembayaran");
    console.log("- admin");
    console.log("- aktivitas_admin");
    console.log("- notifikasi");
    console.log("");
    console.log("Data demo:");
    console.log("Admin    : admin / admin123");
    console.log("Nasabah  : demo@kurdigital.local / demo123");
    console.log("");
    console.log("====================================");

    db.close();

}, 1500);