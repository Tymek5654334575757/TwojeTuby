// Postacie i rekwizyty wielokrotnego użytku (styl szkicowy).
import React from 'react';
import {C, Rough, Txt, useBob, clamp01} from './sketch';

type P = {x: number; y: number; s?: number; draw?: number; seed?: number; opacity?: number};

// Ludzik stojący. (x,y) = środek głowy.
export const Person: React.FC<P & {color?: string; fill?: string; arms?: 'down' | 'up' | 'reach'}> = ({
	x,
	y,
	s = 1,
	draw = 1,
	seed = 10,
	color = C.ink,
	fill,
	arms = 'down',
	opacity = 1,
}) => {
	const bob = useBob(3, seed);
	const o = {stroke: color, strokeWidth: 6};
	const ar =
		arms === 'up'
			? [
					[-70, -30],
					[70, -30],
				]
			: arms === 'reach'
				? [
						[-60, 110],
						[110, 40],
					]
				: [
						[-50, 130],
						[50, 130],
					];
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={opacity}>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 70}} o={{...o, fill, fillStyle: 'solid'}} draw={draw} seed={seed} />
			<Rough shape={{t: 'line', x1: 0, y1: 36, x2: 0, y2: 170}} o={o} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'lpath', pts: [[ar[0][0], ar[0][1]], [0, 70], [ar[1][0], ar[1][1]]]}} o={o} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'lpath', pts: [[-45, 270], [0, 170], [45, 270]]}} o={o} draw={draw} seed={seed + 3} />
		</g>
	);
};

// Mały ludzik do siatek (40 badanych).
export const Mini: React.FC<P & {color?: string; filled?: boolean}> = ({x, y, s = 1, draw = 1, seed = 1, color = C.ink, filled, opacity = 1}) => {
	const o = {stroke: color, strokeWidth: 5, roughness: 1.3};
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 30}} o={{...o, fill: filled ? color : undefined, fillStyle: 'solid'}} draw={draw} seed={seed} />
			<Rough shape={{t: 'lpath', pts: [[-20, 52], [0, 18], [20, 52]]}} o={{...o, fill: filled ? color : undefined, fillStyle: 'solid'}} draw={draw} seed={seed + 1} />
		</g>
	);
};

// Eksperymentator w kitlu. (x,y) = środek głowy. highlight 0–1 = żółty marker na kitlu.
export const LabCoat: React.FC<P & {highlight?: number}> = ({x, y, s = 1, draw = 1, seed = 40, highlight = 0, opacity = 1}) => {
	const bob = useBob(2.5, seed);
	const coat: [number, number][] = [
		[-62, 48],
		[62, 48],
		[82, 250],
		[-82, 250],
	];
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={opacity}>
			<Rough shape={{t: 'poly', pts: coat}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 11, fillWeight: 9}} draw={highlight} seed={seed + 9} />
			<Rough shape={{t: 'poly', pts: coat}} o={{fill: C.paper, fillStyle: 'solid'}} opacity={highlight > 0.01 ? 0 : 1} draw={draw} seed={seed + 8} />
			<Rough shape={{t: 'poly', pts: coat}} draw={draw} seed={seed} />
			<Rough shape={{t: 'lpath', pts: [[-30, 48], [0, 120], [30, 48]]}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'line', x1: 0, y1: 120, x2: 0, y2: 250}} o={{strokeWidth: 4}} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'rect', x: 30, y: 150, w: 32, h: 26}} o={{strokeWidth: 4}} draw={draw} seed={seed + 3} />
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 82}} o={{fill: C.paper, fillStyle: 'solid'}} draw={draw} seed={seed + 4} />
			<Rough shape={{t: 'circle', cx: -16, cy: -4, d: 22}} o={{strokeWidth: 4}} draw={draw} seed={seed + 5} />
			<Rough shape={{t: 'circle', cx: 16, cy: -4, d: 22}} o={{strokeWidth: 4}} draw={draw} seed={seed + 6} />
			<Rough shape={{t: 'line', x1: -12, y1: 22, x2: 12, y2: 22}} o={{strokeWidth: 4}} draw={draw} seed={seed + 7} />
			<Rough shape={{t: 'lpath', pts: [[-30, 250], [-30, 330]]}} draw={draw} seed={seed + 10} />
			<Rough shape={{t: 'lpath', pts: [[30, 250], [30, 330]]}} draw={draw} seed={seed + 11} />
			<Rough shape={{t: 'rect', x: -110, y: 110, w: 56, h: 74}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 4}} draw={draw} seed={seed + 12} />
			<Rough shape={{t: 'line', x1: -100, y1: 132, x2: -66, y2: 132}} o={{strokeWidth: 3}} draw={draw} seed={seed + 13} />
			<Rough shape={{t: 'line', x1: -100, y1: 150, x2: -66, y2: 150}} o={{strokeWidth: 3}} draw={draw} seed={seed + 14} />
		</g>
	);
};

// Generator wstrząsów. Szerokość bazowa 800×300, skalowany przez s. needle 0–1 (15→450 V), lit = ile przełączników (0–10).
export const Generator: React.FC<P & {needle: number; lit: number; lamp?: boolean}> = ({
	x,
	y,
	s = 1,
	draw = 1,
	seed = 70,
	needle,
	lit,
	lamp = false,
	opacity = 1,
}) => {
	const cx = 170;
	const cy = 200;
	const a = Math.PI + clamp01(needle) * Math.PI;
	const sw: React.ReactNode[] = [];
	for (let i = 0; i < 10; i++) {
		const sx = 330 + i * 44;
		const on = i < lit;
		const last = i === 9;
		sw.push(
			<Rough
				key={i}
				shape={{t: 'rect', x: sx, y: 150, w: 32, h: 62}}
				o={{
					stroke: last ? C.red : C.ink,
					strokeWidth: 4,
					fill: on ? (last ? C.red : C.yellow) : undefined,
					fillStyle: 'solid',
					roughness: 1.2,
				}}
				draw={draw}
				seed={seed + 20 + i}
			/>,
		);
	}
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
			<Rough shape={{t: 'rect', x: 0, y: 0, w: 800, h: 300}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed} />
			<Txt text="GENERATOR" x={400} y={62} size={48} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'arc', cx, cy, w: 220, h: 220, a0: Math.PI, a1: Math.PI * 1.75}} o={{strokeWidth: 6}} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'arc', cx, cy, w: 220, h: 220, a0: Math.PI * 1.75, a1: Math.PI * 2}} o={{strokeWidth: 9, stroke: C.red}} draw={draw} seed={seed + 3} />
			<Rough shape={{t: 'line', x1: cx, y1: cy, x2: cx + Math.cos(a) * 92, y2: cy + Math.sin(a) * 92}} o={{strokeWidth: 7, stroke: C.red}} draw={draw} seed={seed + 4} />
			<Rough shape={{t: 'circle', cx, cy, d: 22}} o={{fill: C.ink, fillStyle: 'solid'}} draw={draw} seed={seed + 5} />
			{sw}
			<Txt text="15 V" x={346} y={262} size={34} draw={draw} seed={seed + 6} />
			<Txt text="450 V" x={742} y={262} size={36} color={C.red} draw={draw} seed={seed + 7} />
			<Txt text="XXX" x={742} y={136} size={30} color={C.red} draw={draw} seed={seed + 8} />
			<Rough shape={{t: 'circle', cx: 740, cy: 52, d: 46}} o={{stroke: C.red, strokeWidth: 5, fill: lamp ? C.red : undefined, fillStyle: 'solid'}} draw={draw} seed={seed + 9} />
		</g>
	);
};

// Uczeń na krześle. mood: pain | calm | mask. (x,y) = środek głowy.
export const Learner: React.FC<P & {mood?: 'pain' | 'calm'; face?: number}> = ({x, y, s = 1, draw = 1, seed = 90, mood = 'pain', face = 1, opacity = 1}) => {
	const bob = useBob(mood === 'pain' ? 5 : 2, seed);
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={opacity}>
			<Rough shape={{t: 'lpath', pts: [[-70, 120], [-70, 230], [70, 230], [70, 320]]}} o={{strokeWidth: 5}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'line', x1: -70, y1: 230, x2: -70, y2: 320}} o={{strokeWidth: 5}} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'line', x1: -10, y1: 40, x2: -40, y2: 200}} draw={draw} seed={seed + 3} />
			<Rough shape={{t: 'lpath', pts: [[-40, 200], [40, 210], [50, 310]]}} draw={draw} seed={seed + 4} />
			<Rough shape={{t: 'lpath', pts: [[-20, 90], [40, 140], [70, 120]]}} draw={draw} seed={seed + 5} />
			<Rough shape={{t: 'rect', x: 22, y: 118, w: 34, h: 24}} o={{strokeWidth: 4, stroke: C.red}} draw={draw} seed={seed + 6} />
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 76}} o={{fill: C.paper, fillStyle: 'solid'}} draw={draw} seed={seed} />
			<g opacity={face}>
				<Rough shape={{t: 'line', x1: -18, y1: -8, x2: -6, y2: -8}} o={{strokeWidth: 4}} draw={draw} seed={seed + 7} />
				<Rough shape={{t: 'line', x1: 6, y1: -8, x2: 18, y2: -8}} o={{strokeWidth: 4}} draw={draw} seed={seed + 8} />
				{mood === 'pain' ? (
					<Rough shape={{t: 'ellipse', cx: 0, cy: 16, w: 20, h: 16}} o={{strokeWidth: 4}} draw={draw} seed={seed + 9} />
				) : (
					<Rough shape={{t: 'arc', cx: 0, cy: 8, w: 30, h: 22, a0: 0.2, a1: Math.PI - 0.2}} o={{strokeWidth: 4}} draw={draw} seed={seed + 9} />
				)}
			</g>
		</g>
	);
};

// Maska teatralna. (x,y) = środek.
export const Mask: React.FC<P> = ({x, y, s = 1, draw = 1, seed = 120, opacity = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
		<Rough shape={{t: 'path', d: 'M -55 -45 Q 0 -70 55 -45 Q 60 20 0 60 Q -60 20 -55 -45 Z'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
		<Rough shape={{t: 'ellipse', cx: -22, cy: -14, w: 26, h: 14}} o={{fill: C.ink, fillStyle: 'solid'}} draw={draw} seed={seed + 1} />
		<Rough shape={{t: 'ellipse', cx: 22, cy: -14, w: 26, h: 14}} o={{fill: C.ink, fillStyle: 'solid'}} draw={draw} seed={seed + 2} />
		<Rough shape={{t: 'arc', cx: 0, cy: 14, w: 50, h: 34, a0: 0.15, a1: Math.PI - 0.15}} o={{strokeWidth: 6}} draw={draw} seed={seed + 3} />
		<Rough shape={{t: 'lpath', pts: [[55, -40], [85, -50], [95, -20]]}} o={{stroke: C.red, strokeWidth: 5}} draw={draw} seed={seed + 4} />
	</g>
);

// Znak zapytania z markerem pod spodem. (x,y) = środek.
export const QMark: React.FC<P> = ({x, y, s = 1, draw = 1, seed = 140, opacity = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 300, h: 380}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 12, fillWeight: 10}} draw={clamp01(draw * 1.3)} seed={seed + 5} />
		<Rough shape={{t: 'path', d: 'M -70 -70 C -70 -170 80 -170 80 -70 C 80 -10 0 -10 0 60'}} o={{strokeWidth: 22, roughness: 1.4}} draw={clamp01(draw * 1.25)} seed={seed} />
		<Rough shape={{t: 'circle', cx: 0, cy: 130, d: 34}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 6}} draw={clamp01((draw - 0.75) * 4)} seed={seed + 1} />
	</g>
);

// Dymek mowy z tekstem. (x,y) = lewy górny róg.
export const Speech: React.FC<P & {w: number; h: number; lines: string[]; size?: number; tail?: [number, number]}> = ({
	x,
	y,
	w,
	h,
	lines,
	size = 64,
	tail = [-60, 40],
	draw = 1,
	seed = 160,
	opacity = 1,
	s = 1,
}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
		<Rough shape={{t: 'ellipse', cx: w / 2, cy: h / 2, w, h}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={seed} />
		<Rough shape={{t: 'lpath', pts: [[w * 0.18, h * 0.82], [tail[0], h + tail[1]], [w * 0.32, h * 0.92]]}} o={{strokeWidth: 6}} draw={draw} seed={seed + 1} />
		{lines.map((l, i) => (
			<Txt key={i} text={l} x={w / 2} y={h / 2 + (i - (lines.length - 1) / 2) * size * 0.95 + size * 0.3} size={size} draw={clamp01(draw * 1.4 - 0.3)} seed={seed + 2 + i} />
		))}
	</g>
);
