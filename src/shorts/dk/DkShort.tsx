// Short #3 Psychorożek: efekt Dunninga-Krugera (1080×1920).
// Styl TED-Ed: jedno płótno z pięcioma „salami”, kamera przejeżdża między nimi, cytryna przelatuje
// z sali do sali i zmienia się w żarówkę. Każdy ruch startuje na słowie lektora (vo.gen.ts), czasy globalne.
// Pętla: koniec wraca do banku w stanie z klatki 0.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, spring, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt, Scribble, clamp01} from '../../kit/sketch';
import {Mini, QMark, LabCoat} from '../../kit/figures';
import {Captions} from '../../kit/captions';
import {Camera, Doodles, type Hit} from '../../kit/dynamics';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
const RW = 1080;

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
const TAIL_F = Math.round((LINES[11].e + 0.35) * FPS);
export const TOTAL_FRAMES = TAIL_F + 28;

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

// --- rekwizyty ------------------------------------------------------------------
// Ludzik z kreską „na trójkach”; face = kolor twarzy (żółty = sok z cytryny).
const Man: React.FC<{x: number; y: number; s?: number; face?: string; arms?: 'down' | 'up' | 'hold' | 'shrug'; draw?: number; seed?: number; dashed?: boolean}> = ({
	x,
	y,
	s = 1,
	face = C.paper,
	arms = 'down',
	draw = 1,
	seed = 500,
	dashed = false,
}) => {
	if (draw <= 0) return null;
	const a: [number, number][] =
		arms === 'up'
			? [
					[-70, -10],
					[0, 70],
					[70, -10],
				]
			: arms === 'hold'
				? [
						[-50, 130],
						[0, 70],
						[80, 95],
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
	const o = dashed ? {strokeLineDash: [14, 12]} : {};
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 76}} o={{fill: face, fillStyle: face === C.paper ? 'solid' : 'hachure', hachureGap: 7, fillWeight: 5, strokeWidth: 6, ...o}} draw={draw} seed={seed} />
			<Rough shape={{t: 'line', x1: 0, y1: 38, x2: 0, y2: 170}} o={o} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'lpath', pts: a}} o={o} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'lpath', pts: [[-48, 270], [0, 170], [48, 270]]}} o={o} draw={draw} seed={seed + 3} />
			{/* oczy */}
			{!dashed && (
				<g opacity={draw}>
					<circle cx={-12} cy={-4} r={4} fill={C.ink} />
					<circle cx={12} cy={-4} r={4} fill={C.ink} />
				</g>
			)}
		</g>
	);
};

const Lemon: React.FC<{x: number; y: number; s?: number; seed?: number}> = ({x, y, s = 1, seed = 700}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 120, h: 86}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={seed} />
		<Rough shape={{t: 'circle', cx: 62, cy: 0, d: 16}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={seed + 1} />
		<Rough shape={{t: 'line', x1: -30, y1: -14, x2: -6, y2: -24}} o={{strokeWidth: 4, stroke: '#C99A12'}} seed={seed + 2} />
	</g>
);

const Bulb: React.FC<{x: number; y: number; s?: number; on: number; seed?: number}> = ({x, y, s = 1, on, seed = 720}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{on > 0 &&
			Array.from({length: 8}).map((_, j) => {
				const a = (j / 8) * Math.PI * 2;
				return <Rough key={j} shape={{t: 'line', x1: Math.cos(a) * 80, y1: Math.sin(a) * 80 - 10, x2: Math.cos(a) * 115, y2: Math.sin(a) * 115 - 10}} o={{stroke: C.yellow, strokeWidth: 8}} opacity={on} seed={seed + 10 + j} />;
			})}
		<Rough shape={{t: 'circle', cx: 0, cy: -10, d: 120}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={seed} />
		<Rough shape={{t: 'rect', x: -26, y: 48, w: 52, h: 40}} o={{fill: C.ink, fillStyle: 'hachure', hachureGap: 6}} seed={seed + 1} />
	</g>
);

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

// skala 0–100 (sala D)
const SX = (v: number) => 120 + v * 8.2;
const SY = 860;

// --- świat ------------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();
	const step = Math.floor(f / 3);

	const t95 = T(0, '1995');
	const tNap = T(0, 'napadł');
	const tDwa = T(0, 'dwa');
	const tSok = T(0, 'sokiem');
	const tCyt = T(0, 'cytryny');
	const tPew = T(1, 'pewien');
	const tKam = T(1, 'kamery');
	const tZob = T(1, 'zobaczą');
	const t2 = T(2);
	const tPozn = T(2, 'później');
	const tTwarz = T(2, 'twarz');
	const tTv = T(2, 'telewizji');
	const t3 = T(3);
	const tNiec = T(3, 'niecałą');
	const tGodz = T(3, 'godzinę');
	const t4 = T(4);
	const tPrzec = T(4, 'przecież');
	const tCyt2 = T(4, 'cytryny');
	const t5 = T(5);
	const tPsy = T(5, 'psycholodzy');
	const tDun = T(5, 'Dunning');
	const tKru = T(5, 'Kruger');
	const t99 = T(6, '1999');
	const tLog = T(6, 'logiki');
	const tGram = T(6, 'gramatyki');
	const tHum = T(6, 'humoru');
	const t7 = T(7);
	const t12 = T(7, '12');
	const t8 = T(8);
	const t62 = T(8, '62');
	const t9 = T(9);
	const tBlad = T(9, 'błąd');
	const tWied = T(9, 'wiedzy');
	const tBrak = T(9, 'brakuje');
	const t10 = T(10);
	const tBad = T(10, 'badaczy');
	const tEfekt = T(10, 'efekt');
	const tZlu = T(10, 'złudzenie');
	const tStat = T(10, 'statystyczne');
	const tSpr = T(11, 'sprawdź');
	const tTw2 = T(11, 'twarzy');
	const tCyt3 = T(11, 'cytryny');

	// cytryna-podróżniczka: z sali B do laboratorium, gdzie staje się żarówką
	const lemonP = prog(f, t5 - 6, 24);
	const lemonX = lerp(RW + 300, RW * 2 + 540, lemonP);
	const lemonY = lerp(560, 330, lemonP) - Math.sin(Math.PI * lemonP) * 260;
	const toBulb = prog(f, tPsy - 4, 10);

	// kropki „regresji do średniej” na skali
	const dots = [4, 9, 15, 22, 31, 38, 47, 58, 66, 73, 81, 88, 95];

	return (
		<g>
			{/* ================= SALA A: BANK (haczyk i pętla) ================= */}
			<g>
				{/* bank */}
				<Rough shape={{t: 'poly', pts: [[520, 380], [730, 250], [940, 380]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} seed={100} />
				<Rough shape={{t: 'rect', x: 530, y: 380, w: 400, h: 50}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={101} />
				<Txt text="BANK" x={730} y={420} size={56} seed={102} />
				{[575, 675, 785, 885].map((x, i) => (
					<Rough key={i} shape={{t: 'rect', x: x - 22, y: 430, w: 44, h: 420}} o={{strokeWidth: 6}} seed={103 + i} />
				))}
				<Rough shape={{t: 'rect', x: 510, y: 850, w: 440, h: 40}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={108} />
				<Rough shape={{t: 'rect', x: 490, y: 890, w: 480, h: 40}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={109} />
				<Txt text="×2" x={955} y={300} size={80} color={C.red} draw={prog(f, tDwa, 8) * (1 - prog(f, t2 + 16, 1))} seed={110} />
				{/* kamera monitoringu */}
				<g transform="translate(470 300) rotate(28)">
					<Rough shape={{t: 'line', x1: 60, y1: -60, x2: 60, y2: 0}} o={{strokeWidth: 7}} seed={120} />
					<Rough shape={{t: 'rect', x: -60, y: 0, w: 140, h: 60}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={121} />
					<Rough shape={{t: 'rect', x: -90, y: 10, w: 34, h: 40}} o={{fill: C.ink, fillStyle: 'solid'}} seed={122} />
					{step % 4 < 2 && <circle cx={50} cy={20} r={9} fill={C.red} />}
				</g>
				{/* pole widzenia kamery */}
				<g opacity={0.55 * live(f, tKam - 2, t2 + 8)}>
					<Rough shape={{t: 'poly', pts: [[392, 360], [140, 1010], [460, 1010]]}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 14, fillWeight: 3, stroke: 'none'}} seed={125} />
				</g>
				<Txt text="REC" x={330} y={250} size={50} color={C.red} opacity={step % 4 < 2 ? 1 : 0.3} seed={126} />
				<Txt text="1995" x={150} y={150} size={96} color={C.red} rotate={-4} draw={prog(f, t95 - 2, 10) * (1 - prog(f, t2 + 16, 1))} seed={130} />

				{/* złodziej z twarzą w soku z cytryny */}
				<Man x={300} y={740} face={C.yellow} arms="hold" seed={140} />
				<g transform={`translate(420 860) scale(${f < tNap ? 1 : 1 + 0.15 * Math.sin(Math.PI * clamp01((f - tNap) / 8))})`}>
					<Rough shape={{t: 'ellipse', cx: 0, cy: 30, w: 110, h: 100}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={150} />
					<Rough shape={{t: 'line', x1: -20, y1: -24, x2: 20, y2: -24}} o={{strokeWidth: 8}} seed={151} />
					<Txt text="$" x={0} y={50} size={64} seed={152} />
				</g>
				<WBurst x={420} y={880} at={tNap} r={90} color={C.ink} seed={160} />
				{/* cytryna i krople przy „sokiem z cytryny” */}
				<g opacity={live(f, tSok - 2, tPew + 10)}>
					<g transform={`translate(160 600) scale(${pk(f, tSok - 2)}) rotate(-20)`}>
						<Lemon x={0} y={0} seed={170} />
					</g>
					{[0, 1, 2].map((i) => {
						const k = (f - tCyt + i * 5) % 18;
						return f >= tCyt ? <circle key={i} cx={215 + i * 22} cy={640 + k * 4} r={8} fill={C.yellow} stroke={C.ink} strokeWidth={3} /> : null;
					})}
				</g>
				<WBurst x={300} y={740} at={tCyt} r={80} color={C.yellow} seed={175} />
				{/* myśl: „jestem niewidzialny” */}
				<g opacity={live(f, tPew - 2, t2 + 8)}>
					{[
						[350, 650, 22],
						[390, 600, 32],
					].map(([x, y, d], i) => (
						<Rough key={i} shape={{t: 'circle', cx: x, cy: y, d}} o={{strokeWidth: 5}} seed={180 + i} />
					))}
					<Rough shape={{t: 'ellipse', cx: 300, cy: 420, w: 360, h: 280}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={prog(f, tPew - 2, 10)} seed={183} />
					<Man x={230} y={345} s={0.42} dashed draw={prog(f, tPew + 4, 10)} seed={185} />
					<g opacity={prog(f, tZob - 2, 6)}>
						<Rough shape={{t: 'ellipse', cx: 360, cy: 420, w: 110, h: 64}} o={{strokeWidth: 6}} seed={190} />
						<Rough shape={{t: 'circle', cx: 360, cy: 420, d: 30}} o={{fill: C.ink, fillStyle: 'solid'}} seed={191} />
						<Rough shape={{t: 'line', x1: 300, y1: 370, x2: 420, y2: 470}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, tZob, 6)} seed={192} />
					</g>
				</g>
				{/* koniec: lustro „sprawdź swoją twarz” */}
				<g opacity={live(f, tSpr - 4, TAIL_F, 10)}>
					<Rough shape={{t: 'ellipse', cx: 150, cy: 470, w: 220, h: 300}} o={{fill: '#DDE8EE', fillStyle: 'solid', strokeWidth: 8}} draw={prog(f, tSpr - 4, 10)} seed={200} />
					<Rough shape={{t: 'line', x1: 150, y1: 620, x2: 150, y2: 700}} o={{strokeWidth: 8}} seed={201} />
					<g opacity={prog(f, tTw2, 6)}>
						<Rough shape={{t: 'circle', cx: 150, cy: 450, d: 110}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 7, strokeWidth: 6}} seed={202} />
						<circle cx={132} cy={444} r={5} fill={C.ink} />
						<circle cx={168} cy={444} r={5} fill={C.ink} />
					</g>
					<QMark x={150} y={260} s={0.8} draw={prog(f, tCyt3, 8)} seed={205} />
				</g>
				<WBurst x={150} y={450} at={tCyt3} r={130} color={C.yellow} seed={210} />
				<WBurst x={150} y={450} at={tSpr} r={140} color={C.ink} seed={215} />
			</g>

			{/* ================= SALA B: TELEWIZJA I POLICJA ================= */}
			<g transform={`translate(${RW} 0)`}>
				<Txt text="3 miesiące później" x={540} y={180} size={84} rotate={-3} draw={prog(f, tPozn - 4, 12)} seed={300} />
				{/* telewizor */}
				<g transform={`translate(560 560) scale(${f < t2 ? 0 : pk(f, t2 + 2)})`}>
					<Rough shape={{t: 'line', x1: -40, y1: -230, x2: -110, y2: -310}} o={{strokeWidth: 6}} seed={310} />
					<Rough shape={{t: 'line', x1: 40, y1: -230, x2: 110, y2: -310}} o={{strokeWidth: 6}} seed={311} />
					<Rough shape={{t: 'rect', x: -260, y: -230, w: 520, h: 380}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} seed={312} />
					<Rough shape={{t: 'rect', x: -225, y: -200, w: 400, h: 320}} o={{fill: '#DDE8EE', fillStyle: 'solid', strokeWidth: 6}} seed={313} />
					<Rough shape={{t: 'circle', cx: 220, cy: -120, d: 40}} o={{strokeWidth: 5}} seed={314} />
					<Rough shape={{t: 'circle', cx: 220, cy: -50, d: 40}} o={{strokeWidth: 5}} seed={315} />
					<g opacity={prog(f, tTwarz - 2, 6)}>
						<Man x={-25} y={-120} s={0.62} face={C.yellow} seed={320} />
						<Txt text="POSZUKIWANY" x={-25} y={100} size={44} color={C.red} seed={325} />
					</g>
				</g>
				<WBurst x={560} y={480} at={tTv} r={260} color={C.blue} seed={330} />
				{/* koguty policyjne */}
				{f >= t3 && f < t5 &&
					[
						[140, 280, C.blue],
						[960, 280, C.red],
					].map(([x, y, col], i) => {
						const on = (step + i) % 2 === 0;
						return <circle key={i} cx={x as number} cy={y as number} r={on ? 70 : 46} fill={col as string} opacity={on ? 0.5 : 0.2} />;
					})}
				{/* zegar: niecała godzina */}
				<g transform={`translate(860 960) scale(${pk(f, tNiec - 4)})`}>
					<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 200}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={340} />
					{(() => {
						const m = interpolate(f, [tNiec, tGodz + 6], [0, 55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
						const a = (m / 60) * Math.PI * 2 - Math.PI / 2;
						const pts: [number, number][] = [[0, 0]];
						for (let k = 0; k <= 12; k++) {
							const b = -Math.PI / 2 + ((a + Math.PI / 2) * k) / 12;
							pts.push([Math.cos(b) * 86, Math.sin(b) * 86]);
						}
						return (
							<g>
								{m > 1 && <path d={`M 0 0 ${pts.slice(1).map((p) => `L ${p[0]} ${p[1]}`).join(' ')} Z`} fill={C.red} opacity={0.35} />}
								<Rough shape={{t: 'line', x1: 0, y1: 0, x2: Math.cos(a) * 80, y2: Math.sin(a) * 80}} o={{stroke: C.red, strokeWidth: 8}} seed={341} />
							</g>
						);
					})()}
					<Txt text="< 1 h" x={0} y={160} size={64} color={C.red} draw={prog(f, tGodz, 8)} seed={342} />
				</g>
				{/* zatrzymany: kajdanki i zdziwienie */}
				<g opacity={live(f, t3 + 4, t5 + 10)}>
					<Man x={250} y={860} face={C.yellow} arms="shrug" seed={350} />
					<g transform={`translate(250 1000) scale(${pk(f, tGodz + 2)})`}>
						<Rough shape={{t: 'circle', cx: -40, cy: 0, d: 50}} o={{strokeWidth: 7}} seed={355} />
						<Rough shape={{t: 'circle', cx: 40, cy: 0, d: 50}} o={{strokeWidth: 7}} seed={356} />
						<Rough shape={{t: 'line', x1: -15, y1: 0, x2: 15, y2: 0}} o={{strokeWidth: 6}} seed={357} />
					</g>
					<QMark x={160} y={640} s={0.9} draw={prog(f, t4, 10)} seed={360} />
					<g opacity={prog(f, tPrzec - 2, 6)}>
						<Rough shape={{t: 'ellipse', cx: 480, cy: 700, w: 260, h: 170}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={365} />
						<Rough shape={{t: 'lpath', pts: [[370, 760], [320, 800], [400, 770]]}} o={{strokeWidth: 6}} seed={366} />
						<g transform={`translate(480 700) scale(${0.85 + 0.15 * pk(f, tCyt2)})`}>
							<Lemon x={0} y={0} s={1} seed={367} />
						</g>
						<Txt text="?!" x={600} y={640} size={80} color={C.red} draw={prog(f, tCyt2 + 2, 6)} seed={368} />
					</g>
				</g>
				<WBurst x={480} y={700} at={tCyt2} r={140} color={C.yellow} seed={370} />
			</g>

			{/* cytryna w locie między salami → żarówka w laboratorium */}
			{f >= t5 - 6 && f < t7 && (
				<g opacity={1 - prog(f, t7 - 10, 8)}>
					{toBulb < 0.5 ? (
						<g transform={`translate(${lemonX} ${lemonY}) rotate(${lemonP * 360}) scale(${1 - toBulb})`}>
							<Lemon x={0} y={0} seed={380} />
						</g>
					) : (
						<g transform={`translate(${RW * 2 + 540} 330) scale(${toBulb})`}>
							<Bulb x={0} y={0} on={prog(f, tPsy + 4, 8)} seed={385} />
						</g>
					)}
				</g>
			)}

			{/* ================= SALA C: LABORATORIUM I TESTY ================= */}
			<g transform={`translate(${RW * 2} 0)`} opacity={1 - prog(f, t7 + 20, 1)}>
				<LabCoat x={300} y={620} s={0.95} draw={prog(f, tPsy, 14)} highlight={prog(f, tDun, 8)} seed={400} />
				<LabCoat x={780} y={620} s={0.95} draw={prog(f, tPsy + 6, 14)} highlight={prog(f, tKru, 8)} seed={410} />
				<Txt text="Dunning" x={300} y={480} size={64} color={C.red} draw={prog(f, tDun, 10)} seed={420} />
				<Txt text="Kruger" x={780} y={480} size={64} color={C.red} draw={prog(f, tKru, 10)} seed={421} />
				<Txt text="1999" x={540} y={160} size={96} color={C.red} rotate={-3} draw={prog(f, t99 - 2, 10)} seed={422} />
				{[
					{t: tLog, x: 220, label: 'logika', sym: 'A → B'},
					{t: tGram, x: 540, label: 'gramatyka', sym: 'ą ę ó'},
					{t: tHum, x: 860, label: 'humor', sym: 'ha ha'},
				].map((p, i) => (
					<g key={i} transform={`translate(${p.x} 1010) scale(${pk(f, p.t - 3)}) rotate(${(i - 1) * 4})`}>
						<Rough shape={{t: 'rect', x: -120, y: -120, w: 240, h: 230}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={430 + i * 5} />
						<Txt text={p.sym} x={0} y={-30} size={60} color={C.blue} seed={431 + i * 5} />
						<Txt text={p.label} x={0} y={60} size={50} seed={432 + i * 5} />
					</g>
				))}
			</g>

			{/* ================= SALA D: SKALA 0–100 ================= */}
			<g transform={`translate(${RW * 3} 0)`}>
				<Rough shape={{t: 'line', x1: SX(0) - 20, y1: SY, x2: SX(100) + 20, y2: SY}} o={{strokeWidth: 8}} draw={prog(f, t7 - 6, 14)} seed={500} />
				{[0, 20, 40, 60, 80, 100].map((v, i) => (
					<g key={v}>
						<Rough shape={{t: 'line', x1: SX(v), y1: SY - 14, x2: SX(v), y2: SY + 14}} o={{strokeWidth: 5}} draw={prog(f, t7 - 4 + i * 2, 5)} seed={510 + i} />
						<Txt text={String(v)} x={SX(v)} y={SY + 62} size={44} opacity={0.75} draw={prog(f, t7 - 2 + i * 2, 5)} seed={520 + i} />
					</g>
				))}
				<Txt text="lepsi od … na 100 osób" x={540} y={SY + 140} size={50} opacity={0.75} draw={prog(f, t7 + 4, 12)} seed={530} />
				{/* rzeczywistość: 12 */}
				<g opacity={f >= t12 - 2 ? 1 : 0}>
					<Rough shape={{t: 'line', x1: SX(12), y1: SY, x2: SX(12), y2: SY - 120}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, t12 - 2, 6)} seed={540} />
					<Mini x={SX(12)} y={SY - 230} s={2.2} draw={prog(f, t12, 10)} seed={541} />
					<Txt text="12" x={SX(12)} y={SY - 320} size={110} color={C.red} draw={prog(f, t12, 8)} seed={542} />
					<Txt text="wynik" x={SX(12)} y={SY - 420} size={50} draw={prog(f, t12 + 4, 8)} seed={543} />
				</g>
				{/* samoocena: 62 */}
				<g opacity={f >= t8 ? 1 : 0}>
					<PPath pts={[[SX(12) + 40, SY - 470], [SX(37), SY - 600], [SX(62) - 40, SY - 470]]} o={{stroke: C.blue, strokeWidth: 8}} draw={prog(f, t8, t62 - t8)} seed={550} />
					<Rough shape={{t: 'line', x1: SX(62), y1: SY, x2: SX(62), y2: SY - 120}} o={{stroke: C.blue, strokeWidth: 8, strokeLineDash: [14, 12]}} draw={prog(f, t62 - 2, 6)} seed={555} />
					<g opacity={0.9}>
						<Mini x={SX(62)} y={SY - 230} s={2.2} draw={prog(f, t62, 10)} seed={556} />
					</g>
					<Txt text="62" x={SX(62)} y={SY - 320} size={110} color={C.blue} draw={prog(f, t62, 8)} seed={557} />
					<Txt text="ich ocena" x={SX(62)} y={SY - 420} size={50} draw={prog(f, t62 + 4, 8)} seed={558} />
				</g>
				<WBurst x={SX(12)} y={SY - 300} at={t12} r={100} seed={560} />
				<WBurst x={SX(62)} y={SY - 300} at={t62} r={110} color={C.blue} seed={570} />
				{/* zwrot: złudzenie statystyczne */}
				<g opacity={f >= t10 ? 1 : 0}>
					<Scribble x={SX(20)} y={SY - 640} w={SX(56) - SX(20)} h={110} draw={prog(f, tZlu, 10)} color={C.red} seed={580} />
					<Txt text="złudzenie?" x={540} y={190} size={96} color={C.red} rotate={-3} draw={prog(f, tZlu + 2, 12)} seed={581} />
					<g transform={`translate(860 300) scale(${pk(f, tBad - 2)})`}>
						<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 120}} o={{fill: '#DDE8EE', fillStyle: 'solid', strokeWidth: 8}} seed={585} />
						<Rough shape={{t: 'line', x1: 44, y1: 44, x2: 100, y2: 100}} o={{strokeWidth: 14}} seed={586} />
					</g>
					{dots.map((v, i) => {
						const tgt = 50 + (v - 50) * 0.25;
						const x = SX(lerp(v, tgt, prog(f, tStat - 2, 18)));
						const y = SY - 60 - ((i * 37) % 70);
						return <circle key={i} cx={x} cy={y} r={13} fill={i % 2 ? C.blue : C.red} opacity={prog(f, tEfekt + i, 4)} />;
					})}
				</g>
			</g>

			{/* ================= SALA E: GŁOWA BEZ ELEMENTU ================= */}
			<g transform={`translate(${RW * 4} 0)`}>
				<Rough shape={{t: 'path', d: 'M 380 1150 Q 300 1000 320 860 Q 250 840 270 780 Q 300 760 300 720 Q 260 480 520 400 Q 780 380 820 620 Q 840 820 720 900 L 730 1150 Z'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} draw={prog(f, t9 - 6, 16)} seed={600} />
				{/* dziura w kształcie puzzla */}
				<g opacity={prog(f, tBlad - 2, 8)}>
					<Rough shape={{t: 'path', d: 'M 470 560 L 560 560 Q 560 520 600 520 Q 640 520 640 560 L 690 560 L 690 640 Q 730 640 730 680 Q 730 720 690 720 L 690 800 L 470 800 Z'}} o={{fill: f >= tBrak ? C.red : C.ink, fillStyle: 'hachure', hachureGap: 9, strokeWidth: 7, strokeLineDash: [16, 10]}} seed={610} />
				</g>
				{/* puzzel „wiedza” nie dolatuje */}
				<g transform={`translate(${kf(f, [[tWied, 1000], [tWied + 14, 820], [tBrak + 6, 820], [tBrak + 20, 1000]])} ${kf(f, [[tWied, 300], [tWied + 14, 420]])}) rotate(${Math.sin(f / 6) * 6})`} opacity={live(f, tWied - 2, t10 - 6)}>
					<Rough shape={{t: 'path', d: 'M -110 -120 L -20 -120 Q -20 -160 20 -160 Q 60 -160 60 -120 L 110 -120 L 110 -40 Q 150 -40 150 0 Q 150 40 110 40 L 110 120 L -110 120 Z'}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 7}} seed={620} />
					<Txt text="wiedza" x={0} y={20} size={54} seed={621} />
				</g>
				<Txt text="brakuje!" x={300} y={320} size={90} color={C.red} rotate={-5} draw={prog(f, tBrak, 10)} seed={630} />
				<WBurst x={580} y={680} at={tBrak} r={170} seed={640} />
			</g>
		</g>
	);
};

// Kamera świata.
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t2 = T(2);
	const t5 = T(5);
	const t7 = T(7);
	const t9 = T(9);
	const t10 = T(10);
	const t11 = T(11);
	const mv = (a: number, from: number, to: number, len = 18): [number, number][] => [
		[a - 8, from],
		[a - 8 + len, to],
	];
	const cx = kf(f, [[0, 540], ...mv(t2, 540, 540 + RW), ...mv(t5, 540 + RW, 540 + RW * 2, 24), ...mv(t7, 540 + RW * 2, 540 + RW * 3), ...mv(t9, 540 + RW * 3, 540 + RW * 4), ...mv(t10, 540 + RW * 4, 540 + RW * 3), ...mv(t11, 540 + RW * 3, 540, 22)]);
	const dip = (a: number, d = 0.12, len = 18): [number, number][] => [
		[a - 8, 1],
		[a - 8 + len / 2, 1 - d],
		[a - 8 + len, 1],
	];
	const z = kf(f, [[0, 1], ...dip(t2), ...dip(t5, 0.16, 24), ...dip(t7), ...dip(t9), ...dip(t10), ...dip(t11, 0.35, 22)]);
	// kadr powiększony o 12% i obniżony, żeby akcja wypełniała scenę nad napisami
	const zz = z * 1.12;
	return <g transform={`translate(${540 - cx * zz} ${770 - 670 * zz}) scale(${zz})`}>{children}</g>;
};

const HITS: Hit[] = [
	{t: cue(0, 'napadł'), kind: 'punch', amp: 0.7},
	{t: cue(0, 'cytryny'), kind: 'both', amp: 0.9},
	{t: cue(1, 'zobaczą'), kind: 'punch', amp: 0.5},
	{t: cue(2, 'telewizji'), kind: 'both', amp: 0.9},
	{t: cue(3, 'godzinę'), kind: 'punch', amp: 0.8},
	{t: cue(4, 'cytryny'), kind: 'both', amp: 1.0},
	{t: cue(5, 'Kruger'), kind: 'punch', amp: 0.5},
	{t: cue(6, 'logiki'), kind: 'punch', amp: 0.4},
	{t: cue(6, 'gramatyki'), kind: 'punch', amp: 0.4},
	{t: cue(6, 'humoru'), kind: 'punch', amp: 0.4},
	{t: cue(7, '12'), kind: 'both', amp: 0.9},
	{t: cue(8, '62'), kind: 'both', amp: 1.1},
	{t: cue(9, 'brakuje'), kind: 'shake', amp: 0.8},
	{t: cue(10, 'złudzenie'), kind: 'both', amp: 0.9},
	{t: cue(11, 'cytryny'), kind: 'both', amp: 1.0},
];

export const DkShort: React.FC = () => {
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ→…').then(() => continueRender(handle));
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
						<clipPath id="dkstage">
							<rect x={-200} y={-200} width={W + 400} height={1560} />
						</clipPath>
					</defs>
					<g clipPath="url(#dkstage)">
						<CamWorld>
							<World />
						</CamWorld>
					</g>
				</svg>
			</Camera>
			<Captions lines={LINES} top={1405} left={70} width={840} size={92} />
			<Audio src={staticFile('dk_vo.wav')} />
		</AbsoluteFill>
	);
};
