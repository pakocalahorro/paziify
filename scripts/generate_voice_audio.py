"""
Voice Track Generator for Paziify Meditation Sessions
Uses Google Cloud Text-to-Speech to generate pre-recorded voice tracks.

Prerequisites:
1. Google Cloud TTS API enabled
2. Service account credentials JSON file
3. Python package: google-cloud-texttospeech

Usage:
    python scripts/generate_voice_audio.py

Cost: FREE (uses ~6,000 characters out of 1,000,000 free/month)
"""

import os
import json
from pathlib import Path
from google.cloud import texttospeech
import time

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'  # Google Cloud service account credentials
OUTPUT_DIR = Path('assets/voice-tracks')
SCHEDULES_DIR = Path('assets/voice-tracks')

# Voice configuration (matching your current settings)
VOICE_CONFIG = {
    'es-ES-Wavenet-C': {  # Female voice, calm
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-C',
        'speaking_rate': 0.70,
        'pitch': -2.5
    },
    'es-ES-Wavenet-B': {  # Male voice, deep
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-B',
        'speaking_rate': 0.75,
        'pitch': -3.0
    }
}

def setup_credentials():
    """Setup Google Cloud credentials"""
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        print(f"   Please update CREDENTIALS_PATH in this script")
        return False
    
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_PATH
    print(f"✅ Credentials loaded from: {CREDENTIALS_PATH}")
    return True

def generate_silence(duration_ms):
    """Generate SSML for silence"""
    return f'<break time="{duration_ms}ms"/>'

def create_ssml_for_session(schedule):
    """Create SSML with timed voice cues"""
    ssml_parts = ['<speak>']
    
    last_time = 0
    for cue in schedule['schedule']:
        # Add silence from last cue to this cue
        silence_duration = (cue['time'] - last_time) * 1000  # Convert to ms
        if silence_duration > 0:
            ssml_parts.append(generate_silence(silence_duration))
        
        # Add voice cue
        ssml_parts.append(cue['text'])
        
        last_time = cue['time']
    
    ssml_parts.append('</speak>')
    return ''.join(ssml_parts)

def generate_voice_track(schedule_file, voice_style='calm'):
    """Generate MP3 audio from schedule"""
    
    # Read schedule
    with open(schedule_file, 'r', encoding='utf-8') as f:
        schedule = json.load(f)
    
    session_id = schedule['sessionId']
    title = schedule['title']
    
    print(f"\n🎙️  Generating: {title}")
    print(f"   Session ID: {session_id}")
    print(f"   Duration: {schedule['duration']}s")
    print(f"   Voice cues: {schedule['totalVoiceCues']}")
    
    # Select voice based on style
    voice_name = 'es-ES-Wavenet-C' if voice_style == 'calm' else 'es-ES-Wavenet-B'
    voice_config = VOICE_CONFIG[voice_name]
    
    # Create SSML
    ssml = create_ssml_for_session(schedule)
    character_count = len(ssml)
    print(f"   Characters: {character_count}")
    
    # Initialize TTS client
    client = texttospeech.TextToSpeechClient()
    
    # Configure synthesis
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code=voice_config['language_code'],
        name=voice_config['name']
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=voice_config['speaking_rate'],
        pitch=voice_config['pitch']
    )
    
    # Generate audio
    print(f"   Synthesizing...")
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    # Save MP3
    output_file = OUTPUT_DIR / f"{session_id}_voices.mp3"
    with open(output_file, 'wb') as out:
        out.write(response.audio_content)
    
    file_size = len(response.audio_content) / 1024  # KB
    print(f"   ✅ Generated: {output_file.name} ({file_size:.1f} KB)")
    
    return {
        'session_id': session_id,
        'output_file': str(output_file),
        'characters': character_count,
        'size_kb': file_size
    }

def main():
    print("🚀 Paziify Voice Track Generator")
    print("=" * 50)
    
    # Setup credentials
    if not setup_credentials():
        return
    
    # Find all schedule files
    schedule_files = list(SCHEDULES_DIR.glob('*_schedule.json'))
    
    if not schedule_files:
        print(f"\n❌ No schedule files found in {SCHEDULES_DIR}")
        print(f"   Run 'node scripts/generateVoiceSchedules.js' first")
        return
    
    print(f"\nFound {len(schedule_files)} schedule(s)")
    
    # Generate tracks
    results = []
    total_characters = 0
    
    for schedule_file in schedule_files:
        try:
            result = generate_voice_track(schedule_file)
            results.append(result)
            total_characters += result['characters']
            
            # Small delay to avoid rate limiting
            time.sleep(0.5)
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print("✅ Generation Complete!")
    print(f"   Tracks generated: {len(results)}")
    print(f"   Total characters: {total_characters:,}")
    print(f"   Free tier remaining: {1_000_000 - total_characters:,} characters")
    print(f"   Total size: {sum(r['size_kb'] for r in results):.1f} KB")
    
    print("\n📝 Next steps:")
    print("   1. Review generated MP3 files in assets/voice-tracks/")
    print("   2. Test audio quality")
    print("   3. Upload to Supabase Storage (meditation-voices bucket)")
    print("   4. Update AudioEngineService to load voice tracks")

if __name__ == '__main__':
    main()
