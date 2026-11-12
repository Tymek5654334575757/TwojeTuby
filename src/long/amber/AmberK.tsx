// Amber Gold, „Jak działa piramida, wytłumaczone jak dla pięciolatka” (K1–K7, tylko 16:9).
// Świnka-skarbonka obiecuje 1 zł → 1,10 zł; Ania, Bartek, Celina w kolejce, 10 gr z monety następnego trafia do poprzedniego;
// kolejka układa się w trójkąt, nowych brakuje, kilka osób chce wypłaty, świnka pęka (pusto) → PIRAMIDA FINANSOWA,
// młotek; odprysk składa się w papierowy samolot i leci w stronę lotniska.
import React from 'react';
import {LINES} from './am3b.gen';
import {AmberStage, WithCard, CardScene, makeT, endOf, ip, pk, live, swing, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit, P, G, Coin, FText, clamp01, prog} from './kit';
import {Kid, type KidLook} from '../../kit-flat/flat';
import {Gavel, strike} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const K_FRAMES = CARD + SCENE;

const K = {
	skarb: T(0, 'skarbonkę'),
	zlotowki: T(0, 'złotówki'),
	zrobi: T(0, 'zrobi'),
	gr10: T(0, '10'),
	l1: T(1),
	ania: T(1, 'ania'),
	wklada: T(1, 'wkłada'),
	l2: T(2),
	nic: T(2, 'nic'),
	rok: T(2, 'rok'),
	oddac: T(2, 'oddać'),
	l3: T(3),
	wezmie: T(3, 'weźmie'),
	l4: T(4),
	bartka: T(4, 'bartka'),
	miesiac: T(4, 'miesiąc'),
	l5: T(5),
	celiny: T(5, 'celiny'),
	l6: T(6),
	nowi: T(6, 'nowi'),
	dostaja: T(6, 'dostają'),
	zadow: T(6, 'zadowoleni'),
	l7: T(7),
	opowiada: T(7, 'opowiada'),
	znajomym: T(7, 'znajomym'),
	l8: T(8),
	mniej: T(8, 'mniej'),
	kilka: T(8, 'kilka'),
	wyjac: T(8, 'wyjąć'),
	l9: T(9),
	srodku: T(9, 'środku'),
	nic9: T(9, 'nic'),
	l10: T(10),
	uznal: T(10, 'uznał'),
	amber: T(10, 'amber'),
	l11: T(11),
	skazany: T(11, 'skazany'),
	piramidy: T(11, 'piramidy'),
	l12: T(12),
	historii: T(12, 'historii'),
	l13: T(13),
	end: endOf(LINES),
};

const FLOOR = 940;
const PIG = {x: 560, y: FLOOR - 230};
const PIGW = 340;
const APEX = {x: 1500, y: 250};
const ROWS_Y = [420, 600, 780, 940];
const QX = (i: number) => 920 + i * 300;
const QS = 0.8;
const PS = 0.42;
// kolejność dzieci: 0 Ania, 1 Bartek, 2 Celina, 3–5 kolejni z kolejki, 6–7 nowi w ostatnim rzędzie
const LOOKS: KidLook[] = [
	{shirt: P.red, hair: '#C2502A'},
	{shirt: '#4A6E8C', hair: '#2B1B12'},
	{shirt: P.gold, hair: '#6B3E26'},
	{shirt: '#5C6B7A', hair: '#E0A13A'},
	{shirt: '#9C5A40', hair: '#2B1B12'},
	{shirt: P.grass, hair: '#6B3E26'},
	{shirt: '#8C7A5E', hair: '#C2502A'},
	{shirt: '#33445A', hair: '#E0A13A'},
];
const NAMES = ['Ania', 'Bartek', 'Celina'];
// miejsca w trójkącie: rząd, pozycja
const SLOTS: [number, number][] = [
	[0, 0],
	[1, 0],
	[1, 1],
	[2, 0],
	[2, 1],
	[2, 2],
	[3, 0],
	[3, 1],
];
const slotPos = (r: number, c: number, n = r + 1) => ({x: APEX.x + (c - (n - 1) / 2) * 280, y: ROWS_Y[r]});
const arrive = [K.ania - 30, K.bartka - 28, K.celiny - 28, K.nowi - 18, K.nowi - 8, K.nowi + 2];
const FORM = {a: K.l7 - 6, b: K.l7 + 30};

const KEYS: CK[] = [
	{f: 0, x: 760, y: 640, z: 1.25},
	{f: K.zrobi, x: 680, y: 600, z: 1.35},
	{f: K.l1 + 10, x: 860, y: 640, z: 1.2},
	{f: K.nic, x: 760, y: 620, z: 1.25},
	{f: K.oddac + 10, x: 860, y: 640, z: 1.2},
	{f: K.l3, x: 620, y: 580, z: 1.4},
	{f: K.l4 + 6, x: 1000, y: 640, z: 1.12},
	{f: K.l5 + 10, x: 1150, y: 640, z: 1.05},
	{f: K.nowi + 10, x: 1450, y: 620, z: 0.86},
	{f: K.zadow + 6, x: 1460, y: 620, z: 0.84},
	{f: FORM.b + 6, x: 1500, y: 580, z: 0.95},
	{f: K.wyjac + 10, x: 1500, y: 580, z: 0.98},
	{f: K.srodku - 4, x: APEX.x, y: 420, z: 1.35},
	{f: K.nic9 + 14, x: APEX.x, y: 430, z: 1.3},
	{f: K.uznal + 6, x: 1500, y: 580, z: 0.95},
	{f: K.piramidy + 10, x: 1500, y: 580, z: 0.98},
	{f: K.l12 + 6, x: APEX.x, y: 420, z: 1.25},
	{f: K.historii + 8, x: APEX.x + 80, y: 420, z: 1.2},
	{f: SCENE, x: 2900, y: 600, z: 1.05, e: 'in'},
];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.skarb + 6), kind: 'punch', amp: 0.5},
	{t: s(K.wklada + 8), kind: 'punch', amp: 0.3},
	{t: s(K.wezmie), kind: 'punch', amp: 0.5},
	{t: s(K.mniej), kind: 'punch', amp: 0.4},
	{t: s(K.srodku), kind: 'both', amp: 0.9},
	{t: s(K.uznal), kind: 'punch', amp: 0.5},
	{t: s(K.skazany), kind: 'both', amp: 0.7},
	{t: s(K.piramidy), kind: 'punch', amp: 0.5},
];

// Świnka-skarbonka (środek dołu w 0,0). crack 0..1 rozłupuje ją na połowy.
const Piggy: React.FC<{w?: number; crack?: number; shake?: number; f: number}> = ({w = 260, crack = 0, shake = 0, f}) => {
	const h = w * 0.62;
	const sh = shake > 0 ? Math.sin(f * 2.4) * 6 * shake : 0;
	const half = (side: -1 | 1) => (
		<g transform={`translate(${side * crack * w * 0.32} ${crack * 20}) rotate(${side * crack * 16} 0 0)`}>
			<clipPath id={`pig${side}`}>
				<path d={side < 0 ? `M -400 -400 L 6 -400 L -10 -${h * 0.7} L 12 -${h * 0.45} L -8 -${h * 0.2} L 8 0 L -400 0 Z` : `M 400 -400 L 6 -400 L -10 -${h * 0.7} L 12 -${h * 0.45} L -8 -${h * 0.2} L 8 0 L 400 0 Z`} />
			</clipPath>
			<g clipPath={`url(#pig${side})`}>
				{[-0.3, 0.26].map((k) => (
					<rect key={k} x={k * w - w * 0.07} y={-h * 0.22} width={w * 0.14} height={h * 0.22} rx={8} fill="#B08A3A" stroke={P.navy} strokeWidth={5} />
				))}
				<ellipse cx={0} cy={-h * 0.56} rx={w * 0.5} ry={h * 0.42} fill={P.gold} stroke={P.navy} strokeWidth={7} />
				{crack > 0 && <ellipse cx={0} cy={-h * 0.56} rx={w * 0.44} ry={h * 0.35} fill="#3A2E1E" />}
				<rect x={-w * 0.12} y={-h * 0.99} width={w * 0.24} height={h * 0.07} rx={6} fill={P.navy} />
				<ellipse cx={w * 0.5} cy={-h * 0.56} rx={w * 0.11} ry={h * 0.14} fill="#D9B46A" stroke={P.navy} strokeWidth={6} />
				<circle cx={w * 0.48} cy={-h * 0.6} r={4} fill={P.navy} />
				<circle cx={w * 0.53} cy={-h * 0.6} r={4} fill={P.navy} />
				<path d={`M ${w * 0.18} ${-h * 0.92} L ${w * 0.3} ${-h * 1.12} L ${w * 0.36} ${-h * 0.86} Z`} fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
				<circle cx={w * 0.3} cy={-h * 0.7} r={7} fill={P.navy} />
				<path d={`M ${-w * 0.5} ${-h * 0.62} q ${-w * 0.1} ${-h * 0.05} ${-w * 0.06} ${-h * 0.18}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
			</g>
		</g>
	);
	return (
		<g transform={`rotate(${sh})`}>
			{crack > 0 && (
				<G y={-h * 0.3} s={crack}>
					<circle r={w * 0.06} fill={P.gold} stroke={P.navy} strokeWidth={4} />
				</G>
			)}
			{crack > 0 ? (
				<>
					{half(-1)}
					{half(1)}
				</>
			) : (
				<g>
					{[-0.3, 0.26].map((k) => (
						<rect key={k} x={k * w - w * 0.07} y={-h * 0.22} width={w * 0.14} height={h * 0.22} rx={8} fill="#B08A3A" stroke={P.navy} strokeWidth={5} />
					))}
					<ellipse cx={0} cy={-h * 0.56} rx={w * 0.5} ry={h * 0.42} fill={P.gold} stroke={P.navy} strokeWidth={7} />
					<rect x={-w * 0.12} y={-h * 0.99} width={w * 0.24} height={h * 0.07} rx={6} fill={P.navy} />
					<ellipse cx={w * 0.5} cy={-h * 0.56} rx={w * 0.11} ry={h * 0.14} fill="#D9B46A" stroke={P.navy} strokeWidth={6} />
					<circle cx={w * 0.48} cy={-h * 0.6} r={4} fill={P.navy} />
					<circle cx={w * 0.53} cy={-h * 0.6} r={4} fill={P.navy} />
					<path d={`M ${w * 0.18} ${-h * 0.92} L ${w * 0.3} ${-h * 1.12} L ${w * 0.36} ${-h * 0.86} Z`} fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
					<circle cx={w * 0.3} cy={-h * 0.7} r={7} fill={P.navy} />
					<path d={`M ${-w * 0.5} ${-h * 0.62} q ${-w * 0.1} ${-h * 0.05} ${-w * 0.06} ${-h * 0.18}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
				</g>
			)}
		</g>
	);
};
const Grosz: React.FC<{r?: number}> = ({r = 22}) => (
	<g>
		<circle r={r} fill="#C9C2B5" stroke={P.navy} strokeWidth={5} />
		<FText text="10" x={0} y={r * 0.36} size={r} fill={P.navy} />
	</g>
);
const Bubble: React.FC<{w: number; h: number; tail?: 'l' | 'r' | 'b'; children: React.ReactNode}> = ({w, h, tail = 'b', children}) => (
	<g>
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.35} fill={P.white} stroke={P.navy} strokeWidth={6} />
		{tail === 'b' && <path d={`M -16 ${h / 2 - 3} L 0 ${h / 2 + 26} L 18 ${h / 2 - 3}`} fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />}
		{tail === 'r' && <path d={`M ${w / 2 - 4} -10 L ${w / 2 + 26} 8 L ${w / 2 - 4} 16`} fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />}
		{children}
	</g>
);
const PaperPlane: React.FC = () => (
	<g>
		<path d="M -90 0 L 110 -40 L -40 30 Z" fill={P.white} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -40 30 L 110 -40 L -10 50 Z" fill="#D9D3C6" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
	</g>
);

const World: React.FC<{f: number}> = ({f}) => {
	const pigShake = live(f, K.l9 - 4, K.srodku, 4) + 0.5 * live(f, K.kilka, K.wyjac + 20, 6);
	const crack = ip(f, K.srodku, K.srodku + 12, 0, 1, EBACK);
	const pigFly = ip(f, FORM.a, FORM.b, 0, 1, EIO);
	const pigPos = arcPt(pigFly, PIG.x, PIG.y, APEX.x, APEX.y, 160);
	const pigScale = 1 - 0.4 * pigFly;
	const pyr = ip(f, K.uznal - 4, K.uznal + 16, 0, 1, EIO);
	const kidsFade = 1 - 0.75 * pyr;
	const shard = ip(f, K.historii - 26, K.historii, 0, 1, EIO);
	const flyP = ip(f, K.l13 - 6, SCENE, 0, 1, EIN);
	const queueIdx = (i: number) => (i < 6 ? QX(i) : QX(5) + (i - 5) * 250);
	return (
		<g>
			<rect x={-2000} y={-1500} width={7000} height={1500 + FLOOR} fill={P.bg} />
			<rect x={-2000} y={0} width={7000} height={FLOOR} fill="url(#am-kpL)" />
			<rect x={-2000} y={FLOOR} width={7000} height={1600} fill={P.grey} />
			<line x1={-2000} y1={FLOOR} x2={5000} y2={FLOOR} stroke={P.navy} strokeWidth={6} opacity={0.5} />
			{/* lotnisko na końcu */}
			<g>
				<rect x={3150} y={FLOOR - 420} width={90} height={420} fill={P.paper} stroke={P.navy} strokeWidth={6} />
				<path d={`M 3110 ${FLOOR - 420} L 3280 ${FLOOR - 420} L 3260 ${FLOOR - 500} L 3130 ${FLOOR - 500} Z`} fill={P.sky} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
				{Array.from({length: 8}).map((_, i) => (
					<rect key={i} x={2650 + i * 160} y={FLOOR + 40} width={90} height={14} fill={P.white} opacity={0.7} />
				))}
			</g>
			{/* piedestał świnki */}
			<g opacity={1 - pigFly}>
				<rect x={PIG.x - 150} y={PIG.y} width={300} height={FLOOR - PIG.y} fill="#B9A58C" stroke={P.navy} strokeWidth={6} />
				<rect x={PIG.x - 175} y={PIG.y - 4} width={350} height={24} rx={6} fill="#8C7A5E" stroke={P.navy} strokeWidth={6} />
			</g>
			{/* trójkąt: deski pod rzędami */}
			{pigFly > 0 &&
				ROWS_Y.map((y, r) => {
					const n = r + 1;
					const w = n * 280 + 90;
					return <rect key={r} x={APEX.x - (w / 2) * pigFly} y={y} width={w * pigFly} height={18} rx={6} fill="#8C7A5E" stroke={P.navy} strokeWidth={5} opacity={kidsFade} />;
				})}
			{/* piramida po wyroku */}
			{pyr > 0 && (
				<g>
					<path d={`M ${APEX.x} ${APEX.y - 200} L ${APEX.x + 680} ${FLOOR + 18} L ${APEX.x - 680} ${FLOOR + 18} Z`} fill={P.red} opacity={0.85 * pyr} stroke={P.navy} strokeWidth={8} />
					{[0.33, 0.55, 0.77].map((k) => (
						<line key={k} x1={APEX.x - 680 * k} y1={APEX.y - 200 + (FLOOR + 218 - APEX.y) * k} x2={APEX.x + 680 * k} y2={APEX.y - 200 + (FLOOR + 218 - APEX.y) * k} stroke={P.navy} strokeWidth={5} opacity={0.4 * pyr} />
					))}
				</g>
			)}
			{/* puste miejsca w ostatnim rzędzie: nowych jest mniej */}
			{f >= K.mniej - 6 &&
				[2, 3].map((c) => {
					const p = slotPos(3, c, 4);
					return (
						<g key={c} opacity={prog(f, K.mniej - 6, 8) * kidsFade}>
							<rect x={p.x - 70} y={p.y - 175} width={140} height={175} rx={20} fill="none" stroke={P.slate} strokeWidth={5} strokeDasharray="14 10" />
							<FText text="?" x={p.x} y={p.y - 62} size={60} fill={P.slate} />
						</g>
					);
				})}
			{/* świnka */}
			<G x={pigPos.x} y={pigPos.y} s={pk(f, K.skarb - 2) * pigScale * (f < K.l3 || f > K.wezmie + 10 ? 1 : 1 - 0.1 * Math.sin(((f - K.l3) / 8) * Math.PI))} o={1 - prog(f, K.uznal, 10)}>
				<Piggy f={f} w={PIGW} crack={crack} shake={pigShake} />
			</G>
			{f >= K.zlotowki - 4 && f < K.l1 + 10 && (
				<G x={PIG.x + 40} y={PIG.y - 320} s={pk(f, K.zlotowki - 4)} o={1 - prog(f, K.l1, 8)}>
					<Bubble w={340} h={110}>
						<FText text="1 zł" x={-100} y={18} size={52} fill={P.navy} />
						<path d="M -40 0 L 30 0 M 14 -14 L 32 0 L 14 14" fill="none" stroke={P.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={prog(f, K.zrobi, 6)} />
						<FText text="1,10 zł" x={100} y={18} size={52} fill={P.goldDark} opacity={prog(f, K.zrobi + 4, 6)} />
					</Bubble>
				</G>
			)}
			{f >= K.l3 - 2 && f < K.l4 && (
				<G x={PIG.x} y={PIG.y - 330} s={pk(f, K.l3 - 2)} o={1 - prog(f, K.l4 - 8, 8)}>
					<circle r={70} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="?" x={0} y={36} size={110} fill={P.red} />
				</G>
			)}
			{/* zysk skarbonki stoi na zerze */}
			{f >= K.l2 - 4 && (
				<G x={PIG.x - 300} y={PIG.y - 10} s={pk(f, K.l2 - 4)} o={1 - prog(f, K.l6, 10)}>
					<rect x={-26} y={-220} width={52} height={240} rx={26} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<circle cy={20} r={38} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="zysk skarbonki" x={0} y={-244} size={30} fill={P.navy} />
					<FText text="0 zł" x={0} y={34} size={34} fill={P.red} />
				</G>
			)}
			{/* dzieci */}
			{LOOKS.map((look, i) => {
				const isRow4 = i >= 6;
				const appear = isRow4 ? ip(f, K.znajomym - 4 + (i - 6) * 6, K.znajomym + 8 + (i - 6) * 6, 0, 1, EBACK) : ip(f, arrive[i], arrive[i] + 24, 0, 1, EOUT);
				if (appear <= 0) return null;
				const qx = queueIdx(i);
				const startX = qx + 600;
				const walkX = isRow4 ? qx : startX + (qx - startX) * appear;
				const [r, c] = SLOTS[i];
				const sp = slotPos(r, c, r + 1);
				const fp = isRow4 ? 1 : ip(f, FORM.a + i * 3, FORM.b + i * 3, 0, 1, EIO);
				const q = arcPt(fp, walkX, FLOOR, sp.x, sp.y, 140);
				const sc = QS - (QS - PS) * fp;
				const walking = !isRow4 && appear > 0 && appear < 1;
				const wants = f >= K.kilka && f < K.l10 && [1, 3, 4, 6].includes(i);
				const happy = f >= K.dostaja && f < K.l8;
				const insert = [K.wklada + 4, K.bartka + 8, K.celiny + 6][i];
				const armR = wants ? 150 : insert && f >= insert - 14 && f < insert + 6 ? 100 : happy ? 120 : 15;
				return (
					<G key={i} x={q.x} y={q.y} s={isRow4 ? PS * appear : sc} o={kidsFade}>
						<Kid look={look} walk={walking} armR={armR} armL={wants ? 150 : 15} mood={f >= K.srodku && f < K.l10 ? 'o' : happy || i === 0 ? 'smile' : 'smile'} seed={i * 3} />
						{i < 3 && fp < 0.5 && (
							<G y={-480} s={pk(f, arrive[i] + 6)}>
								<rect x={-100} y={-36} width={200} height={60} rx={14} fill={P.navy} />
								<FText text={NAMES[i]} x={0} y={8} size={40} fill={P.bg} />
							</G>
						)}
						{wants && (
							<G y={-500} s={pk(f, K.kilka + i)}>
								<circle r={40} fill={P.red} stroke={P.navy} strokeWidth={6} />
								<FText text="!" x={0} y={20} size={60} fill={P.white} />
							</G>
						)}
						{f >= K.opowiada + i * 3 && f < K.mniej && i < 6 && fp >= 1 && (
							<G x={150} y={-420} s={pk(f, K.opowiada + i * 3) * 1.2}>
								<Bubble w={170} h={120} tail="b">
									<G y={34} s={0.36}>
										<Piggy f={f} w={260} />
									</G>
								</Bubble>
							</G>
						)}
					</G>
				);
			})}
			{/* monety: Ania wkłada złotówkę, potem 10 gr z monety następnego */}
			{[K.wklada + 4, K.bartka + 8, K.celiny + 6].map((at, i) => {
				const p = clamp01((f - (at - 14)) / 14);
				if (p <= 0 || p >= 1) return null;
				const q = arcPt(EIO(p), queueIdx(i) - 60, FLOOR - 200, PIG.x, PIG.y - 210, 160);
				return (
					<G key={i} x={q.x} y={q.y} r={p * 360}>
						<Coin r={26} />
					</G>
				);
			})}
			{[K.bartka + 10, K.celiny + 8].map((at, i) => {
				const p = clamp01((f - at) / 22);
				if (p <= 0 || p >= 1) return null;
				const q = arcPt(EIO(p), PIG.x, PIG.y - 210, queueIdx(i), FLOOR - 300, 240);
				return (
					<G key={i} x={q.x} y={q.y} r={p * 400}>
						<Grosz r={24} />
					</G>
				);
			})}
			{/* za rok oddać 1,10 zł */}
			{f >= K.rok - 2 && f < K.l3 && (
				<G x={queueIdx(0)} y={FLOOR - 500} s={pk(f, K.rok - 2)} o={1 - prog(f, K.l3 - 6, 6)}>
					<rect x={-140} y={-44} width={280} height={84} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					<FText text="za rok: 1,10 zł" x={0} y={12} size={38} fill={P.navy} />
				</G>
			)}
			{f >= K.miesiac - 2 && f < K.l5 + 10 && (
				<G x={queueIdx(1)} y={FLOOR - 500} s={pk(f, K.miesiac - 2)} o={1 - prog(f, K.l5, 8)}>
					<rect x={-150} y={-44} width={300} height={84} rx={16} fill={P.paper} stroke={P.navy} strokeWidth={6} />
					<FText text="miesiąc później" x={0} y={12} size={36} fill={P.navy} />
				</G>
			)}
			{/* wszyscy dostają odsetki */}
			{f >= K.dostaja &&
				f < K.l7 &&
				[0, 1, 2, 3, 4].map((i) => {
					const at = K.dostaja + i * 5;
					const p = clamp01((f - at) / 18);
					if (p <= 0) return null;
					const q = arcPt(EIO(Math.min(1, p)), PIG.x, PIG.y - 210, queueIdx(i), FLOOR - 450, 200);
					return (
						<G key={i} x={q.x} y={p >= 1 ? FLOOR - 450 - 8 * Math.sin((f - at) / 4) : q.y} r={p * 300} s={p >= 1 ? 1 - prog(f, K.l7 - 10, 8) : 1}>
							<Grosz r={22} />
						</G>
					);
				})}
			{/* napisy po wyroku */}
			{pyr > 0 && (
				<G x={APEX.x} y={740} s={pk(f, K.uznal + 4) * (1 + 0.08 * pk(f, K.piramidy) * (1 - prog(f, K.piramidy + 8, 8)))}>
					<rect x={-330} y={-60} width={660} height={110} rx={18} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="PIRAMIDA FINANSOWA" x={0} y={18} size={60} fill={P.red} />
				</G>
			)}
			{f >= K.amber - 2 && (
				<G x={APEX.x} y={APEX.y - 70} s={pk(f, K.amber - 2)} o={1 - prog(f, K.l12 + 20, 10)}>
					<rect x={-180} y={-44} width={360} height={84} rx={14} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					<FText text="AMBER GOLD" x={0} y={14} size={50} fill={P.navy} />
				</G>
			)}
			{f >= K.l11 && (
				<G x={APEX.x + 760} y={FLOOR - 22} s={1.2 * pk(f, K.l11 + 4)}>
					<Gavel ang={strike(f, [K.skazany])} />
				</G>
			)}
			{/* odprysk → papierowy samolot */}
			{f >= K.l12 - 4 && (
				<G
					x={APEX.x + 60 + flyP * 1400}
					y={APEX.y - 40 - Math.sin(flyP * Math.PI) * 160 + flyP * 420 + swing(f, K.historii, 8)}
					r={-10 + flyP * 14 + (1 - shard) * 40}
					s={1 + flyP * 0.3}
				>
					{shard < 1 ? (
						<path d="M -50 -30 L 30 -44 L 46 10 L -10 36 L -44 12 Z" fill={P.gold} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" transform={`scale(${1 - shard * 0.4}) rotate(${shard * 180})`} opacity={1 - shard} />
					) : null}
					{shard > 0 && (
						<g opacity={shard} transform={`scale(${0.4 + 0.6 * shard})`}>
							<PaperPlane />
						</g>
					)}
					{flyP > 0 && <path d={`M -90 4 Q ${-200 - flyP * 300} ${30 + Math.sin(f / 4) * 10} ${-400 - flyP * 600} 60`} fill="none" stroke={P.slate} strokeWidth={5} strokeDasharray="10 14" opacity={0.6} />}
				</G>
			)}
		</g>
	);
};

export const AmberK: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Wytłumaczone jak dla pięciolatka" title="Jak działa piramida" icon={<G y={-30}><Piggy f={0} w={280} /></G>} frames={CARD} />}>
		<AmberStage lines={LINES} vo="am3b_vo.wav" keys={KEYS} hits={HITS}>
			{(f) => <World f={f} />}
		</AmberStage>
	</WithCard>
);
