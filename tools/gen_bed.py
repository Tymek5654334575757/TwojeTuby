# Podkład muzyczny do długich filmów (ElevenLabs sound-generation, pętla), zapis do media/music.
import json, os, urllib.request, subprocess
env = dict(l.strip().split('=', 1) for l in open('/home/claude/twojetuby/.env') if '=' in l)
KEY = env['ELEVENLABS_API_KEY']
BEDS = {
    'bed-docu-calm': ('Calm minimal documentary underscore loop, soft felt piano notes over warm muted strings pad, slightly curious and serious mood, slow tempo, no drums, no vocals, seamless loop', 30, True),
    'bed-outro': ('Gentle resolving outro music, soft felt piano and warm strings, hopeful ending chord, slow, no drums, no vocals', 14, False),
}
os.makedirs('media/music', exist_ok=True)
for k, (p, d, loop) in BEDS.items():
    out = f'media/music/{k}.wav'
    if os.path.exists(out):
        continue
    body = json.dumps({"text": p, "model_id": "eleven_text_to_sound_v3", "duration_seconds": d, "prompt_influence": 0.5, "loop": loop}).encode()
    req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    try:
        data = urllib.request.urlopen(req, timeout=180).read()
    except urllib.error.HTTPError as e:
        print(k, 'HTTP', e.code, e.read()[:300]); continue
    open('/tmp/_b.mp3', 'wb').write(data)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/_b.mp3', '-af', 'loudnorm=I=-20:TP=-1.5', '-ar', '48000', '-ac', '2', out], check=True)
    print('ok', k)
