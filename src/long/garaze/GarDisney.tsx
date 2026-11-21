// Historia 1: Disney, 1923 (GarDisney = film z planszą, GarDisneyS = short 1).
// Pokoje: garaż z metką 1 $ → mapa (pociąg Kansas City → Los Angeles, „BANKRUT”) → bilet i walizka z Alicją →
// dom wuja i garaż (rachunek) → pożyczka 500 $ → list z Nowego Jorku, umowa, kalendarz 16.10.1923 →
// ulica: przeprowadzka do biura (10 $), garaż się zamyka → spłata 528,66 $ → most: „Fantazja” i łańcuch.
import React from 'react';
import {LINES} from './ga1.gen';
import {
	Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, Coin, FText, clamp01, prog, Room, Plate, Envelope, LAY, kk, FloorDeco, type Lay,
	LOOK, Garage, Chain, Sign, Receipt, Train, House, Tower, Desk, FilmCam, Reel, Suitcase, YearFlip, Calendar, UsMap, Pin, Route, Stamp, Tag, Banknote,
	CARD, GarageCard, CutShort, keepFrom, keepLen, ShortWithCta,
} from './gkit';
import {US_CITIES} from './geo.gen';

const T = makeT(LINES);
const END = endOf(LINES) + 30;
export const D_FRAMES = CARD + END;
const KEEP = keepFrom(LINES, [14], 20, END);
const SHORT = keepLen(KEEP);
export const DS_FRAMES = SHORT + 0; // + CTA w ShortWithCta
export const DS_TOTAL = (cta: number) => SHORT + cta;

const K = {
	tyg: T(0, 'tygodniowo'), zacz: T(0, 'zaczęło'), anim: T(0, 'animacji'), garazu: T(0, 'garażu'),
	l1: T(1), y1923: T(1, '1923'),
	l2: T(2), przyj: T(2, 'przyjeżdża'), walt: T(2, 'Walt'),
	l3: T(3), kc: T(3, 'Kansas'), bankrut: T(3, 'zbankrutowało'),
	l4: T(4), bilet: T(4, 'bilet'), kamera: T(4, 'kamerę'),
	l5: T(5), walizce: T(5, 'walizce'), film: T(5, 'film'), alicja: T(5, 'Alicja'), swiata: T(5, 'świata'),
	l6: T(6), wuja: T(6, 'wuja'), king: T(6, 'Kingswell'),
	l7: T(7), d5: T(7, '5'),
	l8: T(8), prac: T(8, 'pracownię'), garazu8: T(8, 'garażu'),
	l9: T(9), l10: T(10), dolar: T(10, 'dolar'),
	l11: T(11), roy: T(11, 'Roy'), d500: T(11, '500'),
	l12: T(12), l13: T(13), pazdz: T(13, 'październiku'), winkler: T(13, 'Margaret'), zamawia: T(13, 'zamawia'), alicji: T(13, 'Alicji'),
	l14: T(14), aktorka: T(14, 'aktorka'),
	l15: T(15), d16: T(15, '16'), d1923b: T(15, '1923'),
	l16: T(16), wynajm: T(16, 'wynajmują'), pokoj: T(16, 'pokój'),
	l17: T(17), d10: T(17, '10'),
	l18: T(18), mies2: T(18, '2'),
	l19: T(19), oddali: T(19, 'oddali'), odsetk: T(19, 'odsetkami'), d528: T(19, '528'),
	l20: T(20), fant: T(20, '„Fantazję”'),
	l21: T(21), dzw: T(21, 'dźwiękowego'),
	l22: T(22), inz: T(22, 'inżynierów'), gar22: T(22, 'garażu'),
	end: END,
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [260, -250, 1.35], [180, -300, 1.3]),
	kk(v, K.zacz - 6, 0, [200, -200, 1.3], [150, -260, 1.26]),
	kk(v, K.anim + 4, 0, [0, -60, 1.04], [0, -80, 1.04]),
	kk(v, K.l1 - 12, 0, [0, -80, 1.1], [0, -100, 1.08]),
	kk(v, K.l1 + 14, 1, [0, 0, 1], [0, 0, 1]),
	kk(v, K.przyj + 30, 1, [-120, 20, 1.12], [-60, 40, 1.08]),
	kk(v, K.kc + 4, 1, [100, -20, 1.2], [60, -20, 1.14]),
	kk(v, K.bankrut + 20, 1, [160, -10, 1.32], [120, -10, 1.24]),
	kk(v, K.l4 - 12, 1, [100, 0, 1.2], [60, 0, 1.14]),
	kk(v, K.l4 + 14, 2, [-200, -40, 1.12], [-120, -40, 1.1]),
	kk(v, K.kamera + 20, 2, [-220, -60, 1.18], [-140, -60, 1.14]),
	kk(v, K.walizce + 6, 2, [150, -20, 1.08], [80, -40, 1.06]),
	kk(v, K.alicja + 10, 2, [120, -160, 1.16], [0, -220, 1.14]),
	kk(v, K.l6 - 12, 2, [80, -100, 1.08], [0, -150, 1.08]),
	kk(v, K.l6 + 14, 3, [-300, -40, 1.1], [-200, -40, 1.08]),
	kk(v, K.d5 + 10, 3, [-160, -120, 1.12], [-60, -200, 1.1]),
	kk(v, K.garazu8, 3, [320, -40, 1.12], [220, -60, 1.12]),
	kk(v, K.l10 + 10, 3, [180, -100, 1.08], [100, -120, 1.06]),
	kk(v, K.l11 - 12, 3, [0, -60, 1.04], [0, -60, 1.04]),
	kk(v, K.l11 + 14, 4, [0, 0, 1], [0, 0, 1]),
	kk(v, K.d500 + 16, 4, [80, -60, 1.14], [0, -100, 1.1]),
	kk(v, K.l12 - 12, 4, [60, -40, 1.1], [0, -60, 1.06]),
	kk(v, K.l12 + 14, 5, [0, 0, 1], [0, 0, 1]),
	kk(v, K.zamawia + 16, 5, [-60, -60, 1.14], [0, -120, 1.12]),
	kk(v, K.l14 + 10, 5, [-300, -60, 1.12], [0, 60, 1.1]),
	kk(v, K.l15 + 10, 5, [260, -100, 1.14], [0, -240, 1.12]),
	kk(v, K.l16 - 12, 5, [240, -80, 1.1], [0, -200, 1.08]),
	kk(v, K.l16 + 14, 6, [-200, -20, 1.08], [-120, -20, 1.06]),
	kk(v, K.d10 + 16, 6, [260, -100, 1.16], [140, -160, 1.12]),
	kk(v, K.mies2, 6, [-260, -40, 1.12], [-160, -40, 1.1]),
	kk(v, K.l19 - 12, 6, [-200, -30, 1.06], [-120, -30, 1.04]),
	kk(v, K.l19 + 14, 7, [0, 0, 1], [0, 0, 1]),
	kk(v, K.d528, 7, [0, -60, 1.14], [0, -80, 1.12]),
	kk(v, K.l20 - 12, 7, [0, -40, 1.06], [0, -40, 1.04]),
	kk(v, K.l20 + 14, 8, [-200, 0, 1.04], [-100, 0, 1.04]),
	kk(v, K.inz, 8, [100, -40, 1.1], [60, -40, 1.08]),
	kk(v, K.end, 8, [400, -40, 1.12], [300, -40, 1.1]),
];
const DIPS: [number, number, number][] = [K.l1, K.l4, K.l6, K.l11, K.l12, K.l16, K.l19, K.l20].map((b) => [b - 12, b + 14, 0.1]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.zacz), kind: 'punch', amp: 0.4},
	{t: s(K.y1923), kind: 'punch', amp: 0.5},
	{t: s(K.bankrut), kind: 'both', amp: 0.8},
	{t: s(K.kamera), kind: 'punch', amp: 0.5},
	{t: s(K.alicja), kind: 'punch', amp: 0.4},
	{t: s(K.d5), kind: 'punch', amp: 0.4},
	{t: s(K.dolar), kind: 'punch', amp: 0.4},
	{t: s(K.d500 + 20), kind: 'punch', amp: 0.6},
	{t: s(K.zamawia), kind: 'punch', amp: 0.5},
	{t: s(K.d16), kind: 'both', amp: 0.6},
	{t: s(K.d10), kind: 'punch', amp: 0.4},
	{t: s(K.mies2 + 10), kind: 'shake', amp: 0.3},
	{t: s(K.d528 + 24), kind: 'punch', amp: 0.6},
	{t: s(K.fant), kind: 'punch', amp: 0.4},
];

type R = React.FC<{f: number; l: Lay}>;
const wallTone = '#E8DCC6';

// 0: garaż wuja z metką „1 $ / tydzień”, kartki animacji wylatują
const R0: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const sc = v ? 1.6 : 1.45;
	const open = ip(f, K.zacz, K.zacz + 22, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone={wallTone} />
			<FloorDeco l={l} />
			<g transform={`translate(${cx} ${FL}) scale(${sc})`}>
				<Garage w={460} h={330} open={open} id="d0" label="WUJ ROBERT" labelSize={34}>
					<Desk w={250} lamp={open}>
						<rect x={-80} y={-14} width={150} height={14} fill={P.white} stroke={P.navy} strokeWidth={4} transform="rotate(-6)" />
					</Desk>
				</Garage>
				<g transform={`translate(205 -205)`}>
					<circle r={6} fill={P.navy} />
					<g transform="scale(0.62)">
						<Tag text="1 $/tydz." w={250} swing={swing(f, 6, 12) + Math.sin(f / 22) * 2} />
					</g>
				</g>
			</g>
			{Array.from({length: 10}).map((_, i) => {
				const a = K.anim + i * 3;
				if (f < a) return null;
				const p = clamp01((f - a) / 46);
				const side = i % 2 ? 1 : -1;
				const pt = arcPt(p, cx, FL - 160 * sc, cx + side * (W * 0.3 + hsh(i) * W * 0.12), (v ? 300 : 150) + hsh(i + 3) * (v ? 360 : 220), 120);
				return (
					<g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${side * p * (200 + i * 30)}) scale(${1 + p * 0.3})`} opacity={1 - clamp01((p - 0.85) * 6)}>
						<rect x={-40} y={-30} width={80} height={60} rx={4} fill={P.white} stroke={P.navy} strokeWidth={4} />
						<circle cx={-6 + i * 2} cy={-6} r={8} fill="none" stroke={P.navy} strokeWidth={3} />
						<line x1={-6 + i * 2} y1={2} x2={-6 + i * 2 + (i % 3) * 4} y2={18} stroke={P.navy} strokeWidth={3} />
					</g>
				);
			})}
		</g>
	);
};

// 1: mapa USA, pociąg z Kansas City do Los Angeles, „BANKRUT”
const R1: R = ({f, l}) => {
	const {v, W, H} = l;
	const cx = W / 2;
	const cy = v ? 600 : 450;
	const ms = v ? 0.95 : 1.02;
	const mx = v ? -190 : 0;
	const kc = US_CITIES.kc;
	const la = US_CITIES.la;
	const rp = ip(f, K.przyj, K.przyj + 70, 0, 1, EIO);
	const mid: [number, number] = [(kc[0] + la[0]) / 2, (kc[1] + la[1]) / 2 - 180];
	const bz = (t: number) => ({x: (1 - t) * (1 - t) * kc[0] + 2 * (1 - t) * t * mid[0] + t * t * la[0], y: (1 - t) * (1 - t) * kc[1] + 2 * (1 - t) * t * mid[1] + t * t * la[1]});
	const tr = bz(rp);
	return (
		<g>
			<rect x={0} y={0} width={W} height={H} fill="#C9D6DA" />
			<g transform={`translate(${cx} ${cy}) scale(${ms}) translate(${-mx} 0)`}>
				<UsMap />
				<path d={`M ${kc[0]} ${kc[1]} Q ${mid[0]} ${mid[1]} ${la[0]} ${la[1]}`} fill="none" stroke={P.red} strokeWidth={9} pathLength={100} strokeDasharray={`${100 * rp} 200`} strokeLinecap="round" />
				<G x={kc[0]} y={kc[1]}>
					<Pin label="Kansas City" s={pk(f, K.l2 - 10)} size={v ? 58 : 46} side="r" />
				</G>
				<G x={la[0]} y={la[1]}>
					<Pin label="Los Angeles" s={pk(f, K.przyj + 60)} size={v ? 58 : 46} side={v ? "t" : "r"} color={P.gold} />
				</G>
				{f >= K.przyj && rp < 1 && (
					<g transform={`translate(${tr.x} ${tr.y - 30}) scale(${-0.16} 0.16)`}>
						<Train f={f} />
					</g>
				)}
				{f >= K.bankrut - 4 && (
					<G x={kc[0] + 40} y={kc[1] - 150} s={(1 + 1.5 * (1 - ip(f, K.bankrut - 4, K.bankrut + 6, 0, 1, EOUT))) * 0.62} r={-10}>
						<Stamp lines={['BANKRUT']} w={420} color={P.red} />
					</G>
				)}
			</g>
			<G x={v ? 860 : W - 190} y={v ? 300 : 190} s={pk(f, K.y1923 - 2) * (v ? 1 : 1)}>
				<Calendar text="1923" w={v ? 220 : 230} top="sierpień" />
			</G>
		</g>
	);
};

// 2: bilet zamiast kamery, walizka z niedokończonym filmem o Alicji
const R2: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const wx = v ? 290 : cx - 380;
	const sx = v ? 770 : cx + 280;
	const morph = ip(f, K.kamera - 2, K.kamera + 8, 0, 1, EIO);
	const open = ip(f, K.walizce, K.walizce + 16, 0, 1, EBACK);
	const rise = ip(f, K.film, K.film + 24, 0, 1, EOUT);
	const draw = ip(f, K.alicja - 4, K.alicja + 30, 0, 1, EIO);
	const fx = v ? 720 : sx;
	const fy = v ? 470 : FL - 560;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#DCCFB8" />
			<FloorDeco l={l} />
			{/* peron: tablica */}
			<G x={v ? 540 : 360} y={v ? 230 : 120}>
				<Sign text="Los Angeles" w={v ? 420 : 380} fill={P.navy} color={P.bg} />
			</G>
			<G x={wx} y={FL} s={v ? 1.25 : 1.15}>
				<Adult look={LOOK.walt} mood={f > K.alicja ? 'smile' : 'neutral'} armR={f >= K.bilet - 10 ? 70 : 10} talk={false} seed={1} />
				<g transform="translate(120 -330)">
					<g opacity={1 - morph} transform={`scale(${(1 - morph) * 0.7}) rotate(${morph * 90})`}>
						<FilmCam f={f} w={180} />
					</g>
					<g opacity={morph} transform={`scale(${morph}) rotate(${(1 - morph) * -90 - 8})`}>
						<rect x={-80} y={-46} width={160} height={92} rx={10} fill={P.goldLight} stroke={P.navy} strokeWidth={5} />
						<FText text="BILET" x={0} y={-6} size={34} fill={P.navy} />
						<FText text="w jedną stronę" x={0} y={28} size={22} fill={P.slate} />
					</g>
				</g>
			</G>
			<G x={sx} y={FL} s={v ? 1.25 : 1.2}>
				<Suitcase w={260} open={open}>
					<g transform={`translate(0 ${-rise * 120})`} opacity={rise}>
						<Reel r={50} spin={f * 3} />
					</g>
				</Suitcase>
			</G>
			{/* kadr z rysunkiem: dziewczynka w rysunkowym świecie */}
			{draw > 0 && (
				<g transform={`translate(${fx} ${fy}) scale(${(v ? 0.95 : 1) * (0.6 + 0.4 * ip(f, K.alicja - 4, K.alicja + 10, 0, 1, EBACK))})`}>
					<rect x={-190} y={-130} width={380} height={260} rx={10} fill={P.white} stroke={P.navy} strokeWidth={7} />
					{[-150, 150].map((x) => (
						<g key={x}>
							{Array.from({length: 4}).map((_, k) => (
								<rect key={k} x={x - 8 + (x > 0 ? 0 : 0)} y={-112 + k * 64} width={16} height={28} rx={3} fill={P.navy} opacity={0.8} />
							))}
						</g>
					))}
					<g opacity={clamp01(draw * 2)}>
						{[[-80, 70], [-40, 86], [60, 76], [100, 88]].map(([x, y], i) => (
							<g key={i} transform={`translate(${x} ${y}) scale(${clamp01(draw * 3 - i * 0.3)})`}>
								<line x1={0} y1={0} x2={0} y2={-40} stroke={P.grassDark} strokeWidth={5} />
								{[0, 1, 2, 3, 4].map((p) => (
									<circle key={p} cx={Math.cos((p / 5) * Math.PI * 2) * 12} cy={-46 + Math.sin((p / 5) * Math.PI * 2) * 12} r={8} fill={i % 2 ? P.gold : P.red} stroke={P.navy} strokeWidth={2} />
								))}
								<circle cx={0} cy={-46} r={6} fill={P.white} />
							</g>
						))}
						<path d="M -130 -60 Q -90 -100 -50 -60 Q -10 -100 30 -60" fill="none" stroke={P.slate} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
					</g>
					<g transform={`translate(0 ${90}) scale(0.5)`} opacity={clamp01(draw * 3 - 0.6)}>
						<path d="M -50 -60 L 50 -60 L 70 0 L -70 0 Z" fill={P.red} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
						<rect x={-30} y={-130} width={60} height={70} rx={20} fill={P.red} stroke={P.navy} strokeWidth={6} />
						<circle cx={0} cy={-170} r={36} fill={P.skin} stroke={P.navy} strokeWidth={6} />
						<path d="M -38 -176 Q -36 -214 0 -212 Q 36 -214 38 -176 Q 30 -150 40 -130 L 26 -150 Q 20 -190 -20 -190 Q -24 -150 -40 -130 Q -30 -150 -38 -176 Z" fill="#E6C77A" stroke={P.navy} strokeWidth={5} />
					</g>
					<FText text="Alicja" x={0} y={-80} size={46} fill={P.navy} opacity={prog(f, K.alicja, 8)} />
				</g>
			)}
		</g>
	);
};

// 3: dom wuja przy Kingswell Avenue i garaż obok; rachunek 5 $ + 1 $
const R3: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const hx = v ? 300 : cx - 360;
	const gx = v ? 800 : cx + 420;
	const open = ip(f, K.prac, K.prac + 24, 0, 1, EIO);
	const nod = f > K.l9 && f < K.l9 + 30 ? Math.sin(((f - K.l9) / 30) * Math.PI * 2) * 6 : 0;
	const shown = (f >= K.d5 ? 1 : 0) + (f >= K.dolar ? 1 : 0) + (f >= K.dolar + 14 ? 1 : 0);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={hx} y={FL} s={v ? 0.95 : 1.15}>
				<House w={420} h={290} wall="#E4DBCB" roof="#7A5A3E" lit={1} />
			</G>
			<G x={v ? 110 : cx - 760} y={FL} s={v ? 0.85 : 1}>
				<rect x={-7} y={-330} width={14} height={330} fill={P.slate} stroke={P.navy} strokeWidth={4} />
				<g transform="translate(0 -320)">
					<Sign text="Kingswell Ave" w={260} fill="#4F6A7A" color={P.white} />
				</g>
			</G>
			<G x={hx + (v ? 150 : 210)} y={FL} s={v ? 0.95 : 1.05}>
				<g transform={`rotate(${nod} 0 -300)`}>
					<Adult look={LOOK.wuj} mood={f > K.l9 ? 'smile' : 'neutral'} talk={f > K.l9 && f < K.l9 + 30} seed={3} armL={10} armR={f > K.l9 && f < K.l10 + 20 ? 40 : 10} />
				</g>
			</G>
			<G x={gx} y={FL} s={v ? 0.9 : 1.1}>
				<Garage w={460} h={330} open={open} id="d3">
					<Desk w={250} lamp={open} />
				</Garage>
			</G>
			<G x={v ? 540 : cx} y={v ? 200 : 26} s={pk(f, K.d5 - 4) * (v ? 1.15 : 1)} r={swing(f, K.d5, 4)}>
				<Receipt items={['pokój: 5 $ / tydz.', 'garaż: +1 $ / tydz.']} shown={shown} total="6 $ / tydz." w={v ? 400 : 380} />
			</G>
		</g>
	);
};

// 4: pożyczka 500 $ od wuja
const R4: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const ux = v ? 230 : cx - 460;
	const bx = v ? 700 : cx + 300;
	const fly = ip(f, K.roy + 6, K.roy + 36, 0, 1, EIO);
	const p = arcPt(fly, ux + 120, FL - 330, bx - 60, FL - 330, 160);
	const cnt = Math.round(500 * ip(f, K.d500 - 6, K.d500 + 20, 0, 1, EOUT));
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone={wallTone} />
			<FloorDeco l={l} />
			<G x={ux} y={FL} s={v ? 1.05 : 1.1}>
				<Adult look={LOOK.wuj} mood="smile" armR={fly < 0.1 ? 60 : 12} seed={3} />
			</G>
			<G x={bx} y={FL} s={v ? 1.0 : 1.1}>
				<Adult look={LOOK.walt} mood={fly > 0.9 ? 'laugh' : 'smile'} armL={fly > 0.8 ? 60 : 10} seed={1} />
			</G>
			<G x={bx + (v ? 200 : 230)} y={FL} s={v ? 0.92 : 1.02}>
				<Adult look={LOOK.roy} mood="smile" seed={5} />
			</G>
			{f >= K.roy && (
				<G x={p.x} y={p.y} r={fly * 360} s={1.4}>
					<Envelope w={110} />
				</G>
			)}
			{Array.from({length: 5}).map((_, i) => {
				const a = K.d500 - 4 + i * 4;
				if (f < a) return null;
				return (
					<G key={i} x={(v ? 540 : cx) + (i - 2) * (v ? 120 : 150)} y={(v ? 520 : 330) - ip(f, a, a + 14, 120, 0, EBACK)} s={0.8} r={(i - 2) * 6}>
						<Banknote value="100" w={150} />
					</G>
				);
			})}
			<G x={v ? 540 : cx} y={v ? 300 : 150} s={pk(f, K.d500 - 6)}>
				<Plate text={`${cnt} $`} label="pożyczka od wuja" w={v ? 520 : 480} size={96} />
			</G>
		</g>
	);
};

// 5: list z Nowego Jorku → umowa na serię o Alicji; [film] kadr z aktorką; kalendarz 16 października 1923
const R5: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const nyx = v ? 540 : cx + 620;
	const nyy = v ? 470 : FL;
	const fly = ip(f, K.pazdz, K.pazdz + 34, 0, 1, EIO);
	const unf = ip(f, K.zamawia - 4, K.zamawia + 10, 0, 1, EBACK);
	const cX = v ? 540 : cx - 120;
	const cY = v ? 830 : FL - 330;
	const pp = arcPt(fly, nyx - 60, (v ? 380 : FL - 420), cX, cY, 220);
	const sign = ip(f, K.alicji, K.alicji + 20, 0, 1, EIO);
	const proj = live(f, K.l14 - 4, K.l15 + 6, 8);
	const cal = pk(f, K.d16 - 4);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			{/* Nowy Jork: wieżowce i dystrybutorka */}
			<G x={nyx} y={nyy} s={v ? 0.55 : 0.8} o={v ? 1 - cal : 1}>
				{[-260, -120, 20, 160].map((x, i) => (
					<G key={i} x={x} y={0}>
						<Tower w={120} h={400 + hsh(i + 2) * 260} fill={['#5C6B7A', '#4A5A6E', '#6E7D8A', '#33445A'][i]} lit={0.35} seed={i} />
					</G>
				))}
				<FText text="Nowy Jork" x={-50} y={v ? 70 : 60} size={56} fill={P.navy} />
			</G>
			<G x={v ? 840 : cx + 330} y={v ? 1120 : FL} s={v ? 0.82 : 1.05}>
				<Adult look={LOOK.winkler} phone={f > K.winkler - 10 && f < K.zamawia + 40} mood="smile" seed={7} />
			</G>
			{/* samolocik z listem → umowa */}
			{f >= K.pazdz && unf < 0.05 && (
				<G x={pp.x} y={pp.y} r={-10 + fly * 20} s={1.2}>
					<path d="M -60 0 L 60 -20 L -10 30 Z" fill={P.white} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
					<path d="M -60 0 L 60 -20 L -20 6 Z" fill={P.grey} stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />
				</G>
			)}
			{unf > 0 && (
				<G x={cX} y={cY} s={unf * (v ? 1.15 : 1)} r={(1 - unf) * -20}>
					<rect x={-170} y={-210} width={340} height={420} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="UMOWA" x={0} y={-140} size={56} fill={P.navy} />
					{[0, 1, 2, 3].map((i) => (
						<line key={i} x1={-120} x2={120} y1={-80 + i * 44} y2={-80 + i * 44} stroke={P.grey} strokeWidth={10} strokeLinecap="round" />
					))}
					<FText text="seria: Alicja" x={0} y={120} size={36} fill={P.goldDark} opacity={prog(f, K.alicji - 2, 8)} />
					<path d="M -110 170 q 26 -40 52 0 t 52 0 t 52 0" fill="none" stroke={P.navy} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
					<G x={150} y={-200} s={0.7}>
						<Reel r={50} spin={f * 4} />
					</G>
				</G>
			)}
			{/* [tylko film] projektor: kadr z aktorką wśród rysunkowych dekoracji */}
			{proj > 0 && (
				<g opacity={proj}>
					<path d={v ? `M 540 1060 L 160 560 L 920 560 Z` : `M ${cx - 120} ${FL - 160} L ${cx - 760} ${FL - 640} L ${cx - 760} ${FL - 160} Z`} fill={P.goldLight} opacity={0.35} />
					<G x={v ? 540 : cx - 560} y={v ? 440 : FL - 420} s={v ? 1.3 : 1.1}>
						<rect x={-180} y={-120} width={360} height={240} rx={8} fill={P.white} stroke={P.navy} strokeWidth={6} />
						<path d="M -150 60 Q -100 -40 -40 60 M 40 60 Q 100 -60 150 60" fill="none" stroke={P.slate} strokeWidth={5} />
						<circle cx={110} cy={-70} r={26} fill="none" stroke={P.slate} strokeWidth={5} />
						<g transform="translate(0 90) scale(0.45)">
							<path d="M -50 -60 L 50 -60 L 70 0 L -70 0 Z" fill={P.red} stroke={P.navy} strokeWidth={6} />
							<rect x={-30} y={-130} width={60} height={70} rx={20} fill={P.red} stroke={P.navy} strokeWidth={6} />
							<circle cx={0} cy={-170} r={36} fill={P.skin} stroke={P.navy} strokeWidth={6} />
						</g>
					</G>
				</g>
			)}
			{cal > 0 && (
				<G x={v ? 540 : cx + 560} y={v ? 360 : 300} s={cal * (v ? 1.1 : 1.15)}>
					<Calendar text="16 października" w={300} top="1923" />
					<ellipse cx={0} cy={50} rx={150} ry={64} fill="none" stroke={P.red} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ip(f, K.d16 + 6, K.d16 + 26, 0, 1, EIO)} />
				</G>
			)}
		</g>
	);
};

// 6: ulica: wózek z biurkiem jedzie do biura „Disney Brothers Studio” (10 $), garaż się zamyka (2 miesiące)
const R6: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const gx = v ? 250 : cx - 520;
	const ox = v ? 800 : cx + 440;
	const move = ip(f, K.wynajm, K.wynajm + 70, 0, 1, EIO);
	const close = ip(f, K.mies2 - 4, K.mies2 + 16, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<FloorDeco l={l} />
			<G x={gx} y={FL} s={v ? 0.82 : 1}>
				<Garage w={460} h={330} open={1 - close} id="d6">
					{move < 0.2 && <Desk w={250} lamp={1} />}
				</Garage>
			</G>
			<G x={ox} y={FL} s={v ? 0.85 : 1}>
				<rect x={-230} y={-460} width={460} height={460} fill="#D9C9AE" stroke={P.navy} strokeWidth={7} />
				<rect x={-200} y={-420} width={400} height={80} rx={8} fill={P.navy} />
				<FText text="Disney Brothers Studio" x={0} y={-366} size={34} fill={P.goldLight} />
				{[-120, 0, 120].map((x) => (
					<rect key={x} x={x - 44} y={-300} width={88} height={110} fill={f > K.wynajm + 70 ? P.goldLight : '#B9CBD3'} stroke={P.navy} strokeWidth={5} />
				))}
				<rect x={-50} y={-150} width={100} height={150} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
				<G x={170} y={-160} s={0.7}>
					<Tag text="10 $/mies." w={280} swing={swing(f, K.d10, 12)} />
				</G>
			</G>
			{move > 0 && move < 1 && (
				<G x={gx + 120 + (ox - gx - 260) * move} y={FL} s={v ? 0.7 : 0.85}>
					<rect x={-130} y={-60} width={260} height={30} rx={6} fill="#A87B4A" stroke={P.navy} strokeWidth={5} />
					{[-90, 90].map((x) => (
						<circle key={x} cx={x} cy={-18} r={18} fill={P.navy} />
					))}
					<g transform="translate(0 -60)">
						<Desk w={200} lamp={0} />
					</g>
				</G>
			)}
			<G x={v ? 540 : cx} y={v ? 260 : 170} s={pk(f, K.mies2 - 6) * (v ? 1.1 : 1)}>
				<YearFlip from="sierpień" to="październik" flip={ip(f, K.mies2 + 4, K.mies2 + 20, 0, 1, EIO)} w={240} top="1923" />
			</G>
		</g>
	);
};

// 7: spłata: 500 $ + odsetki = 528,66 $
const R7: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const back = ip(f, K.oddali + 6, K.oddali + 40, 0, 1, EIO);
	const sum = ip(f, K.d528 - 8, K.d528 + 26, 0, 1, EOUT);
	const val = (500 + 28.66 * clamp01(sum * 1.2)) * clamp01(sum * 3);
	const ux = v ? 270 : cx - 500;
	const bx = v ? 790 : cx + 480;
	const p = arcPt(back, bx - 100, FL - 330, ux + 100, FL - 330, 180);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone={wallTone} />
			<FloorDeco l={l} />
			<G x={ux} y={FL} s={v ? 1 : 1.1}>
				<Adult look={LOOK.wuj} mood={back > 0.9 ? 'laugh' : 'smile'} armL={back > 0.85 ? 60 : 10} seed={3} />
			</G>
			<G x={bx} y={FL} s={v ? 1 : 1.1}>
				<Adult look={LOOK.walt} mood="smile" armR={back < 0.2 && f > K.oddali ? 60 : 10} seed={1} />
			</G>
			{f >= K.oddali && back < 1 && (
				<G x={p.x} y={p.y} r={-back * 360} s={1.4}>
					<Envelope w={110} />
				</G>
			)}
			<G x={v ? 540 : cx} y={v ? 270 : 250} s={pk(f, K.oddali - 6) * (v ? 1.05 : 1)}>
				<Calendar text="1924" w={200} top="styczeń" />
			</G>
			{sum > 0 && (
				<G x={v ? 540 : cx} y={v ? 500 : 520} s={pk(f, K.d528 - 8)}>
					<Plate text={`${val.toFixed(2).replace('.', ',')} $`} label="500 $ + odsetki" w={v ? 600 : 560} size={90} />
				</G>
			)}
		</g>
	);
};

// 8: [most] kilkanaście lat później: „Fantazja”, nuty, łańcuch do następnego garażu
const R8: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const yr = Math.round(1924 + 15 * ip(f, K.l20, K.l20 + 50, 0, 1, EIO));
	const strip = ip(f, K.fant - 6, K.fant + 20, 0, 1, EOUT);
	const chain = ip(f, K.inz - 10, K.end, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#DCCFB8" />
			<FloorDeco l={l} />
			<G x={v ? 260 : 300} y={v ? 300 : 210} s={pk(f, K.l20 - 4)}>
				<Calendar text={`${yr}`} w={210} />
			</G>
			{/* studio rośnie z garażu w duży budynek */}
			<G x={v ? 800 : W - 330} y={FL} s={(v ? 0.7 : 0.85) * (0.45 + 0.55 * ip(f, K.l20 + 10, K.l20 + 70, 0, 1, EOUT))}>
				<rect x={-260} y={-520} width={520} height={520} fill="#D9C9AE" stroke={P.navy} strokeWidth={7} />
				{Array.from({length: 12}).map((_, i) => (
					<rect key={i} x={-220 + (i % 4) * 115} y={-480 + Math.floor(i / 4) * 130} width={75} height={80} fill={hsh(i) > 0.4 ? P.goldLight : '#B9CBD3'} stroke={P.navy} strokeWidth={4} />
				))}
				<rect x={-60} y={-110} width={120} height={110} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
				<rect x={-230} y={-600} width={460} height={70} rx={10} fill={P.navy} />
				<FText text="STUDIO" x={0} y={-550} size={48} fill={P.goldLight} />
			</G>
			{strip > 0 && (
				<g transform={`translate(${cx} ${v ? 640 : FL - 360}) scale(${v ? 1.1 : 1.2})`}>
					<rect x={-360 * strip} y={-80} width={720 * strip} height={160} fill={P.navy} />
					{Array.from({length: 12}).map((_, i) => {
						const x = -330 + i * 60;
						return Math.abs(x) < 360 * strip ? (
							<g key={i}>
								<rect x={x} y={-72} width={24} height={16} rx={3} fill={P.bg} />
								<rect x={x} y={56} width={24} height={16} rx={3} fill={P.bg} />
							</g>
						) : null;
					})}
					<FText text="„Fantazja”" x={0} y={22} size={70} fill={P.goldLight} opacity={prog(f, K.fant, 8)} />
				</g>
			)}
			{Array.from({length: 6}).map((_, i) => {
				const a = K.dzw + i * 6;
				if (f < a) return null;
				const p = clamp01((f - a) / 60);
				return (
					<g key={i} transform={`translate(${cx - 300 + i * 120 + Math.sin(p * 6 + i) * 20} ${(v ? 520 : FL - 480) - p * 220})`} opacity={1 - p}>
						<circle cx={0} cy={0} r={16} fill={P.navy} />
						<line x1={14} y1={0} x2={14} y2={-60} stroke={P.navy} strokeWidth={6} />
						<path d="M 14 -60 q 20 10 24 28" fill="none" stroke={P.navy} strokeWidth={6} />
					</g>
				);
			})}
			{chain > 0 && <Chain x0={cx - 60} y0={v ? 760 : FL - 250} x1={W + 40} y1={v ? 820 : FL - 300} sag={70} p={chain} link={30} />}
		</g>
	);
};

const ROOMS = [R0, R1, R2, R3, R4, R5, R6, R7, R8];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<Stage v={v} lines={LINES} vo="ga1_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`gd1c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((Rm, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#gd1c${v ? 'v' : 'h'})`}>
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

export const GarDisney: React.FC = () => (
	<WithCard cardFrames={CARD} card={<GarageCard num={1} name="Disney" year="1923" />}>
		<Scene />
	</WithCard>
);
export const GarDisneyS: React.FC = () => (
	<ShortWithCta sceneFrames={SHORT}>
		<CutShort keep={KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
export const DS_SCENE = SHORT;
