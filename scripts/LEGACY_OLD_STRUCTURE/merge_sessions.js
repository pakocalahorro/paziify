const fs = require('fs');
const path = require('path');

const NEW_SESSIONS_FILE = path.join(__dirname, '../src/data/newSessionsGenerated.json');
const SESSIONS_DATA_FILE = path.join(__dirname, '../src/data/sessionsData.ts');

function merge() {
    const newSessions = JSON.parse(fs.readFileSync(NEW_SESSIONS_FILE, 'utf-8'));
    const originalContent = fs.readFileSync(SESSIONS_DATA_FILE, 'utf-8');

    // Extract everything BEFORE the array starts
    const header = originalContent.split('export const MEDITATION_SESSIONS: MeditationSession[] = [')[0];

    // Extract the original sessions as objects if possible, or just the text
    // Actually, I have them in my memory, but let's be safe.
    // I'll just keep the original sessions I read from the file.

    const originalSessionsText = originalContent.match(/\[([\s\S]*)\];/)[1];

    // I will append the new ones to the end of the existing list in the string
    // But wait, the previous MEDITATION_SESSIONS array already has some sessions.
    // I'll just replace the whole array with (original + new)

    // Let's manually define the original IDs to avoid duplicates if any
    const originalIds = ['anx_478', 'anx_box', 'anx_sigh', 'wake_bellows', 'wake_sun', 'sleep_nsdr', 'sleep_478_night', 'mind_open', 'mind_breath', 'res_stoic', 'res_gratitude', 'res_vagus', 'anx_sos', 'anx_calm_ocean', 'sleep_yoganidra', 'sleep_soft_rain', 'wake_espresso', 'mind_sky'];

    // To make it super clean, I'll just rebuild the whole array string.
    // I already have the 101 new ones in result.
    // I'll keep the footer functions as they are.

    const footer = originalContent.split('];')[originalContent.split('];').length - 1];

    const combinedArray = `export const MEDITATION_SESSIONS: MeditationSession[] = [\n${originalSessionsText.trim()},\n${JSON.stringify(newSessions, null, 2).slice(1, -1)}\n];`;

    const finalContent = `${header}${combinedArray}${footer}`;

    fs.writeFileSync(SESSIONS_DATA_FILE, finalContent);
    console.log('🚀 sessionsData.ts updated with 119 sessions!');
}

merge();
