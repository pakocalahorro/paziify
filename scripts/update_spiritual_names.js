const fs = require('fs');
const path = require('path');

const SESSIONS_DATA_FILE = 'src/data/sessionsData.ts';

const SPIRIT_NAMES = {
    'calm': 'Aria',
    'standard': 'Ziro',
    'deep': 'Éter',
    'kids': 'Gaia'
};

function update() {
    let content = fs.readFileSync(SESSIONS_DATA_FILE, 'utf-8');

    // Improved regex to handle "voiceStyle" or voiceStyle and single/double quotes
    // We update creatorName and creatorCredentials to be consistent

    const styles = ['calm', 'standard', 'deep', 'kids'];

    styles.forEach(style => {
        const name = SPIRIT_NAMES[style];

        // Match blocks with the specific voiceStyle
        // This is a bit brute-force but safer for a large file
        const blocks = content.split('},');
        const updatedBlocks = blocks.map(block => {
            if (block.includes(`"voiceStyle": "${style}"`) || block.includes(`voiceStyle: '${style}'`) || block.includes(`voiceStyle: "${style}"`)) {
                // Update creatorName
                let updated = block.replace(/"creatorName":\s*".*?"/g, `"creatorName": "${name}"`);
                updated = updated.replace(/creatorName:\s*'.*?'/g, `creatorName: '${name}'`);
                updated = updated.replace(/creatorName:\s*".*?"/g, `creatorName: "${name}"`);

                // Optional: Update credentials to reflect the spiritual role
                const creds = `Guía Espiritual - ${name}`;
                updated = updated.replace(/"creatorCredentials":\s*".*?"/g, `"creatorCredentials": "${creds}"`);
                updated = updated.replace(/creatorCredentials:\s*'.*?'/g, `creatorCredentials: '${creds}'`);
                updated = updated.replace(/creatorCredentials:\s*".*?"/g, `creatorCredentials: "${creds}"`);

                return updated;
            }
            return block;
        });

        content = updatedBlocks.join('},');
    });

    fs.writeFileSync(SESSIONS_DATA_FILE, content);
    console.log('🚀 creatorName & creatorCredentials updated to Spiritual Guides in sessionsData.ts');
}

update();
