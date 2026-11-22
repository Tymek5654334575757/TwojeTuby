// Hak, przerywnik (subskrypcja) i finał filmu „5 manipulacji” (tylko 16:9).
import React from 'react';
import {LINES as L0} from './mp0.gen';
import {LINES as LZ} from './mpz.gen';
import {LINES as L6} from './mp6.gen';
import {
	C, Rough, Txt, G, makeT, endOf, ip, pk, live, swing, prog, EIN, on, shots, hitsAt, Stage, Hero, IconBox, Gift, PriceTag, Phone, Bottle, Clock, Padlock, QKey, Puppeteer,
	Say, Floor, Heart, Hand, AnchorShape, RW, SC, GREY, LIGHT, type Shot, type Str,
} from './mkit';

const FL = 900;
const strs = (p: number[], extra: Partial<Str>[] = []): Str[] =>
	(['head', 'l', 'r', 'lf', 'rf'] as const).map((at, k) => ({c: SC[k], at, p: p[k] ?? 0, dx: [0, -30, 30, -20, 20][k], ...(extra[k] ?? {})}));

// Ścieżka dnia z pięcioma przystankami i kłódką na końcu.
const STOPS: [number, number][] = [
	[330, 660],
	[600, 520],
	[870, 660],
	[1140, 520],
	[1410, 660],
];
const LOCK: [number, number] = [1690, 560];
const DayPath: React.FC<{f: number; a: number; lit?: number[]; done?: number[]; lock?: number; lockOpen?: number}> = ({f, a, lit = [], done = [], lock = 1, lockOpen = 0}) => {
	const pts: [number, number][] = [[120, 600], ...STOPS, LOCK];
	return (
		<g>
			<Rough shape={{t: 'lpath', pts}} o={{stroke: GREY, strokeWidth: 8, strokeLineDash: [18, 16]}} draw={prog(f, a, 24)} seed={2000} />
			{STOPS.map(([x, y], k) => (
				<G key={k} x={x} y={y} s={0.95 * pk(f, a + 8 + k * 5) * (1 + 0.15 * (lit[k] ?? 0))}>
					{(lit[k] ?? 0) > 0 && <circle r={120} fill={SC[k]} opacity={0.3 * (lit[k] ?? 0)} />}
					<G x={-75} y={-75}>
						<IconBox i={k} done={done[k] ?? 0} />
					</G>
					<Txt text={`${k + 1}`} x={0} y={128} size={60} color={GREY} seed={2001 + k} />
				</G>
			))}
			{lock > 0 && (
				<G x={LOCK[0]} y={LOCK[1] + 40} s={0.8 * lock}>
					<Padlock open={lockOpen} />
				</G>
			)}
		</g>
	);
};

// =================== HAK ===================
const T0 = makeT(L0);
export const HAK_FRAMES = endOf(L0) + 24;
const Hak0: React.FC<{f: number}> = ({f}) => {
	const tug = f >= T0(0, 'pokierować') ? swing(f, T0(0, 'pokierować'), 10) : 0;
	const fade = 1 - 0.85 * live(f, T0(2, 'nawet'), T0(3) + 4, 8);
	const deco = (w: string) => prog(f, T0(4, w) - 4, 10);
	const icons = [
		{w: 'uprzejmość', el: <Gift w={110} />},
		{w: 'okazja', el: <PriceTag text="-50%" w={180} size={60} />},
		{w: 'cena', el: <PriceTag text="9,99 zł" w={200} size={54} />},
	];
	const mini = (w: string) => prog(f, T0(1, w) - 4, 10) * (1 - prog(f, T0(2) + 10, 10));
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<Hero
				x={960}
				y={FL}
				s={1.55}
				seed={540}
				walk={f < T0(2) ? f : undefined}
				lean={tug * 0.6}
				look={f >= T0(2) && f < T0(3) ? Math.sin(f / 8) : 0}
				mood={f >= T0(2) && f < T0(3) ? 'flat' : 'flat'}
				strings={strs([1, 1, 1, 1, 1])}
			/>
			{fade < 1 && <rect x={0} y={-100} width={1920} height={520} fill={C.paper} opacity={(1 - fade) * 0.9} />}
			{mini('sklepie') > 0 && (
				<G x={480} y={620} s={mini('sklepie')}>
					<Rough shape={{t: 'path', d: 'M -90 -60 L 90 -60 L 70 40 L -70 40 Z'}} o={{fill: LIGHT, fillStyle: 'hachure', strokeWidth: 6}} seed={2010} />
					<Rough shape={{t: 'path', d: 'M -60 -60 Q 0 -150 60 -60'}} o={{strokeWidth: 6}} seed={2011} />
					<Txt text="sklep" x={0} y={110} size={56} color={GREY} seed={2018} />
				</G>
			)}
			{mini('ulicy') > 0 && (
				<G x={1440} y={640} s={mini('ulicy')} o={1 - prog(f, T0(1, 'telefonie') - 4, 6)}>
					<Rough shape={{t: 'line', x1: 0, y1: 260, x2: 0, y2: -160}} o={{strokeWidth: 8}} seed={2012} />
					<Rough shape={{t: 'rect', x: -110, y: -160, w: 220, h: 120}} o={{fill: C.yellow, fillStyle: 'hachure', strokeWidth: 6}} seed={2013} />
					<Txt text="PROMOCJA" x={0} y={-82} size={46} seed={2014} />
				</G>
			)}
			{mini('telefonie') > 0 && (
				<G x={1440} y={600} s={mini('telefonie')} r={swing(f, T0(1, 'telefonie'), 8)}>
					<Phone w={170}>
						<rect x={-66} y={-110} width={132} height={56} rx={8} fill={C.red} />
						<Txt text="-70%!" x={0} y={-70} size={36} color={C.paper} seed={2015} />
					</Phone>
				</G>
			)}
			{f >= T0(3, 'manipulacja') - 4 && f < T0(4) + 6 && (
				<G x={960} y={190}>
					<Txt text="manipulacja?" x={0} y={0} size={110} draw={prog(f, T0(3, 'manipulacja') - 4, 10)} seed={2016} />
					<Rough shape={{t: 'line', x1: -300, y1: -20, x2: 300, y2: -30}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, T0(3, 'manipulacja') + 10, 8)} seed={2017} />
				</G>
			)}
			{icons.map((ic, k) => {
				const p = deco(ic.w);
				if (p <= 0) return null;
				return (
					<G key={k} x={[640, 1280, 960][k]} y={[300, 300, 150][k]} s={p} r={swing(f, T0(4, ic.w), 8) + [-6, 6, 0][k]}>
						{ic.el}
					</G>
				);
			})}
		</g>
	);
};
const Hak1: React.FC<{f: number}> = ({f}) => {
	const a = T0(5) - 6;
	const lit = [live(f, T0(7) - 4, T0(8) - 2, 6), 0, 0, 0, live(f, T0(8) - 4, T0(9) - 2, 6)];
	const done = [0, 1, 2, 3, 4].map((k) => prog(f, T0(6, 'zbadali') + k * 4, 8));
	const key = ip(f, T0(9, 'pytanie') - 16, T0(9, 'pytanie') + 6, -500, 0, EIN);
	const open = prog(f, T0(9, 'rozbraja') - 2, 10);
	return (
		<g>
			<DayPath f={f} a={a} lit={lit} done={done} lockOpen={open} />
			<Hero x={150} y={700} s={0.8} seed={540} strings={strs([1, 1, 1, 1, 1], [0, 1, 2, 3, 4].map((k) => ({snap: prog(f, T0(9, 'pięć') - 6 + k * 3, 14)})))} top={-60} />
			{f >= T0(7) - 4 && f < T0(8) && (
				<G x={STOPS[0][0] + 10} y={STOPS[0][1] - 230} s={0.55 * pk(f, T0(7, 'butelkę') - 4)} r={swing(f, T0(7, 'butelkę'), 8)}>
					<Bottle />
				</G>
			)}
			{f >= T0(8) - 4 && f < T0(9) + 10 && (
				<G x={STOPS[4][0]} y={STOPS[4][1] - 240} s={0.55 * pk(f, T0(8, 'o 7:00') - 6)}>
					<Clock h={7} m={0} ring={f >= T0(8, 'o 7:00') ? 1 : 0} />
				</G>
			)}
			{f >= T0(9, 'pytanie') - 16 && (
				<G x={LOCK[0] + key} y={LOCK[1] - 220} s={0.6} r={open * 20}>
					<QKey />
				</G>
			)}
			<Txt text="5 sztuczek" x={960} y={180} size={120} draw={prog(f, T0(5, 'pięć') - 4, 12)} seed={2020} />
			{f >= T0(6) && <Txt text="każda zbadana" x={960} y={950} size={70} color={GREY} draw={prog(f, T0(6), 12)} seed={2021} />}
		</g>
	);
};
const HAK_SHOTS: Shot[] = [
	[0, 0, [0, -40, 1.1], [0, 0, 1]],
	[T0(1) + 4, 0, [0, -20, 1.0], [0, 0, 1], 20],
	[T0(5) + 4, 1, [0, 0, 1.0], [0, 0, 1], 16],
	[T0(7) + 10, 1, [-500, 0, 1.4], [0, 0, 1], 18],
	[T0(8) + 4, 1, [380, 0, 1.4], [0, 0, 1], 18],
	[T0(9) + 6, 1, [0, 0, 1.0], [0, 0, 1], 16],
];
export const ManipHak: React.FC = () => (
	<Stage lines={L0} vo="mp0_vo.wav" keys={shots(false, HAK_SHOTS)} hits={hitsAt([[T0(0, 'pokierować'), 0.7], [T0(5, 'pięć'), 0.6], [T0(9, 'rozbraja'), 0.8]])}>
		{(f) => (
			<g>
				{on(f, 0, T0(5)) && <Hak0 f={f} />}
				{on(f, T0(5) - 14, 99999) && (
					<g transform={`translate(${RW} 0)`}>
						<Hak1 f={f} />
					</g>
				)}
			</g>
		)}
	</Stage>
);

// =================== PRZERYWNIK ===================
const TZ = makeT(LZ);
export const Z_FRAMES = endOf(LZ) + 20;
export const ManipZ: React.FC = () => (
	<Stage lines={LZ} vo="mpz_vo.wav" keys={shots(false, [[0, 0, [0, 0, 1.05], [0, 0, 1]], [TZ(3), 0, [0, 40, 1.0], [0, 0, 1], 20]])} hits={hitsAt([[TZ(1, 'zasubskrybuj') + 12, 0.6]])}>
		{(f) => {
			const btn = pk(f, TZ(1, 'zasubskrybuj') - 6);
			const click = TZ(1, 'zasubskrybuj') + 12;
			const cur = ip(f, TZ(1, 'zasubskrybuj') - 6, click, 0, 1);
			const clicked = f >= click;
			const items = [
				['prezentu', <Gift key="g" w={120} />],
				['kotwicy', <G key="a" s={0.5}><AnchorShape fill={SC[2]} /></G>],
				['licznika', <Txt key="l" text="09:59" x={0} y={20} size={70} color={C.red} seed={2030} />],
			] as const;
			return (
				<g>
					<G x={960} y={230} s={pk(f, 0)}>
						<Rough shape={{t: 'rect', x: -60, y: -70, w: 40, h: 140}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} seed={2031} />
						<Rough shape={{t: 'rect', x: 20, y: -70, w: 40, h: 140}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} seed={2032} />
					</G>
					<Txt text="krótka przerwa" x={960} y={400} size={90} draw={prog(f, 4, 14)} seed={2033} />
					{btn > 0 && (
						<G x={960} y={620} s={btn * (clicked && f < click + 6 ? 0.92 : 1)}>
							<Rough shape={{t: 'rect', x: -260, y: -70, w: 520, h: 140}} o={{fill: clicked ? GREY : C.red, fillStyle: 'solid', strokeWidth: 6}} seed={2034} />
							<Txt text={clicked ? 'subskrybujesz ✓' : 'SUBSKRYBUJ'} x={0} y={24} size={72} color={C.paper} seed={2035} />
						</G>
					)}
					{f >= TZ(1, 'zasubskrybuj') - 6 && f < TZ(2) + 20 && (
						<G x={1400 - cur * 380} y={900 - cur * 230}>
							<path d="M 0 0 L 0 70 L 18 54 L 32 84 L 44 78 L 30 50 L 54 50 Z" fill={C.paper} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
						</G>
					)}
					{clicked && (
						<G x={1300} y={560} s={pk(f, click + 4)} r={swing(f, click + 4, 14) * 1.5}>
							<Rough shape={{t: 'path', d: 'M -50 30 C -50 -60 50 -60 50 30 L 64 50 L -64 50 Z'}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={2036} />
							<Rough shape={{t: 'circle', cx: 0, cy: 64, d: 26}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 4}} seed={2037} />
						</G>
					)}
					{f >= TZ(2) && f < TZ(3) + 4 && <Txt text="(to też prośba)" x={960} y={820} size={70} color={GREY} draw={prog(f, TZ(2), 10)} seed={2038} />}
					{f >= TZ(3) - 4 &&
						items.map(([w, el], k) => {
							const p = prog(f, TZ(3, w) - 8, 10);
							return (
								<G key={k} x={560 + k * 400} y={860} s={0.8 + 0.2 * p} o={prog(f, TZ(3) - 4 + k * 3, 8)}>
									{el}
									<Rough shape={{t: 'line', x1: -110, y1: -110, x2: 110, y2: 60}} o={{stroke: C.red, strokeWidth: 12}} draw={p} seed={2040 + k} />
								</G>
							);
						})}
				</g>
			);
		}}
	</Stage>
);

// =================== FINAŁ ===================
const T6 = makeT(L6);
export const FINAL_FRAMES = Math.max(endOf(L6) + 30, T6(13) + 600);
export const FINAL_ENDSCREEN_FROM = T6(13);
const BEZ = ['prezentu', 'wcześniejszej', 'przekreślonej', 'licznika', 'zmiany'];
const LABELS = ['prezent → dług', 'ustępstwo → ustąp', 'liczba → skala', 'rzadkość → pośpiech', '„tak” → trzyma'];
const Fin0: React.FC<{f: number}> = ({f}) => {
	const lit = [1, 2, 3, 4, 5].map((li, k) => live(f, T6(li) - 2, T6(li + 1) - 2, 6) * (k >= 0 ? 1 : 0));
	return (
		<g>
			<DayPath f={f} a={0} lit={lit} done={[1, 1, 1, 1, 1]} lock={0} />
			<Txt text="jeden wzór" x={960} y={180} size={120} draw={prog(f, T6(0, 'wzór') - 4, 12)} seed={2050} />
			{[1, 2, 3, 4, 5].map((li, k) =>
				f >= T6(li) - 2 ? (
					<G key={k} x={STOPS[k][0]} y={STOPS[k][1] + (k % 2 ? -190 : 220)} s={pk(f, T6(li) - 2)}>
						<Txt text={LABELS[k]} x={0} y={0} size={46} color={k === 4 ? C.red : C.ink} seed={2051 + k} />
					</G>
				) : null,
			)}
		</g>
	);
};
const Fin1: React.FC<{f: number}> = ({f}) => {
	const bolt = prog(f, T6(6, 'działa') - 4, 8);
	const think = prog(f, T6(6, 'pomyśleć') - 6, 12);
	const q = prog(f, T6(7, 'czy') - 4, 30);
	const snaps = BEZ.map((w) => prog(f, T6(8, w) - 2, 14));
	const free = prog(f, T6(9, 'twoja') - 6, 14);
	const pup = live(f, T6(10, 'czyjaś') - 6, T6(11) - 4, 6);
	const walk = f >= T6(9) ? f - T6(9) : -1;
	const hx = 960 + (walk > 0 ? Math.min(walk, 60) * 3 : 0);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			{f < T6(7) && (
				<g opacity={1 - prog(f, T6(7) - 8, 8)}>
					<G x={420} y={620} s={0.9}>
						<IconBox i={3} />
					</G>
					<Rough shape={{t: 'lpath', pts: [[620, 650], [760, 560], [700, 690], [860, 600]]}} o={{stroke: C.yellow, strokeWidth: 14}} draw={bolt} seed={2060} />
					<G x={960} y={640} s={bolt}>
						<Hand s={1.2} />
					</G>
					{think > 0 && (
						<G x={1450} y={460} s={think}>
							<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 320, h: 180}} o={{fill: '#EEF4FF', fillStyle: 'solid', stroke: C.blue, strokeWidth: 6}} seed={2061} />
							<Txt text="hmm…" x={0} y={18} size={64} color={C.blue} seed={2062} />
							<Txt text="za późno" x={0} y={150} size={54} color={GREY} seed={2063} />
						</G>
					)}
				</g>
			)}
			{f >= T6(7) - 6 && (
				<g>
					<Hero x={hx} y={FL} s={1.4} seed={540} mood={free > 0.5 ? 'smile' : 'flat'} walk={walk > 0 && walk < 60 ? f : undefined} bend={0} lean={0} strings={strs([1, 1, 1, 1, 1], snaps.map((s) => ({snap: s})))} />
					{q > 0 && f < T6(9) && (
						<G x={960} y={230}>
							<Txt text="czy wybrałbym to samo," x={0} y={0} size={86} draw={q} seed={2064} />
							<Txt text="gdyby nikt mi tego nie podsunął?" x={0} y={100} size={86} color={C.red} draw={prog(f, T6(7, 'gdyby') - 4, 30)} seed={2065} />
						</G>
					)}
					{f >= T6(8) && f < T6(9) && (
						<G x={960} y={470}>
							{BEZ.map((w, k) => (snaps[k] > 0 ? <Txt key={k} text="bez" x={-400 + k * 200} y={0} size={60} color={SC[k]} draw={snaps[k]} seed={2066 + k} /> : null))}
						</G>
					)}
					{free > 0 && (
						<G x={960} y={250} s={pk(f, T6(9, 'twoja') - 6)}>
							<Txt text="„tak” → twoja decyzja" x={0} y={0} size={96} color={SC[3]} seed={2072} />
						</G>
					)}
					{f >= T6(10) - 2 && f < T6(11) && <Txt text="„nie” → czyjaś sztuczka" x={960} y={400} size={86} color={C.red} draw={prog(f, T6(10) - 2, 12)} seed={2073} />}
					{pup > 0 && (
						<G x={hx} y={-40 + 140 * pup} o={pup * 0.85}>
							<Puppeteer w={380} />
						</G>
					)}
				</g>
			)}
		</g>
	);
};
const Fin2: React.FC<{f: number}> = ({f}) => {
	const blink = (k: number) => (f >= T6(11, 'pięciu') ? 1 + 0.12 * Math.max(0, Math.sin((f - T6(11, 'pięciu') - k * 6) / 4)) : 1);
	return (
		<g>
			<Txt text="którą widziałeś w tym tygodniu?" x={960} y={260} size={96} draw={prog(f, T6(11) - 2, 16)} seed={2080} />
			{[0, 1, 2, 3, 4].map((k) => (
				<G key={k} x={480 + k * 240} y={560} s={pk(f, T6(11) + k * 4) * blink(k)}>
					<G x={-75} y={-75}>
						<IconBox i={k} />
					</G>
					<Txt text={`${k + 1}`} x={0} y={140} size={70} color={GREY} seed={2081 + k} />
				</G>
			))}
			{f >= T6(12) - 4 && (
				<G x={960} y={880} s={pk(f, T6(12) - 4)}>
					<Say x={0} y={0} text="napisz w komentarzu: numer" size={60} tx={-120} ty={100} seed={2090} />
				</G>
			)}
		</g>
	);
};
// Plansza końcowa: miejsce na film po lewej, subskrypcja po prawej (elementy dodaje się w YouTube Studio).
const Fin3: React.FC<{f: number}> = ({f}) => {
	const a = T6(13);
	const p = prog(f, a, 16);
	const breathe = Math.sin(f / 30) * 6;
	return (
		<g>
			<Txt text="sztuczki polityków →" x={560} y={240} size={80} draw={prog(f, a + 4, 16)} seed={2100} />
			<Rough shape={{t: 'rect', x: 180, y: 300, w: 760, h: 428}} o={{stroke: GREY, strokeWidth: 6, strokeLineDash: [20, 14]}} draw={p} seed={2101} />
			<Rough shape={{t: 'circle', cx: 1400, cy: 514, d: 330}} o={{stroke: GREY, strokeWidth: 6, strokeLineDash: [20, 14]}} draw={p} seed={2102} />
			<Txt text="subskrybuj" x={1400} y={760} size={70} color={C.red} draw={prog(f, a + 10, 14)} seed={2103} />
			<Hero x={1680} y={1000} s={0.8} seed={540} mood="smile" arms="wave" opacity={p} />
			<G x={960} y={930} o={p}>
				<Txt text="Psychorożek" x={0} y={0} size={60} color={GREY} seed={2104} />
			</G>
			<G x={1680} y={300 + breathe} s={0.8} o={p}>
				<Heart s={0.6} />
			</G>
		</g>
	);
};
const FIN_SHOTS: Shot[] = [
	[0, 0, [0, 0, 1.0], [0, 0, 1]],
	[T6(5) + 30, 0, [0, 0, 1.06], [0, 0, 1], 60],
	[T6(6) + 4, 1, [0, 0, 1.0], [0, 0, 1], 16],
	[T6(8) + 4, 1, [0, -20, 1.0], [0, 0, 1], 14],
	[T6(11) + 4, 2, [0, 0, 1.0], [0, 0, 1], 16],
	[T6(13) + 6, 3, [0, 0, 1.0], [0, 0, 1], 16],
];
export const ManipFinal: React.FC = () => (
	<Stage lines={L6} vo="mp6_vo.wav" keys={shots(false, FIN_SHOTS)} hits={hitsAt(BEZ.map((w) => [T6(8, w), 0.4] as [number, number]))}>
		{(f) => (
			<g>
				{on(f, 0, T6(6)) && <Fin0 f={f} />}
				{on(f, T6(6) - 14, T6(11)) && (
					<g transform={`translate(${RW} 0)`}>
						<Fin1 f={f} />
					</g>
				)}
				{on(f, T6(11) - 14, T6(13)) && (
					<g transform={`translate(${2 * RW} 0)`}>
						<Fin2 f={f} />
					</g>
				)}
				{on(f, T6(13) - 14, 99999) && (
					<g transform={`translate(${3 * RW} 0)`}>
						<Fin3 f={f} />
					</g>
				)}
			</g>
		)}
	</Stage>
);
