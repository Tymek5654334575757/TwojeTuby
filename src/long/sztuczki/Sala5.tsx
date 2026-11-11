// „5 sztuczek polityków”, część 5: plasterek po plasterku + zakończenie filmu (1920×1080).
// Sale: Palo Alto 1966 → „tak” rośnie → salami → prawo zmieniane krokami → podsumowanie pięciu sztuczek.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Mini} from '../../kit/figures';
import {LINES} from './vo5.gen';
import {C, Rough, Txt, FPS, RW, GREY, makeT, prog, pk, lerp, live, Stage, Guy, Lectern, Doc, DeadCat, Glyph, TitleCard, Big, Lab, type Cam} from './common';

const T = makeT(LINES);
export const SALA5_FRAMES = Math.round((LINES[33].e + 1.6) * FPS);
const X = [0, RW, RW * 2, RW * 3, RW * 4];

const House: React.FC<{x: number; draw: number; seed: number; sticker?: number}> = ({x, draw, seed, sticker = 0}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} 0)`}>
			<Rough shape={{t: 'rect', x: -230, y: 420, w: 460, h: 400}} o={{strokeWidth: 8, fill: C.paper, fillStyle: 'solid'}} draw={draw} seed={seed} />
			<Rough shape={{t: 'poly', pts: [[-280, 420], [0, 240], [280, 420]]}} o={{strokeWidth: 8, fill: GREY, fillStyle: 'hachure', hachureGap: 12}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'rect', x: -50, y: 620, w: 100, h: 200}} o={{strokeWidth: 7}} draw={draw} seed={seed + 2} />
			<Rough shape={{t: 'rect', x: 80, y: 500, w: 110, h: 110}} o={{strokeWidth: 7}} draw={draw} seed={seed + 3} />
			{sticker > 0 && (
				<g transform={`translate(135 555) scale(${sticker})`}>
					<Rough shape={{t: 'rect', x: -28, y: -28, w: 56, h: 56}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={seed + 4} />
				</g>
			)}
		</g>
	);
};

const Sign: React.FC<{x: number; draw: number; seed: number}> = ({x, draw, seed}) => {
	if (draw <= 0) return null;
	return (
		<g transform={`translate(${x} 0) rotate(-3 0 700)`}>
			<Rough shape={{t: 'line', x1: -170, y1: 760, x2: -160, y2: 900}} o={{strokeWidth: 10}} draw={draw} seed={seed} />
			<Rough shape={{t: 'line', x1: 170, y1: 760, x2: 180, y2: 900}} o={{strokeWidth: 10}} draw={draw} seed={seed + 1} />
			<Rough shape={{t: 'rect', x: -240, y: 500, w: 480, h: 280}} o={{strokeWidth: 9, fill: C.paper, fillStyle: 'solid', roughness: 2.6}} draw={draw} seed={seed + 2} />
			<Txt text="JEDŹ" x={-30} y={610} size={110} draw={draw} seed={seed + 3} rotate={-5} />
			<Txt text="OSTROŻNIE" x={10} y={730} size={88} draw={draw} seed={seed + 4} rotate={3} />
		</g>
	);
};

const World: React.FC = () => {
	const f = useCurrentFrame();

	// sala 2: salami
	const cutT = (i: number) => T(11, 'Odcina') + i * 11;
	const cuts = [0, 1, 2, 3, 4].filter((i) => f >= cutT(i)).length;
	// po „Aż salami się kończy” tniemy resztę
	const endCuts = f >= T(18, 'salami') ? 1 : 0;
	// sala 3: schody
	const stepT = [T(14, 'wyjątek'), T(15, 'przedłużenie'), T(16, 'regułą')];
	const steps = stepT.filter((t) => f >= t).length;
	const SX = 1080;
	const SY = 330;
	// sala 4: zakończenie
	const capT = [T(24), T(25), T(26), T(27), T(28)];
	const caps = ['zabiera uwagę', 'daje wroga', 'wybiera za ciebie', 'udaje prawdę', 'krok po kroku'];
	const beam = prog(f, T(32, 'zauważyć') - 6, 14);
	const catT = T(33, 'kota');
	const rowUp = prog(f, T(29) - 10, 18);
	const catFall = prog(f, catT - 12, 12);

	return (
		<g>
			{/* ================= SALA 0: Palo Alto ================= */}
			<g>
				<Lab text="Freedman i Fraser, 1966 · Palo Alto" x={960} y={120} a={T(1) + 22} size={90} seed={5001} dur={26} />
				<Rough shape={{t: 'line', x1: 60, y1: 822, x2: 1860, y2: 822}} o={{strokeWidth: 8}} draw={prog(f, T(1) - 2, 20)} seed={5002} />
				<House x={520} draw={prog(f, T(1, 'domu') - 6, 16)} seed={5010} />
				<House x={1400} draw={prog(f, T(1, 'domu') + 4, 16)} seed={5020} sticker={pk(f, T(4, 'znaczek'))} />
				<Sign x={520} draw={prog(f, T(2, 'tablicę') - 10, 16)} seed={5030} />
				<Guy x={130} y={540} s={1} seed={5040} draw={prog(f, T(2) - 2, 12)} arms="point" look={1} />
				<Big text="17%" x={520} y={950} a={T(3, 'siedemnaście')} size={170} seed={5045} />
				<Lab text="dwa tygodnie wcześniej: mały znaczek w oknie" x={960} y={210} a={T(4, 'dwa')} b={T(5) - 2} size={60} color={GREY} seed={5050} dur={22} />
				{f >= T(4, 'znaczek') && f < T(5, 'tablicę') && <Rough shape={{t: 'circle', cx: 1535, cy: 555, d: 150}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, T(4, 'znaczek') + 4, 10)} seed={5051} />}
				<Sign x={1400} draw={prog(f, T(5, 'tablicę') - 8, 16)} seed={5060} />
				<Big text="76%" x={1400} y={950} a={T(5, 'siedemdziesiąt')} size={170} seed={5065} />
			</g>

			{/* ================= SALA 1: „tak” rośnie ================= */}
			<g transform={`translate(${X[1]} 0)`}>
				<Guy x={480} y={500} s={1.5} seed={5100} draw={prog(f, T(6) - 2, 14)} look={1} badge={f >= T(6, 'widzieć') ? C.yellow : undefined} />
				<Big text="tak" x={480} y={300} a={T(6, 'tak')} size={110} color={C.ink} seed={5105} until={T(7) - 2} />
				<g opacity={prog(f, T(6, 'widzieć') - 8, 10)}>
					<Rough shape={{t: 'ellipse', cx: 1240, cy: 560, w: 520, h: 760}} o={{strokeWidth: 12, stroke: GREY, fill: C.paper, fillStyle: 'solid'}} draw={prog(f, T(6, 'widzieć') - 8, 14)} seed={5110} />
					<Guy x={1240} y={470} s={1.3} seed={5115} draw={prog(f, T(6, 'widzieć'), 12)} look={-1} badge={C.yellow} />
				</g>
				<Lab text="„jestem kimś, kto się zgadza”" x={1240} y={1020} a={T(6, 'osobę')} size={66} color={C.red} seed={5120} dur={22} />
				{['tak', 'TAK', 'TAK!'].map((t, i) => (
					<Big key={i} text={t} x={200 + i * 270} y={250 - i * 20} a={T(7) + i * 12} size={90 + i * 40} color={i === 2 ? C.red : C.ink} seed={5130 + i} />
				))}
			</g>

			{/* ================= SALA 2: salami ================= */}
			<g transform={`translate(${X[2]} 0)`}>
				<Big text="taktyka salami" x={960} y={150} a={T(8, 'taktyką')} size={170} seed={5200} />
				<Rough shape={{t: 'rect', x: 300, y: 700, w: 1320, h: 50}} o={{strokeWidth: 8, fill: GREY, fillStyle: 'hachure', hachureGap: 10}} draw={prog(f, T(8, 'salami') - 8, 14)} seed={5205} />
				{/* salami: 6 części, odcinane od prawej */}
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const idxFromRight = 5 - i;
					const cutAt = idxFromRight < 5 ? cutT(idxFromRight) : T(18, 'salami') + 4;
					const gone = idxFromRight < cuts || (i === 0 && endCuts === 1);
					const u = gone ? prog(f, cutAt, 16) : 0;
					const x0 = 430 + i * 150;
					return (
						<g key={i} opacity={prog(f, T(8, 'salami') - 4 + i * 2, 8) * (1 - u * u)} transform={`translate(${u * 260} ${u * u * 330}) rotate(${u * 50} ${x0 + 75} 600)`}>
							<Rough shape={{t: 'rect', x: x0, y: 520, w: 150, h: 170}} o={{fill: C.red, fillStyle: 'hachure', hachureGap: 8, fillWeight: 4, strokeWidth: 7}} seed={5210 + i} />
							{i > 0 && <Mini x={x0 + 75} y={470} s={1.3} seed={5220 + i} />}
						</g>
					);
				})}
				<Lab text="przypisywana Mátyásowi Rákosiemu (Węgry, lata 40.)" x={960} y={900} a={T(9, 'przypisuje')} b={T(12) - 6} size={62} color={GREY} seed={5230} dur={26} />
				<g opacity={live(f, T(10, 'jednym') - 4, T(11) - 2)}>
					<Txt text="wszyscy naraz" x={960} y={360} size={100} color={GREY} draw={prog(f, T(10, 'jednym') - 4, 10)} seed={5235} />
					<Rough shape={{t: 'line', x1: 700, y1: 340, x2: 1220, y2: 320}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(10, 'jednym') + 6, 8)} seed={5236} />
				</g>
				<Lab text="po jednym plasterku" x={960} y={360} a={T(11, 'plasterku') - 6} b={T(12) - 6} size={100} color={C.red} seed={5237} />
			</g>

			{/* ================= SALA 3: prawo krok po kroku ================= */}
			<g transform={`translate(${X[3]} 0)`}>
				<Doc x={480} y={560} title="PRAWO" draw={prog(f, T(12, 'prawo') - 10, 14)} seed={5300} rot={-2} w={460} h={640} lines={9} stamp={pk(f, T(16, 'regułą'))} stampText="REGUŁA" />
				<g opacity={live(f, T(13, 'wielkiej') - 6, T(14) - 2)}>
					<Txt text="wielka zmiana" x={1360} y={200} size={110} color={GREY} draw={prog(f, T(13, 'wielkiej') - 6, 10)} seed={5310} />
					<Rough shape={{t: 'line', x1: 1100, y1: 180, x2: 1620, y2: 160}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T(13, 'wielkiej') + 4, 8)} seed={5311} />
				</g>
				{[
					['wyjątek', 'tylko na czas kryzysu', stepT[0], T(14, 'kryzysu')],
					['przedłużenie', '', stepT[1], 0],
				].map(([t1, t2, a, a2], i) => (
					<g key={i} transform={`translate(640 ${440 + i * 170}) rotate(${i ? 5 : -6}) scale(${pk(f, a as number)})`}>
						<Rough shape={{t: 'rect', x: -170, y: -70, w: 340, h: 140}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={5320 + i} />
						<Txt text={t1 as string} x={0} y={t2 ? -4 : 22} size={62} seed={5325 + i} />
						{t2 && <Txt text={t2 as string} x={0} y={46} size={36} color={C.red} draw={prog(f, (a2 as number) - 8, 12)} seed={5328 + i} />}
					</g>
				))}
				{/* schody */}
				<Rough shape={{t: 'line', x1: SX - 40, y1: SY - 110, x2: SX + 760, y2: SY - 110}} o={{stroke: C.red, strokeWidth: 5, strokeLineDash: [20, 16]}} draw={prog(f, T(14) - 4, 16)} seed={5340} />
				<Lab text="start" x={SX + 40} y={SY - 130} a={T(14) - 2} size={50} color={GREY} seed={5341} />
				<Rough shape={{t: 'line', x1: SX - 40, y1: SY, x2: SX + 150, y2: SY}} o={{strokeWidth: 8}} draw={prog(f, T(14) - 4, 10)} seed={5342} />
				{[0, 1, 2].map((i) => (
					<g key={i}>
						<Rough shape={{t: 'lpath', pts: [[SX + 150 + i * 190, SY + i * 150], [SX + 150 + i * 190, SY + (i + 1) * 150], [SX + 340 + i * 190, SY + (i + 1) * 150]]}} o={{strokeWidth: 8}} draw={prog(f, stepT[i] - 4, 12)} seed={5345 + i} />
						<Lab text="mały krok" x={SX + 250 + i * 190} y={SY + (i + 1) * 150 + 56} a={stepT[i] + 4} b={T(20) - 2} size={44} color={GREY} seed={5350 + i} />
					</g>
				))}
				<g transform={`translate(${SX + 60 + steps * 190} ${SY - 232 + steps * 150}) scale(0.82)`}>
					<Guy x={0} y={0} seed={5360} draw={prog(f, T(14) - 4, 12)} arms={f >= T(17) && f < T(19) ? 'shrug' : 'down'} look={1} />
				</g>
				<Lab text="za mało, żeby protestować" x={SX + 360} y={SY - 190} a={T(17)} b={T(19) - 4} size={66} color={GREY} seed={5365} dur={20} />
				{/* nie krok, tylko kierunek */}
				{f >= T(20) && f < T(21) && <Rough shape={{t: 'circle', cx: SX + 250, cy: SY + 110, d: 250}} o={{stroke: GREY, strokeWidth: 9}} draw={prog(f, T(20), 10)} seed={5370} />}
				{f >= T(21) && (
					<g>
						<Rough shape={{t: 'line', x1: SX + 20, y1: SY - 60, x2: SX + 700, y2: SY + 500}} o={{stroke: C.red, strokeWidth: 16}} draw={prog(f, T(21), 14)} seed={5375} />
						<Rough shape={{t: 'lpath', pts: [[SX + 610, SY + 490], [SX + 700, SY + 500], [SX + 680, SY + 410]]}} o={{stroke: C.red, strokeWidth: 16}} draw={prog(f, T(21) + 10, 8)} seed={5376} />
					</g>
				)}
				<Lab text="oceń kierunek" x={SX + 520} y={SY + 80} a={T(21)} size={96} color={C.red} seed={5380} />
				<Lab text="czy zgodziłbym się na całość od razu?" x={960} y={1020} a={T(22, 'czy')} size={84} seed={5381} dur={30} />
			</g>

			{/* ================= SALA 4: zakończenie ================= */}
			<g transform={`translate(${X[4]} 0)`}>
				<g transform={`translate(960 ${lerp(230, 0, rowUp)}) scale(${lerp(1.15, 1, rowUp)}) translate(-960 0)`}>
				{[0, 1, 2, 3, 4].map((i) => {
					const bx = 250 + i * 355;
					const on = f >= capT[i];
					return (
						<g key={i}>
							<g transform={`translate(${bx} 200) scale(${pk(f, T(23) + i * 3) * (on ? 1 + 0.12 * pk(f, capT[i]) : 1)}) translate(-75 -75)`} opacity={on || f >= T(29) ? 1 : 0.4}>
								<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 3, strokeWidth: 7}} seed={5400 + i} />
								<Glyph i={i} />
							</g>
							<Lab text={caps[i]} x={bx} y={370} a={capT[i] + 6} size={56} color={C.red} seed={5410 + i} dur={12} />
						</g>
					);
				})}
				</g>
				<Guy x={470} y={630} s={1.15} seed={5420} draw={prog(f, T(29) - 4, 14)} look={1} arms={beam > 0 ? 'point' : 'down'} />
				<Lectern x={1450} y={690} draw={prog(f, T(30, 'tych') - 10, 14)} seed={5430} />
				<Lab text="tak działa ludzka głowa" x={920} y={490} a={T(30, 'zbudowana') - 6} b={T(31) - 4} size={76} seed={5440} dur={20} />
				{f >= T(30, 'twoja') && f < T(31) && <Rough shape={{t: 'ellipse', cx: 470, cy: 760, w: 330, h: 560}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, T(30, 'twoja'), 10)} seed={5442} />}
				{f >= T(30, 'tych') && f < T(31) && <Rough shape={{t: 'ellipse', cx: 1450, cy: 730, w: 400, h: 680}} o={{stroke: C.red, strokeWidth: 9}} draw={prog(f, T(30, 'tych'), 10)} seed={5443} />}
				<g opacity={live(f, T(31) - 2, T(32) - 2)}>
					<Txt text="wyłączyć" x={960} y={600} size={130} color={GREY} draw={prog(f, T(31), 10)} seed={5450} />
					<Rough shape={{t: 'line', x1: 760, y1: 580, x2: 1160, y2: 550}} o={{stroke: C.red, strokeWidth: 14}} draw={prog(f, T(31, 'wyłączyć'), 8)} seed={5451} />
				</g>
				{beam > 0 && f < catT - 14 && <polygon points={`590,690 ${lerp(590, 180, beam)},${lerp(690, 110, beam)} ${lerp(590, 1750, beam)},${lerp(690, 110, beam)}`} fill={C.yellow} opacity={0.3 * beam} />}
				<Lab text="zauważyć" x={960} y={600} a={T(32, 'zauważyć')} b={T(33) - 4} size={170} color={C.red} seed={5455} />
				{/* kot na koniec */}
				{f >= catT - 12 && <DeadCat x={960} y={lerp(-300, 780, catFall * catFall) - Math.max(0, 20 * Math.exp(-(f - catT) / 4) * Math.cos((f - catT) * 0.9)) * (f >= catT ? 1 : 0)} s={1.1} rot={(1 - catFall) * -160} />}
				<Lab text="o czym mówiliśmy wczoraj?" x={900} y={520} a={T(33, 'o')} size={112} color={C.red} seed={5460} dur={24} />
			</g>

			<TitleCard nr="sztuczka piąta" name="plasterek po plasterku" i={4} a={T(0, 'plasterek')} c={T(1) - 4} />
		</g>
	);
};

const CAM: Cam = {
	cx: [
		[0, 960],
		[T(6) - 10, 960],
		[T(6) + 14, X[1] + 900],
		[T(8) - 10, X[1] + 900],
		[T(8) + 14, X[2] + 960],
		[T(12) - 10, X[2] + 960],
		[T(12) + 14, X[3] + 960],
		[T(23) - 10, X[3] + 960],
		[T(23) + 16, X[4] + 960],
	],
	cy: [
		[0, 540],
		[T(6) + 14, 570],
		[T(8) + 14, 540],
		[T(12) + 14, 560],
		[T(23) + 16, 540],
	],
	z: [
		[0, 1],
		[T(20) - 4, 1],
		[T(20) + 8, 1.12],
		[T(21) - 6, 1.12],
		[T(21) + 10, 1],
	],
	hits: [
		[T(0, 'plasterek'), 1.1],
		[T(3, 'siedemnaście'), 0.9],
		[T(5, 'siedemdziesiąt'), 1.1],
		[T(8, 'taktyką'), 1],
		[cutT0(), 0.5],
		[T(16, 'regułą'), 1.1],
		[T(21), 0.8],
		[T(33, 'kota'), 1.5],
	],
};
function cutT0() {
	return T(11, 'Odcina');
}

export const Sala5: React.FC = () => (
	<Stage vo="sz5_vo.wav" cam={CAM}>
		<World />
	</Stage>
);
