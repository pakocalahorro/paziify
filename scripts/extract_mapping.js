const fs = require('fs');
const content = fs.readFileSync('docs/guides/audit_report_sessions.md', 'utf8');
const lines = content.split('\n');
const mapping = [];

lines.forEach(line => {
    const cells = line.split('|').map(c => c.trim());
    // The format is | ID | Title | ... | Nomenclatura |
    // ID is cells[1], Nomenclatura is cells[4]
    if (cells.length >= 5) {
        const id = cells[1];
        const newName = cells[4].replace(/`/g, '');
        if (id && id !== 'ID' && !id.startsWith('---') && !id.startsWith('#') && !id.startsWith('**')) {
            mapping.push({ id: id, newName: newName });
        }
    }
});

console.log(JSON.stringify(mapping, null, 2));
