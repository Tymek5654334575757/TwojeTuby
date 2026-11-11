// „5 sztuczek polityków”, część 3: rama (1920×1080).
// Sale: zadanie o epidemii (ocaleni) → to samo zadanie (ofiary) → bezrobocie i dwie mównice → nazwy w polityce.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Mini} from '../../kit/figures';
import {LINES} from './vo3.gen';
import {C, Rough, Txt, FPS, RW, GREY, makeT, prog, pk, lerp, live, Stage, Guy, Lectern, Doc, TitleCard, Stack, Big, Lab, type Cam} from './common';

const T = makeT(LINES);
export const SALA3_FRAMES = Math.round((LINES[28].e + 1.0) * FPS);
const X = [0, RW, RW * 2, RW * 3];

// Siatka 600 kropek (30×20). blue/red = ile pierwszych/ostatnich kolumn pokolorować (0–1 animacja).
const Grid: React.FC<{x: number; y: number; draw: number; blue: number; red: number}> = ({x, y, draw, blue, red}) => {
	if (draw <= 0) return null;
	const dots: React.ReactNode[] = [];
	for (let c = 0; c < 30; c++) {
		if (c / 30 > draw) break;
		for (let r = 0; r < 20; r++) {
			let col = '#B9AE99';
			if (c < 10 && (c * 20 + r) / 200 < blue) col = C.blue;
			if (c >= 10 && ((c - 10) * 20 + r) / 400 < red) col = C.red;
			dots.push(<circle key={c * 20 + r} cx={x + c * 24} cy={y + r * 24} r={8} fill={col} />);
		}
	}
	return <g>{dots}</g>;
};

const Card: React.FC<{x: number; y: number; title: string; a: number; seed: number; w?: number; h?: number}> = ({x, y, title, a, seed, w = 800, h = 210}) => {
	const f = useCurrentFrame();
	const d = prog(f, a, 12);
	if (d <= 0) return null;
	return (
		<g>
			<Rough shape={{t: 'rect', x: x - w / 2, y: y - h / 2, w, h}} o={{strokeWidth: 7, fill: C.paper, fillStyle: 'solid'}} draw={d} seed={seed} />
			<Txt text={title} x={x - w / 2 + 30} y={y - h / 2 + 62} size={54} color={GREY} anchor="start" draw={d} seed={seed + 1} />
		</g>
	);
};

const World: React.FC = () => {
	const f = useCurrentFrame();
	const GX = 150;
	const GY = 300;
	const CX = 1400;

	// sala 2
	const swap = prog(f, T(20, 'każdym') - 2, 20);
	// sala 3
	const flip = prog(f, T(27, 'dziesięć') - 8, 12);
	const tagsOut = T(23) - 4;
	const tags2Out = T(24) - 6;
	const frameOn = prog(f, T(24, 'nazwę') - 4, 16);

	return (
		<g>
			{/* ================= SALA 0: ocaleni ================= */}
			<g>
				<Lab text="Tversky i Kahneman, 1981" x={960} y={120} a={T(1) + 22} size={96} seed={3001} dur={22} />
				<Grid x={GX} y={GY} draw={prog(f, T(2, 'epidemia') - 4, 22)} blue={prog(f, T(4, 'dwieście') - 2, 14)} red={0} />
				<Lab text="600 osób" x={GX + 350} y={250} a={T(2, 'sześciuset')} size={80} seed={3002} />
				<Card x={CX} y={420} title="program A" a={T(3, 'dwa')} seed={3010} />
				<Card x={CX} y={680} title="program B" a={T(3, 'dwa') + 8} seed={3020} />
				<Lab text="na pewno ocali 200 osób" x={CX} y={460} a={T(4, 'pewno')} size={72} color={C.blue} seed={3012} />
				<Lab text="1/3 szansy: ocaleją wszyscy" x={CX} y={700} a={T(5, 'jedną')} size={60} seed={3022} />
				<Lab text="2/3 szansy: nikt" x={CX} y={760} a={T(5, 'dwie')} size={60} seed={3023} />
				{f >= T(6, 'pewny') && <Rough shape={{t: 'ellipse', cx: CX, cy: 420, w: 900, h: 300}} o={{stroke: C.red, strokeWidth: 11}} draw={prog(f, T(6, 'pewny'), 12)} seed={3030} />}
				<Big text="72%" x={CX - 140} y={940} a={T(6)} size={200} seed={3031} />
				<Lab text="wybiera A" x={CX + 210} y={970} a={T(6, 'wybrało')} size={80} seed={3032} />
			</g>

			{/* ================= SALA 1: ofiary ================= */}
			<g transform={`translate(${X[1]} 0)`}>
				<Lab text="te same programy, inne słowa" x={960} y={120} a={T(7, 'te')} b={T(14) - 4} size={96} seed={3101} dur={22} />
				<Grid x={GX} y={GY} draw={prog(f, T(7) - 4, 22)} blue={prog(f, T(11, 'dwieście') - 2, 12)} red={prog(f, T(8, 'czterysta') - 2, 14)} />
				<Card x={CX} y={420} title="program A" a={T(8) - 4} seed={3110} />
				<Card x={CX} y={680} title="program B" a={T(9) - 4} seed={3120} />
				<Lab text="na pewno umrze 400 osób" x={CX} y={460} a={T(8, 'pewno')} size={72} color={C.red} seed={3112} />
				<Lab text="1/3 szansy: nikt nie umrze" x={CX} y={700} a={T(9, 'jedna')} size={60} seed={3122} />
				<Lab text="2/3 szansy: umrą wszyscy" x={CX} y={760} a={T(9, 'dwie')} size={60} seed={3123} />
				{f >= T(10, 'ryzyko') && f < T(14) && <Rough shape={{t: 'ellipse', cx: CX, cy: 690, w: 900, h: 300}} o={{stroke: C.red, strokeWidth: 11}} draw={prog(f, T(10, 'ryzyko'), 12)} seed={3130} />}
				<Big text="78%" x={CX - 140} y={940} a={T(10, 'siedemdziesiąt')} size={200} seed={3131} until={T(14) - 4} />
				<Lab text="wybiera B" x={CX + 210} y={970} a={T(10, 'wybrało')} b={T(14) - 4} size={80} seed={3132} />
				<Lab text="200 ocalonych = 400 ofiar" x={GX + 350} y={250} a={T(11, 'dwieście')} b={T(14) - 4} size={76} seed={3140} dur={20} />
				<Lab text="zmieniły się tylko słowa" x={GX + 350} y={900} a={T(13)} size={76} color={C.red} seed={3141} />
				{/* rama */}
				{f >= T(14, 'efekt') && <Rough shape={{t: 'rect', x: GX - 50, y: GY - 50, w: 800, h: 560}} o={{stroke: Math.floor(f / 14) % 2 && f >= T(15, 'opakowanie') ? C.blue : C.red, strokeWidth: 22}} draw={prog(f, T(14, 'efekt'), 16)} seed={3150} />}
				<Lab text="efekt ramowania" x={960} y={130} a={T(14, 'efekt')} size={130} color={C.red} seed={3151} />
				{f >= T(15, 'opakowanie') && <Txt text={Math.floor(f / 14) % 2 ? '„ocalimy 200”' : '„umrze 400”'} x={GX + 350} y={GY - 80} size={80} color={Math.floor(f / 14) % 2 ? C.blue : C.red} seed={3152} />}
			</g>

			{/* ================= SALA 2: bezrobocie ================= */}
			<g transform={`translate(${X[2]} 0)`}>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
					const blue = f >= T(17, 'dziewięć') && i < 9;
					const red = i === 9 && f >= T(16, 'dziesięć') && f < T(17, 'dziewięć');
					return (
						<g key={i} opacity={prog(f, T(16) - 6 + i * 2, 8)}>
							<Mini x={420 + i * 120} y={210} s={2.2} seed={3200 + i} color={blue ? C.blue : red ? C.red : C.ink} filled={blue || red} />
						</g>
					);
				})}
				<Lab text="„bezrobocie: 10%”" x={520} y={130} a={T(16)} size={84} color={C.red} seed={3210} />
				<Lab text="„pracę ma 9 na 10”" x={1400} y={130} a={T(17)} size={84} color={C.blue} seed={3211} />
				<Big text="=" x={960} y={110} a={T(18, 'sama')} size={130} color={C.ink} seed={3212} />
				{/* dwie mównice */}
				<g transform={`translate(${lerp(520, 1400, swap)} 0)`}>
					<Lectern x={0} y={700} draw={prog(f, T(19) - 4, 14)} seed={3220} tie={C.ink} arms={f >= T(19, 'opozycja') ? 'up' : 'down'} />
				</g>
				<g transform={`translate(${lerp(1400, 520, swap)} 0)`}>
					<Lectern x={0} y={700} draw={prog(f, T(19) + 2, 14)} seed={3240} tie={C.yellow} arms={f >= T(19, 'rząd') ? 'up' : 'down'} />
				</g>
				<Lab text="opozycja" x={520} y={900} a={T(19, 'opozycja')} size={80} seed={3250} />
				<Lab text="rząd" x={1400} y={900} a={T(19, 'rząd')} size={80} seed={3251} />
				<Lab text="„10% bez pracy!”" x={520} y={380} a={T(19, 'opozycja')} size={76} color={C.red} seed={3252} />
				<Lab text="„90% pracuje!”" x={1400} y={380} a={T(19, 'rząd')} size={76} color={C.blue} seed={3253} />
				<Lab text="po wyborach zamieniają się miejscami" x={960} y={640} a={T(20, 'każdej')} size={56} color={GREY} seed={3254} dur={18} />
			</g>

			{/* ================= SALA 3: nazwy ================= */}
			<g transform={`translate(${X[3]} 0)`}>
				<g opacity={1 - prog(f, T(23) - 4, 8)}>
					<Doc x={960} y={540} title="USTAWA" draw={prog(f, T(21, 'nazwy') - 10, 14)} seed={3300} rot={0} w={420} h={560} lines={7} />
				</g>
				<Big text="„reforma”" x={400} y={500} a={T(22, 'reformą')} size={130} color={C.blue} seed={3310} until={tagsOut} />
				<Big text="„zamach”" x={1520} y={500} a={T(22, 'zamachem')} size={130} color={C.red} seed={3311} until={tagsOut} />
				<g opacity={live(f, T(23) - 2, tags2Out)}>
					<Stack x={960} y={680} n={7} draw={prog(f, T(23, 'wydatek') - 4, 12)} seed={3320} />
				</g>
				<Big text="„inwestycja”" x={400} y={500} a={T(23, 'inwestycja')} size={110} color={C.blue} seed={3330} until={tags2Out} />
				<Big text="„rozdawnictwo”" x={1500} y={500} a={T(23, 'rozdawnictwo')} size={100} color={C.red} seed={3331} until={tags2Out} />
				{/* kto nada nazwę */}
				<g opacity={live(f, T(24) - 2, T(25) - 6)}>
					<Rough shape={{t: 'rect', x: 420, y: 200, w: 1080, h: 720}} o={{stroke: C.red, strokeWidth: 24}} draw={frameOn} seed={3340} />
					<Rough shape={{t: 'rect', x: 760, y: 150, w: 400, h: 100}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 7}} draw={frameOn} seed={3341} />
					<Txt text="moja nazwa" x={960} y={222} size={66} draw={prog(f, T(24, 'nazwę'), 10)} seed={3342} />
					<Guy x={680} y={470} s={1.2} seed={3350} draw={prog(f, T(24) - 2, 12)} look={1} arms={f >= T(24, 'ustawia') ? 'point' : 'down'} />
					<Guy x={1240} y={470} s={1.2} seed={3360} draw={prog(f, T(24, 'przeciwnik') - 4, 12)} look={-1} arms={f >= T(24, 'tłumaczyć') ? 'shrug' : 'down'} />
					<Lab text="„to nie tak, bo…”" x={1240} y={370} a={T(24, 'tłumaczyć')} size={56} color={GREY} seed={3365} />
				</g>
				{/* odwróć zdanie */}
				<Lab text="odwróć zdanie" x={960} y={170} a={T(26)} size={120} seed={3370} />
				{f >= T(27, 'dziewięćdziesiąt') && (
					<g transform={`translate(960 480) scale(1 ${Math.abs(1 - 2 * flip)}) translate(-960 -480)`}>
						<g transform={`translate(960 480) scale(${pk(f, T(27, 'dziewięćdziesiąt'))}) translate(-960 -480)`}>
							<Txt text={flip < 0.5 ? '90% sukcesu' : '10% porażki'} x={960} y={540} size={200} color={flip < 0.5 ? C.blue : C.red} seed={3380} />
						</g>
					</g>
				)}
				<Lab text="zmieniasz zdanie? zdecydowała rama, nie ty" x={960} y={800} a={T(28)} size={84} seed={3390} dur={40} />
				{f >= T(28, 'rama') && <Rough shape={{t: 'rect', x: 330, y: 330, w: 1260, h: 300}} o={{stroke: C.red, strokeWidth: 18}} draw={prog(f, T(28, 'rama'), 16)} seed={3395} />}
			</g>

			<TitleCard nr="sztuczka trzecia" name="rama" i={2} a={T(0, 'rama')} c={T(1) - 4} />
		</g>
	);
};

const CAM: Cam = {
	cx: [
		[0, 960],
		[T(7) - 10, 960],
		[T(7) + 14, X[1] + 960],
		[T(16) - 12, X[1] + 960],
		[T(16) + 12, X[2] + 960],
		[T(21) - 12, X[2] + 960],
		[T(21) + 12, X[3] + 960],
	],
	cy: [
		[0, 540],
		[T(14) - 4, 540],
		[T(14) + 10, 520],
	],
	z: [
		[0, 1],
		[T(6) - 6, 1],
		[T(6) + 8, 1.06],
		[T(7) - 10, 1.06],
		[T(7) + 14, 1],
		[T(27, 'dziewięćdziesiąt') - 6, 1],
		[T(27, 'dziewięćdziesiąt') + 8, 1.08],
	],
	hits: [
		[T(0, 'rama'), 1.1],
		[T(6), 0.9],
		[T(10, 'siedemdziesiąt'), 0.9],
		[T(14, 'efekt'), 1.1],
		[T(18, 'sama'), 0.6],
		[T(20, 'każdym'), 0.6],
		[T(22, 'reformą'), 0.7],
		[T(22, 'zamachem'), 0.7],
		[T(24, 'nazwę'), 0.9],
		[T(27, 'dziesięć'), 1.1],
	],
};

export const Sala3: React.FC = () => (
	<Stage vo="sz3_vo.wav" cam={CAM}>
		<World />
	</Stage>
);
