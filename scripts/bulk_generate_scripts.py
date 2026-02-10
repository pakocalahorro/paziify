import os
import re
from pathlib import Path

# Paths
SCRIPTS_ROOT = Path(r'C:\Mis Cosas\Proyectos\Paziify\docs\scripts')
OUTPUT_DIR = Path(r'C:\Mis Cosas\Proyectos\Paziify-files\meditation\meditacion-text')

def parse_markdown_script(file_path):
    """Extracts spoken text (inside quotes) from professional guions."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return ""

    # Find all text inside double quotes
    # Using re.DOTALL to capture multi-line quotes
    matches = re.findall(r'"([^"]*)"', content, re.DOTALL)
    
    if not matches:
        return ""

    # Join quotes with double newlines to ensure generate_audiobook.py sees them as separate paragraphs
    # This will trigger the 2000ms pause in the motor.
    return "\n\n".join(matches)

def main():
    print(f"🚀 Paziify Script Migrator (docs/scripts -> meditacion-text)")
    print("===========================================================")
    
    if not OUTPUT_DIR.exists():
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Created output directory: {OUTPUT_DIR}")

    count = 0
    # Walk through all subdirectories
    # We use rglob to find all .md files in all subfolders
    for md_file in SCRIPTS_ROOT.rglob('*.md'):
        # Skip academy and other non-session folders if necessary
        if 'academy' in str(md_file).lower(): continue
        
        script_text = parse_markdown_script(md_file)
        if not script_text:
            continue
            
        # Target filename (matching docs/scripts filename)
        target_name = md_file.stem + ".txt"
        target_path = OUTPUT_DIR / target_name
        
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(script_text)
        
        count += 1
        if count % 10 == 0:
            print(f"Migrated {count} scripts...")

    print(f"\n✅ SUCCESS! {count} professional scripts migrated to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
