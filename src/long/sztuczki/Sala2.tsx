// „5 sztuczek polityków”, część 2: dziel i rządź (1920×1080).
// Sale: eksperyment Tajfela → podział pieniędzy → etykieta i polityk → skłócone grupy i władza.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Mini} from '../../kit/figures';
import {LINES} from './vo2.gen';
import {C, Rough, Txt, clamp01, FPS, RW, GREY, makeT, prog, lerp, live, Stage, Guy, Lectern, Doc, TitleCard, Stack, Big, Lab, type Cam} from './common';

const T = makeT(LINES);
export const SALA2_FRAMES = Math.round((LINES[21].e + 1.0) * FPS);
const X = [0, RW, RW * 2, RW * 3];

const World: React.FC = () => {
	const f = useCurrentFrame();

	// ----- sala 0: eksperyment -----
	const split = prog(f, T(2, 'dwie'), 18);
	const sheet = prog(f, T(5, 'pieniądze') - 8, 14);
	const paintOut = 1 - prog(f, T(5) - 2, 10);
	const squares: [number, number, string][] = [
		[0, 0, C.yellow],
		[1, 0, C.blue],
		[2, 0, C.red],
		[0, 1, C.red],
		[1, 1, C.yellow],
		[2, 1, C.blue],
	];

	// ----- sala 1: pieniądze -----
	const s1 = live(f, T(6) - 4, T(8) - 2);
	const opt = prog(f, T(9, 'wybrać') - 6, 14);

	// ----- sala 2: etykieta -----
	const tagged = f >= T(12, 'etykieta');
	const pairs: [string, string, string, string][] = [
		['miasto', 'wieś', 'miasto', 'wieś'],
		['młodzi', 'starzy', 'młodych', 'starych'],
		['z dyplomem', 'bez dyplomu', 'dyplomem', 'bez'],
	];
	const pairsOut = T(15) - 4;

	// ----- sala 3: władza -----
	const groupDraw = prog(f, T(17) - 2, 18);
	const sack = prog(f, T(19, 'władzy') - 4, 24);

	return (
		<g>
			{/* ================= SALA 0 ================= */}
			<g>
				<Lab text="Henri Tajfel, 1971" x={960} y={110} a={T(1) + 24} b={T(6) - 6} size={96} seed={2001} dur={22} />
				<g opacity={paintOut}>
					<Rough shape={{t: 'rect', x: 380, y: 200, w: 400, h: 320}} o={{strokeWidth: 10, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(1, 'Kle') - 6, 12)} seed={2010} />
					{squares.map(([i, j, col], k) => (
						<Rough key={k} shape={{t: 'rect', x: 410 + i * 118, y: 228 + j * 138, w: 100, h: 118}} o={{fill: col, fillStyle: 'hachure', hachureGap: 9, fillWeight: 4, strokeWidth: 5}} draw={prog(f, T(1, 'Kle') + k * 2, 8)} seed={2011 + k} />
					))}
					<Lab text="Klee" x={580} y={590} a={T(1, 'Kle')} size={70} seed={2020} />
					<Rough shape={{t: 'rect', x: 1140, y: 200, w: 400, h: 320}} o={{strokeWidth: 10, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(1, 'Kandinskiego') - 6, 12)} seed={2022} />
					{[
						[1240, 310, 130, C.blue],
						[1400, 280, 90, C.red],
						[1420, 420, 120, C.yellow],
						[1280, 440, 70, C.ink],
					].map(([cx, cy, d, col], k) => (
						<Rough key={k} shape={{t: 'circle', cx: cx as number, cy: cy as number, d: d as number}} o={{stroke: col as string, strokeWidth: 9}} draw={prog(f, T(1, 'Kandinskiego') + k * 3, 8)} seed={2023 + k} />
					))}
					<Lab text="Kandinsky" x={1340} y={590} a={T(1, 'Kandinskiego')} size={70} seed={2030} />
				</g>
				{/* uczniowie */}
				{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
					const left = i < 4;
					const x0 = 400 + i * 160;
					const x1 = left ? 300 + i * 150 : 1170 + (i - 4) * 150;
					const col = split > 0.5 ? (left ? C.blue : C.red) : C.ink;
					return (
						<g key={i} opacity={prog(f, T(1, 'uczniom') - 4 + i * 2, 8)}>
							<Mini x={lerp(x0, x1, split)} y={820} s={2} seed={2040 + i} color={col} filled={split > 0.5} />
							{f >= T(3, 'kto') && f < T(6) && <Txt text="?" x={lerp(x0, x1, split)} y={770} size={70} color={GREY} seed={2050 + i} draw={prog(f, T(3, 'kto') + i, 6)} />}
							{f >= T(3) && i !== 3 && i !== 7 && <Rough shape={{t: 'line', x1: x1 + 75, y1: 720, x2: x1 + 75, y2: 940}} o={{strokeWidth: 7, stroke: GREY}} draw={prog(f, T(3) + i * 2, 8)} seed={2060 + i} />}
						</g>
					);
				})}
				<Lab text="grupa Klee" x={525} y={1020} a={T(2, 'grupy')} b={T(6) - 6} size={72} color={C.blue} seed={2070} />
				<Lab text="grupa Kandinsky" x={1395} y={1020} a={T(2, 'grupy') + 6} b={T(6) - 6} size={72} color={C.red} seed={2071} />
				<Lab text="(w rzeczywistości podział był przypadkowy)" x={960} y={660} a={T(2, 'rzekomo')} b={T(4) - 4} size={56} color={GREY} seed={2072} dur={20} />
				{/* zakaz rozmów */}
				<g opacity={live(f, T(4) - 2, T(5) - 2)}>
					<Rough shape={{t: 'ellipse', cx: 960, cy: 640, w: 260, h: 130}} o={{strokeWidth: 7, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(4) - 2, 8)} seed={2075} />
					<Rough shape={{t: 'line', x1: 850, y1: 700, x2: 1070, y2: 580}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(4) + 6, 8)} seed={2076} />
				</g>
				{/* arkusz podziału */}
				<Doc x={960} y={380} title="do podziału" draw={sheet} seed={2080} rot={-2} w={640} h={420} lines={0} />
				<Lab text="nr 26 · grupa Klee" x={960} y={370} a={T(5, 'numerem')} b={T(6) - 6} size={62} color={C.blue} seed={2090} />
				<Lab text="nr 47 · grupa Kandinsky" x={960} y={460} a={T(5, 'nazwą')} b={T(6) - 6} size={62} color={C.red} seed={2091} />
				<Stack x={560} y={560} n={5} draw={prog(f, T(5, 'pieniądze'), 14)} seed={2095} />
			</g>

			{/* ================= SALA 1 ================= */}
			<g transform={`translate(${X[1]} 0)`}>
				<g opacity={s1}>
					<Stack x={700} y={760} n={9} draw={prog(f, T(6, 'więcej'), 16)} seed={2100} />
					<Stack x={1220} y={760} n={5} draw={prog(f, T(6, 'więcej') + 6, 12)} seed={2110} />
					<Txt text="swoi" x={700} y={870} size={90} color={C.blue} draw={prog(f, T(6, 'swoim'), 8)} seed={2120} />
					<Txt text="obcy" x={1220} y={870} size={90} color={C.red} draw={prog(f, T(6, 'swoim') + 4, 8)} seed={2121} />
					<Txt text="to akurat nie dziwi" x={960} y={990} size={60} color={GREY} draw={prog(f, T(7), 12)} seed={2122} />
				</g>
				<Lab text="drugi wynik" x={960} y={130} a={T(8, 'drugi')} b={T(11) - 8} size={120} seed={2125} />
				{/* dwie opcje */}
				{[
					{x: 520, name: 'opcja A', a: 10, b: 10},
					{x: 1400, name: 'opcja B', a: 8, b: 4},
				].map((o, k) => (
					<g key={k} opacity={opt * (1 - prog(f, T(11) - 8, 8))}>
						<Rough shape={{t: 'rect', x: o.x - 300, y: 220, w: 600, h: 700}} o={{strokeWidth: 7, stroke: GREY}} draw={clamp01(opt * 1.4 - k * 0.3)} seed={2130 + k} />
						<Txt text={o.name} x={o.x} y={290} size={64} color={GREY} draw={opt} seed={2132 + k} />
						<Stack x={o.x - 130} y={760} n={o.a} draw={prog(f, T(9, 'wybrać') + k * 8, 14)} seed={2140 + k * 20} />
						<Stack x={o.x + 130} y={760} n={o.b} draw={prog(f, T(9, 'wybrać') + 4 + k * 8, 14)} seed={2150 + k * 20} />
						<Txt text={`nasi: ${o.a}`} x={o.x - 130} y={860} size={62} color={C.blue} draw={opt} seed={2180 + k} />
						<Txt text={`tamci: ${o.b}`} x={o.x + 130} y={860} size={62} color={C.red} draw={opt} seed={2182 + k} />
					</g>
				))}
				{f >= T(9, 'jeszcze') && f < T(11) - 8 && (
					<g>
						<Rough shape={{t: 'ellipse', cx: 1400, cy: 570, w: 700, h: 800}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(9, 'jeszcze'), 12)} seed={2190} />
						<Rough shape={{t: 'line', x1: 240, y1: 240, x2: 800, y2: 900}} o={{stroke: GREY, strokeWidth: 10}} draw={prog(f, T(9, 'jeszcze') + 8, 10)} seed={2191} />
					</g>
				)}
				<Big text="+4" x={1400} y={400} a={T(10, 'Przewaga')} until={T(11) - 8} size={170} seed={2195} />
				<Big text="+0" x={520} y={400} a={T(10, 'Przewaga') + 8} until={T(11) - 8} size={130} color={GREY} seed={2196} />
				<Lab text="przewaga ważniejsza niż zysk" x={960} y={1010} a={T(10, 'ważniejsza')} b={T(11) - 8} size={84} color={C.red} seed={2197} dur={20} />
			</g>

			{/* ================= SALA 2 ================= */}
			<g transform={`translate(${X[2]} 0)`}>
				<Guy x={420} y={520} s={1.25} seed={2200} draw={prog(f, T(11) - 4, 14)} look={tagged ? -1 : 1} badge={tagged ? C.blue : undefined} />
				<Guy x={1500} y={520} s={1.25} seed={2210} draw={prog(f, T(11), 14)} look={tagged ? 1 : -1} badge={tagged ? C.red : undefined} />
				<Big text="MY" x={420} y={340} a={T(11, 'nas')} size={130} color={C.blue} seed={2220} until={T(13) - 4} />
				<Big text="ONI" x={1500} y={340} a={T(11, 'ich')} size={130} color={C.red} seed={2221} until={T(13) - 4} />
				{[
					['historia', 520, 'historii'],
					['krzywdy', 960, 'krzywd'],
					['interesy', 1400, 'interesów'],
				].map(([txt, x, w], k) => (
					<g key={k} opacity={live(f, T(11, w as string) - 2, T(13) - 4)}>
						<Txt text={txt as string} x={x as number} y={170} size={84} color={GREY} draw={prog(f, T(11, w as string) - 2, 8)} seed={2230 + k} />
						<Rough shape={{t: 'line', x1: (x as number) - 130, y1: 150, x2: (x as number) + 130, y2: 140}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, T(11, w as string) + 6, 6)} seed={2235 + k} />
					</g>
				))}
				<Lab text="wystarczy etykieta" x={960} y={980} a={T(12)} b={T(13) - 4} size={110} color={C.red} seed={2240} />
				{/* polityk */}
				<Lectern x={960} y={560} draw={prog(f, T(13) - 4, 16)} seed={2250} arms={f >= T(14, 'wskaże') && f < T(15) ? 'point' : 'down'} flip={f >= T(14, 'wskaże') && Math.floor((f - T(14, 'wskaże')) / 40) % 2 === 1} />
				<g opacity={live(f, T(13, 'obiecywać') - 8, T(14) - 2)}>
					<Txt text="obietnice" x={960} y={180} size={96} color={GREY} draw={prog(f, T(13, 'obiecywać') - 8, 8)} seed={2260} />
					<Rough shape={{t: 'line', x1: 800, y1: 160, x2: 1120, y2: 146}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(13, 'obiecywać'), 6)} seed={2261} />
				</g>
				{pairs.map(([l, r, wl, wr], k) => (
					<g key={k}>
						<Lab text={l} x={420} y={150 + k * 86} a={T(14, wl)} b={pairsOut} size={84} color={C.blue} seed={2270 + k} dur={8} />
						<Lab text={r} x={1500} y={150 + k * 86} a={T(14, wr)} b={pairsOut} size={84} color={C.red} seed={2275 + k} dur={8} />
					</g>
				))}
				{/* myśli wyborcy */}
				<g opacity={live(f, T(15, 'pyta') - 2, T(17) - 8)}>
					<Rough shape={{t: 'ellipse', cx: 470, cy: 220, w: 720, h: 260}} o={{stroke: C.blue, strokeWidth: 6, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(15, 'pyta') - 2, 10)} seed={2280} />
					<g opacity={1 - prog(f, T(16) - 2, 6)}>
						<Txt text="co ja dostanę?" x={470} y={245} size={84} draw={prog(f, T(15, 'co'), 10)} seed={2281} />
						<Rough shape={{t: 'line', x1: 230, y1: 240, x2: 710, y2: 200}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, T(15, 'dostanie'), 6)} seed={2282} />
					</g>
					<Txt text="czy tamci dostaną mniej?" x={470} y={245} size={70} color={C.red} draw={prog(f, T(16), 16)} seed={2283} opacity={prog(f, T(16) - 2, 6)} />
				</g>
			</g>

			{/* ================= SALA 3 ================= */}
			<g transform={`translate(${X[3]} 0)`}>
				{[0, 1, 2].map((i) => (
					<g key={i}>
						<Guy x={260 + i * 160} y={600 + (i % 2) * 30} s={1} seed={2300 + i * 5} draw={clamp01(groupDraw * 1.5 - i * 0.1)} look={1} badge={C.blue} arms={Math.floor(f / 10 + i) % 2 ? 'up' : 'down'} />
						<Guy x={1340 + i * 160} y={600 + (i % 2) * 30} s={1} seed={2320 + i * 5} draw={clamp01(groupDraw * 1.5 - i * 0.1)} look={-1} badge={C.red} arms={Math.floor(f / 10 + i + 1) % 2 ? 'up' : 'down'} />
					</g>
				))}
				<Rough shape={{t: 'lpath', pts: [[760, 560], [860, 640], [800, 700], [960, 720], [1120, 640], [1060, 760], [1200, 700]]}} o={{stroke: C.red, strokeWidth: 10}} draw={prog(f, T(17, 'skłóconych'), 14)} seed={2340} />
				{/* władza */}
				<g opacity={prog(f, T(17, 'władza') - 6, 10)}>
					<Rough shape={{t: 'rect', x: 800, y: 330, w: 320, h: 36}} o={{fill: GREY, fillStyle: 'hachure', strokeWidth: 7}} seed={2345} />
					<Guy x={960} y={90} s={0.88} seed={2350} arms={sack > 0.9 ? 'up' : 'shrug'} />
					<Rough shape={{t: 'poly', pts: [[916, 52], [922, 4], [942, 34], [960, 0], [978, 34], [998, 4], [1004, 52]]}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={2355} />
				</g>
				{f >= T(17, 'razem') && f < T(19) && (
					<g>
						<Rough shape={{t: 'arc', cx: 960, cy: 940, w: 1100, h: 200, a0: 0, a1: Math.PI}} o={{strokeWidth: 6, strokeLineDash: [18, 14]}} draw={prog(f, T(17, 'razem'), 12)} seed={2360} />
						<Rough shape={{t: 'line', x1: 900, y1: 990, x2: 1020, y2: 1070}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(17, 'razem') + 10, 6)} seed={2361} />
						<Rough shape={{t: 'line', x1: 1020, y1: 990, x2: 900, y2: 1070}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(17, 'razem') + 14, 6)} seed={2362} />
					</g>
				)}
				<Lab text="„separa et impera”, zapis z 1615 roku" x={960} y={500} a={T(18, 'łacinie') - 6} b={T(19) - 4} size={76} seed={2365} dur={22} />
				{/* pilnują siebie nawzajem */}
				{f >= T(19, 'pilnują') && [0, 1, 2].map((i) => <Rough key={i} shape={{t: 'line', x1: 640, y1: 590 + i * 14, x2: 1280, y2: 590 + i * 14}} o={{stroke: C.red, strokeWidth: 4, strokeLineDash: [14, 12]}} draw={prog(f, T(19, 'pilnują') + i * 3, 12)} seed={2370 + i} />)}
				<g transform={`translate(${lerp(1500, 1110, sack)} ${lerp(160, 250, sack)})`} opacity={prog(f, T(19, 'władzy') - 6, 6)}>
					<Stack x={0} y={70} n={4} seed={2380} />
				</g>
				<Lab text="kim są „oni”?" x={960} y={1030} a={T(21, 'kim')} b={T(21, 'sprawdź') - 2} size={110} seed={2390} />
				<Lab text="kto zyskuje na waszej kłótni?" x={960} y={1030} a={T(21, 'sprawdź')} size={110} color={C.red} seed={2391} dur={24} />
				{f >= T(21, 'zyskuje') && <Rough shape={{t: 'ellipse', cx: 990, cy: 190, w: 520, h: 420}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(21, 'zyskuje'), 14)} seed={2395} />}
			</g>

			<TitleCard nr="sztuczka druga" name="dziel i rządź" i={1} a={T(0, 'dziel')} c={T(1) - 4} />
		</g>
	);
};

const CAM: Cam = {
	cx: [
		[0, 960],
		[T(6) - 8, 960],
		[T(6) + 16, X[1] + 960],
		[T(11) - 10, X[1] + 960],
		[T(11) + 14, X[2] + 960],
		[T(17) - 10, X[2] + 960],
		[T(17) + 14, X[3] + 960],
	],
	cy: [
		[0, 540],
		[T(3) - 6, 540],
		[T(3) + 10, 640],
		[T(5) - 8, 640],
		[T(5) + 8, 540],
		[T(6) - 8, 540],
		[T(6) + 16, 640],
		[T(8) - 6, 640],
		[T(8) + 10, 540],
		[T(21, 'zyskuje') - 6, 540],
		[T(21, 'zyskuje') + 14, 560],
	],
	z: [
		[0, 1],
		[T(3) - 6, 1],
		[T(3) + 10, 1.15],
		[T(5) - 8, 1.15],
		[T(5) + 8, 1],
		[T(6) - 8, 1],
		[T(6) + 16, 1.45],
		[T(8) - 6, 1.45],
		[T(8) + 10, 1],
		[T(12) - 4, 1],
		[T(12) + 8, 1.08],
		[T(13) - 6, 1.08],
		[T(13) + 8, 1],
	],
	hits: [
		[T(0, 'dziel'), 1.1],
		[T(2, 'dwie'), 0.6],
		[T(9, 'jeszcze'), 0.9],
		[T(10, 'Przewaga'), 0.8],
		[T(12, 'etykieta'), 1.2],
		[T(14, 'wskaże'), 0.7],
		[T(17, 'skłóconych'), 0.8],
		[T(21, 'zyskuje'), 0.9],
	],
};

export const Sala2: React.FC = () => (
	<Stage vo="sz2_vo.wav" cam={CAM}>
		<World />
	</Stage>
);
