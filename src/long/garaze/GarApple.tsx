// Historia 3: Apple, 1976 (GarApple = film z planszą, GarAppleS = short 3). Zwrot: „garaż to trochę mit”.
// Pokoje: garaż z szyldem LEGENDA, w środku pusto (MIT?) → boks w HP nocą, płytka, Jobs ze znakiem dolara →
// sprzedają mikrobus i kalkulator (ok. 1300 $) → umowa 1.04.1976, koło udziałów 45/45/10, Wayne za 800 $ →
// sklep komputerowy: 50 × 500 $ i warunek „złożone” → cena 666,66 $, ok. 200 sztuk → garaż rodziców w Los Altos:
// uruchamianie płyt, dowóz, gotówka → cytat Wozniaka; [film] Markkula 1977 → fundament: zamówienie zamiast ścian →
// most: 1994, stos książek.
import React from 'react';
import {LINES} from './ga3.gen';
import {
	Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, FText, clamp01, prog, Room, Plate, LAY, kk, FloorDeco, type Lay,
	LOOK, Garage, Chain, Sign, House, Desk, Crt, Pcb, Calc, Van, Car, Box, Book, Pie, Calendar, Stamp, Banknote, Check, Tag,
	CARD, GarageCard, CutShort, keepFrom, keepLen, ShortWithCta,
} from './gkit';

const T = makeT(LINES);
const END = endOf(LINES) + 30;
export const A_FRAMES = CARD + END;
const KEEP = keepFrom(LINES, [23], 26, END);
export const AS_SCENE = keepLen(KEEP);

const K = {
	garaz0: T(0, 'garaż'), problem: T(0, 'problem'),
	l1: T(1), nie: T(1, 'nie'), projekt: T(1, 'projekt'),
	l2: T(2), y75: T(2, '1975'),
	l3: T(3), hp: T(3, 'HP'),
	l4: T(4), nocami: T(4, 'Nocami'), cup: T(4, 'Cupertino'), proj4: T(4, 'projektuje'),
	l5: T(5), jobs: T(5, 'Steve'), interes: T(5, 'interes'),
	l6: T(6), sprzed: T(6, 'sprzedają'),
	l7: T(7), vw: T(7, 'volkswagena'), kalk: T(7, 'kalkulator'),
	l8: T(8), d1300: T(8, '1300'),
	l9: T(9), d1kw: T(9, '1'), apple9: T(9, 'Apple'),
	l10: T(10), wayne: T(10, 'Ronald'),
	l11: T(11), wycof: T(11, 'wycofuje'), p10: T(11, '10%'), d800: T(11, '800'),
	l12: T(12), sklep: T(12, 'sklep'), mv: T(12, 'Mountain'),
	l13: T(13), paul: T(13, 'Paul'), d50: T(13, '50'), d500: T(13, '500'),
	l14: T(14), zloz: T(14, 'złożone'),
	l15: T(15), d666: T(15, '666'),
	l16: T(16), cyfry: T(16, 'cyfry'),
	l17: T(17), d200: T(17, '200'),
	l18: T(18), gar18: T(18, 'garaż'),
	l19: T(19), jobsa: T(19, 'Jobsa'), altos: T(19, 'Los'),
	l20: T(20), uruch: T(20, 'uruchamiają'), wioza: T(20, 'wiozą'), got: T(20, 'gotówką'),
	l21: T(21), mit: T(21, 'mit'),
	l22: T(22), nic: T(22, 'niczego'),
	l23: T(23), y77: T(23, '1977'), mike: T(23, "Mike'a"), spolka: T(23, 'spółką'),
	l24: T(24), opow: T(24, 'opowieść'),
	l25: T(25), zam: T(25, 'zamówienie'), sciany: T(25, 'ściany'),
	l26: T(26), y18: T(26, '18'),
	l27: T(27), ksiazki: T(27, 'książki'),
	end: END,
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, -40, 1.04], [0, -60, 1.04]),
	kk(v, K.problem + 10, 0, [0, -120, 1.16], [0, -160, 1.14]),
	kk(v, K.nie, 0, [0, -40, 1.24], [0, -60, 1.24], 'in'),
	kk(v, K.l2 - 12, 0, [0, -40, 1.1], [0, -60, 1.1]),
	kk(v, K.l2 + 14, 1, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.proj4 + 10, 1, [-60, -100, 1.16], [0, -140, 1.14]),
	kk(v, K.interes + 10, 1, [160, -60, 1.1], [100, -80, 1.08]),
	kk(v, K.l6 - 12, 1, [100, -40, 1.04], [60, -40, 1.04]),
	kk(v, K.l6 + 14, 2, [0, 0, 1], [0, 0, 1]),
	kk(v, K.kalk + 10, 2, [0, -60, 1.08], [0, -80, 1.06]),
	kk(v, K.d1300 + 20, 2, [0, -120, 1.16], [0, -160, 1.14]),
	kk(v, K.l9 - 12, 2, [0, -60, 1.06], [0, -60, 1.06]),
	kk(v, K.l9 + 14, 3, [-200, -40, 1.08], [0, -40, 1.06]),
	kk(v, K.wayne + 10, 3, [200, -60, 1.12], [0, -140, 1.1]),
	kk(v, K.d800 + 20, 3, [260, -80, 1.18], [0, -200, 1.16]),
	kk(v, K.l12 - 12, 3, [160, -40, 1.08], [0, -100, 1.06]),
	kk(v, K.l12 + 14, 4, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.d50 + 10, 4, [140, -60, 1.12], [60, -100, 1.1]),
	kk(v, K.zloz + 20, 4, [0, -60, 1.16], [0, -100, 1.14]),
	kk(v, K.l15 - 12, 4, [0, -40, 1.06], [0, -40, 1.06]),
	kk(v, K.l15 + 14, 5, [0, -40, 1.06], [0, -60, 1.06]),
	kk(v, K.cyfry + 10, 5, [0, -120, 1.16], [0, -160, 1.14]),
	kk(v, K.l18 - 12, 5, [0, -60, 1.06], [0, -60, 1.06]),
	kk(v, K.l18 + 14, 6, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.uruch + 10, 6, [-240, -60, 1.14], [-140, -80, 1.12]),
	kk(v, K.got + 10, 6, [240, -40, 1.1], [140, -60, 1.08]),
	kk(v, K.l21 - 12, 6, [120, -20, 1.04], [80, -20, 1.04]),
	kk(v, K.l21 + 14, 7, [0, -40, 1.06], [0, -60, 1.06]),
	kk(v, K.nic + 20, 7, [-200, -80, 1.14], [0, -140, 1.12]),
	kk(v, K.mike + 10, 7, [300, -60, 1.12], [0, -60, 1.1]),
	kk(v, K.l24 - 12, 7, [200, -40, 1.06], [0, -40, 1.06]),
	kk(v, K.l24 + 14, 8, [0, -120, 1.04], [0, -160, 1.04]),
	kk(v, K.zam + 6, 8, [0, 40, 1.1], [0, 60, 1.08]),
	kk(v, K.sciany + 30, 8, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l26 - 12, 8, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l26 + 14, 9, [-100, -20, 1.04], [-60, -20, 1.04]),
	kk(v, K.end, 9, [300, -40, 1.12], [200, -40, 1.1]),
];
const DIPS: [number, number, number][] = [K.l2, K.l6, K.l9, K.l12, K.l15, K.l18, K.l21, K.l24, K.l26].map((b) => [b - 12, b + 14, 0.1]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.problem), kind: 'punch', amp: 0.5},
	{t: s(K.projekt + 4), kind: 'both', amp: 0.7},
	{t: s(K.y75), kind: 'punch', amp: 0.4},
	{t: s(K.interes), kind: 'punch', amp: 0.4},
	{t: s(K.vw + 10), kind: 'shake', amp: 0.3},
	{t: s(K.d1300 + 16), kind: 'punch', amp: 0.6},
	{t: s(K.d1kw), kind: 'punch', amp: 0.5},
	{t: s(K.d800), kind: 'punch', amp: 0.5},
	{t: s(K.d50 + 20), kind: 'punch', amp: 0.6},
	{t: s(K.zloz), kind: 'punch', amp: 0.4},
	{t: s(K.d666 + 20), kind: 'both', amp: 0.6},
	{t: s(K.d200), kind: 'punch', amp: 0.4},
	{t: s(K.mit), kind: 'both', amp: 0.8},
	{t: s(K.zam), kind: 'punch', amp: 0.6},
];

type R = React.FC<{f: number; l: Lay}>;
const Cobweb: React.FC<{s?: number}> = ({s: sc = 1}) => (
	<g transform={`scale(${sc})`} stroke={P.bg} strokeWidth={2} fill="none" opacity={0.6}>
		{[0, 1, 2, 3, 4].map((i) => (
			<line key={i} x1={0} y1={0} x2={Math.cos((i / 8) * Math.PI) * 120} y2={Math.sin((i / 8) * Math.PI) * 120} />
		))}
		{[40, 75, 110].map((r) => (
			<path key={r} d={Array.from({length: 5}, (_, i) => `${i ? 'L' : 'M'} ${Math.cos((i / 8) * Math.PI) * r} ${Math.sin((i / 8) * Math.PI) * r}`).join(' ')} />
		))}
	</g>
);

// 0: garaż z szyldem LEGENDA; w środku pusto, pieczątka „MIT?”
const R0: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const open = ip(f, K.l1, K.l1 + 26, 0, 1, EIO);
	const st = f >= K.projekt - 2 ? 1 + 1.4 * (1 - ip(f, K.projekt - 2, K.projekt + 8, 0, 1, EOUT)) : 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={cx} y={FL} s={v ? 1.6 : 1.45}>
				<Garage w={460} h={330} open={open} id="a0" roof="#5C6B7A" label="LEGENDA" labelSize={40}>
					<g transform="translate(-150 -230)">
						<Cobweb s={0.8} />
					</g>
					{Array.from({length: 6}).map((_, i) => (
						<circle key={i} cx={-120 + hsh(i) * 240} cy={-30 - ((f * 0.6 + i * 40) % 200)} r={3} fill={P.bg} opacity={0.3} />
					))}
				</Garage>
			</G>
			{st > 0 && (
				<G x={cx} y={v ? 760 : FL - 260} s={st * (v ? 0.95 : 0.85)} r={-8}>
					<Stamp lines={['MIT?']} w={360} color={P.red} />
				</G>
			)}
		</g>
	);
};

// 1: boks w HP nocą (1975), płytka się rysuje; Jobs ze znakiem dolara
const R1: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const draw = ip(f, K.nocami, K.proj4 + 40, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#33445A" dark />
			<G x={v ? 260 : 280} y={v ? 300 : 190} s={pk(f, K.y75 - 2)}>
				<Calendar text="1975" w={200} />
			</G>
			<G x={v ? 800 : cx + 560} y={v ? 300 : 170} s={pk(f, K.hp - 4)}>
				<Sign text="HP" w={220} fill={P.bg} />
			</G>
			{/* ścianki boksu */}
			<rect x={v ? 120 : cx - 560} y={FL - 360} width={18} height={360} fill="#5C6B7A" stroke={P.navy} strokeWidth={4} />
			<rect x={v ? 940 : cx + 200} y={FL - 360} width={18} height={360} fill="#5C6B7A" stroke={P.navy} strokeWidth={4} />
			<G x={v ? 540 : cx - 180} y={FL} s={v ? 1.2 : 1.15}>
				<Desk w={460} lamp={1}>
					<g transform="translate(-40 -40) scale(0.85)">
						<Pcb w={300} draw={draw} chips={ip(f, K.proj4, K.proj4 + 30, 0, 1)} />
					</g>
				</Desk>
			</G>
			<G x={v ? 240 : cx - 520} y={FL} s={v ? 0.9 : 1}>
				<Adult look={LOOK.woz} armR={60} mood="neutral" seed={8} />
			</G>
			<G x={v ? 860 : cx + 420} y={FL} s={(v ? 0.9 : 1) * pk(f, K.jobs - 6)}>
				<Adult look={LOOK.jobs} mood={f > K.interes ? 'smile' : 'neutral'} armL={40} seed={9} />
				<G y={-600} s={pk(f, K.interes)}>
					<circle r={56} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					<FText text="$" x={0} y={26} size={76} fill={P.navy} />
				</G>
			</G>
		</g>
	);
};

// 2: sprzedają mikrobus i kalkulator → ok. 1300 $
const R2: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const drive = ip(f, K.vw + 4, K.vw + 50, 0, 1, EIN);
	const calc = ip(f, K.kalk, K.kalk + 30, 0, 1, EIO);
	const cnt = Math.round(1300 * ip(f, K.d1300 - 10, K.d1300 + 20, 0, 1, EOUT));
	const cp = arcPt(calc, v ? 760 : cx + 300, FL - 260, v ? 540 : cx, v ? 420 : 250, 200);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<FloorDeco l={l} />
			<G x={(v ? 300 : cx - 380) + drive * (v ? 1200 : 1800)} y={FL} s={v ? 1.0 : 1.2}>
				<Van f={f * drive} color="#B9CBD3" />
			</G>
			{f < K.vw + 20 && (
				<G x={v ? 300 : cx - 380} y={FL - (v ? 260 : 300)} s={pk(f, K.l6)}>
					<Tag text="sprzedam" w={260} swing={swing(f, K.l6, 10)} />
				</G>
			)}
			<G x={v ? 840 : cx + 480} y={FL} s={v ? 0.9 : 1}>
				<Adult look={LOOK.woz} armR={calc < 0.05 ? 60 : 10} seed={8} />
			</G>
			{calc < 1 && (
				<G x={calc > 0 ? cp.x : (v ? 760 : cx + 300) + 40} y={calc > 0 ? cp.y : FL - 300} r={calc * 360} s={0.9}>
					<Calc w={90} />
				</G>
			)}
			{f >= K.d1300 - 10 && (
				<G x={v ? 540 : cx} y={v ? 420 : 250} s={pk(f, K.d1300 - 10)}>
					<Plate text={`ok. ${cnt} $`} label="na start" w={v ? 560 : 520} size={96} />
				</G>
			)}
		</g>
	);
};

// 3: umowa 1.04.1976, koło udziałów; Wayne wycofuje się, 10% → 800 $
const R3: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const pull = ip(f, K.wycof, K.wycof + 20, 0, 1, EIO);
	const away = ip(f, K.d800 - 8, K.d800 + 12, 0, 1, EIO);
	const pieX = v ? 540 : cx + 380;
	const pieY = v ? 450 : 400;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx - 420} y={v ? 880 : FL - 330} s={pk(f, K.l9 - 4) * (v ? 0.85 : 1)}>
				<rect x={-170} y={-210} width={340} height={420} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
				<FText text="Apple Computer" x={0} y={-140} size={34} fill={P.navy} />
				<FText text="Company" x={0} y={-100} size={34} fill={P.navy} />
				<FText text="1.04.1976" x={0} y={-50} size={36} fill={P.goldDark} />
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M ${-130 + i * 90} 150 q 15 -30 30 0 t 30 0`} fill="none" stroke={P.navy} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ip(f, K.apple9 + i * 8, K.apple9 + 20 + i * 8, 0, 1)} opacity={i === 2 ? 1 - pull * 0.7 : 1} />
				))}
			</G>
			{f >= K.l10 - 6 && (
				<G x={pieX} y={pieY} s={pk(f, K.l10 - 6) * (v ? 1.15 : 1)}>
					<Pie r={160} parts={[[0.45, P.gold], [0.45, P.blue], [0.1, P.red]]} pullI={2} pull={pull * 70 + away * 220} />
					<FText text="Wozniak 45%" x={-60} y={-190} size={34} fill={P.navy} />
					<FText text="Jobs 45%" x={-40} y={220} size={34} fill={P.navy} />
					<FText text={away > 0.5 ? '800 $' : 'Wayne 10%'} x={220 + away * 120} y={-120 - away * 40} size={away > 0.5 ? 56 : 34} fill={away > 0.5 ? P.goldDark : P.red} />
				</G>
			)}
			<G x={v ? 880 : cx + 760} y={FL} s={(v ? 0.8 : 0.9) * pk(f, K.wayne - 4)}>
				<Adult look={LOOK.wayne} walk={pull > 0 && pull < 1} mood="neutral" seed={10} />
			</G>
		</g>
	);
};

// 4: sklep komputerowy w Mountain View: 50 × 500 $, warunek „złożone”
const R4: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const n = Math.round(50 * ip(f, K.d50 - 4, K.d50 + 30, 0, 1, EOUT));
	const scr = ip(f, K.zloz - 6, K.zloz + 20, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx - 420} y={FL} s={v ? 0.9 : 1}>
				<rect x={-300} y={-440} width={600} height={440} fill="#D9C9AE" stroke={P.navy} strokeWidth={7} />
				<rect x={-280} y={-520} width={560} height={90} rx={10} fill={P.navy} />
				<FText text="BYTE SHOP" x={0} y={-460} size={58} fill={P.goldLight} />
				<rect x={-240} y={-380} width={480} height={200} fill="#B9CBD3" stroke={P.navy} strokeWidth={6} />
				<rect x={-260} y={-140} width={520} height={140} fill="#A87B4A" stroke={P.navy} strokeWidth={6} />
				<FText text="Mountain View" x={0} y={60} size={40} fill={P.navy} opacity={prog(f, K.mv, 8)} />
			</G>
			<G x={v ? 900 : cx - 20} y={v ? 1120 : FL} s={(v ? 0.75 : 0.95) * pk(f, K.paul - 4)}>
				<Adult look={LOOK.terrell} talk={f > K.paul && f < K.l14} armL={40} seed={11} />
				<FText text="Paul Terrell" x={0} y={60} size={36} fill={P.navy} />
			</G>
			{/* stos płyt */}
			<G x={v ? 540 : cx + 420} y={v ? 760 : FL - 20} s={v ? 0.8 : 1}>
				{Array.from({length: Math.min(n, 25)}).map((_, i) => (
					<rect key={i} x={-130 + (i % 2) * 6} y={-i * 16} width={260} height={14} rx={3} fill={P.grassDark} stroke={P.navy} strokeWidth={2} />
				))}
				{Array.from({length: Math.max(0, n - 25)}).map((_, i) => (
					<rect key={i} x={150 + (i % 2) * 6} y={-i * 16} width={200} height={14} rx={3} fill={P.grassDark} stroke={P.navy} strokeWidth={2} />
				))}
				{scr > 0 && (
					<g transform={`translate(${-40 + Math.sin(f / 2) * 20 * (scr < 1 ? 1 : 0)} ${-440}) rotate(-30)`}>
						<rect x={-10} y={-120} width={20} height={120} fill="#AEB8C2" stroke={P.navy} strokeWidth={4} />
						<rect x={-22} y={0} width={44} height={110} rx={12} fill={P.red} stroke={P.navy} strokeWidth={5} />
					</g>
				)}
			</G>
			{f >= K.d50 - 4 && (
				<G x={v ? 540 : cx + 420} y={v ? 300 : 140} s={pk(f, K.d50 - 4)}>
					<Plate text={`${n} × 500 $`} label={f > K.d500 + 10 ? '= 25 000 $' : 'zamówienie'} w={v ? 560 : 520} size={86} />
				</G>
			)}
			{scr > 0.3 && (
				<G x={v ? 540 : cx + 420} y={v ? 540 : FL - 520} s={pk(f, K.zloz)} r={-6}>
					<Stamp lines={['ZŁOŻONE!']} w={420} color={P.navy} />
				</G>
			)}
		</g>
	);
};

// 5: cena 666,66 $, cyfry tańczą; ok. 200 sztuk
const R5: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const digits = ['6', '6', '6', ',', '6', '6', ' ', '$'];
	const dance = f > K.cyfry ? 1 : 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx - 300} y={FL} s={v ? 1.0 : 1.1}>
				<Crt s={1.6} screen={<FText text="Apple I" x={0} y={-80} size={34} fill={P.goldLight} opacity={prog(f, K.l15, 8)} />} />
			</G>
			<g transform={`translate(${v ? 540 : cx + 260} ${v ? 360 : 330})`}>
				{digits.map((d, i) => {
					const a = K.d666 - 6 + i * 4;
					if (f < a) return null;
					const y = -Math.abs(Math.sin((f - a) / 6)) * 30 * Math.exp(-(f - a) / 20) - dance * Math.abs(Math.sin((f + i * 5) / 5)) * 26;
					const xs = [-3.3, -2.3, -1.3, -0.65, 0, 1, 2.2, 2.2];
					if (d === ' ') return null;
					return <FText key={i} text={d} x={xs[i] * (v ? 100 : 90)} y={y} size={v ? 170 : 150} fill={i === 7 ? P.navy : P.goldDark} stroke={P.bg} sw={12} />;
				})}
			</g>
			{f >= K.d200 - 6 && (
				<G x={v ? 540 : cx + 260} y={v ? 600 : 560} s={pk(f, K.d200 - 6)}>
					<Plate text={`ok. ${Math.round(200 * ip(f, K.d200 - 6, K.d200 + 20, 0, 1, EOUT))}`} label="komputerów" w={v ? 440 : 400} size={90} />
				</G>
			)}
		</g>
	);
};

// 6: garaż rodziców Jobsa w Los Altos: test płyt, dowóz do sklepu, gotówka
const R6: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const hx = v ? 270 : cx - 500;
	const gx = v ? 730 : cx - 60;
	const drive = ip(f, K.wioza, K.wioza + 60, 0, 1, EIO);
	const cash = pk(f, K.got);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={hx} y={FL} s={v ? 0.72 : 1.05}>
				<House w={420} h={290} wall="#E4DBCB" roof="#7A5A3E" />
			</G>
			<G x={gx} y={FL} s={v ? 0.76 : 1.05}>
				<Garage w={460} h={330} open={ip(f, K.gar18, K.gar18 + 20, 0, 1, EIO)} id="a6" roof="#7A5A3E" label="Los Altos" labelSize={34}>
					<Desk w={260} lamp={1}>
						{[0, 1, 2].map((i) => (
							<g key={i} transform={`translate(${-70 + i * 60} -14) scale(0.18)`}>
								<Pcb w={300} lit={(f - K.uruch) % 30 > i * 10 && f > K.uruch ? 1 : 0} />
							</g>
						))}
					</Desk>
				</Garage>
			</G>
			<G x={v ? 540 : cx + 260 + drive * (v ? 0 : 520)} y={v ? FL : FL} s={(v ? 0.7 : 0.8) * (f > K.wioza - 10 ? 1 : 0)} o={v ? 1 - drive : 1}>
				<Car f={f * drive} color={P.slate} />
				<g transform="translate(-20 -200)">
					<Box w={120} />
				</g>
			</G>
			{cash > 0 && (
				<G x={v ? 540 : cx + 640} y={v ? 420 : 260} s={cash}>
					{[0, 1, 2].map((i) => (
						<G key={i} x={(i - 1) * 40} y={-i * 14} r={(i - 1) * 10} s={0.8}>
							<Banknote value="100" w={150} />
						</G>
					))}
				</G>
			)}
		</g>
	);
};

// 7: cytat Wozniaka; szyld LEGENDA się przekrzywia; [film] Markkula 1977
const R7: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const tilt = ip(f, K.mit, K.mit + 14, 0, 1, EBACK);
	const chk = live(f, K.l23 - 4, K.l24 + 4, 8);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 260 : cx - 560} y={FL} s={v ? 1 : 1.1}>
				<Adult look={LOOK.woz} talk={f > K.l21 && f < K.l23} mood="smile" seed={8} armR={30} />
			</G>
			<G x={v ? 640 : cx - 120} y={v ? 380 : 300} s={pk(f, K.l21 - 4) * (v ? 0.95 : 1)}>
				<path d="M -300 -120 L 300 -120 Q 330 -120 330 -90 L 330 90 Q 330 120 300 120 L -150 120 L -250 190 L -220 120 L -300 120 Q -330 120 -330 90 L -330 -90 Q -330 -120 -300 -120 Z" fill={P.white} stroke={P.navy} strokeWidth={7} />
				<FText text="„Garaż to trochę mit." x={0} y={-20} size={48} fill={P.navy} />
				<FText text="Nie projektowaliśmy tam niczego”" x={0} y={50} size={40} fill={P.slate} opacity={prog(f, K.l22, 8)} />
			</G>
			<G x={v ? 780 : cx + 520} y={FL} s={v ? 0.75 : 0.95}>
				<Garage w={460} h={330} open={0} id="a7" roof="#7A5A3E" />
				<g transform={`translate(0 ${-470}) rotate(${tilt * 18} 120 0)`}>
					<rect x={-170} y={-40} width={340} height={80} rx={10} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="LEGENDA" x={0} y={18} size={48} fill={P.navy} />
				</g>
			</G>
			{chk > 0 && (
				<G x={v ? 540 : cx + 300} y={v ? 820 : 360} s={chk * (v ? 1 : 0.85)} r={-4}>
					<Check amount="inwestycja" to="Apple Computer, Inc." w={520} write={ip(f, K.mike, K.spolka + 20, 0, 1)} />
					<G x={0} y={-180} s={0.9}>
						<Calendar text="1977" w={150} top="styczeń" />
					</G>
				</G>
			)}
		</g>
	);
};

// 8: fundament: pod garażem zamówienie na 50 komputerów zamiast ścian
const R8: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const cut = ip(f, K.zam - 6, K.zam + 20, 0, 1, EIO);
	const walls = ip(f, K.sciany - 4, K.sciany + 14, 1, 0.25, EIO);
	const by = v ? 760 : 520;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={cx} y={by} s={v ? 1.15 : 1} o={walls}>
				<Garage w={460} h={330} open={0} id="a8" roof="#7A5A3E" label="LEGENDA" labelSize={40} />
			</G>
			{/* przekrój gruntu i fundament */}
			<rect x={cx - (v ? 420 : 500)} y={by + 6} width={v ? 840 : 1000} height={(v ? 300 : 230) * cut} fill="#8C7A5E" stroke={P.navy} strokeWidth={6} />
			{cut > 0.3 && (
				<G x={cx} y={by + (v ? 150 : 115)} s={pk(f, K.zam) * (v ? 1.1 : 1)}>
					<rect x={-330} y={-80} width={660} height={160} rx={10} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="ZAMÓWIENIE: 50 szt." x={0} y={20} size={60} fill={P.navy} />
				</G>
			)}
			<G x={v ? 540 : W - 360} y={v ? 300 : 170} s={v ? 0 : pk(f, K.opow - 4)}>
				<Sign text="dobra opowieść" w={v ? 440 : 360} fill={P.gold} />
			</G>
		</g>
	);
};

// 9: [most] 18 lat później: 1994, stos książek, łańcuch
const R9: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const yr = Math.round(1976 + 18 * ip(f, K.y18, K.y18 + 40, 0, 1, EIO));
	const chain = ip(f, K.ksiazki, K.end, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#DCCFB8" />
			<FloorDeco l={l} />
			<G x={v ? 260 : 300} y={v ? 300 : 210} s={pk(f, K.l26 - 4)}>
				<Calendar text={`${yr}`} w={210} />
			</G>
			{Array.from({length: 9}).map((_, i) => {
				const a = K.l27 + i * 5;
				if (f < a) return null;
				const y0 = ip(f, a, a + 14, -500, 0, EIN);
				return (
					<G key={i} x={(v ? 540 : cx) + ((i % 3) - 1) * 10} y={FL - i * 34 + y0} r={((i % 3) - 1) * 3} s={v ? 1.1 : 1}>
						<rect x={-150} y={-32} width={300} height={32} rx={4} fill={[P.blue, P.red, P.gold, P.grassDark, P.slate][i % 5]} stroke={P.navy} strokeWidth={4} />
					</G>
				);
			})}
			{chain > 0 && <Chain x0={(v ? 540 : cx) + 160} y0={FL - 200} x1={W + 40} y1={FL - 260} sag={60} p={chain} link={28} />}
		</g>
	);
};

const ROOMS = [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<Stage v={v} lines={LINES} vo="ga3_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`gd3c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((Rm, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#gd3c${v ? 'v' : 'h'})`}>
									<Rm f={f} l={l} />
								</g>
							</g>
						) : null,
					)}
				</g>
			)}
		</Stage>
	);
};

export const GarApple: React.FC = () => (
	<WithCard cardFrames={CARD} card={<GarageCard num={3} name="Apple" year="1976" />}>
		<Scene />
	</WithCard>
);
export const GarAppleS: React.FC = () => (
	<ShortWithCta sceneFrames={AS_SCENE}>
		<CutShort keep={KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
