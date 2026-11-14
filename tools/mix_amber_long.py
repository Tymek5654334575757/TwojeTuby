# Amber Gold (długi film + 4 shorty): efekty dźwiękowe z biblioteki media/sfx przypięte do słów lektora,
# cichy podkład (media/music), sklejenie części i normalizacja głośności.
# Użycie: python3 tools/mix_amber_long.py [film|shorts|all]
import json, re, subprocess, sys, os

OUT = 'out'
TMP = '/tmp/claude-0/-home-claude/e80e5b11-e838-51dd-a997-c0fc1fb8d8ba/scratchpad/mix'
os.makedirs(TMP, exist_ok=True)
FPS = 30


def lines(name):
    s = open(f'src/long/amber/{name}.gen.ts').read()
    return json.loads(re.search(r'LINES: VoLine\[\] = (\[.*\]);', s).group(1))


def norm(t):
    return re.sub(r'[,.?:!]', '', t.lower())


class Part:
    def __init__(self, video, ts, offset):
        self.video, self.L, self.off, self.ev = video, lines(ts), offset, []

    def t(self, li, w=None, nth=0):
        l = self.L[li]
        if not w:
            return round(l['s'] * FPS) / FPS
        hits = [x for x in l['words'] if norm(x['w']).startswith(norm(w))]
        return round(hits[nth]['s'] * FPS) / FPS

    def e(self, sfx, li, w=None, g=-10, dt=0.0, nth=0):
        self.ev.append((sfx, self.off + self.t(li, w, nth) + dt, g))
        return self

    def at(self, sfx, sec, g=-10):
        self.ev.append((sfx, sec, g))
        return self

    def card(self):
        return self.at('impact-soft', 0.05, -9).at('whoosh-soft', 1.75, -12)

    def moves(self, lis, g=-13):
        # przejazd kamery między pokojami (ok. 12 klatek przed linią)
        for li in lis:
            self.e('swoosh-fast', li, None, g, -0.4)
        return self


def hak():
    p = Part(f'{OUT}/amber_00_hak.mp4', 'am0', 0)
    p.at('riser-short', 0.0, -16)
    p.e('crowd-murmur', 0, 'ponad', -16).e('vault-open', 0, 'skarbcu', -11).e('ka-ching', 1, '851', -9)
    p.e('impact-soft', 2, '1%', -7).e('swoosh-fast', 3, None, -13, -0.3).e('plane-takeoff', 3, 'samoloty', -12)
    p.e('pop-soft', 3, 'biura', -13).e('coins-scatter', 3, 'wypłaty', -13).e('coins-scatter', 3, 'kolejnych', -12)
    p.e('swoosh-fast', 4, None, -13, -0.3).e('hum-generator', 4, 'maszyna', -16).e('tick-tock', 5, 'trzy', -14)
    p.e('click-switch', 5, 'zatrzymał', -11).e('alert-buzz', 5, 'ostrzeżenie', -14)
    p.e('swoosh-fast', 6, None, -13, -0.3).e('coins-scatter', 6, 'wróciło', -14).e('gavel', 6, 'sąd', -9)
    p.e('swoosh-fast', 7, None, -13, -0.3).e('impact-soft', 7, 'dziś', -8).e('magic-shimmer', 8, 'opakowanie', -12)
    return p


def r1():
    p = Part(f'{OUT}/amber_01_obietnica.mp4', 'am1', 2.0).card()
    p.e('sign-creak', 0, 'gdańsk', -15).e('pop-soft', 0, '2009', -12).e('thud-wall', 1, 'kryzysu', -12)
    p.e('scribble-erase', 2, 'bankom', -13).e('riser-short', 2, 'drożeje', -15).e('ka-ching', 3, '1900', -10)
    p.e('magic-shimmer', 4, 'bogatszy', -13).e('swoosh-fast', 5, None, -13, -0.3).e('drawer-slam', 5, 'powstaje', -12)
    p.e('pop-soft', 6, 'oferta', -12).e('coins-scatter', 7, 'pieniądze', -14).e('vault-open', 7, 'skarbcu', -14)
    p.e('ka-ching', 7, 'odsetki', -12).e('pop-soft', 8, 'ile', -10).e('pop-soft', 9, '16', -9)
    p.e('stamp', 10, 'gwarantowane', -8).e('pop-soft', 11, 'banki', -12)
    p.e('swoosh-fast', 12, None, -13, -0.3).e('paper-slide', 12, 'mennicach', -13).e('paper-flip', 13, 'regulaminie', -12)
    p.e('vault-open', 14, 'skarbcu', -13).e('swoosh-fast', 15, None, -13, -0.3).e('rain-light', 17, 'gwarancjami', -18)
    p.e('scribble-erase', 16, 'bankiem', -11).e('pop-soft', 18, '100', -11).e('thud-wall', 19, 'gwarantuje', -10)
    p.e('swoosh-fast', 21, None, -13, -0.3).e('bloop-morph', 22, 'certyfikat', -10).e('paper-flip', 23, 'kartkę', -12)
    p.e('swoosh-fast', 24, None, -13, -0.3).e('ka-ching', 25, 'odsetki', -13).e('pop-soft', 26, 'rośnie', -12)
    p.e('plane-takeoff', 26, 'linie', -11).e('heartbeat', 27, 'kto', -10)
    return p


def r2(off=2.0, short=False):
    p = Part(f'{OUT}/amber_02_ostrzezenie.mp4', 'am2', off)
    if not short:
        p.card()
    p.e('ka-ching', 0, '851', -11).e('impact-soft', 0, 'skazany', -8).e('pop-soft', 1, 'marcin', -12)
    p.e('paper-flip', 1, '2005', -13).e('gavel', 1, 'kilka', -10).e('gavel', 1, 'kilka', -11, 0.47).e('gavel', 1, 'wyroki', -10, 0.47)
    p.e('sign-creak', 2, 'zawieszeniu', -11).moves([3, 5, 8, 9, 10])
    p.e('pop-soft', 3, '2009', -12).e('pencil-scratch', 3, 'wpisała', -10).e('alarm-ring', 3, 'ostrzeżeń', -17)
    p.e('pop-soft', 4, 'bankową', -12).e('scribble-erase', 4, 'bez', -11, 0.2)
    p.e('swoosh-fast', 5, 'zawiadomiła', -12).e('stamp', 6, 'umarzano', -7).e('mail-drop', 7, None, -13, 0.1)
    p.e('swoosh-fast', 7, 'wniosek', -12).e('gavel', 7, 'sąd', -9).e('stamp', 7, 'prowadzić', -8)
    p.e('pop-soft', 8, 'sprawozdań', -11).e('lock-click', 9, None, -11, 0.2).e('retro-beep', 9, 'pieniędzy', -13).e('retro-beep', 9, 'złota', -13)
    p.e('alert-buzz', 10, 'publiczne', -15).e('pen-tap', 11, 'sprawdzić', -12).e('pop-soft', 12, 'kto', -11)
    p.e('ka-ching', 12, 'płaci', -13).e('coins-scatter', 12, 'grosza', -14).e('swoosh-fast', 13, None, -12, -0.1)
    p.e('coins-scatter', 13, 'płacił', -12).e('heartbeat', 14, 'najgroźniejsze', -8)
    return p


def z():
    p = Part(f'{OUT}/amber_02z_zacheta.mp4', 'am2z', 0)
    p.at('whoosh-soft', 0.0, -10).e('pop-soft', 0, 'historie', -12).e('ka-ching', 0, 'liczbami', -14).e('gavel', 0, 'wyrokami', -11, 0.13)
    p.e('touch-tap', 0, 'zasubskrybuj', -8, 0.47).e('ding-soft', 0, 'zasubskrybuj', -10, 0.5).e('pop-soft', 1, 'co', -12).e('drawer-open', 1, 'rozbieramy', -12)
    return p


def r3(off=2.0, short=False):
    p = Part(f'{OUT}/amber_03_piramida.mp4', 'am3', off)
    if not short:
        p.card()
    p.e('coins-scatter', 0, None, -15).e('ka-ching', 0, '851', -9).e('pop-soft', 0, 'lokaty', -12)
    p.e('bloop-morph', 1, '10', -10).e('impact-soft', 2, None, -7).e('pop-soft', 3, 'reszta', -9)
    p.e('ding-soft', 4, 'moneta', -12).e('swoosh-fast', 5, 'toczy', -10).e('whoosh-soft', 6, None, -12)
    p.e('ka-ching', 6, '290', -11).e('coins-scatter', 6, 'odsetki', -13).e('scribble-erase', 7, 'zysk', -11).e('crowd-murmur', 8, 'kolejnych', -16)
    p.e('swoosh-fast', 9, None, -13, -0.5).e('ka-ching', 9, '140', -12).e('pop-soft', 9, 'oddziały', -11).e('car-horn', 9, 'samochody', -16).e('alarm-ring', 9, 'telefony', -19)
    p.e('swoosh-fast', 10, None, -13, -0.5).e('ka-ching', 10, None, -12, 0.1).e('drawer-open', 10, 'nieruchomości', -14).e('paper-flip', 10, '300', -12).e('paper-flip', 10, 'miesięcznie', -13)
    p.e('swoosh-fast', 11, None, -13, -0.5).e('paper-slide', 11, 'audytu', -12).e('thud-wall', 11, 'wypłaciło', -9, 0.4).e('ka-ching', 11, '19', -11)
    p.e('swoosh-fast', 12, None, -13, -0.5).e('coins-scatter', 12, 'największa', -11).e('impact-soft', 12, '300', -8).e('plane-takeoff', 12, 'odleciała', -8)
    p.e('swoosh-fast', 14, None, -12, -0.4).e('magic-shimmer', 14, None, -14, 0.2).e('sign-creak', 14, 'chwytem', -10).e('impact-soft', 14, 'reklamowym', -9)
    return p


def k():
    p = Part(f'{OUT}/amber_03b_piecolatek.mp4', 'am3b', 2.0).card()
    p.e('boing', 0, 'skarbonkę', -12).e('pop-soft', 0, 'zrobi', -12).e('footsteps-run', 1, None, -18).e('coins-scatter', 1, 'wkłada', -14, 0.4)
    p.e('pop-soft', 2, 'nic', -12).e('paper-flip', 2, 'rok', -13).e('bloop-morph', 3, None, -11).e('footsteps-run', 4, None, -18)
    p.e('ding-soft', 4, 'bartka', -11, 0.5).e('ding-soft', 5, 'celiny', -11, 0.4).e('crowd-murmur', 6, 'nowi', -17).e('ding-soft', 6, 'dostają', -12)
    p.e('swoosh-fast', 7, None, -12, -0.1).e('pop-soft', 7, 'opowiada', -13).e('pop-soft', 7, 'znajomym', -13).e('deflate', 8, 'mniej', -13)
    p.e('alert-buzz', 8, 'kilka', -17).e('heartbeat', 9, None, -11).e('thud-wall', 9, 'środku', -6).e('record-scratch', 9, 'nic', -14)
    p.e('impact-soft', 10, 'uznał', -9).e('gavel', 11, 'skazany', -7).e('stamp', 11, 'piramidy', -10)
    p.e('paper-slide', 12, 'historii', -11).e('whoosh-soft', 13, None, -9)
    return p


def r4(off=2.0, short=False):
    p = Part(f'{OUT}/amber_04_linie.mp4', 'am4', off)
    if not short:
        p.card()
    p.e('whoosh-soft', 0, None, -14).e('magic-shimmer', 0, 'kupiła', -10).e('plane-takeoff', 0, 'linie', -8)
    p.e('pop-soft', 1, '2011', -12).e('pop-soft', 1, 'większość', -11).e('engine-sputter', 1, 'jet', -20, -0.5).e('pop-soft', 1, 'yes', -11, 0.3)
    p.e('pencil-scratch', 2, 'marka', -11).e('pop-soft', 2, 'olt', -9).moves([3, 5, 7, 9, 11, 13])
    p.e('pop-soft', 3, None, -12, 0.2).e('pen-tap', 3, 'poleciał', -11).e('ding-soft', 3, 'gdańska', -12)
    p.e('pen-tap', 4, '38', -12).e('pen-tap', 4, '38', -14, 0.5).e('pen-tap', 4, '35', -12).e('pen-tap', 4, '35', -14, 0.5)
    p.e('retro-beep', 5, 'bilety', -14).e('stamp', 5, '155', -10).e('pop-soft', 6, 'mniejszymi', -12).e('ding-soft', 6, '11', -9)
    p.e('paper-slide', 7, 'stroje', -12).e('ka-ching', 7, '2', -10).e('paper-flip', 8, None, -12, 0.2).e('paper-flip', 8, '600', -12).e('paper-flip', 8, 'miesięcznie', -12)
    p.e('pop-soft', 9, 'lipca', -12).e('thud-wall', 9, 'pochłonęły', -9).e('impact-soft', 9, '300', -8).e('plane-takeoff', 9, '300', -13, 0.3).e('pop-soft', 10, 'trzecią', -11)
    p.e('pop-soft', 11, None, -12, 0.2).e('paper-flip', 11, 'zawiesiło', -10).e('paper-flip', 11, 'wszystkie', -11).e('paper-flip', 11, 'loty', -11).e('power-down', 11, 'loty', -12, 0.3)
    p.e('crowd-murmur', 12, 'utknęli', -15).e('plane-takeoff', 12, 'wracali', -12)
    p.e('paper-flip', 13, None, -12).e('paper-flip', 13, 'dni', -12).e('sign-creak', 13, 'upadł', -10, -0.2).e('thud-wall', 13, 'upadł', -4, 0.33).e('coins-scatter', 13, 'gold', -14)
    return p


def l9():
    p = Part(f'{OUT}/amber_04b_po_co_samoloty.mp4', 'am4b', 0)
    p.e('pop-soft', 0, 'samoloty', -9).e('whoosh-soft', 1, None, -13).e('lock-click', 1, 'właścicielami', -9, 0.13)
    p.e('swoosh-fast', 2, 'oczami', -9).e('whoosh-soft', 2, 'klienta', -10, 0.25).e('plane-takeoff', 3, 'linie', -13).e('pop-soft', 3, 'logo', -12)
    p.e('riser-short', 3, 'wygląda', -11).e('magic-shimmer', 3, 'potęgę', -10).e('deflate', 4, 'nie', -11)
    p.e('cartoon-fall', 4, 'pieniędzy', -10).e('thud-wall', 4, 'pieniędzy', -5, 0.47).e('drawer-open', 6, 'kolejce', -12).e('gavel', 6, 'sądzie', -10, 0.33).e('drawer-open', 6, 'państwu', -12, -0.2)
    return p


def r5():
    p = Part(f'{OUT}/amber_05_upadek.mp4', 'am5', 2.0).card()
    p.e('drawer-slam', 0, 'likwidację', -6, -0.05).e('paper-slide', 0, 'likwidację', -12, 0.2).e('footsteps-run', 1, None, -18)
    p.e('scribble-erase', 1, 'wpłat', -12).e('scribble-erase', 1, 'odsetek', -12).moves([2, 7, 10, 12, 14, 16])
    p.e('crowd-murmur', 2, '18', -15).e('impact-soft', 3, None, -9).e('pop-soft', 4, '45', -12).e('heartbeat', 5, 'oszczędności', -12)
    p.e('paper-slide', 6, 'największych', -10).e('pop-soft', 7, 'syndyk', -12).e('gavel', 8, None, -10, 0.33).e('gavel', 8, None, -11, 0.67).e('gavel', 8, None, -11, 1.0)
    p.e('coins-scatter', 8, 'odzyskiwał', -14).e('retro-beep', 8, 'liczył', -13).e('impact-soft', 9, '20%', -8)
    p.e('power-down', 11, 'ostatni', -10).e('record-scratch', 11, 'nic', -16)
    p.e('paper-flip', 12, 'raport', -12).e('pen-tap', 13, 'błędy', -11).e('scribble-erase', 13, 'prokuratury', -9)
    p.e('paper-flip', 14, 'wypłaty', -12).e('paper-flip', 14, 'przyszły', -12).e('ding-soft', 14, '2018', -9, 0.47).e('tick-tock', 15, None, -15)
    p.e('ka-ching', 16, '10', -12).e('pop-soft', 16, 'złoto', -12).e('thud-wall', 17, '2', -7).e('coins-scatter', 17, '2', -12, 0.2)
    return p


def r6(off=2.0, short=False):
    p = Part(f'{OUT}/amber_06_rachunek.mp4', 'am6', off)
    if not short:
        p.card()
    p.at('paper-flip', off + 0.1, -12).e('paper-flip', 0, 'czytanie', -13).e('paper-flip', 0, '5', -12).e('impact-soft', 0, '5', -10)
    p.e('pop-soft', 1, '2016', -12).e('pen-tap', 2, '180', -12).e('crowd-murmur', 2, '730', -16).moves([3, 5, 8])
    p.e('impact-soft', 3, '25', -8).e('pop-soft', 3, 'marcina', -13).e('pop-soft', 3, 'katarzyny', -13)
    p.e('gavel', 4, 'skazał', -6).e('paper-flip', 4, '15', -10).e('paper-flip', 4, '12,5', -10)
    p.e('pop-soft', 5, '2022', -12).e('ding-soft', 5, 'utrzymał', -11).e('paper-flip', 6, '11,5', -10)
    p.e('pop-soft', 7, '2024', -12).e('stamp', 7, 'oddalił', -7).e('pop-soft', 8, 'państwo', -9)
    p.e('crowd-murmur', 9, '200', -16).e('paper-slide', 9, 'pozwało', -11).e('tick-tock', 9, 'późno', -14)
    p.e('sign-creak', 10, 'przyznał', -10).e('coins-scatter', 10, '20', -9).e('pop-soft', 11, '2025', -12)
    p.e('gavel', 11, 'zmienił', -6).e('sign-creak', 11, 'zmienił', -11, 0.2).e('coins-scatter', 11, 'zmienił', -12, 0.4).e('stamp', 11, 'oddalił', -7)
    return p


def e():
    p = Part(f'{OUT}/amber_07_zakonczenie.mp4', 'am7', 2.0).card()
    p.e('hum-generator', 0, None, -18).e('pencil-scratch', 1, None, -13).e('pop-soft', 1, 'kilku', -12)
    for li in [2, 7, 10, 12]:
        p.e('retro-beep', li, None, -9, 0.07).e('swoosh-fast', li, None, -14, -0.2)
    p.e('stamp', 2, 'gwarantowany', -10).e('thud-wall', 5, 'bez', -9, 0.3).e('coins-scatter', 5, 'brać', -14).e('footsteps-run', 6, 'kolejnych', -18)
    p.e('alarm-ring', 7, 'ostrzeżenie', -19).e('pen-tap', 9, '2009', -12).e('paper-slide', 11, 'sprawozdań', -13).e('bloop-morph', 11, 'zamiast', -10)
    p.e('rain-light', 13, 'runęło', -14).e('scribble-erase', 13, 'bank', -11).e('alert-buzz', 14, None, -18)
    p.e('bloop-morph', 14, 'pytanie', -10).e('pencil-scratch', 14, 'skąd', -12).e('pencil-scratch', 14, 'pieniądze', -12, 0.2).e('ding-soft', 14, 'odsetki', -9, 0.3)
    p.e('whoosh-soft', 15, None, -11, -0.2).e('touch-tap', 15, 'zasubskrybuj', -10)
    return p


def short_part(p, cta_at, out_video):
    # końcówka shortu: przejście i zaproszenie
    p.at('whoosh-soft', cta_at - 0.1, -9).at('pop-soft', cta_at + 1.1, -10).at('ding-soft', cta_at + 1.2, -12)
    p.video = out_video
    return p


def render_part(p, name):
    vo = f'{TMP}/{name}_vo.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p.video, '-vn', '-ac', '2', '-ar', '48000', vo], check=True)
    ins, fc, labs = ['-i', vo], [], ['[0:a]']
    for i, (sfx, t, g) in enumerate(p.ev):
        ins += ['-i', f'media/sfx/{sfx}.wav']
        ms = max(0, int(t * 1000))
        fc.append(f'[{i + 1}:a]aformat=channel_layouts=stereo,aresample=48000,volume={g}dB,adelay={ms}|{ms}[s{i}]')
        labs.append(f'[s{i}]')
    fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:dropout_transition=0:duration=first[a]")
    out = f'{TMP}/{name}_mix.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', '-ac', '2', out], check=True)
    print(name, len(p.ev), 'efektów')
    return out


def dur(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)


def bed_and_master(mix_wav, video, out, total, outro_at=None, bed_db=-15):
    # podkład w pętli pod całością (cichszy pod głosem: sidechain), na końcu outro; potem -15 LUFS
    ins = ['-i', mix_wav, '-stream_loop', '-1', '-i', 'media/music/bed-docu-calm.wav']
    fc = [f'[1:a]atrim=0:{total:.3f},volume={bed_db}dB,afade=t=in:d=2,afade=t=out:st={max(0, total - (16 if outro_at else 3)):.3f}:d={14 if outro_at else 3}[bed]',
          '[0:a]asplit=2[v1][v2]', '[bed][v2]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=500[bd]']
    labs = '[v1][bd]'
    n = 2
    if outro_at is not None:
        ins += ['-i', 'media/music/bed-outro.wav']
        ms = int(outro_at * 1000)
        fc.append(f'[2:a]volume=-6dB,adelay={ms}|{ms}[ou]')
        labs += '[ou]'
        n = 3
    fc.append(f'{labs}amix=inputs={n}:normalize=0:dropout_transition=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=11[a]')
    master = out.replace('.mp4', '_master.wav').replace(f'{OUT}/', f'{TMP}/')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', '-ac', '2', master], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', master, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print('gotowe', out)


def film():
    parts = [('hak', hak()), ('r1', r1()), ('r2', r2()), ('z', z()), ('r3', r3()), ('k', k()), ('r4', r4()), ('l9', l9()), ('r5', r5()), ('r6', r6()), ('e', e())]
    wavs = [render_part(p, n) for n, p in parts]
    lst = f'{TMP}/concat.txt'
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(p.video)}'\n" for _, p in parts))
    vid = f'{TMP}/film_video.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-map', '0:v', '-c', 'copy', vid], check=True)
    alst = f'{TMP}/concat_a.txt'
    open(alst, 'w').write(''.join(f"file '{w}'\n" for w in wavs))
    aud = f'{TMP}/film_mix.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', alst, '-c', 'pcm_s16le', aud], check=True)
    total = dur(aud)
    e_start = sum(dur(p.video) for n, p in parts[:-1])
    outro_at = e_start + 2.0 + parts[-1][1].L[-1]['e'] + 0.3
    bed_and_master(aud, vid, f'{OUT}/amber_gold_film.mp4', total, outro_at=outro_at)


def shorts():
    cta = 'CTA'
    items = [
        ('s1', r3(0, True), 'amber_short1_piramida.mp4'),
        ('s2', r2(0, True), 'amber_short2_ostrzezenie.mp4'),
        ('s3', r4(0, True), 'amber_short3_linie.mp4'),
        ('s4', r6(0, True), 'amber_short4_rachunek.mp4'),
    ]
    for name, p, f in items:
        video = f'{OUT}/{f}'
        cta_at = p.L[-1]['e'] + 24 / FPS
        short_part(p, cta_at, video)
        w = render_part(p, name)
        bed_and_master(w, video, f'{OUT}/{f.replace(".mp4", "_final.mp4")}', dur(w), bed_db=-17)
    _ = cta


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('film', 'all'):
        film()
    if what in ('shorts', 'all'):
        shorts()
