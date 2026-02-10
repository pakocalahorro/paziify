import os
from pathlib import Path
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
OUTPUT_PATH = 'assets/voice-samples/sample_gaia.mp3'

def generate_gaia_sample():
    # Setup credentials
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(Path(CREDENTIALS_PATH).absolute())
    
    client = texttospeech.TextToSpeechClient()
    
    # New Gaia Identity (Infantil/Dulce)
    sample_text = """
    <speak>
    <prosody rate="0.80" pitch="3.5st">
    Hola, soy Gaia. Estoy aquí para acompañarte en tus aventuras de calma y enseñarte el superpoder de tu respiración mágica. 
    ¿Estás listo para meditar conmigo?
    </prosody>
    </speak>
    """
    
    input_text = texttospeech.SynthesisInput(ssml=sample_text)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code="es-ES",
        name="es-ES-Wavenet-C"
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    print(f"🎤 Generando sample para Gaia (Lumina) con es-ES-Wavenet-C...")
    
    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    with open(OUTPUT_PATH, "wb") as out:
        out.write(response.audio_content)
        print(f"✅ Sample guardado en: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_gaia_sample()
