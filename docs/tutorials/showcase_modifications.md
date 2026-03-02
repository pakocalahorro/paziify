# Protocolo de Modificación de Diseño (Showcase Sandbox)

Este manual define el proceso obligatorio para realizar cambios visuales en los componentes de Paziify, utilizando el **Oasis Showcase** como entorno de pruebas seguro.

## 1. Filosofía de Trabajo
"Cualquier cambio global debe ser validado primero en el Showcase". Esto evita el "efecto virus" donde un error de diseño se propende por toda la App.

## 2. Los Archivos Clave
- **Arena de Pruebas:** `src/screens/OasisShowcaseScreen.tsx`
- **Componente Maestro:** `src/components/Oasis/OasisCard.tsx` (u otros en la carpeta Oasis)
- **Consumo Global:** `HomeScreen.tsx`, `MeditationCatalogScreen.tsx`, etc.

## 3. Flujo de Trabajo Paso a Paso

### Paso A: El Cambio en el Sandbox
Cuando se solicita un cambio (ej. color del título, radio de borde, espaciados):
1. **NO** tocaremos el componente maestro.
2. Se aplicará el cambio **únicamente** en la instancia de la tarjeta dentro de `OasisShowcaseScreen.tsx` (usando la propiedad `style` o modificando la configuración local del Showcase).
3. **Resultado:** Puedes entrar en el menú lateral -> Administración -> Showcase y ver el cambio en tiempo real sin que afecte al resto de la App.

### Paso B: Verificación y Ajuste
1. El usuario revisa en su dispositivo.
2. Si se requieren ajustes, se repite el **Paso A** hasta que el diseño sea perfecto.

### Paso C: Despliegue Global (Autorización)
Una vez aprobado el cambio con un "Procede al resto de la App":
1. El agente trasladará los cambios de estilo del Showcase al **Componente Maestro** (`src/components/Oasis/...`).
2. Se eliminarán los estilos "ad-hoc" del Showcase para que vuelva a heredar del maestro.
3. Se verificará visualmente que la Home y el Catálogo han adoptado el nuevo diseño correctamente.

## 4. Comandos de Referencia
Para indicarle al agente qué hacer:
- "Prueba [cambio] en el Showcase."
- "Ajusta la tarjeta del Showcase: [detalle]."
- "Aprobado. Despliega el diseño del Showcase a toda la App."

---
*Este protocolo blinda la integridad visual de Paziify v2.36.0+*
