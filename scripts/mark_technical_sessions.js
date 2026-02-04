const fs = require('fs');

const technicalIds = [
    'anx_478', 'anx_box', 'anx_sigh', 'wake_bellows', 'wake_sun',
    'sleep_nsdr', 'sleep_478_night', 'mind_open', 'mind_breath',
    'res_stoic', 'res_gratitude', 'res_vagus', 'anx_sos',
    'anx_calm_ocean', 'sleep_yoganidra', 'sleep_soft_rain',
    'wake_espresso', 'mind_sky'
];

let content = fs.readFileSync('src/data/sessionsData.ts', 'utf-8');

technicalIds.forEach(id => {
    // Look for the ID and add isTechnical: true before visualSync or other properties
    const regex = new RegExp(`("id":\\s*"${id}",[\\s\\S]*?)("visualSync":)`, 'g');
    content = content.replace(regex, `$1"isTechnical": true,\n    $2`);
});

fs.writeFileSync('src/data/sessionsData.ts', content);
console.log('✅ Updated sessionsData.ts with isTechnical: true flag for 18 sessions.');
