
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env with robust parsing
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
        const keys = [];
        envConfig.split(/\r?\n/).forEach((line) => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
                keys.push(key);
            }
        });
        console.log("✅ Loaded .env");
    }
} catch (e) {
    console.warn("⚠️ Failed to load .env manually");
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SEED_FILE = path.join(__dirname, 'seed_data.json');

async function ingestData() {
    console.log('🚀 Starting Data Ingestion V3 (Schema Aligned)...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Read Data
    const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    console.log(`📦 Loaded Seed Data: ${seedData.sessions.length} sessions, ${seedData.audiobooks.length} books, ${seedData.stories.length} stories`);

    // 1. Ingest Sessions
    if (seedData.sessions.length > 0) {
        console.log('\n--- Ingesting Sessions ---');
        // Schema: id, legacy_id, slug, title, description, duration_minutes, category, mood_tags, time_of_day, difficulty_level, is_premium, is_technical, voice_url, thumbnail_url, audio_config, breathing_config, metadata, creator_name

        const sessionRows = seedData.sessions.map(s => {
            return {
                legacy_id: s.id,
                title: s.title,
                description: s.description,
                // scientific_benefits -> metadata
                duration_minutes: s.durationMinutes,
                category: s.category,
                mood_tags: s.moodTags,
                time_of_day: s.timeOfDay,
                difficulty_level: s.difficultyLevel,
                // session_type -> metadata
                // is_customizable -> metadata

                audio_config: s.audioLayers,
                breathing_config: s.breathingPattern,

                metadata: {
                    voice_style: s.voiceStyle,
                    color: s.color,
                    visual_sync_enabled: s.visualSync,
                    creator_credentials: s.creatorCredentials,
                    scientific_benefits: s.scientificBenefits, // Moved
                    session_type: s.sessionType,               // Moved
                    is_customizable: s.isCustomizable          // Moved
                },

                creator_name: s.creatorName,
                is_technical: s.isTechnical,
                is_premium: s.isPremium,
                thumbnail_url: s.thumbnailUrl,
                voice_url: s.audioLayers ? s.audioLayers.voiceTrack : null
            };
        });

        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .insert(sessionRows)
            .select();

        if (error) console.error('❌ Failed to ingest sessions:', error);
        else console.log(`✅ Ingested ${data.length} sessions.`);
    }

    // 2. Ingest Audiobooks
    if (seedData.audiobooks.length > 0) {
        console.log('\n--- Ingesting Audiobooks ---');
        // Schema: title, author, narrator, description, category, tags, language, audio_url, cover_url, duration_minutes, is_premium, is_featured
        const bookRows = seedData.audiobooks.map(b => ({
            title: b.title,
            author: b.author,
            narrator: b.narrator,
            // description? using undefined
            category: b.category,
            tags: b.tags,
            language: b.language,
            audio_url: b.audio_url,
            cover_url: b.cover_url || null,
            duration_minutes: b.duration_minutes,
            is_premium: b.is_premium,
            is_featured: b.is_featured
            // source removed (not in schema)
        }));

        const { data, error } = await supabase
            .from('audiobooks')
            .insert(bookRows)
            .select();

        if (error) console.error('❌ Failed to ingest audiobooks:', error);
        else console.log(`✅ Ingested ${data.length} audiobooks.`);
    }

    // 3. Ingest Stories
    if (seedData.stories.length > 0) {
        console.log('\n--- Ingesting Stories ---');
        // Schema: title, subtitle, story_text, category, tags, reading_time_minutes, character_profile, cover_url, related_meditation_id, is_premium, is_featured
        const storyRows = seedData.stories.map(s => ({
            title: s.title,
            subtitle: s.subtitle,
            story_text: s.story_text,
            category: s.category,
            tags: s.tags,
            reading_time_minutes: s.reading_time_minutes,
            // transformation_theme removed (not in schema)
            is_featured: s.is_featured,
            is_premium: s.is_premium
        }));

        const { data, error } = await supabase
            .from('real_stories')
            .insert(storyRows)
            .select();

        if (error) console.error('❌ Failed to ingest stories:', error);
        else console.log(`✅ Ingested ${data.length} stories.`);
    }

    console.log('\n✨ Ingestion Complete.');
}

ingestData().catch(e => console.error(e));
