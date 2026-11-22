# „5 manipulacji z codziennego życia” (Psychorożek): film + 5 shortów.
# Efekty z media/sfx przypięte do słów lektora (czasy z src/long/manip/*.gen.ts), podkład bed-psy-curious z sidechainem,
# master: stałe wzmocnienie do -15 LUFS + limiter (bez dynamicznego loudnorm). Shorty: czasy przeliczone przez KEEP (CutShort).
# Użycie: python3 tools/mix_manip.py [film|shorts|all]
import json, re, subprocess, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mix_amber_long import render_part, bed_and_master, dur, TMP

OUT = 'out/manip'
FPS = 30
CARD = 48 / FPS
BED = dict(bed='media/music/bed-psy-curious.wav', outro='media/music/bed-psy-outro.wav')


def lines(name):
    s = open(f'src/long/manip/{name}.gen.ts').read()
    return json.loads(re.search(r'LINES: VoLine\[\] = (\[.*\]);', s).group(1))


def norm(t):
    return re.sub(r'[,.?:!]', '', t.lower())


def keep_from(L, cut, end):
    fr = lambda s: round(s * FPS)
    out, a = [], 0
    for i in cut:
        s0 = fr(L[i]['s']) - 4
        e0 = fr(L[i + 1]['s']) - 4 if i + 1 < len(L) else end
        out.append((a, s0))
        a = e0
    out.append((a, end))
    return [x for x in out if x[1] - x[0] > 2]


class Part:
    def __init__(self, video, ts, off=0.0, keep=None):
        self.video, self.L, self.off, self.keep, self.ev = video, lines(ts), off, keep, []

    def t(self, li, w=None, nth=0):
        l = self.L[li]
        if not w:
            return round(l['s'] * FPS) / FPS
        hits = [x for x in l['words'] if norm(x['w']).startswith(norm(w))]
        if not hits[nth:]:
            raise SystemExit(f'brak słowa {w!r} w linii {li}: {l["text"] if "text" in l else ""}')
        return round(hits[nth]['s'] * FPS) / FPS

    def _map(self, sec):
        if self.keep is None:
            return self.off + sec
        f, acc = round(sec * FPS), 0
        for a, b in self.keep:
            if a <= f < b:
                return (acc + f - a) / FPS
            acc += b - a
        return None

    def e(self, sfx, li, w=None, g=-12, dt=0.0, nth=0):
        t = self._map(self.t(li, w, nth) + dt)
        if t is not None:
            self.ev.append((sfx, max(0.0, t), g))
        return self

    def many(self, sfx, li, w, n, step, g=-15, dt=0.0):
        for k in range(n):
            self.e(sfx, li, w, g, dt + k * step)
        return self

    def at(self, sfx, sec, g=-12):
        self.ev.append((sfx, sec, g))
        return self

    def card(self):
        if self.keep is None:
            self.at('pop-soft', 0.1, -12).at('pencil-scratch', 0.25, -15).at('pencil-scratch', 0.6, -15).at('whoosh-soft', 1.45, -12)
        return self

    def room(self, li, g=-13, dt=-0.35):
        return self.e('whoosh-soft', li, None, g, dt)

    def aha(self, q_li, b_li):
        return self.e('bloop-morph', q_li, 'rozpoznać', -11).e('scribble-erase', q_li, 'rozpoznać', -15, 0.1).e('ding-soft', b_li, None, -11).e('magic-shimmer', b_li, None, -16, 0.1)


def p_hak():
    p = Part(f'{OUT}/m0_hak.mp4', 'mp0')
    p.at('riser-short', 0.0, -22)
    p.many('string-pluck', 0, 'pokierować', 3, 0.12, -11)
    p.e('pop-soft', 1, 'sklepie', -13).e('pop-soft', 1, 'ulicy', -13).e('touch-tap', 1, 'telefonie', -12).e('pop-soft', 1, 'telefonie', -15, 0.1)
    p.e('subtle-whoosh-long', 2, 'nawet', -16)
    p.e('pencil-scratch', 3, 'manipulacja', -12, -0.1).e('scribble-erase', 3, 'manipulacja', -13, 0.35)
    p.e('pop-soft', 4, 'uprzejmość', -12).e('pop-soft', 4, 'okazja', -12).e('pop-soft', 4, 'cena', -12)
    p.room(5, -11).many('pop-soft', 5, 'pięć', 5, 0.17, -15, -0.1)
    p.many('pencil-scratch', 6, 'zbadali', 5, 0.13, -17)
    p.e('swoosh-fast', 7, None, -12, -0.2).e('glass-clink', 7, 'butelkę', -12)
    p.e('swoosh-fast', 8, None, -12, -0.2).e('alarm-ring', 8, 'o 7:00', -15)
    p.e('whoosh-soft', 9, None, -15).e('swoosh-fast', 9, 'pytanie', -11, -0.4).e('lock-click', 9, 'rozbraja', -8).e('vault-open', 9, 'rozbraja', -15, 0.1)
    p.many('string-snap', 9, 'pięć', 5, 0.1, -11, -0.2)
    return p


def p_s1(keep=None):
    off = 0.0 if keep else CARD
    p = Part(f'{OUT}/m1.mp4' if not keep else f'{OUT}/s1.mp4', 'mp1', off, keep).card()
    p.e('pencil-scratch', 0, 'próbka', -12).e('pop-soft', 0, 'próbka', -14, 0.3)
    p.e('swoosh-fast', 1, None, -15)
    p.e('whoosh-soft', 2, None, -12, -0.2).e('pencil-scratch', 2, None, -16, 0.1).e('pop-soft', 2, 'spróbować', -14)
    p.e('squish', 3, None, -16, 0.1).e('pencil-scratch', 3, 'dziękujesz', -16).e('rubber-stretch', 3, 'trudno', -10)
    p.e('bloop-morph', 4, 'podpisałeś', -14).e('impact-soft', 4, 'winien', -12).e('string-pluck', 4, 'winien', -9, 0.35)
    p.room(5).e('paper-slide', 5, '1971', -10, -0.3).e('pencil-scratch', 5, '1971', -14, 0.1)
    p.e('pencil-scratch', 6, None, -15, 0.1)
    p.e('footsteps-run', 7, None, -19).e('pop-soft', 7, 'Joe', -13)
    p.e('paper-flip', 8, 'pomocnik', -10).e('ding-soft', 8, 'pomocnik', -15, 0.45)
    p.room(9).e('door-open', 9, 'wychodził', -13, 0.5).e('door-open', 9, 'butelkami', -14, -0.4).e('glass-clink', 9, 'butelkami', -12)
    p.e('pop-soft', 10, None, -14).e('glass-clink', 10, None, -12, 0.6)
    p.e('pencil-scratch', 11, None, -14).e('pop-soft', 11, None, -15, 0.3)
    p.e('paper-rustle', 12, 'losy', -10)
    p.room(13).e('paper-rustle', 13, 'kupowali', -13).many('pop-soft', 13, 'kupowali', 3, 0.3, -16)
    p.e('swoosh-fast', 14, 'zarabiał', -12, -0.3).e('ka-ching', 14, '500%', -10).e('impact-soft', 14, '500%', -13)
    p.room(15).e('pencil-scratch', 15, 'ankiecie', -14)
    p.e('pop-soft', 16, None, -14).e('paper-rustle', 16, 'kupowali', -15)
    p.e('pop-soft', 17, None, -14).e('scribble-erase', 17, 'sympatia', -12)
    p.e('paper-rustle', 18, 'kupowali', -14)
    p.room(19).e('pencil-scratch', 19, None, -14, 0.1)
    p.e('gear-turn', 20, 'uruchamia', -11).e('pop-soft', 20, None, -15, -0.2)
    p.e('pencil-scratch', 21, 'wzajemności', -12, -0.1).e('magic-shimmer', 21, 'wzajemności', -15).e('swoosh-fast', 21, 'wzajemności', -15, 0.5)
    p.e('pop-soft', 22, None, -14).e('pop-soft', 22, 'odwdzięcz', -13)
    p.e('string-pluck', 23, 'działa', -12)
    # [tylko film]
    p.room(24).e('paper-slide', 24, '1976', -10, -0.3).e('mail-drop', 24, 'wysłali', -12).e('swoosh-fast', 24, 'wysłali', -15, 0.5).e('impact-soft', 24, '578', -12)
    p.e('mail-drop', 25, 'odpisała', -11).e('ding-soft', 25, 'odpisała', -15, 0.4)
    p.e('swoosh-fast', 26, None, -14).e('pencil-scratch', 26, None, -15, 0.3)
    p.e('stamp', 27, '2015', -12).e('deflate', 27, '2%', -12)
    p.e('pencil-scratch', 28, 'nieznajomemu', -13, -0.3)
    p.room(29).e('paper-rustle', 29, 'kopercie', -12).e('cartoon-fall', 29, 'długopis', -14).e('pop-soft', 29, 'kalendarzyk', -13)
    p.e('swoosh-fast', 30, 'próbka', -13, -0.2).e('pop-soft', 30, 'próbka', -13)
    # rozpoznanie
    p.room(31).aha(31, 32)
    p.e('pop-soft', 32, 'prezent', -13).e('paper-flip', 32, 'krok', -12).many('pop-soft', 32, 'krok', 3, 0.12, -16, 0.2)
    p.e('swoosh-fast', 33, 'odwzajemniasz', -14, -0.2).e('pop-soft', 33, 'odwzajemniasz', -13, 0.5)
    p.e('pop-soft', 34, 'przyjąć', -14).e('pencil-scratch', 34, 'podziękować', -15).e('footsteps-run', 34, 'nic', -18)
    p.e('pop-soft', 35, None, -13).e('scribble-erase', 35, 'umowy', -11).e('string-down', 35, 'umowy', -9, 0.1)
    return p


def p_s2(keep=None):
    off = 0.0 if keep else CARD
    p = Part(f'{OUT}/m2.mp4' if not keep else f'{OUT}/s2.mp4', 'mp2', off, keep).card()
    p.e('door-slam', 0, 'absurdalnego', -6, 0.13).e('thud-wall', 0, 'absurdalnego', -12, 0.13)
    p.e('door-creak', 1, 'nadchodzi', -12, -0.1).e('pop-soft', 1, 'nadchodzi', -14, 0.2)
    p.e('pop-soft', 2, None, -14).e('pop-soft', 3, None, -13).e('pop-soft', 4, None, -14)
    p.room(5).e('pencil-scratch', 5, None, -14).e('pencil-scratch', 5, '200', -14).e('squish', 5, 'rozsądnie', -14)
    p.e('scribble-erase', 6, 'zaczął', -12).e('stamp', 6, 'odmówił', -9)
    p.room(7).e('paper-slide', 7, '1975', -10, -0.3).e('pencil-scratch', 7, 'zaczepiał', -15).e('pop-soft', 7, 'kampusie', -15)
    p.e('pop-soft', 8, 'małą', -14).many('pop-soft', 8, 'młodzieży', 4, 0.1, -17).e('bus-pass', 8, 'zoo', -9, -0.5)
    p.e('pencil-scratch', 9, '17%', -13, -0.1).e('pop-soft', 9, '17%', -13, 0.3)
    p.room(10).e('bloop-morph', 10, 'ogromną', -12)
    p.e('pop-soft', 11, None, -14).many('paper-flip', 11, 'dwa', 6, 0.15, -15)
    p.e('door-slam', 12, None, -7, 0.07).e('thud-wall', 12, None, -12, 0.07)
    p.e('pop-soft', 13, 'zoo', -13)
    p.e('pencil-scratch', 14, 'połowa', -12).e('ding-soft', 14, 'połowa', -13, 0.3)
    p.e('stamp', 15, 'trzy', -9)
    # [tylko film]
    p.e('swoosh-fast', 16, None, -14).e('pencil-scratch', 18, '25%', -13).e('pencil-scratch', 19, 'porównanie', -15).e('pencil-scratch', 20, 'odmowa', -13)
    p.room(21).e('pencil-scratch', 21, None, -15, 0.1).e('pop-soft', 21, None, -13, 0.2)
    p.e('footsteps-run', 22, 'ustąpił', -16).e('pop-soft', 22, 'ustąpił', -15, 0.4)
    p.e('paper-flip', 23, 'jednego', -12)
    p.e('pop-soft', 24, 'prezent', -13).e('swoosh-fast', 24, 'odwzajemnić', -14)
    p.e('footsteps-run', 25, 'ustępujemy', -16)
    p.e('pencil-scratch', 26, 'kontrast', -12).e('pop-soft', 26, 'dzień', -12).e('ding-soft', 26, 'drobiazg', -14)
    p.room(27).e('pencil-scratch', 27, 'drzwi', -12).e('string-pluck', 27, 'nosem', -9, 0.15)
    p.e('door-slam', 28, 'odmówić', -7, 0.07)
    p.e('door-creak', 29, 'prosisz', -12)
    # [tylko film]
    p.room(30).e('stamp', 30, '2020', -9).e('pencil-scratch', 30, 'działał', -15)
    p.e('coins-scatter', 31, 'zbiórce', -14).e('pop-soft', 31, 'zbiórce', -14).many('paper-slide', 31, 'najdroższego', 3, 0.2, -14, -0.25)
    p.room(32).aha(32, 33)
    p.e('paper-slide', 33, 'drugą', -13).e('scribble-erase', 33, 'pierwsza', -12)
    p.e('swoosh-fast', 34, None, -14)
    p.e('pencil-scratch', 35, 'pożycz', -12).e('ding-soft', 35, 'pożycz', -15, 0.2)
    p.e('pencil-scratch', 36, 'nie', -12).e('string-down', 36, 'zmieniać', -9).e('pop-soft', 36, 'zmieniać', -14)
    return p


def p_z():
    p = Part(f'{OUT}/mz.mp4', 'mpz')
    p.at('pop-soft', 0.05, -12).e('pencil-scratch', 0, None, -15, 0.15)
    p.e('pop-soft', 1, 'zasubskrybuj', -13, -0.2).e('touch-tap', 1, 'zasubskrybuj', -9, 0.4).e('bell-swing', 1, 'zasubskrybuj', -11, 0.55)
    p.e('pop-soft', 2, None, -15)
    p.e('scribble-erase', 3, 'prezentu', -13, -0.2).e('scribble-erase', 3, 'kotwicy', -13, -0.2).e('scribble-erase', 3, 'licznika', -13, -0.2)
    return p


def p_s3(keep=None):
    off = 0.0 if keep else CARD
    p = Part(f'{OUT}/m3.mp4' if not keep else f'{OUT}/s3.mp4', 'mp3', off, keep).card()
    p.e('chain-rattle', 1, 'kotwicą', -9).e('water-plunk', 1, 'kotwicą', -11, 0.55).e('pencil-scratch', 1, 'mózgu', -14)
    p.room(2).e('pencil-scratch', 2, None, -14, 0.1)
    p.e('pop-soft', 3, 'było', -13).e('pencil-scratch', 3, 'teraz', -12, -0.1)
    p.e('piggy-coins', 4, 'oszczędzasz', -10).e('bloop-morph', 4, 'oszczędzasz', -15).e('string-pluck', 4, 'oszczędzasz', -10, 0.25)
    p.e('swoosh-fast', 5, 'skąd', -14).e('pop-soft', 5, 'warta', -12)
    p.e('puff', 6, 'ktoś', -10, 0.2).e('pencil-scratch', 6, 'napisał', -10, -0.1)
    p.room(7).e('paper-slide', 7, '1974', -10, -0.3).e('pencil-scratch', 7, 'liczba', -13)
    p.e('wheel-spin', 8, None, -10, 0.1).e('pencil-scratch', 8, 'od', -15)
    p.e('wheel-spin', 9, None, -11, -0.4).e('ding-soft', 9, '10', -12).e('ding-soft', 9, '65', -12)
    p.room(10).e('pencil-scratch', 10, 'pytanie', -14).e('magic-shimmer', 10, 'afrykańskie', -14)
    p.e('pop-soft', 11, None, -14).e('pop-soft', 12, None, -14)
    p.e('slider-click', 13, '25%', -10).e('pop-soft', 13, None, -15)
    p.e('slider-click', 14, '45%', -10)
    p.e('chain-rattle', 15, None, -11)
    p.e('pencil-scratch', 16, '20', -12).e('impact-soft', 16, '20', -14)
    # [tylko film]
    p.room(17).e('chalk-write', 18, 'oszacować', -12).e('tick-tock', 18, '5', -16).e('chalk-write', 19, '8', -11).e('chalk-write', 20, 'od', -11)
    p.e('chalk-write', 21, '2250', -11).e('chalk-write', 22, '512', -11).e('cartoon-fall', 23, '40', -10, -0.3).e('thud-wall', 23, '40', -8).e('pencil-scratch', 24, 'mniej', -13)
    p.room(25).e('pencil-scratch', 25, 'zakotwiczenia', -12).e('magic-shimmer', 25, 'zakotwiczenia', -15)
    p.e('chain-rattle', 26, None, -12).e('water-plunk', 26, None, -17, 0.2)
    p.e('chain-rattle', 27, 'odsuwasz', -11).e('boing', 27, 'mało', -12)
    # [tylko film]
    p.room(28).e('paper-slide', 28, 'kwotę', -11, -0.3).e('chain-rattle', 29, 'ustawia', -12).e('thud-wall', 29, 'ustawia', -14, 0.3)
    p.room(30).aha(30, 31)
    p.e('swoosh-fast', 31, 'zakryj', -13).e('pop-soft', 31, 'zapłaciłbym', -14)
    p.e('pop-soft', 32, 'sklepie', -14)
    p.e('stamp', 33, '2023', -9).e('pencil-scratch', 33, 'najniższą', -13).e('pop-soft', 33, 'najniższą', -15, 0.2)
    p.e('pencil-scratch', 34, 'porównuj', -13).e('string-down', 34, 'liczbą', -9, -0.1)
    return p


def p_s4(keep=None):
    off = 0.0 if keep else CARD
    p = Part(f'{OUT}/m4.mp4' if not keep else f'{OUT}/s4.mp4', 'mp4', off, keep).card()
    p.e('boing', 1, 'ciastka', -12).many('pop-soft', 1, 'ciastka', 2, 0.13, -14, 0.1)
    p.room(2).e('touch-tap', 2, 'pokój', -14)
    p.e('alert-buzz', 3, 'ostatnie', -15).e('pop-soft', 3, 'ostatnie', -13)
    p.e('pop-soft', 4, None, -14)
    p.e('tick-tock', 5, '9', -12)
    p.e('heartbeat', 6, 'serce', -9).e('string-pluck', 6, 'palec', -9).e('touch-tap', 6, 'przycisku', -10, 0.45).e('ding-soft', 6, 'przycisku', -12, 0.55)
    p.room(7).e('paper-slide', 7, '1975', -10, -0.3).e('pencil-scratch', 7, 'rzadkość', -12)
    p.many('pop-soft', 8, 'studentki', 4, 0.2, -17).e('ding-soft', 8, '134', -14)
    p.e('pop-soft', 9, None, -13).e('slider-click', 9, 'chciałaby', -14).e('slider-click', 9, 'atrakcyjne', -14).e('slider-click', 9, 'kosztować', -14)
    p.e('pop-soft', 10, None, -13)
    p.e('pop-soft', 11, 'identyczne', -13)
    p.e('slider-click', 12, 'wyżej', -11).e('ding-soft', 12, 'wyżej', -14, 0.2)
    p.room(13)
    p.e('door-open', 14, 'wchodził', -12, -0.2).many('pop-soft', 14, 'zabierał', 8, 0.1, -17)
    p.e('pop-soft', 15, 'pomyliłem', -14)
    p.e('pop-soft', 16, None, -14).e('crowd-murmur', 16, 'zjedli', -19)
    p.e('pencil-scratch', 17, None, -14).e('magic-shimmer', 17, 'inni', -12).e('pop-soft', 17, 'inni', -14)
    p.room(18).e('pencil-scratch', 18, 'niedoboru', -12, -0.1)
    p.e('magic-shimmer', 19, 'cenniejsze', -12).e('pencil-scratch', 19, 'mało', -15)
    p.e('swoosh-fast', 20, 'konkurujemy', -12, -0.2).e('swoosh-fast', 20, 'konkurujemy', -14, 0.1)
    # [tylko film]
    p.room(21).e('pop-soft', 21, None, -13).e('tick-tock', 22, 'licznik', -12).e('pop-soft', 23, 'seria', -13).e('pencil-scratch', 23, 'niczym', -14)
    p.room(24).aha(24, 25)
    p.many('pop-soft', 25, 'zawsze', 8, 0.08, -17, -0.1)
    p.e('pencil-scratch', 26, 'kupuj', -12)
    p.e('pencil-scratch', 27, 'nie', -12)
    p.e('pop-soft', 28, 'smakowały', -13)
    p.e('string-down', 29, 'liczba', -9)
    return p


def p_s5(keep=None):
    off = 0.0 if keep else CARD
    p = Part(f'{OUT}/m5.mp4' if not keep else f'{OUT}/s5.mp4', 'mp5', off, keep).card()
    p.e('balloon-inflate', 0, 'podnieść', -10)
    p.e('stamp', 1, 'usłyszysz', -7, 0.33)
    p.room(2).e('pencil-scratch', 2, None, -15, 0.1)
    p.e('pop-soft', 3, 'cena', -13).e('pop-soft', 3, 'uścisk', -12).e('magic-shimmer', 3, 'kolor', -15).e('pop-soft', 3, 'kolor', -14, 0.2)
    p.e('footsteps-run', 4, 'idzie', -17).e('door-open', 4, 'kierownika', -13).e('door-open', 4, 'wraca', -14, -0.3).e('pop-soft', 4, 'kierownik', -14, 0.0, 1)
    p.e('cash-drawer', 5, '3000', -10)
    p.e('dream-chord', 6, 'widzisz', -10).e('string-pluck', 6, 'samochodzie', -9)
    p.room(7).e('paper-slide', 7, '1978', -10, -0.3)
    p.e('phone-ring', 8, 'dzwonił', -10).e('pop-soft', 8, 'zapraszał', -14)
    p.e('tick-tock', 9, 'o 7:00', -13).e('pop-soft', 9, 'o 7:00', -14)
    p.e('pencil-scratch', 10, '31%', -13)
    p.room(11).e('stamp', 11, 'udział', -9)
    p.e('spring-pop', 12, 'o 7:00', -8)
    p.e('door-creak', 13, 'wycofać', -12)
    p.e('crickets', 14, None, -12)
    p.e('pencil-scratch', 15, None, -15).e('pencil-scratch', 15, '56%', -12).e('ding-soft', 15, '56%', -14, 0.3)
    p.room(16).e('sunrise-chime', 16, 'poranek', -11).e('alarm-ring', 16, 'poranek', -17, 0.3)
    p.e('footsteps-run', 17, None, -19).e('pop-soft', 17, '24%', -12)
    p.e('pop-soft', 18, '53%', -12)
    p.e('stamp', 19, 'dwa', -9)
    p.room(20).e('swoosh-fast', 20, 'niska', -13).e('pencil-scratch', 20, 'piłka', -12).e('pop-soft', 20, 'piłka', -14, 0.3)
    p.e('pop-soft', 21, 'dobre', -14)
    p.e('bowling-thud', 22, 'gorsze', -7)
    p.e('pop-soft', 23, 'konsekwentni', -12).e('pencil-scratch', 23, 'konsekwentni', -15, 0.2)
    p.many('pop-soft', 24, 'powodów', 3, 0.12, -15)
    # [tylko film]
    p.room(25).e('pop-soft', 25, 'bilet', -13).e('paper-slide', 25, 'serwisowa', -12).e('paper-slide', 25, 'bagaż', -12).e('paper-slide', 25, 'miejsca', -12).e('ka-ching', 25, 'miejsca', -15, 0.3)
    p.e('pencil-scratch', 26, 'decyzji', -13)
    p.room(27).aha(27, 28)
    p.e('pop-soft', 28, 'zapytaj', -13).e('scribble-erase', 28, 'pierwsza', -11)
    p.e('bowling-thud', 29, 'wycofać', -12).e('door-creak', 29, 'wycofać', -14, 0.3).e('footsteps-run', 29, 'wycofać', -18, 0.3)
    p.e('string-down', 30, 'innej', -9).e('pop-soft', 30, 'innej', -14)
    return p


def p_fin():
    p = Part(f'{OUT}/m6_final.mp4', 'mp6')
    p.many('pop-soft', 0, None, 5, 0.17, -16, 0.2).e('pencil-scratch', 0, 'wzór', -13)
    for li in range(1, 6):
        p.e('ding-soft', li, None, -15).e('pop-soft', li, None, -16, 0.1)
    p.room(6).e('electric-zap', 6, 'działa', -10).e('bloop-morph', 6, 'pomyśleć', -14)
    p.room(7).e('pencil-scratch', 7, 'czy', -12).e('pencil-scratch', 7, 'gdyby', -13)
    for w in ['prezentu', 'wcześniejszej', 'przekreślonej', 'licznika', 'zmiany']:
        p.e('string-snap', 8, w, -9)
    p.e('ding-soft', 9, 'twoja', -11).e('magic-shimmer', 9, 'twoja', -14).e('footsteps-run', 9, None, -19, 0.2)
    p.e('string-pluck', 10, 'czyjaś', -11, -0.2)
    p.room(11).many('pop-soft', 11, None, 5, 0.13, -15, 0.1)
    p.e('pop-soft', 12, None, -12)
    p.room(13, -12)
    return p


PARTS = [('hak', p_hak), ('s1', p_s1), ('s2', p_s2), ('z', p_z), ('s3', p_s3), ('s4', p_s4), ('s5', p_s5), ('fin', p_fin)]


def film(dry=False):
    parts = [(n, f()) for n, f in PARTS]
    if dry:
        for n, p in parts:
            print(n, len(p.ev), 'efektów; brak plików:', [e for e in p.ev if not os.path.exists(f'media/sfx/{e[0]}.wav')])
        return
    wavs = [render_part(p, 'man_' + n) for n, p in parts]
    lst = f'{TMP}/man_concat.txt'
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(p.video)}'\n" for _, p in parts))
    vid = f'{TMP}/man_film_video.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-map', '0:v', '-c', 'copy', vid], check=True)
    alst = f'{TMP}/man_concat_a.txt'
    open(alst, 'w').write(''.join(f"file '{w}'\n" for w in wavs))
    mix = f'{TMP}/man_film_mix.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', alst, '-c', 'pcm_s16le', mix], check=True)
    total = dur(vid)
    end_from = sum(dur(p.video) for _, p in parts[:-1]) + lines('mp6')[13]['s']
    bed_and_master(mix, vid, 'out/manip_film.mp4', total, outro_at=end_from, bed_db=-19, **BED)


SHORTS = [('mp1', [24, 25, 26, 27, 28, 29, 30], p_s1, 's1'), ('mp2', [16, 17, 18, 19, 20, 30, 31], p_s2, 's2'), ('mp3', [17, 18, 19, 20, 21, 22, 23, 24, 28, 29], p_s3, 's3'), ('mp4', [21, 22, 23], p_s4, 's4'), ('mp5', [25, 26], p_s5, 's5')]


def shorts(dry=False):
    for ts, cut, fn, tag in SHORTS:
        L = lines(ts)
        end = round((L[-1]['e'] + 1.0) * FPS)
        keep = keep_from(L, cut, end)
        p = fn(keep=keep)
        cta = sum(b - a for a, b in keep) / FPS
        p.at('whoosh-soft', cta - 0.1, -10)
        for k in range(5):
            p.at('pop-soft', cta + (4 + k * 3) / FPS, -15)
        p.at('pencil-scratch', cta + 2.0, -13).at('touch-tap', cta + 2.6, -12)
        if dry:
            print(tag, len(p.ev), 'efektów, długość sceny', round(cta, 1), 's')
            continue
        w = render_part(p, f'man_{tag}')
        bed_and_master(w, p.video, f'out/manip_{tag}_final.mp4', dur(p.video), bed_db=-19, **BED)


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    dry = '--dry' in sys.argv
    if what in ('film', 'all'):
        film(dry)
    if what in ('shorts', 'all'):
        shorts(dry)
