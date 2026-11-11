// „5 sztuczek polityków”, część 4: powtarzanie (1920×1080).
// Sale: listy zdań (1977) → wiedza nie chroni (2015) → „znam to” = „to prawda” → hasło w kampanii → pytanie kontrolne.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LINES} from './vo4.gen';
import {C, Rough, Txt, clamp01, FPS, RW, GREY, makeT, prog, pk, lerp, live, Stage, Guy, Lectern, TitleCard, Big, Lab, type Cam} from './common';

const T = makeT(LINES);
export const SALA4_FRAMES = Math.round((LINES[21].e + 1.0) * FPS);
const X = [0, RW, RW * 2, RW * 3, RW * 4];

// Hasło: tabliczka z trzema kreskami zamiast słów.
const Banner: React.FC<{x: number; y: number; s?: number; seed: number; color?: string; draw?: number}> = ({x, y, s = 1, seed, color = C.yellow, draw = 1}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<Rough shape={{t: 'rect', x: -200, y: -60, w: 400, h: 120}} o={{fill: color, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed} />
			{[-130, -10, 110].map((bx, i) => (
				<Rough key={i} shape={{t: 'line', x1: bx, y1: 0, x2: bx + 70 + i * 8, y2: 0}} o={{strokeWidth: 16}} draw={draw} seed={seed + 1 + i} />
			))}
		</g>
	);
};

// Kartka z listą zdań; hl = podświetlenie powtarzanego zdania (0–1).
const Sheet: React.FC<{x: number; y: number; draw: number; hl: number; marks: number; seed: number}> = ({x, y, draw, hl, marks, seed}) => {
	if (draw <= 0) return null;
	const truth = [true, false, true, false, false, true];
	return (
		<g transform={`translate(${x} ${y})`}>
			<Rough shape={{t: 'rect', x: -190, y: -250, w: 380, h: 500}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={seed} />
			{hl > 0 && <Rough shape={{t: 'rect', x: -170, y: -72, w: 340 * hl, h: 56}} o={{fill: C.yellow, fillStyle: 'solid', stroke: 'none'}} seed={seed + 1} />}
			{truth.map((t, i) => (
				<g key={i}>
					<Rough shape={{t: 'line', x1: -150, y1: -190 + i * 74, x2: 70, y2: -190 + i * 74}} o={{strokeWidth: 6}} draw={clamp01(draw * 2 - i * 0.15)} seed={seed + 2 + i} />
					{marks > i / 6 && <Txt text={t ? '✓' : '✗'} x={130} y={-170 + i * 74} size={60} color={t ? C.blue : C.red} seed={seed + 10 + i} />}
				</g>
			))}
		</g>
	);
};

const World: React.FC = () => {
	const f = useCurrentFrame();
	const sx = [460, 960, 1460];
	const scores = ['4,2', '4,6', '4,7'];

	// sala 1
	const reps = [0, 1, 2, 3].map((i) => T(8, 'powtórkach') - 30 + i * 10);
	const fooled = f >= T(8, 'fałsz');
	// sala 2
	const toTrue = prog(f, T(9, 'prawda') - 4, 16);
	// sala 3
	const grey = prog(f, T(16, 'opinia') - 4, 20);
	const bcol = grey > 0.5 ? C.paper : C.yellow;

	return (
		<g>
			{/* ================= SALA 0: 1977 ================= */}
			<g>
				<Lab text="Hasher, Goldstein i Toppino, 1977" x={960} y={120} a={T(1) + 22} size={90} seed={4001} dur={24} />
				{sx.map((x, k) => (
					<g key={k}>
						<Sheet x={x} y={560} draw={prog(f, k === 0 ? T(1, 'listy') - 6 : T(2) + (k - 1) * 10, 14)} hl={prog(f, T(3, 'wracała') - 4 + k * 8, 10)} marks={k === 0 ? prog(f, T(1, 'prawdziwych') - 2, 24) : 1} seed={4010 + k * 30} />
						<Lab text={`tydzień ${1 + k * 2}`} x={x} y={880} a={T(2, 'dwa') + k * 5} size={64} color={GREY} seed={4100 + k} />
						<Big text={scores[k]} x={x} y={240} a={T(4, 'coraz') - 10 + k * 9} size={120} seed={4110 + k} />
					</g>
				))}
				{f >= T(4, 'coraz') + 8 && <Rough shape={{t: 'lpath', pts: [[300, 330], [960, 300], [1620, 270], [1580, 250]]}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, T(4, 'coraz') + 8, 16)} seed={4120} />}
				<Lab text="ocena wiarygodności powtarzanych zdań (skala 1–7)" x={960} y={980} a={T(4, 'wiarygodne') - 10} size={60} color={GREY} seed={4121} dur={24} />
				{f >= T(5, 'fałszywe') && (
					<g transform={`translate(1460 516) scale(${pk(f, T(5, 'fałszywe'))}) translate(-1460 -516) rotate(-8 1460 516)`}>
						<Rough shape={{t: 'rect', x: 1340, y: 476, w: 240, h: 80}} o={{stroke: C.red, strokeWidth: 9, fill: C.paper, fillStyle: 'solid'}} seed={4125} />
						<Txt text="FAŁSZ" x={1460} y={540} size={70} color={C.red} seed={4126} />
					</g>
				)}
			</g>

			{/* ================= SALA 1: 2015 ================= */}
			<g transform={`translate(${X[1]} 0)`}>
				<Lab text="Fazio i in., 2015" x={960} y={120} a={T(6) + 20} size={96} seed={4201} dur={20} />
				<Rough shape={{t: 'circle', cx: 620, cy: 560, d: 620}} o={{strokeWidth: 9, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(6, 'wiedza') - 14, 16)} seed={4210} />
				<Rough shape={{t: 'lpath', pts: [[520, 860], [500, 1000], [760, 1000], [740, 850]]}} o={{strokeWidth: 9}} draw={prog(f, T(6, 'wiedza') - 10, 12)} seed={4211} />
				<g opacity={fooled ? 0.25 : 1}>
					<Lab text="wiedza" x={620} y={560} a={T(6, 'wiedza') - 2} b={T(8) - 2} size={130} color={C.blue} seed={4219} />
					<Lab text="szkocka spódnica" x={620} y={500} a={T(8, 'znała')} size={70} seed={4220} />
					<Lab text="to kilt ✓" x={620} y={590} a={T(8, 'poprawną')} size={96} color={C.blue} seed={4221} />
				</g>
				<Big text="nie chroni" x={1380} y={860} a={T(7)} size={170} seed={4225} until={T(9) - 8} />
				{reps.map((t0, i) => (
					<g key={i} opacity={prog(f, t0, 5)} transform={`translate(${lerp(260, 0, prog(f, t0, 12))} 0)`}>
						<Rough shape={{t: 'rect', x: 1080, y: 240 + i * 120, w: 620, h: 96}} o={{strokeWidth: 6, fill: C.paper, fillStyle: 'solid'}} seed={4230 + i} />
						<Txt text="„szkocka spódnica to sari”" x={1390} y={306 + i * 120} size={54} seed={4240 + i} />
					</g>
				))}
				{fooled && (
					<g transform={`translate(620 620) scale(${pk(f, T(8, 'fałsz'))}) translate(-620 -620)`}>
						<Txt text="…to sari?" x={620} y={720} size={120} color={C.red} seed={4250} />
					</g>
				)}
			</g>

			{/* ================= SALA 2: znam to = to prawda ================= */}
			<g transform={`translate(${X[2]} 0)`}>
				{[
					{x: 520, label: '„znam to”', w: 'znam'},
					{x: 1400, label: '„to prawda”', w: 'prawda'},
				].map((b, k) => (
					<g key={k}>
						<Rough shape={{t: 'rect', x: b.x - 300, y: 380, w: 600, h: 420}} o={{strokeWidth: 9, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(9, b.w) - 8, 12)} seed={4300 + k} />
						<Lab text={b.label} x={b.x} y={330} a={T(9, b.w) - 4} size={100} color={k ? C.red : C.ink} seed={4302 + k} />
					</g>
				))}
				<g transform={`translate(${lerp(520, 1400, toTrue)} ${590 - Math.sin(toTrue * Math.PI) * 240})`} opacity={prog(f, T(9, 'znam') - 2, 8)}>
					<Banner x={0} y={0} seed={4310} />
				</g>
				{f >= T(9, 'myli') && <Rough shape={{t: 'arc', cx: 960, cy: 250, w: 880, h: 260, a0: Math.PI * 1.1, a1: Math.PI * 1.9}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, T(9, 'prawda') - 6, 16)} seed={4315} />}
				<Big text="×10" x={960} y={590} a={T(10, 'dziesiąty')} size={170} seed={4320} />
				<Lab text="łatwe do przetworzenia ≠ prawdziwe" x={960} y={960} a={T(10, 'łatwość') - 4} size={90} color={C.red} seed={4321} dur={26} />
			</g>

			{/* ================= SALA 3: kampania ================= */}
			<g transform={`translate(${X[3]} 0)`}>
				<Lectern x={960} y={640} draw={prog(f, T(11) - 4, 16)} seed={4400} arms={f >= T(11, 'hasło') ? 'up' : 'down'} />
				{/* argument: długi zwój, nikt go nie czyta */}
				<g opacity={live(f, T(11, 'argument') - 8, T(13) - 4)}>
					<Rough shape={{t: 'rect', x: 180, y: 240, w: 340, h: 640}} o={{strokeWidth: 6, stroke: GREY, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(11, 'argument') - 8, 12)} seed={4410} />
					{Array.from({length: 11}).map((_, i) => (
						<Rough key={i} shape={{t: 'line', x1: 215, y1: 300 + i * 50, x2: i % 3 === 2 ? 400 : 485, y2: 300 + i * 50}} o={{strokeWidth: 4, stroke: GREY}} draw={prog(f, T(11, 'argument') - 4 + i, 8)} seed={4411 + i} />
					))}
					<Txt text="argument" x={350} y={210} size={70} color={GREY} draw={prog(f, T(11, 'argument') - 4, 8)} seed={4425} />
				</g>
				<g transform={`translate(1500 330) scale(${pk(f, T(11, 'hasło'))}) translate(-1500 -330)`}>
					<Banner x={1500} y={330} s={1.2} seed={4430} color={bcol} />
				</g>
				<Lab text="hasło" x={1500} y={170} a={T(11, 'hasło')} b={T(12, 'tysiąc')} size={80} seed={4435} />
				<Big text="×1000" x={1500} y={130} a={T(12, 'tysiąc')} size={100} seed={4436} until={T(16) - 4} />
				{/* wiec, plakat, wywiad */}
				{[0, 1, 2, 3].map((i) => (
					<g key={i} transform={`translate(${200 + i * 110} ${960 - (i % 2) * 20}) scale(${pk(f, T(12, 'wiecu') + i * 2)})`}>
						<Rough shape={{t: 'line', x1: 0, y1: 0, x2: 0, y2: 90}} o={{strokeWidth: 6}} seed={4440 + i} />
						<Banner x={0} y={-20} s={0.24} seed={4445 + i * 4} color={bcol} />
					</g>
				))}
				{f >= T(13) - 4 &&
					[0, 1, 2, 3, 4, 5].map((i) => (
						<g key={i} transform={`translate(${250 + (i % 2) * 190} ${330 + Math.floor(i / 2) * 150}) scale(${pk(f, T(13) - 4 + i * 2)})`}>
							<Banner x={0} y={0} s={0.4} seed={4460 + i * 4} color={bcol} />
						</g>
					))}
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<g key={i} transform={`translate(${1290 + (i % 3) * 190} ${520 + Math.floor(i / 3) * 130}) scale(${pk(f, T(12, 'plakacie') + i * 2)})`}>
						<Banner x={0} y={0} s={0.4} seed={4490 + i * 4} color={bcol} />
					</g>
				))}
				<g transform={`translate(1400 840) scale(${pk(f, T(12, 'wywiadzie'))})`}>
					<Rough shape={{t: 'line', x1: -120, y1: 60, x2: -40, y2: 0}} o={{strokeWidth: 9}} seed={4520} />
					<circle cx={-30} cy={-8} r={22} fill={C.ink} />
					<Banner x={150} y={0} s={0.5} seed={4522} color={bcol} />
				</g>
				{/* pytania dziennikarza */}
				{f >= T(13, 'pytanie') - 20 &&
					['?', '?!', '?'].map((q, i) => (
						<g key={i} transform={`translate(${640 + i * 60} ${340 + i * 70}) scale(${pk(f, T(13, 'pytanie') - 20 + i * 8)})`} opacity={1 - prog(f, T(16) - 4, 8)}>
							<Txt text={q} x={0} y={0} size={110} color={GREY} seed={4530 + i} />
						</g>
					))}
				<Big text="to metoda" x={900} y={150} a={T(15, 'metoda')} size={150} seed={4540} until={T(16) - 4} />
				<Lab text="po miesiącu" x={960} y={170} a={T(16)} b={T(17) - 2} size={100} color={GREY} seed={4545} />
				<Lab text="„przecież wszyscy to wiedzą”" x={960} y={200} a={T(17)} size={110} color={C.red} seed={4546} dur={22} />
			</g>

			{/* ================= SALA 4: pytanie ================= */}
			<g transform={`translate(${X[4]} 0)`}>
				<Guy x={420} y={470} s={1.5} seed={4600} draw={prog(f, T(18), 14)} look={1} arms={f >= T(21) ? 'shrug' : 'down'} />
				<Big text="skąd to wiem?" x={1160} y={300} a={T(19, 'skąd')} size={190} seed={4610} />
				<Lab text="„wszyscy tak mówią”" x={1060} y={620} a={T(20, 'wszyscy')} size={96} color={GREY} seed={4620} />
				<Lab text="≠ wiem" x={1560} y={620} a={T(20, 'nie')} size={110} color={C.red} seed={4621} />
				<Lab text="tylko to słyszałeś" x={1160} y={840} a={T(21)} size={130} color={C.red} seed={4630} />
				{f >= T(21) + 16 && <Rough shape={{t: 'line', x1: 760, y1: 880, x2: 1560, y2: 866}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(21) + 16, 10)} seed={4631} />}
			</g>

			<TitleCard nr="sztuczka czwarta" name="powtarzanie" i={3} a={T(0, 'powtarzanie')} c={T(1) - 4} />
		</g>
	);
};

const CAM: Cam = {
	cx: [
		[0, 960],
		[T(6) - 10, 960],
		[T(6) + 14, X[1] + 960],
		[T(9) - 10, X[1] + 960],
		[T(9) + 12, X[2] + 960],
		[T(11) - 10, X[2] + 960],
		[T(11) + 14, X[3] + 960],
		[T(18) - 8, X[3] + 960],
		[T(18) + 16, X[4] + 960],
	],
	cy: [
		[0, 540],
		[T(6) + 14, 560],
		[T(9) + 12, 560],
		[T(11) + 14, 560],
		[T(18) + 16, 540],
	],
	z: [
		[0, 1],
		[T(5, 'fałszywe') - 4, 1],
		[T(5, 'fałszywe') + 8, 1.08],
		[T(6) - 10, 1.08],
		[T(6) + 14, 1],
	],
	hits: [
		[T(0, 'powtarzanie'), 1.1],
		[T(5, 'fałszywe'), 1],
		[T(7), 1],
		[T(8, 'fałsz'), 0.9],
		[T(10, 'dziesiąty'), 0.8],
		[T(11, 'hasło'), 1],
		[T(12, 'tysiąc'), 0.8],
		[T(15, 'metoda'), 1.1],
		[T(19, 'skąd'), 0.9],
		[T(21), 0.9],
	],
};

export const Sala4: React.FC = () => (
	<Stage vo="sz4_vo.wav" cam={CAM}>
		<World />
	</Stage>
);
