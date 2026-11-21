// Historia 4: Amazon, 1994 (GarAmazon = film z planszą, GarAmazonS = short 4).
// Pokoje: szyld AMAZON tasuje się w CADABRA → Wall Street 1994: Bezos, pomysł „książki przez internet” →
// lustro i waga żalu → mapa: Nowy Jork → Seattle → rejestracja Cadabry, prawnik słyszy „cadaver”, litery → AMAZON →
// garaż w Bellevue: drzwi wyskakują i stają się biurkiem → rodzice: ok. 250 tys. $ → start 16.07.1995, pierwsza
// książka z zębatkami → 50 stanów i 45 krajów, 20 000 $ tygodniowo → [film] wielka skrzynka na listy →
// [most] śniadanie z doktorantami, wyszukiwarka, Bezos chce zainwestować.
import React from 'react';
import {LINES} from './ga4.gen';
import {
	Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, FText, clamp01, prog, Room, Plate, Envelope, Gear, LAY, kk, FloorDeco, type Lay,
	LOOK, Garage, Chain, Sign, House, Tower, Desk, Crt, Box, Book, Mailbox, Scale, Calendar, Stamp, UsMap, WorldMap, Pin, Route, Check,
	CARD, GarageCard, CutShort, keepFrom, keepLen, ShortWithCta,
} from './gkit';
import {US_CITIES, US_DOTS, WORLD_DOTS} from './geo.gen';

const T = makeT(LINES);
const END = endOf(LINES) + 30;
export const M_FRAMES = CARD + END;
const KEEP = keepFrom(LINES, [], 25, END);
export const MS_SCENE = keepLen(KEEP);

const K = {
	l1: T(1), cad1: T(1, 'Cadabra'),
	l2: T(2), y94: T(2, '1994'),
	l3: T(3), jeff: T(3, 'Jeff'), wall: T(3, 'Wall'),
	l4: T(4), pomysl: T(4, 'pomysł'), ksiazki: T(4, 'książki'), net: T(4, 'internet'),
	l5: T(5), staro: T(5, 'starość'),
	l6: T(6), zal: T(6, 'żałował'),
	l7: T(7), przegr: T(7, 'przegrał'),
	l8: T(8), nie8: T(8, 'nie'),
	l9: T(9), odch: T(9, 'Odchodzi'), sea: T(9, 'Seattle'),
	l10: T(10), d5: T(10, '5'), cad10: T(10, 'Cadabra'),
	l11: T(11), l12: T(12), prawnik: T(12, 'prawnik'), cadaver: T(12, '„cadaver”'), zwloki: T(12, 'zwłoki'),
	l13: T(13), amazon13: T(13, 'Amazon'),
	l14: T(14), l15: T(15), bell: T(15, 'Bellevue'),
	l16: T(16), l17: T(17), drzwi: T(17, 'drzwi'),
	l18: T(18), l19: T(19), rodz: T(19, 'Rodzice'), d250: T(19, '250'),
	l20: T(20), d16: T(20, '16'), rusza: T(20, 'rusza'),
	l21: T(21), ksiazka: T(21, 'książka'), mysl: T(21, 'myślenia'),
	l22: T(22), wszystko: T(22, 'wszystko'),
	l23: T(23), d50: T(23, '50'), d45: T(23, '45'),
	l24: T(24), d20: T(24, '20'),
	l25: T(25), skrz: T(25, 'skrzynka'),
	l26: T(26), katal: T(26, 'katalogi'),
	l27: T(27), sniad: T(27, 'śniadanie'),
	l28: T(28), wysz: T(28, 'wyszukiwarkę'),
	l29: T(29), inwest: T(29, 'zainwestować'),
	end: END,
};

const keysFor = (v: boolean): CK[] => [
	kk(v, 0, 0, [0, -160, 1.2], [0, -200, 1.2]),
	kk(v, K.cad1 + 20, 0, [0, -120, 1.14], [0, -160, 1.14]),
	kk(v, K.l2 - 12, 0, [0, -60, 1.06], [0, -80, 1.06]),
	kk(v, K.l2 + 14, 1, [0, -20, 1.02], [0, -20, 1.02]),
	kk(v, K.wall + 10, 1, [-200, -60, 1.1], [-100, -60, 1.08]),
	kk(v, K.net + 10, 1, [100, -80, 1.12], [60, -100, 1.1]),
	kk(v, K.l5 - 12, 1, [60, -40, 1.04], [40, -40, 1.04]),
	kk(v, K.l5 + 14, 2, [-120, -40, 1.08], [-60, -40, 1.06]),
	kk(v, K.zal, 2, [100, -60, 1.06], [0, -100, 1.06]),
	kk(v, K.nie8 + 10, 2, [180, -80, 1.14], [0, -180, 1.14]),
	kk(v, K.l9 - 12, 2, [120, -40, 1.06], [0, -60, 1.06]),
	kk(v, K.l9 + 14, 3, [0, 0, 1], [0, 0, 1]),
	kk(v, K.sea + 20, 3, [-200, -120, 1.25], [-120, -100, 1.2]),
	kk(v, K.l10 - 12, 3, [-160, -100, 1.15], [-100, -80, 1.12]),
	kk(v, K.l10 + 14, 4, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.zwloki + 10, 4, [-120, -80, 1.14], [0, -120, 1.12]),
	kk(v, K.amazon13 + 20, 4, [0, -100, 1.1], [0, -140, 1.08]),
	kk(v, K.l14 - 12, 4, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l14 + 14, 5, [0, -40, 1.06], [0, -60, 1.06]),
	kk(v, K.drzwi + 20, 5, [0, -80, 1.16], [0, -120, 1.14]),
	kk(v, K.l19 - 12, 5, [0, -40, 1.06], [0, -40, 1.06]),
	kk(v, K.l19 + 14, 6, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.d250 + 20, 6, [0, -120, 1.14], [0, -160, 1.12]),
	kk(v, K.l20 - 12, 6, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l20 + 14, 7, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.mysl, 7, [0, -100, 1.16], [0, -140, 1.14]),
	kk(v, K.l23 - 12, 7, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.l23 + 14, 8, [0, 0, 1], [0, 0, 1]),
	kk(v, K.d20 + 20, 8, [0, -40, 1.06], [0, -40, 1.06]),
	kk(v, K.l25 - 12, 8, [0, -20, 1.04], [0, -20, 1.04]),
	kk(v, K.l25 + 14, 9, [0, -60, 1.06], [0, -80, 1.06]),
	kk(v, K.katal + 20, 9, [120, -140, 1.16], [60, -200, 1.16]),
	kk(v, K.l27 - 12, 9, [60, -60, 1.06], [0, -60, 1.06]),
	kk(v, K.l27 + 14, 10, [0, -40, 1.04], [0, -40, 1.04]),
	kk(v, K.wysz + 10, 10, [0, -120, 1.16], [0, -160, 1.14]),
	kk(v, K.end, 10, [300, -60, 1.1], [200, -60, 1.1]),
];
const DIPS: [number, number, number][] = [K.l2, K.l5, K.l9, K.l10, K.l14, K.l19, K.l20, K.l23, K.l25, K.l27].map((b) => [b - 12, b + 14, 0.1]);
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.cad1), kind: 'punch', amp: 0.6},
	{t: s(K.y94), kind: 'punch', amp: 0.4},
	{t: s(K.net), kind: 'punch', amp: 0.4},
	{t: s(K.nie8 + 10), kind: 'both', amp: 0.6},
	{t: s(K.d5), kind: 'punch', amp: 0.5},
	{t: s(K.cadaver), kind: 'shake', amp: 0.5},
	{t: s(K.amazon13), kind: 'punch', amp: 0.6},
	{t: s(K.drzwi + 8), kind: 'both', amp: 0.6},
	{t: s(K.d250 + 16), kind: 'punch', amp: 0.6},
	{t: s(K.rusza), kind: 'punch', amp: 0.5},
	{t: s(K.d50), kind: 'punch', amp: 0.4},
	{t: s(K.d45), kind: 'punch', amp: 0.4},
	{t: s(K.d20 + 16), kind: 'punch', amp: 0.6},
	{t: s(K.wysz), kind: 'punch', amp: 0.4},
];

type R = React.FC<{f: number; l: Lay}>;
// Szyld, którego litery tasują się z jednego słowa w drugie (p 0..1).
const Shuffle: React.FC<{a: string; b: string; p: number; size: number; fill?: string; sp?: number}> = ({a, b, p, size, fill = P.navy, sp = 0.62}) => {
	const n = Math.max(a.length, b.length);
	const w = size * sp;
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const q = clamp01(p * 1.6 - (i / n) * 0.6);
				const ch = q < 0.5 ? a[i] ?? '' : b[i] ?? '';
				const sy = Math.abs(Math.cos(q * Math.PI));
				return (
					<g key={i} transform={`translate(${(i - (n - 1) / 2) * w} 0) scale(1 ${Math.max(0.05, sy)})`}>
						<FText text={ch} x={0} y={size * 0.36} size={size} fill={fill} />
					</g>
				);
			})}
		</g>
	);
};

// 0: szyld AMAZON → CADABRA na garażu
const R0: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const p = ip(f, K.cad1 - 6, K.cad1 + 16, 0, 1, EIO);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={cx} y={FL} s={v ? 1.6 : 1.4}>
				<Garage w={460} h={330} open={0} id="m0" roof="#4F6A7A" />
				<g transform="translate(0 -440)">
					<rect x={-230} y={-50} width={460} height={100} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<Shuffle a="AMAZON" b="CADABRA" p={p} size={64} fill={p > 0.5 ? P.red : P.navy} />
				</g>
			</G>
		</g>
	);
};

// 1: Wall Street 1994; Bezos przy biurku, pomysł: książki przez internet
const R1: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const bulb = pk(f, K.pomysl - 2);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<G key={i} x={(v ? 60 : 120) + i * (v ? 190 : 340)} y={FL} s={v ? 0.8 : 1}>
					<Tower w={180} h={520 + hsh(i + 5) * 260} fill={['#5C6B7A', '#4A5A6E', '#6E7D8A', '#33445A'][i % 4]} lit={0.4} seed={i + 20} />
				</G>
			))}
			<rect x={0} y={FL - 420} width={W} height={420} fill="#E8DCC6" opacity={0.92} />
			<FloorDeco l={l} />
			<G x={v ? 540 : 320} y={v ? 300 : 120} s={pk(f, K.wall - 2)}>
				<Sign text="Wall Street" w={v ? 420 : 380} fill="#4F6A7A" color={P.white} />
			</G>
			<G x={v ? 260 : 280} y={v ? 460 : 300} s={pk(f, K.y94 - 2)}>
				<Calendar text="1994" w={200} />
			</G>
			<G x={v ? 400 : cx - 220} y={FL} s={v ? 1.1 : 1.15}>
				<Desk w={420} lamp={0.6}>
					<g transform="translate(-40 0) scale(0.8)">
						<Crt
							screen={
								<g>
									{[0, 1, 2].map((i) => {
										const a = K.ksiazki + i * 10;
										if (f < a) return null;
										const q = clamp01((f - a) / 30);
										return (
											<g key={i} transform={`translate(${-60 + q * 60} ${-100 + i * 10}) scale(${0.25 * (1 - q * 0.5)})`} opacity={1 - q * 0.3}>
												<Book w={100} color={[P.red, P.blue, P.gold][i]} />
											</g>
										);
									})}
									<FText text="www" x={0} y={-60} size={28} fill={P.goldLight} opacity={prog(f, K.net, 8)} />
								</g>
							}
						/>
					</g>
				</Desk>
			</G>
			<G x={v ? 820 : cx + 260} y={FL} s={(v ? 1.0 : 1.1) * pk(f, K.jeff - 6)}>
				<Adult look={LOOK.bezos} mood={f > K.pomysl ? 'smile' : 'neutral'} armL={30} seed={12} />
				<G y={-620} s={bulb}>
					<circle r={50} fill={P.goldLight} stroke={P.navy} strokeWidth={6} />
					<rect x={-20} y={46} width={40} height={30} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={5} />
				</G>
			</G>
		</g>
	);
};

// 2: lustro (siebie na starość) i waga żalu
const R2: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const old = ip(f, K.staro - 4, K.staro + 16, 0, 1, EIO);
	const tilt = f < K.przegr ? 0 : f < K.nie8 ? -0.35 : ip(f, K.nie8, K.nie8 + 16, -0.35, 1, EBACK);
	const mx = v ? 300 : cx - 520;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={mx} y={FL} s={v ? 0.85 : 1}>
				<rect x={-130} y={-560} width={260} height={480} rx={120} fill="#B9CBD3" stroke="#7A5A3E" strokeWidth={16} />
				<g transform="translate(0 -110) scale(0.85)" opacity={0.75}>
					<Adult look={{...LOOK.bezos, hair: old > 0.5 ? '#C9C2B5' : LOOK.bezos.hair, glasses: old > 0.5}} mood="neutral" seed={12} />
				</g>
				<rect x={-60} y={-80} width={120} height={80} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
				<FText text="na starość" x={0} y={-590} size={44} fill={P.navy} opacity={old} />
			</G>
			{f >= K.zal - 6 && (
				<G x={v ? 640 : cx + 260} y={v ? 1080 : FL} s={(v ? 1.05 : 1.1) * pk(f, K.zal - 6)}>
					<Scale
						w={500}
						tilt={tilt}
						left={
							f >= K.przegr ? (
								<G y={-40} s={pk(f, K.przegr)}>
									<rect x={-90} y={-36} width={180} height={50} rx={8} fill={P.white} stroke={P.navy} strokeWidth={4} />
									<FText text="spróbował" x={0} y={-2} size={28} fill={P.navy} />
								</G>
							) : null
						}
						right={
							f >= K.nie8 ? (
								<G y={-60} s={pk(f, K.nie8)}>
									<rect x={-100} y={-70} width={200} height={84} rx={8} fill="#5C6B7A" stroke={P.navy} strokeWidth={5} />
									<FText text="nie spróbował" x={0} y={-16} size={28} fill={P.white} />
								</G>
							) : null
						}
					/>
				</G>
			)}
		</g>
	);
};

// 3: mapa: Nowy Jork → Seattle (Bellevue)
const R3: R = ({f, l}) => {
	const {v, W, H} = l;
	const cx = W / 2;
	const ms = v ? 0.68 : 1.02;
	const rp = ip(f, K.odch, K.sea + 30, 0, 1, EIO);
	return (
		<g>
			<rect x={0} y={0} width={W} height={H} fill="#C9D6DA" />
			<g transform={`translate(${cx} ${v ? 620 : 450}) scale(${ms})`}>
				<UsMap />
				<Route a={US_CITIES.ny} b={US_CITIES.sea} p={rp} h={180} w={9} />
				<G x={US_CITIES.ny[0]} y={US_CITIES.ny[1]}>
					<Pin label="Nowy Jork" s={pk(f, K.l9 - 4)} size={v ? 64 : 46} side="l" color={P.slate} />
				</G>
				<G x={US_CITIES.sea[0]} y={US_CITIES.sea[1]}>
					<Pin label="Seattle" s={pk(f, K.sea)} size={v ? 64 : 46} side="r" />
				</G>
			</g>
		</g>
	);
};

// 4: rejestracja 5.07.1994 „Cadabra”, prawnik słyszy „cadaver”, litery → AMAZON
const R4: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const shiver = f > K.cadaver && f < K.amazon13 ? Math.sin(f * 1.7) * 4 : 0;
	const p = ip(f, K.amazon13 - 6, K.amazon13 + 16, 0, 1, EIO);
	const stamp = f >= K.d5 + 10 ? 1 + 1.2 * (1 - ip(f, K.d5 + 10, K.d5 + 20, 0, 1, EOUT)) : 0;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 540 : cx - 380} y={v ? 600 : FL - 360} s={pk(f, K.l10 - 4) * (v ? 1 : 1)}>
				<rect x={-200} y={-230} width={400} height={460} rx={12} fill={P.white} stroke={P.navy} strokeWidth={7} />
				<FText text="REJESTRACJA" x={0} y={-160} size={40} fill={P.navy} />
				<FText text="5.07.1994" x={0} y={-110} size={36} fill={P.goldDark} />
				<g transform={`translate(${shiver} 0)`}>
					<Shuffle a="Cadabra, Inc." b="Amazon.com" p={p} size={44} fill={P.navy} sp={0.46} />
				</g>
				{[0, 1].map((i) => (
					<line key={i} x1={-150} x2={150} y1={70 + i * 40} y2={70 + i * 40} stroke={P.grey} strokeWidth={10} strokeLinecap="round" />
				))}
				{stamp > 0 && (
					<G x={90} y={170} s={stamp * 0.5} r={-12}>
						<Stamp lines={['ZAREJESTROWANO']} w={520} color={P.red} />
					</G>
				)}
			</G>
			<G x={v ? 820 : cx + 420} y={v ? 1120 : FL} s={(v ? 0.85 : 1.05) * pk(f, K.prawnik - 6)}>
				<Adult look={LOOK.prawnik} phone mood={f > K.cadaver ? 'shock' : 'neutral'} seed={13} />
			</G>
			{f >= K.cadaver - 4 && f < K.amazon13 + 10 && (
				<G x={v ? 700 : cx + 240} y={v ? 300 : 180} s={pk(f, K.cadaver - 4)}>
					<path d="M -200 -70 L 200 -70 Q 220 -70 220 -50 L 220 50 Q 220 70 200 70 L 60 70 L 100 120 L 0 70 L -200 70 Q -220 70 -220 50 L -220 -50 Q -220 -70 -200 -70 Z" fill={P.white} stroke={P.navy} strokeWidth={6} />
					<FText text="„cadaver”?" x={0} y={-6} size={50} fill={P.red} />
					<FText text="(zwłoki)" x={0} y={44} size={32} fill={P.slate} opacity={prog(f, K.zwloki, 6)} />
				</G>
			)}
		</g>
	);
};

// 5: garaż w Bellevue; drzwi wyskakują z futryny i stają się biurkiem
const R5: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const open = ip(f, K.l14, K.l14 + 22, 0, 1, EIO);
	const fly = ip(f, K.drzwi - 4, K.drzwi + 22, 0, 1, EIO);
	const sc = v ? 1.5 : 1.4;
	const p = arcPt(fly, -330, -180, 0, -40, 220);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<FloorDeco l={l} />
			<G x={cx} y={FL} s={sc}>
				<Garage w={560} h={360} open={open} id="m5" roof="#4F6A7A" label="Bellevue" labelSize={40}>
					{fly >= 1 && (
						<g>
							<rect x={-150} y={-120} width={300} height={22} rx={4} fill="#C9B596" stroke={P.navy} strokeWidth={5} />
							{[-130, 110].map((x) => (
								<rect key={x} x={x} y={-98} width={18} height={98} fill={P.slate} stroke={P.navy} strokeWidth={4} />
							))}
							<g transform="translate(-50 -120) scale(0.45)">
								<Crt />
							</g>
						</g>
					)}
				</Garage>
				{/* drzwi pokojowe w ścianie domu obok garażu */}
				{fly < 1 && (
					<g transform={`translate(${p.x} ${p.y}) rotate(${-90 * fly}) scale(${1 - 0.1 * fly})`}>
						<rect x={-40} y={-90} width={80} height={180} rx={4} fill="#C9B596" stroke={P.navy} strokeWidth={5} />
						<circle cx={24} cy={0} r={6} fill={P.gold} />
					</g>
				)}
			</G>
		</g>
	);
};

// 6: rodzice Bezosa: koperta i licznik prawie 250 000 $
const R6: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const fly = ip(f, K.rodz + 10, K.rodz + 40, 0, 1, EIO);
	const cnt = Math.round(245573 * ip(f, K.d250 - 8, K.d250 + 26, 0, 1, EOUT));
	const p = arcPt(fly, v ? 340 : cx - 340, FL - 330, v ? 800 : cx + 420, FL - 330, 160);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 160 : cx - 620} y={FL} s={v ? 0.85 : 1}>
				<Adult look={LOOK.mama} mood="smile" seed={14} />
			</G>
			<G x={v ? 360 : cx - 380} y={FL} s={v ? 0.88 : 1.05}>
				<Adult look={LOOK.tata} mood="smile" armR={fly < 0.1 ? 60 : 12} seed={15} />
			</G>
			<G x={v ? 860 : cx + 520} y={FL} s={v ? 0.9 : 1.05}>
				<Adult look={LOOK.bezos} mood={fly > 0.9 ? 'laugh' : 'smile'} armL={fly > 0.8 ? 60 : 10} seed={12} />
			</G>
			{f >= K.rodz + 10 && fly < 1 && (
				<G x={p.x} y={p.y} r={fly * 360} s={1.4}>
					<Envelope w={110} />
				</G>
			)}
			{f >= K.d250 - 8 && (
				<G x={v ? 540 : cx} y={v ? 380 : 220} s={pk(f, K.d250 - 8)}>
					<Plate text={`${String(cnt).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $`} label="prawie 250 tysięcy" w={v ? 640 : 600} size={90} />
				</G>
			)}
		</g>
	);
};

// 7: start 16.07.1995: przycisk KUP, pierwsza paczka; książka z zębatkami; „prawie wszystko”
const R7: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const press = ip(f, K.rusza - 4, K.rusza + 4, 0, 1, EOUT);
	const boxX = ip(f, K.rusza + 6, K.ksiazka, 0, 1, EIO);
	const open = ip(f, K.ksiazka + 4, K.ksiazka + 20, 0, 1, EBACK);
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E2D6C0" />
			<FloorDeco l={l} />
			<G x={v ? 260 : 280} y={v ? 300 : 200} s={pk(f, K.d16 - 4)}>
				<Calendar text="16 lipca" w={220} top="1995" />
			</G>
			<G x={v ? 540 : cx - 420} y={v ? 860 : FL} s={v ? 1.3 : 1.4}>
				<Crt
					screen={
						<g transform={`translate(0 -96) scale(${1 - press * 0.1})`}>
							<rect x={-60} y={-24} width={120} height={48} rx={12} fill={P.gold} stroke={P.navy} strokeWidth={4} />
							<FText text="KUP" x={0} y={12} size={30} fill={P.navy} />
						</g>
					}
				/>
			</G>
			{f >= K.rusza + 6 && (
				<G x={(v ? 540 : cx - 420) + boxX * (v ? 0 : 640)} y={v ? 760 - boxX * 260 : FL} s={v ? 1.1 : 1.3}>
					<Box w={180} open={open} />
					{open > 0.3 && (
						<G y={-140 - open * 60} s={open}>
							<Book w={110} color={P.blue} />
							{[0, 1].map((i) => (
								<G key={i} x={-70 + i * 140} y={-150} s={0.5}>
									<Gear r={40} ang={(f - K.ksiazka) * (i ? -4 : 4)} fill={P.gold} />
								</G>
							))}
						</G>
					)}
				</G>
			)}
			{Array.from({length: 8}).map((_, i) => {
				const a = K.wszystko - 6 + i * 3;
				if (f < a) return null;
				const ang = (i / 8) * Math.PI * 2;
				const r = (v ? 330 : 380) * ip(f, a, a + 16, 0.2, 1, EBACK);
				const x = (v ? 540 : cx + 220) + Math.cos(ang) * r;
				const y = (v ? 480 : 380) + Math.sin(ang) * r * 0.6;
				const kinds = [
					<Book key="b" w={60} color={P.red} />,
					<Box key="x" w={80} />,
					<circle key="c" r={30} fill={P.gold} stroke={P.navy} strokeWidth={4} />,
					<rect key="r" x={-30} y={-50} width={60} height={50} rx={8} fill={P.blue} stroke={P.navy} strokeWidth={4} />,
				];
				return (
					<G key={i} x={x} y={y} s={0.9}>
						{kinds[i % 4]}
					</G>
				);
			})}
		</g>
	);
};

// 8: 50 stanów i 45 krajów; 20 000 $ tygodniowo
const R8: R = ({f, l}) => {
	const {v, W, H} = l;
	const cx = W / 2;
	const sw = ip(f, K.d45 - 10, K.d45 + 6, 0, 1, EIO);
	const cnt = Math.round(20000 * ip(f, K.d20 - 6, K.d20 + 20, 0, 1, EOUT));
	return (
		<g>
			<rect x={0} y={0} width={W} height={H} fill="#C9D6DA" />
			<g transform={`translate(${cx} ${v ? 620 : 430}) scale(${(v ? 0.68 : 0.95) * (1 - sw * 0.3)})`} opacity={1 - sw}>
				<UsMap />
				{US_DOTS.map(([x, y], i) => {
					const a = K.d50 - 20 + i * 1.2;
					return f >= a ? <circle key={i} cx={x} cy={y} r={14 * Math.min(1, pk(f, a))} fill={P.red} stroke={P.navy} strokeWidth={3} /> : null;
				})}
			</g>
			<g transform={`translate(${cx} ${v ? 620 : 430}) scale(${(v ? 0.66 : 1.05) * (0.8 + sw * 0.2)})`} opacity={sw}>
				<WorldMap />
				{WORLD_DOTS.map(([x, y], i) => {
					const a = K.d45 + i * 1.2;
					return f >= a ? <circle key={i} cx={x} cy={y} r={11 * Math.min(1, pk(f, a))} fill={P.gold} stroke={P.navy} strokeWidth={3} /> : null;
				})}
			</g>
			<G x={cx} y={v ? 260 : 90} s={pk(f, K.d50 - 6)}>
				<rect x={-320} y={-50} width={640} height={100} rx={16} fill={P.navy} />
				<FText text={sw > 0.5 ? '45 krajów' : '50 stanów'} x={0} y={22} size={64} fill={P.goldLight} />
			</G>
			{f >= K.d20 - 6 && (
				<G x={cx} y={v ? 1000 : 760} s={pk(f, K.d20 - 6)}>
					<Plate text={`${String(cnt).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $`} label="tygodniowo" w={v ? 560 : 520} size={86} />
				</G>
			)}
		</g>
	);
};

// 9: [film] wielka skrzynka na listy przed domem, katalogi
const R9: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#BFD0D6" />
			<rect x={0} y={FL - 10} width={W} height={10} fill={P.grassDark} />
			<FloorDeco l={l} />
			<G x={v ? 300 : cx - 360} y={FL} s={v ? 0.85 : 1.1}>
				<House w={420} h={290} roof="#4F6A7A" />
			</G>
			<G x={v ? 800 : cx + 420} y={FL} s={(v ? 1.2 : 1.4) * pk(f, K.skrz - 6)}>
				<Mailbox w={220} bulge={ip(f, K.katal, K.katal + 40, 0, 1, EIO)} flag={prog(f, K.katal + 30, 8)} />
			</G>
			{Array.from({length: 6}).map((_, i) => {
				const a = K.katal + i * 6;
				if (f < a || f > a + 24) return null;
				const p = clamp01((f - a) / 24);
				const pt = arcPt(p, (v ? 800 : cx + 420) + 300, (v ? 300 : 100), v ? 800 : cx + 420, FL - (v ? 340 : 400), 120);
				return (
					<G key={i} x={pt.x} y={pt.y} r={p * 180} s={0.6}>
						<Book w={90} color={[P.red, P.blue, P.gold][i % 3]} title="KATALOG" />
					</G>
				);
			})}
		</g>
	);
};

// 10: [most] śniadanie z doktorantami ze Stanfordu: wyszukiwarka, Bezos chce zainwestować
const R10: R = ({f, l}) => {
	const {v, W, FL} = l;
	const cx = W / 2;
	const chain = ip(f, K.inwest, K.end, 0, 1, EIO);
	const typed = 'szukaj'.slice(0, Math.max(0, Math.floor((f - K.wysz) / 4)));
	return (
		<g>
			<Room w={W} h={l.H} floor={FL} tone="#E8DCC6" />
			<FloorDeco l={l} />
			<G x={v ? 260 : 280} y={v ? 300 : 200} s={pk(f, K.l27 - 4)}>
				<Calendar text="1998" w={200} />
			</G>
			<G x={v ? 220 : cx - 560} y={FL} s={v ? 0.82 : 1}>
				<Adult look={LOOK.bezos} mood={f > K.inwest ? 'laugh' : 'smile'} armR={f > K.inwest ? 70 : 10} seed={12} />
			</G>
			<G x={v ? 540 : cx} y={FL} s={v ? 1 : 1.1}>
				<rect x={-260} y={-170} width={520} height={24} rx={6} fill="#A87B4A" stroke={P.navy} strokeWidth={6} />
				<rect x={-230} y={-146} width={18} height={146} fill="#7A5A3E" stroke={P.navy} strokeWidth={4} />
				<rect x={212} y={-146} width={18} height={146} fill="#7A5A3E" stroke={P.navy} strokeWidth={4} />
				{[-150, 150].map((x) => (
					<g key={x}>
						<ellipse cx={x} cy={-178} rx={44} ry={10} fill={P.white} stroke={P.navy} strokeWidth={4} />
						<rect x={x - 20} y={-214} width={40} height={36} rx={6} fill={P.white} stroke={P.navy} strokeWidth={4} />
					</g>
				))}
				<g transform="translate(0 -170)" opacity={pk(f, K.wysz - 6)}>
					<rect x={-110} y={-120} width={220} height={120} rx={8} fill="#CFC7B8" stroke={P.navy} strokeWidth={5} />
					<rect x={-90} y={-80} width={180} height={34} rx={17} fill={P.white} stroke={P.navy} strokeWidth={3} />
					<FText text={typed} x={-76} y={-55} size={22} fill={P.navy} anchor="start" />
				</g>
			</G>
			{[0, 1].map((i) => (
				<G key={i} x={(v ? 760 : cx + 400) + i * (v ? 180 : 220)} y={FL} s={(v ? 0.78 : 0.95) * pk(f, K.sniad - 4 + i * 6)}>
					<Adult look={i ? LOOK.brin : LOOK.page} mood="smile" talk={f > K.wysz && f < K.l29} seed={16 + i} />
				</G>
			))}
			{f >= K.inwest - 4 && (
				<G x={v ? 380 : cx - 340} y={v ? 600 : FL - 520} s={pk(f, K.inwest - 4) * 0.7}>
					<Check amount="?" to="wyszukiwarka" w={420} write={ip(f, K.inwest, K.inwest + 30, 0, 1)} />
				</G>
			)}
			{chain > 0 && <Chain x0={v ? 540 : cx} y0={FL - 380} x1={W + 40} y1={FL - 420} sag={60} p={chain} link={28} />}
		</g>
	);
};

const ROOMS = [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10];
const KEYS_H = keysFor(false);
const KEYS_V = keysFor(true);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => {
	const l = LAY(v);
	return (
		<Stage v={v} lines={LINES} vo="ga4_vo.wav" keys={v ? KEYS_V : KEYS_H} dips={DIPS} hits={HITS} defs={<clipPath id={`gd4c${v ? 'v' : 'h'}`}><rect x={0} y={0} width={l.W} height={l.H} /></clipPath>}>
			{(f, cam) => (
				<g>
					<rect x={-3000} y={-2000} width={ROOMS.length * l.W + 6000} height={l.H + 4000} fill={P.navy} />
					{ROOMS.map((Rm, i) =>
						Math.abs(cam.x - (i * l.W + l.W / 2)) < l.W / 2 / cam.z + l.W * 0.6 ? (
							<g key={i} transform={`translate(${i * l.W} 0)`}>
								<g clipPath={`url(#gd4c${v ? 'v' : 'h'})`}>
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

export const GarAmazon: React.FC = () => (
	<WithCard cardFrames={CARD} card={<GarageCard num={4} name="Amazon" year="1994" />}>
		<Scene />
	</WithCard>
);
export const GarAmazonS: React.FC = () => (
	<ShortWithCta sceneFrames={MS_SCENE}>
		<CutShort keep={KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
