# Wspólny miks: lektor + efekty z biblioteki media/sfx, potem złożenie z obrazem.
# Użycie w skrypcie shorta: from sfxmix import Mix; m = Mix('src/shorts/x/vo.gen.ts'); m.add(...); m.run(...)
import json, re, subprocess

FPS = 30


def bez(x1, y1, x2, y2):
    # Easing.bezier jak w Remotion: rozwiązanie x(t) bisekcją
    def b(t, a, c):
        return 3 * a * t * (1 - t) ** 2 + 3 * c * t * t * (1 - t) + t ** 3

    def f(x):
        lo, hi = 0.0, 1.0
        for _ in range(40):
            m = (lo + hi) / 2
            if b(m, x1, x2) < x:
                lo = m
            else:
                hi = m
        return b((lo + hi) / 2, y1, y2)

    return f


EASE = bez(0.22, 1, 0.36, 1)


class Mix:
    def __init__(self, ts):
        s = open(ts).read()
        self.L = json.loads(s[s.index('= [') + 2 : s.rindex(';')])
        self.P = []

    def cue(self, li, w=None):
        n = lambda t: re.sub(r'[,.?:!]', '', t.lower())
        if not w:
            return self.L[li]['s']
        for x in self.L[li]['words']:
            if n(x['w']).startswith(n(w)):
                return x['s']
        raise Exception(f'brak słowa {w} w linii {li}')

    def T(self, li, w=None):
        # czas w sekundach zaokrąglony do klatki (jak w kompozycji)
        return round(self.cue(li, w) * FPS) / FPS

    def add(self, id, t, g):
        self.P.append((id, max(0.0, t), g))

    def run(self, vo_wav, video, mix_wav, out):
        ins = ['-i', vo_wav]
        fc = []
        labs = ['[0:a]']
        for k, (id, t, g) in enumerate(self.P):
            ins += ['-i', f'media/sfx/{id}.wav']
            ms = int(t * 1000)
            fc.append(f'[{k+1}:a]volume={g}dB,adelay={ms}|{ms}[s{k}]')
            labs.append(f'[s{k}]')
        fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:dropout_transition=0,alimiter=limit=0.89[a]")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', mix_wav], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', mix_wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
        print(len(self.P), 'efektów')
