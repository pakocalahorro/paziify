import os
import requests
import mimetypes
from pathlib import Path
import re

# We will use the REST API of Supabase to avoid installing the python client if possible, 
# or just assume requests is enough for the HTTP calls.
# We need the SUPABASE_URL and SERVICE_ROLE_KEY.

# PRE-REQUISITES:
# 1. Create bucket 'academy-thumbnails' if not exists (Public)
# 2. Add 'SUPABASE_URL' and 'SUPABASE_SERVICE_ROLE_KEY' to .env or paste here temporarily.

# For this script to work, user needs to fill in credentials or we read from .env if python-dotenv is there?
# We'll ask user to run it and maybe patch the SQL? 
# No, "uploading" means binary transfer.

# Let's write a script that generates a CURL command list or just uses python requests.

SUPABASE_URL = "https://ueuxjtyottluwkvdreqe.supabase.co"
# USER MUST PROVIDE THIS KEY
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldXhqdHlvdHRsdXdrdmRyZXFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAyNjM0OCwiZXhwIjoyMDg0NjAyMzQ4fQ.tzQDqD_Z58PzB9gbvW6jCIAY0XUl1T6U9G4AI2Ii9JQ" 

ACADEMY_IMAGES = {
    'anxiety': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    'basics_intro': 'https://images.unsplash.com/photo-1454165833744-96e6cf582bb1?w=400&q=80',
    'self_esteem': 'https://images.unsplash.com/photo-1499728603263-137cb7ab3e1f?w=400&q=80',
    'grief': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    'insomnia': 'https://images.unsplash.com/photo-1511296183654-10129df48a55?w=400&q=80',
    'burnout': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
    'leadership': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    'parenting': 'https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=400&q=80',
    'kids_mindfulness': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
    'teens_cbt': 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80',
}

def migrate_images():
    if not SUPABASE_SERVICE_KEY:
        print("❌ Please edit this script and add your SUPABASE_SERVICE_KEY at the top.")
        return

    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "apikey": SUPABASE_SERVICE_KEY
    }
    
    sql_updates = []

    for module_id, url in ACADEMY_IMAGES.items():
        print(f"⬇️ Downloading {module_id}...")
        try:
            r = requests.get(url)
            if r.status_code != 200:
                print(f"   Failed to download: {r.status_code}")
                continue
            
            content_type = r.headers.get('content-type', 'image/jpeg')
            ext = mimetypes.guess_extension(content_type) or '.jpg'
            filename = f"{module_id}{ext}"
            
            # Upload to Supabase Storage
            upload_url = f"{SUPABASE_URL}/storage/v1/object/academy-thumbnails/{filename}"
            print(f"   ⬆️ Uploading to {upload_url}...")
            
            # Requires multipart or binary body? Supabase storage API expects usage of file body usually
            # 'Content-Type': content_type
            
            up_headers = headers.copy()
            up_headers['Content-Type'] = content_type
            
            up = requests.post(upload_url, data=r.content, headers=up_headers)
            
            if up.status_code in [200, 201]:
                public_url = f"{SUPABASE_URL}/storage/v1/object/public/academy-thumbnails/{filename}"
                print(f"   ✅ Uploaded! {public_url}")
                
                # Generate SQL update
                sql = f"UPDATE public.academy_modules SET image_url = '{public_url}' WHERE id = '{module_id}';"
                sql_updates.append(sql)
            else:
                print(f"   ❌ Upload failed: {up.status_code} - {up.text}")
                # Check if it error is "Already Exists" (409?)
                if "Duplicate" in up.text or "already exists" in up.text:
                     public_url = f"{SUPABASE_URL}/storage/v1/object/public/academy-thumbnails/{filename}"
                     sql = f"UPDATE public.academy_modules SET image_url = '{public_url}' WHERE id = '{module_id}';"
                     sql_updates.append(sql)

        except Exception as e:
            print(f"   ❌ Error: {e}")

    # Write SQL script
    if sql_updates:
        with open('scripts/update_images.sql', 'w') as f:
            f.write('\n'.join(sql_updates))
        print("\n✅ Created 'scripts/update_images.sql'. Run this in your SQL Editor.")

if __name__ == "__main__":
    migrate_images()
