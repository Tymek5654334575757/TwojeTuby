// Manipulacja 3: kotwica (efekt zakotwiczenia). Film 16:9 + short 9:16 (bez zdań [tylko film]).
import React from 'react';
import {LINES} from './mp3.gen';
import {AFRICA, REST} from './geo.gen';
import {
	C, Rough, Txt, G, makeT, ip, pk, swing, prog, EIN, EBACK, pv, on, shots, hitsAt, Stage, VHead, WithCard, TrickCard, Hero, Other, Aha,
	ExpCard, MarkTitle, PriceTag, AnchorShape, ChainLink, Thought, HeadProfile, Wheel, Slider, Stamp, Arrow, Hand, Floor, Clock,
	CutShort, keepFrom, keepLen, ShortWithCta, RW, SC, GREY, LIGHT, FPS, type Shot,
} from './mkit';

const T = makeT(LINES);
export const S3_FRAMES = Math.round((LINES[LINES.length - 1].e + 1.0) * FPS);
const G3 = SC[2];
const FL = 900;

// --- rekwizyty tej sztuczki ---
const Jacket: React.FC<{s?: number; draw?: number}> = ({s = 1, draw = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -40 -250 Q 0 -300 40 -250'}} o={{strokeWidth: 6}} draw={draw} seed={1300} />
		<Rough shape={{t: 'lpath', pts: [[0, -300], [0, -330], [20, -345]]}} o={{strokeWidth: 6}} draw={draw} seed={1301} />
		<Rough shape={{t: 'path', d: 'M -150 -240 L -40 -260 L 0 -200 L 40 -260 L 150 -240 L 210 40 L 140 50 L 120 -100 L 120 120 L -120 120 L -120 -100 L -140 50 L -210 40 Z'}} o={{fill: SC[1], fillStyle: 'hachure', hachureGap: 10, strokeWidth: 7}} draw={draw} seed={1302} />
		<Rough shape={{t: 'line', x1: 0, y1: -200, x2: 0, y2: 120}} o={{strokeWidth: 5}} draw={draw} seed={1303} />
	</g>
);
const Piggy: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 220, h: 160}} o={{fill: '#F6B7C6', fillStyle: 'solid', strokeWidth: 6}} seed={1310} />
		<Rough shape={{t: 'ellipse', cx: 112, cy: 4, w: 46, h: 54}} o={{fill: '#F6B7C6', fillStyle: 'solid', strokeWidth: 5}} seed={1311} />
		<Rough shape={{t: 'poly', pts: [[30, -70], [60, -110], [70, -60]]}} o={{fill: '#F6B7C6', fillStyle: 'solid', strokeWidth: 5}} seed={1312} />
		<Rough shape={{t: 'line', x1: -30, y1: -78, x2: 20, y2: -78}} o={{strokeWidth: 7}} seed={1313} />
		{[-60, -20, 30, 70].map((x, k) => (
			<Rough key={k} shape={{t: 'line', x1: x, y1: 60, x2: x, y2: 96}} o={{strokeWidth: 8}} seed={1314 + k} />
		))}
		<circle cx={60} cy={-20} r={6} fill={C.ink} />
	</g>
);
const Boat: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -140 0 L 140 0 L 100 70 L -100 70 Z'}} o={{fill: SC[4], fillStyle: 'hachure', hachureGap: 9, strokeWidth: 7}} seed={1320} />
		<Rough shape={{t: 'line', x1: 0, y1: 0, x2: 0, y2: -200}} o={{strokeWidth: 7}} seed={1321} />
		<Rough shape={{t: 'poly', pts: [[6, -190], [110, -40], [6, -40]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={1322} />
	</g>
);
const Waves: React.FC<{y: number; x0: number; x1: number; f: number}> = ({y, x0, x1, f}) => {
	const ph = Math.floor(f / 3) * 0.4;
	let d = `M ${x0} ${y}`;
	for (let x = x0; x <= x1; x += 40) d += ` L ${x} ${y + Math.sin(x / 50 + ph) * 8}`;
	return <path d={d} stroke={SC[1]} strokeWidth={6} fill="none" strokeLinecap="round" />;
};
const Map: React.FC<{lit: number}> = ({lit}) => (
	<g>
		<path d={REST} fill={LIGHT} stroke={GREY} strokeWidth={2} />
		<path d={AFRICA} fill={lit > 0 ? C.yellow : C.paper} fillOpacity={0.3 + 0.7 * lit} stroke={C.ink} strokeWidth={2.5} />
	</g>
);

// ---------- pokój 0: metka → kotwica w głowie ----------
const R0: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const k = T(1, 'kotwicą');
	const fall = ip(f, k - 4, k + 18, 0, 1, EIN);
	const tx = pv(v, 640, 960);
	const ty = pv(v, 360, 330);
	const hx = pv(v, 1280, 960);
	const hy = pv(v, 640, 820);
	const head = prog(f, k + 6, 14);
	const ax = tx + (hx + 20 - tx) * fall;
	const ay = ty + 60 + (hy + 20 - ty - 60) * fall;
	return (
		<g>
			<G x={tx} y={ty} s={pv(v, 1.7, 1.45)} r={-6 + swing(f, k - 4, 10)}>
				<PriceTag text="999 zł" w={320} sub="499 zł" strike={1} size={86} />
			</G>
			{f >= k - 4 && (
				<g>
					{head > 0 && (
						<G x={hx} y={hy} s={pv(v, 1.0, 0.85)}>
							<HeadProfile draw={head}>
								<path d="M -170 40 Q -90 20 -10 40 Q 70 60 160 40" stroke={SC[1]} strokeWidth={6} fill="none" opacity={head} />
							</HeadProfile>
						</G>
					)}
					<ChainLink x0={tx + 40} y0={ty + 110} x1={ax} y1={ay - 80} sag={40} p={fall > 0 ? 1 : 0} />
					<G x={ax} y={ay} s={0.62} r={(1 - fall) * 20}>
						<AnchorShape fill={G3} />
					</G>
				</g>
			)}
			{f >= T(1, 'mózgu') && <Txt text="kotwica" x={hx} y={pv(v, 330, 560)} size={90} color={C.red} draw={prog(f, T(1, 'mózgu'), 10)} seed={1330} />}
		</g>
	);
};

// ---------- pokój 1: kurtka, „oszczędzasz 500”, kto napisał 999 ----------
const R1: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const jx = pv(v, 760, 760);
	const tag = prog(f, T(3, 'było') - 6, 12);
	const pig = prog(f, T(4, 'oszczędzasz') - 4, 12) * (1 - prog(f, T(6, 'ktoś') + 6, 6));
	const puff = f >= T(6, 'ktoś') + 6 && f < T(6, 'ktoś') + 24;
	const write = prog(f, T(6, 'napisał') - 4, 20);
	const str = prog(f, T(4, 'oszczędzasz') + 6, 16);
	const q = f >= T(5, 'skąd') && f < T(6);
	return (
		<g>
			<Rough shape={{t: 'line', x1: 400, y1: 160, x2: 1120, y2: 160}} o={{strokeWidth: 8, stroke: GREY}} seed={1340} />
			<G x={jx} y={500} r={swing(f, T(2), 10)}>
				<Jacket draw={prog(f, T(2) - 6, 14)} />
			</G>
			<G x={jx + 230} y={560} r={8} s={tag}>
				<PriceTag text={write > 0 && write < 1 ? '' : 'było 999 zł'} w={330} size={58} sub="teraz 499 zł" strike={prog(f, T(3, 'teraz') - 4, 8)} subDraw={prog(f, T(3, 'teraz'), 10)} />
				{q && <Txt text="?" x={190} y={-40} size={120} color={C.red} seed={1341} />}
				{write > 0 && write < 1 && <Txt text="było 999 zł" x={22} y={-50} size={58} draw={write} seed={1342} />}
			</G>
			{write > 0 && write < 1.2 && (
				<G x={jx + 330 + write * 120} y={420 - write * 10} r={-30}>
					<Rough shape={{t: 'rect', x: -14, y: -160, w: 28, h: 160}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 5}} seed={1343} />
					<Hand s={0.8} />
				</G>
			)}
			<Hero x={pv(v, 1420, 1300)} y={FL} s={1.2} seed={540} look={-1} mood={pig > 0.5 ? 'grin' : 'flat'} arms={pig > 0.5 ? 'up' : 'down'} strings={[{c: G3, at: 'head', p: str}]} />
			{pig > 0 && (
				<G x={pv(v, 1420, 1150)} y={pv(v, 300, 270)} s={pig}>
					<Thought w={360} h={230} tail={[0.05, 1]}>
						<G x={-40} y={10} s={0.6}>
							<Piggy />
						</G>
						<Txt text="+500" x={100} y={-30} size={64} color={SC[3]} seed={1345} />
					</Thought>
				</G>
			)}
			{puff && (
				<g opacity={1 - (f - T(6, 'ktoś') - 6) / 18}>
					{[0, 1, 2, 3, 4].map((k) => (
						<circle key={k} cx={pv(v, 1420, 1150) + Math.cos(k * 1.3) * (40 + (f - T(6, 'ktoś')) * 4)} cy={pv(v, 300, 270) + Math.sin(k * 1.3) * (30 + (f - T(6, 'ktoś')) * 3)} r={30} fill="none" stroke={GREY} strokeWidth={5} />
					))}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 2: badanie 1974, koło fortuny ----------
const R2: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const spin = (a: number, stop: number) => {
		const p = ip(f, a - 40, a, 0, 1);
		return -stop - 1080 * (1 - p) * (1 - p);
	};
	const wA = T(9, '10');
	const wB = T(9, '65');
	const two = prog(f, T(9) - 4, 12);
	const ax = pv(v, 960 - 320 * two, 960);
	const ay = pv(v, 600, 600 - 160 * two);
	return (
		<g>
			<G x={960} y={210} s={0.85}>
				<ExpCard year="1974" who="Amos Tversky i Daniel Kahneman" f={f} a={T(7, '1974')} out={T(8) + 4} w={700} />
			</G>
			{f >= T(7, 'liczba') - 4 && f < T(8) + 6 && (
				<G x={960} y={620} s={pk(f, T(7, 'liczba') - 4)}>
					<Txt text="liczba, która nic nie znaczy" x={0} y={0} size={pv(v, 84, 64)} color={C.red} seed={1350} />
				</G>
			)}
			{f >= T(8) && (
				<g>
					<G x={ax} y={ay} s={pv(v, 1, 0.72) * prog(f, T(8), 12)}>
						<Wheel r={220} rot={f < T(9) - 4 ? (f - T(8)) * 14 : spin(wA, 120)} blur={f < T(9) - 4 ? 0.6 : 0} />
					</G>
					{f >= T(8, 'od') && f < T(9) && <Txt text="0–100" x={960} y={pv(v, 950, 960)} size={70} draw={prog(f, T(8, 'od'), 10)} seed={1351} />}
					{two > 0 && (
						<g opacity={two}>
							<G x={pv(v, 1280, 960)} y={pv(v, 600, 860)} s={pv(v, 1, 0.72)}>
								<Wheel r={220} rot={spin(wB, 220)} seed={960} />
							</G>
						</g>
					)}
					{f >= wA && (
						<G x={pv(v, 640, 1260)} y={pv(v, 960, 440)} s={pk(f, wA)}>
							<Txt text="10" x={0} y={30} size={120} color={C.red} seed={1352} />
						</G>
					)}
					{f >= wB && (
						<G x={pv(v, 1280, 1260)} y={pv(v, 960, 860)} s={pk(f, wB)}>
							<Txt text="65" x={0} y={30} size={120} color={C.red} seed={1353} />
						</G>
					)}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 3: pytanie o Afrykę i suwaki ----------
const R3: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const map = prog(f, T(10, 'pytanie') - 4, 14);
	const lit = prog(f, T(10, 'afrykańskie') - 4, 10);
	const sA = ip(f, T(13, 'brzmiała') - 4, T(13, '25%'), 50, 25, EBACK);
	const sB = ip(f, T(14, '45%') - 12, T(14, '45%'), 50, 45, EBACK);
	const showA = prog(f, T(13) - 4, 12);
	const showB = prog(f, T(14) - 4, 12);
	const sx = pv(v, 1260, 960);
	const sw = pv(v, 620, 720);
	const yA = pv(v, 470, 640);
	const yB = pv(v, 760, 900);
	const xv = (val: number) => sx - sw / 2 + (sw * val) / 100;
	const chainA = prog(f, T(15) - 4, 12);
	const br = prog(f, T(16, '20') - 4, 12);
	return (
		<g>
			<G x={pv(v, 520, 960)} y={pv(v, 560, 290)} s={pv(v, 0.95, 0.6) * map}>
				<Map lit={lit} />
			</G>
			<Txt text="jaki % państw w ONZ to państwa afrykańskie?" x={pv(v, 960, 960)} y={pv(v, 140, 40)} size={pv(v, 72, 50)} draw={prog(f, T(10, 'procent') - 2, 16)} seed={1360} />
			{f >= T(11) && f < T(13) && (
				<G x={sx} y={pv(v, 600, 760)} s={pk(f, T(11))}>
					<Txt text="więcej czy mniej?" x={0} y={-40} size={70} seed={1361} />
					{f >= T(12) && <Txt text="a ile dokładnie?" x={0} y={60} size={70} color={C.red} draw={prog(f, T(12), 10)} seed={1362} />}
				</G>
			)}
			{showA > 0 && (
				<G x={sx} y={yA} o={showA}>
					<Slider w={sw} v={sA} label="koło: 10" num />
				</G>
			)}
			{showB > 0 && (
				<G x={sx} y={yB} o={showB}>
					<Slider w={sw} v={sB} label="koło: 65" num color={SC[4]} />
				</G>
			)}
			{chainA > 0 && (
				<g opacity={chainA}>
					{[
						[10, yA, sA],
						[65, yB, sB],
					].map(([a, y, val], k) => (
						<g key={k}>
							<G x={xv(a)} y={y + 110} s={0.3}>
								<AnchorShape fill={G3} />
							</G>
							<ChainLink x0={xv(a)} y0={y + 70} x1={xv(val)} y1={y + 22} p={chainA} w={4} />
						</g>
					))}
				</g>
			)}
			{br > 0 && (
				<g>
					<Rough shape={{t: 'lpath', pts: [[xv(25), yA + 40], [xv(25), (yA + yB) / 2], [xv(45), (yA + yB) / 2], [xv(45), yB - 40]]}} o={{stroke: C.red, strokeWidth: 7}} draw={br} seed={1363} />
					<Txt text="20 punktów" x={xv(45) + 30} y={(yA + yB) / 2 + 20} size={64} anchor="start" color={C.red} draw={br} seed={1364} />
				</g>
			)}
		</g>
	);
};

// ---------- pokój 4 [tylko film]: mnożenie na tablicy ----------
const R4: React.FC<{f: number}> = ({f}) => {
	const board = prog(f, T(17) - 4, 14);
	const rowA = prog(f, T(19, '8') - 4, 18);
	const rowB = prog(f, T(20, 'od') - 4, 18);
	const big = ip(f, T(23, '40') - 10, T(23, '40'), -300, 820, EIN);
	return (
		<g>
			<Rough shape={{t: 'rect', x: 260, y: 120, w: 1400, h: 560}} o={{fill: '#2F4A3A', fillStyle: 'solid', strokeWidth: 9, stroke: '#8A5A2B'}} draw={board} seed={1370} />
			{f < T(19, '8') && <Txt text="oszacuj w 5 sekund:" x={960} y={420} size={96} color={C.paper} draw={prog(f, T(18, 'oszacować') - 4, 14)} seed={1379} />}
			<Txt text="8 × 7 × 6 × 5 × 4 × 3 × 2 × 1 =" x={330} y={300} size={86} anchor="start" color={C.paper} draw={rowA} seed={1371} />
			<Txt text="1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 =" x={330} y={520} size={86} anchor="start" color={C.paper} draw={rowB} seed={1372} />
			{f >= T(18, '5') && f < T(21) && (
				<G x={1500} y={850} s={pk(f, T(18, '5'))}>
					<Clock r={90} h={0} m={Math.min(59, (f - T(18, '5')) * 2)} bells={false} />
					<Txt text="5 s" x={150} y={20} size={80} seed={1373} />
				</G>
			)}
			{f >= T(21, '2250') && <Txt text="2250" x={1440} y={300} size={96} color={C.yellow} draw={prog(f, T(21, '2250'), 8)} seed={1374} />}
			{f >= T(22, '512') && <Txt text="512" x={1440} y={520} size={96} color={C.yellow} draw={prog(f, T(22, '512'), 8)} seed={1375} />}
			{f >= T(23, '40') - 10 && (
				<G x={960} y={big} s={1}>
					<Txt text="40 320" x={0} y={0} size={210} color={C.red} seed={1376} />
				</G>
			)}
			{f >= T(24, 'mniej') - 4 && (
				<g>
					<Rough shape={{t: 'circle', cx: 1440, cy: 270, d: 200}} o={{stroke: SC[3], strokeWidth: 8}} draw={prog(f, T(24, 'mniej') - 4, 10)} seed={1377} />
					<Txt text="bliżej" x={1440} y={420} size={60} color={SC[3]} draw={prog(f, T(24, 'mniej'), 10)} seed={1378} />
				</g>
			)}
		</g>
	);
};

// ---------- pokój 5: efekt zakotwiczenia, łódka na łańcuchu ----------
const R5: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const ax = 960;
	const ay = 900;
	const t = (f - T(26)) / 30;
	const tug = prog(f, T(27, 'odsuwasz') - 4, 20);
	const ang = -Math.PI / 2 + Math.sin(t * 0.9) * 0.7 + tug * 0.35;
	const len = 380 + tug * 40;
	const bx = ax + Math.cos(ang) * len * pv(v, 1.25, 0.95);
	const by = 470;
	return (
		<g>
			<MarkTitle text="efekt zakotwiczenia" x={960} y={180} f={f} a={T(25, 'zakotwiczenia')} size={pv(v, 130, 104)} />
			<g opacity={prog(f, T(26) - 6, 12)}>
				<Waves y={470} x0={300} x1={1620} f={f} />
				<G x={ax} y={ay} s={0.6}>
					<AnchorShape fill={G3} />
				</G>
				<ChainLink x0={ax} y0={ay - 70} x1={bx} y1={by + 40} sag={tug > 0.5 ? 0 : 60} />
				<G x={bx} y={by - 10 + Math.sin(f / 6) * 6} r={Math.sin(f / 8) * 4}>
					<Boat s={0.8} />
				</G>
				{f >= T(26, 'punktem') && <Txt text="punkt odniesienia" x={ax + 300} y={ay - 40} size={60} anchor="start" color={GREY} draw={prog(f, T(26, 'punktem'), 12)} seed={1380} />}
				{f >= T(27, 'mało') && (
					<G x={bx} y={by - 260} s={pk(f, T(27, 'mało'))}>
						<Txt text="za mało!" x={0} y={0} size={80} color={C.red} seed={1381} />
					</G>
				)}
			</g>
		</g>
	);
};

// ---------- pokój 6 [tylko film]: negocjacje ----------
const R6: React.FC<{f: number}> = ({f}) => {
	const note = ip(f, T(28, 'pierwszy') - 6, T(28, 'kwotę'), -400, 0, EBACK);
	const sink = prog(f, T(29, 'ustawia') - 4, 14);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<Other x={500} y={FL} s={1.25} seed={1390} arms="point" mood="smile" />
			<Other x={1420} y={FL} s={1.25} seed={1395} hair="long" look={-1} flip mood={sink > 0.5 ? 'worry' : 'flat'} />
			<Rough shape={{t: 'rect', x: 640, y: FL - 260, w: 640, h: 40}} o={{fill: '#C9A27A', fillStyle: 'solid', strokeWidth: 7}} seed={1396} />
			<Rough shape={{t: 'line', x1: 700, y1: FL - 220, x2: 700, y2: FL}} o={{strokeWidth: 7}} seed={1397} />
			<Rough shape={{t: 'line', x1: 1220, y1: FL - 220, x2: 1220, y2: FL}} o={{strokeWidth: 7}} seed={1398} />
			{f >= T(28, 'pierwszy') - 6 && (
				<G x={960 + note} y={FL - 290 + sink * 30} r={-4} o={1 - sink * 0.7}>
					<Rough shape={{t: 'rect', x: -150, y: -50, w: 300, h: 90}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={1399} />
					<Txt text="50 000 zł" x={0} y={18} size={64} color={C.red} seed={1400} />
				</G>
			)}
			{sink > 0 && (
				<G x={960} y={FL - 140 + sink * 40} s={0.4 * sink}>
					<AnchorShape fill={G3} />
				</G>
			)}
			{f >= T(29, 'rozmowę') && <Txt text="cała rozmowa kręci się wokół tej kwoty" x={960} y={220} size={70} draw={prog(f, T(29, 'rozmowę'), 14)} seed={1401} />}
		</g>
	);
};

// ---------- pokój 7: jak to rozpoznać ----------
const R7: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const q = T(30, 'rozpoznać');
	const b = T(31);
	const ahaEnd = T(31, 'zapytaj') - 2;
	const tagP = prog(f, T(31) + 4, 12);
	const cover = ip(f, T(31, 'Zakryj') + 2, T(31, 'pierwszą') + 6, 0, 1, EBACK);
	const shop = prog(f, T(32, 'sklepie') - 6, 12);
	const law = prog(f, T(33, 'najniższą') - 4, 14);
	const cmp = prog(f, T(34, 'Porównuj') - 2, 12);
	const loose = 1 - prog(f, T(34, 'liczbą') - 4, 22);
	const showHero = f < q - 2 || f > ahaEnd;
	const tx = pv(v, 640, 960);
	const ty = pv(v, 430, 330);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			{showHero && <Hero x={pv(v, 1340, 1330)} y={FL} s={1.2} seed={540} look={-1} mood={f >= T(34) ? 'smile' : 'flat'} arms={f >= T(31, 'zapłaciłbym') && f < T(32) ? 'shrug' : 'down'} strings={[{c: G3, at: 'head', p: loose, slack: prog(f, T(34) - 6, 12)}]} />}
			<Aha x={pv(v, 1340, 1330)} y={FL} s={1.2} a={q} b={b} until={ahaEnd} />
			{tagP > 0 && (
				<G x={tx} y={ty} s={pv(v, 1.5, 1.25) * tagP} r={-4}>
					<PriceTag text="999 zł" w={340} sub="499 zł" strike={1} size={80} />
					{law > 0 && (
						<g transform="translate(0 190)" opacity={law}>
							<Rough shape={{t: 'rect', x: -190, y: -40, w: 380, h: 120}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={1410} />
							<Txt text="najniższa z 30 dni:" x={0} y={0} size={34} draw={law} seed={1411} />
							<Txt text="549 zł" x={0} y={60} size={56} color={SC[3]} draw={law} seed={1412} />
						</g>
					)}
					{cover > 0 && (
						<g transform={`translate(${-300 + cover * 280} -50)`} opacity={1 - prog(f, T(32) - 4, 8)}>
							<Rough shape={{t: 'path', d: 'M -200 -50 L 40 -60 C 90 -60 110 -40 110 0 C 110 40 90 60 40 60 L -200 50 Z'}} o={{fill: '#E9C9A8', fillStyle: 'solid', strokeWidth: 6}} seed={1413} />
						</g>
					)}
				</G>
			)}
			{f >= T(31, 'zapłaciłbym') && f < T(32) && <Txt text="ile zapłaciłbym?" x={pv(v, 1340, 1260)} y={FL - 440} size={64} draw={prog(f, T(31, 'zapłaciłbym'), 10)} seed={1414} />}
			{shop > 0 && f < T(33, '2023') && (
				<G x={pv(v, 1000, 960)} y={pv(v, 180, 760)} s={shop}>
					<Txt text="w polskim sklepie:" x={0} y={0} size={64} color={GREY} seed={1415} />
				</G>
			)}
			{f >= T(33, '2023') && (
				<G x={pv(v, 1080, 600)} y={pv(v, 220, 110)} s={pk(f, T(33, '2023'))}>
					<Stamp text="§ od 2023" s={0.85} rot={-8} color={SC[1]} />
				</G>
			)}
			{cmp > 0 && (
				<g>
					<Arrow x0={tx + pv(v, 300, 260)} y0={ty + pv(v, 380, 330)} x1={tx + pv(v, 200, 160)} y1={ty + pv(v, 130, 110)} draw={cmp} color={SC[3]} bend={0.3} seed={1416} />
					<Txt text="porównuj z tą ceną" x={tx + pv(v, 380, 0)} y={ty + pv(v, 450, 480)} size={58} color={SC[3]} draw={cmp} seed={1417} />
				</g>
			)}
		</g>
	);
};

// ---------- montaż ----------
const SHOTS = (v: boolean): Shot[] => [
	[0, 0, [-160, -60, 1.12], [0, -60, 1.04]],
	[T(1, 'kotwicą') + 20, 0, [0, 40, 1.0], [0, 60, 0.98], 20],
	[T(2), 1, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(5, 'warta') + 2, 1, [80, 40, 1.25], [40, 60, 1.12], 20],
	[T(6) + 4, 1, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(7) + 4, 2, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(10) + 4, 3, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(16, '20') + 6, 3, [200, 80, 1.1], [0, 100, 1.04], 18],
	[T(17) + 4, 4, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(23, '40') + 4, 4, [0, 60, 1.06], [0, 0, 1.0], 6],
	[T(25) + 4, 5, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(27, 'mało') + 6, 5, [0, 40, 1.1], [0, 40, 1.04], 20],
	[T(28) + 4, 6, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(30) + 2, 7, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(33, '2023') + 6, 7, [-80, -40, 1.06], [0, 0, 1.0], 20],
];
const ROOMS: [number, number, React.FC<{f: number; v: boolean}>][] = [
	[0, T(2), R0],
	[T(2) - 14, T(7), R1],
	[T(7) - 14, T(10), R2],
	[T(10) - 14, T(17), R3],
	[T(17) - 14, T(25), ({f}) => <R4 f={f} />],
	[T(25) - 14, T(28), R5],
	[T(28) - 14, T(30), ({f}) => <R6 f={f} />],
	[T(30) - 14, 99999, R7],
];
const HITS = [T(1, 'kotwicą') + 14, T(7, '1974'), T(9, '10'), T(9, '65'), T(13, '25%'), T(14, '45%'), T(16, '20'), T(23, '40'), T(25, 'zakotwiczenia'), T(30, 'rozpoznać'), T(33, '2023')].map((t) => [t, 0.75] as [number, number]);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => (
	<Stage v={v} lines={LINES} vo="mp3_vo.wav" keys={shots(v, SHOTS(v))} hits={hitsAt(HITS)} head={<VHead i={2} />}>
		{(f) => (
			<g>
				{ROOMS.map(([a, b, R], i) =>
					on(f, a, b) ? (
						<g key={i} transform={`translate(${i * RW} 0)`}>
							<R f={f} v={v} />
						</g>
					) : null,
				)}
			</g>
		)}
	</Stage>
);

export const ManipS3: React.FC = () => (
	<WithCard card={<TrickCard i={2} />}>
		<Scene />
	</WithCard>
);
export const S3_KEEP = keepFrom(LINES, [17, 18, 19, 20, 21, 22, 23, 24, 28, 29], null, S3_FRAMES);
export const S3S_SCENE = keepLen(S3_KEEP);
export const ManipS3S: React.FC = () => (
	<ShortWithCta sceneFrames={S3S_SCENE} i={2}>
		<CutShort keep={S3_KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
