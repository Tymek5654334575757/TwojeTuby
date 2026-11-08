# Efekty do shorta o Nokii (Szczęście Pieniędzy Nie Daje). Czasy z lektora, jak w NokiaShort.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/shorts/nokia/vo.gen.ts')
T, add = m.T, m.add
f = 1 / FPS

# Haczyk: świecący prototyp nad szufladą
add('magic-shimmer', 0.0, -16); add('magic-shimmer', 1.6, -20)
add('touch-tap', T(0, 'dotykowym'), -10)
add('ding-soft', T(0, 'internetem'), -16)
add('paper-flip', T(0, 'trzy'), -15); add('pop-soft', T(0, 'trzy') + 2 * f, -14)
add('whoosh-soft', T(1, 'skasowała') - 2 * f, -14)
add('drawer-slam', T(1, 'skasowała') + 6 * f, -9)
add('stamp', T(1, 'skasowała') + 9 * f, -10); add('impact-soft', T(1, 'skasowała') + 12 * f, -14)

# Rynek 2007
add('swoosh-fast', T(2) - 8 * f, -12)
add('paper-flip', T(2, '2007'), -15)
for i in range(5):
    add('pop-soft', T(2, '2007') + (4 + i * 3) * f, -17)
add('bloop-morph', T(2, '2'), -11); add('bloop-morph', T(2, '2') + 3 * f, -13)
add('retro-beep', T(2, '2') + 10 * f, -17)
add('ding-soft', T(2, 'Nokia'), -12); add('ding-soft', T(2, 'Nokia') + 3 * f, -15)

# 2004: prototyp, szefowie, szuflada
add('swoosh-fast', T(3) - 8 * f, -12)
add('paper-flip', T(3, '2004'), -16)
add('magic-shimmer', T(3, 'prototyp') - 4 * f, -12); add('impact-soft', T(3, 'prototyp'), -13)
add('touch-tap', T(3, 'dotykowy'), -10)
add('ding-soft', T(3, 'internet'), -16)
add('whoosh-soft', T(4) - 2 * f, -16)
add('ka-ching', T(4, 'drogi'), -12)
add('alert-buzz', T(4, 'ryzykowny'), -12)
add('drawer-open', T(5, 'trafił') - 6 * f, -12); add('whoosh-soft', T(5, 'trafił') + 2 * f, -14)
add('drawer-slam', T(5, 'szuflady') + 6 * f, -9); add('lock-click', T(5, 'szuflady') + 9 * f, -11)

# Premiera
add('swoosh-fast', T(6) - 8 * f, -12)
add('paper-flip', T(6), -16)
add('riser-short', T(6, 'Apple') - 0.3, -15)
add('camera-flash', T(6, "iPhone'a"), -11); add('impact-soft', T(6, "iPhone'a") + 4 * f, -12)
add('applause', T(6, "iPhone'a") + 0.1, -16)

# Pogoń
add('swoosh-fast', T(7) - 8 * f, -12)
add('speed-whoosh', T(7, 'pogoń'), -12)
add('footsteps-run', T(7, 'pogoń'), -13)
add('stamp', T(7, 'późno'), -9); add('record-scratch', T(7, 'późno') + 2 * f, -13)

# 2013: wykres i sprzedaż
add('swoosh-fast', T(8) - 8 * f, -12)
add('paper-flip', T(8), -16)
add('pop-soft', T(8, '40%') - 4 * f, -13); add('impact-soft', T(8, '40%') + 8 * f, -15)
add('deflate', T(8, '15') - 2 * f, -11)
add('whoosh-soft', T(8, 'Microsoft') - 4 * f, -14); add('pop-soft', T(8, 'Microsoft') + 8 * f, -15)
add('ka-ching', T(8, '5,5'), -10); add('coins-scatter', T(8, '5,5') + 4 * f, -13)

# Powrót do szuflady i pętla
add('swoosh-fast', T(9) - 10 * f, -11); add('swoosh-fast', T(9) + 2 * f, -14)
add('lock-click', T(9, 'pomysł'), -12); add('magic-shimmer', T(9, 'pomysł') + 4 * f, -13)
add('drawer-open', T(9, 'schowała') - 2 * f, -11)
add('magic-shimmer', T(9, 'szuflady') - 4 * f, -13); add('ding-soft', T(9, 'szuflady') + 8 * f, -13)

m.run('public/nokia_vo.wav', 'out/nokia_v1.mp4', 'audio/nokia_mix.wav', 'out/nokia_short_v1.mp4')
