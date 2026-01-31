/**
 * Voice Schedule Generator for Paziify Meditation Sessions
 * 
 * This script calculates when each voice cue should play during meditation sessions.
 * It reads the sessions data and generates JSON schedules that can be used to
 * create pre-recorded voice tracks.
 * 
 * Usage:
 *   node scripts/generateVoiceSchedules.js
 * 
 * Output:
 *   assets/voice-tracks/[session_id]_schedule.json
 */

const fs = require('fs');
const path = require('path');

// Meditation sessions data (hardcoded to avoid TypeScript import issues)
// You can update this manually or parse the sessionsData.ts file
const SESSIONS_SAMPLE = [
    {
        id: 'anx_478',
        title: 'Respiración 4-7-8',
        durationMinutes: 5,
        breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 }
    },
    {
        id: 'anx_box',
        title: 'Box Breathing',
        durationMinutes: 4,
        breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 }
    },
    {
        id: 'anx_sigh',
        title: 'Suspiro Cíclico',
        durationMinutes: 3,
        breathingPattern: { inhale: 2, hold: 1, exhale: 6, holdPost: 0 }
    }
    // Add more sessions here or implement automatic parsing
];

// Voice messages
const VOICE_MESSAGES = {
    inhale: 'Inhala',
    hold: 'Mantén',
    exhale: 'Exhala'
};

/**
 * Calculate when each voice cue should play during the session
 */
function calculateVoiceSchedule(session) {
    const pattern = session.breathingPattern;
    const totalCycleTime = pattern.inhale + pattern.hold + pattern.exhale + pattern.holdPost;
    const totalDuration = session.durationMinutes * 60; // in seconds
    const totalCycles = Math.floor(totalDuration / totalCycleTime);

    const schedule = [];
    let currentTime = 0;

    for (let cycle = 0; cycle < totalCycles; cycle++) {
        // Inhale
        schedule.push({
            time: currentTime,
            phase: 'inhale',
            text: VOICE_MESSAGES.inhale
        });
        currentTime += pattern.inhale;

        // Hold (only if > 0)
        if (pattern.hold > 0) {
            schedule.push({
                time: currentTime,
                phase: 'hold',
                text: VOICE_MESSAGES.hold
            });
            currentTime += pattern.hold;
        }

        // Exhale
        schedule.push({
            time: currentTime,
            phase: 'exhale',
            text: VOICE_MESSAGES.exhale
        });
        currentTime += pattern.exhale;

        // HoldPost (no voice, just silence)
        currentTime += pattern.holdPost;
    }

    return schedule;
}

/**
 * Generate schedule file for a single session
 */
function generateScheduleFile(session) {
    console.log(`\n🎙️  Generating schedule for: ${session.title}`);
    console.log(`   Duration: ${session.durationMinutes} minutes`);
    console.log(`   Pattern: ${session.breathingPattern.inhale}-${session.breathingPattern.hold}-${session.breathingPattern.exhale}-${session.breathingPattern.holdPost}`);

    const schedule = calculateVoiceSchedule(session);
    console.log(`   Voice cues: ${schedule.length}`);

    // Create output directory
    const outputDir = path.join(__dirname, '../assets/voice-tracks');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save schedule as JSON
    const scheduleFile = path.join(outputDir, `${session.id}_schedule.json`);
    fs.writeFileSync(scheduleFile, JSON.stringify({
        sessionId: session.id,
        title: session.title,
        duration: session.durationMinutes * 60,
        pattern: session.breathingPattern,
        totalVoiceCues: schedule.length,
        schedule: schedule
    }, null, 2));

    console.log(`   ✅ Schedule saved: ${session.id}_schedule.json`);

    return {
        sessionId: session.id,
        scheduleFile,
        voiceCount: schedule.length
    };
}

/**
 * Main function
 */
function main() {
    console.log('🚀 Paziify Voice Schedule Generator');
    console.log('===================================\n');
    console.log(`Sessions to process: ${SESSIONS_SAMPLE.length}`);
    console.log('\n⚠️  NOTE: This is processing a SAMPLE of sessions.');
    console.log('   To process all sessions, update SESSIONS_SAMPLE in this script.\n');

    const results = [];

    for (const session of SESSIONS_SAMPLE) {
        try {
            const result = generateScheduleFile(session);
            results.push(result);
        } catch (error) {
            console.error(`❌ Error generating schedule for ${session.id}:`, error.message);
        }
    }

    console.log('\n✅ Generation complete!');
    console.log(`   Total schedules: ${results.length}`);
    console.log(`   Total voice cues: ${results.reduce((sum, r) => sum + r.voiceCount, 0)}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the generated schedules in assets/voice-tracks/');
    console.log('   2. Use these schedules to generate actual MP3 files with TTS');
    console.log('   3. Upload MP3 files to Supabase Storage (meditation-voices bucket)');
    console.log('   4. Update AudioEngineService to load voice tracks as audio layer');
    console.log('\n📖 See scripts/README_VOICE_TRACKS.md for detailed instructions');
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { calculateVoiceSchedule, generateScheduleFile };
