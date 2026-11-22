// Historia 5: Google, 1998 (GarGoogle = film z planszą, GarGoogleS = short 5).
// Pokoje: garaż z polem wyszukiwania i metką 1700 $ → Stanford 1995: Page i Brin → akademik: sieć stron,
// linki jak głosy, waga głosu → BackRub → „googol”: jedynka i sto zer wypełniają kadr → Google →
// sierpień 1998: czek 100 000 $ dla firmy, której nie ma (przerywany budynek) → 4.09.1998 spółka →
// Susan Wojcicki i garaż w Menlo Park → wnętrze: komputery, ping-pong, niebieski dywan; [film] Bezos inwestuje →
// marzec 1999: przeprowadzka do Palo Alto, pół roku → Susan: nr 16, YouTube 2006, dom kupiony, szefowa YouTube 2014.
import React from 'react';
import {LINES} from './ga5.gen';
import {
	Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, FText, clamp01, prog, Room, Plate, LAY, kk, FloorDeco, type Lay,
	LOOK, Garage, Chain, Sign, House, Tower, Desk, Crt, Box, Truck, PingPong, Calendar, Stamp, Check, Tag, BayMap, Pin,
	CARD, GarageCard, CutShort, keepFrom, keepLen, ShortWithCta,
} from './gkit';
import {BAY_CITIES} from './geo.gen';

const T = makeT(LINES);
const END = endOf(LINES) + 30;
export const O_FRAMES = CARD + END;
const KEEP = keepFrom(LINES, [16], null, END);
export const OS_SCENE = keepLen(KEEP);

const K = {
	garazu: T(0, 'garażu'),
	l1: T(1), d1700: T(1, '1700'),
	l2: T(2), larry: T(2, 'Larry'), sergey: T(2, 'Sergey'), y95: T(2, '1995'),
	l3: T(3), akad: T(3, 'akademiku'), wysz: T(3, 'wyszukiwarkę'),
	l4: T(4), strony: T(4, 'strony'), prow: T(4, 'prowadzi'),
	l5: T(5), glos: T(5, 'głos'),
	l6: T(6), wiele: T(6, 'wiele'), wazy: T(6, 'waży'),
	l7: T(7), backrub: T(7, 'BackRub'),
	l8: T(8), google8: T(8, 'Google'), googol: T(8, '„googol”'), sto: T(8, '100'), blad: T(8, 'błędem'),
	l9: T(9), y98: T(9, '1998'),
	l10: T(10), andy: T(10, 'Andy'), czek: T(10, 'czek'), d100k: T(10, '100'),
	l11: T(11), nie: T(11, 'nie'),
	l12: T(12), d4: T(12, '4'), spolke: T(12, 'spółkę'),
	l13: T(13), susan: T(13, 'Susan'),
	l14: T(14), menlo: T(14, 'Menlo'), d1700b: T(14, '1700'),
	l15: T(15), komp: T(15, 'komputery'), pp: T(15, 'ping-ponga'), dywan: T(15, 'dywan'),
	l16: T(16), bezos: T(16, 'Jeff'),
	l17: T(17), y99: T(17, '1999'), palo: T(17, 'Palo'),
	l18: T(18), pol: T(18, 'pół'),
	l19: T(19), l20: T(20), n16: T(20, '16'),
	l21: T(21), y2006: T(21, '2006'), yt: T(21, 'YouTube'),
	l22: T(22), dom: T(22, 'dom'),
	l23: T(23), y2014: T(23, '2014'), szef: T(23, 'szefową'),
	end: END,
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, -60, 1.1], [0, -80, 1.1]),
	kk(v, K.d1700 + 10, 0, [200, -160, 1.24], [140, -220, 1.22]),
	kk(v, K.l2 - 12, 0, [100, -80, 1.1], [60, -100, 1.1]),
	kk(v, K.l2 + 14, 1, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.y95 + 10, 1, [0, -60, 1.1], [0, -80, 1.08]),
	kk(v, K.l3 - 12, 1, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l3 + 14, 2, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.prow + 10, 2, [0, -160, 1.1], [0, -200, 1.1]),
	kk(v, K.wazy + 20, 2, [60, -200, 1.2], [0, -260, 1.2]),
	kk(v, K.l7 - 12, 2, [0, -120, 1.08], [0, -160, 1.08]),
	kk(v, K.l7 + 14, 3, [0, -20, 1.02], [0, -20, 1.02]),
	kk(v, K.sto + 30, 3, [0, -20, 1.14], [0, -40, 1.12]),
	kk(v, K.l9 - 12, 3, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.l9 + 14, 4, [-200, -20, 1.04], [-100, -20, 1.04]),
	kk(v, K.czek + 20, 4, [-100, -80, 1.14], [0, -120, 1.12]),
	kk(v, K.nie + 10, 4, [260, -60, 1.12], [0, -40, 1.1]),
	kk(v, K.spolke + 20, 4, [200, -80, 1.08], [0, -80, 1.06]),
	kk(v, K.l13 - 12, 4, [100, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l13 + 14, 5, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.d1700b + 16, 5, [200, -100, 1.14], [100, -140, 1.12]),
	kk(v, K.l15 - 12, 5, [100, -60, 1.12], [60, -80, 1.12]),
	kk(v, K.l15 + 14, 6, [0, -40, 1.1], [0, -60, 1.1]),
	kk(v, K.dywan + 20, 6, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l17 - 12, 6, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l17 + 14, 7, [-200, -20, 1.04], [-100, -20, 1.04]),
	kk(v, K.pol + 16, 7, [200, -80, 1.12], [100, -120, 1.1]),
	kk(v, K.l19 - 12, 7, [100, -40, 1.04], [60, -40, 1.04]),
	kk(v, K.l19 + 14, 8, [0, -60, 1.1], [0, -80, 1.1]),
	kk(v, K.yt + 20, 8, [200, -80, 1.1], [0, -120, 1.08]),
	kk(v, K.l22 - 12, 8, [100, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l22 + 14, 9, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.szef + 6, 9, [200, -120, 1.16], [100, -160, 1.14]),
	kk(v, K.end, 9, [0, -40, 1.02], [0, -40, 1.02]),
];
const DIPS: [number, number, number][] = [K.l2, K.l3, K.l7, K.l9, K.l13, K.l15, K.l17, K.l19, K.l22].map((b) => [b - 12, b + 14, 0.1]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.d1700), kind: 'punch', amp: 0.5},
	{t: s(K.y95), kind: 'punch', amp: 0.4},
	{t: s(K.glos), kind: 'punch', amp: 0.4},
	{t: s(K.wazy), kind: 'punch', amp: 0.5},
	{t: s(K.googol), kind: 'punch', amp: 0.5},
	{t: s(K.blad), kind: 'both', amp: 0.6},
	{t: s(K.d100k + 10), kind: 'punch', amp: 0.6},
	{t: s(K.nie), kind: 'shake', amp: 0.4},
	{t: s(K.d4), kind: 'punch', amp: 0.5},
	{t: s(K.dywan), kind: 'punch', amp: 0.3},
	{t: s(K.n16), kind: 'punch', amp: 0.5},
	{t: s(K.yt), kind: 'punch', amp: 0.5},
	{t: s(K.dom + 10), kind: 'punch', amp: 0.5},
	{t: s(K.szef), kind: 'both', amp: 0.7},
];

type R = React.FC<{f: number; l: Lay}>;
// Pole wyszukiwania (środek w 0,0); typed = tekst.
const SearchBox: React.FC<{w?: number; typed?: string}> = ({w = 420, typed = ''}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.09} width={w} height={w * 0.18} rx={w * 0.09} fill={P.white} stroke={P.navy} strokeWidth={6} />
		<circle cx={w / 2 - w * 0.1} cy={-w * 0.01} r={w * 0.035} fill="none" stroke={P.navy} strokeWidth={5} />
		<line x1={w / 2 - w * 0.075} y1={w * 0.025} x2={w / 2 - w * 0.05} y2={w * 0.05} stroke={P.navy} strokeWidth={6} strokeLinecap="round" />
		<FText text={typed} x={-w / 2 + w * 0.08} y={w * 0.035} size={w * 0.08} fill={P.navy} anchor="start" />
	</g>
);

// 0: garaż z polem wyszukiwania i metką 1700 $ / mies.
const R0: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const typed = 'pierwsze biuro'.slice(0, Math.max(0, Math.floor(f / 3)));
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={cx} y={FL} s={v ? 1.55 : 1.4}>
				<Garage w={460} h={330} open={ip(f, K.garazu, K.garazu + 24, 0, 1, EIO)} id="o0" roof="#4F6A7A">
					<Desk w={260} lamp={1}>
						<g transform="translate(-50 0) scale(0.5)">
							<Crt />
						</g>
					</Desk>
				</Garage>
				<g transform="translate(0 -440)">
					<SearchBox w={420} typed={typed} />
				</g>
				<g transform="translate(205 -205) scale(0.62)">
					<Tag text="1700 $/mies." w={300} swing={swing(f, K.d1700, 14)} />
				</g>
			</G>
		</g>
	);
};

// 1: Stanford 1995: Page i Brin się poznają
const R1: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const meet = ip(f, K.sergey, K.sergey + 30, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={cx} y={v ? 300 : 150} s={pk(f, K.l2 + 20)}>
				<Sign text="Stanford" w={420} fill="#7A4E3A" color={P.bg} />
			</G>
			<G x={v ? 860 : W - 220} y={v ? 480 : 220} s={pk(f, K.y95 - 2)}>
				<Calendar text="1995" w={210} />
			</G>
			<G x={(v ? 200 : cx - 640) + meet * (v ? 120 : 360)} y={FL} s={(v ? 1.05 : 1.1) * pk(f, K.larry - 6)}>
				<Adult look={LOOK.page} walk={meet > 0 && meet < 1} armR={meet >= 1 ? 50 : 10} mood="smile" seed={16} />
				<FText text="Larry Page" x={v ? 0 : -250} y={v ? 200 : -300} size={40} fill={P.navy} />
			</G>
			<G x={(v ? 880 : cx + 640) - meet * (v ? 120 : 360)} y={FL} s={(v ? 1.05 : 1.1) * pk(f, K.sergey - 6)}>
				<Adult look={LOOK.brin} walk={meet > 0 && meet < 1} armL={meet >= 1 ? 50 : 10} mood="smile" seed={17} />
				<FText text="Sergey Brin" x={v ? 0 : 250} y={v ? 200 : -300} size={40} fill={P.navy} />
			</G>
		</g>
	);
};

// 2: akademik: sieć stron, linki jak głosy, waga głosu
const NODES: [number, number, number][] = [
	[0, 0, 1],
	[-300, -120, 0],
	[-260, 140, 0],
	[280, -160, 0],
	[320, 120, 0],
	[-80, -260, 0],
	[120, 260, 0],
	[-460, 10, 0],
	[480, -10, 0],
];
const EDGES: [number, number][] = [
	[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 1], [8, 3], [5, 3], [6, 4], [7, 2], [8, 4],
];
const R2: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const net = ip(f, K.strony - 6, K.prow + 20, 0, 1, EIO);
	const vote = ip(f, K.glos - 4, K.glos + 20, 0, 1, EIO);
	const big = ip(f, K.wiele, K.wazy + 10, 0, 1, EBACK);
	const ny = v ? 520 : 330;
	const sc = v ? 0.95 : 0.9;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#DCCFB8" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx} y={FL} s={v ? 1.05 : 1.1}>
				<Desk w={560} lamp={0.8}>
					{[-140, 0, 140].map((x, i) => (
						<g key={i} transform={`translate(${x} 0) scale(0.55)`}>
							<Crt screen={<FText text={i === 1 ? 'BackRub' : ''} x={0} y={-86} size={30} fill={P.goldLight} opacity={prog(f, K.wysz, 8)} />} />
						</g>
					))}
				</Desk>
			</G>
			<g transform={`translate(${cx} ${ny}) scale(${sc})`} opacity={net > 0 ? 1 : 0}>
				{EDGES.map(([a, b], i) => {
					const A = NODES[a];
					const B = NODES[b];
					const q = clamp01(net * 1.4 - i * 0.05);
					const mx = A[0] + (B[0] - A[0]) * q;
					const my = A[1] + (B[1] - A[1]) * q;
					const vq = clamp01(vote * 1.5 - i * 0.05);
					return (
						<g key={i}>
							<line x1={A[0]} y1={A[1]} x2={mx} y2={my} stroke={P.slate} strokeWidth={5} opacity={0.8} />
							{vote > 0 && b === 0 && (
								<g transform={`translate(${A[0] + (B[0] - A[0]) * vq * 0.8} ${A[1] + (B[1] - A[1]) * vq * 0.8})`} opacity={1 - clamp01(vq * 1.25 - 0.25)}>
									<rect x={-16} y={-12} width={32} height={24} rx={4} fill={P.white} stroke={P.navy} strokeWidth={3} />
									<path d="M -8 0 L -2 6 L 9 -6" fill="none" stroke={P.red} strokeWidth={3} />
								</g>
							)}
						</g>
					);
				})}
				{NODES.map(([x, y], i) => {
					const r = i === 0 ? 34 + 50 * big : i === 3 || i === 4 ? 26 + 14 * big : 24;
					return (
						<g key={i} transform={`translate(${x} ${y}) scale(${clamp01(net * 3 - i * 0.2)})`}>
							<rect x={-r} y={-r * 1.2} width={r * 2} height={r * 2.4} rx={6} fill={i === 0 ? P.gold : P.white} stroke={P.navy} strokeWidth={5} />
							{[0, 1, 2].map((k) => (
								<line key={k} x1={-r * 0.6} x2={r * 0.6} y1={-r * 0.6 + k * r * 0.5} y2={-r * 0.6 + k * r * 0.5} stroke={P.grey} strokeWidth={4} />
							))}
						</g>
					);
				})}
			</g>
		</g>
	);
};

// 3: BackRub → „googol” (jedynka i sto zer) → Google
const R3: R = ({f, l}) => {
	const {v, W, H, FL} = l;
	const cx = W / 2;
	const zeros = Math.floor(100 * ip(f, K.sto - 4, K.sto + 50, 0, 1, EIO));
	const morph = ip(f, K.blad - 6, K.blad + 10, 0, 1, EIO);
	const per = v ? 10 : 20;
	const size = v ? 66 : 64;
	const cw = size * 0.6;
	return (
		<g>
			<Room w={W} h={H} floor={FL} tone="#33445A" dark />
			<G x={cx} y={v ? 300 : 150} s={pk(f, K.backrub - 4)}>
				<g opacity={1 - prog(f, K.google8 - 4, 8) * 0.6}>
					<FText text="BackRub" x={0} y={30} size={90} fill={P.bg} />
				</g>
				{f > K.google8 - 4 && <line x1={-200} x2={200} y1={0} y2={0} stroke={P.red} strokeWidth={10} strokeLinecap="round" opacity={prog(f, K.google8 - 4, 6)} />}
			</G>
			{/* jedynka i zera wypełniają kadr */}
			<g transform={`translate(${cx - (per * cw) / 2} ${v ? 520 : 300})`}>
				{f >= K.sto - 4 && <FText text="1" x={-cw * 0.6} y={0} size={size} fill={P.gold} anchor="start" />}
				{Array.from({length: zeros}).map((_, i) => (
					<FText key={i} text="0" x={((i + 1) % per) * cw} y={Math.floor((i + 1) / per) * size * 1.0} size={size} fill={P.bg} anchor="start" opacity={0.85} />
				))}
			</g>
			{f >= K.googol - 4 && (
				<G x={cx} y={v ? 1080 : 760} s={pk(f, K.googol - 4) * (v ? 1 : 0.9)}>
					<rect x={-300} y={-80} width={600} height={140} rx={20} fill={P.bg} stroke={P.gold} strokeWidth={6} />
					<FText text={morph > 0.5 ? 'Google' : 'googol'} x={0} y={30} size={96} fill={P.navy} />
				</G>
			)}
		</g>
	);
};

// 4: sierpień 1998: czek 100 000 $ dla firmy, której nie ma; 4.09.1998 spółka
const R4: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const write = ip(f, K.czek, K.d100k + 20, 0, 1, EIO);
	const fill = ip(f, K.spolke - 6, K.spolke + 16, 0, 1, EIO);
	const bx = v ? 540 : cx + 480;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 260 : 280} y={v ? 300 : 200} s={pk(f, K.y98 - 2)}>
				<Calendar text={f > K.d4 ? '4 września' : 'sierpień'} w={220} top="1998" />
			</G>
			<G x={v ? 160 : cx - 700} y={FL} s={(v ? 0.8 : 1) * pk(f, K.andy - 6)}>
				<Adult look={LOOK.andy} armR={write > 0 && write < 1 ? 70 : 20} mood="smile" seed={18} />
			</G>
			<G x={v ? 640 : cx - 240} y={v ? 520 : FL - 380} s={pk(f, K.czek - 4) * (v ? 0.95 : 1.05)} r={-4}>
				<Check amount="100 000 $" to="Google Inc." w={520} write={write} />
			</G>
			<G x={bx} y={v ? 1110 : FL} s={(v ? 0.6 : 0.9) * pk(f, K.nie - 6)}>
				<rect x={-200} y={-460} width={400} height={460} fill={fill > 0 ? '#D9C9AE' : 'none'} fillOpacity={fill} stroke={P.navy} strokeWidth={7} strokeDasharray={fill > 0.95 ? undefined : '24 16'} />
				<path d="M -230 -456 L 0 -580 L 230 -456 Z" fill={fill > 0 ? '#4F6A7A' : 'none'} fillOpacity={fill} stroke={P.navy} strokeWidth={7} strokeDasharray={fill > 0.95 ? undefined : '24 16'} strokeLinejoin="round" />
				<FText text={fill > 0.5 ? 'Google Inc.' : '?'} x={0} y={-230} size={fill > 0.5 ? 60 : 160} fill={P.navy} opacity={fill > 0.5 ? fill : 0.5} />
			</G>
		</g>
	);
};

// 5: Susan Wojcicki, dom z garażem w Menlo Park, 1700 $ / mies.
const R5: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const hx = v ? 300 : cx - 440;
	const gx = v ? 800 : cx + 160;
	const key = ip(f, K.susan + 10, K.susan + 40, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={hx} y={FL} s={v ? 0.85 : 1.1}>
				<House w={420} h={290} roof="#4F6A7A" lit={1} />
			</G>
			<G x={gx} y={FL} s={v ? 0.82 : 1.05}>
				<Garage w={460} h={330} open={ip(f, K.l14, K.l14 + 24, 0, 1, EIO)} id="o5" roof="#4F6A7A" label="Menlo Park" labelSize={36}>
					<Desk w={250} lamp={1} />
				</Garage>
				<g transform="translate(205 -205) scale(0.62)">
					<Tag text="1700 $/mies." w={300} swing={swing(f, K.d1700b, 12)} />
				</g>
			</G>
			<G x={v ? 540 : cx + 640} y={FL} s={(v ? 0.85 : 1.05) * pk(f, K.susan - 6)}>
				<Adult look={LOOK.susan} mood="smile" armL={key > 0 && key < 1 ? 60 : 12} seed={19} />
				<FText text="Susan Wojcicki" x={0} y={70} size={40} fill={P.navy} />
			</G>
			{key > 0 && key < 1 && (
				<G x={(v ? 540 : cx + 640) - key * 260} y={FL - 320 - Math.sin(key * Math.PI) * 120} r={key * 360} s={1.2}>
					<circle r={16} fill="none" stroke={P.gold} strokeWidth={8} />
					<rect x={14} y={-5} width={44} height={10} fill={P.gold} />
					<rect x={44} y={5} width={8} height={10} fill={P.gold} />
				</G>
			)}
		</g>
	);
};

// 6: wnętrze garażu: komputery, ping-pong, niebieski dywan; [film] Bezos dołącza
const R6: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const carpet = ip(f, K.dywan - 4, K.dywan + 20, 0, 1, EOUT);
	const ball = ((f - K.pp) / 20) % 2;
	const bz = live(f, K.l16 - 4, K.l17 + 4, 8);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#5C6B7A" dark />
			<path d={`M ${cx - (v ? 500 : 820) * carpet} ${FL + 10} L ${cx + (v ? 500 : 820) * carpet} ${FL + 10} L ${cx + (v ? 540 : 900) * carpet} ${l.H} L ${cx - (v ? 540 : 900) * carpet} ${l.H} Z`} fill={P.blue} opacity={0.9} />
			<G x={v ? 290 : cx - 520} y={FL} s={(v ? 0.9 : 1) * pk(f, K.komp - 6)}>
				<Desk w={420} lamp={1}>
					{[-110, 60].map((x) => (
						<g key={x} transform={`translate(${x} 0) scale(0.7)`}>
							<Crt />
						</g>
					))}
				</Desk>
			</G>
			<G x={v ? 790 : cx + 380} y={FL} s={(v ? 0.85 : 1.05) * pk(f, K.pp - 6)}>
				<PingPong w={460} ball={ball > 1 ? 2 - ball : ball} />
			</G>
			{bz > 0 && (
				<g opacity={bz}>
					<Chain x0={-40} y0={v ? 400 : 160} x1={v ? 520 : cx} y1={v ? 420 : 200} sag={50} p={ip(f, K.l16, K.bezos + 20, 0, 1, EIO)} link={26} glow={1} />
					<G x={v ? 640 : cx + 120} y={v ? 470 : 240} s={0.6}>
						<Check amount="inwestycja" to="Google" w={420} write={1} />
					</G>
					<FText text="Jeff Bezos" x={v ? 640 : cx + 120} y={v ? 600 : 360} size={44} fill={P.bg} />
				</g>
			)}
		</g>
	);
};

// 7: marzec 1999: przeprowadzka do Palo Alto; garaż wystarczył na pół roku
const R7: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const drive = ip(f, K.palo, K.palo + 60, 0, 1, EIN);
	const pages = Math.floor(6 * ip(f, K.pol - 6, K.pol + 30, 0, 1, EIO));
	const months = ['wrzesień', 'październik', 'listopad', 'grudzień', 'styczeń', 'luty', 'marzec'];
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<FloorDeco l={l} />
			<G x={v ? 220 : cx - 560} y={FL} s={v ? 0.75 : 0.95}>
				<Garage w={460} h={330} open={1 - prog(f, K.pol + 30, 14)} id="o7" roof="#4F6A7A" />
			</G>
			<G x={(v ? 640 : cx + 60) + drive * (v ? 700 : 1300)} y={FL} s={v ? 0.85 : 1.05}>
				<Truck f={f * drive} />
				{[0, 1, 2].map((i) => (
					<g key={i} transform={`translate(${-150 + i * 70} -200)`}>
						<Box w={60} />
					</g>
				))}
			</G>
			<G x={v ? 860 : W - 260} y={v ? 300 : 150} s={pk(f, K.palo - 4)}>
				<Sign text="Palo Alto →" w={v ? 360 : 340} fill={P.navy} color={P.bg} />
			</G>
			<G x={v ? 260 : cx} y={v ? 300 : 200} s={pk(f, K.y99 - 4)}>
				<Calendar text={f < K.pol - 6 ? 'marzec' : months[Math.min(6, pages)]} w={230} top={f < K.pol - 6 || pages >= 4 ? '1999' : '1998'} />
			</G>
			{f >= K.pol - 6 && (
				<G x={v ? 540 : cx} y={v ? 600 : 420} s={pk(f, K.pol)}>
					<Plate text="pół roku" w={v ? 480 : 440} size={90} />
				</G>
			)}
		</g>
	);
};

// 8: Susan Wojcicki: pracownica nr 16, YouTube 2006
const R8: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const q = live(f, K.l19 - 4, K.n16 + 4, 6);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 300 : cx - 380} y={FL} s={v ? 1.1 : 1.2}>
				<Adult look={LOOK.susan} mood={f > K.n16 ? 'smile' : 'neutral'} seed={19} armR={f > K.yt ? 50 : 10} />
				{q > 0 && (
					<G y={-560} s={q}>
						<FText text="?" x={0} y={40} size={150} fill={P.gold} stroke={P.navy} sw={10} />
					</G>
				)}
				{f >= K.n16 - 4 && (
					<G x={-30} y={-300} s={pk(f, K.n16 - 4) * 0.8}>
						<rect x={-50} y={-30} width={100} height={60} rx={8} fill={P.white} stroke={P.navy} strokeWidth={5} />
						<FText text="#16" x={0} y={14} size={36} fill={P.red} />
					</G>
				)}
			</G>
			{f >= K.y2006 - 4 && (
				<G x={v ? 700 : cx + 380} y={v ? 520 : FL - 340} s={pk(f, K.y2006 - 4) * (v ? 0.9 : 1)}>
					<rect x={-180} y={-220} width={360} height={440} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="KUPNO" x={0} y={-150} size={48} fill={P.navy} />
					<FText text="YouTube" x={0} y={-80} size={56} fill={P.red} opacity={prog(f, K.yt - 2, 8)} />
					<FText text="2006" x={0} y={-20} size={40} fill={P.goldDark} />
					<path d="M -120 140 q 20 -34 40 0 t 40 0 t 40 0" fill="none" stroke={P.navy} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ip(f, K.yt + 6, K.yt + 30, 0, 1)} />
				</G>
			)}
		</g>
	);
};

// 9: Google kupuje dom (SPRZEDANE); 2014: szefowa YouTube
const R9: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const sold = f >= K.dom - 4 ? 1 + 1.2 * (1 - ip(f, K.dom - 4, K.dom + 8, 0, 1, EOUT)) : 0;
	const boss = pk(f, K.szef - 6);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={v ? 330 : cx - 420} y={FL} s={v ? 0.85 : 1.05}>
				<House w={420} h={290} roof="#4F6A7A" />
			</G>
			<G x={v ? 800 : cx + 60} y={FL} s={v ? 0.75 : 0.95}>
				<Garage w={460} h={330} open={0} id="o9" roof="#4F6A7A" />
			</G>
			{sold > 0 && (
				<G x={v ? 540 : cx - 120} y={v ? 560 : 340} s={sold * 0.7} r={-8}>
					<Stamp lines={['SPRZEDANE', 'Google, 2006']} w={520} color={P.red} />
				</G>
			)}
			{f >= K.y2014 - 6 && (
				<G x={v ? 540 : cx + 600} y={v ? 300 : 230} s={pk(f, K.y2014 - 6)}>
					<Calendar text="2014" w={190} />
				</G>
			)}
			{boss > 0 && (
				<G x={v ? 540 : cx + 600} y={v ? 980 : FL - 30} s={boss * (v ? 0.95 : 1)}>
					<rect x={-240} y={-90} width={480} height={90} rx={10} fill="#7A5A3E" stroke={P.navy} strokeWidth={6} />
					<rect x={-220} y={-160} width={440} height={80} rx={10} fill={P.navy} stroke={P.gold} strokeWidth={5} />
					<FText text="szefowa YouTube" x={0} y={-106} size={46} fill={P.goldLight} />
				</G>
			)}
		</g>
	);
};

const ROOMS = [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<Stage v={v} lines={LINES} vo="ga5_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`gd5c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((Rm, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#gd5c${v ? 'v' : 'h'})`}>
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

export const GarGoogle: React.FC = () => (
	<WithCard cardFrames={CARD} card={<GarageCard num={5} name="Google" year="1998" />}>
		<Scene />
	</WithCard>
);
export const GarGoogleS: React.FC = () => (
	<ShortWithCta sceneFrames={OS_SCENE}>
		<CutShort keep={KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
