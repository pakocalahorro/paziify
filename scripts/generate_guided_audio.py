import os
import re
import json
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
        'name': 'es-ES-Wavenet-C', # F3: Sweet & High-pitched (Kids/Baby)
        'speaking_rate': 0.80,
        'pitch': 3.5
    }
}

def setup_credentials():
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        return False
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
    
    sections = []
    raw_sections = re.split(r'## \d+\. .*\n', content)
    for section_text in raw_sections[1:]:
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
        if i < len(sections) - 1:
            ssml_parts.append('<break time="3000ms"/>')
    ssml_parts.append('</prosody></speak>')
    return "".join(ssml_parts)

def generate_audio_for_kids(file_path):
    data = parse_markdown_script(file_path)
    if not data['sections']: return

    # Naming mapping approved by user
    mapping = {
        '81_aventura_aire': 'kids_gaia_060_la-aventura-del-aire-respiracion-magica',
        '82_bosque_relajacion': 'kids_gaia_061_el-bosque-de-la-relajacion',
        '83_superpoder_silencio': 'kids_gaia_062_el-superpoder-del-silencio',
        '84_enfado_monstruo': 'kids_gaia_063_adios-al-enfado-monstruo',
        '85_habitantes_mente': 'kids_gaia_064_habitantes-de-la-mente-mindfulness-para-ninos',
        '86_viaje_nube': 'kids_gaia_065_el-viaje-en-la-nube',
        '87_capitan_barco': 'kids_gaia_066_soy-el-capitan-de-mi-barco',
        '88_arbol_gratitud': 'kids_gaia_067_gratitud-para-ninos-el-arbol-de-la-suerte',
        '89_rayo_laser': 'kids_gaia_068_concentracion-para-ninos-el-rayo-laser',
        '90_estiramiento_estrella': 'kids_gaia_069_estiramiento-estrella-despertar-ninos'
    }
    
    file_id = file_path.stem
    output_filename = mapping.get(file_id, file_id) + ".mp3"
    output_path = OUTPUT_DIR / output_filename

    print(f"🎙️  Synthesizing (Sweet): {data['title']} -> {output_filename}")
    
    config = VOICE_CONFIGS['kids']
    client = texttospeech.TextToSpeechClient()
    ssml = create_ssml_for_kids(data['sections'], config['speaking_rate'], config['pitch'])
    
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
    voice = texttospeech.VoiceSelectionParams(language_code=config['language_code'], name=config['name'])
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    
    try:
        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        with open(output_path, 'wb') as out:
            out.write(response.audio_content)
        print(f"   ✅ Done: {output_filename}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def main():
    print("🚀 Paziify Kids Production Engine (Sweet Voice)")
    print("=" * 50)
    if not setup_credentials(): return
    if not OUTPUT_DIR.exists(): OUTPUT_DIR.mkdir(parents=True)
    
    md_files = sorted(list(SCRIPTS_ROOT.glob('*.md')))
    for i, md_file in enumerate(md_files):
        print(f"[{i+1}/{len(md_files)}] ", end="")
        generate_audio_for_kids(md_file)
        time.sleep(0.5)

if __name__ == '__main__':
    main()
