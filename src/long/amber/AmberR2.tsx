// Amber Gold, rozdział 2 „Ostrzeżenie”: wersja pozioma (AmberR2, z planszą) i pionowa (AmberS2 = short 2).
// Te same pokoje w dwóch układach (v = pion). Sylwetka za biurkiem → teczki wyroków „w zawieszeniu” →
// lista ostrzeżeń KNF z lampą → pętla KNF / prokuratura / sąd → pusta półka sprawozdań → zamknięty skarbiec →
// klient idzie pod ostrzeżeniem, patrząc tylko na monety → monety leżą na pułapce.
import React from 'react';
import {LINES} from './am2.gen';
import {
	AmberStage, WithCard, CardScene, ShortWithCta, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, Coin, FText, clamp01, prog, Room, Plate, VaultDoor, Mini, Columns, WarnSign, CTA_FRAMES, HW, HH, VW, VH,
} from './kit';

const T = makeT(LINES);
const CARD = 60;
const SCENE = endOf(LINES) + 24;
export const R2_FRAMES = CARD + SCENE;
export const S2_FRAMES = SCENE + CTA_FRAMES;

const K = {
	mln: T(0, '851'),
	zalozyl: T(0, 'założył'),
	skazany: T(0, 'skazany'),
	l1: T(1),
	lata: T(1, '2005'),
	kilka: T(1, 'kilka'),
	wyroki: T(1, 'wyroki'),
	l2: T(2),
	zaw: T(2, 'zawieszeniu'),
	l3: T(3),
	y2009: T(3, '2009'),
	komisja: T(3, 'komisja'),
	wpisala: T(3, 'wpisała'),
	ostrz: T(3, 'ostrzeżeń'),
	l4: T(4),
	bankowa: T(4, 'bankową'),
	bez: T(4, 'bez'),
	l5: T(5),
	zawiad: T(5, 'zawiadomiła'),
	prok: T(5, 'prokuraturę'),
	l6: T(6),
	kilka6: T(6, 'kilka'),
	umarz: T(6, 'umarzano'),
	l7: T(7),
	wniosek: T(7, 'wniosek'),
	sad: T(7, 'sąd'),
	prowadzic: T(7, 'prowadzić'),
	l8: T(8),
	spraw: T(8, 'sprawozdań'),
	l9: T(9),
	zewn: T(9, 'zewnątrz'),
	pien: T(9, 'pieniędzy'),
	zlota: T(9, 'złota'),
	l10: T(10),
	publ: T(10, 'publiczne'),
	l11: T(11),
	sprawdzic: T(11, 'sprawdzić'),
	l12: T(12),
	kto: T(12, 'kto'),
	placi: T(12, 'płaci'),
	ods: T(12, 'odsetki'),
	grosza: T(12, 'grosza'),
	l13: T(13),
	placil: T(13, 'płacił'),
	l14: T(14),
	najg: T(14, 'najgroźniejsze'),
	end: endOf(LINES),
};

// --- układ ---------------------------------------------------------------------------------------
export type Lay = {v: boolean; W: number; H: number; FL: number};
export const LAY = (v: boolean): Lay => ({v, W: v ? VW : HW, H: v ? VH : HH, FL: v ? 1120 : 800});
// Klucz kamery z ograniczeniem: kadr nigdy nie wychodzi poza pokój (bez pasa z sąsiedniego pokoju).
export const kk = (v: boolean, f: number, i: number, h: [number, number, number], vv: [number, number, number], e?: CK['e']): CK => {
	const [dx, dy, z] = v ? vv : h;
	const W = v ? VW : HW;
	const H = v ? VH : HH;
	const vcy = v ? 760 : 470;
	const mx = W / 2 - W / 2 / z;
	const x = i * W + W / 2 + Math.max(-mx, Math.min(mx, dx));
	let y = vcy + dy;
	// przy zwykłych najazdach podłoga zostaje nad napisami (H: <= ok. 870 px, V: <= ok. 1130 px)
	if (z < 1.5) y = Math.max(y, v ? 1120 - 370 / z : 800 - 400 / z);
	y = Math.max(vcy / z, Math.min(H - (H - vcy) / z, y));
	return {f, x, y, z, e};
};
const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, 0, 1], [0, 0, 1]),
	kk(v, K.zalozyl - 4, 0, [0, -30, 1.08], [0, -40, 1.08]),
	kk(v, K.skazany + 10, 0, [-80, 10, 1.12], [-40, 40, 1.1]),
	kk(v, K.l1 + 20, 0, [0, 0, 1.05], [0, 0, 1.05]),
	kk(v, K.lata + 20, 0, [100, -20, 1.08], [-50, 0, 1.06]),
	kk(v, K.kilka - 4, 0, [0, 0, 1.04], [0, 0, 1.04]),
	kk(v, K.zaw + 16, 0, [0, -40, 1.1], [0, -60, 1.1]),
	kk(v, K.l3 - 12, 0, [0, -20, 1.06], [0, -20, 1.06]),
	kk(v, K.l3 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.komisja, 1, [-40, 0, 1.04], [0, 0, 1.02]),
	kk(v, K.ostrz + 10, 1, [100, -40, 1.12], [0, -60, 1.1]),
	kk(v, K.l4 + 30, 1, [100, -20, 1.1], [0, -40, 1.08]),
	kk(v, K.bez + 16, 1, [110, 0, 1.14], [80, -20, 1.12]),
	kk(v, K.l5 - 12, 1, [60, 0, 1.06], [0, 0, 1.04]),
	kk(v, K.l5 + 14, 2, [0, 0, 1], [0, 0, 1]),
	kk(v, K.umarz + 10, 2, [0, -20, 1.12], [100, -80, 1.12]),
	kk(v, K.l7 + 20, 2, [0, 0, 1.02], [0, 0, 1.02]),
	kk(v, K.l8 - 12, 2, [0, 0, 1.05], [0, 0, 1.05]),
	kk(v, K.l8 + 14, 3, [0, 0, 1], [0, 0, 1]),
	kk(v, K.spraw + 12, 3, [0, 0, 1.2], [-40, 30, 1.2]),
	kk(v, K.l9 - 12, 3, [0, 0, 1.12], [-40, 30, 1.12]),
	kk(v, K.l9 + 14, 4, [0, 0, 1], [0, 0, 1]),
	kk(v, K.zlota + 10, 4, [80, -30, 1.06], [0, -80, 1.06]),
	kk(v, K.l10 - 12, 4, [0, 0, 1.04], [0, 0, 1.04]),
	kk(v, K.l10 + 14, 5, [0, 0, 1], [0, 0, 1]),
	kk(v, K.grosza + 10, 5, [60, 0, 1.06], [0, 0, 1.04]),
	// wjazd w monety w dłoni klienta i cięcie na identyczną kupkę monet na pułapce
	kk(v, K.l13, 5, [278, 38, 1.8], [28, 68, 1.8], 'in'),
	kk(v, K.l13, 6, [220, 130, 1.9], [240, 180, 1.9]),
	kk(v, K.placil + 16, 6, [220, 130, 1.75], [240, 180, 1.75]),
	kk(v, K.l14 + 30, 6, [0, 0, 1], [0, 0, 1]),
	kk(v, SCENE, 6, [0, 0, 1.04], [0, 0, 1.03]),
];
const DIPS: [number, number, number][] = [K.l3, K.l5, K.l8, K.l9, K.l10].map((b) => [b - 12, b + 14, 0.12]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.skazany), kind: 'both', amp: 0.7},
	{t: s(K.kilka), kind: 'punch', amp: 0.4},
	{t: s(K.kilka + 14), kind: 'punch', amp: 0.4},
	{t: s(K.wyroki + 14), kind: 'punch', amp: 0.5},
	{t: s(K.zaw), kind: 'shake', amp: 0.3},
	{t: s(K.y2009 + 6), kind: 'punch', amp: 0.4},
	{t: s(K.wpisala + 20), kind: 'punch', amp: 0.5},
	{t: s(K.ostrz), kind: 'both', amp: 0.6},
	{t: s(K.bez + 12), kind: 'punch', amp: 0.5},
	{t: s(K.umarz), kind: 'both', amp: 0.8},
	{t: s(K.sad), kind: 'punch', amp: 0.6},
	{t: s(K.prowadzic), kind: 'punch', amp: 0.6},
	{t: s(K.spraw), kind: 'punch', amp: 0.5},
	{t: s(K.pien), kind: 'punch', amp: 0.4},
	{t: s(K.zlota), kind: 'punch', amp: 0.4},
	{t: s(K.publ), kind: 'punch', amp: 0.5},
	{t: s(K.kto), kind: 'punch', amp: 0.4},
	{t: s(K.placil), kind: 'punch', amp: 0.4},
	{t: s(K.najg), kind: 'shake', amp: 0.7},
];

// --- rekwizyty -------------------------------------------------------------------------------------
type Stamp = {t: string; c: string; a: number; on: number; dy?: number};
// Teczka z aktami, środek w 0,0.
export const Folder: React.FC<{w?: number; label?: string; stamps?: Stamp[]}> = ({w = 200, label = 'WYROK', stamps = []}) => {
	const h = w * 0.7;
	return (
		<g>
			<path d={`M ${-w / 2 + w * 0.04} ${-h / 2} L ${-w / 2 + w * 0.08} ${-h / 2 - h * 0.15} L ${-w / 2 + w * 0.36} ${-h / 2 - h * 0.15} L ${-w / 2 + w * 0.42} ${-h / 2} Z`} fill="#C9A15E" stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#E0BC74" stroke={P.navy} strokeWidth={6} />
			<rect x={-w * 0.3} y={-h * 0.3} width={w * 0.6} height={h * 0.26} rx={5} fill={P.white} stroke={P.navy} strokeWidth={3} />
			<FText text={label} x={0} y={-h * 0.11} size={Math.round(w * 0.13)} fill={P.navy} />
			{stamps.map((st, i) =>
				st.on > 0 ? (
					<g key={i} transform={`translate(0 ${h * (st.dy ?? 0.2)}) rotate(${st.a}) scale(${1 + (1 - st.on) * 0.7})`} opacity={st.on}>
						<rect x={-w * 0.46} y={-h * 0.17} width={w * 0.92} height={h * 0.34} rx={6} fill={P.white} fillOpacity={0.5} stroke={st.c} strokeWidth={6} />
						<FText text={st.t} x={0} y={h * 0.09} size={Math.round(Math.min(w * 0.17, (w * 0.84) / (0.6 * st.t.length)))} fill={st.c} />
					</g>
				) : null,
			)}
		</g>
	);
};
// Młotek sędziowski: oś w końcu trzonka (0,0), głowica po lewej; ang > 0 podnosi.
export const Gavel: React.FC<{ang: number}> = ({ang}) => (
	<g>
		<ellipse cx={-170} cy={22} rx={58} ry={14} fill="#6E5139" stroke={P.navy} strokeWidth={5} />
		<g transform={`rotate(${ang})`}>
			<rect x={-160} y={-9} width={160} height={18} rx={8} fill="#8C6A4A" stroke={P.navy} strokeWidth={5} />
			<rect x={-206} y={-36} width={72} height={60} rx={10} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
			<rect x={-212} y={-30} width={10} height={48} rx={4} fill={P.gold} />
			<rect x={-138} y={-30} width={10} height={48} rx={4} fill={P.gold} />
		</g>
	</g>
);
export const strike = (f: number, times: number[], up = 48) => {
	for (const t of times) {
		if (f >= t - 9 && f < t - 2) return ip(f, t - 9, t - 2, 0, up, EOUT);
		if (f >= t - 2 && f < t) return ip(f, t - 2, t, up, 0, EIN);
		if (f >= t && f < t + 6) return Math.sin(((f - t) / 6) * Math.PI) * 6;
	}
	return 0;
};
// Pieczątka (trzonek) opuszczana na teczkę: lift 0 = dotyka.
export const StampTool: React.FC<{lift: number; color: string}> = ({lift, color}) => (
	<g transform={`translate(0 ${-lift})`}>
		<rect x={-60} y={-20} width={120} height={26} rx={6} fill={color} stroke={P.navy} strokeWidth={5} />
		<rect x={-44} y={-40} width={88} height={24} rx={5} fill="#5C4A3A" stroke={P.navy} strokeWidth={5} />
		<rect x={-12} y={-100} width={24} height={64} rx={8} fill="#8C6A4A" stroke={P.navy} strokeWidth={5} />
		<circle cx={0} cy={-112} r={26} fill="#6E5139" stroke={P.navy} strokeWidth={5} />
	</g>
);
export const Calendar: React.FC<{text: string; w?: number}> = ({text, w = 200}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.55} width={w} height={w} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
		<rect x={-w / 2} y={-w * 0.55} width={w} height={w * 0.26} rx={16} fill={P.red} />
		<FText text={text} x={0} y={w * 0.3} size={w * 0.3} fill={P.navy} />
	</g>
);
// Obrotowa lampa ostrzegawcza (podstawa w 0,0), wiązki obracają się, gdy on > 0.
export const Lamp: React.FC<{f: number; on: number; s?: number; beam?: number}> = ({f, on, s: sc = 1, beam = 620}) => (
	<g transform={`scale(${sc})`}>
		{on > 0 &&
			[0, 180].map((k) => (
				<path key={k} d={`M 0 -38 L ${beam} ${-38 - beam * 0.14} L ${beam} ${-38 + beam * 0.14} Z`} transform={`rotate(${f * 9 + k} 0 -38)`} fill="#F2A541" opacity={0.24 * on} />
			))}
		<rect x={-50} y={-8} width={100} height={28} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={5} />
		<path d="M -40 -8 Q -40 -76 0 -76 Q 40 -76 40 -8 Z" fill={on > 0 ? '#F2A541' : '#B9864A'} stroke={P.navy} strokeWidth={5} />
		{on > 0 && <circle cy={-40} r={24} fill="#FFE6B8" opacity={on * (0.55 + 0.45 * Math.sin(f / 2.2))} />}
	</g>
);
export const Pencil: React.FC = () => (
	<g transform="rotate(-35)">
		<rect x={-14} y={-150} width={28} height={130} fill={P.gold} stroke={P.navy} strokeWidth={5} />
		<path d="M -14 -20 L 0 12 L 14 -20 Z" fill={P.skin} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
		<path d="M -5 0 L 0 12 L 5 0 Z" fill={P.navy} />
		<rect x={-14} y={-172} width={28} height={26} rx={4} fill={P.red} stroke={P.navy} strokeWidth={5} />
	</g>
);
export const Magnifier: React.FC<{r?: number}> = ({r = 50}) => (
	<g>
		<line x1={r * 0.7} y1={r * 0.7} x2={r * 1.9} y2={r * 1.9} stroke={P.navy} strokeWidth={r * 0.32} strokeLinecap="round" />
		<circle r={r} fill={P.sky} fillOpacity={0.55} stroke={P.navy} strokeWidth={r * 0.18} />
		<path d={`M ${-r * 0.5} ${-r * 0.2} Q ${-r * 0.45} ${-r * 0.5} ${-r * 0.15} ${-r * 0.55}`} stroke={P.white} strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
	</g>
);
export const Dial: React.FC<{f: number; r: number; label: string; q: number; seed: number}> = ({f, r, label, q, seed}) => {
	const ang = Math.sin(f / 4 + seed) * 55 + Math.sin(f / 1.7 + seed * 3) * 30;
	return (
		<g>
			<circle r={r} fill={P.white} stroke={P.navy} strokeWidth={8} />
			{Array.from({length: 9}).map((_, i) => {
				const a = ((-130 + i * 32.5) * Math.PI) / 180;
				return <line key={i} x1={Math.sin(a) * r * 0.72} y1={-Math.cos(a) * r * 0.72} x2={Math.sin(a) * r * 0.88} y2={-Math.cos(a) * r * 0.88} stroke={P.navy} strokeWidth={5} strokeLinecap="round" />;
			})}
			<line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * r * 0.7} y2={-Math.cos((ang * Math.PI) / 180) * r * 0.7} stroke={P.red} strokeWidth={8} strokeLinecap="round" />
			<circle r={r * 0.1} fill={P.navy} />
			<FText text={label} x={0} y={r + 50} size={Math.round(r * 0.36)} fill={P.navy} />
			{q > 0 && (
				<g transform={`scale(${q})`}>
					<circle r={r * 0.55} fill={P.red} stroke={P.navy} strokeWidth={6} />
					<FText text="?" x={0} y={r * 0.26} size={Math.round(r * 0.8)} fill={P.white} />
				</g>
			)}
		</g>
	);
};
export const Shop: React.FC<{w?: number; sign?: string}> = ({w = 220, sign = 'AMBER GOLD'}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.8} width={w} height={w * 0.8} fill={P.paper} stroke={P.navy} strokeWidth={6} />
		<rect x={-w / 2 + 12} y={-w * 0.8 + 12} width={w - 24} height={w * 0.2} rx={6} fill={P.gold} stroke={P.navy} strokeWidth={4} />
		<FText text={sign} x={0} y={-w * 0.8 + 12 + w * 0.15} size={w * 0.11} fill={P.navy} />
		<rect x={-w / 2 + 16} y={-w * 0.46} width={w * 0.44} height={w * 0.3} fill={P.sky} stroke={P.navy} strokeWidth={4} />
		<rect x={w * 0.08} y={-w * 0.46} width={w * 0.3} height={w * 0.46} fill={P.navy} />
	</g>
);
export const Pile: React.FC<{n: number; r?: number}> = ({n, r = 20}) => (
	<g>
		{Array.from({length: n}).map((_, i) => (
			<G key={i} x={((i % 3) - 1) * r * 0.9 + (Math.floor(i / 3) % 2) * r * 0.45} y={-Math.floor(i / 3) * r * 0.75}>
				<Coin r={r} />
			</G>
		))}
	</g>
);
export const fall = (f: number, at: number, dur: number, y0: number, y1: number) => {
	const p = clamp01((f - (at - dur)) / dur);
	const y = y0 + (y1 - y0) * p * p;
	const b = f > at ? Math.abs(Math.sin(((f - at) / 8) * Math.PI)) * 22 * Math.exp(-(f - at) / 6) : 0;
	return y - b;
};

export const FloorDeco: React.FC<{l: Lay; dark?: boolean}> = ({l, dark = false}) =>
	l.v ? (
		<g stroke={dark ? '#0B111A' : P.navy} strokeWidth={4} opacity={dark ? 0.5 : 0.08}>
			{Array.from({length: 9}).map((_, k) => {
				const y = l.FL + 34 * Math.pow(k + 1, 1.45);
				return <line key={k} x1={0} y1={y} x2={l.W} y2={y} />;
			})}
			{Array.from({length: 9}).map((_, k) => (
				<line key={`p${k}`} x1={l.W / 2 + (k - 4) * 90} y1={l.FL} x2={l.W / 2 + (k - 4) * 330} y2={l.H} />
			))}
		</g>
	) : null;

// --- 0: sylwetka za biurkiem, wyroki w zawieszeniu ---------------------------------------------------
const Desk: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const spot = 0.22 + 0.16 * ip(f, K.zalozyl - 4, K.zalozyl + 8, 0, 1);
	const vault = v ? {x: cx, y: 560} : {x: cx, y: 330};
	const sil = v ? {y: 920, s: 1.8} : {y: 640, s: 1.9};
	const deskTop = v ? 880 : 580;
	const deskX = v ? [170, 910] : [560, 1360];
	const fw = v ? 180 : 220;
	const stack = v ? {x: 330, y: deskTop} : {x: 690, y: deskTop};
	const gav = v ? {x: 900, y: deskTop - 22} : {x: 1340, y: deskTop - 22};
	const cal = v ? {x: 170, y: 700, w: 170} : {x: 1650, y: 250, w: 200};
	const hang = v
		? [
				[190, 330],
				[400, 250],
				[680, 250],
				[890, 330],
			]
		: [
				[520, 300],
				[700, 190],
				[1220, 190],
				[1400, 300],
			];
	const drops = [K.skazany, K.kilka, K.kilka + 14, K.wyroki + 14];
	const year = Math.min(4, Math.max(0, Math.floor((f - K.lata) / 11)));
	const flipP = f >= K.lata && f < K.lata + 44 ? ((f - K.lata) % 11) / 11 : 1;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} dark />
			<FloorDeco l={l} dark />
			<path d={v ? `M 440 0 L 640 0 L 860 ${FL} L 220 ${FL} Z` : `M 860 0 L 1060 0 L 1260 ${FL} L 660 ${FL} Z`} fill={P.goldLight} opacity={spot} />
			<G x={vault.x} y={vault.y}>
				<VaultDoor r={190} spin={f * 0.6} />
			</G>
			<G x={cx} y={sil.y} s={sil.s}>
				<Mini suit="#0E1520" hair="#0E1520" skin="#0E1520" />
			</G>
			{/* biurko */}
			<rect x={deskX[0] + 20} y={deskTop + 32} width={deskX[1] - deskX[0] - 40} height={FL - deskTop - 32} fill="#8C6A4A" stroke={P.navy} strokeWidth={8} />
			<rect x={deskX[0]} y={deskTop} width={deskX[1] - deskX[0]} height={34} rx={8} fill="#6E5139" stroke={P.navy} strokeWidth={7} />
			{f >= K.l1 - 2 && (
				<G x={cx} y={v ? 1000 : 700} s={pk(f, K.l1 - 2)}>
					<rect x={v ? -170 : -160} y={-40} width={v ? 340 : 320} height={80} rx={12} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="Marcin P." x={0} y={18} size={v ? 54 : 50} fill={P.navy} />
				</G>
			)}
			{/* licznik powierzonych pieniędzy */}
			{f >= K.mln - 4 && (
				<G x={v ? cx : 360} y={v ? 240 : 190} s={pk(f, K.mln - 4)} o={1 - prog(f, K.l2, 10)}>
					<Plate text={`${Math.round(ip(f, K.mln, K.mln + 46, 0, 851, EOUT))} mln zł`} label="powierzone pieniądze" w={v ? 620 : 540} size={84} fill={P.gold} color={P.navy} stroke={P.navy} />
				</G>
			)}
			{/* kalendarz 2005 → 2009 */}
			{f >= K.lata - 8 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.lata - 8)} r={-3}>
					<Calendar text={String(2005 + year)} w={cal.w} />
					{flipP < 0.7 && year > 0 && (
						<g transform={`translate(${flipP * 90} ${-flipP * 160}) rotate(${flipP * 40})`} opacity={1 - flipP / 0.7}>
							<Calendar text={String(2004 + year)} w={cal.w} />
						</g>
					)}
				</G>
			)}
			{/* młotek */}
			{f >= K.l1 && (
				<G x={gav.x} y={gav.y} s={(v ? 0.9 : 1) * pk(f, K.l1 + 6)}>
					<Gavel ang={strike(f, [K.kilka, K.kilka + 14, K.wyroki + 14])} />
				</G>
			)}
			{/* sznurki opadają, teczki idą w górę i wiszą */}
			{f >= K.l2 &&
				drops.map((_, i) => {
					const restY = stack.y - fw * 0.36 - i * fw * 0.17;
					const g = ip(f, K.l2 + i * 3, K.l2 + 18 + i * 3, 0, 1, EOUT);
					const lift = ip(f, K.zaw - 6 + i * 3, K.zaw + 14 + i * 3, 0, 1, EBACK);
					const x = stack.x + (hang[i][0] - stack.x) * lift;
					const y = restY + (hang[i][1] - restY) * lift;
					const ex = lift > 0 ? x : hang[i][0] + (stack.x - hang[i][0]) * g;
					const ey = lift > 0 ? y - fw * 0.36 : -80 + (restY - fw * 0.36 + 80) * g;
					return <line key={i} x1={hang[i][0]} y1={-80} x2={ex} y2={ey} stroke={P.bg} strokeWidth={4} opacity={0.85} />;
				})}
			{drops.map((at, i) => {
				if (f < at - 12) return null;
				const restY = stack.y - fw * 0.36 - i * fw * 0.17;
				const lift = ip(f, K.zaw - 6 + i * 3, K.zaw + 14 + i * 3, 0, 1, EBACK);
				const y0 = fall(f, at, 12, -200, restY);
				const x = stack.x + (hang[i][0] - stack.x) * lift;
				const y = y0 + (hang[i][1] - restY) * lift;
				const sw = lift > 0.98 ? swing(f, K.zaw + 14 + i * 3, 9) + Math.sin((f + i * 17) / 14) * 2 : (1 - lift) * (i % 2 ? 4 : -5);
				return (
					<g key={i} transform={`translate(${x} ${y - fw * 0.36}) rotate(${sw}) translate(0 ${fw * 0.36})`}>
						<Folder w={fw} label="WYROK" />
					</g>
				);
			})}
		</g>
	);
};

// --- 1: lista ostrzeżeń publicznych KNF --------------------------------------------------------------
const ROWS = [0.82, 0.6, 0.74, -1, 0.52, 0.68];
const Knf: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const B = v ? {x0: 80, x1: 1000, y0: 210, y1: 790, head: 92, r0: 365, dr: 74, maxLen: 520, tx: 130} : {x0: 760, x1: 1720, y0: 130, y1: 760, head: 100, r0: 300, dr: 78, maxLen: 560, tx: 820};
	const knf = v ? {x: 270, w: 300, h: 230} : {x: 330, w: 340, h: 340};
	const cal = v ? {x: 790, y: 960} : {x: 330, y: 200};
	const rowY = (i: number) => B.r0 + i * B.dr;
	const lampOn = prog(f, K.ostrz - 2, 6);
	const write = ip(f, K.wpisala, K.wpisala + 22, 0, 1, EIO);
	const penFly = ip(f, K.komisja, K.wpisala, 0, 1, EIO);
	const penFrom = {x: knf.x, y: FL - knf.h - 40};
	const penTo = {x: B.tx, y: rowY(3) + 18};
	const textW = v ? 330 : 330;
	const pen = f < K.wpisala ? arcPt(penFly, penFrom.x, penFrom.y, penTo.x, penTo.y, 200) : {x: B.tx + textW * write, y: penTo.y + Math.sin(f * 1.4) * 4};
	const doc = v ? {x: 845, y: 430} : {x: 1560, y: 400};
	const bank = v ? {x: 845, y: 760} : {x: 1560, y: 720};
	const xDraw = ip(f, K.bez + 6, K.bez + 18, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* tablica */}
			<rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} rx={18} fill={P.white} stroke={P.navy} strokeWidth={8} />
			<rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.head} rx={18} fill={P.navy} />
			<FText text="LISTA OSTRZEŻEŃ PUBLICZNYCH" x={(B.x0 + B.x1) / 2} y={B.y0 + B.head * 0.66} size={v ? 44 : 50} fill={P.gold} />
			{ROWS.map((len, i) => {
				const a = prog(f, K.l3 + 6 + i * 3, 8);
				if (len < 0) {
					return (
						<g key={i}>
							<rect x={B.tx - 24} y={rowY(i) - 20} width={(textW + 70) * write} height={B.dr - 14} rx={8} fill={P.red} opacity={0.14} />
							<clipPath id={`am2w${v ? 'v' : 'h'}`}>
								<rect x={B.tx - 10} y={rowY(i) - 30} width={(textW + 40) * write} height={B.dr} />
							</clipPath>
							<g clipPath={`url(#am2w${v ? 'v' : 'h'})`}>
								<FText text="Amber Gold" x={B.tx} y={rowY(i) + 34} size={58} fill={P.red} anchor="start" />
							</g>
						</g>
					);
				}
				return <rect key={i} x={B.tx} y={rowY(i) + 4} width={B.maxLen * len * a} height={26} rx={13} fill={P.grey} />;
			})}
			{/* lampa na tablicy */}
			<G x={(B.x0 + B.x1) / 2} y={B.y0 - 4} s={1 + 0.15 * pk(f, K.ostrz) * (1 - prog(f, K.ostrz + 8, 8))}>
				<Lamp f={f} on={lampOn} beam={v ? 520 : 620} />
			</G>
			{/* KNF */}
			<G x={knf.x} y={FL}>
				<Columns w={knf.w} h={knf.h} label="KNF" labelSize={v ? 50 : 60} />
			</G>
			{f >= K.y2009 && (
				<G x={cal.x} y={cal.y} s={pk(f, K.y2009 + 2)} r={4}>
					<Calendar text="2009" w={v ? 190 : 200} />
				</G>
			)}
			{f >= K.komisja && f < K.wpisala + 34 && (
				<G x={pen.x} y={pen.y} o={1 - prog(f, K.wpisala + 24, 8)} s={pk(f, K.komisja)}>
					<Pencil />
				</G>
			)}
			{/* działalność bankowa bez zezwolenia */}
			{f >= K.bankowa && (
				<G x={bank.x} y={bank.y} s={0.8 * pk(f, K.bankowa)}>
					<Columns w={150} h={150} label="BANK?" labelSize={38} />
				</G>
			)}
			{f >= K.bez - 2 && (
				<G x={doc.x} y={doc.y} s={pk(f, K.bez - 2)} r={-4}>
					<rect x={-95} y={-120} width={190} height={240} rx={12} fill={P.paper} stroke={P.navy} strokeWidth={6} />
					<FText text="ZEZWOLENIE" x={0} y={-62} size={28} fill={P.navy} />
					{[0, 1, 2].map((i) => (
						<line key={i} x1={-60} x2={60} y1={-16 + i * 34} y2={-16 + i * 34} stroke={P.grey} strokeWidth={8} strokeLinecap="round" />
					))}
					<circle cx={42} cy={88} r={20} fill={P.goldLight} stroke={P.navy} strokeWidth={4} />
					<path d="M -110 -130 L 110 130" stroke={P.red} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(xDraw * 2)} />
					<path d="M 110 -130 L -110 130" stroke={P.red} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(xDraw * 2 - 1)} />
				</G>
			)}
		</g>
	);
};

// --- 2: pętla KNF → prokuratura → sąd ------------------------------------------------------------------
const Loop: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const B = v
		? {knf: {x: 240, y: 770, w: 250, h: 270}, prok: {x: 830, y: 770, w: 250, h: 270}, sad: {x: 540, y: 1110, w: 280, h: 280}}
		: {knf: {x: 330, y: FL, w: 260, h: 280}, prok: {x: 960, y: FL, w: 300, h: 300}, sad: {x: 1590, y: FL, w: 260, h: 280}};
	const rest = (b: {x: number; y: number; h: number}) => ({x: b.x, y: b.y - b.h - b.h * 0.28 - 110});
	const R = {knf: rest(B.knf), prok: rest(B.prok), sad: rest(B.sad)};
	type Pt = {x: number; y: number};
	const legs: [number, number, Pt, Pt, number][] = [
		[K.zawiad, K.prok + 8, R.knf, R.prok, 200],
		[K.l7 + 2, K.l7 + 24, R.prok, R.knf, 160],
		[K.wniosek + 2, K.sad - 4, R.knf, R.sad, v ? 120 : 170],
		[K.prowadzic + 14, K.prowadzic + 34, R.sad, R.prok, 160],
	];
	let pos: Pt = R.knf;
	let spin = 0;
	for (const [a, b, p0, p1, h] of legs) {
		if (f >= a) {
			const p = ip(f, a, b, 0, 1, EIO);
			pos = arcPt(p, p0.x, p0.y, p1.x, p1.y, h);
			spin = p < 1 ? Math.sin(p * Math.PI) * 14 : 0;
		}
	}
	const um1 = ip(f, K.umarz, K.umarz + 4, 0, 1, EOUT);
	const dal = ip(f, K.prowadzic, K.prowadzic + 4, 0, 1, EOUT);
	const stamps: Stamp[] = [
		{t: 'UMORZONO', c: P.red, a: -10, on: um1, dy: 0.1},
		{t: 'DALEJ!', c: '#3E7D4F', a: 8, on: dal, dy: 0.3},
	];
	const stampLift = (at: number) => (f < at - 22 ? 200 : f < at - 4 ? ip(f, at - 22, at - 8, 200, 70, EOUT) : f < at ? ip(f, at - 4, at, 70, 0, EIN) : ip(f, at + 4, at + 16, 0, 220, EIN));
	const loopDraw = ip(f, K.wniosek, K.sad, 0, 1, EIO);
	const speed = 2 + ip(f, K.sad, K.l8, 0, 10, EIN);
	const c = v ? {x: 540, y: 770, rx: 440, ry: 380} : {x: 960, y: 470, rx: 800, ry: 330};
	const fw = v ? 200 : 240;
	const gav = v ? {x: 870, y: B.sad.y - 22, s: 0.7} : {x: B.sad.x - B.sad.w / 2 - 40, y: FL - 22, s: 0.85};
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* pętla */}
			{loopDraw > 0 && (
				<g>
					<ellipse cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="none" stroke={P.gold} strokeWidth={14} opacity={0.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - loopDraw} />
					{loopDraw >= 1 && <ellipse cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="none" stroke={P.goldDark} strokeWidth={14} strokeDasharray="40 60" strokeDashoffset={-f * speed} strokeLinecap="round" />}
				</g>
			)}
			<G x={B.knf.x} y={B.knf.y}>
				<Columns w={B.knf.w} h={B.knf.h} label="KNF" labelSize={v ? 44 : 52} />
			</G>
			<G x={B.prok.x} y={B.prok.y}>
				<Columns w={B.prok.w} h={B.prok.h} label="PROKURATURA" labelSize={v ? 30 : 38} fill="#D9CBB0" />
			</G>
			<G x={B.sad.x} y={B.sad.y}>
				<Columns w={B.sad.w} h={B.sad.h} label="SĄD" labelSize={v ? 44 : 52} fill={P.goldLight} />
			</G>
			{/* młotek sędziego obok sądu */}
			{f >= K.l7 && (
				<G x={gav.x} y={gav.y} s={gav.s * pk(f, K.l7 + 4)}>
					<Gavel ang={strike(f, [K.sad])} />
				</G>
			)}
			{/* teczka sprawy */}
			{f >= K.l5 + 2 && (
				<G x={pos.x} y={pos.y} s={pk(f, K.l5 + 2)} r={spin}>
					<Folder w={fw} label="SPRAWA" stamps={stamps} />
				</G>
			)}
			{/* pieczątki */}
			{f >= K.kilka6 - 22 && f < K.umarz + 18 && (
				<G x={R.prok.x} y={R.prok.y - fw * 0.1}>
					<StampTool lift={stampLift(K.umarz)} color={P.red} />
				</G>
			)}
			{f >= K.prowadzic - 22 && f < K.prowadzic + 18 && (
				<G x={R.sad.x} y={R.sad.y - fw * 0.1}>
					<StampTool lift={stampLift(K.prowadzic)} color="#3E7D4F" />
				</G>
			)}
			{/* „kilka razy”: duszki poprzednich umorzeń */}
			{f >= K.kilka6 &&
				[0, 1].map((i) => {
					const a = K.kilka6 + i * 9;
					const p = clamp01((f - a) / 16);
					if (p <= 0 || p >= 1) return null;
					return (
						<G key={i} x={R.prok.x + (i ? 1 : -1) * (60 + p * 160)} y={R.prok.y - p * 120} r={(i ? 1 : -1) * p * 50} o={1 - p} s={0.8}>
							<Folder w={fw} label="SPRAWA" stamps={[{t: 'UMORZONO', c: P.red, a: -10, on: 1}]} />
						</G>
					);
				})}
		</g>
	);
};

// --- 3: półka ze sprawozdaniami i pusta przegródka ----------------------------------------------------
const BINDER = ['#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#8C7A5E', '#9C5A40', '#4A5A6E'];
const Shelf: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const S = v ? {x0: 90, x1: 990, top: 230, levels: [440, 660, 880, 1100], slot: 60, gap: [2, 6]} : {x0: 300, x1: 1620, top: 170, levels: [370, 575, 780], slot: 66, gap: [1, 9]};
	const per = Math.floor((S.x1 - S.x0 - 40) / S.slot);
	const bh = (v ? 200 : 185) - 20;
	const spot = ip(f, K.spraw - 4, K.spraw + 6, 0, 1);
	const web = ip(f, K.spraw + 4, K.spraw + 24, 0, 1, EIO);
	const gx = S.x0 + 20 + S.gap[1] * S.slot;
	const gy = S.levels[S.gap[0]];
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E6DCCB" />
			<FloorDeco l={l} />
			<FText text="SPRAWOZDANIA FINANSOWE" x={W / 2} y={S.top - 34} size={v ? 48 : 52} fill={P.navy} opacity={prog(f, K.l8 - 4, 10)} />
			<rect x={S.x0} y={S.top} width={S.x1 - S.x0} height={S.levels[S.levels.length - 1] - S.top + 24} fill="#B08A5E" stroke={P.navy} strokeWidth={8} />
			<rect x={S.x0 + 16} y={S.top + 16} width={S.x1 - S.x0 - 32} height={S.levels[S.levels.length - 1] - S.top - 16} fill="#7A5C3E" />
			{S.levels.map((y, li) => (
				<g key={li}>
					{Array.from({length: per}).map((_, j) => {
						if (li === S.gap[0] && (j === S.gap[1] || j === S.gap[1] + 1)) return null;
						const k = li * 40 + j;
						const a = ip(f, K.l8 - 6 + (li * per + j) * 0.45, K.l8 + (li * per + j) * 0.45, 0, 1, EBACK);
						if (a <= 0) return null;
						const hh = bh - hsh(k) * 26;
						const x = S.x0 + 20 + j * S.slot;
						return (
							<g key={j} transform={`translate(${x + S.slot / 2} ${y}) scale(1 ${a})`}>
								<rect x={-S.slot / 2 + 4} y={-hh} width={S.slot - 8} height={hh} rx={5} fill={BINDER[k % BINDER.length]} stroke={P.navy} strokeWidth={4} />
								<rect x={-S.slot / 2 + 14} y={-hh + 26} width={S.slot - 28} height={34} rx={3} fill={P.paper} />
								<circle cx={0} cy={-26} r={7} fill={P.paper} stroke={P.navy} strokeWidth={3} />
							</g>
						);
					})}
					<rect x={S.x0} y={y} width={S.x1 - S.x0} height={22} fill="#B08A5E" stroke={P.navy} strokeWidth={6} />
				</g>
			))}
			{/* pusta przegródka Amber Gold */}
			<rect x={gx + 4} y={gy - bh} width={S.slot * 2 - 8} height={bh} rx={5} fill="#24180F" stroke={P.red} strokeWidth={7} strokeDasharray="16 10" opacity={0.6 + 0.4 * spot} />
			{web > 0 && (
				<g stroke={P.paper} strokeWidth={3} fill="none" opacity={0.85}>
					<path d={`M ${gx + 6} ${gy - bh + 4} L ${gx + S.slot * 2 - 6} ${gy - bh + 80} M ${gx + S.slot * 2 - 6} ${gy - bh + 4} L ${gx + 6} ${gy - bh + 80}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - web} />
					<path d={`M ${gx + 14} ${gy - bh + 30} Q ${gx + S.slot} ${gy - bh + 50} ${gx + S.slot * 2 - 14} ${gy - bh + 30}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - web} />
				</g>
			)}
			<circle cx={gx + S.slot} cy={gy - bh / 2} r={v ? 170 : 160} fill="none" stroke={P.gold} strokeWidth={10} opacity={spot} />
			{spot > 0 && (
				<G x={gx + S.slot} y={gy + 70} s={pk(f, K.spraw)}>
					<rect x={-130} y={-34} width={260} height={64} rx={12} fill={P.red} stroke={P.navy} strokeWidth={5} />
					<FText text="Amber Gold" x={0} y={14} size={42} fill={P.white} />
				</G>
			)}
		</g>
	);
};

// --- 4: zamknięty skarbiec, nikt nie wie, co w środku -------------------------------------------------
const Vault: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const c = v ? {x: 540, y: 640, r: 210} : {x: 900, y: 420, r: 230};
	const chain = ip(f, K.l9 - 4, K.l9 + 14, 0, 1, EIO);
	const d1 = v ? {x: 290, y: 255, r: 86} : {x: 1560, y: 270, r: 110};
	const d2 = v ? {x: 790, y: 255, r: 86} : {x: 1560, y: 610, r: 110};
	const man = v ? {x: 150, s: 1.6} : {x: 300, s: 2.1};
	const peek = ip(f, K.zewn - 6, K.zewn + 8, 0, 1, EOUT);
	const link = (x0: number, y0: number, x1: number, y1: number) => (
		<g>
			<line x1={x0} y1={y0} x2={x0 + (x1 - x0) * chain} y2={y0 + (y1 - y0) * chain} stroke={P.navy} strokeWidth={34} strokeLinecap="round" />
			<line x1={x0} y1={y0} x2={x0 + (x1 - x0) * chain} y2={y0 + (y1 - y0) * chain} stroke="#9AA5AF" strokeWidth={22} strokeDasharray="34 12" strokeLinecap="round" />
		</g>
	);
	const R = c.r * 1.15;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#D9D1C2" />
			<FloorDeco l={l} />
			<G x={c.x} y={c.y}>
				<VaultDoor r={c.r} spin={Math.sin(f / 8) * 6} />
			</G>
			{link(c.x - R, c.y - R * 0.7, c.x + R, c.y + R * 0.7)}
			{link(c.x + R, c.y - R * 0.7, c.x - R, c.y + R * 0.7)}
			{chain >= 1 && (
				<G x={c.x} y={c.y + 20} s={pk(f, K.l9 + 14)}>
					<path d="M -38 -30 L -38 -70 Q -38 -110 0 -110 Q 38 -110 38 -70 L 38 -30" fill="none" stroke={P.navy} strokeWidth={14} />
					<rect x={-62} y={-34} width={124} height={100} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={7} />
					<circle cy={10} r={12} fill={P.navy} />
				</G>
			)}
			<G x={d1.x} y={d1.y} s={pk(f, K.l9 + 6)}>
				<Dial f={f} r={d1.r} label="pieniądze" q={pk(f, K.pien)} seed={1} />
			</G>
			<G x={d2.x} y={d2.y} s={pk(f, K.l9 + 10)}>
				<Dial f={f + 30} r={d2.r} label="złoto" q={pk(f, K.zlota)} seed={4} />
			</G>
			{/* ktoś z zewnątrz z lupą */}
			<G x={man.x} y={FL} s={man.s}>
				<Mini {...{suit: '#6E7D61', hair: '#3B2A20'}} up={0.5 * peek} mood={f >= K.pien ? 'sad' : 'ok'} />
				<G x={64 + 20 * peek} y={-150 - 30 * peek} s={0.45}>
					<Magnifier r={48} />
				</G>
				{f >= K.pien && <FText text="?" x={0} y={-262} size={64} fill={P.red} opacity={prog(f, K.pien, 6)} />}
			</G>
		</g>
	);
};

// --- 5: klient idzie pod ostrzeżeniem, patrzy na monety ----------------------------------------------
const Street: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const pole = v ? {x: 220, top: 300} : {x: 640, top: 96};
	const shop = v ? {x: 760, w: 300} : {x: 1600, w: 400};
	const sc = v ? 1 : 1;
	const walkTo = v ? 330 : 1000;
	const x = ip(f, K.l10 - 4, K.kto + 10, v ? 110 : 160, walkTo, EIO);
	const walking = f > K.l10 && f < K.kto + 8;
	const hand = {x: x + 238 * sc, y: FL - 292 * sc};
	const door = {x: shop.x + shop.w * 0.23, y: FL - shop.w * 0.3};
	const flights = [K.placi - 12, K.ods - 6, K.grosza - 8];
	const landed = flights.filter((a) => f >= a + 14).length;
	const sight = live(f, K.sprawdzic - 4, K.sprawdzic + 20, 6);
	const flash = f >= K.l10 ? 0.5 + 0.5 * Math.sin(f / 2.2) : 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} />
			<FloorDeco l={l} />
			{/* słup z lampą i ostrzeżeniem */}
			<rect x={pole.x - 10} y={pole.top} width={20} height={FL - pole.top} fill={P.slate} stroke={P.navy} strokeWidth={4} />
			<G x={pole.x} y={pole.top + 4}>
				<Lamp f={f} on={f >= K.l10 ? 1 : 0.0001} beam={v ? 420 : 520} s={v ? 0.9 : 1} />
			</G>
			<G x={pole.x} y={pole.top + 28} s={1 + 0.12 * pk(f, K.publ) * (1 - prog(f, K.publ + 8, 8))}>
				<WarnSign w={v ? 380 : 440} ang={swing(f, K.publ, 6) + Math.sin(f / 18) * 1.5} />
			</G>
			{flash > 0 && <circle cx={pole.x} cy={pole.top - 34} r={60} fill="#F2A541" opacity={0.18 * flash} />}
			{/* sklep Amber Gold */}
			<G x={shop.x} y={FL}>
				<Shop w={shop.w} />
			</G>
			{/* linia wzroku: „wystarczyło sprawdzić” */}
			{sight > 0 && (
				<g opacity={sight}>
					<line x1={x + 20} y1={FL - 440 * sc} x2={pole.x + (v ? 120 : 140)} y2={pole.top + 28 + (v ? 110 : 120)} stroke={P.red} strokeWidth={9} strokeDasharray="2 18" strokeLinecap="round" />
					<G x={pole.x + (v ? 200 : 260)} y={pole.top + (v ? 40 : 20)} s={pk(f, K.sprawdzic)}>
						<Magnifier r={v ? 38 : 44} />
					</G>
				</g>
			)}
			{/* klient */}
			<G x={x} y={FL} s={sc}>
				<Adult look={{suit: '#8C7A5E', hair: '#2B2420', shirt: '#CFC7B8', hairStyle: 'short'}} walk={walking} mood={landed > 0 ? 'smile' : 'neutral'} armR={70} holdR={<Pile n={2 + landed} r={18} />} seed={5} />
			</G>
			{f >= K.kto && (
				<G x={x - 10} y={FL - 560 * sc} s={pk(f, K.kto)} o={1 - prog(f, K.placi + 6, 8)}>
					<circle r={54} fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="?" x={0} y={26} size={78} fill={P.red} />
				</G>
			)}
			{/* odsetki lecą ze sklepu do ręki */}
			{flights.map((a, i) => {
				const p = clamp01((f - a) / 14);
				if (p <= 0 || p >= 1) return null;
				const q = arcPt(EIO(p), door.x, door.y, hand.x, hand.y - 30, v ? 160 : 220);
				return (
					<G key={i} x={q.x} y={q.y} r={p * 300}>
						<Coin r={22} />
					</G>
				);
			})}
		</g>
	);
};

// --- 6: monety leżą na pułapce ------------------------------------------------------------------------
const Trap: React.FC<{f: number; l: Lay}> = ({f, l}) => {
	const {v, W, FL} = l;
	const B = v ? {x0: 90, x1: 990, top: 980, hinge: 400, plate: 780, bar: 330, label: 60} : {x0: 460, x1: 1460, top: 650, hinge: 880, plate: 1180, bar: 440, label: 64};
	const tremble = f >= K.najg ? Math.sin(f * 1.7) * 3.5 * ip(f, K.najg, K.najg + 10, 0, 1) : 0;
	const th = ((150 + tremble) * Math.PI) / 180;
	const end = {x: B.hinge + Math.cos(th) * B.bar, y: B.top - Math.sin(th) * B.bar};
	const drops = [K.placil - 4, K.placil + 3, K.placil + 10];
	const dark = ip(f, K.najg + 14, SCENE, 0, 0.88, EIN);
	const red = live(f, K.najg - 2, SCENE + 10, 6);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<ellipse cx={(B.x0 + B.x1) / 2} cy={FL - 4} rx={(B.x1 - B.x0) * 0.55} ry={26} fill={P.navy} opacity={0.18} />
			{/* podstawa */}
			<path d={`M ${B.x0 + 20} ${B.top} L ${B.x1 - 20} ${B.top} L ${B.x1} ${B.top + 30} L ${B.x0} ${B.top + 30} Z`} fill="#D9B07A" stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
			<rect x={B.x0} y={B.top + 30} width={B.x1 - B.x0} height={FL - B.top - 34} rx={10} fill="#C99A64" stroke={P.navy} strokeWidth={8} />
			{[0.3, 0.55].map((k, i) => (
				<path key={i} d={`M ${B.x0 + 30} ${B.top + 30 + (FL - B.top - 34) * k} Q ${(B.x0 + B.x1) / 2} ${B.top + 20 + (FL - B.top - 34) * k} ${B.x1 - 30} ${B.top + 34 + (FL - B.top - 34) * k}`} stroke="#A87B4A" strokeWidth={4} fill="none" />
			))}
			<FText text="AMBER GOLD" x={(B.x0 + B.x1) / 2} y={B.top + 30 + (FL - B.top - 34) * 0.78} size={B.label} fill={P.navy} />
			{/* cień kabłąka rośnie na ścianie */}
			{f >= K.l14 - 6 && (() => {
				const g = ip(f, K.l14 - 6, K.najg + 8, 0, 1, EIO);
				const a = ((v ? 118 : 146) + tremble * 2) * (Math.PI / 180);
				const len = B.bar * (1 + (v ? 1.7 : 1.1) * g);
				const ex = B.hinge + Math.cos(a) * len;
				const ey = B.top - 14 - Math.sin(a) * len;
				return (
					<g opacity={0.2 * g} stroke={P.navy} strokeLinecap="round" fill="none">
						<line x1={B.hinge} y1={B.top - 14} x2={ex} y2={ey} strokeWidth={30 + 40 * g} />
						<line x1={ex} y1={ey} x2={ex + 60 * (1 + g)} y2={ey + 150 * (1 + g)} strokeWidth={30 + 40 * g} />
					</g>
				);
			})()}
			{/* sprężyna i kabłąk */}
			{[0, 1, 2, 3].map((i) => (
				<ellipse key={i} cx={B.hinge - 30 + i * 20} cy={B.top - 14} rx={14} ry={22} fill="none" stroke="#7D8A97" strokeWidth={7} />
			))}
			<line x1={B.hinge} y1={B.top - 14} x2={end.x} y2={end.y} stroke={P.navy} strokeWidth={22} strokeLinecap="round" />
			<line x1={B.hinge} y1={B.top - 14} x2={end.x} y2={end.y} stroke="#AEB8C2" strokeWidth={10} strokeLinecap="round" />
			<line x1={end.x} y1={end.y} x2={end.x + 26} y2={end.y + 70} stroke={P.navy} strokeWidth={22} strokeLinecap="round" />
			<line x1={end.x} y1={end.y} x2={end.x + 26} y2={end.y + 70} stroke="#AEB8C2" strokeWidth={10} strokeLinecap="round" />
			{/* płytka z przynętą */}
			<rect x={B.plate - 110} y={B.top - 16} width={220} height={20} rx={6} fill={P.goldLight} stroke={P.navy} strokeWidth={5} />
			<G x={B.plate} y={B.top - 34}>
				<Pile n={7} r={28} />
			</G>
			{drops.map((a, i) => {
				if (f < a - 12) return null;
				const y = fall(f, a, 12, B.top - 700, B.top - 34 - 3 * 21 - i * 8);
				return (
					<G key={i} x={B.plate + (i - 1) * 26} y={y} r={(i - 1) * 12}>
						<Coin r={28} />
					</G>
				);
			})}
			{red > 0 && <rect x={0} y={0} width={W} height={l.H} fill={P.red} opacity={0.12 * red} />}
			<rect x={-20} y={-20} width={W + 40} height={l.H + 40} fill={P.navy} opacity={dark} />
		</g>
	);
};

const ROOMS = [Desk, Knf, Loop, Shelf, Vault, Street, Trap];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const R2Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<AmberStage v={v} lines={LINES} vo="am2_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`am2c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((R, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#am2c${v ? 'v' : 'h'})`}>
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

export const AmberR2: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Rozdział 2" title="Ostrzeżenie" icon={<G y={-90}><WarnSign w={420} /></G>} frames={CARD} />}>
		<R2Scene />
	</WithCard>
);

export const AmberS2: React.FC = () => (
	<ShortWithCta sceneFrames={SCENE}>
		<R2Scene v />
	</ShortWithCta>
);
