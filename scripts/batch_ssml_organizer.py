import os
import re
from pathlib import Path

# Paths
SOURCE_DIR = Path(r'C:\Mis Cosas\Proyectos\Paziify-files\meditation\meditacion-text')
DEST_ROOT = Path(r'C:\Mis Cosas\Proyectos\Paziify-files\meditation\SSML-scripts')

# Mapping: Prefix/Pattern -> Category (which defines persona/style)
CATEGORY_MAPPING = {
    # Ranges
    r'^(0[1-9]|10)_': 'calmasos',
    r'^anx_': 'calmasos',
    r'^(1[1-9]|20)_': 'despertar',
    r'^wake_': 'despertar',
    r'^(2[1-9]|30)_': 'sueno',
    r'^sleep_': 'sueno',
    r'^(3[1-9]|40)_': 'mindfulness',
    r'^mind_': 'mindfulness',
    r'^(4[1-9]|50)_': 'resiliencia',
    r'^res_': 'resiliencia',
    r'^(5[1-9]|60)_': 'rendimiento',
    r'^(6[1-9]|70)_': 'salud',
    r'^(7[1-9]|80)_': 'emocional',
    r'^(8[1-9]|90)_': 'kids',
    r'^(9[1-9]|100)_': 'habitos',
}

# Persona Config (matching generate_audiobook.py specs)
PERSONA_CONFIG = {
    'calmasos': {'persona': 'aria', 'rate': '72%', 'pitch': '0.0st'},
    'mindfulness': {'persona': 'aria', 'rate': '72%', 'pitch': '0.0st'},
    'salud': {'persona': 'aria', 'rate': '72%', 'pitch': '0.0st'},
    'emocional': {'persona': 'aria', 'rate': '72%', 'pitch': '0.0st'},
    'habitos': {'persona': 'aria', 'rate': '72%', 'pitch': '0.0st'},
    'despertar': {'persona': 'ziro', 'rate': '75%', 'pitch': '0.0st'},
    'resiliencia': {'persona': 'ziro', 'rate': '75%', 'pitch': '0.0st'},
    'rendimiento': {'persona': 'ziro', 'rate': '75%', 'pitch': '0.0st'},
    'sueno': {'persona': 'eter', 'rate': '75%', 'pitch': '0.0st'},
    'kids': {'persona': 'gaia', 'rate': '80%', 'pitch': '-1st'},
}

def clean_for_ssml(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def process_text_to_ssml(text, category):
    config = PERSONA_CONFIG.get(category, PERSONA_CONFIG['mindfulness'])
    
    # Clean and split into paragraphs
    paragraphs = text.replace('\r\n', '\n').split('\n')
    processed_paras = []
    
    for para in paragraphs:
        if not para.strip(): continue
        
        # Escape special characters
        clean_para = clean_for_ssml(para)
        
        # Inject pauses at punctuation
        # Period/Exclamation/Question -> 1.5s pause
        # Comma/Colon/Semicolon -> 600ms pause
        para_ssml = clean_para
        para_ssml = re.sub(r'([\.!\?])(\s+|$)', r'\1 <break time="1500ms"/>\2', para_ssml)
        para_ssml = re.sub(r'([,;:])(\s+|$)', r'\1 <break time="600ms"/>\2', para_ssml)
        
        # Special handling for breathing keywords
        para_ssml = para_ssml.replace('Inhala', 'Inhala... <break time="3s"/>')
        para_ssml = para_ssml.replace('Exhala', 'Exhala... <break time="4s"/>')
        
        processed_paras.append(para_ssml)

    inner_text = '\n    <break time="2500ms"/>\n    '.join(processed_paras)
    
    # Special "Meditative Outro" for Sleep and Kids
    outro = ""
    if category in ['sueno', 'kids']:
        outro = '\n    <prosody volume="soft" rate="70%">\n      Descansa... todo está bien. <break time="3s"/>\n    </prosody>'

    return f"""<speak>
  <prosody rate="{config['rate']}" pitch="{config['pitch']}">
    {inner_text}
    {outro}
  </prosody>
</speak>"""

def get_category(filename):
    for pattern, cat in CATEGORY_MAPPING.items():
        if re.search(pattern, filename):
            return cat
    return 'otros'

def run():
    if not SOURCE_DIR.exists():
        print(f"Error: Source dir {SOURCE_DIR} not found.")
        return

    DEST_ROOT.mkdir(parents=True, exist_ok=True)
    count = 0

    for file_path in SOURCE_DIR.glob('*.txt'):
        filename = file_path.name
        category = get_category(filename)
        
        dest_dir = DEST_ROOT / category
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Skip if already SSML
        if "<speak>" in content:
            print(f"Skipping {filename} (already SSML)")
            continue
            
        ssml_content = process_text_to_ssml(content, category)
        
        # Normalize name for Oasis Standards (0000-name) if possible
        # We replace underscores with hyphens for the new files
        new_filename = filename.replace('_', '-')
        
        with open(dest_dir / new_filename, 'w', encoding='utf-8') as f:
            f.write(ssml_content)
        
        count += 1
        print(f"Processed [{category}]: {new_filename}")

    print(f"\n✅ Finished! Processed {count} files into {DEST_ROOT}")

if __name__ == "__main__":
    run()
