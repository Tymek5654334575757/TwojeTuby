// Short Szczęście Pieniędzy Nie Daje: Jordan Belfort i Stratton Oakmont (1080×1920, ok. 48 s).
// Styl TED-Ed w płaskiej palecie kanału. Jeden świat z siedmiu pokoi w dwóch rzędach (jasny u góry, ciemny na dole),
// kamera bez cięć: wjazd w klawiaturę telefonu i wyjazd z innego telefonu (1 → setki), zjazd w dół do „mechanizmu”,
// przejazdy za spadającym budynkiem i monetami, odjazd na mapę całej historii, powrót do klatki 0 (pętla).
// Każdy ruch startuje na słowie lektora (vo.gen.ts). Postacie to ogólne typy, bez podobieństwa do prawdziwych osób.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/baloo-2/800.css';
import {P, FFONT, G, Adult, ADULTS, PHONE_CORD, Calendar, Tag, Stamp, FText, FlatBurst, Coin, clamp01, prog, pop, arc, type AdultLook} from '../../kit-flat/flat';
import {Camera, type Hit} from '../../kit/dynamics';
import {Captions} from '../../kit/captions';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
const STAGE = 1340;
const RW = 1080;
const RH = 1340;
const FLOOR = 1180;
const VCX = 540;
const VCY = 670;

// --- czasy ------------------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:!]/g, '');
export const cue = (li: number, w?: string) => {
	const l = LINES[li];
	if (!w) return l.s;
	const hit = l.words.find((x) => norm(x.w).startsWith(norm(w)));
	if (!hit) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return hit.s;
};
const T = (li: number, w?: string) => Math.round(cue(li, w) * FPS);
export const TOTAL_FRAMES = Math.round((LINES[13].e + 0.95) * FPS);
const END = TOTAL_FRAMES - 1;

const K = {
	sp: T(0, 'sprzedawał'),
	nap: T(0, 'napompował'),
	wyp: T(0, 'wyprzedawał'),
	l1: T(1),
	oak: T(1, 'Oakmont'),
	fab: T(1, 'fabryka'),
	k1000: T(2, '1000'),
	dzw: T(2, 'dzwoniło'),
	nam: T(2, 'namawiało'),
	tan: T(2, 'tanie'),
	mech: T(3),
	mak: T(4),
	zaw: T(4, 'zawyżali'),
	cen: T(4, 'cenę'),
	akc: T(4, 'akcji'),
	kl: T(5, 'klienci'),
	kup: T(5, 'kupowali'),
	fir: T(5, 'firma'),
	wypr: T(5, 'wyprzedawała'),
	zys: T(5, 'zyskiem'),
	l6: T(6),
	y89: T(6, '1989'),
	lup: T(6, 'lupą'),
	reg: T(6, 'regulatorów'),
	y96: T(7, '1996'),
	zw: T(7, 'związek'),
	wyr: T(7, 'wyrzucił'),
	sze: T(7, 'szeregów'),
	l8: T(8),
	str: T(8, 'stracili'),
	m200: T(8, '200'),
	l9: T(9),
	prz: T(9, 'przyznał'),
	win: T(9, 'winy'),
	l10: T(10),
	m22: T(10, '22'),
	wsp: T(10, 'współpracował'),
	fbi: T(10, 'FBI'),
	l11: T(11),
	zas: T(11, 'zasądził'),
	zwr: T(11, 'zwrot'),
	l12: T(12),
	nie: T(12, 'nie'),
	ryn: T(12, 'rynek'),
	tel: T(13, 'telefon'),
	pew: T(13, 'pewny'),
	glos: T(13, 'głos'),
};

// --- ruch (animation-principles: wejście easeOutExpo, wyjście easeInExpo, przejazd easeInOutCubic) ------------
type Ease = (t: number) => number;
const EIO: Ease = Easing.bezier(0.65, 0, 0.35, 1);
const EOUT: Ease = Easing.bezier(0.16, 1, 0.3, 1);
const EIN: Ease = Easing.bezier(0.7, 0, 0.84, 0);
const EBACK: Ease = Easing.bezier(0.34, 1.56, 0.64, 1);
const ip = (f: number, a: number, b: number, v0: number, v1: number, e: Ease = EOUT) =>
	interpolate(f, [a, Math.max(a + 1, b)], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const pk = (f: number, a: number) => (f < a ? 0 : Math.min(1.08, pop(f, a)));
const live = (f: number, a: number, b: number, fade = 6) => prog(f, a, fade) * (1 - prog(f, b, fade));
const swing = (f: number, a: number, amp = 10) => (f < a ? 0 : Math.sin((f - a) / 5) * amp * Math.exp(-(f - a) / 26));
const hsh = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
const stampIn = (f: number, a: number) => (f < a ? 0 : interpolate(f, [a, a + 6], [2.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));

// --- kamera świata ---------------------------------------------------------------------
type CK = {f: number; x: number; y: number; z: number; e?: 'io' | 'in' | 'out'};
const PH0 = {x: 640, y: 905}; // klawiatura telefonu w pokoju 0
const R1C = {x: 540, y: 760}; // klawiatura środkowego telefonu w pokoju 1
const CAM0 = {x: 540, y: 700, z: 1.12};
const KEYS: CK[] = [
	{f: 0, ...CAM0},
	{f: K.nap - 8, ...CAM0},
	{f: K.nap + 14, x: 690, y: 640, z: 1.28},
	{f: K.wyp + 8, x: 670, y: 650, z: 1.22},
	// wjazd w klawiaturę telefonu…
	{f: K.l1 - 1, x: PH0.x, y: PH0.y, z: 9, e: 'in'},
	// …i wyjazd z takiego samego telefonu w biurze
	{f: K.l1 - 1, x: RW + R1C.x, y: R1C.y, z: 9},
	{f: K.oak + 14, x: RW + 540, y: 670, z: 1, e: 'out'},
	{f: K.k1000, x: RW + 540, y: 670, z: 1},
	{f: K.mech - 10, x: RW + 540, y: 660, z: 1.04},
	// zjazd w dół: mechanizm
	{f: K.mech + 12, x: RW + 540, y: RH + 670, z: 1},
	{f: K.mak, x: RW + 540, y: RH + 670, z: 1},
	{f: K.akc + 6, x: RW + 580, y: RH + 610, z: 1.08},
	{f: K.kl + 4, x: RW + 540, y: RH + 670, z: 1},
	{f: K.l6 - 6, x: RW + 550, y: RH + 660, z: 1.03},
	// regulatorzy
	{f: K.l6 + 16, x: RW * 2 + 540, y: RH + 670, z: 1},
	{f: K.lup - 4, x: RW * 2 + 540, y: RH + 670, z: 1},
	{f: K.zw - 6, x: RW * 2 + 520, y: RH + 650, z: 1.07},
	{f: K.zw + 12, x: RW * 2 + 540, y: RH + 670, z: 1},
	{f: K.sze, x: RW * 2 + 540, y: RH + 670, z: 1},
	{f: K.sze + 16, x: RW * 2 + 540, y: RH + 700, z: 1},
	{f: K.l8 - 6, x: RW * 2 + 540, y: RH + 700, z: 1},
	// straty
	{f: K.l8 + 14, x: RW * 3 + 540, y: RH + 670, z: 1},
	{f: K.l9 - 8, x: RW * 3 + 540, y: RH + 650, z: 1.04},
	// w górę: sąd
	{f: K.l9 + 14, x: RW * 3 + 540, y: 670, z: 1},
	{f: K.l10 - 16, x: RW * 3 + 500, y: 650, z: 1.05},
	// w lewo: więzienie
	{f: K.l10 + 4, x: RW * 2 + 540, y: 670, z: 1},
	{f: K.wsp - 4, x: RW * 2 + 540, y: 670, z: 1},
	{f: K.fbi + 2, x: RW * 2 + 600, y: 700, z: 1.06},
	{f: K.l11 - 14, x: RW * 2 + 600, y: 700, z: 1.06},
	// z powrotem do sądu, potem za monetami w dół
	{f: K.l11 + 6, x: RW * 3 + 540, y: 670, z: 1},
	{f: K.zwr + 2, x: RW * 3 + 540, y: 670, z: 1},
	{f: K.zwr + 28, x: RW * 3 + 540, y: RH + 670, z: 1},
	{f: K.l12 - 6, x: RW * 3 + 540, y: RH + 660, z: 1.03},
	// odjazd: mapa całej historii
	{f: K.l12 + 26, x: RW * 2, y: RH, z: 0.25},
	{f: K.nie - 6, x: RW * 2, y: RH, z: 0.262},
	// powrót do pierwszego pokoju i telefonu
	{f: K.ryn + 6, x: 540, y: 670, z: 1},
	{f: K.tel - 2, x: 540, y: 670, z: 1},
	{f: K.tel + 18, x: 520, y: 800, z: 1.42},
	{f: K.glos + 6, x: 520, y: 800, z: 1.46},
	{f: END, ...CAM0},
];
// lekkie oddalenie w połowie dłuższych przejazdów
const DIPS: [number, number, number][] = [
	[K.l6 - 6, K.l6 + 16, 0.12],
	[K.l8 - 6, K.l8 + 14, 0.12],
	[K.l9 - 8, K.l9 + 14, 0.1],
	[K.l10 - 16, K.l10 + 4, 0.12],
	[K.l11 - 14, K.l11 + 6, 0.12],
];
const camAt = (f: number) => {
	let c = {x: KEYS[0].x, y: KEYS[0].y, z: KEYS[0].z};
	if (f > KEYS[0].f) {
		c = {x: KEYS[KEYS.length - 1].x, y: KEYS[KEYS.length - 1].y, z: KEYS[KEYS.length - 1].z};
		for (let i = 1; i < KEYS.length; i++) {
			const b = KEYS[i];
			if (f <= b.f) {
				const a = KEYS[i - 1];
				const span = b.f - a.f;
				if (span <= 0) {
					c = {x: b.x, y: b.y, z: b.z};
					break;
				}
				const e = b.e === 'in' ? EIN : b.e === 'out' ? EOUT : EIO;
				const p = e(clamp01((f - a.f) / span));
				c = {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p)};
				break;
			}
		}
	}
	for (const [a, b, d] of DIPS) if (f > a && f < b) c.z *= 1 - d * Math.sin(Math.PI * ((f - a) / (b - a)));
	return c;
};

// --- barwy i postacie -----------------------------------------------------------------------
const WOOD = '#8C6A4A';
const WOOD_D = '#6E5139';
const DARK_FLOOR = '#162130';
const PHONE = '#3A4A5E';
const BROKER: AdultLook = {suit: '#33445A', hair: '#6B4A2E', tie: P.gold, hairStyle: 'side'};
const JUDGE: AdultLook = {suit: '#1F2B3D', hair: '#8A8A8A', hairStyle: 'side', shirt: P.white};
const AGENT: AdultLook = {suit: '#1F2B3D', hair: '#2B2420', tie: '#2E3B4E', hairStyle: 'short', glasses: true};
const REGS: AdultLook[] = [ADULTS.szef2, {suit: '#4A5A6E', hair: '#8A8A8A', tie: P.goldLight, hairStyle: 'short'}];
const CLIENTS: AdultLook[] = [
	ADULTS.klient,
	{suit: '#6E7D61', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'side'},
	{suit: '#7A4E3A', hair: '#A07850', shirt: P.white, hairStyle: 'short'},
	{suit: '#5C6B7A', hair: '#2B2420', shirt: '#E4DBCB', hairStyle: 'bald'},
	{suit: '#8C7A5E', hair: '#6B4A2E', shirt: P.white, hairStyle: 'side', glasses: true},
];
const LOOKS_B: AdultLook[] = [
	{suit: '#2E3B4E', hair: '#3B2A20', tie: P.red, hairStyle: 'side'},
	{suit: '#4A5A6E', hair: '#8A8A8A', tie: P.gold, hairStyle: 'short'},
	{suit: '#5C4A3A', hair: '#2B2420', tie: P.grass, hairStyle: 'short', glasses: true},
	{suit: '#3B4A42', hair: '#A07850', tie: P.red, hairStyle: 'side'},
	{suit: '#33445A', hair: '#6B4A2E', tie: P.goldLight, hairStyle: 'bald'},
];

// --- rekwizyty ---------------------------------------------------------------------------------
const KEYPAD: [number, number][] = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) KEYPAD.push([-42 + c * 42, -36 + r * 24]);

// Telefon biurkowy; (0,0) = środek klawiatury, podstawa stoi na y = 55.
const Phone: React.FC<{f: number; ring?: number; lit?: number}> = ({f, ring = 0, lit = 0}) => {
	const shake = ring > 0 ? Math.sin(f * 2.3) * 4 * ring : 0;
	return (
		<g transform={`rotate(${shake} 0 55)`}>
			<rect x={-86} y={-80} width={36} height={24} rx={7} fill={PHONE} stroke={P.navy} strokeWidth={6} />
			<rect x={50} y={-80} width={36} height={24} rx={7} fill={PHONE} stroke={P.navy} strokeWidth={6} />
			<path d="M -116 55 L -96 -52 Q -94 -62 -84 -62 L 84 -62 Q 94 -62 96 -52 L 116 55 Z" fill={PHONE} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
			<rect x={-70} y={-50} width={140} height={100} rx={10} fill="#26313F" />
			{KEYPAD.map(([kx, ky], i) => (
				<rect key={i} x={kx - 16} y={ky - 9} width={32} height={18} rx={6} fill={i < lit ? P.gold : P.white} />
			))}
		</g>
	);
};

// Łuki dzwonienia po obu stronach telefonu.
const Rings: React.FC<{f: number; amp: number; color?: string}> = ({f, amp, color = P.red}) => {
	const k = (f % 12) / 12;
	return (
		<g opacity={amp * (1 - k * 0.5)} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round">
			{[0, 1].map((j) => {
				const r = 140 + j * 28 + k * 12;
				return (
					<g key={j}>
						<path d={`M ${-r * 0.92} ${-r * 0.38} A ${r} ${r} 0 0 0 ${-r * 0.92} ${r * 0.38}`} />
						<path d={`M ${r * 0.92} ${-r * 0.38} A ${r} ${r} 0 0 1 ${r * 0.92} ${r * 0.38}`} />
					</g>
				);
			})}
		</g>
	);
};

// Kręcony kabel słuchawki.
const coil = (x1: number, y1: number, x2: number, y2: number, f: number, seed = 0) => {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.hypot(dx, dy) || 1;
	const nx = -dy / len;
	const ny = dx / len;
	const turns = Math.max(4, len / 15);
	const sag = 46 + Math.sin((f + seed * 20) / 18) * 7;
	let d = '';
	const N = 120;
	for (let i = 0; i <= N; i++) {
		const t = i / N;
		const w = Math.sin(t * Math.PI * 2 * turns) * 8;
		const x = x1 + dx * t + nx * w;
		const y = y1 + dy * t + ny * w + Math.sin(Math.PI * t) * sag;
		d += `${i ? ' L ' : 'M '}${x.toFixed(1)} ${y.toFixed(1)}`;
	}
	return d;
};

// Odcinek biurka pod jednym telefonem (kafelkuje się w rzędy).
const UnitDesk: React.FC = () => (
	<g>
		<rect x={-200} y={77} width={360} height={170} fill={WOOD_D} stroke={P.navy} strokeWidth={6} />
		<rect x={-206} y={55} width={372} height={24} rx={6} fill={WOOD} stroke={P.navy} strokeWidth={6} />
	</g>
);

// Uproszczony makler za biurkiem (dalsze rzędy siatki), ze słuchawką przy uchu.
const MiniBroker: React.FC<{look: AdultLook; talk: boolean}> = ({look, talk}) => (
	<g transform="translate(-175 0)">
		<path d="M -50 70 L -48 16 Q 0 2 48 16 L 50 70 Z" fill={look.suit} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<path d="M -12 6 L 0 34 L 12 6 Z" fill={P.white} />
		<circle cx={0} cy={-28} r={31} fill={P.skin} stroke={P.navy} strokeWidth={5} />
		{look.hairStyle !== 'bald' && <path d="M -32 -30 Q -32 -64 0 -62 Q 32 -64 32 -30 Q 20 -46 0 -46 Q -20 -46 -32 -30 Z" fill={look.hair} stroke={P.navy} strokeWidth={4} />}
		<circle cx={-11} cy={-28} r={4} fill={P.navy} />
		<circle cx={11} cy={-28} r={4} fill={P.navy} />
		{talk ? <ellipse cx={0} cy={-12} rx={8} ry={6} fill={P.navy} /> : <line x1={-7} y1={-12} x2={7} y2={-12} stroke={P.navy} strokeWidth={4} strokeLinecap="round" />}
		<path d="M 44 30 L 66 6 L 42 -24" fill="none" stroke={P.navy} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M 44 30 L 66 6 L 42 -24" fill="none" stroke={look.suit} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
		<rect x={26} y={-56} width={16} height={58} rx={8} fill={P.navy} />
	</g>
);

// Balon z wykresem akcji; (0,0) = środek balonu.
const Balloon: React.FC<{r: number}> = ({r}) => (
	<g>
		<path d={`M ${-r * 0.13} ${r * 1.2} L ${r * 0.13} ${r * 1.2} L 0 ${r * 1.07} Z`} fill={P.goldDark} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<ellipse cx={0} cy={0} rx={r} ry={r * 1.1} fill={P.gold} stroke={P.navy} strokeWidth={7} />
		<path d={`M ${-r * 0.62} ${-r * 0.55} Q ${-r * 0.76} ${-r * 0.25} ${-r * 0.66} ${r * 0.02}`} stroke={P.goldLight} strokeWidth={Math.max(6, r * 0.09)} fill="none" strokeLinecap="round" />
		<polyline
			points={`${-r * 0.5},${r * 0.62} ${-r * 0.22},${r * 0.42} ${r * 0.04},${r * 0.52} ${r * 0.44},${r * 0.12}`}
			fill="none"
			stroke={P.navy}
			strokeWidth={Math.max(6, r * 0.07)}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path d={`M ${r * 0.26} ${r * 0.1} L ${r * 0.48} ${r * 0.08} L ${r * 0.46} ${r * 0.3}`} fill="none" stroke={P.navy} strokeWidth={Math.max(6, r * 0.07)} strokeLinecap="round" strokeLinejoin="round" />
		<text x={0} y={-r * 0.12} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={r * 0.38} fill={P.navy}>
			AKCJE
		</text>
	</g>
);

// Papier akcji (środek w 0,0).
const Cert: React.FC<{w?: number}> = ({w = 80}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.62} width={w} height={w * 1.24} rx={6} fill={P.white} stroke={P.navy} strokeWidth={5} />
		<rect x={-w * 0.32} y={-w * 0.44} width={w * 0.64} height={w * 0.15} rx={3} fill={P.gold} />
		{[0, 1, 2].map((i) => (
			<line key={i} x1={-w * 0.3} x2={w * 0.3} y1={-w * 0.08 + i * w * 0.2} y2={-w * 0.08 + i * w * 0.2} stroke={P.grey} strokeWidth={5} strokeLinecap="round" />
		))}
	</g>
);

// Dymek z krótkim hasłem (dolny ogonek w 0,0 + 52).
const Bubble: React.FC<{text: string; w?: number}> = ({text, w = 160}) => (
	<g>
		<path d="M -14 18 L 4 52 L 22 18 Z" fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<rect x={-w / 2} y={-62} width={w} height={84} rx={24} fill={P.white} stroke={P.navy} strokeWidth={6} />
		<rect x={-12} y={12} width={32} height={12} fill={P.white} />
		<text x={0} y={-4} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={46} fill={P.red}>
			{text}
		</text>
	</g>
);

// Biurowiec (środek podstawy w 0,0). hl = okna podświetlone przez lupę.
const Office: React.FC<{w: number; h: number; f: number; seed: number; sign?: string; hl?: {x: number; y: number; r: number}}> = ({w, h, f, seed, sign, hl}) => {
	const cols = Math.max(2, Math.floor((w - 40) / 60));
	const rows = Math.max(2, Math.floor((h - 90) / 74));
	const cw = (w - 40) / cols;
	const rh = (h - 90) / rows;
	return (
		<g>
			<rect x={-w / 2} y={-h} width={w} height={h} fill="#3A4A5E" stroke="#0E1520" strokeWidth={7} />
			{Array.from({length: rows}).map((_, r) =>
				Array.from({length: cols}).map((__, c) => {
					const k = seed * 100 + r * 10 + c;
					const x = -w / 2 + 20 + c * cw + cw * 0.18;
					const y = -h + 24 + r * rh;
					const flick = hsh(k + 3) > 0.9 && Math.floor((f + k * 7) / 45) % 2 === 0;
					const inLens = hl ? Math.hypot(x + cw * 0.32 - hl.x, y + rh * 0.3 - hl.y) < hl.r : false;
					const lit = inLens || (hsh(k) > 0.42) !== flick;
					return <rect key={`${r}-${c}`} x={x} y={y} width={cw * 0.64} height={rh * 0.6} rx={4} fill={inLens ? P.white : lit ? P.goldLight : '#26313F'} />;
				}),
			)}
			<rect x={-Math.min(36, w * 0.14)} y={-64} width={Math.min(72, w * 0.28)} height={64} fill="#26313F" stroke="#0E1520" strokeWidth={5} />
			<rect x={-w / 2 - 10} y={-h - 8} width={w + 20} height={16} rx={4} fill="#2E3B4E" stroke="#0E1520" strokeWidth={5} />
			{sign && (
				<g>
					<rect x={-w / 2 + 6} y={-h - 82} width={w - 12} height={62} rx={12} fill={P.gold} stroke="#0E1520" strokeWidth={6} />
					<text x={0} y={-h - 40} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={32} fill={P.navy}>
						{sign}
					</text>
				</g>
			)}
		</g>
	);
};

// Lupa (środek soczewki w 0,0).
const Lens: React.FC<{r: number}> = ({r}) => (
	<g>
		<line x1={r * 0.72} y1={r * 0.72} x2={r * 1.6} y2={r * 1.6} stroke={WOOD} strokeWidth={r * 0.24} strokeLinecap="round" />
		<line x1={r * 0.72} y1={r * 0.72} x2={r * 1.6} y2={r * 1.6} stroke="#0E1520" strokeWidth={r * 0.24 + 10} strokeLinecap="round" opacity={0.35} />
		<line x1={r * 0.72} y1={r * 0.72} x2={r * 1.6} y2={r * 1.6} stroke={WOOD} strokeWidth={r * 0.22} strokeLinecap="round" />
		<circle r={r} fill={P.goldLight} opacity={0.18} />
		<circle r={r} fill="none" stroke={P.grey} strokeWidth={r * 0.13} />
		<circle r={r + r * 0.065} fill="none" stroke="#0E1520" strokeWidth={5} />
		<path d={`M ${-r * 0.6} ${-r * 0.35} A ${r * 0.7} ${r * 0.7} 0 0 1 ${-r * 0.2} ${-r * 0.66}`} stroke={P.white} strokeWidth={r * 0.08} fill="none" strokeLinecap="round" opacity={0.7} />
	</g>
);

// Sejf firmy (środek w 0,0).
const Vault: React.FC = () => (
	<g>
		<g transform="translate(-50 -96) rotate(-12)">
			<Cert w={70} />
		</g>
		<g transform="translate(22 -104) rotate(9)">
			<Cert w={70} />
		</g>
		<rect x={-120} y={-92} width={240} height={184} rx={18} fill="#2E3B4E" stroke={P.gold} strokeWidth={8} />
		<circle cx={40} cy={0} r={42} fill="none" stroke={P.gold} strokeWidth={7} />
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={40} y1={0} x2={40 + Math.cos((i * Math.PI) / 2) * 30} y2={Math.sin((i * Math.PI) / 2) * 30} stroke={P.gold} strokeWidth={6} strokeLinecap="round" />
		))}
		<rect x={-96} y={-30} width={22} height={60} rx={6} fill={P.gold} />
	</g>
);

// Stos monet (środek podstawy w 0,0).
const Pile: React.FC<{n: number; seed: number}> = ({n, seed}) => (
	<g>
		{Array.from({length: Math.max(0, n)}).map((_, k) => (
			<ellipse key={k} cx={(hsh(seed * 31 + k) - 0.5) * 8} cy={-k * 16 - 10} rx={58} ry={14} fill={P.gold} stroke={P.navy} strokeWidth={5} />
		))}
	</g>
);

// Młotek sędziowski; (0,0) = koniec trzonka, ang 0 = uderzenie.
const Gavel: React.FC<{ang: number}> = ({ang}) => (
	<g transform={`rotate(${ang})`}>
		<rect x={-8} y={-8} width={150} height={16} rx={8} fill={WOOD_D} stroke={P.navy} strokeWidth={5} />
		<rect x={118} y={-34} width={46} height={68} rx={10} fill={WOOD} stroke={P.navy} strokeWidth={6} />
	</g>
);
const gavelAngle = (f: number, hits: number[]) => {
	let a = -25;
	for (const s of hits) {
		if (f >= s - 9 && f < s - 2) a = -25 - 45 * EOUT(clamp01((f - (s - 9)) / 7));
		else if (f >= s - 2 && f < s) a = -70 + 70 * EIN(clamp01((f - (s - 2)) / 2));
		else if (f >= s && f < s + 12) a = -25 * EOUT(clamp01((f - s) / 12));
	}
	return a;
};

// Waga sprawiedliwości (środek podstawy w 0,0).
const Scales: React.FC<{tilt: number}> = ({tilt}) => (
	<g fill="none" stroke={P.goldDark} strokeWidth={8} strokeLinecap="round">
		<line x1={0} y1={0} x2={0} y2={-170} />
		<line x1={-50} y1={0} x2={50} y2={0} />
		<g transform={`rotate(${tilt} 0 -160)`}>
			<line x1={-110} y1={-160} x2={110} y2={-160} />
			{[-1, 1].map((s) => (
				<g key={s} transform={`translate(${s * 110} -160) rotate(${-tilt})`}>
					<line x1={0} y1={0} x2={-30} y2={70} />
					<line x1={0} y1={0} x2={30} y2={70} />
					<path d="M -44 70 Q 0 106 44 70 Z" fill={P.gold} />
				</g>
			))}
		</g>
		<circle cx={0} cy={-172} r={10} fill={P.gold} />
	</g>
);

const Doc: React.FC<{sig: number}> = ({sig}) => (
	<g>
		<rect x={-125} y={-150} width={250} height={300} rx={10} fill={P.white} stroke={P.navy} strokeWidth={6} />
		<text x={0} y={-100} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={34} fill={P.navy}>
			PRZYZNANIE
		</text>
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={-90} x2={i === 3 ? 30 : 90} y1={-50 + i * 34} y2={-50 + i * 34} stroke={P.grey} strokeWidth={8} strokeLinecap="round" />
		))}
		<path d="M -85 105 q 18 -34 36 0 t 36 0 t 36 -6 t 30 -10" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - sig} stroke={P.blue} strokeWidth={6} fill="none" strokeLinecap="round" />
	</g>
);

const Folder: React.FC = () => (
	<g>
		<rect x={-64} y={-62} width={54} height={18} rx={5} fill="#2E3B4E" stroke={P.navy} strokeWidth={4} />
		<rect x={-64} y={-48} width={128} height={96} rx={8} fill="#2E3B4E" stroke={P.navy} strokeWidth={5} />
		<text x={0} y={16} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={42} fill={P.bg}>
			FBI
		</text>
	</g>
);

// Pyłki w ciemnych pokojach (warstwa tła).
const Motes: React.FC<{f: number; seed: number}> = ({f, seed}) => (
	<g fill={P.bg}>
		{Array.from({length: 14}).map((_, i) => {
			const k = seed * 50 + i;
			const x = hsh(k) * RW + Math.sin(f / 40 + i) * 12;
			const y = (((hsh(k + 9) * FLOOR - f * (0.4 + hsh(k + 4) * 0.5)) % FLOOR) + FLOOR) % FLOOR;
			return <circle key={i} cx={x} cy={y} r={3 + hsh(k + 2) * 4} opacity={0.1} />;
		})}
	</g>
);

const DarkRoom: React.FC<{f: number; seed: number}> = ({f, seed}) => (
	<g>
		<rect x={0} y={0} width={RW} height={RH} fill={P.navy} />
		<rect x={0} y={0} width={RW} height={FLOOR} fill="url(#bf-kpD)" />
		<rect x={0} y={FLOOR} width={RW} height={RH - FLOOR} fill={DARK_FLOOR} />
		<Motes f={f} seed={seed} />
	</g>
);

// ============ POKÓJ 0: biurko maklera (haczyk, finał, pętla) ============
const Room0: React.FC<{f: number}> = ({f}) => {
	const regrow = ip(f, K.glos + 4, K.glos + 40, 0, 1, EBACK);
	const popped = f >= K.wyp && regrow <= 0.02;
	const r = f < K.wyp ? 105 + 27 * pk(f, K.nap) + 27 * pk(f, K.nap + 8) + 26 * pk(f, K.nap + 16) : 105 * regrow;
	const bx = 800 + Math.sin(f / 27) * 5;
	const by = 500 + Math.sin(f / 19) * 7;
	const sq = f >= K.nap && f < K.wyp ? 1 + 0.06 * Math.sin((f - K.nap) * 0.8) * Math.exp(-(f - K.nap) / 14) : 1;
	const talking = f < K.wyp + 2 || f >= K.tel - 6;
	const pumping = f >= K.nap - 2 && f < K.nap + 24;
	const armL = pumping ? 45 + Math.sin((f - K.nap) / 1.4) * 28 : 10;
	const drawer = live(f, K.wyp - 1, K.wyp + 26, 4);
	const lit = f >= K.tel ? Math.floor(ip(f, K.tel, K.tel + 22, 0, 12.99, Easing.linear)) : 0;
	const x1 = ip(f, K.ryn, K.ryn + 8, 0, 1);
	const x2 = ip(f, K.ryn + 4, K.ryn + 12, 0, 1);
	const xFade = 1 - prog(f, END - 24, 16);
	const hand = {x: 360 + PHONE_CORD.x, y: FLOOR + PHONE_CORD.y};
	const pp = clamp01((f - K.wyp) / 16);
	const clockA = (f / END) * 720;
	return (
		<g>
			<rect x={0} y={0} width={RW} height={RH} fill={P.bg} />
			<rect x={0} y={0} width={RW} height={FLOOR} fill="url(#bf-kpL)" />
			<rect x={0} y={FLOOR} width={RW} height={RH - FLOOR} fill={P.grey} />
			{/* tablica „RYNEK” (przekreślana w finale) */}
			<FText text="RYNEK" x={210} y={190} size={40} fill={P.slate} />
			<rect x={90} y={205} width={240} height={170} rx={10} fill={P.white} stroke={P.navy} strokeWidth={7} />
			<polyline points="115,340 160,300 200,320 245,260 300,240" fill="none" stroke={P.slate} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
			<g opacity={xFade} stroke={P.red} strokeWidth={14} strokeLinecap="round">
				{x1 > 0 && <line x1={100} y1={215} x2={100 + 220 * x1} y2={215 + 150 * x1} />}
				{x2 > 0 && <line x1={320} y1={215} x2={320 - 220 * x2} y2={215 + 150 * x2} />}
			</g>
			{/* zegar (warstwa tła) */}
			<circle cx={955} cy={235} r={64} fill={P.white} stroke={P.navy} strokeWidth={7} />
			<line x1={955} y1={235} x2={955 + Math.sin((clockA * Math.PI) / 180) * 48} y2={235 - Math.cos((clockA * Math.PI) / 180) * 48} stroke={P.red} strokeWidth={5} strokeLinecap="round" />
			<line x1={955} y1={235} x2={955 + Math.sin(((clockA / 12 + 60) * Math.PI) / 180) * 30} y2={235 - Math.cos(((clockA / 12 + 60) * Math.PI) / 180) * 30} stroke={P.navy} strokeWidth={8} strokeLinecap="round" />
			<circle cx={955} cy={235} r={7} fill={P.navy} />
			{/* makler */}
			<G x={360} y={FLOOR}>
				<Adult look={BROKER} phone talk={talking} mood={f >= K.wyp + 4 && f < K.l1 ? 'smile' : 'neutral'} armL={armL} seed={1} />
			</G>
			{/* biurko */}
			<rect x={165} y={982} width={730} height={198} fill={WOOD_D} stroke={P.navy} strokeWidth={7} />
			<rect x={150} y={960} width={760} height={24} rx={6} fill={WOOD} stroke={P.navy} strokeWidth={7} />
			<rect x={600} y={998 + 6 * drawer} width={250} height={12 * drawer} fill="#2A1E14" />
			<rect x={600} y={1005 + 14 * drawer} width={250} height={72} rx={6} fill={WOOD} stroke={P.navy} strokeWidth={6} />
			<rect x={695} y={1032 + 14 * drawer} width={60} height={14} rx={7} fill={P.navy} />
			<rect x={215} y={1040} width={300} height={64} rx={10} fill={P.goldLight} stroke={P.navy} strokeWidth={6} />
			<FText text="JORDAN BELFORT" x={365} y={1084} size={36} fill={P.navy} />
			{/* kabel i telefon */}
			<path d={coil(528, 930, hand.x, hand.y, f)} fill="none" stroke={P.navy} strokeWidth={6} strokeLinecap="round" />
			<G x={PH0.x} y={PH0.y}>
				<Phone f={f} lit={lit} />
			</G>
			{/* papiery akcji lecą do ludzi */}
			{[0, 1, 2].map((i) => {
				const p = clamp01((f - (K.sp + i * 5)) / 20);
				if (p <= 0 || p >= 1) return null;
				const q = arc(EIO(p), 470, 930, 1250, 560 + i * 90, 160);
				return (
					<G key={i} x={q.x} y={q.y} r={p * 220 * (i % 2 ? 1 : -1)}>
						<Cert w={86} />
					</G>
				);
			})}
			{/* balon akcji: rośnie, pęka, wraca na końcu */}
			{!popped && r > 1 && (
				<g>
					<path d={`M 850 958 Q ${830 + Math.sin(f / 15) * 14} ${(958 + by + r * 1.2) / 2} ${bx} ${by + r * 1.2 * sq}`} fill="none" stroke={P.navy} strokeWidth={4} />
					<G x={bx} y={by} sq={sq}>
						<Balloon r={r} />
					</G>
				</g>
			)}
			{popped && <path d="M 850 958 Q 842 930 856 905" fill="none" stroke={P.navy} strokeWidth={4} />}
			{f >= K.wyp && pp < 1 && (
				<g opacity={1 - pp}>
					{Array.from({length: 8}).map((_, i) => {
						const a = (i / 8) * Math.PI * 2 + 0.3;
						const d = 70 + 260 * EOUT(pp);
						return (
							<G key={i} x={800 + Math.cos(a) * d} y={500 + Math.sin(a) * d + 160 * pp * pp} r={pp * 300 * (i % 2 ? 1 : -1)}>
								<path d="M -26 -12 Q 0 -24 26 -8 L 14 16 Q -4 6 -22 14 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
							</G>
						);
					})}
				</g>
			)}
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const p = clamp01((f - K.wyp - 3 - i * 2) / 15);
				if (p <= 0 || p >= 1) return null;
				const q = arc(p, 800 + (i - 2.5) * 24, 520, 650 + i * 30, 1012, 150);
				return (
					<G key={i} x={q.x} y={q.y} r={p * 200}>
						<Coin r={30} />
					</G>
				);
			})}
			<FlatBurst x={800} y={500} at={K.wyp} r={170} color={P.red} />
			{/* finał: pewny głos */}
			{f >= K.pew - 2 &&
				f < K.glos + 34 &&
				[0, 1, 2].map((j) => {
					const k = ((f - K.pew + 18 - j * 6) % 18) / 18;
					const rr = 50 + k * 120;
					return (
						<path
							key={j}
							d={`M ${440 + rr * 0.5} ${725 - rr * 0.8} A ${rr} ${rr} 0 0 1 ${440 + rr * 0.5} ${725 + rr * 0.8}`}
							fill="none"
							stroke={P.gold}
							strokeWidth={12}
							strokeLinecap="round"
							opacity={(1 - k) * (1 - prog(f, K.glos + 24, 10))}
						/>
					);
				})}
		</g>
	);
};

// ============ POKÓJ 1: fabryka telefonów (1 telefon → setki) ============
const SX = 360;
const SY = 340;
type Unit = {c: number; r: number; d: number; i: number};
const GRID: Unit[] = [];
for (let r = -7; r <= 7; r++) for (let c = -6; c <= 6; c++) GRID.push({c, r, d: Math.max(Math.abs(c), Math.abs(r)), i: GRID.length});
const BUB: [number, number][] = [
	[-1, -1],
	[2, 0],
	[-3, 1],
	[1, 2],
	[-2, -2],
	[3, -2],
	[0, 3],
	[-4, 0],
	[4, 1],
];
const gridZoom = (f: number) => (f < K.k1000 - 4 ? ip(f, K.fab - 4, K.fab + 16, 1, 0.56, EIO) : ip(f, K.k1000 - 4, K.k1000 + 22, 0.56, 0.3, EIO));

const Room1: React.FC<{f: number}> = ({f}) => {
	const gz = gridZoom(f);
	const units = GRID.map((u) => {
		const a = u.d <= 1 ? 1 : pk(f, K.fab - 6 + (u.d - 2) * 3);
		const sx = R1C.x + u.c * SX * gz;
		const sy = R1C.y + u.r * SY * gz;
		const on = a > 0.01 && sx + 200 * gz > -60 && sx - 240 * gz < RW + 60 && sy + 250 * gz > -60 && sy - 70 * gz < RH + 60;
		const ring = live(f, K.dzw + u.d * 2, K.dzw + u.d * 2 + 34, 3);
		return {...u, a, on, ring};
	}).filter((u) => u.on);
	const rows: (typeof units)[] = [];
	for (let r = -7; r <= 7; r++) rows.push(units.filter((u) => u.r === r));
	const tr = (u: {c: number; r: number; a: number}) => `translate(${u.c * SX} ${u.r * SY}) scale(${u.a})`;
	const n = Math.round(ip(f, K.k1000, K.k1000 + 20, 0, 1000));
	return (
		<g clipPath="url(#bf-room)">
			<rect x={0} y={0} width={RW} height={RH} fill={P.bg} />
			<g transform={`translate(${R1C.x} ${R1C.y}) scale(${gz})`}>
				{rows.map((row, ri) => (
					<g key={ri}>
						{row.map((u) => (
							<g key={`b${u.i}`} transform={tr(u)}>
								{u.d <= 1 ? (
									<G x={-175} y={235} s={0.6}>
										<Adult look={LOOKS_B[u.i % 5]} phone talk={(f + u.i * 7) % 44 < 26} seed={u.i} />
									</G>
								) : (
									<MiniBroker look={LOOKS_B[u.i % 5]} talk={Math.floor((f + u.i * 5) / 4) % 2 === 0 && (f + u.i * 7) % 44 < 26} />
								)}
							</g>
						))}
						{row.map((u) => (
							<g key={`d${u.i}`} transform={tr(u)}>
								<UnitDesk />
							</g>
						))}
						{row.map((u) => (
							<g key={`p${u.i}`} transform={tr(u)}>
								<Phone f={f + u.i} ring={u.ring} />
								{u.ring > 0 && <Rings f={f + u.i * 3} amp={u.ring} />}
							</g>
						))}
					</g>
				))}
			</g>
			{/* szyld firmy spada na „Oakmont” */}
			<G x={540} y={-170 + 320 * pk(f, K.oak - 2)} r={swing(f, K.oak + 6, 5)}>
				<line x1={-300} y1={-60} x2={-300} y2={-320} stroke={P.navy} strokeWidth={5} />
				<line x1={300} y1={-60} x2={300} y2={-320} stroke={P.navy} strokeWidth={5} />
				<rect x={-390} y={-60} width={780} height={120} rx={20} fill={P.gold} stroke={P.navy} strokeWidth={8} />
				<FText text="STRATTON OAKMONT" x={0} y={22} size={62} fill={P.navy} />
			</G>
			{/* 1000+ */}
			{f >= K.k1000 - 4 && f < K.nam && (
				<G x={540} y={340} s={pk(f, K.k1000 - 4)} o={1 - prog(f, K.nam - 8, 6)}>
					<rect x={-320} y={-130} width={640} height={260} rx={30} fill={P.navy} stroke={P.bg} strokeWidth={8} />
					<FText text={`${n}${n >= 1000 ? '+' : ''}`} x={0} y={40} size={180} fill={P.gold} />
					<FText text="maklerów" x={0} y={105} size={56} fill={P.bg} />
				</G>
			)}
			{/* „KUP!” */}
			{f >= K.nam &&
				BUB.map(([c, r], j) => {
					const sx = R1C.x + c * SX * gz - 175 * gz;
					const sy = R1C.y + r * SY * gz - 70 * gz - 56;
					return (
						<G key={j} x={sx} y={sy} s={pk(f, K.nam + j * 3) * (1 - prog(f, K.mech - 8, 6))} r={(j % 3) - 1}>
							<Bubble text="KUP!" />
						</G>
					);
				})}
			{f >= K.tan && (
				<G x={540} y={205} s={pk(f, K.tan)}>
					<Tag text="AKCJE ZA GROSZE" w={470} color={P.goldLight} swing={swing(f, K.tan, 12)} />
				</G>
			)}
		</g>
	);
};

// ============ POKÓJ C (ciemny): mechanizm pompowania ============
const LP: [number, number][] = [
	[170, 830],
	[280, 800],
	[370, 720],
	[450, 600],
	[530, 470],
	[610, 360],
	[690, 300],
];
const CRASH: [number, number] = [770, 860];
const partial = (pts: [number, number][], s: number) => {
	const n = Math.floor(s);
	const out = pts.slice(0, Math.min(pts.length, n + 1));
	if (n < pts.length - 1 && s > n) {
		const a = pts[n];
		const b = pts[n + 1];
		const t = s - n;
		out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
	}
	return out;
};
const MB = [130, 290, 450];
const CX = [600, 745, 890];
const BOX = {x: 820, y: 560};

const RoomC: React.FC<{f: number}> = ({f}) => {
	const axes = ip(f, K.mech - 6, K.mech + 12, 0, 1, EIO);
	const steps = [K.mak, K.zaw, K.cen, K.akc];
	const targets = [2, 4, 5, 6];
	const s = ip(f, K.mak, K.mak + 10, 0, 2) + ip(f, K.zaw, K.zaw + 10, 0, 2) + ip(f, K.cen, K.cen + 8, 0, 1) + ip(f, K.akc, K.akc + 8, 0, 1);
	const tCr = K.zys + 10;
	const cr = ip(f, tCr, tCr + 9, 0, 1, EIN);
	const pts = partial(LP, s);
	const top = LP[6];
	const tip: [number, number] = cr > 0 ? [top[0] + (CRASH[0] - top[0]) * cr, top[1] + (CRASH[1] - top[1]) * cr] : pts[pts.length - 1];
	const boxSq = f >= K.zys ? 1 + 0.2 * Math.sin((f - K.zys) / 2.2) * Math.exp(-(f - K.zys) / 8) : 1;
	return (
		<g>
			<DarkRoom f={f} seed={1} />
			{/* osie wykresu */}
			<path d="M 170 240 L 170 880 L 900 880" fill="none" stroke={P.bg} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - axes} />
			<FText text="cena akcji" x={190} y={215} size={40} fill={P.bg} anchor="start" opacity={axes} />
			{/* linia ceny */}
			{s > 0 && <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={P.gold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />}
			{cr > 0 && (
				<g>
					<line x1={top[0]} y1={top[1]} x2={tip[0]} y2={tip[1]} stroke={P.bg} strokeWidth={26} strokeLinecap="round" />
					<line x1={top[0]} y1={top[1]} x2={tip[0]} y2={tip[1]} stroke={P.red} strokeWidth={14} strokeLinecap="round" />
				</g>
			)}
			{s > 0 && <circle cx={tip[0]} cy={tip[1]} r={15} fill={cr > 0 ? P.red : P.gold} stroke={P.bg} strokeWidth={5} />}
			{s > 0 && (
				<G x={tip[0]} y={tip[1] + 10} s={pk(f, K.mak)} o={1 - prog(f, K.zys - 5, 5)}>
					<Tag text="CENA" w={180} color={P.gold} swing={steps.reduce((acc, a) => acc + swing(f, a, 9), 0)} />
				</G>
			)}
			<FlatBurst x={CRASH[0]} y={CRASH[1]} at={tCr + 9} r={120} color={P.red} />
			{/* strzałki od maklerów do ceny */}
			{steps.map((a, k) => {
				const p = ip(f, a, a + 7, 0, 1);
				const o = 1 - prog(f, a + 10, 6);
				if (p <= 0 || o <= 0) return null;
				const sx = MB[k % 3];
				const sy = 1000;
				const [tx, ty] = LP[targets[k]];
				const ex = sx + (tx - sx) * p;
				const ey = sy + (ty - sy) * p;
				const ang = Math.atan2(ty - sy, tx - sx);
				return (
					<g key={k} opacity={o} stroke={P.gold} strokeWidth={9} strokeLinecap="round" fill="none">
						<line x1={sx} y1={sy} x2={ex} y2={ey} strokeDasharray="4 22" />
						<path d={`M ${ex - Math.cos(ang - 0.5) * 34} ${ey - Math.sin(ang - 0.5) * 34} L ${ex} ${ey} L ${ex - Math.cos(ang + 0.5) * 34} ${ey - Math.sin(ang + 0.5) * 34}`} strokeLinejoin="round" />
					</g>
				);
			})}
			{/* maklerzy na dole */}
			{MB.map((x, j) => {
				const ring = steps.reduce((acc, a, k) => (k % 3 === j ? Math.max(acc, live(f, a, a + 14, 2)) : acc), 0);
				return (
					<G key={j} x={x} y={1080} s={0.82 * pk(f, K.mak - 6 + j * 3)}>
						<MiniBroker look={LOOKS_B[j + 1]} talk={ring > 0 && Math.floor(f / 3) % 2 === 0} />
						<UnitDesk />
						<Phone f={f} ring={ring} />
						{ring > 0 && <Rings f={f} amp={ring} />}
					</G>
				);
			})}
			{/* sejf firmy */}
			{f >= K.fir - 2 && (
				<G x={BOX.x} y={BOX.y + 92} s={pk(f, K.fir - 2)} sq={boxSq}>
					<g transform="translate(0 -92)">
						<Vault />
					</g>
				</G>
			)}
			{f >= K.fir - 2 && <FText text="FIRMA" x={BOX.x} y={BOX.y + 140} size={40} fill={P.bg} opacity={prog(f, K.fir, 6)} />}
			{/* klienci kupują */}
			{f >= K.kl - 4 &&
				CX.map((x, i) => {
					const enter = ip(f, K.kl - 4 + i * 3, K.kl + 16 + i * 3, 0, 1, EOUT);
					const px = x + 560 * (1 - enter);
					const mood = f >= tCr + 4 ? (f < tCr + 30 ? 'shock' : 'sad') : f >= K.kup ? 'smile' : 'neutral';
					const up = f >= K.kup - 2 && f < K.wypr + 6 + i * 3;
					return (
						<G key={i} x={px} y={FLOOR} s={0.5}>
							<Adult look={CLIENTS[i]} walk={enter > 0 && enter < 0.97} mood={mood} armR={up ? 140 : 12} holdR={up && f < K.wypr + i * 3 ? <Coin r={40} /> : undefined} seed={20 + i} />
						</G>
					);
				})}
			{/* wymiana: monety w górę, akcje w dół */}
			{CX.map((x, i) => {
				const p = clamp01((f - (K.wypr + i * 3)) / 16);
				if (p <= 0 || p >= 1) return null;
				const q = arc(p, x + 93, FLOOR - 243, BOX.x + (i - 1) * 40, BOX.y - 20, 120);
				return (
					<G key={i} x={q.x} y={q.y}>
						<Coin r={22} />
					</G>
				);
			})}
			{[0, 1, 2, 3, 4, 5].map((k) => {
				const p = clamp01((f - (K.wypr + 2 + k * 3)) / 18);
				if (p <= 0 || p >= 1) return null;
				const q = arc(p, BOX.x + ((k % 3) - 1) * 30, BOX.y - 90, CX[k % 3] + 20, FLOOR - 280, 140);
				return (
					<G key={k} x={q.x} y={q.y} r={p * 180 * (k % 2 ? 1 : -1)}>
						<Cert w={60} />
					</G>
				);
			})}
			{f >= K.zys && (
				<G x={BOX.x} y={BOX.y - 160} s={pk(f, K.zys)} r={-6}>
					<FText text="ZYSK" x={0} y={0} size={86} fill={P.gold} stroke={P.navy} sw={12} />
				</G>
			)}
			<FlatBurst x={BOX.x} y={BOX.y} at={K.zys} r={170} />
		</g>
	);
};

// ============ POKÓJ D (ciemny): regulatorzy i związek maklerów ============
const MEM = [150, 300, 780, 930];
const RoomD: React.FC<{f: number}> = ({f}) => {
	const flipP = ip(f, K.y96 - 2, K.y96 + 8, 0, 1, EIO);
	const calSY = Math.max(0.04, Math.abs(Math.cos(Math.PI * flipP)));
	const drop = ip(f, K.sze, K.sze + 16, 0, 900, EIN);
	const tilt = ip(f, K.sze, K.sze + 16, 0, 9, EIN);
	const close = ip(f, K.sze + 8, K.sze + 22, 0, 1, EIO);
	const lensIn = ip(f, K.lup - 8, K.lup + 10, 0, 1, EOUT);
	const lensOut = ip(f, K.zw - 2, K.zw + 12, 0, 1, EIN);
	const lx = 1350 + (560 - 1350) * lensIn + Math.sin((f - K.lup) / 14) * 80 * lensIn + lensOut * 900;
	const ly = 300 + (780 - 300) * lensIn + Math.cos((f - K.lup) / 19) * 50 * lensIn - lensOut * 700;
	const regX = (base: number, j: number) => base + 500 * (1 - ip(f, K.reg - 4 + j * 3, K.reg + 12 + j * 3, 0, 1, EOUT)) + 650 * ip(f, K.zw - 2, K.zw + 14, 0, 1, EIN);
	return (
		<g>
			<DarkRoom f={f} seed={2} />
			{/* kalendarz 1989 → 1996 */}
			{f >= K.y89 - 2 && (
				<G x={180} y={250} s={pk(f, K.y89 - 2)} r={-4}>
					<g transform={`scale(1 ${calSY})`}>
						<Calendar top="ROK" big={flipP < 0.5 ? '1989' : '1996'} w={190} />
					</g>
				</G>
			)}
			{/* członkowie związku */}
			{f >= K.zw &&
				MEM.map((x, j) => {
					const side = j < 2 ? -1 : 1;
					const e = ip(f, K.zw + 2 + j * 3, K.zw + 16 + j * 3, 0, 1, EOUT);
					return (
						<G key={j} x={x + side * 700 * (1 - e) - side * 170 * close} y={FLOOR}>
							<Office w={140} h={380} f={f} seed={j + 2} />
						</G>
					);
				})}
			{f >= K.zw + 8 && (
				<G x={540} y={430}>
					<g transform={`scale(${ip(f, K.zw + 8, K.zw + 18, 0, 1, EBACK)} 1)`}>
						<rect x={-330} y={-42} width={660} height={84} rx={16} fill={P.gold} stroke="#0E1520" strokeWidth={6} />
						<FText text="ZWIĄZEK MAKLERÓW" x={0} y={16} size={46} fill={P.navy} />
					</g>
				</G>
			)}
			{/* Stratton Oakmont: pod lupą, potem wyrzucony z szeregu (zapada się pod podłogę) */}
			<g clipPath="url(#bf-floor)">
				<G x={540} y={FLOOR + drop} r={tilt}>
					<Office w={320} h={560} f={f} seed={1} sign="STRATTON OAKMONT" hl={lensIn > 0.5 && lensOut < 0.5 ? {x: lx - 540, y: ly - FLOOR, r: 150} : undefined} />
					{f >= K.wyr && (
						<G x={0} y={-300} s={stampIn(f, K.wyr)} r={-10} o={clamp01((f - K.wyr) / 3)}>
							<Stamp lines={['WYRZUCONA']} w={420} />
						</G>
					)}
				</G>
			</g>
			<FlatBurst x={540} y={880} at={K.wyr + 4} r={210} color={P.red} />
			{/* regulatorzy */}
			{f >= K.reg - 4 &&
				f < K.zw + 16 &&
				[800, 930].map((x, j) => {
					const px = regX(x, j);
					const moving = (f >= K.reg - 4 + j * 3 && f < K.reg + 12 + j * 3) || f >= K.zw - 2;
					return (
						<G key={j} x={px} y={FLOOR} s={0.62}>
							<Adult look={REGS[j]} walk={moving} armL={j === 0 && f >= K.reg + 10 && f < K.zw ? 95 : 10} talk={j === 0 && f >= K.reg + 4 && f < K.reg + 30} seed={40 + j} />
						</G>
					);
				})}
			{/* lupa */}
			{lensIn > 0 && lensOut < 1 && (
				<G x={lx} y={ly}>
					<Lens r={150} />
				</G>
			)}
		</g>
	);
};

// ============ POKÓJ E (ciemny): straty ludzi i zwrot ============
const PX = [160, 330, 500, 670, 840];
const RoomE: React.FC<{f: number}> = ({f}) => {
	const sh = ip(f, K.zwr + 24, K.zwr + 36, 0, 1, EIO);
	const n200 = Math.round(ip(f, K.m200, K.m200 + 24, 0, 200));
	const n110 = Math.round(ip(f, K.zwr + 26, K.zwr + 46, 0, 110));
	return (
		<g>
			<DarkRoom f={f} seed={3} />
			{PX.map((x, i) => {
				const lost = ip(f, K.str + i * 3, K.str + i * 3 + 40, 0, 11, Easing.linear);
				const gain = ip(f, K.zwr + 28 + i * 2, K.zwr + 52 + i * 2, 0, 6, Easing.linear);
				const n = 12 - lost + gain;
				const mood = f < K.str ? 'neutral' : f < K.str + 30 ? 'shock' : f < K.zwr + 34 ? 'sad' : 'smile';
				const cheer = f >= K.zwr + 34 && f < K.zwr + 60;
				return (
					<g key={i}>
						<G x={x} y={FLOOR}>
							<Pile n={Math.round(n)} seed={i} />
						</G>
						<G x={x} y={FLOOR - n * 16 - 4} s={0.5}>
							<Adult look={CLIENTS[i]} mood={mood} seed={30 + i} armL={cheer ? 150 : f >= K.str && f < K.str + 30 ? 60 : 10} armR={cheer ? 150 : f >= K.str && f < K.str + 30 ? 60 : 10} />
						</G>
					</g>
				);
			})}
			{/* monety uciekają w lewo */}
			{f >= K.str &&
				f < K.str + 80 &&
				PX.map((x, i) =>
					Array.from({length: 11}).map((_, j) => {
						const tj = K.str + i * 3 + (j * 40) / 11;
						const p = clamp01((f - tj) / 22);
						if (p <= 0 || p >= 1) return null;
						const q = arc(EIN(p), x, FLOOR - (12 - j) * 16, -220, 240 + i * 40, 240);
						return (
							<G key={`${i}-${j}`} x={q.x} y={q.y} r={p * 300}>
								<Coin r={22} />
							</G>
						);
					}),
				)}
			{/* 200 mln $ */}
			{f >= K.m200 - 2 && (
				<G x={540} y={330 - 130 * sh} s={pk(f, K.m200 - 2) * (1 - 0.38 * sh)}>
					<rect x={-320} y={-115} width={640} height={230} rx={28} fill={P.bg} stroke={P.red} strokeWidth={10} />
					<FText text={`${n200} mln $`} x={0} y={40} size={150} fill={P.red} />
					<FText text="straty inwestorów" x={0} y={92} size={40} fill={P.slate} />
				</G>
			)}
			{/* 110 mln $ zwrotu */}
			{f >= K.zwr + 24 && (
				<G x={540} y={440} s={pk(f, K.zwr + 24)}>
					<rect x={-320} y={-115} width={640} height={230} rx={28} fill={P.gold} stroke={P.navy} strokeWidth={10} />
					<FText text={`${n110} mln $`} x={0} y={40} size={150} fill={P.navy} />
					<FText text="zwrot zasądzony przez sąd" x={0} y={92} size={38} fill={P.navy} />
				</G>
			)}
			<FlatBurst x={540} y={330} at={K.m200} r={240} color={P.red} />
			<FlatBurst x={540} y={440} at={K.zwr + 26} r={240} />
		</g>
	);
};

// ============ POKÓJ F (jasny): sąd ============
const RoomF: React.FC<{f: number}> = ({f}) => {
	const gav = gavelAngle(f, [K.win, K.zas]);
	const bow = 5 * ip(f, K.prz, K.prz + 8, 0, 1) * (1 - ip(f, K.win + 20, K.win + 32, 0, 1));
	const sig = ip(f, K.prz + 4, K.prz + 18, 0, 1, Easing.linear);
	const tiltS = Math.sin(f / 30) * 3 + (f >= K.win ? swing(f, K.win, 14) : 0) + (f >= K.zas ? swing(f, K.zas, 10) : 0);
	return (
		<g>
			<rect x={0} y={0} width={RW} height={RH} fill={P.bg} />
			<rect x={0} y={0} width={RW} height={820} fill="url(#bf-kpL)" />
			<rect x={0} y={820} width={RW} height={FLOOR - 820} fill={P.paper} />
			<line x1={0} y1={820} x2={RW} y2={820} stroke={P.navy} strokeWidth={6} />
			<rect x={0} y={FLOOR} width={RW} height={RH - FLOOR} fill={P.grey} />
			<G x={600} y={470}>
				<Scales tilt={tiltS} />
			</G>
			{/* sędzia za stołem */}
			<G x={600} y={1040} s={0.9}>
				<Adult look={JUDGE} seed={50} talk={(f >= K.win - 6 && f < K.win + 10) || (f >= K.zas - 4 && f < K.zas + 16)} />
			</G>
			<rect x={360} y={740} width={480} height={30} rx={8} fill={WOOD} stroke={P.navy} strokeWidth={7} />
			<rect x={380} y={770} width={440} height={410} fill={WOOD_D} stroke={P.navy} strokeWidth={7} />
			<rect x={420} y={810} width={360} height={330} rx={10} fill="none" stroke={WOOD} strokeWidth={8} />
			<rect x={792} y={728} width={60} height={14} rx={5} fill={WOOD} stroke={P.navy} strokeWidth={4} />
			<G x={672} y={715}>
				<Gavel ang={gav} />
			</G>
			<FlatBurst x={822} y={730} at={K.win} r={70} color={P.navy} n={10} />
			<FlatBurst x={822} y={730} at={K.zas} r={70} color={P.navy} n={10} />
			{/* makler */}
			<G x={210} y={FLOOR} s={0.9} r={bow}>
				<Adult look={BROKER} mood={f < K.l9 + 4 ? 'neutral' : f >= K.zwr && f < K.zwr + 24 ? 'shock' : 'sad'} seed={1} talk={f >= K.prz && f < K.prz + 12} />
			</G>
			{/* przyznanie się */}
			{f >= K.prz - 4 && (
				<G x={410} y={470} s={pk(f, K.prz - 4)} r={-4}>
					<Doc sig={sig} />
					{f >= K.win && (
						<G x={0} y={30} s={stampIn(f, K.win)} r={-10} o={clamp01((f - K.win) / 3)}>
							<Stamp lines={['WINA']} w={240} />
						</G>
					)}
				</G>
			)}
			<FlatBurst x={410} y={500} at={K.win + 4} r={170} color={P.red} />
			{/* zwrot: monety wyskakują z kieszeni */}
			<FlatBurst x={210} y={860} at={K.zwr} r={120} />
		</g>
	);
};

// ============ POKÓJ P (jasny): więzienie i współpraca z FBI ============
const RoomP: React.FC<{f: number}> = ({f}) => {
	const barsIn = ip(f, K.l10 - 2, K.l10 + 8, 0, 1, EIN);
	const bounce = f > K.l10 + 8 ? -16 * Math.sin((f - K.l10 - 8) / 2) * Math.exp(-(f - K.l10 - 8) / 6) : 0;
	const barsY = -760 * (1 - barsIn) + bounce;
	const v = ip(f, K.m22, K.m22 + 34, 1, 22, EOUT);
	const nCal = Math.floor(v + 0.001);
	const flip = v - nCal;
	const agentIn = ip(f, K.wsp - 6, K.wsp + 12, 0, 1, EOUT);
	const ax = 760 + 520 * (1 - agentIn);
	const fold = 1 + 0.3 * pk(f, K.fbi) - 0.3 * (f >= K.fbi ? Math.min(1, pop(f, K.fbi + 8)) : 0);
	return (
		<g>
			<rect x={0} y={0} width={RW} height={RH} fill={P.bg} />
			<rect x={0} y={0} width={RW} height={FLOOR} fill="url(#bf-kpL)" />
			<rect x={0} y={FLOOR} width={RW} height={RH - FLOOR} fill={P.grey} />
			{/* cela */}
			<rect x={100} y={500} width={520} height={680} fill={P.grey} stroke={P.navy} strokeWidth={7} />
			<rect x={300} y={580} width={120} height={90} rx={6} fill={P.sky} stroke={P.navy} strokeWidth={6} />
			{[330, 360, 390].map((x) => (
				<line key={x} x1={x} y1={580} x2={x} y2={670} stroke={P.navy} strokeWidth={6} />
			))}
			<G x={360} y={FLOOR} s={0.9}>
				<Adult look={BROKER} mood="sad" seed={1} armR={f >= K.fbi - 4 && f < K.fbi + 20 ? 70 : 10} />
			</G>
			<g transform={`translate(0 ${barsY})`}>
				<rect x={96} y={496} width={528} height={22} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={6} />
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={112 + i * 60} y={510} width={16} height={670} rx={8} fill={P.slate} stroke={P.navy} strokeWidth={5} />
				))}
				<rect x={96} y={840} width={528} height={18} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={5} />
			</g>
			{/* 22 miesiące */}
			{f >= K.m22 - 6 && (
				<G x={800} y={320} s={pk(f, K.m22 - 6)} r={3}>
					<g transform={`scale(1 ${1 - 0.25 * Math.sin(Math.PI * flip)})`}>
						<Calendar top="MIESIĄCE" big={String(nCal)} w={210} />
					</g>
				</G>
			)}
			{/* agent FBI */}
			{f >= K.wsp - 6 && (
				<G x={ax} y={FLOOR} s={0.9}>
					<Adult look={AGENT} walk={agentIn > 0 && agentIn < 0.97} armR={f >= K.fbi - 2 ? 60 : 25} seed={60} holdR={<G s={fold}><Folder /></G>} />
				</G>
			)}
			{/* papiery przez kraty */}
			{[0, 1, 2, 3].map((k) => {
				const p = clamp01((f - (K.fbi - 4 + k * 3)) / 16);
				if (p <= 0 || p >= 1) return null;
				const q = arc(p, 470, 860, ax + 120, 1000, 160);
				return (
					<G key={k} x={q.x} y={q.y} r={p * 160 * (k % 2 ? 1 : -1)}>
						<Cert w={56} />
					</G>
				);
			})}
			<FlatBurst x={ax + 140} y={1000} at={K.fbi + 8} r={110} />
		</g>
	);
};

// Monety zwrotu: wyskakują z maklera w sądzie i spadają na stosy poszkodowanych (rząd niżej).
const RefundCoins: React.FC<{f: number}> = ({f}) => {
	if (f < K.zwr || f > K.zwr + 90) return null;
	return (
		<g>
			{Array.from({length: 36}).map((_, k) => {
				const i = k % 5;
				const t0 = K.zwr + 1 + k * 0.8;
				const p = clamp01((f - t0) / 28);
				if (p <= 0 || p >= 1) return null;
				const sx = RW * 3 + 210 + (hsh(k) - 0.5) * 80;
				const sy = 830;
				const ex = RW * 3 + PX[i] + (hsh(k + 7) - 0.5) * 50;
				const ey = RH + FLOOR - 110;
				// podskok z kieszeni, potem swobodny spadek (kamera jedzie za monetami)
				const x = sx + (ex - sx) * p;
				const y = sy + (ey - sy) * p * p - 150 * Math.sin(Math.PI * Math.min(1, p * 3));
				return (
					<G key={k} x={x} y={y} r={p * 420 * (k % 2 ? 1 : -1)}>
						<Coin r={30} />
					</G>
				);
			})}
		</g>
	);
};

const World: React.FC<{cam: {x: number; y: number; z: number}}> = ({cam}) => {
	const f = useCurrentFrame();
	const hw = VCX / cam.z + 220;
	const hh = VCY / cam.z + 220;
	const vis = (ox: number, oy: number) => ox < cam.x + hw && ox + RW > cam.x - hw && oy < cam.y + hh && oy + RH > cam.y - hh;
	const room = (ox: number, oy: number, el: React.ReactNode) => (vis(ox, oy) ? <g transform={`translate(${ox} ${oy})`}>{el}</g> : null);
	return (
		<g>
			<rect x={-8000} y={-8000} width={20000} height={20000} fill={P.paper} />
			{room(0, RH, <DarkRoom f={f} seed={4} />)}
			{room(RW, RH, <RoomC f={f} />)}
			{room(RW * 2, RH, <RoomD f={f} />)}
			{room(RW * 3, RH, <RoomE f={f} />)}
			{room(0, 0, <Room0 f={f} />)}
			{room(RW, 0, <Room1 f={f} />)}
			{room(RW * 2, 0, <RoomP f={f} />)}
			{room(RW * 3, 0, <RoomF f={f} />)}
			<RefundCoins f={f} />
		</g>
	);
};

const HITS: Hit[] = [
	{t: cue(0, 'napompował'), kind: 'punch', amp: 0.5},
	{t: cue(0, 'wyprzedawał') + 0.05, kind: 'both', amp: 1.1},
	{t: cue(1, 'Oakmont') + 0.25, kind: 'punch', amp: 0.5},
	{t: cue(2, '1000'), kind: 'punch', amp: 0.8},
	{t: cue(2, 'dzwoniło'), kind: 'shake', amp: 0.5},
	{t: cue(4, 'zawyżali'), kind: 'punch', amp: 0.6},
	{t: cue(5, 'zyskiem'), kind: 'punch', amp: 0.8},
	{t: cue(5, 'zyskiem') + 0.63, kind: 'shake', amp: 0.9},
	{t: cue(6, '1989'), kind: 'punch', amp: 0.5},
	{t: cue(7, '1996'), kind: 'punch', amp: 0.5},
	{t: cue(7, 'wyrzucił'), kind: 'both', amp: 1.1},
	{t: cue(7, 'szeregów') + 0.35, kind: 'shake', amp: 0.7},
	{t: cue(8, '200'), kind: 'both', amp: 1.0},
	{t: cue(9, 'winy'), kind: 'both', amp: 1.0},
	{t: cue(10) + 0.27, kind: 'shake', amp: 0.8},
	{t: cue(10, 'FBI'), kind: 'punch', amp: 0.6},
	{t: cue(11, 'zasądził'), kind: 'punch', amp: 0.7},
	{t: cue(11, 'zwrot') + 0.85, kind: 'punch', amp: 0.7},
	{t: cue(12, 'rynek') + 0.2, kind: 'punch', amp: 0.6},
	{t: cue(13, 'pewny'), kind: 'punch', amp: 0.5},
];

export const BelfortShort: React.FC = () => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123$+!').then(() => continueRender(handle));
	}, [handle]);
	const cam = camAt(f);
	return (
		<AbsoluteFill style={{backgroundColor: P.bg}}>
			<Camera shots={[{from: 0, to: 999, ox: VCX, oy: VCY, zoom: 1}]} hits={HITS}>
				<svg width={W} height={STAGE} viewBox={`0 0 ${W} ${STAGE}`} style={{position: 'absolute', left: 0, top: 0}}>
					<defs>
						<pattern id="bf-kpL" width={240} height={300} patternUnits="userSpaceOnUse">
							{KEYPAD.map(([x, y], i) => (
								<circle key={i} cx={64 + x * 0.8} cy={90 + y * 1.4} r={5} fill={P.navy} opacity={0.11} />
							))}
						</pattern>
						<pattern id="bf-kpD" width={240} height={300} patternUnits="userSpaceOnUse">
							{KEYPAD.map(([x, y], i) => (
								<circle key={i} cx={64 + x * 0.8} cy={90 + y * 1.4} r={5} fill={P.bg} opacity={0.08} />
							))}
						</pattern>
						<clipPath id="bf-room">
							<rect x={0} y={0} width={RW} height={RH} />
						</clipPath>
						<clipPath id="bf-floor">
							<rect x={-400} y={-600} width={RW + 800} height={FLOOR + 600} />
						</clipPath>
					</defs>
					<g transform={`translate(${VCX - cam.x * cam.z} ${VCY - cam.y * cam.z}) scale(${cam.z})`}>
						<World cam={cam} />
					</g>
				</svg>
			</Camera>
			<div style={{position: 'absolute', left: 0, top: STAGE, width: W, height: H - STAGE, background: P.bg}} />
			<Captions lines={LINES} top={1395} left={60} width={860} size={80} font={FFONT} weight={800} color={P.navy} keyColor={P.red} markColor={P.goldLight} />
			<Audio src={staticFile('belfort_vo.wav')} />
		</AbsoluteFill>
	);
};
