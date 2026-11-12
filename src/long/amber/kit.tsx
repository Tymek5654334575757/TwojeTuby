// Wspólny zestaw filmu „Amber Gold” (Szczęście Pieniędzy Nie Daje): scena z kamerą 16:9 i 9:16, napisy,
// liczniki i rekwizyty wracające w rozdziałach. Styl: płaska paleta P, dynamika TED-Ed (patrz BelfortShort).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, Easing, staticFile, Sequence} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/baloo-2/800.css';
import {P, FFONT, G, Adult, Coin, FText, clamp01, prog, pop, type AdultLook} from '../../kit-flat/flat';
import {Camera, type Hit} from '../../kit/dynamics';
import {Captions, type VoLine} from '../../kit/captions';

export const FPS = 30;
export const HW = 1920; // 16:9
export const HH = 1080;
export const VW = 1080; // 9:16
export const VH = 1920;

// --- czasy -------------------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:!]/g, '');
export const makeT = (lines: VoLine[]) => (li: number, w?: string, nth = 0) => {
	const l = lines[li];
	if (!l) throw new Error(`cue: brak linii ${li}`);
	if (!w) return Math.round(l.s * FPS);
	const hits = l.words.filter((x) => norm(x.w).startsWith(norm(w)));
	if (!hits[nth]) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return Math.round(hits[nth].s * FPS);
};
export const endOf = (lines: VoLine[]) => Math.round(lines[lines.length - 1].e * FPS);

// --- ruch (animation-principles) -----------------------------------------------------
export type Ease = (t: number) => number;
export const EIO: Ease = Easing.bezier(0.65, 0, 0.35, 1);
export const EOUT: Ease = Easing.bezier(0.16, 1, 0.3, 1);
export const EIN: Ease = Easing.bezier(0.7, 0, 0.84, 0);
export const EBACK: Ease = Easing.bezier(0.34, 1.56, 0.64, 1);
export const ip = (f: number, a: number, b: number, v0: number, v1: number, e: Ease = EOUT) =>
	interpolate(f, [a, Math.max(a + 1, b)], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const pk = (f: number, a: number) => (f < a ? 0 : Math.min(1.08, pop(f, a)));
export const live = (f: number, a: number, b: number, fade = 6) => prog(f, a, fade) * (1 - prog(f, b, fade));
export const swing = (f: number, a: number, amp = 10) => (f < a ? 0 : Math.sin((f - a) / 5) * amp * Math.exp(-(f - a) / 26));
export const hsh = (n: number) => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
export const arcPt = (p: number, x0: number, y0: number, x1: number, y1: number, h: number) => ({x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p - h * 4 * p * (1 - p)});
export const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// --- kamera ---------------------------------------------------------------------------
// Klatki kluczowe świata: (x, y) = punkt świata w środku kadru, z = zoom. Dwa klucze z tą samą klatką = cięcie
// (używane do wjazdu w obiekt i wyjazdu z identycznego obiektu w innym miejscu).
export type CK = {f: number; x: number; y: number; z: number; e?: 'io' | 'in' | 'out'};
export const camAt = (keys: CK[], f: number, dips: [number, number, number][] = []) => {
	let c = {x: keys[0].x, y: keys[0].y, z: keys[0].z};
	if (f > keys[0].f) {
		const last = keys[keys.length - 1];
		c = {x: last.x, y: last.y, z: last.z};
		for (let i = 1; i < keys.length; i++) {
			const b = keys[i];
			if (f <= b.f) {
				const a = keys[i - 1];
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
	for (const [a, b, d] of dips) if (f > a && f < b) c.z *= 1 - d * Math.sin(Math.PI * ((f - a) / (b - a)));
	return c;
};

// --- scena ------------------------------------------------------------------------------
// v = układ pionowy (short). Napisy: biały tekst z granatowym obrysem, w strefie wolnej od panelu YouTube.
export const AmberStage: React.FC<{
	v?: boolean;
	lines: VoLine[];
	vo: string;
	keys: CK[];
	dips?: [number, number, number][];
	hits?: Hit[];
	bg?: string;
	defs?: React.ReactNode;
	extra?: React.ReactNode;
	children: (f: number, cam: {x: number; y: number; z: number}) => React.ReactNode;
}> = ({v = false, lines, vo, keys, dips = [], hits = [], bg = P.paper, defs, extra, children}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123456789$€%+–!?').then(() => continueRender(handle));
	}, [handle]);
	const W = v ? VW : HW;
	const H = v ? VH : HH;
	const vcx = W / 2;
	const vcy = v ? 760 : 470;
	const cam = camAt(keys, f, dips);
	return (
		<AbsoluteFill style={{backgroundColor: bg}}>
			<Camera shots={[{from: 0, to: 99999, ox: vcx, oy: vcy, zoom: 1}]} hits={hits}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
					<defs>
						<pattern id="am-kpL" width={240} height={300} patternUnits="userSpaceOnUse">
							{[0, 1, 2].map((c) => [0, 1, 2, 3].map((r) => <circle key={`${c}${r}`} cx={30 + c * 34} cy={40 + r * 34} r={5} fill={P.navy} opacity={0.09} />))}
						</pattern>
						<pattern id="am-kpD" width={240} height={300} patternUnits="userSpaceOnUse">
							{[0, 1, 2].map((c) => [0, 1, 2, 3].map((r) => <circle key={`${c}${r}`} cx={30 + c * 34} cy={40 + r * 34} r={5} fill={P.bg} opacity={0.06} />))}
						</pattern>
						{defs}
					</defs>
					<g transform={`translate(${vcx - cam.x * cam.z} ${vcy - cam.y * cam.z}) scale(${cam.z})`}>{children(f, cam)}</g>
				</svg>
			</Camera>
			{extra}
			{v ? (
				<Captions lines={lines} top={1150} left={70} width={860} size={74} font={FFONT} weight={800} color={P.white} keyColor={P.goldLight} markColor="transparent" outline={P.navy} outlineW={7} />
			) : (
				<Captions lines={lines} top={896} left={260} width={1400} size={54} font={FFONT} weight={800} color={P.white} keyColor={P.goldLight} markColor="transparent" outline={P.navy} outlineW={5} />
			)}
			<Audio src={staticFile(vo)} />
		</AbsoluteFill>
	);
};

// Rozdział = plansza (cardFrames klatek) + scena z lektorem; wewnątrz Sequence klatki liczą się od zera.
export const WithCard: React.FC<{cardFrames: number; card: React.ReactNode; children: React.ReactNode}> = ({cardFrames, card, children}) => (
	<AbsoluteFill>
		<Sequence durationInFrames={cardFrames} layout="none">
			{card}
		</Sequence>
		<Sequence from={cardFrames} layout="none">
			{children}
		</Sequence>
	</AbsoluteFill>
);

// --- tła ------------------------------------------------------------------------------------
export const Room: React.FC<{w: number; h: number; dark?: boolean; floor?: number; tone?: string}> = ({w, h, dark = false, floor = 800, tone}) => (
	<g>
		<rect x={0} y={0} width={w} height={h} fill={tone ?? (dark ? P.navy : P.bg)} />
		<rect x={0} y={0} width={w} height={floor} fill={`url(#${dark ? 'am-kpD' : 'am-kpL'})`} />
		<rect x={0} y={floor} width={w} height={h - floor} fill={dark ? '#162130' : P.grey} />
		<line x1={0} y1={floor} x2={w} y2={floor} stroke={dark ? '#0E1520' : P.navy} strokeWidth={6} opacity={dark ? 1 : 0.5} />
	</g>
);
export const Motes: React.FC<{f: number; w: number; h: number; seed: number}> = ({f, w, h, seed}) => (
	<g fill={P.bg}>
		{Array.from({length: 16}).map((_, i) => {
			const k = seed * 50 + i;
			const x = hsh(k) * w + Math.sin(f / 40 + i) * 12;
			const y = (((hsh(k + 9) * h - f * (0.4 + hsh(k + 4) * 0.5)) % h) + h) % h;
			return <circle key={i} cx={x} cy={y} r={3 + hsh(k + 2) * 4} opacity={0.1} />;
		})}
	</g>
);

// --- liczniki ----------------------------------------------------------------------------------
export const Plate: React.FC<{text: string; label?: string; w?: number; fill?: string; color?: string; stroke?: string; size?: number}> = ({text, label, w = 520, fill = P.navy, color = P.gold, stroke = P.bg, size = 110}) => {
	const h = label ? size * 1.55 + 10 : size * 1.25;
	return (
		<g>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={fill} stroke={stroke} strokeWidth={7} />
			<FText text={text} x={0} y={label ? -h / 2 + size * 0.98 : size * 0.36} size={size} fill={color} />
			{label && <FText text={label} x={0} y={h / 2 - 22} size={Math.round(size * 0.36)} fill={fill === P.navy ? P.bg : P.navy} />}
		</g>
	);
};

// --- rekwizyty --------------------------------------------------------------------------------
export const GoldBar: React.FC<{w?: number; glow?: number}> = ({w = 160, glow = 0}) => {
	const h = w * 0.42;
	return (
		<g>
			{glow > 0 && <ellipse cx={0} cy={-h * 0.3} rx={w * 0.9} ry={w * 0.5} fill={P.goldLight} opacity={0.35 * glow} />}
			<path d={`M ${-w / 2} 0 L ${-w * 0.36} ${-h} L ${w * 0.36} ${-h} L ${w / 2} 0 Z`} fill={P.gold} stroke={P.navy} strokeWidth={Math.max(3, w * 0.035)} strokeLinejoin="round" />
			<path d={`M ${-w * 0.36} ${-h} L ${-w * 0.3} ${-h * 0.72} L ${w * 0.3} ${-h * 0.72} L ${w * 0.36} ${-h}`} fill={P.goldLight} stroke={P.navy} strokeWidth={Math.max(2, w * 0.02)} strokeLinejoin="round" />
			<line x1={-w * 0.2} y1={-h * 0.36} x2={w * 0.2} y2={-h * 0.36} stroke={P.goldDark} strokeWidth={Math.max(2, w * 0.03)} strokeLinecap="round" />
		</g>
	);
};

// Certyfikat (kartka zamiast złota), środek w 0,0.
export const Cert: React.FC<{w?: number}> = ({w = 80}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.62} width={w} height={w * 1.24} rx={w * 0.07} fill={P.white} stroke={P.navy} strokeWidth={Math.max(3, w * 0.06)} />
		<rect x={-w * 0.32} y={-w * 0.44} width={w * 0.64} height={w * 0.15} rx={3} fill={P.gold} />
		{[0, 1, 2].map((i) => (
			<line key={i} x1={-w * 0.3} x2={w * 0.3} y1={-w * 0.08 + i * w * 0.2} y2={-w * 0.08 + i * w * 0.2} stroke={P.grey} strokeWidth={Math.max(3, w * 0.06)} strokeLinecap="round" />
		))}
		<circle cx={w * 0.22} cy={w * 0.44} r={w * 0.1} fill={P.red} opacity={0.8} />
	</g>
);

// Okrągłe drzwi skarbca; open 0..1 obraca je na zawiasie po prawej. Środek w 0,0.
export const VaultDoor: React.FC<{r: number; open?: number; spin?: number}> = ({r, open = 0, spin = 0}) => {
	const sx = Math.cos(open * Math.PI * 0.46);
	return (
		<g>
			<circle r={r * 1.1} fill="#4A5868" stroke={P.navy} strokeWidth={10} />
			<circle r={r * 0.98} fill="#0E1520" />
			<g transform={`translate(${r * 0.98} 0) scale(${sx} 1) translate(${-r * 0.98} 0)`}>
				<circle r={r} fill="#7D8A97" stroke={P.navy} strokeWidth={9} />
				<circle r={r * 0.82} fill="none" stroke="#5C6B7A" strokeWidth={r * 0.05} />
				{Array.from({length: 12}).map((_, i) => {
					const a = (i / 12) * Math.PI * 2;
					return <circle key={i} cx={Math.cos(a) * r * 0.91} cy={Math.sin(a) * r * 0.91} r={r * 0.035} fill="#4A5868" />;
				})}
				<g transform={`rotate(${spin})`}>
					<circle r={r * 0.3} fill="none" stroke={P.gold} strokeWidth={r * 0.055} />
					{[0, 1, 2].map((i) => (
						<line key={i} x1={0} y1={0} x2={Math.cos((i / 3) * Math.PI * 2) * r * 0.42} y2={Math.sin((i / 3) * Math.PI * 2) * r * 0.42} stroke={P.gold} strokeWidth={r * 0.05} strokeLinecap="round" />
					))}
					<circle r={r * 0.08} fill={P.goldDark} />
				</g>
			</g>
		</g>
	);
};

// Prosty człowiek do tłumu (stopy w 0,0, wysokość ok. 220 przy s=1), opcjonalnie z kartką w ręce.
export const Mini: React.FC<{suit: string; hair: string; skin?: string; cert?: boolean; up?: number; mood?: 'ok' | 'sad'; bald?: boolean}> = ({suit, hair, skin = P.skin, cert = false, up = 0, mood = 'ok', bald = false}) => (
	<g>
		<rect x={-26} y={-96} width={20} height={96} rx={9} fill={P.navy} />
		<rect x={6} y={-96} width={20} height={96} rx={9} fill={P.navy} />
		<path d="M -40 -94 L -36 -160 Q 0 -176 36 -160 L 40 -94 Z" fill={suit} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<g transform={`rotate(${-up * 140} 34 -150)`}>
			<line x1={34} y1={-150} x2={46} y2={-96} stroke={suit} strokeWidth={16} strokeLinecap="round" />
			{cert && (
				<g transform="translate(48 -96) rotate(-8)">
					<Cert w={40} />
				</g>
			)}
		</g>
		<line x1={-34} y1={-150} x2={-46} y2={-98} stroke={suit} strokeWidth={16} strokeLinecap="round" />
		<circle cx={0} cy={-196} r={28} fill={skin} stroke={P.navy} strokeWidth={5} />
		{!bald && <path d="M -29 -198 Q -28 -230 0 -228 Q 28 -230 29 -198 Q 16 -212 0 -212 Q -16 -212 -29 -198 Z" fill={hair} stroke={P.navy} strokeWidth={4} />}
		<circle cx={-10} cy={-196} r={3.5} fill={P.navy} />
		<circle cx={10} cy={-196} r={3.5} fill={P.navy} />
		<path d={mood === 'ok' ? 'M -9 -183 Q 0 -177 9 -183' : 'M -9 -178 Q 0 -184 9 -178'} fill="none" stroke={P.navy} strokeWidth={3.5} strokeLinecap="round" />
	</g>
);
const SUITS = ['#5C6B7A', '#6E7D61', '#7A4E3A', '#33445A', '#8C7A5E', '#4A5A6E', '#5C4A3A', '#3B4A42'];
const HAIRS = ['#3B2A20', '#8A8A8A', '#A07850', '#2B2420', '#6B4A2E', '#C9C2B5'];
export const miniLook = (k: number) => ({suit: SUITS[Math.floor(hsh(k) * SUITS.length)], hair: HAIRS[Math.floor(hsh(k + 7) * HAIRS.length)], bald: hsh(k + 3) > 0.86});

// Tłum: rzędy ludzi (tył mniejszy i wyżej). appear(i) -> skala pojawienia się osoby.
export const Crowd: React.FC<{f: number; x0: number; x1: number; floor: number; rows: number; perRow: number; seed: number; appear?: (i: number, row: number) => number; cert?: boolean; up?: (i: number) => number; mood?: 'ok' | 'sad'; size?: number}> = ({
	f,
	x0,
	x1,
	floor,
	rows,
	perRow,
	seed,
	appear,
	cert = true,
	up,
	mood = 'ok',
	size = 1,
}) => {
	const out: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++) {
		const s = (0.62 + r * 0.14) * size;
		const y = floor - (rows - 1 - r) * 34 * size;
		for (let c = 0; c < perRow; c++) {
			const i = r * perRow + c;
			const k = seed * 1000 + i;
			const a = appear ? appear(i, r) : 1;
			if (a <= 0.01) continue;
			const x = x0 + ((c + (r % 2) * 0.5 + (hsh(k + 11) - 0.5) * 0.4) / perRow) * (x1 - x0);
			const bob = Math.sin((f + k * 13) / 9) * 2;
			const L = miniLook(k);
			out.push(
				<g key={i} transform={`translate(${x} ${y + bob}) scale(${s * a})`}>
					<Mini suit={L.suit} hair={L.hair} bald={L.bald} cert={cert} up={up ? up(i) : 0} mood={mood} />
				</g>,
			);
		}
	}
	return <g>{out}</g>;
};

// Budynek z kolumnami (bank / instytucja), środek podstawy w 0,0.
export const Columns: React.FC<{w: number; h: number; label?: string; fill?: string; labelSize?: number}> = ({w, h, label, fill = P.paper, labelSize = 34}) => (
	<g>
		<rect x={-w / 2 - 20} y={-24} width={w + 40} height={24} fill={P.grey} stroke={P.navy} strokeWidth={6} />
		<path d={`M ${-w / 2 - 30} ${-h + 10} L 0 ${-h - h * 0.28} L ${w / 2 + 30} ${-h + 10} Z`} fill={fill} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		<rect x={-w / 2 - 20} y={-h} width={w + 40} height={30} fill={fill} stroke={P.navy} strokeWidth={6} />
		{Array.from({length: 5}).map((_, i) => (
			<rect key={i} x={-w / 2 + (i * (w - 40)) / 4} y={-h + 30} width={40} height={h - 54} fill={fill} stroke={P.navy} strokeWidth={5} />
		))}
		{label && <FText text={label} x={0} y={-h - h * 0.06} size={labelSize} fill={P.navy} />}
	</g>
);

// Samolot z boku, dziób w prawo, środek w 0,0 (długość ok. 420 przy s=1).
export const Plane: React.FC<{tail?: React.ReactNode; body?: string; windows?: number}> = ({tail, body = P.white, windows = 9}) => (
	<g>
		<path d="M -60 -12 L -120 -88 L -70 -88 L 30 -14 Z" fill="#C9D2DA" stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<path d="M -210 -6 Q -200 -40 -150 -40 L 150 -40 Q 210 -40 215 0 Q 210 34 150 34 L -170 34 Q -205 30 -210 -6 Z" fill={body} stroke={P.navy} strokeWidth={6} />
		<path d="M -200 -26 L -236 -110 L -186 -110 L -140 -38 Z" fill={body} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<g transform="translate(-205 -78)">{tail}</g>
		{Array.from({length: windows}).map((_, i) => (
			<circle key={i} cx={-110 + i * 26} cy={-12} r={7} fill="#5C6B7A" />
		))}
		<path d="M 168 -30 Q 200 -28 204 -6 L 176 -6 Z" fill="#5C6B7A" />
		<path d="M -40 12 L -110 80 L -60 80 L 40 14 Z" fill="#AEB8C2" stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
	</g>
);

// Koperta z wypłatą.
export const Envelope: React.FC<{w?: number}> = ({w = 90}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.32} width={w} height={w * 0.64} rx={6} fill={P.paper} stroke={P.navy} strokeWidth={5} />
		<path d={`M ${-w / 2} ${-w * 0.32} L 0 ${w * 0.06} L ${w / 2} ${-w * 0.32}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<FText text="zł" x={0} y={w * 0.27} size={w * 0.26} fill={P.goldDark} />
	</g>
);

// Koło zębate.
export const Gear: React.FC<{r: number; teeth?: number; ang?: number; fill?: string}> = ({r, teeth = 10, ang = 0, fill = '#7D8A97'}) => {
	let d = '';
	for (let i = 0; i < teeth * 2; i++) {
		const a0 = (i / (teeth * 2)) * Math.PI * 2;
		const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
		const rr = i % 2 ? r : r * 1.18;
		d += `${i ? 'L' : 'M'} ${Math.cos(a0) * rr} ${Math.sin(a0) * rr} L ${Math.cos(a1) * rr} ${Math.sin(a1) * rr} `;
	}
	return (
		<g transform={`rotate(${ang})`}>
			<path d={d + 'Z'} fill={fill} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
			<circle r={r * 0.3} fill={P.navy} />
		</g>
	);
};

// Tabliczka ostrzegawcza na gwoździu (gwóźdź w 0,0).
export const WarnSign: React.FC<{text?: string; w?: number; ang?: number}> = ({text = 'OSTRZEŻENIE', w = 360, ang = 0}) => (
	<g transform={`rotate(${ang})`}>
		<line x1={0} y1={0} x2={-w * 0.3} y2={44} stroke={P.navy} strokeWidth={4} />
		<line x1={0} y1={0} x2={w * 0.3} y2={44} stroke={P.navy} strokeWidth={4} />
		<rect x={-w / 2} y={44} width={w} height={w * 0.3} rx={12} fill={P.gold} stroke={P.navy} strokeWidth={7} />
		<path d={`M ${-w / 2 + 34} ${44 + w * 0.24} L ${-w / 2 + 58} ${44 + w * 0.06} L ${-w / 2 + 82} ${44 + w * 0.24} Z`} fill={P.navy} />
		<FText text="!" x={-w / 2 + 58} y={44 + w * 0.22} size={w * 0.1} fill={P.gold} />
		<FText text={text} x={w * 0.08} y={44 + w * 0.19} size={w * 0.1} fill={P.navy} />
		<circle r={8} fill={P.slate} stroke={P.navy} strokeWidth={3} />
	</g>
);

// Plansza rozdziału (16:9 lub 9:16): numer + tytuł + ikona.
export const ChapterCard: React.FC<{f: number; at: number; dur?: number; num: string; title: string; w: number; h: number; icon?: React.ReactNode}> = ({f, at, dur = 70, num, title, w, h, icon}) => {
	if (f < at || f > at + dur) return null;
	const p = ip(f, at, at + 14, 0, 1, EOUT);
	const out = ip(f, at + dur - 10, at + dur, 0, 1, EIN);
	return (
		<g opacity={1 - out}>
			<rect x={0} y={0} width={w} height={h} fill={P.navy} opacity={0.94} />
			<g transform={`translate(${w / 2} ${h * 0.42}) scale(${pk(f, at)}) rotate(${(1 - p) * -30})`}>{icon}</g>
			<FText text={num} x={w / 2} y={h * 0.6} size={Math.round(h * 0.07)} fill={P.gold} opacity={p} />
			<FText text={title} x={w / 2} y={h * 0.6 + h * 0.11} size={Math.round(h * 0.09)} fill={P.bg} opacity={prog(f, at + 6, 10)} />
		</g>
	);
};

export {P, FFONT, G, Adult, Coin, FText, clamp01, prog, pop};
export type {AdultLook, Hit, VoLine};

// Plansza rozdziału jako osobna scena (pierwsze cardFrames klatek rozdziału).
export const CardScene: React.FC<{num: string; title: string; icon?: React.ReactNode; v?: boolean; frames?: number}> = ({num, title, icon, v = false, frames = 60}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123456789').then(() => continueRender(handle));
	}, [handle]);
	const W = v ? VW : HW;
	const H = v ? VH : HH;
	return (
		<AbsoluteFill style={{backgroundColor: P.navy}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<rect x={0} y={0} width={W} height={H} fill="url(#am-kpD2)" />
				<defs>
					<pattern id="am-kpD2" width={240} height={300} patternUnits="userSpaceOnUse">
						{[0, 1, 2].map((c) => [0, 1, 2, 3].map((r) => <circle key={`${c}${r}`} cx={30 + c * 34} cy={40 + r * 34} r={5} fill={P.bg} opacity={0.06} />))}
					</pattern>
				</defs>
				<ChapterCard f={f + 0.0001} at={0} dur={frames} num={num} title={title} w={W} h={H} icon={icon} />
			</svg>
		</AbsoluteFill>
	);
};

// Końcówka shortu (9:16): zaproszenie do całego filmu, lektor amcta.
import {LINES as CTA_LINES} from './amcta.gen';
export const CTA_FRAMES = endOf(CTA_LINES) + 24;
export const CtaScene: React.FC = () => (
	<AmberStage v lines={CTA_LINES} vo="amcta_vo.wav" keys={[{f: 0, x: 540, y: 760, z: 1.08}, {f: CTA_FRAMES, x: 540, y: 760, z: 1}]}>
		{(f) => (
			<g>
				<Room w={VW} h={VH} floor={1180} dark />
				<rect x={290} y={170} width={500} height={92} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={7} />
				<FText text="AMBER GOLD" x={540} y={236} size={60} fill={P.navy} />
				<G x={540} y={620} s={pk(f, 0) || 1}>
					<VaultDoor r={260} spin={f * 4} open={ip(f, 20, 40, 0, 0.6, EOUT)} />
				</G>
				<G x={540} y={620} s={pk(f, 34)}>
					<circle r={120} fill={P.gold} stroke={P.navy} strokeWidth={8} />
					<path d="M -36 -60 L 66 0 L -36 60 Z" fill={P.navy} />
				</G>
				<FText text="cały film" x={540} y={1010} size={110} fill={P.gold} stroke={P.navy} sw={12} opacity={prog(f, 10, 8)} />
			</g>
		)}
	</AmberStage>
);
// Short = scena rozdziału (v) + końcówka.
export const ShortWithCta: React.FC<{sceneFrames: number; children: React.ReactNode}> = ({sceneFrames, children}) => (
	<AbsoluteFill>
		<Sequence durationInFrames={sceneFrames} layout="none">
			{children}
		</Sequence>
		<Sequence from={sceneFrames} layout="none">
			<CtaScene />
		</Sequence>
	</AbsoluteFill>
);
