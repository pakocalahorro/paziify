import os
import re
from pathlib import Path
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = Path(r'C:\Mis Cosas\Proyectos\Paziify\paziify-7a576ff2d494.json')
SCRIPTS_DIR = Path(r'C:\Mis Cosas\Proyectos\Paziify\docs\scripts\academy_generated\insomnia')
OUTPUT_DIR = Path(r'C:\Mis Cosas\Proyectos\Paziify\assets\academy-voices-generated')

# Persona: Éter (Studio-F) - Deep & Serene
VOICE_CONFIG = {
    'language_code': 'es-ES',
    'name': 'es-ES-Studio-F',
    'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
    'rate': 0.75,
    'pitch': 0.0
}

def setup_credentials():
    if not CREDENTIALS_PATH.exists():
        print(f"Error: Credentials not found at {CREDENTIALS_PATH}")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(CREDENTIALS_PATH)
    return True

def clean_for_ssml(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def generate_insomnia_audio():
    client = texttospeech.TextToSpeechClient()
    
    if not OUTPUT_DIR.exists():
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {OUTPUT_DIR}")

    print(f"Starting Insomnia Regeneration (Voice: Eter)")
    print("-" * 50)

    for i in range(1, 8):
        lesson_id = f"insomnia-{i}"
        input_file = SCRIPTS_DIR / f"{lesson_id}.md"
        output_file = OUTPUT_DIR / f"{lesson_id}.mp3"
        
        if not input_file.exists():
            print(f"Skipping: {input_file.name} not found")
            continue

        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Clean markdown elements for TTS
        # 1. Remove "Guion de Meditación:" header
        text = re.sub(r'^# Guion de Meditación:.*', '', content, flags=re.IGNORECASE | re.MULTILINE)
        # 2. Remove other headers (# Header)
        text = re.sub(r'^#+.*', '', text, flags=re.MULTILINE)
        # 3. Remove bold/italic and emojis (optional but better for clean synthesis)
        text = text.replace('**', '').replace('__', '')
        # 4. Collapse whitespace
        text = text.strip()
        
        # Add pauses (2000ms) between paragraphs to sound more "spiritual/meditative"
        inner_text = clean_for_ssml(text).replace('\n', '\n<break time="2000ms"/>\n')
        
        ssml = f"""
        <speak>
        <prosody rate="{VOICE_CONFIG['rate']}">
        {inner_text}
        </prosody>
        </speak>
        """
        
        print(f"   [{i}/7] Synthesizing {lesson_id}...")
        
        try:
            synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
            voice = texttospeech.VoiceSelectionParams(
                language_code=VOICE_CONFIG['language_code'],
                name=VOICE_CONFIG['name'],
                ssml_gender=VOICE_CONFIG['ssml_gender']
            )
            audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
            
            response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
            
            with open(output_file, 'wb') as out:
                out.write(response.audio_content)
            
            print(f"   DONE: Saved to {output_file.name}")
        except Exception as e:
            print(f"   ERROR synthesizing {lesson_id}: {e}")

    print("-" * 50)
    print("Insomnia Regeneration Complete.")

if __name__ == "__main__":
    if setup_credentials():
        generate_insomnia_audio()
