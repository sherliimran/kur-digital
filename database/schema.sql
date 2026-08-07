-- =========================================
-- KUR DIGITAL DATABASE
-- Versi 1.1
-- =========================================


-- =========================================
-- TABEL NASABAH
-- =========================================

CREATE TABLE nasabah (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nama TEXT NOT NULL,

    nik TEXT UNIQUE,

    no_hp TEXT,

    email TEXT,

    alamat TEXT,

    password TEXT NOT NULL,

    status TEXT DEFAULT 'Aktif',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TABEL PENGAJUAN
-- =========================================

CREATE TABLE pengajuan (

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

);


-- =========================================
-- TABEL PINJAMAN
-- =========================================

CREATE TABLE pinjaman (

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

);


-- =========================================
-- TABEL PEMBAYARAN
-- =========================================

CREATE TABLE pembayaran (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nasabah_id INTEGER NOT NULL,

    pinjaman_id INTEGER,

    angsuran_ke INTEGER DEFAULT 1,

    jumlah INTEGER DEFAULT 0,

    bukti_file TEXT,

    status TEXT DEFAULT 'Menunggu Verifikasi Admin',

    alasan_penolakan TEXT,

    tanggal_pembayaran DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    tanggal_verifikasi DATETIME,

    diverifikasi INTEGER DEFAULT 0,

    FOREIGN KEY (nasabah_id)
        REFERENCES nasabah(id),

    FOREIGN KEY (pinjaman_id)
        REFERENCES pinjaman(id)

);


-- =========================================
-- TABEL REKENING PEMBAYARAN
-- =========================================

CREATE TABLE rekening_pembayaran (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    bank TEXT NOT NULL,

    nomor_rekening TEXT NOT NULL,

    atas_nama TEXT NOT NULL,

    aktif INTEGER DEFAULT 1,

    updated_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TABEL ADMIN
-- =========================================

CREATE TABLE admin (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    nama TEXT,

    aktif INTEGER DEFAULT 1,

    created_at DATETIME
        DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- TABEL AKTIVITAS ADMIN
-- =========================================

CREATE TABLE aktivitas_admin (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER,

    judul TEXT,

    detail TEXT,

    tanggal DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id)
        REFERENCES admin(id)

);


-- =========================================
-- TABEL NOTIFIKASI
-- =========================================

CREATE TABLE notifikasi (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nasabah_id INTEGER,

    judul TEXT NOT NULL,

    pesan TEXT NOT NULL,

    dibaca INTEGER DEFAULT 0,

    tanggal DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (nasabah_id)
        REFERENCES nasabah(id)

);


-- =========================================
-- DATA REKENING PEMBAYARAN AWAL
-- =========================================

INSERT INTO rekening_pembayaran (

    bank,

    nomor_rekening,

    atas_nama,

    aktif

)

VALUES (

    'BRI',

    '000000000000',

    'KUR Digital DEMO',

    1

);