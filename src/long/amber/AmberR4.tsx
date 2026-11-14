// Amber Gold, rozdział 4 „Linie lotnicze”: wersja pozioma (AmberR4, z planszą) i pionowa (AmberS3 = short 3).
// Papierowy samolot → prawdziwy ze sztabką na ogonie; Jet Air i Yes Airways przemalowane na OLT Express; mapa: Warszawa–Gdańsk,
// potem Europa z kaskadą tras; bilet 155 zł i kabina z 11% zajętych miejsc; stroje 2 mln zł i kartki po 600 tys. €;
// moneta Amber Gold dzieli się na trzy, jedna część odlatuje; tablica odlotów ODWOŁANY; 17 dni później spada szyld.
import React from 'react';
import {LINES} from './am4.gen';
import {COUNTRIES, POLAND, CITIES, EU_PTS, SOUTH_PTS} from './europe.gen';
import {
	AmberStage, WithCard, CardScene, ShortWithCta, makeT, endOf, ip, pk, swing, hsh, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, FText, clamp01, prog, Room, Plate, GoldBar, Plane, CTA_FRAMES,
} from './kit';
import {Calendar, fall, FloorDeco, LAY, kk, type Lay} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R4_FRAMES = CARD + SCENE;
export const S3_FRAMES = SCENE + CTA_FRAMES;

const K = {
	kupila: T(0, 'kupiła'),
	linie: T(0, 'linie'),
	l1: T(1),
	y2011: T(1, '2011'),
	wiekszosc: T(1, 'większość'),
	przew: T(1, 'przewoźniku'),
	jet: T(1, 'jet'),
	koniec: T(1, 'koniec'),
	yes: T(1, 'yes'),
	l2: T(2),
	marka: T(2, 'marka'),
	olt: T(2, 'olt'),
	l3: T(3),
	polecial: T(3, 'poleciał'),
	gdanska: T(3, 'gdańska'),
	l4: T(4),
	m38: T(4, '38'),
	m35: T(4, '35'),
	wakac: T(4, 'wakacyjnych'),
	l5: T(5),
	tanie: T(5, 'tanie'),
	c155: T(5, '155'),
	l6: T(6),
	mniejszymi: T(6, 'mniejszymi'),
	zajetych: T(6, 'zajętych'),
	p11: T(6, '11'),
	l7: T(7),
	stroje: T(7, 'stroje'),
	m2: T(7, '2'),
	l8: T(8),
	e600: T(8, '600'),
	mies: T(8, 'miesięcznie'),
	l9: T(9),
	lipca: T(9, 'lipca'),
	pochl: T(9, 'pochłonęły'),
	m300: T(9, '300'),
	l10: T(10),
	trzecia: T(10, 'trzecią'),
	l11: T(11),
	zawiesilo: T(11, 'zawiesiło'),
	loty: T(11, 'loty'),
	l12: T(12),
	utkneli: T(12, 'utknęli'),
	wracali: T(12, 'wracali'),
	lot: T(12, 'lot'),
	l13: T(13),
	upadl: T(13, 'upadł'),
	end: endOf(LINES),
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, 0, 1], [0, 0, 1]),
	kk(v, K.linie + 10, 0, [80, -20, 1.06], [0, 0, 1.04]),
	kk(v, K.l1 + 10, 0, [0, 0, 1], [0, 0, 1]),
	kk(v, K.yes + 10, 0, [0, 0, 1.04], [0, 0, 1.03]),
	kk(v, K.olt + 16, 0, [0, -10, 1.1], [0, 0, 1.08]),
	kk(v, K.l3 - 12, 0, [0, 0, 1.04], [0, 0, 1.03]),
	kk(v, K.l3 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.gdanska + 10, 1, [0, -20, 1.06], [0, 0, 1.04]),
	kk(v, K.wakac + 10, 1, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l5 - 12, 1, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l5 + 14, 2, [0, 0, 1], [0, 0, 1]),
	kk(v, K.c155 + 10, 2, [-80, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.p11 + 12, 2, [60, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.l7 - 12, 2, [0, 0, 1.04], [0, 0, 1.03]),
	kk(v, K.l7 + 14, 3, [0, 0, 1], [0, 0, 1]),
	kk(v, K.m2 + 10, 3, [-80, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.mies + 6, 3, [60, 0, 1.06], [0, 0, 1.04]),
	kk(v, K.l9 - 12, 3, [0, 0, 1.03], [0, 0, 1.03]),
	kk(v, K.l9 + 14, 4, [0, 0, 1], [0, 0, 1]),
	kk(v, K.m300 + 10, 4, [-40, 0, 1.08], [0, 0, 1.06]),
	kk(v, K.l11 - 12, 4, [0, 0, 1.04], [0, 0, 1.03]),
	kk(v, K.l11 + 14, 5, [0, 0, 1], [0, 0, 1]),
	kk(v, K.loty + 10, 5, [0, -30, 1.08], [0, -40, 1.06]),
	kk(v, K.l13 - 12, 5, [0, 0, 1.03], [0, 0, 1.03]),
	kk(v, K.l13 + 14, 6, [0, 0, 1], [0, 0, 1]),
	kk(v, K.upadl + 8, 6, [0, 0, 1.06], [0, 0, 1.05]),
	kk(v, SCENE, 6, [0, 0, 1.02], [0, 0, 1.02]),
];
const DIPS: [number, number, number][] = [K.l3, K.l5, K.l7, K.l9, K.l11, K.l13].map((b) => [b - 12, b + 14, 0.12]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.kupila), kind: 'both', amp: 0.6},
	{t: s(K.wiekszosc), kind: 'punch', amp: 0.4},
	{t: s(K.jet + 10), kind: 'punch', amp: 0.4},
	{t: s(K.yes + 10), kind: 'punch', amp: 0.4},
	{t: s(K.olt), kind: 'both', amp: 0.6},
	{t: s(K.m38), kind: 'punch', amp: 0.5},
	{t: s(K.m35), kind: 'punch', amp: 0.5},
	{t: s(K.c155), kind: 'punch', amp: 0.6},
	{t: s(K.p11), kind: 'both', amp: 0.7},
	{t: s(K.m2), kind: 'punch', amp: 0.6},
	{t: s(K.e600), kind: 'punch', amp: 0.5},
	{t: s(K.pochl), kind: 'shake', amp: 0.5},
	{t: s(K.m300), kind: 'both', amp: 0.8},
	{t: s(K.zawiesilo), kind: 'punch', amp: 0.5},
	{t: s(K.upadl + 10), kind: 'both', amp: 1},
];

// --- rekwizyty ----------------------------------------------------------------------------------------------
const PaperPlane: React.FC = () => (
	<g>
		<path d="M -110 0 L 130 -48 L -50 36 Z" fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -50 36 L 130 -48 L -14 60 Z" fill="#D9D3C6" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
	</g>
);
// Samolot na ziemi z paskiem w barwach (paint 0..1 = przemalowanie od lewej) i napisem na kadłubie.
const Liner: React.FC<{label: string; label2?: string; paint?: number; stripe?: string; stripe2?: string; tail?: React.ReactNode; wheels?: boolean}> = ({label, label2, paint = 0, stripe = '#5C6B7A', stripe2 = P.gold, tail, wheels = true}) => {
	const cut = -210 + paint * 430;
	return (
		<g>
			{wheels && (
				<g>
					<line x1={-60} y1={30} x2={-60} y2={58} stroke={P.navy} strokeWidth={6} />
					<line x1={150} y1={30} x2={150} y2={58} stroke={P.navy} strokeWidth={6} />
					<circle cx={-60} cy={60} r={12} fill={P.navy} />
					<circle cx={150} cy={60} r={12} fill={P.navy} />
				</g>
			)}
			<Plane tail={tail} />
			<clipPath id={`lnA${label}`}>
				<rect x={-260} y={-60} width={Math.max(0, cut + 260)} height={120} />
			</clipPath>
			<clipPath id={`lnB${label}`}>
				<rect x={cut} y={-60} width={Math.max(0, 260 - cut)} height={120} />
			</clipPath>
			<g clipPath={`url(#lnB${label})`}>
				<rect x={-200} y={8} width={400} height={12} fill={stripe} />
				<FText text={label} x={10} y={-2} size={label.length > 9 ? 30 : 36} fill={P.navy} />
			</g>
			{paint > 0 && (
				<g clipPath={`url(#lnA${label})`}>
					<path d="M -210 -6 Q -200 -40 -150 -40 L 150 -40 Q 210 -40 215 0 Q 210 34 150 34 L -170 34 Q -205 30 -210 -6 Z" fill={P.white} stroke={P.navy} strokeWidth={6} />
					{Array.from({length: 9}).map((_, i) => (
						<circle key={i} cx={-110 + i * 26} cy={-12} r={7} fill="#5C6B7A" />
					))}
					<rect x={-200} y={6} width={400} height={16} fill={stripe2} />
					<FText text={label2 ?? label} x={10} y={-2} size={32} fill={P.navy} />
				</g>
			)}
		</g>
	);
};
const Pie: React.FC<{share: number; r?: number}> = ({share, r = 60}) => {
	const a = share * Math.PI * 2;
	return (
		<g>
			<circle r={r} fill={P.white} stroke={P.navy} strokeWidth={6} />
			<path d={`M 0 0 L 0 ${-r} A ${r} ${r} 0 ${share > 0.5 ? 1 : 0} 1 ${Math.sin(a) * r} ${-Math.cos(a) * r} Z`} fill={P.gold} stroke={P.navy} strokeWidth={4} />
		</g>
	);
};
const Brush: React.FC = () => (
	<g transform="rotate(-20)">
		<rect x={-14} y={-220} width={28} height={170} rx={10} fill="#8C6A4A" stroke={P.navy} strokeWidth={5} />
		<rect x={-40} y={-60} width={80} height={30} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={5} />
		<path d="M -40 -30 L 40 -30 L 34 30 L -34 30 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
	</g>
);
const Suitcase: React.FC<{c?: string}> = ({c = P.red}) => (
	<g>
		<rect x={-12} y={-6} width={24} height={14} rx={4} fill="none" stroke={P.navy} strokeWidth={5} />
		<rect x={-36} y={8} width={72} height={86} rx={10} fill={c} stroke={P.navy} strokeWidth={5} />
		<line x1={-36} y1={40} x2={36} y2={40} stroke={P.navy} strokeWidth={3} opacity={0.5} />
	</g>
);
const Uniform: React.FC<{c: string}> = ({c}) => (
	<g>
		<path d="M -14 -8 Q 0 -30 14 -8" fill="none" stroke={P.navy} strokeWidth={5} />
		<path d="M -60 0 L 60 0 L 74 40 L 52 46 L 48 170 L -48 170 L -52 46 L -74 40 Z" fill={c} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<path d="M -20 0 L 0 40 L 20 0" fill={P.white} stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />
		<rect x={-48} y={170} width={96} height={70} fill={c} stroke={P.navy} strokeWidth={5} opacity={0.9} />
		<circle cx={30} cy={70} r={7} fill={P.gold} />
	</g>
);
const Note: React.FC<{w?: number}> = ({w = 110}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.26} width={w} height={w * 0.52} rx={6} fill="#8FA6B8" stroke={P.navy} strokeWidth={4} />
		<FText text="€" x={0} y={w * 0.13} size={w * 0.34} fill={P.navy} />
	</g>
);
const Tag: React.FC<{text: string; sub?: string; w?: number; c?: string; tc?: string}> = ({text, sub, w = 300, c = P.navy, tc = P.gold}) => (
	<g>
		<rect x={-w / 2} y={sub ? -48 : -38} width={w} height={sub ? 96 : 76} rx={16} fill={c} stroke={P.navy} strokeWidth={5} />
		<FText text={text} x={0} y={sub ? -2 : 14} size={sub ? 40 : 42} fill={tc} />
		{sub && <FText text={sub} x={0} y={34} size={26} fill={P.bg} />}
	</g>
);

// --- 0: lotnisko: papierowy samolot → prawdziwy, Jet Air i Yes Airways → OLT Express ----------------------------
const Apron: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const ground = FL - 64;
	const land = ip(f, 0, K.kupila - 4, 0, 1, EIO);
	const pp = v ? {x0: 140, y0: 420, x1: 330, y1: ground - 20} : {x0: 260, y0: 260, x1: 560, y1: ground - 20};
	const takeoff = ip(f, K.linie + 2, K.l1 + 40, 0, 1, EIN);
	const morph = prog(f, K.kupila - 2, 6);
	const agX = pp.x1 + takeoff * (v ? 1100 : 1700);
	const agY = pp.y1 + 20 - Math.max(0, takeoff - 0.35) * (v ? 900 : 700);
	const sc = v ? 0.95 : 1.2;
	const planes = v ? [{x: 300, y: ground - 330}, {x: 690, y: ground}] : [{x: 560, y: ground}, {x: 1260, y: ground}];
	const rollIn = (at: number) => ip(f, at - 24, at + 6, 1, 0, EOUT);
	const paint = ip(f, K.marka - 6, K.olt + 22, 0, 1, EIO);
	const brush = (i: number) => clamp01(paint * 2 - i);
	const piePos = v ? {x: 540, y: 330} : {x: 960, y: 230};
	const stick = (i: number, at: number) => ip(f, at, at + 16, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* hangar w tle */}
			<G x={v ? 540 : 900} y={FL}>
				<path d={v ? 'M -500 0 L -500 -380 Q 0 -620 500 -380 L 500 0 Z' : 'M -760 0 L -760 -420 Q 0 -700 760 -420 L 760 0 Z'} fill="#DCD3C3" stroke={P.navy} strokeWidth={6} opacity={0.9} />
				<rect x={v ? -380 : -600} y={v ? -330 : -360} width={v ? 760 : 1200} height={v ? 330 : 360} fill="#CFC5B2" stroke={P.navy} strokeWidth={5} />
				{Array.from({length: v ? 6 : 10}).map((_, i) => (
					<line key={i} x1={(v ? -380 : -600) + (i + 1) * (v ? 760 / 7 : 120)} y1={v ? -330 : -360} x2={(v ? -380 : -600) + (i + 1) * (v ? 760 / 7 : 120)} y2={0} stroke={P.navy} strokeWidth={3} opacity={0.25} />
				))}
			</G>
			{/* wieża i pas */}
			<G x={v ? 930 : 1760} y={FL}>
				<rect x={-40} y={-400} width={80} height={400} fill={P.paper} stroke={P.navy} strokeWidth={6} />
				<path d="M -80 -400 L 80 -400 L 62 -480 L -62 -480 Z" fill={P.sky} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
			</G>
			{Array.from({length: 9}).map((_, i) => (
				<rect key={i} x={40 + i * (v ? 120 : 210)} y={FL + 30} width={v ? 70 : 120} height={14} fill={P.white} opacity={0.7} />
			))}
			{f >= K.y2011 - 2 && (
				<G x={v ? 170 : 170} y={v ? 300 : 180} s={pk(f, K.y2011 - 2)} r={-4}>
					<Calendar text="2011" w={v ? 170 : 180} />
				</G>
			)}
			{/* papierowy samolot ląduje i zamienia się w prawdziwy ze sztabką na ogonie */}
			{morph < 1 && (
				<G x={pp.x0 + (pp.x1 - pp.x0) * land} y={pp.y0 + (pp.y1 - pp.y0) * land + Math.sin(f / 6) * 6 * (1 - land)} r={-6 + 6 * land} s={(v ? 1.1 : 1.3) * (1 - morph * 0.4)} o={1 - morph}>
					<PaperPlane />
				</G>
			)}
			{morph > 0 && takeoff < 1 && (
				<G x={agX} y={agY} s={sc * (0.6 + 0.4 * morph) * (v ? 1.1 : 1.2)} r={-Math.max(0, takeoff - 0.3) * 18}>
					<Liner label="" tail={<g transform="translate(14 22) scale(0.42)"><GoldBar w={110} /></g>} />
				</G>
			)}
			{morph > 0 && f < K.kupila + 14 && <circle cx={pp.x1} cy={pp.y1} r={60 + (f - K.kupila) * 10} fill="none" stroke={P.gold} strokeWidth={8} opacity={1 - (f - K.kupila + 2) / 16} />}
			{/* udziały */}
			{f >= K.wiekszosc - 4 && f < K.yes + 30 && (
				<G x={piePos.x} y={piePos.y} s={pk(f, K.wiekszosc - 4)} o={1 - prog(f, K.yes + 20, 8)}>
					<Pie share={0.7} r={v ? 90 : 90} />
					<FText text="większość udziałów" x={0} y={v ? 150 : 150} size={v ? 46 : 46} fill={P.navy} />
				</G>
			)}
			{[K.jet, K.yes].map((at, i) => {
				if (f < at - 26) return null;
				const p = planes[i];
				const off = rollIn(at) * (v ? -700 : -900);
				const st = stick(i, at + 10);
				return (
					<g key={i}>
						<G x={p.x + off} y={p.y} s={sc}>
							<Liner label={i ? 'Yes Airways' : 'Jet Air'} label2="OLT Express" paint={brush(i)} stripe={i ? P.red : '#4A6E8C'} stripe2={P.gold} />
						</G>
						{st > 0 && (
							<G x={piePos.x + (p.x + 90 - piePos.x) * st} y={piePos.y + (p.y - 110 * sc - piePos.y) * st} s={0.6 + 0.4 * (1 - st)}>
								<Pie share={0.7} r={54} />
							</G>
						)}
					</g>
				);
			})}
			{paint > 0 && paint < 1 && (
				<G x={(paint < 0.5 ? planes[0].x : planes[1].x) - 200 * sc + ((paint * 2) % 1) * 420 * sc} y={(paint < 0.5 ? planes[0].y : planes[1].y) - 20} s={sc * 0.9}>
					<Brush />
				</G>
			)}
			{f >= K.olt && (
				<G x={v ? 540 : 960} y={v ? 250 : 190} s={1.35 * pk(f, K.olt)}>
					<Tag text="OLT Express" sub="nowa marka" w={v ? 420 : 420} c={P.gold} tc={P.navy} />
				</G>
			)}
		</g>
	);
};

// --- 1: mapa: Warszawa–Gdańsk, potem Europa ---------------------------------------------------------------------
const Map: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W} = l;
	const zoomOut = ip(f, K.l4 - 4, K.m38 + 4, 0, 1, EIO);
	const sPl = v ? 0.85 : 0.62;
	const sEu = v ? 0.22 : 0.2;
	const sc = Math.exp(Math.log(sPl) + (Math.log(sEu) - Math.log(sPl)) * zoomOut);
	const cPl = v ? {x: 540, y: 640} : {x: 960, y: 430};
	const cEu = v ? {x: 540, y: 560} : {x: 960, y: 330};
	const ox = cPl.x + (cEu.x - cPl.x) * zoomOut;
	const oy = cPl.y + (cEu.y - cPl.y) * zoomOut;
	const sea = '#C9D8E0';
	const P2 = (p: [number, number]) => ({x: ox + p[0] * sc, y: oy + p[1] * sc});
	const wa = P2(CITIES.warszawa);
	const gd = P2(CITIES.gdansk);
	const route = ip(f, K.polecial, K.gdanska + 6, 0, 1, EIO);
	const hubs = ['warszawa', 'gdansk', 'krakow', 'wroclaw', 'poznan', 'katowice'];
	const reg = EU_PTS.map((d, i) => ({from: CITIES[hubs[i % hubs.length]], to: d}));
	const dom = ['krakow', 'wroclaw', 'poznan', 'katowice', 'szczecin', 'rzeszow', 'lodz', 'bydgoszcz', 'lublin', 'olsztyn'].map((c, i) => ({from: CITIES[hubs[i % 2]], to: CITIES[c]}));
	const regular = [...dom, ...reg];
	const holiday = SOUTH_PTS.map((d, i) => ({from: CITIES[hubs[i % hubs.length]], to: d}));
	const arc = (a: [number, number], b: [number, number], p: number, k: number, color: string, w: number) => {
		const A = P2(a);
		const B = P2(b);
		const mx = (A.x + B.x) / 2;
		const my = (A.y + B.y) / 2 - Math.hypot(B.x - A.x, B.y - A.y) * 0.22;
		return <path key={k} d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
	};
	const regCount = Math.round(ip(f, K.m38, K.m38 + 40, 0, 38, EOUT));
	const holCount = Math.round(ip(f, K.m35, K.m35 + 36, 0, 35, EOUT));
	return (
		<g>
			<rect x={0} y={0} width={W} height={l.H} fill={sea} />
			<g transform={`translate(${ox} ${oy}) scale(${sc})`}>
				{COUNTRIES.map((c) => (
					<path key={c.n} d={c.d} fill={c.n === 'Poland' ? P.goldLight : '#E4DCCB'} stroke={P.navy} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
				))}
				<path d={POLAND} fill={P.goldLight} stroke={P.navy} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
			</g>
			{/* trasy */}
			{zoomOut > 0.6 && regular.map((r, i) => arc(r.from, r.to, ip(f, K.m38 + i * 1.3, K.m38 + 14 + i * 1.3, 0, 1, EOUT), i, P.navy, v ? 4 : 4))}
			{zoomOut > 0.6 && holiday.map((r, i) => arc(r.from, r.to, ip(f, K.m35 + i * 1.6, K.m35 + 14 + i * 1.6, 0, 1, EOUT), 100 + i, P.red, v ? 4 : 4))}
			{zoomOut > 0.6 &&
				[...regular.map((r, i) => ({p: r.to, at: K.m38 + 12 + i * 1.3, c: P.navy})), ...holiday.map((r, i) => ({p: r.to, at: K.m35 + 12 + i * 1.6, c: P.red}))].map((d, i) => {
					const q = P2(d.p);
					return f >= d.at ? <circle key={i} cx={q.x} cy={q.y} r={7 * pk(f, d.at)} fill={d.c} stroke={P.white} strokeWidth={2} /> : null;
				})}
			{route > 0 && arc(CITIES.warszawa, CITIES.gdansk, route, 999, P.red, v ? 10 : 8)}
			{route > 0 && route < 1 && (() => {
				const p = route;
				const mx = (wa.x + gd.x) / 2;
				const my = (wa.y + gd.y) / 2 - Math.hypot(gd.x - wa.x, gd.y - wa.y) * 0.22;
				const x = (1 - p) * (1 - p) * wa.x + 2 * (1 - p) * p * mx + p * p * gd.x;
				const y = (1 - p) * (1 - p) * wa.y + 2 * (1 - p) * p * my + p * p * gd.y;
				return (
					<G x={x} y={y} s={v ? 0.28 : 0.24} r={-40}>
						<Plane />
					</G>
				);
			})()}
			{[
				{c: wa, t: 'Warszawa', dy: 50},
				{c: gd, t: 'Gdańsk', dy: -30},
			].map((m, i) => (
				<g key={i} opacity={1 - zoomOut}>
					<circle cx={m.c.x} cy={m.c.y} r={14} fill={P.red} stroke={P.white} strokeWidth={4} />
					<FText text={m.t} x={m.c.x + (i ? -20 : 20)} y={m.c.y + m.dy} size={v ? 46 : 40} fill={P.navy} anchor={i ? 'end' : 'start'} stroke={P.bg} sw={8} />
				</g>
			))}
			{f >= K.l3 && (
				<G x={v ? 850 : 260} y={v ? 290 : 200} s={pk(f, K.l3 + 2)} r={-4} o={1 - prog(f, K.l4, 8)}>
					<Calendar text="1 kwietnia" top="2012" w={v ? 240 : 250} />
				</G>
			)}
			{f >= K.m38 - 2 && (
				<G x={v ? 290 : 330} y={v ? 1010 : 300} s={pk(f, K.m38 - 2)}>
					<Plate text={`${regCount}`} label="tras regularnych" w={v ? 400 : 380} size={v ? 90 : 96} />
				</G>
			)}
			{f >= K.m35 - 2 && (
				<G x={v ? 790 : 1600} y={v ? 1010 : 300} s={pk(f, K.m35 - 2)}>
					<Plate text={`${holCount}`} label="miejsc wakacyjnych" w={v ? 400 : 380} size={v ? 90 : 96} fill={P.red} color={P.white} />
				</G>
			)}
		</g>
	);
};

// --- 2: bilet 155 zł i kabina z 11% zajętych miejsc -----------------------------------------------------------------
const Cabin: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const pr = v ? {x: 300, y: 430} : {x: 360, y: 600};
	const tk = ip(f, K.l5 + 4, K.tanie + 10, 0, 1, EOUT);
	const cols = v ? 4 : 16;
	const rows = v ? 14 : 4;
	const n = cols * rows;
	const lit = v ? [3, 17, 24, 30, 41, 50] : [2, 11, 20, 29, 38, 47, 58];
	const cab = v ? {x0: 330, y0: 600, w: 440, h: 500} : {x0: 760, y0: 300, w: 1040, h: 300};
	const draw = ip(f, K.mniejszymi - 4, K.mniejszymi + 14, 0, 1, EIO);
	const seatsOn = (i: number) => ip(f, K.zajetych - 6 + i * 0.25, K.zajetych + 4 + i * 0.25, 0, 1, EBACK);
	const litOn = (k: number) => ip(f, K.p11 - 2 + k * 2, K.p11 + 6 + k * 2, 0, 1, EBACK);
	const seatW = v ? cab.w / (cols + 1.2) : cab.w / (cols + 1.5);
	const seatH = v ? cab.h / (rows + 0.6) : cab.h / (rows + 1.6);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* drukarka biletów */}
			<G x={pr.x} y={pr.y} s={v ? 1.15 : 1.4}>
				<g transform={`translate(${30 + tk * 40} ${-60 - tk * (v ? 100 : 160)}) rotate(${-8 * tk})`}>
					<rect x={-130} y={-80} width={260} height={150} rx={12} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<rect x={-130} y={-80} width={260} height={40} rx={12} fill={P.gold} />
					<FText text="BILET" x={0} y={-50} size={28} fill={P.navy} />
					<line x1={60} y1={-36} x2={60} y2={66} stroke={P.navy} strokeWidth={3} strokeDasharray="8 8" />
					{f >= K.c155 - 2 && (
						<G x={-40} y={30} s={pk(f, K.c155 - 2)}>
							<FText text="155 zł" x={0} y={8} size={52} fill={P.red} />
							<FText text="średnio" x={0} y={-36} size={24} fill={P.slate} />
						</G>
					)}
				</g>
				<rect x={-150} y={-40} width={300} height={130} rx={18} fill={P.slate} stroke={P.navy} strokeWidth={7} />
				<rect x={-110} y={-48} width={220} height={16} rx={6} fill={P.navy} />
				<circle cx={100} cy={40} r={12} fill={f % 20 < 10 ? P.gold : P.goldDark} />
			</G>
			{f >= K.tanie && f < K.l6 + 6 && (
				<G x={pr.x + (v ? 330 : 120)} y={pr.y - (v ? 200 : 470)} s={1.3 * pk(f, K.tanie)} o={1 - prog(f, K.l6, 6)}>
					<Tag text="tanie" w={200} c={P.red} tc={P.white} />
				</G>
			)}
			{/* kabina z góry */}
			{draw > 0 && (
				<g>
					<rect x={cab.x0} y={cab.y0} width={cab.w} height={cab.h} rx={v ? 120 : 140} fill={P.white} stroke={P.navy} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} fillOpacity={draw} />
					<FText text="mniejszy samolot" x={cab.x0 + cab.w / 2} y={cab.y0 - 26} size={34} fill={P.slate} opacity={draw} />
				</g>
			)}
			{Array.from({length: n}).map((_, i) => {
				const c = i % cols;
				const r = Math.floor(i / cols);
				const a = seatsOn(i);
				if (a <= 0) return null;
				const k = lit.indexOf(i);
				const on = k >= 0 ? litOn(k) : 0;
				const x = v ? cab.x0 + seatW * (0.6 + c + (c >= 2 ? 0.4 : 0)) - 6 : cab.x0 + seatW * (1 + c);
				const y = v ? cab.y0 + seatH * (0.5 + r) : cab.y0 + seatH * (0.8 + r + (r >= 2 ? 0.6 : 0));
				return (
					<G key={i} x={x} y={y} s={a}>
						<rect x={-seatW * 0.36} y={-seatH * 0.36} width={seatW * 0.72} height={seatH * 0.72} rx={8} fill={on > 0 ? P.gold : P.grey} stroke={P.navy} strokeWidth={4} />
						{on > 0 && <circle r={seatW * 0.2 * on} fill={P.skin} stroke={P.navy} strokeWidth={3} />}
					</G>
				);
			})}
			{f >= K.p11 && (
				<G x={v ? 880 : 1180} y={v ? 760 : 710} s={pk(f, K.p11)}>
					<circle r={v ? 90 : 84} fill={P.red} stroke={P.navy} strokeWidth={7} />
					<FText text="11%" x={0} y={v ? 22 : 22} size={v ? 64 : 62} fill={P.white} />
					<FText text="zajętych miejsc" x={v ? 0 : 110} y={v ? 140 : 16} size={v ? 32 : 44} fill={P.navy} stroke={P.bg} sw={8} anchor={v ? 'middle' : 'start'} />
				</G>
			)}
		</g>
	);
};

// --- 3: stroje 2 mln zł i kartki po 600 tys. € --------------------------------------------------------------------
const Costs: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const rack = v ? {x: 330, y: FL, w: 520} : {x: 520, y: FL, w: 700};
	const cal = v ? {x: 780, y: 380, w: 230} : {x: 1440, y: 420, w: 260};
	const slide = ip(f, K.stroje - 6, K.stroje + 12, -900, 0, EOUT);
	const months = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec'];
	const tearStart = K.l8 + 2;
	const tears = f >= tearStart ? Math.min(6, Math.floor((f - tearStart) / 9)) : 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<g transform={`translate(${slide} 0)`}>
				<G x={rack.x} y={rack.y}>
					<line x1={-rack.w / 2} y1={-560} x2={rack.w / 2} y2={-560} stroke={P.slate} strokeWidth={14} strokeLinecap="round" />
					<line x1={-rack.w / 2 + 20} y1={-560} x2={-rack.w / 2 + 20} y2={0} stroke={P.slate} strokeWidth={12} />
					<line x1={rack.w / 2 - 20} y1={-560} x2={rack.w / 2 - 20} y2={0} stroke={P.slate} strokeWidth={12} />
					{Array.from({length: v ? 4 : 5}).map((_, i, arr) => (
						<G key={i} x={-rack.w / 2 + 80 + (i * (rack.w - 160)) / (arr.length - 1)} y={-540} r={swing(f, K.stroje + 12 + i * 2, 6)}>
							<Uniform c={[P.navy, '#33445A', P.navy, '#4A6E8C', '#33445A'][i]} />
						</G>
					))}
				</G>
			</g>
			{f >= K.m2 - 4 && (
				<G x={v ? rack.x - 60 : rack.x + rack.w / 2 - 40} y={FL - (v ? 700 : 640)} s={pk(f, K.m2 - 4)} r={8 + swing(f, K.m2, 10)}>
					<line x1={0} y1={-60} x2={0} y2={-10} stroke={P.navy} strokeWidth={4} />
					<path d="M -170 -10 L 110 -10 L 150 40 L 110 90 L -170 90 Z" fill={P.gold} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
					<FText text="ponad 2 mln zł" x={-30} y={54} size={42} fill={P.navy} />
				</G>
			)}
			{f >= K.l8 - 6 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.l8 - 6)}>
					<rect x={-cal.w / 2} y={-cal.w * 0.6} width={cal.w} height={cal.w * 1.05} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<rect x={-cal.w / 2} y={-cal.w * 0.6} width={cal.w} height={cal.w * 0.26} rx={16} fill={P.red} />
					<FText text="2012" x={0} y={-cal.w * 0.42} size={cal.w * 0.14} fill={P.white} />
					<FText text={months[tears]} x={0} y={cal.w * 0.14} size={cal.w * 0.17} fill={P.navy} />
					{Array.from({length: tears}).map((_, i) => {
						const a = tearStart + (i + 1) * 9;
						const p = clamp01((f - a) / 24);
						if (p <= 0 || p >= 1) return null;
						return (
							<G key={i} x={(v ? -1 : -1) * p * (v ? 330 : 520)} y={-p * 160 + p * p * 300} r={-p * 60} o={1 - p}>
								<rect x={-cal.w * 0.4} y={-cal.w * 0.3} width={cal.w * 0.8} height={cal.w * 0.56} rx={8} fill={P.white} stroke={P.navy} strokeWidth={4} />
								{[0, 1, 2].map((k) => (
									<G key={k} x={(k - 1) * 30} y={cal.w * 0.36 - k * 10}>
										<Note w={90} />
									</G>
								))}
							</G>
						);
					})}
				</G>
			)}
			{f >= K.e600 - 2 && (
				<G x={cal.x} y={cal.y + cal.w * 0.75} s={pk(f, K.e600 - 2)}>
					<Tag text="ok. 600 tys. €" sub="straty co miesiąc" w={v ? 330 : 360} />
				</G>
			)}
		</g>
	);
};

// --- 4: moneta Amber Gold dzieli się na trzy, jedna część odlatuje ----------------------------------------------------
const Split: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const c = v ? {x: 540, y: 640, r: 240} : {x: 760, y: 430, r: 250};
	const crack = ip(f, K.pochl - 4, K.pochl + 10, 0, 1, EBACK);
	const lift = ip(f, K.m300 + 2, K.l10 + 10, 0, 1, EIN);
	const wedge = (i: number) => {
		const a0 = (-90 + i * 120) * (Math.PI / 180);
		const a1 = (30 + i * 120) * (Math.PI / 180);
		const mid = (a0 + a1) / 2;
		const off = crack * 26;
		const fly = i === 0 ? lift : 0;
		const dx = Math.cos(mid) * off + fly * (v ? 700 : 1300);
		const dy = Math.sin(mid) * off - fly * (v ? 900 : 700);
		return (
			<g key={i} transform={`translate(${dx} ${dy}) rotate(${fly * -20})`}>
				<path d={`M 0 0 L ${Math.cos(a0) * c.r} ${Math.sin(a0) * c.r} A ${c.r} ${c.r} 0 0 1 ${Math.cos(a1) * c.r} ${Math.sin(a1) * c.r} Z`} fill={P.gold} stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
				<path d={`M 0 0 L ${Math.cos(a0) * c.r * 0.8} ${Math.sin(a0) * c.r * 0.8} A ${c.r * 0.8} ${c.r * 0.8} 0 0 1 ${Math.cos(a1) * c.r * 0.8} ${Math.sin(a1) * c.r * 0.8}`} fill="none" stroke={P.goldDark} strokeWidth={6} />
				{i === 0 && lift > 0 && (
					<g transform={`translate(${Math.cos(mid) * c.r * 0.55} ${Math.sin(mid) * c.r * 0.55})`}>
						<path d={`M -30 0 L -150 -70 L -120 0 Z M 30 0 L 150 -70 L 120 0 Z`} fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" opacity={prog(f, K.m300 + 2, 6)} transform={`scale(1 ${0.7 + 0.3 * Math.sin(f / 2)})`} />
					</g>
				)}
			</g>
		);
	};
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{f >= K.lipca - 2 && (
				<G x={v ? 180 : 180} y={v ? 300 : 180} s={pk(f, K.lipca - 2)} r={-4}>
					<Calendar text="lipiec" top="2012" w={v ? 200 : 210} />
				</G>
			)}
			<G x={c.x} y={c.y} s={pk(f, K.l9 - 6)}>
				{crack <= 0 ? (
					<g>
						<circle r={c.r} fill={P.gold} stroke={P.navy} strokeWidth={8} />
						<circle r={c.r * 0.8} fill="none" stroke={P.goldDark} strokeWidth={6} />
					</g>
				) : (
					[1, 2, 0].map((i) => wedge(i))
				)}
				<FText text="AMBER GOLD" x={0} y={16} size={c.r * 0.2} fill={P.navy} opacity={1 - crack} />
				{crack > 0 && <FText text="wpłaty klientów" x={0} y={c.r + 60} size={36} fill={P.slate} opacity={1 - lift} />}
			</G>
			{f >= K.m300 - 2 && (
				<G x={v ? 540 : 1450} y={v ? 260 : 300} s={pk(f, K.m300 - 2)}>
					<Plate text={`${Math.round(ip(f, K.m300, K.m300 + 26, 0, 300, EOUT))} mln zł`} label="prawie tyle pochłonęły linie" w={v ? 600 : 560} size={84} fill={P.red} color={P.white} />
				</G>
			)}
			{f >= K.trzecia - 4 && (
				<G x={v ? 540 : 1450} y={v ? 990 : 560} s={pk(f, K.trzecia - 4)}>
					<circle r={70} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="1/3" x={0} y={20} size={56} fill={P.red} />
					<FText text="co trzecia złotówka" x={0} y={120} size={40} fill={P.navy} stroke={P.bg} sw={8} />
				</G>
			)}
		</g>
	);
};

// --- 5: tablica odlotów: ODWOŁANY, pasażerowie w hali, inny samolot z napisem LOT ---------------------------------------
const Board: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const B = v ? {x0: 70, x1: 1010, y0: 190, rowH: 66, rows: 6} : {x0: 110, x1: 1180, y0: 120, rowH: 64, rows: 6};
	const win = v ? {x0: 70, x1: 1010, y0: 660, y1: 840} : {x0: 1260, x1: 1860, y0: 140, y1: 520};
	const times = ['06:40', '08:15', '10:20', '12:05', '14:50', '17:30'];
	const lotP = ip(f, K.wracali, K.lot + 34, 0, 1, EIN);
	const pax = v ? [140, 330, 520, 720] : [300, 560, 820, 1080, 1340];
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* okno na płytę lotniska */}
			<rect x={win.x0} y={win.y0} width={win.x1 - win.x0} height={win.y1 - win.y0} rx={12} fill={P.sky} stroke={P.navy} strokeWidth={8} />
			<clipPath id={`am4win${v ? 'v' : 'h'}`}>
				<rect x={win.x0} y={win.y0} width={win.x1 - win.x0} height={win.y1 - win.y0} />
			</clipPath>
			<g clipPath={`url(#am4win${v ? 'v' : 'h'})`}>
				<rect x={win.x0} y={win.y1 - 40} width={win.x1 - win.x0} height={40} fill={P.grey} />
				{lotP > 0 && (
					<G x={win.x0 - 200 + lotP * (win.x1 - win.x0 + 500)} y={win.y1 - 70 - Math.max(0, lotP - 0.3) * 260} s={v ? 0.55 : 0.6} r={-Math.max(0, lotP - 0.3) * 20}>
						<Liner label="LOT" stripe={'#33445A'} wheels={lotP < 0.4} />
					</G>
				)}
				{f < K.l12 &&
					[0, 1].map((i) => (
						<G key={i} x={win.x0 + 140 + i * (v ? 420 : 300)} y={win.y1 - 70} s={v ? 0.45 : 0.42} o={1 - prog(f, K.loty, 10) * 0.5}>
							<Liner label="OLT Express" stripe={P.gold} />
						</G>
					))}
			</g>
			{[0, 1].map((k) => (
				<line key={k} x1={(win.x0 + win.x1) / 2 + (k ? 1 : -1) * 4} y1={win.y0} x2={(win.x0 + win.x1) / 2 + (k ? 1 : -1) * 4} y2={win.y1} stroke={P.navy} strokeWidth={6} />
			))}
			{/* tablica */}
			<rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.rowH * (B.rows + 1) + 20} rx={14} fill={P.navy} stroke={P.navy} strokeWidth={8} />
			<FText text="ODLOTY" x={B.x0 + 30} y={B.y0 + 48} size={40} fill={P.gold} anchor="start" />
			{f >= K.l11 - 2 && (
				<G x={B.x1 - (v ? 150 : 170)} y={B.y0 + 40} s={pk(f, K.l11 - 2)}>
					<rect x={-130} y={-30} width={260} height={56} rx={10} fill={P.gold} />
					<FText text="27.07.2012" x={0} y={10} size={34} fill={P.navy} />
				</G>
			)}
			{times.map((t, i) => {
				const y = B.y0 + B.rowH * (i + 1) + 20;
				const flip = ip(f, K.zawiesilo - 4 + i * 5, K.zawiesilo + 2 + i * 5, 0, 1, EIO);
				const sx = Math.abs(Math.cos(flip * Math.PI));
				const done = flip >= 0.5;
				const stX = v ? B.x1 - 210 : B.x1 - 230;
				return (
					<g key={i}>
						<rect x={B.x0 + 20} y={y} width={B.x1 - B.x0 - 40} height={B.rowH - 10} rx={6} fill="#2C3C52" />
						<FText text={t} x={B.x0 + 40} y={y + B.rowH * 0.62} size={v ? 32 : 32} fill={P.bg} anchor="start" />
						<FText text="OLT Express" x={B.x0 + (v ? 190 : 210)} y={y + B.rowH * 0.62} size={v ? 30 : 32} fill={P.bg} anchor="start" />
						<g transform={`translate(${stX + 90} ${y + B.rowH * 0.42}) scale(1 ${Math.max(0.05, sx)}) translate(${-stX - 90} ${-y - B.rowH * 0.42})`}>
							<rect x={stX - 20} y={y + 4} width={220} height={B.rowH - 18} rx={6} fill={done ? P.red : '#3E7D4F'} />
							<FText text={done ? 'ODWOŁANY' : 'OK'} x={stX + 90} y={y + B.rowH * 0.6} size={v ? 28 : 30} fill={P.white} />
						</g>
					</g>
				);
			})}
			{/* pasażerowie z walizkami */}
			{pax.map((x, i) => {
				const a = ip(f, K.l12 - 6 + i * 3, K.l12 + 10 + i * 3, 0, 1, EBACK);
				if (a <= 0) return null;
				return (
					<G key={i} x={x} y={FL} s={(v ? 0.62 : 0.66) * a}>
						<Adult look={{suit: ['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A'][i], hair: ['#2B2420', '#8A8A8A', '#A07850', '#3B2A20', '#6B4A2E'][i], shirt: P.white, hairStyle: i % 2 ? 'side' : 'short'}} mood={f >= K.utkneli ? 'sad' : 'neutral'} armR={8} holdR={<Suitcase c={[P.red, P.gold, '#4A6E8C', P.grass, '#9C5A40'][i]} />} seed={i * 5} />
						{f >= K.utkneli + i * 2 && f < K.wracali + 4 && <FText text="?" x={0} y={-560} size={80} fill={P.red} opacity={prog(f, K.utkneli + i * 2, 6)} />}
					</G>
				);
			})}
		</g>
	);
};

// --- 6: 17 dni później spada szyld --------------------------------------------------------------------------------
const Fall: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const days = Math.min(17, Math.max(0, Math.floor((f - K.l13 - 4) / 1.8)));
	const day = 27 + days;
	const label = day <= 31 ? `${day}.07` : `${day - 31}.08`;
	const shopW = v ? 760 : 800;
	const shopX = v ? 540 : 1080;
	const signTop = FL - shopW * 0.8 + 12;
	const drop = fall(f, K.upadl + 10, 12, signTop, FL - shopW * 0.2 - 4);
	const tilt = f >= K.upadl - 6 ? (f < K.upadl + 10 ? -6 * prog(f, K.upadl - 6, 8) : 6) : 0;
	const dust = clamp01((f - (K.upadl + 10)) / 24);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<G x={shopX} y={FL}>
				<g>
					<rect x={-shopW / 2} y={-shopW * 0.8} width={shopW} height={shopW * 0.8} fill={P.paper} stroke={P.navy} strokeWidth={6} />
					<rect x={-shopW / 2 + 16} y={-shopW * 0.46} width={shopW * 0.44} height={shopW * 0.3} fill={P.sky} stroke={P.navy} strokeWidth={4} />
					<rect x={shopW * 0.08} y={-shopW * 0.46} width={shopW * 0.3} height={shopW * 0.46} fill={P.navy} />
				</g>
			</G>
			<G x={shopX} y={f >= K.upadl - 6 ? drop - signTop + signTop : signTop} r={tilt}>
				<rect x={-shopW / 2 + 12} y={0} width={shopW - 24} height={shopW * 0.2} rx={6} fill={P.gold} stroke={P.navy} strokeWidth={5} />
				<FText text="AMBER GOLD" x={0} y={shopW * 0.15} size={shopW * 0.11} fill={P.navy} />
			</G>
			{dust > 0 && dust < 1 &&
				Array.from({length: 10}).map((_, i) => (
					<circle key={i} cx={shopX + (i - 4.5) * (shopW / 9) + Math.sin(i) * 20} cy={FL - 30 - dust * (40 + hsh(i) * 60)} r={30 + dust * 60} fill={P.grey} opacity={0.8 * (1 - dust)} />
				))}
			<G x={v ? 220 : 260} y={v ? 300 : 200} s={pk(f, K.l13 - 4)} r={-4}>
				<Calendar text={label} w={v ? 200 : 220} />
			</G>
			{f >= K.l13 && (
				<G x={v ? 540 : 620} y={v ? 300 : 200} s={pk(f, K.l13 + 2)}>
					<rect x={-110} y={-40} width={220} height={76} rx={14} fill={P.navy} />
					<FText text={`+${days} dni`} x={0} y={12} size={44} fill={P.gold} />
				</G>
			)}
		</g>
	);
};

const ROOMS = [Apron, Map, Cabin, Costs, Split, Board, Fall];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const R4Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<AmberStage v={v} lines={LINES} vo="am4_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`am4c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.bg} />
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#am4c${v ? 'v' : 'h'})`}>
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

export const AmberR4: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 4" title="Linie lotnicze" icon={<G y={-20} s={0.9}><Plane tail={<g transform="translate(14 22) scale(0.42)"><GoldBar w={110} /></g>} /></G>} frames={CARD} />}>
		<R4Scene />
	</WithCard>
);

export const AmberS3: React.FC = () => (
	<ShortWithCta sceneFrames={SCENE}>
		<R4Scene v />
	</ShortWithCta>
);
