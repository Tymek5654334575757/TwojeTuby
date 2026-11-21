# Lektor z ElevenLabs z czasami znaków. Użycie: python3 tools/tts.py tekst.txt audio/wyjście [kanał|voice_id]
#   kanał: psy (Psychorożek) albo biz (Szczęście Pieniędzy Nie Daje); domyślnie psy.
# 21.11: Szczęście ma nowego lektora z biblioteki ElevenLabs: „Alex – Warm Storyteller” (wybór użytkownika),
#   model eleven_v4, stability 0.6. Stary głos z Voice Design (ItJR8OrFB6HePNAuLk4O) wycofany: dudnił i brzmiał sztucznie.
import json, sys, base64, urllib.request, urllib.error

PRESETS = {
    'psy': {'voice': 'lOUKyWHVBvOd22Rouh6D', 'model': 'eleven_v4', 'settings': {'stability': 0.5, 'similarity_boost': 0.75}},
    'biz': {'voice': 'H5xTcsAIeS5RAykjz57a', 'model': 'eleven_v4', 'settings': {'stability': 0.6, 'similarity_boost': 0.75}},
}
env = dict(l.strip().split('=', 1) for l in open('/home/claude/twojetuby/.env') if '=' in l)
KEY = env['ELEVENLABS_API_KEY']
arg = sys.argv[3] if len(sys.argv) > 3 else 'psy'
P = PRESETS.get(arg, {'voice': arg, 'model': 'eleven_v4', 'settings': {'stability': 0.5, 'similarity_boost': 0.75}})
text = open(sys.argv[1], encoding='utf-8').read().strip()
out = sys.argv[2]
body = json.dumps({"text": text, "model_id": P['model'], "language_code": "pl", "voice_settings": P['settings']}).encode()
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{P['voice']}/with-timestamps?output_format=mp3_44100_192",
                             data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
try:
    r = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read()[:500].decode(errors='replace')); sys.exit(1)
open(out + '.mp3', 'wb').write(base64.b64decode(r['audio_base64']))
json.dump(r.get('alignment') or r.get('normalized_alignment'), open(out + '.align.json', 'w'), ensure_ascii=False)
a = r['alignment']; print('ok, dur', a['character_end_times_seconds'][-1])
