const fs = require('fs');

const reportContent = fs.readFileSync('docs/guides/audit_report_sessions.md', 'utf8');
const lines = reportContent.split('\n');
const bucketId = 'meditation-voices';
let sql = `-- SQL para renombrar archivos guiados en Supabase Storage
-- Ejecuta esto en el SQL Editor de Supabase

`;

lines.forEach(line => {
    const cells = line.split('|').map(c => c.trim());
    if (cells.length >= 5) {
        const id = cells[1];
        const newName = cells[4].replace(/`/g, '');
        if (id && id !== 'ID' && !id.startsWith('---') && !id.startsWith('#') && !id.startsWith('**')) {
            // For guided sessions (and technical if needed, but user said 101 remaining)
            const oldName = `${id}_voices.mp3`;

            // We use a safe UPDATE on the storage.objects table
            sql += `UPDATE storage.objects SET name = '${newName}' WHERE bucket_id = '${bucketId}' AND name = '${oldName}';\n`;
        }
    }
});

fs.writeFileSync('docs/guides/rename_storage_objects.sql', sql);
console.log('✅ SQL script generated at docs/guides/rename_storage_objects.sql');
