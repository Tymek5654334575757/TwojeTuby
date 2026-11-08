// Wspólny zestaw „animacji szkicowej” dla kanałów (rough.js + Caveat).
import React, {createContext, useContext, useMemo} from 'react';
import {useCurrentFrame, random} from 'remotion';
import rough from 'roughjs';
import type {Options} from 'roughjs/bin/core';

export const C = {
	paper: '#F4EEDF',
	grain: '#C9BFA8',
	ink: '#1E1B18',
	yellow: '#FFC93C',
	red: '#E4572E',
	blue: '#3A86FF',
};

export const FONT = 'Caveat';

const gen = rough.generator();

// Zamrożenie „line boil” (np. cisza po „milknie”).
export const FreezeCtx = createContext(false);

export const useBoil = (base: number) => {
	const frame = useCurrentFrame();
	const frozen = useContext(FreezeCtx);
	const phase = frozen ? 0 : Math.floor(frame / 3) % 3;
	return {seed: Math.abs(Math.round(base)) * 7 + phase + 1, phase};
};

export type Shape =
	| {t: 'rect'; x: number; y: number; w: number; h: number}
	| {t: 'line'; x1: number; y1: number; x2: number; y2: number}
	| {t: 'ellipse'; cx: number; cy: number; w: number; h: number}
	| {t: 'circle'; cx: number; cy: number; d: number}
	| {t: 'path'; d: string}
	| {t: 'poly'; pts: [number, number][]}
	| {t: 'lpath'; pts: [number, number][]}
	| {t: 'arc'; cx: number; cy: number; w: number; h: number; a0: number; a1: number; closed?: boolean};

const DEF: Options = {
	stroke: C.ink,
	strokeWidth: 6,
	roughness: 1.6,
	bowing: 1,
	hachureAngle: -41,
	hachureGap: 14,
	fillWeight: 3.5,
};

const make = (s: Shape, o: Options) => {
	switch (s.t) {
		case 'rect':
			return gen.rectangle(s.x, s.y, s.w, s.h, o);
		case 'line':
			return gen.line(s.x1, s.y1, s.x2, s.y2, o);
		case 'ellipse':
			return gen.ellipse(s.cx, s.cy, s.w, s.h, o);
		case 'circle':
			return gen.circle(s.cx, s.cy, s.d, o);
		case 'path':
			return gen.path(s.d, o);
		case 'poly':
			return gen.polygon(s.pts, o);
		case 'lpath':
			return gen.linearPath(s.pts, o);
		case 'arc':
			return gen.arc(s.cx, s.cy, s.w, s.h, s.a0, s.a1, s.closed ?? false, o);
	}
};

// Kształt rysowany tuszem: drga co 3 klatki, „draw” 0–1 rysuje kreskę na żywo.
export const Rough: React.FC<{
	shape: Shape;
	o?: Options;
	draw?: number;
	seed?: number;
	opacity?: number;
}> = ({shape, o, draw = 1, seed = 1, opacity = 1}) => {
	const {seed: s} = useBoil(seed);
	const key = JSON.stringify(shape) + JSON.stringify(o ?? {});
	const paths = useMemo(() => {
		return gen.toPaths(make(shape, {...DEF, ...o, seed: s}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key, s]);
	if (draw <= 0.001 || opacity <= 0.001) return null;
	const partial = draw < 0.999;
	return (
		<g opacity={opacity}>
			{paths.map((p, i) => {
				const solid = p.fill && p.fill !== 'none';
				return (
					<path
						key={i}
						d={p.d}
						stroke={p.stroke}
						strokeWidth={p.strokeWidth}
						fill={solid ? p.fill : 'none'}
						fillOpacity={solid && partial ? draw : 1}
						pathLength={solid ? undefined : 1}
						strokeDasharray={partial && !solid ? '1 1' : undefined}
						strokeDashoffset={partial && !solid ? 1 - draw : undefined}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				);
			})}
		</g>
	);
};

// Tekst odręczny: znaki pojawiają się kolejno (draw), lekkie drganie.
export const Txt: React.FC<{
	text: string;
	x: number;
	y: number;
	size: number;
	color?: string;
	anchor?: 'start' | 'middle' | 'end';
	draw?: number;
	rotate?: number;
	seed?: number;
	opacity?: number;
}> = ({text, x, y, size, color = C.ink, anchor = 'middle', draw = 1, rotate = 0, seed = 3, opacity = 1}) => {
	const {phase} = useBoil(seed);
	const jx = (random(`tx${seed}-${phase}`) - 0.5) * 2;
	const jr = (random(`tr${seed}-${phase}`) - 0.5) * 0.8;
	const chars = Array.from(text);
	const shown = draw * chars.length;
	return (
		<text
			x={x + jx}
			y={y}
			fontFamily={FONT}
			fontWeight={700}
			fontSize={size}
			fill={color}
			textAnchor={anchor}
			opacity={opacity}
			transform={`rotate(${rotate + jr} ${x} ${y})`}
		>
			{chars.map((c, i) => (
				<tspan key={i} opacity={Math.max(0, Math.min(1, shown - i))}>
					{c}
				</tspan>
			))}
		</text>
	);
};

// Zygzak „gumki” zamazujący obszar.
export const Scribble: React.FC<{x: number; y: number; w: number; h: number; draw: number; seed?: number; color?: string}> = ({
	x,
	y,
	w,
	h,
	draw,
	seed = 9,
	color = C.ink,
}) => {
	const pts: [number, number][] = [];
	const n = 9;
	for (let i = 0; i <= n; i++) {
		pts.push([x + (i % 2 === 0 ? 0 : w), y + (h * i) / n]);
	}
	return <Rough shape={{t: 'lpath', pts}} o={{strokeWidth: 16, stroke: color, roughness: 2.2}} draw={draw} seed={seed} />;
};

// Ziarno papieru (stałe kropki).
export const Paper: React.FC<{w: number; h: number}> = ({w, h}) => {
	const dots = useMemo(() => {
		const out: React.ReactNode[] = [];
		for (let i = 0; i < 900; i++) {
			out.push(
				<circle
					key={i}
					cx={random(`gx${i}`) * w}
					cy={random(`gy${i}`) * h}
					r={0.8 + random(`gr${i}`) * 1.8}
					fill={C.grain}
				/>,
			);
		}
		return out;
	}, [w, h]);
	return (
		<g>
			<rect x={0} y={0} width={w} height={h} fill={C.paper} />
			<g opacity={0.35}>{dots}</g>
		</g>
	);
};

// Stopniowy „oddech” postaci (ruch na trójkach).
export const useBob = (amp = 4, seed = 0) => {
	const frame = useCurrentFrame();
	const frozen = useContext(FreezeCtx);
	const f = frozen ? 0 : Math.floor(frame / 3);
	return Math.sin(f * 0.55 + seed) * amp;
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
