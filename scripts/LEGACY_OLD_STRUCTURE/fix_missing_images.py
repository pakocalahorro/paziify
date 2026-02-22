import os
import requests
import mimetypes
from pathlib import Path
import re

# Same setup as before, targeting only the missing ones
SUPABASE_URL = "https://ueuxjtyottluwkvdreqe.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldXhqdHlvdHRsdXdrdmRyZXFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAyNjM0OCwiZXhwIjoyMDg0NjAyMzQ4fQ.tzQDqD_Z58PzB9gbvW6jCIAY0XUl1T6U9G4AI2Ii9JQ"

# The ones that failed or were skipped
MISSING_IMAGES = {
    'basics_intro': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80', # Group therapy / connection / psychology
    'self_esteem': 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&q=80', # Confident person / uplifted
    'insomnia': 'https://images.unsplash.com/photo-1542384557-0824d90731ee?w=400&q=80', # Sleeping / moon / peaceful night
}

def fix_images():
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "apikey": SUPABASE_SERVICE_KEY
    }
    
    sql_updates = []

    print("🚀 Starting fix for missing images...")

    for module_id, url in MISSING_IMAGES.items():
        print(f"⬇️ Downloading {module_id}...")
        try:
            r = requests.get(url, timeout=10) # Added timeout
            if r.status_code != 200:
                print(f"   ❌ Failed to download: {r.status_code}")
                continue
            
            content_type = r.headers.get('content-type', 'image/jpeg')
            ext = mimetypes.guess_extension(content_type) or '.jpg'
            filename = f"{module_id}{ext}"
            
            # Upload to Supabase Storage
            upload_url = f"{SUPABASE_URL}/storage/v1/object/academy-thumbnails/{filename}"
            print(f"   ⬆️ Uploading to {upload_url}...")
            
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
        with open('scripts/update_missing_images.sql', 'w') as f:
            f.write('\n'.join(sql_updates))
        print("\n✅ Created 'scripts/update_missing_images.sql'. Run this in your SQL Editor.")
    else:
        print("\n⚠️ No SQL updates generated. Check errors.")

if __name__ == "__main__":
    fix_images()
