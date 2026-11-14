// Amber Gold, rozdział 6 „Rachunek”: wersja pozioma (AmberR6, z planszą) i pionowa (AmberS4 = short 4).
// Sala sądowa, kartki wyroku jak śnieg, miesiące czytania; 180 rozpraw i 730 świadków; żądanie 25 lat → 15 lat i 12,5 roku;
// oś czasu 2022 (utrzymane 15, 12,5 → 11,5) i 2024 (kasacja oddalona); waga: klienci kontra Skarb Państwa, 20 mln zł
// w pierwszej instancji, w 2025 wyrok zmieniony i pozew oddalony.
import React from 'react';
import {LINES} from './am6.gen';
import {
	AmberStage, WithCard, CardScene, ShortWithCta, makeT, endOf, ip, pk, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, Mini, Coin, FText, prog, Room, Plate, Columns, CTA_FRAMES,
} from './kit';
import {Calendar, Gavel, strike, FloorDeco, LAY, kk, type Lay} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R6_FRAMES = CARD + SCENE;
export const S4_FRAMES = SCENE + CTA_FRAMES;

const K = {
	czytanie: T(0, 'czytanie'),
	trwalo: T(0, 'trwało'),
	mies5: T(0, '5'),
	l1: T(1),
	y2016: T(1, '2016'),
	l2: T(2),
	r180: T(2, '180'),
	rozpraw: T(2, 'rozpraw'),
	s730: T(2, '730'),
	swiadkow: T(2, 'świadków'),
	l3: T(3),
	zadala: T(3, 'żądała'),
	l25: T(3, '25'),
	marcina: T(3, 'marcina'),
	katarzyny: T(3, 'katarzyny'),
	l4: T(4),
	skazal: T(4, 'skazał'),
	l15: T(4, '15'),
	l125: T(4, '12,5'),
	l5: T(5),
	y2022: T(5, '2022'),
	apel: T(5, 'apelacyjny'),
	utrzymal: T(5, 'utrzymał'),
	l6: T(6),
	obnizyl: T(6, 'obniżył'),
	l115: T(6, '11,5'),
	l7: T(7),
	y2024: T(7, '2024'),
	najwyzszy: T(7, 'najwyższy'),
	oddalil7: T(7, 'oddalił'),
	kasacje: T(7, 'kasację'),
	l8: T(8),
	l9: T(9),
	k200: T(9, '200'),
	pozwalo: T(9, 'pozwało'),
	skarb: T(9, 'skarb'),
	pozno: T(9, 'późno'),
	l10: T(10),
	przyznal: T(10, 'przyznał'),
	m20: T(10, '20'),
	l11: T(11),
	y2025: T(11, '2025'),
	zmienil: T(11, 'zmienił'),
	oddalil: T(11, 'oddalił'),
	calosci: T(11, 'całości'),
	end: endOf(LINES),
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, -20, 1.08], [0, 0, 1.04]),
	kk(v, K.mies5 + 6, 0, [0, 0, 1], [0, 0, 1]),
	kk(v, K.l2 + 10, 0, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l3 - 12, 0, [0, 0, 1.03], [0, 0, 1.03]),
	kk(v, K.l3 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.katarzyny + 6, 1, [100, 0, 1.06], [0, 0, 1.04]),
	kk(v, K.l125 + 10, 1, [80, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.l5 - 12, 1, [0, 0, 1.03], [0, 0, 1.03]),
	kk(v, K.l5 + 14, 2, [0, 0, 1], [0, 0, 1]),
	kk(v, K.l115 + 10, 2, [-60, 0, 1.06], [0, 0, 1.04]),
	kk(v, K.kasacje + 10, 2, [80, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.l8 - 12, 2, [0, 0, 1.03], [0, 0, 1.03]),
	kk(v, K.l8 + 14, 3, [0, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.l9 + 20, 3, [0, 0, 1], [0, 0, 1]),
	kk(v, K.m20 + 10, 3, [-80, 0, 1.06], [0, 0, 1.04]),
	kk(v, K.zmienil + 6, 3, [60, 0, 1.06], [0, 0, 1.04]),
	kk(v, SCENE, 3, [0, 0, 1.03], [0, 0, 1.03]),
];
const DIPS: [number, number, number][] = [K.l3, K.l5, K.l8].map((b) => [b - 12, b + 14, 0.12]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.mies5), kind: 'punch', amp: 0.5},
	{t: s(K.r180), kind: 'punch', amp: 0.4},
	{t: s(K.s730), kind: 'punch', amp: 0.4},
	{t: s(K.l25), kind: 'both', amp: 0.7},
	{t: s(K.skazal), kind: 'both', amp: 0.8},
	{t: s(K.y2022), kind: 'punch', amp: 0.4},
	{t: s(K.l115), kind: 'punch', amp: 0.5},
	{t: s(K.oddalil7 + 4), kind: 'both', amp: 0.7},
	{t: s(K.l8), kind: 'punch', amp: 0.5},
	{t: s(K.m20), kind: 'both', amp: 0.7},
	{t: s(K.zmienil), kind: 'both', amp: 0.8},
	{t: s(K.oddalil + 4), kind: 'both', amp: 0.7},
];

// --- rekwizyty ---
// Postać w todze (kołnierz: sędzia fioletowy, prokurator czerwony).
const Robe: React.FC<{collar: string; hair: string; arm?: number; seed?: number; mood?: 'neutral' | 'smile' | 'sad'}> = ({collar, hair, arm = 15, seed = 0, mood = 'neutral'}) => (
	<g>
		<Adult look={{suit: '#151C28', hair, shirt: P.white, tie: collar, hairStyle: 'side'}} mood={mood} armR={arm} seed={seed} />
		<path d="M -66 -360 L 66 -360 L 50 -318 L -50 -318 Z" fill={collar} stroke={P.navy} strokeWidth={4} />
	</g>
);
const Board: React.FC<{text: string; flip: number; next?: string; name: string; w?: number}> = ({text, flip, next, name, w = 300}) => {
	const sx = Math.abs(Math.cos(flip * Math.PI));
	const show = flip >= 0.5 && next ? next : text;
	return (
		<g>
			<g transform={`scale(1 ${Math.max(0.05, sx)})`}>
				<rect x={-w / 2} y={-56} width={w} height={112} rx={14} fill={P.navy} stroke={P.navy} strokeWidth={6} />
				<FText text={show} x={0} y={22} size={64} fill={flip >= 0.5 && next ? P.gold : P.red} />
			</g>
			<FText text={name} x={0} y={100} size={38} fill={P.navy} stroke={P.bg} sw={8} />
		</g>
	);
};
const StampMark: React.FC<{text: string; on: number; c?: string; w?: number}> = ({text, on, c = P.red, w = 360}) =>
	on > 0 ? (
		<g transform={`rotate(-10) scale(${1 + (1 - on) * 0.8})`} opacity={on}>
			<rect x={-w / 2} y={-44} width={w} height={88} rx={10} fill={P.white} fillOpacity={0.6} stroke={c} strokeWidth={8} />
			<FText text={text} x={0} y={18} size={Math.min(58, (w - 30) / (0.6 * text.length))} fill={c} />
		</g>
	) : null;
const Doc: React.FC<{title: string; sub?: string; w?: number}> = ({title, sub, w = 220}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.65} width={w} height={w * 1.3} rx={12} fill={P.paper} stroke={P.navy} strokeWidth={6} />
		<FText text={title} x={0} y={-w * 0.38} size={w * 0.17} fill={P.navy} />
		{sub && <FText text={sub} x={0} y={-w * 0.22} size={w * 0.09} fill={P.slate} />}
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={-w * 0.32} x2={w * 0.32} y1={-w * 0.05 + i * w * 0.15} y2={-w * 0.05 + i * w * 0.15} stroke={P.grey} strokeWidth={8} strokeLinecap="round" />
		))}
	</g>
);
const Witness: React.FC<{c: string}> = ({c}) => (
	<g>
		<circle cy={-34} r={11} fill={P.skin} stroke={P.navy} strokeWidth={3} />
		<path d="M -14 0 L -14 -18 Q -14 -24 -8 -24 L 8 -24 Q 14 -24 14 -18 L 14 0 Z" fill={c} stroke={P.navy} strokeWidth={3} />
	</g>
);

// --- 0: sala sądowa ---
const Court: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const benchTop = v ? 860 : 480;
	const benchX = v ? [140, 940] : [560, 1360];
	const judgeY = v ? 1030 : 700;
	const dim = ip(f, K.l2 - 4, K.l2 + 10, 1, 0.3, EIO);
	const months = ['maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik'];
	const mi = Math.min(5, Math.max(0, Math.floor((f - K.czytanie + 4) / 8)));
	const calText = f >= K.l1 ? 'marzec' : months[mi];
	const cal = v ? {x: 190, y: 330, w: 230} : {x: 230, y: 230, w: 250};
	const plate5 = v ? {x: 700, y: 330} : {x: 1620, y: 220};
	const blocks = v ? [{x0: 120, y0: 420, cols: 10, rows: 8, dx: 84, dy: 62}] : [{x0: 90, y0: 380, cols: 6, rows: 7, dx: 76, dy: 58}, {x0: 1410, y0: 380, cols: 6, rows: 6, dx: 76, dy: 58}];
	let wi = 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E3D6C2" />
			<FloorDeco l={l} />
			<g opacity={dim}>
				{/* boazeria */}
				<rect x={benchX[0] - 60} y={v ? 470 : 110} width={benchX[1] - benchX[0] + 120} height={v ? 420 : 400} fill="#A9865E" stroke={P.navy} strokeWidth={6} />
				{Array.from({length: 6}).map((_, i) => (
					<rect key={i} x={benchX[0] - 30 + i * ((benchX[1] - benchX[0] + 60) / 6)} y={v ? 500 : 140} width={(benchX[1] - benchX[0] + 60) / 6 - 20} height={v ? 330 : 300} rx={8} fill="#B8966D" stroke={P.navy} strokeWidth={3} opacity={0.7} />
				))}
				<G x={cx} y={judgeY} s={v ? 1.05 : 1}>
					<Robe collar="#6B4A8C" hair="#B8B2A6" arm={f >= K.l2 ? 15 : 70} seed={21} />
				</G>
				{/* kartka w ręce sędziego */}
				{f < K.l2 && (
					<G x={cx + (v ? 200 : 190)} y={judgeY - (v ? 330 : 310)} r={-10 + Math.sin(f / 8) * 3}>
						<rect x={-50} y={-66} width={100} height={132} fill={P.white} stroke={P.navy} strokeWidth={4} />
						{[0, 1, 2, 3].map((i) => (
							<line key={i} x1={-34} x2={34} y1={-40 + i * 24} y2={-40 + i * 24} stroke={P.grey} strokeWidth={6} />
						))}
					</G>
				)}
				<rect x={benchX[0]} y={benchTop} width={benchX[1] - benchX[0]} height={FL - benchTop} fill="#8C6A4A" stroke={P.navy} strokeWidth={8} />
				<rect x={benchX[0] - 20} y={benchTop - 20} width={benchX[1] - benchX[0] + 40} height={30} rx={6} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
				<G x={benchX[1] - 120} y={benchTop - 30} s={0.8}>
					<Gavel ang={strike(f, [K.czytanie - 6])} />
				</G>
			</g>
			{/* kartki wyroku jak śnieg */}
			{f < K.l2 + 20 &&
				Array.from({length: 16}).map((_, i) => {
					const per = 70;
					const t = (((f + i * (per / 16)) % per) + per) % per / per;
					const x = (hsh(i) * 0.9 + 0.05) * W + Math.sin(f / 14 + i) * 40;
					const y = -80 + t * (FL + 40);
					return (
						<G key={i} x={x} y={y} r={Math.sin(f / 10 + i) * 30} o={(1 - prog(f, K.l2, 16)) * (t > 0.92 ? (1 - t) * 12 : 1)}>
							<rect x={-30} y={-40} width={60} height={80} fill={P.white} stroke={P.navy} strokeWidth={3} />
						</G>
					);
				})}
			{/* kalendarz miesięcy czytania, potem marzec 2016 */}
			{f >= K.czytanie - 6 && f < K.l2 + 12 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.czytanie - 6) * (f >= K.l1 && f < K.l1 + 6 ? 1.1 : 1)} r={-4} o={1 - prog(f, K.l2 + 2, 10)}>
					<Calendar text={calText} top={f >= K.l1 ? '2016' : undefined} w={cal.w} />
				</G>
			)}
			{f >= K.mies5 - 2 && f < K.l1 + 10 && (
				<G x={plate5.x} y={plate5.y} s={pk(f, K.mies5 - 2)} o={1 - prog(f, K.l1, 8)}>
					<Plate text="prawie 5 mies." label="czytanie wyroku" w={v ? 420 : 460} size={66} />
				</G>
			)}
			{f >= K.y2016 - 2 && f < K.l2 + 12 && (
				<G x={plate5.x} y={plate5.y} s={pk(f, K.y2016 - 2)} o={1 - prog(f, K.l2 + 2, 10)}>
					<Plate text="start procesu" label="marzec 2016" w={v ? 420 : 460} size={60} fill={P.gold} color={P.navy} />
				</G>
			)}
			{/* 180 rozpraw, 730 świadków */}
			{f >= K.r180 - 2 && (
				<G x={v ? 290 : 430} y={v ? 250 : 150} s={pk(f, K.r180 - 2)}>
					<Plate text={`${Math.round(ip(f, K.r180, K.rozpraw + 10, 0, 180, EOUT))}`} label="rozpraw (ponad)" w={v ? 380 : 420} size={84} />
				</G>
			)}
			{f >= K.s730 - 2 && (
				<G x={v ? 790 : 1490} y={v ? 250 : 150} s={pk(f, K.s730 - 2)}>
					<Plate text={`${Math.round(ip(f, K.s730, K.swiadkow + 16, 0, 730, EOUT))}`} label="świadków (blisko)" w={v ? 380 : 420} size={84} fill={P.red} color={P.white} />
				</G>
			)}
			{f >= K.s730 - 4 &&
				blocks.map((b, bi) =>
					Array.from({length: b.cols * b.rows}).map((_, k) => {
						const idx = wi++;
						if (idx >= 73) return null;
						const a = ip(f, K.s730 - 4 + idx * 0.6, K.s730 + 6 + idx * 0.6, 0, 1, EBACK);
						if (a <= 0) return null;
						return (
							<G key={`${bi}-${k}`} x={b.x0 + (k % b.cols) * b.dx + b.dx / 2} y={b.y0 + Math.floor(k / b.cols) * b.dy + b.dy} s={a * (v ? 1.3 : 1.15)}>
								<Witness c={['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#9C5A40'][idx % 6]} />
							</G>
						);
					}),
				)}
			{f >= K.swiadkow && (
				<FText text="1 postać = 10 świadków" x={v ? 540 : 960} y={v ? 1100 : 780} size={v ? 34 : 34} fill={P.slate} stroke={P.bg} sw={8} opacity={prog(f, K.swiadkow, 8)} />
			)}
		</g>
	);
};

// --- 1: żądanie 25 lat i wyrok ---
const Sentence: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const pros = v ? {x: 190, s: 0.92} : {x: 330, s: 1.05};
	const def = v ? [{x: 520, s: 1.55}, {x: 830, s: 1.55}] : [{x: 1080, s: 1.7}, {x: 1530, s: 1.7}];
	const boardY = v ? 560 : 250;
	const flipM = ip(f, K.l15 - 4, K.l15 + 4, 0, 1, EIO);
	const flipK = ip(f, K.l125 - 4, K.l125 + 4, 0, 1, EIO);
	const stand = ip(f, K.l3 - 4, K.l3 + 10, 0, 1, EBACK);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E3D6C2" />
			<FloorDeco l={l} />
			<G x={pros.x} y={FL} s={pros.s * stand}>
				<Robe collar={P.red} hair="#3B2A20" arm={f >= K.zadala && f < K.l4 ? 120 : 20} seed={33} />
			</G>
			{f >= K.l3 && (
				<G x={pros.x} y={FL - (v ? 560 : 640)} s={pk(f, K.l3 + 2)} o={1 - prog(f, K.l4, 8)}>
					<rect x={-150} y={-38} width={300} height={70} rx={14} fill={P.red} />
					<FText text="prokuratura" x={0} y={10} size={36} fill={P.white} />
				</G>
			)}
			{def.map((d, i) => (
				<G key={i} x={d.x} y={FL} s={d.s * ip(f, (i ? K.katarzyny : K.marcina) - 8, (i ? K.katarzyny : K.marcina) + 6, 0, 1, EBACK)}>
					<Mini suit="#0E1520" hair="#0E1520" skin="#0E1520" />
				</G>
			))}
			{def.map((d, i) => {
				const at = i ? K.katarzyny : K.marcina;
				if (f < at - 4) return null;
				return (
					<G key={`b${i}`} x={d.x} y={boardY} s={pk(f, at - 4)}>
						<Board text={f >= K.l25 ? '25 lat' : '?'} flip={i ? flipK : flipM} next={i ? '12,5 roku' : '15 lat'} name={i ? 'Katarzyna P.' : 'Marcin P.'} w={v ? 290 : 320} />
					</G>
				);
			})}
			{f >= K.l4 - 6 && (
				<G x={v ? 540 : 700} y={v ? 300 : 260} s={(v ? 1.1 : 1) * pk(f, K.l4 - 6)}>
					<Gavel ang={strike(f, [K.skazal])} />
					<FText text="sąd okręgowy" x={-100} y={90} size={v ? 40 : 38} fill={P.navy} stroke={P.bg} sw={8} />
				</G>
			)}
		</g>
	);
};

// --- 2: oś czasu 2022 / 2024 ---
const Timeline: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const ty = v ? 330 : 300;
	const x0 = v ? 110 : 200;
	const x1 = v ? 970 : 1720;
	const years = [2016, 2019, 2022, 2024, 2025];
	const yx = (y: number) => x0 + ((y - 2016) / 9) * (x1 - x0);
	const pinYear = f < K.y2022 ? 2019 : f < K.y2024 ? 2019 + 3 * ip(f, K.y2022 - 6, K.y2022 + 6, 0, 1, EIO) : 2022 + 2 * ip(f, K.y2024 - 6, K.y2024 + 6, 0, 1, EIO);
	const boards = v ? [{x: 300, y: 700}, {x: 780, y: 700}] : [{x: 520, y: 600}, {x: 1000, y: 600}];
	const flipK = ip(f, K.l115 - 4, K.l115 + 4, 0, 1, EIO);
	const kas = v ? {x: 540, y: 960} : {x: 1520, y: 590};
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<line x1={x0} y1={ty} x2={x1} y2={ty} stroke={P.navy} strokeWidth={10} strokeLinecap="round" />
			{years.map((y) => (
				<g key={y}>
					<line x1={yx(y)} y1={ty - 20} x2={yx(y)} y2={ty + 20} stroke={P.navy} strokeWidth={6} />
					<FText text={String(y)} x={yx(y)} y={ty + 64} size={v ? 34 : 38} fill={P.navy} />
				</g>
			))}
			<G x={yx(pinYear)} y={ty - 24}>
				<path d="M 0 0 L -26 -40 Q -30 -80 0 -82 Q 30 -80 26 -40 Z" fill={P.red} stroke={P.navy} strokeWidth={5} />
				<circle cy={-56} r={10} fill={P.white} />
			</G>
			{f >= K.apel - 4 && (
				<G x={yx(2022)} y={ty - 150} s={pk(f, K.apel - 4)}>
					<rect x={-150} y={-36} width={300} height={66} rx={12} fill={P.navy} />
					<FText text="sąd apelacyjny" x={0} y={10} size={34} fill={P.gold} />
				</G>
			)}
			{f >= K.najwyzszy - 4 && (
				<G x={yx(2024) + (v ? -40 : 0)} y={ty - (v ? 230 : 150)} s={pk(f, K.najwyzszy - 4)}>
					<rect x={-160} y={-36} width={320} height={66} rx={12} fill={P.navy} />
					<FText text="Sąd Najwyższy" x={0} y={10} size={34} fill={P.gold} />
				</G>
			)}
			{boards.map((b, i) => (
				<G key={i} x={b.x} y={b.y} s={pk(f, K.l5 - 6 + i * 4)}>
					<Board text={i ? '12,5 roku' : '15 lat'} flip={i ? flipK : 0} next={i ? '11,5 roku' : undefined} name={i ? 'Katarzyna P.' : 'Marcin P.'} w={v ? 290 : 320} />
				</G>
			))}
			{f >= K.utrzymal - 2 && (
				<G x={boards[0].x + (v ? 110 : 140)} y={boards[0].y - 80} s={pk(f, K.utrzymal - 2)}>
					<circle r={36} fill="#3E7D4F" stroke={P.navy} strokeWidth={5} />
					<path d="M -16 0 L -4 14 L 18 -12" fill="none" stroke={P.white} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
				</G>
			)}
			{f >= K.obnizyl - 2 && (
				<G x={boards[1].x + (v ? 120 : 150)} y={boards[1].y - 80} s={pk(f, K.obnizyl - 2)}>
					<circle r={36} fill={P.gold} stroke={P.navy} strokeWidth={5} />
					<path d="M 0 -16 L 0 14 M -12 2 L 0 16 L 12 2" fill="none" stroke={P.navy} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
				</G>
			)}
			{f >= K.l7 + 4 && (
				<G x={kas.x} y={kas.y} s={pk(f, K.l7 + 4) * (v ? 0.85 : 1)} r={4}>
					<Doc title="KASACJA" sub="obrona Marcina P." w={220} />
					<StampMark text="ODDALONO" on={ip(f, K.oddalil7, K.oddalil7 + 5, 0, 1, EOUT)} w={300} />
				</G>
			)}
		</g>
	);
};

// --- 3: waga: klienci kontra Skarb Państwa ---
const Scales: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const pv = v ? {x: 540, y: 470} : {x: 960, y: 230};
	const L = v ? 360 : 560;
	const hang = v ? 270 : 300;
	const build = ip(f, K.l9 - 6, K.l9 + 14, 0, 1, EBACK);
	const th = ip(f, K.przyznal - 2, K.przyznal + 16, 0, -9, EBACK) + ip(f, K.zmienil - 2, K.zmienil + 18, 0, 18, EBACK);
	const r = (th * Math.PI) / 180;
	const Lp = {x: pv.x - L * Math.cos(r), y: pv.y - L * Math.sin(r) + hang};
	const Rp = {x: pv.x + L * Math.cos(r), y: pv.y + L * Math.sin(r) + hang};
	const coinsIn = (i: number) => ip(f, K.przyznal + 4 + i * 3, K.przyznal + 16 + i * 3, 0, 1, EIN);
	const moveP = (i: number) => ip(f, K.zmienil + 6 + i * 2, K.zmienil + 22 + i * 2, 0, 1, EIO);
	const q = pk(f, K.l8);
	const pozew = ip(f, K.pozwalo - 2, K.skarb + 10, 0, 1, EIO);
	const cal = v ? {x: 190, y: 250} : {x: 230, y: 200};
	const plate = v ? {x: 760, y: 250} : {x: 960, y: 640};
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* „A państwo?” */}
			{f < K.l9 + 10 && (
				<g opacity={1 - prog(f, K.l9, 10)}>
					<G x={pv.x} y={v ? 900 : 640} s={pk(f, K.l8 - 6) * 1.1}>
						<Columns w={360} h={280} label="SKARB PAŃSTWA" labelSize={40} fill={P.goldLight} />
					</G>
					<G x={pv.x + (v ? 250 : 300)} y={v ? 520 : 240} s={q}>
						<circle r={90} fill={P.white} stroke={P.navy} strokeWidth={8} />
						<FText text="?" x={0} y={46} size={140} fill={P.red} />
					</G>
				</g>
			)}
			{build > 0 && (
				<g>
					{/* słup i belka */}
					<rect x={pv.x - 16} y={pv.y} width={32} height={FL - pv.y} fill="#8C7A5E" stroke={P.navy} strokeWidth={6} opacity={build} />
					<path d={`M ${pv.x - 140} ${FL} L ${pv.x + 140} ${FL} L ${pv.x + 90} ${FL - 40} L ${pv.x - 90} ${FL - 40} Z`} fill="#8C7A5E" stroke={P.navy} strokeWidth={6} />
					<g transform={`translate(${pv.x} ${pv.y}) rotate(${th}) scale(${build} 1)`}>
						<rect x={-L - 20} y={-12} width={2 * L + 40} height={24} rx={12} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					</g>
					<circle cx={pv.x} cy={pv.y} r={22} fill={P.goldDark} stroke={P.navy} strokeWidth={6} />
					{[Lp, Rp].map((p, i) => (
						<g key={i} opacity={build}>
							<line x1={p.x - (v ? 120 : 150)} y1={p.y} x2={p.x} y2={p.y - hang} stroke={P.navy} strokeWidth={4} />
							<line x1={p.x + (v ? 120 : 150)} y1={p.y} x2={p.x} y2={p.y - hang} stroke={P.navy} strokeWidth={4} />
							<path d={`M ${p.x - (v ? 140 : 170)} ${p.y} L ${p.x + (v ? 140 : 170)} ${p.y} Q ${p.x + (v ? 120 : 150)} ${p.y + 40} ${p.x} ${p.y + 44} Q ${p.x - (v ? 120 : 150)} ${p.y + 40} ${p.x - (v ? 140 : 170)} ${p.y} Z`} fill={P.gold} stroke={P.navy} strokeWidth={6} />
						</g>
					))}
					{/* klienci na lewej szalce */}
					{Array.from({length: 7}).map((_, i, arr) => {
						const n = arr.length;
						const a = ip(f, K.k200 - 6 + i * 2, K.k200 + 6 + i * 2, 0, 1, EBACK);
						const x = Lp.x - (v ? 105 : 130) + (i * (v ? 210 : 260)) / (n - 1);
						return (
							<G key={i} x={x} y={Lp.y - (i % 2) * 14} s={(v ? 0.66 : 0.78) * a}>
								<Mini suit={['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#9C5A40'][i % 6]} hair={['#2B2420', '#8A8A8A', '#A07850', '#3B2A20', '#6B4A2E', '#C2B8A8'][(i * 5) % 6]} up={f >= K.przyznal && f < K.zmienil ? 0.6 : 0} mood={f >= K.zmienil ? 'sad' : 'ok'} />
							</G>
						);
					})}
					<G x={Rp.x} y={Rp.y} s={v ? 0.62 : 0.72}>
						<Columns w={300} h={230} label="SKARB PAŃSTWA" labelSize={34} fill={P.goldLight} />
					</G>
					{f >= K.k200 && (
						<G x={Lp.x} y={Lp.y + (v ? 110 : 120)} s={pk(f, K.k200)}>
							<FText text="ponad 200 klientów" x={0} y={0} size={v ? 36 : 40} fill={P.navy} stroke={P.bg} sw={8} />
						</G>
					)}
					{/* monety */}
					{Array.from({length: 8}).map((_, i) => {
						const a = coinsIn(i);
						if (a <= 0) return null;
						const restL = {x: Lp.x - 90 + (i % 4) * 60, y: Lp.y - 20 - Math.floor(i / 4) * 30};
						const restR = {x: Rp.x - 90 + (i % 4) * 60, y: Rp.y - (v ? 190 : 210) - Math.floor(i / 4) * 30};
						const mp = moveP(i);
						const pos = mp > 0 ? arcPt(mp, restL.x, restL.y, restR.x, restR.y, 160) : {x: restL.x, y: restL.y - (1 - a) * 500};
						return (
							<G key={i} x={pos.x} y={pos.y} r={(1 - a) * 300 + mp * 360}>
								<Coin r={v ? 22 : 26} />
							</G>
						);
					})}
				</g>
			)}
			{/* pozew leci do państwa */}
			{pozew > 0 && (
				<G x={Lp.x + (Rp.x - Lp.x) * pozew} y={(1 - pozew) * (Lp.y - 260) + pozew * (Rp.y - (v ? 300 : 340)) - Math.sin(pozew * Math.PI) * 120} s={0.8} r={-6}>
					<Doc title="POZEW" w={170} />
					<StampMark text="ODDALONO" on={ip(f, K.oddalil, K.oddalil + 5, 0, 1, EOUT)} w={260} />
				</G>
			)}
			{f >= K.pozno - 6 && f < K.l10 + 6 && (
				<G x={Rp.x} y={v ? 520 : 250} s={pk(f, K.pozno - 6)} o={1 - prog(f, K.l10, 6)}>
					<circle r={60} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<line x1={0} y1={0} x2={0} y2={-40} stroke={P.navy} strokeWidth={7} strokeLinecap="round" transform={`rotate(${f * 12})`} />
					<line x1={0} y1={0} x2={28} y2={0} stroke={P.navy} strokeWidth={7} strokeLinecap="round" />
					<FText text="za późno?" x={0} y={110} size={40} fill={P.red} stroke={P.bg} sw={8} />
				</G>
			)}
			{f >= K.m20 - 2 && (
				<G x={plate.x} y={plate.y} s={pk(f, K.m20 - 2)} o={1 - prog(f, K.calosci - 14, 10)}>
					<Plate text="ponad 20 mln zł" label="I instancja przyznała" w={v ? 440 : 480} size={v ? 58 : 64} fill={P.gold} color={P.navy} />
				</G>
			)}
			{f >= K.l11 - 2 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.l11 - 2)} r={-4}>
					<Calendar text="sierpień" top="2025" w={v ? 220 : 230} />
				</G>
			)}
			{f >= K.zmienil - 14 && (
				<G x={v ? 540 : 960} y={v ? 300 : 130} s={(v ? 0.9 : 0.8) * pk(f, K.zmienil - 14)}>
					<Gavel ang={strike(f, [K.zmienil])} />
				</G>
			)}
			{f >= K.calosci - 2 && (
				<G x={pv.x} y={v ? 1060 : 760} s={pk(f, K.calosci - 2)}>
					<rect x={-300} y={-40} width={600} height={74} rx={14} fill={P.navy} />
					<FText text="pozew oddalony w całości" x={0} y={12} size={38} fill={P.gold} />
				</G>
			)}
		</g>
	);
};

const ROOMS = [Court, Sentence, Timeline, Scales];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const R6Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<AmberStage v={v} lines={LINES} vo="am6_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`am6c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.bg} />
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#am6c${v ? 'v' : 'h'})`}>
									<R f={f} l={l} />
								</g>
							</g>
						) : null,
					)}
				</g>
			)}
		</AmberStage>
	);
};

export const AmberR6: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 6" title="Rachunek" icon={<G y={-30}><Gavel ang={20} /></G>} frames={CARD} />}>
		<R6Scene />
	</WithCard>
);

export const AmberS4: React.FC = () => (
	<ShortWithCta sceneFrames={SCENE}>
		<R6Scene v />
	</ShortWithCta>
);
