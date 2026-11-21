// Hak (GarHak, ga0) i finał z ekranem końcowym (GarFinal, ga6) filmu „5 firm, które zaczęły w garażu”. Tylko 16:9.
// Hak: ulica pięciu garaży z nazwami → wieża monet „biliony” → LEGENDA → łańcuch przez klamki → trzy przebitki
// (wiertarka, czek, pusty garaż) → trzeci garaż pęka jak tektura.
// Finał: drzwi zamykają się rzędem → przed każdym garażem jego pierwszy klient albo inwestor → LEGENDA blednie,
// łańcuch rozbłyska ochrą → numery 1–5 → ekran końcowy 20 s (wolne miejsce na elementy YouTube).
import React from 'react';
import {LINES as HL} from './ga0.gen';
import {LINES as FL6} from './ga6.gen';
import {
	Stage, makeT, endOf, ip, pk, live, swing, hsh, EIO, EOUT, EIN, EBACK, type Hit,
	P, G, FText, clamp01, prog, Room, Envelope, Coin,
	Garage, Chain, Sign, DrillPress, Check, Box, Book, Stamp, Pile, ToneGen,
} from './gkit';

const NAMES = ['Disney', 'HP', 'Apple', 'Amazon', 'Google'];
const ROOFS = ['#8C4A3A', '#5C6B7A', '#7A5A3E', '#4F6A7A', '#4F6A7A'];
const GX = (i: number) => 220 + i * 370;
const FLOOR = 760;

// Ulica pięciu garaży (wspólna dla haka i finału). open(i) 0..1, label(i) 0..1, inner(i) = wnętrze.
const Street: React.FC<{f: number; open: (i: number) => number; label: (i: number) => number; inner?: (i: number) => React.ReactNode; crack?: number; dark?: boolean}> = ({f, open, label, inner, crack = 0, dark = false}) => (
	<g>
		<Room w={1920} h={1080} floor={FLOOR} tone={dark ? '#2A3646' : '#BFD0D6'} dark={dark} />
		{!dark && <rect x={0} y={FLOOR - 10} width={1920} height={10} fill={P.grassDark} />}
		{NAMES.map((n, i) => {
			const cr = i === 2 ? crack : 0;
			return (
				<g key={n} transform={`translate(${GX(i)} ${FLOOR}) scale(0.75)`}>
					<g transform={cr > 0 ? `translate(${-cr * 30} ${cr * 20}) rotate(${-cr * 8})` : undefined} opacity={1 - clamp01(cr - 0.6) * 2.5}>
						<Garage w={460} h={330} open={open(i)} id={`st${i}`} roof={ROOFS[i]} dark={dark}>
							{inner ? inner(i) : <circle cx={0} cy={-120} r={46} fill={P.goldLight} opacity={0.75 + 0.2 * Math.sin(f / 9 + i)} />}
						</Garage>
					</g>
					{cr > 0 && (
						<g opacity={clamp01(cr * 2)}>
							<path d="M -20 -440 L 10 -330 L -30 -220 L 20 -120 L -10 0" fill="none" stroke={P.navy} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(cr * 1.5)} />
						</g>
					)}
					<g transform={`translate(0 ${-470}) scale(${label(i)})`}>
						<rect x={-150} y={-46} width={300} height={92} rx={12} fill={P.white} stroke={P.navy} strokeWidth={6} />
						<FText text={n} x={0} y={22} size={64} fill={P.navy} />
					</g>
				</g>
			);
		})}
	</g>
);

// --- hak ---------------------------------------------------------------------------------------------------
const HT = makeT(HL);
export const HAK_FRAMES = endOf(HL) + 30;
const HK = {
	n: NAMES.map((n) => HT(0, n)),
	l1: HT(1), gig: HT(1, 'giganci'), bil: HT(1, 'biliony'),
	l2: HT(2), gar: HT(2, 'garażu'),
	l3: HT(3), leg: HT(3, 'legenda'),
	l4: HT(4), lanc: HT(4, 'łańcuch'),
	l5: HT(5), wiert: HT(5, 'wiertarka'), czek: HT(5, 'czek'), gar5: HT(5, 'garaż'), nic: HT(5, 'nic'),
	l6: HT(6), mit: HT(6, 'mitem'),
};
const HHITS: Hit[] = [
	...HK.n.map((t) => ({t: t / 30, kind: 'punch' as const, amp: 0.3})),
	{t: HK.bil / 30, kind: 'punch', amp: 0.6},
	{t: HK.leg / 30, kind: 'both', amp: 0.5},
	{t: HK.lanc / 30, kind: 'punch', amp: 0.4},
	{t: HK.wiert / 30, kind: 'punch', amp: 0.4},
	{t: HK.czek / 30, kind: 'punch', amp: 0.4},
	{t: HK.gar5 / 30, kind: 'punch', amp: 0.4},
	{t: HK.mit / 30, kind: 'both', amp: 0.9},
];
export const GarHak: React.FC = () => (
	<Stage
		lines={HL}
		vo="ga0_vo.wav"
		keys={[
			{f: 0, x: 960, y: 470, z: 1.02},
			{f: HK.l1 - 6, x: 960, y: 470, z: 1.06},
			{f: HK.bil + 20, x: 960, y: 330, z: 0.96},
			{f: HK.l2 + 10, x: 960, y: 470, z: 1.02},
			{f: HK.leg + 10, x: 960, y: 420, z: 1.08},
			{f: HK.lanc + 30, x: 960, y: 480, z: 1.12},
			{f: HK.l6 - 6, x: 960, y: 470, z: 1.04},
			{f: HK.mit, x: GX(2), y: 520, z: 1.5, e: 'in'},
			{f: HAK_FRAMES, x: GX(2), y: 540, z: 1.6},
		]}
		hits={HHITS}
	>
		{(f) => {
			const tower = ip(f, HK.gig - 6, HK.bil + 20, 0, 1, EOUT) * (1 - ip(f, HK.l2 - 4, HK.l2 + 10, 0, 1, EIN));
			const chain = ip(f, HK.lanc - 10, HK.lanc + 30, 0, 1, EIO);
			const legend = ip(f, HK.leg - 6, HK.leg + 6, -300, 0, EBACK);
			const ins = [
				[HK.wiert, 0],
				[HK.czek, 1],
				[HK.gar5, 2],
			] as const;
			return (
				<g>
					<Street f={f} open={(i) => ip(f, HK.gar + i * 3, HK.gar + 20 + i * 3, 0, 1, EIO)} label={(i) => pk(f, HK.n[i] - 2)} crack={ip(f, HK.mit - 4, HK.mit + 30, 0, 1.3, EIO)} />
					{/* wieża monet „biliony” */}
					{tower > 0 &&
						Array.from({length: 40}).map((_, k) => {
							const show = clamp01(tower * 40 - k);
							if (show <= 0) return null;
							return (
								<G key={k} x={960 + Math.sin(k * 1.7) * 6} y={FLOOR - 40 - k * 22 - (1 - show) * 60} s={1}>
									<Coin r={46} />
								</G>
							);
						})}
					{tower > 0.3 && <FText text="biliony $" x={1420} y={260} size={90} fill={P.goldDark} stroke={P.bg} sw={12} opacity={prog(f, HK.bil, 8) * tower} />}
					<G x={960} y={130 + legend} s={f >= HK.leg - 6 ? 1 : 0} r={swing(f, HK.leg + 4, 4)}>
						<line x1={-160} y1={-160} x2={-120} y2={-40} stroke={P.navy} strokeWidth={4} />
						<line x1={160} y1={-160} x2={120} y2={-40} stroke={P.navy} strokeWidth={4} />
						<Sign text="LEGENDA" w={420} fill={P.gold} />
					</G>
					{chain > 0 && <Chain x0={GX(0) - 40} y0={FLOOR - 70} x1={GX(4) + 40} y1={FLOOR - 70} sag={40} p={chain} link={24} />}
					{ins.map(([at, k]) => {
						const a = live(f, at - 4, (k < 2 ? ins[k + 1][0] : HK.l6) - 2, 6);
						if (a <= 0) return null;
						const x = 420 + k * 540;
						return (
							<G key={k} x={x} y={250} s={a * 0.85}>
								<rect x={-220} y={-200} width={440} height={330} rx={18} fill={P.white} stroke={P.navy} strokeWidth={7} />
								{k === 0 && (
									<G y={90} s={0.9}>
										<DrillPress spin={f} />
									</G>
								)}
								{k === 1 && (
									<G y={-30} s={0.85}>
										<Check amount="100 000 $" to="???" w={420} write={1} />
									</G>
								)}
								{k === 2 && (
									<G y={100} s={0.48}>
										<Garage w={460} h={330} open={1} id="insg" roof="#7A5A3E">
											<path d="M -120 -230 L -40 -150 M -120 -230 L -60 -250" stroke={P.bg} strokeWidth={3} opacity={0.6} />
										</Garage>
									</G>
								)}
							</G>
						);
					})}
				</g>
			);
		}}
	</Stage>
);

// --- finał + ekran końcowy ---------------------------------------------------------------------------------
const FT = makeT(FL6);
const FK = {
	wzor: FT(0, 'wzór'), l1: FT(1), nie: FT(1, 'nie'), l2: FT(2), klient: FT(2, 'klient'), inw: FT(2, 'inwestor'),
	d: [FT(3), FT(4), FT(5), FT(6), FT(7)],
	l8: FT(8), opow: FT(8, 'opowieść'), l9: FT(9), uwierzy: FT(9, 'uwierzy'),
	l10: FT(10), l11: FT(11), l12: FT(12), amber: FT(12, 'Amber'),
};
export const FINAL_FRAMES = Math.max(endOf(FL6) + 30, FK.l12 + 600);
export const FINAL_ENDSCREEN_FROM = FK.l12;
const FHITS: Hit[] = [
	{t: FK.wzor / 30, kind: 'punch', amp: 0.4},
	{t: FK.klient / 30, kind: 'punch', amp: 0.4},
	{t: FK.inw / 30, kind: 'punch', amp: 0.4},
	...FK.d.map((t) => ({t: t / 30, kind: 'punch' as const, amp: 0.35})),
	{t: FK.uwierzy / 30, kind: 'both', amp: 0.6},
];
const Faith: React.FC<{i: number; f: number}> = ({i, f}) => {
	if (i === 0)
		return (
			<g>
				<rect x={-70} y={-90} width={140} height={180} rx={8} fill={P.white} stroke={P.navy} strokeWidth={5} />
				<FText text="UMOWA" x={0} y={-40} size={30} fill={P.navy} />
				<path d="M -50 50 q 15 -24 30 0 t 30 0" fill="none" stroke={P.navy} strokeWidth={4} />
			</g>
		);
	if (i === 1)
		return (
			<g>
				{Array.from({length: 8}).map((_, k) => (
					<g key={k} transform={`translate(${((k % 4) - 1.5) * 60} ${-Math.floor(k / 4) * 50}) scale(0.18)`}>
						<ToneGen f={f} knob={0.5} on={1} />
					</g>
				))}
			</g>
		);
	if (i === 2)
		return (
			<g>
				<rect x={-110} y={-60} width={220} height={110} rx={8} fill={P.white} stroke={P.navy} strokeWidth={5} />
				<FText text="50 szt." x={0} y={12} size={46} fill={P.navy} />
			</g>
		);
	if (i === 3)
		return (
			<g>
				<G x={-60} y={0} s={1.2}>
					<Envelope w={100} />
				</G>
				<G x={70} y={50}>
					<Book w={70} color={P.blue} />
				</G>
			</g>
		);
	return <Check amount="100 000 $" to="Google Inc." w={300} write={1} />;
};
export const GarFinal: React.FC = () => (
	<Stage
		lines={FL6}
		vo="ga6_vo.wav"
		keys={[
			{f: 0, x: 960, y: 470, z: 1.1},
			{f: FK.l1 + 10, x: 960, y: 470, z: 1.02},
			{f: FK.l2 + 20, x: 960, y: 420, z: 1.06},
			{f: FK.d[0] + 10, x: 800, y: 470, z: 1.2},
			{f: FK.d[4] + 40, x: 1120, y: 470, z: 1.2},
			{f: FK.l8 + 10, x: 960, y: 470, z: 1.02},
			{f: FK.uwierzy + 20, x: 960, y: 440, z: 1.08},
			{f: FK.l12, x: 960, y: 470, z: 1},
			{f: FINAL_FRAMES, x: 960, y: 470, z: 1},
		]}
		hits={FHITS}
	>
		{(f) => {
			const close = (i: number) => ip(f, FK.nie + i * 5, FK.nie + 18 + i * 5, 0, 1, EIO);
			const glow = ip(f, FK.uwierzy - 4, FK.uwierzy + 20, 0, 1, EIO);
			const end = ip(f, FK.l12, FK.l12 + 40, 0, 1, EIO);
			return (
				<g>
					<Street f={f} open={(i) => 1 - close(i)} label={() => 1} dark={end > 0.5} />
					<Chain x0={GX(0) - 40} y0={FLOOR - 70} x1={GX(4) + 40} y1={FLOOR - 70} sag={40} p={1} link={24} glow={glow} />
					{FK.d.map((at, i) => {
						const s = pk(f, at - 2) * (1 - end);
						return s > 0 ? (
							<G key={i} x={GX(i)} y={FLOOR - 490} s={s * 0.9}>
								<circle r={120} fill={P.goldLight} opacity={0.45} />
								<Faith i={i} f={f} />
							</G>
						) : null;
					})}
					<G x={960} y={130} s={(1 - prog(f, FK.opow + 10, 14)) * pk(f, FK.l8 - 4)}>
						<Sign text="LEGENDA" w={420} fill={P.gold} />
					</G>
					{f >= FK.l10 &&
						NAMES.map((_, i) => (
							<G key={i} x={GX(i)} y={FLOOR - 110} s={live(f, FK.l10 + i * 4, FK.l12, 6) * (1 + 0.15 * Math.max(0, Math.sin((f - FK.l10) / 4 - i)))}>
								<circle r={48} fill={P.gold} stroke={P.navy} strokeWidth={6} />
								<FText text={`${i + 1}`} x={0} y={22} size={62} fill={P.navy} />
							</G>
						))}
					{/* ekran końcowy: ciemna ulica, okna, wolny środek na elementy YouTube */}
					{end > 0 &&
						Array.from({length: 26}).map((_, k) => (
							<circle key={k} cx={hsh(k) * 1920} cy={40 + hsh(k + 5) * 380} r={2 + hsh(k + 2) * 3} fill={P.bg} opacity={end * (0.3 + 0.4 * Math.abs(Math.sin(f / 30 + k)))} />
						))}
				</g>
			);
		}}
	</Stage>
);
