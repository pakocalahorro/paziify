# 🎙️ Guía: Generación Manual de Audio (Paziify CLI)

Esta herramienta te permite generar audiolibros o pistas de voz usando las **voces oficiales** de nuestros guías (Aria, Ziro, Éter, Gaia) sin tener que configurar parámetros técnicos cada vez.

---

## 🚀 1. Preparación

1.  Asegúrate de tener instalado **Python**.
2.  Coloca tu archivo de credenciales `paziify-7a576ff2d494.json` en la carpeta raíz del proyecto (ya debería estar ahí).
3.  Crea un archivo de texto con el contenido que quieres convertir, por ejemplo: `mi_libro.txt`.

---

## 🛠️ 2. Cómo Usar la Herramienta

Abre tu terminal en la carpeta del proyecto y usa el siguiente comando:

```powershell
python scripts/generate_audiobook.py [INPUT] [OUTPUT] --persona [PERSONA]
```

### Argumentos:
*   `[INPUT]`: Ruta a tu archivo de texto (.txt).
*   `[OUTPUT]`: Ruta donde quieres guardar el MP3 (.mp3).
*   `--persona`: (Opcional) El guía que leerá el texto. Por defecto es `aria`.

---

## 🎭 3. Personas Disponibles

Usa estos códigos en el argumento `--persona`:

| Persona | Código | Estilo | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Aria** | `aria` | Sereno y Mindfulness | Meditaciones, introducciones, calma. |
| **Ziro** | `ziro` | Técnico y Enfocado | Productividad, estudio, deporte. |
| **Éter** | `eter` | Profundo y Onírico | Sueño, historias para dormir, resiliencia. |
| **Gaia** | `gaia` | Maternal y Mágico | Cuentos infantiles, energía suave. |

---

## 📝 4. Ejemplos Prácticos

### 🧘‍♀️ Generar con voz de Aria (Default)
```powershell
python scripts/generate_audiobook.py "textos/capitulo1.txt" "audios/capitulo1.mp3"
```

### 🧠 Generar con voz de Ziro (Rendimiento)
```powershell
python scripts/generate_audiobook.py "textos/leccion_foco.txt" "audios/leccion_foco.mp3" --persona ziro
```

### 🌙 Generar con voz de Éter (Sueño)
```powershell
python scripts/generate_audiobook.py "textos/historia_dormir.txt" "audios/sueño.mp3" --persona eter
```

---

## ⚠️ Notas Importantes
*   El script detecta automáticamente tu archivo de credenciales en la raíz.
*   Si el archivo de texto no existe, te avisará con un error.
*   Los audios generados son **MP3** listos para subir al Panel de Administrador.

---

## ⚡ 5. Opcion SUPER FACIL (Windows)

He creado un acceso directo para que no tengas que escribir comandos.

1.  Busca el archivo `generate_audio_easy.bat` en la carpeta principal del proyecto.
2.  Hazle doble clic.
3.  Te pedirá que arrastres tu archivo de texto.
4.  Escribe el nombre del guía (`aria`, `ziro`, etc).
5.  ¡Listo! El MP3 aparecerá al lado de tu texto.

---

## ⚠️ Nota sobre Google Cloud Web (Vertex AI)

Google ha actualizado su web y ahora dirige a **Vertex AI Studio**.
*   **Problema**: Vertex AI prioriza modelos nuevos ("Chirp", "Gemini") que **NO suenan igual** a nuestros guías.
*   **Recomendación**: Usa el script (`generate_audio_easy.bat`) para asegurarte de que Aria siempre suene como Aria (Modelo WaveNet) y Ziro como Ziro (Modelo Neural2). La web nueva puede hacerte perder la consistencia de voz.
