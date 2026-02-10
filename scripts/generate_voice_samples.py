"""
Script to generate short voice samples for Paziify Guides.
Allows identifying each guide's voice (Gaia, Eter, Ziro, Aria).
"""

import os
from pathlib import Path
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
OUTPUT_DIR = Path('assets/voice-samples')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Voice Configurations (Matching ORIGINAL PREMIUM settings)
GUIDES_CONFIG = {
    'Aria': {
        'voice_name': 'es-ES-Wavenet-F', # F5: Mature & Airy
        'pitch': -3.0,
        'rate': 0.72,
        'text': "Hola, soy Aria. Mi voz está diseñada para acompañarte en tus momentos de calma, meditación y bienestar diario."
    },
    'Gaia': {
        'voice_name': 'es-ES-Wavenet-H', # F6: Earthy & Deep
        'pitch': -4.0,
        'rate': 0.75,
        'text': "¡Hola! Soy Gaia. Te acompañaré en tus aventuras diarias, llenándote de energía y alegría."
    },
    'Ziro': {
        'voice_name': 'es-ES-Neural2-G', # M2: Steady & Grounded
        'pitch': -2.5,
        'rate': 0.75,
        'text': "Soy Ziro. Mi enfoque es la claridad y el rendimiento. Te ayudaré a alcanzar tus objetivos con determinación."
    },
    'Eter': {
        'voice_name': 'es-ES-Studio-F', # M1: Deep & Serene (Studio Male)
        'pitch': -3.5,
        'rate': 0.75,
        'text': "Bienvenidos. Soy Éter. Mi voz te guiará hacia el descanso profundo y la resiliencia mental."
    }
}

def setup_credentials():
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_PATH
    return True

def generate_sample(name, config):
    print(f"🎙️ Generating PREMIUM sample for {name}...")
    client = texttospeech.TextToSpeechClient()
    
    # Use SSML with a prosody tag for better "Spiritual Flow"
    # Special case: Studio voices don't support pitch in some contexts
    if 'Studio' in config['voice_name']:
        ssml_text = f'''
        <speak>
            <prosody rate="{config['rate']}">
                {config['text']}
            </prosody>
        </speak>
        '''
    else:
        ssml_text = f'''
        <speak>
            <prosody rate="{config['rate']}" pitch="{config['pitch']}st">
                {config['text']}
            </prosody>
        </speak>
        '''
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code='es-ES',
        name=config['voice_name']
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    response = client.synthesize_speech(
        input=synthesis_input, 
        voice=voice, 
        audio_config=audio_config
    )
    
    output_file = OUTPUT_DIR / f"sample_{name.lower()}.mp3"
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)
    
    print(f"   ✅ Saved to: {output_file}")

def main():
    if not setup_credentials():
        return
    
    for name, config in GUIDES_CONFIG.items():
        try:
            generate_sample(name, config)
        except Exception as e:
            print(f"   ❌ Error generating {name}: {e}")

if __name__ == "__main__":
    main()
