
import os
from pathlib import Path
from google.cloud import texttospeech

CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
OUTPUT_DIR = Path('assets/kids-voices-generated/samples')
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(Path(CREDENTIALS_PATH).absolute())

SAMPLE_TEXT = "¡Hola, pequeño aventurero! ¿Sabías que dentro de ti tienes un superpoder secreto? Se llama La Respiración Mágica. Tumbado bocarriba, pon tus manos sobre tu ombligo. Imagina que ahí tienes un globo de tu color favorito."

OPTIONS = [
    {'id': 'OpA_Juvenil', 'model': 'es-ES-Neural2-F', 'rate': 0.85, 'pitch': 2.0},
    {'id': 'OpB_Dulce', 'model': 'es-ES-Wavenet-C', 'rate': 0.80, 'pitch': 3.5},
    {'id': 'OpC_Narrativa', 'model': 'es-ES-Wavenet-D', 'rate': 0.82, 'pitch': 1.0},
]

def generate_samples():
    client = texttospeech.TextToSpeechClient()
    if not OUTPUT_DIR.exists(): OUTPUT_DIR.mkdir(parents=True)
    
    for opt in OPTIONS:
        ssml = f'<speak><prosody rate="{opt["rate"]}" pitch="{opt["pitch"]}st">{SAMPLE_TEXT}</prosody></speak>'
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        voice = texttospeech.VoiceSelectionParams(language_code='es-ES', name=opt['model'])
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        
        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        output_file = OUTPUT_DIR / f"test_kids_{opt['id']}.mp3"
        with open(output_file, 'wb') as out:
            out.write(response.audio_content)
        print(f"✅ Sample generated: {output_file.name}")

if __name__ == '__main__':
    generate_samples()
