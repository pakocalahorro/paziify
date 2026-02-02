import os
import re
import json
from pathlib import Path
from google.cloud import texttospeech
import time

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
SCRIPTS_ROOT = Path('docs/scripts')
OUTPUT_DIR = Path('assets/voice-tracks')

VOICE_CONFIGS = {
    'calm': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-F', # F5: Mature & Airy (Spiritual Woman)
        'speaking_rate': 0.72,
        'pitch': -3.0
    },
    'standard': {
        'language_code': 'es-ES',
        'name': 'es-ES-Neural2-G', # M2: Steady & Grounded (Spiritual Man)
        'speaking_rate': 0.75,
        'pitch': -2.5
    },
    'deep': {
        'language_code': 'es-ES',
        'name': 'es-ES-Studio-F', # M1: Deep & Serene (Studio Male)
        'speaking_rate': 0.75,
        'pitch': -3.5
    },
    'kids': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-H', # F6: Earthy & Deep (Female)
        'speaking_rate': 0.75,
        'pitch': -4.0
    }
}

def setup_credentials():
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(Path(CREDENTIALS_PATH).absolute())
    return True

def clean_text_for_tts(text):
    # 1. Escape basic SSML chars
    text = text.replace('&', '&amp;')
    # 2. Convert explicit (Pausa) to SSML breaks
    text = re.sub(r'\(Pausa\)', '<break time="5000ms"/>', text, flags=re.IGNORECASE)
    # 3. Strip any other technical notes in brackets or parenthesis
    text = re.sub(r'[\(\[].*?[\)\]]', '', text)
    # 4. Clean up formatting
    text = re.sub(r'[*_#]', '', text)
    # 5. Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_markdown_script(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_match = re.search(r'^# Guion de Meditación: (.*)', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else file_path.stem
    
    style = 'calm'
    if 'energ' in content.lower() or 'foco' in content.lower() or 'poder' in content.lower() or 'rendimiento' in content.lower():
        style = 'standard' # M2: Steady spiritual man
    if 'sueño' in content.lower() or 'descanso' in content.lower() or 'resiliencia' in content.lower() or 'avanzado' in content.lower():
        style = 'deep' # M1: Deep spiritual man
    if 'kids' in str(file_path).lower() or 'niños' in content.lower():
        style = 'kids' # F6: Earthy spiritual woman
    
    # Regex to find sections and their timing
    section_pattern = r'## \d+\. .*?\(((\d+):(\d+))( - (\d+):(\d+))?\)\s*\n(.*?)(?=\n##|$)'
    matches = re.finditer(section_pattern, content, re.DOTALL)
    
    sections = []
    for match in matches:
        start_min = int(match.group(2))
        start_sec = int(match.group(3))
        start_time_total_sec = start_min * 60 + start_sec
        
        text_raw = match.group(7).strip()
        text_matches = re.findall(r'"([^"]*)"', text_raw)
        text = " ".join(text_matches) if text_matches else text_raw
        
        text = clean_text_for_tts(text)
        
        if text:
            sections.append({
                'start_time': start_time_total_sec,
                'text': text
            })
    
    return {
        'title': title,
        'style': style,
        'sections': sections
    }

def create_ssml_from_sections(sections, rate, pitch):
    # Wrapping EVERYTHING in a single prosody tag fixes the "robotic transition"
    # because the engine maintains a consistent prosodic state.
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
        
        # Ensure section text ends with a period for better transition context
        text = section['text'].strip()
        if text and text[-1] not in ('.', '!', '?', '…'):
            text += "."
            
        ssml_parts.append(text)
        last_known_abs_time = section['start_time']
        
    ssml_parts.append('</prosody>')
    ssml_parts.append('</speak>')
    return "".join(ssml_parts)

def generate_audio_for_script(file_path, overwrite=False):
    data = parse_markdown_script(file_path)
    if not data['sections']:
        return
    
    output_file = OUTPUT_DIR / f"{file_path.stem}_voices.mp3"
    if output_file.exists() and not overwrite:
        return
    
    print(f"🎙️  Synthesizing: [Style: {data['style']}] {data['title']}")
    
    config = VOICE_CONFIGS[data['style']]
    client = texttospeech.TextToSpeechClient()
    
    ssml = create_ssml_from_sections(data['sections'], config['speaking_rate'], config['pitch'])
    
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
    voice = texttospeech.VoiceSelectionParams(
        language_code=config['language_code'],
        name=config['name']
    )
    # We move rate/pitch INSIDE the SSML prosody tag for better Flow
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    try:
        response = client.synthesize_speech(
            input=synthesis_input, 
            voice=voice, 
            audio_config=audio_config
        )
        
        with open(output_file, 'wb') as out:
            out.write(response.audio_content)
        print(f"   ✅ Done: {output_file.name}")
    except Exception as e:
        print(f"   ❌ Error in {file_path.name}: {e}")

def main():
    print("🚀 Paziify Guided Audio Quality Engine (V2)")
    print("=" * 50)
    if not setup_credentials(): return
    
    if not OUTPUT_DIR.exists():
        OUTPUT_DIR.mkdir(parents=True)
    
    md_files = sorted(list(SCRIPTS_ROOT.glob('**/*.md')))
    total = len(md_files)
    print(f"Found {total} scripts. Starting production...")
    
    for i, md_file in enumerate(md_files):
        print(f"[{i+1}/{total}] ", end="")
        generate_audio_for_script(md_file, overwrite=True)
        time.sleep(1.0) # Conservative rate limit

if __name__ == '__main__':
    main()
