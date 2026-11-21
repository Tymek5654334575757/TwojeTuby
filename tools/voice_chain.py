# Obróbka lektora (wersja 2, 21.11): zamiast de-essera i dynamicznego loudnorm, które zjadały
# pasmo 2,5–12 kHz i ściskały dynamikę, tylko łagodne korekty i liniowe wzmocnienie.
#   highpass 70 Hz (dudnienie poniżej mowy), -2 dB półka 160 Hz (buczenie), +1,5 dB 3,2 kHz (czytelność),
#   kompresja 2:1 z miękkim kolanem, potem pomiar EBU R128 i stałe wzmocnienie do celu,
#   limiter tylko na szczyty (-2 dBFS, żeby true peak nie przekroczył -1,5 dBTP).
# Użycie: python3 tools/voice_chain.py wejście wyjście.wav [--lufs -16] [--tempo 1.0]
import json, subprocess, sys, argparse

EQ = ("highpass=f=70:poles=2,"
      "bass=g=-2:f=160:w=0.7,"
      "equalizer=f=3200:t=q:w=1.2:g=1.5,"
      "acompressor=threshold=-24dB:ratio=2:attack=10:release=150:knee=6:makeup=1")


def measure(src, pre):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', src, '-af',
                        pre + ',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True)
    txt = r.stderr
    return json.loads(txt[txt.rfind('{'):txt.rfind('}') + 1])


def process(src, dst, lufs=-16.0, tempo=1.0, extra=''):
    pre = 'aformat=channel_layouts=mono,aresample=48000' + (f',atempo={tempo}' if abs(tempo - 1) > 1e-3 else '') + ',' + EQ + (',' + extra if extra else '')
    m = measure(src, pre)
    gain = lufs - float(m['input_i'])
    for _ in range(3):  # limiter obniża głośność przy dużym crest factor, więc korygujemy wzmocnienie
        chain = pre + f',volume={gain:.2f}dB,alimiter=limit=0.79:attack=3:release=60:level=false'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', chain, '-ar', '48000', '-c:a', 'pcm_s24le', dst], check=True)
        out = float(measure(dst, 'anull')['input_i'])
        if abs(out - lufs) < 0.3:
            break
        gain += lufs - out
    return gain


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('dst')
    ap.add_argument('--lufs', type=float, default=-16.0)
    ap.add_argument('--tempo', type=float, default=1.0)
    a = ap.parse_args()
    g = process(a.src, a.dst, a.lufs, a.tempo)
    print(f'gain {g:+.2f} dB ->', a.dst)
