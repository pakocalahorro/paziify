const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PORT = 8080;
const APK_PATH = 'android/app/build/outputs/apk/debug/app-debug.apk';

// Get local IPv4
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIP();
const url = `http://${ip}:${PORT}/app-debug.apk`;

const server = http.createServer((req, res) => {
    if (req.url === '/app-debug.apk') {
        const filePath = path.join(process.cwd(), APK_PATH);
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            res.writeHead(200, {
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Length': stat.size,
                'Content-Disposition': 'attachment; filename=app-debug.apk'
            });
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        } else {
            res.writeHead(404);
            res.end('APK not found');
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Descarga el APK aquí: <a href="${url}">${url}</a>`);
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor APK iniciado!`);
    console.log(`🔗 URL: ${url}`);
    console.log(`\nEscanea este código con tu móvil (debe estar en la misma red Wi-Fi):\n`);

    try {
        // Usar npx qrcode-terminal para mostrar el QR en consola
        execSync(`npx qrcode-terminal "${url}"`, { stdio: 'inherit' });
    } catch (e) {
        console.log(`No se pudo generar el QR automáticamente. Abre esta URL en tu móvil: ${url}`);
    }

    console.log(`\nPresiona Ctrl+C para detener el servidor.`);
});
