# 🎙️ Guía Rápida: Generar Tu Primer Audiolibro

Ya tienes todo listo. Ahora solo necesitas ejecutar el script.

---

## 📋 Pasos Finales:

### **1. Instalar la biblioteca de Google Cloud** (si no la tienes)

```powershell
pip install google-cloud-texttospeech
```

### **2. Actualizar el script con la ruta correcta**

Abre el archivo: `scripts/generate_audiobook.py`

Cambia la línea 5:
```python
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'paziify-tts-credentials.json'
```

Por la ruta completa:
```python
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Mis Cosas\Proyectos\Paziify\paziify-tts-credentials.json'
```

### **3. Crear carpeta para audiolibros**

```powershell
cd "C:\Mis Cosas\Proyectos\Paziify"
mkdir audiobooks_temp
```

### **4. Generar el audiolibro**

```powershell
cd "C:\Mis Cosas\Proyectos\Paziify"
python scripts/generate_audiobook.py
```

---

## ✅ Resultado Esperado:

Verás algo como:
```
📖 Leyendo archivo: audiobooks_temp/manual-de-vida-epicteto.txt
🎙️ Generando audiolibro...
   Voz: es-ES-Neural2-B
   Caracteres: 4,523
   Duración estimada: ~18 minutos
✅ Audiolibro generado exitosamente!
   Archivo: audiobooks_temp/manual-de-vida-epicteto.mp3
   Tamaño: 2.45 MB
   Caracteres usados: 4,523
```

---

## 🎧 Probar el Audio:

1. Ve a la carpeta: `audiobooks_temp`
2. Abre el archivo: `manual-de-vida-epicteto.mp3`
3. Escucha y verifica la calidad

---

## 📤 Subir a Supabase:

Si el audio te gusta:

1. Ve a Supabase Storage → bucket `audiobooks`
2. Crea carpeta `growth`
3. Sube el archivo `manual-de-vida-epicteto.mp3`
4. Copia la URL pública

---

**¿Listo para generar el audiolibro? Ejecuta los comandos y avísame si hay algún error.**
