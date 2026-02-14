import re
from pathlib import Path

target = Path(r'c:\Mis Cosas\Proyectos\Paziify\src\data\academyData.ts')

if not target.exists():
    print(f"Error: File not found at {target}")
    exit(1)

content = target.read_text(encoding='utf-8')

# Pattern to find the lesson ID and where to insert the audio_url
# We match id: 'prefix-1', and insert audio_url: 'academy-voices/prefix-1.mp3',
pattern = r"(id:\s*'([a-z]+)-(\d+)',)"

def replacer(match):
    full_id_line = match.group(1)
    prefix = match.group(2)
    num = match.group(3)
    
    # We construct the new lines
    # We want to check if audio_url already exists in the next few lines (unlikely, but safe)
    # But for simplicity, since we know it's missing, we just append it.
    return f"{full_id_line}\n        audio_url: 'academy-voices/{prefix}-{num}.mp3',"

new_content = re.sub(pattern, replacer, content)

# Also handle cases where hyphen might be used but prefix is different if any
# (Audit showed they are usually course-prefix-index)

target.write_text(new_content, encoding='utf-8')
print("Successfully standardized audio_url for offline fallback in academyData.ts")
