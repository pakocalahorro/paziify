import os
from google.cloud import texttospeech

# Setup
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'c:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json'
client = texttospeech.TextToSpeechClient()

TEXT = "Bienvenido a Paziify. Encuentra tu centro. Respira lenta y profundamente."

SAMPLES = [
    {'name': 'Studio_Female_C', 'voice': 'es-ES-Studio-C', 'rate': 0.85, 'pitch': -2.0},
    {'name': 'Studio_Male_F', 'voice': 'es-ES-Studio-F', 'rate': 0.85, 'pitch': -2.0},
    {'name': 'Neural2_Male_F', 'voice': 'es-ES-Neural2-F', 'rate': 0.85, 'pitch': -2.0},
    {'name': 'Wavenet_Female_F', 'voice': 'es-ES-Wavenet-F', 'rate': 0.85, 'pitch': -2.0},
]

output_dir = r"c:\Mis Cosas\Proyectos\Paziify\assets\voice-samples"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for s in SAMPLES:
    print(f"Generating {s['name']}...")
    synthesis_input = texttospeech.SynthesisInput(text=TEXT)
    voice = texttospeech.VoiceSelectionParams(
        language_code="es-ES",
        name=s['voice']
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=s['rate'],
        pitch=s['pitch']
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    filename = os.path.join(output_dir, f"sample_{s['name']}.mp3")
    with open(filename, "wb") as out:
        out.write(response.audio_content)
    print(f"Saved to {filename}")
