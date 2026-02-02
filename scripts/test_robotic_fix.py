import os
from google.cloud import texttospeech

# Setup
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'c:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json'
client = texttospeech.TextToSpeechClient()

# This simulates the "70_conexion_intestino" transition
# We add punctuation and a softer prosody.
TEXT_FIXED = """
<speak>
<prosody rate="0.78" pitch="-2.5st">
Tus emociones nacen a menudo en tu vientre. Vamos a armonizar el diálogo entre tu cabeza y tus intestinos. Pon una mano en tu frente y otra en tu abdomen bajo. Respira conectando ambos puntos.
<break time="5000ms"/>
Imagina el nervio vago como un cable de luz que une tu cerebro con tus órganos internos. Con cada respiración, envía señales de seguridad por ese cable.
</prosody>
</speak>
"""

TEXT_ORIGINAL = """
<speak>
Tus emociones nacen a menudo en tu vientre. Vamos a armonizar el diálogo entre tu cabeza y tus intestinos. Pon una mano en tu frente y otra en tu abdomen bajo. Respira conectando ambos puntos
<break time="5000ms"/>
Imagina el nervio vago como un cable de luz que une tu cerebro con tus órganos internos. Con cada respiración, envía señales de seguridad por ese cable
</speak>
"""

SAMPLES = [
    {'id': 'FIX_PROSODY', 'text': TEXT_FIXED},
    {'id': 'ORIGINAL_STYLE', 'text': TEXT_ORIGINAL}
]

output_dir = r"c:\Mis Cosas\Proyectos\Paziify\assets\voice-samples"

for s in SAMPLES:
    synthesis_input = texttospeech.SynthesisInput(ssml=s['text'])
    voice = texttospeech.VoiceSelectionParams(
        language_code="es-ES",
        name="es-ES-Wavenet-F"
    )
    # Note: We put the rate/pitch INSIDE prosody for the FIX, or OUTSIDE for original
    if "FIX" in s['id']:
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    else:
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=0.78,
            pitch=-2.5
        )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    filename = os.path.join(output_dir, f"test_{s['id']}.mp3")
    with open(filename, "wb") as out:
        out.write(response.audio_content)
    print(f"Generated {filename}")
