# Efekty do shorta o efekcie Dunninga-Krugera (Psychorożek). Czasy z lektora, jak w DkShort.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/shorts/dk/vo.gen.ts')
T, add = m.T, m.add
f = 1 / FPS
TAIL = round((m.L[11]['e'] + 0.35) * FPS) / FPS

def pan(a, g=-12):
    add('swoosh-fast', a - 8 * f, g)

# Bank: haczyk
add('click-switch', 0.0, -22); add('tick-tock', 0.1, -26)
add('pencil-scratch', T(0, '1995') - 2 * f, -15)
add('impact-soft', T(0, 'napadł'), -13); add('coins-scatter', T(0, 'napadł') + 2 * f, -18)
add('pop-soft', T(0, 'dwa'), -14)
add('pop-soft', T(0, 'sokiem') - 2 * f, -15)
add('squish', T(0, 'cytryny'), -10)
add('bloop-morph', T(1, 'pewien') - 2 * f, -14)
add('whoosh-soft', T(1, 'kamery') - 2 * f, -16)
add('scribble-erase', T(1, 'zobaczą'), -14)

# Telewizja i policja
pan(T(2))
add('tv-on', T(2) + 2 * f, -12)
add('pencil-scratch', T(2, 'później') - 4 * f, -16)
add('stamp', T(2, 'telewizji'), -13); add('impact-soft', T(2, 'telewizji'), -13)
add('police-siren', T(3), -15)
add('tick-tock', T(3, 'niecałą'), -16)
add('bars-clank', T(3, 'godzinę') + 2 * f, -12)
add('boing', T(4), -15)
add('bloop-morph', T(4, 'przecież') - 2 * f, -15)
add('squish', T(4, 'cytryny'), -11); add('impact-soft', T(4, 'cytryny') + 2 * f, -14)

# Laboratorium
pan(T(5), -11)
add('whoosh-soft', T(5) - 6 * f, -14)
add('magic-shimmer', T(5, 'psycholodzy') - 4 * f, -13)
add('pencil-scratch', T(5, 'Dunning'), -15); add('pencil-scratch', T(5, 'Kruger'), -15)
add('paper-flip', T(6, '1999') - 2 * f, -15)
for w in ('logiki', 'gramatyki', 'humoru'):
    add('paper-slide', T(6, w) - 3 * f, -14); add('pop-soft', T(6, w), -16)

# Skala 0–100
pan(T(7))
add('pencil-scratch', T(7) - 6 * f, -14)
for i in range(6):
    add('pop-soft', T(7) - 4 * f + i * 2 * f, -23)
add('impact-soft', T(7, '12'), -11); add('pen-tap', T(7, '12') + 2 * f, -15)
add('riser-short', T(8) + 0.1, -18)
add('ding-soft', T(8, '62'), -10); add('impact-soft', T(8, '62'), -13)

# Głowa bez elementu
pan(T(9))
add('pencil-scratch', T(9) - 6 * f, -14)
add('whoosh-soft', T(9, 'wiedzy'), -13)
add('alert-buzz', T(9, 'brakuje'), -11); add('boing', T(9, 'brakuje') + 6 * f, -16)

# Zwrot: złudzenie
pan(T(10))
add('pop-soft', T(10, 'badaczy') - 2 * f, -14)
for i in range(5):
    add('pop-soft', T(10, 'efekt') + i * 2 * f, -21)
add('scribble-erase', T(10, 'złudzenie'), -11); add('record-scratch', T(10, 'złudzenie') + 2 * f, -15)
add('whoosh-soft', T(10, 'statystyczne') - 2 * f, -15)

# Powrót do banku i pętla
pan(T(11), -10)
add('bloop-morph', T(11, 'sprawdź') - 4 * f, -14)
add('ding-soft', T(11, 'twarzy'), -14)
add('squish', T(11, 'cytryny'), -10); add('impact-soft', T(11, 'cytryny') + 2 * f, -13)
add('click-switch', TAIL + 0.2, -20)

m.run('public/dk_vo.wav', 'out/dk_v1.mp4', 'audio/dk_mix.wav', 'out/dk_short_v1.mp4')
