
import os
import requests
from pathlib import Path

# Load .env manually
env_path = Path('.env')
env_vars = {}
if env_path.exists():
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                key, value = line.split('=', 1)
                env_vars[key.strip()] = value.strip().strip('"').strip("'")

supabase_url = env_vars.get('EXPO_PUBLIC_SUPABASE_URL') or env_vars.get('SUPABASE_URL')
supabase_key = env_vars.get('EXPO_PUBLIC_SUPABASE_ANON_KEY') or env_vars.get('SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print("❌ Missing Supabase URL or Key")
    exit(1)

bucket = "meditation-voices"
samples_dir = Path("assets/voice-samples")

for audio_file in samples_dir.glob("*.mp3"):
    print(f"Uploading {audio_file.name}...")
    # Supabase Storage PUT URL: /storage/v1/object/bucket/path
    url = f"{supabase_url}/storage/v1/object/{bucket}/samples/{audio_file.name}"
    
    headers = {
        "Authorization": f"Bearer {supabase_key.strip()}",
        "Content-Type": "audio/mpeg",
        "x-upsert": "true"
    }
    
    with open(audio_file, "rb") as f:
        # For Supabase, PUT is used for direct file upload to a path
        response = requests.put(url, headers=headers, data=f)
        
    if response.status_code in [200, 201]:
        print(f"   ✅ Success: {audio_file.name}")
    else:
        print(f"   ❌ Failed: {audio_file.name} - {response.status_code} {response.text}")
