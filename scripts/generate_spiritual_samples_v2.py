import os
from google.cloud import texttospeech

# Setup
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'c:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json'
client = texttospeech.TextToSpeechClient()

# Text sample for meditation
TEXT = """
<speak>
Respira conmigo de nuevo. 
<break time="1s"/>
Siente la quietud que hay detrás de cada palabra. 
<break time="500ms"/>
Todo está bien aquí, en este momento de presencia.
</speak>
"""

SAMPLES = [
    {
        'id': 'F3_NEURAL_STABLE_E', 
        'name': 'Mujer (Neural2 E) - Firma y Serena', 
        'voice': 'es-ES-Neural2-E', 
        'rate': 0.81, 
        'pitch': -3.5
    },
    {
        'id': 'F4_NEURAL_DEEP_H', 
        'name': 'Mujer (Neural2 H) - Profunda y Estable', 
        'voice': 'es-ES-Neural2-H', 
        'rate': 0.80, 
        'pitch': -4.0
    },
    {
        'id': 'F5_WAVENET_MATURE_F', 
        'name': 'Mujer (Wavenet F) - Madura y Aireada', 
        'voice': 'es-ES-Wavenet-F', 
        'rate': 0.78, 
        'pitch': -2.5
    },
    {
        'id': 'F6_WAVENET_DEEP_H', 
        'name': 'Mujer (Wavenet H) - Terrosa y Tranquila', 
        'voice': 'es-ES-Wavenet-H', 
        'rate': 0.81, 
        'pitch': -3.5
    }
]

output_dir = r"c:\Mis Cosas\Proyectos\Paziify\assets\voice-samples"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print("🎙️ Generating spiritual feminine voice samples (V2)...")

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

print("\n✨ Batch 2 generated in assets/voice-samples")
