# Efekty do shorta o Belforcie (Szczęście Pieniędzy Nie Daje). Czasy z lektora, jak w BelfortShort.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/shorts/belfort/vo.gen.ts')
T, add = m.T, m.add
f = 1 / FPS
END = round((m.L[13]['e'] + 0.95) * FPS) / FPS - f

def pan(a, g=-12):
    add('swoosh-fast', a, g)

# Pokój 0: balon akcji
add('paper-flip', T(0, 'sprzedawał'), -17); add('whoosh-soft', T(0, 'sprzedawał') + 4 * f, -17)
add('riser-short', T(0, 'napompował') - 4 * f, -19)
for k in range(3):
    add('bloop-morph', T(0, 'napompował') + k * 8 * f, -13)
add('pop-soft', T(0, 'wyprzedawał'), -5); add('impact-soft', T(0, 'wyprzedawał'), -10)
add('drawer-open', T(0, 'wyprzedawał'), -17)
add('coins-scatter', T(0, 'wyprzedawał') + 5 * f, -11); add('ka-ching', T(0, 'wyprzedawał') + 16 * f, -14)
# wjazd w klawiaturę i wyjazd z drugiego telefonu
add('speed-whoosh', T(0, 'wyprzedawał') + 9 * f, -12)
add('whoosh-soft', T(1) - 1 * f, -13)

# Pokój 1: fabryka telefonów
add('sign-creak', T(1, 'Oakmont') - 2 * f, -17); add('thud-wall', T(1, 'Oakmont') + 7 * f, -11)
for k in range(6):
    add('pop-soft', T(1, 'fabryka') - 6 * f + k * 3 * f, -20)
add('impact-soft', T(2, '1000'), -12); add('ka-ching', T(2, '1000') + 20 * f, -12)
add('alarm-ring', T(2, 'dzwoniło'), -17); add('crowd-murmur', T(2, 'dzwoniło'), -21)
for k in range(5):
    add('pop-soft', T(2, 'namawiało') + k * 3 * f, -17)
add('pop-soft', T(2, 'tanie'), -13); add('sign-creak', T(2, 'tanie') + 3 * f, -19)

# Pokój C: mechanizm
pan(T(3) - 10 * f)
add('pencil-scratch', T(3) - 4 * f, -20)
add('riser-short', T(4), -19)
for w in ['Maklerzy', 'zawyżali', 'cenę', 'akcji']:
    add('touch-tap', T(4, w), -13); add('zap-small', T(4, w) + 2 * f, -20)
add('footsteps-run', T(5, 'klienci') - 4 * f, -19)
add('vault-open', T(5, 'firma') - 2 * f, -14)
add('cash-drawer', T(5, 'wyprzedawała'), -14); add('paper-flip', T(5, 'wyprzedawała') + 2 * f, -15)
add('coins-scatter', T(5, 'wyprzedawała') + 6 * f, -14)
add('ka-ching', T(5, 'zyskiem'), -9); add('magic-shimmer', T(5, 'zyskiem'), -17)
add('cartoon-fall', T(5, 'zyskiem') + 8 * f, -14); add('impact-soft', T(5, 'zyskiem') + 19 * f, -10)

# Pokój D: regulatorzy i związek
pan(T(6) - 6 * f)
add('paper-flip', T(6, '1989') - 2 * f, -14); add('pop-soft', T(6, '1989'), -15)
add('whoosh-soft', T(6, 'lupą') - 8 * f, -14); add('magic-shimmer', T(6, 'lupą') + 8 * f, -20)
add('footsteps-run', T(6, 'regulatorów') - 4 * f, -20)
add('paper-flip', T(7, '1996') - 2 * f, -12)
add('whoosh-soft', T(7, 'związek') + 2 * f, -14); add('swoosh-fast', T(7, 'związek') + 8 * f, -18)
for k in range(4):
    add('impact-soft', T(7, 'związek') + 14 * f + k * 3 * f, -19)
add('stamp', T(7, 'wyrzucił'), -8); add('impact-soft', T(7, 'wyrzucił') + 3 * f, -12)
add('cartoon-fall', T(7, 'szeregów'), -12); add('thud-wall', T(7, 'szeregów') + 16 * f, -10)
add('drawer-slam', T(7, 'szeregów') + 20 * f, -17)

# Pokój E: straty
pan(T(8) - 6 * f)
add('coins-scatter', T(8, 'stracili'), -10); add('deflate', T(8, 'stracili') + 4 * f, -14)
add('impact-soft', T(8, '200'), -9); add('power-down', T(8, '200') + 6 * f, -15)

# Pokój F i P: sąd, więzienie, FBI
pan(T(9) - 8 * f)
add('paper-slide', T(9, 'przyznał') - 4 * f, -14); add('pencil-scratch', T(9, 'przyznał') + 4 * f, -17)
add('gavel', T(9, 'winy'), -8); add('stamp', T(9, 'winy'), -11)
pan(T(10) - 16 * f)
add('bars-clank', T(10) + 8 * f, -8)
for k in range(4):
    add('paper-flip', T(10, '22') + k * 5 * f, -19)
add('footsteps-run', T(10, 'współpracował') - 6 * f, -19)
add('paper-slide', T(10, 'FBI') - 4 * f, -14); add('pop-soft', T(10, 'FBI') + 8 * f, -13)
pan(T(11) - 14 * f)
add('gavel', T(11, 'zasądził'), -8)
add('coins-scatter', T(11, 'zwrot') + 2 * f, -10); add('speed-whoosh', T(11, 'zwrot') + 6 * f, -15)
add('ka-ching', T(11, 'zwrot') + 26 * f, -9); add('coins-scatter', T(11, 'zwrot') + 28 * f, -12)
add('applause', T(11, 'zwrot') + 34 * f, -22)

# Mapa całej historii i powrót do telefonu
add('riser-short', T(12) - 6 * f, -15); add('whoosh-soft', T(12), -13)
add('speed-whoosh', T(12, 'nie') - 6 * f, -12)
add('pencil-scratch', T(12, 'rynek'), -13)
for k in range(6):
    add('retro-beep', T(13, 'telefon') + k * 4 * f, -21)
add('magic-shimmer', T(13, 'pewny'), -13); add('ding-soft', T(13, 'głos'), -14)
add('bloop-morph', T(13, 'głos') + 6 * f, -16)
add('whoosh-soft', END - 1.0, -17)

m.run('public/belfort_vo.wav', 'out/belfort_v1.mp4', 'audio/belfort_mix.wav', 'out/belfort_short_v1.mp4')
