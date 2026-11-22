# „5 firm, które zaczęły w garażu” (film + 5 shortów): efekty z media/sfx przypięte do słów lektora,
# podkład z sidechainem, master bez dynamicznego loudnorm (stałe wzmocnienie do -15 LUFS + limiter).
# Shorty: te same zdarzenia, czasy przeliczone przez wycięcia KEEP (jak CutShort w gkit.tsx).
# Użycie: python3 tools/mix_garaze.py [film|shorts|all]
import json, re, subprocess, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mix_amber_long import render_part, bed_and_master, dur, TMP

OUT = 'out/garaze'
FPS = 30
CARD = 54 / FPS


def lines(name):
    s = open(f'src/long/garaze/{name}.gen.ts').read()
    return json.loads(re.search(r'LINES: VoLine\[\] = (\[.*\]);', s).group(1))


def norm(t):
    return re.sub(r'[,.?:!]', '', t.lower())


def keep_from(L, cut, tail, end):
    fr = lambda s: round(s * FPS)
    out, a = [], 0
    for i in cut:
        s0 = fr(L[i]['s']) - 4
        e0 = fr(L[i + 1]['s']) - 4 if i + 1 < len(L) else end
        out.append((a, s0))
        a = e0
    out.append((a, fr(L[tail]['s']) - 4 if tail is not None else end))
    return [x for x in out if x[1] - x[0] > 2]


class Part:
    # off = przesunięcie sceny w pliku (plansza); keep = wycięcia shortu (klatki sceny) albo None
    def __init__(self, video, ts, off=0.0, keep=None):
        self.video, self.L, self.off, self.keep, self.ev = video, lines(ts), off, keep, []

    def t(self, li, w=None, nth=0):
        l = self.L[li]
        if not w:
            return round(l['s'] * FPS) / FPS
        hits = [x for x in l['words'] if norm(x['w']).startswith(norm(w))]
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

    def e(self, sfx, li, w=None, g=-10, dt=0.0, nth=0):
        t = self._map(self.t(li, w, nth) + dt)
        if t is not None:
            self.ev.append((sfx, max(0.0, t), g))
        return self

    def at(self, sfx, sec, g=-10):
        self.ev.append((sfx, sec, g))
        return self

    def card(self):
        if self.keep is None:
            self.at('garage-door', 0.45, -10).at('impact-soft', 0.1, -12).at('whoosh-soft', 1.6, -13)
        return self

    def moves(self, lis, g=-14):
        for li in lis:
            self.e('swoosh-fast', li, None, g, -0.4)
        return self


def hak():
    p = Part(f'{OUT}/g0_hak.mp4', 'ga0')
    p.at('riser-short', 0.0, -18)
    for n in ['Disney', 'HP', 'Apple', 'Amazon', 'Google']:
        p.e('pop-soft', 0, n, -12)
    p.e('coins-scatter', 1, 'giganci', -14).e('ka-ching', 1, 'biliony', -10).e('swoosh-fast', 2, None, -14, -0.2)
    p.e('garage-door', 2, 'garażu', -12).e('sign-creak', 3, 'legenda', -10).e('impact-soft', 3, 'legenda', -12)
    p.e('chain-rattle', 4, 'łańcuch', -9).e('drill-whirr', 5, 'wiertarka', -13).e('pen-tap', 5, 'czek', -11).e('whoosh-soft', 5, 'garaż', -12)
    p.e('riser-short', 6, None, -16).e('cardboard-crack', 6, 'mitem', -8)
    return p


def disney(short=False, keep=None):
    p = Part(f'{OUT}/' + ('s1_disney.mp4' if short else 'g1_disney.mp4'), 'ga1', 0 if short else CARD, keep).card()
    p.moves([1, 4, 6, 11, 12, 16, 19, 20])
    p.e('garage-door', 0, 'zaczęło', -11).e('paper-flip', 0, 'animacji', -12).e('sign-creak', 0, 'dolara', -14)
    p.e('paper-flip', 1, '1923', -12).e('train-chug', 2, 'przyjeżdża', -14).e('stamp', 3, 'zbankrutowało', -7)
    p.e('bloop-morph', 4, 'kamerę', -10).e('drawer-open', 5, 'walizce', -12).e('pencil-scratch', 5, 'Alicja', -12)
    p.e('pop-soft', 6, 'wuja', -12).e('pencil-scratch', 7, '5', -12).e('garage-door', 8, 'pracownię', -12)
    p.e('ding-soft', 9, None, -12).e('pencil-scratch', 10, 'dolar', -12).e('whoosh-soft', 11, 'pożyczają', -12).e('ka-ching', 11, '500', -10)
    p.e('whoosh-soft', 13, 'październiku', -12).e('paper-slide', 13, 'zamawia', -11).e('pen-tap', 13, 'Alicji', -12)
    p.e('tv-on', 14, None, -15).e('stamp', 15, '16', -9).e('pencil-scratch', 15, '1923', -14)
    p.e('speed-whoosh', 16, 'wynajmują', -15).e('cash-drawer', 17, '10', -12).e('garage-close', 18, '2', -10).e('paper-flip', 18, '2', -14, 0.3)
    p.e('whoosh-soft', 19, 'oddali', -12).e('ka-ching', 19, '528', -9)
    p.e('paper-flip', 20, None, -13).e('music-flourish', 20, '„Fantazję”', -13).e('chain-rattle', 22, 'inżynierów', -11)
    return p


def hp(short=False, keep=None):
    p = Part(f'{OUT}/' + ('s2_hp.mp4' if short else 'g2_hp.mp4'), 'ga2', 0 if short else CARD, keep).card()
    p.moves([1, 2, 3, 6, 9, 10, 12, 15, 16, 18])
    p.e('impact-soft', 0, 'Kalifornia', -10).e('garage-door', 0, 'Doliny', -11).e('pop-soft', 1, 'Palo', -12).e('paper-flip', 1, '1938', -13)
    p.e('pop-soft', 2, 'Bill', -12).e('pop-soft', 2, 'Dave', -12).e('ding-soft', 2, 'firmę', -12)
    p.e('pop-soft', 3, 'Lucile', -13).e('pop-soft', 3, '367', -12).e('pop-soft', 4, 'garaż', -12).e('click-switch', 5, 'szopie', -10, 0.3).e('snore', 5, 'obok', -14)
    p.e('pen-tap', 6, 'umowę', -11).e('ka-ching', 7, '538', -10).e('coins-scatter', 8, 'gotówce', -15).e('thud-wall', 8, 'wiertarka', -8).e('drill-whirr', 8, 'stołowa', -14)
    p.e('coin-flip', 9, 'monetą', -9, -0.3)
    p.e('tone-sweep', 10, 'generator', -16).e('pop-soft', 11, 'mikrofony', -12).e('pop-soft', 11, 'wzmacniacze', -12).e('pop-soft', 11, 'głośniki', -12)
    p.e('chain-rattle', 12, 'Hollywood', -10).e('music-flourish', 13, '„Fantazji”', -15).e('ka-ching', 13, '8', -11)
    p.e('whoosh-soft', 14, 'studiu', -12).e('riser-short', 15, 'rośnie', -15).e('impact-soft', 15, 'największych', -10)
    p.e('impact-soft', 17, 'stanowym', -12).e('impact-soft', 17, '2007', -11)
    p.e('paper-flip', 18, None, -13).e('typing-keys', 19, 'projektuje', -14).e('boot-beep', 20, 'Steve', -12).e('chain-rattle', 20, 'Steve', -12, 0.5)
    return p


def z():
    p = Part(f'{OUT}/gz.mp4', 'gaz')
    p.e('whoosh-soft', 0, None, -12).e('touch-tap', 1, 'zasubskrybuj', -9, 0.35).e('ding-soft', 1, 'zasubskrybuj', -10, 0.6).e('scribble-erase', 2, '0', -11)
    return p


def apple(short=False, keep=None):
    p = Part(f'{OUT}/' + ('s3_apple.mp4' if short else 'g3_apple.mp4'), 'ga3', 0 if short else CARD, keep).card()
    p.moves([2, 6, 9, 12, 15, 18, 21, 24, 26])
    p.e('sign-creak', 0, 'problem', -11).e('garage-door', 1, None, -11).e('stamp', 1, 'projekt', -6).e('record-scratch', 1, 'projekt', -14)
    p.e('paper-flip', 2, '1975', -13).e('typing-keys', 4, 'Nocami', -15).e('pencil-scratch', 4, 'projektuje', -12).e('ding-soft', 5, 'interes', -10)
    p.e('speed-whoosh', 7, 'volkswagena', -12).e('whoosh-soft', 7, 'kalkulator', -12).e('ka-ching', 8, '1300', -10)
    p.e('pen-tap', 9, 'Apple', -12).e('pen-tap', 9, 'Apple', -12, 0.3).e('pen-tap', 9, 'Apple', -12, 0.6).e('pop-soft', 10, 'Ronald', -12)
    p.e('whoosh-soft', 11, 'wycofuje', -12).e('cash-drawer', 11, '800', -11)
    p.e('car-horn', 12, 'sklep', -18).e('pop-soft', 13, 'Paul', -12).e('paper-flip', 13, '50', -12).e('ka-ching', 13, '500', -10).e('stamp', 14, 'złożone', -8)
    for k, w in enumerate(['666', '666', '666', '666', '666']):
        p.e('pop-soft', 15, w, -13, 0.13 * k)
    p.e('boing', 16, 'cyfry', -12).e('ka-ching', 17, '200', -11)
    p.e('garage-door', 18, 'garaż', -11).e('boot-beep', 20, 'uruchamiają', -12).e('speed-whoosh', 20, 'wiozą', -14).e('cash-drawer', 20, 'gotówką', -11)
    p.e('sign-creak', 21, 'mit', -9).e('impact-soft', 21, 'mit', -10).e('pen-tap', 23, "Mike'a", -12)
    p.e('thud-wall', 25, 'zamówienie', -8).e('whoosh-soft', 25, 'ściany', -12)
    p.e('paper-flip', 26, '18', -13).e('cartoon-fall', 27, 'książki', -12).e('chain-rattle', 27, 'książki', -12, 0.8)
    return p


def amazon(short=False, keep=None):
    p = Part(f'{OUT}/' + ('s4_amazon.mp4' if short else 'g4_amazon.mp4'), 'ga4', 0 if short else CARD, keep).card()
    p.moves([2, 5, 9, 10, 14, 19, 20, 23, 25, 27])
    p.e('bloop-morph', 1, 'Cadabra', -9).e('paper-flip', 2, '1994', -13).e('crowd-murmur', 3, 'Wall', -18)
    p.e('ding-soft', 4, 'pomysł', -9).e('typing-keys', 4, 'internet', -14).e('magic-shimmer', 5, 'starość', -13)
    p.e('pop-soft', 6, 'żałował', -12).e('pop-soft', 7, 'przegrał', -12).e('thud-wall', 8, 'nie', -8, 0.3)
    p.e('speed-whoosh', 9, 'Odchodzi', -14).e('pop-soft', 9, 'Seattle', -11).e('stamp', 10, '5', -8, 0.3)
    p.e('touch-tap', 12, 'prawnik', -12).e('record-scratch', 12, '„cadaver”', -10).e('bloop-morph', 13, 'Amazon', -9)
    p.e('garage-door', 14, None, -11).e('cartoon-fall', 17, 'drzwi', -11).e('thud-wall', 17, 'nogach', -10)
    p.e('whoosh-soft', 19, 'Rodzice', -12).e('ka-ching', 19, '250', -9)
    p.e('paper-flip', 20, '16', -13).e('touch-tap', 20, 'rusza', -9).e('tape-box', 21, 'książka', -12).e('hum-generator', 21, 'myślenia', -18)
    p.e('pop-soft', 22, 'wszystko', -12).e('pop-soft', 22, 'wszystko', -12, 0.2).e('pop-soft', 22, 'wszystko', -12, 0.4)
    p.e('coins-scatter', 23, '50', -16).e('magic-shimmer', 23, '45', -13).e('ka-ching', 24, '20', -10)
    p.e('mail-drop', 25, 'skrzynka', -10).e('mail-drop', 26, 'katalogi', -11).e('mail-drop', 26, 'katalogi', -11, 0.4)
    p.e('paper-flip', 27, '3', -13).e('typing-keys', 28, 'wyszukiwarkę', -14).e('chain-rattle', 29, 'zainwestować', -11)
    return p


def google(short=False, keep=None):
    p = Part(f'{OUT}/' + ('s5_google.mp4' if short else 'g5_google.mp4'), 'ga5', 0 if short else CARD, keep).card()
    p.moves([2, 3, 7, 9, 13, 15, 17, 19, 22])
    p.at('typing-keys', 0.1 if short else CARD + 0.1, -15).e('garage-door', 0, 'garażu', -11).e('cash-drawer', 1, '1700', -11)
    p.e('paper-flip', 2, '1995', -13).e('footsteps-run', 2, 'poznają', -18).e('boot-beep', 3, 'wyszukiwarkę', -13)
    p.e('pencil-scratch', 4, 'strony', -12).e('pop-soft', 5, 'głos', -11).e('pop-soft', 5, 'głos', -11, 0.3).e('impact-soft', 6, 'waży', -10)
    p.e('scribble-erase', 8, 'Google', -11).e('tick-tock', 8, '100', -15).e('bloop-morph', 8, 'błędem', -9)
    p.e('paper-flip', 9, '1998', -13).e('pen-tap', 10, 'czek', -11).e('ka-ching', 10, '100', -10).e('alert-buzz', 11, 'nie', -14)
    p.e('stamp', 12, 'spółkę', -9).e('keys-jingle', 13, 'Susan', -10, 0.4).e('garage-door', 14, None, -12).e('cash-drawer', 14, '1700', -12)
    p.e('boot-beep', 15, 'komputery', -12).e('ping-pong', 15, 'ping-ponga', -11).e('whoosh-soft', 15, 'dywan', -12)
    p.e('chain-rattle', 16, 'Jeff', -11)
    p.e('truck-away', 17, 'Palo', -13).e('paper-flip', 18, 'pół', -11)
    p.e('bloop-morph', 19, None, -11).e('pop-soft', 20, '16', -10).e('pen-tap', 21, 'YouTube', -11)
    p.e('stamp', 22, 'dom', -8, 0.3).e('paper-flip', 23, '2014', -13).e('magic-shimmer', 23, 'szefową', -11)
    return p


def final():
    p = Part(f'{OUT}/g6_final.mp4', 'ga6')
    p.e('whoosh-soft', 0, None, -12)
    for i in range(5):
        p.e('garage-close', 1, 'nie', -14, 0.17 * i)
    p.e('impact-soft', 2, 'klient', -11).e('impact-soft', 2, 'inwestor', -11)
    for li in range(3, 8):
        p.e('pop-soft', li, None, -10, 0.1)
    p.e('sign-creak', 8, 'opowieść', -12).e('chain-rattle', 9, 'uwierzy', -9).e('magic-shimmer', 9, 'uwierzy', -11, 0.2)
    for i in range(5):
        p.e('pop-soft', 10, None, -14, 0.14 * i)
    p.e('whoosh-soft', 12, None, -12)
    return p


PARTS = [('hak', hak), ('d', disney), ('hp', hp), ('z', z), ('a', apple), ('m', amazon), ('o', google), ('fin', final)]


def film():
    parts = [(n, f()) for n, f in PARTS]
    wavs = [render_part(p, 'gar_' + n) for n, p in parts]
    lst = f'{TMP}/gar_concat.txt'
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(p.video)}'\n" for _, p in parts))
    vid = f'{TMP}/gar_film_video.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-map', '0:v', '-c', 'copy', vid], check=True)
    alst = f'{TMP}/gar_concat_a.txt'
    open(alst, 'w').write(''.join(f"file '{w}'\n" for w in wavs))
    mix = f'{TMP}/gar_film_mix.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', alst, '-c', 'pcm_s16le', mix], check=True)
    total = dur(vid)
    # outro (podkład końcowy) od początku ekranu końcowego w części finałowej
    fin_lines = lines('ga6')
    end_from = sum(dur(p.video) for _, p in parts[:-1]) + fin_lines[12]['s']
    bed_and_master(mix, vid, 'out/garaze_film.mp4', total, outro_at=end_from, bed_db=-17)


SHORTS = [('ga1', [14], 20, disney, 's1'), ('ga2', [], 18, hp, 's2'), ('ga3', [23], 26, apple, 's3'), ('ga4', [], 25, amazon, 's4'), ('ga5', [16], None, google, 's5')]


def shorts():
    cta_l = lines('gacta')
    for ts, cut, tail, fn, tag in SHORTS:
        L = lines(ts)
        end = round(L[-1]['e'] * FPS) + 30
        keep = keep_from(L, cut, tail, end)
        p = fn(short=True, keep=keep)
        cta_at = sum(b - a for a, b in keep) / FPS
        p.at('whoosh-soft', cta_at - 0.1, -9).at('garage-door', cta_at + 0.4, -13).at('chain-rattle', cta_at + 0.8, -14).at('ding-soft', cta_at + 1.1, -12)
        w = render_part(p, f'gar_{tag}')
        bed_and_master(w, p.video, f'out/garaze_{tag}_final.mp4', dur(p.video), bed_db=-17)


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('film', 'all'):
        film()
    if what in ('shorts', 'all'):
        shorts()
