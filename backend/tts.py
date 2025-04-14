from gtts import gTTS
import io
import pygame  # To play the audio

text = "Hello, I am an artificial intelligence, text-to-speech model."
lang = "en"

# Generate speech
tts = gTTS(text=text, lang=lang)

# Save to an in-memory buffer
audio_fp = io.BytesIO()
tts.write_to_fp(audio_fp)
audio_fp.seek(0)

# Play the audio using pygame
pygame.mixer.init()
pygame.mixer.music.load(audio_fp, "mp3")
pygame.mixer.music.play()

while pygame.mixer.music.get_busy():
    continue  # Wait until the speech finishes
