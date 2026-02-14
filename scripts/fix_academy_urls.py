from pathlib import Path
import re

target = Path(r'c:\Mis Cosas\Proyectos\Paziify\src\data\academyData.ts')
content = target.read_text(encoding='utf-8')

base_url = "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/"

# Pattern to find audio_url: 'academy-voices/...' and convert it to full URL
# We avoid double-prepending by checking if it already starts with http
pattern = r"(audio_url:\s*')(academy-voices/[^']+')"

def replacer(match):
    prefix = match.group(1)
    relative_path = match.group(2)
    return f"{prefix}{base_url}{relative_path}"

new_content = re.sub(pattern, replacer, content)

target.write_text(new_content, encoding='utf-8')
print("Successfully converted Academy audio URLs to full Supabase public URLs.")
