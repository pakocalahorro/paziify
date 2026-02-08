
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log("Testing fetch from academy_modules...");
    const { data, error } = await supabase
        .from('academy_modules')
        .select('*')
        .eq('is_published', true);

    if (error) {
        console.error("❌ Error fetching:", error);
    } else {
        console.log(`✅ Success! Found ${data.length} modules.`);
        if (data.length > 0) {
            console.log("Sample:", data[0].title);
        } else {
            console.log("⚠️ Zero records returned. Check is_published or RLS.");
        }
    }
}

testFetch();
