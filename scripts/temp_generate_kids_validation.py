
import os
import re
from pathlib import Path
from google.cloud import texttospeech
import time

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
SCRIPTS_ROOT = Path('docs/scripts/kids_familia')
OUTPUT_DIR = Path('assets/kids-voices-generated')

VOICE_CONFIGS = {
    'kids': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-H', # F6: Earthy & Deep (Gaia)
        'speaking_rate': 0.75,
        'pitch': -4.0
    }
}

def setup_credentials():
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(Path(CREDENTIALS_PATH).absolute())
    return True

def clean_text_for_tts(text):
    text = text.replace('&', '&amp;')
    text = re.sub(r'\(Pausa\)', '<break time="5000ms"/>', text, flags=re.IGNORECASE)
    text = re.sub(r'[\(\[].*?[\)\]]', '', text)
    text = re.sub(r'[*_#]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_markdown_script(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_match = re.search(r'^# Guion de Meditación: (.*)', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else file_path.stem
    
    # In Kids scripts, the (1:00) is approximate duration, not a start timestamp.
    # We will just extract all text inside quotes from the sections.
    sections = []
    
    # Find all second level headers and the text until the next header
    raw_sections = re.split(r'## \d+\. .*\n', content)
    for section_text in raw_sections[1:]: # Skip the intro/metadata part
        # Extract text inside quotes
        text_matches = re.findall(r'"([^"]*)"', section_text, re.DOTALL)
        if text_matches:
            text = " ".join(text_matches)
            text = clean_text_for_tts(text)
            if text:
                sections.append({'text': text})
    
    return {'title': title, 'style': 'kids', 'sections': sections}

def create_ssml_for_kids(sections, rate, pitch):
    ssml_parts = ['<speak>', f'<prosody rate="{rate}" pitch="{pitch}st">']
    
    for i, section in enumerate(sections):
        ssml_parts.append(section['text'])
        # Add a comfortable pause between sections
        if i < len(sections) - 1:
            ssml_parts.append('<break time="3000ms"/>')
    
    ssml_parts.append('</prosody></speak>')
    return "".join(ssml_parts)

def create_ssml_from_sections(sections, rate, pitch):
    ssml_parts = ['<speak>', f'<prosody rate="{rate}" pitch="{pitch}st">']
    last_known_abs_time = 0
    for section in sections:
        delay = section['start_time'] - last_known_abs_time
        if delay > 0:
            while delay > 10:
                ssml_parts.append('<break time="10000ms"/>')
                delay -= 10
            if delay > 0:
                ssml_parts.append(f'<break time="{int(delay * 1000)}ms"/>')
        text = section['text'].strip()
        if text and text[-1] not in ('.', '!', '?', '…'): text += "."
        ssml_parts.append(text)
        last_known_abs_time = section['start_time']
    ssml_parts.append('</prosody></speak>')
    return "".join(ssml_parts)

def generate_one(file_path):
    data = parse_markdown_script(file_path)
    output_file = OUTPUT_DIR / "kids_gaia_060_la-aventura-del-aire-respiracion-magica.mp3"
    config = VOICE_CONFIGS['kids']
    client = texttospeech.TextToSpeechClient()
    ssml = create_ssml_for_kids(data['sections'], config['speaking_rate'], config['pitch'])
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
    voice = texttospeech.VoiceSelectionParams(language_code=config['language_code'], name=config['name'])
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)
    print(f"✅ Generated for validation: {output_file.name}")

if __name__ == '__main__':
    setup_credentials()
    if not OUTPUT_DIR.exists(): OUTPUT_DIR.mkdir(parents=True)
    generate_one(SCRIPTS_ROOT / "81_aventura_aire.md")
