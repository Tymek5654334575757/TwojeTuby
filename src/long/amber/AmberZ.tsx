// Amber Gold, śródtytuł z zachętą (Z1, tylko 16:9): banknot kanału wjeżdża i faluje jak flaga, wokół historie firm,
// pasek „do samego końca”, liczby i młotek, przycisk subskrypcji z kliknięciem, kalendarz tygodnia, rozbierany sklep.
import React from 'react';
import {LINES} from './am2z.gen';
import {AmberStage, makeT, endOf, ip, pk, swing, EIO, EOUT, EBACK, type CK, type Hit, P, G, FText, prog, Room, Columns, Plane, GoldBar} from './kit';
import {Gavel, strike, Shop} from './AmberR2';

const T = makeT(LINES);
export const Z_FRAMES = endOf(LINES) + 18;
const K = {
	jesli: T(0),
	hist: T(0, 'historie'),
	opow: T(0, 'opowiedziane'),
	konca: T(0, 'końca'),
	licz: T(0, 'liczbami'),
	wyr: T(0, 'wyrokami'),
	sub: T(0, 'zasubskrybuj'),
	w1: T(0, 'szczęście'),
	w2: T(0, 'pieniędzy'),
	w3: T(0, 'nie'),
	w4: T(0, 'daje'),
	co: T(1),
	rozb: T(1, 'rozbieramy'),
	jedna: T(1, 'jedną'),
};
const KEYS: CK[] = [
	{f: 0, x: 960, y: 470, z: 1.08},
	{f: K.licz, x: 960, y: 470, z: 1},
	{f: K.sub + 10, x: 960, y: 520, z: 1.1},
	{f: K.co - 4, x: 960, y: 480, z: 1.02},
	{f: Z_FRAMES, x: 1000, y: 460, z: 1.08},
];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	{t: s(12), kind: 'punch', amp: 0.5},
	{t: s(K.wyr + 4), kind: 'punch', amp: 0.6},
	{t: s(K.sub + 14), kind: 'both', amp: 0.6},
	{t: s(K.jedna), kind: 'punch', amp: 0.5},
];

// Banknot kanału: kontur faluje, napis podświetla się słowo po słowie.
const ChannelNote: React.FC<{f: number; lit: number[]}> = ({f, lit}) => {
	const w = 760;
	const h = 340;
	const n = 16;
	const wave = (x: number) => Math.sin(x / 110 - f / 5) * 10;
	let d = '';
	for (let i = 0; i <= n; i++) {
		const x = -w / 2 + (i / n) * w;
		d += `${i ? 'L' : 'M'} ${x} ${-h / 2 + wave(x)} `;
	}
	for (let i = n; i >= 0; i--) {
		const x = -w / 2 + (i / n) * w;
		d += `L ${x} ${h / 2 + wave(x)} `;
	}
	const words = ['SZCZĘŚCIE', 'PIENIĘDZY', 'NIE', 'DAJE'];
	const xs = [80, -40, 156, 283];
	return (
		<g transform={`skewY(${Math.sin(f / 6) * 2})`}>
			<path d={d + 'Z'} fill={P.grass} stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
			<path d={d + 'Z'} fill="none" stroke={P.greenLight} strokeWidth={4} transform="scale(0.92)" opacity={0.7} />
			<circle cx={-280} cy={wave(-280) * 0.5} r={80} fill={P.greenLight} stroke={P.navy} strokeWidth={6} />
			<FText text="zł" x={-280} y={24 + wave(-280) * 0.5} size={74} fill={P.navy} />
			{words.map((word, wi) => {
				const x = xs[wi];
				const y = wi === 0 ? -30 : 62;
				const on = lit[wi];
				const ww = [430, 260, 90, 120][wi];
				return (
					<g key={wi}>
						{on > 0 && <rect x={x - (ww / 2) * on} y={y + 14} width={ww * on} height={10} rx={5} fill={P.gold} />}
						<FText text={word} x={x} y={y + wave(x) * 0.5} size={wi === 0 ? 76 : 48} fill={on > 0.5 ? P.white : P.navy} />
					</g>
				);
			})}
		</g>
	);
};

const Cursor: React.FC = () => (
	<path d="M 0 0 L 0 64 L 16 50 L 28 76 L 40 70 L 28 45 L 50 45 Z" fill={P.white} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
);
const Bell: React.FC<{ang: number}> = ({ang}) => (
	<g transform={`rotate(${ang} 0 -40)`}>
		<path d="M -34 10 Q -34 -46 0 -46 Q 34 -46 34 10 L 44 22 L -44 22 Z" fill={P.gold} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<circle cy={32} r={10} fill={P.navy} />
		<circle cy={-52} r={8} fill={P.gold} stroke={P.navy} strokeWidth={4} />
	</g>
);

export const AmberZ: React.FC = () => (
	<AmberStage lines={LINES} vo="am2z_vo.wav" keys={KEYS} hits={HITS}>
		{(f) => {
			const inX = ip(f, 0, 14, -700, 960, EBACK);
			const lit = [K.w1, K.w2, K.w3, K.w4].map((a) => ip(f, a, a + 6, 0, 1, EOUT));
			const bar = ip(f, K.opow, K.konca + 6, 0, 1, EIO);
			const click = K.sub + 14;
			const curP = ip(f, K.sub + 2, click - 2, 0, 1, EIO);
			const pressed = f >= click;
			const btnS = pk(f, K.sub - 2) * (f >= click && f < click + 4 ? 0.9 : 1);
			const tags = ['851 mln', '1%', '19 mln', '300 mln'];
			const shopParts = ip(f, K.rozb, K.jedna + 10, 0, 1, EOUT);
			return (
				<g>
					<Room w={1920} h={1080} floor={800} />
					{/* historie firm wokół banknotu */}
					{[
						{x: 300, y: 250, at: K.hist, el: <Shop w={220} />},
						{x: 1640, y: 200, at: K.hist + 4, el: <Plane tail={<FText text="AG" x={0} y={0} size={34} fill={P.gold} />} />},
						{x: 300, y: 720, at: K.hist + 8, el: <Columns w={180} h={170} label="BANK" labelSize={34} />},
						{x: 1640, y: 560, at: K.hist + 12, el: <GoldBar w={170} glow={0.5} />},
					].map((o, i) => (
						<G key={i} x={o.x + Math.sin((f + i * 40) / 30) * 8} y={o.y + Math.cos((f + i * 30) / 26) * 6} s={0.9 * pk(f, o.at)} o={1 - prog(f, K.co - 6, 10)}>
							{o.el}
						</G>
					))}
					{/* liczby i wyroki */}
					{tags.map((t, i) => {
						const a = K.licz + i * 4;
						if (f < a) return null;
						const p = ip(f, a, a + 16, 0, 1, EOUT);
						const ang = (-140 + i * 50) * (Math.PI / 180);
						return (
							<G key={t} x={960 + Math.cos(ang) * 460 * p} y={430 + Math.sin(ang) * 330 * p} s={pk(f, a)} o={1 - prog(f, K.sub - 4, 8)} r={(i - 1.5) * 6}>
								<rect x={-100} y={-40} width={200} height={76} rx={14} fill={P.navy} />
								<FText text={t} x={0} y={14} size={44} fill={P.gold} />
							</G>
						);
					})}
					{f >= K.wyr - 10 && (
						<G x={1500} y={760} s={pk(f, K.wyr - 10)} o={1 - prog(f, K.sub - 4, 8)}>
							<Gavel ang={strike(f, [K.wyr + 4])} />
						</G>
					)}
					{/* banknot */}
					<G x={inX} y={400 - 210 * ip(f, K.co - 4, K.co + 10, 0, 1, EIO) + swing(f, 14, 12)} r={Math.sin(f / 9) * 1.5} s={1 - 0.4 * ip(f, K.co - 4, K.co + 10, 0, 1, EIO)}>
						<ChannelNote f={f} lit={lit} />
					</G>
					{/* pasek „do samego końca” */}
					<g opacity={prog(f, K.opow - 2, 6) * (1 - prog(f, K.licz + 10, 8))}>
						<rect x={560} y={630} width={800} height={26} rx={13} fill={P.grey} stroke={P.navy} strokeWidth={5} />
						<rect x={560} y={630} width={800 * bar} height={26} rx={13} fill={P.red} />
						<circle cx={560 + 800 * bar} cy={643} r={22} fill={P.red} stroke={P.navy} strokeWidth={5} />
						{bar >= 1 && <FText text="do końca" x={1440} y={658} size={44} fill={P.navy} anchor="start" opacity={prog(f, K.konca + 6, 6)} />}
					</g>
					{/* subskrypcja */}
					{f >= K.sub - 2 && (
						<g opacity={1 - prog(f, K.co + 20, 10)}>
							<G x={960} y={680} s={btnS}>
								<rect x={-230} y={-54} width={460} height={108} rx={54} fill={pressed ? P.grey : P.red} stroke={P.navy} strokeWidth={7} />
								<FText text={pressed ? 'SUBSKRYBUJESZ' : 'SUBSKRYBUJ'} x={0} y={20} size={pressed ? 50 : 58} fill={pressed ? P.navy : P.white} />
							</G>
							{pressed && (
								<G x={1290} y={680} s={pk(f, click)}>
									<Bell ang={Math.sin((f - click) / 2) * 24 * Math.exp(-(f - click) / 20)} />
								</G>
							)}
							{f < click + 24 && (
								<G x={1400 - 360 * curP} y={900 - 210 * curP} s={f >= click && f < click + 4 ? 0.85 : 1}>
									<Cursor />
								</G>
							)}
						</g>
					)}
					{/* co tydzień: kalendarz tygodnia */}
					{f >= K.co - 4 && (
						<G x={540} y={540} s={pk(f, K.co - 4)}>
							<rect x={-250} y={-150} width={500} height={250} rx={18} fill={P.white} stroke={P.navy} strokeWidth={7} />
							<rect x={-250} y={-150} width={500} height={70} rx={18} fill={P.red} />
							<FText text="CO TYDZIEŃ" x={0} y={-100} size={42} fill={P.white} />
							{['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'].map((d, i) => {
								const on = i === 5 && f >= K.co + 8;
								return (
									<g key={d}>
										<rect x={-230 + i * 66} y={-50} width={56} height={120} rx={8} fill={on ? P.goldLight : P.paper} stroke={P.navy} strokeWidth={4} />
										<FText text={d} x={-202 + i * 66} y={-14} size={28} fill={P.navy} />
										{on && <path d={`M ${-218 + i * 66} 30 L ${-204 + i * 66} 48 L ${-180 + i * 66} 10`} fill="none" stroke={P.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={prog(f, K.co + 8, 4)} />}
									</g>
								);
							})}
						</G>
					)}
					{/* jedna historia rozebrana na części */}
					{f >= K.rozb - 6 && (
						<G x={1380} y={560} s={pk(f, K.rozb - 6)}>
							{[
								[0, -230, -150, -120, -20],
								[0, -120, 140, -60, 25],
								[-90, -20, -230, 70, -30],
								[60, -20, 200, 90, 18],
							].map(([x0, y0, dx, dy, r], i) => (
								<g key={i} transform={`translate(${x0 + dx * shopParts} ${y0 + dy * shopParts}) rotate(${r * shopParts})`}>
									{i === 0 && (
										<g>
											<rect x={-150} y={-30} width={300} height={60} rx={8} fill={P.gold} stroke={P.navy} strokeWidth={5} />
											<FText text="HISTORIA" x={0} y={14} size={36} fill={P.navy} />
										</g>
									)}
									{i === 1 && <rect x={-150} y={-60} width={300} height={120} fill={P.paper} stroke={P.navy} strokeWidth={6} />}
									{i === 2 && <rect x={-60} y={-50} width={120} height={90} fill={P.sky} stroke={P.navy} strokeWidth={5} />}
									{i === 3 && <rect x={-45} y={-80} width={90} height={160} fill={P.navy} stroke={P.navy} strokeWidth={5} />}
								</g>
							))}
							{shopParts > 0.5 &&
								[0, 1, 2].map((i) => (
									<FText key={i} text={['liczby', 'wyroki', 'decyzje'][i]} x={-160 + i * 160} y={150} size={34} fill={P.slate} opacity={prog(f, K.jedna + 4 + i * 4, 6)} />
								))}
						</G>
					)}
				</g>
			);
		}}
	</AmberStage>
);
