const fs = require('fs');
const path = require('path');

const sessionsFilePath = 'c:/Mis Cosas/Proyectos/Paziify/src/data/sessionsData.ts';
const storageDataPath = 'c:/Mis Cosas/Proyectos/Paziify/scripts/storage_objects.json';

try {
    const STORAGE_LIST = JSON.parse(fs.readFileSync(storageDataPath, 'utf8'));
    const voices = STORAGE_LIST.filter(o => o.bucket_id === 'meditation-voices').map(o => o.name);
    const thumbnails = STORAGE_LIST.filter(o => o.bucket_id === 'meditation-thumbnails').map(o => o.name);

    const fileContent = fs.readFileSync(sessionsFilePath, 'utf8');

    // split and keep the delimiter
    const sessionBlocks = fileContent.split(/\{[\s\n]*"id":/).slice(1);

    const report = {
        correct: [],
        incorrect_audio: [],
        incorrect_creator: [],
        missing_thumbnail: [],
        thumbnail_not_indexed: []
    };

    const VALID_GUIDES = ['Aria', 'Éter', 'Ziro', 'Gaia', 'Paziify Team'];

    sessionBlocks.forEach((block, index) => {
        const fullBlock = '"id":' + block;
        try {
            const idMatch = fullBlock.match(/"id":[\s]*"([^"]+)"/);
            const titleMatch = fullBlock.match(/"title":[\s]*"([^"]+)"/);
            const voiceTrackMatch = fullBlock.match(/"voiceTrack":[\s]*"([^"]+)"/);
            const creatorNameMatch = fullBlock.match(/"creatorName":[\s]*"([^"]+)"/);
            const thumbMatch = fullBlock.match(/"thumbnailUrl":[\s]*"([^"]+)"/);

            if (!idMatch) return;

            const session = {
                id: idMatch[1],
                title: titleMatch ? titleMatch[1] : 'Unknown',
                voiceTrack: voiceTrackMatch ? voiceTrackMatch[1] : null,
                creatorName: creatorNameMatch ? creatorNameMatch[1] : null,
                thumbnailUrl: thumbMatch ? thumbMatch[1] : null
            };

            let isCorrect = true;

            // Check Audio
            if (session.voiceTrack) {
                const fileName = session.voiceTrack.split('/').pop();
                if (!voices.includes(fileName)) {
                    report.incorrect_audio.push({ id: session.id, title: session.title, url: session.voiceTrack, error: 'File not in storage' });
                    isCorrect = false;
                }
            } else {
                report.incorrect_audio.push({ id: session.id, title: session.title, error: 'Missing voiceTrack' });
                isCorrect = false;
            }

            // Check Creator
            if (!session.creatorName || !VALID_GUIDES.includes(session.creatorName)) {
                report.incorrect_creator.push({ id: session.id, title: session.title, creator: session.creatorName });
                isCorrect = false;
            }

            // Check Thumbnail
            if (!session.thumbnailUrl) {
                report.missing_thumbnail.push({ id: session.id, title: session.title });
                isCorrect = false;
            } else if (!session.thumbnailUrl.includes('images.unsplash.com')) {
                const thumbName = session.thumbnailUrl.split('/').pop();
                if (session.thumbnailUrl.includes('supabase.co') && !thumbnails.includes(thumbName)) {
                    report.thumbnail_not_indexed.push({ id: session.id, title: session.title, url: session.thumbnailUrl });
                }
            }

            if (isCorrect) {
                report.correct.push(session.id);
            }
        } catch (e) {
            console.error('Error parsing block ' + index);
        }
    });

    console.log(JSON.stringify(report, null, 2));

} catch (err) {
    console.error('Audit failed:', err.message);
    process.exit(1);
}
