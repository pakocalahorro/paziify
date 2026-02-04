const fs = require('fs');

const auditResultsPath = 'c:/Mis Cosas/Proyectos/Paziify/scripts/audit_results.json';
const results = JSON.parse(fs.readFileSync(auditResultsPath, 'utf8'));

let md = "# Reporte de Auditoría de Catálogo\n\n";

md += "## 1. Estado de Sesiones (Audio y Guías)\n\n";

if (results.incorrect_audio.length > 0 || results.incorrect_creator.length > 0) {
    md += "### ❌ Incidencias Detectadas\n\n";
    md += "| ID | Título | Error Audio | Guía Detectado | Acción Requerida |\n";
    md += "|----|--------|-------------|----------------|------------------|\n";

    const allErrors = [...results.incorrect_audio, ...results.incorrect_creator];
    const uniqueIds = [...new Set(allErrors.map(e => e.id))];

    uniqueIds.forEach(id => {
        const audioErr = results.incorrect_audio.find(e => e.id === id);
        const creatorErr = results.incorrect_creator.find(e => e.id === id);
        const title = (audioErr || creatorErr).title;

        md += `| ${id} | ${title} | ${audioErr ? audioErr.error : '✅ OK'} | ${creatorErr ? (creatorErr.creator || 'Faltante') : '✅ OK'} | Revisar datos |\n`;
    });
} else {
    md += "✅ Todas las sesiones tienen URLs de audio válidas y guías asignados correctamente.\n\n";
}

md += "\n## 2. Auditoría de Imágenes (Thumbnails)\n\n";

if (results.missing_thumbnail.length > 0) {
    md += "### 🖼️ Sesiones sin Imagen Asignada\n\n";
    results.missing_thumbnail.forEach(s => {
        md += `- [ ] ${s.id}: ${s.title}\n`;
    });
}

if (results.thumbnail_not_indexed.length > 0) {
    md += "\n### ⚠️ Imágenes en Código que no existen en Supabase\n\n";
    results.thumbnail_not_indexed.forEach(s => {
        md += `- [ ] ${s.id}: ${s.title} (URL: ${s.url})\n`;
    });
}

if (results.missing_thumbnail.length === 0 && results.thumbnail_not_indexed.length === 0) {
    md += "✅ Todas las sesiones tienen imágenes válidas en Supabase o Unsplash.\n";
}

fs.writeFileSync('c:/Mis Cosas/Proyectos/Paziify/scripts/audit_report_summary.md', md);
console.log('Report generated at scripts/audit_report_summary.md');
