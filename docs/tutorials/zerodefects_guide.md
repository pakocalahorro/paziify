# 🛡️ Guía Maestra: Paziify Zero Defects

Esta guía es tu referencia obligatoria para trabajar en el ecosistema Paziify. Aquí aprenderás cómo moverte dentro del **Blindaje de Platino** sin que los robots detengan tu progreso. El objetivo final: **Calidad Incorruptible (Zero Defects).**

---

## 🏛️ El Concepto: ¿Por qué estamos blindados?
Paziify es una aplicación de clase mundial. Para asegurar que ninguna actualización degrade la experiencia del usuario, hemos sustituido la "buena voluntad" del programador por **leyes técnicas automatizadas**.

---

## 🐕 Pilar 1: Husky Guard (El Policía Local)
Husky es un centinela que vive en tu ordenador. Se activa cada vez que haces `git commit`.

### ⚡ Caso Práctico: ¿Qué ocurre si tocas la UI?
Imagina que quieres cambiar el color de un botón en `HomeScreen.tsx` o modificar un componente en `src/components/`.
1.  Haces el cambio.
2.  Intentas guardar con `git commit -m "Ajuste de color"`.
3.  **BLOQUEO 🛑**: Husky detectará que has tocado la capa visual (`screens`, `components` o `navigation`) y abortará el commit.
4.  **Por qué**: Has olvidado cumplir el protocolo de seguridad "El Ojo".

---

## 🧬 Pilar 2: El Ojo (Protocolo JIT de Snapshots JSON)
Este proceso protege el "ADN" de las pantallas. Garantiza que si cambias algo, el robot y el CEO lo sepan.

### ⚡ Caso Práctico: Método de Cirugía Segura
Si vas a modificar `HomeScreen.tsx`, hazlo así:
1.  **Antes de tocar nada**: Ejecuta `npm run test:ojo`. El robot sacará una "firma digital" del estado actual de la pantalla.
2.  **Realiza tu cambio**.
3.  **Valida**: Ejecuta `npm run test:ojo` de nuevo. Si el cambio es el que tú querías, el robot te dirá que la firma no coincide.
4.  **Actualiza la Ley**: Si estás seguro del cambio, ejecuta `npm run test:update`. Ahora la nueva firma es la ley oficial.
5.  **Commit**: Ahora Husky te dejará pasar.

---

## 🖥️ Pilar 3: Integridad del Admin Panel
El Panel Admin gestiona la paz de miles de usuarios. No podemos permitir datos corruptos.

### ⚡ Caso Práctico: Añadir una Meditación
Si intentas subir una meditación sin autor o con un link de audio roto:
1.  El robot de integridad ejecutará los tests en la carpeta `/admin`.
2.  **Resultado**: Error de test. No podrás subir el cambio a GitHub.
3.  **Observación**: Revisa siempre que el objeto de meditación cumpla con todos los campos obligatorios antes de intentar integrarlo.

---

## 🏗️ Pilar 4: La Aduana de GitHub (CI/CD)
Una vez subes tu código, GitHub ejecuta el "Tridente de Sensores".

### 🔎 Detalles a tener en cuenta:
*   **Sensor Cerebro**: Si rompes una función de cálculo de racha o favoritos, este fallo saltará aquí.
*   **Sensor Build**: Si has olvidado importar una librería que has usado, el build fallará.
*   **Bloqueo de `main`**: Solo el CEO puede dar el botón de "Merge" (Integrar). Nunca intentes forzar una subida a `main`.

---

## 🆘 Pilar 5: El Botón de Pánico
Si has hecho muchos cambios, Husky te bloquea todo, y te sientes "atrapado" sin saber qué has roto:

### ⚡ Cuándo usarlo:
Ejecuta `npm run reset:paziify`.
*   **Resultado**: Tus cambios actuales desaparecen y el proyecto vuelve al estado de salud 100% que hay en el servidor.
*   **Consejo**: Es mejor hacer un reset y empezar con pasos pequeños que intentar pelear contra el robot de blindaje.

---

## 🏆 Resumen para el Desarrollador
1.  **Pequeños Pasos**: Haz commits frecuentes y pequeños.
2.  **Lógica Primero**: Valida tus funciones con `npm test`.
3.  **Diseño con JIT**: No toques una pantalla sin sacar su firma JSON primero.
4.  **Lee la Terminal**: Husky te dirá exactamente por qué te está bloqueando.

**Bienvenido al estándar Zero Defects de Paziify. 🤝🛡️**
