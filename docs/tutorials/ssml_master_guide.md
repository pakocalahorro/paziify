# 🎙️ Guía Maestra de Comandos SSML (Paziify Premium) 💎

Esta guía es tu "mando a distancia" para controlar la expresividad, el énfasis y el ritmo de **Aria, Gaia, Ziro y Éter**. Al insertar estas etiquetas en tus archivos `.txt`, el motor de IA las interpretará para generar una locución humana y profesional.

---

## 1. El Comando de Oro: Énfasis (`<emphasis>`)
Úsalo para resaltar palabras clave en meditaciones o afirmaciones.

| Comando | Efecto | Traducción / Uso |
| :--- | :--- | :--- |
| `<emphasis level="strong">Palabra</emphasis>` | **Fuerte** | Aumenta el volumen y ralentiza la palabra. Ideal para: *"Siente la **Paz**"*. |
| `<emphasis level="moderate">Palabra</emphasis>` | **Moderado** | Un resalte sutil, voz más clara. Ideal para: *"Tu respiración es **natural**"*. |
| `<emphasis level="reduced">Palabra</emphasis>` | **Reducido** | Quita peso a la palabra, la hace más rápida y suave. |

---

## 2. El Control del Ritmo (`<prosody>`)
Perfecto para pasajes que requieren una lentitud extrema o un tono más profundo.

| Parámetro | Ejemplo | Efecto |
| :--- | :--- | :--- |
| **Velocidad (rate)** | `<prosody rate="slow">Texto...</prosody>` | Ralentiza un bloque entero (más que el 0.8x por defecto). |
| **Tono (pitch)** | `<prosody pitch="-2st">Texto...</prosody>` | Baja el tono (hace la voz más grave). *Nota: No usar con Éter (Studio).* |
| **Volumen** | `<prosody volume="soft">Texto...</prosody>` | Susurra un fragmento específico. |

---

## 3. Silencios Estratégicos (`<break>`)
Aunque el script añade 2s en cada salto de línea, puedes personalizarlos.

*   **Pausa de reflexión**: `<break time="3s"/>` (3 segundos de silencio total).
*   **Pausa respiratoria**: `<break time="500ms"/>` (Medio segundo, ideal después de una coma importante).
*   **Pausa de transición**: `<break strength="x-strong"/>` (Equivale a un cambio de tema).

---

## 4. Estructura Natural (`<s>` y `<p>`)
Ayudan a la IA a no "atropellarse" y entender dónde termina una idea.

*   `<s>Frase.</s>`: Marca una oración. La IA bajará el tono al final de forma natural.
*   `<p>Párrafo...</p>`: Obliga a una pausa mayor y un cambio de aire en la voz.

---

## 5. Pronunciación Especial (`<sub>` y `<say-as>`)
Si Gaia pronuncia mal una marca o un término técnico.

*   **Alias**: `<sub alias="Pácify">Paziify</sub>` (Le dice a la IA cómo leer una palabra).
*   **Fechas**: `<say-as interpret-as="date" format="mdy">02-23-2026</say-as>`.
*   **Deletreo**: `<say-as interpret-as="characters">CBT</say-as>` (Dirá "Ce-Be-Te" en vez de intentar leerlo como palabra).

---

## 💡 Consejos de Equipo para Gaia (Autonoe)

1.  **No abuses del "strong"**: Si pones muchas palabras con `level="strong"`, el audio puede sonar "enfadado" o artificial. Úsalo solo 1 o 2 veces por párrafo.
2.  **Susurros de Mindfulness**: Para el final de una sesión, prueba esto: 
    > `<prosody rate="x-slow" volume="soft">Quédate en este silencio...</prosody>`
3.  **El "Truco del Espacio"**: Si Gaia pega mucho dos palabras, pon un `<break time="200ms"/>` entre ellas.

---
*Última actualización: 23 de Febrero de 2026 - Manual de Prosodia Paziify v1.0*
