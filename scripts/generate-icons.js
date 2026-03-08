const sharp = require('sharp');
const path = require('path');

const src = path.resolve('C:/Mis Cosas/Proyectos/Paziify-files/logo_paziify.png');
const assetsDir = path.resolve('C:/Mis Cosas/Proyectos/Paziify/assets');

async function generate() {
    // icon.png - 1024x1024 (Expo main icon, no transparency allowed)
    await sharp(src)
        .resize(1024, 1024)
        .png()
        .toFile(path.join(assetsDir, 'icon.png'));
    console.log('✅ icon.png (1024x1024)');

    // adaptive-icon.png - logo centrado con padding en fondo azul oscuro para el icono adaptativo de Android
    // El foreground se muestra sobre el background color del app.json (#ffffff actualmente, cambiamos a dark)
    // Las guías de Google recomiendan que el motivo ocupe el 66% del área (padding del 17% en cada lado)
    await sharp(src)
        .resize(700, 700) // logo en el 68% de 1024
        .extend({
            top: 162,
            bottom: 162,
            left: 162,
            right: 162,
            background: { r: 10, g: 12, b: 45, alpha: 1 } // #0A0C2D - azul muy oscuro del logo
        })
        .resize(1024, 1024)
        .png()
        .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('✅ adaptive-icon.png (1024x1024 con padding)');

    // splash-icon.png - logo centrado para la pantalla de splash
    await sharp(src)
        .resize(512, 512)
        .png()
        .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('✅ splash-icon.png (512x512)');

    // favicon.png - pequeño para web
    await sharp(src)
        .resize(48, 48)
        .png()
        .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('✅ favicon.png (48x48)');

    // playstore-icon.png - 512x512 para subir manualmente a la Play Console
    await sharp(src)
        .resize(512, 512)
        .png()
        .toFile(path.join('C:/Mis Cosas/Proyectos/Paziify-files', 'playstore-icon-512.png'));
    console.log('✅ playstore-icon-512.png (para Play Console, en Paziify-files/)');

    console.log('\n🎉 Todos los assets generados correctamente.');
}

generate().catch(console.error);
