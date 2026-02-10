import os
import argparse
from pathlib import Path
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = Path('paziify-7a576ff2d494.json').absolute()

# Voice Personas Configuration (MATCHING audio.md PREMIUM SPECS)
VOICE_PERSONAS = {
    'aria': { # Mindfulness & Calm
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-F',
        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
        'rate': 0.72,
        'pitch': -3.0
    },
    'ziro': { # Performance & Focus
        'language_code': 'es-ES',
        'name': 'es-ES-Neural2-G',
        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
        'rate': 0.75,
        'pitch': -2.5
    },
    'eter': { # Sleep & Resilience
        'language_code': 'es-ES',
        'name': 'es-ES-Studio-F',
        'ssml_gender': texttospeech.SsmlVoiceGender.MALE,
        'rate': 0.75,
        'pitch': 0.0 # Studio doesn't support pitch shifts nicely, so we keep 0 per audio.md
    },
    'gaia': { # Kids (DULCE/INFANTIL)
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-C',
        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
        'rate': 0.80,
        'pitch': 3.5
    }
}

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

    # Chunking Logic (preserving paragraph structure for SSML)
    MAX_CHARS = 4000 
    chunks = []
    current_chunk = ""
    paragraphs = text.replace('\r\n', '\n').split('\n')
    
    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 10 < MAX_CHARS:
            current_chunk += paragraph + "\n"
        else:
            if current_chunk: chunks.append(current_chunk)
            current_chunk = paragraph + "\n"
    
    if current_chunk:
        chunks.append(current_chunk)

    print(f"🎙️ Generating PREMIUM audio with persona: {persona.upper()} ({config['name']})...")
    
    combined_audio = b""
    
    try:
        for i, chunk in enumerate(chunks):
            if not chunk.strip(): continue
            
            print(f"   Processing chunk {i+1}/{len(chunks)}...")
            
            # WRAP IN SSML PROSODY
            # We add breaks (silence) between paragraphs automatically to sound more "spiritual"
            inner_text = clean_for_ssml(chunk).replace('\n', '\n<break time="2000ms"/>\n')
            
            ssml_text = f"""
            <speak>
            <prosody rate="{config['rate']}" pitch="{config['pitch']}st">
            {inner_text}
            </prosody>
            </speak>
            """
            
            synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=config['language_code'],
                name=config['name'],
                ssml_gender=config['ssml_gender']
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            response = client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            combined_audio += response.audio_content

        # Ensure directory exists
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'wb') as out:
            out.write(combined_audio)
            
        print(f"✅ Success! Premium Audio saved to: {output_path}")
        
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
