// Długi film Psychorożka „5 sztuczek polityków”, część 1: wstęp + „zdechły kot” (1920×1080).
// Jedno płótno z trzema salami (wstęp, test uwagi, stół obrad). Kamera jedzie między nimi bez cięć.
// Każdy ruch startuje na słowie lektora (vo1.gen.ts).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, spring, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, Scribble, clamp01} from '../../kit/sketch';
import {Mini, Person} from '../../kit/figures';
import {LINES} from './vo1.gen';

export const W = 1920;
export const H = 1080;
export const FPS = 30;
const RX = [0, 2200, 4400];

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
export const SALA1_FRAMES = Math.round((LINES[41].e + 0.8) * FPS);

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, dur: number) => interpolate(f, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const pop = (f: number, a: number) => (f < a ? 0 : spring({frame: f - a, fps: FPS, config: {damping: 9, stiffness: 170}}));
const pk = (f: number, a: number) => Math.min(1.08, pop(f, a));
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
const live = (f: number, a: number, b: number, fade = 8) => prog(f, a, fade) * (1 - prog(f, b, fade));

// --- kluczowe momenty ----------------------------------------------------------
const tPiec = T(0, 'pięć');
const tWiek = T(1, 'większość');
const tStul = T(2, 'stuleci');
const tPol = T(2, 'politycy');
const tOpc = T(2, 'wszystkich');
const tKlam = T(3, 'kłamstwa');
const tGlowa = T(4, 'głowa');
const tRyb = T(5, 'złota');
const tTrzy = T(5, 'trzy');
const tZap = T(6);
const tPros = T(7);
const tPier = T(8, 'pierwszą');
const tDwie = T(9, 'dwie');
const tDalej = T(10, 'co');
const tTest = T(11, 'testu');
const tZol = T(12, 'żółtą');
const tNie = T(12, 'niebieską');
const tPolicz = T(13);
const tStart = T(15);
const tStop = T(16);
const tJed = T(17, 'jedenaście');
const tUni = T(19, 'jednorożca');
const tPrzesz = T(20);
const tPom = T(21, 'pomachał');
const tCof = T(22);
const t99 = T(23);
const tBad = T(24);
const tPod = T(24, 'podania');
const tGor = T(25, 'goryla');
const tBil = T(25, 'bił');
const tPolowa = T(26, 'połowa');
const tPatrz = T(27);
const tSlep = T(28, 'ślepotą');
const tLat = T(29, 'latarka');
const tZnika = T(30, 'znika');
const tOcz = T(30, 'choć');
const tKto = T(31);
const tDecy = T(31, 'decyduje');
const tNazw = T(32, 'zdechły');
const tBoris = T(33, 'Boris');
const tPrzeg = T(34);
const tRzuc = T(34, 'rzuć');
const tKota = T(34, 'kota');
const tKrzyk = T(35, 'krzykną');
const tNikt = T(35, 'nikt');
const tJak = T(36);
const tGdy = T(37);
const tWcz = T(37, 'wczoraj');
const tRybka2 = T(38, 'złota');
const tPierwsza = T(39);
const tUmow = T(40);
const tZostan = T(41);

// --- test uwagi: tor piłek -----------------------------------------------------
// Żółta piłka uderza o ziemię dokładnie 11 razy, niebieska 9 razy (dla zmylenia).
export const TEST_OFFSET = 12; // klatek po słowie „Start”
export const YELLOW_HITS = [0.5, 1.5, 2.4, 3.5, 4.3, 5.3, 6.5, 7.4, 8.4, 9.5, 10.4];
export const BLUE_HITS = [0.8, 2.1, 3.2, 4.6, 5.8, 7.1, 8.2, 9.6, 10.9];
const TAU_MAX = (tStop - tStart - TEST_OFFSET) / FPS;
const GROUND = 820;
const tri = (v: number, lo: number, hi: number) => {
	const span = hi - lo;
	const m = (((v - lo) % (2 * span)) + 2 * span) % (2 * span);
	return lo + (m < span ? m : 2 * span - m);
};
const ballPos = (hits: number[], tau: number, xs: number, vx: number, r: number) => {
	const g = GROUND - r;
	const x = tri(xs + vx * Math.max(0, tau), 260, 1660);
	if (tau <= 0) return {x, y: 170, sq: 0};
	if (tau < hits[0]) {
		const u = tau / hits[0];
		return {x, y: 170 + (g - 170) * u * u, sq: 0};
	}
	const all = [...hits, hits[hits.length - 1] + 3.4];
	let i = 0;
	while (i < all.length - 2 && tau >= all[i + 1]) i++;
	const d = all[i + 1] - all[i];
	const u = clamp01((tau - all[i]) / d);
	const h = Math.min(500, 420 * d * d);
	const sq = Math.max(0, 1 - (tau - all[i]) / 0.09);
	return {x, y: g - 4 * h * u * (1 - u), sq};
};

// --- rekwizyty ------------------------------------------------------------------
const Guy: React.FC<{x: number; y: number; s?: number; draw?: number; seed?: number; arms?: 'down' | 'up'; color?: string; look?: number}> = ({
	x,
	y,
	s = 1,
	draw = 1,
	seed = 500,
	arms = 'down',
	color = C.ink,
	look = 0,
}) => {
	if (draw <= 0) return null;
	const a: [number, number][] =
		arms === 'up'
			? [
					[-70, -10],
					[0, 70],
					[70, -10],
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
		</g>
	);
};

// Widz na krześle, patrzy w prawo.
const SeatGuy: React.FC<{x: number; y: number; s?: number; shock?: number}> = ({x, y, s = 1, shock = 0}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Rough shape={{t: 'lpath', pts: [[-70, -40], [-70, 250], [-70, 130], [60, 130], [60, 250]]}} o={{strokeWidth: 7, stroke: '#8A8072'}} seed={610} />
		<Rough shape={{t: 'circle', cx: 0, cy: -60, d: 86}} o={{fill: C.paper, fillStyle: 'solid'}} seed={611} />
		<Rough shape={{t: 'lpath', pts: [[0, -16], [-6, 110], [90, 112], [96, 240]]}} seed={612} />
		<Rough shape={{t: 'lpath', pts: [[-2, 30], [70, 70 - shock * 70]]}} seed={613} />
		<circle cx={10} cy={-66} r={5 + shock * 4} fill={C.ink} />
		<circle cx={32} cy={-66} r={5 + shock * 4} fill={C.ink} />
	</g>
);

const Fishbowl: React.FC<{x: number; y: number; s?: number; draw?: number; flip?: boolean}> = ({x, y, s = 1, draw = 1, flip = false}) => {
	const f = useCurrentFrame();
	const sw = Math.sin(Math.floor(f / 3) * 0.5) * 16;
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<Rough shape={{t: 'ellipse', cx: 0, cy: 34, w: 210, h: 150}} o={{fill: C.blue, fillStyle: 'hachure', hachureGap: 11, fillWeight: 3, stroke: 'none'}} draw={draw} seed={640} />
			<g transform={`translate(${sw} 30) scale(${flip ? -1 : 1} 1)`} opacity={draw}>
				<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 84, h: 50}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={641} />
				<Rough shape={{t: 'poly', pts: [[-40, 0], [-76, -26], [-76, 26]]}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={642} />
				<circle cx={22} cy={-6} r={4.5} fill={C.ink} />
			</g>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 250}} o={{strokeWidth: 7}} draw={draw} seed={643} />
			<Rough shape={{t: 'ellipse', cx: 0, cy: -112, w: 150, h: 26}} o={{strokeWidth: 6, fill: C.paper, fillStyle: 'solid'}} draw={draw} seed={644} />
		</g>
	);
};

// Pasek pięciu sztuczek. lit = ile odcinków zapalonych, pulse = który pulsuje (-1 = żaden).
const Bar: React.FC<{x: number; y: number; draw: number; lit: number; pulse?: number; checks?: number}> = ({x, y, draw, lit, pulse = -1, checks = 0}) => {
	const f = useCurrentFrame();
	if (draw <= 0) return null;
	const w = 170;
	const gap = 16;
	const x0 = x - (5 * w + 4 * gap) / 2;
	return (
		<g>
			{[0, 1, 2, 3, 4].map((i) => {
				const on = i < lit || (i === pulse && Math.floor(f / 8) % 2 === 0);
				return (
					<g key={i}>
						<Rough
							shape={{t: 'rect', x: x0 + i * (w + gap), y, w, h: 54}}
							o={{fill: on ? C.yellow : undefined, fillStyle: 'hachure', hachureGap: 8, fillWeight: 4, strokeWidth: 6}}
							draw={clamp01(draw * 1.6 - i * 0.12)}
							seed={660 + i}
						/>
						<Txt text={`${i + 1}`} x={x0 + i * (w + gap) + w / 2} y={y + 42} size={46} draw={clamp01(draw * 1.6 - i * 0.12)} seed={670 + i} />
						{i < checks && <Rough shape={{t: 'lpath', pts: [[x0 + i * (w + gap) + 110, y + 16], [x0 + i * (w + gap) + 128, y + 40], [x0 + i * (w + gap) + 164, y - 14]]}} o={{stroke: C.red, strokeWidth: 9}} seed={680 + i} />}
					</g>
				);
			})}
		</g>
	);
};

// Jednorożec z żarówką zamiast rogu (maskotka kanału), idzie w lewo.
const Unicorn: React.FC<{x: number; y: number; s?: number; walk: number; wave: number}> = ({x, y, s = 1, walk, wave}) => {
	const f = useCurrentFrame();
	const legs = [-62, -30, 42, 72];
	const wv = Math.sin(Math.floor(f / 2) * 0.9) * 26;
	return (
		<g transform={`translate(${x} ${y + Math.abs(Math.sin(walk)) * -8}) scale(${s})`}>
			{legs.map((lx, i) => {
				const sh = Math.sin(walk + (i % 2) * Math.PI) * 22;
				if (i === 0 && wave > 0.01) {
					return <Rough key={i} shape={{t: 'lpath', pts: [[lx, 30], [lx - 46, lerp(60, 4, wave)], [lx - 86, lerp(110, -50 + wv, wave)]]}} seed={700 + i} />;
				}
				return <Rough key={i} shape={{t: 'line', x1: lx, y1: 40, x2: lx + sh, y2: 150}} seed={700 + i} />;
			})}
			<Rough shape={{t: 'lpath', pts: [[92, -10], [140, -30], [150, 40], [128, 90]]}} o={{stroke: C.red, strokeWidth: 7}} seed={705} />
			<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 200, h: 112}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={706} />
			<Rough shape={{t: 'poly', pts: [[-70, -30], [-118, -130], [-78, -140], [-40, -40]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={707} />
			<Rough shape={{t: 'ellipse', cx: -128, cy: -128, w: 104, h: 66}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={708} />
			<Rough shape={{t: 'lpath', pts: [[-80, -150], [-62, -110], [-74, -80], [-50, -52]]}} o={{stroke: C.red, strokeWidth: 7}} seed={709} />
			<Rough shape={{t: 'line', x1: -120, y1: -160, x2: -134, y2: -196}} o={{strokeWidth: 6}} seed={710} />
			<Rough shape={{t: 'circle', cx: -140, cy: -220, d: 54}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={711} />
			<circle cx={-146} cy={-134} r={5} fill={C.ink} />
		</g>
	);
};

const Gorilla: React.FC<{x: number; y: number; s?: number; beat: number}> = ({x, y, s = 1, beat}) => {
	const f = useCurrentFrame();
	const ph = beat > 0 ? Math.floor(f / 4) % 2 : -1;
	const fill = {fill: C.ink, fillStyle: 'hachure' as const, hachureGap: 7, fillWeight: 5, strokeWidth: 7};
	return (
		<g transform={`translate(${x} ${y + (ph === 0 ? -6 : 0)}) scale(${s})`}>
			<Rough shape={{t: 'lpath', pts: [[-70, 120], [-80, 250], [-120, 250]]}} o={{strokeWidth: 26}} seed={730} />
			<Rough shape={{t: 'lpath', pts: [[70, 120], [80, 250], [120, 250]]}} o={{strokeWidth: 26}} seed={731} />
			<Rough shape={{t: 'ellipse', cx: 0, cy: 20, w: 280, h: 300}} o={fill} seed={732} />
			<Rough shape={{t: 'circle', cx: 0, cy: -170, d: 160}} o={fill} seed={733} />
			<Rough shape={{t: 'ellipse', cx: 0, cy: -150, w: 96, h: 80}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={734} />
			<circle cx={-18} cy={-164} r={6} fill={C.ink} />
			<circle cx={18} cy={-164} r={6} fill={C.ink} />
			<Rough shape={{t: 'line', x1: -18, y1: -132, x2: 18, y2: -132}} o={{strokeWidth: 5}} seed={735} />
			<Rough shape={{t: 'lpath', pts: [[-130, -60], [-190, 30], ph === 0 ? [-50, 0] : [-150, 130]]}} o={{strokeWidth: 30}} seed={736} />
			<Rough shape={{t: 'lpath', pts: [[130, -60], [190, 30], ph === 1 ? [50, 0] : [150, 130]]}} o={{strokeWidth: 30}} seed={737} />
		</g>
	);
};

const DeadCat: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<Rough shape={{t: 'lpath', pts: [[100, -10], [160, -40], [190, 0], [170, 30]]}} o={{strokeWidth: 9}} seed={760} />
		{[-50, -15, 30, 65].map((lx, i) => (
			<Rough key={i} shape={{t: 'line', x1: lx, y1: -30, x2: lx + (i % 2 ? 14 : -14), y2: -110}} o={{strokeWidth: 8}} seed={761 + i} />
		))}
		<Rough shape={{t: 'ellipse', cx: 10, cy: 0, w: 220, h: 96}} o={{fill: '#8A8072', fillStyle: 'hachure', hachureGap: 8, fillWeight: 4, strokeWidth: 7}} seed={766} />
		<Rough shape={{t: 'circle', cx: -120, cy: -6, d: 96}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={767} />
		<Rough shape={{t: 'poly', pts: [[-158, -36], [-166, -76], [-132, -50]]}} o={{fill: C.paper, fillStyle: 'solid'}} seed={768} />
		<Rough shape={{t: 'poly', pts: [[-108, -50], [-84, -78], [-82, -34]]}} o={{fill: C.paper, fillStyle: 'solid'}} seed={769} />
		{[-138, -104].map((ex, i) => (
			<g key={i}>
				<line x1={ex - 9} y1={-19} x2={ex + 9} y2={-1} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
				<line x1={ex + 9} y1={-19} x2={ex - 9} y2={-1} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
			</g>
		))}
		<Rough shape={{t: 'lpath', pts: [[-134, 20], [-120, 12], [-106, 20]]}} o={{strokeWidth: 4}} seed={770} />
	</g>
);

// --- świat --------------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();

	// ===== SALA 0: wstęp =====
	const merge = prog(f, tStul - 12, 16);
	const boxes = [0, 1, 2, 3, 4].map((i) => {
		const bx = lerp(760 + i * 200, 1230, merge);
		const by = lerp(170, 470, merge);
		const lit = f >= tPiec + i * 4;
		const sc = (lit ? 0.9 + 0.1 * pk(f, tPiec + i * 4) : 1) * (1 - merge * 0.75);
		return (
			<g key={i} transform={`translate(${bx + 75} ${by + 75}) scale(${sc}) translate(-75 -75)`} opacity={1 - merge}>
				<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: lit ? C.yellow : undefined, fillStyle: 'hachure', hachureGap: 9, fillWeight: 4, strokeWidth: 7}} seed={800 + i} />
				<Txt text={`${i + 1}`} x={75} y={108} size={110} seed={810 + i} opacity={lit ? 1 : 0.25} />
				{i < 4 && f >= tWiek + i * 4 && (
					<Rough shape={{t: 'lpath', pts: [[20, 70], [62, 124], [150, -10]]}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, tWiek + i * 4, 6)} seed={820 + i} />
				)}
			</g>
		);
	});

	const lectern = live(f, tStul - 6, tRyb - 12, 10);
	const hat = f < tPol ? 0 : f < tOpc ? 1 : 2 + (Math.floor((f - tOpc) / 7) % 3);
	const polVisible = f >= tStul - 2 && f < tRyb - 4;

	const bowl0 = prog(f, tRyb - 4, 14) * (1 - prog(f, tTest + 10, 10));
	const bar0 = prog(f, tPros, 16);

	// ===== SALA 1: test uwagi =====
	const X1 = RX[1];
	let tau = clamp01((f - tStart - TEST_OFFSET) / (TAU_MAX * FPS)) * TAU_MAX;
	const REW = 6.4; // chwila, w której jednorożec macha
	if (f >= tUni + 6) tau = lerp(TAU_MAX, REW, prog(f, tUni + 6, 26));
	if (f >= tPom) tau = REW + (((f - tPom) / FPS) * 0.6) % 0.9;
	const testOn = f < t99 + 14;
	const yb = ballPos(YELLOW_HITS, tau, 520, 150, 46);
	const bb = ballPos(BLUE_HITS, tau, 1380, -190, 46);
	const uniX = kf(tau * FPS, [
		[3.5 * FPS, 2150],
		[5.5 * FPS, 960],
		[7.5 * FPS, 960],
		[9.7 * FPS, -260],
	]);
	const uniWalk = tau > 3.5 && tau < 5.5 ? tau * 9 : tau > 7.5 && tau < 9.7 ? tau * 9 : 0;
	const uniWave = tau >= 5.5 && tau <= 7.5 ? Math.min(1, (tau - 5.5) * 4, (7.5 - tau) * 4) : 0;
	const uniOut = prog(f, t99, 12);

	// eksperyment z gorylem
	const players: [number, number][] = [
		[470, 300],
		[800, 250],
		[1120, 250],
		[1450, 300],
		[620, 470],
		[1300, 470],
	];
	const plDraw = prog(f, tBad, 22);
	const passI = Math.max(0, Math.floor((f - tPod) / 12));
	const passU = ease(clamp01(((f - tPod) % 12) / 9));
	const order = [0, 2, 4, 1, 5, 3];
	const pa = players[order[passI % 6]];
	const pb = players[order[(passI + 1) % 6]];
	const ballX = f < tPod ? lerp(yb.x, players[0][0] + 60, prog(f, tBad, 18)) : lerp(pa[0], pb[0], passU) + 60;
	const ballY = f < tPod ? lerp(yb.y, players[0][1] + 90, prog(f, tBad, 18)) : lerp(pa[1], pb[1], passU) + 90 - Math.sin(passU * Math.PI) * 50;
	const gorX = lerp(2150, 960, prog(f, tGor - 16, 34));
	const gorOn = f >= tGor - 16;

	// ciemność i latarka (obejmuje salę 1 i 2)
	const X2 = RX[2];
	const dk = prog(f, tZnika - 4, 16) * (1 - prog(f, tJak, 14));
	const FOLD = {x: X2 + 760, y: 590};
	const CAT = {x: X2 + 1180, y: 560};
	let sx = X1 + ballX;
	let sy = ballY;
	let sr = 190;
	if (f >= tKto) {
		const u = prog(f, tKto, tDecy - tKto + 14);
		sx = lerp(X1 + ballX, FOLD.x, u);
		sy = lerp(ballY, FOLD.y - 30, u);
		sr = lerp(190, 300, u);
	}
	if (f >= tKota - 3) {
		const u = prog(f, tKota - 3, 9);
		sx = lerp(FOLD.x, CAT.x, u);
		sy = lerp(FOLD.y - 30, CAT.y - 20, u);
		sr = 310;
	}
	const overCol = dk > 0.5 ? C.paper : C.ink;

	// ===== SALA 2: stół obrad =====
	const tableDraw = prog(f, tDecy - 6, 20);
	const catFall = f < tRzuc ? 0 : prog(f, tRzuc + 4, Math.max(6, tKota - tRzuc - 4));
	const catY = lerp(-420, CAT.y - X2 * 0, catFall * catFall);
	const catGone = prog(f, tJak + 4, 10);
	const heads = [560, 820, 1100, 1360];
	const alarm = f >= tKrzyk - 2;
	const cal = prog(f, tGdy + 20, 14);
	const flip = prog(f, tWcz, 12);
	const fishX = lerp(-300, 2300, clamp01((f - tRybka2 + 10) / 150));
	const bar2 = prog(f, tPierwsza - 4, 14);

	return (
		<g>
			{/* ---------- SALA 0 ---------- */}
			<g>
				<SeatGuy x={380} y={500} s={1.45} shock={f >= tPiec ? Math.max(0, 1 - (f - tPiec) / 40) : 0} />
				{boxes}
				{/* mównica i polityk */}
				{lectern > 0 && (
					<g opacity={lectern}>
						{polVisible && (
							<g>
								<Guy x={1300} y={262} s={1.6} seed={840} arms={hat >= 2 ? 'up' : 'down'} />
								{hat === 0 && <Rough shape={{t: 'arc', cx: 1300, cy: 246, w: 170, h: 130, a0: Math.PI, a1: Math.PI * 2}} o={{stroke: '#6B8F4E', strokeWidth: 12}} seed={845} />}
								{(hat === 1 || hat === 3) && (
									<g>
										<Rough shape={{t: 'rect', x: 1252, y: 86, w: 96, h: 120}} o={{fill: C.ink, fillStyle: 'solid'}} seed={846} />
										<Rough shape={{t: 'line', x1: 1216, y1: 208, x2: 1384, y2: 208}} o={{strokeWidth: 10}} seed={847} />
									</g>
								)}
								{(hat === 2 || hat === 4) && <Rough shape={{t: 'poly', pts: [[1300, 330], [1278, 366], [1300, 440], [1322, 366]]}} o={{fill: hat === 2 ? C.red : C.blue, fillStyle: 'solid', strokeWidth: 4}} seed={848} />}
							</g>
						)}
						<Rough shape={{t: 'poly', pts: [[1180, 470], [1420, 470], [1390, 800], [1210, 800]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={prog(f, tStul - 6, 16)} seed={850} />
						<Rough shape={{t: 'rect', x: 1160, y: 440, w: 280, h: 34}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 7}} draw={prog(f, tStul - 2, 14)} seed={851} />
						<Rough shape={{t: 'lpath', pts: [[1380, 440], [1380, 380], [1350, 350]]}} o={{strokeWidth: 6}} draw={prog(f, tStul + 2, 10)} seed={852} />
						<circle cx={1344} cy={344} r={14} fill={C.ink} opacity={prog(f, tStul + 8, 6)} />
					</g>
				)}
				{/* „kłamstwo” skreślone */}
				<g opacity={live(f, tKlam - 8, tGlowa - 2)}>
					<Txt text="kłamstwo" x={1620} y={330} size={96} draw={prog(f, tKlam - 8, 10)} seed={855} rotate={-4} />
					<Rough shape={{t: 'line', x1: 1470, y1: 318, x2: 1780, y2: 290}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, tKlam, 8)} seed={856} />
				</g>
				{/* trybiki w głowie */}
				<g opacity={live(f, tGlowa - 14, tRyb - 6)}>
					<Rough shape={{t: 'ellipse', cx: 640, cy: 300, w: 300, h: 210}} o={{stroke: C.blue, strokeWidth: 6}} draw={prog(f, tGlowa - 14, 14)} seed={860} />
					<circle cx={520} cy={420} r={14} fill="none" stroke={C.blue} strokeWidth={5} />
					<circle cx={488} cy={458} r={8} fill="none" stroke={C.blue} strokeWidth={5} />
					{[
						[600, 300, 100, 1],
						[694, 318, 70, -1.5],
					].map(([gx, gy, gd, dir], i) => (
						<g key={i} transform={`rotate(${Math.floor(f / 3) * 9 * dir} ${gx} ${gy})`}>
							<Rough shape={{t: 'circle', cx: gx, cy: gy, d: gd}} o={{strokeWidth: 7}} seed={862 + i} />
							{[0, 45, 90, 135].map((a) => (
								<line key={a} x1={gx - (gd / 2 + 12) * Math.cos((a * Math.PI) / 180)} y1={gy - (gd / 2 + 12) * Math.sin((a * Math.PI) / 180)} x2={gx + (gd / 2 + 12) * Math.cos((a * Math.PI) / 180)} y2={gy + (gd / 2 + 12) * Math.sin((a * Math.PI) / 180)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
							))}
						</g>
					))}
				</g>
				{/* złota rybka */}
				<Fishbowl x={1250} y={520} s={1.25} draw={bowl0} />
				<g opacity={bowl0} transform={`translate(1560 430) scale(${pk(f, tTrzy)}) translate(-1560 -430)`}>
					<Txt text="3 s" x={1560} y={470} size={190} color={C.red} seed={870} />
					<Rough shape={{t: 'line', x1: 1470, y1: 500, x2: 1660, y2: 492}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, tZap, 10)} seed={871} />
				</g>
				{/* pasek pięciu sztuczek */}
				<g opacity={1 - prog(f, tTest + 10, 10)}>
					<Bar x={960} y={900} draw={bar0} lit={f >= tPier ? 1 : 0} />
					<g opacity={pk(f, tDwie)}>
						<Txt text="tylko 2 minuty" x={700} y={856} size={70} color={C.red} seed={875} rotate={-3} />
					</g>
					<g opacity={pk(f, tDalej)}>
						<Txt text="?" x={1150} y={880} size={90} seed={876} />
					</g>
				</g>
			</g>

			{/* ---------- SALA 1 ---------- */}
			<g transform={`translate(${X1} 0)`}>
				<Rough shape={{t: 'line', x1: 120, y1: GROUND, x2: 1800, y2: GROUND}} o={{strokeWidth: 8}} draw={prog(f, tTest, 20)} seed={900} />
				<g opacity={live(f, tPolicz, tStop + 4)}>
					<Txt text="policz odbicia ŻÓŁTEJ piłki" x={960} y={120} size={104} draw={prog(f, tPolicz, 16)} seed={901} />
				</g>
				{/* jednorożec */}
				{testOn && uniOut < 1 && (
					<g opacity={1 - uniOut}>
						<Unicorn x={uniX} y={640} s={1.25} walk={uniWalk} wave={uniWave} />
					</g>
				)}
				{f >= tPrzesz && f < t99 + 6 && <Rough shape={{t: 'ellipse', cx: 900, cy: 520, w: 520, h: 600}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, tPrzesz, 14)} seed={905} />}
				<g opacity={live(f, tUni + 4, tUni + 36, 4) + live(f, tCof, t99 - 4, 4)}>
					<Txt text="◀◀" x={1700} y={150} size={110} color={C.red} seed={906} />
				</g>
				<Scribble x={700} y={330} w={420} h={480} draw={live(f, t99 - 2, t99 + 14, 6)} seed={907} />
				{/* piłki testowe */}
				{f < tBad + 18 && (
					<g opacity={1 - prog(f, tBad + 6, 10)}>
						<g transform={`translate(${bb.x} ${bb.y + bb.sq * 8}) scale(${pk(f, tNie) * (1 + bb.sq * 0.18)} ${pk(f, tNie) * (1 - bb.sq * 0.2)})`}>
							<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 92}} o={{fill: C.blue, fillStyle: 'solid', strokeWidth: 7}} seed={910} />
						</g>
					</g>
				)}
				{f < tPod && (
					<g transform={`translate(${f < tBad ? yb.x : ballX} ${(f < tBad ? yb.y : ballY) + yb.sq * 8}) scale(${pk(f, tZol) * (1 + yb.sq * 0.18)} ${pk(f, tZol) * (1 - yb.sq * 0.2)})`}>
						<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 92}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 7}} seed={911} />
					</g>
				)}
				{/* wynik: 11 */}
				<g opacity={live(f, tJed, tUni - 4)} transform={`translate(960 560) scale(${pk(f, tJed)}) translate(-960 -560)`}>
					<Txt text="11 odbić" x={960} y={640} size={250} color={C.red} seed={915} />
				</g>
				{/* eksperyment 1999 */}
				<g opacity={live(f, t99 + 4, tBad - 2)}>
					<Txt text="Simons i Chabris, 1999" x={960} y={480} size={120} draw={prog(f, t99 + 4, 20)} seed={918} />
				</g>
				{f >= tBad && (
					<g>
						{players.map(([px, py], i) => (
							<Person key={i} x={px} y={py} s={0.9} draw={clamp01(plDraw * 1.5 - i * 0.08)} seed={920 + i * 5} color={i % 2 ? C.ink : '#8A8072'} arms={order[passI % 6] === i || order[(passI + 1) % 6] === i ? 'reach' : 'down'} />
						))}
						{gorOn && <Gorilla x={gorX} y={520} s={1.05} beat={f >= tBil ? 1 : 0} />}
						{f >= tPod && (
							<g transform={`translate(${ballX} ${ballY})`}>
								<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 78}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 7}} seed={911} />
							</g>
						)}
						{/* połowa badanych */}
						{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
							const miss = i < 5 && f >= tPolowa + i * 3;
							return (
								<g key={i} opacity={prog(f, tPolowa - 14 + i * 2, 8)}>
									<Mini x={555 + i * 90} y={930} s={1.5} seed={950 + i} color={miss ? C.red : C.ink} filled={miss} />
									{miss && <Txt text="?" x={555 + i * 90} y={896} size={70} color={C.red} seed={960 + i} />}
								</g>
							);
						})}
						{f >= tPatrz && f < tSlep && [0, 1, 2, 3, 4].map((i) => <Rough key={i} shape={{t: 'line', x1: 555 + i * 90, y1: 880, x2: 960, y2: 620}} o={{stroke: C.red, strokeWidth: 4, strokeLineDash: [12, 12]}} draw={prog(f, tPatrz + i * 2, 10)} seed={970 + i} />)}
					</g>
				)}
				{/* latarka */}
				{f >= tLat - 4 && (
					<g opacity={prog(f, tLat - 4, 8) * (1 - prog(f, tKto + 10, 10))}>
						<polygon points={`250,960 ${ballX - 120},${ballY - 120} ${ballX + 130},${ballY + 120}`} fill={C.yellow} opacity={0.28} />
						<Rough shape={{t: 'poly', pts: [[150, 1010], [240, 930], [280, 975], [190, 1050]]}} o={{fill: C.ink, fillStyle: 'solid'}} seed={975} />
					</g>
				)}
			</g>

			{/* ---------- SALA 2 ---------- */}
			<g transform={`translate(${X2} 0)`}>
				{heads.map((hx, i) => (
					<g key={i} opacity={tableDraw}>
						<Guy x={hx} y={alarm ? 372 : 380} s={1.05} seed={1000 + i * 5} draw={tableDraw} arms={alarm && f < tJak ? 'up' : 'down'} look={f >= tKota && f < tJak ? (hx < 1180 ? 1 : -1) : f < tKota ? (hx < 760 ? 1 : -1) : 0} />
					</g>
				))}
				<Rough shape={{t: 'poly', pts: [[380, 640], [1540, 640], [1620, 720], [300, 720]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={tableDraw} seed={1030} />
				<Rough shape={{t: 'line', x1: 420, y1: 724, x2: 400, y2: 980}} o={{strokeWidth: 8}} draw={tableDraw} seed={1031} />
				<Rough shape={{t: 'line', x1: 1500, y1: 724, x2: 1520, y2: 980}} o={{strokeWidth: 8}} draw={tableDraw} seed={1032} />
				{/* teczka */}
				<g transform={`rotate(-5 760 600)`} opacity={tableDraw}>
					<Rough shape={{t: 'rect', x: 650, y: 540, w: 230, h: 130}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, fillWeight: 4, strokeWidth: 7}} draw={tableDraw} seed={1035} />
					<Txt text="niewygodna" x={765} y={600} size={44} seed={1036} draw={prog(f, tDecy + 6, 10)} />
					<Txt text="sprawa" x={765} y={644} size={44} seed={1037} draw={prog(f, tDecy + 12, 8)} />
				</g>
				{/* kot */}
				{f >= tRzuc && catGone < 1 && (
					<g opacity={1 - catGone}>
						<DeadCat x={CAT.x - X2} y={f < tKota ? catY : 560 - Math.max(0, 22 * Math.exp(-(f - tKota) / 4) * Math.cos((f - tKota) * 0.9))} s={1.15} rot={f < tKota ? (1 - catFall) * -200 : 0} />
					</g>
				)}
				<Scribble x={1010} y={430} w={360} h={230} draw={live(f, tJak + 2, tJak + 16, 5)} seed={1040} />
				{f >= tJak + 10 && (
					<g transform={`translate(1180 500) scale(${pk(f, tJak + 10)}) translate(-1180 -500)`} opacity={1 - prog(f, tPierwsza - 6, 8)}>
						<Txt text="?" x={1180} y={600} size={330} color={C.red} seed={1042} />
					</g>
				)}
				{/* kalendarz */}
				<g opacity={cal * (1 - prog(f, tPierwsza - 6, 8))}>
					<Rough shape={{t: 'rect', x: 1560, y: 150, w: 250, h: 250}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={cal} seed={1045} />
					<Rough shape={{t: 'rect', x: 1560, y: 150, w: 250, h: 60}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 7}} draw={cal} seed={1046} />
					<g transform={`translate(0 ${-flip * 20})`} opacity={1 - flip}>
						<Txt text="DZIŚ" x={1685} y={335} size={96} seed={1047} />
					</g>
					<g opacity={flip}>
						<Txt text="WCZORAJ" x={1685} y={325} size={54} color={C.red} seed={1048} />
					</g>
				</g>
				{f >= tWcz && (
					<g opacity={1 - prog(f, tPierwsza - 6, 8)}>
						<Rough shape={{t: 'ellipse', cx: 762, cy: 600, w: 330, h: 230}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, tWcz + 4, 12)} seed={1050} />
						<Rough shape={{t: 'lpath', pts: [[1560, 400], [1300, 470], [960, 560]]}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, tWcz + 2, 12)} seed={1051} />
					</g>
				)}
				{/* rybka przepływa */}
				{f >= tRybka2 - 10 && fishX < 2250 && <Fishbowl x={fishX} y={850} s={0.7} flip />}
				{/* pasek: druga sztuczka */}
				<g opacity={bar2}>
					<rect x={380} y={830} width={1160} height={190} fill={C.paper} opacity={0.94} />
					<Bar x={960} y={900} draw={bar2} lit={1} checks={1} pulse={f >= tUmow ? 1 : -1} />
					<g opacity={pk(f, tZostan)}>
						<Txt text="jeszcze jedna?" x={726} y={870} size={64} color={C.red} seed={1060} rotate={-3} />
					</g>
				</g>
			</g>

			{/* ---------- ciemność z plamą światła ---------- */}
			{dk > 0.001 && (
				<g>
					<defs>
						<radialGradient id="s1spotg">
							<stop offset="0.72" stopColor="black" />
							<stop offset="1" stopColor="white" />
						</radialGradient>
						<mask id="s1spotm" maskUnits="userSpaceOnUse" x={X1 - 500} y={-400} width={5600} height={1900}>
							<rect x={X1 - 500} y={-400} width={5600} height={1900} fill="white" />
							<circle cx={sx} cy={sy} r={sr} fill="url(#s1spotg)" />
						</mask>
					</defs>
					<rect x={X1 - 500} y={-400} width={5600} height={1900} fill="#14110F" opacity={dk * 0.93} mask="url(#s1spotm)" />
				</g>
			)}
			{/* oczy goryla w ciemności */}
			{f >= tOcz && f < tKto + 30 && Math.floor(f / 20) % 4 !== 3 && (
				<g opacity={dk}>
					<circle cx={X1 + 960 - 19} cy={520 - 172} r={8} fill={C.paper} />
					<circle cx={X1 + 960 + 19} cy={520 - 172} r={8} fill={C.paper} />
				</g>
			)}
			{/* napisy nad ciemnością */}
			<g opacity={live(f, tSlep - 2, tKto + 4)}>
				<Txt text="ślepota z nieuwagi" x={X1 + 960} y={130} size={120} color={overCol} draw={prog(f, tSlep - 2, 16)} seed={1100} />
			</g>
			<g opacity={live(f, tNazw - 2, tPierwsza - 8)} transform={`translate(${X2 + 960} 150) scale(${0.9 + 0.1 * pk(f, tNazw)}) translate(${-(X2 + 960)} -150)`}>
				<Txt text="„zdechły kot”" x={X2 + 960} y={205} size={130} color={dk > 0.5 ? C.yellow : C.red} draw={prog(f, tNazw - 2, 12)} seed={1101} />
			</g>
			<g opacity={live(f, tBoris - 2, tPrzeg + 6)}>
				<Txt text="Boris Johnson, „The Telegraph”, 2013" x={X2 + 960} y={290} size={62} color={overCol} draw={prog(f, tBoris - 2, 18)} seed={1102} />
			</g>
			{alarm && f < tJak && heads.map((hx, i) => (
				<g key={i} transform={`translate(${X2 + hx} 300) scale(${pk(f, tKrzyk - 2 + i * 2)}) translate(${-(X2 + hx)} -300)`}>
					<Txt text="!" x={X2 + hx + 70} y={350} size={120} color={C.yellow} seed={1110 + i} />
				</g>
			))}
			<g opacity={live(f, tNikt, tJak)}>
				<Txt text="sprawa? jaka sprawa?" x={X2 + 660} y={900} size={72} color={C.paper} draw={prog(f, tNikt, 16)} seed={1120} rotate={-2} />
			</g>
			<g opacity={live(f, tGdy + 4, tPierwsza - 8)}>
				<Txt text="o czym mówiliśmy wczoraj?" x={X2 + 960} y={1052} size={92} draw={prog(f, tWcz - 20, 22)} seed={1121} />
			</g>
		</g>
	);
};

// --- kamera -------------------------------------------------------------------------
const HITS: [number, number][] = [
	[tPiec, 0.6],
	[tTrzy, 0.7],
	[tStop, 0.8],
	[tJed, 1],
	[tUni, 1.2],
	[tGor, 0.8],
	[tPolowa, 0.6],
	[tNazw, 1],
	[tKota, 1.6],
	[tKrzyk, 0.7],
	[tWcz, 0.8],
];
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const cx = kf(f, [
		[0, 960],
		[tGlowa - 12, 960],
		[tGlowa + 6, 640],
		[tRyb - 12, 640],
		[tRyb + 8, 1180],
		[tPros - 4, 1180],
		[tPros + 14, 960],
		[tTest - 4, 960],
		[tTest + 24, RX[1] + 960],
		[tPrzesz - 6, RX[1] + 960],
		[tPrzesz + 12, RX[1] + 900],
		[t99 - 6, RX[1] + 900],
		[t99 + 12, RX[1] + 960],
		[tKto, RX[1] + 960],
		[tDecy + 14, RX[2] + 900],
		[tRzuc, RX[2] + 900],
		[tKota - 2, RX[2] + 1000],
		[tJak, RX[2] + 1000],
		[tJak + 16, RX[2] + 960],
	]);
	const cy = kf(f, [
		[0, 540],
		[tGlowa - 12, 540],
		[tGlowa + 6, 420],
		[tRyb - 12, 420],
		[tRyb + 8, 520],
		[tPros + 14, 560],
		[tTest + 24, 540],
		[tPrzesz - 6, 540],
		[tPrzesz + 12, 500],
		[t99 - 6, 500],
		[t99 + 12, 540],
		[tPolowa - 18, 540],
		[tPolowa - 4, 590],
		[tSlep - 8, 590],
		[tSlep + 8, 540],
	]);
	const z = kf(f, [
		[0, 1],
		[tGlowa - 12, 1],
		[tGlowa + 6, 1.45],
		[tRyb - 12, 1.45],
		[tRyb + 8, 1.2],
		[tPros - 4, 1.2],
		[tPros + 14, 1],
		[tPrzesz - 6, 1],
		[tPrzesz + 12, 1.3],
		[t99 - 6, 1.3],
		[t99 + 12, 1],
		[tGor - 6, 1],
		[tGor + 12, 1.1],
		[tPolowa - 18, 1.1],
		[tPolowa - 4, 1],
		[tRzuc, 1],
		[tKota - 2, 1.12],
		[tJak, 1.12],
		[tJak + 16, 1],
	]);
	let punch = 0;
	let shake = 0;
	for (const [t, amp] of HITS) {
		if (f >= t) {
			const d = f - t;
			punch += 0.035 * amp * Math.exp(-d / 5);
			shake += 9 * amp * Math.exp(-d / 4) * Math.sin(d * 2.4);
		}
	}
	const zz = z * (1 + punch);
	return <g transform={`translate(${960 - cx * zz + shake} ${540 - cy * zz}) scale(${zz})`}>{children}</g>;
};

export const Sala1: React.FC = () => {
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”◀?!').then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
				<Paper w={W} h={H} />
				<CamWorld>
					<World />
				</CamWorld>
			</svg>
			<Audio src={staticFile('sz1_vo.wav')} />
		</AbsoluteFill>
	);
};
