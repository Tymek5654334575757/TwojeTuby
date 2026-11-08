# Efekty do shorta „Błąd planowania” (Psychorożek). Czasy z lektora, jak w PlanShort.tsx.
import sys
sys.path.insert(0, 'tools')
from sfxmix import Mix, EASE, FPS

m = Mix('src/shorts/plan/vo.gen.ts')
T, add = m.T, m.add
f = 1 / FPS
END = m.L[13]['e'] + 0.4
TAIL = round(END * FPS) / FPS

# Haczyk: dzwoniący budzik, bieg, tykanie
for t in (0.0, 1.45, 2.9):
    add('alarm-ring', t, -19)
add('footsteps-run', 0.0, -21); add('footsteps-run', 2.0, -22)
add('tick-tock', 0.2, -24)
add('paper-slide', T(0, 'planujesz') - 2 * f, -15)
for i in range(3):
    add('pen-tap', T(0, 'lepiej') + i * 3 * f, -15)
add('impact-soft', T(0, 'spóźniasz'), -15)

# Przemiana budzika w plakietkę 1994
add('bloop-morph', T(1) - 4 * f, -11); add('swoosh-fast', T(1) - 4 * f, -16)
add('pencil-scratch', T(1, '1994') - 2 * f, -14)
add('pencil-scratch', T(1, 'psycholodzy') - 2 * f, -15); add('pen-tap', T(1, 'zapytali'), -15)
for i in range(3):
    add('pop-soft', T(1, 'studentów') + i * 4 * f, -15)
add('paper-flip', T(1, 'pracy') - 4 * f, -14)
add('boing', T(1, 'ile') - 2 * f, -15)

# Oś dni i flagi
add('pencil-scratch', T(2) - 8 * f, -13)
for i in range(7):
    add('pop-soft', T(2) - 6 * f + i * 2 * f, -23)
add('impact-soft', T(2, '34'), -12); add('ding-soft', T(2, '34') + 2 * f, -15)
add('thunder', T(3, 'najgorzej') - 2 * f, -14)
for k in range(5):
    add('rain-light', T(3, 'najgorzej') + 8 * f + k * 2.0, -23)
add('impact-soft', T(4), -12); add('stamp', T(4) + 2 * f, -17)

# Marsz do 55: kroki, przewracane flagi, uderzenie
ws, we = T(5) + 2 * f, T(6, '55') + 1 * f
add('footsteps-run', ws, -15); add('footsteps-run', ws + 1.6, -16)
x0, x1 = 90, 90 + 55 * 13
for d in (34, 49):
    fx = 90 + d * 13
    # chwila, gdy bohater mija flagę (hx ≥ fx - 10)
    for k in range(400):
        p = k / 400
        if x0 + (x1 - x0) * EASE(p) >= fx - 10:
            add('cartoon-fall', ws + p * (we - ws), -15)
            break
add('riser-short', T(6, '55') - 1.5, -18)
add('impact-soft', T(6, '55'), -9); add('record-scratch', T(6, '55') + 0.05, -16)
add('swoosh-fast', T(7), -16); add('pencil-scratch', T(7) + 4 * f, -15)
add('thunder', T(7, 'najczarniejszym'), -11)

# Co trzeci zdążył
for i in range(3):
    add('pop-soft', T(8) + i * 4 * f, -15)
add('ding-soft', T(8, 'trzeci'), -11); add('pen-tap', T(8, 'trzeci') + 2 * f, -15)

# Druga sala: błąd planowania
add('swoosh-fast', T(9) - 8 * f, -12)
add('impact-soft', T(9, 'błąd'), -11); add('pencil-scratch', T(9) + 4 * f, -16)
add('bloop-morph', T(10, 'głowie'), -14)
for i in range(3):
    add('click-switch', T(10, 'film') + i * 2 * f, -19)
add('whoosh-soft', T(10, 'gładko') - 6 * f, -13); add('ding-soft', T(10, 'gładko') + 4 * f, -17)
add('pencil-scratch', T(11), -18)
add('car-horn', T(11, 'korków'), -12)
add('scribble-erase', T(11, 'poprawek'), -14)
add('snore', T(11, 'życia'), -12)

# Powrót do osi: skreślenie planu, nowy plan
add('swoosh-fast', T(12) - 4 * f, -12)
add('scribble-erase', T(12, 'pytaj'), -12)
add('pencil-scratch', T(13), -14)
add('ding-soft', T(13, 'ostatnim'), -10); add('impact-soft', T(13, 'ostatnim') + 2 * f, -13)
add('pen-tap', T(13, 'ostatnim') + 10 * f, -15)

# Pętla: plakietka wraca w budzik
add('bloop-morph', TAIL, -12); add('alarm-ring', TAIL + 0.35, -20)

m.run('public/plan_vo.wav', 'out/plan_v1.mp4', 'audio/plan_mix.wav', 'out/plan_short_v1.mp4')
