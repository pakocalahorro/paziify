import json
import re
from pathlib import Path

# We will read the extraction output or the raw file? 
# Reading the raw file is better to get the exact IDs and data.
# But parsing TS with regex is flaky. 
# However, I already have the extracted text files in `docs/scripts/academy_generated`.
# I can iterate those to get the content, but I need the metadata (icon, author, etc) from `academyData.ts`.

# Let's try to parse `academyData.ts` purely to generate the SQL. 

SOURCE_FILE = Path('src/data/academyData.ts')
OUTPUT_SQL = Path('scripts/migrate_academy.sql')

def escape_sql(text):
    if text is None: return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def generate_sql():
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    sql_statements = []
    sql_statements.append("BEGIN;")
    sql_statements.append("-- 1. Insert Modules")
    
    # 1. Parse Modules
    # Pattern: { id: '...', title: '...', ... } inside ACADEMY_MODULES
    # We'll use a specific regex for valid properties
    
    # Split content to isolate ACADEMY_MODULES array
    modules_block_match = re.search(r'export const ACADEMY_MODULES: AcademyModule\[\] = \[(.*?)\];', content, re.DOTALL)
    if modules_block_match:
        modules_block = modules_block_match.group(1)
        # Find individual objects
        # We assume reliable formatting from previous view_file
        module_matches = re.finditer(r"id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']+)',\s*icon:\s*'([^']+)',\s*category:\s*'([^']+)',\s*author:\s*'([^']+)',\s*duration:\s*'([^']+)',\s*(?:image:\s*'([^']+)',)?", modules_block)
        
        for m in module_matches:
            mid = m.group(1)
            title = m.group(2)
            desc = m.group(3)
            icon = m.group(4)
            cat = m.group(5)
            auth = m.group(6)
            dur = m.group(7)
            img = m.group(8) or '' # optional
            
            sql = f"""
            INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ({escape_sql(mid)}, {escape_sql(title)}, {escape_sql(desc)}, {escape_sql(icon)}, {escape_sql(cat)}, {escape_sql(auth)}, {escape_sql(dur)}, {escape_sql(img)}, true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
            """
            sql_statements.append(sql.strip())
            
    sql_statements.append("\n-- 2. Insert Lessons")
    
    # 2. Parse Lessons
    # First, isolate the ACADEMY_LESSONS block to avoid matching Module IDs with Lesson content via greedy DOTALL
    lessons_block_match = re.search(r'export const ACADEMY_LESSONS: Lesson\[\] = \[(.*?)\];', content, re.DOTALL)
    
    if not lessons_block_match:
        print("❌ Could not find ACADEMY_LESSONS block")
        return

    lessons_block = lessons_block_match.group(1)

    lesson_pattern = re.compile(
        r"id:\s*['\"]([^'\"]+)['\"].*?"
        r"moduleId:\s*['\"]([^'\"]+)['\"].*?"
        r"title:\s*['\"]([^'\"]+)['\"].*?"
        r"description:\s*['\"]([^'\"]+)['\"].*?"
        r"duration:\s*['\"]([^'\"]+)['\"].*?"
        r"isPlus:\s*(true|false).*?"
        r"content:\s*`([^`]+)`",
        re.DOTALL
    )
    
    matches = lesson_pattern.finditer(lessons_block)
    count = 0 
    for m in matches:
        lid = m.group(1)
        mid = m.group(2)
        title = m.group(3)
        desc = m.group(4)
        dur = m.group(5)
        is_plus = m.group(6) == 'true'
        content_txt = m.group(7)
        
        audio_url = f"https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/{lid}.mp3"
        
        sql = f"""
        INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ({escape_sql(lid)}, {escape_sql(mid)}, {escape_sql(title)}, {escape_sql(desc)}, {escape_sql(dur)}, {'true' if is_plus else 'false'}, {escape_sql(content_txt)}, {escape_sql(audio_url)}, {count})
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
        """
        sql_statements.append(sql.strip())
        count += 1

    sql_statements.append("COMMIT;")
    
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as out:
        out.write('\n'.join(sql_statements))
    
    print(f"✅ SQL Generated with {count} lessons")

if __name__ == "__main__":
    generate_sql()
