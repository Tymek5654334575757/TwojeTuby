// Amber Gold, rozdział 5 „Upadek” (tylko 16:9).
// Drzwi oddziału zatrzaskują się, kartka LIKWIDACJA → kolejka po horyzont, 18 tys. i 851 mln zł, para z pustym słoikiem →
// syndyk licytuje i liczy, zwrot najwyżej 20% → pierwsi z monetami, ostatni z pustymi rękami, światła gasną od końca →
// raport NBP z lupą, czerwone kółko przy prokuraturze → kalendarz 2012…2018 i pierwsza kropla → słupek 10 000 zł kruszy się do 2 000.
import React from 'react';
import {LINES} from './am5.gen';
import {AmberStage, WithCard, CardScene, makeT, endOf, ip, pk, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit, P, G, Adult, Mini, Coin, FText, clamp01, prog, Room, Plate, Columns, Plane} from './kit';
import {Calendar, Gavel, strike, Magnifier, Pile, fall, LAY, kk, type Lay} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R5_FRAMES = CARD + SCENE;

const K = {
	likwid: T(0, 'likwidację'),
	l1: T(1),
	wplat: T(1, 'wpłat'),
	odsetek: T(1, 'odsetek'),
	l2: T(2),
	tys18: T(2, '18'),
	pokrz: T(2, 'pokrzywdzonych'),
	l3: T(3),
	szkody: T(3, 'szkody'),
	l4: T(4),
	t45: T(4, '45'),
	l5: T(5),
	oszcz: T(5, 'oszczędności'),
	zycia: T(5, 'życia'),
	l6: T(6),
	najw: T(6, 'największych'),
	polski: T(6, 'polski'),
	l7: T(7),
	syndyk: T(7, 'syndyk'),
	l8: T(8),
	odzysk: T(8, 'odzyskiwał'),
	liczyl: T(8, 'liczył'),
	l9: T(9),
	p20: T(9, '20%'),
	wplacili: T(9, 'wpłacili'),
	l10: T(10),
	stracili: T(10, 'stracili'),
	koncu: T(10, 'końcu'),
	l11: T(11),
	pierwsi: T(11, 'pierwsi'),
	ostatni: T(11, 'ostatni'),
	nic: T(11, 'nic'),
	l12: T(12),
	nbp: T(12, 'narodowy'),
	raport: T(12, 'raport'),
	l13: T(13),
	bledy: T(13, 'błędy'),
	instyt: T(13, 'instytucji'),
	prok: T(13, 'prokuratury'),
	wrzeszcz: T(13, 'gdańsku-wrzeszczu'),
	l14: T(14),
	wyplaty: T(14, 'wypłaty'),
	y2018: T(14, '2018'),
	l15: T(15),
	szesc: T(15, 'sześć'),
	upadku: T(15, 'upadku'),
	l16: T(16),
	t10: T(16, '10'),
	zloto: T(16, 'złoto'),
	l17: T(17),
	t2: T(17, '2'),
	end: endOf(LINES),
};
const v = false;
const KEYS: CK[] = [
	kk(v, 0, 0, [0, 0, 1.08], [0, 0, 1]),
	kk(v, K.likwid + 6, 0, [60, -20, 1.14], [0, 0, 1]),
	kk(v, K.l1 + 20, 0, [0, 0, 1], [0, 0, 1]),
	kk(v, K.l2 - 12, 0, [0, 0, 1.02], [0, 0, 1]),
	kk(v, K.l2 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.szkody + 10, 1, [0, 0, 1.02], [0, 0, 1]),
	kk(v, K.t45 + 6, 1, [-240, 60, 1.45], [0, 0, 1]),
	kk(v, K.zycia + 10, 1, [-240, 60, 1.5], [0, 0, 1]),
	kk(v, K.l6 + 10, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.l7 - 12, 1, [0, 0, 1.02], [0, 0, 1]),
	kk(v, K.l7 + 14, 2, [0, 0, 1], [0, 0, 1]),
	kk(v, K.liczyl + 8, 2, [-80, 0, 1.1], [0, 0, 1]),
	kk(v, K.wplacili + 10, 2, [60, 0, 1.06], [0, 0, 1]),
	kk(v, K.l10 - 12, 2, [0, 0, 1.03], [0, 0, 1]),
	kk(v, K.l10 + 14, 3, [0, 0, 1], [0, 0, 1]),
	kk(v, K.nic + 12, 3, [140, 20, 1.12], [0, 0, 1]),
	kk(v, K.l12 - 12, 3, [0, 0, 1.03], [0, 0, 1]),
	kk(v, K.l12 + 14, 4, [0, 0, 1], [0, 0, 1]),
	kk(v, K.wrzeszcz + 10, 4, [120, 0, 1.12], [0, 0, 1]),
	kk(v, K.l14 - 12, 4, [0, 0, 1.03], [0, 0, 1]),
	kk(v, K.l14 + 14, 5, [0, 0, 1], [0, 0, 1]),
	kk(v, K.upadku + 10, 5, [0, 0, 1.06], [0, 0, 1]),
	kk(v, K.l16 - 12, 5, [0, 0, 1.02], [0, 0, 1]),
	kk(v, K.l16 + 14, 6, [0, 0, 1], [0, 0, 1]),
	kk(v, K.t2 + 10, 6, [0, 0, 1.08], [0, 0, 1]),
	kk(v, SCENE, 6, [0, 0, 1.06], [0, 0, 1]),
];
const DIPS: [number, number, number][] = [K.l2, K.l7, K.l10, K.l12, K.l14, K.l16].map((b) => [b - 12, b + 14, 0.12]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.likwid), kind: 'both', amp: 0.9},
	{t: s(K.tys18), kind: 'punch', amp: 0.5},
	{t: s(K.l3), kind: 'punch', amp: 0.6},
	{t: s(K.t45), kind: 'punch', amp: 0.4},
	{t: s(K.najw), kind: 'punch', amp: 0.6},
	{t: s(K.l8 + 6), kind: 'punch', amp: 0.4},
	{t: s(K.p20), kind: 'both', amp: 0.6},
	{t: s(K.nic), kind: 'shake', amp: 0.4},
	{t: s(K.prok), kind: 'punch', amp: 0.6},
	{t: s(K.y2018), kind: 'punch', amp: 0.5},
	{t: s(K.t2 + 4), kind: 'both', amp: 0.8},
];
const FL = 800;

// --- rekwizyty ---
const Jar: React.FC<{fill: number}> = ({fill}) => (
	<g>
		<rect x={-70} y={-170} width={140} height={24} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={5} />
		<path d="M -80 -146 Q -86 -120 -80 -100 L -80 -10 Q -80 0 -66 0 L 66 0 Q 80 0 80 -10 L 80 -100 Q 86 -120 80 -146 Z" fill="#DDE6EA" fillOpacity={0.7} stroke={P.navy} strokeWidth={6} />
		{fill > 0 && <rect x={-72} y={-120 * fill} width={144} height={120 * fill - 8} fill={P.gold} opacity={0.9} />}
		<rect x={-56} y={-100} width={112} height={40} rx={6} fill={P.paper} stroke={P.navy} strokeWidth={3} />
		<FText text="oszczędności" x={0} y={-72} size={20} fill={P.navy} />
	</g>
);
const Calc: React.FC<{text: string}> = ({text}) => (
	<g>
		<rect x={-70} y={-100} width={140} height={190} rx={14} fill={P.slate} stroke={P.navy} strokeWidth={6} />
		<rect x={-52} y={-84} width={104} height={44} rx={6} fill="#C9D8C0" />
		<FText text={text} x={44} y={-50} size={30} fill={P.navy} anchor="end" />
		{Array.from({length: 9}).map((_, i) => (
			<rect key={i} x={-52 + (i % 3) * 38} y={-28 + Math.floor(i / 3) * 36} width={28} height={26} rx={5} fill={P.paper} />
		))}
	</g>
);
const Desk: React.FC = () => (
	<g>
		<rect x={-110} y={-90} width={220} height={22} rx={4} fill="#8C6A4A" stroke={P.navy} strokeWidth={5} />
		<rect x={-100} y={-68} width={18} height={68} fill="#6E5139" stroke={P.navy} strokeWidth={4} />
		<rect x={82} y={-68} width={18} height={68} fill="#6E5139" stroke={P.navy} strokeWidth={4} />
	</g>
);
const Car: React.FC = () => (
	<g>
		<path d="M -110 -30 L -80 -30 L -50 -78 L 50 -78 L 80 -30 L 110 -30 L 110 10 L -110 10 Z" fill={P.red} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -36 -66 L 36 -66 L 58 -34 L -58 -34 Z" fill={P.sky} stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />
		{[-62, 62].map((x) => (
			<circle key={x} cx={x} cy={12} r={22} fill={P.navy} stroke={P.slate} strokeWidth={6} />
		))}
	</g>
);
const Xmark: React.FC<{p: number; r?: number}> = ({p, r = 70}) => (
	<g>
		<path d={`M ${-r} ${-r} L ${r} ${r}`} stroke={P.red} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 2)} />
		<path d={`M ${r} ${-r} L ${-r} ${r}`} stroke={P.red} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 2 - 1)} />
	</g>
);
const Tag: React.FC<{text: string; w?: number; c?: string; tc?: string; size?: number}> = ({text, w = 320, c = P.navy, tc = P.gold, size = 44}) => (
	<g>
		<rect x={-w / 2} y={-42} width={w} height={84} rx={16} fill={c} stroke={P.navy} strokeWidth={5} />
		<FText text={text} x={0} y={size * 0.34} size={size} fill={tc} />
	</g>
);

// --- 0: drzwi i kartka LIKWIDACJA ---
const Door: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const slam = ip(f, K.likwid - 8, K.likwid, 0, 1, EIN);
	const paper = ip(f, K.likwid + 4, K.likwid + 16, 0, 1, EBACK);
	const queue = (i: number) => ip(f, K.l1 - 10 + i * 4, K.l1 + 10 + i * 4, 0, 1, EOUT);
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			<G x={1060} y={FL}>
				<rect x={-460} y={-620} width={920} height={620} fill={P.paper} stroke={P.navy} strokeWidth={6} />
				<rect x={-440} y={-600} width={880} height={110} rx={8} fill={P.gold} stroke={P.navy} strokeWidth={5} />
				<FText text="AMBER GOLD" x={0} y={-524} size={70} fill={P.navy} />
				<rect x={-420} y={-420} width={330} height={250} fill={P.sky} stroke={P.navy} strokeWidth={5} />
				{/* drzwi */}
				<rect x={20} y={-440} width={260} height={440} fill={P.navy} />
				<g transform={`translate(20 0) scale(${0.15 + 0.85 * slam} 1)`}>
					<rect x={0} y={-440} width={260} height={440} fill="#8C6A4A" stroke={P.navy} strokeWidth={6} />
					<rect x={40} y={-400} width={180} height={200} fill={P.sky} stroke={P.navy} strokeWidth={5} />
					<circle cx={230} cy={-200} r={12} fill={P.gold} />
				</g>
				{paper > 0 && (
					<G x={150} y={-300} s={paper} r={-4}>
						<rect x={-110} y={-70} width={220} height={140} fill={P.white} stroke={P.navy} strokeWidth={4} />
						<FText text="LIKWIDACJA" x={0} y={12} size={36} fill={P.red} />
						<rect x={-130} y={-80} width={60} height={20} fill="#E8D9A8" opacity={0.9} transform="rotate(-30 -100 -70)" />
						<rect x={70} y={-80} width={60} height={20} fill="#E8D9A8" opacity={0.9} transform="rotate(30 100 -70)" />
					</G>
				)}
			</G>
			<G x={250} y={200} s={pk(f, 4)} r={-4}>
				<Calendar text="13 sierpnia" top="2012" w={250} />
			</G>
			{/* kolejka */}
			{Array.from({length: 6}).map((_, i) => {
				const a = queue(i);
				if (a <= 0) return null;
				return (
					<G key={i} x={1040 - 160 - i * 150 + (1 - a) * -300} y={FL} s={1.25}>
						<Mini suit={['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#9C5A40'][i]} hair={['#2B2420', '#8A8A8A', '#A07850', '#3B2A20', '#6B4A2E', '#C2B8A8'][i]} up={f >= K.wplat ? 0.3 : 0} mood={f >= K.wplat ? 'sad' : 'ok'} />
					</G>
				);
			})}
			{f >= K.wplat - 4 && (
				<G x={420} y={470} s={pk(f, K.wplat - 4)}>
					<Pile n={6} r={30} />
					<Xmark p={ip(f, K.wplat, K.wplat + 10, 0, 1, EIO)} r={70} />
					<FText text="wpłaty" x={0} y={110} size={40} fill={P.navy} />
				</G>
			)}
			{f >= K.odsetek - 4 && (
				<G x={700} y={460} s={pk(f, K.odsetek - 4)}>
					<circle r={60} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					<FText text="%" x={0} y={26} size={72} fill={P.navy} />
					<Xmark p={ip(f, K.odsetek, K.odsetek + 10, 0, 1, EIO)} r={70} />
					<FText text="odsetki" x={0} y={120} size={40} fill={P.navy} />
				</G>
			)}
		</g>
	);
};

// --- 1: kolejka po horyzont, para z pustym słoikiem ---
const Queue: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const n = 60;
	const couple = {x: 720, y: FL};
	const jarFill = ip(f, K.oszcz - 6, K.zycia + 4, 0.85, 0, EIO);
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			{/* kolejka maleje ku horyzontowi */}
			<line x1={0} y1={520} x2={l.W} y2={520} stroke={P.navy} strokeWidth={3} opacity={0.25} />
			{Array.from({length: n})
				.map((_, i) => i)
				.reverse()
				.map((i) => {
					const t = i / (n - 1);
					const k = Math.pow(0.95, i);
					const sc = 1.2 * k;
					const x = 1700 - (1 - k) * 1450 + (i % 2 ? 6 : -6);
					const y = FL - (1 - k) * 300;
					const a = ip(f, K.l2 - 20 + t * 30, K.l2 + t * 30, 0, 1, EOUT);
					if (a <= 0 || (i >= 4 && i <= 5)) return null;
					return (
						<G key={i} x={x} y={y} s={sc * a} o={1 - t * 0.5}>
							<Mini suit={['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#9C5A40'][i % 6]} hair={['#2B2420', '#8A8A8A', '#A07850', '#3B2A20', '#6B4A2E', '#C2B8A8'][(i * 5) % 6]} mood="sad" />
						</G>
					);
				})}
			{/* starsza para */}
			<G x={couple.x - 90} y={couple.y} s={0.95}>
				<Adult look={{suit: '#6E7D61', hair: '#D8D2C6', shirt: P.white, hairStyle: 'side'}} mood="sad" armR={10} seed={3} />
			</G>
			<G x={couple.x + 90} y={couple.y} s={0.92}>
				<Adult look={{suit: '#9C5A40', hair: '#E2DDD3', shirt: P.paper, hairStyle: 'side'}} mood="sad" armR={45} holdR={<G y={30} s={0.95}><Jar fill={jarFill} /></G>} seed={9} />
			</G>
			{f >= K.tys18 - 2 && (
				<G x={330} y={170} s={pk(f, K.tys18 - 2)} o={1 - prog(f, K.t45 - 4, 8)}>
					<Plate text={`${Math.round(ip(f, K.tys18, K.tys18 + 30, 0, 18, EOUT))} tys.`} label="pokrzywdzonych (ponad)" w={460} size={84} />
				</G>
			)}
			{f >= K.l3 - 2 && (
				<G x={1560} y={170} s={pk(f, K.l3 - 2)} o={1 - prog(f, K.t45 - 4, 8)}>
					<Plate text="851 mln zł" label="szkody" w={460} size={80} fill={P.red} color={P.white} />
				</G>
			)}
			{f >= K.t45 - 2 && (
				<G x={1110} y={380} s={pk(f, K.t45 - 2)} o={1 - prog(f, K.l6 + 4, 8)}>
					<Plate text="ok. 45 tys. zł" label="średnio na osobę" w={420} size={66} />
				</G>
			)}
			{f >= K.najw - 4 && (
				<G x={960} y={300} s={pk(f, K.najw - 4)} r={-3}>
					<rect x={-470} y={-120} width={940} height={230} fill={P.white} stroke={P.navy} strokeWidth={8} />
					<rect x={-470} y={-120} width={940} height={60} fill={P.navy} />
					<FText text="KRONIKA" x={-440} y={-78} size={34} fill={P.bg} anchor="start" />
					<FText text="Jedna z największych" x={0} y={8} size={56} fill={P.navy} />
					<FText text="afer finansowych w historii Polski" x={0} y={72} size={42} fill={P.red} />
				</G>
			)}
		</g>
	);
};

// --- 2: syndyk ---
const Trustee: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const items = [
		{el: <Desk />, at: K.l8, s: 1.2},
		{el: <Car />, at: K.l8 + 10, s: 0.9},
		{el: <G y={-30} s={0.45}><Plane /></G>, at: K.l8 + 20, s: 1},
		{el: <Desk />, at: K.odzysk - 4, s: 1.2},
	];
	const block = {x: 1300, y: FL - 120};
	const bars = ip(f, K.p20 - 4, K.p20 + 16, 0, 1, EOUT);
	const calcText = f < K.liczyl ? '0' : Array.from({length: 5}).map((_, i) => String(Math.floor(((Math.sin(Math.floor(f / 3) * 12.9898 + i * 78.233) * 43758.5453) % 1 + 1) % 1 * 10))).join('');
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			{/* syndyk przy stole */}
			<rect x={240} y={FL - 230} width={460} height={30} rx={6} fill="#8C6A4A" stroke={P.navy} strokeWidth={6} />
			<rect x={260} y={FL - 200} width={24} height={200} fill="#6E5139" />
			<rect x={656} y={FL - 200} width={24} height={200} fill="#6E5139" />
			<G x={470} y={FL} s={pk(f, K.syndyk - 6)}>
				<Adult look={{suit: '#33445A', hair: '#4A4A4A', shirt: P.white, hairStyle: 'side', glasses: true}} mood="neutral" armR={60} seed={11} />
			</G>
			<G x={600} y={FL - 290} s={1.1 * pk(f, K.syndyk)}>
				<Calc text={calcText} />
			</G>
			<G x={470} y={FL - 640} s={pk(f, K.syndyk)} o={1 - prog(f, K.l9 - 4, 8)}>
				<Tag text="syndyk" w={240} />
			</G>
			{/* podest licytacji */}
			<rect x={block.x - 170} y={block.y} width={340} height={120} fill="#B9A58C" stroke={P.navy} strokeWidth={6} />
			<FText text="LICYTACJA" x={block.x} y={block.y + 72} size={40} fill={P.navy} />
			{items.map((it, i) => {
				const inP = ip(f, it.at - 14, it.at, 0, 1, EOUT);
				const sold = it.at + 12;
				const outP = ip(f, sold, sold + 12, 0, 1, EIN);
				if (inP <= 0 || outP >= 1) return null;
				return (
					<G key={i} x={block.x + (1 - inP) * 600 - outP * 0} y={block.y} s={it.s * (1 - outP)} o={1 - outP}>
						{it.el}
					</G>
				);
			})}
			{f >= K.l8 - 4 && (
				<G x={block.x + 290} y={block.y - 6} s={0.9}>
					<Gavel ang={strike(f, items.map((it) => it.at + 10))} />
				</G>
			)}
			{/* odzyskane pieniądze */}
			{f >= K.odzysk - 2 &&
				Array.from({length: 6}).map((_, i) => {
					const a = K.odzysk + i * 5;
					const p = clamp01((f - a) / 16);
					if (p <= 0 || p >= 1) return null;
					const q = arcPt(EIO(p), block.x, block.y - 40, 600, FL - 360, 200);
					return (
						<G key={i} x={q.x} y={q.y} r={p * 300}>
							<Coin r={22} />
						</G>
					);
				})}
			{/* pasek zwrotu */}
			{f >= K.l9 - 4 && (
				<G x={1100} y={250} s={pk(f, K.l9 - 4)}>
					<FText text="wpłaty klientów" x={-380} y={-50} size={36} fill={P.navy} anchor="start" />
					<rect x={-380} y={-30} width={760} height={70} rx={14} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<rect x={-380} y={-30} width={760 * 0.2 * bars} height={70} rx={14} fill={P.gold} stroke={P.navy} strokeWidth={4} />
					{bars > 0 && <FText text="najwyżej ok. 20% wróci" x={-380 + 760 * 0.2 + 20} y={18} size={38} fill={P.red} anchor="start" opacity={bars} />}
				</G>
			)}
		</g>
	);
};

// --- 3: pierwsi z monetami, ostatni z pustymi rękami ---
const Last: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const n = 9;
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} tone="#E6DCCB" />
			{Array.from({length: n}).map((_, i) => {
				const x = 200 + i * 190;
				const off = ip(f, K.ostatni - 8 + (n - 1 - i) * 4, K.ostatni + (n - 1 - i) * 4, 0, 1, EIN) * (i >= 4 ? 1 : 0);
				const hasCoins = i < 4;
				const a = ip(f, K.l10 - 10 + i * 2, K.l10 + 6 + i * 2, 0, 1, EBACK);
				return (
					<g key={i}>
						<path d={`M ${x - 40} 0 L ${x + 40} 0 L ${x + 120} ${FL} L ${x - 120} ${FL} Z`} fill={P.goldLight} opacity={0.35 * (1 - off)} />
						<G x={x} y={FL} s={1.35 * a}>
							<Mini suit={['#8C7A5E', '#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#9C5A40'][i % 6]} hair={['#2B2420', '#8A8A8A', '#A07850', '#3B2A20', '#6B4A2E', '#C2B8A8'][(i * 5) % 6]} up={f >= K.pierwsi && hasCoins ? 0.6 : f >= K.ostatni && !hasCoins ? 0.4 : 0} mood={hasCoins ? 'ok' : f >= K.ostatni ? 'sad' : 'ok'} />
							{hasCoins && f >= K.pierwsi && (
								<G y={-250} s={pk(f, K.pierwsi + i * 3)}>
									<Pile n={3} r={16} />
								</G>
							)}
						</G>
						<rect x={x - 95} y={0} width={190} height={FL} fill={P.navy} opacity={0.55 * off} />
					</g>
				);
			})}
			{f >= K.pierwsi - 2 && (
				<G x={480} y={180} s={pk(f, K.pierwsi - 2)}>
					<Tag text="pierwsi" w={260} c={P.gold} tc={P.navy} />
				</G>
			)}
			{f >= K.ostatni - 2 && (
				<G x={1420} y={180} s={pk(f, K.ostatni - 2)}>
					<Tag text="ostatni: nic" w={320} c={P.red} tc={P.white} />
				</G>
			)}
			{f >= K.stracili - 2 && f < K.l11 + 10 && (
				<G x={960} y={180} s={pk(f, K.stracili - 2)} o={1 - prog(f, K.l11, 8)}>
					<Tag text="najwięcej stracili ostatni" w={640} />
				</G>
			)}
		</g>
	);
};

// --- 4: raport NBP i błędy instytucji ---
const Report: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const inst = [
		{x: 900, label: '', w: 200},
		{x: 1180, label: '', w: 200},
		{x: 1620, label: 'PROKURATURA', w: 280},
	];
	const circ = (at: number) => ip(f, at, at + 14, 0, 1, EIO);
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			<G x={380} y={430} s={pk(f, K.nbp - 6)} r={-5}>
				<rect x={-180} y={-250} width={360} height={480} rx={14} fill={P.paper} stroke={P.navy} strokeWidth={7} />
				<rect x={-180} y={-250} width={360} height={110} rx={14} fill={P.navy} />
				<FText text="RAPORT" x={0} y={-198} size={48} fill={P.gold} />
				<FText text="NBP, 2013" x={0} y={-156} size={30} fill={P.bg} />
				{Array.from({length: 7}).map((_, i) => (
					<line key={i} x1={-130} x2={130 - (i % 3) * 40} y1={-90 + i * 42} y2={-90 + i * 42} stroke={P.grey} strokeWidth={10} strokeLinecap="round" />
				))}
				{f >= K.raport && (
					<G x={70 + Math.sin((f - K.raport) / 10) * 60} y={40 + Math.cos((f - K.raport) / 12) * 60} s={1.2}>
						<Magnifier r={56} />
					</G>
				)}
			</G>
			{f >= K.l12 && (
				<G x={380} y={120} s={pk(f, K.l12)}>
					<Calendar text="2013" w={150} />
				</G>
			)}
			{/* instytucje publiczne */}
			{inst.map((b, i) => (
				<G key={i} x={b.x} y={FL} s={ip(f, K.l13 - 8 + i * 5, K.l13 + 8 + i * 5, 0, 1, EBACK)}>
					<Columns w={b.w} h={b.w * 0.9} label={b.label} labelSize={36} fill={i === 2 ? '#D9CBB0' : P.paper} />
				</G>
			))}
			{f >= K.instyt - 4 && (
				<G x={1040} y={360} s={pk(f, K.instyt - 4)}>
					<FText text="instytucje publiczne" x={0} y={0} size={40} fill={P.slate} />
				</G>
			)}
			{[0, 1].map((i) => {
				const p = circ(K.bledy + i * 6);
				return p > 0 ? <ellipse key={i} cx={inst[i].x} cy={FL - 150} rx={150} ry={190} fill="none" stroke={P.red} strokeWidth={8} opacity={0.75} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} /> : null;
			})}
			{(() => {
				const p = circ(K.prok - 4);
				return p > 0 ? (
					<g>
						<ellipse cx={inst[2].x} cy={FL - 190} rx={240} ry={270} fill="none" stroke={P.red} strokeWidth={16} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
						<ellipse cx={inst[2].x} cy={FL - 190} rx={262} ry={290} fill="none" stroke={P.red} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(p * 1.2 - 0.2)} opacity={0.6} />
					</g>
				) : null;
			})()}
			{f >= K.wrzeszcz - 2 && (
				<G x={inst[2].x} y={FL - 520} s={pk(f, K.wrzeszcz - 2)}>
					<Tag text="Gdańsk-Wrzeszcz" w={420} c={P.red} tc={P.white} size={40} />
				</G>
			)}
		</g>
	);
};

// --- 5: kalendarz 2012…2018 i pierwsza kropla ---
const Drip: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const yr = Math.min(2018, 2012 + Math.max(0, Math.floor((f - K.wyplaty + 4) / 6)));
	const drop = fall(f, K.y2018 + 14, 14, 360, FL - 60);
	const line = ip(f, K.l15 - 4, K.l15 + 20, 0, 1, EIO);
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			<G x={420} y={380} s={pk(f, K.l14 - 6)}>
				<Calendar text={String(yr)} top={yr === 2018 && f >= K.y2018 ? 'kwiecień' : undefined} w={300} />
			</G>
			{/* kran i pierwsza moneta */}
			<g>
				<rect x={1040} y={150} width={420} height={60} rx={20} fill={P.slate} stroke={P.navy} strokeWidth={6} />
				<rect x={1380} y={150} width={60} height={200} rx={16} fill={P.slate} stroke={P.navy} strokeWidth={6} />
				<rect x={1366} y={340} width={88} height={30} rx={8} fill={P.navy} />
				<rect x={1180} y={110} width={70} height={40} rx={8} fill={P.red} stroke={P.navy} strokeWidth={5} />
			</g>
			<G x={1410} y={FL}>
				<Pile n={f >= K.y2018 + 14 ? 1 : 0} r={30} />
			</G>
			{f >= K.y2018 && f < K.y2018 + 14 && (
				<G x={1410} y={drop} r={(f - K.y2018) * 20}>
					<Coin r={30} />
				</G>
			)}
			{f >= K.y2018 + 14 && <ellipse cx={1410} cy={FL - 4} rx={60 + (f - K.y2018 - 14) * 4} ry={12} fill="none" stroke={P.gold} strokeWidth={4} opacity={Math.max(0, 1 - (f - K.y2018 - 14) / 20)} />}
			{f >= K.y2018 && (
				<G x={1410} y={480} s={pk(f, K.y2018 + 16)}>
					<Tag text="pierwsze wypłaty" w={380} c={P.gold} tc={P.navy} size={40} />
				</G>
			)}
			{/* oś czasu */}
			{line > 0 && (
				<g>
					<line x1={260} y1={640} x2={260 + 1400 * line} y2={640} stroke={P.navy} strokeWidth={10} strokeLinecap="round" />
					{Array.from({length: 7}).map((_, i) => (
						<g key={i} opacity={line >= i / 6 ? 1 : 0}>
							<line x1={260 + (1400 * i) / 6} y1={620} x2={260 + (1400 * i) / 6} y2={660} stroke={P.navy} strokeWidth={6} />
							<FText text={String(2012 + i)} x={260 + (1400 * i) / 6} y={705} size={34} fill={P.navy} />
						</g>
					))}
					{f >= K.szesc && (
						<G x={960} y={580} s={pk(f, K.szesc)}>
							<Tag text="prawie 6 lat" w={300} c={P.red} tc={P.white} />
						</G>
					)}
				</g>
			)}
		</g>
	);
};

// --- 6: słupek 10 000 zł kruszy się do 2 000 zł ---
const Column: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const H0 = 560;
	const grow = ip(f, K.t10 - 6, K.t10 + 14, 0, 1, EOUT);
	const crush = ip(f, K.t2 - 6, K.t2 + 10, 0, 1, EIN);
	const h = H0 * grow * (1 - 0.8 * crush);
	const debris = clamp01((f - (K.t2 - 6)) / 30);
	return (
		<g>
			<Room w={l.W} h={l.H} floor={FL} />
			<G x={700} y={FL}>
				<rect x={-150} y={-h} width={300} height={h} fill={P.gold} stroke={P.navy} strokeWidth={8} />
				{Array.from({length: Math.floor(h / 40)}).map((_, i) => (
					<line key={i} x1={-150} x2={150} y1={-h + i * 40 + 40} y2={-h + i * 40 + 40} stroke={P.goldDark} strokeWidth={5} />
				))}
				<FText text={crush > 0.5 ? '2 000 zł' : '10 000 zł'} x={0} y={-h - 40} size={68} fill={crush > 0.5 ? P.red : P.navy} opacity={grow} />
				{debris > 0 && debris < 1 &&
					Array.from({length: 18}).map((_, i) => (
						<rect key={i} x={-150 + (i % 6) * 50 + Math.sin(i) * 30 * debris} y={-H0 + (Math.floor(i / 6) * 60) + debris * (H0 - 40)} width={40} height={30} fill={P.gold} stroke={P.navy} strokeWidth={4} transform={`rotate(${i * 40 * debris})`} opacity={1 - debris} />
					))}
			</G>
			{f >= K.zloto - 8 && (
				<G x={1320} y={330} s={pk(f, K.zloto - 8)}>
					<Tag text="„bezpieczna” lokata w złoto" w={620} c={P.gold} tc={P.navy} size={42} />
				</G>
			)}
			{f >= K.l17 && (
				<G x={1320} y={520} s={pk(f, K.l17)}>
					<Tag text="po 6 latach" w={340} />
				</G>
			)}
			{f >= K.t2 && (
				<G x={1320} y={680} s={pk(f, K.t2 + 4)}>
					<Tag text="najwyżej 2 000 zł" w={480} c={P.red} tc={P.white} />
				</G>
			)}
		</g>
	);
};

const ROOMS = [Door, Queue, Trustee, Last, Report, Drip, Column];
const R5Scene: React.FC = () => {
	const l = LAY(false);
	return (
		<AmberStage lines={LINES} vo="am5_vo.wav" keys={KEYS} dips={DIPS} hits={HITS} defs={<clipPath id="am5c"><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.bg} />
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath="url(#am5c)">
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

export const AmberR5: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 5" title="Upadek" icon={<G y={-60}><Calendar text="13.08" top="2012" w={220} /></G>} frames={CARD} />}>
		<R5Scene />
	</WithCard>
);
