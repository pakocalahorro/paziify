
const fs = require('fs');
const path = require('path');

// PATHS
const SESSIONS_PATH = 'src/data/sessionsData.ts';
const CONTENT_SERVICE_PATH = 'src/services/contentService.ts';
const OUTPUT_PATH = 'scripts/seed_data.json';
const DEBUG_PATH = 'scripts/extraction_debug.txt';

// --- HELPERS ---
function logDebug(msg) {
    try {
        fs.appendFileSync(DEBUG_PATH, msg + '\n');
        console.log(msg);
    } catch (e) { }
}

function extractSessions() {
    logDebug('📦 Reading Sessions from: ' + SESSIONS_PATH);
    if (!fs.existsSync(SESSIONS_PATH)) {
        logDebug("❌ File not found: " + SESSIONS_PATH);
        return [];
    }
    const content = fs.readFileSync(SESSIONS_PATH, 'utf8');

    // It's an array: export const MEDITATION_SESSIONS: MeditationSession[] = [ ... ];
    const startToken = "export const MEDITATION_SESSIONS";
    const startIdx = content.indexOf(startToken);

    if (startIdx === -1) {
        logDebug("❌ Failed to find MEDITATION_SESSIONS start token");
        return [];
    }

    // Find the assignment operator to skip type definition
    const equalsIdx = content.indexOf('=', startIdx);
    if (equalsIdx === -1) {
        logDebug("❌ Failed to find assignment operator '='");
        return [];
    }

    // Find valid Array Start [
    const arrayStart = content.indexOf('[', equalsIdx);

    // Find limit
    const nextExport = "export const getFreeSessionsCount";
    const nextExportIdx = content.indexOf(nextExport);
    let searchLimit = nextExportIdx !== -1 ? nextExportIdx : content.length;

    // Find Array End ]
    let arrayEnd = content.lastIndexOf(']', searchLimit);

    logDebug(`DEBUG: startIdx=${startIdx}, equalsIdx=${equalsIdx}, arrayStart=${arrayStart}, arrayEnd=${arrayEnd}, limit=${searchLimit}`);

    if (arrayStart === -1 || arrayEnd === -1 || arrayEnd < arrayStart) {
        logDebug("❌ Failed to find array brackets");
        return [];
    }

    let arrayStr = content.substring(arrayStart, arrayEnd + 1);
    logDebug(`DEBUG: Extracted string length=${arrayStr.length}`);

    try {
        // Clean up TS - DISABLED comment stripping because it breaks URLs (https://)
        // arrayStr = arrayStr.replace(/\/\/.*$/gm, ''); 
        // arrayStr = arrayStr.replace(/\/\*[\s\S]*?\*\//g, ''); 

        // Fix keys - DISABLED
        // arrayStr = arrayStr.replace(/([a-zA-Z0-9_]+):/g, '"$1":');

        // DANGER: Eval
        const data = (new Function(`return ${arrayStr}`))();
        return data;
    } catch (e) {
        logDebug("⚠️ Failed to parse Sessions Array: " + e.message);
        return [];
    }
}

function extractAudiobooks() {
    logDebug('📚 Reading Audiobooks form: ' + CONTENT_SERVICE_PATH);
    const content = fs.readFileSync(CONTENT_SERVICE_PATH, 'utf8');

    const regex = /async getAll\(\): Promise<Audiobook\[\]> {[\s\S]*?return\s*(\[[\s\S]*?\]);/m;
    const match = content.match(regex);

    if (match) {
        let arrayStr = match[1];
        try {
            arrayStr = arrayStr.replace(/as any/g, '');
            // arrayStr = arrayStr.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
            // arrayStr = arrayStr.replace(/\/\/.*/g, ''); // Disable for safety too

            const data = (new Function(`return ${arrayStr}`))();
            return data;
        } catch (e) {
            logDebug("❌ Failed to parse Audiobooks: " + e);
            return [];
        }
    }
    return [];
}

function extractStories() {
    logDebug('🌟 Reading Stories form: ' + CONTENT_SERVICE_PATH);
    const content = fs.readFileSync(CONTENT_SERVICE_PATH, 'utf8');

    const serviceStart = content.indexOf('export const storiesService');
    const subContent = content.substring(serviceStart);

    const regex = /async getAll\(\): Promise<RealStory\[\]> {[\s\S]*?return\s*(\[[\s\S]*?\]);/m;
    const match = subContent.match(regex);

    if (match) {
        let arrayStr = match[1];
        try {
            arrayStr = arrayStr.replace(/as any/g, '');
            // arrayStr = arrayStr.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
            // arrayStr = arrayStr.replace(/\/\/.*/g, '');

            const data = (new Function(`return ${arrayStr}`))();
            return data;
        } catch (e) {
            logDebug("❌ Failed to parse Stories: " + e);
            return [];
        }
    }
    return [];
}


// --- MAIN ---
try {
    fs.writeFileSync(DEBUG_PATH, "--- Extraction Log ---\n");

    const sessions = extractSessions();
    const audiobooks = extractAudiobooks();
    const stories = extractStories();

    logDebug(`\n📊 Extraction Summary:`);
    logDebug(`   - Sessions: ${sessions.length}`);
    if (sessions.length > 0) {
        logDebug(`   - First Session Type: ${typeof sessions[0]}`);
        logDebug(`   - First Session Keys: ${Object.keys(sessions[0]).join(', ')}`);
        // logDebug(`   - First Session: ${JSON.stringify(sessions[0])}`);
    }
    logDebug(`   - Audiobooks: ${audiobooks.length}`);
    logDebug(`   - Stories: ${stories.length}`);

    const seedData = {
        meta: {
            extractedAt: new Date().toISOString(),
            version: "v2"
        },
        sessions,
        audiobooks,
        stories
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(seedData, null, 2));
    logDebug(`\n✅ Seed data saved to ${OUTPUT_PATH}`);

} catch (error) {
    logDebug("🔥 Fatal Error during extraction: " + error);
}
