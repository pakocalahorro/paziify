import numpy as np
import wave
import struct
import os

def generate_binaural_beat(left_freq, right_freq, duration_sec, filename, sample_rate=44100):
    """
    Genera un beat binaural (izquierda/derecha distintos) y lo guarda como WAV.
    """
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)
    
    # Generar ondas para cada canal
    left_wave = np.sin(2 * np.pi * left_freq * t)
    right_wave = np.sin(2 * np.pi * right_freq * t)
    
    # Combinar en estéreo
    audio = np.vstack((left_wave, right_wave)).T
    
    # Normalizar a 16-bit PCM
    audio = (audio * 32767).astype(np.int16)
    
    # Escribir archivo WAV
    with wave.open(filename, 'w') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        f.writeframes(audio.tobytes())
    print(f"Generado: {filename} ({left_freq}Hz / {right_freq}Hz -> Beat: {abs(left_freq - right_freq)}Hz)")

def generate_solfeggio(freq, duration_sec, filename, sample_rate=44100):
    """
    Genera una frecuencia pura de solfeo (monoaural) y la guarda como WAV.
    """
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)
    audio_wave = np.sin(2 * np.pi * freq * t)
    
    # Normalizar a 16-bit PCM
    audio = (audio_wave * 32767).astype(np.int16)
    
    # Escribir archivo WAV
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        f.writeframes(audio.tobytes())
    print(f"Generado: {filename} ({freq}Hz)")

# Configuración
duration = 60  # 60 segundos es suficiente para un loop fluido
output_dir = "assets/audio/binaurals"
os.makedirs(output_dir, exist_ok=True)

# 1. Ondas Binaurales (Base 150Hz)
# Delta (2Hz): 150Hz vs 152Hz
generate_binaural_beat(150, 152, duration, os.path.join(output_dir, "binaural_delta.wav"))
# Theta (6Hz): 150Hz vs 156Hz
generate_binaural_beat(150, 156, duration, os.path.join(output_dir, "binaural_theta.wav"))
# Beta (20Hz): 150Hz vs 170Hz
generate_binaural_beat(150, 170, duration, os.path.join(output_dir, "binaural_beta.wav"))
# Gamma (40Hz): 150Hz vs 190Hz
generate_binaural_beat(150, 190, duration, os.path.join(output_dir, "binaural_gamma.wav"))

# 2. Frecuencias Solfeggio
generate_solfeggio(528, duration, os.path.join(output_dir, "solfeggio_528hz.wav"))
generate_solfeggio(396, duration, os.path.join(output_dir, "solfeggio_396hz.wav"))
generate_solfeggio(639, duration, os.path.join(output_dir, "solfeggio_639hz.wav"))
generate_solfeggio(963, duration, os.path.join(output_dir, "solfeggio_963hz.wav"))
