# 🎙️ Guía: Crear Audiolibros con Google Cloud TTS

**Objetivo**: Generar audiolibros en español usando Google Cloud Text-to-Speech (GRATIS).

---

## 📊 Resumen

- **Costo**: GRATIS (1 millón de caracteres/mes)
- **Calidad**: Excelente (voces WaveNet)
- **Capacidad**: ~66 audiolibros de 1h/mes
- **Idioma**: Español (múltiples voces)

---

## 🚀 Paso 1: Configurar Google Cloud

### 1.1 Crear cuenta de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Acepta los términos de servicio
4. **Importante**: Necesitarás una tarjeta de crédito para verificación, pero NO te cobrarán si te mantienes en el tier gratuito

### 1.2 Crear un proyecto

1. En la consola, haz clic en el selector de proyectos (arriba)
2. Clic en **"Nuevo proyecto"**
3. Nombre: `Paziify-TTS`
4. Clic en **"Crear"**

### 1.3 Activar la API de Text-to-Speech

1. Ve a [API Library](https://console.cloud.google.com/apis/library)
2. Busca: `Text-to-Speech API`
3. Clic en **"Habilitar"**
4. Espera 1-2 minutos a que se active

### 1.4 Crear credenciales

1. Ve a [Credentials](https://console.cloud.google.com/apis/credentials)
2. Clic en **"Crear credenciales"** → **"Clave de cuenta de servicio"**
3. Nombre: `paziify-tts-service`
4. Rol: `Project` → `Editor`
5. Clic en **"Crear"**
6. Se descargará un archivo JSON (ej: `paziify-tts-xxxxx.json`)
7. **Guarda este archivo en un lugar seguro**

---

## 🛠️ Paso 2: Instalar Herramientas

### 2.1 Instalar Google Cloud SDK (opcional)

Si quieres usar la línea de comandos:

```powershell
# Descargar instalador
# https://cloud.google.com/sdk/docs/install

# O usar Chocolatey
choco install gcloudsdk
```

### 2.2 Instalar Python (si no lo tienes)

```powershell
# Verificar si tienes Python
python --version

# Si no, instalar con winget
winget install Python.Python.3.12
```

### 2.3 Instalar biblioteca de Google Cloud TTS

```powershell
pip install google-cloud-texttospeech
```

---

## 📝 Paso 3: Preparar el Texto

### 3.1 Obtener el texto de "Manual de Vida" - Epicteto

El texto está en dominio público. Puedes obtenerlo de:
- [Proyecto Gutenberg](https://www.gutenberg.org/)
- [Wikisource](https://es.wikisource.org/)

### 3.2 Crear archivo de texto

Crea un archivo: `manual-de-vida-epicteto.txt`

Contenido (primeros párrafos como ejemplo):
```
Manual de Vida
Por Epicteto

Capítulo 1

Hay cosas que están en nuestro poder, y hay cosas que no lo están.
En nuestro poder están la opinión, el impulso, el deseo, la aversión;
en una palabra, todo aquello que es obra nuestra.

No están en nuestro poder el cuerpo, la hacienda, la reputación, los cargos;
en una palabra, todo aquello que no es obra nuestra.

[... continúa con el texto completo ...]
```

---

## 🎵 Paso 4: Generar el Audiolibro

### 4.1 Crear script de Python

Crea un archivo: `generate_audiobook.py`

```python
import os
from google.cloud import texttospeech

# Configurar credenciales
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'ruta/a/tu/paziify-tts-xxxxx.json'

def generate_audiobook(text_file, output_file, voice_name='es-ES-Neural2-A'):
    """
    Genera un audiolibro desde un archivo de texto.
    
    Voces disponibles en español:
    - es-ES-Neural2-A (Femenina, España)
    - es-ES-Neural2-B (Masculina, España)
    - es-US-Neural2-A (Femenina, EE.UU.)
    - es-US-Neural2-B (Masculina, EE.UU.)
    """
    
    # Inicializar cliente
    client = texttospeech.TextToSpeechClient()
    
    # Leer el texto
    with open(text_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Configurar la síntesis
    synthesis_input = texttospeech.SynthesisInput(text=text)
    
    # Configurar la voz
    voice = texttospeech.VoiceSelectionParams(
        language_code='es-ES',
        name=voice_name
    )
    
    # Configurar el audio
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=0.95,  # Velocidad (0.25 a 4.0)
        pitch=0.0,           # Tono (-20.0 a 20.0)
    )
    
    print(f"Generando audiolibro...")
    print(f"Texto: {len(text)} caracteres")
    
    # Generar el audio
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    # Guardar el archivo
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)
    
    print(f"✅ Audiolibro generado: {output_file}")
    print(f"Caracteres usados: {len(text)}")

# Uso
if __name__ == '__main__':
    generate_audiobook(
        text_file='manual-de-vida-epicteto.txt',
        output_file='manual-de-vida-epicteto.mp3',
        voice_name='es-ES-Neural2-B'  # Voz masculina
    )
```

### 4.2 Ejecutar el script

```powershell
cd "C:\Mis Cosas\Proyectos\Paziify\audiobooks_temp"
python generate_audiobook.py
```

---

## 🎧 Paso 5: Probar Voces

Para escuchar las voces disponibles antes de generar:

```python
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()

# Listar voces en español
voices = client.list_voices(language_code='es')

print("Voces disponibles en español:\n")
for voice in voices.voices:
    if voice.language_codes[0].startswith('es'):
        print(f"Nombre: {voice.name}")
        print(f"Género: {voice.ssml_gender.name}")
        print(f"Idioma: {voice.language_codes[0]}")
        print("---")
```

---

## 📤 Paso 6: Subir a Supabase

Una vez generado el MP3:

1. Ve a Supabase Storage → bucket `audiobooks`
2. Sube el archivo `manual-de-vida-epicteto.mp3`
3. Copia la URL pública
4. Actualiza el SQL de inserción

---

## 💰 Monitorear Uso

Para ver cuántos caracteres has usado:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Menú → **Facturación** → **Informes**
3. Filtra por servicio: `Cloud Text-to-Speech API`

---

## 📊 Límites y Costos

| Tier | Caracteres/mes | Costo |
|------|----------------|-------|
| Gratis | 1,000,000 | $0 |
| Standard | Adicionales | $4 por millón |
| WaveNet | Adicionales | $16 por millón |

**Recomendación**: Usa WaveNet (mejor calidad) dentro del tier gratuito.

---

## 🆘 Solución de Problemas

### Error: "Could not automatically determine credentials"
- Verifica que la ruta al archivo JSON sea correcta
- Usa ruta absoluta en `GOOGLE_APPLICATION_CREDENTIALS`

### Error: "API not enabled"
- Asegúrate de haber habilitado la Text-to-Speech API
- Espera 5 minutos después de habilitarla

### Texto muy largo
- Divide el texto en capítulos
- Genera cada capítulo por separado
- Combina los MP3s después

---

**Próximo paso**: Una vez generado el primer audiolibro, lo probamos en la app.
