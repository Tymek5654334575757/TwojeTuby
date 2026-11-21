// Historia 2: HP, 1939 (GarHP = film z planszą, GarHPS = short 2) oraz przerywnik subskrypcji GarZ (tylko film).
// Pokoje: tabliczka „miejsce narodzin Doliny Krzemowej” → mapa Zatoki (Palo Alto, 1938) → absolwenci Stanfordu →
// dom 367, garaż i szopa (zzz) → umowa 1.01.1939 i waga: gotówka + wiertarka = 538 $ → rzut monetą →
// generator i czysty ton → zamówienie z Hollywood (łańcuch z historii Disneya, 8 skrzynek) → garaż rośnie w fabrykę →
// garaż dziś z dwiema tabliczkami → most: biuro HP nocą, płytka drukowana, „Steve Wozniak”.
import React from 'react';
import {LINES} from './ga2.gen';
import {LINES as ZL} from './gaz.gen';
import {
	Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EBACK, type CK, type Hit,
	P, G, Adult, Coin, FText, clamp01, prog, Room, Plate, LAY, kk, FloorDeco, type Lay,
	LOOK, Garage, Chain, Sign, Plaque, House, Tower, Desk, Crt, Pcb, ToneGen, DrillPress, Scale, Calendar, BayMap, Pin, Banknote, Tag,
	CARD, GarageCard, CutShort, keepFrom, keepLen, ShortWithCta,
} from './gkit';
import {BAY_CITIES} from './geo.gen';

const T = makeT(LINES);
const END = endOf(LINES) + 30;
export const H_FRAMES = CARD + END;
const KEEP = keepFrom(LINES, [], 18, END);
export const HS_SCENE = keepLen(KEEP);

const K = {
	kal: T(0, 'Kalifornia'), doliny: T(0, 'Doliny'),
	l1: T(1), pa: T(1, 'Palo'), y38: T(1, '1938'),
	l2: T(2), stan: T(2, 'Stanfordu'), bill: T(2, 'Bill'), dave: T(2, 'Dave'), firme: T(2, 'firmę'),
	l3: T(3), lucile: T(3, 'Lucile'), addison: T(3, 'Addison'), n367: T(3, '367'),
	l4: T(4), gar4: T(4, 'garaż'),
	l5: T(5), szopie: T(5, 'szopie'),
	l6: T(6), umowe: T(6, 'umowę'),
	l7: T(7), d538: T(7, '538'),
	l8: T(8), gotowce: T(8, 'gotówce'), wiert: T(8, 'wiertarka'),
	l9: T(9), nazwisk: T(9, 'nazwisk'), moneta: T(9, 'monetą'),
	l10: T(10), gen: T(10, 'generator'),
	l11: T(11), ton: T(11, 'czysty'), mikro: T(11, 'mikrofony'), wzm: T(11, 'wzmacniacze'), glos: T(11, 'głośniki'),
	l12: T(12), holly: T(12, 'Hollywood'),
	l13: T(13), fant: T(13, '„Fantazji”'), d8: T(13, '8'),
	l14: T(14), studiu: T(14, 'studiu'), gar14: T(14, 'garażu', 1),
	l15: T(15), rosnie: T(15, 'rośnie'), najw: T(15, 'największych'),
	l16: T(16), stoi: T(16, 'stoi'),
	l17: T(17), stanow: T(17, 'stanowym'), y2007: T(17, '2007'),
	l18: T(18), siedem: T(18, 'siedemdziesiątych'), inz: T(18, 'inżynier'),
	l19: T(19), projekt: T(19, 'projektuje'), komp: T(19, 'komputer'),
	l20: T(20), woz: T(20, 'Steve'),
	end: END,
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, -40, 1.12], [0, -60, 1.12]),
	kk(v, K.doliny + 20, 0, [-60, -60, 1.18], [0, -100, 1.16]),
	kk(v, K.l1 - 12, 0, [-40, -40, 1.1], [0, -60, 1.1]),
	kk(v, K.l1 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.y38 + 10, 1, [120, 60, 1.3], [80, 80, 1.3]),
	kk(v, K.l2 - 12, 1, [100, 40, 1.2], [60, 60, 1.2]),
	kk(v, K.l2 + 14, 2, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.firme + 10, 2, [0, -60, 1.12], [0, -80, 1.1]),
	kk(v, K.l3 - 12, 2, [0, -40, 1.06], [0, -40, 1.06]),
	kk(v, K.l3 + 14, 3, [-320, -40, 1.12], [-200, -40, 1.1]),
	kk(v, K.gar4, 3, [60, -40, 1.1], [120, -40, 1.08]),
	kk(v, K.szopie, 3, [380, -40, 1.18], [260, -60, 1.18]),
	kk(v, K.l6 - 12, 3, [300, -30, 1.1], [200, -30, 1.1]),
	kk(v, K.l6 + 14, 4, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.d538 + 10, 4, [0, -80, 1.12], [0, -120, 1.1]),
	kk(v, K.wiert + 20, 4, [0, -30, 1.06], [0, -40, 1.06]),
	kk(v, K.l9 - 12, 4, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.l9 + 14, 5, [0, -40, 1.06], [0, -60, 1.06]),
	kk(v, K.moneta + 20, 5, [0, -100, 1.2], [0, -160, 1.2]),
	kk(v, K.l10 - 12, 5, [0, -60, 1.1], [0, -80, 1.1]),
	kk(v, K.l10 + 14, 6, [0, -60, 1.12], [0, -80, 1.12]),
	kk(v, K.ton + 10, 6, [-120, -80, 1.22], [0, -120, 1.2]),
	kk(v, K.glos + 20, 6, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l12 - 12, 6, [0, -20, 1.02], [0, -20, 1.02]),
	kk(v, K.l12 + 14, 7, [0, 0, 1], [0, 0, 1]),
	kk(v, K.d8 + 20, 7, [200, -40, 1.12], [100, -60, 1.1]),
	kk(v, K.l14 + 30, 7, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.l15 - 12, 7, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.l15 + 14, 8, [0, 0, 1], [0, 0, 1]),
	kk(v, K.najw + 20, 8, [0, -60, 1.06], [0, -100, 1.04]),
	kk(v, K.l16 - 12, 8, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l16 + 14, 9, [0, -40, 1.12], [0, -60, 1.1]),
	kk(v, K.y2007 + 20, 9, [200, -80, 1.16], [120, -120, 1.14]),
	kk(v, K.l18 - 12, 9, [120, -60, 1.08], [80, -80, 1.08]),
	kk(v, K.l18 + 14, 10, [-100, -20, 1.04], [-60, -20, 1.04]),
	kk(v, K.komp + 10, 10, [0, -120, 1.2], [0, -160, 1.2]),
	kk(v, K.end, 10, [300, -60, 1.1], [200, -60, 1.1]),
];
const DIPS: [number, number, number][] = [K.l1, K.l2, K.l3, K.l6, K.l9, K.l10, K.l12, K.l15, K.l16, K.l18].map((b) => [b - 12, b + 14, 0.1]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.doliny), kind: 'punch', amp: 0.5},
	{t: s(K.y38), kind: 'punch', amp: 0.4},
	{t: s(K.n367), kind: 'punch', amp: 0.4},
	{t: s(K.szopie + 10), kind: 'shake', amp: 0.2},
	{t: s(K.umowe), kind: 'punch', amp: 0.4},
	{t: s(K.d538 + 14), kind: 'punch', amp: 0.6},
	{t: s(K.wiert + 8), kind: 'both', amp: 0.5},
	{t: s(K.moneta + 26), kind: 'punch', amp: 0.6},
	{t: s(K.gen), kind: 'punch', amp: 0.4},
	{t: s(K.holly), kind: 'punch', amp: 0.5},
	{t: s(K.d8), kind: 'both', amp: 0.6},
	{t: s(K.najw), kind: 'punch', amp: 0.5},
	{t: s(K.y2007), kind: 'punch', amp: 0.5},
	{t: s(K.woz), kind: 'punch', amp: 0.6},
];

type R = React.FC<{f: number; l: Lay}>;

// 0: tabliczka zabytku wbija się przed garażem, drzwi się otwierają
const R0: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const drop = ip(f, K.kal - 6, K.kal + 8, -600, 0, EIO);
	const open = ip(f, K.doliny, K.doliny + 26, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? cx : cx + 180} y={FL} s={v ? 1.45 : 1.35}>
				<Garage w={460} h={330} open={open} id="h0" roof="#5C6B7A">
					<Desk w={250} lamp={open}>
						<g transform="translate(-40 0) scale(0.35)">
							<ToneGen f={f} knob={0.4} on={open} />
						</g>
					</Desk>
				</Garage>
			</G>
			<G x={v ? cx : cx - 560} y={(v ? 760 : FL) + drop} s={v ? 1.05 : 1}>
				<Plaque lines={['Miejsce narodzin', 'Doliny Krzemowej']} w={v ? 470 : 430} />
			</G>
		</g>
	);
};

// 1: mapa Zatoki San Francisco, pinezka Palo Alto, kalendarz 1938
const R1: R = ({f, l}) => {
	const {v, W, H} = l;
	const cx = W / 2;
	const ms = v ? 1.0 : 1.05;
	const pa = BAY_CITIES.paloalto;
	return (
		<g>
			<rect x={0} y={0} width={W} height={H} fill="#C9D6DA" />
			<g transform={`translate(${cx} ${v ? 620 : 470}) scale(${ms})`}>
				<BayMap />
				<G x={BAY_CITIES.sf[0]} y={BAY_CITIES.sf[1]}>
					<Pin label="San Francisco" s={pk(f, K.l1 - 6) * 0.8} size={42} color={P.slate} side="r" />
				</G>
				<G x={pa[0]} y={pa[1]}>
					<Pin label="Palo Alto" s={pk(f, K.pa)} size={v ? 58 : 52} side="r" />
				</G>
			</g>
			<G x={v ? 860 : W - 200} y={v ? 300 : 200} s={pk(f, K.y38 - 2)}>
				<Calendar text="1938" w={230} />
			</G>
		</g>
	);
};

// 2: dwaj absolwenci Stanfordu
const Cap: React.FC = () => (
	<g>
		<path d="M -70 -18 L 0 -44 L 70 -18 L 0 8 Z" fill={P.navy} />
		<rect x={-34} y={-14} width={68} height={26} fill={P.navy} />
		<line x1={56} y1={-18} x2={62} y2={30} stroke={P.gold} strokeWidth={5} />
	</g>
);
const R2: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const hx = v ? 320 : cx - 260;
	const px = v ? 760 : cx + 260;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={cx} y={v ? 330 : 150} s={pk(f, K.stan - 4) * (v ? 1.1 : 1)}>
				<Sign text="Stanford" w={420} fill="#7A4E3A" color={P.bg} />
			</G>
			{[
				[hx, LOOK.hewlett, K.bill, 2],
				[px, LOOK.packard, K.dave, 4],
			].map(([x, look, at, sd], i) => (
				<G key={i} x={x as number} y={FL} s={(v ? 1.2 : 1.15) * pk(f, (at as number) - 6)}>
					<Adult look={look as typeof LOOK.hewlett} mood={f > K.firme ? 'smile' : 'neutral'} armR={i === 0 ? 50 : 10} armL={i === 1 ? 50 : 10} seed={sd as number} />
					<g transform="translate(0 -500)">
						<Cap />
					</g>
					<FText text={i === 0 ? 'Bill Hewlett' : 'Dave Packard'} x={0} y={70} size={40} fill={P.navy} opacity={prog(f, at as number, 8)} />
				</G>
			))}
			{f >= K.firme && (
				<G x={cx} y={v ? 600 : FL - 420} s={pk(f, K.firme)}>
					<circle r={70} fill={P.goldLight} stroke={P.navy} strokeWidth={6} />
					<path d="M -20 30 L -20 0 Q -40 -20 -30 -46 Q -10 -70 0 -50 Q 10 -70 30 -46 Q 40 -20 20 0 L 20 30 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} />
				</G>
			)}
		</g>
	);
};

// 3: dom 367 z Lucile i Packardem, garaż, szopa z Hewlettem (zzz)
const R3: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const hx = v ? 250 : cx - 520;
	const gx = v ? 620 : cx + 60;
	const sx = v ? 930 : cx + 560;
	const gOn = pk(f, K.gar4 - 6);
	const lightOff = f > K.szopie + 10;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={hx} y={FL} s={v ? 0.85 : 1.1}>
				<House w={420} h={290} wall="#E4DBCB" roof="#5C6B7A" lit={1} />
				<g transform="translate(0 -205)" opacity={prog(f, K.n367 - 4, 8)}>
					<rect x={-60} y={-30} width={120} height={50} rx={8} fill={P.navy} />
					<FText text="367" x={0} y={8} size={38} fill={P.goldLight} />
				</g>
			</G>
			<G x={hx + (v ? 40 : 160)} y={FL} s={(v ? 0.75 : 0.95) * pk(f, K.l3 - 4)}>
				<Adult look={LOOK.packard} mood="smile" seed={4} />
			</G>
			<G x={hx + (v ? 150 : 300)} y={FL} s={(v ? 0.72 : 0.9) * pk(f, K.lucile - 4)}>
				<Adult look={LOOK.lucile} mood="smile" seed={6} />
			</G>
			<G x={gx} y={FL} s={(v ? 0.75 : 0.95) * gOn}>
				<Garage w={460} h={330} open={0} id="h3" roof="#5C6B7A" />
			</G>
			{/* szopa */}
			<G x={sx} y={FL} s={(v ? 0.7 : 0.9) * pk(f, K.szopie - 6)}>
				<rect x={-110} y={-220} width={220} height={220} fill="#A87B4A" stroke={P.navy} strokeWidth={7} />
				<path d="M -130 -216 L 0 -300 L 130 -216 Z" fill="#7A5A3E" stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
				<rect x={-50} y={-180} width={100} height={70} fill={lightOff ? '#1F2B3D' : P.goldLight} stroke={P.navy} strokeWidth={5} />
				<rect x={-40} y={-100} width={80} height={100} fill="#5C4A3A" stroke={P.navy} strokeWidth={5} />
				{lightOff &&
					[0, 1, 2].map((i) => {
						const p = ((f - K.szopie - 10 + i * 14) % 42) / 42;
						return <FText key={i} text="z" x={60 + p * 70} y={-230 - p * 120} size={36 + i * 10} fill={P.navy} opacity={1 - p} />;
					})}
				<FText text="Hewlett" x={0} y={50} size={36} fill={P.navy} opacity={prog(f, K.szopie, 8)} />
			</G>
			{v && <FText text="Addison Avenue" x={540} y={300} size={60} fill={P.navy} opacity={prog(f, K.addison, 8)} />}
			{!v && <FText text="Addison Avenue" x={cx - 520} y={150} size={56} fill={P.navy} opacity={prog(f, K.addison, 8)} />}
		</g>
	);
};

// 4: umowa 1.01.1939; waga: gotówka + wiertarka stołowa = 538 $
const R4: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const sig = ip(f, K.umowe, K.umowe + 30, 0, 1, EIO);
	const cnt = Math.round(538 * ip(f, K.d538 - 6, K.d538 + 22, 0, 1, EOUT));
	const cash = pk(f, K.gotowce);
	const drill = f >= K.wiert - 8 ? 1 : 0;
	const dropY = ip(f, K.wiert - 8, K.wiert + 4, -500, 0, EIO);
	const tilt = drill ? ip(f, K.wiert + 2, K.wiert + 20, 0.0, 0.25, EBACK) : cash > 0 ? -0.25 * cash : 0;
	const docOut = ip(f, K.l7 - 6, K.l7 + 10, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			{/* umowa z dwoma podpisami (odjeżdża w lewo, gdy pada kwota) */}
			<G x={(v ? 540 : cx) - docOut * (v ? 0 : 560)} y={(v ? 640 : FL - 330) - docOut * (v ? 170 : 0)} s={pk(f, K.l6 - 4) * (v ? 1 - 0.4 * docOut : 1 - 0.3 * docOut)}>
				<rect x={-170} y={-210} width={340} height={420} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
				<FText text="UMOWA SPÓŁKI" x={0} y={-140} size={38} fill={P.navy} />
				<FText text="1.01.1939" x={0} y={-90} size={34} fill={P.goldDark} />
				{[0, 1, 2].map((i) => (
					<line key={i} x1={-120} x2={120} y1={-40 + i * 40} y2={-40 + i * 40} stroke={P.grey} strokeWidth={10} strokeLinecap="round" />
				))}
				<path d="M -140 140 q 20 -34 40 0 t 40 0" fill="none" stroke={P.navy} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(sig * 2)} />
				<path d="M 20 140 q 20 -34 40 0 t 40 0" fill="none" stroke={P.navy} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(sig * 2 - 1)} />
			</G>
			{f >= K.l7 - 6 && (
				<G x={v ? 540 : cx + 200} y={FL} s={(v ? 1.1 : 1.05) * pk(f, K.l7 - 6)}>
					<Scale
						w={440}
						tilt={tilt}
						left={
							<g opacity={cash}>
								{[0, 1, 2].map((i) => (
									<G key={i} x={(i - 1) * 30} y={-18 - i * 10} r={(i - 1) * 8} s={0.55}>
										<Banknote value="10" w={150} />
									</G>
								))}
							</g>
						}
						right={
							drill ? (
								<g transform={`translate(0 ${dropY})`}>
									<DrillPress s={0.42} />
								</g>
							) : null
						}
					/>
				</G>
			)}
			{f >= K.d538 - 6 && (
				<G x={v ? 540 : cx + 200} y={v ? 300 : 120} s={pk(f, K.d538 - 6)}>
					<Plate text={`${cnt} $`} label="kapitał" w={v ? 460 : 420} size={96} />
				</G>
			)}
		</g>
	);
};

// 5: rzut monetą o kolejność nazwisk
const R5: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const t0 = K.moneta - 10;
	const air = clamp01((f - t0) / 34);
	const y = (v ? 700 : 480) - Math.sin(air * Math.PI) * (v ? 360 : 300);
	const spin = f < t0 ? 0 : Math.min(f - t0, 34) * 0.55;
	const swap = Math.floor(spin / Math.PI) % 2 === 1 && air < 1;
	const a = swap ? 'Packard' : 'Hewlett';
	const b = swap ? 'Hewlett' : 'Packard';
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={v ? 260 : cx - 520} y={FL} s={v ? 0.9 : 1}>
				<Adult look={LOOK.hewlett} mood={air >= 1 ? 'laugh' : 'neutral'} armR={70} seed={2} />
			</G>
			<G x={v ? 820 : cx + 520} y={FL} s={v ? 0.9 : 1}>
				<Adult look={LOOK.packard} mood={air >= 1 ? 'smile' : 'neutral'} armL={70} seed={4} />
			</G>
			<g transform={`translate(${cx} ${y}) scale(${Math.cos(spin)} 1)`}>
				<Coin r={v ? 80 : 70} />
			</g>
			<G x={cx} y={v ? 430 : 170} s={pk(f, K.nazwisk - 4) * (v ? 0.95 : 1)}>
				<rect x={-430} y={-70} width={860} height={130} rx={18} fill={P.navy} />
				<FText text={`${a}-${b}`} x={0} y={24} size={78} fill={air >= 1 ? P.gold : P.bg} />
			</G>
		</g>
	);
};

// 6: generator dźwięku: czysty ton; mikrofon, wzmacniacz, głośnik
const Mic: React.FC = () => (
	<g>
		<rect x={-26} y={-110} width={52} height={80} rx={26} fill={P.slate} stroke={P.navy} strokeWidth={5} />
		<line x1={0} y1={-30} x2={0} y2={20} stroke={P.navy} strokeWidth={8} />
		<rect x={-40} y={20} width={80} height={12} rx={4} fill={P.navy} />
	</g>
);
const Amp: React.FC = () => (
	<g>
		<rect x={-80} y={-90} width={160} height={110} rx={10} fill="#5C4A3A" stroke={P.navy} strokeWidth={5} />
		{[-40, 0, 40].map((x) => (
			<circle key={x} cx={x} cy={-40} r={14} fill={P.gold} stroke={P.navy} strokeWidth={4} />
		))}
	</g>
);
const Spk: React.FC<{f: number; on: number}> = ({f, on}) => (
	<g>
		<rect x={-70} y={-170} width={140} height={190} rx={10} fill="#33445A" stroke={P.navy} strokeWidth={5} />
		<circle cx={0} cy={-70} r={46 + on * Math.sin(f) * 4} fill="#1F2B3D" stroke={P.grey} strokeWidth={5} />
		<circle cx={0} cy={-140} r={16} fill="#1F2B3D" stroke={P.grey} strokeWidth={4} />
	</g>
);
const R6: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const knob = ip(f, K.ton, K.ton + 90, 0.1, 0.9, EIO);
	const items: [number, React.ReactNode][] = [
		[K.mikro, <Mic key="m" />],
		[K.wzm, <Amp key="a" />],
		[K.glos, <Spk key="s" f={f} on={prog(f, K.glos, 6)} />],
	];
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx - 340} y={v ? 760 : FL - 40} s={(v ? 1.5 : 1.5) * pk(f, K.gen - 6)}>
				<ToneGen f={f} knob={knob} on={prog(f, K.ton - 4, 8)} />
			</G>
			{items.map(([at, node], i) => {
				const x = v ? 220 + i * 320 : cx + 120 + i * 260;
				const y = v ? 1110 : FL;
				return (
					<G key={i} x={x} y={y} s={(v ? 1.2 : 1.3) * pk(f, at - 4)}>
						{node}
						<circle cx={0} cy={-200} r={14} fill={P.gold} opacity={prog(f, at, 6)} />
					</G>
				);
			})}
			{/* fala dźwięku biegnie od generatora do urządzeń */}
			{f > K.ton && (
				<path
					d={Array.from({length: 40}, (_, i) => {
						const x = (v ? 140 : cx - 140) + i * (v ? 20 : 18);
						const yy = (v ? 560 : FL - 300) + Math.sin(i / 2 - f / 3) * 22;
						return `${i ? 'L' : 'M'} ${x} ${yy}`;
					}).join(' ')}
					fill="none"
					stroke={P.gold}
					strokeWidth={6}
					opacity={0.7 * prog(f, K.ton, 10)}
				/>
			)}
		</g>
	);
};

// 7: klient z Hollywood: łańcuch z historii Disneya, 8 skrzynek jedzie do studia
const R7: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const gx = v ? 220 : cx - 620;
	const stx = v ? 840 : cx + 560;
	const chainP = ip(f, K.holly - 20, K.holly + 20, 0, 1, EIO);
	const both = live(f, K.l14 - 4, END + 60, 10);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={gx} y={FL} s={v ? 0.7 : 0.95}>
				<Garage w={460} h={330} open={1} id="h7" roof="#5C6B7A" label="HP">
					<Desk w={250} lamp={1} />
				</Garage>
			</G>
			<G x={stx} y={FL} s={v ? 0.72 : 0.9}>
				<rect x={-260} y={-520} width={520} height={520} fill="#D9C9AE" stroke={P.navy} strokeWidth={7} />
				{Array.from({length: 12}).map((_, i) => (
					<rect key={i} x={-220 + (i % 4) * 115} y={-480 + Math.floor(i / 4) * 130} width={75} height={80} fill={hsh(i) > 0.4 ? P.goldLight : '#B9CBD3'} stroke={P.navy} strokeWidth={4} />
				))}
				<rect x={-230} y={-600} width={460} height={70} rx={10} fill={P.navy} />
				<FText text="Disney" x={0} y={-550} size={48} fill={P.goldLight} />
				<rect x={-80} y={-130} width={160} height={130} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
			</G>
			<G x={v ? 600 : stx} y={v ? 420 : 120} s={pk(f, K.holly - 4)}>
				<Sign text="Hollywood" w={v ? 440 : 400} fill={P.bg} />
			</G>
			<Chain x0={stx - (v ? 200 : 240)} y0={FL - (v ? 330 : 420)} x1={-40} y1={FL - 520} sag={60} p={chainP} link={28} tension={ip(f, K.holly + 20, K.holly + 40, 0, 0.8, EIO)} />
			{/* taśma i 8 skrzynek */}
			<rect x={gx + (v ? 140 : 200)} y={FL - 30} width={stx - gx - (v ? 300 : 420)} height={22} rx={8} fill={P.slate} stroke={P.navy} strokeWidth={4} />
			{Array.from({length: 8}).map((_, i) => {
				const a = K.fant + i * 8;
				if (f < a) return null;
				const p = clamp01((f - a) / 70);
				const x = gx + (v ? 150 : 230) + p * (stx - gx - (v ? 330 : 480));
				return (
					<G key={i} x={x} y={FL - 30} s={(v ? 0.22 : 0.28) * (p < 1 ? 1 : 0)}>
						<ToneGen f={f} knob={0.5} on={1} />
					</G>
				);
			})}
			<G x={v ? 540 : cx} y={v ? 620 : 260} s={pk(f, K.d8 - 4)}>
				<Plate text={`${Math.min(8, Math.max(0, Math.floor((f - K.fant) / 8) + 1))}`} label="generatorów" w={v ? 300 : 280} size={110} />
			</G>
			{both > 0 && (
				<G x={v ? 540 : cx} y={v ? 880 : FL - 520} s={both}>
					<path d="M -120 0 L 120 0 M 90 -30 L 120 0 L 90 30" fill="none" stroke={P.gold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
				</G>
			)}
		</g>
	);
};

// 8: garaż rośnie: fabryka, potem wieżowiec; „największych producentów elektroniki”
const R8: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const g1 = ip(f, K.rosnie - 4, K.rosnie + 20, 0, 1, EIO);
	const g2 = ip(f, K.najw - 6, K.najw + 24, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<FloorDeco l={l} />
			<G x={cx} y={FL} s={(v ? 1.1 : 1) * (1 - g1)} o={1 - g1}>
				<Garage w={460} h={330} open={0} id="h8" roof="#5C6B7A" label="HP" />
			</G>
			<G x={cx} y={FL} s={(v ? 0.85 : 1) * g1 * (1 - g2 * 0.4)} o={g1 * (1 - g2)}>
				<rect x={-420} y={-300} width={840} height={300} fill="#AEA594" stroke={P.navy} strokeWidth={7} />
				{[0, 1, 2, 3].map((i) => (
					<path key={i} d={`M ${-420 + i * 210} -300 L ${-420 + i * 210 + 105} -380 L ${-420 + (i + 1) * 210} -300 Z`} fill="#8C857A" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
				))}
				<rect x={260} y={-520} width={60} height={220} fill={P.slate} stroke={P.navy} strokeWidth={6} />
				<FText text="HP" x={0} y={-130} size={110} fill={P.navy} />
			</G>
			<G x={cx} y={FL} s={(v ? 0.9 : 0.95) * g2}>
				{[-380, -190, 190, 380].map((x, i) => (
					<G key={i} x={x} y={0}>
						<Tower w={160} h={420 + i * 40} fill="#5C6B7A" lit={0.5} seed={i + 3} />
					</G>
				))}
				<Tower w={260} h={720} fill="#33445A" lit={0.6} seed={9} />
				<rect x={-120} y={-700} width={240} height={90} rx={10} fill={P.navy} stroke={P.gold} strokeWidth={5} />
				<FText text="HP" x={0} y={-635} size={70} fill={P.gold} />
			</G>
		</g>
	);
};

// 9: garaż przy Addison Avenue dziś: zabytek stanowy i od 2007 r. krajowy
const R9: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx} y={FL} s={v ? 1.2 : 1.25}>
				<Garage w={460} h={330} open={0} id="h9" roof="#5C6B7A" />
			</G>
			<G x={v ? 250 : cx - 560} y={FL} s={(v ? 0.66 : 0.85) * pk(f, K.stanow - 4)}>
				<Plaque lines={['Zabytek', 'stanowy']} w={360} />
			</G>
			<G x={v ? 830 : cx + 560} y={FL} s={(v ? 0.66 : 0.85) * pk(f, K.y2007 - 4)}>
				<Plaque lines={['2007', 'rejestr krajowy USA']} w={360} />
			</G>
		</g>
	);
};

// 10: [most] biuro HP nocą, młody inżynier projektuje komputer: „Steve Wozniak”
const R10: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const draw = ip(f, K.projekt, K.komp + 30, 0, 1, EIO);
	const chain = ip(f, K.woz + 10, K.end, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#33445A" dark />
			<G x={v ? 260 : 300} y={v ? 300 : 200} s={pk(f, K.siedem - 4)}>
				<Calendar text="1975" w={200} />
			</G>
			{/* okno z nocnym niebem */}
			<rect x={v ? 600 : cx + 260} y={v ? 220 : 120} width={v ? 360 : 460} height={v ? 300 : 300} fill="#0E1520" stroke={P.navy} strokeWidth={8} />
			{Array.from({length: 14}).map((_, i) => (
				<circle key={i} cx={(v ? 620 : cx + 280) + hsh(i) * (v ? 320 : 420)} cy={(v ? 240 : 140) + hsh(i + 9) * 260} r={2 + hsh(i + 4) * 3} fill={P.bg} opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
			))}
			<G x={v ? 540 : cx - 120} y={FL} s={v ? 1.25 : 1.2}>
				<Desk w={460} lamp={1}>
					<g transform="translate(-60 -40) scale(0.9)">
						<Pcb w={300} draw={draw} chips={ip(f, K.komp, K.komp + 30, 0, 1)} lit={prog(f, K.woz, 6)} />
					</g>
				</Desk>
			</G>
			<G x={v ? 220 : cx - 520} y={FL} s={(v ? 0.95 : 1.05) * pk(f, K.inz - 6)}>
				<Adult look={LOOK.woz} mood={f > K.woz ? 'smile' : 'neutral'} armR={60} seed={8} />
			</G>
			{f >= K.woz && (
				<G x={v ? 540 : cx - 120} y={v ? 600 : 300} s={pk(f, K.woz)}>
					<rect x={-260} y={-60} width={520} height={110} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={7} />
					<FText text="Steve Wozniak" x={0} y={20} size={64} fill={P.navy} />
				</G>
			)}
			{chain > 0 && <Chain x0={v ? 700 : cx + 200} y0={FL - 200} x1={W + 40} y1={FL - 260} sag={60} p={chain} link={28} />}
		</g>
	);
};

const ROOMS = [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<Stage v={v} lines={LINES} vo="ga2_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`gd2c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((Rm, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#gd2c${v ? 'v' : 'h'})`}>
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

export const GarHP: React.FC = () => (
	<WithCard cardFrames={CARD} card={<GarageCard num={2} name="HP" year="1939" />}>
		<Scene />
	</WithCard>
);
export const GarHPS: React.FC = () => (
	<ShortWithCta sceneFrames={HS_SCENE}>
		<CutShort keep={KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);

// --- przerywnik subskrypcji (tylko film 16:9) -----------------------------------------------------------------
const ZT = makeT(ZL);
export const Z_FRAMES = endOf(ZL) + 24;
const ZK = {sub: ZT(1, 'zasubskrybuj'), zero: ZT(2, '0'), l2: ZT(2)};
export const GarZ: React.FC = () => (
	<Stage lines={ZL} vo="gaz_vo.wav" keys={[{f: 0, x: 960, y: 470, z: 1.04}, {f: Z_FRAMES, x: 960, y: 470, z: 1.1}]} hits={[{t: ZK.zero / 30, kind: 'punch', amp: 0.5}]}>
		{(f) => {
			const click = ip(f, ZK.sub + 10, ZK.sub + 16, 0, 1, EOUT);
			const cur = ip(f, ZK.sub - 20, ZK.sub + 8, 0, 1, EIO);
			return (
				<g>
					<Room w={1920} h={1080} floor={800} tone="#E8DCC6" />
					<G x={560} y={800} s={1.2}>
						<Garage w={460} h={330} open={0} id="z0" label="WUJ ROBERT" labelSize={34} />
						<g transform="translate(205 -205) scale(0.62)">
							<Tag text={f > ZK.zero ? '0 $' : '1 $/tydz.'} w={250} color={f > ZK.zero ? P.goldLight : P.gold} swing={swing(f, ZK.zero, 14)} />
						</g>
					</G>
					{f > ZK.zero - 4 && <line x1={760} y1={540} x2={920} y2={620} stroke={P.red} strokeWidth={10} strokeLinecap="round" opacity={1 - prog(f, ZK.zero + 6, 6)} />}
					<G x={1340} y={470} s={pk(f, ZK.sub - 30) * (1 - 0.06 * click * (1 - prog(f, ZK.sub + 16, 6)))}>
						<rect x={-260} y={-70} width={520} height={140} rx={70} fill={click > 0.5 ? P.slate : P.red} stroke={P.navy} strokeWidth={8} />
						<FText text={click > 0.5 ? 'Subskrybujesz' : 'Subskrybuj'} x={0} y={24} size={64} fill={P.white} />
					</G>
					<G x={1340} y={310} s={pk(f, ZK.sub + 16)} r={swing(f, ZK.sub + 16, 18)}>
						<path d="M -40 30 Q -44 -30 0 -40 Q 44 -30 40 30 L 52 44 L -52 44 Z" fill={P.gold} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
						<circle cx={0} cy={52} r={10} fill={P.navy} />
					</G>
					<g transform={`translate(${1700 - cur * 300} ${700 - cur * 200})`}>
						<path d="M 0 0 L 0 70 L 18 54 L 32 84 L 44 78 L 30 50 L 54 50 Z" fill={P.white} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
					</g>
				</g>
			);
		}}
	</Stage>
);
