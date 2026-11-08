// Short #2 Psychorożek: błąd planowania (1080×1920).
// Styl TED-Ed: jedno ciągłe płótno, kamera jedzie po świecie, obiekty przemieniają się zamiast cięć.
// Każdy ruch startuje na słowie lektora (vo.gen.ts), czasy są globalne (bez Sequence).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, spring, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, Scribble, clamp01} from '../../kit/sketch';
import {Person, Mini, QMark, LabCoat} from '../../kit/figures';
import {Captions} from '../../kit/captions';
import {Camera, Doodles, Sweat, type Hit} from '../../kit/dynamics';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// --- czasy -------------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:!]/g, '');
export const cue = (li: number, w?: string) => {
	const l = LINES[li];
	if (!w) return l.s;
	const hit = l.words.find((x) => norm(x.w).startsWith(norm(w)));
	if (!hit) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return hit.s;
};
const T = (li: number, w?: string) => Math.round(cue(li, w) * FPS);
export const END_S = LINES[13].e + 0.4;
const TAIL_F = Math.round(END_S * FPS);
export const TOTAL_FRAMES = TAIL_F + 30;

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, dur: number) => interpolate(f, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const pop = (f: number, a: number) => (f < a ? 0 : spring({frame: f - a, fps: FPS, config: {damping: 9, stiffness: 170}}));
// Klatki kluczowe [klatka, wartość] z łagodnym przejściem.
const kf = (f: number, pts: [number, number][]) => {
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
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// --- świat -------------------------------------------------------------------
const AX_Y = 1080; // oś dni
const X = (d: number) => 90 + d * 13; // dzień → x
const HX = 1080; // przesunięcie drugiej „sali” (scena o błędzie planowania)

// Bohater z krokiem „na trójkach”. (x,y) = środek głowy, stopy ok. y+270·s.
const Hero: React.FC<{x: number; y: number; s?: number; walk?: number; run?: boolean; seed?: number; o?: number}> = ({x, y, s = 1, walk = -1, run = false, seed = 500, o = 1}) => {
	const ph = Math.floor(Math.max(0, walk) / 3) * 3;
	const sw = walk >= 0 ? Math.sin(ph * 0.5) * (run ? 0.6 : 0.4) : 0;
	const bob = walk >= 0 ? Math.abs(Math.sin(ph * 0.5)) * -10 : 0;
	const leg = (a: number): [number, number] => [Math.sin(a) * 100, 170 + Math.cos(a) * 100];
	const l1 = leg(sw);
	const l2 = leg(-sw);
	const arms: [number, number][] = run
		? [
				[-80, 40 + sw * 70],
				[0, 70],
				[85, 40 - sw * 70],
			]
		: [
				[-50 + sw * 40, 130],
				[0, 70],
				[50 - sw * 40, 130],
			];
	const lean = run && walk >= 0 ? 8 : 0;
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${s}) rotate(${lean} 0 170)`} opacity={o}>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 72}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={seed} />
			<Rough shape={{t: 'line', x1: 0, y1: 36, x2: 0, y2: 170}} seed={seed + 1} />
			<Rough shape={{t: 'lpath', pts: arms}} seed={seed + 2} />
			<Rough shape={{t: 'lpath', pts: [l1, [0, 170], l2]}} seed={seed + 3} />
		</g>
	);
};

// Budzik; m: 0 = duży budzik, 1 = plakietka z rokiem.
const Clock: React.FC<{cx: number; cy: number; d: number; hands: number; spin: number; wobble: number; seed?: number}> = ({cx, cy, d, hands, spin, wobble, seed = 600}) => {
	const r = d / 2;
	const ticks = [];
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2;
		ticks.push(
			<Rough key={i} shape={{t: 'line', x1: cx + Math.cos(a) * r * 0.78, y1: cy + Math.sin(a) * r * 0.78, x2: cx + Math.cos(a) * r * 0.9, y2: cy + Math.sin(a) * r * 0.9}} o={{strokeWidth: 5}} opacity={hands} seed={seed + 10 + i} />,
		);
	}
	const hm = ((spin - 90) * Math.PI) / 180;
	const hh = ((spin / 12 - 90 + 60) * Math.PI) / 180;
	return (
		<g transform={`rotate(${wobble} ${cx} ${cy + r})`}>
			{/* dzwonki i nóżki */}
			<g opacity={hands}>
				<Rough shape={{t: 'arc', cx: cx - r * 0.62, cy: cy - r * 0.78, w: r * 0.7, h: r * 0.7, a0: Math.PI, a1: Math.PI * 2, closed: true}} o={{fill: C.yellow, fillStyle: 'hachure', strokeWidth: 7}} seed={seed + 1} />
				<Rough shape={{t: 'arc', cx: cx + r * 0.62, cy: cy - r * 0.78, w: r * 0.7, h: r * 0.7, a0: Math.PI, a1: Math.PI * 2, closed: true}} o={{fill: C.yellow, fillStyle: 'hachure', strokeWidth: 7}} seed={seed + 2} />
				<Rough shape={{t: 'line', x1: cx - r * 0.55, y1: cy + r * 0.8, x2: cx - r * 0.8, y2: cy + r * 1.08}} o={{strokeWidth: 8}} seed={seed + 3} />
				<Rough shape={{t: 'line', x1: cx + r * 0.55, y1: cy + r * 0.8, x2: cx + r * 0.8, y2: cy + r * 1.08}} o={{strokeWidth: 8}} seed={seed + 4} />
			</g>
			<Rough shape={{t: 'circle', cx, cy, d}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} seed={seed} />
			{ticks}
			<g opacity={hands}>
				<Rough shape={{t: 'line', x1: cx, y1: cy, x2: cx + Math.cos(hm) * r * 0.72, y2: cy + Math.sin(hm) * r * 0.72}} o={{strokeWidth: 8, stroke: C.red}} seed={seed + 30} />
				<Rough shape={{t: 'line', x1: cx, y1: cy, x2: cx + Math.cos(hh) * r * 0.45, y2: cy + Math.sin(hh) * r * 0.45}} o={{strokeWidth: 11}} seed={seed + 31} />
				<Rough shape={{t: 'circle', cx, cy, d: r * 0.12}} o={{fill: C.ink, fillStyle: 'solid'}} seed={seed + 32} />
			</g>
		</g>
	);
};

// Chorągiewka na osi dni; draw 0–1, tilt = przewrócenie przez bohatera.
const Flag: React.FC<{x: number; top: number; color: string; num: string; word: string; draw: number; tilt: number; seed: number; grow?: number; numColor?: string}> = ({
	x,
	top,
	color,
	num,
	word,
	draw,
	tilt,
	seed,
	grow = 1,
	numColor,
}) => {
	if (draw <= 0) return null;
	const d2 = clamp01(draw * 2 - 1);
	const ny = top - 40;
	return (
		<g transform={`rotate(${tilt} ${x} ${AX_Y})`}>
			<Rough shape={{t: 'line', x1: x, y1: AX_Y, x2: x, y2: top}} o={{strokeWidth: 7}} draw={clamp01(draw * 2)} seed={seed} />
			<Rough shape={{t: 'poly', pts: [[x, top], [x + 90, top + 30], [x, top + 60]]}} o={{fill: color, fillStyle: 'hachure', hachureGap: 8, fillWeight: 5, strokeWidth: 6}} draw={d2} seed={seed + 1} />
			<g transform={`translate(${x} ${ny}) scale(${grow}) translate(${-x} ${-ny})`}>
				<Txt text={num} x={x} y={ny} size={100} color={numColor ?? color} draw={d2} seed={seed + 2} />
			</g>
			<Txt text={word} x={x} y={top - 125} size={52} draw={d2} seed={seed + 3} />
		</g>
	);
};

// Linia łamana rysowana odcinek po odcinku (bez przerywanych „kresek” przy częściowym rysowaniu).
const PPath: React.FC<{pts: [number, number][]; draw: number; o?: Record<string, unknown>; seed: number}> = ({pts, draw, o, seed}) => {
	const n = pts.length - 1;
	return (
		<g>
			{pts.slice(0, -1).map((p, i) => {
				const d = clamp01(draw * n - i);
				if (d <= 0) return null;
				const q = pts[i + 1];
				return <Rough key={i} shape={{t: 'line', x1: p[0], y1: p[1], x2: lerp(p[0], q[0], d), y2: lerp(p[1], q[1], d)}} o={o} seed={seed + i} />;
			})}
		</g>
	);
};

// Linie uderzenia w świecie (klatka globalna at).
const WBurst: React.FC<{x: number; y: number; at: number; r?: number; color?: string; seed?: number}> = ({x, y, at, r = 120, color = C.red, seed = 900}) => {
	const f = useCurrentFrame();
	const k = f - at;
	if (k < 0 || k > 14) return null;
	const grow = interpolate(k, [0, 5], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const fade = interpolate(k, [7, 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<g opacity={fade}>
			{Array.from({length: 10}).map((_, j) => {
				const a = (j / 10) * Math.PI * 2 + 0.3;
				const r0 = r * (0.75 + 0.45 * grow);
				const r1 = r0 + 70 * grow * (j % 2 === 0 ? 1 : 0.6);
				return <Rough key={j} shape={{t: 'line', x1: x + Math.cos(a) * r0, y1: y + Math.sin(a) * r0, x2: x + Math.cos(a) * r1, y2: y + Math.sin(a) * r1}} o={{stroke: color, strokeWidth: 7, roughness: 1}} seed={seed + j} />;
			})}
		</g>
	);
};

const Cloud: React.FC<{x: number; y: number; draw: number; rain: number; bolt: number; seed?: number}> = ({x, y, draw, rain, bolt, seed = 700}) => {
	const f = useCurrentFrame();
	const step = Math.floor(f / 3);
	const d = `M ${x - 160} ${y + 50} Q ${x - 190} ${y - 20} ${x - 100} ${y - 30} Q ${x - 80} ${y - 100} ${x} ${y - 75} Q ${x + 60} ${y - 120} ${x + 115} ${y - 45} Q ${x + 185} ${y - 35} ${x + 160} ${y + 50} Z`;
	return (
		<g>
			<Rough shape={{t: 'path', d}} o={{fill: '#8A8F98', fillStyle: 'hachure', hachureGap: 9, fillWeight: 4, strokeWidth: 7}} draw={draw} seed={seed} />
			{rain > 0 &&
				[-110, -55, 0, 55, 110].map((dx, i) => {
					const o = ((step * 13 + i * 17) % 40) / 40;
					return <Rough key={i} shape={{t: 'line', x1: x + dx, y1: y + 70 + o * 60, x2: x + dx - 12, y2: y + 110 + o * 60}} o={{stroke: C.blue, strokeWidth: 5}} opacity={rain} seed={seed + 10 + i} />;
				})}
			{bolt > 0 && (
				<Rough
					shape={{t: 'poly', pts: [[x + 20, y + 50], [x - 30, y + 150], [x + 10, y + 150], [x - 40, y + 260], [x + 70, y + 120], [x + 25, y + 120], [x + 60, y + 50]]}}
					o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}}
					opacity={bolt}
					seed={seed + 30}
				/>
			)}
		</g>
	);
};

// --- kompozycja ------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();

	// klatki kluczowe z lektora
	const t1 = T(1);
	const t94 = T(1, '1994');
	const tPsy = T(1, 'psycholodzy');
	const tStud = T(1, 'studentów');
	const tIle = T(1, 'ile');
	const tPracy = T(1, 'pracy');
	const t2 = T(2);
	const t34 = T(2, '34');
	const tNaj = T(3, 'najgorzej');
	const t49 = T(4);
	const t5 = T(5);
	const t55 = T(6, '55');
	const tDl = T(7);
	const tCzarn = T(7, 'najczarniejszym');
	const t8 = T(8);
	const tTrz = T(8, 'trzeci');
	const t9 = T(9);
	const tPlan = T(9, 'planowania');
	const tGlow = T(10, 'głowie');
	const tFilm = T(10, 'film');
	const tGl = T(10, 'gładko');
	const t11 = T(11);
	const tKor = T(11, 'korków');
	const tPop = T(11, 'poprawek');
	const tZyc = T(11, 'życia');
	const t12 = T(12);
	const tPyt = T(12, 'pytaj');
	const tZap = T(13);
	const tOst = T(13, 'ostatnim');
	const tail = TAIL_F;

	// przemiana budzik ↔ plakietka „1994” (i z powrotem w pętli)
	const m = prog(f, t1 - 4, 16) * (1 - prog(f, tail, 22));
	const out = 1 - prog(f, tail, 12); // wygaszenie wszystkiego przed pętlą
	const ring = f < t1 ? Math.sin(Math.floor(f / 2) * 1.7) * 4 : 0;

	// bohater
	const walkStart = t5 + 2;
	const walkEnd = t55 + 1;
	const hx = kf(f, [
		[0, 250],
		[t1, 250],
		[t1 + 20, 250],
		[t2 - 8, 250],
		[t2 + 8, X(0)],
		[walkStart, X(0)],
		[walkEnd, X(55)],
		[tail, X(55)],
		[tail + 22, 250],
	]);
	const hy = kf(f, [
		[0, 840],
		[t1, 840],
		[t1 + 20, 720],
		[t2 - 8, 720],
		[t2 + 8, AX_Y - 270 * 0.7],
		[tail, AX_Y - 270 * 0.7],
		[tail + 22, 840],
	]);
	const hs = kf(f, [
		[0, 1],
		[t1 + 20, 0.95],
		[t2 - 8, 0.95],
		[t2 + 8, 0.7],
		[tail, 0.7],
		[tail + 22, 1],
	]);
	const moving = f < t1 + 20 || (f > t2 - 8 && f < t2 + 8) || (f >= walkStart && f <= walkEnd) || f > tail;
	const running = f < t1 || (f >= walkStart && f <= walkEnd) || f > tail;
	const tilt = (fx: number) => -30 * clamp01((hx - fx + 10) / 40);

	// tło dnia pracy: fragmenty sceny 1994 (studenci, praca dyplomowa)
	const actB = prog(f, tPsy - 4, 8) * (1 - prog(f, t2 - 10, 8));

	return (
		<g>
			{/* ===== HACZYK: budzik, „ZNOWU?!”, biegnący bohater ===== */}
			<Clock cx={lerp(600, 160, m)} cy={lerp(540, 250, m)} d={lerp(520, 190, m)} hands={1 - m} spin={(f * 360 * 50) / TOTAL_FRAMES} wobble={ring} />
			<Txt text="1994" x={160} y={272} size={70} color={C.red} draw={prog(f, t94 - 2, 10) * out} seed={610} />
			<Txt text="ZNOWU?!" x={560} y={185} size={140} color={C.red} rotate={-4} opacity={1 - m} seed={620} />
			<g opacity={(1 - m) * (f < t1 + 20 ? 1 : 0)}>
				<g transform={`rotate(6 830 990)`}>
					<Rough shape={{t: 'rect', x: 720, y: 860, w: 220, h: 270}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={prog(f, T(0, 'planujesz') - 2, 8)} seed={630} />
					<Txt text="PLAN" x={830} y={920} size={64} draw={prog(f, T(0, 'planujesz'), 8)} seed={631} />
					{[0, 1, 2].map((i) => (
						<g key={i}>
							<Rough shape={{t: 'lpath', pts: [[748, 968 + i * 52], [762, 985 + i * 52], [790, 950 + i * 52]]}} o={{stroke: C.red, strokeWidth: 7}} draw={prog(f, T(0, 'lepiej') + i * 3, 6)} seed={632 + i} />
							<Rough shape={{t: 'line', x1: 810, y1: 975 + i * 52, x2: 910, y2: 975 + i * 52}} o={{strokeWidth: 5}} draw={prog(f, T(0, 'planujesz') + 4 + i * 2, 6)} seed={636 + i} />
						</g>
					))}
				</g>
			</g>

			{/* ===== 1994: studenci i praca dyplomowa ===== */}
			<g opacity={actB}>
				{[0, 1, 2].map((i) => (
					<Person key={i} x={420 + i * 140} y={720} s={0.62} draw={prog(f, tStud + i * 4, 12)} seed={640 + i * 7} />
				))}
				<Rough shape={{t: 'rect', x: 350, y: 1000, w: 420, h: 60}} o={{fill: C.paper, fillStyle: 'solid'}} draw={prog(f, tPracy - 4, 10)} seed={660} />
				<Rough shape={{t: 'rect', x: 365, y: 945, w: 400, h: 60}} o={{fill: C.paper, fillStyle: 'solid'}} draw={prog(f, tPracy, 10)} seed={661} />
				<Rough shape={{t: 'rect', x: 340, y: 890, w: 430, h: 60}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10}} draw={prog(f, tPracy + 4, 10)} seed={662} />
				<Txt text="PRACA DYPLOMOWA" x={555} y={935} size={52} draw={prog(f, tPracy + 6, 12)} seed={663} />
				<LabCoat x={850} y={560} s={0.85} draw={prog(f, tPsy - 2, 14)} highlight={prog(f, T(1, 'zapytali'), 10)} seed={680} />
				<QMark x={560} y={400} s={1.0} draw={prog(f, tIle - 2, 12)} seed={670} />
			</g>

			{/* ===== OŚ DNI: plan 34, najgorzej 49, naprawdę 55 ===== */}
			<g opacity={out}>
				<Rough shape={{t: 'line', x1: 60, y1: AX_Y, x2: X(60) + 40, y2: AX_Y}} o={{strokeWidth: 8}} draw={prog(f, t2 - 8, 16)} seed={700} />
				<Rough shape={{t: 'lpath', pts: [[X(60) + 18, AX_Y - 20], [X(60) + 42, AX_Y], [X(60) + 18, AX_Y + 20]]}} o={{strokeWidth: 8}} draw={prog(f, t2 + 6, 6)} seed={701} />
				{[0, 10, 20, 30, 40, 50, 60].map((d, i) => (
					<g key={d}>
						<Rough shape={{t: 'line', x1: X(d), y1: AX_Y - 14, x2: X(d), y2: AX_Y + 14}} o={{strokeWidth: 5}} draw={prog(f, t2 - 6 + i * 2, 5)} seed={710 + i} />
						<Txt text={String(d)} x={X(d)} y={AX_Y + 62} size={44} draw={prog(f, t2 - 4 + i * 2, 5)} seed={720 + i} opacity={0.75} />
					</g>
				))}
				<Txt text="dni" x={X(60) + 10} y={AX_Y - 34} size={44} draw={prog(f, t2 + 8, 6)} seed={729} opacity={0.75} />

				<Cloud x={420} y={440} draw={prog(f, tNaj - 2, 12) * (1 - prog(f, t12 - 10, 10))} rain={(f > tNaj + 8 ? 1 : 0) * (1 - prog(f, t12 - 10, 10))} bolt={f >= tCzarn && f < tCzarn + 24 && Math.floor((f - tCzarn) / 3) % 2 === 0 ? 1 : 0} />

				<Flag x={X(34)} top={820} color={C.blue} num="34" word="plan" draw={prog(f, t34 - 2, 12)} tilt={tilt(X(34))} seed={740} />
				<Flag x={X(49)} top={700} color={C.red} num="49" word="najgorzej" draw={prog(f, t49 - 2, 12)} tilt={tilt(X(49))} seed={750} />
				<Flag
					x={X(55)}
					top={560}
					color={f >= tOst ? C.yellow : C.ink}
					numColor={C.ink}
					num="55"
					word="naprawdę"
					draw={prog(f, t55 - 3, 10)}
					tilt={0}
					seed={760}
					grow={1 + 0.25 * clamp01(pop(f, tOst)) + 0.2 * Math.sin(Math.PI * clamp01((f - t55) / 10))}
				/>
				<WBurst x={X(55)} y={500} at={t55} r={110} />
				<WBurst x={X(49)} y={640} at={t49} r={90} color={C.ink} seed={920} />
				<WBurst x={X(34)} y={760} at={t34} r={90} color={C.blue} seed={940} />

				{/* „dłużej niż najczarniejszy scenariusz” */}
				<g opacity={1 - prog(f, t8 - 4, 8)}>
					<Rough shape={{t: 'lpath', pts: [[X(49), AX_Y + 120], [X(55), AX_Y + 120]]}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, tDl, 10)} seed={770} />
					<Rough shape={{t: 'lpath', pts: [[X(55) - 22, AX_Y + 102], [X(55), AX_Y + 120], [X(55) - 22, AX_Y + 138]]}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, tDl + 8, 5)} seed={771} />
					<Txt text="dłużej!" x={X(52)} y={AX_Y + 200} size={70} color={C.red} draw={prog(f, tDl + 4, 10)} seed={772} />
				</g>

				{/* co trzeci zdążył */}
				<g opacity={1 - prog(f, t9 - 6, 8)}>
					{[0, 1, 2].map((i) => {
						const done = i === 0 && f >= tTrz;
						return (
							<g key={i} opacity={i > 0 && f >= tTrz ? 0.4 : 1}>
								<Mini x={230 + i * 120} y={AX_Y + 125} s={1.5} draw={prog(f, t8 + i * 4, 10)} filled={done} color={done ? C.ink : C.ink} seed={780 + i * 3} />
								{done && <Rough shape={{t: 'circle', cx: 230, cy: AX_Y + 125, d: 46}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={790} />}
							</g>
						);
					})}
					<Rough shape={{t: 'lpath', pts: [[200, AX_Y + 30], [222, AX_Y + 56], [262, AX_Y + 6]]}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, tTrz + 2, 6)} seed={795} />
					<Txt text="≈ 30%" x={560} y={AX_Y + 215} size={80} color={C.red} draw={prog(f, tTrz, 10)} seed={796} />
				</g>

				{/* nie pytaj, ile zajmie → zapytaj, ile zajęło ostatnim razem */}
				<Scribble x={318} y={700} w={150} h={165} draw={prog(f, tPyt, 12)} color={C.red} seed={800} />
				<Rough shape={{t: 'ellipse', cx: X(55), cy: 470, w: 250, h: 230}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, tZap, 12)} seed={810} />
				<Txt text="nowy plan: 55 dni" x={440} y={380} size={78} color={C.red} rotate={-3} draw={prog(f, tOst, 14)} seed={811} />
				<PPath pts={[[640, 400], [700, 430], [X(55) - 120, 470]]} o={{stroke: C.red, strokeWidth: 7}} draw={prog(f, tOst + 10, 8)} seed={812} />
				<WBurst x={X(55)} y={470} at={tOst + 2} r={140} color={C.yellow} seed={960} />
			</g>

			{/* ===== BOHATER (wspólny dla wszystkich scen w tej sali) ===== */}
			<Hero x={hx} y={hy} s={hs} walk={moving ? f : -1} run={running} seed={500} />
			{(f < t1 + 12 || f > tail) && <Sweat x={hx} y={hy} a={0} s={hs} />}
			{f > walkStart + 30 && f < walkEnd + 30 && <Sweat x={hx} y={hy} a={walkStart + 30} s={hs} />}

			{/* ===== DRUGA SALA: błąd planowania ===== */}
			<g transform={`translate(${HX} 0)`} opacity={1 - prog(f, t12 + 12, 8)}>
				<Rough shape={{t: 'rect', x: 120, y: 240, w: 840, h: 46}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 14}} draw={prog(f, tPlan, 12)} seed={1010} />
				<Txt text="BŁĄD PLANOWANIA" x={540} y={270} size={124} color={C.red} draw={prog(f, t9 + 4, 18)} seed={1011} />
				<Hero x={220} y={760} s={1} seed={1020} />
				{[
					[285, 700, 26],
					[330, 650, 38],
					[385, 605, 52],
				].map(([x, y, d], i) => (
					<Rough key={i} shape={{t: 'circle', cx: x, cy: y, d}} o={{strokeWidth: 5}} draw={prog(f, tGlow - 6 + i * 3, 6)} seed={1030 + i} />
				))}
				<Rough shape={{t: 'ellipse', cx: 640, cy: 520, w: 560, h: 300}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={prog(f, tGlow, 12)} seed={1034} />
				{/* klatka filmu */}
				<Rough shape={{t: 'rect', x: 440, y: 440, w: 400, h: 160}} o={{strokeWidth: 6}} draw={prog(f, tFilm - 2, 10)} seed={1040} />
				{Array.from({length: 7}).map((_, i) => (
					<g key={i} opacity={prog(f, tFilm + i, 4)}>
						<rect x={458 + i * 54} y={450} width={22} height={16} fill={C.ink} />
						<rect x={458 + i * 54} y={574} width={22} height={16} fill={C.ink} />
					</g>
				))}
				<Rough shape={{t: 'line', x1: 470, y1: 520, x2: 800, y2: 520}} o={{stroke: C.blue, strokeWidth: 9}} draw={prog(f, tGl - 6, 12)} seed={1050} />
				<Rough shape={{t: 'lpath', pts: [[776, 500], [804, 520], [776, 540]]}} o={{stroke: C.blue, strokeWidth: 9}} draw={prog(f, tGl + 4, 4)} seed={1051} />
				<Txt text="gładko" x={640} y={500} size={50} color={C.blue} draw={prog(f, tGl, 8)} seed={1052} />

				{/* rzeczywistość: kręta droga z przeszkodami */}
				<PPath
					pts={[[100, 1000], [220, 1160], [350, 990], [480, 1200], [620, 980], [760, 1180], [900, 1020]]}
					o={{stroke: C.red, strokeWidth: 9}}
					draw={interpolate(f, [t11, tZyc + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
					seed={1060}
				/>
				{/* korki */}
				<g transform={`translate(220 1080) scale(${pop(f, tKor)})`}>
					<Rough shape={{t: 'rect', x: -90, y: -30, w: 180, h: 56}} o={{fill: C.red, fillStyle: 'hachure', hachureGap: 8}} seed={1070} />
					<Rough shape={{t: 'poly', pts: [[-50, -30], [-30, -70], [40, -70], [60, -30]]}} o={{fill: C.paper, fillStyle: 'solid'}} seed={1071} />
					<Rough shape={{t: 'circle', cx: -50, cy: 30, d: 44}} o={{fill: C.ink, fillStyle: 'solid'}} seed={1072} />
					<Rough shape={{t: 'circle', cx: 50, cy: 30, d: 44}} o={{fill: C.ink, fillStyle: 'solid'}} seed={1073} />
				</g>
				{/* poprawki */}
				<g transform={`translate(480 1090) scale(${pop(f, tPop)}) rotate(-6)`}>
					<Rough shape={{t: 'rect', x: -60, y: -80, w: 120, h: 160}} o={{fill: C.paper, fillStyle: 'solid'}} seed={1080} />
					{[0, 1, 2, 3].map((i) => (
						<Rough key={i} shape={{t: 'line', x1: -40, y1: -50 + i * 30, x2: 40, y2: -50 + i * 30}} o={{strokeWidth: 4}} seed={1081 + i} />
					))}
					<Rough shape={{t: 'line', x1: -55, y1: -70, x2: 55, y2: 70}} o={{stroke: C.red, strokeWidth: 10}} seed={1086} />
					<Rough shape={{t: 'line', x1: 55, y1: -70, x2: -55, y2: 70}} o={{stroke: C.red, strokeWidth: 10}} seed={1087} />
				</g>
				{/* zwykłe życie: kubek i „Zzz” */}
				<g transform={`translate(760 1060) scale(${pop(f, tZyc)})`}>
					<Rough shape={{t: 'rect', x: -50, y: -40, w: 100, h: 110}} o={{fill: C.blue, fillStyle: 'hachure', hachureGap: 9}} seed={1090} />
					<Rough shape={{t: 'arc', cx: 50, cy: 15, w: 60, h: 60, a0: -Math.PI / 2, a1: Math.PI / 2}} o={{strokeWidth: 7}} seed={1091} />
					<Rough shape={{t: 'lpath', pts: [[-20, -60], [-10, -80], [-20, -100]]}} o={{strokeWidth: 5}} seed={1092} />
					<Rough shape={{t: 'lpath', pts: [[15, -60], [25, -80], [15, -100]]}} o={{strokeWidth: 5}} seed={1093} />
					<Txt text="Zzz" x={110} y={-90} size={64} seed={1094} />
				</g>
				<WBurst x={220} y={1070} at={tKor} r={100} seed={1100} />
				<WBurst x={480} y={1090} at={tPop} r={100} seed={1120} />
				<WBurst x={760} y={1060} at={tZyc} r={100} seed={1140} />
			</g>
		</g>
	);
};

// Kamera świata: przejazdy między salami i najazd przy marszu bohatera.
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t9 = T(9);
	const t12 = T(12);
	const t5 = T(5);
	const t55 = T(6, '55');
	const cx = kf(f, [
		[0, 540],
		[t5, 540],
		[t5 + 12, 470],
		[t55, 640],
		[t55 + 30, 540],
		[t9 - 8, 540],
		[t9 + 10, 540 + HX],
		[t12 - 4, 540 + HX],
		[t12 + 14, 540],
	]);
	const cy = kf(f, [
		[0, 670],
		[t5, 670],
		[t5 + 12, 760],
		[t55 + 6, 730],
		[t55 + 30, 670],
	]);
	const z = kf(f, [
		[0, 1],
		[t5, 1],
		[t5 + 12, 1.12],
		[t55 + 6, 1.12],
		[t55 + 30, 1],
		[t9 - 8, 1],
		[t9 + 1, 0.9],
		[t9 + 10, 1],
		[t12 - 4, 1],
		[t12 + 5, 0.9],
		[t12 + 14, 1],
	]);
	return <g transform={`translate(${540 - cx * z} ${670 - cy * z}) scale(${z})`}>{children}</g>;
};

const HITS: Hit[] = [
	{t: cue(0, 'spóźniasz'), kind: 'both', amp: 0.8},
	{t: cue(1, '1994'), kind: 'punch', amp: 0.7},
	{t: cue(2, '34'), kind: 'punch', amp: 0.8},
	{t: cue(3, 'najgorzej'), kind: 'shake', amp: 0.6},
	{t: cue(4), kind: 'punch', amp: 0.8},
	{t: cue(6, '55'), kind: 'both', amp: 1.2},
	{t: cue(7, 'najczarniejszym'), kind: 'shake', amp: 0.9},
	{t: cue(8, 'trzeci'), kind: 'punch', amp: 0.6},
	{t: cue(9, 'błąd'), kind: 'punch', amp: 0.9},
	{t: cue(10, 'gładko'), kind: 'punch', amp: 0.4},
	{t: cue(11, 'korków'), kind: 'punch', amp: 0.6},
	{t: cue(11, 'poprawek'), kind: 'punch', amp: 0.6},
	{t: cue(11, 'życia'), kind: 'punch', amp: 0.6},
	{t: cue(13, 'ostatnim'), kind: 'both', amp: 0.9},
];

export const PlanShort: React.FC = () => {
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		Promise.all([document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ'), document.fonts.load('700 80px Caveat', 'Abc≈%')]).then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
				<Paper w={W} h={H} />
			</svg>
			<Doodles />
			<Camera shots={[{from: 0, to: 999, ox: 540, oy: 700, zoom: 1}]} hits={HITS}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
					<defs>
						<clipPath id="stage">
							<rect x={-200} y={-200} width={W + 400} height={1560} />
						</clipPath>
					</defs>
					<g clipPath="url(#stage)">
						<CamWorld>
							<World />
						</CamWorld>
					</g>
				</svg>
			</Camera>
			<Captions lines={LINES} top={1405} left={70} width={840} size={92} />
			<Audio src={staticFile('plan_vo.wav')} />
		</AbsoluteFill>
	);
};
