import os
import argparse
import json
from pathlib import Path
from datetime import datetime
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = Path('paziify-7a576ff2d494.json').absolute()

# Voice Personas Configuration (MATCHING audio.md PREMIUM SPECS)
VOICE_PERSONAS = {
    'aria': { # Mindfulness & Calm (UPGRADED TO CHIRP3-HD v2.14 - VINDEMIATRIX)
        'language_code': 'es-ES',
        'name': 'es-ES-Chirp3-HD-Vindemiatrix',
        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
        'rate': 0.72,
        'pitch': 0.0
    },
    'ziro': { # Performance & Focus (UPGRADED TO CHIRP3-HD v2.14 - ENCELADUS)
        'language_code': 'es-ES',
        'name': 'es-ES-Chirp3-HD-Enceladus',
        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
        'rate': 0.75,
        'pitch': 0.0
    },
    'eter': { # Sleep & Resilience
        'language_code': 'es-ES',
        'name': 'es-ES-Studio-F',
        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
        'rate': 0.75,
        'pitch': 0.0 # Studio doesn't support pitch shifts nicely, so we keep 0 per audio.md
    },
    'gaia': { # Kids (UPGRADED TO CHIRP3-HD v2.14 - AUTONOE)
        'language_code': 'es-ES',
        'name': 'es-ES-Chirp3-HD-Autonoe',
        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
        'rate': 0.80,
        'pitch': 0.0
    }
}

# Quota Configuration (Monthly Free Tier)
QUOTA_LIMITS = {
    'studio': 100000,
    'neural': 1000000, # Neural, Neural2, Chirp
    'standard': 4000000
}
QUOTA_FILE = Path('scripts/quota_tracker.json').absolute()

class QuotaTracker:
    @staticmethod
    def load():
        if QUOTA_FILE.exists():
            try:
                with open(QUOTA_FILE, 'r') as f:
                    data = json.load(f)
                    # Reset if new month
                    last_reset = data.get('last_reset', '')
                    current_month = datetime.now().strftime('%Y-%m')
                    if last_reset != current_month:
                        return {'last_reset': current_month, 'studio': 0, 'neural': 0, 'standard': 0}
                    return data
            except: pass
        return {'last_reset': datetime.now().strftime('%Y-%m'), 'studio': 0, 'neural': 0, 'standard': 0}

    @staticmethod
    def save(data):
        QUOTA_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(QUOTA_FILE, 'w') as f:
            json.dump(data, f, indent=4)

    @staticmethod
    def get_type(voice_name):
        if "Studio" in voice_name: return "studio"
        if "Wavenet" in voice_name or "Neural2" in voice_name or "Chirp" in voice_name: return "neural"
        return "standard"

def setup_credentials():
    """Sets up Google Cloud credentials."""
    if not CREDENTIALS_PATH.exists():
        print(f"❌ Error: Credentials file not found at: {CREDENTIALS_PATH}")
        print("Please place your 'paziify-7a576ff2d494.json' in the project root.")
        return False
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(CREDENTIALS_PATH)
    return True

def clean_for_ssml(text):
    """Basic cleaning to avoid SSML errors."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def generate_audio(text_file, output_file, persona='aria'):
    """Generates audio from text using a specific persona, with SSML Prosody support."""
    
    if persona not in VOICE_PERSONAS:
        print(f"❌ Error: Persona '{persona}' not found. Available: {', '.join(VOICE_PERSONAS.keys())}")
        return

    config = VOICE_PERSONAS[persona]
    client = texttospeech.TextToSpeechClient()

    print(f"📖 Reading text from: {text_file}")
    try:
        with open(text_file, 'r', encoding='utf-8') as f:
            text = f.read()
    except FileNotFoundError:
        print(f"❌ Error: Input file not found: {text_file}")
        return

    if not text.strip():
        print("❌ Error: Input text file is empty.")
        return

    print(f"🎙️ Generating PREMIUM audio with persona: {persona.upper()} ({config['name']})...")
    
    # Check if input is already SSML
    is_raw_ssml = "<speak>" in text
    
    # Chunking Logic (preserving paragraph structure for SSML, checking actual byte size)
    MAX_BYTES = 4800 # Safe margin below 5000
    
    def build_ssml(paras):
        combined = "\n".join(paras).strip('\n')
        
        if is_raw_ssml:
            return combined
            
        inner_text = clean_for_ssml(combined).replace('\n', '\n<break time="2000ms"/>\n')
        
        # FIX: Studio and Chirp voices do NOT support the 'pitch' attribute in <prosody>
        is_advanced = "Studio" in config['name'] or "Chirp" in config['name']
        pitch_attr = f'pitch="{config["pitch"]}st"' if not is_advanced else ""
        
        return f"""
        <speak>
        <prosody rate="{config['rate']}" {pitch_attr}>
        {inner_text}
        </prosody>
        </speak>
        """

    paragraphs = text.replace('\r\n', '\n').split('\n') if not is_raw_ssml else [text]
    
    chunks = []
    current_paragraphs = []
    
    for paragraph in paragraphs:
        if not paragraph.strip():
            continue
            
        # Test adding this paragraph
        test_paras = current_paragraphs + [paragraph]
        test_ssml = build_ssml(test_paras)
        test_bytes = len(test_ssml.encode('utf-8'))
        
        if test_bytes > MAX_BYTES:
            if current_paragraphs:
                # Store the current valid chunk
                chunks.append(build_ssml(current_paragraphs))
                current_paragraphs = [paragraph]
            else:
                # A single paragraph is too large! Just add it and hope or handle error.
                chunks.append(build_ssml([paragraph]))
                current_paragraphs = []
        else:
            current_paragraphs.append(paragraph)
            
    if current_paragraphs:
        chunks.append(build_ssml(current_paragraphs))
    
    combined_audio = b""
    
    try:
        for i, ssml_text in enumerate(chunks):
            if not ssml_text.strip(): continue
            
            print(f"   Processing chunk {i+1}/{len(chunks)} ({len(ssml_text.encode('utf-8'))} bytes)...")
            
            synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=config['language_code'],
                name=config['name'],
                ssml_gender=config['ssml_gender']
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            try:
                response = client.synthesize_speech(
                    input=synthesis_input,
                    voice=voice,
                    audio_config=audio_config
                )
                combined_audio += response.audio_content
            except Exception as inner_e:
                print(f"❌ Error during synthesis of chunk {i+1}:\n{inner_e}")
                print(f"--- Payload was ({len(ssml_text.encode('utf-8'))} bytes) ---\n{ssml_text[:500]}...\n---")
                raise inner_e

        # Ensure directory exists
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'wb') as out:
            out.write(combined_audio)
            
        print(f"✅ Success! Premium Audio saved to: {output_path}")
        
        # Quota Tracking
        v_type = QuotaTracker.get_type(config['name'])
        char_count = len(text)
        quota_data = QuotaTracker.load()
        quota_data[v_type] += char_count
        QuotaTracker.save(quota_data)
        
        limit = QUOTA_LIMITS[v_type]
        used = quota_data[v_type]
        remaining = max(0, limit - used)
        
        print(f"\n--- 📊 QUOTA REPORT ({v_type.upper()}) ---")
        print(f"   Characters this session: {char_count:,}")
        print(f"   Monthly used: {used:,} / {limit:,}")
        print(f"   Remaining (Free Tier): {remaining:,}")
        print("------------------------------\n")
        
    except Exception as e:
        print(f"❌ Error during synthesis: {e}")

def main():
    parser = argparse.ArgumentParser(description="Paziify Premium Audio Generator")
    parser.add_argument("input", help="Path to input .txt file")
    parser.add_argument("output", help="Path to output .mp3 file")
    parser.add_argument("--persona", choices=VOICE_PERSONAS.keys(), default="aria", 
                        help="Voice persona to use (default: aria)")
    
    args = parser.parse_args()

    if setup_credentials():
        generate_audio(args.input, args.output, args.persona)

if __name__ == '__main__':
    main()
