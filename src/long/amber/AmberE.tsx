// Amber Gold, zakończenie (E1–E7, tylko 16:9): deska rozdzielcza z czterema kontrolkami piramidy.
// 1 % (wysoki gwarantowany zysk, waga zysk/ryzyko), 2 ! (lista ostrzeżeń KNF od 2009), 3 przekreślone oko (brak sprawozdań,
// sztabka → kartka), 4 przekreślony parasol (to nie bank, żaden fundusz nie oddał oszczędności). Potem pytanie litera po literze
// i ekran końcowy: wolne pola na dwa kafelki i przycisk subskrypcji (ostatnie ok. 18 s).
import React from 'react';
import {LINES} from './am7.gen';
import {AmberStage, WithCard, CardScene, makeT, endOf, ip, pk, live, hsh, arcPt, EIO, EOUT, EIN, EBACK, type CK, type Hit, P, G, Mini, Coin, FText, prog, Room, GoldBar, Cert, VaultDoor, Plane} from './kit';
import {Lamp, Calendar, Pile, Magnifier} from './AmberR2';

const T = makeT(LINES);
const CARD = 60;
const OUTRO = 300;
const SCENE = endOf(LINES) + OUTRO;
export const E_FRAMES = CARD + SCENE;
export const E_ENDSCREEN_FROM = CARD + T(15);

const K = {
	l1: T(1),
	widac: T(1, 'widać'),
	l2: T(2),
	zysk2: T(2, 'zysk'),
	gwar: T(2, 'gwarantowany'),
	l3: T(3),
	l4: T(4),
	ryzyko: T(4, 'ryzyko'),
	l5: T(5),
	bez: T(5, 'bez'),
	brac: T(5, 'brać'),
	l6: T(6),
	kolejnych: T(6, 'kolejnych'),
	l7: T(7),
	ostrz: T(7, 'ostrzeżenie'),
	l8: T(8),
	knf: T(8, 'knf'),
	l9: T(9),
	y2009: T(9, '2009'),
	l10: T(10),
	przejr: T(10, 'przejrzystości'),
	l11: T(11),
	spraw: T(11, 'sprawozdań'),
	zamiast: T(11, 'zamiast'),
	kartke: T(11, 'kartkę'),
	l12: T(12),
	gwarancji: T(12, 'gwarancji'),
	l13: T(13),
	bank: T(13, 'bank'),
	runelo: T(13, 'runęło'),
	fundusz: T(13, 'fundusz'),
	l14: T(14),
	pytanie: T(14, 'pytanie'),
	skad: T(14, 'skąd'),
	ods: T(14, 'odsetki'),
	l15: T(15),
	sub: T(15, 'zasubskrybuj'),
	l16: T(16),
	komentarzu: T(16, 'komentarzu'),
	end: endOf(LINES),
};
const LIGHTS = [K.l2, K.l7, K.l10, K.l12];
const KEYS: CK[] = [
	{f: 0, x: 960, y: 420, z: 1.15},
	{f: K.l1 + 10, x: 960, y: 470, z: 1},
	{f: K.l2 + 6, x: 960, y: 500, z: 1.04},
	{f: K.l6 + 10, x: 960, y: 500, z: 1.06},
	{f: K.l7 + 6, x: 960, y: 480, z: 1.02},
	{f: K.l10 + 6, x: 960, y: 480, z: 1.04},
	{f: K.l12 + 6, x: 960, y: 480, z: 1.02},
	{f: K.l14, x: 960, y: 470, z: 1.06},
	{f: K.skad, x: 960, y: 470, z: 1.12},
	{f: K.l15, x: 960, y: 470, z: 1},
	{f: SCENE, x: 960, y: 470, z: 1},
];
const s = (fr: number) => fr / 30;
const HITS: Hit[] = [
	...LIGHTS.map((a): Hit => ({t: s(a + 2), kind: 'punch', amp: 0.6})),
	{t: s(K.bez + 6), kind: 'shake', amp: 0.5},
	{t: s(K.y2009), kind: 'punch', amp: 0.4},
	{t: s(K.kartke), kind: 'punch', amp: 0.4},
	{t: s(K.runelo), kind: 'both', amp: 0.6},
	{t: s(K.skad), kind: 'both', amp: 0.6},
];

// --- kontrolki ---
const Icon: React.FC<{i: number; c: string}> = ({i, c}) => {
	if (i === 0) return <FText text="%" x={0} y={26} size={78} fill={c} />;
	if (i === 1) return <FText text="!" x={0} y={30} size={90} fill={c} />;
	if (i === 2)
		return (
			<g fill="none" stroke={c} strokeWidth={8} strokeLinecap="round">
				<path d="M -40 0 Q 0 -36 40 0 Q 0 36 -40 0 Z" />
				<circle r={12} fill={c} />
				<line x1={-40} y1={34} x2={40} y2={-34} />
			</g>
		);
	return (
		<g fill="none" stroke={c} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
			<path d="M -42 4 Q -42 -36 0 -36 Q 42 -36 42 4 Q 28 -6 14 4 Q 0 -6 -14 4 Q -28 -6 -42 4 Z" />
			<path d="M 0 4 L 0 34 Q 0 42 -10 40" />
			<line x1={-40} y1={38} x2={40} y2={-40} />
		</g>
	);
};
const Dashboard: React.FC<{f: number; scale?: number}> = ({f}) => {
	const allBlink = f >= K.l14 && f < K.l15 ? (Math.floor(f / 6) % 2 ? 1 : 0.35) : null;
	const labels = ['zysk', 'ostrzeżenie', 'przejrzystość', 'gwarancja'];
	return (
		<g>
			<rect x={-560} y={-110} width={1120} height={220} rx={110} fill="#1A2433" stroke={P.navy} strokeWidth={8} />
			{[0, 1, 2, 3].map((i) => {
				const on = allBlink ?? (f >= LIGHTS[i] ? 1 : 0);
				const pop = f >= LIGHTS[i] ? pk(f, LIGHTS[i]) : 1;
				const col = on > 0.5 ? (i === 1 ? '#F2A541' : P.red) : '#3A4658';
				return (
					<G key={i} x={-390 + i * 260} y={-8} s={pop}>
						{on > 0.5 && <circle r={92} fill={col} opacity={0.25} />}
						<circle r={70} fill={on > 0.5 ? '#2C1E1A' : '#222D3D'} stroke={col} strokeWidth={8} />
						<Icon i={i} c={on > 0.5 ? (i === 1 ? '#F7C47A' : '#F08A6E') : '#4A566A'} />
						<FText text={labels[i]} x={0} y={128} size={30} fill={on > 0.5 ? P.navy : P.slate} />
					</G>
				);
			})}
		</g>
	);
};
const Umbrella: React.FC<{crossed: number}> = ({crossed}) => (
	<g>
		<path d="M -200 0 Q -200 -170 0 -170 Q 200 -170 200 0 Q 150 -30 100 0 Q 50 -30 0 0 Q -50 -30 -100 0 Q -150 -30 -200 0 Z" fill={P.grass} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		<FText text="BFG" x={0} y={-70} size={56} fill={P.white} />
		<path d="M 0 0 L 0 220 Q 0 250 -30 244" fill="none" stroke={P.navy} strokeWidth={10} strokeLinecap="round" />
		{crossed > 0 && <path d="M -230 -190 L 230 240" stroke={P.red} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - crossed} />}
	</g>
);

const World: React.FC<{f: number}> = ({f}) => {
	const dashUp = ip(f, K.l15 - 10, K.l15 + 20, 0, 1, EIO);
	const stage = (a: number, b: number) => live(f, a, b, 10);
	// 1: waga zysk/ryzyko
	const s1 = stage(K.l2 - 4, K.l7 - 4);
	const riskOff = ip(f, K.bez - 2, K.bez + 14, 0, 1, EIN);
	const tilt = ip(f, K.l4 - 6, K.l4 + 8, 0, 0, EIO) + ip(f, K.bez + 6, K.bez + 20, 0, 24, EBACK);
	// 2: lista KNF
	const s2 = stage(K.l7 - 2, K.l10 - 4);
	// 3: brak przejrzystości
	const s3 = stage(K.l10 - 2, K.l12 - 4);
	const morph = ip(f, K.zamiast, K.kartke, 0, 1, EIO);
	// 4: brak gwarancji
	const s4 = stage(K.l12 - 2, K.l14 - 4);
	// 6: pytanie
	const s6 = stage(K.l14 - 2, K.l15 + 4);
	const question = 'Skąd ta firma weźmie pieniądze na moje odsetki?';
	const typed = Math.round(ip(f, K.skad - 4, K.ods + 14, 0, question.length));
	const viewerQ = ip(f, K.pytanie - 4, K.pytanie + 10, 0, 1, EIO);
	// 7: ekran końcowy
	const end = ip(f, K.l15 - 6, K.l15 + 24, 0, 1, EOUT);
	return (
		<g>
			<Room w={1920} h={1080} floor={800} />
			{f < K.l2 && (
				<G x={960} y={560} s={pk(f, 4)} o={1 - prog(f, K.l2 - 8, 8)}>
					<path d="M 0 -300 L 230 40 L -230 40 Z" transform="translate(0 0)" fill="none" stroke={P.gold} strokeWidth={14} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ip(f, 10, K.l1 + 10, 0, 1, EIO)} opacity={0.6} />
					{[0, 1, 2, 3].map((i) => (
						<G key={i} x={[-150, -50, 50, 150][i]} y={-60 - (i % 2) * 70} s={pk(f, K.l1 + 10 + i * 6)}>
							<circle r={34} fill={P.red} stroke={P.navy} strokeWidth={5} />
							<FText text={String(i + 1)} x={0} y={14} size={40} fill={P.white} />
						</G>
					))}
					<FText text="4 sygnały piramidy" x={0} y={130} size={72} fill={P.navy} />
					<FText text="widoczne od początku" x={0} y={200} size={48} fill={P.slate} opacity={prog(f, K.widac, 8)} />
				</G>
			)}
			{/* 1: zysk bez ryzyka */}
			{s1 > 0 && (
				<g opacity={s1}>
					<G x={760} y={700}>
						<path d="M -40 0 L 40 0 L 0 -70 Z" fill={P.slate} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
						<g transform={`translate(0 -70) rotate(${tilt})`}>
							<rect x={-380} y={-12} width={760} height={24} rx={12} fill="#8C6A4A" stroke={P.navy} strokeWidth={6} />
							<G x={-300} y={-12}>
								<rect x={-80} y={-110} width={160} height={110} rx={12} fill={P.gold} stroke={P.navy} strokeWidth={6} />
								<FText text="zysk" x={0} y={-42} size={44} fill={P.navy} />
							</G>
							{riskOff < 1 && (
								<G x={300 + riskOff * 200} y={-12 + riskOff * riskOff * 600} r={riskOff * 70} o={1 - riskOff}>
									<rect x={-80} y={-110} width={160} height={110} rx={12} fill={P.slate} stroke={P.navy} strokeWidth={6} />
									<FText text="ryzyko" x={0} y={-42} size={40} fill={P.white} />
								</G>
							)}
						</g>
					</G>
					{f >= K.l3 && f < K.l5 && (
						<G x={1500} y={520} s={pk(f, K.l3)} o={1 - prog(f, K.l5 - 6, 6)}>
							<rect x={-280} y={-60} width={560} height={130} rx={18} fill={P.white} stroke={P.navy} strokeWidth={6} />
							<FText text="wyższy zysk" x={0} y={-6} size={44} fill={P.goldDark} />
							<FText text="= wyższe ryzyko" x={0} y={46} size={44} fill={P.red} opacity={prog(f, K.ryzyko - 4, 6)} />
						</G>
					)}
					{f >= K.gwar - 2 && f < K.l3 + 4 && (
						<G x={1500} y={480} s={pk(f, K.gwar - 2)}>
							<rect x={-220} y={-46} width={440} height={86} rx={14} fill={P.red} />
							<FText text="GWARANTOWANE" x={0} y={14} size={46} fill={P.white} />
						</G>
					)}
					{f >= K.brac - 6 &&
						Array.from({length: 6}).map((_, i) => {
							const per = 24;
							const t = (((f + i * 4) % per) + per) % per / per;
							const p = arcPt(t, 1720, 640, 470, 560, 180);
							return (
								<G key={i} x={p.x} y={p.y} r={t * 300} o={prog(f, K.brac - 6, 8)}>
									<Coin r={22} />
								</G>
							);
						})}
					{f >= K.kolejnych - 10 && (
						<g>
							{[0, 1, 2].map((i) => (
								<G key={i} x={1640 + i * 90} y={790} s={0.9 * ip(f, K.kolejnych - 10 + i * 4, K.kolejnych + 4 + i * 4, 0, 1, EBACK)}>
									<Mini suit={['#8C7A5E', '#5C6B7A', '#7A4E3A'][i]} hair="#2B2420" up={0.4} />
								</G>
							))}
							<FText text="kolejni klienci" x={1730} y={510} size={38} fill={P.slate} opacity={prog(f, K.kolejnych, 8)} />
						</g>
					)}
				</g>
			)}
			{/* 2: lista ostrzeżeń KNF */}
			{s2 > 0 && (
				<g opacity={s2}>
					<G x={960} y={360}>
						<Lamp f={f} on={1} beam={520} />
					</G>
					<rect x={560} y={380} width={800} height={380} rx={16} fill={P.white} stroke={P.navy} strokeWidth={8} />
					<rect x={560} y={380} width={800} height={80} rx={16} fill={P.navy} />
					<FText text="LISTA OSTRZEŻEŃ PUBLICZNYCH KNF" x={960} y={434} size={38} fill={P.gold} />
					{[0, 1, 2, 3].map((i) =>
						i === 2 ? (
							<g key={i} opacity={prog(f, K.l9 - 2, 8)}>
								<rect x={590} y={490 + i * 64} width={740} height={54} rx={8} fill={P.red} opacity={0.15} />
								<FText text="Amber Gold" x={610} y={530 + i * 64} size={44} fill={P.red} anchor="start" />
							</g>
						) : (
							<rect key={i} x={610} y={505 + i * 64} width={[420, 520, 0, 360][i]} height={24} rx={12} fill={P.grey} />
						),
					)}
					<FText text="dostępna dla każdego" x={960} y={720} size={36} fill={P.slate} opacity={prog(f, K.l8 + 20, 8)} />
					{f >= K.l8 && (
						<G x={1320 + Math.sin((f - K.l8) / 10) * 40} y={600 + Math.cos((f - K.l8) / 12) * 30} s={1.1}>
							<Magnifier r={50} />
						</G>
					)}
					{f >= K.y2009 - 2 && (
						<G x={1560} y={560} s={pk(f, K.y2009 - 2)} r={4}>
							<Calendar text="2009" top="od" w={200} />
						</G>
					)}
				</g>
			)}
			{/* 3: brak przejrzystości */}
			{s3 > 0 && (
				<g opacity={s3}>
					<rect x={360} y={420} width={560} height={340} fill="#B08A5E" stroke={P.navy} strokeWidth={8} />
					<rect x={376} y={436} width={528} height={308} fill="#7A5C3E" />
					{Array.from({length: 7}).map((_, j) =>
						j === 3 ? (
							<rect key={j} x={392 + j * 72} y={560} width={60} height={180} rx={5} fill="#24180F" stroke={P.red} strokeWidth={6} strokeDasharray="14 10" />
						) : (
							<rect key={j} x={392 + j * 72} y={560} width={60} height={180} rx={5} fill={['#5C6B7A', '#7A4E3A', '#6E7D61', '#33445A', '#8C7A5E', '#9C5A40', '#4A5A6E'][j]} stroke={P.navy} strokeWidth={4} />
						),
					)}
					<FText text="sprawozdania finansowe" x={640} y={400} size={36} fill={P.navy} opacity={prog(f, K.spraw - 4, 8)} />
					<G x={1360} y={590} s={1.4}>
						<g opacity={1 - morph} transform={`scale(${1 - morph * 0.5})`}>
							<GoldBar w={160} glow={0.6} />
						</g>
						{morph > 0 && (
							<g opacity={morph} transform={`scale(${0.5 + morph * 0.5})`}>
								<Cert w={110} />
							</g>
						)}
					</G>
					<FText text={morph > 0.5 ? 'kartka' : 'złoto?'} x={1360} y={760} size={44} fill={morph > 0.5 ? P.red : P.goldDark} opacity={prog(f, K.zamiast - 4, 6)} />
				</g>
			)}
			{/* 4: brak gwarancji */}
			{s4 > 0 && (
				<g opacity={s4}>
					<G x={960} y={460} s={0.9}>
						<Umbrella crossed={ip(f, K.bank, K.bank + 14, 0, 1, EIO)} />
					</G>
					{f >= K.runelo - 6 &&
						Array.from({length: 26}).map((_, i) => {
							const per = 18;
							const t = (((f + i * 5) % per) + per) % per / per;
							return <line key={i} x1={600 + hsh(i) * 720} y1={300 + t * 520} x2={590 + hsh(i) * 720} y2={330 + t * 520} stroke={P.slate} strokeWidth={5} strokeLinecap="round" opacity={0.6 * prog(f, K.runelo - 6, 8)} />;
						})}
					<G x={960} y={790}>
						<Pile n={5} r={26} />
					</G>
					{f >= K.fundusz - 4 && (
						<G x={1500} y={520} s={pk(f, K.fundusz - 4)}>
							<rect x={-260} y={-56} width={520} height={112} rx={16} fill={P.navy} />
							<FText text="żaden fundusz" x={0} y={-6} size={44} fill={P.gold} />
							<FText text="nie oddał oszczędności" x={0} y={38} size={34} fill={P.bg} />
						</G>
					)}
					{f >= K.bank - 6 && (
						<G x={420} y={520} s={pk(f, K.bank - 6)}>
							<rect x={-200} y={-46} width={400} height={86} rx={14} fill={P.red} />
							<FText text="to nie był bank" x={0} y={12} size={44} fill={P.white} />
						</G>
					)}
				</g>
			)}
			{/* 6: pytanie */}
			{s6 > 0 && (
				<g opacity={s6}>
					<G x={420} y={790} s={1.6}>
						<g opacity={1 - viewerQ}>
							<Mini suit="#5C6B7A" hair="#2B2420" />
						</g>
						{viewerQ > 0 && (
							<G y={-130} s={viewerQ}>
								<circle r={90} fill={P.white} stroke={P.navy} strokeWidth={8} />
								<FText text="?" x={0} y={50} size={150} fill={P.red} />
							</G>
						)}
					</G>
					<rect x={700} y={440} width={1060} height={260} rx={24} fill={P.white} stroke={P.navy} strokeWidth={8} />
					<FText text={question.slice(0, Math.min(typed, 21))} x={760} y={540} size={64} fill={P.navy} anchor="start" />
					<FText text={question.slice(21, Math.max(21, typed))} x={760} y={630} size={64} fill={P.red} anchor="start" />
				</g>
			)}
			{/* deska rozdzielcza */}
			<G x={960} y={190 - dashUp * 40} s={1 - dashUp * 0.42} o={1 - dashUp * 0.0}>
				<Dashboard f={f} />
			</G>
			{/* 7: ekran końcowy: wolne pola na kafelki i subskrypcję */}
			{end > 0 && (
				<g opacity={end}>
					<FText text="AMBER GOLD 2009–2012" x={960} y={320} size={64} fill={P.navy} />
					<FText text="Szczęście Pieniędzy Nie Daje" x={960} y={378} size={36} fill={P.slate} />
					{[
						{x: 150, y: 420},
						{x: 1110, y: 420},
					].map((t, i) => (
						<rect key={i} x={t.x} y={t.y} width={660} height={372} rx={18} fill="none" stroke={P.navy} strokeWidth={3} strokeDasharray="10 12" opacity={0.18} />
					))}
					{/* ikony świata filmu wzdłuż dołu */}
					{[
						<VaultDoor key="v" r={60} spin={f} />,
						<g key="p" transform="scale(0.32)"><Plane /></g>,
						<GoldBar key="g" w={110} />,
						<Cert key="c" w={70} />,
						<g key="l" transform="scale(0.6)"><Lamp f={f} on={1} beam={0} /></g>,
					].map((el, i) => (
						<G key={i} x={960 + Math.sin(f / 30 + i * 2) * 20} y={[470, 560, 650, 730, 800][i] + Math.sin(f / 20 + i) * 6} s={0.8 * ip(f, K.l15 + i * 4, K.l15 + 14 + i * 4, 0, 1, EBACK)} o={0.9}>
							{el}
						</G>
					))}
				</g>
			)}
		</g>
	);
};

export const AmberE: React.FC = () => (
	<WithCard cardFrames={CARD} card={<CardScene num="Zakończenie" title="4 sygnały piramidy" icon={<G y={-40} s={0.5}><Dashboard f={0} /></G>} frames={CARD} />}>
		<AmberStage lines={LINES} vo="am7_vo.wav" keys={KEYS} hits={HITS}>
			{(f) => <World f={f} />}
		</AmberStage>
	</WithCard>
);
