import os
import argparse
from pathlib import Path
from google.cloud import texttospeech

# Configuration
CREDENTIALS_PATH = Path('paziify-7a576ff2d494.json').absolute()

# Voice Personas Configuration
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
        'pitch': -3.5
    },
    'gaia': { # Kids & Energy
        'language_code': 'es-ES',
        'name': 'es-ES-Wavenet-H',
        'ssml_gender': texttospeech.SsmlVoiceGender.FEMALE,
        'rate': 0.75,
        'pitch': -4.0
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

def generate_audio(text_file, output_file, persona='aria'):
    """Generates audio from text using a specific persona, handling long texts by chunking."""
    
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

    # Check for empty text
    if not text.strip():
        print("❌ Error: Input text file is empty.")
        return

    # Chunking Logic
    MAX_CHARS = 4500 # Safety margin below 5000
    chunks = []
    
    # Simple chunking by splitting on double newlines or periods to respect sentences
    # Refined approach: accumulate sentences until limit
    current_chunk = ""
    paragraphs = text.replace('\r\n', '\n').split('\n')
    
    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 1 < MAX_CHARS:
            current_chunk += paragraph + "\n"
        else:
            # If paragraph itself is too huge (rare), splitting by period
            if len(paragraph) > MAX_CHARS:
                sentences = paragraph.split('. ')
                for sentence in sentences:
                    if len(current_chunk) + len(sentence) + 2 < MAX_CHARS:
                        current_chunk += sentence + ". "
                    else:
                        if current_chunk: chunks.append(current_chunk)
                        current_chunk = sentence + ". "
            else:
                if current_chunk: chunks.append(current_chunk)
                current_chunk = paragraph + "\n"
    
    if current_chunk:
        chunks.append(current_chunk)

    print(f"🎙️ Generating audio with persona: {persona.upper()} ({config['name']})...")
    print(f"   Input Length: {len(text)} chars")
    print(f"   Chunks: {len(chunks)}")
    
    combined_audio = b""
    
    try:
        for i, chunk in enumerate(chunks):
            if not chunk.strip(): continue
            
            print(f"   Processing chunk {i+1}/{len(chunks)} ({len(chunk)} chars)...")
            
            synthesis_input = texttospeech.SynthesisInput(text=chunk)
            
            voice = texttospeech.VoiceSelectionParams(
                language_code=config['language_code'],
                name=config['name'],
                ssml_gender=config['ssml_gender']
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=config['rate'],
                pitch=config['pitch']
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
            
        print(f"✅ Success! Audio saved to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error during synthesis: {e}")

def main():
    parser = argparse.ArgumentParser(description="Paziify Manual Audio Generator")
    parser.add_argument("input", help="Path to input .txt file")
    parser.add_argument("output", help="Path to output .mp3 file")
    parser.add_argument("--persona", choices=VOICE_PERSONAS.keys(), default="aria", 
                        help="Voice persona to use (default: aria)")
    
    args = parser.parse_args()

    if setup_credentials():
        generate_audio(args.input, args.output, args.persona)

if __name__ == '__main__':
    main()
