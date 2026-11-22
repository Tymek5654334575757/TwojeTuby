// Zestaw filmu „5 manipulacji z codziennego życia” (Psychorożek): styl szkicowy (rough.js, Caveat, papier).
// Scena z kamerą w 16:9 i 9:16, pokoje w rzędzie co RW, motyw sznurków marionetki, stała metamorfoza
// „Jak to rozpoznać?” (postać → znak zapytania → żarówka), rekwizyty eksperymentów i short = film bez zdań [tylko film].
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, delayRender, continueRender, useCurrentFrame, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, Scribble, clamp01} from '../../kit/sketch';
import {QMark} from '../../kit/figures';
import {Captions, type VoLine} from '../../kit/captions';
import {Camera, type Hit} from '../../kit/dynamics';
import {camAt, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, prog, pop, G, type CK} from '../amber/kit';
import {LINES as CTA_LINES} from './mpcta.gen';

export {C, Rough, Txt, Scribble, clamp01, QMark, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, prog, pop, G};
export type {CK, Hit, VoLine};

export const FPS = 30;
export const HW = 1920;
export const HH = 1080;
export const VW = 1080;
export const VH = 1920;
export const RW = 2400; // odstęp pokoi
export const GREY = '#8A8072';
export const LIGHT = '#E6DCC6';
// kolory sznurków / ikon sztuczek 1–5
export const SC = ['#FFC93C', '#3A86FF', '#8A8072', '#5BAE6A', '#E4572E'];
export const NAMES = ['darmowy prezent', 'drzwi zatrzaśnięte przed nosem', 'kotwica', 'zostały tylko 2 sztuki', 'niska piłka'];
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Ujęcia: [klatka docelowa, pokój, [dx, dy, z] 16:9, [dx, dy, z] 9:16, czas przejazdu]. Przejazd kończy się w klatce docelowej.
export type Shot = [number, number, [number, number, number], [number, number, number], number?];
export const shots = (v: boolean, list: Shot[]): CK[] => {
	const out: CK[] = [];
	list.forEach(([f, i, h, vv, d = 14], k) => {
		if (k > 0) {
			const prev = out[out.length - 1];
			out.push({...prev, f: Math.max(prev.f + 1, f - d)});
		}
		out.push({...ck(v, Math.max(k > 0 ? out[out.length - 1].f + 1 : f, f), i, h, vv), e: 'io'});
	});
	return out;
};
// Czy pokój [a, b] jest aktywny (z zapasem na przejazdy kamery).
export const on = (f: number, a: number, b: number, pad = 24) => f >= a - pad && f <= b + pad;
// Koperta (zwykłe SVG — do wielu sztuk naraz).
export const Env: React.FC<{x: number; y: number; s?: number; r?: number; o?: number; fill?: string}> = ({x, y, s = 1, r = 0, o = 1, fill = C.paper}) => (
	<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
		<rect x={-30} y={-20} width={60} height={40} fill={fill} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
		<path d="M -30 -20 L 0 4 L 30 -20" fill="none" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
	</g>
);
export const House: React.FC<{x: number; y: number; s?: number; o?: number; lit?: boolean}> = ({x, y, s = 1, o = 1, lit = false}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
		<path d="M -40 0 L -40 -50 L 0 -84 L 40 -50 L 40 0 Z" fill={lit ? '#FFF1C4' : C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
		<rect x={-10} y={-26} width={20} height={26} fill={C.ink} />
	</g>
);

// Klucz kamery: pokój i, przesunięcie od środka pokoju i zoom osobno dla 16:9 (h) i 9:16 (vv).
export const ck = (v: boolean, f: number, i: number, h: [number, number, number], vv: [number, number, number], e?: CK['e']): CK => {
	const [dx, dy, z] = v ? vv : h;
	return {f, x: i * RW + 960 + dx, y: 540 + dy, z, e};
};
// Pozycja zależna od układu.
export const pv = <T,>(v: boolean, h: T, vv: T): T => (v ? vv : h);
export const hitsAt = (list: [number, number][], kind: Hit['kind'] = 'punch'): Hit[] => list.map(([fr, amp]) => ({t: fr / FPS, kind, amp}));

// --- scena -------------------------------------------------------------------------------
const VCY = 780;
export const Stage: React.FC<{
	v?: boolean;
	lines: VoLine[];
	vo: string;
	keys: CK[];
	hits?: Hit[];
	head?: React.ReactNode;
	caps?: boolean;
	children: (f: number) => React.ReactNode;
}> = ({v = false, lines, vo, keys, hits = [], head, caps, children}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”…?!×→§%').then(() => continueRender(handle));
	}, [handle]);
	const W = v ? VW : HW;
	const H = v ? VH : HH;
	const vcx = W / 2;
	const vcy = v ? VCY : HH / 2;
	const cam = camAt(keys, f);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
				<Paper w={W} h={H} />
			</svg>
			<Camera shots={[{from: 0, to: 99999, ox: vcx, oy: vcy, zoom: 1}]} hits={hits}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
					<g transform={`translate(${vcx - cam.x * cam.z} ${vcy - cam.y * cam.z}) scale(${cam.z})`}>{children(f)}</g>
				</svg>
			</Camera>
			{v && head}
			{(caps ?? v) && <Captions lines={lines} top={1345} left={60} width={960} size={86} />}
			<Audio src={staticFile(vo)} />
		</AbsoluteFill>
	);
};

// Nagłówek shortu (od klatki 0): ikona sztuczki i nazwa.
export const VHead: React.FC<{i: number}> = ({i}) => {
	const name = NAMES[i];
	const size = Math.min(96, Math.round(1800 / name.length));
	return (
		<svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{position: 'absolute', inset: 0}}>
			<rect x={0} y={0} width={VW} height={236} fill={C.paper} />
			<Rough shape={{t: 'line', x1: 40, y1: 236, x2: 1040, y2: 236}} o={{strokeWidth: 5, stroke: GREY}} seed={3} />
			<G x={70} y={52}>
				<IconBox i={i} />
			</G>
			<Txt text={`manipulacja ${i + 1} z 5`} x={244} y={104} size={56} color={GREY} anchor="start" seed={5} />
			<Txt text={name} x={244} y={194} size={size} color={C.red} anchor="start" seed={6} />
		</svg>
	);
};

// Rozdział = plansza + scena (jak w filmach Szczęścia).
export const CARD = 48;
export const WithCard: React.FC<{card: React.ReactNode; children: React.ReactNode}> = ({card, children}) => (
	<AbsoluteFill>
		<Sequence durationInFrames={CARD} layout="none">
			{card}
		</Sequence>
		<Sequence from={CARD} layout="none">
			{children}
		</Sequence>
	</AbsoluteFill>
);
export const TrickCard: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ').then(() => continueRender(handle));
	}, [handle]);
	const name = NAMES[i];
	const size = Math.min(210, Math.round(3000 / name.length));
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={HW} height={HH} viewBox={`0 0 ${HW} ${HH}`}>
				<Paper w={HW} h={HH} />
				<G x={960} y={290} s={1.35 * pk(f, 0)}>
					<G x={-75} y={-75}>
						<IconBox i={i} />
					</G>
				</G>
				<Txt text={`manipulacja ${i + 1}`} x={960} y={560} size={96} draw={prog(f, 4, 10)} seed={11} />
				<Txt text={name} x={960} y={760} size={size} color={C.red} draw={prog(f, 8, 16)} seed={12} />
				<Rough shape={{t: 'line', x1: 960 - name.length * size * 0.22, y1: 800, x2: 960 + name.length * size * 0.22, y2: 800}} o={{stroke: SC[i], strokeWidth: 10}} draw={prog(f, 18, 12)} seed={13} />
			</svg>
		</AbsoluteFill>
	);
};

// --- postać „ty” (marionetka) ---------------------------------------------------------------
export type Arms = 'down' | 'up' | 'reach' | 'hold' | 'shrug' | 'wave' | 'point' | 'hips';
const ARMS: Record<Arms, [[number, number], [number, number]]> = {
	down: [
		[-50, -135],
		[50, -135],
	],
	up: [
		[-72, -300],
		[72, -300],
	],
	reach: [
		[-50, -135],
		[118, -225],
	],
	hold: [
		[66, -168],
		[96, -172],
	],
	shrug: [
		[-84, -236],
		[84, -236],
	],
	wave: [
		[-50, -135],
		[86, -320],
	],
	point: [
		[-50, -135],
		[122, -212],
	],
	hips: [
		[-46, -150],
		[46, -150],
	],
};
export type Str = {c: string; at: 'head' | 'l' | 'r' | 'lf' | 'rf'; p: number; slack?: number; snap?: number; dx?: number};
export type Mood = 'smile' | 'flat' | 'worry' | 'wow' | 'grin';

// (x, y) = punkt między stopami. Głowa ok. 270 wyżej (przy s = 1).
export const Hero: React.FC<{
	x: number;
	y: number;
	s?: number;
	draw?: number;
	seed?: number;
	arms?: Arms;
	hands?: [[number, number], [number, number]];
	look?: number;
	mood?: Mood;
	walk?: number;
	lean?: number;
	strings?: Str[];
	top?: number;
	color?: string;
	fill?: string;
	opacity?: number;
	flip?: boolean;
	bend?: number;
	hat?: React.ReactNode;
	wink?: boolean;
	children?: React.ReactNode;
}> = ({x, y, s = 1, draw = 1, seed = 500, arms = 'down', hands, look = 0, mood = 'flat', walk, lean = 0, strings = [], top = -80, color = C.ink, fill = C.paper, opacity = 1, flip = false, bend = 0, hat, wink = false, children}) => {
	const f = useCurrentFrame();
	if (draw <= 0 || opacity <= 0) return null;
	const step = Math.floor(f / 3);
	const bob = walk != null ? Math.abs(Math.sin(walk / 4)) * -8 : Math.sin(step * 0.55 + seed) * 3;
	const sw = walk != null ? Math.sin(walk / 4) * 34 : 0;
	const [hl, hr] = hands ?? ARMS[arms];
	const blink = (f + Math.floor(hsh(seed) * 90)) % 97 < 3;
	const o = {stroke: color, strokeWidth: 6};
	const hy = -270 + bend * 70;
	const sh = -200 + bend * 60;
	const hip = -100 + bend * 20;
	const pts: Record<Str['at'], [number, number]> = {head: [0, hy - 38], l: hl, r: hr, lf: [-48 + sw, 0], rf: [48 - sw, 0]};
	const mouth =
		mood === 'smile' ? 'M -14 10 Q 0 22 14 10' : mood === 'grin' ? 'M -18 6 Q 0 28 18 6 Z' : mood === 'worry' ? 'M -13 18 Q 0 8 13 18' : mood === 'wow' ? '' : 'M -12 14 L 12 14';
	const topL = (top - y) / s;
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${(flip ? -1 : 1) * s} ${s})`} opacity={opacity}>
			<g transform={`rotate(${lean} 0 0)`}>
				<Rough shape={{t: 'lpath', pts: [[-48 + sw, 0], [0, hip], [48 - sw, 0]]}} o={o} draw={draw} seed={seed + 3} />
				<Rough shape={{t: 'line', x1: 0, y1: hy + 38, x2: bend * 30, y2: hip}} o={o} draw={draw} seed={seed + 1} />
				<Rough shape={{t: 'lpath', pts: [hl, [bend * 26, sh], hr]}} o={o} draw={draw} seed={seed + 2} />
				{children}
				<Rough shape={{t: 'circle', cx: bend * 34, cy: hy, d: 76}} o={{...o, fill, fillStyle: 'solid'}} draw={draw} seed={seed} />
				<g opacity={clamp01(draw * 2 - 1)} transform={`translate(${bend * 34 + look * 8} ${hy})`}>
					{blink ? (
						<g stroke={color} strokeWidth={4} strokeLinecap="round">
							<line x1={-17} y1={-4} x2={-7} y2={-4} />
							<line x1={7} y1={-4} x2={17} y2={-4} />
						</g>
					) : (
						<g fill={color}>
							<circle cx={-12} cy={-4} r={4.5} />
							{wink ? <path d="M 5 -2 Q 12 -10 19 -2" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" /> : <circle cx={12} cy={-4} r={4.5} />}
						</g>
					)}
					{mood === 'wow' ? <circle cx={0} cy={15} r={7} fill="none" stroke={color} strokeWidth={4} /> : <path d={mouth} fill={mood === 'grin' ? color : 'none'} stroke={color} strokeWidth={4} strokeLinecap="round" />}
				</g>
				{hat && <g transform={`translate(${bend * 34} ${hy})`}>{hat}</g>}
			</g>
			{strings.map((st, k) => {
				if (st.p <= 0) return null;
				const [ax, ay] = pts[st.at];
				const tx = ax + (st.dx ?? 0);
				const snap = st.snap ?? 0;
				if (snap > 0) {
					// pęknięty sznurek: górna część odskakuje w górę, dolna opada
					const up = snap * 260;
					return (
						<g key={k} opacity={1 - clamp01((snap - 0.6) * 2.5)}>
							<path d={`M ${tx} ${topL} L ${tx} ${lerp(ay - 120, topL + 40, snap)}`} stroke={st.c} strokeWidth={4} fill="none" strokeLinecap="round" />
							<path d={`M ${ax} ${ay} Q ${ax + 30 * snap} ${ay - 60 + up * 0.2} ${ax + 50 * snap} ${ay - 90 + up * 0.5}`} stroke={st.c} strokeWidth={4} fill="none" strokeLinecap="round" />
						</g>
					);
				}
				const yEnd = lerp(topL, ay, st.p);
				const sl = st.slack ?? 0;
				const midY = (topL + yEnd) / 2;
				const wob = Math.sin(step * 0.7 + k) * 3;
				return <path key={k} d={`M ${tx} ${topL} Q ${tx + sl * 90 + wob} ${midY + sl * 120} ${ax} ${yEnd + sl * 40}`} stroke={st.c} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
			})}
		</g>
	);
};

// Inna osoba (bez sznurków). Kitel = badacz; tray = taca; badge = plakietka.
export const Other: React.FC<{x: number; y: number; s?: number; draw?: number; seed?: number; arms?: Arms; hands?: [[number, number], [number, number]]; look?: number; mood?: Mood; coat?: boolean; hair?: 'long' | 'bun' | 'none'; walk?: number; flip?: boolean; opacity?: number; children?: React.ReactNode; color?: string; wink?: boolean; lean?: number; bend?: number}> = ({
	x,
	y,
	s = 1,
	draw = 1,
	seed = 700,
	arms = 'down',
	hands,
	look = 0,
	mood = 'flat',
	coat = false,
	hair = 'none',
	walk,
	flip = false,
	opacity = 1,
	children,
	color,
	wink,
	lean,
	bend,
}) => (
	<Hero
		wink={wink}
		lean={lean}
		bend={bend}
		x={x}
		y={y}
		s={s}
		draw={draw}
		seed={seed}
		arms={arms}
		hands={hands}
		look={look}
		mood={mood}
		walk={walk}
		flip={flip}
		opacity={opacity}
		color={color}
		hat={
			hair === 'long' ? (
				<Rough shape={{t: 'path', d: 'M -40 6 C -52 -60 52 -60 40 6 L 46 40 M -40 6 L -46 40'}} o={{strokeWidth: 6}} draw={draw} seed={seed + 9} />
			) : hair === 'bun' ? (
				<Rough shape={{t: 'circle', cx: 0, cy: -46, d: 30}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 9} />
			) : undefined
		}
	>
		{coat && <Rough shape={{t: 'poly', pts: [[-40, -228], [40, -228], [52, -92], [-52, -92]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 7} />}
		{coat && <Rough shape={{t: 'line', x1: 0, y1: -228, x2: 0, y2: -92}} o={{strokeWidth: 4}} draw={draw} seed={seed + 8} />}
		{children}
	</Hero>
);

// Metamorfoza „Jak to rozpoznać?”: drgania → gumka → znak zapytania (a) → żarówka (b). Do chwili `until`.
export const Aha: React.FC<{x: number; y: number; s?: number; a: number; b: number; until?: number}> = ({x, y, s = 1, a, b, until = 1e9}) => {
	const f = useCurrentFrame();
	if (f < a - 2 || f > until + 10) return null;
	const out = 1 - prog(f, until, 10);
	const q = prog(f, a + 2, 16) * (1 - prog(f, b - 2, 6));
	const sc = prog(f, a - 2, 8) * (1 - prog(f, a + 8, 8));
	const sc2 = live(f, b - 6, b + 4, 4);
	const lit = prog(f, b + 2, 14);
	return (
		<g opacity={out} transform={`translate(${x} ${y}) scale(${s})`}>
			<Scribble x={-90} y={-330} w={180} h={330} draw={sc} seed={81} />
			{q > 0 && (
				<g transform={`translate(0 -190) rotate(${swing(f, a + 6, 8)})`}>
					<QMark x={0} y={0} s={0.62} draw={q} seed={140} />
				</g>
			)}
			<Scribble x={-90} y={-330} w={180} h={300} draw={sc2} seed={82} />
			{f >= b - 2 && (
				<g transform={`translate(0 -190) scale(${0.6 + 0.4 * pk(f, b)})`}>
					<Bulb lit={lit} draw={prog(f, b - 2, 12)} />
				</g>
			)}
		</g>
	);
};
export const Bulb: React.FC<{lit?: number; draw?: number; s?: number}> = ({lit = 1, draw = 1, s = 1}) => (
	<g transform={`scale(${s})`}>
		{lit > 0 &&
			[0, 1, 2, 3, 4, 5, 6].map((k) => {
				const an = -Math.PI + (k / 6) * Math.PI;
				return <Rough key={k} shape={{t: 'line', x1: Math.cos(an) * 120, y1: -30 + Math.sin(an) * 120, x2: Math.cos(an) * (150 + 20 * lit), y2: -30 + Math.sin(an) * (150 + 20 * lit)}} o={{strokeWidth: 7, stroke: C.ink}} draw={lit} seed={90 + k} />;
			})}
		<Rough shape={{t: 'circle', cx: 0, cy: -30, d: 170}} o={{fill: lit > 0.05 ? C.yellow : C.paper, fillStyle: lit > 0.05 ? 'hachure' : 'solid', hachureGap: 9, fillWeight: 4, strokeWidth: 7}} draw={draw} seed={84} />
		<Rough shape={{t: 'rect', x: -38, y: 46, w: 76, h: 54}} o={{fill: GREY, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 6}} draw={draw} seed={85} />
		<Rough shape={{t: 'lpath', pts: [[-22, 40], [-14, -30], [0, -10], [14, -30], [22, 40]]}} o={{strokeWidth: 5}} draw={draw} seed={86} />
	</g>
);

// --- ikony sztuczek (kratka 150×150) ------------------------------------------------------------
export const Icon: React.FC<{i: number; seed?: number}> = ({i, seed = 600}) => {
	const c = SC[i];
	if (i === 0)
		return (
			<g>
				<Rough shape={{t: 'rect', x: 32, y: 62, w: 86, h: 64}} o={{fill: c, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={seed} />
				<Rough shape={{t: 'rect', x: 26, y: 46, w: 98, h: 22}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={seed + 1} />
				<Rough shape={{t: 'line', x1: 75, y1: 46, x2: 75, y2: 126}} o={{strokeWidth: 6}} seed={seed + 2} />
				<Rough shape={{t: 'path', d: 'M 75 46 C 50 20 40 40 75 46 C 110 20 100 40 75 46'}} o={{strokeWidth: 5}} seed={seed + 3} />
			</g>
		);
	if (i === 1)
		return (
			<g>
				<Rough shape={{t: 'rect', x: 40, y: 22, w: 70, h: 108}} o={{fill: c, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={seed} />
				<Rough shape={{t: 'circle', cx: 96, cy: 80, d: 10}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 3}} seed={seed + 1} />
				<Rough shape={{t: 'line', x1: 24, y1: 130, x2: 126, y2: 130}} o={{strokeWidth: 6}} seed={seed + 2} />
			</g>
		);
	if (i === 2)
		return (
			<g transform="translate(75 75) scale(0.5)">
				<AnchorShape fill={c} />
			</g>
		);
	if (i === 3)
		return (
			<g>
				<Rough shape={{t: 'path', d: 'M 42 44 L 108 44 L 112 128 L 38 128 Z'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={seed} />
				<Rough shape={{t: 'rect', x: 46, y: 26, w: 58, h: 18}} o={{fill: c, fillStyle: 'solid', strokeWidth: 5}} seed={seed + 1} />
				<Rough shape={{t: 'circle', cx: 62, cy: 110, d: 26}} o={{fill: '#C98A4B', fillStyle: 'solid', strokeWidth: 4}} seed={seed + 2} />
				<Rough shape={{t: 'circle', cx: 90, cy: 112, d: 26}} o={{fill: '#C98A4B', fillStyle: 'solid', strokeWidth: 4}} seed={seed + 3} />
			</g>
		);
	return (
		<g>
			<Rough shape={{t: 'circle', cx: 75, cy: 78, d: 92}} o={{fill: c, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={seed} />
			<Rough shape={{t: 'arc', cx: 75, cy: 78, w: 60, h: 92, a0: -1.4, a1: 1.4}} o={{strokeWidth: 5}} seed={seed + 1} />
			<Rough shape={{t: 'line', x1: 20, y1: 138, x2: 130, y2: 138}} o={{strokeWidth: 5, stroke: GREY}} seed={seed + 2} />
		</g>
	);
};
export const IconBox: React.FC<{i: number; done?: number}> = ({i, done = 0}) => (
	<g>
		<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={610 + i} />
		<Icon i={i} seed={620 + i * 5} />
		{done > 0 && <Rough shape={{t: 'lpath', pts: [[20, 76], [62, 126], [156, -10]]}} o={{stroke: C.red, strokeWidth: 12}} draw={done} seed={650 + i} />}
	</g>
);

// --- rekwizyty ------------------------------------------------------------------------------------
export const AnchorShape: React.FC<{fill?: string; seed?: number}> = ({fill = GREY, seed = 700}) => (
	<g>
		<Rough shape={{t: 'circle', cx: 0, cy: -110, d: 50}} o={{strokeWidth: 9}} seed={seed} />
		<Rough shape={{t: 'line', x1: 0, y1: -86, x2: 0, y2: 110}} o={{strokeWidth: 14, stroke: C.ink}} seed={seed + 1} />
		<Rough shape={{t: 'line', x1: -60, y1: -50, x2: 60, y2: -50}} o={{strokeWidth: 12}} seed={seed + 2} />
		<Rough shape={{t: 'path', d: 'M -110 30 Q -90 120 0 118 Q 90 120 110 30'}} o={{strokeWidth: 14, stroke: C.ink}} seed={seed + 3} />
		<Rough shape={{t: 'poly', pts: [[-122, 10], [-96, 44], [-132, 52]]}} o={{fill, fillStyle: 'solid', strokeWidth: 6}} seed={seed + 4} />
		<Rough shape={{t: 'poly', pts: [[122, 10], [96, 44], [132, 52]]}} o={{fill, fillStyle: 'solid', strokeWidth: 6}} seed={seed + 5} />
	</g>
);
// Łańcuch z ogniw od (x0,y0) do (x1,y1), p = ile narysowane.
export const ChainLink: React.FC<{x0: number; y0: number; x1: number; y1: number; p?: number; sag?: number; w?: number}> = ({x0, y0, x1, y1, p = 1, sag = 0, w = 5}) => {
	const len = Math.hypot(x1 - x0, y1 - y0);
	const n = Math.max(2, Math.round(len / 34));
	const out: React.ReactNode[] = [];
	for (let k = 0; k < n * p; k++) {
		const t = (k + 0.5) / n;
		const x = lerp(x0, x1, t);
		const y = lerp(y0, y1, t) + sag * 4 * t * (1 - t);
		const t2 = (k + 1.5) / n;
		const an = (Math.atan2(lerp(y0, y1, t2) + sag * 4 * t2 * (1 - t2) - y, lerp(x0, x1, t2) - x) * 180) / Math.PI;
		out.push(<ellipse key={k} cx={x} cy={y} rx={k % 2 ? 16 : 19} ry={k % 2 ? 4 : 9} transform={`rotate(${an} ${x} ${y})`} fill="none" stroke={C.ink} strokeWidth={w} />);
	}
	return <g>{out}</g>;
};
export const Bottle: React.FC<{s?: number; draw?: number; seed?: number; fill?: string}> = ({s = 1, draw = 1, seed = 710, fill = '#B8573A'}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -14 -150 L 14 -150 L 16 -110 C 40 -80 34 -50 30 -20 C 40 10 40 40 34 70 L -34 70 C -40 40 -40 10 -30 -20 C -34 -50 -40 -80 -16 -110 Z'}} o={{fill, fillStyle: 'hachure', hachureGap: 8, fillWeight: 3.5, strokeWidth: 6}} draw={draw} seed={seed} />
		<Rough shape={{t: 'rect', x: -17, y: -164, w: 34, h: 16}} o={{fill: GREY, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 1} />
	</g>
);
// Metka z ceną. strike 0–1 przekreśla; sub = drugi wiersz (np. nowa cena).
export const PriceTag: React.FC<{text: string; w?: number; strike?: number; sub?: string; subDraw?: number; subColor?: string; size?: number; seed?: number; draw?: number; fill?: string}> = ({text, w = 300, strike = 0, sub, subDraw = 1, subColor = C.red, size = 96, seed = 720, draw = 1, fill = C.paper}) => {
	const h = sub ? w * 0.78 : w * 0.52;
	return (
		<g>
			<Rough shape={{t: 'poly', pts: [[-w / 2, -h / 2 + 30], [-w / 2 + 40, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2 + 40, h / 2], [-w / 2, h / 2 - 30]]}} o={{fill, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
			<Rough shape={{t: 'circle', cx: -w / 2 + 34, cy: 0, d: 20}} o={{strokeWidth: 4}} draw={draw} seed={seed + 1} />
			<Txt text={text} x={22} y={sub ? -h / 2 + size * 1.0 : size * 0.33} size={size} draw={draw} seed={seed + 2} />
			{strike > 0 && <Rough shape={{t: 'line', x1: -w / 2 + 70, y1: sub ? -h / 2 + size * 0.68 : 10, x2: w / 2 - 20, y2: sub ? -h / 2 + size * 0.5 : -14}} o={{stroke: C.red, strokeWidth: 10}} draw={strike} seed={seed + 3} />}
			{sub && <Txt text={sub} x={22} y={h / 2 - size * 0.32} size={size * 1.05} color={subColor} draw={subDraw} seed={seed + 4} />}
		</g>
	);
};
// Kartka eksperymentu: wjeżdża z boku (p), rok i autorzy piszą się markerem.
export const ExpCard: React.FC<{year: string; who: string; f: number; a: number; out?: number; w?: number; tilt?: number}> = ({year, who, f, a, out = 1e9, w = 620, tilt = -3}) => {
	const p = prog(f, a - 10, 14);
	const o = 1 - prog(f, out, 10);
	if (p <= 0 || o <= 0) return null;
	const h = w * 0.5;
	return (
		<g opacity={o} transform={`translate(${(1 - p) * -700} ${(1 - p) * 60}) rotate(${tilt * p + (1 - p) * -14})`}>
			<Rough shape={{t: 'rect', x: -w / 2, y: -h / 2, w, h}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={730} />
			<Rough shape={{t: 'rect', x: -w / 2 + 30, y: -h / 2 + 34, w: 0.5 * w, h: 92}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, fillWeight: 6, stroke: 'none'}} draw={prog(f, a - 2, 10)} seed={731} />
			<Txt text={`badanie, ${year}`} x={-w / 2 + 44} y={-h / 2 + 108} size={88} anchor="start" draw={prog(f, a, 12)} seed={732} />
			<Txt text={who} x={-w / 2 + 44} y={h / 2 - 52} size={who.length > 26 ? 50 : 60} anchor="start" color={GREY} draw={prog(f, a + 8, 18)} seed={733} />
		</g>
	);
};
// Napis na żółtym markerze (nazwa mechanizmu).
export const MarkTitle: React.FC<{text: string; x: number; y: number; f: number; a: number; size?: number; out?: number; color?: string; seed?: number}> = ({text, x, y, f, a, size = 120, out = 1e9, color = C.ink, seed = 740}) => {
	const o = live(f, a - 4, out, 8);
	if (o <= 0) return null;
	const wd = text.length * size * 0.44;
	return (
		<g opacity={o}>
			<Rough shape={{t: 'rect', x: x - wd / 2 - 20, y: y - size * 0.62, w: wd + 40, h: size * 0.74}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 9, stroke: 'none', hachureAngle: -20}} draw={prog(f, a - 4, 10)} seed={seed} />
			<Txt text={text} x={x} y={y} size={size} color={color} draw={prog(f, a, 14)} seed={seed + 1} />
		</g>
	);
};
// Słupek wykresu: rośnie od a, wartość v (0–100), etykieta z liczbą na czerwono.
export const Bar: React.FC<{x: number; base: number; v: number; f: number; a: number; w?: number; hMax?: number; label?: string; color?: string; numColor?: string; seed?: number; under?: string}> = ({x, base, v, f, a, w = 150, hMax = 520, label, color = C.yellow, numColor = C.red, seed = 750, under}) => {
	const p = prog(f, a - 2, 18);
	if (p <= 0) return null;
	const h = (v / 100) * hMax * p;
	return (
		<g>
			<Rough shape={{t: 'rect', x: x - w / 2, y: base - h, w, h: Math.max(2, h)}} o={{fill: color, fillStyle: 'hachure', hachureGap: 10, fillWeight: 4, strokeWidth: 6}} seed={seed} />
			<Txt text={label ?? `${Math.round(v * p)}%`} x={x} y={base - h - 24} size={84} color={numColor} seed={seed + 1} />
			{under && <Txt text={under} x={x} y={base + 66} size={54} color={GREY} draw={prog(f, a, 10)} seed={seed + 2} />}
		</g>
	);
};
export const Floor: React.FC<{x0: number; x1: number; y: number; seed?: number; draw?: number}> = ({x0, x1, y, seed = 760, draw = 1}) => <Rough shape={{t: 'line', x1: x0, y1: y, x2: x1, y2: y}} o={{strokeWidth: 5, stroke: GREY}} draw={draw} seed={seed} />;
export const Door: React.FC<{w?: number; h?: number; open?: number; label?: string; labelSize?: number; fill?: string; seed?: number; draw?: number; dark?: boolean}> = ({w = 260, h = 460, open = 0, label, labelSize = 64, fill = C.paper, seed = 770, draw = 1, dark = true}) => {
	const sx = Math.cos(open * 1.25);
	return (
		<g>
			<Rough shape={{t: 'rect', x: -w / 2 - 14, y: -h - 14, w: w + 28, h: h + 14}} o={{fill: dark ? C.ink : LIGHT, fillStyle: dark ? 'solid' : 'hachure', strokeWidth: 7}} draw={draw} seed={seed} />
			<g transform={`translate(${-w / 2} 0) scale(${sx} 1)`}>
				<Rough shape={{t: 'rect', x: 0, y: -h, w, h}} o={{fill, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed + 1} />
				<Rough shape={{t: 'circle', cx: w - 34, cy: -h * 0.48, d: 22}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 3}} draw={draw} seed={seed + 2} />
				{label && sx > 0.35 && <Txt text={label} x={w / 2} y={-h * 0.7} size={labelSize} draw={draw} seed={seed + 3} />}
			</g>
		</g>
	);
};
// Myśl (chmurka) o środku (0,0).
export const Thought: React.FC<{w: number; h: number; draw?: number; seed?: number; tail?: [number, number]; children?: React.ReactNode}> = ({w, h, draw = 1, seed = 780, tail = [-0.3, 1], children}) => (
	<g>
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w, h}} o={{fill: '#EEF4FF', fillStyle: 'solid', stroke: C.blue, strokeWidth: 6}} draw={draw} seed={seed} />
		{[0, 1, 2].map((k) => (
			<Rough key={k} shape={{t: 'circle', cx: tail[0] * w * (0.5 + k * 0.22), cy: (h / 2) * tail[1] + 20 + k * 34, d: 34 - k * 9}} o={{fill: '#EEF4FF', fillStyle: 'solid', stroke: C.blue, strokeWidth: 5}} draw={draw} seed={seed + 1 + k} />
		))}
		<g opacity={clamp01(draw * 2 - 0.8)}>{children}</g>
	</g>
);
// Waga szalkowa: tilt dodatni = prawa szala w dół.
export const Balance: React.FC<{w?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode; draw?: number}> = ({w = 360, tilt = 0, left, right, draw = 1}) => {
	const an = (tilt * 18 * Math.PI) / 180;
	const dx = Math.cos(an) * (w / 2);
	const dy = Math.sin(an) * (w / 2);
	return (
		<g>
			<Rough shape={{t: 'line', x1: 0, y1: -170, x2: 0, y2: 40}} o={{strokeWidth: 7}} draw={draw} seed={790} />
			<Rough shape={{t: 'line', x1: -70, y1: 40, x2: 70, y2: 40}} o={{strokeWidth: 7}} draw={draw} seed={791} />
			<Rough shape={{t: 'line', x1: -dx, y1: -170 - dy, x2: dx, y2: -170 + dy}} o={{strokeWidth: 7}} draw={draw} seed={792} />
			{[-1, 1].map((sd) => {
				const px = sd * dx;
				const py = -170 + sd * dy;
				return (
					<g key={sd} transform={`translate(${px} ${py})`}>
						<Rough shape={{t: 'lpath', pts: [[-60, 90], [0, 0], [60, 90]]}} o={{strokeWidth: 4}} draw={draw} seed={793 + sd} />
						<Rough shape={{t: 'arc', cx: 0, cy: 90, w: 140, h: 50, a0: 0, a1: Math.PI, closed: true}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={796 + sd} />
						<g transform="translate(0 86)">{sd < 0 ? left : right}</g>
					</g>
				);
			})}
		</g>
	);
};
export const Stone: React.FC<{text?: string; s?: number}> = ({text = 'DŁUG', s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -70 0 C -80 -50 -40 -86 0 -84 C 50 -88 82 -50 72 0 Z'}} o={{fill: GREY, fillStyle: 'hachure', hachureGap: 7, fillWeight: 3, strokeWidth: 6}} seed={800} />
		<Txt text={text} x={0} y={-24} size={46} seed={801} />
	</g>
);
export const Cheese: React.FC<{s?: number; draw?: number}> = ({s = 1, draw = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'line', x1: 0, y1: 20, x2: 0, y2: 160}} o={{strokeWidth: 6, stroke: '#B78A54'}} draw={draw} seed={805} />
		<Rough shape={{t: 'poly', pts: [[-60, 40], [60, 40], [50, -40], [-40, -10]]}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={806} />
		<Rough shape={{t: 'circle', cx: -6, cy: 14, d: 18}} o={{strokeWidth: 4}} draw={draw} seed={807} />
		<Rough shape={{t: 'circle', cx: 26, cy: -8, d: 14}} o={{strokeWidth: 4}} draw={draw} seed={808} />
	</g>
);
export const Tray: React.FC<{w?: number; n?: number}> = ({w = 220, n = 4}) => (
	<g>
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w, h: 34}} o={{fill: LIGHT, fillStyle: 'solid', strokeWidth: 6}} seed={810} />
		{Array.from({length: n}).map((_, k) => (
			<g key={k} transform={`translate(${-w * 0.3 + k * ((w * 0.6) / Math.max(1, n - 1))} -14) scale(0.36)`}>
				<Cheese />
			</g>
		))}
	</g>
);
export const Gift: React.FC<{w?: number; open?: number; color?: string; seed?: number; draw?: number}> = ({w = 200, open = 0, color = SC[0], seed = 815, draw = 1}) => (
	<g>
		<Rough shape={{t: 'rect', x: -w / 2, y: -w * 0.7, w, h: w * 0.7}} o={{fill: color, fillStyle: 'hachure', hachureGap: 10, strokeWidth: 7}} draw={draw} seed={seed} />
		<Rough shape={{t: 'line', x1: 0, y1: -w * 0.7, x2: 0, y2: 0}} o={{strokeWidth: 7}} draw={draw} seed={seed + 1} />
		<g transform={`translate(${open * w * 0.6} ${-w * 0.7 - open * w * 0.5}) rotate(${open * 30})`}>
			<Rough shape={{t: 'rect', x: -w * 0.56, y: -w * 0.2, w: w * 1.12, h: w * 0.2}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'path', d: `M 0 ${-w * 0.2} C ${-w * 0.3} ${-w * 0.5} ${-w * 0.36} ${-w * 0.22} 0 ${-w * 0.2} C ${w * 0.3} ${-w * 0.5} ${w * 0.36} ${-w * 0.22} 0 ${-w * 0.2}`}} o={{strokeWidth: 6}} draw={draw} seed={seed + 3} />
		</g>
	</g>
);
export const Tickets: React.FC<{n: number; seed?: number; color?: string}> = ({n, seed = 820, color = C.yellow}) => (
	<g>
		{Array.from({length: n}).map((_, k) => (
			<g key={k} transform={`translate(${(hsh(seed + k) - 0.5) * 16} ${-k * 18}) rotate(${(hsh(seed + k * 3) - 0.5) * 8})`}>
				<rect x={-70} y={-16} width={140} height={32} rx={4} fill={color} stroke={C.ink} strokeWidth={4} />
				<line x1={-40} y1={-16} x2={-40} y2={16} stroke={C.ink} strokeWidth={3} strokeDasharray="5 5" />
			</g>
		))}
	</g>
);
export const Arrow: React.FC<{x0: number; y0: number; x1: number; y1: number; draw?: number; color?: string; w?: number; seed?: number; bend?: number}> = ({x0, y0, x1, y1, draw = 1, color = C.ink, w = 8, seed = 830, bend = 0}) => {
	if (draw <= 0) return null;
	const mx = (x0 + x1) / 2 - (y1 - y0) * bend;
	const my = (y0 + y1) / 2 + (x1 - x0) * bend;
	const an = Math.atan2(y1 - my, x1 - mx);
	const hx = (s: number) => x1 - Math.cos(an + s) * 42;
	const hy = (s: number) => y1 - Math.sin(an + s) * 42;
	return (
		<g>
			<Rough shape={{t: 'path', d: `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`}} o={{stroke: color, strokeWidth: w}} draw={draw} seed={seed} />
			{draw > 0.85 && <Rough shape={{t: 'lpath', pts: [[hx(0.5), hy(0.5)], [x1, y1], [hx(-0.5), hy(-0.5)]]}} o={{stroke: color, strokeWidth: w}} seed={seed + 1} />}
		</g>
	);
};
export const Heart: React.FC<{s?: number; fill?: string; seed?: number; draw?: number}> = ({s = 1, fill = C.red, seed = 840, draw = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M 0 40 C -70 -10 -50 -70 0 -36 C 50 -70 70 -10 0 40 Z'}} o={{fill, fillStyle: 'hachure', hachureGap: 7, fillWeight: 4, strokeWidth: 6}} draw={draw} seed={seed} />
	</g>
);
export const Cloud: React.FC<{s?: number; seed?: number; draw?: number; fill?: string}> = ({s = 1, seed = 845, draw = 1, fill = LIGHT}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -60 20 C -90 20 -90 -24 -56 -24 C -54 -60 0 -64 8 -34 C 30 -58 76 -40 64 -6 C 92 0 84 30 56 30 Z'}} o={{fill, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
	</g>
);
export const Gearwheel: React.FC<{r: number; teeth?: number; ang?: number; seed?: number; fill?: string}> = ({r, teeth = 9, ang = 0, seed = 850, fill = LIGHT}) => {
	const pts: [number, number][] = [];
	for (let k = 0; k < teeth * 2; k++) {
		const a0 = (k / (teeth * 2)) * Math.PI * 2;
		const rr = k % 2 ? r * 0.78 : r;
		pts.push([Math.cos(a0) * rr, Math.sin(a0) * rr]);
		pts.push([Math.cos(a0 + Math.PI / teeth) * rr, Math.sin(a0 + Math.PI / teeth) * rr]);
	}
	return (
		<g transform={`rotate(${ang})`}>
			<Rough shape={{t: 'poly', pts}} o={{fill, fillStyle: 'solid', strokeWidth: 6, roughness: 0.9}} seed={seed} />
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: r * 0.5}} o={{strokeWidth: 6}} seed={seed + 1} />
		</g>
	);
};
// Głowa w przekroju (profil), środek (0,0), szer. ok. 420.
export const HeadProfile: React.FC<{draw?: number; seed?: number; fill?: string; children?: React.ReactNode}> = ({draw = 1, seed = 860, fill = C.paper, children}) => (
	<g>
		<Rough shape={{t: 'path', d: 'M -150 160 C -190 60 -210 -120 -40 -190 C 120 -240 230 -110 200 10 L 238 70 L 196 92 L 206 140 C 200 176 150 176 110 170 L 100 240'}} o={{fill, fillStyle: 'solid', strokeWidth: 8}} draw={draw} seed={seed} />
		{children}
	</g>
);
export const Calendar: React.FC<{top: string; big: string; w?: number; flip?: number; seed?: number}> = ({top, big, w = 240, flip = 0, seed = 870}) => (
	<g>
		<Rough shape={{t: 'rect', x: -w / 2, y: -w * 0.55, w, h: w * 1.05}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={seed} />
		<Rough shape={{t: 'rect', x: -w / 2, y: -w * 0.55, w, h: w * 0.28}} o={{fill: C.red, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 7}} seed={seed + 1} />
		<Txt text={top} x={0} y={-w * 0.34} size={w * 0.2} seed={seed + 2} />
		<g transform={`translate(0 ${w * 0.18}) scale(1 ${Math.abs(Math.cos(flip * Math.PI))})`}>
			<Txt text={big} x={0} y={w * 0.12} size={w * (big.length > 3 ? 0.3 : 0.4)} seed={seed + 3} />
		</g>
	</g>
);
export const Clock: React.FC<{r?: number; h?: number; m?: number; ring?: number; seed?: number; draw?: number; bells?: boolean}> = ({r = 110, h = 7, m = 0, ring = 0, seed = 880, draw = 1, bells = true}) => {
	const f = useCurrentFrame();
	const sh = ring > 0 ? Math.sin(f * 2.2) * 6 * ring : 0;
	const ha = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2;
	const ma = (m / 60) * Math.PI * 2 - Math.PI / 2;
	return (
		<g transform={`rotate(${sh})`}>
			{bells && (
				<>
					<Rough shape={{t: 'arc', cx: -r * 0.6, cy: -r * 0.85, w: r * 0.7, h: r * 0.6, a0: Math.PI, a1: Math.PI * 2, closed: true}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed} />
					<Rough shape={{t: 'arc', cx: r * 0.6, cy: -r * 0.85, w: r * 0.7, h: r * 0.6, a0: Math.PI, a1: Math.PI * 2, closed: true}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 1} />
					<Rough shape={{t: 'lpath', pts: [[-r * 0.6, r * 0.8], [-r * 0.8, r * 1.1]]}} o={{strokeWidth: 7}} draw={draw} seed={seed + 2} />
					<Rough shape={{t: 'lpath', pts: [[r * 0.6, r * 0.8], [r * 0.8, r * 1.1]]}} o={{strokeWidth: 7}} draw={draw} seed={seed + 3} />
				</>
			)}
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: r * 2}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={draw} seed={seed + 4} />
			<Rough shape={{t: 'line', x1: 0, y1: 0, x2: Math.cos(ha) * r * 0.5, y2: Math.sin(ha) * r * 0.5}} o={{strokeWidth: 9}} draw={draw} seed={seed + 5} />
			<Rough shape={{t: 'line', x1: 0, y1: 0, x2: Math.cos(ma) * r * 0.78, y2: Math.sin(ma) * r * 0.78}} o={{strokeWidth: 6}} draw={draw} seed={seed + 6} />
			{ring > 0 &&
				[-1, 1].map((sd) => (
					<g key={sd} opacity={ring}>
						{[0, 1, 2].map((k) => (
							<line key={k} x1={sd * (r * 1.2 + k * 4)} y1={-r * 0.9 + k * 30} x2={sd * (r * 1.45 + k * 6)} y2={-r * 1.05 + k * 34} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
						))}
					</g>
				))}
		</g>
	);
};
export const Phone: React.FC<{w?: number; seed?: number; draw?: number; children?: React.ReactNode}> = ({w = 300, seed = 890, draw = 1, children}) => {
	const h = w * 1.9;
	return (
		<g>
			<Rough shape={{t: 'rect', x: -w / 2, y: -h / 2, w, h}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
			<rect x={-w / 2 + 16} y={-h / 2 + 40} width={w - 32} height={h - 80} rx={8} fill={C.paper} opacity={draw} />
			<g opacity={clamp01(draw * 2 - 1)}>{children}</g>
		</g>
	);
};
export const Jar: React.FC<{n: number; w?: number; label?: string; seed?: number; draw?: number; lid?: string; crowned?: number}> = ({n, w = 230, label, seed = 900, draw = 1, lid = SC[3], crowned = 0}) => {
	const h = w * 1.25;
	const cw = w * 0.26;
	const slots: [number, number][] = [];
	for (let k = 0; k < 10; k++) slots.push([(-w / 2 + cw * 0.8 + (k % 3) * cw * 1.05) + (Math.floor(k / 3) % 2) * cw * 0.4, -cw * 0.62 - Math.floor(k / 3) * cw * 0.78]);
	return (
		<g>
			<Rough shape={{t: 'path', d: `M ${-w * 0.42} ${-h} L ${w * 0.42} ${-h} C ${w * 0.56} ${-h * 0.9} ${w * 0.52} ${-h * 0.2} ${w * 0.48} 0 L ${-w * 0.48} 0 C ${-w * 0.52} ${-h * 0.2} ${-w * 0.56} ${-h * 0.9} ${-w * 0.42} ${-h} Z`}} o={{fill: '#F8F5EC', fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed} />
			<Rough shape={{t: 'rect', x: -w * 0.38, y: -h - w * 0.16, w: w * 0.76, h: w * 0.16}} o={{fill: lid, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 6}} draw={draw} seed={seed + 1} />
			{slots.slice(0, Math.max(0, Math.min(10, Math.round(n)))).map(([cx, cy], k) => (
				<g key={k} transform={`translate(${cx} ${cy})`}>
					<Cookie d={cw} seed={seed + 10 + k} />
				</g>
			))}
			{crowned > 0 && slots[0] && (
				<g transform={`translate(${slots[0][0]} ${slots[0][1] - cw * 0.55}) scale(${crowned * 0.9})`}>
					<Crown s={0.5} />
				</g>
			)}
			{label && (
				<g transform={`translate(0 ${-h * 0.62}) rotate(-4)`}>
					<Rough shape={{t: 'rect', x: -w * 0.44, y: -46, w: w * 0.88, h: 84}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 2} />
					<Txt text={label} x={0} y={16} size={Math.min(56, (w * 1.5) / label.length)} color={C.red} draw={draw} seed={seed + 3} />
				</g>
			)}
		</g>
	);
};
export const Cookie: React.FC<{d?: number; seed?: number; face?: number}> = ({d = 60, seed = 910, face = 0}) => (
	<g>
		<Rough shape={{t: 'circle', cx: 0, cy: 0, d}} o={{fill: '#C98A4B', fillStyle: 'solid', strokeWidth: Math.max(3, d * 0.06)}} seed={seed} />
		{[
			[-0.2, -0.15],
			[0.18, 0.1],
			[-0.05, 0.22],
			[0.2, -0.2],
		].map(([a, b], k) => (
			<circle key={k} cx={a * d} cy={b * d} r={d * 0.05} fill={C.ink} />
		))}
		{face > 0 && (
			<g opacity={face}>
				<circle cx={-d * 0.15} cy={-d * 0.05} r={d * 0.05} fill={C.ink} />
				<circle cx={d * 0.15} cy={-d * 0.05} r={d * 0.05} fill={C.ink} />
				<path d={`M ${-d * 0.18} ${d * 0.12} Q 0 ${d * 0.3} ${d * 0.18} ${d * 0.12}`} stroke={C.ink} strokeWidth={d * 0.05} fill="none" strokeLinecap="round" />
			</g>
		)}
	</g>
);
export const Crown: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'poly', pts: [[-60, 0], [-70, -70], [-30, -30], [0, -80], [30, -30], [70, -70], [60, 0]]}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={920} />
	</g>
);
// Suwak 0–100: v = położenie, label nad.
export const Slider: React.FC<{w?: number; v: number; label?: string; seed?: number; draw?: number; color?: string; num?: boolean}> = ({w = 420, v, label, seed = 930, draw = 1, color = C.blue, num = false}) => {
	const x = -w / 2 + (w * v) / 100;
	return (
		<g>
			<Rough shape={{t: 'line', x1: -w / 2, y1: 0, x2: w / 2, y2: 0}} o={{strokeWidth: 8, stroke: GREY}} draw={draw} seed={seed} />
			<Rough shape={{t: 'line', x1: -w / 2, y1: 0, x2: x, y2: 0}} o={{strokeWidth: 12, stroke: color}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'circle', cx: x, cy: 0, d: 44}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed + 2} />
			{label && <Txt text={label} x={w / 2} y={-34} size={50} anchor="end" color={GREY} draw={draw} seed={seed + 3} />}
			{num && <Txt text={`${Math.round(v)}`} x={x} y={-36} size={64} color={C.red} draw={draw} seed={seed + 4} />}
		</g>
	);
};
// Koło fortuny 0–100: rot = kąt (deg); wskaźnik u góry.
export const Wheel: React.FC<{r?: number; rot?: number; seed?: number; draw?: number; blur?: number}> = ({r = 230, rot = 0, seed = 940, draw = 1, blur = 0}) => {
	const n = 10;
	return (
		<g>
			<g transform={`rotate(${rot})`}>
				<Rough shape={{t: 'circle', cx: 0, cy: 0, d: r * 2}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={draw} seed={seed} />
				{Array.from({length: n}).map((_, k) => {
					const a0 = (k / n) * Math.PI * 2 - Math.PI / 2;
					const a1 = ((k + 1) / n) * Math.PI * 2 - Math.PI / 2;
					return (
						<g key={k}>
							{k % 2 === 0 && <path d={`M 0 0 L ${Math.cos(a0) * r * 0.96} ${Math.sin(a0) * r * 0.96} A ${r * 0.96} ${r * 0.96} 0 0 1 ${Math.cos(a1) * r * 0.96} ${Math.sin(a1) * r * 0.96} Z`} fill={C.yellow} opacity={0.55 * draw} />}
							<line x1={0} y1={0} x2={Math.cos(a0) * r} y2={Math.sin(a0) * r} stroke={C.ink} strokeWidth={4} opacity={draw} />
							<g opacity={draw * (1 - blur)}>
								<Txt text={`${k * 10}`} x={Math.cos(a0 + 0.31) * r * 0.72} y={Math.sin(a0 + 0.31) * r * 0.72 + 16} size={46} seed={seed + 10 + k} />
							</g>
						</g>
					);
				})}
				{blur > 0 && <circle r={r * 0.75} fill="none" stroke={GREY} strokeWidth={r * 0.35} opacity={0.25 * blur} />}
			</g>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 40}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'poly', pts: [[-24, -r - 40], [24, -r - 40], [0, -r + 14]]}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 2} />
		</g>
	);
};
// Kąt, przy którym na wskaźniku jest wartość v (0–90 co 10; środek pola).
export const wheelAngle = (v: number) => -((v / 10) * 36 + 18) + 0;
export const Car: React.FC<{w?: number; color?: string; seed?: number; draw?: number}> = ({w = 520, color = C.blue, seed = 950, draw = 1}) => {
	const h = w * 0.36;
	return (
		<g>
			<Rough shape={{t: 'path', d: `M ${-w / 2} 0 L ${-w / 2} ${-h * 0.55} L ${-w * 0.3} ${-h * 0.62} L ${-w * 0.16} ${-h} L ${w * 0.18} ${-h} L ${w * 0.34} ${-h * 0.6} L ${w / 2} ${-h * 0.5} L ${w / 2} 0 Z`}} o={{fill: color, fillStyle: 'hachure', hachureGap: 9, strokeWidth: 7}} draw={draw} seed={seed} />
			<Rough shape={{t: 'poly', pts: [[-w * 0.12, -h * 0.9], [w * 0.15, -h * 0.9], [w * 0.27, -h * 0.62], [-w * 0.24, -h * 0.62]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 1} />
			{[-0.3, 0.3].map((p, k) => (
				<Rough key={k} shape={{t: 'circle', cx: w * p, cy: 0, d: h * 0.5}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed + 2 + k} />
			))}
		</g>
	);
};
export const Stamp: React.FC<{text: string; s?: number; color?: string; rot?: number; w?: number; seed?: number}> = ({text, s = 1, color = C.red, rot = -12, w, seed = 960}) => {
	const ww = w ?? Math.max(180, text.length * 46 + 60);
	return (
		<g transform={`rotate(${rot}) scale(${s})`}>
			<Rough shape={{t: 'rect', x: -ww / 2, y: -56, w: ww, h: 112}} o={{stroke: color, strokeWidth: 10}} seed={seed} />
			<Txt text={text} x={0} y={30} size={92} color={color} seed={seed + 1} />
		</g>
	);
};
// Dłoń (prosty szkic), skierowana w prawo.
export const Hand: React.FC<{s?: number; seed?: number; draw?: number; open?: boolean}> = ({s = 1, seed = 970, draw = 1, open = true}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: open ? 'M -120 -30 L -10 -40 C 30 -44 50 -36 70 -30 C 96 -24 96 -8 70 -8 L 30 -10 C 40 0 44 18 30 24 L -10 30 L -120 30' : 'M -120 -30 L 10 -36 C 50 -36 54 26 10 28 L -120 30'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
	</g>
);
export const Sun: React.FC<{r?: number; rise?: number}> = ({r = 90, rise = 1}) => (
	<g opacity={rise}>
		{Array.from({length: 9}).map((_, k) => {
			const an = Math.PI + (k / 8) * Math.PI;
			return <Rough key={k} shape={{t: 'line', x1: Math.cos(an) * (r + 20), y1: Math.sin(an) * (r + 20), x2: Math.cos(an) * (r + 60), y2: Math.sin(an) * (r + 60)}} o={{strokeWidth: 6, stroke: '#E39B2B'}} seed={980 + k} />;
		})}
		<Rough shape={{t: 'arc', cx: 0, cy: 0, w: r * 2, h: r * 2, a0: Math.PI, a1: Math.PI * 2, closed: true}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={990} />
	</g>
);
export const Padlock: React.FC<{s?: number; open?: number; seed?: number; draw?: number}> = ({s = 1, open = 0, seed = 1000, draw = 1}) => (
	<g transform={`scale(${s})`}>
		<g transform={`translate(${open * 40} ${-open * 50})`}>
			<Rough shape={{t: 'path', d: 'M -50 -20 L -50 -80 C -50 -140 50 -140 50 -80 L 50 -20'}} o={{strokeWidth: 14}} draw={draw} seed={seed} />
		</g>
		<Rough shape={{t: 'rect', x: -80, y: -30, w: 160, h: 130}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, strokeWidth: 8}} draw={draw} seed={seed + 1} />
		<Rough shape={{t: 'circle', cx: 0, cy: 26, d: 26}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 2} />
		<Rough shape={{t: 'line', x1: 0, y1: 30, x2: 0, y2: 66}} o={{strokeWidth: 8}} draw={draw} seed={seed + 3} />
	</g>
);
// Klucz, którego uchwyt to znak zapytania.
export const QKey: React.FC<{s?: number; seed?: number; draw?: number}> = ({s = 1, seed = 1010, draw = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -150 -40 C -150 -110 -40 -110 -40 -40 C -40 -6 -90 0 -90 30'}} o={{strokeWidth: 14, stroke: C.red}} draw={draw} seed={seed} />
		<Rough shape={{t: 'circle', cx: -90, cy: 64, d: 20}} o={{fill: C.red, fillStyle: 'solid', stroke: C.red, strokeWidth: 4}} draw={draw} seed={seed + 1} />
		<Rough shape={{t: 'line', x1: -40, y1: -40, x2: 140, y2: -40}} o={{strokeWidth: 14, stroke: C.red}} draw={draw} seed={seed + 2} />
		<Rough shape={{t: 'lpath', pts: [[90, -40], [90, -6], [120, -6], [120, -40]]}} o={{strokeWidth: 10, stroke: C.red}} draw={draw} seed={seed + 3} />
	</g>
);
// Ręka lalkarza z krzyżakiem (widoczna na chwilę).
export const Puppeteer: React.FC<{w?: number}> = ({w = 360}) => (
	<g>
		<Rough shape={{t: 'line', x1: -w / 2, y1: 0, x2: w / 2, y2: 0}} o={{strokeWidth: 14, stroke: '#8A5A2B'}} seed={1020} />
		<Rough shape={{t: 'line', x1: 0, y1: -w * 0.3, x2: 0, y2: w * 0.3}} o={{strokeWidth: 14, stroke: '#8A5A2B'}} seed={1021} />
		<Rough shape={{t: 'path', d: `M -60 ${-w * 0.3} L -60 ${-w * 0.3 - 220} L 60 ${-w * 0.3 - 220} L 60 ${-w * 0.3} C 60 ${-w * 0.3 + 40} -60 ${-w * 0.3 + 40} -60 ${-w * 0.3}`}} o={{fill: '#E9C9A8', fillStyle: 'solid', strokeWidth: 6}} seed={1022} />
	</g>
);

// --- short: cięcie zdań [tylko film] -----------------------------------------------------------------
export {CutShort, keepFrom, keepLen} from '../garaze/gkit';
export const CTA_FRAMES = endOf(CTA_LINES) + 30;
export const CtaScene: React.FC<{i: number}> = ({i}) => (
	<Stage v lines={CTA_LINES} vo="mpcta_vo.wav" keys={[{f: 0, x: 540, y: 620, z: 1.04}, {f: CTA_FRAMES, x: 540, y: 620, z: 1}]}>
		{(f) => (
			<g>
				{[0, 1, 2, 3, 4].map((k) => (
					<G key={k} x={140 + k * 200} y={330} s={0.8 * pk(f, 4 + k * 3)}>
						<G x={-75} y={-75}>
							<IconBox i={k} done={k === i ? prog(f, 26, 10) : 0} />
						</G>
					</G>
				))}
				<Txt text="cały film" x={540} y={650} size={170} color={C.red} draw={prog(f, Math.round(CTA_LINES[1].words[4].s * FPS) - 4, 12)} seed={1031} />
				<G x={540} y={830} s={pk(f, Math.round(CTA_LINES[1].words[6].s * FPS))}>
					<Rough shape={{t: 'rect', x: -380, y: -60, w: 760, h: 120}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 6}} seed={1032} />
					<Txt text="▶  na kanale Psychorożek" x={0} y={24} size={72} color={C.paper} seed={1033} />
				</G>
			</g>
		)}
	</Stage>
);
export const ShortWithCta: React.FC<{sceneFrames: number; i: number; children: React.ReactNode}> = ({sceneFrames, i, children}) => (
	<AbsoluteFill>
		<Sequence durationInFrames={sceneFrames} layout="none">
			{children}
		</Sequence>
		<Sequence from={sceneFrames} layout="none">
			<CtaScene i={i} />
			<VHead i={i} />
		</Sequence>
	</AbsoluteFill>
);

// Kurz po uderzeniu (np. zatrzaśnięte drzwi): kłęby rozchodzą się od (0,0) przez ok. 18 klatek.
export const Dust: React.FC<{f: number; a: number; w?: number}> = ({f, a, w = 300}) => {
	const k = f - a;
	if (k < 0 || k > 22) return null;
	const p = k / 22;
	return (
		<g opacity={1 - p}>
			{[-1, 1].map((sd) =>
				[0, 1, 2].map((j) => <circle key={`${sd}${j}`} cx={sd * (w * 0.3 + p * (80 + j * 60))} cy={-20 - j * 18 - p * 30} r={18 + p * (20 + j * 8)} fill="none" stroke={GREY} strokeWidth={5} />),
			)}
		</g>
	);
};
// Dymek mowy o środku (x,y); ogon do punktu (tx,ty) względem środka.
export const Say: React.FC<{x: number; y: number; text: string; w?: number; h?: number; size?: number; tx?: number; ty?: number; draw?: number; color?: string; seed?: number; o?: number}> = ({x, y, text, w, h = 120, size = 60, tx = -60, ty = 110, draw = 1, color = C.ink, seed = 1040, o = 1}) => {
	if (draw <= 0 || o <= 0) return null;
	const ww = w ?? Math.max(200, text.length * size * 0.48 + 70);
	return (
		<g transform={`translate(${x} ${y})`} opacity={o}>
			<Rough shape={{t: 'poly', pts: [[tx * 0.3 - 22, h * 0.3], [tx, ty], [tx * 0.3 + 22, h * 0.32]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} draw={draw} seed={seed} />
			<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: ww, h}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed + 1} />
			<Txt text={text} x={0} y={size * 0.32} size={size} color={color} draw={clamp01(draw * 1.5 - 0.4)} seed={seed + 2} />
		</g>
	);
};
// Autobus „ZOO” (szkic), (0,0) = środek podstawy.
export const Bus: React.FC<{w?: number; label?: string}> = ({w = 420, label = 'ZOO'}) => (
	<g>
		<Rough shape={{t: 'rect', x: -w / 2, y: -w * 0.42, w, h: w * 0.36}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, strokeWidth: 7}} seed={1050} />
		{[0, 1, 2, 3].map((k) => (
			<Rough key={k} shape={{t: 'rect', x: -w / 2 + 24 + k * w * 0.2, y: -w * 0.38, w: w * 0.15, h: w * 0.12}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 4}} seed={1051 + k} />
		))}
		<Txt text={label} x={w * 0.25} y={-w * 0.12} size={w * 0.13} seed={1056} />
		{[-0.3, 0.3].map((p, k) => (
			<Rough key={k} shape={{t: 'circle', cx: w * p, cy: -w * 0.05, d: w * 0.16}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 4}} seed={1057 + k} />
		))}
	</g>
);
// Odhaczenie / skreślenie.
export const Check: React.FC<{ok: boolean; draw: number; s?: number}> = ({ok, draw, s = 1}) => (
	<g transform={`scale(${s})`}>
		{ok ? (
			<Rough shape={{t: 'lpath', pts: [[-60, 0], [-16, 50], [70, -60]]}} o={{stroke: SC[3], strokeWidth: 16}} draw={draw} seed={1060} />
		) : (
			<g>
				<Rough shape={{t: 'line', x1: -55, y1: -55, x2: 55, y2: 55}} o={{stroke: C.red, strokeWidth: 16}} draw={clamp01(draw * 2)} seed={1061} />
				<Rough shape={{t: 'line', x1: 55, y1: -55, x2: -55, y2: 55}} o={{stroke: C.red, strokeWidth: 16}} draw={clamp01(draw * 2 - 1)} seed={1062} />
			</g>
		)}
	</g>
);
