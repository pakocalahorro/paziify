import os
from google.cloud import texttospeech

# Configurar credenciales
# Reemplaza con la ruta a tu archivo JSON de credenciales
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json'



def generate_audiobook(text_file, output_file, voice_name='es-ES-Neural2-B'):
    """
    Genera un audiolibro desde un archivo de texto usando Google Cloud TTS.
    
    Args:
        text_file: Ruta al archivo de texto (.txt)
        output_file: Ruta del archivo MP3 de salida
        voice_name: Nombre de la voz a usar
        
    Voces recomendadas en español:
    - es-ES-Neural2-A (Femenina, España) - Suave y clara
    - es-ES-Neural2-B (Masculina, España) - Profunda y calmada
    - es-US-Neural2-A (Femenina, Latinoamérica)
    - es-US-Neural2-B (Masculina, Latinoamérica)
    """
    
    # Inicializar cliente
    client = texttospeech.TextToSpeechClient()
    
    # Leer el texto
    print(f"📖 Leyendo archivo: {text_file}")
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
    # Ajusta estos parámetros para meditación/filosofía
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=0.90,  # Más lento para meditación (0.25 a 4.0)
        pitch=-2.0,          # Tono más grave y calmado (-20.0 a 20.0)
        volume_gain_db=0.0,  # Volumen (ajustar si es necesario)
    )
    
    print(f"🎙️ Generando audiolibro...")
    print(f"   Voz: {voice_name}")
    print(f"   Caracteres: {len(text):,}")
    print(f"   Duración estimada: ~{len(text) / 250:.0f} minutos")
    
    # Generar el audio
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    # Guardar el archivo
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)
    
    file_size_mb = len(response.audio_content) / (1024 * 1024)
    
    print(f"✅ Audiolibro generado exitosamente!")
    print(f"   Archivo: {output_file}")
    print(f"   Tamaño: {file_size_mb:.2f} MB")
    print(f"   Caracteres usados: {len(text):,}")

def list_available_voices():
    """Lista todas las voces disponibles en español."""
    client = texttospeech.TextToSpeechClient()
    voices = client.list_voices(language_code='es')
    
    print("\n🎤 Voces disponibles en español:\n")
    for voice in voices.voices:
        if voice.language_codes[0].startswith('es'):
            gender = "Femenina" if voice.ssml_gender.name == "FEMALE" else "Masculina"
            print(f"  • {voice.name}")
            print(f"    Género: {gender}")
            print(f"    Idioma: {voice.language_codes[0]}")
            print()

# Uso
if __name__ == '__main__':
    # Descomentar para ver voces disponibles
    # list_available_voices()
    
    # Generar audiolibro
    generate_audiobook(
        text_file='audiobooks_temp/manual-de-vida-epicteto.txt',
        output_file='audiobooks_temp/manual-de-vida-epicteto.mp3',
        voice_name='es-ES-Neural2-B'  # Voz masculina, calmada
    )
