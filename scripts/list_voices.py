from google.cloud import texttospeech
import os
from pathlib import Path

CREDENTIALS_PATH = Path('paziify-7a576ff2d494.json').absolute()
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(CREDENTIALS_PATH)

client = texttospeech.TextToSpeechClient()
voices = client.list_voices(language_code='es-ES')

for voice in voices.voices:
    print(f"Name: {voice.name}")
    print(f"  Gender: {voice.ssml_gender}")
    print("-" * 20)
