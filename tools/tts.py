import json, os, sys, base64, urllib.request
env = dict(l.strip().split('=',1) for l in open('/home/claude/twojetuby/.env') if '=' in l)
KEY = env['ELEVENLABS_API_KEY']
VOICE = 'lOUKyWHVBvOd22Rouh6D'
text = open(sys.argv[1], encoding='utf-8').read().strip()
out = sys.argv[2]
body = json.dumps({"text": text, "model_id": "eleven_v4", "language_code": "pl",
                   "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}).encode()
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192",
                             data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
try:
    r = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read()[:500].decode(errors='replace')); sys.exit(1)
open(out + '.mp3', 'wb').write(base64.b64decode(r['audio_base64']))
json.dump(r.get('alignment') or r.get('normalized_alignment'), open(out + '.align.json', 'w'), ensure_ascii=False)
a = r['alignment']; print('ok, dur', a['character_end_times_seconds'][-1])
