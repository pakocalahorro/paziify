import sys
import os
from pathlib import Path
from PIL import Image

def convert_to_webp(file_path):
    try:
        path = Path(file_path)
        
        # Check if file exists
        if not path.exists():
            print(f"❌ File not found: {file_path}")
            return

        # Check extension
        if path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            print(f"⚠️ Skipping non-image file: {path.name}")
            return

        # Output path (same folder, change ext to .webp)
        output_path = path.with_suffix('.webp')
        
        print(f"🖼️ Converting: {path.name}...")
        
        with Image.open(path) as img:
            # Save as WebP
            img.save(output_path, 'WEBP', quality=85)
            
        print(f"✅ Saved: {output_path.name}")
        
    except ImportError:
        print("❌ Error: 'Pillow' library is not installed.")
        print("   Please run: pip install Pillow")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error converting {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python img_to_webp.py <file1> <file2> ...")
    else:
        for arg in sys.argv[1:]:
            convert_to_webp(arg)
