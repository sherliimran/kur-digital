// =========================================
// KUR DIGITAL BACKEND
// server.js
// Versi 1.1
// =========================================


const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();


// =========================================
// KONFIGURASI
// =========================================

const app = express();

const PORT = 3000;


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================================
// DATABASE
// =========================================

const databasePath = path.join(
    __dirname,
    "../database/kur.db"
);


const db =
    new sqlite3.Database(
        databasePath,
        (error) => {

            if(error){

                console.error(
                    "❌ Gagal membuka database:",
                    error.message
                );

            }else{

                console.log(
                    "✅ Database SQLite berhasil terhubung."
                );

            }

        }
    );


// =========================================
// CEK SERVER
// =========================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success:true,

            message:
                "KUR Digital API aktif.",

            waktu:
                new Date().toISOString()

        });

    }
);


// =========================================
// DATA REKENING PEMBAYARAN
// =========================================


// -----------------------------------------
// AMBIL REKENING AKTIF
// -----------------------------------------

app.get(
    "/api/rekening-pembayaran",
    (req, res) => {

        db.get(
            `
            SELECT
                id,
                bank,
                nomor_rekening,
                atas_nama,
                aktif,
                updated_at

            FROM rekening_pembayaran

            WHERE aktif = 1

            ORDER BY id DESC

            LIMIT 1
            `,
            [],
            (error, row) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil rekening pembayaran."

                    });

                }


                if(!row){

                    return res.status(404).json({

                        success:false,

                        message:
                            "Rekening pembayaran belum tersedia."

                    });

                }


                res.json({

                    success:true,

                    data:row

                });

            }
        );

    }
);


// -----------------------------------------
// GANTI REKENING PEMBAYARAN
// -----------------------------------------

app.put(
    "/api/rekening-pembayaran",
    (req, res) => {

        const {
            bank,
            nomor_rekening,
            atas_nama
        } = req.body;


        if(
            !bank ||
            !nomor_rekening ||
            !atas_nama
        ){

            return res.status(400).json({

                success:false,

                message:
                    "Bank, nomor rekening, dan atas nama wajib diisi."

            });

        }


        // Nonaktifkan rekening lama

        db.run(
            `
            UPDATE rekening_pembayaran

            SET aktif = 0

            WHERE aktif = 1
            `,
            [],
            (error) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal menonaktifkan rekening lama."

                    });

                }


                // Tambahkan rekening baru

                db.run(
                    `
                    INSERT INTO rekening_pembayaran
                    (
                        bank,
                        nomor_rekening,
                        atas_nama,
                        aktif,
                        updated_at
                    )

                    VALUES
                    (?, ?, ?, 1, CURRENT_TIMESTAMP)
                    `,
                    [
                        bank,
                        nomor_rekening,
                        atas_nama
                    ],
                    function(error){

                        if(error){

                            console.error(error);

                            return res.status(500).json({

                                success:false,

                                message:
                                    "Gagal menyimpan rekening baru."

                            });

                        }


                        res.json({

                            success:true,

                            message:
                                "Rekening pembayaran berhasil diperbarui.",

                            data:{

                                id:this.lastID,

                                bank:bank,

                                nomor_rekening:
                                    nomor_rekening,

                                atas_nama:
                                    atas_nama,

                                aktif:1

                            }

                        });

                    }
                );

            }
        );

    }
);


// =========================================
// PEMBAYARAN
// =========================================


// -----------------------------------------
// AMBIL SEMUA PEMBAYARAN
// UNTUK ADMIN
// -----------------------------------------

app.get(
    "/api/pembayaran",
    (req, res) => {

        db.all(
            `
            SELECT

                pembayaran.id,

                pembayaran.nasabah_id,

                pembayaran.pinjaman_id,

                pembayaran.angsuran_ke,

                pembayaran.jumlah,

                pembayaran.bukti_file,

                pembayaran.status,

                pembayaran.alasan_penolakan,

                pembayaran.tanggal_pembayaran,

                pembayaran.tanggal_verifikasi,

                pembayaran.diverifikasi,

                nasabah.nama

            FROM pembayaran

            LEFT JOIN nasabah

                ON pembayaran.nasabah_id =
                   nasabah.id

            ORDER BY
                pembayaran.id DESC
            `,
            [],
            (error, rows) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil data pembayaran."

                    });

                }


                res.json({

                    success:true,

                    data:rows

                });

            }
        );

    }
);


// -----------------------------------------
// RIWAYAT PEMBAYARAN NASABAH
// -----------------------------------------

app.get(
    "/api/pembayaran/nasabah/:nasabahId",
    (req, res) => {

        const nasabahId =
            Number(
                req.params.nasabahId
            );


        if(!nasabahId){

            return res.status(400).json({

                success:false,

                message:
                    "ID nasabah tidak valid."

            });

        }


        db.all(
            `
            SELECT

                id,

                nasabah_id,

                pinjaman_id,

                angsuran_ke,

                jumlah,

                bukti_file,

                status,

                alasan_penolakan,

                tanggal_pembayaran,

                tanggal_verifikasi,

                diverifikasi

            FROM pembayaran

            WHERE nasabah_id = ?

            ORDER BY
                id DESC
            `,
            [
                nasabahId
            ],
            (error, rows) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil riwayat pembayaran."

                    });

                }


                res.json({

                    success:true,

                    data:rows

                });

            }
        );

    }
);


// -----------------------------------------
// TAMBAH PEMBAYARAN
// -----------------------------------------

app.post(
    "/api/pembayaran",
    (req, res) => {

        const {

            nasabah_id,

            pinjaman_id,

            angsuran_ke,

            jumlah,

            bukti_file

        } = req.body;


        if(!nasabah_id){

            return res.status(400).json({

                success:false,

                message:
                    "ID nasabah wajib diisi."

            });

        }


        if(!jumlah){

            return res.status(400).json({

                success:false,

                message:
                    "Jumlah pembayaran wajib diisi."

            });

        }


        db.run(
            `
            INSERT INTO pembayaran
            (
                nasabah_id,

                pinjaman_id,

                angsuran_ke,

                jumlah,

                bukti_file,

                status,

                diverifikasi
            )

            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `,
            [

                Number(nasabah_id),

                pinjaman_id
                    ? Number(pinjaman_id)
                    : null,

                Number(
                    angsuran_ke || 1
                ),

                Number(jumlah),

                bukti_file || "",

                "Menunggu Verifikasi Admin",

                0

            ],
            function(error){

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal menyimpan pembayaran."

                    });

                }


                res.status(201).json({

                    success:true,

                    message:
                        "Pembayaran berhasil dikirim.",

                    data:{

                        id:this.lastID,

                        nasabah_id:
                            Number(nasabah_id),

                        pinjaman_id:
                            pinjaman_id
                                ? Number(pinjaman_id)
                                : null,

                        angsuran_ke:
                            Number(
                                angsuran_ke || 1
                            ),

                        jumlah:
                            Number(jumlah),

                        bukti_file:
                            bukti_file || "",

                        status:
                            "Menunggu Verifikasi Admin",

                        diverifikasi:0

                    }

                });

            }
        );

    }
);


// -----------------------------------------
// VERIFIKASI PEMBAYARAN
// -----------------------------------------

app.put(
    "/api/pembayaran/:id/status",
    (req, res) => {

        const id =
            Number(
                req.params.id
            );


        const {

            status,

            alasan_penolakan

        } = req.body;


        if(!id){

            return res.status(400).json({

                success:false,

                message:
                    "ID pembayaran tidak valid."

            });

        }


        if(
            status !==
                "Pembayaran Berhasil Diverifikasi"
            &&
            status !==
                "Pembayaran Ditolak"
        ){

            return res.status(400).json({

                success:false,

                message:
                    "Status pembayaran tidak valid."

            });

        }


        db.run(
            `
            UPDATE pembayaran

            SET

                status = ?,

                alasan_penolakan = ?,

                diverifikasi = 1,

                tanggal_verifikasi =
                    CURRENT_TIMESTAMP

            WHERE id = ?
            `,
            [

                status,

                alasan_penolakan || "",

                id

            ],
            function(error){

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal memperbarui status pembayaran."

                    });

                }


                if(
                    this.changes === 0
                ){

                    return res.status(404).json({

                        success:false,

                        message:
                            "Pembayaran tidak ditemukan."

                    });

                }


                res.json({

                    success:true,

                    message:
                        "Status pembayaran berhasil diperbarui."

                });

            }
        );

    }
);


// =========================================
// DATA NASABAH
// =========================================


// -----------------------------------------
// AMBIL NASABAH
// -----------------------------------------

app.get(
    "/api/nasabah",
    (req, res) => {

        db.all(
            `
            SELECT

                id,
                nama,
                nik,
                no_hp,
                email,
                alamat,
                status,
                created_at

            FROM nasabah

            ORDER BY id DESC
            `,
            [],
            (error, rows) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil data nasabah."

                    });

                }


                res.json({

                    success:true,

                    data:rows

                });

            }
        );

    }
);


// =========================================
// DATA PENGAJUAN
// =========================================


// -----------------------------------------
// AMBIL PENGAJUAN
// -----------------------------------------

app.get(
    "/api/pengajuan",
    (req, res) => {

        db.all(
            `
            SELECT

                pengajuan.id,

                pengajuan.nasabah_id,

                pengajuan.nomor_pengajuan,

                pengajuan.jenis_kur,

                pengajuan.jumlah_pinjaman,

                pengajuan.tenor,

                pengajuan.status,

                pengajuan.progress,

                pengajuan.tanggal_pengajuan,

                nasabah.nama

            FROM pengajuan

            LEFT JOIN nasabah

                ON pengajuan.nasabah_id =
                   nasabah.id

            ORDER BY
                pengajuan.id DESC
            `,
            [],
            (error, rows) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil data pengajuan."

                    });

                }


                res.json({

                    success:true,

                    data:rows

                });

            }
        );

    }
);


// =========================================
// NOTIFIKASI
// =========================================


// -----------------------------------------
// AMBIL NOTIFIKASI NASABAH
// -----------------------------------------

app.get(
    "/api/notifikasi/:nasabahId",
    (req, res) => {

        const nasabahId =
            Number(
                req.params.nasabahId
            );


        if(!nasabahId){

            return res.status(400).json({

                success:false,

                message:
                    "ID nasabah tidak valid."

            });

        }


        db.all(
            `
            SELECT

                id,

                nasabah_id,

                judul,

                pesan,

                dibaca,

                tanggal

            FROM notifikasi

            WHERE nasabah_id = ?

            ORDER BY
                id DESC
            `,
            [
                nasabahId
            ],
            (error, rows) => {

                if(error){

                    console.error(error);

                    return res.status(500).json({

                        success:false,

                        message:
                            "Gagal mengambil notifikasi."

                    });

                }


                res.json({

                    success:true,

                    data:rows

                });

            }
        );

    }
);


// =========================================
// 404
// =========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success:false,

            message:
                "Endpoint tidak ditemukan."

        });

    }
);


// =========================================
// ERROR HANDLER
// =========================================

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error
        );


        res.status(500).json({

            success:false,

            message:
                "Terjadi kesalahan pada server."

        });

    }
);


// =========================================
// JALANKAN SERVER
// =========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "===================================="
        );

        console.log(
            "   KUR DIGITAL BACKEND"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Server berjalan di port:",
            PORT
        );

        console.log(
            "Database:",
            databasePath
        );

        console.log(
            "API:",
            `http://localhost:${PORT}/api/health`
        );

        console.log(
            "===================================="
        );

    }
);