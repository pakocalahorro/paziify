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

VOICE_CONFIG = {
    'es-ES-Wavenet-C': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-C',
        'speaking_rate': 0.70,
        'pitch': -2.5
    },
    'es-ES-Wavenet-B': {
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-B',
        'speaking_rate': 0.75,
        'pitch': -3.0
    }
}

def setup_credentials():
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_PATH
    print(f"✅ Credentials loaded from: {CREDENTIALS_PATH}")
    return True

def create_ssml_chunk(cues, start_time):
    ssml_parts = ['<speak>']
    last_time = start_time
    for cue in cues:
        silence_duration = (cue['time'] - last_time) * 1000
        if silence_duration > 0:
            ssml_parts.append(f'<break time="{int(silence_duration)}ms"/>')
        ssml_parts.append(cue['text'])
        last_time = cue['time']
    ssml_parts.append('</speak>')
    return ''.join(ssml_parts)

def generate_voice_track(schedule_file, voice_style='calm'):
    with open(schedule_file, 'r', encoding='utf-8') as f:
        schedule = json.load(f)
    
    session_id = schedule['sessionId']
    title = schedule['title']
    output_file = OUTPUT_DIR / f"{session_id}_voices.mp3"
    
    if output_file.exists():
        print(f"   ⏩ Skipping: {output_file.name}")
        return None

    print(f"\n🎙️  Generating: {title} ({session_id})")
    print(f"   Total cues: {len(schedule['schedule'])}")

    voice_name = 'es-ES-Wavenet-C' if voice_style == 'calm' else 'es-ES-Wavenet-B'
    voice_config = VOICE_CONFIG[voice_name]
    client = texttospeech.TextToSpeechClient()

    # Split schedule into chunks based on character limit
    batches = []
    current_batch = []
    current_chars = 15  # <speak></speak> + base
    last_time_in_batch = 0
    
    # We need to preserve the timeline, so each batch starts with the silence from the end of previous batch
    global_last_time = 0
    
    for cue in schedule['schedule']:
        # Estimate size of this cue entry in SSML
        silence_ms = (cue['time'] - global_last_time) * 1000
        cue_ssml = f'<break time="{int(silence_ms)}ms"/>{cue["text"]}'
        
        if len(current_batch) > 0 and (current_chars + len(cue_ssml) > SSML_CHAR_LIMIT):
            # Batch is full, finish it
            batches.append({'cues': current_batch, 'start_time': global_last_time - last_time_in_batch})
            current_batch = []
            current_chars = 15
            # We don't Reset global_last_time, but we need to track relative start for the chunk
            last_time_in_batch = 0 # Dummy reset for relative calc
        
        current_batch.append(cue)
        current_chars += len(cue_ssml)
        # global_last_time = cue['time'] # Handled in loop

    if current_batch:
        batches.append({'cues': current_batch, 'start_time': 0}) # Logic below is cleaner

    # Actually, a simpler batching:
    batches = []
    temp_batch = []
    temp_chars = 20
    last_t = 0
    for cue in schedule['schedule']:
        cue_str = f'<break time="{int((cue["time"]-last_t)*1000)}ms"/>{cue["text"]}'
        if temp_batch and (temp_chars + len(cue_str) > SSML_CHAR_LIMIT):
            batches.append(temp_batch)
            temp_batch = []
            temp_chars = 20
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
        ssml = create_ssml_chunk(batch, abs_last_time)
        
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        voice = texttospeech.VoiceSelectionParams(language_code=voice_config['language_code'], name=voice_config['name'])
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, 
                                              speaking_rate=voice_config['speaking_rate'], 
                                              pitch=voice_config['pitch'])
        
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
