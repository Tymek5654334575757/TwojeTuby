# Tymczasowe czasy słów z samego tekstu (gdy brak nagrania): do budowy i kontroli animacji.
# Użycie: python3 tools/fake_words.py audio/x.txt audio/x_words.json audio/x_raw.mp3
import json, sys, subprocess
txt = open(sys.argv[1]).read().split()
t = 0.0; out = []
for w in txt:
    d = 0.06 * len(w) + 0.06
    out.append([w, round(t, 3), round(t + d, 3)])
    t += d + 0.07 + (0.32 if w[-1] in '.?!:' else 0.12 if w[-1] == ',' else 0)
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', str(t + 0.3), sys.argv[3]], check=True)
print('szac. długość', round(t, 2), 's')
