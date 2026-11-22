// Manipulacja 5: niska piłka (konsekwencja po zgodzie). Film 16:9 + short 9:16.
import React from 'react';
import {LINES} from './mp5.gen';
import {
	C, Rough, Txt, G, makeT, ip, pk, live, swing, prog, arcPt, pv, on, shots, hitsAt, Stage, VHead, WithCard, TrickCard, Hero, Other, Aha, Scribble,
	ExpCard, MarkTitle, Door, Car, PriceTag, Stamp, Thought, Clock, Sun, Bar, Say, Floor,
	CutShort, keepFrom, keepLen, ShortWithCta, RW, SC, GREY, FPS, type Shot,
} from './mkit';

const T = makeT(LINES);
export const S5_FRAMES = Math.round((LINES[LINES.length - 1].e + 1.0) * FPS);
const RD = SC[4];
const FL = 900;

const OldPhone: React.FC<{ring: number}> = ({ring}) => {
	const sh = ring > 0 ? Math.sin(ring * 60) * 6 : 0;
	return (
		<g transform={`rotate(${sh})`}>
			<Rough shape={{t: 'path', d: 'M -110 0 L -80 -90 L 80 -90 L 110 0 Z'}} o={{fill: SC[4], fillStyle: 'hachure', hachureGap: 8, strokeWidth: 7}} seed={1800} />
			<Rough shape={{t: 'path', d: 'M -130 -100 Q 0 -170 130 -100 L 110 -80 Q 0 -130 -110 -80 Z'}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} seed={1801} />
			<Rough shape={{t: 'circle', cx: 0, cy: -44, d: 60}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={1802} />
		</g>
	);
};
const Ball: React.FC<{heavy: number; s?: number}> = ({heavy, s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 110 + heavy * 50}} o={{fill: heavy > 0.5 ? '#2B2B3A' : RD, fillStyle: heavy > 0.5 ? 'solid' : 'hachure', hachureGap: 8, strokeWidth: 6}} seed={1810} />
		{heavy > 0.5 ? (
			<g fill={C.paper}>
				<circle cx={-14} cy={-24} r={9} />
				<circle cx={12} cy={-30} r={9} />
				<circle cx={0} cy={-6} r={9} />
			</g>
		) : (
			<Rough shape={{t: 'arc', cx: 0, cy: 0, w: 70, h: 110, a0: -1.4, a1: 1.4}} o={{strokeWidth: 5}} seed={1811} />
		)}
	</g>
);
const Swatch: React.FC<{c: string; s?: number}> = ({c, s = 1}) => <Rough shape={{t: 'rect', x: -36 * s, y: -36 * s, w: 72 * s, h: 72 * s}} o={{fill: c, fillStyle: 'solid', strokeWidth: 5}} seed={1820} />;

// ---------- pokój 0: cena po „tak” ----------
const R0: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const inflate = 1 + 0.55 * prog(f, T(0, 'podnieść') - 2, 30);
	const stamp = T(1, 'usłyszysz') + 10;
	return (
		<g>
			<G x={pv(v, 620, 960)} y={pv(v, 470, 290)} s={pv(v, 1.35, 1.15)}>
				<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 460, h: 260}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={1830} />
				<Rough shape={{t: 'poly', pts: [[-60, 110], [-140, 210], [10, 126]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={1831} />
				<Txt text="TAK" x={0} y={44} size={150} seed={1832} />
				{f >= stamp && (
					<G s={1.6 - 0.6 * prog(f, stamp, 5)} r={-12}>
						<Stamp text="ZGODA" s={1} rot={0} />
					</G>
				)}
			</G>
			<G x={pv(v, 1320, 960)} y={pv(v, 500, 780)} s={inflate * pv(v, 1.3, 1.1)} r={6 + swing(f, T(0, 'podnieść'), 12)}>
				<PriceTag text="39 900 zł" w={340} size={76} fill={inflate > 1.2 ? '#FFE7E0' : C.paper} />
				<line x1={-170} y1={0} x2={-260} y2={80} stroke={C.ink} strokeWidth={4} />
			</G>
		</g>
	);
};

// ---------- pokój 1: salon samochodowy ----------
const R1: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const sx0 = pv(v, 520, 620);
	const doorX = pv(v, 260, 260);
	const go = T(4, 'idzie');
	const back = T(4, 'wraca');
	const sx = f < back - 10 ? ip(f, go - 4, go + 26, sx0, doorX + 40) : ip(f, back - 10, back + 16, doorX + 40, sx0);
	const gone = f > go + 26 && f < back - 10;
	const walking = (f > go - 4 && f < go + 26) || (f > back - 10 && f < back + 16);
	const shake = f >= T(3, 'uścisk') - 4 && f < T(3, 'kolor') - 6;
	const col = f >= T(3, 'kolor') + 6 ? SC[3] : SC[1];
	const sw = prog(f, T(3, 'kolor') - 6, 10) * (1 - prog(f, T(4) + 10, 8));
	const plus = prog(f, T(5, '3000') - 4, 10);
	const dream = prog(f, T(6, 'widzisz') - 4, 12);
	const str = prog(f, T(6, 'samochodzie') - 4, 16);
	const hx = pv(v, 1400, 1300);
	return (
		<g>
			<Floor x0={180} x1={1700} y={FL} />
			<G x={doorX} y={FL} o={pv(v, 1, 0)}>
				<Door w={200} h={420} label="KIEROWNIK" labelSize={34} open={live(f, go + 16, back - 4, 6)} seed={1840} />
			</G>
			<G x={960} y={FL - 10} s={pv(v, 1.05, 0.85)}>
				<Car w={560} color={col} />
			</G>
			{f >= T(3, 'cena') - 6 && (
				<G x={960} y={pv(v, 450, 500)} s={pk(f, T(3, 'cena') - 6)} r={-4}>
					<PriceTag text="39 900 zł" w={320} size={70} sub={plus > 0 ? '+ 3000 zł' : undefined} subDraw={plus} />
				</G>
			)}
			{sw > 0 && (
				<g opacity={sw}>
					{[SC[1], SC[3], SC[0], SC[4]].map((c, k) => (
						<G key={k} x={pv(v, 760, 780) + k * 130} y={pv(v, 250, 300)} s={1}>
							<Swatch c={c} />
						</G>
					))}
				</g>
			)}
			{!gone && (
				<Other x={sx} y={FL} s={1.2} seed={1850} mood={f >= back - 10 && f < T(6) ? 'worry' : 'smile'} arms={shake ? 'reach' : 'down'} walk={walking ? f : undefined} flip={f > go - 4 && f < go + 26}>
					<Rough shape={{t: 'line', x1: 0, y1: -230, x2: 0, y2: -120}} o={{strokeWidth: 10, stroke: C.red}} seed={1851} />
				</Other>
			)}
			<Hero x={hx} y={FL} s={1.25} seed={540} flip={shake} arms={shake ? 'reach' : f >= T(6) ? 'hold' : 'down'} look={-1} mood={dream > 0 ? 'grin' : 'smile'} strings={[{c: RD, at: 'head', p: str}]} />
			{shake && <Txt text="umowa!" x={hx - 140} y={FL - 500} size={70} draw={prog(f, T(3, 'uścisk') - 4, 8)} seed={1852} />}
			<Say x={pv(v, 700, 760)} y={pv(v, 270, 220)} text="kierownik się nie zgodził…" size={52} tx={-150} ty={180} draw={prog(f, T(4, 'kierownik', 1) - 4, 10)} o={1 - prog(f, T(5) + 20, 8)} seed={1853} />
			{dream > 0 && (
				<G x={pv(v, 1380, 1200)} y={pv(v, 240, 260)} s={dream}>
					<Thought w={420} h={250} tail={[-0.02, 1]}>
						<G y={40} s={0.42}>
							<Car w={520} color={SC[3]} />
						</G>
						<G x={-10} y={-40} s={0.35}>
							<Hero x={0} y={0} s={1} seed={545} mood="grin" />
						</G>
					</Thought>
				</G>
			)}
		</g>
	);
};

// ---------- pokój 2: badanie 1978, grupa 1 ----------
const R2: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const ring = f >= T(8, 'dzwonił') - 4 && f < T(9) ? (f - T(8, 'dzwonił')) / 30 : 0;
	const clk = prog(f, T(9, 'o 7:00') - 6, 12);
	return (
		<g>
			<G x={960} y={230} s={0.85}>
				<ExpCard year="1978" who="Robert Cialdini i zespół" f={f} a={T(7, '1978')} out={T(8) - 2} />
			</G>
			<Floor x0={300} x1={1620} y={FL} />
			<G x={pv(v, 520, 600)} y={pv(v, 620, 600)} s={pk(f, T(8) - 6)}>
				<OldPhone ring={ring} />
			</G>
			<Other x={pv(v, 820, 860)} y={FL} s={1.2} seed={1860} hair="long" look={-1} draw={prog(f, T(8) - 4, 12)} mood={f >= T(10) ? 'worry' : 'flat'} arms={f >= T(10) ? 'shrug' : 'down'} />
			<Txt text="grupa 1" x={pv(v, 820, 860)} y={pv(v, 1020, 260)} size={60} color={GREY} draw={prog(f, T(9), 10)} seed={1861} />
			{clk > 0 && (
				<G x={pv(v, 1120, 1120)} y={pv(v, 420, 420)} s={clk * 0.9} r={swing(f, T(9, 'o 7:00') - 6, 8)}>
					<Clock h={7} m={0} />
				</G>
			)}
			{f >= T(9, 'o 7:00') && <Txt text="7:00" x={pv(v, 1120, 1120)} y={pv(v, 620, 610)} size={80} color={C.red} draw={prog(f, T(9, 'o 7:00'), 8)} seed={1862} />}
			<Say x={pv(v, 760, 760)} y={pv(v, 330, 330)} text="badanie o myśleniu?" size={56} tx={-160} ty={170} draw={prog(f, T(8, 'zapraszał') - 2, 10)} o={1 - prog(f, T(9) + 10, 8)} seed={1863} />
			<Bar x={pv(v, 1460, 1380)} base={FL} v={31} f={f} a={T(10, '31%')} w={150} hMax={560} under="od razu 7:00" />
		</g>
	);
};

// ---------- pokój 3: grupa 2 — „tak”, potem 7:00 ----------
const R3: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const yes = T(11, 'udział');
	const pop7 = T(12, 'o 7:00');
	const jack = prog(f, pop7 - 6, 8);
	const exit = prog(f, T(13, 'wycofać') - 6, 12);
	const crick = f >= T(14) && f < T(15);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<Other x={pv(v, 620, 660)} y={FL} s={1.2} seed={1870} mood="smile" arms={f >= yes && f < pop7 ? 'up' : 'down'} />
			<Txt text="grupa 2" x={pv(v, 620, 660)} y={pv(v, 1020, 260)} size={60} color={GREY} draw={prog(f, T(11), 10)} seed={1871} />
			{f >= yes && (
				<G x={pv(v, 620, 700)} y={pv(v, 360, 400)} s={pk(f, yes)} r={-10}>
					<Stamp text="TAK" s={0.9} />
				</G>
			)}
			{jack > 0 && (
				<g>
					<Rough shape={{t: 'rect', x: pv(v, 900, 900), y: FL - 130, w: 160, h: 130}} o={{fill: SC[4], fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={1872} />
					<path d={`M ${pv(v, 980, 980)} ${FL - 130} ${Array.from({length: 6}, (_, k) => `L ${pv(v, 980, 980) + (k % 2 ? 30 : -30)} ${FL - 130 - (k + 1) * 45 * jack}`).join(' ')}`} fill="none" stroke={C.ink} strokeWidth={6} />
					<G x={pv(v, 980, 980)} y={FL - 130 - 270 * jack - 90} s={0.8 * jack} r={swing(f, pop7, 10)}>
						<Clock h={7} m={0} />
					</G>
				</g>
			)}
			{exit > 0 && (
				<G x={pv(v, 1340, 1300)} y={FL} o={exit * (1 - prog(f, T(15) - 10, 8))}>
					<Door w={200} h={400} open={live(f, T(13, 'wycofać'), T(15), 8)} label="wyjście" labelSize={44} seed={1875} />
				</G>
			)}
			{crick && <Txt text="cri… cri…" x={pv(v, 1340, 1300)} y={420} size={60} color={GREY} draw={prog(f, T(14), 10)} seed={1876} />}
			{f >= T(15) - 6 && (
				<g>
					<Bar x={pv(v, 1260, 1180)} base={FL} v={31} f={f} a={T(15) - 6} w={130} hMax={560} under="od razu" />
					<Bar x={pv(v, 1480, 1400)} base={FL} v={56} f={f} a={T(15, '56%')} w={130} hMax={560} under="po „tak”" color={RD} />
				</g>
			)}
		</g>
	);
};

// ---------- pokój 4: poranek ----------
const R4: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const rise = prog(f, T(16) - 4, 30);
	const x1 = pv(v, 760, 760);
	const x2 = pv(v, 1260, 1200);
	const n1 = Math.round(ip(f, T(17, '24%') - 10, T(17, '24%') + 10, 0, 2));
	const n2 = Math.round(ip(f, T(18, '53%') - 10, T(18, '53%') + 10, 0, 5));
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<G x={960} y={FL - 360 * rise + 60} s={1.4}>
				<Sun r={100} rise={rise} />
			</G>
			{f >= T(16, 'poranek') && f < T(17) + 10 && (
				<G x={pv(v, 1500, 1320)} y={300} s={0.8}>
					<Clock h={7} m={0} ring={1} />
				</G>
			)}
			{f >= T(17) - 4 && (
				<g>
					<G x={x1} y={FL}>
						<Door w={220} h={420} label="lab" labelSize={50} open={0.6} seed={1880} />
					</G>
					<G x={x2} y={FL}>
						<Door w={220} h={420} label="lab" labelSize={50} open={0.6} seed={1885} />
					</G>
					{Array.from({length: n1}).map((_, k) => (
						<Other key={k} x={x1 - 150 + k * 80} y={FL} s={0.7} seed={1890 + k} mood="flat" />
					))}
					{Array.from({length: n2}).map((_, k) => (
						<Other key={k} x={x2 - 220 + k * 75} y={FL} s={0.7} seed={1900 + k} mood="smile" />
					))}
					<Txt text="grupa 1" x={x1} y={FL + 70} size={54} color={GREY} seed={1910} />
					<Txt text="grupa 2" x={x2} y={FL + 70} size={54} color={GREY} seed={1911} />
					{f >= T(17, '24%') && <Txt text="24%" x={x1} y={380} size={110} color={C.red} draw={prog(f, T(17, '24%'), 8)} seed={1912} />}
					{f >= T(18, '53%') && <Txt text="53%" x={x2} y={380} size={110} color={C.red} draw={prog(f, T(18, '53%'), 8)} seed={1913} />}
					{f >= T(19, 'dwa') && (
						<G x={pv(v, x2 + 220, x2)} y={pv(v, 220, 200)} s={pk(f, T(19, 'dwa'))}>
							<Stamp text="× 2" />
						</G>
					)}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 5: niska piłka ----------
const R5: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const hx = pv(v, 1200, 1160);
	const thr = prog(f, T(20, 'niska') - 10, 18);
	const heavy = prog(f, T(22, 'gorsze') - 4, 8);
	const bend = heavy * 0.9;
	const bp = arcPt(thr, pv(v, 420, 520), FL - 200, hx + 30, FL - 210, -60);
	const sign = prog(f, T(23, 'konsekwentni') - 6, 12);
	const props = prog(f, T(24, 'powodów') - 4, 12);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			{f >= T(20) - 6 && f < T(21) + 20 && <Other x={pv(v, 420, 520)} y={FL} s={1.15} seed={1850} arms={thr < 0.4 ? 'reach' : 'down'} mood="smile" />}
			<Hero x={hx} y={FL} s={1.25} seed={540} bend={bend} arms={thr >= 1 ? 'hold' : 'down'} look={-1} mood={heavy > 0.5 ? 'worry' : 'smile'} strings={[{c: RD, at: 'r', p: 1}]} />
			<MarkTitle text="niska piłka" x={960} y={180} f={f} a={T(20, 'piłka')} size={130} />
			{thr > 0 && (
				<G x={thr < 1 ? bp.x : hx + 60} y={thr < 1 ? bp.y : FL - 210 + bend * 80} s={pv(v, 1, 0.9)}>
					<Ball heavy={heavy} />
				</G>
			)}
			{f >= T(21, 'dobre') && f < T(22) && <Txt text="dobre warunki" x={hx} y={430} size={64} color={SC[3]} draw={prog(f, T(21, 'dobre'), 10)} seed={1920} />}
			{f >= T(22, 'gorsze') && f < T(23) && <Txt text="gorsze warunki" x={hx} y={430} size={64} color={C.red} draw={prog(f, T(22, 'gorsze'), 10)} seed={1921} />}
			{sign > 0 && (
				<G x={pv(v, 700, 720)} y={pv(v, 560, 560)} s={sign} r={-6}>
					<Rough shape={{t: 'line', x1: 0, y1: 0, x2: 0, y2: 340}} o={{strokeWidth: 9, stroke: '#8A5A2B'}} seed={1922} />
					<Rough shape={{t: 'rect', x: -130, y: -110, w: 260, h: 140}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={1923} />
					<Txt text="TAK" x={0} y={-10} size={100} seed={1924} />
					{props > 0 &&
						[0, 1, 2].map((k) => (
							<G key={k} x={-150 + k * 150} y={-170 - (k % 2) * 40} s={props * 0.8}>
								<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 80}} o={{fill: '#EEF4FF', fillStyle: 'solid', stroke: C.blue, strokeWidth: 5}} seed={1925 + k} />
								<Txt text="+" x={0} y={20} size={70} color={C.blue} seed={1928 + k} />
							</G>
						))}
				</G>
			)}
			{f >= T(23, 'konsekwentni') && f < T(24) && <Txt text="konsekwencja" x={pv(v, 700, 720)} y={300} size={70} draw={prog(f, T(23, 'konsekwentni'), 10)} seed={1931} />}
			{f >= T(24) && <Txt text="szukamy powodów" x={pv(v, 700, 720)} y={300} size={64} draw={prog(f, T(24), 12)} seed={1932} />}
		</g>
	);
};

// ---------- pokój 6 [tylko film]: tani bilet + opłaty ----------
const R6: React.FC<{f: number}> = ({f}) => {
	const fees = [
		['opłata serwisowa', '+ 29 zł', T(25, 'serwisowa')],
		['bagaż', '+ 119 zł', T(25, 'bagaż')],
		['wybór miejsca', '+ 39 zł', T(25, 'miejsca')],
	] as const;
	const total = 99 + (f >= fees[0][2] ? 29 : 0) + (f >= fees[1][2] ? 119 : 0) + (f >= fees[2][2] ? 39 : 0);
	return (
		<g>
			<G x={620} y={420} s={pk(f, T(25, 'bilet') - 6)} r={-4}>
				<Rough shape={{t: 'rect', x: -260, y: -130, w: 520, h: 260}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={1940} />
				<Txt text="bilet lotniczy" x={0} y={-50} size={60} seed={1941} />
				<Txt text="99 zł" x={0} y={70} size={110} color={SC[3]} seed={1942} />
			</G>
			{fees.map(([n, p, t], k) =>
				f >= t - 4 ? (
					<G key={k} x={1240} y={300 + k * 170} s={pk(f, t - 4)} r={(k - 1) * 4}>
						<Rough shape={{t: 'rect', x: -260, y: -60, w: 520, h: 120}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 9, strokeWidth: 6}} seed={1943 + k} />
						<Txt text={`${n} ${p}`} x={0} y={18} size={54} seed={1946 + k} />
					</G>
				) : null,
			)}
			{f >= fees[0][2] && <Txt text={`razem: ${total} zł`} x={620} y={720} size={90} color={C.red} seed={1950} />}
			{f >= T(26, 'decyzji') && <Txt text="wszystko po decyzji" x={960} y={920} size={80} draw={prog(f, T(26, 'decyzji') - 4, 12)} seed={1951} />}
		</g>
	);
};

// ---------- pokój 7: jak to rozpoznać ----------
const R7: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const q = T(27, 'rozpoznać');
	const b = T(28);
	const ahaEnd = T(28, 'zapytaj') - 2;
	const doc = prog(f, T(28, 'zapytaj') - 4, 12);
	const er = prog(f, T(28, 'pierwsza') - 4, 14);
	const leave = f >= T(29, 'wycofać') ? f - T(29, 'wycofać') : -1;
	const loose = 1 - prog(f, T(30, 'innej') - 2, 22);
	const showHero = f < q - 2 || f > ahaEnd;
	const hx0 = pv(v, 1100, 1100);
	const hx = leave >= 0 ? hx0 + Math.min(leave, 40) * 6 : hx0;
	const ballDown = leave >= 0;
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<G x={pv(v, 1500, 1420)} y={FL} o={prog(f, T(29) - 6, 10)}>
				<Door w={200} h={420} label="wyjście" labelSize={44} open={prog(f, T(29, 'wycofać'), 10) * 0.8} seed={1960} />
			</G>
			{showHero && (
				<Hero x={hx} y={FL} s={1.25} seed={540} bend={ballDown ? 0 : 0.9} arms={ballDown ? 'down' : 'hold'} walk={leave >= 0 && leave < 40 ? f : undefined} mood={ballDown ? 'smile' : 'worry'} strings={[{c: RD, at: 'r', p: loose, slack: prog(f, T(30) - 4, 10)}]} />
			)}
			{showHero && (
				<G x={ballDown ? hx0 + 40 : hx + 60} y={ballDown ? FL - 80 : FL - 130}>
					<Ball heavy={1} />
				</G>
			)}
			<Aha x={hx0} y={FL} s={1.25} a={q} b={b} until={ahaEnd} />
			{doc > 0 && (
				<G x={pv(v, 560, 680)} y={pv(v, 450, 380)} s={doc} r={-5}>
					<Rough shape={{t: 'rect', x: -170, y: -200, w: 340, h: 400}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={1961} />
					<Txt text="umowa" x={0} y={-120} size={70} seed={1962} />
					<Txt text="39 900 zł" x={0} y={-10} size={64} seed={1963} />
					<Txt text="+ 3000 zł" x={0} y={80} size={64} color={C.red} seed={1964} />
					<Scribble x={-150} y={30} w={300} h={80} draw={er} seed={1965} />
					{f >= T(28, 'oferta') && <Txt text="pierwsza oferta?" x={0} y={170} size={46} color={GREY} draw={prog(f, T(28, 'oferta'), 10)} seed={1966} />}
				</G>
			)}
			{f >= T(30, 'innej') && (
				<G x={960} y={pv(v, 160, 1010)} s={pk(f, T(30, 'innej'))}>
					<Txt text="to była inna umowa" x={0} y={0} size={pv(v, 90, 70)} color={C.red} seed={1967} />
				</G>
			)}
		</g>
	);
};

// ---------- montaż ----------
const SHOTS = (v: boolean): Shot[] => [
	[0, 0, [0, 0, 1.0], [0, 40, 1.0]],
	[T(1, 'usłyszysz') + 14, 0, [-200, 0, 1.12], [0, -80, 1.06], 16],
	[T(2), 1, [0, -20, 1.0], [0, 0, 1.0], 14],
	[T(4, 'idzie') + 20, 1, [-260, 0, 1.0], [-40, 0, 1.0], 26],
	[T(5) - 4, 1, [0, -20, 1.0], [0, 0, 1.0], 16],
	[T(6, 'widzisz') + 10, 1, [200, -60, 1.1], [120, -40, 1.04], 20],
	[T(7) + 4, 2, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(11) + 4, 3, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(16) + 4, 4, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(20) + 4, 5, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(22, 'gorsze') + 4, 5, [160, 60, 1.12], [80, 60, 1.06], 14],
	[T(23) + 4, 5, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(25) + 4, 6, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(27) + 2, 7, [0, 0, 1.0], [0, 0, 1.0], 14],
];
const ROOMS: [number, number, React.FC<{f: number; v: boolean}>][] = [
	[0, T(2), R0],
	[T(2) - 14, T(7), R1],
	[T(7) - 14, T(11), R2],
	[T(11) - 14, T(16), R3],
	[T(16) - 14, T(20), R4],
	[T(20) - 14, T(25), R5],
	[T(25) - 14, T(27), ({f}) => <R6 f={f} />],
	[T(27) - 14, 99999, R7],
];
const HITS = [T(1, 'usłyszysz') + 10, T(3, 'uścisk'), T(5, '3000'), T(7, '1978'), T(10, '31%'), T(12, 'o 7:00'), T(15, '56%'), T(19, 'dwa'), T(22, 'gorsze'), T(27, 'rozpoznać'), T(30, 'innej')].map((t) => [t, 0.75] as [number, number]);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => (
	<Stage v={v} lines={LINES} vo="mp5_vo.wav" keys={shots(v, SHOTS(v))} hits={hitsAt(HITS)} head={<VHead i={4} />}>
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

export const ManipS5: React.FC = () => (
	<WithCard card={<TrickCard i={4} />}>
		<Scene />
	</WithCard>
);
export const S5_KEEP = keepFrom(LINES, [25, 26], null, S5_FRAMES);
export const S5S_SCENE = keepLen(S5_KEEP);
export const ManipS5S: React.FC = () => (
	<ShortWithCta sceneFrames={S5S_SCENE} i={4}>
		<CutShort keep={S5_KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
