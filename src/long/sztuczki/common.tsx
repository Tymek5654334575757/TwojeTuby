// Wspólne narzędzia sal 2–5 filmu „5 sztuczek polityków”: czasy, kamera, rekwizyty.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, spring, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, clamp01} from '../../kit/sketch';
import type {VoLine} from '../../kit/captions';

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const RW = 2200;
export const GREY = '#8A8072';

// --- czasy -------------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:!]/g, '');
export const makeT = (lines: VoLine[]) => (li: number, w?: string, nth = 0) => {
	const l = lines[li];
	if (!w) return Math.round(l.s * FPS);
	const hits = l.words.filter((x) => norm(x.w).startsWith(norm(w)));
	if (!hits[nth]) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return Math.round(hits[nth].s * FPS);
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (f: number, a: number, dur: number) => interpolate(f, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const pop = (f: number, a: number) => (f < a ? 0 : spring({frame: f - a, fps: FPS, config: {damping: 9, stiffness: 170}}));
export const pk = (f: number, a: number) => Math.min(1.08, pop(f, a));
export const kf = (f: number, pts: [number, number][]) => {
	if (f <= pts[0][0]) return pts[0][1];
	for (let i = 1; i < pts.length; i++) {
		if (f <= pts[i][0]) {
			const [a, va] = pts[i - 1];
			const [b, vb] = pts[i];
			return va + (vb - va) * ease(clamp01((f - a) / Math.max(1, b - a)));
		}
	}
	return pts[pts.length - 1][1];
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const live = (f: number, a: number, b: number, fade = 8) => prog(f, a, fade) * (1 - prog(f, b, fade));

// --- scena z kamerą ---------------------------------------------------------------
export type Cam = {cx: [number, number][]; cy: [number, number][]; z: [number, number][]; hits: [number, number][]};

export const Stage: React.FC<{vo: string; cam: Cam; children: React.ReactNode}> = ({vo, cam, children}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”…?!≠×+→').then(() => continueRender(handle));
	}, [handle]);
	const cx = kf(f, cam.cx);
	const cy = kf(f, cam.cy);
	const z = kf(f, cam.z);
	let punch = 0;
	let shake = 0;
	for (const [t, amp] of cam.hits) {
		if (f >= t) {
			const d = f - t;
			punch += 0.035 * amp * Math.exp(-d / 5);
			shake += 9 * amp * Math.exp(-d / 4) * Math.sin(d * 2.4);
		}
	}
	const zz = z * (1 + punch);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
				<Paper w={W} h={H} />
				<g transform={`translate(${960 - cx * zz + shake} ${540 - cy * zz}) scale(${zz})`}>{children}</g>
			</svg>
			<Audio src={staticFile(vo)} />
		</AbsoluteFill>
	);
};

// --- rekwizyty ------------------------------------------------------------------
export const Guy: React.FC<{x: number; y: number; s?: number; draw?: number; seed?: number; arms?: 'down' | 'up' | 'point' | 'shrug'; color?: string; look?: number; badge?: string}> = ({
	x,
	y,
	s = 1,
	draw = 1,
	seed = 500,
	arms = 'down',
	color = C.ink,
	look = 0,
	badge,
}) => {
	if (draw <= 0) return null;
	const a: [number, number][] =
		arms === 'up'
			? [
					[-70, -10],
					[0, 70],
					[70, -10],
				]
			: arms === 'point'
				? [
						[-50, 135],
						[0, 70],
						[110, 40],
					]
				: arms === 'shrug'
					? [
							[-80, 40],
							[0, 70],
							[80, 40],
						]
					: [
							[-50, 135],
							[0, 70],
							[50, 135],
						];
	const o = {stroke: color, strokeWidth: 6};
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 76}} o={{...o, fill: C.paper, fillStyle: 'solid'}} draw={draw} seed={seed} />
			<Rough shape={{t: 'line', x1: 0, y1: 38, x2: 0, y2: 170}} o={o} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'lpath', pts: a}} o={o} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'lpath', pts: [[-48, 270], [0, 170], [48, 270]]}} o={o} draw={draw} seed={seed + 3} />
			<g opacity={draw}>
				<circle cx={-12 + look * 8} cy={-4} r={4.5} fill={color} />
				<circle cx={12 + look * 8} cy={-4} r={4.5} fill={color} />
			</g>
			{badge && <Rough shape={{t: 'circle', cx: 0, cy: 105, d: 46}} o={{fill: badge, fillStyle: 'solid', strokeWidth: 5}} seed={seed + 4} />}
		</g>
	);
};

// Polityk za mównicą; (x, y) = środek blatu mównicy.
export const Lectern: React.FC<{x: number; y: number; draw?: number; seed?: number; tie?: string; arms?: 'down' | 'up' | 'point'; flip?: boolean}> = ({x, y, draw = 1, seed = 840, tie = C.red, arms = 'down', flip = false}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
			<Guy x={0} y={-178} s={1.5} seed={seed} arms={arms} draw={draw} />
			<Rough shape={{t: 'poly', pts: [[0, -110], [-20, -76], [0, -10], [20, -76]]}} o={{fill: tie, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 8} />
			<Rough shape={{t: 'poly', pts: [[-120, 30], [120, 30], [90, 360], [-90, 360]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={draw} seed={seed + 10} />
			<Rough shape={{t: 'rect', x: -140, y: 0, w: 280, h: 34}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 7}} draw={draw} seed={seed + 11} />
		</g>
	);
};

export const DeadCat: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<Rough shape={{t: 'lpath', pts: [[100, -10], [160, -40], [190, 0], [170, 30]]}} o={{strokeWidth: 9}} seed={760} />
		{[-50, -15, 30, 65].map((lx, i) => (
			<Rough key={i} shape={{t: 'line', x1: lx, y1: -30, x2: lx + (i % 2 ? 14 : -14), y2: -110}} o={{strokeWidth: 8}} seed={761 + i} />
		))}
		<Rough shape={{t: 'ellipse', cx: 10, cy: 0, w: 220, h: 96}} o={{fill: GREY, fillStyle: 'hachure', hachureGap: 8, fillWeight: 4, strokeWidth: 7}} seed={766} />
		<Rough shape={{t: 'circle', cx: -120, cy: -6, d: 96}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={767} />
		<Rough shape={{t: 'poly', pts: [[-158, -36], [-166, -76], [-132, -50]]}} o={{fill: C.paper, fillStyle: 'solid'}} seed={768} />
		<Rough shape={{t: 'poly', pts: [[-108, -50], [-84, -78], [-82, -34]]}} o={{fill: C.paper, fillStyle: 'solid'}} seed={769} />
		{[-138, -104].map((ex, i) => (
			<g key={i}>
				<line x1={ex - 9} y1={-19} x2={ex + 9} y2={-1} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
				<line x1={ex + 9} y1={-19} x2={ex - 9} y2={-1} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
			</g>
		))}
	</g>
);

// Dokument z nagłówkiem i opcjonalną pieczęcią.
export const Doc: React.FC<{x: number; y: number; title: string; draw: number; stamp?: number; stampText?: string; seed: number; rot?: number; w?: number; h?: number; lines?: number}> = ({
	x,
	y,
	title,
	draw,
	stamp = 0,
	stampText = 'PRZYJĘTO',
	seed,
	rot = 4,
	w = 300,
	h = 400,
	lines = 4,
}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot})`}>
			<Rough shape={{t: 'rect', x: -w / 2, y: -h / 2, w, h}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed} />
			<Txt text={title} x={0} y={-h / 2 + 80} size={64} draw={draw} seed={seed + 1} />
			{Array.from({length: lines}).map((_, i) => (
				<Rough key={i} shape={{t: 'line', x1: -w / 2 + 40, y1: -h / 2 + 130 + i * 40, x2: i === lines - 1 ? 30 : w / 2 - 40, y2: -h / 2 + 130 + i * 40}} o={{strokeWidth: 5}} draw={clamp01(draw * 2 - 0.3 - i * 0.15)} seed={seed + 2 + i} />
			))}
			{stamp > 0 && (
				<g transform={`translate(20 ${h / 2 - 80}) rotate(-14) scale(${stamp})`}>
					<Rough shape={{t: 'rect', x: -125, y: -40, w: 250, h: 80}} o={{stroke: C.red, strokeWidth: 8}} seed={seed + 8} />
					<Txt text={stampText} x={0} y={20} size={56} color={C.red} seed={seed + 9} />
				</g>
			)}
		</g>
	);
};

// Symbol sztuczki w kratce 150×150.
export const Glyph: React.FC<{i: number}> = ({i}) => {
	if (i === 0)
		return (
			<g>
				<Rough shape={{t: 'circle', cx: 75, cy: 86, d: 78}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={630} />
				<Rough shape={{t: 'poly', pts: [[44, 62], [40, 26], [68, 50]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={631} />
				<Rough shape={{t: 'poly', pts: [[106, 62], [110, 26], [82, 50]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={632} />
				{[60, 90].map((ex) => (
					<g key={ex}>
						<line x1={ex - 7} y1={74} x2={ex + 7} y2={88} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
						<line x1={ex + 7} y1={74} x2={ex - 7} y2={88} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
					</g>
				))}
			</g>
		);
	if (i === 1)
		return (
			<g>
				<Rough shape={{t: 'circle', cx: 48, cy: 75, d: 56}} o={{fill: C.blue, fillStyle: 'solid', strokeWidth: 5}} seed={633} />
				<Rough shape={{t: 'circle', cx: 104, cy: 75, d: 56}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 5}} seed={634} />
			</g>
		);
	if (i === 2)
		return (
			<g>
				<Rough shape={{t: 'rect', x: 26, y: 30, w: 98, h: 90}} o={{stroke: C.red, strokeWidth: 12}} seed={635} />
				<Rough shape={{t: 'circle', cx: 75, cy: 75, d: 30}} o={{fill: C.ink, fillStyle: 'solid'}} seed={636} />
			</g>
		);
	if (i === 3)
		return (
			<g>
				<Rough shape={{t: 'poly', pts: [[28, 62], [28, 92], [60, 92], [112, 122], [112, 30], [60, 62]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={637} />
				<Rough shape={{t: 'arc', cx: 118, cy: 76, w: 34, h: 60, a0: -1.2, a1: 1.2}} o={{stroke: C.red, strokeWidth: 6}} seed={638} />
			</g>
		);
	return (
		<g>
			<Rough shape={{t: 'ellipse', cx: 62, cy: 78, w: 86, h: 56}} o={{fill: C.red, fillStyle: 'hachure', hachureGap: 7, fillWeight: 4, strokeWidth: 6}} seed={639} />
			<Rough shape={{t: 'ellipse', cx: 112, cy: 78, w: 16, h: 54}} o={{strokeWidth: 5}} seed={640} />
			<Rough shape={{t: 'ellipse', cx: 130, cy: 80, w: 14, h: 50}} o={{strokeWidth: 5}} seed={641} />
		</g>
	);
};

// Plansza tytułowa rozdziału: pełna od klatki 0, znika w chwili c.
export const TitleCard: React.FC<{nr: string; name: string; i: number; a: number; c: number; x?: number}> = ({nr, name, i, a, c, x = 960}) => {
	const f = useCurrentFrame();
	const o = 1 - prog(f, c, 10);
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			<rect x={x - 1400} y={-400} width={2800} height={1900} fill={C.paper} />
			<g transform={`translate(${x - 75} 150)`}>
				<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 3, strokeWidth: 7}} seed={600} />
				<Glyph i={i} />
			</g>
			<Txt text={nr} x={x} y={470} size={110} seed={601} />
			<g transform={`translate(${x} 640) scale(${0.85 + 0.15 * pk(f, a)}) translate(${-x} -640)`}>
				<Txt text={name} x={x} y={700} size={230} color={C.red} draw={prog(f, a - 4, 12)} seed={602} />
			</g>
		</g>
	);
};

// Stos monet (n sztuk), (x, y) = środek podstawy.
export const Stack: React.FC<{x: number; y: number; n: number; draw?: number; seed: number; color?: string}> = ({x, y, n, draw = 1, seed, color = C.yellow}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const d = clamp01(draw * n - i);
			if (d <= 0) return null;
			return <Rough key={i} shape={{t: 'ellipse', cx: x, cy: y - i * 26, w: 130, h: 40}} o={{fill: color, fillStyle: 'solid', strokeWidth: 5}} draw={d} seed={seed + i} />;
		})}
	</g>
);

// Duża liczba z „pop”.
export const Big: React.FC<{text: string; x: number; y: number; a: number; size?: number; color?: string; seed: number; until?: number}> = ({text, x, y, a, size = 220, color = C.red, seed, until = 1e9}) => {
	const f = useCurrentFrame();
	if (f < a) return null;
	return (
		<g opacity={1 - prog(f, until, 8)} transform={`translate(${x} ${y}) scale(${pk(f, a)}) translate(${-x} ${-y})`}>
			<Txt text={text} x={x} y={y + size * 0.32} size={size} color={color} seed={seed} />
		</g>
	);
};

// Napis pisany od chwili a, znika w b.
export const Lab: React.FC<{text: string; x: number; y: number; a: number; b?: number; size?: number; color?: string; seed: number; dur?: number; rotate?: number; anchor?: 'start' | 'middle' | 'end'}> = ({
	text,
	x,
	y,
	a,
	b = 1e9,
	size = 70,
	color = C.ink,
	seed,
	dur = 14,
	rotate = 0,
	anchor = 'middle',
}) => {
	const f = useCurrentFrame();
	const o = live(f, a - 2, b);
	if (o <= 0) return null;
	return (
		<g opacity={o}>
			<Txt text={text} x={x} y={y} size={size} color={color} draw={prog(f, a, dur)} seed={seed} rotate={rotate} anchor={anchor} />
		</g>
	);
};

export {C, Rough, Txt, clamp01};
