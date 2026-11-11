# Efekty do długiego filmu „5 sztuczek polityków”, część 1, wersja 2 (wstęp + zdechły kot). Czasy jak w Sala1.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, FPS

m = Mix('src/long/sztuczki/vo1.gen.ts')
T, add = m.T, m.add
f = 1 / FPS

def pan(a, g=-13):
    add('swoosh-fast', a - 6 * f, g)

# Wstęp
add('crowd-murmur', 0.0, -24)
add('pop-soft', T(0, 'polityk'), -14)
add('pencil-scratch', T(0, 'kłamać') - 10 * f, -15); add('scribble-erase', T(0, 'kłamać') + 2 * f, -12)
pan(T(1, 'głowa') - 14 * f); add('tick-tock', T(1, 'głowa') - 8 * f, -17)
pan(T(2, 'pięć') - 6 * f, -14)
for i in range(5):
    add('pop-soft', T(2, 'pięć') + i * 5 * f, -12); add('click-switch', T(2, 'pięć') + i * 5 * f, -16)
add('pen-tap', T(2, 'ciebie'), -13); add('pen-tap', T(2, 'tych'), -13)
add('pencil-scratch', T(3, 'psycholodzy') - 8 * f, -14); add('ding-soft', T(3, 'psycholodzy') + 6 * f, -16)
add('paper-slide', T(4, 'wiadomościach') - 14 * f, -12)
add('whoosh-soft', T(5) - 2 * f, -13)
add('impact-soft', T(5, 'zdechły'), -9); add('stamp', T(5, 'zdechły'), -12)

# Eksperyment z gorylem
pan(T(6), -11); add('pencil-scratch', T(6) + 6 * f, -15)
add('pencil-scratch', T(6) + 30 * f, -15)
add('tv-on', T(6, 'nagranie') - 6 * f, -15)
add('pencil-scratch', T(7), -14)
for i in range(16):
    add('pop-soft', T(7) + 14 * f + i * 12 * f, -21)
add('impact-soft', T(9, 'goryla') - 8 * f, -14); add('impact-soft', T(9, 'goryla') + 16 * f, -12)
for i in range(6):
    add('thud-wall', T(10, 'bije') + i * 8 * f, -13)
add('whoosh-soft', T(10, 'wychodzi'), -15)
for i in range(5):
    add('pop-soft', T(11, 'połowa') + i * 3 * f, -14)
add('alert-buzz', T(11, 'połowa') + 16 * f, -17)
add('pencil-scratch', T(12), -15)

# Latarka i ciemność
add('pencil-scratch', T(13, 'ślepota') - 2 * f, -14)
add('click-switch', T(14, 'latarka') - 4 * f, -8)
add('power-down', T(15, 'znika') - 4 * f, -12)
add('heartbeat', T(15, 'choć'), -13)
add('whoosh-soft', T(16), -12); add('speed-whoosh', T(16) + 8 * f, -14)
add('pencil-scratch', T(16, 'decyduje') - 6 * f, -15)
add('impact-soft', T(17, 'zdechły'), -11); add('magic-shimmer', T(17, 'zdechły'), -17)
add('pencil-scratch', T(18, 'Boris') - 2 * f, -16)

# Kot na stole
add('cartoon-fall', T(19, 'rzuć'), -16)
add('thud-wall', T(19, 'kota'), -6); add('impact-soft', T(19, 'kota'), -9); add('squish', T(19, 'kota') + 2 * f, -12)
add('crowd-murmur', T(20, 'krzykną'), -12)
for i in range(4):
    add('pop-soft', T(20, 'krzykną') - 2 * f + i * 2 * f, -13)
add('pencil-scratch', T(21, 'nikt'), -16)

# W drugą stronę: 11.09.2001
add('whoosh-soft', T(22), -13); add('pencil-scratch', T(22) + 2 * f, -16)
add('swoosh-fast', T(23, 'dzień') - 6 * f, -13); add('tv-on', T(23, 'dzień') - 4 * f, -11)
add('impact-soft', T(24), -12)
add('paper-slide', T(24, 'doradczyni') - 4 * f, -10)
add('pencil-scratch', T(24, 'bardzo') - 4 * f, -15); add('pencil-scratch', T(24, 'pogrzebać') - 40 * f, -15)

# Afera i ustawa
pan(T(25), -11); add('speed-whoosh', T(25) + 6 * f, -14)
add('pencil-scratch', T(25, 'stworzyć') + 4 * f, -15)
add('impact-soft', T(26, 'afera'), -8); add('alarm-ring', T(26, 'afera'), -18); add('crowd-murmur', T(26, 'afera'), -12)
for w in ('ostra', 'kontrowersyjny', 'awantura'):
    add('pop-soft', T(26, w) - 2 * f, -11); add('bloop-morph', T(26, w) - 2 * f, -15)
add('crowd-murmur', T(27), -15); add('camera-flash', T(27) + 4 * f, -14)
for i in range(7):
    add('pen-tap', T(27) + 8 * f + i * 6 * f, -16)
pan(T(28, 'późnym') - 6 * f, -14)
add('pencil-scratch', T(28, 'ustawa') - 6 * f, -14); add('paper-slide', T(28, 'ustawa'), -13)
add('stamp', T(28, 'ustawa') + 16 * f, -5); add('impact-soft', T(28, 'ustawa') + 16 * f, -11)
add('pencil-scratch', T(29), -15); add('pencil-scratch', T(30), -15)

# Jak to rozpoznać
add('click-switch', T(31), -8); add('magic-shimmer', T(31) + 2 * f, -15)
add('pencil-scratch', T(33) - 4 * f, -13)
add('pencil-scratch', T(34), -13)
add('pen-tap', T(34) + 30 * f, -13); add('ding-soft', T(34) + 40 * f, -11); add('impact-soft', T(34) + 40 * f, -13)

m.run('public/sz1_vo.wav', 'out/sala1_v2.mp4', 'audio/sz1_mix.wav', 'out/sala1_v2_audio.mp4')
