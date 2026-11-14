// Amber Gold, „Po co firmie od złota samoloty?” + powrót haka (L9 + R1, tylko 16:9).
// Sztabka i samolot ze znakiem zapytania → drzwi z sylwetkami właścicieli → wjazd w oko klienta → firma rośnie do olbrzyma
// (samoloty z logo, trasy po Europie) → na „nie ma pieniędzy” olbrzym okazuje się tekturą i się przewraca → za nim
// trzy zasłonięte okna: kolejka po zwrot, sala sądowa, Skarb Państwa.
import React from 'react';
import {LINES} from './am4b.gen';
import {AmberStage, makeT, endOf, ip, pk, hsh, EIO, EOUT, EIN, EBACK, type CK, type Hit, P, G, Adult, Mini, Crowd, FText, clamp01, prog, Room, GoldBar, Plane, Columns} from './kit';
import {Gavel, strike} from './AmberR2';

const T = makeT(LINES);
export const L9_FRAMES = endOf(LINES) + 24;
const K = {
	samoloty: T(0, 'samoloty'),
	l1: T(1),
	wlasc: T(1, 'właścicielami'),
	l2: T(2),
	oczami: T(2, 'oczami'),
	klienta: T(2, 'klienta'),
	l3: T(3),
	linie: T(3, 'linie'),
	logo: T(3, 'logo'),
	loty: T(3, 'loty'),
	europie: T(3, 'europie'),
	poteg: T(3, 'potęgę'),
	l4: T(4),
	niema: T(4, 'nie'),
	pien: T(4, 'pieniędzy'),
	ods: T(4, 'odsetki'),
	l5: T(5),
	odslonil: T(5, 'odsłonił'),
	l6: T(6),
	kolejce: T(6, 'kolejce'),
	sadzie: T(6, 'sądzie'),
	procesie: T(6, 'procesie'),
	panstwu: T(6, 'państwu'),
};
const EYE = {x: 520, y: 800 - 438 * 1.25};
const CUT = K.klienta + 8;
const KEYS: CK[] = [
	{f: 0, x: 960, y: 470, z: 1.06},
	{f: K.l1, x: 960, y: 470, z: 1},
	{f: K.l2, x: 900, y: 470, z: 1.04},
	{f: K.oczami, x: EYE.x + 40, y: 360, z: 1.6},
	{f: CUT, x: EYE.x + 18, y: EYE.y, z: 7, e: 'in'},
	{f: CUT, x: 1920 + 960, y: 470, z: 1.35},
	{f: K.linie + 10, x: 2880, y: 470, z: 1.05},
	{f: K.poteg, x: 2880, y: 470, z: 1},
	{f: K.pien + 20, x: 2880, y: 480, z: 1.04},
	{f: K.l6, x: 2880, y: 470, z: 1},
	{f: K.panstwu + 20, x: 2880, y: 470, z: 1.03},
];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(K.samoloty), kind: 'punch', amp: 0.6},
	{t: s(K.wlasc), kind: 'punch', amp: 0.3},
	{t: s(K.poteg), kind: 'both', amp: 0.6},
	{t: s(K.pien + 14), kind: 'both', amp: 1},
	{t: s(K.kolejce), kind: 'punch', amp: 0.4},
	{t: s(K.sadzie), kind: 'punch', amp: 0.4},
	{t: s(K.panstwu), kind: 'punch', amp: 0.5},
];

const Giant: React.FC<{f: number}> = ({f}) => (
	<g>
		<rect x={-130} y={-520} width={260} height={520} fill={P.gold} stroke={P.navy} strokeWidth={8} />
		{Array.from({length: 7}).map((_, r) =>
			[0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-100 + c * 72} y={-490 + r * 66} width={50} height={40} fill="#F3E2B0" stroke={P.navy} strokeWidth={3} />),
		)}
		<rect x={-160} y={-600} width={320} height={86} rx={10} fill={P.navy} />
		<FText text="AMBER GOLD" x={0} y={-542} size={44} fill={P.gold} />
		<path d="M -90 -600 L -60 -680 L -20 -620 L 0 -700 L 20 -620 L 60 -680 L 90 -600 Z" fill={P.goldLight} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" opacity={0.9 + 0.1 * Math.sin(f / 5)} />
	</g>
);
const Shutter: React.FC<{w: number; h: number; open: number; children: React.ReactNode; id: string}> = ({w, h, open, children, id}) => (
	<g>
		<rect x={-w / 2} y={-h} width={w} height={h} fill={P.paper} stroke={P.navy} strokeWidth={8} />
		<clipPath id={id}>
			<rect x={-w / 2} y={-h} width={w} height={h} />
		</clipPath>
		<g clipPath={`url(#${id})`}>
			{children}
			<g transform={`translate(0 ${-open * h})`}>
				<rect x={-w / 2} y={-h} width={w} height={h} fill="#8A96A3" />
				{Array.from({length: 12}).map((_, i) => (
					<line key={i} x1={-w / 2} y1={-h + (i + 1) * (h / 12)} x2={w / 2} y2={-h + (i + 1) * (h / 12)} stroke={P.navy} strokeWidth={4} opacity={0.5} />
				))}
			</g>
		</g>
		<rect x={-w / 2} y={-h} width={w} height={h} fill="none" stroke={P.navy} strokeWidth={8} />
	</g>
);

const World: React.FC<{f: number}> = ({f}) => {
	// --- część A: pytanie, drzwi właścicieli, klient ---
	const q = pk(f, K.samoloty - 2);
	const aOut = ip(f, K.l1 - 6, K.l1 + 10, 0, 1, EIN);
	const door = ip(f, K.l1 - 4, K.l1 + 12, 0, 1, EBACK);
	const doorOut = ip(f, K.l2 - 4, K.l2 + 8, 0, 1, EIN);
	const client = ip(f, K.l2 - 2, K.l2 + 14, 0, 1, EOUT);
	// --- część B: widok oczami klienta ---
	const grow = ip(f, K.poteg - 8, K.poteg + 10, 0, 1, EBACK);
	const flat = ip(f, K.pien - 2, K.pien + 6, 0, 1, EIO);
	const topple = ip(f, K.pien + 6, K.pien + 14, 0, 1, EIN);
	const dust = clamp01((f - (K.pien + 14)) / 26);
	const lens = ip(f, CUT, CUT + 22, 0, 1, EOUT);
	const gx = 960;
	const giantS = 0.55 + 0.75 * grow;
	const planes = [0, 1, 2];
	return (
		<g>
			<rect x={-2000} y={-2000} width={8000} height={6000} fill={P.bg} />
			<Room w={1920} h={1080} floor={800} />
			{aOut < 1 && (
				<g opacity={1 - aOut}>
					<G x={560} y={470} s={1.2}>
						<GoldBar w={300} glow={0.6} />
					</G>
					<G x={1360} y={440} s={1.2} r={-6 + Math.sin(f / 10) * 2}>
						<Plane />
					</G>
					<G x={960} y={430} s={q}>
						<circle r={100} fill={P.white} stroke={P.navy} strokeWidth={8} />
						<FText text="?" x={0} y={50} size={150} fill={P.red} />
					</G>
				</g>
			)}
			{door > 0 && doorOut < 1 && (
				<G x={960} y={800} s={door} o={1 - doorOut}>
					<rect x={-230} y={-620} width={460} height={620} rx={10} fill="#8C6A4A" stroke={P.navy} strokeWidth={8} />
					<rect x={-170} y={-560} width={340} height={300} rx={8} fill="#C9D3D8" stroke={P.navy} strokeWidth={6} />
					<clipPath id="l9glass">
						<rect x={-170} y={-560} width={340} height={300} />
					</clipPath>
					<g clipPath="url(#l9glass)" opacity={0.75 * prog(f, K.wlasc - 6, 8)}>
						<G x={-60} y={-200} s={1.3}>
							<Mini suit="#2A3546" hair="#2A3546" skin="#2A3546" />
						</G>
						<G x={70} y={-200} s={1.3}>
							<Mini suit="#2A3546" hair="#2A3546" skin="#2A3546" />
						</G>
					</g>
					<circle cx={170} cy={-300} r={18} fill={P.gold} stroke={P.navy} strokeWidth={5} />
					<G x={170} y={-230} s={pk(f, K.wlasc + 4)}>
						<path d="M -22 -10 L -22 -34 Q -22 -56 0 -56 Q 22 -56 22 -34 L 22 -10" fill="none" stroke={P.navy} strokeWidth={9} />
						<rect x={-34} y={-12} width={68} height={56} rx={10} fill={P.gold} stroke={P.navy} strokeWidth={6} />
					</G>
					<FText text="tylko właściciele wiedzą" x={0} y={-660} size={46} fill={P.navy} opacity={prog(f, K.wlasc, 8)} />
				</G>
			)}
			{client > 0 && (
				<G x={EYE.x} y={800} s={1.25 * client}>
					<Adult look={{suit: '#8C7A5E', hair: '#2B2420', shirt: '#CFC7B8', hairStyle: 'short'}} mood="smile" armR={20} seed={7} />
				</G>
			)}
			{client > 0 && (
				<G x={1180} y={330} s={client * 0.9} o={1 - prog(f, K.oczami, 6)}>
					<rect x={-220} y={-60} width={440} height={110} rx={20} fill={P.navy} />
					<FText text="oczami klienta" x={0} y={16} size={52} fill={P.gold} />
				</G>
			)}
			{/* --- część B --- */}
			<g transform="translate(1920 0)">
				<Room w={1920} h={1080} floor={800} />
				{/* okna z zapowiedzią (za olbrzymem) */}
				{f >= K.l5 - 10 &&
					[
						{x: 380, at: K.kolejce, id: 'l9w1', label: 'kolejka po zwrot'},
						{x: 960, at: K.sadzie, id: 'l9w2', label: 'sąd'},
						{x: 1540, at: K.panstwu - 6, id: 'l9w3', label: 'proces z państwem'},
					].map((w, i) => {
						const open = ip(f, w.at - 4, w.at + 14, 0, 1, EOUT);
						return (
							<G key={i} x={w.x} y={640} s={ip(f, K.l5 - 10 + i * 4, K.l5 + 6 + i * 4, 0, 1, EBACK)}>
								<Shutter w={500} h={420} open={open} id={w.id}>
									<rect x={-250} y={-420} width={500} height={420} fill={P.bg} />
									{i === 0 && (
										<g>
											<Crowd f={f} x0={-230} x1={230} floor={-10} rows={2} perRow={5} seed={83} cert={false} size={0.9} up={(k) => (k % 3 === 0 ? 0.6 : 0)} mood="sad" />
											<rect x={-110} y={-400} width={220} height={60} rx={10} fill={P.red} />
											<FText text="ZWROT?" x={0} y={-358} size={38} fill={P.white} />
										</g>
									)}
									{i === 1 && (
										<g>
											<rect x={-200} y={-200} width={400} height={190} fill="#8C6A4A" stroke={P.navy} strokeWidth={6} />
											<G x={0} y={-200} s={1.1}>
												<Mini suit="#1F2B3D" hair="#8A8A8A" />
											</G>
											<rect x={-200} y={-200} width={400} height={60} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
											<G x={170} y={-216} s={0.6}>
												<Gavel ang={strike(f, [K.sadzie + 10])} />
											</G>
										</g>
									)}
									{i === 2 && (
										<G x={0} y={-20} s={0.95}>
											<Columns w={300} h={230} label="SKARB PAŃSTWA" labelSize={30} fill={P.goldLight} />
										</G>
									)}
								</Shutter>
								<FText text={w.label} x={0} y={60} size={40} fill={P.navy} opacity={open} />
							</G>
						);
					})}
				{/* olbrzym z tektury */}
				{topple < 1 && (
					<g transform={`translate(${gx} 800) rotate(${-topple * 88}) scale(${giantS * (1 - flat * 0.95) + flat * 0.05 * giantS} ${giantS})`}>
						<Giant f={f} />
						{flat > 0.3 && (
							<g opacity={flat}>
								<rect x={-14} y={-600} width={28} height={600} fill="#B08A5E" stroke={P.navy} strokeWidth={4} />
							</g>
						)}
					</g>
				)}
				{topple >= 1 && (
					<g transform={`translate(${gx} 800) rotate(-88) scale(0.06 ${giantS})`}>
						<rect x={-130} y={-600} width={260} height={600} fill="#B08A5E" stroke={P.navy} strokeWidth={60} />
					</g>
				)}
				{flat > 0.5 && f < K.l5 + 6 && (
					<G x={gx + 220} y={520} s={1.3 * pk(f, K.pien + 2)} o={1 - prog(f, K.l5 - 4, 8)}>
						<rect x={-130} y={-40} width={260} height={74} rx={14} fill={P.white} stroke={P.navy} strokeWidth={6} />
						<FText text="tektura" x={0} y={12} size={46} fill={P.red} />
					</G>
				)}
				{dust > 0 && dust < 1 &&
					Array.from({length: 12}).map((_, i) => (
						<circle key={i} cx={gx - 40 - i * (giantS * 52)} cy={790 - dust * (30 + hsh(i) * 70)} r={30 + dust * 50} fill={P.grey} opacity={0.85 * (1 - dust)} />
					))}
				{/* samoloty z logo krążą wokół */}
				{f >= K.linie - 4 &&
					topple < 0.5 &&
					planes.map((i) => {
						const a = (f - K.linie) / 40 + (i * Math.PI * 2) / 3;
						const R = 520 + grow * 160;
						const x = gx + Math.cos(a) * R;
						const y = 360 + Math.sin(a) * 160 * (1 + grow * 0.3);
						const front = Math.sin(a) > 0;
						return (
							<G key={i} x={x} y={y} s={(0.45 + (front ? 0.2 : 0)) * pk(f, K.linie - 4 + i * 4)} r={Math.cos(a) > 0 ? 10 : -10} o={1 - prog(f, K.pien, 8)}>
								<g transform={`scale(${Math.cos(a) > 0 ? -1 : 1} 1)`}>
									<Plane tail={<FText text="AG" x={0} y={0} size={40} fill={P.navy} />} />
								</g>
							</G>
						);
					})}
				{f >= K.logo - 2 && f < K.loty + 6 && (
					<G x={1520} y={260} s={pk(f, K.logo - 2)} o={1 - prog(f, K.loty, 6)}>
						<rect x={-150} y={-46} width={300} height={84} rx={16} fill={P.navy} />
						<FText text="logo na ogonie" x={0} y={12} size={38} fill={P.gold} />
					</G>
				)}
				{f >= K.loty - 2 && f < K.l4 && (
					<g opacity={1 - prog(f, K.l4 - 8, 8)}>
						{Array.from({length: 7}).map((_, i) => {
							const p = ip(f, K.loty + i * 3, K.loty + 16 + i * 3, 0, 1, EOUT);
							const x1 = 200 + i * 240;
							const y1 = 160 + (i % 2) * 60;
							return <path key={i} d={`M ${gx} 330 Q ${(gx + x1) / 2} ${60} ${x1} ${y1}`} fill="none" stroke={P.red} strokeWidth={6} strokeDasharray="14 10" pathLength={1} strokeDashoffset={0} opacity={p} />;
						})}
						<FText text="loty w całej Europie" x={gx} y={120} size={44} fill={P.navy} stroke={P.bg} sw={8} opacity={prog(f, K.europie, 8)} />
					</g>
				)}
				{grow > 0 && topple < 0.2 &&
					Array.from({length: 10}).map((_, i) => {
						const a = (i / 10) * Math.PI * 2 + f / 60;
						return <line key={i} x1={gx + Math.cos(a) * 200} y1={420 + Math.sin(a) * 200} x2={gx + Math.cos(a) * (420 + 60 * grow)} y2={420 + Math.sin(a) * (420 + 60 * grow)} stroke={P.goldLight} strokeWidth={14} strokeLinecap="round" opacity={0.35 * grow * (1 - flat)} />;
					})}
				{f >= K.poteg - 2 && flat < 0.3 && (
					<G x={1560} y={600} s={pk(f, K.poteg - 2)}>
						<rect x={-130} y={-46} width={260} height={84} rx={16} fill={P.gold} stroke={P.navy} strokeWidth={6} />
						<FText text="potęga?" x={0} y={12} size={48} fill={P.navy} />
					</G>
				)}
				{/* soczewka oka zaraz po cięciu */}
				{lens < 1 && f >= CUT && <path d={`M -200 -200 L 2120 -200 L 2120 1280 L -200 1280 Z M ${960 - 1200 * lens - 60} 470 Q 960 ${470 - 700 * lens - 40} ${960 + 1200 * lens + 60} 470 Q 960 ${470 + 700 * lens + 40} ${960 - 1200 * lens - 60} 470 Z`} fill={P.navy} fillRule="evenodd" />}
			</g>
		</g>
	);
};

export const AmberL9: React.FC = () => (
	<AmberStage lines={LINES} vo="am4b_vo.wav" keys={KEYS} hits={HITS}>
		{(f) => <World f={f} />}
	</AmberStage>
);
