const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '.husky', 'pre-commit');

// Script robusto que:
// 1. Ejecuta tests de lógica.
// 2. Ejecuta el Husky Guard para cambios en pantallas.
const content = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

node scripts/husky_guard.js
npx jest src/__tests__/contentService.test.ts --config jest.config.logic.js --no-cache
`;

fs.writeFileSync(filePath, content, { encoding: 'utf8', mode: 0o755 });
console.log('Husky Pre-commit actualizado con éxito.');
