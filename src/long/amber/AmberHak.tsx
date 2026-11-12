// Amber Gold, hak (16:9). Hala ze skarbcem → wjazd w drzwi → puste wnętrze (1% złota) → maszyna afery →
// zapowiedź: zwrot pieniędzy i sąd → złoto w zmieniającym się opakowaniu → plansza tytułowa.
import React from 'react';
import {LINES} from './am0.gen';
import {
	AmberStage, makeT, endOf, ip, pk, live, swing, hsh, arcPt, fmt, EIO, EOUT, EIN, EBACK, type CK, type Hit,
	P, G, Adult, Coin, FText, clamp01, prog,
	Room, Motes, Plate, GoldBar, Cert, VaultDoor, Crowd, Mini, miniLook, Columns, Plane, Envelope, Gear, WarnSign,
} from './kit';

const T = makeT(LINES);
const RW = 1920;
const END = endOf(LINES) + 75;
export const HAK_FRAMES = END;

const K = {
	k18: T(0, '18'),
	wpl: T(1, 'Wpłacili'),
	m851: T(1, '851'),
	na: T(2),
	mniej: T(2, 'mniej'),
	p1: T(2, '1%'),
	sam: T(3, 'samoloty'),
	biu: T(3, 'biura'),
	wyp: T(3, 'wypłaty'),
	ods: T(3, 'odsetki'),
	kol: T(3, 'kolejnych'),
	l4: T(4),
	masz: T(4, 'maszyna'),
	kto: T(4, 'kto'),
	trzy: T(5, 'trzy'),
	nikt: T(5, 'nikt'),
	ostr: T(5, 'ostrzeżenie'),
	l6: T(6),
	wroc: T(6, 'wróciło'),
	sad: T(6, 'sąd'),
	pan: T(6, 'państwa'),
	l7: T(7),
	dzis: T(7, 'dziś'),
	opak: T(8, 'opakowanie'),
	end: endOf(LINES),
};

const DOOR = {x: 1250, y: 440, r: 290};
const KEYS: CK[] = [
	{f: 0, x: 960, y: 470, z: 1},
	{f: K.na - 10, x: 1000, y: 455, z: 1.06},
	{f: K.mniej + 2, x: 1060, y: 450, z: 1.12},
	{f: K.p1 + 14, x: 1010, y: 440, z: 1.06},
	{f: K.p1 + 38, x: DOOR.x, y: DOOR.y, z: 8, e: 'in'},
	{f: K.p1 + 38, x: RW + 960, y: 470, z: 8},
	{f: K.p1 + 66, x: RW + 960, y: 540, z: 1.2, e: 'out'},
	{f: K.l4 - 8, x: RW + 1000, y: 540, z: 1.24},
	{f: K.l4 + 18, x: RW * 2 + 960, y: 470, z: 1},
	{f: K.kto - 4, x: RW * 2 + 960, y: 470, z: 1},
	{f: K.kto + 16, x: RW * 2 + 700, y: 540, z: 1.16},
	{f: K.trzy - 6, x: RW * 2 + 960, y: 470, z: 1},
	{f: K.nikt + 16, x: RW * 2 + 1100, y: 560, z: 1.14},
	{f: K.ostr + 14, x: RW * 2 + 880, y: 430, z: 1.1},
	{f: K.l6 - 10, x: RW * 2 + 920, y: 450, z: 1.04},
	{f: K.l6 + 16, x: RW * 3 + 960, y: 510, z: 1.12},
	{f: K.sad - 4, x: RW * 3 + 980, y: 510, z: 1.14},
	{f: K.sad + 18, x: RW * 3 + 1260, y: 520, z: 1.14},
	{f: K.l7 - 10, x: RW * 3 + 1220, y: 510, z: 1.1},
	{f: K.l7 + 16, x: RW * 4 + 960, y: 520, z: 1.2},
	{f: K.opak - 4, x: RW * 4 + 960, y: 540, z: 1.24},
	{f: K.opak + 14, x: RW * 4 + 960, y: 560, z: 1.2},
	{f: K.end + 16, x: RW * 4 + 960, y: 470, z: 1},
	{f: END, x: RW * 4 + 960, y: 465, z: 1.03},
];
const DIPS: [number, number, number][] = [
	[K.l4 - 8, K.l4 + 18, 0.14],
	[K.l6 - 10, K.l6 + 16, 0.14],
	[K.l7 - 10, K.l7 + 16, 0.14],
];
const HITS: Hit[] = [
	{t: K.k18 / 30, kind: 'punch', amp: 0.5},
	{t: K.m851 / 30, kind: 'punch', amp: 0.8},
	{t: K.mniej / 30 + 0.2, kind: 'both', amp: 1.0},
	{t: K.p1 / 30, kind: 'punch', amp: 0.5},
	{t: K.sam / 30, kind: 'punch', amp: 0.4},
	{t: K.kto / 30, kind: 'punch', amp: 0.5},
	{t: K.ostr / 30 + 0.3, kind: 'punch', amp: 0.5},
	{t: K.sad / 30, kind: 'both', amp: 0.8},
	{t: K.opak / 30, kind: 'punch', amp: 0.5},
	{t: (K.end + 12) / 30, kind: 'both', amp: 0.9},
];

// ---------------- pokój A: hala ze skarbcem ----------------
const HallA: React.FC<{f: number}> = ({f}) => {
	const shake = f >= K.na && f < K.mniej ? Math.sin(f * 1.7) * 1.4 * ip(f, K.na, K.na + 10, 0, 1) : 0;
	const open = ip(f, K.mniej, K.mniej + 14, 0, 1, EOUT);
	const spin = ip(f, K.na + 4, K.mniej, 0, 200, EIO);
	const n18 = Math.round(ip(f, K.k18, K.k18 + 22, 0, 18000));
	const n851 = Math.round(ip(f, K.m851, K.m851 + 22, 0, 851));
	const gauge = ip(f, K.p1, K.p1 + 14, 0, 0.012, EOUT);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			{[90, 1830].map((x) => (
				<g key={x}>
					<rect x={x - 40} y={40} width={80} height={760} fill={P.paper} stroke={P.navy} strokeWidth={6} />
					{[-20, 0, 20].map((d) => (
						<line key={d} x1={x + d} y1={70} x2={x + d} y2={770} stroke={P.grey} strokeWidth={5} />
					))}
				</g>
			))}
			<rect x={DOOR.x - 270} y={52} width={540} height={92} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={7} />
			<FText text="AMBER GOLD" x={DOOR.x} y={118} size={60} fill={P.navy} />
			<G x={DOOR.x} y={DOOR.y} r={shake}>
				<VaultDoor r={DOOR.r} open={open} spin={spin} />
			</G>
			{/* tłum z certyfikatami */}
			<Crowd f={f} x0={70} x1={900} floor={860} rows={3} perRow={6} seed={1} size={1.45} />
			{/* „ponad 18 tysięcy”: przybywa ludzi */}
			<Crowd f={f} x0={1590} x1={1900} floor={860} rows={3} perRow={2} seed={2} size={1.3} appear={(i) => pk(f, K.k18 + 4 + i * 2)} />
			<Crowd f={f} x0={60} x1={900} floor={720} rows={2} perRow={8} seed={3} size={0.9} appear={(i) => pk(f, K.k18 + 2 + i * 1.5)} />
			{/* monety lecą do skarbca */}
			{Array.from({length: 26}).map((_, k) => {
				const p = clamp01((f - (K.wpl + k * 2.4)) / 16);
				if (p <= 0 || p >= 1) return null;
				const q = arcPt(EIO(p), 150 + hsh(k) * 700, 600 + hsh(k + 3) * 80, DOOR.x - 40 + hsh(k + 5) * 80, DOOR.y - 20, 180);
				return (
					<G key={k} x={q.x} y={q.y} r={p * 360} s={1 - 0.4 * p}>
						<Coin r={22} />
					</G>
				);
			})}
			{/* liczniki */}
			{f >= K.k18 - 2 && (
				<G x={330} y={150} s={pk(f, K.k18 - 2)} o={1 - prog(f, K.na - 8, 10)}>
					<Plate text={`${fmt(n18)}${n18 >= 18000 ? '+' : ''}`} label="klientów" w={470} size={92} />
				</G>
			)}
			{f >= K.m851 - 2 && (
				<G x={330} y={350} s={pk(f, K.m851 - 2)} o={1 - prog(f, K.na - 4, 10)}>
					<Plate text={`${n851} mln zł`} label="wpłacili" w={470} size={92} fill={P.gold} color={P.navy} stroke={P.navy} />
				</G>
			)}
			{/* „1%” na złoto: termometr obok drzwi */}
			{f >= K.p1 - 4 && (
				<G x={1730} y={120} s={pk(f, K.p1 - 4)}>
					<rect x={-46} y={0} width={92} height={380} rx={46} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<rect x={-30} y={364 - 348 * gauge - 8} width={60} height={348 * gauge + 8} rx={14} fill={P.gold} />
					<FText text="złoto" x={0} y={-18} size={40} fill={P.navy} />
					<FText text="1%" x={0} y={440} size={64} fill={P.red} />
				</G>
			)}
		</g>
	);
};

// ---------------- pokój A2: wnętrze skarbca ----------------
const VaultIn: React.FC<{f: number}> = ({f}) => {
	const pile: React.ReactNode[] = [];
	for (let i = 0; i < 90; i++) {
		const x = 560 + hsh(i) * 800;
		const y = 800 - hsh(i + 9) * 220 * (1 - Math.abs(x - 960) / 420);
		pile.push(
			<G key={i} x={x} y={y} r={(hsh(i + 4) - 0.5) * 80}>
				<Cert w={84} />
			</G>,
		);
	}
	const planeP = clamp01((f - K.sam) / 26);
	const bld = pk(f, K.biu);
	const envP = clamp01((f - K.wyp) / 16);
	const chain = [1220, 1360, 1500, 1640];
	return (
		<g>
			<Room w={RW} h={1080} floor={800} dark tone="#152030" />
			<Motes f={f} w={RW} h={800} seed={1} />
			{[230, 360, 600].map((y) => (
				<g key={y}>
					<rect x={260} y={y} width={1400} height={14} fill="#3A4A5E" />
					{[300, 960, 1620].map((x) => (
						<rect key={x} x={x - 8} y={y + 14} width={16} height={28} fill="#3A4A5E" />
					))}
				</g>
			))}
			{/* jedyna sztabka w świetle */}
			<path d="M 1160 0 L 1240 0 L 1320 232 L 1080 232 Z" fill={P.goldLight} opacity={0.12} />
			<G x={1200} y={230}>
				<GoldBar w={70} glow={0.6 + 0.3 * Math.sin(f / 9)} />
			</G>
			{pile}
			{/* z góry kartek wylatują: samolot, biura, wypłaty */}
			{f >= K.sam && planeP < 1 && (
				<G x={960 + 1100 * EIN(planeP)} y={700 - 640 * planeP} s={0.2 + 0.5 * EOUT(planeP)} r={-18}>
					<Plane />
				</G>
			)}
			{f >= K.biu && (
				<G x={430} y={800} s={bld} sq={1 + swing(f, K.biu + 4, 0.06)}>
					<rect x={-110} y={-430} width={220} height={430} fill="#3A4A5E" stroke="#0E1520" strokeWidth={7} />
					{Array.from({length: 5}).map((_, r) =>
						[0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-86 + c * 62} y={-400 + r * 76} width={40} height={44} rx={4} fill={(r + c) % 3 ? P.goldLight : '#26313F'} />),
					)}
				</G>
			)}
			{f >= K.wyp && (
				<G {...(() => {
					const q = arcPt(EOUT(envP), 900, 700, 720, 330, 220);
					return {x: q.x, y: q.y, r: (1 - envP) * 200, s: 0.6 + 0.6 * envP};
				})()}>
					<Envelope w={110} />
				</G>
			)}
			{/* odsetki z pieniędzy kolejnych klientów: moneta z ręki do ręki od prawej do lewej */}
			{f >= K.ods - 8 &&
				chain.map((x, i) => {
					const L = miniLook(40 + i);
					const a = i < 3 ? pk(f, K.ods - 8 + i * 3) : pk(f, K.kol);
					return (
						<G key={i} x={x} y={860} s={1.2 * a}>
							<Mini suit={L.suit} hair={L.hair} bald={L.bald} up={0.25} />
						</G>
					);
				})}
			{[0, 1, 2].map((k) => {
				const a = K.ods + 4 + k * 10;
				const p = clamp01((f - a) / 12);
				if (p <= 0 || p >= 1) return null;
				const q = arcPt(EIO(p), chain[3 - k] - 10, 660, chain[2 - k] + 50, 660, 90);
				return (
					<G key={k} x={q.x} y={q.y} r={p * 300}>
						<Coin r={22} />
					</G>
				);
			})}
			{f >= K.kol && (
				<G x={1540} y={420} s={pk(f, K.kol)}>
					<path d="M 200 0 L -200 0" stroke={P.gold} strokeWidth={10} strokeLinecap="round" />
					<path d="M -170 -26 L -206 0 L -170 26" fill="none" stroke={P.gold} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
					<FText text="nowi płacą starym" x={0} y={-30} size={40} fill={P.goldLight} />
				</G>
			)}
		</g>
	);
};

// ---------------- pokój B: maszyna afery ----------------
const MachineB: React.FC<{f: number}> = ({f}) => {
	const speed = 1 + 3 * live(f, K.masz, K.masz + 40, 6);
	const ang = (f * 2.2 * speed) % 360;
	const spot = live(f, K.kto, K.trzy - 4, 8);
	const year = f < K.trzy ? 2009 : Math.min(2012, 2009 + Math.floor((f - K.trzy) / 6) + 1);
	const flip = f >= K.trzy && f < K.trzy + 18 ? Math.abs(Math.sin(((f - K.trzy) / 6) * Math.PI)) : 0;
	const web = ip(f, K.nikt, K.nikt + 14, 0, 1, EIO);
	return (
		<g>
			<Room w={RW} h={1080} floor={800} dark />
			<Motes f={f} w={RW} h={800} seed={2} />
			{/* lejek i strumień monet */}
			<path d="M 760 120 L 1160 120 L 1040 270 L 880 270 Z" fill="#5C6B7A" stroke="#0E1520" strokeWidth={7} strokeLinejoin="round" />
			{Array.from({length: 8}).map((_, i) => {
				const y = ((f * 9 + i * 40) % 300) - 180;
				return (
					<G key={i} x={900 + hsh(i) * 120} y={y} r={f * 6 + i * 40}>
						<Coin r={18} />
					</G>
				);
			})}
			{/* korpus */}
			<rect x={600} y={260} width={720} height={430} rx={26} fill="#3A4A5E" stroke="#0E1520" strokeWidth={8} />
			<rect x={650} y={300} width={420} height={250} rx={18} fill="#26313F" />
			<G x={760} y={420}>
				<Gear r={80} ang={ang} />
			</G>
			<G x={905} y={380}>
				<Gear r={56} teeth={8} ang={-ang * 1.4} fill="#9AA3AD" />
			</G>
			<G x={990} y={480}>
				<Gear r={50} teeth={8} ang={ang * 1.6} fill={P.gold} />
			</G>
			{/* wyjścia: samolot, budynek, koperta, monety */}
			<path d="M 1320 330 L 1520 330 L 1520 240" fill="none" stroke="#5C6B7A" strokeWidth={30} strokeLinejoin="round" />
			<G x={1600} y={200} s={0.36} r={-12 + Math.sin(f / 12) * 4}>
				<Plane />
			</G>
			<path d="M 600 400 L 430 400 L 430 300" fill="none" stroke="#5C6B7A" strokeWidth={30} strokeLinejoin="round" />
			<G x={430} y={300} s={0.55}>
				<rect x={-90} y={-260} width={180} height={260} fill="#4A5868" stroke="#0E1520" strokeWidth={8} />
				{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-60 + c * 70} y={-230 + r * 76} width={50} height={46} fill={P.goldLight} />))}
			</G>
			<G x={1140} y={625} s={1 + 0.2 * live(f, K.nikt, K.nikt + 30, 4)}>
				<circle r={52} fill={P.red} stroke="#0E1520" strokeWidth={7} />
				<FText text="STOP" x={0} y={14} size={34} fill={P.white} />
				{web > 0 && (
					<g stroke={P.bg} strokeWidth={3} fill="none" opacity={0.85}>
						{[0, 1, 2, 3, 4, 5].map((i) => {
							const a = (i / 6) * Math.PI * 2;
							return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 70 * web} y2={Math.sin(a) * 70 * web} />;
						})}
						{[24, 44, 64].map((rr) => (
							<circle key={rr} r={rr * web} strokeDasharray="10 6" />
						))}
					</g>
				)}
			</G>
			{/* operator w cieniu */}
			<path d="M 380 0 L 300 800 L 700 800 L 520 0 Z" fill={P.goldLight} opacity={0.16 * spot} />
			<G x={460} y={860} s={1.6}>
				<Mini suit="#0E1520" hair="#0E1520" skin="#0E1520" />
			</G>
			{spot > 0.2 && <FText text="?" x={460} y={470} size={120} fill={P.gold} opacity={spot} />}
			<line x1={520} y1={640} x2={600} y2={560} stroke="#0E1520" strokeWidth={14} strokeLinecap="round" />
			{/* kalendarz 2009 → 2012 */}
			<G x={1600} y={560} r={4}>
				<g transform={`scale(1 ${1 - 0.8 * flip})`}>
					<rect x={-110} y={-120} width={220} height={220} rx={16} fill={P.white} stroke="#0E1520" strokeWidth={7} />
					<rect x={-110} y={-120} width={220} height={56} rx={16} fill={P.red} />
					<FText text={String(year)} x={0} y={40} size={78} fill={P.navy} />
				</g>
			</G>
			{/* ostrzeżenie wisi od początku */}
			{f >= K.ostr - 6 && (
				<G x={880} y={180 - 200 * (1 - ip(f, K.ostr - 6, K.ostr + 6, 0, 1, EBACK))}>
					<WarnSign w={360} ang={swing(f, K.ostr + 4, 12) + Math.sin(f / 20) * 2} />
				</G>
			)}
		</g>
	);
};

// ---------------- pokój C: ile wróciło i co powiedział sąd ----------------
const CourtC: React.FC<{f: number}> = ({f}) => {
	const tilt = Math.sin(f / 26) * 3 + swing(f, K.sad, 14) - 6 * ip(f, K.pan, K.pan + 12, 0, 1);
	const gav = f >= K.sad - 8 && f < K.sad ? -60 * ip(f, K.sad - 8, K.sad - 2, 0, 1) : f >= K.sad && f < K.sad + 10 ? -60 + 60 * 1 : -25;
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			{/* ile wróciło: słoik i kilka monet */}
			<G x={360} y={860} s={1.2}>
				<Adult look={{suit: '#6E7D61', hair: '#8A8A8A', shirt: P.white, hairStyle: 'side'}} mood={f >= K.wroc + 20 ? 'sad' : 'neutral'} armR={30} seed={7} />
			</G>
			<G x={600} y={800}>
				<path d="M -70 -170 L 70 -170 L 80 0 L -80 0 Z" fill={P.sky} opacity={0.5} stroke={P.navy} strokeWidth={6} />
				<rect x={-60} y={-190} width={120} height={24} rx={6} fill={P.slate} />
				{Array.from({length: 3}).map((_, i) => {
					const p = clamp01((f - (K.wroc + i * 8)) / 14);
					if (p <= 0) return null;
					return (
						<G key={i} x={-20 + i * 20} y={-420 + 400 * EIN(p) - i * 8 * (p >= 1 ? 1 : 0)} r={p * 200}>
							<Coin r={20} />
						</G>
					);
				})}
			</G>
			{/* waga: ludzie i państwo */}
			<G x={1240} y={760}>
				<rect x={-12} y={-430} width={24} height={430} fill={P.goldDark} />
				<rect x={-90} y={-14} width={180} height={20} rx={6} fill={P.goldDark} />
				<g transform={`translate(0 -420) rotate(${tilt})`}>
					<rect x={-300} y={-8} width={600} height={16} rx={8} fill={P.gold} stroke={P.navy} strokeWidth={4} />
					{[-1, 1].map((s) => (
						<g key={s} transform={`translate(${s * 290} 0) rotate(${-tilt})`}>
							<line x1={0} y1={0} x2={-70} y2={150} stroke={P.navy} strokeWidth={4} />
							<line x1={0} y1={0} x2={70} y2={150} stroke={P.navy} strokeWidth={4} />
							<path d="M -110 150 Q 0 200 110 150 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} />
							{s < 0 ? (
								[-40, 0, 40].map((x, i) => (
									<G key={i} x={x} y={150} s={0.48}>
										<Mini {...miniLook(70 + i)} mood="sad" />
									</G>
								))
							) : (
								<G x={0} y={150} s={0.42}>
									<Columns w={230} h={220} label="PAŃSTWO" labelSize={44} />
								</G>
							)}
						</g>
					))}
				</g>
			</G>
			<G x={1640} y={520}>
				<g transform={`rotate(${gav})`}>
					<rect x={-8} y={-8} width={150} height={16} rx={8} fill="#6E5139" stroke={P.navy} strokeWidth={5} />
					<rect x={118} y={-34} width={46} height={68} rx={10} fill="#8C6A4A" stroke={P.navy} strokeWidth={6} />
				</g>
			</G>
			{f >= K.pan && <FText text="?" x={1240} y={210} size={170} fill={P.red} opacity={prog(f, K.pan, 6)} />}
		</g>
	);
};

// ---------------- pokój D: opakowanie i tytuł ----------------
const WrapD: React.FC<{f: number}> = ({f}) => {
	const gears = pk(f, K.l7 + 4);
	const box = f >= K.opak ? ip(f, K.opak - 2, K.opak + 8, 0, 1, EBACK) : 0;
	const pat = f < K.opak + 12 ? 0 : f < K.opak + 24 ? 1 : 2;
	const sqz = f >= K.opak ? 1 + 0.12 * Math.abs(Math.sin(((f - K.opak) / 12) * Math.PI)) * (f < K.opak + 36 ? 1 : 0) : 1;
	const lid = ip(f, K.end + 6, K.end + 22, 0, 1, EIN);
	const title = pk(f, K.end + 12);
	const ang = f * 2.5;
	return (
		<g>
			<Room w={RW} h={1080} floor={800} />
			<rect x={820} y={640} width={280} height={160} fill={P.paper} stroke={P.navy} strokeWidth={7} />
			{gears > 0.02 && (
				<g opacity={1 - lid}>
					<G x={760} y={520} s={gears}>
						<Gear r={70} ang={ang} />
					</G>
					<G x={1170} y={500} s={gears}>
						<Gear r={56} teeth={8} ang={-ang * 1.3} fill="#9AA3AD" />
					</G>
					<G x={980} y={340} s={gears}>
						<Gear r={44} teeth={8} ang={ang * 1.6} fill={P.gold} />
					</G>
				</g>
			)}
			{f >= K.dzis - 2 && (
				<G x={1470} y={300} s={pk(f, K.dzis - 2) * (1 - lid)} r={5}>
					<rect x={-100} y={-90} width={200} height={180} rx={16} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<rect x={-100} y={-90} width={200} height={50} rx={16} fill={P.red} />
					<FText text="DZIŚ" x={0} y={50} size={62} fill={P.navy} />
				</G>
			)}
			<G x={960} y={640}>
				<GoldBar w={220} glow={0.8} />
			</G>
			{box > 0 && (
				<G x={960} y={640} sq={sqz}>
					<g transform={`scale(${box})`}>
						<rect x={-190} y={-260} width={380} height={260} rx={12} fill={[P.gold, P.sky, P.red][pat]} stroke={P.navy} strokeWidth={8} />
						{pat === 0 && [0, 1, 2, 3, 4].map((i) => <line key={i} x1={-190 + i * 95} y1={-260} x2={-130 + i * 95} y2={0} stroke={P.goldLight} strokeWidth={18} />)}
						{pat === 1 && [0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={-120 + c * 120} cy={-200 + r * 80} r={26} fill={P.gold} stroke={P.navy} strokeWidth={4} />))}
						{pat === 2 && [0, 1, 2].map((c) => <text key={c} x={-120 + c * 120} y={-80} textAnchor="middle" fontFamily="'Baloo 2'" fontWeight={800} fontSize={110} fill={P.white}>?</text>)}
						<rect x={-24} y={-260} width={48} height={260} fill={P.white} opacity={0.85} />
					</g>
					<g transform={`translate(${lid * 500} ${-lid * 700}) rotate(${lid * 60})`} opacity={1 - lid * 0.2}>
						<g transform={`scale(${box})`}>
							<rect x={-210} y={-300} width={420} height={50} rx={10} fill={[P.gold, P.sky, P.red][pat]} stroke={P.navy} strokeWidth={8} />
							<path d="M 0 -300 Q -70 -380 -90 -320 Q -60 -300 0 -300 Q 70 -380 90 -320 Q 60 -300 0 -300" fill={P.white} stroke={P.navy} strokeWidth={6} />
						</g>
					</g>
				</G>
			)}
			{title > 0.02 && (
				<g>
					<G x={960} y={230} s={title}>
						<FText text="AMBER GOLD" x={0} y={0} size={170} fill={P.gold} stroke={P.navy} sw={16} />
					</G>
					<FText text="2009–2012" x={960} y={320} size={64} fill={P.navy} opacity={prog(f, K.end + 22, 10)} />
				</g>
			)}
		</g>
	);
};

export const AmberHak: React.FC = () => (
	<AmberStage lines={LINES} vo="am0_vo.wav" keys={KEYS} dips={DIPS} hits={HITS}>
		{(f) => (
			<g>
				<HallA f={f} />
				<g transform={`translate(${RW} 0)`}>
					<VaultIn f={f} />
				</g>
				<g transform={`translate(${RW * 2} 0)`}>
					<MachineB f={f} />
				</g>
				<g transform={`translate(${RW * 3} 0)`}>
					<CourtC f={f} />
				</g>
				<g transform={`translate(${RW * 4} 0)`}>
					<WrapD f={f} />
				</g>
			</g>
		)}
	</AmberStage>
);
