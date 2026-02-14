import os
from pathlib import Path

# Configuration
ASSETS_DIR = Path(r'C:\Mis Cosas\Proyectos\Paziify\assets\academy-voices-generated')

# Known technical prefixes (based on folder audit)
TECH_PREFIXES = [
    'anxiety', 'basics', 'burnout', 'esteem', 'grief', 
    'kids', 'lead', 'parent', 'teens', 'insomnia'
]

def is_technical_filename(name):
    """
    Checks if a filename follows the technical pattern: {prefix}-{n}.mp3 or {prefix}.mp3
    Example: anxiety-1.mp3, teens-6.mp3, anxiety.mp3
    """
    stem = Path(name).stem.lower()
    
    # Check for prefix-index pattern
    for prefix in TECH_PREFIXES:
        if stem == prefix:
            return True
        if stem.startswith(f"{prefix}-"):
            suffix = stem[len(prefix)+1:]
            if suffix.isdigit():
                return True
    return False

def optimize_assets():
    if not ASSETS_DIR.exists():
        print(f"Error: Asset directory not found at {ASSETS_DIR}")
        return

    print("--- Academy Assets Optimization Audit ---")
    print(f"Scanning: {ASSETS_DIR}")
    
    files = list(ASSETS_DIR.glob('*.mp3'))
    technical_files = []
    descriptive_files = []

    for f in files:
        if is_technical_filename(f.name):
            technical_files.append(f)
        else:
            descriptive_files.append(f)

    print(f"Total files: {len(files)}")
    print(f"Technical files detected: {len(technical_files)}")
    print(f"Descriptive (Redundant) files detected: {len(descriptive_files)}")
    print("-" * 40)

    if not descriptive_files:
        print("No redundant files found. Optimization already complete.")
        return

    # Safe strategy: 
    # Since we can't easily map 'D_a_1' to 'anxiety-1' without looking inside,
    # and we know the user HAS all the technical files, we will list them first
    # and then proceed with deletion.

    print("Redundant files to be DELETED:")
    for f in descriptive_files:
        print(f" - {f.name}")
    
    print("-" * 40)
    user_confirm = input("Confirm deletion of these files? (y/n): ")
    
    if user_confirm.lower() == 'y':
        count = 0
        for f in descriptive_files:
            try:
                os.remove(f)
                count += 1
            except Exception as e:
                print(f"Error deleting {f.name}: {e}")
        print(f"SUCCESS: {count} redundant files deleted.")
    else:
        print("Deletion cancelled by user.")

if __name__ == "__main__":
    optimize_assets()
