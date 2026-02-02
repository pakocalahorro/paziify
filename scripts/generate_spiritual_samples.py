import os
from google.cloud import texttospeech

# Setup
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'c:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json'
client = texttospeech.TextToSpeechClient()

# Text sample for meditation
TEXT = """
<speak>
Bienvenido a este espacio de paz. 
<break time="1s"/>
Cierra los ojos suavemente. 
<break time="500ms"/>
Siente como el aire entra... y sale de tu cuerpo. 
<break time="1s"/>
No hay prisa. Solo este momento.
</speak>
"""

SAMPLES = [
    {
        'id': 'F1_STUDIO_WARM', 
        'name': 'Mujer (Studio C) - Cálida y Humana', 
        'voice': 'es-ES-Studio-C', 
        'rate': 0.82, 
        'pitch': -2.5
    },
    {
        'id': 'F2_NEURAL_SOFT', 
        'name': 'Mujer (Neural2 A) - Suave y Clara', 
        'voice': 'es-ES-Neural2-A', 
        'rate': 0.80, 
        'pitch': -3.0
    },
    {
        'id': 'M1_STUDIO_DEEP', 
        'name': 'Hombre (Studio F) - Profundo y Sereno', 
        'voice': 'es-ES-Studio-F', 
        'rate': 0.82, 
        'pitch': -3.0
    },
    {
        'id': 'M2_NEURAL_STEADY', 
        'name': 'Hombre (Neural2 G) - Neutro y Estable', 
        'voice': 'es-ES-Neural2-G', 
        'rate': 0.80, 
        'pitch': -2.0
    }
]

output_dir = r"c:\Mis Cosas\Proyectos\Paziify\assets\voice-samples"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print("🎙️ Generating high-end spiritual voice samples...")

for s in SAMPLES:
    print(f"   -> Processing: {s['name']}...")
    synthesis_input = texttospeech.SynthesisInput(ssml=TEXT)
    voice = texttospeech.VoiceSelectionParams(
        language_code="es-ES",
        name=s['voice']
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=s['rate'],
        pitch=s['pitch']
    )

    try:
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        filename = os.path.join(output_dir, f"sample_{s['id']}.mp3")
        with open(filename, "wb") as out:
            out.write(response.audio_content)
        print(f"      ✅ OK: {filename}")
    except Exception as e:
        print(f"      ❌ Error with {s['name']}: {e}")

print("\n✨ All samples generated in assets/voice-samples")
