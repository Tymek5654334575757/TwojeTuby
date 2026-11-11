# Efekty do długiego filmu „5 sztuczek polityków”, część 1 (wstęp + zdechły kot). Czasy jak w Sala1.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/long/sztuczki/vo1.gen.ts')
T, add = m.T, m.add
f = 1 / FPS
YELLOW = [0.5, 1.5, 2.4, 3.5, 4.3, 5.3, 6.5, 7.4, 8.4, 9.5, 10.4]
BLUE = [0.8, 2.1, 3.2, 4.6, 5.8, 7.1, 8.2, 9.6, 10.9]

def pan(a, g=-13):
    add('swoosh-fast', a - 6 * f, g)

# Wstęp
for i in range(5):
    add('click-switch', T(0, 'pięć') + i * 4 * f, -12)
add('impact-soft', T(0, 'pięć'), -14)
for i in range(4):
    add('pen-tap', T(1, 'większość') + i * 4 * f, -14)
add('whoosh-soft', T(2, 'stuleci') - 12 * f, -14); add('pencil-scratch', T(2, 'stuleci') - 6 * f, -15)
add('crowd-murmur', T(2, 'politycy'), -22)
add('pop-soft', T(2, 'politycy'), -14); add('pop-soft', T(2, 'wszystkich'), -14)
add('pop-soft', T(2, 'wszystkich') + 7 * f, -16); add('pop-soft', T(2, 'wszystkich') + 14 * f, -16)
add('pencil-scratch', T(3, 'kłamstwa') - 8 * f, -16); add('scribble-erase', T(3, 'kłamstwa'), -14)
pan(T(4, 'głowa') - 6 * f); add('tick-tock', T(4, 'głowa'), -18)
pan(T(5, 'złota') - 6 * f); add('bloop-morph', T(5, 'złota') - 4 * f, -12)
add('impact-soft', T(5, 'trzy'), -13); add('ding-soft', T(5, 'trzy'), -15)
add('pen-tap', T(6), -14)
add('pencil-scratch', T(7), -15)
add('pop-soft', T(8, 'pierwszą'), -12); add('ding-soft', T(9, 'dwie'), -16); add('pop-soft', T(10, 'co'), -14)

# Test uwagi
pan(T(11, 'testu'), -11); add('pencil-scratch', T(11, 'testu') + 4 * f, -15)
add('pop-soft', T(12, 'żółtą'), -11); add('pop-soft', T(12, 'niebieską'), -11)
add('pencil-scratch', T(13), -16)
t0 = T(15) + 12 * f
add('retro-beep', T(15), -14)
for h in YELLOW + BLUE:
    add('pop-soft', t0 + h, -13)
add('tick-tock', t0 + 0.2, -24); add('tick-tock', t0 + 4.2, -24); add('tick-tock', t0 + 8.2, -24)
add('retro-beep', T(16), -13); add('impact-soft', T(16), -13)
add('ding-soft', T(17, 'jedenaście'), -11); add('impact-soft', T(17, 'jedenaście'), -13)
add('record-scratch', T(19, 'jednorożca'), -10); add('speed-whoosh', T(19, 'jednorożca') + 6 * f, -13)
add('pencil-scratch', T(20), -13); pan(T(20) - 2 * f, -14)
add('boing', T(21, 'pomachał'), -15)
add('record-scratch', T(22), -17)

# Goryl
add('scribble-erase', T(23) - 2 * f, -13); pan(T(23) - 4 * f, -14)
add('pencil-scratch', T(23) + 4 * f, -14)
add('pencil-scratch', T(24), -14)
for i in range(8):
    add('pop-soft', T(24, 'podania') + i * 12 * f, -20)
add('impact-soft', T(25, 'goryla') - 10 * f, -15); add('impact-soft', T(25, 'goryla') + 14 * f, -12)
for i in range(7):
    add('thud-wall', T(25, 'bił') + i * 8 * f, -14)
for i in range(5):
    add('pop-soft', T(26, 'połowa') + i * 3 * f, -15)
add('alert-buzz', T(26, 'połowa') + 16 * f, -17)
add('pencil-scratch', T(27), -16)

# Latarka i ciemność
add('pencil-scratch', T(28, 'ślepotą') - 2 * f, -14)
add('click-switch', T(29, 'latarka') - 4 * f, -8)
add('power-down', T(30, 'znika') - 4 * f, -12)
add('heartbeat', T(30, 'choć'), -14)
add('whoosh-soft', T(31), -12); add('speed-whoosh', T(31) + 8 * f, -14)
add('pencil-scratch', T(31, 'decyduje') - 6 * f, -15)
add('impact-soft', T(32, 'zdechły'), -11); add('magic-shimmer', T(32, 'zdechły'), -17)
add('pencil-scratch', T(33, 'Boris') - 2 * f, -16)

# Kot na stole
add('cartoon-fall', T(34, 'rzuć'), -16)
add('thud-wall', T(34, 'kota'), -6); add('impact-soft', T(34, 'kota'), -9); add('squish', T(34, 'kota') + 2 * f, -12)
add('crowd-murmur', T(35, 'krzykną'), -12)
for i in range(4):
    add('pop-soft', T(35, 'krzykną') - 2 * f + i * 2 * f, -13)
add('pencil-scratch', T(35, 'nikt'), -16)
add('click-switch', T(36), -10); add('scribble-erase', T(36) + 2 * f, -13); add('bloop-morph', T(36) + 10 * f, -12)
add('pencil-scratch', T(37) + 20 * f, -15)
add('paper-flip', T(37, 'wczoraj') - 2 * f, -11); add('ding-soft', T(37, 'wczoraj') + 6 * f, -12)
add('pen-tap', T(37, 'wczoraj') + 4 * f, -14)
add('whoosh-soft', T(38, 'złota') - 8 * f, -15); add('bloop-morph', T(38, 'złota') + 20 * f, -17)
add('pop-soft', T(39) - 4 * f, -12); add('ding-soft', T(39), -14)
add('retro-beep', T(40), -18); add('pop-soft', T(41), -12)

m.run('public/sz1_vo.wav', 'out/sala1_v1.mp4', 'audio/sz1_mix.wav', 'out/sala1_v1_audio.mp4')
