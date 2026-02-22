const fs = require('fs');

const reportContent = fs.readFileSync('docs/guides/audit_report_sessions.md', 'utf8');
const lines = reportContent.split('\n');
const renameTable = [];

lines.forEach(line => {
    const cells = line.split('|').map(c => c.trim());
    if (cells.length >= 5) {
        const id = cells[1];
        const newName = cells[4].replace(/`/g, '');
        if (id && id !== 'ID' && !id.startsWith('---') && !id.startsWith('#') && !id.startsWith('**')) {
            // Original filenames followed the pattern: [id]_voices.mp3
            // Except maybe some that were manually named, but the bulk was [id]_voices.mp3
            const oldName = `${id}_voices.mp3`;
            renameTable.push({
                old: oldName,
                new: newName
            });
        }
    }
});

fs.writeFileSync('docs/guides/supabase_rename_list.json', JSON.stringify(renameTable, null, 2));
console.log('✅ Supabase rename mapping saved to docs/guides/supabase_rename_list.json');

// Create a markdown summary for the user
let md = '# Guía de Renombrado en Supabase\n\n| Archivo Original | Nuevo Nombre |\n|------------------|--------------|\n';
renameTable.forEach(row => {
    md += `| ${row.old} | ${row.new} |\n`;
});
fs.writeFileSync('docs/guides/supabase_rename_guide.md', md);
