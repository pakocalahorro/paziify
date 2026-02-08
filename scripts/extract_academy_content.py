import re
import os
import json
from pathlib import Path

# Path to the source file
SOURCE_FILE = Path('src/data/academyData.ts')
OUTPUT_DIR = Path('docs/scripts/academy_generated')

def clean_content(content_str):
    """Cleans the TS string content to be pure text/markdown."""
    # Remove leading/trailing quotes/backticks
    content_str = content_str.strip()
    if content_str.startswith('`') and content_str.endswith('`'):
        content_str = content_str[1:-1]
    elif content_str.startswith("'") and content_str.endswith("'"):
        content_str = content_str[1:-1]
    elif content_str.startswith('"') and content_str.endswith('"'):
        content_str = content_str[1:-1]
    
    # Unescape escaped characters if necessary
    content_str = content_str.replace("\\`", "`").replace("\\'", "'").replace('\\"', '"')
    return content_str

def extract_lessons():
    if not OUTPUT_DIR.exists():
        OUTPUT_DIR.mkdir(parents=True)
        
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find lessons in the flat array ACADEMY_LESSONS
    # We look for objects that contain moduleId, title, and content.
    # Pattern:
    # {
    #    ...
    #    moduleId: '...',
    #    title: '...',
    #    ...
    #    content: `...`
    # }
    
    print("Scanning for lessons...")
    
    # We will iterate through the file and look for "content: `...`" blocks, 
    # then backwards scan or separate regex for the other properties within the same block is hard.
    # Better approach: split by "id:" or just find all matches of the pattern.
    
    # Updated Regex to capture ID as well
    lesson_pattern = re.compile(
        r"id:\s*['\"]([^'\"]+)['\"].*?"        # Capture ID
        r"moduleId:\s*['\"]([^'\"]+)['\"].*?"  # Capture moduleId
        r"title:\s*['\"]([^'\"]+)['\"].*?"     # Capture title
        r"content:\s*`([^`]+)`",                # Capture content
        re.DOTALL
    )
    
    matches = lesson_pattern.finditer(content)
    
    count = 0
    for match in matches:
        lesson_id = match.group(1)
        module_id = match.group(2)
        title = match.group(3)
        lesson_content = match.group(4)
        
        # Create module folder
        module_dir = OUTPUT_DIR / module_id
        if not module_dir.exists():
            module_dir.mkdir(parents=True)
            
        # Use ID for filename to ensure safety and mapping
        filename = f"{lesson_id}.md"
        filepath = module_dir / filename
        
        full_text = f"# Guion de Meditación: {title}\n\n{clean_content(lesson_content)}"
        
        with open(filepath, 'w', encoding='utf-8') as out:
            out.write(full_text)
        
        print(f"✅ Generated: {module_id}/{filename}")
        count += 1
            
    print(f"--- Total lessons extracted: {count}")
    
    if count == 0:
        print("❌ No lessons found! Check regex.")

if __name__ == "__main__":
    extract_lessons()
