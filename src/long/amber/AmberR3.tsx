// Amber Gold, rozdział 3 „Piramida w złotym opakowaniu”: wersja pozioma (AmberR3, z planszą) i pionowa (AmberS1 = short 1).
// Góra monet 851 mln → 1% na złoto → jedna moneta toczy się do szklanej rury → rura ma odgałęzienia:
// odsetki z pieniędzy nowych klientów, działalność, nieruchomości i czynsz, małżeństwo P., samoloty → billboard ze sztabką
// odwraca się i pokazuje puste rusztowanie. Pasek u góry ekranu sumuje, dokąd poszło 851 mln zł.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LINES} from './am3.gen';
import {
	AmberStage, WithCard, CardScene, ShortWithCta, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Coin, FText, clamp01, prog, Room, Plate, GoldBar, Mini, Crowd, Columns, Plane, CTA_FRAMES, VW, VH, HW, HH,
} from './kit';
import {Shop, Pile, fall, FloorDeco, LAY, kk, Magnifier, type Lay} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R3_FRAMES = CARD + SCENE;
export const S1_FRAMES = SCENE + CTA_FRAMES;

const K = {
	mln: T(0, '851'),
	lokaty: T(0, 'lokaty'),
	l1: T(1),
	zloto1: T(1, 'złoto'),
	m10: T(1, '10'),
	l2: T(2),
	l3: T(3),
	reszta: T(3, 'reszta'),
	l4: T(4),
	kazda: T(4, 'każda'),
	moneta: T(4, 'moneta'),
	l5: T(5),
	toczy: T(5, 'toczy'),
	l6: T(6),
	m290: T(6, '290'),
	wrocilo: T(6, 'wróciło'),
	odsetki: T(6, 'odsetki'),
	l7: T(7),
	zysk: T(7, 'zysk'),
	l8: T(8),
	kolejnych: T(8, 'kolejnych'),
	l9: T(9),
	m140: T(9, '140'),
	oddzialy: T(9, 'oddziały'),
	samochody: T(9, 'samochody'),
	telefony: T(9, 'telefony'),
	l10: T(10),
	nieruch: T(10, 'nieruchomości'),
	czynsz: T(10, 'czynsz'),
	t300: T(10, '300'),
	mies: T(10, 'miesięcznie'),
	l11: T(11),
	audytu: T(11, 'audytu'),
	prok: T(11, 'prokuraturę'),
	malz: T(11, 'małżeństwo'),
	wyplacilo: T(11, 'wypłaciło'),
	m19: T(11, '19'),
	l12: T(12),
	najw: T(12, 'największa'),
	m300: T(12, '300'),
	odlec: T(12, 'odleciała'),
	l13: T(13),
	l14: T(14),
	chwyt: T(14, 'chwytem'),
	end: endOf(LINES),
};

// --- geometria ---------------------------------------------------------------------------------------
type Geo = {pipeY: number; D: number; bx: number; mouthY: number; riserX: number; funnelY: number; plate: {x: number; y: number; w: number}};
const GEO = (v: boolean): Geo =>
	v
		? {pipeY: 300, D: 50, bx: 290, mouthY: 540, riserX: 990, funnelY: 1090, plate: {x: 600, y: 430, w: 600}}
		: {pipeY: 170, D: 56, bx: 560, mouthY: 400, riserX: 1840, funnelY: 770, plate: {x: 1440, y: 330, w: 620}};

// Kupka monet: wiersze od dołu, zwraca pozycje monet.
const pileCoins = (v: boolean) => {
	const cx = v ? 540 : 900;
	const base = v ? 1120 : 800;
	const r = v ? 28 : 24;
	const dx = v ? 52 : 44;
	const dy = v ? 44 : 34;
	const rows = v ? 14 : 13;
	const out: {x: number; y: number; row: number; k: number}[] = [];
	for (let row = 0; row < rows; row++) {
		const n = Math.max(1, Math.round((v ? 17 : 20) - row * (v ? 1.2 : 1.45)));
		for (let j = 0; j < n; j++) out.push({x: cx + (j - (n - 1) / 2) * dx + (hsh(row * 31 + j) - 0.5) * 8, y: base - r - row * dy, row, k: row * 40 + j});
	}
	return {coins: out, r, cx, base, apex: base - r - (rows - 1) * dy};
};
// Wybrana moneta (prawy brzeg 5. rzędu).
const leadCoin = (v: boolean) => {
	const p = pileCoins(v);
	const row = p.coins.filter((c) => c.row === 4);
	return row[row.length - 1];
};

// Punkt na łamanej w proporcji p (po długości).
const along = (pts: [number, number][], p: number) => {
	const lens: number[] = [];
	let tot = 0;
	for (let i = 1; i < pts.length; i++) {
		const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		lens.push(l);
		tot += l;
	}
	let d = clamp01(p) * tot;
	for (let i = 1; i < pts.length; i++) {
		if (d <= lens[i - 1] || i === pts.length - 1) {
			const q = lens[i - 1] ? Math.min(1, d / lens[i - 1]) : 1;
			return {x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * q, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * q};
		}
		d -= lens[i - 1];
	}
	return {x: pts[pts.length - 1][0], y: pts[pts.length - 1][1]};
};

// Droga pierwszej monety: zbocze → lejek → pion → rura główna → odgałęzienie w pokoju 1.
const leadPath = (v: boolean): [number, number][] => {
	const g = GEO(v);
	const W = v ? VW : HW;
	const c = leadCoin(v);
	const p = pileCoins(v);
	const slopeX = p.cx + (v ? 420 : 470);
	return [
		[c.x, c.y],
		[slopeX, p.base - p.r],
		[g.riserX, g.funnelY - 20],
		[g.riserX, g.pipeY],
		[W + g.bx, g.pipeY],
		[W + g.bx, g.mouthY],
	];
};
const LEAD = {a: K.l5 + 2, b: K.l6 + 8};
// Przejścia między pokojami: moneta jedzie rurą od odgałęzienia do odgałęzienia.
const HOPS: [number, number][] = [
	[K.l9 - 16, K.l9 + 10],
	[K.l10 - 16, K.l10 + 8],
	[K.l11 - 16, K.l11 + 10],
	[K.l12 - 14, K.l12 + 8],
];

const keysFor = (v: boolean): CK[] => {
	const W = v ? VW : HW;
	const c = leadCoin(v);
	const lp = leadPath(v);
	const at = (p: number) => along(lp, p);
	const cy = v ? 760 : 470;
	const keys: CK[] = [
		kk(v, 0, 0, [0, 0, 1], [0, 0, 1]),
		kk(v, K.mln + 10, 0, [0, -20, 1.05], [0, 0, 1.04]),
		kk(v, K.zloto1 - 4, 0, [0, 0, 1.02], [0, 0, 1.02]),
		kk(v, K.l2 + 8, 0, [200, 0, 1.12], [-120, 0, 1.1]),
		kk(v, K.l3 + 4, 0, [0, 0, 1], [0, 0, 1]),
		kk(v, K.l4 - 4, 0, [0, 0, 1.02], [0, 0, 1.02]),
		{f: K.moneta + 6, x: c.x, y: Math.max(c.y, v ? 560 : 330), z: 1.7},
		{f: LEAD.a, x: c.x, y: Math.max(c.y, v ? 560 : 330), z: 1.7},
	];
	// kamera jedzie za monetą
	for (let fr = LEAD.a + 3; fr < LEAD.b; fr += 3) {
		const p = ip(fr, LEAD.a, LEAD.b, 0, 1, EIO);
		const q = at(p);
		const z = 1.7 - ip(fr, LEAD.a, LEAD.b, 0, 0.7, EIO);
		keys.push({f: fr, x: q.x, y: Math.max(cy / z, Math.min((v ? VH : HH) - ((v ? VH : HH) - cy) / z, q.y)), z, e: 'io'});
	}
	keys.push(kk(v, LEAD.b + 6, 1, [0, 0, 1], [0, 0, 1]));
	keys.push(kk(v, K.odsetki + 6, 1, [-100, 0, 1.06], [0, 0, 1.04]));
	keys.push(kk(v, K.l8 + 6, 1, [80, 0, 1.04], [0, 0, 1.03]));
	const hopKeys = (i: number, a: number, b: number, mid: [number, number, number], vm: [number, number, number]) => {
		keys.push(kk(v, a, i - 1, [0, 0, 1], [0, 0, 1]));
		keys.push(kk(v, b, i, [0, 0, 1], [0, 0, 1]));
		keys.push(kk(v, b + 40, i, mid, vm));
	};
	hopKeys(2, HOPS[0][0], HOPS[0][1], [60, 0, 1.06], [0, 0, 1.04]);
	keys.push(kk(v, K.telefony + 10, 2, [0, 0, 1.08], [0, 0, 1.06]));
	hopKeys(3, HOPS[1][0], HOPS[1][1], [60, -20, 1.06], [0, 0, 1.04]);
	keys.push(kk(v, K.t300 + 10, 3, [120, 0, 1.12], [60, 0, 1.08]));
	hopKeys(4, HOPS[2][0], HOPS[2][1], [-60, 0, 1.06], [0, 0, 1.04]);
	keys.push(kk(v, K.m19 + 10, 4, [60, 0, 1.12], [0, 0, 1.08]));
	hopKeys(5, HOPS[3][0], HOPS[3][1], [0, 0, 1.04], [0, 0, 1.02]);
	keys.push(kk(v, K.odlec + 6, 5, [80, -30, 1.08], [0, 0, 1.05]));
	keys.push(kk(v, K.l14 - 12, 5, [0, 0, 1.04], [0, 0, 1.03]));
	keys.push(kk(v, K.l14 + 14, 6, [0, 0, 1], [0, 0, 1]));
	keys.push(kk(v, K.chwyt - 4, 6, [0, 0, 1.1], [0, 0, 1.08]));
	keys.push(kk(v, SCENE, 6, [0, 0, 1.02], [0, 0, 1.02]));
	keys.sort((a, b) => a.f - b.f);
	void W;
	return keys;
};
const DIPS: [number, number, number][] = [...HOPS.map(([a, b]): [number, number, number] => [a, b, 0.1]), [K.l14 - 12, K.l14 + 14, 0.12]];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.mln), kind: 'punch', amp: 0.6},
	{t: s(K.m10), kind: 'punch', amp: 0.4},
	{t: s(K.l2), kind: 'both', amp: 0.8},
	{t: s(K.reszta), kind: 'punch', amp: 0.5},
	{t: s(K.toczy), kind: 'shake', amp: 0.3},
	{t: s(K.m290), kind: 'punch', amp: 0.6},
	{t: s(K.zysk + 6), kind: 'punch', amp: 0.5},
	{t: s(K.kolejnych), kind: 'punch', amp: 0.5},
	{t: s(K.m140), kind: 'punch', amp: 0.6},
	{t: s(K.oddzialy), kind: 'punch', amp: 0.3},
	{t: s(K.l10), kind: 'punch', amp: 0.6},
	{t: s(K.t300), kind: 'punch', amp: 0.4},
	{t: s(K.malz), kind: 'punch', amp: 0.4},
	{t: s(K.m19), kind: 'both', amp: 0.6},
	{t: s(K.m300), kind: 'both', amp: 0.8},
	{t: s(K.odlec), kind: 'shake', amp: 0.6},
	{t: s(K.chwyt), kind: 'both', amp: 0.7},
];

// --- elementy -------------------------------------------------------------------------------------------
// Szklana rura po łamanej.
const Pipe: React.FC<{d: string; D: number}> = ({d, D}) => (
	<g fill="none" strokeLinecap="round" strokeLinejoin="round">
		<path d={d} stroke={P.navy} strokeWidth={D + 14} />
		<path d={d} stroke="#DDE6EA" strokeWidth={D} />
		<path d={d} stroke={P.white} strokeWidth={D * 0.16} opacity={0.8} transform={`translate(${-D * 0.22} ${-D * 0.22})`} />
	</g>
);
// Monety płynące rurą poziomą (od x0 do x1 na wysokości y).
const Flow: React.FC<{f: number; x0: number; x1: number; y: number; r: number; on: number; speed?: number}> = ({f, x0, x1, y, r, on, speed = 9}) => {
	if (on <= 0) return null;
	const gap = r * 4.2;
	const n = Math.floor((x1 - x0) / gap);
	return (
		<g opacity={on}>
			{Array.from({length: n}).map((_, i) => {
				const x = x0 + ((((i * gap + f * speed) % (x1 - x0)) + (x1 - x0)) % (x1 - x0));
				return (
					<G key={i} x={x} y={y} r={f * 12 + i * 40}>
						<Coin r={r} />
					</G>
				);
			})}
		</g>
	);
};
// Strumień monet spadających z wylotu rury.
const Stream: React.FC<{f: number; x: number; y0: number; y1: number; on: number; n?: number; spread?: number; r?: number; period?: number; seed?: number}> = ({f, x, y0, y1, on, n = 10, spread = 160, r = 20, period = 26, seed = 0}) => {
	if (on <= 0) return null;
	return (
		<g opacity={on}>
			{Array.from({length: n}).map((_, k) => {
				const t = (((f + (k * period) / n) % period) + period) % period / period;
				const y = y0 + (y1 - y0) * t * t;
				const xx = x + (hsh(k + seed) - 0.5) * spread * t;
				return (
					<G key={k} x={xx} y={y} r={t * 260 + k * 30} o={t > 0.9 ? (1 - t) * 10 : 1}>
						<Coin r={r} />
					</G>
				);
			})}
		</g>
	);
};
const Valve: React.FC<{ang: number; r?: number}> = ({ang, r = 34}) => (
	<g transform={`rotate(${ang})`}>
		<circle r={r} fill="none" stroke={P.red} strokeWidth={9} />
		<line x1={-r} y1={0} x2={r} y2={0} stroke={P.red} strokeWidth={8} />
		<line x1={0} y1={-r} x2={0} y2={r} stroke={P.red} strokeWidth={8} />
		<circle r={9} fill={P.navy} />
	</g>
);
const Counter: React.FC<{f: number; at: number; to: number; label: string; g: Geo; prefix?: string; unit?: string}> = ({f, at, to, label, g, prefix = '', unit = 'mln zł'}) =>
	f >= at - 2 ? (
		<G x={g.plate.x} y={g.plate.y} s={pk(f, at - 2)}>
			<Plate text={`${prefix}${Math.round(ip(f, at, at + 30, 0, to, EOUT))} ${unit}`} label={label} w={g.plate.w} size={Math.round(Math.min(78, (g.plate.w - 40) / (0.55 * (prefix.length + String(to).length + unit.length + 1))))} />
		</G>
	) : null;
const Car: React.FC<{c?: string}> = ({c = P.red}) => (
	<g>
		<path d="M -110 -30 L -80 -30 L -50 -78 L 50 -78 L 80 -30 L 110 -30 L 110 10 L -110 10 Z" fill={c} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -36 -66 L 36 -66 L 58 -34 L -58 -34 Z" fill={P.sky} stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />
		{[-62, 62].map((x) => (
			<circle key={x} cx={x} cy={12} r={22} fill={P.navy} stroke={P.slate} strokeWidth={6} />
		))}
	</g>
);
const Phone: React.FC<{f: number; ring: number}> = ({f, ring}) => {
	const sh = ring > 0 ? Math.sin(f * 2.2) * 8 * ring : 0;
	return (
		<g transform={`rotate(${sh})`}>
			<rect x={-50} y={-20} width={100} height={52} rx={12} fill={P.red} stroke={P.navy} strokeWidth={5} />
			<path d="M -58 -20 Q -58 -50 -30 -46 L 30 -46 Q 58 -50 58 -20 L 36 -20 L 30 -32 L -30 -32 L -36 -20 Z" fill={P.navy} />
			<circle cx={0} cy={6} r={12} fill={P.white} />
			{ring > 0 &&
				[0, 1].map((i) => (
					<path key={i} d={`M ${-80 - i * 18} ${-40 - i * 10} Q ${-96 - i * 18} ${-8} ${-80 - i * 18} ${24 + i * 10} M ${80 + i * 18} ${-40 - i * 10} Q ${96 + i * 18} ${-8} ${80 + i * 18} ${24 + i * 10}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" opacity={ring * (0.5 + 0.5 * Math.sin(f / 2 + i))} />
				))}
		</g>
	);
};
const Tower: React.FC<{w: number; h: number; c: string}> = ({w, h, c}) => (
	<g>
		<rect x={-w / 2} y={-h} width={w} height={h} fill={c} stroke={P.navy} strokeWidth={6} />
		{Array.from({length: Math.floor((h - 40) / 56)}).map((_, r) =>
			[0, 1, 2].map((k) => <rect key={`${r}${k}`} x={-w / 2 + 18 + k * ((w - 36) / 3)} y={-h + 24 + r * 56} width={(w - 36) / 3 - 14} height={32} fill={P.sky} opacity={0.85} />),
		)}
	</g>
);
const Sack: React.FC<{w?: number}> = ({w = 170}) => (
	<g>
		<path d={`M ${-w * 0.18} ${-w * 0.62} Q 0 ${-w * 0.5} ${w * 0.18} ${-w * 0.62} L ${w * 0.12} ${-w * 0.46} Q ${w * 0.56} ${-w * 0.3} ${w * 0.5} ${w * 0.1} Q ${w * 0.44} ${w * 0.4} 0 ${w * 0.4} Q ${-w * 0.44} ${w * 0.4} ${-w * 0.5} ${w * 0.1} Q ${-w * 0.56} ${-w * 0.3} ${-w * 0.12} ${-w * 0.46} Z`} fill="#B9A58C" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<FText text="zł" x={0} y={w * 0.12} size={w * 0.36} fill={P.navy} />
	</g>
);
const Doc: React.FC<{title: string; w?: number}> = ({title, w = 200}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.62} width={w} height={w * 1.24} rx={12} fill={P.paper} stroke={P.navy} strokeWidth={6} />
		<FText text={title} x={0} y={-w * 0.34} size={w * 0.17} fill={P.navy} />
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={-w * 0.32} x2={w * 0.32} y1={-w * 0.12 + i * w * 0.17} y2={-w * 0.12 + i * w * 0.17} stroke={P.grey} strokeWidth={8} strokeLinecap="round" />
		))}
	</g>
);
// Rura główna i odgałęzienie w pokoju (lokalne współrzędne pokoju).
const RoomPipes: React.FC<{f: number; l: Lay; g: Geo; open: number; wide?: number; last?: boolean; first?: boolean}> = ({f, l, g, open, wide = 1, last = false, first = false}) => {
	const D = g.D;
	return (
		<g>
			<Pipe d={`M ${first ? -60 : -60} ${g.pipeY} L ${last ? g.bx : l.W + 60} ${g.pipeY}`} D={D} />
			<Pipe d={`M ${g.bx} ${g.pipeY} L ${g.bx} ${g.mouthY}`} D={D * wide} />
			<rect x={g.bx - (D * wide) / 2 - 16} y={g.mouthY - 10} width={D * wide + 32} height={28} rx={8} fill={P.slate} stroke={P.navy} strokeWidth={6} />
			<Flow f={f} x0={-40} x1={last ? g.bx : l.W + 40} y={g.pipeY} r={D * 0.3} on={1} />
			<G x={g.bx + D + 26} y={g.pipeY + 6}>
				<Valve ang={open * 180 + Math.sin(f / 20) * 3} r={D * 0.6} />
			</G>
		</g>
	);
};

// --- 0: góra monet ------------------------------------------------------------------------------------------
const Mountain: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const pc = pileCoins(v);
	const lc = leadCoin(v);
	const throwing = f < K.l3;
	const bar10 = v ? {x: 150, y: FL - 10} : {x: 1520, y: FL - 10};
	const det = {x: pc.cx + (v ? -300 : 330), y: pc.base - pc.r - 2 * (v ? 40 : 34)};
	const detP = ip(f, K.zloto1, K.m10 - 4, 0, 1, EIO);
	const detPos = arcPt(detP, det.x, det.y, bar10.x, bar10.y - pc.r, 60);
	const q = pk(f, K.reszta);
	const leadMoving = f >= LEAD.a;
	const hl = prog(f, K.kazda, 8);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* rura: lejek i pion do rury głównej */}
			<Pipe d={`M ${g.riserX} ${g.funnelY - 30} L ${g.riserX} ${g.pipeY} L ${W + 60} ${g.pipeY}`} D={g.D} />
			<path d={`M ${g.riserX - 90} ${g.funnelY - 90} L ${g.riserX + 90} ${g.funnelY - 90} L ${g.riserX + 36} ${g.funnelY - 20} L ${g.riserX - 36} ${g.funnelY - 20} Z`} fill={P.slate} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
			{/* tłum wrzuca monety (tylko 16:9) */}
			{!v && (
				<>
					<Crowd f={f} x0={60} x1={340} floor={FL} rows={2} perRow={4} seed={31} cert={false} up={(i) => (throwing ? 0.5 + 0.5 * Math.max(0, Math.sin((f + i * 9) / 6)) : 0)} />
				</>
			)}
			{throwing &&
				Array.from({length: 8}).map((_, i) => {
					const per = 24;
					const t = (((f + i * 3) % per) + per) % per / per;
					const fromL = i % 2 === 0;
					const sx = v ? (fromL ? -40 : W + 40) : fromL ? 200 : 260;
					const sy = v ? 760 : FL - 200;
					const tx = pc.cx + (hsh(i + Math.floor((f + i * 3) / per) * 7) - 0.5) * (v ? 300 : 400);
					const p = arcPt(t, sx, sy, tx, pc.apex + (v ? 40 : 40), 200);
					return (
						<G key={i} x={p.x} y={p.y} r={t * 400}>
							<Coin r={pc.r * 0.8} />
						</G>
					);
				})}
			{/* kupka */}
			{pc.coins.map((c) => {
				if (c.k === lc.k && (leadMoving || f >= LEAD.a)) return null;
				if (c.x === det.x && false) return null;
				const glow = c.k === lc.k ? hl : 0;
				return (
					<G key={c.k} x={c.x} y={c.y + Math.sin((f + c.k) / 18) * 0.8}>
						{glow > 0 && <circle r={pc.r * 1.8} fill={P.white} opacity={0.6 * glow} />}
						<Coin r={pc.r} />
					</G>
				);
			})}
			{f >= K.moneta - 2 && !leadMoving && (
				<G x={lc.x + pc.r * 2.6} y={lc.y - pc.r * 1.6} s={pk(f, K.moneta - 2) * 0.6}>
					<rect x={-60} y={-34} width={120} height={64} rx={12} fill={P.navy} />
					<FText text="1 zł" x={0} y={14} size={40} fill={P.gold} />
				</G>
			)}
			{/* flaga „lokaty w złoto” */}
			{f >= K.lokaty - 4 && (
				<G x={pc.cx} y={pc.apex - pc.r} s={pk(f, K.lokaty - 4)}>
					<line x1={0} y1={0} x2={0} y2={-170} stroke={P.navy} strokeWidth={8} />
					<path d={`M 0 -170 L 230 ${-150 + Math.sin(f / 5) * 6} L 230 ${-90 + Math.sin(f / 5 + 1) * 6} L 0 -110 Z`} fill={P.gold} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
					<FText text="lokaty w złoto" x={112} y={-124} size={30} fill={P.navy} />
				</G>
			)}
			{/* 10 mln na złoto: moneta odrywa się i staje się sztabką */}
			{f >= K.zloto1 && f < K.m10 && (
				<G x={detPos.x} y={detPos.y} r={detP * 360}>
					<circle r={pc.r * 1.6} fill={P.goldLight} opacity={0.5} />
					<Coin r={pc.r} />
				</G>
			)}
			{f >= K.m10 - 2 && (
				<G x={bar10.x} y={bar10.y} s={pk(f, K.m10 - 2)}>
					<GoldBar w={v ? 90 : 80} glow={0.8} />
					<G y={v ? -130 : -110}>
						<rect x={-90} y={-30} width={180} height={56} rx={12} fill={P.navy} />
						<FText text="10 mln zł" x={0} y={12} size={34} fill={P.gold} />
					</G>
				</G>
			)}
			{f >= K.l2 - 2 && (
				<G x={bar10.x + (v ? 30 : -10)} y={bar10.y - (v ? 260 : 250)} s={pk(f, K.l2 - 2) * (1 + 0.15 * Math.max(0, Math.sin((f - K.l2) / 4)) * Math.exp(-(f - K.l2) / 20))} o={1 - prog(f, K.l4, 10)}>
					<circle r={v ? 80 : 90} fill={P.red} stroke={P.navy} strokeWidth={7} />
					<FText text="1%" x={0} y={v ? 22 : 24} size={v ? 64 : 72} fill={P.white} />
				</G>
			)}
			{/* licznik */}
			<G x={v ? 290 : 360} y={v ? 340 : 260} s={1 + 0.1 * pk(f, K.mln) * (1 - prog(f, K.mln + 8, 8))} o={1 - prog(f, K.l4 + 10, 10)}>
				<Plate text="851 mln zł" label="wpłaty klientów" w={v ? 460 : 520} size={v ? 72 : 80} />
			</G>
			{f >= K.reszta - 2 && (
				<G x={v ? 800 : pc.cx} y={v ? 420 : pc.apex - 250} s={q} o={1 - prog(f, K.l4 + 6, 8)}>
					<circle r={90} fill={P.white} stroke={P.navy} strokeWidth={8} />
					<FText text="?" x={0} y={46} size={140} fill={P.red} />
				</G>
			)}
		</g>
	);
};

// --- 1: odsetki z pieniędzy nowych klientów ----------------------------------------------------------------------
const Interest: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const open = ip(f, K.l6 - 4, K.l6 + 10, 0, 1, EIO);
	const rain = live(f, K.wrocilo - 6, K.kolejnych - 4, 8);
	const old = v ? {x0: 70, x1: 470} : {x0: 260, x1: 860};
	const nw = v ? {x0: 610, x1: 900} : {x0: 1200, x1: 1760};
	const hopper = v ? {x: 780, y: 620} : {x: 1460, y: 520};
	const comeIn = (i: number) => ip(f, K.l8 - 10 + i * 3, K.l8 + 8 + i * 3, 0, 1, EBACK);
	const toss = f >= K.l8 + 8 && f < K.l9 - 10;
	const bar = v ? {x: 560, y: 740} : {x: 1000, y: 500};
	const xDraw = ip(f, K.zysk, K.zysk + 12, 0, 1, EIO);
	const arrow = ip(f, K.kolejnych - 4, K.kolejnych + 16, 0, 1, EIO);
	const arrowD = v ? `M ${720} ${640} Q ${520} ${520} ${300} ${640}` : `M ${1420} ${600} Q ${1060} ${430} ${640} ${560}`;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* rura od lejka nowych klientów do rury głównej */}
			{f >= K.l8 - 14 && <Pipe d={`M ${hopper.x} ${g.pipeY} L ${hopper.x} ${g.pipeY + (hopper.y - 60 - g.pipeY) * ip(f, K.l8 - 14, K.l8 - 2, 0, 1, EOUT)}`} D={g.D * 0.8} />}
			<RoomPipes f={f} l={l} g={g} open={open} />
			<Stream f={f} x={g.bx} y0={g.mouthY + 20} y1={FL - (v ? 330 : 300)} on={rain} spread={v ? 300 : 420} r={v ? 18 : 20} n={12} />
			{/* pierwsi klienci */}
			<Crowd f={f} x0={old.x0} x1={old.x1} floor={FL} rows={2} perRow={v ? 3 : 5} seed={41} cert={false} size={v ? 1.75 : 1.3} up={() => rain} mood={rain > 0.5 ? 'ok' : 'ok'} />
			{f >= K.l8 - 10 && (
				<G x={(old.x0 + old.x1) / 2} y={FL - (v ? 440 : 280)} s={pk(f, K.kolejnych - 2)}>
					<rect x={-150} y={-30} width={300} height={56} rx={14} fill={P.navy} />
					<FText text="pierwsi klienci" x={0} y={10} size={34} fill={P.bg} />
				</G>
			)}
			{/* nowi klienci wrzucają monety do lejka */}
			{f >= K.l8 - 10 && (
				<>
					<path d={`M ${hopper.x - 90} ${hopper.y - 130} L ${hopper.x + 90} ${hopper.y - 130} L ${hopper.x + 30} ${hopper.y - 60} L ${hopper.x - 30} ${hopper.y - 60} Z`} fill={P.slate} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
					<Crowd f={f} x0={nw.x0} x1={nw.x1} floor={FL} rows={1} perRow={v ? 2 : 4} seed={57} cert={false} size={v ? 1.75 : 1.4} appear={(i) => comeIn(i)} up={(i) => (toss ? 0.5 + 0.5 * Math.max(0, Math.sin((f + i * 11) / 5)) : 0)} />
					{toss &&
						[0, 1, 2, 3].map((i) => {
							const per = 18;
							const t = (((f + i * 5) % per) + per) % per / per;
							const sx = nw.x0 + ((i % (v ? 2 : 4)) + 0.5) * ((nw.x1 - nw.x0) / (v ? 2 : 4));
							const p = arcPt(t, sx, FL - (v ? 400 : 300), hopper.x, hopper.y - 140, 120);
							return (
								<G key={i} x={p.x} y={p.y} r={t * 300}>
									<Coin r={18} />
								</G>
							);
						})}
					<G x={(nw.x0 + nw.x1) / 2 + (v ? 0 : 80)} y={FL - (v ? 440 : 280)} s={pk(f, K.kolejnych + 2)}>
						<rect x={-130} y={-30} width={260} height={56} rx={14} fill={P.red} />
						<FText text="nowi klienci" x={0} y={10} size={34} fill={P.white} />
					</G>
				</>
			)}
			{/* „to nie był zysk ze złota” */}
			{f >= K.l7 - 2 && (
				<G x={bar.x} y={bar.y} s={pk(f, K.l7 - 2)} o={1 - prog(f, K.l8 + 4, 8)}>
					<GoldBar w={150} glow={0.4} />
					<path d="M 110 -40 L 110 -150 M 80 -120 L 110 -154 L 140 -120" fill="none" stroke={P.gold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
					<FText text="zysk" x={110} y={-170} size={40} fill={P.navy} />
					<path d="M -120 -190 L 200 40" stroke={P.red} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(xDraw * 2)} />
					<path d="M 200 -190 L -120 40" stroke={P.red} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(xDraw * 2 - 1)} />
				</G>
			)}
			{/* strzałka: od nowych do pierwszych */}
			{arrow > 0 && (
				<g opacity={1 - prog(f, K.l9 - 10, 8)}>
					<path d={arrowD} fill="none" stroke={P.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} />
				</g>
			)}
			<Counter f={f} at={K.m290} to={290} label="odsetki dla klientów" g={g} prefix="ponad " />
		</g>
	);
};

// --- 2: codzienna działalność ----------------------------------------------------------------------------------
const Ops: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const open = ip(f, K.l9 - 4, K.l9 + 10, 0, 1, EIO);
	const shops = v ? [{x: 250, w: 330}, {x: 715, w: 330}] : [{x: 900, w: 260}, {x: 1250, w: 260}, {x: 1600, w: 260}];
	const carX = (i: number) => ip(f, K.samochody + i * 6, K.samochody + 40 + i * 6, shops[i % shops.length].x, shops[i % shops.length].x + (v ? 700 : 900), EIN);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<RoomPipes f={f} l={l} g={g} open={open} />
			<Stream f={f} x={g.bx} y0={g.mouthY + 20} y1={FL - 40} on={live(f, K.l9 + 6, K.l10 - 12, 8)} spread={v ? 120 : 160} r={18} n={8} />
			{shops.map((sh, i) => (
				<G key={i} x={sh.x} y={FL} s={ip(f, K.oddzialy - 4 + i * 4, K.oddzialy + 8 + i * 4, 0, 1, EBACK)}>
					<Shop w={sh.w} />
				</G>
			))}
			{f >= K.samochody - 2 &&
				(v ? [0, 1] : [0, 1, 2]).map((i) => (
					<G key={i} x={carX(i)} y={FL - 24 - (i % 2) * 6} s={(v ? 1.1 : 0.9) * pk(f, K.samochody - 2 + i * 6)}>
						<Car c={[P.red, P.grass, P.slate][i]} />
					</G>
				))}
			{f >= K.telefony - 4 &&
				shops.map((sh, i) => (
					<G key={i} x={sh.x} y={FL - sh.w * 0.8 - (v ? 100 : 80)} s={pk(f, K.telefony - 4 + i * 3) * (v ? 1.2 : 1)}>
						<Phone f={f + i * 7} ring={1} />
					</G>
				))}
			{/* monety z wylotu do oddziałów */}
			{f >= K.oddzialy &&
				Array.from({length: 6}).map((_, i) => {
					const per = 20;
					const t = (((f + i * 7) % per) + per) % per / per;
					const tgt = shops[i % shops.length];
					const p = arcPt(t, g.bx, FL - 60, tgt.x, FL - tgt.w * 0.85, 140);
					return f < K.l10 - 12 ? (
						<G key={i} x={p.x} y={p.y} r={t * 300}>
							<Coin r={16} />
						</G>
					) : null;
				})}
			<Counter f={f} at={K.m140} to={140} label="codzienna działalność" g={g} prefix="ok. " />
		</g>
	);
};

// --- 3: nieruchomości i czynsz -----------------------------------------------------------------------------------
const Estate: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const open = ip(f, K.l10 - 4, K.l10 + 10, 0, 1, EIO);
	const towers = v ? [{x: 150, w: 200, h: 460}, {x: 380, w: 220, h: 560}, {x: 600, w: 190, h: 500}] : [{x: 820, w: 200, h: 340}, {x: 1060, w: 220, h: 460}, {x: 1300, w: 190, h: 380}];
	const cal = v ? {x: 800, y: 800, w: 210} : {x: 1660, y: 540, w: 230};
	const tearStart = K.t300 - 4;
	const tears = f >= tearStart ? Math.floor((f - tearStart) / Math.max(4, 9 - (f - tearStart) / 20)) : 0;
	const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<RoomPipes f={f} l={l} g={g} open={open} />
			<Stream f={f} x={g.bx} y0={g.mouthY + 20} y1={FL - 40} on={live(f, K.l10 + 4, K.l11 - 12, 8)} spread={v ? 120 : 160} r={18} n={8} seed={5} />
			{towers.map((t, i) => {
				const grow = ip(f, K.nieruch - 6 + i * 5, K.nieruch + 14 + i * 5, 0, 1, EBACK);
				return grow > 0 ? (
					<g key={i} transform={`translate(${t.x} ${FL}) scale(1 ${grow})`}>
						<Tower w={t.w} h={t.h} c={['#C8BFA9', '#B9A58C', '#D6C8AE'][i]} />
					</g>
				) : null;
			})}
			{f >= K.czynsz - 4 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.czynsz - 4)}>
					<rect x={-cal.w / 2} y={-cal.w * 0.6} width={cal.w} height={cal.w * 1.1} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<rect x={-cal.w / 2} y={-cal.w * 0.6} width={cal.w} height={cal.w * 0.28} rx={16} fill={P.red} />
					<FText text="CZYNSZ" x={0} y={-cal.w * 0.4} size={cal.w * 0.15} fill={P.white} />
					<FText text={months[tears % 12]} x={0} y={cal.w * 0.18} size={cal.w * 0.3} fill={P.navy} />
					{/* zerwane kartki odlatują z kupką monet */}
					{Array.from({length: Math.min(tears, 12)}).map((_, i) => {
						const a = tearStart + i * 7;
						const p = clamp01((f - a) / 22);
						if (p <= 0 || p >= 1) return null;
						return (
							<G key={i} x={-p * (v ? 260 : 420)} y={-cal.w * 0.1 - p * 180 + p * p * 260} r={-p * 70} o={1 - p}>
								<rect x={-cal.w * 0.42} y={-cal.w * 0.36} width={cal.w * 0.84} height={cal.w * 0.6} rx={8} fill={P.white} stroke={P.navy} strokeWidth={4} />
								<G y={cal.w * 0.36}>
									<Pile n={4} r={14} />
								</G>
							</G>
						);
					})}
					{f >= K.t300 && (
						<G y={cal.w * 0.82} s={pk(f, K.t300)}>
							<rect x={-150} y={-36} width={300} height={70} rx={14} fill={P.navy} />
							<FText text="ok. 300 tys. zł" x={0} y={-2} size={34} fill={P.gold} />
							<FText text="co miesiąc" x={0} y={26} size={22} fill={P.bg} />
						</G>
					)}
				</G>
			)}
			<Counter f={f} at={K.l10 + 2} to={73} label="nieruchomości" g={g} />
		</g>
	);
};

// --- 4: małżeństwo P. ------------------------------------------------------------------------------------------
const Owners: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const open = ip(f, K.l11 - 4, K.l11 + 10, 0, 1, EIO);
	const doc = v ? {x: 160, y: 760} : {x: 320, y: 520};
	const duo = v ? [440, 690] : [900, 1150];
	const spot = ip(f, K.malz - 4, K.malz + 8, 0, 1);
	const sackY = fall(f, K.wyplacilo + 10, 14, g.mouthY + 60, FL - 40);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<RoomPipes f={f} l={l} g={g} open={open} />
			{f >= K.audytu - 4 && (
				<G x={doc.x} y={doc.y} s={pk(f, K.audytu - 4)} r={-4}>
					<Doc title="AUDYT" w={v ? 180 : 210} />
					<G x={v ? 70 : 80} y={v ? 70 : 80} s={0.9}>
						<Magnifier r={v ? 44 : 50} />
					</G>
				</G>
			)}
			{f >= K.prok - 4 && (
				<G x={doc.x + (v ? 0 : 0)} y={v ? doc.y + 290 : doc.y + 260} s={pk(f, K.prok - 4) * (v ? 0.55 : 0.6)}>
					<Columns w={220} h={150} label="PROKURATURA" labelSize={36} />
				</G>
			)}
			<path d={`M ${(duo[0] + duo[1]) / 2 - 90} ${g.mouthY + 30} L ${(duo[0] + duo[1]) / 2 + 90} ${g.mouthY + 30} L ${duo[1] + 160} ${FL} L ${duo[0] - 160} ${FL} Z`} fill={P.goldLight} opacity={0.3 * spot} />
			{duo.map((x, i) => (
				<G key={i} x={x} y={FL} s={(v ? 1.55 : 1.7) * ip(f, K.malz - 2 + i * 4, K.malz + 10 + i * 4, 0, 1, EBACK)}>
					<Mini suit="#0E1520" hair="#0E1520" skin="#0E1520" up={f >= K.wyplacilo + 10 ? 0.55 : 0} />
				</G>
			))}
			{/* rura nad nimi i worek */}
			<Pipe d={`M ${g.bx} ${g.mouthY} L ${g.bx} ${g.mouthY + 10} Q ${g.bx} ${g.mouthY + 40} ${(duo[0] + duo[1]) / 2} ${g.mouthY + 40}`} D={g.D * 0.7} />
			{f >= K.wyplacilo - 4 && (
				<G x={(duo[0] + duo[1]) / 2} y={f >= K.wyplacilo + 10 ? Math.min(sackY, FL - (v ? 390 : 400)) : sackY} s={pk(f, K.wyplacilo - 4)} r={swing(f, K.wyplacilo + 10, 6)}>
					<Sack w={v ? 180 : 200} />
				</G>
			)}
			<Counter f={f} at={K.m19} to={19} label="według audytu" g={g} prefix="prawie " />
		</g>
	);
};

// --- 5: samoloty ---------------------------------------------------------------------------------------------------
const PLANE_PTS: [number, number][] = [
	[-200, -6], [-160, -38], [-100, -40], [-40, -40], [20, -40], [80, -40], [140, -40], [190, -24], [214, 0], [180, 30], [120, 34], [60, 34], [0, 34], [-60, 34], [-120, 34], [-180, 26],
	[-220, -100], [-196, -60], [-90, -80], [-60, -50], [-20, -20], [-80, 70], [-40, 40], [0, 18],
];
const Flight: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const g = GEO(v);
	const open = ip(f, K.l12 - 4, K.l12 + 10, 0, 1, EIO);
	const wide = 1 + 0.7 * ip(f, K.najw, K.najw + 14, 0, 1, EBACK);
	const gather = ip(f, K.odlec - 22, K.odlec - 2, 0, 1, EIO);
	const morph = prog(f, K.odlec - 2, 6);
	const fly = ip(f, K.odlec + 6, K.l14 - 6, 0, 1, EIN);
	const home = v ? {x: 520, y: 880} : {x: 1060, y: 600};
	const ps = v ? 1.55 : 1.4;
	const px = home.x + fly * (v ? 900 : 1300);
	const py = home.y - fly * (v ? 900 : 700);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			<RoomPipes f={f} l={l} g={g} open={open} wide={wide} last />
			{/* strumień z szerokiej rury, potem monety układają się w samolot */}
			{f < K.odlec + 4 &&
				PLANE_PTS.map(([x, y], i) => {
					const per = 22;
					const t = (((f + i * 3) % per) + per) % per / per;
					const sx = g.bx + (hsh(i) - 0.5) * g.D * wide * 0.6;
					const sy = g.mouthY + 30 + t * (home.y - g.mouthY);
					const tx = home.x + x * ps;
					const ty = home.y + y * ps;
					const cx = sx + (tx - sx) * gather;
					const cy = sy + (ty - sy) * gather;
					return f >= K.najw ? (
						<G key={i} x={cx} y={cy} r={f * 8 + i * 30} o={1 - morph}>
							<Coin r={v ? 20 : 22} />
						</G>
					) : null;
				})}
			{morph > 0 && (
				<g>
					{fly > 0 &&
						[0, 1, 2].map((i) => (
							<line key={i} x1={home.x - 240 * ps} y1={home.y + (i - 1) * 18} x2={px - 220 * ps} y2={py + (i - 1) * 18} stroke={P.white} strokeWidth={10 - i * 2} strokeLinecap="round" opacity={0.7} />
						))}
					<G x={px} y={py} s={ps * (0.85 + 0.15 * morph)} r={-fly * 22}>
						<Plane body={P.gold} tail={<FText text="zł" x={0} y={0} size={40} fill={P.navy} />} />
					</G>
				</g>
			)}
			<Counter f={f} at={K.m300} to={300} label="linie lotnicze" g={g} prefix="prawie " />
		</g>
	);
};

// --- 6: billboard ze sztabką i puste rusztowanie ---------------------------------------------------------------------
const Billboard: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const b = v ? {x: 540, y0: 300, w: 880, h: 520} : {x: 960, y0: 140, w: 1000, h: 440};
	const turn = ip(f, K.chwyt - 4, K.chwyt + 14, 0, 1, EIO);
	const sx = Math.cos(turn * Math.PI);
	const front = sx >= 0;
	const lights = 1 - prog(f, K.chwyt + 8, 12) * 0.6;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E6DCCB" />
			<FloorDeco l={l} />
			{/* nogi */}
			{[-0.3, 0.3].map((k) => (
				<rect key={k} x={b.x + k * b.w - 16} y={b.y0 + b.h} width={32} height={FL - b.y0 - b.h} fill={P.slate} stroke={P.navy} strokeWidth={5} />
			))}
			{/* reflektory */}
			{[-0.38, 0.38].map((k) => (
				<g key={k} opacity={lights}>
					<path d={`M ${b.x + k * b.w} ${b.y0 + b.h + 40} L ${b.x + k * b.w - 260} ${b.y0 - 40} L ${b.x + k * b.w + 260} ${b.y0 - 40} Z`} fill={P.goldLight} opacity={0.28} />
					<rect x={b.x + k * b.w - 30} y={b.y0 + b.h + 30} width={60} height={40} rx={8} fill={P.navy} />
				</g>
			))}
			<g transform={`translate(${b.x} 0) scale(${Math.max(0.02, Math.abs(sx))} 1) translate(${-b.x} 0)`}>
				{front ? (
					<g>
						<rect x={b.x - b.w / 2} y={b.y0} width={b.w} height={b.h} rx={16} fill={P.navy} stroke={P.navy} strokeWidth={8} />
						<rect x={b.x - b.w / 2 + 20} y={b.y0 + 20} width={b.w - 40} height={b.h - 40} rx={10} fill="#2C3C52" />
						<G x={b.x - b.w * 0.18} y={b.y0 + b.h * 0.7} s={1 + 0.04 * Math.sin(f / 8)}>
							<GoldBar w={v ? 230 : 260} glow={1} />
						</G>
						<FText text="ZŁOTO" x={b.x + b.w * 0.2} y={b.y0 + b.h * 0.48} size={v ? 92 : 110} fill={P.gold} />
						<FText text="lokaty" x={b.x + b.w * 0.2} y={b.y0 + b.h * 0.7} size={v ? 46 : 52} fill={P.bg} />
					</g>
				) : (
					<g>
						{/* rusztowanie od tyłu */}
						<rect x={b.x - b.w / 2} y={b.y0} width={b.w} height={b.h} fill="none" stroke="#8C6A4A" strokeWidth={18} />
						{[0.25, 0.5, 0.75].map((k) => (
							<line key={k} x1={b.x - b.w / 2 + k * b.w} y1={b.y0} x2={b.x - b.w / 2 + k * b.w} y2={b.y0 + b.h} stroke="#8C6A4A" strokeWidth={12} />
						))}
						<line x1={b.x - b.w / 2} y1={b.y0 + b.h / 2} x2={b.x + b.w / 2} y2={b.y0 + b.h / 2} stroke="#8C6A4A" strokeWidth={12} />
						{[0, 1, 2, 3].map((k) => (
							<line key={`d${k}`} x1={b.x - b.w / 2 + k * b.w * 0.25} y1={b.y0 + b.h} x2={b.x - b.w / 2 + (k + 1) * b.w * 0.25} y2={b.y0} stroke="#A87B4A" strokeWidth={8} />
						))}
					</g>
				)}
			</g>
			{turn >= 1 && (
				<G x={b.x} y={b.y0 + b.h + (v ? 170 : 120)} s={pk(f, K.chwyt + 14)}>
					<rect x={v ? -330 : -330} y={-46} width={660} height={84} rx={16} fill={P.red} stroke={P.navy} strokeWidth={6} />
					<FText text="chwyt reklamowy" x={0} y={14} size={50} fill={P.white} />
				</G>
			)}
		</g>
	);
};

// --- pasek „dokąd poszło 851 mln zł” (na ekranie, poza kamerą) ----------------------------------------------------------------
const SEG = [
	{k: 'złoto', v: 10, c: P.gold, at: K.l2},
	{k: 'odsetki', v: 290, c: '#5C6B7A', at: K.m290},
	{k: 'działalność', v: 140, c: P.grass, at: K.m140},
	{k: 'nieruchomości', v: 73, c: '#9C5A40', at: K.l10 + 2},
	{k: 'małżeństwo P.', v: 19, c: P.red, at: K.m19},
	{k: 'samoloty', v: 300, c: '#4A6E8C', at: K.m300},
];
const Hud: React.FC<{v: boolean}> = ({v}) => {
	const f = useCurrentFrame();
	const W = v ? VW : HW;
	const H = v ? VH : HH;
	const x0 = v ? 210 : 470;
	const w = v ? 690 : 1130;
	const y = v ? 168 : 30;
	const h = v ? 40 : 44;
	const show = pk(f, K.l2 - 4);
	if (show <= 0) return null;
	let acc = 0;
	const cur = [...SEG].reverse().find((sg) => f >= sg.at);
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
			<g transform={`translate(${x0 + w / 2} ${y + h / 2}) scale(${show}) translate(${-x0 - w / 2} ${-y - h / 2})`}>
				<FText text="851 mln zł" x={x0 - 16} y={y + h * 0.8} size={v ? 32 : 38} fill={P.navy} anchor="end" stroke={P.bg} sw={8} />
				<rect x={x0} y={y} width={w} height={h} rx={h / 2} fill={P.white} stroke={P.navy} strokeWidth={5} />
				<clipPath id={`am3hud${v ? 'v' : 'h'}`}>
					<rect x={x0} y={y} width={w} height={h} rx={h / 2} />
				</clipPath>
				<g clipPath={`url(#am3hud${v ? 'v' : 'h'})`}>
					{SEG.map((sg) => {
						const grow = ip(f, sg.at, sg.at + 20, 0, 1, EOUT);
						const sw = (w * sg.v * grow) / 851;
						const x = x0 + acc;
						acc += (w * sg.v) / 851;
						return grow > 0 ? <rect key={sg.k} x={x} y={y} width={Math.max(sg.v === 10 ? 6 : 0, sw)} height={h} fill={sg.c} stroke={P.navy} strokeWidth={2} /> : null;
					})}
				</g>
				<rect x={x0} y={y} width={w} height={h} rx={h / 2} fill="none" stroke={P.navy} strokeWidth={5} />
				{cur &&
					(() => {
						let a = 0;
						for (const sg of SEG) {
							if (sg === cur) break;
							a += (w * sg.v) / 851;
						}
						const cx = Math.max(x0 + 110, Math.min(x0 + w - 110, x0 + a + (w * cur.v) / 851 / 2));
						return <FText text={`${cur.k} ${cur.v === 10 ? '1%' : `${cur.v} mln`}`} x={cx} y={y + h + (v ? 36 : 40)} size={v ? 30 : 34} fill={cur.c === P.gold ? P.goldDark : cur.c} stroke={P.bg} sw={8} opacity={prog(f, cur.at, 8)} />;
					})()}
			</g>
		</svg>
	);
};

// --- pierwsza moneta w drodze (świat) ------------------------------------------------------------------------------------
const Travelers: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const W = v ? VW : HW;
	const g = GEO(v);
	const out: React.ReactNode[] = [];
	if (f >= LEAD.a && f < LEAD.b + 4) {
		const p = ip(f, LEAD.a, LEAD.b, 0, 1, EIO);
		const q = along(leadPath(v), p);
		out.push(
			<G key="lead" x={q.x} y={q.y} r={p * 1440}>
				<circle r={(v ? 26 : 24) * 2} fill={P.white} opacity={0.55} />
				<circle r={(v ? 26 : 24) * 1.7} fill="none" stroke={P.red} strokeWidth={6} />
				<Coin r={(v ? 26 : 24) * 1.25} />
			</G>,
		);
	}
	HOPS.forEach(([a, b], i) => {
		if (f < a || f > b + 6) return;
		const p = ip(f, a, b, 0, 1, EIO);
		const x0 = (i + 1) * W + g.bx;
		const x1 = (i + 2) * W + g.bx;
		const q = along(
			[
				[x0, g.pipeY],
				[x1, g.pipeY],
				[x1, g.mouthY],
			],
			p,
		);
		out.push(
			<G key={`h${i}`} x={q.x} y={q.y} r={p * 900}>
				<circle r={g.D * 0.7} fill={P.white} opacity={0.5} />
				<Coin r={g.D * 0.4} />
			</G>,
		);
	});
	return <g>{out}</g>;
};

const ROOMS = [Mountain, Interest, Ops, Estate, Owners, Flight, Billboard];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const R3Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<AmberStage v={v} lines={LINES} vo="am3_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`am3c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>} extra={<Hud v={v} />}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.bg} />
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#am3c${v ? 'v' : 'h'})`}>
									<R f={f} l={l} />
								</g>
							</g>
						) : null,
					)}
					<Travelers f={f} v={v} />
				</g>
			)}
		</AmberStage>
	);
};

export const AmberR3: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 3" title="Piramida w złotym opakowaniu" icon={<GoldBar w={300} glow={1} />} frames={CARD} />}>
		<R3Scene />
	</WithCard>
);

export const AmberS1: React.FC = () => (
	<ShortWithCta sceneFrames={SCENE}>
		<R3Scene v />
	</ShortWithCta>
);
