// Manipulacja 4: zostały tylko 2 sztuki (reguła niedoboru). Film 16:9 + short 9:16.
import React from 'react';
import {LINES} from './mp4.gen';
import {
	C, Rough, Txt, G, makeT, ip, pk, live, swing, prog, hsh, arcPt, pv, on, shots, hitsAt, Stage, VHead, WithCard, TrickCard, Hero, Other, Aha,
	ExpCard, MarkTitle, Door, Jar, Cookie, Crown, Slider, Phone, Heart, Hand, Say, Check, Floor, Bar,
	CutShort, keepFrom, keepLen, ShortWithCta, RW, SC, GREY, LIGHT, FPS, type Shot,
} from './mkit';

const T = makeT(LINES);
export const S4_FRAMES = Math.round((LINES[LINES.length - 1].e + 1.0) * FPS);
const GR = SC[3];
const FL = 900;

const Shelf: React.FC<{x0: number; x1: number; y: number; seed?: number}> = ({x0, x1, y, seed = 1500}) => <Rough shape={{t: 'line', x1: x0, y1: y, x2: x1, y2: y}} o={{strokeWidth: 9, stroke: '#8A5A2B'}} seed={seed} />;
const Eye: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<Rough shape={{t: 'path', d: 'M -60 0 Q 0 -50 60 0 Q 0 50 -60 0 Z'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={1505} />
		<circle r={16} fill={C.ink} />
	</g>
);

// ---------- pokój 0: słoik „zostały tylko 2 sztuki” ----------
const R0: React.FC<{f: number; v: boolean}> = ({f, v}) => (
	<g>
		<Shelf x0={pv(v, 300, 460)} x1={pv(v, 1620, 1460)} y={640} />
		<Shelf x0={pv(v, 300, 460)} x1={pv(v, 1620, 1460)} y={300} seed={1501} />
		<G x={960} y={640} s={1.35} r={swing(f, T(1, 'ciastka'), 10)}>
			<Jar n={2} label="ciastka" w={240} />
		</G>
		<G x={960} y={pv(v, 150, 150)} r={-3}>
			<Txt text="„zostały tylko 2 sztuki”" x={0} y={0} size={pv(v, 96, 74)} color={C.red} seed={1525} />
		</G>
		{[0, 1].map((k) => (
			<G key={k} x={pv(v, k ? 1420 : 500, k ? 1300 : 620)} y={640} s={0.9} o={0.5}>
				<Jar n={0} w={200} seed={1510 + k * 10} />
			</G>
		))}
		{f >= T(1, 'ciastka') && (
			<g>
				{[0, 1].map((k) => (
					<G key={k} x={pv(v, 760 + k * 400, 760 + k * 400)} y={830} s={pk(f, T(1, 'ciastka') + k * 4)}>
						<Cookie d={90} face={1} seed={1520 + k} />
					</G>
				))}
			</g>
		)}
	</g>
);

// ---------- pokój 1: rezerwacja w telefonie ----------
const R1: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const px = pv(v, 900, 900);
	const ban = prog(f, T(3, 'ostatnie') - 4, 10);
	const eye = prog(f, T(4) - 2, 10);
	const tm = T(5, '9');
	const secs = f >= tm ? Math.max(0, 540 - Math.floor((f - tm) / 3)) : 540;
	const mm = String(Math.floor(secs / 60)).padStart(2, '0');
	const ss = String(secs % 60).padStart(2, '0');
	const heartOn = prog(f, T(6, 'Serce') - 4, 8);
	const beat = f >= T(6) ? 1 + 0.15 * Math.abs(Math.sin((f - T(6)) * (0.25 + (f - T(6)) * 0.004))) : 1;
	const pull = ip(f, T(6, 'palec') - 2, (T(6, 'przycisku') + 14) + 4, 0, 1);
	const str = prog(f, T(6, 'palec') - 8, 10);
	const hx = pv(v, 1460, 1360);
	return (
		<g>
			<G x={px} y={540} s={pv(v, 1.05, 0.95)}>
				<Phone w={420}>
					<Txt text="pokój dwuosobowy" x={0} y={-260} size={44} seed={1530} />
					<Rough shape={{t: 'rect', x: -150, y: -220, w: 300, h: 150}} o={{fill: SC[1], fillStyle: 'hachure', hachureGap: 10, strokeWidth: 5}} seed={1531} />
					<Rough shape={{t: 'rect', x: -110, y: -150, w: 220, h: 50}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 4}} seed={1532} />
					{ban > 0 && (
						<G y={-10} s={ban}>
							<Rough shape={{t: 'rect', x: -175, y: -40, w: 350, h: 80}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 4}} seed={1533} />
							<Txt text="ostatnie 2 pokoje!" x={0} y={14} size={44} color={C.paper} seed={1534} />
						</G>
					)}
					{eye > 0 && (
						<G y={90} s={eye}>
							<G x={-120} y={0} s={0.5}>
								<Eye />
							</G>
							<Txt text="12 osób ogląda" x={30} y={14} size={44} seed={1535} />
						</G>
					)}
					{f >= tm - 4 && (
						<G y={180} s={pk(f, tm - 4)}>
							<Txt text={`${mm}:${ss}`} x={0} y={16} size={72} color={C.red} seed={1536} />
						</G>
					)}
					<G y={300}>
						<Rough shape={{t: 'rect', x: -150, y: -40, w: 300, h: 80}} o={{fill: pull > 0.95 ? GR : C.yellow, fillStyle: 'solid', strokeWidth: 5}} seed={1537} />
						<Txt text="rezerwuję" x={0} y={14} size={50} seed={1538} />
					</G>
				</Phone>
			</G>
			{heartOn > 0 && (
				<G x={pv(v, 400, 560)} y={pv(v, 470, 230)} s={heartOn * beat * pv(v, 1.6, 1.2)}>
					<Heart />
				</G>
			)}
			<Hero x={hx} y={FL} s={1.2} seed={540} flip mood={f >= T(6) ? 'wow' : 'flat'} arms={pull > 0 ? 'reach' : 'down'} hands={pull > 0 ? [[-50, -135], [118 + pull * 200, -225 + pull * 50]] : undefined} strings={[{c: GR, at: 'r', p: str}]} />
		</g>
	);
};

// ---------- pokój 2: badanie 1975, studentki, dwa słoiki ----------
const DOTS = Array.from({length: 134}, (_, k) => ({x: (k % 17) * 54, y: Math.floor(k / 17) * 60, j: hsh(k)}));
const R2: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const dots = Math.round(ip(f, T(8, 'studentki') - 4, T(8, '134') + 4, 0, 134));
	const dotsOut = 1 - prog(f, T(9) - 2, 10);
	const jars = prog(f, T(9) - 4, 12);
	const two = prog(f, T(10) - 4, 12);
	const same = prog(f, T(11, 'identyczne') - 4, 10) * (1 - prog(f, T(12) - 2, 8));
	const hi = prog(f, T(12, 'wyżej') - 6, 16);
	const jA = pv(v, two > 0 ? 640 : 960, two > 0 ? 720 : 960);
	const jB = pv(v, 1280, 1200);
	const rate = (k: number, base: number, up: number) => base + up * hi;
	return (
		<g>
			<G x={960} y={220} s={0.85}>
				<ExpCard year="1975" who="Stephen Worchel i zespół" f={f} a={T(7, '1975')} out={T(8) - 2} />
			</G>
			{f >= T(7, 'rzadkość') && f < T(8) && <Txt text="rzadkość" x={960} y={620} size={130} color={C.red} draw={prog(f, T(7, 'rzadkość'), 10)} seed={1540} />}
			{dotsOut > 0 && dots > 0 && (
				<g transform={`translate(${960 - 8 * 54} 300)`} opacity={dotsOut}>
					{DOTS.slice(0, dots).map((d, k) => (
						<g key={k} transform={`translate(${d.x} ${d.y})`}>
							<circle cy={-14} r={10} fill={C.paper} stroke={C.ink} strokeWidth={3} />
							<path d="M -12 16 Q 0 -4 12 16" fill="none" stroke={C.ink} strokeWidth={3} />
						</g>
					))}
					<Txt text={`${dots}`} x={8 * 54} y={540} size={110} color={C.red} seed={1541} />
				</g>
			)}
			{jars > 0 && (
				<g opacity={jars}>
					<G x={jA} y={pv(v, 700, 640)} s={pv(v, 1.1, 0.9)}>
						<Jar n={two > 0 ? 10 : 6} w={240} label={two > 0 ? '10' : undefined} seed={1550} />
					</G>
					<g opacity={two}>
						<G x={jB} y={pv(v, 700, 640)} s={pv(v, 1.1, 0.9)}>
							<Jar n={2} w={240} label="2" seed={1560} />
						</G>
					</g>
					{[
						['chcę zjeść', 0],
						['atrakcyjne', 1],
						['cena', 2],
					].map(([l, k]) => (
						<g key={k as number} opacity={prog(f, T(9, k === 0 ? 'chciałaby' : k === 1 ? 'atrakcyjne' : 'kosztować') - 4, 8)}>
							<G x={jA} y={pv(v, 800, 730) + (k as number) * 100}>
								<Slider w={pv(v, 340, 300)} v={rate(0, 50, 0)} label={l as string} seed={1570 + (k as number) * 5} />
							</G>
							{two > 0 && (
								<G x={jB} y={pv(v, 800, 730) + (k as number) * 100} o={two}>
									<Slider w={pv(v, 340, 300)} v={rate(1, 50, 25)} label={l as string} color={C.red} seed={1590 + (k as number) * 5} />
								</G>
							)}
						</g>
					))}
					{same > 0 && (
						<G x={(jA + jB) / 2 - 90} y={pv(v, 250, 230)} s={same}>
							<Cookie d={90} />
							<Txt text="=" x={90} y={24} size={110} seed={1600} />
							<G x={180} y={0}>
								<Cookie d={90} />
							</G>
						</G>
					)}
					{f >= T(12, 'wyżej') && <Txt text="wyżej!" x={jB} y={pv(v, 300, 290)} size={90} color={C.red} draw={prog(f, T(12, 'wyżej'), 8)} seed={1601} />}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 3: zwrot akcji (zabrane ciastka) ----------
const R3: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const jx = pv(v, 640, 760);
	const dx = pv(v, 1320, 1260);
	const open = live(f, T(14, 'wchodził') - 8, T(15) - 4, 8);
	const take = T(14, 'zabierał');
	const n = Math.round(ip(f, take, take + 24, 10, 2));
	const enter = ip(f, T(14, 'wchodził') - 4, T(14, 'wchodził') + 16, dx + 40, dx - 170);
	const bars = prog(f, T(17) - 6, 12);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			<G x={dx} y={FL} o={1 - bars}>
				<Door w={200} h={400} open={open} seed={1610} />
			</G>
			<G x={jx} y={FL - 200} s={1.05}>
				<Jar n={n} w={250} seed={1615} crowned={f >= T(17, 'inni') ? prog(f, T(17, 'inni'), 10) : 0} />
			</G>
			<Rough shape={{t: 'rect', x: jx - 190, y: FL - 200, w: 380, h: 30}} o={{fill: LIGHT, fillStyle: 'solid', strokeWidth: 6}} seed={1616} />
			<Rough shape={{t: 'line', x1: jx - 160, y1: FL - 170, x2: jx - 160, y2: FL}} o={{strokeWidth: 6}} seed={1617} />
			<Rough shape={{t: 'line', x1: jx + 160, y1: FL - 170, x2: jx + 160, y2: FL}} o={{strokeWidth: 6}} seed={1618} />
			{f >= T(14, 'wchodził') - 4 && (
				<Other x={enter} y={FL} s={1.2} seed={1620} coat flip opacity={1 - bars} arms={f >= take ? 'hold' : 'down'} walk={f < T(14, 'wchodził') + 16 ? f : undefined} mood={f >= T(15) ? 'smile' : 'flat'} />
			)}
			{Array.from({length: 8}).map((_, k) => {
				const p = prog(f, take + k * 3, 14);
				if (p <= 0 || p >= 1) return null;
				const pt = arcPt(p, jx, FL - 380, dx - 290, FL - 230, 160);
				return (
					<G key={k} x={pt.x} y={pt.y}>
						<Cookie d={46} seed={1630 + k} />
					</G>
				);
			})}
			{f >= T(14, '10') && f < T(15) && <Txt text={`${n}`} x={jx + 230} y={FL - 420} size={110} color={C.red} seed={1640} />}
			<Say x={pv(v, 1100, 1060)} y={pv(v, 300, 330)} text="pomyliłem słoiki" size={58} tx={80} ty={170} draw={prog(f, T(15, 'pomyliłem') - 4, 10)} o={1 - prog(f, T(16) - 4, 8)} seed={1641} />
			{f >= T(16) - 4 && f < T(17) && (
				<g>
					<Say x={pv(v, 1060, 1040)} y={pv(v, 260, 300)} text="moi badani zjedli więcej" size={52} tx={110} ty={200} draw={prog(f, T(16) - 4, 10)} seed={1642} />
					{[0, 1, 2].map((k) => (
						<Other key={k} x={pv(v, 1500, 1380) + k * 60} y={pv(v, 480, 520)} s={0.42} seed={1650 + k * 5} arms="up" mood="grin" draw={prog(f, T(16, 'zjedli') + k * 3, 8)} />
					))}
				</g>
			)}
			{bars > 0 && (
				<g opacity={bars}>
					<Rough shape={{t: 'rect', x: pv(v, 980, 970), y: 90, w: pv(v, 640, 500), h: 500}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={1660} />
					<Bar x={pv(v, 1080, 1050)} base={500} v={45} f={f} a={T(17) - 4} w={110} hMax={340} label="10" under="pełny" />
					<Bar x={pv(v, 1300, 1220)} base={500} v={65} f={f} a={T(17) + 4} w={110} hMax={340} label="2" under="pomyłka" />
					<Bar x={pv(v, 1520, 1390)} base={500} v={90} f={f} a={T(17, 'inni')} w={110} hMax={340} label="2" under="inni" color={C.red} />
				</g>
			)}
		</g>
	);
};

// ---------- pokój 4: reguła niedoboru, ręce do ostatniego ciastka ----------
const R4: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const glow = prog(f, T(19, 'cenniejsze') - 4, 12);
	const hands = prog(f, T(20, 'konkurujemy') - 8, 18);
	return (
		<g>
			<MarkTitle text="reguła niedoboru" x={960} y={200} f={f} a={T(18, 'niedoboru')} size={pv(v, 130, 110)} />
			{glow > 0 && <circle cx={960} cy={600} r={120 + 30 * glow} fill={C.yellow} opacity={0.35 * glow} />}
			<G x={960} y={600} s={1 + 0.4 * glow} r={swing(f, T(19, 'cenniejsze'), 10)}>
				<Cookie d={150} face={prog(f, T(19) + 4, 8)} seed={1670} />
				{glow > 0.5 && (
					<G y={-100} s={0.6 * glow}>
						<Crown />
					</G>
				)}
			</G>
			{f >= T(19) && f < T(20) + 10 && <Txt text="mało = cenne" x={960} y={880} size={90} draw={prog(f, T(19, 'mało'), 10)} seed={1671} />}
			{hands > 0 &&
				[0, 1, 2, 3, 4].map((k) => {
					const an = (k / 5) * Math.PI * 2 + 0.4;
					const r0 = 900;
					const r1 = 230 + 30 * Math.sin(f / 4 + k);
					const r = r0 + (r1 - r0) * hands;
					const x = 960 + Math.cos(an) * r;
					const y = 600 + Math.sin(an) * r * 0.7;
					return (
						<G key={k} x={x} y={y} r={(an * 180) / Math.PI + 180}>
							<Hand s={0.9} />
						</G>
					);
				})}
		</g>
	);
};

// ---------- pokój 5 [tylko film]: licznik w sklepie, seria limitowana ----------
const Mug: React.FC<{sticker?: boolean}> = ({sticker}) => (
	<g>
		<Rough shape={{t: 'path', d: 'M -90 -200 L 90 -200 L 80 0 L -80 0 Z'}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={sticker ? 1680 : 1681} />
		<Rough shape={{t: 'path', d: 'M 88 -160 C 150 -160 150 -60 84 -60'}} o={{strokeWidth: 8}} seed={sticker ? 1682 : 1683} />
		{sticker && (
			<g transform="rotate(-10)">
				<Rough shape={{t: 'rect', x: -80, y: -150, w: 160, h: 80}} o={{fill: C.red, fillStyle: 'solid', strokeWidth: 4}} seed={1684} />
				<Txt text="LIMITED" x={0} y={-98} size={40} color={C.paper} seed={1685} />
			</g>
		)}
	</g>
);
const R5: React.FC<{f: number}> = ({f}) => {
	const sec = f >= T(22, 'licznik') ? Math.max(0, 59 - Math.floor((f - T(22, 'licznik')) / 30)) : 59;
	const mug = prog(f, T(23, 'seria') - 4, 12);
	return (
		<g>
			<G x={560} y={540} s={pk(f, T(21) - 4)}>
				<Phone w={360}>
					<Txt text="słuchawki" x={0} y={-200} size={48} seed={1690} />
					<G x={-90} y={-60} s={0.5}>
						<Eye />
					</G>
					<Txt text="37 osób ogląda" x={30} y={-46} size={40} seed={1691} />
					{f >= T(22) - 4 && <Txt text={`00:00:${String(sec).padStart(2, '0')}`} x={0} y={80} size={64} color={C.red} seed={1692} />}
				</Phone>
			</G>
			{mug > 0 && (
				<g opacity={mug}>
					<G x={1180} y={760}>
						<Mug sticker />
					</G>
					<Txt text="=" x={1380} y={680} size={140} draw={prog(f, T(23, 'niczym') - 4, 8)} seed={1693} />
					<G x={1580} y={760}>
						<Mug />
					</G>
					{f >= T(23, 'zwykłej') && <Txt text="zwykły" x={1580} y={860} size={60} color={GREY} draw={prog(f, T(23, 'zwykłej'), 8)} seed={1694} />}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 6: jak to rozpoznać ----------
const R6: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const q = T(24, 'rozpoznać');
	const b = T(25);
	const ahaEnd = T(25, 'gdyby') - 2;
	const refill = Math.round(ip(f, T(25, 'zawsze') - 6, T(25, 'zawsze') + 18, 2, 10));
	const yes = prog(f, T(26, 'kupuj') - 6, 10);
	const no = prog(f, T(27, 'nie') - 2, 10);
	const same = prog(f, T(28, 'smakowały') - 4, 10);
	const loose = 1 - prog(f, T(29, 'liczba') - 2, 22);
	const showHero = f < q - 2 || f > ahaEnd;
	const jx = pv(v, 760, 820);
	return (
		<g>
			<Floor x0={300} x1={1620} y={FL} />
			{showHero && <Hero x={pv(v, 1320, 1280)} y={FL} s={1.2} seed={540} look={-1} mood={f >= T(26) ? 'smile' : 'flat'} strings={[{c: GR, at: 'r', p: loose, slack: prog(f, T(29) - 4, 12)}]} />}
			<Aha x={pv(v, 1320, 1280)} y={FL} s={1.2} a={q} b={b} until={ahaEnd} />
			<G x={jx} y={FL - 60} s={1.15} o={prog(f, T(25) - 4, 10)}>
				<Jar n={f >= T(25, 'zawsze') - 6 ? refill : 2} w={240} label={f >= T(25, 'zawsze') ? 'zawsze dostępne' : 'zostały tylko 2!'} seed={1700} />
			</G>
			{yes > 0 && (
				<G x={pv(v, jx - 220, 700)} y={pv(v, 330, 300)} o={yes}>
					<Check ok draw={yes} s={0.8} />
					<Txt text="tak → kupuj spokojnie" x={0} y={-80} size={pv(v, 54, 46)} seed={1701} />
				</G>
			)}
			{no > 0 && (
				<G x={pv(v, jx + 260, 1210)} y={pv(v, 330, 300)} o={no}>
					<Check ok={false} draw={no} s={0.8} />
					<Txt text="nie → pomyśl o słoiku" x={0} y={-80} size={pv(v, 54, 46)} seed={1702} />
				</G>
			)}
			{same > 0 && (
				<G x={pv(v, 1080, 1060)} y={pv(v, 560, 560)} s={same}>
					<Cookie d={110} face={1} seed={1703} />
					<Txt text="tak samo" x={0} y={110} size={60} seed={1704} />
				</G>
			)}
		</g>
	);
};

// ---------- montaż ----------
const SHOTS = (v: boolean): Shot[] => [
	[0, 0, [0, 0, 1.0], [0, 40, 1.0]],
	[T(1, 'ciastka') + 6, 0, [0, 140, 1.1], [0, 120, 1.05], 20],
	[T(2), 1, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(6, 'palec') + 10, 1, [200, 60, 1.12], [150, 60, 1.06], 26],
	[T(7) + 4, 2, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(10) + 4, 2, [0, 60, 1.0], [0, 80, 1.0], 14],
	[T(13) + 4, 3, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(14, 'zabierał') + 10, 3, [-160, 0, 1.12], [-60, 0, 1.05], 18],
	[T(16) + 2, 3, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(18) + 4, 4, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(21) + 4, 5, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(24) + 2, 6, [0, 0, 1.0], [0, 0, 1.0], 14],
];
const ROOMS: [number, number, React.FC<{f: number; v: boolean}>][] = [
	[0, T(2), R0],
	[T(2) - 14, T(7), R1],
	[T(7) - 14, T(13), R2],
	[T(13) - 14, T(18), R3],
	[T(18) - 14, T(21), R4],
	[T(21) - 14, T(24), ({f}) => <R5 f={f} />],
	[T(24) - 14, 99999, R6],
];
const HITS = [T(1, 'ciastka'), T(3, 'ostatnie'), (T(6, 'przycisku') + 14), T(7, '1975'), T(8, '134'), T(12, 'wyżej'), T(14, 'zabierał'), T(17, 'inni'), T(18, 'niedoboru'), T(24, 'rozpoznać'), T(29, 'liczba')].map((t) => [t, 0.75] as [number, number]);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => (
	<Stage v={v} lines={LINES} vo="mp4_vo.wav" keys={shots(v, SHOTS(v))} hits={hitsAt(HITS)} head={<VHead i={3} />}>
		{(f) => (
			<g>
				{ROOMS.map(([a, b, R], i) =>
					on(f, a, b) ? (
						<g key={i} transform={`translate(${i * RW} 0)`}>
							<R f={f} v={v} />
						</g>
					) : null,
				)}
			</g>
		)}
	</Stage>
);

export const ManipS4: React.FC = () => (
	<WithCard card={<TrickCard i={3} />}>
		<Scene />
	</WithCard>
);
export const S4_KEEP = keepFrom(LINES, [21, 22, 23], null, S4_FRAMES);
export const S4S_SCENE = keepLen(S4_KEEP);
export const ManipS4S: React.FC = () => (
	<ShortWithCta sceneFrames={S4S_SCENE} i={3}>
		<CutShort keep={S4_KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
