// Amber Gold, rozdział 1 „Obietnica” (16:9). Gdańsk 2009 → wykres złota → oddział i tablica ofert →
// mennice, regulamin, skarbiec → parasol BFG → sztabka zamienia się w kartkę → firma rośnie → cień za ladą.
import React from 'react';
import {LINES} from './am1.gen';
import {
	AmberStage, WithCard, CardScene, makeT, endOf, ip, pk, live, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, Coin, FText, clamp01, prog,
	Room, Plate, GoldBar, Cert, VaultDoor, Mini, miniLook, Columns, Plane,
} from './kit';

const T = makeT(LINES);
const RW = 1920;
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R1_FRAMES = CARD + SCENE;

const K = {
	y2009: T(0, '2009'),
	l1: T(1),
	kryz: T(1, 'kryzysu'),
	ufaja: T(2, 'ufają'),
	zloto: T(2, 'złoto'),
	l3: T(3),
	y2011: T(3, '2011'),
	d1900: T(3, '1900'),
	najw: T(3, 'najwięcej'),
	l4: T(4),
	bog: T(4, 'bogatszy'),
	l5: T(5),
	amber: T(5, 'Amber'),
	oferta: T(6),
	przyn: T(7),
	kupuje: T(7, 'kupuje'),
	przech: T(7, 'przechowuje'),
	placi: T(7, 'płaci'),
	ile: T(8),
	p6: T(9, '6'),
	p165: T(9, '16,5'),
	lokata: T(10),
	p112: T(10, '11,2'),
	gwar: T(10, 'gwarantowane'),
	l11: T(11),
	wiecej: T(11, 'więcej'),
	l12: T(12),
	szw: T(12, 'szwajcarskich'),
	reg: T(13, 'regulaminie'),
	wlasc: T(13, 'właścicielem'),
	l14: T(14),
	skarb: T(14, 'skarbcu'),
	l15: T(15),
	bankiem: T(16, 'bankiem'),
	licencji: T(17, 'licencji'),
	gwarancjami: T(17, 'gwarancjami'),
	upada: T(18, 'upada'),
	e100: T(18, '100'),
	l19: T(19),
	nikt: T(19, 'nikt'),
	l20: T(20),
	sztabki: T(21, 'sztabki'),
	cert: T(22, 'certyfikat'),
	kartke: T(23),
	skarbcu2: T(23, 'skarbcu'),
	zloto2: T(23, 'złoto'),
	l24: T(24),
	ods: T(25, 'odsetki'),
	rosnie: T(26, 'rośnie'),
	linie: T(26, 'linie'),
	l27: T(27),
	kto: T(27, 'kto'),
	end: endOf(LINES),
};

const cx = (i: number) => i * RW + 960;
const KEYS: CK[] = [
	{f: 0, x: cx(0), y: 470, z: 1},
	{f: K.l3 - 14, x: cx(0) + 40, y: 450, z: 1.06},
	{f: K.l3 + 12, x: cx(1), y: 470, z: 1},
	{f: K.najw + 10, x: cx(1) + 200, y: 400, z: 1.12},
	{f: K.l4 - 4, x: cx(1) + 120, y: 450, z: 1.06},
	{f: K.l5 - 12, x: cx(1) + 40, y: 470, z: 1.02},
	{f: K.l5 + 16, x: cx(2) - 30, y: 470, z: 1.06},
	{f: K.oferta - 6, x: cx(2) - 10, y: 470, z: 1.06},
	{f: K.przyn - 6, x: cx(2) + 360, y: 440, z: 1.12},
	{f: K.ile + 2, x: cx(2) + 360, y: 440, z: 1.14},
	{f: K.gwar + 10, x: cx(2) + 420, y: 430, z: 1.2},
	{f: K.l11 + 4, x: cx(2) + 300, y: 450, z: 1.08},
	{f: K.l12 - 12, x: cx(2) + 280, y: 460, z: 1.06},
	{f: K.l12 + 14, x: cx(3), y: 470, z: 1},
	{f: K.l15 - 12, x: cx(3) + 40, y: 460, z: 1.05},
	{f: K.l15 + 14, x: cx(4), y: 470, z: 1},
	{f: K.l20 - 12, x: cx(4) + 40, y: 470, z: 1.06},
	{f: K.l20 + 14, x: cx(5), y: 470, z: 1},
	{f: K.cert + 4, x: cx(5), y: 470, z: 1.14},
	{f: K.l24 - 12, x: cx(5) + 40, y: 460, z: 1.08},
	{f: K.l24 + 14, x: cx(6), y: 470, z: 1},
	{f: K.l27 - 12, x: cx(6) + 30, y: 460, z: 1.04},
	{f: K.l27 + 14, x: cx(7), y: 470, z: 1},
	{f: K.kto + 8, x: cx(7), y: 500, z: 1.16},
	{f: SCENE, x: cx(7), y: 500, z: 1.2},
];
const DIPS: [number, number, number][] = [
	[K.l3 - 14, K.l3 + 12, 0.12],
	[K.l5 - 12, K.l5 + 16, 0.12],
	[K.l12 - 12, K.l12 + 14, 0.12],
	[K.l15 - 12, K.l15 + 14, 0.12],
	[K.l20 - 12, K.l20 + 14, 0.12],
	[K.l24 - 12, K.l24 + 14, 0.12],
	[K.l27 - 12, K.l27 + 14, 0.12],
];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.y2009), kind: 'punch', amp: 0.4},
	{t: s(K.kryz), kind: 'shake', amp: 0.6},
	{t: s(K.d1900), kind: 'punch', amp: 0.7},
	{t: s(K.amber) + 0.25, kind: 'both', amp: 0.8},
	{t: s(K.ile), kind: 'punch', amp: 0.5},
	{t: s(K.p165), kind: 'punch', amp: 0.6},
	{t: s(K.gwar), kind: 'both', amp: 0.8},
	{t: s(K.bankiem), kind: 'punch', amp: 0.5},
	{t: s(K.upada), kind: 'shake', amp: 0.4},
	{t: s(K.cert), kind: 'both', amp: 0.7},
	{t: s(K.linie), kind: 'punch', amp: 0.4},
	{t: s(K.kto), kind: 'punch', amp: 0.5},
];

// ---------- wspólne drobiazgi ----------
const Calendar: React.FC<{text: string; w?: number; top?: string}> = ({text, w = 200, top = P.red}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.55} width={w} height={w} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
		<rect x={-w / 2} y={-w * 0.55} width={w} height={w * 0.26} rx={16} fill={top} />
		<FText text={text} x={0} y={w * 0.3} size={w * 0.34} fill={P.navy} />
	</g>
);
const Banknote: React.FC<{w?: number}> = ({w = 160}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.27} width={w} height={w * 0.54} rx={10} fill={P.grass} stroke={P.navy} strokeWidth={6} />
		<circle r={w * 0.17} fill={P.greenLight} stroke={P.navy} strokeWidth={4} />
		<FText text="zł" x={0} y={w * 0.07} size={w * 0.18} fill={P.navy} />
	</g>
);
const Shop: React.FC<{w?: number; sign?: string}> = ({w = 220, sign = 'AMBER GOLD'}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.8} width={w} height={w * 0.8} fill={P.paper} stroke={P.navy} strokeWidth={6} />
		<rect x={-w / 2 + 12} y={-w * 0.8 + 12} width={w - 24} height={w * 0.2} rx={6} fill={P.gold} stroke={P.navy} strokeWidth={4} />
		<FText text={sign} x={0} y={-w * 0.8 + 12 + w * 0.15} size={w * 0.11} fill={P.navy} />
		<rect x={-w / 2 + 16} y={-w * 0.46} width={w * 0.44} height={w * 0.3} fill={P.sky} stroke={P.navy} strokeWidth={4} />
		<rect x={w * 0.08} y={-w * 0.46} width={w * 0.3} height={w * 0.46} fill={P.navy} />
	</g>
);
const Rain: React.FC<{f: number; x0: number; x1: number; y0: number; y1: number; amt: number; seed: number}> = ({f, x0, x1, y0, y1, amt, seed}) => (
	<g stroke={P.blue} strokeWidth={5} strokeLinecap="round" opacity={0.6 * amt}>
		{Array.from({length: 46}).map((_, i) => {
			const x = x0 + hsh(seed + i) * (x1 - x0);
			const y = y0 + ((hsh(seed + i + 50) * (y1 - y0) + f * 22) % (y1 - y0));
			return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 34} />;
		})}
	</g>
);

// ---------- 0: Gdańsk 2009, kryzys ----------
const Gdansk: React.FC<{f: number}> = ({f}) => {
	const crack = ip(f, K.kryz, K.kryz + 12, 0, 1, EIO);
	const turn = ip(f, K.ufaja - 4, K.ufaja + 6, 1, -1, EIO);
	const bar = pk(f, K.zloto) * (1 + 0.12 * pk(f, K.zloto + 10) + 0.12 * pk(f, K.zloto + 20));
	const houses = ['#D8C6A8', '#C9A88A', P.goldLight, '#B9A58C', '#C8BFA9', '#A8B2A4', '#D6B79A'];
	return (
		<g>
			<rect x={0} y={0} width={RW} height={1080} fill={P.sky} />
			<rect x={0} y={700} width={RW} height={100} fill="#7F9BAA" />
			{[0, 1, 2].map((i) => (
				<line key={i} x1={100 + i * 500 + ((f * 2) % 500)} y1={730 + i * 20} x2={260 + i * 500 + ((f * 2) % 500)} y2={730 + i * 20} stroke={P.white} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
			))}
			<Room w={RW} h={1080} floor={800} tone="transparent" />
			{/* kamienice */}
			{houses.map((c, i) => {
				const x = 820 + i * 130;
				const h = 300 + hsh(i) * 120;
				return (
					<g key={i}>
						<path d={`M ${x} 700 L ${x} ${700 - h} L ${x + 65} ${700 - h - 70} L ${x + 130} ${700 - h} L ${x + 130} 700 Z`} fill={c} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
						{[0, 1, 2].map((r) => [0, 1].map((cc) => <rect key={`${r}${cc}`} x={x + 22 + cc * 52} y={700 - h + 30 + r * 80} width={34} height={50} fill={P.slate} />))}
					</g>
				);
			})}
			{/* Żuraw */}
			<g>
				<rect x={330} y={300} width={140} height={400} fill="#9C5A40" stroke={P.navy} strokeWidth={7} />
				<rect x={600} y={300} width={140} height={400} fill="#9C5A40" stroke={P.navy} strokeWidth={7} />
				<path d="M 300 300 L 470 300 L 470 180 L 640 120 L 780 180 L 780 300 L 600 300 L 600 260 L 470 260" fill="#5C4A3A" stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
				<rect x={470} y={160} width={130} height={140} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
				<path d="M 455 300 Q 535 360 615 300" fill="none" stroke={P.navy} strokeWidth={6} />
			</g>
			<FText text="Gdańsk" x={535} y={90} size={64} fill={P.navy} />
			{f >= K.y2009 - 2 && (
				<G x={200} y={180} s={pk(f, K.y2009 - 2)} r={-4}>
					<Calendar text="2009" />
				</G>
			)}
			{/* bank pęka, ludzie się odwracają */}
			<G x={1640} y={800} s={0.9}>
				<Columns w={300} h={360} label="BANK" labelSize={44} />
				{crack > 0 && <path d="M -40 -420 L -10 -330 L -50 -250 L 0 -160 L -30 -60" fill="none" stroke={P.navy} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crack} />}
			</G>
			{[1400, 1500, 1600, 1700].map((x, i) => (
				<G key={i} x={x} y={1000} s={1.25}>
					<g transform={`scale(${turn} 1)`}>
						<Mini {...miniLook(200 + i)} mood={f >= K.ufaja ? 'sad' : 'ok'} />
					</g>
					{f >= K.ufaja && <FText text="?" x={0} y={-300} size={70} fill={P.red} opacity={prog(f, K.ufaja + i * 2, 6)} />}
				</G>
			))}
			{f >= K.zloto && (
				<G x={1130} y={260} s={bar}>
					<GoldBar w={180} glow={0.6} />
					<path d="M 120 -20 L 120 -120 M 90 -90 L 120 -124 L 150 -90" fill="none" stroke={P.gold} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
				</G>
			)}
		</g>
	);
};

// ---------- 1: wykres ceny złota ----------
const PTS: [number, number][] = [
	[360, 650],
	[560, 610],
	[760, 560],
	[960, 520],
	[1160, 450],
	[1340, 370],
	[1560, 230],
];
const Chart: React.FC<{f: number}> = ({f}) => {
	const axes = ip(f, K.l3 - 4, K.l3 + 12, 0, 1, EIO);
	const p = ip(f, K.y2011 - 6, K.d1900 + 2, 0, PTS.length - 1, EIO);
	const n = Math.floor(p);
	const pts = PTS.slice(0, n + 1);
	if (n < PTS.length - 1) {
		const a = PTS[n];
		const b = PTS[n + 1];
		pts.push([a[0] + (b[0] - a[0]) * (p - n), a[1] + (b[1] - a[1]) * (p - n)]);
	}
	const tip = pts[pts.length - 1];
	const rich = 1 + 0.08 * pk(f, K.bog) + 0.08 * pk(f, K.bog + 8);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			<path d="M 300 150 L 300 760 L 1700 760" fill="none" stroke={P.navy} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - axes} />
			<FText text="cena uncji złota (USD)" x={320} y={130} size={40} fill={P.slate} anchor="start" opacity={axes} />
			{['2009', '2010', '2011'].map((y, i) => (
				<FText key={y} text={y} x={360 + i * 400} y={815} size={40} fill={P.slate} opacity={axes} />
			))}
			{p > 0 && <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={P.gold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />}
			{p > 0 && <circle cx={tip[0]} cy={tip[1]} r={14} fill={P.gold} stroke={P.navy} strokeWidth={5} />}
			{f >= K.d1900 && (
				<G x={1560} y={230} s={pk(f, K.d1900)}>
					<path d="M 0 -60 L 16 -18 L 60 -18 L 24 8 L 38 52 L 0 26 L -38 52 L -24 8 L -60 -18 L -16 -18 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
				</G>
			)}
			{f >= K.d1900 + 4 && (
				<G x={1300} y={180} s={pk(f, K.d1900 + 4)}>
					<Plate text="1920 $" label="rekord: wrzesień 2011" w={400} size={80} />
				</G>
			)}
			{f >= K.l4 - 6 && (
				<G x={430} y={980} s={1.1 * pk(f, K.l4 - 6) * rich}>
					<Adult look={{suit: '#6E7D61', hair: '#3B2A20', shirt: P.white, hairStyle: 'side'}} mood={f >= K.bog ? 'smile' : 'neutral'} armR={70} holdR={<GoldBar w={120} />} seed={3} />
				</G>
			)}
		</g>
	);
};

// ---------- 2: oddział i tablica ofert ----------
const Office: React.FC<{f: number}> = ({f}) => {
	const sign = ip(f, K.l5 + 10, K.amber + 4, -400, 0, EBACK);
	const mode = f < K.ile - 4 ? 0 : f < K.lokata - 4 ? 1 : f < K.l11 - 4 ? 2 : 3;
	const flipAt = [K.ile - 4, K.lokata - 4, K.l11 - 4];
	let flip = 1;
	for (const a of flipAt) if (f >= a - 5 && f < a + 5) flip = Math.abs((f - a) / 5);
	const nodes = [
		{x: 1410, y: 230, at: K.przyn, el: <Banknote w={170} />, label: 'pieniądze'},
		{x: 1680, y: 430, at: K.kupuje, el: <GoldBar w={150} />, label: 'złoto'},
		{x: 1410, y: 640, at: K.przech, el: <VaultDoor r={70} />, label: 'skarbiec'},
		{x: 1140, y: 430, at: K.placi, el: <Coin r={52} />, label: 'odsetki'},
	];
	const rate = f < K.p165 ? (f < K.p6 ? 0 : 6) : Math.round(ip(f, K.p165, K.p165 + 14, 6, 16.5) * 10) / 10;
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			{/* fasada oddziału */}
			<rect x={120} y={190} width={740} height={610} fill={P.paper} stroke={P.navy} strokeWidth={8} />
			<rect x={180} y={420} width={300} height={260} fill={P.sky} stroke={P.navy} strokeWidth={6} />
			{[0, 1, 2].map((i) => (
				<G key={i} x={240 + i * 90} y={650}>
					<GoldBar w={70} />
				</G>
			))}
			<rect x={560} y={420} width={220} height={380} fill={P.navy} />
			<circle cx={750} cy={610} r={10} fill={P.gold} />
			<G x={490} y={270 + sign}>
				<rect x={-330} y={-60} width={660} height={120} rx={20} fill={P.gold} stroke={P.navy} strokeWidth={8} />
				<FText text="AMBER GOLD" x={0} y={24} size={72} fill={P.navy} />
			</G>
			{/* tablica ofert */}
			<rect x={980} y={110} width={860} height={640} rx={28} fill={P.navy} stroke={P.navy} strokeWidth={8} />
			<g transform={`translate(1410 430) scale(1 ${flip}) translate(-1410 -430)`}>
				{mode === 0 &&
					f >= K.przyn - 4 && (
						<g>
							{nodes.map((n, i) => {
								const nx = nodes[(i + 1) % 4];
								const a = ip(f, n.at + 4, n.at + 14, 0, 1, EIO);
								return a > 0 ? <line key={`l${i}`} x1={n.x} y1={n.y} x2={n.x + (nx.x - n.x) * a} y2={n.y + (nx.y - n.y) * a} stroke={P.gold} strokeWidth={8} strokeDasharray="14 12" /> : null;
							})}
							{nodes.map((n, i) =>
								f >= n.at - 2 ? (
									<G key={i} x={n.x} y={n.y} s={pk(f, n.at - 2)}>
										<circle r={88} fill="#2E3B4E" stroke={P.gold} strokeWidth={5} />
										{n.el}
										<FText text={n.label} x={0} y={128} size={34} fill={P.bg} />
									</G>
								) : null,
							)}
						</g>
					)}
				{mode === 1 && (
					<g>
						<FText text="oprocentowanie" x={1410} y={240} size={54} fill={P.bg} />
						{f < K.p6 ? (
							<FText text="?" x={1410} y={560} size={260} fill={P.gold} />
						) : (
							<FText text={`do ${String(rate).replace('.', ',')}%`} x={1410} y={520} size={170} fill={P.gold} />
						)}
						{f >= K.p6 && <FText text="rocznie" x={1410} y={640} size={54} fill={P.bg} />}
					</g>
				)}
				{mode === 2 && (
					<g>
						<FText text="lokata na 3 miesiące" x={1410} y={240} size={54} fill={P.bg} />
						{f >= K.p112 - 2 && <FText text="11,2%" x={1410} y={480} size={190} fill={P.gold} opacity={prog(f, K.p112 - 2, 6)} />}
						<FText text="w skali roku" x={1410} y={570} size={44} fill={P.bg} />
						{f >= K.gwar && (
							<G x={1410} y={660} s={f < K.gwar + 6 ? 2.2 - 1.2 * prog(f, K.gwar, 6) : 1} r={-6}>
								<rect x={-260} y={-56} width={520} height={100} rx={12} fill="none" stroke={P.red} strokeWidth={10} />
								<FText text="GWARANTOWANE" x={0} y={20} size={64} fill={P.red} />
							</G>
						)}
					</g>
				)}
				{mode === 3 && (
					<g>
						<line x1={1080} y1={640} x2={1740} y2={640} stroke={P.bg} strokeWidth={6} />
						<rect x={1180} y={640 - 110 * ip(f, K.l11 + 2, K.l11 + 14, 0, 1)} width={160} height={110 * ip(f, K.l11 + 2, K.l11 + 14, 0, 1)} fill={P.slate} />
						<rect x={1480} y={640 - 380 * ip(f, K.wiecej, K.wiecej + 14, 0, 1, EBACK)} width={160} height={380 * ip(f, K.wiecej, K.wiecej + 14, 0, 1, EBACK)} fill={P.gold} />
						<FText text="banki" x={1260} y={700} size={44} fill={P.bg} />
						<FText text="Amber Gold" x={1560} y={700} size={44} fill={P.gold} />
					</g>
				)}
			</g>
		</g>
	);
};

// ---------- 3: mennice, regulamin, skarbiec ----------
const Promise3: React.FC<{f: number}> = ({f}) => {
	const scroll = ip(f, K.reg - 2, K.reg + 16, 0, 1, EOUT);
	const hl = ip(f, K.wlasc, K.wlasc + 12, 0, 1, EIO);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			<G x={380} y={420} s={pk(f, K.szw - 6)}>
				<path d="M -200 -40 L -140 -110 L -40 -100 L 30 -140 L 120 -110 L 200 -60 L 180 20 L 90 60 L -20 50 L -120 90 L -190 40 Z" fill={P.red} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
				<rect x={-16} y={-60} width={32} height={100} fill={P.white} />
				<rect x={-50} y={-26} width={100} height={32} fill={P.white} />
				<FText text="mennice w Szwajcarii" x={0} y={170} size={40} fill={P.navy} />
				<G x={150} y={-150} r={f * 3}>
					<Coin r={46} />
				</G>
			</G>
			{f >= K.reg - 4 && (
				<g>
					<rect x={720} y={150} width={480} height={80} rx={40} fill="#C8B48E" stroke={P.navy} strokeWidth={6} />
					<rect x={740} y={190} width={440} height={520 * scroll} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="REGULAMIN" x={960} y={270} size={44} fill={P.navy} opacity={scroll} />
					{[0, 1, 2, 3, 4, 5].map((i) => (310 + i * 60 < 190 + 520 * scroll ? <line key={i} x1={790} x2={i === 3 ? 1060 : 1130} y1={330 + i * 60} y2={330 + i * 60} stroke={P.grey} strokeWidth={10} strokeLinecap="round" /> : null))}
					{hl > 0 && (
						<g>
							<rect x={770} y={496} width={380 * hl} height={52} rx={8} fill={P.goldLight} />
							<FText text="klient = właściciel złota" x={960} y={534} size={36} fill={P.navy} opacity={hl} />
						</g>
					)}
				</g>
			)}
			<G x={1540} y={480} s={pk(f, K.l14 - 4)}>
				<VaultDoor r={170} spin={f * 1.5} />
				<rect x={-80} y={200} width={160} height={70} rx={10} fill={P.gold} stroke={P.navy} strokeWidth={5} />
				<FText text="2011" x={0} y={250} size={46} fill={P.navy} />
			</G>
		</g>
	);
};

// ---------- 4: parasol BFG ----------
const Umbrella: React.FC<{open: number; label?: string; color?: string}> = ({open, label, color = P.gold}) => (
	<g>
		<line x1={0} y1={-20} x2={0} y2={200} stroke={P.navy} strokeWidth={10} />
		<path d="M 0 200 Q 0 230 -26 230" fill="none" stroke={P.navy} strokeWidth={10} strokeLinecap="round" />
		<g transform={`scale(${0.15 + 0.85 * open} 1)`}>
			<path d="M -260 0 Q -250 -170 0 -180 Q 250 -170 260 0 Q 216 -30 174 0 Q 130 -30 87 0 Q 43 -30 0 0 Q -43 -30 -87 0 Q -130 -30 -174 0 Q -216 -30 -260 0 Z" fill={color} stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
		</g>
		{label && open > 0.6 && <FText text={label} x={0} y={-70} size={54} fill={P.navy} opacity={(open - 0.6) / 0.4} />}
	</g>
);
const BFG: React.FC<{f: number}> = ({f}) => {
	const umb = ip(f, K.gwarancjami, K.gwarancjami + 16, 0, 1, EBACK);
	const rain = ip(f, K.upada, K.upada + 12, 0, 1);
	const agUmb = live(f, K.nikt - 10, K.nikt + 8, 6);
	const q = pk(f, K.nikt + 6);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} tone="#DAD3C6" />
			<Rain f={f} x0={0} x1={RW} y0={0} y1={800} amt={rain} seed={4} />
			<G x={520} y={800}>
				<Columns w={340} h={360} label="BANK" labelSize={48} />
			</G>
			{umb > 0 && (
				<G x={520} y={300}>
					<Umbrella open={umb} label="BFG" />
				</G>
			)}
			{f >= K.e100 - 2 && (
				<G x={850} y={170} s={pk(f, K.e100 - 2)} r={6}>
					<rect x={-150} y={-46} width={300} height={92} rx={14} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="do 100 tys. €" x={0} y={16} size={46} fill={P.navy} />
				</G>
			)}
			<G x={1400} y={800}>
				<Shop w={420} />
				{f >= K.bankiem - 2 && (
					<g opacity={prog(f, K.bankiem - 2, 6)}>
						<FText text="BANK?" x={0} y={-400} size={64} fill={P.navy} />
						<path d="M -110 -460 L 110 -380 M 110 -460 L -110 -380" stroke={P.red} strokeWidth={14} strokeLinecap="round" />
					</g>
				)}
				{f >= K.licencji - 2 && (
					<G x={-110} y={-210} s={pk(f, K.licencji - 2)}>
						<rect x={-60} y={-70} width={120} height={140} rx={6} fill="none" stroke={P.navy} strokeWidth={6} strokeDasharray="12 10" />
						<FText text="licencja?" x={0} y={110} size={30} fill={P.navy} />
					</G>
				)}
			</G>
			{agUmb > 0 && (
				<G x={1400} y={260} o={agUmb}>
					<Umbrella open={agUmb} />
				</G>
			)}
			{f >= K.nikt + 6 && <FText text="?" x={1400} y={250} size={240 * q} fill={P.red} />}
			{f >= K.nikt + 12 && <Rain f={f + 7} x0={1150} x1={1650} y0={0} y1={800} amt={1} seed={9} />}
		</g>
	);
};

// ---------- 5: sztabka zamienia się w kartkę ----------
const Morph: React.FC<{f: number}> = ({f}) => {
	const tremble = f >= K.sztabki && f < K.cert ? Math.sin(f * 2.4) * 6 : 0;
	const m = ip(f, K.cert - 6, K.cert + 6, 0, 1, EIO);
	const bubble = pk(f, K.skarbcu2 - 6);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			{/* ręka */}
			<path d="M 520 1080 L 700 620 Q 760 560 860 580 L 1060 600 Q 1110 610 1100 650 Q 1090 690 1040 690 L 900 690 L 820 1080 Z" fill={P.skin} stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
			<path d="M 520 1080 L 640 780 L 860 780 L 820 1080 Z" fill="#5C6B7A" stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
			<G x={940 + tremble} y={590} r={tremble * 0.5}>
				{m < 1 && (
					<g opacity={1 - m} transform={`scale(${1 - 0.5 * m})`}>
						<GoldBar w={300} glow={0.8} />
					</g>
				)}
				{m > 0 && (
					<g transform={`translate(0 -120) scale(${m * 1.6}) rotate(${(1 - m) * 40})`}>
						<Cert w={150} />
					</g>
				)}
			</G>
			{m > 0.2 && m < 0.95 && (
				<g fill={P.white} opacity={1 - Math.abs(m - 0.55) * 2}>
					{Array.from({length: 10}).map((_, i) => {
						const a = (i / 10) * Math.PI * 2;
						return <circle key={i} cx={940 + Math.cos(a) * 200 * m} cy={520 + Math.sin(a) * 140 * m} r={30 - 20 * m} />;
					})}
				</g>
			)}
			{bubble > 0.02 && (
				<g opacity={1}>
					{[0, 1, 2].map((i) => (
						<circle key={i} cx={1120 + i * 70} cy={380 - i * 60} r={(14 + i * 8) * bubble} fill={P.white} stroke={P.navy} strokeWidth={5} />
					))}
					<G x={1540} y={260} s={bubble}>
						<ellipse rx={260} ry={190} fill={P.white} stroke={P.navy} strokeWidth={7} />
						<VaultDoor r={110} open={0.75} />
						<G x={-20} y={30} s={0.5}>
							<GoldBar w={80} glow={0.5} />
						</G>
						{f >= K.zloto2 && <FText text="?" x={170} y={-60} size={120} fill={P.red} opacity={prog(f, K.zloto2, 6)} />}
					</G>
				</g>
			)}
		</g>
	);
};

// ---------- 6: odsetki na czas, firma rośnie ----------
const Grow: React.FC<{f: number}> = ({f}) => {
	const page = f >= K.ods ? Math.min(4, Math.floor((f - K.ods) / 10)) : 0;
	const months = ['STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ'];
	const planeP = clamp01((f - (K.linie - 10)) / 40);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			<G x={300} y={1000} s={1.2}>
				<Adult look={{suit: '#7A4E3A', hair: '#A07850', shirt: P.white, hairStyle: 'short'}} mood={f >= K.l24 ? 'smile' : 'neutral'} armR={f >= K.ods - 6 ? 60 : 12} seed={11} />
			</G>
			<G x={640} y={320} r={-3}>
				<rect x={-130} y={-150} width={260} height={280} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
				<rect x={-130} y={-150} width={260} height={64} rx={16} fill={P.red} />
				<FText text={months[page]} x={0} y={-104} size={36} fill={P.white} />
				<FText text="1" x={0} y={60} size={130} fill={P.navy} />
			</G>
			{[0, 1, 2, 3].map((i) => {
				const p = clamp01((f - (K.ods + i * 10)) / 14);
				if (p <= 0) return null;
				const q = arcPt(EIN(p), 640, 440, 470, 760, 80);
				return (
					<G key={i} x={q.x} y={p >= 1 ? 760 - i * 14 : q.y} r={p * 200}>
						<Coin r={28} />
					</G>
				);
			})}
			{Array.from({length: 6}).map((_, i) => (
				<G key={i} x={1020 + (i % 3) * 300} y={i < 3 ? 520 : 820} s={0.9 * pk(f, K.rosnie + i * 3)}>
					<Shop w={240} />
				</G>
			))}
			{planeP > 0 && planeP < 1 && (
				<G x={-200 + 2400 * EIO(planeP)} y={170 - 60 * planeP} s={0.7} r={-6}>
					<Plane tail={<FText text="AG" x={0} y={0} size={40} fill={P.gold} />} />
				</G>
			)}
		</g>
	);
};

// ---------- 7: kto stał za tym wszystkim ----------
const Shadow: React.FC<{f: number}> = ({f}) => {
	const spot = ip(f, K.kto - 6, K.kto + 6, 0, 1);
	const dark = ip(f, K.end - 2, SCENE, 0, 1, EIN);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			<path d={`M 860 0 L 1060 0 L 1260 800 L 660 800 Z`} fill={P.goldLight} opacity={0.35 * spot} />
			<G x={960} y={760} s={1.5}>
				<Mini suit="#0E1520" hair="#0E1520" skin="#0E1520" />
			</G>
			<rect x={520} y={560} width={880} height={240} fill="#8C6A4A" stroke={P.navy} strokeWidth={8} />
			<rect x={500} y={540} width={920} height={34} rx={8} fill="#6E5139" stroke={P.navy} strokeWidth={7} />
			<G x={700} y={540}>
				<GoldBar w={120} />
			</G>
			<G x={1210} y={520} r={-8}>
				<Cert w={90} />
			</G>
			<rect x={0} y={0} width={RW} height={1080} fill={P.navy} opacity={dark} />
		</g>
	);
};

const ROOMS = [Gdansk, Chart, Office, Promise3, BFG, Morph, Grow, Shadow];

export const AmberR1: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 1" title="Obietnica" icon={<GoldBar w={300} glow={1} />} frames={CARD} />}>
		<AmberStage lines={LINES} vo="am1_vo.wav" keys={KEYS} dips={DIPS} hits={HITS}>
			{(f, cam) => (
				<g>
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - cx(i)) < 960 / cam.z + 1100 ? (
							<g key={i} transform={`translate(${i * RW} 0)`}>
								<R f={f} />
							</g>
						) : null,
					)}
				</g>
			)}
		</AmberStage>
	</WithCard>
);
