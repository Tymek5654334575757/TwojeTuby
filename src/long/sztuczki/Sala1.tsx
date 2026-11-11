// Długi film Psychorożka „5 sztuczek polityków”, część 1: wstęp + „zdechły kot” (1920×1080), wersja 2.
// Eksperyment jest opisany (nie robimy go na widzu), potem pokaz użycia w polityce.
// Jedno płótno z czterema salami: wstęp, eksperyment z gorylem, stół obrad, afera i ustawa.
// Każdy ruch startuje na słowie lektora (vo1.gen.ts).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, spring, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, clamp01} from '../../kit/sketch';
import {Mini, Person, LabCoat} from '../../kit/figures';
import {LINES} from './vo1.gen';

export const W = 1920;
export const H = 1080;
export const FPS = 30;
const RX = [0, 2200, 4400, 6600];

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
export const SALA1_FRAMES = Math.round((LINES[34].e + 1.0) * FPS);

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
const tPolityk = T(0, 'polityk');
const tKlam = T(0, 'kłamać');
const tGlowa = T(1, 'głowa');
const tPiec = T(2, 'pięć');
const tCiebie = T(2, 'ciebie');
const tTych = T(2, 'tych');
const tPsy = T(3, 'psycholodzy');
const tWiad = T(4, 'wiadomościach');
const tSzt = T(5);
const tTytul = T(5, 'zdechły');
const t99 = T(6);
const tNagr = T(6, 'nagranie');
const tSzesc = T(7);
const tPod = T(8, 'podania');
const tGor = T(9, 'goryla');
const tBil = T(10, 'bije');
const tWych = T(10, 'wychodzi');
const tPolowa = T(11, 'połowa');
const tPatrz = T(12);
const tSlep = T(13, 'ślepota');
const tLat = T(14, 'latarka');
const tZnika = T(15, 'znika');
const tOcz = T(15, 'choć');
const tKto = T(16);
const tDecy = T(16, 'decyduje');
const tNazw = T(17, 'zdechły');
const tBoris = T(18, 'Boris');
const tPrzeg = T(19);
const tRzuc = T(19, 'rzuć');
const tKota = T(19, 'kota');
const tKrzyk = T(20, 'krzykną');
const tNikt = T(21, 'nikt');
const tDruga = T(22);
const tDzien = T(23, 'dzień');
const t911 = T(24);
const tDorad = T(24, 'doradczyni');
const tDobry = T(24, 'bardzo');
const tPogrz = T(24, 'pogrzebać');
const tGdyNie = T(25);
const tStworz = T(25, 'stworzyć');
const tAfera = T(26, 'afera');
const tOstra = T(26, 'ostra');
const tKontr = T(26, 'kontrowersyjny');
const tAwant = T(26, 'awantura');
const tMedia = T(27);
const tWiecz = T(28, 'późnym');
const tUstawa = T(28, 'ustawa');
const tKotaW = T(29);
const tUstNikt = T(30);
const tJak = T(31);
const tWcz = T(33);
const tCo = T(34);

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
const SeatGuy: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Rough shape={{t: 'lpath', pts: [[-70, -40], [-70, 250], [-70, 130], [60, 130], [60, 250]]}} o={{strokeWidth: 7, stroke: '#8A8072'}} seed={610} />
		<Rough shape={{t: 'circle', cx: 0, cy: -60, d: 86}} o={{fill: C.paper, fillStyle: 'solid'}} seed={611} />
		<Rough shape={{t: 'lpath', pts: [[0, -16], [-6, 110], [90, 112], [96, 240]]}} seed={612} />
		<Rough shape={{t: 'lpath', pts: [[-2, 30], [70, 70]]}} seed={613} />
		<circle cx={10} cy={-66} r={5} fill={C.ink} />
		<circle cx={32} cy={-66} r={5} fill={C.ink} />
	</g>
);

// Symbol sztuczki w kratce 150×150.
const Glyph: React.FC<{i: number}> = ({i}) => {
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

// Dokument „USTAWA” z pieczęcią; col = kolor kreski (papierowy w ciemności).
const Bill: React.FC<{x: number; y: number; draw: number; stamp: number; col: string; seed: number}> = ({x, y, draw, stamp, col, seed}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(4)`}>
			<Rough shape={{t: 'rect', x: -150, y: -200, w: 300, h: 400}} o={{stroke: col, strokeWidth: 7}} draw={draw} seed={seed} />
			<Txt text="USTAWA" x={0} y={-120} size={70} color={col} draw={draw} seed={seed + 1} />
			{[-70, -30, 10, 50].map((ly, i) => (
				<Rough key={i} shape={{t: 'line', x1: -110, y1: ly, x2: i === 3 ? 30 : 110, y2: ly}} o={{stroke: col, strokeWidth: 5}} draw={clamp01(draw * 2 - 0.3 - i * 0.15)} seed={seed + 2 + i} />
			))}
			{stamp > 0 && (
				<g transform={`translate(30 120) rotate(-14) scale(${stamp})`}>
					<Rough shape={{t: 'rect', x: -120, y: -40, w: 240, h: 80}} o={{stroke: C.red, strokeWidth: 8}} seed={seed + 8} />
					<Txt text="PRZYJĘTO" x={0} y={20} size={58} color={C.red} seed={seed + 9} />
				</g>
			)}
		</g>
	);
};

// --- świat --------------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();
	const [X1, X2, X3] = [RX[1], RX[2], RX[3]];

	// ===== SALA 0: wstęp =====
	const hat = f < tPolityk ? 1 : 1 + (Math.floor((f - tPolityk) / 22) % 3);
	const card = live(f, tSzt - 2, t99 + 2, 8);

	// ===== SALA 1: eksperyment z gorylem =====
	const players: [number, number][] = [
		[470, 330],
		[800, 280],
		[1120, 280],
		[1450, 330],
		[620, 500],
		[1300, 500],
	];
	const plDraw = prog(f, tSzesc, 22);
	const passI = Math.max(0, Math.floor((f - tSzesc - 14) / 12));
	const passU = ease(clamp01(((f - tSzesc - 14) % 12) / 9));
	const order = [0, 2, 4, 1, 5, 3];
	const pa = players[order[passI % 6]];
	const pb = players[order[(passI + 1) % 6]];
	const ballX = lerp(pa[0], pb[0], passU) + 60;
	const ballY = lerp(pa[1], pb[1], passU) + 90 - Math.sin(passU * Math.PI) * 50;
	const count = f < tPod ? 0 : Math.floor((f - tPod) / 12) + 1;
	const gorX = f < tWych ? lerp(2150, 960, prog(f, tGor - 14, tBil - tGor + 6)) : lerp(960, 330, prog(f, tWych, 50));
	const gorOn = f >= tGor - 14;

	// ===== ciemność i plama światła (sale 1–3) =====
	const dk = prog(f, tZnika - 4, 16) * (1 - prog(f, tJak, 16));
	const FOLD = {x: X2 + 760, y: 560};
	const CAT = {x: X2 + 1180, y: 540};
	const TV = {x: X2 + 1640, y: 300};
	const CROWD = {x: X3 + 640, y: 560};
	let sx = X1 + ballX;
	let sy = ballY;
	let sr = 190;
	if (f >= tKto) {
		const u = prog(f, tKto, tDecy - tKto + 14);
		sx = lerp(X1 + ballX, FOLD.x, u);
		sy = lerp(ballY, FOLD.y, u);
		sr = lerp(190, 300, u);
	}
	if (f >= tKota - 3) {
		const u = prog(f, tKota - 3, 9);
		sx = lerp(FOLD.x, CAT.x, u);
		sy = lerp(FOLD.y, CAT.y, u);
		sr = 310;
	}
	if (f >= tDzien - 4) {
		const u = prog(f, tDzien - 4, 16);
		sx = lerp(CAT.x, TV.x, u);
		sy = lerp(CAT.y, TV.y, u);
		sr = lerp(310, 270, u);
	}
	if (f >= tGdyNie) {
		const u = prog(f, tGdyNie, tStworz - tGdyNie + 26);
		sx = lerp(TV.x, CROWD.x, u);
		sy = lerp(TV.y, CROWD.y, u);
		sr = lerp(270, 640, u);
	}
	const overCol = dk > 0.5 ? C.paper : C.ink;

	// ===== SALA 2: stół obrad =====
	const tableDraw = prog(f, tDecy - 6, 20);
	const catFall = f < tRzuc ? 0 : prog(f, tRzuc + 4, Math.max(6, tKota - tRzuc - 4));
	const heads = [560, 820, 1100, 1360];
	const alarm = f >= tKrzyk - 2 && f < tDruga;
	const tvDraw = prog(f, tDzien - 8, 14);

	// ===== SALA 3: afera i ustawa =====
	const crowd: [number, number][] = [
		[300, 560],
		[470, 600],
		[640, 560],
		[810, 600],
		[980, 560],
	];
	const crowdDraw = prog(f, tStworz + 4, 20);
	const bubbles: [number, string, number, number][] = [
		[tOstra, 'wypowiedź', 330, 250],
		[tKontr, 'pomysł', 660, 190],
		[tAwant, 'symbol', 970, 260],
	];
	const billDraw = prog(f, tUstawa - 6, 16);
	const stamp = pk(f, tUstawa + 16);
	const fadeQ = 1 - prog(f, tJak - 4, 10);

	return (
		<g>
			{/* ---------- SALA 0 ---------- */}
			<g>
				<SeatGuy x={380} y={470} s={1.4} />
				<g>
					<Guy x={1300} y={232} s={1.6} seed={840} arms={f >= tPolityk && f < tGlowa ? 'up' : 'down'} look={-1} />
					{hat === 1 && (
						<g>
							<Rough shape={{t: 'rect', x: 1252, y: 56, w: 96, h: 120}} o={{fill: C.ink, fillStyle: 'solid'}} seed={846} />
							<Rough shape={{t: 'line', x1: 1216, y1: 178, x2: 1384, y2: 178}} o={{strokeWidth: 10}} seed={847} />
						</g>
					)}
					{hat === 2 && <Rough shape={{t: 'arc', cx: 1300, cy: 216, w: 170, h: 130, a0: Math.PI, a1: Math.PI * 2}} o={{stroke: '#6B8F4E', strokeWidth: 12}} seed={845} />}
					{hat === 3 && <Rough shape={{t: 'poly', pts: [[1300, 300], [1278, 336], [1300, 410], [1322, 336]]}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 4}} seed={848} />}
					<Rough shape={{t: 'poly', pts: [[1180, 440], [1420, 440], [1390, 770], [1210, 770]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} seed={850} />
					<Rough shape={{t: 'rect', x: 1160, y: 410, w: 280, h: 34}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 7}} seed={851} />
					<Rough shape={{t: 'lpath', pts: [[1380, 410], [1380, 350], [1350, 320]]}} o={{strokeWidth: 6}} seed={852} />
					<circle cx={1344} cy={314} r={14} fill={C.ink} />
				</g>
				{/* „kłamstwo” skreślone */}
				<g opacity={live(f, tKlam - 10, tPiec - 4)}>
					<Txt text="kłamstwo" x={1650} y={300} size={110} draw={prog(f, tKlam - 10, 10)} seed={855} rotate={-4} />
					<Rough shape={{t: 'line', x1: 1480, y1: 290, x2: 1830, y2: 256}} o={{stroke: C.red, strokeWidth: 14}} draw={prog(f, tKlam + 2, 8)} seed={856} />
				</g>
				{/* trybiki w głowie */}
				<g opacity={live(f, tGlowa - 16, tPiec - 4)}>
					<Rough shape={{t: 'ellipse', cx: 660, cy: 250, w: 320, h: 220}} o={{stroke: C.blue, strokeWidth: 6}} draw={prog(f, tGlowa - 16, 14)} seed={860} />
					<circle cx={530} cy={360} r={14} fill="none" stroke={C.blue} strokeWidth={5} />
					<circle cx={490} cy={392} r={8} fill="none" stroke={C.blue} strokeWidth={5} />
					{[
						[620, 250, 100, 1],
						[716, 268, 70, -1.5],
					].map(([gx, gy, gd, dir], i) => (
						<g key={i} transform={`rotate(${Math.floor(f / 3) * 9 * dir} ${gx} ${gy})`}>
							<Rough shape={{t: 'circle', cx: gx, cy: gy, d: gd}} o={{strokeWidth: 7}} seed={862 + i} />
							{[0, 45, 90, 135].map((a) => (
								<line key={a} x1={gx - (gd / 2 + 12) * Math.cos((a * Math.PI) / 180)} y1={gy - (gd / 2 + 12) * Math.sin((a * Math.PI) / 180)} x2={gx + (gd / 2 + 12) * Math.cos((a * Math.PI) / 180)} y2={gy + (gd / 2 + 12) * Math.sin((a * Math.PI) / 180)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
							))}
						</g>
					))}
				</g>
				{/* pięć sztuczek */}
				{[0, 1, 2, 3, 4].map((i) => {
					const t0 = tPiec + i * 5;
					if (f < t0) return null;
					return (
						<g key={i} transform={`translate(${560 + i * 170 + 75} ${925}) scale(${pk(f, t0)}) translate(-75 -75)`}>
							<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 3, strokeWidth: 7}} seed={800 + i} />
							<Glyph i={i} />
						</g>
					);
				})}
				{f >= tCiebie && f < tPsy && <Rough shape={{t: 'ellipse', cx: 390, cy: 520, w: 380, h: 640}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, tCiebie, 10)} seed={870} />}
				{f >= tTych && f < tPsy && <Rough shape={{t: 'ellipse', cx: 1300, cy: 420, w: 440, h: 780}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, tTych, 10)} seed={871} />}
				{/* psycholog i wiadomości */}
				{f >= tPsy - 8 && <LabCoat x={860} y={330} s={1.25} draw={prog(f, tPsy - 8, 16)} highlight={prog(f, tPsy + 6, 10)} />}
				<g opacity={prog(f, tWiad - 14, 8)} transform={`translate(1680 600) scale(${0.7 + 0.3 * pk(f, tWiad - 14)}) translate(-1680 -600)`}>
					<Rough shape={{t: 'rect', x: 1560, y: 450, w: 250, h: 310}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={880} />
					<Txt text="WIADOMOŚCI" x={1685} y={510} size={42} color={C.red} seed={881} />
					{[550, 590, 630, 670, 710].map((ly, i) => (
						<Rough key={i} shape={{t: 'line', x1: 1590, y1: ly, x2: i === 4 ? 1700 : 1780, y2: ly}} o={{strokeWidth: 5}} seed={882 + i} />
					))}
				</g>
				{/* plansza tytułowa */}
				{card > 0 && (
					<g opacity={card}>
						<rect x={-200} y={-200} width={2400} height={1500} fill={C.paper} opacity={0.94} />
						<Txt text="sztuczka pierwsza" x={960} y={400} size={110} draw={prog(f, tSzt, 14)} seed={890} />
						<g transform={`translate(960 600) scale(${pk(f, tTytul)}) translate(-960 -600)`}>
							<Txt text="zdechły kot" x={960} y={660} size={260} color={C.red} seed={891} />
						</g>
					</g>
				)}
			</g>

			{/* ---------- SALA 1 ---------- */}
			<g transform={`translate(${X1} 0)`}>
				<Rough shape={{t: 'line', x1: 120, y1: 850, x2: 1800, y2: 850}} o={{strokeWidth: 8}} draw={prog(f, t99, 20)} seed={900} />
				<g opacity={live(f, t99 + 4, tSlep - 6)}>
					<Txt text="Simons i Chabris, 1999" x={960} y={130} size={100} draw={prog(f, t99 + 30, 24)} seed={918} />
				</g>
				{/* kadr nagrania */}
				<Rough shape={{t: 'rect', x: 280, y: 180, w: 1360, h: 640}} o={{strokeWidth: 6, stroke: '#8A8072', strokeLineDash: [26, 18]}} draw={prog(f, tNagr - 6, 22) * (1 - prog(f, tSlep - 6, 8))} seed={919} />
				{f >= tSzesc && (
					<g>
						{players.map(([px, py], i) => (
							<Person key={i} x={px} y={py} s={0.9} draw={clamp01(plDraw * 1.5 - i * 0.08)} seed={920 + i * 5} color={i % 2 ? C.ink : '#8A8072'} arms={f >= tSzesc + 14 && (order[passI % 6] === i || order[(passI + 1) % 6] === i) ? 'reach' : 'down'} />
						))}
						{gorOn && <Gorilla x={gorX} y={550} s={1.05} beat={f >= tBil && f < tWych ? 1 : 0} />}
						{f >= tSzesc + 14 && (
							<g transform={`translate(${ballX} ${ballY})`}>
								<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 78}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 7}} seed={911} />
							</g>
						)}
						{/* licznik podań */}
						{count > 0 && f < tSlep - 6 && (
							<g opacity={1 - prog(f, tSlep - 14, 8)}>
								<Txt text={`podania: ${count}`} x={1460} y={250} size={70} color={C.red} seed={915} anchor="middle" />
							</g>
						)}
						{/* połowa badanych */}
						{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
							const miss = i < 5 && f >= tPolowa + i * 3;
							return (
								<g key={i} opacity={prog(f, tPolowa - 14 + i * 2, 8)}>
									<Mini x={555 + i * 90} y={950} s={1.5} seed={950 + i} color={miss ? C.red : C.ink} filled={miss} />
									{miss && <Txt text="?" x={555 + i * 90} y={916} size={70} color={C.red} seed={960 + i} />}
								</g>
							);
						})}
						{f >= tPatrz && f < tSlep && [0, 1, 2, 3, 4].map((i) => <Rough key={i} shape={{t: 'line', x1: 555 + i * 90, y1: 900, x2: gorX, y2: 600}} o={{stroke: C.red, strokeWidth: 4, strokeLineDash: [12, 12]}} draw={prog(f, tPatrz + i * 2, 10)} seed={970 + i} />)}
					</g>
				)}
				{/* latarka */}
				{f >= tLat - 4 && (
					<g opacity={prog(f, tLat - 4, 8) * (1 - prog(f, tKto + 10, 10))}>
						<polygon points={`250,990 ${ballX - 120},${ballY - 120} ${ballX + 130},${ballY + 120}`} fill={C.yellow} opacity={0.28} />
						<Rough shape={{t: 'poly', pts: [[150, 1040], [240, 960], [280, 1005], [190, 1080]]}} o={{fill: C.ink, fillStyle: 'solid'}} seed={975} />
					</g>
				)}
			</g>

			{/* ---------- SALA 2 ---------- */}
			<g transform={`translate(${X2} 0)`}>
				{heads.map((hx, i) => {
					const look = f >= tDzien - 2 ? 1 : f >= tKota ? (hx < 1180 ? 1 : -1) : hx < 760 ? 1 : -1;
					return <Guy key={i} x={hx} y={alarm ? 372 : 380} s={1.05} seed={1000 + i * 5} draw={tableDraw} arms={alarm ? 'up' : 'down'} look={look} />;
				})}
				<Rough shape={{t: 'poly', pts: [[380, 640], [1540, 640], [1620, 720], [300, 720]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} draw={tableDraw} seed={1030} />
				<Rough shape={{t: 'line', x1: 420, y1: 724, x2: 400, y2: 980}} o={{strokeWidth: 8}} draw={tableDraw} seed={1031} />
				<Rough shape={{t: 'line', x1: 1500, y1: 724, x2: 1520, y2: 980}} o={{strokeWidth: 8}} draw={tableDraw} seed={1032} />
				<g transform="rotate(-5 760 600)" opacity={tableDraw}>
					<Rough shape={{t: 'rect', x: 650, y: 540, w: 230, h: 130}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, fillWeight: 4, strokeWidth: 7}} draw={tableDraw} seed={1035} />
					<Txt text="niewygodna" x={765} y={600} size={44} seed={1036} draw={prog(f, tDecy + 6, 10)} />
					<Txt text="sprawa" x={765} y={644} size={44} seed={1037} draw={prog(f, tDecy + 12, 8)} />
				</g>
				{f >= tRzuc && <DeadCat x={CAT.x - X2} y={f < tKota ? lerp(-420, 560, catFall * catFall) : 560 - Math.max(0, 22 * Math.exp(-(f - tKota) / 4) * Math.cos((f - tKota) * 0.9))} s={1.15} rot={f < tKota ? (1 - catFall) * -200 : 0} />}
				{/* telewizor */}
				<g opacity={tvDraw}>
					<Rough shape={{t: 'rect', x: 1470, y: 170, w: 340, h: 250}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} draw={tvDraw} seed={1045} />
					<Rough shape={{t: 'lpath', pts: [[1590, 170], [1640, 110], [1700, 170]]}} o={{strokeWidth: 6}} draw={tvDraw} seed={1046} />
					<Txt text="NA ŻYWO" x={1640} y={235} size={44} color={C.red} seed={1047} opacity={f >= tDzien && Math.floor(f / 10) % 2 === 0 ? 1 : 0.35} />
					<g opacity={pk(f, t911)}>
						<Txt text="11.09.2001" x={1640} y={340} size={78} seed={1048} />
					</g>
				</g>
			</g>

			{/* ---------- SALA 3 ---------- */}
			<g transform={`translate(${X3} 0)`}>
				{crowd.map(([cx, cy], i) => (
					<Guy key={i} x={cx} y={cy} s={1.0} seed={1200 + i * 5} draw={clamp01(crowdDraw * 1.5 - i * 0.1)} arms={f >= tAfera && f < tJak && i % 2 === Math.floor(f / 9) % 2 ? 'up' : 'down'} look={f >= tJak + 6 ? 1 : 0} />
				))}
				<g opacity={fadeQ}>
					{bubbles.map(([t0, label, bx, by], i) =>
						f >= t0 - 2 ? (
							<g key={i} transform={`translate(${bx} ${by}) scale(${pk(f, t0 - 2)}) translate(${-bx} ${-by})`}>
								<Rough shape={{t: 'ellipse', cx: bx, cy: by, w: 330, h: 150}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={1230 + i} />
								<Rough shape={{t: 'lpath', pts: [[bx - 30, by + 70], [bx - 10, by + 130], [bx + 30, by + 72]]}} o={{strokeWidth: 6}} seed={1235 + i} />
								<Txt text={label} x={bx} y={by + 24} size={72} seed={1240 + i} />
							</g>
						) : null,
					)}
					{f >= tAfera && (
						<g transform={`translate(650 430) rotate(-5) scale(${pk(f, tAfera)}) translate(-650 -430)`}>
							<Txt text="AFERA!" x={650} y={470} size={210} color={C.red} seed={1250} />
						</g>
					)}
					{/* tydzień */}
					{f >= tMedia && f < tKotaW + 8 && ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'].map((d, i) => {
						const on = f >= tMedia + 8 + i * 6;
						return (
							<g key={i} opacity={prog(f, tMedia + i * 2, 6) * (1 - prog(f, tKotaW - 4, 8))}>
								<Rough shape={{t: 'rect', x: 250 + i * 116, y: 880, w: 100, h: 90}} o={{fill: on ? C.red : undefined, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={1260 + i} />
								<Txt text={d} x={300 + i * 116} y={942} size={52} seed={1270 + i} />
							</g>
						);
					})}
				</g>
				{/* ustawa (po zapaleniu światła widoczna tuszem) */}
				<Bill x={1560} y={540} draw={billDraw} stamp={stamp} col={C.ink} seed={1300} />
				{/* pytania */}
				{f >= tJak && (
					<g>
						<g opacity={prog(f, tJak + 6, 10)}>
							<rect x={200} y={60} width={1000} height={330} fill={C.paper} opacity={0.9} />
						</g>
						<Txt text="o czym mówiliśmy wczoraj?" x={700} y={190} size={104} draw={prog(f, tWcz - 4, 26)} seed={1320} />
						<Txt text="co przeszło bez rozgłosu?" x={700} y={320} size={104} color={C.red} draw={prog(f, tCo, 30)} seed={1321} />
						<Rough shape={{t: 'lpath', pts: [[1180, 300], [1300, 330], [1370, 420]]}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, tCo + 30, 12)} seed={1322} />
						<Rough shape={{t: 'ellipse', cx: 1560, cy: 540, w: 480, h: 560}} o={{stroke: C.red, strokeWidth: 11}} draw={prog(f, tCo + 38, 14)} seed={1323} />
					</g>
				)}
			</g>

			{/* ---------- ciemność z plamą światła ---------- */}
			{dk > 0.001 && (
				<g>
					<defs>
						<radialGradient id="s1spotg">
							<stop offset="0.72" stopColor="black" />
							<stop offset="1" stopColor="white" />
						</radialGradient>
						<mask id="s1spotm" maskUnits="userSpaceOnUse" x={X1 - 500} y={-400} width={7800} height={1900}>
							<rect x={X1 - 500} y={-400} width={7800} height={1900} fill="white" />
							<circle cx={sx} cy={sy} r={sr} fill="url(#s1spotg)" />
						</mask>
					</defs>
					<rect x={X1 - 500} y={-400} width={7800} height={1900} fill="#14110F" opacity={dk * 0.93} mask="url(#s1spotm)" />
				</g>
			)}
			{/* oczy goryla w ciemności */}
			{f >= tOcz && f < tKto + 30 && Math.floor(f / 20) % 4 !== 3 && (
				<g opacity={dk}>
					<circle cx={X1 + gorX - 19} cy={550 - 172} r={8} fill={C.paper} />
					<circle cx={X1 + gorX + 19} cy={550 - 172} r={8} fill={C.paper} />
				</g>
			)}
			{/* napisy nad ciemnością */}
			<g opacity={live(f, tSlep - 2, tKto + 4)}>
				<Txt text="ślepota z nieuwagi" x={X1 + 960} y={130} size={120} color={overCol} draw={prog(f, tSlep - 2, 16)} seed={1100} />
			</g>
			<g opacity={live(f, tNazw - 2, tDruga)} transform={`translate(${X2 + 860} 150) scale(${0.9 + 0.1 * pk(f, tNazw)}) translate(${-(X2 + 860)} -150)`}>
				<Txt text="„zdechły kot”" x={X2 + 860} y={205} size={130} color={C.yellow} draw={prog(f, tNazw - 2, 12)} seed={1101} />
			</g>
			<g opacity={live(f, tBoris - 2, tPrzeg + 6)}>
				<Txt text="Boris Johnson, „The Telegraph”, 2013" x={X2 + 860} y={290} size={62} color={overCol} draw={prog(f, tBoris - 2, 18)} seed={1102} />
			</g>
			{alarm && heads.map((hx, i) => (
				<g key={i} transform={`translate(${X2 + hx} 300) scale(${pk(f, tKrzyk - 2 + i * 2)}) translate(${-(X2 + hx)} -300)`}>
					<Txt text="!" x={X2 + hx + 70} y={350} size={120} color={C.yellow} seed={1110 + i} />
				</g>
			))}
			<g opacity={live(f, tNikt, tDruga)}>
				<Txt text="sprawa? jaka sprawa?" x={X2 + 660} y={900} size={72} color={C.paper} draw={prog(f, tNikt, 16)} seed={1120} rotate={-2} />
			</g>
			{/* e-mail z 11.09.2001 (w ciemności, pod stołem) */}
			<g opacity={live(f, tDorad - 4, tGdyNie + 6) * dk}>
				<g transform={`translate(${lerp(-500, 0, prog(f, tDorad - 4, 18))} 0)`}>
					<Rough shape={{t: 'rect', x: X2 + 330, y: 790, w: 1010, h: 250}} o={{stroke: C.paper, strokeWidth: 6}} seed={1130} />
					<Txt text="do: biuro prasowe" x={X2 + 370} y={850} size={50} color={C.yellow} anchor="start" seed={1131} />
					<Txt text="„To teraz bardzo dobry dzień, żeby ogłosić" x={X2 + 370} y={930} size={58} color={C.paper} anchor="start" draw={prog(f, tDobry - 4, 30)} seed={1132} />
					<Txt text="wszystko, co chcemy pogrzebać.”" x={X2 + 370} y={1000} size={58} color={C.paper} anchor="start" draw={prog(f, tPogrz - 40, 30)} seed={1133} />
				</g>
			</g>
			{/* ustawa w ciemności: ledwo widoczny zarys */}
			<g opacity={dk * 0.5}>
				<g transform={`translate(${X3} 0)`}>
					<Bill x={1560} y={540} draw={billDraw} stamp={stamp} col={C.paper} seed={1300} />
					{f >= tWiecz && <Rough shape={{t: 'arc', cx: 1700, cy: 160, w: 120, h: 120, a0: 0.6, a1: 4.4}} o={{stroke: C.paper, strokeWidth: 8}} draw={prog(f, tWiecz, 10)} seed={1340} />}
				</g>
			</g>
			<g opacity={live(f, tUstNikt, tJak)}>
				<Txt text="nikt nie patrzy" x={X3 + 1560} y={900} size={84} color={C.paper} draw={prog(f, tUstNikt, 12)} seed={1341} />
			</g>
			<g opacity={live(f, tKotaW, tJak)}>
				<Txt text="wszyscy patrzą tutaj" x={X3 + 640} y={950} size={84} draw={prog(f, tKotaW, 12)} seed={1342} />
			</g>
			{f >= tDruga && f < tGdyNie + 30 && (
				<g opacity={live(f, tDruga, tGdyNie + 10)}>
					<Txt text="…i w drugą stronę" x={X2 + 800} y={205} size={110} color={C.yellow} draw={prog(f, tDruga, 14)} seed={1343} />
				</g>
			)}
		</g>
	);
};

// --- kamera -------------------------------------------------------------------------
const HITS: [number, number][] = [
	[tKlam + 2, 0.7],
	[tPiec, 0.5],
	[tTytul, 1.2],
	[tGor, 0.8],
	[tPolowa, 0.6],
	[tNazw, 1],
	[tKota, 1.6],
	[tKrzyk, 0.7],
	[t911, 0.8],
	[tAfera, 1.2],
	[tUstawa + 16, 1],
	[tCo, 0.7],
];
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const cx = kf(f, [
		[0, 960],
		[tGlowa - 18, 960],
		[tGlowa, 700],
		[tPiec - 10, 700],
		[tPiec + 8, 960],
		[t99 - 2, 960],
		[t99 + 26, RX[1] + 960],
		[tKto, RX[1] + 960],
		[tDecy + 14, RX[2] + 860],
		[tRzuc, RX[2] + 860],
		[tKota - 2, RX[2] + 1000],
		[tDruga, RX[2] + 1000],
		[tDruga + 16, RX[2] + 960],
		[tGdyNie, RX[2] + 960],
		[tStworz + 26, RX[3] + 760],
		[tWiecz - 10, RX[3] + 760],
		[tWiecz + 12, RX[3] + 1160],
		[tKotaW - 4, RX[3] + 1160],
		[tKotaW + 14, RX[3] + 960],
	]);
	const cy = kf(f, [
		[0, 540],
		[tGlowa - 18, 540],
		[tGlowa, 400],
		[tPiec - 10, 400],
		[tPiec + 8, 560],
		[t99 + 26, 560],
		[tPolowa - 18, 560],
		[tPolowa - 4, 610],
		[tSlep - 8, 610],
		[tSlep + 8, 540],
		[tDorad - 10, 540],
		[tDorad + 8, 620],
		[tGdyNie, 620],
		[tStworz + 26, 540],
	]);
	const z = kf(f, [
		[0, 1],
		[tGlowa - 18, 1],
		[tGlowa, 1.4],
		[tPiec - 10, 1.4],
		[tPiec + 8, 1],
		[tGor - 6, 1],
		[tGor + 12, 1.1],
		[tPolowa - 18, 1.1],
		[tPolowa - 4, 1],
		[tRzuc, 1],
		[tKota - 2, 1.12],
		[tDruga, 1.12],
		[tDruga + 16, 1],
		[tWiecz - 10, 1],
		[tWiecz + 12, 1.12],
		[tKotaW - 4, 1.12],
		[tKotaW + 14, 1],
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
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”…?!').then(() => continueRender(handle));
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
