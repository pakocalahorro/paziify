
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env logic manually again for safety
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
            }
        });
    }
} catch (e) { }

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("❌ Missing credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log("Checking tables...");

    const t1 = await supabase.from('meditation_sessions_content').select('*', { count: 'exact', head: true });
    console.log("Sessions:", t1.error ? t1.error.message : "OK, Count: " + t1.count);

    const t2 = await supabase.from('audiobooks').select('*', { count: 'exact', head: true });
    console.log("Audiobooks:", t2.error ? t2.error.message : "OK, Count: " + t2.count);

    const t3 = await supabase.from('real_stories').select('*', { count: 'exact', head: true });
    console.log("Stories:", t3.error ? t3.error.message : "OK, Count: " + t3.count);

    console.log("Testing INSERT...");
    const { data, error } = await supabase.from('audiobooks').insert([{
        title: "Test Book",
        author: "Tester",
        category: "test"
    }]).select();

    if (error) console.log("INSERT Failed:", error);
    else console.log("INSERT Success:", data);
}

check();
