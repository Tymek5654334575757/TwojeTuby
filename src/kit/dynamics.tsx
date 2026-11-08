// Dynamika kadru: kamera (najazdy, uderzenia, wstrząsy), linie uderzeń, przejścia, tło z bazgrołami, pasek postępu.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, random} from 'remotion';
import {C, Rough, Txt, clamp01} from './sketch';

export type Hit = {t: number; kind: 'punch' | 'shake' | 'both'; amp?: number};
export type Burst = {t: number; x: number; y: number; color?: string; r?: number};
export type Shot = {from: number; to: number; ox: number; oy: number; zoom: number};

// Kamera globalna: powolny najazd w każdej scenie + uderzenia (skala) i wstrząsy na słowach-kluczach.
export const Camera: React.FC<{children: React.ReactNode; shots: Shot[]; hits: Hit[]}> = ({children, shots, hits}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const shot = shots.find((s) => t >= s.from && t < s.to) ?? shots[shots.length - 1];
	const p = clamp01((t - shot.from) / (shot.to - shot.from));
	let scale = 1 + (shot.zoom - 1) * Easing.inOut(Easing.quad)(p);
	let rot = 0;
	let dx = 0;
	let dy = 0;
	for (const h of hits) {
		const k = f - Math.round(h.t * fps);
		if (k < 0 || k > 14) continue;
		const amp = h.amp ?? 1;
		if (h.kind !== 'shake') {
			const bump = interpolate(k, [0, 3, 14], [0, 0.075 * amp, 0], {easing: Easing.out(Easing.cubic)});
			scale += bump;
			rot += (random(`rot${h.t}`) > 0.5 ? 1 : -1) * bump * 14;
		}
		if (h.kind !== 'punch' && k < 7) {
			const a = 16 * amp * (1 - k / 7);
			dx += (random(`cx${f}`) - 0.5) * 2 * a;
			dy += (random(`cy${f}`) - 0.5) * 2 * a;
		}
	}
	return (
		<AbsoluteFill
			style={{
				transformOrigin: `${shot.ox}px ${shot.oy}px`,
				scale: String(scale),
				rotate: `${rot}deg`,
				translate: `${dx}px ${dy}px`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

// Linie uderzenia rozbiegające się od punktu (rysują się i znikają w ok. 12 klatek).
export const Bursts: React.FC<{items: Burst[]}> = ({items}) => {
	const f = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', inset: 0}}>
			{items.map((b, i) => {
				const k = f - Math.round(b.t * fps);
				if (k < 0 || k > 14) return null;
				const grow = interpolate(k, [0, 5], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
				const fade = interpolate(k, [7, 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const r = b.r ?? 120;
				const n = 10;
				return (
					<g key={i} opacity={fade}>
						{Array.from({length: n}).map((_, j) => {
							const a = (j / n) * Math.PI * 2 + random(`ba${i}`) * 0.6;
							const r0 = r * (0.75 + 0.45 * grow);
							const r1 = r0 + 70 * grow * (j % 2 === 0 ? 1 : 0.6);
							return (
								<Rough
									key={j}
									shape={{t: 'line', x1: b.x + Math.cos(a) * r0, y1: b.y + Math.sin(a) * r0, x2: b.x + Math.cos(a) * r1, y2: b.y + Math.sin(a) * r1}}
									o={{stroke: b.color ?? C.red, strokeWidth: 7, roughness: 1}}
									seed={2000 + i * 20 + j}
								/>
							);
						})}
					</g>
				);
			})}
		</svg>
	);
};

// Przejście sceny: wjazd z prawej z lekkim obrotem, wyjazd w lewo.
export const SlideIn: React.FC<{children: React.ReactNode; dur: number; enter: boolean; exit: boolean}> = ({children, dur, enter, exit}) => {
	const f = useCurrentFrame();
	const e = Easing.bezier(0.33, 1, 0.68, 1);
	const inP = enter ? interpolate(f, [0, 7], [1, 0], {extrapolateRight: 'clamp', easing: e}) : 0;
	const outP = exit ? interpolate(f, [dur - 7, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)}) : 0;
	return (
		<AbsoluteFill
			style={{
				opacity: Math.min(1 - inP, 1 - outP),
				translate: `${inP * 220 - outP * 220}px 0px`,
				rotate: `${inP * 2.5 - outP * 2.5}deg`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

// Ciche bazgroły tła (znaki zapytania, wykrzykniki, iskry) dryfujące „na trójkach”.
export const Doodles: React.FC = () => {
	const f = useCurrentFrame();
	const step = Math.floor(f / 3);
	const items = [
		{x: 80, y: 760, s: '?', r: -12},
		{x: 1010, y: 980, s: '!', r: 10},
		{x: 70, y: 1240, s: '?!', r: 8},
		{x: 1000, y: 330, s: '?', r: 14},
		{x: 120, y: 420, s: '✦', r: 0},
		{x: 960, y: 1300, s: '✦', r: 0},
	];
	return (
		<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}} opacity={0.22}>
			{items.map((d, i) => (
				<Txt key={i} text={d.s} x={d.x + Math.sin(step * 0.09 + i) * 10} y={d.y + Math.cos(step * 0.07 + i * 2) * 14} size={90} rotate={d.r + Math.sin(step * 0.05 + i) * 6} seed={3000 + i} />
			))}
		</svg>
	);
};

// Pasek postępu u góry (żółty marker).
export const Progress: React.FC = () => {
	const f = useCurrentFrame();
	const {durationInFrames, width} = useVideoConfig();
	const p = f / (durationInFrames - 1);
	return (
		<svg width={width} height={40} viewBox={`0 0 ${width} 40`} style={{position: 'absolute', top: 18, left: 0}}>
			<rect x={0} y={14} width={width * p} height={12} fill={C.yellow} />
			<rect x={width * p - 3} y={10} width={6} height={20} fill={C.ink} />
		</svg>
	);
};

// Iskry elektryczne migające wokół punktu w oknie czasu [a, b] (klatki lokalne sceny).
export const Sparks: React.FC<{x: number; y: number; a: number; b: number; r?: number; color?: string}> = ({x, y, a, b, r = 60, color = C.yellow}) => {
	const f = useCurrentFrame();
	if (f < a || f > b) return null;
	const step = Math.floor(f / 2);
	if (step % 3 === 2) return null;
	const out: React.ReactNode[] = [];
	for (let i = 0; i < 3; i++) {
		const ang = random(`sp${step}-${i}`) * Math.PI * 2;
		const r0 = r * 0.5;
		const pts: [number, number][] = [];
		for (let k = 0; k < 4; k++) {
			const rr = r0 + (k / 3) * r;
			const jit = (random(`sj${step}-${i}-${k}`) - 0.5) * 0.7;
			pts.push([x + Math.cos(ang + jit) * rr, y + Math.sin(ang + jit) * rr]);
		}
		out.push(<Rough key={i} shape={{t: 'lpath', pts}} o={{stroke: i === 0 ? C.red : color, strokeWidth: 6, roughness: 1.2}} seed={4000 + step * 3 + i} />);
	}
	return <g>{out}</g>;
};

// Krople potu przy głowie (stres nauczyciela) od klatki a; (x,y) = środek głowy.
export const Sweat: React.FC<{x: number; y: number; a: number; s?: number}> = ({x, y, a, s = 1}) => {
	const f = useCurrentFrame();
	if (f < a) return null;
	const drops = [
		{dx: 48, dy: -20, d: 0},
		{dx: -50, dy: -6, d: 9},
		{dx: 56, dy: 14, d: 17},
	];
	return (
		<g>
			{drops.map((d, i) => {
				const k = (f - a - d.d + 30) % 30;
				if (f - a < d.d) return null;
				const fall = (Math.floor(k / 3) * 3) / 30;
				return (
					<g key={i} opacity={1 - fall} transform={`translate(${x + d.dx * s} ${y + d.dy * s + fall * 40}) scale(${s})`}>
						<Rough shape={{t: 'path', d: 'M 0 -14 Q 9 2 0 8 Q -9 2 0 -14 Z'}} o={{stroke: C.blue, strokeWidth: 4, fill: C.blue, fillStyle: 'solid'}} seed={4100 + i} />
					</g>
				);
			})}
		</g>
	);
};
