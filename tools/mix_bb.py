# Efekty do shorta o Blockbusterze (Szczęście Pieniędzy Nie Daje). Czasy z lektora, jak w BbShort.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/shorts/bb/vo.gen.ts')
T, add = m.T, m.add
f = 1 / FPS
TAIL = round((m.L[10]['e'] + 0.3) * FPS) / FPS

def pan(a, g=-12):
    add('swoosh-fast', a - 8 * f, g)

# Sala spotkań: oferta i odmowa
add('paper-slide', T(0, 'sprzedać') - 2 * f, -14)
add('ka-ching', T(0, '50'), -13); add('pop-soft', T(0, '50'), -15)
add('stamp', T(1, 'odmówił'), -8); add('impact-soft', T(1, 'odmówił') + 3 * f, -12)
add('whoosh-soft', T(1, 'odmówił') + 2 * f, -16)

# Imperium Blockbustera
pan(T(2))
add('impact-soft', T(2, 'potęgą'), -13); add('magic-shimmer', T(2, 'potęgą'), -18)
add('bloop-morph', T(2, '9') - 4 * f, -12)
for i in range(10):
    add('pop-soft', T(2, '9') + i * 2.4 * f, -21)
add('ding-soft', T(2, '9') + 22 * f, -14)
add('ka-ching', T(2, '6'), -10); add('coins-scatter', T(2, '6') + 3 * f, -15)

# Netflix: poczta i straty
pan(T(3))
add('pop-soft', T(3, 'płyty') - 2 * f, -14)
add('whoosh-soft', T(3, 'pocztą'), -14); add('mail-drop', T(3, 'pocztą') + 16 * f, -10)
add('deflate', T(3, 'straty') - 4 * f, -11)

# Powrót: śmiech szefów
pan(T(4), -11)
add('pencil-scratch', T(4, 'dyrektora') - 2 * f, -20)
add('whoosh-soft', T(4, 'szefowie') - 4 * f, -15)
add('men-laugh', T(4, 'wyśmiali'), -11)
for i in range(3):
    add('pop-soft', T(4, 'wyśmiali') + i * 5 * f, -16)

# Kary za spóźnienie
pan(T(5), -11)
add('cash-drawer', T(5, 'zarabiał'), -12)
add('alert-buzz', T(5, 'nienawidzili'), -14)
add('pop-soft', T(5, 'karach') - 2 * f, -13); add('stamp', T(5, 'karach'), -15)
add('thud-wall', T(5, 'zwrot'), -12)
add('paper-flip', T(6), -16)
add('coins-scatter', T(6, '800') - 4 * f, -12); add('ka-ching', T(6, '800') + 10 * f, -10)

# Bez kar → internet
pan(T(7))
add('stamp', T(7, 'reklamę') - 2 * f, -9); add('ding-soft', T(7, 'reklamę') + 4 * f, -14)
add('bloop-morph', T(7, 'internetu') - 4 * f, -11); add('magic-shimmer', T(7, 'internetu') + 2 * f, -14)

# Bankructwo
pan(T(8))
add('paper-flip', T(8), -15)
add('power-down', T(8, 'zbankrutował') - 6 * f, -11)
add('sign-creak', T(8, 'zbankrutował') - 4 * f, -13)
add('stamp', T(8, 'zbankrutował'), -8); add('impact-soft', T(8, 'zbankrutował') + 4 * f, -12)

# 50 mln → 250 mld
pan(T(9), -11)
add('riser-short', T(9) + 0.1, -15)
add('ka-ching', T(9, '250') + 6 * f, -9); add('impact-soft', T(9, '250') + 6 * f, -12)
add('ding-soft', T(9, '250') + 10 * f, -14)

# Morał i pętla
pan(T(10))
add('alert-buzz', T(10, 'złości'), -16)
add('speed-whoosh', T(10, 'przegrywa') - 4 * f, -13)
add('magic-shimmer', T(10, 'usunie'), -12); add('ding-soft', T(10, 'usunie') + 2 * f, -12)
add('swoosh-fast', TAIL, -12)

m.run('public/bb_vo.wav', 'out/bb_v1.mp4', 'audio/bb_mix.wav', 'out/bb_short_v1.mp4')
