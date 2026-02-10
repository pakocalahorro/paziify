"""
Voice Track Generator for Paziify Meditation Sessions
Uses Google Cloud Text-to-Speech with chunking support for long sessions.
"""

import os
import json
from pathlib import Path
from google.cloud import texttospeech
import time

# Configuration
CREDENTIALS_PATH = 'paziify-7a576ff2d494.json'
OUTPUT_DIR = Path('assets/voice-tracks')
SCHEDULES_DIR = Path('assets/voice-tracks')
SSML_CHAR_LIMIT = 4500  # Conservative limit (Google limit is 5000)

# Voice Configurations (Matching ORIGINAL PREMIUM settings)
VOICE_CONFIG = {
    'Aria': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-F', # F5: Mature & Airy
        'speaking_rate': 0.72,
        'pitch': -3.0
    },
    'Gaia': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-H', # F6: Earthy & Deep
        'speaking_rate': 0.75,
        'pitch': -4.0
    },
    'Ziro': {
        'language_code': 'es-ES',
        'name': 'es-ES-Neural2-G', # M2: Steady & Grounded
        'speaking_rate': 0.75,
        'pitch': -2.5
    },
    'Eter': {
        'language_code': 'es-ES',
        'name': 'es-ES-Studio-F', # M1: Deep & Serene (Studio Male)
        'speaking_rate': 0.75,
        'pitch': 0 # Studio doesn't support pitch shifts in the same way via API config
    }
}

def setup_credentials():
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_PATH
    print(f"✅ Credentials loaded from: {CREDENTIALS_PATH}")
    return True

def create_ssml_chunk(cues, start_time, config):
    # Wrapping in prosody for "Spiritual Flow"
    ssml_parts = ['<speak>', f'<prosody rate="{config["speaking_rate"]}"']
    if 'Studio' not in config['name']:
        ssml_parts.append(f' pitch="{config["pitch"]}st"')
    ssml_parts.append('>')
    
    last_time = start_time
    for cue in cues:
        silence_duration = (cue['time'] - last_time) * 1000
        if silence_duration > 0:
            ssml_parts.append(f'<break time="{int(silence_duration)}ms"/>')
        ssml_parts.append(cue['text'])
        last_time = cue['time']
    
    ssml_parts.append('</prosody>')
    ssml_parts.append('</speak>')
    return ''.join(ssml_parts)

def generate_voice_track(schedule_file, guide_name='Aria'):
    with open(schedule_file, 'r', encoding='utf-8') as f:
        schedule = json.load(f)
    
    session_id = schedule['sessionId']
    title = schedule['title']
    output_file = OUTPUT_DIR / f"{session_id}_voices.mp3"
    
    if output_file.exists():
        print(f"   ⏩ Skipping: {output_file.name}")
        return None

    print(f"\n🎙️  Generating PREMIUM Track: {title} ({session_id}) by {guide_name}")
    print(f"   Total cues: {len(schedule['schedule'])}")

    voice_config = VOICE_CONFIG.get(guide_name, VOICE_CONFIG['Aria'])
    client = texttospeech.TextToSpeechClient()

    # Split schedule into batches based on character limit
    batches = []
    temp_batch = []
    temp_chars = 40 # Base SSML overhead
    last_t = 0
    for cue in schedule['schedule']:
        cue_str = f'<break time="{int((cue["time"]-last_t)*1000)}ms"/>{cue["text"]}'
        if temp_batch and (temp_chars + len(cue_str) > SSML_CHAR_LIMIT):
            batches.append(temp_batch)
            temp_batch = []
            temp_chars = 40
        temp_batch.append(cue)
        temp_chars += len(cue_str)
        last_t = cue['time']
    if temp_batch:
        batches.append(temp_batch)

    print(f"   Split into {len(batches)} batches for synthesis")
    
    full_audio = bytearray()
    abs_last_time = 0
    
    for i, batch in enumerate(batches):
        print(f"   Synthesizing batch {i+1}/{len(batches)}...")
        ssml = create_ssml_chunk(batch, abs_last_time, voice_config)
        
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        voice = texttospeech.VoiceSelectionParams(language_code=voice_config['language_code'], name=voice_config['name'])
        
        # Audio config (Rate and Pitch are now handled via SSML Prosody for better flow)
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        
        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        full_audio.extend(response.audio_content)
        
        abs_last_time = batch[-1]['time']
        time.sleep(0.5) # Avoid rate limits

    with open(output_file, 'wb') as out:
        out.write(full_audio)
    
    print(f"   ✅ Generated: {output_file.name} ({len(full_audio)/1024:.1f} KB)")
    return True

def main():
    print("🚀 Paziify Voice Track Generator (Chunked Mode)")
    print("=" * 50)
    if not setup_credentials(): return
    
    schedule_files = list(SCHEDULES_DIR.glob('*_schedule.json'))
    if not schedule_files:
        print("❌ No schedules found.")
        return
    
    print(f"\nFound {len(schedule_files)} schedule(s)")
    for schedule_file in schedule_files:
        try:
            generate_voice_track(schedule_file)
        except Exception as e:
            print(f"   ❌ Error processing {schedule_file.name}: {e}")

if __name__ == '__main__':
    main()
