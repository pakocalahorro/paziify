
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { ACADEMY_MODULES, ACADEMY_LESSONS } from '../src/data/academyData'; // We might need to adjust this import or read file raw if TS execution is hard

// Hardcode for script execution or load from .env
const SUPABASE_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: You need the SERVICE_ROLE_KEY to bypass RLS policies if writing to public tables from script
// If you don't have it in env, ask user. But for now I will assume we might use Anon key if policies allow, 
// or I will ask the user for the key. 
// Actually, I should probably output a script that the user can run with their key.

async function migrate() {
    console.log("🚀 Starting Academy Migration...");

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing in .env");
        return;
    }

    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Migrate Modules (Courses)
    console.log(`\n📦 Migrating ${ACADEMY_MODULES.length} Modules...`);
    for (const mod of ACADEMY_MODULES) {
        const { error } = await supabase
            .from('academy_modules')
            .upsert({
                id: mod.id,
                title: mod.title,
                description: mod.description,
                icon: mod.icon,
                category: mod.category,
                author: mod.author,
                duration: mod.duration,
                image_url: mod.image, // User will update this manually later if needed, but we pass what we have
                is_published: true,
                learning_outcomes: [], // Default empty for now
            });

        if (error) console.error(`   ❌ Error migrating module ${mod.id}:`, error.message);
        else console.log(`   ✅ Module ${mod.id} migrated.`);
    }

    // 2. Migrate Lessons
    console.log(`\n📚 Migrating ${ACADEMY_LESSONS.length} Lessons...`);
    for (const lesson of ACADEMY_LESSONS) {
        // Construct Audio URL
        // Expected format: bucket_url / filename
        // Filename in generate_audio script was based on title or file stem. 
        // Wait, the user is uploading manually. 
        // I need to know what filename they will use. 
        // Detailed Plan said: "El script asumirá que el nombre del archivo en Supabase coincide con el ID de la lección (ej: lesson_id.mp3)"

        const audioUrl = `${SUPABASE_URL}/storage/v1/object/public/academy-voices/${lesson.id}.mp3`;

        const { error } = await supabase
            .from('academy_lessons')
            .upsert({
                id: lesson.id,
                module_id: lesson.moduleId,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                duration: lesson.duration,
                is_premium: lesson.isPlus,
                audio_url: audioUrl,
                order_index: 0 // We might need to calculate this
            });

        if (error) console.error(`   ❌ Error migrating lesson ${lesson.id}:`, error.message);
        else console.log(`   ✅ Lesson ${lesson.id} migrated.`);
    }

    console.log("\n✨ Migration Complete!");
}

migrate();
