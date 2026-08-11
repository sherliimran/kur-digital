// ============================================
// KONEKSI SUPABASE - KUR DIGITAL
// ============================================

const SUPABASE_URL =
    "https://PROJECT-REF-KAMU.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KEY_KAMU";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
