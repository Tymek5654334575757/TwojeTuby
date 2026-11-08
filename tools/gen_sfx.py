import json, os, urllib.request, subprocess
env = dict(l.strip().split('=',1) for l in open('/home/claude/twojetuby/.env') if '=' in l)
KEY = env['ELEVENLABS_API_KEY']
PAL = {
 'hum-generator': ('Low steady electrical hum of an old 1960s laboratory machine, subtle', 2.0),
 'click-switch': ('Single crisp mechanical toggle switch click, close, dry', 0.5),
 'pop-soft': ('Soft short paper pop, playful, clean, no reverb', 0.5),
 'pencil-scratch': ('Quick pencil scribble on paper, short, close mic', 1.0),
 'whoosh-soft': ('Soft quick paper whoosh transition, airy', 0.7),
 'thud-wall': ('Muffled heavy fist thump on a wall heard from the next room', 0.7),
 'stamp': ('Rubber stamp pressed firmly on paper on a wooden desk, single hit', 0.6),
 'ding-soft': ('Gentle small bell ding, bright, short decay', 1.0),
 'record-scratch': ('Short vinyl record scratch stop, comedic twist', 0.8),
 'zap-small': ('Small electric spark zap, short crackle', 0.6),
 'tick-tock': ('Clock ticking, four ticks, quiet, dry', 2.0),
 'riser-short': ('Short rising tension whoosh riser building up, cinematic, ends abruptly', 1.5),
 'impact-soft': ('Punchy soft cinematic hit, low thump with short tail, clean', 0.8),
 'swoosh-fast': ('Very fast short air swoosh for a camera zoom, crisp', 0.5),
 'pen-tap': ('Felt marker squeak stroke on paper, quick', 0.5),
 'bloop-morph': ('Cartoon bubbly morph pop, playful transformation sound', 0.6),
 'heartbeat': ('Slow tense heartbeat, two beats, low and muffled', 1.6),
 'scribble-erase': ('Fast aggressive pencil scribbling to cross something out', 0.8),
 'paper-slide': ('Paper sheet sliding quickly across a desk', 0.5),
 'ka-ching': ('Cash register ka-ching with coins, bright and short', 1.0),
 'coins-scatter': ('Handful of coins falling and scattering on the ground', 1.2),
 'plane-takeoff': ('Small propeller airplane accelerating and taking off, cartoonish, short', 2.5),
 'engine-sputter': ('Airplane engine sputtering, coughing and dying out, cartoon', 2.0),
 'crowd-murmur': ('Crowd of people murmuring, growing louder, short', 2.0),
 'vault-open': ('Heavy metal bank vault door unlocking and creaking open', 2.0),
 'gavel': ('Single wooden judge gavel strike, sharp, in a courtroom', 0.8),
 'bars-clank': ('Metal jail cell bars sliding shut with a clank', 1.0),
 'boing': ('Short cartoon boing bounce, playful', 0.6),
 'paper-flip': ('Calendar pages flipping fast', 1.0),
 'cartoon-fall': ('Cartoon tumble and thud of several things falling over', 1.2),
}
os.makedirs('media/sfx', exist_ok=True)
for k,(p,d) in PAL.items():
    out=f'media/sfx/{k}.wav'
    if os.path.exists(out): continue
    body=json.dumps({"text":p,"model_id":"eleven_text_to_sound_v3","duration_seconds":d,"prompt_influence":0.6}).encode()
    req=urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",data=body,headers={"xi-api-key":KEY,"Content-Type":"application/json"})
    try: data=urllib.request.urlopen(req,timeout=120).read()
    except urllib.error.HTTPError as e: print(k,'HTTP',e.code,e.read()[:300]); continue
    open('/tmp/_s.mp3','wb').write(data)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','/tmp/_s.mp3','-af','loudnorm=I=-20:TP=-1.5','-ar','44100','-ac','1',out],check=True)
    print('ok',k)
