
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach((line) => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
            }
        });
        console.log("✅ Credentials loaded from .env");
    }
} catch (e) {
    console.warn("⚠️ Failed to load .env");
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SAMPLES_DIR = './assets/voice-samples';
const BUCKET = 'meditation-voices';

async function uploadSamples() {
    const files = fs.readdirSync(SAMPLES_DIR);

    for (const file of files) {
        if (file.endsWith('.mp3')) {
            const filePath = path.join(SAMPLES_DIR, file);
            const fileBuffer = fs.readFileSync(filePath);

            console.log(`Uploading ${file}...`);
            const { data, error } = await supabase.storage
                .from(BUCKET)
                .upload(`samples/${file}`, fileBuffer, {
                    contentType: 'audio/mpeg',
                    upsert: true
                });

            if (error) {
                console.error(`Error uploading ${file}:`, error.message);
            } else {
                console.log(`✅ Uploaded ${file} successfully.`);
            }
        }
    }
}

uploadSamples();
