// Manipulacja 2: drzwi zatrzaśnięte przed nosem (ustępstwo + kontrast). Film 16:9 + short 9:16.
import React from 'react';
import {LINES} from './mp2.gen';
import {
	C, Rough, Txt, G, makeT, ip, pk, swing, prog, EIN, pv, on, shots, hitsAt, Stage, VHead, WithCard, TrickCard, Hero, Other, Aha, Scribble,
	ExpCard, MarkTitle, Door, Calendar, Bar, Gift, Arrow, Stamp, Dust, Say, Bus, Check, Floor, PriceTag,
	CutShort, keepFrom, keepLen, ShortWithCta, RW, SC, GREY, LIGHT, FPS, type Shot,
} from './mkit';

const T = makeT(LINES);
export const S2_FRAMES = Math.round((LINES[LINES.length - 1].e + 1.0) * FPS);
const B = SC[1];
const FL = 900;

// Duże drzwi z małymi drzwiczkami: slam = klatka trzaśnięcia, small = otwarcie małych.
const BigDoor: React.FC<{f: number; slam: number; small: number; open0?: number; label?: string; smallLabel?: string; w?: number; h?: number}> = ({f, slam, small, open0 = 0.8, label = '1000 zł', smallLabel = '200 zł', w = 420, h = 640}) => {
	const open = f < slam - 5 ? open0 : ip(f, slam - 5, slam, open0, 0, EIN);
	const so = prog(f, small, 10);
	return (
		<g>
			<Door w={w} h={h} open={open} label={label} labelSize={96} seed={1100} />
			<g transform={`translate(${w * 0.12} 0)`}>
				<Rough shape={{t: 'rect', x: -20, y: -230, w: 150, h: 230}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 5}} draw={so > 0 ? 1 : 0} seed={1104} />
				{f >= slam && (
					<g transform={`translate(-20 0) scale(${Math.cos(so * 1.2)} 1)`}>
						<Rough shape={{t: 'rect', x: 0, y: -230, w: 150, h: 230}} o={{fill: LIGHT, fillStyle: 'solid', strokeWidth: 6}} seed={1105} />
						{so < 0.5 && <Txt text={smallLabel} x={75} y={-110} size={50} color={C.red} seed={1106} />}
					</g>
				)}
			</g>
			<g transform="translate(0 0)">
				<Dust f={f} a={slam} w={w} />
			</g>
		</g>
	);
};

// ---------- pokój 0: drzwi i rozmowa o pożyczce ----------
const R0: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const slam = T(0, 'absurdalnego') + 4;
	const small = T(1, 'nadchodzi');
	const dx = pv(v, 820, 800);
	const hx = pv(v, 1340, 1260);
	return (
		<g>
			<Floor x0={320} x1={1640} y={FL} />
			<G x={dx} y={FL}>
				<BigDoor f={f} slam={slam} small={small} />
			</G>
			{f >= small + 4 && (
				<G x={dx + 160} y={FL - 120} s={0.8} r={swing(f, small + 4, 10)}>
					<g transform="scale(-1 1)">
						<Rough shape={{t: 'path', d: 'M -120 -30 L -10 -40 C 30 -44 50 -36 70 -30 C 96 -24 96 -8 70 -8 L 30 -10 C 40 0 44 18 30 24 L -10 30 L -120 30'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={prog(f, small + 4, 8)} seed={1110} />
					</g>
				</G>
			)}
			<Hero
				x={hx}
				y={FL}
				s={1.3}
				seed={540}
				look={f >= T(3) && f < T(4) ? Math.sin((f - T(3)) * 1.1) : -1}
				lean={f >= slam && f < slam + 14 ? -10 * (1 - (f - slam) / 14) : 0}
				mood={f >= slam && f < T(2) ? 'wow' : f >= T(4) ? 'flat' : 'flat'}
				arms={f >= T(3) && f < T(4) ? 'shrug' : 'down'}
			/>
			<Say x={pv(v, 560, 820)} y={pv(v, 170, 150)} text="Pożyczysz mi 1000 zł?" size={pv(v, 58, 52)} tx={pv(v, 260, 80)} ty={170} draw={prog(f, T(2) - 4, 10)} o={1 - prog(f, T(4) - 6, 6)} seed={1112} />
			<Say x={hx + 40} y={FL - 470} text="Nie." size={70} tx={-40} ty={100} draw={prog(f, T(3) - 2, 8)} o={1 - prog(f, T(4) + 4, 8)} seed={1115} />
			<Say x={pv(v, 600, 860)} y={pv(v, 170, 150)} text="No dobrze, to chociaż 200?" size={pv(v, 54, 46)} tx={pv(v, 260, 40)} ty={170} draw={prog(f, T(4) - 2, 10)} seed={1118} />
		</g>
	);
};

// ---------- pokój 1: porównanie długości ----------
const R1: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const x0 = pv(v, 410, 470);
	const l1 = pv(v, 1100, 980);
	const b1 = prog(f, T(5) - 8, 16);
	const b2 = prog(f, T(5, '200') - 4, 12);
	const squeeze = 1 - 0.25 * prog(f, T(5, 'rozsądnie') - 4, 10);
	const erase = prog(f, T(6, 'zaczął') - 4, 12);
	const no = f >= T(6, 'odmówił');
	return (
		<g>
			<g opacity={1 - prog(f, T(6, 'zaczął') + 10, 10)}>
				<Rough shape={{t: 'rect', x: x0, y: 330, w: l1 * b1, h: 90}} o={{fill: C.red, fillStyle: 'hachure', hachureGap: 10, strokeWidth: 6}} seed={1120} />
				<Txt text="1000 zł" x={x0} y={300} size={80} anchor="start" draw={b1} seed={1121} />
				<Scribble x={x0} y={320} w={l1} h={110} draw={erase} seed={1122} />
			</g>
			<g transform={`translate(${x0} 640) scale(${squeeze} 1)`}>
				<Rough shape={{t: 'rect', x: 0, y: 0, w: l1 * 0.2 * b2, h: 90}} o={{fill: SC[3], fillStyle: 'hachure', hachureGap: 10, strokeWidth: 6}} seed={1123} />
			</g>
			<Txt text="200 zł" x={x0} y={610} size={80} anchor="start" draw={b2} seed={1124} />
			{f >= T(5, 'rozsądnie') && !no && <Txt text="„to tylko tyle”" x={x0 + l1 * 0.2 + 60} y={710} size={66} anchor="start" color={GREY} draw={prog(f, T(5, 'rozsądnie'), 12)} seed={1125} />}
			{no && (
				<G x={x0 + 560} y={690} s={pk(f, T(6, 'odmówił'))}>
					<Stamp text="NIE" />
				</G>
			)}
		</g>
	);
};

// ---------- pokój 2: badanie 1975, mała prośba, 17% ----------
const Kids: React.FC<{x: number; p: number}> = ({x, p}) => (
	<g opacity={p}>
		{[0, 1, 2, 3].map((k) => (
			<Other key={k} x={x + k * 70} y={FL} s={0.55} seed={1130 + k * 7} mood="smile" draw={p} />
		))}
	</g>
);
const R2: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const busP = ip(f, T(8, 'zoo') - 16, T(8, 'zoo') + 26, -0.2, 1.2);
	return (
		<g>
			<G x={960} y={250} s={0.85}>
				<ExpCard year="1975" who="Robert Cialdini i zespół" f={f} a={T(7, '1975')} out={T(8) - 4} />
			</G>
			<Floor x0={320} x1={1640} y={FL} />
			<Other x={pv(v, 560, 600)} y={FL} s={1.25} seed={1140} coat arms={f > T(8) ? 'point' : 'down'} mood="smile" draw={prog(f, T(7, 'zaczepiał') - 6, 14)} />
			<Other x={pv(v, 900, 900)} y={FL} s={1.2} seed={1150} hair="long" look={-1} flip draw={prog(f, T(7, 'studentów') - 4, 14)} arms={f >= T(9) ? 'shrug' : 'down'} mood={f >= T(9) ? 'flat' : 'flat'} />
			<Txt text="kampus" x={pv(v, 1500, 1300)} y={pv(v, 400, 1010)} size={60} color={GREY} draw={prog(f, T(7, 'kampusie'), 10)} seed={1151} />
			<Say x={pv(v, 720, 760)} y={pv(v, 330, 300)} text="jeden dzień w zoo?" size={60} tx={-130} ty={160} draw={prog(f, T(8, 'małą') - 2, 10)} o={1 - prog(f, T(9) + 30, 10)} seed={1152} />
			<Kids x={pv(v, 1100, 1060)} p={prog(f, T(8, 'młodzieży') - 2, 10) * (1 - prog(f, T(9) + 20, 10))} />
			{busP > -0.2 && busP < 1.2 && (
				<G x={300 + busP * 1400} y={FL + 6} r={Math.sin(f * 0.9) * 0.8}>
					<Bus w={440} />
				</G>
			)}
			<Bar x={pv(v, 1420, 1300)} base={FL} v={17} f={f} a={T(9, '17%')} w={150} hMax={600} under="od razu" />
		</g>
	);
};

// ---------- pokój 3 (+ [tylko film] trzecia grupa): wielka prośba, odmowa, 50% ----------
const R3: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const big = prog(f, T(10, 'ogromną') - 4, 12) * (1 - prog(f, T(12) - 2, 8));
	const weeks = Math.round(ip(f, T(11, 'dwa') - 6, T(11, 'lata') + 24, 1, 104));
	const flip = f >= T(11, 'dwa') - 6 && f < T(11, 'lata') + 24 ? (f % 4) / 4 : 0;
	const cal = prog(f, T(11) - 4, 10) * (1 - prog(f, T(12) + 6, 8));
	const slam = T(12) + 2;
	const third = prog(f, T(16) - 4, 12) * (1 - prog(f, T(21) - 12, 6));
	return (
		<g>
			<Floor x0={320} x1={1760} y={FL} />
			<Other x={pv(v, 520, 560)} y={FL} s={1.25} seed={1140} coat arms={f < T(12) ? 'point' : f >= T(13) && f < T(14) ? 'point' : 'down'} mood="smile" />
			<Other x={pv(v, 830, 820)} y={FL} s={1.2} seed={1150} hair="long" look={-1} flip mood={f >= T(11) && f < T(13) ? 'worry' : f >= T(14) ? 'smile' : 'flat'} arms={f >= T(14, 'połowa') ? 'up' : 'down'} />
			{big > 0 && (
				<G x={pv(v, 700, 720)} y={pv(v, 250, 230)} s={big}>
					<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 640, h: 210}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={1160} />
					<Txt text="opiekun młodzieży" x={0} y={-12} size={58} seed={1161} />
					<Txt text="2 h tygodniowo × 2 lata" x={0} y={58} size={52} color={C.red} draw={prog(f, T(11), 14)} seed={1162} />
				</G>
			)}
			{cal > 0 && (
				<G x={pv(v, 1120, 1100)} y={pv(v, 520, 500)} s={cal * 0.9} r={swing(f, T(11) - 4, 10)}>
					<Calendar top="tydzień" big={`${weeks}`} w={230} flip={flip} />
				</G>
			)}
			{f >= T(12) - 8 && f < T(13) + 20 && (
				<G x={pv(v, 1060, 1040)} y={FL} o={1 - prog(f, T(13) + 6, 10)}>
					<Door w={170} h={330} open={f < slam - 4 ? 0.9 : ip(f, slam - 4, slam, 0.9, 0, EIN)} seed={1165} />
					<Dust f={f} a={slam} w={170} />
				</G>
			)}
			<Say x={pv(v, 830, 820)} y={FL - 500} text="Nie!" size={70} tx={0} ty={110} draw={prog(f, T(12) - 2, 8)} o={1 - prog(f, T(13) - 2, 8)} seed={1166} />
			<Say x={pv(v, 620, 660)} y={pv(v, 280, 260)} text="to chociaż zoo?" size={58} tx={-90} ty={160} draw={prog(f, T(13, 'zoo') - 6, 10)} o={1 - prog(f, T(15) + 10, 10)} seed={1168} />
			{/* słupki */}
			<g opacity={prog(f, T(14) - 8, 10)}>
				<Bar x={pv(v, 1260, 1200)} base={FL} v={17} f={f} a={T(14) - 8} w={140} hMax={600} label="17%" under="od razu" />
			</g>
			<Bar x={pv(v, 1480, 1410)} base={FL} v={50} f={f} a={T(14, 'połowa')} w={140} hMax={600} under="po odmowie" />
			{f >= T(15, 'trzy') && (
				<G x={pv(v, 1430, 1300)} y={pv(v, 330, 300)} s={pk(f, T(15, 'trzy'))}>
					<Stamp text="× 3" />
				</G>
			)}
			{third > 0 && (
				<g opacity={third}>
					<Bar x={1720} base={FL} v={25} f={f} a={T(18, '25%')} w={140} hMax={600} color={LIGHT} />
					<Txt text="tylko słyszeli" x={1720} y={FL + 130} size={54} color={GREY} draw={prog(f, T(18, '25%'), 10)} seed={1172} />
					{f >= T(19, 'porównanie') && <Txt text="porównanie: trochę" x={1770} y={600} size={46} color={GREY} draw={prog(f, T(19, 'porównanie'), 12)} seed={1170} />}
					{f >= T(20, 'odmowa') && <Rough shape={{t: 'ellipse', cx: 1480, cy: FL - 170, w: 260, h: 460}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, T(20, 'odmowa'), 12)} seed={1171} />}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 4: schody ustępstw i kontrast ----------
const STEP = (k: number, v: boolean) => ({x: pv(v, 360, 440) + k * 220, y: 380 + k * 120});
const R4: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const st = prog(f, T(21) - 8, 16) * (1 - prog(f, T(26, 'kontrast') - 6, 10));
	const rStep = ip(f, T(22, 'ustąpił') - 4, T(22, 'ustąpił') + 14, 0, 1);
	const sStep = ip(f, T(25, 'ustępujemy') - 6, T(25, 'ustępujemy') + 12, 3, 4);
	const r0 = STEP(0, v);
	const r1 = STEP(1, v);
	const rx = r0.x + (r1.x - r0.x) * rStep + 110;
	const ry = r0.y + (r1.y - r0.y) * rStep;
	const s0 = STEP(Math.floor(sStep), v);
	const s1 = STEP(Math.ceil(sStep), v);
	const fr = sStep - Math.floor(sStep);
	const sx = s0.x + (s1.x - s0.x) * fr + 110;
	const sy = s0.y + (s1.y - s0.y) * fr;
	const lbl = f < T(23, 'jednego') ? '2 lata' : '1 dzień';
	const strip = prog(f, T(26, 'kontrast') - 2, 16);
	return (
		<g>
			{st > 0 && (
				<g opacity={st}>
					{[0, 1, 2, 3, 4].map((k) => {
						const p = STEP(k, v);
						return <Rough key={k} shape={{t: 'rect', x: p.x, y: p.y, w: 220, h: 1000 - p.y}} o={{fill: k % 2 ? LIGHT : C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={st} seed={1180 + k} />;
					})}
					<Other x={rx} y={ry} s={0.95} seed={1140} coat mood="smile" walk={rStep > 0 && rStep < 1 ? f : undefined} />
					<Other x={sx} y={sy} s={0.95} seed={1150} hair="long" look={-1} walk={fr > 0 && fr < 1 ? f : undefined} mood={f >= T(25) ? 'smile' : 'flat'} />
					<G x={rx} y={ry - 400} s={f >= T(23, 'jednego') ? pk(f, T(23, 'jednego')) : 1}>
						<Txt text={lbl} x={0} y={0} size={70} color={C.red} seed={1190} />
					</G>
					{f >= T(21) && f < T(22) + 10 && <Txt text="?" x={960} y={260} size={200} color={B} draw={prog(f, T(21), 8)} seed={1191} />}
					{f >= T(24, 'prezent') && f < T(26) && (
						<G x={(rx + sx) / 2} y={Math.min(ry, sy) - 200} s={0.5 * pk(f, T(24, 'prezent'))} r={swing(f, T(24, 'prezent'), 8)}>
							<Gift color={SC[0]} />
						</G>
					)}
					{f >= T(24, 'odwzajemnić') && f < T(26) && (
						<g>
							<Arrow x0={rx + 60} y0={ry - 330} x1={sx - 60} y1={sy - 330} bend={-0.3} draw={prog(f, T(24, 'odwzajemnić'), 12)} color={B} seed={1192} />
						</g>
					)}
				</g>
			)}
			{strip > 0 && (
				<g>
					<Rough shape={{t: 'rect', x: pv(v, 260, 460), y: 380, w: pv(v, 1400, 1000) * strip, h: 120}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, strokeWidth: 6}} seed={1195} />
					<Txt text="2 lata" x={pv(v, 260, 460)} y={340} size={84} anchor="start" draw={strip} seed={1196} />
					<Rough shape={{t: 'circle', cx: pv(v, 300, 500), cy: 700, d: 40}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 5}} draw={prog(f, T(26, 'dzień') - 4, 8)} seed={1197} />
					<Txt text="1 dzień" x={pv(v, 350, 550)} y={722} size={84} anchor="start" color={C.red} draw={prog(f, T(26, 'dzień'), 10)} seed={1198} />
					{f >= T(26, 'drobiazg') && <Txt text="= drobiazg" x={pv(v, 620, 820)} y={722} size={84} anchor="start" draw={prog(f, T(26, 'drobiazg'), 10)} seed={1199} />}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 5: nazwa sztuczki, sznurek ----------
const R5: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const slam = T(28, 'odmówić') + 2;
	const str = prog(f, T(27, 'nosem') + 4, 18);
	return (
		<g>
			<Floor x0={320} x1={1640} y={FL} />
			<G x={pv(v, 760, 780)} y={FL}>
				<BigDoor f={f} slam={slam} small={T(29, 'prosisz')} open0={0.7} label="" smallLabel="200 zł" />
			</G>
			{f >= T(28) && f < slam + 30 && <Txt text="NIE" x={pv(v, 1300, 1260)} y={430} size={110} color={C.red} draw={prog(f, slam - 2, 6)} seed={1200} />}
			<Hero x={pv(v, 1300, 1260)} y={FL} s={1.3} seed={540} look={-1} mood={f >= T(29, 'zależało') ? 'smile' : 'flat'} arms={f >= T(29, 'zależało') ? 'reach' : 'down'} flip strings={[{c: B, at: 'r', p: str}]} />
			<MarkTitle text="drzwi zatrzaśnięte przed nosem" x={960} y={150} f={f} a={T(27, 'drzwi')} size={pv(v, 104, 66)} />
		</g>
	);
};

// ---------- pokój 6 [tylko film]: powtórka 2020, zbiórka, cennik ----------
const R6: React.FC<{f: number}> = ({f}) => {
	const can = prog(f, T(31, 'zbiórce') - 4, 12);
	const list = (k: number) => prog(f, T(31, 'najdroższego') - 8 + k * 6, 10);
	return (
		<g>
			{f >= T(30, '2020') && (
				<G x={960} y={300} s={pk(f, T(30, '2020'))}>
					<Stamp text="POWTÓRZONE 2020" s={1.1} rot={-6} />
				</G>
			)}
			{f >= T(30, 'działał') && <Txt text="efekt nadal działał" x={960} y={470} size={70} draw={prog(f, T(30, 'działał'), 12)} seed={1210} />}
			<g opacity={prog(f, T(31) - 6, 10)}>
				<G x={440} y={900} s={can}>
					<Rough shape={{t: 'rect', x: -90, y: -220, w: 180, h: 220}} o={{fill: SC[4], fillStyle: 'hachure', hachureGap: 9, strokeWidth: 7}} seed={1211} />
					<Rough shape={{t: 'line', x1: -40, y1: -200, x2: 40, y2: -200}} o={{strokeWidth: 8}} seed={1212} />
					<G x={150} y={-260} r={8}>
						<PriceTag text="500 zł?" w={280} size={70} />
					</G>
				</G>
				{[
					['PREMIUM', '299 zł'],
					['STANDARD', '99 zł'],
					['BASIC', '49 zł'],
				].map(([n, p], k) => (
					<G key={k} x={1080 + k * 250} y={760} s={list(k)}>
						<Rough shape={{t: 'rect', x: -110, y: -200, w: 220, h: 260}} o={{fill: k === 0 ? C.yellow : C.paper, fillStyle: k === 0 ? 'hachure' : 'solid', strokeWidth: 6}} seed={1215 + k} />
						<Txt text={n} x={0} y={-120} size={46} seed={1218 + k} />
						<Txt text={p} x={0} y={-10} size={70} color={C.red} seed={1221 + k} />
					</G>
				))}
				{f >= T(31, 'najdroższego') && <Txt text="najpierw" x={1080} y={500} size={60} color={GREY} draw={prog(f, T(31, 'najdroższego'), 10)} seed={1224} />}
			</g>
		</g>
	);
};

// ---------- pokój 7: jak to rozpoznać ----------
const R7: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const q = T(32, 'rozpoznać');
	const b = T(33);
	const ahaEnd = T(34) - 4;
	const cards = prog(f, T(33, 'drugą') - 6, 12);
	const er = prog(f, T(33, 'pierwsza') - 2, 12);
	const mid = ip(f, T(34) - 6, T(34) + 10, 0, 1);
	const yes = prog(f, T(35, 'pożycz') - 6, 10);
	const no = prog(f, T(36, 'nie') - 2, 10);
	const loose = 1 - prog(f, T(36, 'zmieniać') + 2, 22);
	const showHero = f < q - 2 || f > ahaEnd;
	return (
		<g>
			<Floor x0={320} x1={1640} y={FL} />
			{showHero && <Hero x={960} y={FL} s={1.3} seed={540} mood={f >= T(35) ? 'smile' : 'flat'} arms={f >= T(34) && f < T(35) ? 'shrug' : 'down'} strings={[{c: B, at: 'r', p: loose, slack: prog(f, T(36) - 6, 12)}]} />}
			<Aha x={960} y={FL} s={1.3} a={q} b={b} until={ahaEnd} />
			{cards > 0 && (
				<g>
					<G x={pv(v, 560, 660)} y={pv(v, 300, 260)} s={cards} o={1 - prog(f, T(33, 'pierwsza') + 14, 8)}>
						<PriceTag text="1000 zł" w={300} size={80} />
						<Scribble x={-160} y={-90} w={320} h={180} draw={er} seed={1230} />
					</G>
					<G x={pv(v, 1360, 1260) + (960 - pv(v, 1360, 1260)) * mid} y={pv(v, 300, 260) - mid * 20} s={cards * (1 + mid * 0.25)}>
						<PriceTag text="200 zł?" w={320} size={80} />
					</G>
				</g>
			)}
			{yes > 0 && (
				<G x={pv(v, 560, 620)} y={620} o={yes}>
					<Check ok draw={yes} />
					<Txt text="tak → pożycz" x={0} y={120} size={60} seed={1232} />
				</G>
			)}
			{no > 0 && (
				<G x={pv(v, 1360, 1300)} y={620} o={no}>
					<Check ok={false} draw={no} />
					<Txt text="nie → nie" x={0} y={120} size={60} seed={1233} />
				</G>
			)}
			{f >= T(36, 'zmieniać') && (
				<G x={960} y={130} s={pk(f, T(36, 'zmieniać'))}>
					<Txt text="pierwsza prośba nic nie zmienia" x={0} y={0} size={pv(v, 70, 52)} color={C.red} seed={1234} />
				</G>
			)}
		</g>
	);
};

// ---------- montaż ----------
const SHOTS = (v: boolean): Shot[] => [
	[0, 0, [40, -40, 1.0], [40, 20, 1.0]],
	[T(1, 'nadchodzi') + 10, 0, [-60, 40, 1.14], [-60, 60, 1.08], 26],
	[T(2), 0, [0, -40, 1.0], [0, 0, 1.0], 14],
	[T(5) + 2, 1, [0, 0, 1.0], [0, 20, 1.0], 14],
	[T(7) + 4, 2, [0, -20, 1.0], [0, 0, 1.0], 14],
	[T(8, 'zoo') + 20, 2, [60, 40, 1.06], [60, 40, 1.0], 30],
	[T(10) + 2, 3, [-20, -20, 1.0], [-40, 0, 1.0], 14],
	[T(12) + 6, 3, [-60, 60, 1.1], [-40, 60, 1.06], 14],
	[T(14) - 2, 3, [100, 0, 1.0], [40, 0, 1.0], 14],
	[T(16) + 6, 3, [220, 0, 1.0], [40, 0, 1.0], 18],
	[T(21) + 4, 4, [0, 0, 1.0], [40, 40, 1.0], 14],
	[T(25, 'ustępujemy') + 8, 4, [60, 60, 1.08], [60, 60, 1.04], 24],
	[T(26, 'kontrast') + 4, 4, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(27) + 4, 5, [0, -20, 1.0], [0, 0, 1.0], 14],
	[T(29, 'zależało') + 6, 5, [0, 40, 1.08], [0, 40, 1.04], 20],
	[T(30) + 4, 6, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(32) + 2, 7, [0, 0, 1.0], [0, 0, 1.0], 14],
];
const ROOMS: [number, number, React.FC<{f: number; v: boolean}>][] = [
	[0, T(5), R0],
	[T(5) - 14, T(7), R1],
	[T(7) - 14, T(10), R2],
	[T(10) - 14, T(21), R3],
	[T(21) - 14, T(27), R4],
	[T(27) - 14, T(30), R5],
	[T(30) - 14, T(32), ({f}) => <R6 f={f} />],
	[T(32) - 14, 99999, R7],
];
const HITS = [T(0, 'absurdalnego') + 4, T(6, 'odmówił'), T(7, '1975'), T(12) + 2, T(14, 'połowa'), T(15, 'trzy'), T(26, 'drobiazg'), T(27, 'nosem'), T(28, 'odmówić') + 2, T(30, '2020'), T(32, 'rozpoznać')].map((t) => [t, 0.75] as [number, number]);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => (
	<Stage v={v} lines={LINES} vo="mp2_vo.wav" keys={shots(v, SHOTS(v))} hits={hitsAt(HITS)} head={<VHead i={1} />}>
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

export const ManipS2: React.FC = () => (
	<WithCard card={<TrickCard i={1} />}>
		<Scene />
	</WithCard>
);
export const S2_KEEP = keepFrom(LINES, [16, 17, 18, 19, 20, 30, 31], null, S2_FRAMES);
export const S2S_SCENE = keepLen(S2_KEEP);
export const ManipS2S: React.FC = () => (
	<ShortWithCta sceneFrames={S2S_SCENE} i={1}>
		<CutShort keep={S2_KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
