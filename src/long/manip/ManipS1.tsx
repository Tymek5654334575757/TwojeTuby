// Manipulacja 1: darmowy prezent (reguła wzajemności). Film 16:9 + short 9:16 (bez zdań [tylko film]).
import React from 'react';
import {LINES} from './mp1.gen';
import {
	C, Rough, Txt, G, clamp01, makeT, ip, pk, live, swing, hsh, arcPt, prog, EBACK, pv, on, shots, hitsAt, Stage, VHead, WithCard, TrickCard, Hero, Other, Aha,
	PriceTag, ExpCard, MarkTitle, Door, Thought, Balance, Stone, Cheese, Tray, Gift, Tickets, Arrow, Heart, Cloud, Gearwheel, HeadProfile, Bottle, Hand, Env, House, Floor,
	CutShort, keepFrom, keepLen, ShortWithCta, RW, SC, GREY, LIGHT, FPS, type Shot,
} from './mkit';

const T = makeT(LINES);
export const S1_FRAMES = Math.round((LINES[LINES.length - 1].e + 1.0) * FPS);
const Y = SC[0];
const FL = 900; // podłoga

// ---------- pokój 0: próbka w sklepie ----------
const R0: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const big = 1 - prog(f, T(2) - 6, 10);
	const stand = prog(f, T(2) - 2, 14);
	const reach = f >= T(2, 'spróbować') && f < T(3) + 6;
	const eaten = f >= T(3) + 6;
	const tryGo = prog(f, T(3, 'trudno'), 22) * (1 - prog(f, T(4) + 40, 16));
	const bubble = prog(f, T(4, 'podpisałeś'), 14);
	const tilt = ip(f, T(4, 'winien'), T(4, 'winien') + 16, 0, 1, EBACK);
	const str = prog(f, T(4, 'winien') + 10, 16);
	const hx = 1160 + tryGo * 90;
	return (
		<g>
			{/* duże ujęcie: ser na wykałaczce i metka „0 zł” (od klatki 0) */}
			{big > 0 && (
				<g opacity={big}>
					<G x={pv(v, 780, 960)} y={pv(v, 460, 420)} s={pv(v, 2.5, 2.2)} r={swing(f, T(1), 10)}>
						<Cheese />
					</G>
					<G x={pv(v, 1320, 960)} y={pv(v, 430, 880)} s={1.35} r={6 + swing(f, T(0, 'próbka'), 8)}>
						<PriceTag text="0 zł" w={300} sub="???" subDraw={prog(f, T(0, 'próbka') + 8, 12)} strike={prog(f, T(0, 'próbka'), 8)} />
					</G>
				</g>
			)}
			{stand > 0 && (
				<g opacity={stand}>
					<Floor x0={300} x1={1620} y={FL} draw={stand} />
					<Other x={640} y={FL} s={1.25} seed={520} hair="bun" mood="smile" arms="hold" draw={stand} />
					<G x={760} y={FL - 215}>
						<Tray w={200} n={eaten ? 3 : 4} />
					</G>
					<Rough shape={{t: 'rect', x: 520, y: FL - 200, w: 360, h: 34}} o={{fill: LIGHT, fillStyle: 'solid', strokeWidth: 6}} draw={stand} seed={530} />
					<Rough shape={{t: 'line', x1: 560, y1: FL - 166, x2: 560, y2: FL}} o={{strokeWidth: 6}} draw={stand} seed={531} />
					<Rough shape={{t: 'line', x1: 840, y1: FL - 166, x2: 840, y2: FL}} o={{strokeWidth: 6}} draw={stand} seed={532} />
					{/* klient */}
					<Hero x={hx} y={FL} s={1.25} seed={540} arms={reach ? 'reach' : 'down'} flip={reach} lean={tryGo * 12} look={tryGo > 0.05 ? 1 : -1} mood={eaten ? (tryGo > 0.1 ? 'worry' : 'smile') : 'flat'} walk={tryGo > 0.05 && tryGo < 0.95 ? f : undefined} strings={[{c: Y, at: 'r', p: str}]}>
						{reach && !eaten && (
							<G x={118} y={-240} s={0.34}>
								<Cheese />
							</G>
						)}
					</Hero>
					{/* but przyklejony do podłogi: guma */}
					{tryGo > 0 && <Rough shape={{t: 'path', d: `M 1100 ${FL} Q ${1130 + tryGo * 30} ${FL - 30} ${hx - 60} ${FL - 6}`}} o={{stroke: '#E58CA8', strokeWidth: 10}} draw={clamp01(tryGo * 3)} seed={545} />}
					{f >= T(3, 'dziękujesz') && f < T(3, 'trudno') && <Txt text="dziękuję!" x={1180} y={FL - 420} size={64} draw={prog(f, T(3, 'dziękujesz'), 8)} seed={546} />}
					{bubble > 0 && (
						<G x={pv(v, 1300, 1060)} y={pv(v, 300, 250)} s={bubble}>
							<Thought w={600} h={380} tail={[-0.12, 1]}>
								<G y={80} s={0.8}>
									<Balance tilt={tilt} left={<G y={-20} s={0.5}><Cheese /></G>} right={<G y={-6} s={0.8}><Stone /></G>} />
								</G>
							</Thought>
						</G>
					)}
				</g>
			)}
		</g>
	);
};

// ---------- pokój 1: badanie 1971, obrazy, Joe ----------
const Easel: React.FC<{art: number; draw: number}> = ({art, draw}) => (
	<g>
		<Rough shape={{t: 'lpath', pts: [[-90, 0], [0, -420], [90, 0]]}} o={{strokeWidth: 7, stroke: '#8A5A2B'}} draw={draw} seed={560 + art} />
		<Rough shape={{t: 'rect', x: -130, y: -400, w: 260, h: 200}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} draw={draw} seed={562 + art} />
		{art === 0 ? (
			<Rough shape={{t: 'lpath', pts: [[-110, -220], [-50, -330], [0, -260], [50, -360], [110, -220]]}} o={{stroke: C.blue, strokeWidth: 7}} draw={draw} seed={564} />
		) : (
			<Rough shape={{t: 'circle', cx: 0, cy: -300, d: 110}} o={{stroke: C.red, strokeWidth: 8, fill: C.yellow, fillStyle: 'hachure', hachureGap: 9}} draw={draw} seed={565} />
		)}
	</g>
);
const Badge: React.FC<{flip: number}> = ({flip}) => {
	const sx = Math.cos(flip * Math.PI);
	return (
		<g transform={`translate(0 -160) scale(${sx} 1)`}>
			<rect x={-96} y={-26} width={192} height={52} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={4} />
			<g transform={`scale(${sx < 0 ? -1 : 1} 1)`}>
				<Txt text={flip < 0.5 ? 'uczestnik' : 'POMOCNIK'} x={0} y={14} size={flip < 0.5 ? 40 : 38} color={flip < 0.5 ? C.ink : C.red} seed={570} />
			</g>
		</g>
	);
};
const R1: React.FC<{f: number; v: boolean}> = ({f}) => {
	const art = prog(f, T(6), 18);
	const joeIn = ip(f, T(7) - 6, T(7, 'Joe') + 8, 1700, 1210);
	const walking = f > T(7) - 6 && f < T(7, 'Joe') + 8;
	const flip = prog(f, T(8, 'pomocnik'), 10);
	return (
		<g>
			<G x={960} y={230} s={0.82}>
				<ExpCard year="1971" who="psycholog Dennis Regan" f={f} a={T(5, '1971')} out={T(8) - 8} />
			</G>
			<Floor x0={360} x1={1580} y={FL} draw={art} />
			<G x={650} y={FL}>
				<Easel art={0} draw={art} />
			</G>
			<Other x={900} y={FL} s={1.1} seed={580} look={-1} draw={prog(f, T(6) + 6, 12)} />
			{f >= T(7) - 6 && (
				<Other x={joeIn} y={FL} s={1.1} seed={590} look={-1} walk={walking ? f : undefined} wink={f >= T(8, 'pomocnik') + 12 && f < T(8, 'pomocnik') + 30} mood={f >= T(8, 'pomocnik') + 8 ? 'smile' : 'flat'}>
					<Badge flip={flip} />
				</Other>
			)}
			{f >= T(7, 'Joe') && <Txt text="Joe" x={1210} y={FL - 420} size={84} color={C.blue} draw={prog(f, T(7, 'Joe'), 8)} seed={592} />}
			{f >= T(8, 'pomocnik') && <Txt text="(pomocnik badacza)" x={1210} y={FL + 80} size={50} color={GREY} draw={prog(f, T(8, 'pomocnik') + 6, 14)} seed={593} />}
		</g>
	);
};

// ---------- pokój 2: cola, podział, losy ----------
const R2: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const fA = pv(v, FL, 470);
	const ax = pv(v, 460, 600);
	const joeHome = pv(v, 880, 960);
	const doorX = pv(v, 1220, 1300);
	const t0 = T(9, 'wychodził');
	const tBack = T(9, 'butelkami');
	const out1 = ip(f, t0 - 4, t0 + 22, joeHome, doorX);
	const back = ip(f, tBack - 8, tBack + 14, doorX, joeHome);
	const joeX = f < tBack - 8 ? out1 : back;
	const hidden = f > t0 + 22 && f < tBack - 8;
	const doorOpen = live(f, t0 + 14, t0 + 30, 4) + live(f, tBack - 14, tBack - 2, 4);
	const give = prog(f, T(10) + 4, 14);
	const split = prog(f, T(11), 14);
	const joeMid = ip(f, T(12) - 4, T(12) + 12, joeHome, pv(v, 1100, joeHome));
	const fan = prog(f, T(12, 'losy'), 10);
	const jx = f >= T(12) - 4 ? joeMid : joeX;
	const hasBottles = f >= tBack - 8;
	const bp = arcPt(give, jx - 110, fA - 230, ax + 110, fA - 230, 80);
	return (
		<g>
			<Floor x0={300} x1={1620} y={fA} />
			{v && <Floor x0={360} x1={1560} y={1000} draw={split} seed={600} />}
			<G x={doorX} y={fA} o={1 - split}>
				<Door w={170} h={330} open={doorOpen} seed={601} />
			</G>
			<Other x={ax} y={fA} s={pv(v, 1.1, 0.95)} seed={580} arms={give > 0.9 ? 'hold' : 'down'} mood={give > 0.9 ? 'smile' : 'flat'}>
				{give >= 1 && (
					<G x={92} y={-200} s={0.5}>
						<Bottle />
					</G>
				)}
			</Other>
			{split > 0 && !v && <Txt text="z colą" x={ax} y={180} size={70} color={C.ink} draw={split} seed={603} />}
			{!hidden && (
				<Other x={jx} y={fA} s={pv(v, 1.1, 0.95)} seed={590} look={-1} flip walk={(f > t0 - 4 && f < t0 + 22) || (f > tBack - 8 && f < tBack + 14) || (f > T(12) - 4 && f < T(12) + 12) ? f : undefined} arms={(hasBottles && f < T(11) + 6) || fan > 0 ? 'hold' : 'down'}>
					{hasBottles && f < T(11) + 6 && (
						<g>
							{give < 0.05 && (
								<G x={100} y={-200} s={0.5}>
									<Bottle />
								</G>
							)}
							<G x={130} y={-196} s={0.5}>
								<Bottle />
							</G>
						</g>
					)}
					{fan > 0 && (
						<g transform="translate(120 -200)">
							{[0, 1, 2, 3, 4].map((k) => (
								<g key={k} transform={`rotate(${(k - 2) * 16 * fan})`}>
									<rect x={-10} y={-110} width={34} height={100} rx={3} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
								</g>
							))}
						</g>
					)}
				</Other>
			)}
			{give > 0 && give < 1 && (
				<G x={bp.x} y={bp.y} s={0.5} r={give * 360}>
					<Bottle />
				</G>
			)}
			{f >= T(10) && f < T(11) + 10 && (
				<g opacity={live(f, T(10), T(11) + 4)}>
					<Rough shape={{t: 'ellipse', cx: jx + 60, cy: fA - 470, w: 400, h: 130}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={604} />
					<Txt text="Kupiłem i tobie" x={jx + 60} y={fA - 452} size={58} seed={605} />
				</g>
			)}
			{/* podział kadru */}
			{split > 0 && (
				<g>
					{v ? (
						<Rough shape={{t: 'line', x1: 380, y1: 560, x2: 1540, y2: 560}} o={{strokeWidth: 7, stroke: GREY}} draw={split} seed={606} />
					) : (
						<Rough shape={{t: 'line', x1: 1340, y1: 120, x2: 1340, y2: 980}} o={{strokeWidth: 7, stroke: GREY}} draw={split} seed={606} />
					)}
					<Other x={pv(v, 1560, 1150)} y={pv(v, FL, 1000)} s={pv(v, 1.1, 0.95)} seed={610} arms="shrug" draw={split} />
					<Txt text="bez prezentu" x={pv(v, 1560, 1150)} y={pv(v, 180, 640)} size={pv(v, 66, 60)} draw={split} seed={611} color={GREY} />
					{v && <Txt text="z colą" x={640} y={90} size={60} draw={split} seed={612} />}
				</g>
			)}
			{fan > 0 && v && (
				<G x={1300} y={880} s={0.8}>
					<Tickets n={5} />
				</G>
			)}
		</g>
	);
};

// ---------- pokój 3: stosy losów i 500% ----------
const R3: React.FC<{f: number; v: boolean}> = ({f}) => {
	const a = T(13, 'kupowali');
	const nL = Math.round(ip(f, a, a + 30, 0, 12));
	const nR = Math.round(ip(f, a + 6, a + 26, 0, 5));
	const turn = ip(f, T(14, 'zarabiał') - 10, T(14, 'zarabiał') + 6, 0, 1);
	const shoot = prog(f, T(14, '500%') - 6, 12);
	return (
		<g>
			<Floor x0={420} x1={1500} y={FL} />
			<G x={760} y={FL - 20} s={1.6}>
				<Tickets n={nL} seed={630} />
			</G>
			<G x={1160} y={FL - 20} s={1.6}>
				<Tickets n={nR} seed={640} />
			</G>
			<G x={760} y={FL - 200 - nL * 29} s={0.85} r={turn * 90} o={1 - shoot}>
				<Bottle />
			</G>
			<G x={1160} y={FL - 300} s={1} o={prog(f, a, 10)}>
				<Hand s={1} open />
				<Txt text="nic" x={0} y={-70} size={72} color={GREY} seed={645} />
			</G>
			<Txt text="z colą" x={760} y={FL + 80} size={60} draw={prog(f, a, 10)} seed={646} />
			<Txt text="bez prezentu" x={1160} y={FL + 80} size={60} color={GREY} draw={prog(f, a + 4, 10)} seed={647} />
			<Arrow x0={760} y0={FL - 560} x1={900} y1={250} draw={shoot} color={C.red} w={12} seed={648} bend={-0.15} />
			{f >= T(14, '500%') && (
				<G x={1100} y={200} s={pk(f, T(14, '500%'))}>
					<Txt text="500%" x={0} y={40} size={170} color={C.red} seed={649} />
				</G>
			)}
			{f >= T(14) && <Txt text="wyliczenie: Robert Cialdini" x={960} y={FL + 150} size={48} color={GREY} draw={prog(f, T(14, 'Robert'), 14)} seed={650} />}
		</g>
	);
};

// ---------- pokój 4: ankieta (sympatia) ----------
const Face: React.FC<{kind: 'heart' | 'cloud'; cross?: number}> = ({kind, cross = 0}) => (
	<g>
		<Rough shape={{t: 'circle', cx: 0, cy: 0, d: 130}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={kind === 'heart' ? 660 : 661} />
		<circle cx={-20} cy={-10} r={6} fill={C.ink} />
		<circle cx={20} cy={-10} r={6} fill={C.ink} />
		<path d={kind === 'heart' ? 'M -22 22 Q 0 40 22 22' : 'M -20 32 Q 0 18 20 32'} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
		<G x={90} y={-70} s={0.55}>{kind === 'heart' ? <Heart /> : <Cloud />}</G>
		{cross > 0 && <Rough shape={{t: 'line', x1: 40, y1: -120, x2: 140, y2: -20}} o={{stroke: C.red, strokeWidth: 10}} draw={cross} seed={662} />}
	</g>
);
const R4: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const r1 = prog(f, T(16), 12);
	const r2 = prog(f, T(17), 12);
	const rows = [
		{y: 420, label: 'bez prezentu', p: r1, nH: Math.round(ip(f, T(16, 'kupowali'), T(16, 'lubili'), 0, 6)), nC: Math.round(ip(f, T(16, 'lubili'), T(16, 'lubili') + 10, 0, 1))},
		{y: 800, label: 'po prezencie (cola)', p: r2, nH: Math.round(ip(f, T(17) + 4, T(17) + 24, 0, 7)), nC: Math.round(ip(f, T(18, 'Kupowali'), T(18, 'lubili'), 0, 6))},
	];
	return (
		<g>
			<G x={960} y={130} s={1.3} o={prog(f, T(15) - 8, 10)}>
				<Rough shape={{t: 'rect', x: -170, y: -60, w: 340, h: 100}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={663} />
				<Txt text="ankieta: lubisz Joe?" x={0} y={8} size={52} seed={664} />
			</G>
			<g transform={`translate(960 560) scale(${pv(v, 1.32, 1.12)}) translate(-960 -540)`}>
			{rows.map((r, k) => (
				<g key={k} opacity={r.p}>
					<Txt text={r.label} x={960} y={r.y - 120} size={58} color={GREY} seed={670 + k} />
					<G x={640} y={r.y}>
						<Face kind="heart" cross={k === 1 ? prog(f, T(17, 'sympatia'), 10) : 0} />
					</G>
					<G x={800} y={r.y + 60}>
						<Tickets n={r.nH} seed={680 + k * 10} />
					</G>
					<G x={1120} y={r.y}>
						<Face kind="cloud" />
					</G>
					<G x={1280} y={r.y + 60}>
						<Tickets n={r.nC} seed={700 + k * 10} />
					</G>
				</g>
			))}
			</g>
			<G x={960} y={360} o={prog(f, T(15, 'ankiecie') + 4, 8) * (1 - r1)}>
				<Face kind="heart" />
				<G x={320} y={0}>
					<Face kind="cloud" />
				</G>
				<G x={-320} y={0}>
					<Face kind="cloud" />
				</G>
			</G>
		</g>
	);
};

// ---------- pokój 5: mechanizm (głowa, zębatki, nazwa) ----------
const R5: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const head = prog(f, T(19) - 4, 16) * (1 - prog(f, T(21) - 4, 10));
	const bottle = prog(f, T(20) - 6, 10);
	const spin = f >= T(20, 'Uruchamia') ? (f - T(20, 'Uruchamia')) * 6 : 0;
	const loop = prog(f, T(21, 'wzajemności') + 4, 14) * (1 - prog(f, T(22) - 4, 10));
	const kid = prog(f, T(22) - 2, 14);
	const lp = ((f - T(21, 'wzajemności')) / 40) * Math.PI;
	const gx = 960 + Math.cos(lp) * 240;
	const gy = 600 + Math.sin(lp) * 120;
	const tug = f >= T(23, 'działa') ? swing(f, T(23, 'działa'), 12) : 0;
	return (
		<g>
			{head > 0 && (
				<g opacity={head}>
					<G x={pv(v, 820, 900)} y={560} s={1.15}>
						<HeadProfile draw={head}>
							<G x={-30} y={-40}>
								<Gearwheel r={70} ang={spin} seed={720} />
							</G>
							<G x={80} y={20}>
								<Gearwheel r={50} ang={-spin * 1.4 + 20} seed={722} />
							</G>
						</HeadProfile>
					</G>
					<G x={pv(v, 1380, 1260)} y={pv(v, 560, 300)} s={0.9 * bottle} r={swing(f, T(20) - 6, 8)}>
						<Bottle />
					</G>
					<Txt text="dług wdzięczności" x={pv(v, 820, 900)} y={940} size={70} draw={prog(f, T(19), 14)} seed={724} />
				</g>
			)}
			<MarkTitle text="reguła wzajemności" x={960} y={200} f={f} a={T(21, 'wzajemności')} size={pv(v, 130, 104)} />
			{loop > 0 && (
				<g opacity={loop}>
					<G x={pv(v, 620, 640)} y={620}>
						<Hand s={1} />
					</G>
					<G x={pv(v, 1300, 1280)} y={620} s={-1}>
						<Hand s={1} />
					</G>
					<Arrow x0={760} y0={470} x1={1160} y1={470} bend={-0.25} draw={loop} seed={726} />
					<Arrow x0={1160} y0={760} x1={760} y1={760} bend={-0.25} draw={loop} seed={728} />
					<G x={gx} y={gy + 50} s={0.45}>
						<Gift />
					</G>
				</g>
			)}
			{kid > 0 && (
				<g opacity={kid}>
					<Floor x0={460} x1={1460} y={FL} />
					<Other x={760} y={FL} s={1.2} seed={730} arms="point" mood="smile" draw={kid} />
					<Other x={1080} y={FL} s={0.7} seed={736} arms={f > T(22, 'odwdzięcz') + 6 ? 'up' : 'down'} mood="smile" draw={kid} />
					{f >= T(22, 'odwdzięcz') && (
						<g>
							<Rough shape={{t: 'ellipse', cx: 860, cy: 360, w: 420, h: 130}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} seed={738} />
							<Txt text="odwdzięcz się!" x={860} y={380} size={62} draw={prog(f, T(22, 'odwdzięcz'), 10)} seed={739} />
						</g>
					)}
					<G x={1250} y={FL - 30} s={0.5} r={tug * 0.5}>
						<Gift />
					</G>
				</g>
			)}
		</g>
	);
};

// ---------- pokój 6 [tylko film]: kartki świąteczne ----------
const HOUSES = Array.from({length: 30}, (_, k) => ({x: 300 + (k % 10) * 146 + (Math.floor(k / 10) % 2) * 60, y: 430 + Math.floor(k / 10) * 190 + hsh(k) * 30}));
const R6: React.FC<{f: number}> = ({f}) => {
	const send = T(24, 'wysłali');
	const n = Math.round(ip(f, T(24, '578') - 10, T(24, '578') + 20, 0, 578));
	const back = T(25, 'odpisała');
	const pct = f < T(27, '2%') ? '≈ 20%' : '2%';
	const fall = prog(f, T(27, '2%') - 4, 10);
	const zoom = prog(f, T(26), 12) * (1 - prog(f, T(27) - 6, 10));
	return (
		<g>
			<G x={960} y={210} s={0.72}>
				<ExpCard year="1976" who="socjologowie Kunz i Woolcott" f={f} a={T(24, '1976')} out={T(24, 'kartki') + 10} />
			</G>
			{HOUSES.map((h, k) => (
				<House key={k} x={h.x} y={h.y} s={0.9} o={prog(f, T(24, 'kartki') - 6 + k, 8)} lit={k % 5 === 0 && f >= back && (f < T(27, '2%') || k === 10)} />
			))}
			{HOUSES.map((h, k) => {
				const p = prog(f, send + 20 + k * 2, 26);
				if (p <= 0) return null;
				const ret = k % 5 === 0 && f >= back ? prog(f, back + k, 24) * (f >= T(27, '2%') && k !== 10 ? 1 - fall : 1) : 0;
				const pt = arcPt(p, 960, 960, h.x, h.y - 110, 160);
				const q = arcPt(ret, h.x, h.y - 110, 960, 960, 200);
				return <Env key={k} x={ret > 0 ? q.x : pt.x} y={ret > 0 ? q.y : pt.y} s={0.7} r={(1 - p) * 30} o={ret > 0 ? 1 : p < 1 ? 1 : 0.85} fill={ret > 0 ? C.yellow : C.paper} />;
			})}
			<G x={960} y={1000} s={1}>
				<Rough shape={{t: 'rect', x: -60, y: -90, w: 120, h: 80}} o={{fill: C.blue, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 6}} seed={760} />
				<Rough shape={{t: 'line', x1: 0, y1: -10, x2: 0, y2: 60}} o={{strokeWidth: 8}} seed={761} />
			</G>
			{f >= T(24, '578') - 10 && <Txt text={`${n}`} x={1180} y={1010} size={110} color={C.red} seed={762} />}
			{f >= back && (
				<G x={1500} y={190} s={f >= T(27, '2%') ? pk(f, T(27, '2%')) : pk(f, back)}>
					<Txt text={`odpisało ${pct}`} x={0} y={30} size={96} color={C.red} seed={763} />
				</G>
			)}
			{f >= T(27, '2015') && <Txt text="powtórka: 2015" x={420} y={190} size={72} draw={prog(f, T(27, '2015'), 10)} seed={764} />}
			{zoom > 0 && (
				<g opacity={zoom}>
					<Rough shape={{t: 'ellipse', cx: 520, cy: 400, w: 440, h: 120}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 5}} seed={765} />
					<Txt text="kto to? ...ale odpiszę" x={520} y={414} size={46} seed={766} />
				</g>
			)}
			{f >= T(28) && <Rough shape={{t: 'circle', cx: HOUSES[10].x, cy: HOUSES[10].y - 40, d: 200}} o={{stroke: C.red, strokeWidth: 8}} draw={prog(f, T(28, 'nieznajomemu') - 10, 12)} seed={767} />}
		</g>
	);
};

// ---------- pokój 7 [tylko film]: długopis w kopercie, próbka kremu ----------
const R7: React.FC<{f: number}> = ({f}) => {
	const open = prog(f, T(29, 'kopercie'), 12);
	const pen = prog(f, T(29, 'długopis') - 4, 14);
	const cal = prog(f, T(29, 'kalendarzyk') - 4, 12);
	const tube = prog(f, T(30, 'próbka') - 6, 16);
	return (
		<g>
			<G x={720} y={500} s={5} r={-4}>
				<rect x={-30} y={-20} width={60} height={40} fill={C.paper} stroke={C.ink} strokeWidth={2.4} />
				<path d={`M -30 -20 L 0 ${4 - open * 34} L 30 -20`} fill={C.paper} stroke={C.ink} strokeWidth={2.4} />
				<Txt text="prośba o datek" x={0} y={12} size={9} seed={770} />
			</G>
			<G x={720 + pen * 80} y={440 + pen * 330} r={pen * 70} o={pen}>
				<Rough shape={{t: 'rect', x: -16, y: -150, w: 32, h: 260}} o={{fill: C.blue, fillStyle: 'solid', strokeWidth: 5}} seed={771} />
			</G>
			<G x={400} y={800} s={0.9 * cal + 0.001} o={cal}>
				<Rough shape={{t: 'rect', x: -110, y: -120, w: 220, h: 220}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} seed={772} />
				<Rough shape={{t: 'rect', x: -110, y: -120, w: 220, h: 60}} o={{fill: C.red, fillStyle: 'hachure', strokeWidth: 8}} seed={773} />
			</G>
			<G x={1340} y={600} o={prog(f, T(30) - 4, 10)}>
				<Hand s={1.6} />
				<G x={60 - (1 - tube) * 300} y={-60} r={-10}>
					<Rough shape={{t: 'path', d: 'M -110 -26 L 90 -30 L 120 -14 L 120 14 L 90 30 L -110 26 Z'}} o={{fill: '#F2E9F7', fillStyle: 'solid', strokeWidth: 6}} draw={tube} seed={774} />
					<Txt text="krem" x={-10} y={14} size={44} draw={tube} seed={775} />
				</G>
				<Txt text="gratis" x={20} y={-160} size={70} color={C.red} draw={prog(f, T(30, 'próbka'), 8)} seed={776} />
			</G>
		</g>
	);
};

// ---------- pokój 8: jak to rozpoznać ----------
const R8: React.FC<{f: number; v: boolean}> = ({f, v}) => {
	const q = T(31, 'rozpoznać');
	const b = T(32);
	const ahaEnd = T(33) - 6;
	const gift = prog(f, T(32, 'prezent') - 4, 12) * (1 - prog(f, T(33) - 6, 8));
	const gOpen = prog(f, T(32, 'krok') - 4, 14);
	const friend = prog(f, T(33) - 4, 12) * (1 - prog(f, T(34) - 6, 8));
	const swap = prog(f, T(33, 'odwzajemniasz') - 8, 22);
	const shop = prog(f, T(34) - 4, 12);
	const take = f >= T(34, 'przyjąć') - 4;
	const waveOn = f >= T(34, 'podziękować') - 4 && f < T(34, 'nic');
	const go = f >= T(34, 'nic') ? f - T(34, 'nic') : -1;
	const heroX = go >= 0 ? 1180 + Math.min(go, 60) * 5 : shop > 0 ? 1180 : friend > 0 ? 1200 : 960;
	const slack = prog(f, T(35) - 4, 12);
	const loose = 1 - prog(f, T(35, 'umowy') + 2, 22);
	const showHero = f < q - 2 || f > ahaEnd;
	return (
		<g>
			<Floor x0={360} x1={1580} y={FL} />
			{showHero && (
				<Hero
					x={heroX}
					y={FL}
					s={1.3}
					seed={540}
					mood={friend > 0 || shop > 0 ? 'smile' : 'flat'}
					arms={friend > 0 ? (swap > 0.95 ? 'hold' : 'reach') : waveOn ? 'wave' : take && go < 0 ? 'reach' : 'down'}
					flip={friend > 0 || (shop > 0 && go < 0)}
					walk={go >= 0 && go < 60 ? f : undefined}
					strings={[{c: Y, at: 'r', p: loose, slack: Math.max(slack, f < q ? 0 : 0)}]}
				/>
			)}
			<Aha x={960} y={FL} s={1.3} a={q} b={b} until={ahaEnd} />
			{gift > 0 && (
				<G x={pv(v, 1420, 1240)} y={pv(v, 620, 560)} s={0.9 * gift}>
					<Gift open={gOpen} w={240} />
					{gOpen > 0.3 && (
						<g opacity={gOpen}>
							{[0, 1, 2].map((k) => (
								<Rough key={k} shape={{t: 'rect', x: -110 + k * 70, y: -170 - k * 70 - 20, w: 70, h: 70 + k * 70}} o={{fill: LIGHT, fillStyle: 'solid', strokeWidth: 5}} seed={790 + k} />
							))}
							<Txt text="sprzedaż" x={0} y={-430} size={64} color={C.red} seed={794} />
						</g>
					)}
				</G>
			)}
			{friend > 0 && (
				<g opacity={friend}>
					<Other x={700} y={FL} s={1.3} seed={800} hair="long" mood="smile" arms={swap > 0.95 ? 'hold' : 'reach'} />
					{[0, 1].map((k) => {
						const p = arcPt(swap, k ? 1060 : 840, FL - 290, k ? 840 : 1060, FL - 290, 120);
						return (
							<G key={k} x={p.x} y={p.y} s={0.32}>
								<Gift color={k ? C.blue : Y} />
							</G>
						);
					})}
					{swap > 0.9 && (
						<G x={950} y={FL - 520} s={pk(f, T(33, 'odwzajemniasz') + 14)}>
							<Heart s={0.8} />
						</G>
					)}
				</g>
			)}
			{shop > 0 && go < 30 && (
				<g opacity={shop * (1 - prog(f, T(34, 'nic') + 24, 10))}>
					<Other x={700} y={FL} s={1.25} seed={520} hair="bun" mood="smile" arms="hold" />
					<G x={820} y={FL - 215}>
						<Tray w={200} n={take ? 3 : 4} />
					</G>
				</g>
			)}
			{waveOn && <Txt text="dziękuję!" x={heroX} y={FL - 470} size={66} draw={prog(f, T(34, 'podziękować') - 4, 8)} seed={801} />}
			{f >= T(35) - 2 && (
				<G x={pv(v, 760, 760)} y={430} s={pk(f, T(35) - 2)} r={-5}>
					<Rough shape={{t: 'rect', x: -130, y: -170, w: 260, h: 340}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 7}} seed={802} />
					<Txt text="umowa" x={0} y={-90} size={70} seed={803} />
					{[0, 1, 2].map((k) => (
						<Rough key={k} shape={{t: 'line', x1: -90, y1: -30 + k * 50, x2: 90, y2: -30 + k * 50}} o={{strokeWidth: 5, stroke: GREY}} seed={804 + k} />
					))}
					<Rough shape={{t: 'line', x1: -150, y1: -190, x2: 150, y2: 190}} o={{stroke: C.red, strokeWidth: 14}} draw={prog(f, T(35, 'umowy'), 8)} seed={808} />
					<Rough shape={{t: 'line', x1: 150, y1: -190, x2: -150, y2: 190}} o={{stroke: C.red, strokeWidth: 14}} draw={prog(f, T(35, 'umowy') + 6, 8)} seed={809} />
				</G>
			)}
		</g>
	);
};

// ---------- montaż ----------
const SHOTS = (v: boolean): Shot[] => [
	[0, 0, [0, -40, 1.04], [0, 60, 1.0]],
	[T(1) + 20, 0, [-80, -40, 1.16], [0, 40, 1.08], 50],
	[T(2), 0, [0, -20, 1.0], [0, 0, 1.0], 14],
	[T(3, 'trudno') + 10, 0, [140, 20, 1.18], [120, 40, 1.1], 30],
	[T(4, 'podpisałeś') + 6, 0, [160, -80, 1.06], [80, -10, 1.0], 16],
	[T(5) + 8, 1, [0, -30, 1.0], [0, 0, 1.0], 16],
	[T(6) + 6, 1, [-20, 80, 1.05], [-60, 60, 1.0], 20],
	[T(8, 'pomocnik'), 1, [180, 40, 1.22], [160, 60, 1.14], 18],
	[T(9) + 4, 2, [0, 0, 1.0], [0, 0, 1.0], 16],
	[T(10) + 4, 2, [-160, 40, 1.15], [-60, -80, 1.05], 18],
	[T(11) + 6, 2, [0, 0, 1.0], [0, 0, 0.98], 14],
	[T(13) + 4, 3, [0, -20, 1.0], [0, 0, 1.0], 16],
	[T(14, '500%') + 4, 3, [60, -110, 1.1], [60, -60, 1.04], 20],
	[T(15) + 4, 4, [0, 0, 1.0], [0, 0, 1.02], 16],
	[T(19), 5, [0, 0, 1.0], [0, 0, 1.0], 16],
	[T(20, 'Uruchamia') + 8, 5, [-60, 0, 1.12], [-30, 0, 1.06], 18],
	[T(21, 'wzajemności') + 4, 5, [0, -10, 1.0], [0, 0, 1.0], 14],
	[T(23, 'działa') + 10, 5, [80, 60, 1.1], [60, 40, 1.04], 30],
	[T(24) + 4, 6, [0, 20, 1.0], [0, 0, 1.0], 16],
	[T(26) + 8, 6, [-560, 0, 1.55], [0, 0, 1.0], 18],
	[T(27) - 2, 6, [0, 20, 1.0], [0, 0, 1.0], 14],
	[T(29) + 4, 7, [0, 0, 1.0], [0, 0, 1.0], 16],
	[T(31) + 4, 8, [0, 0, 1.0], [0, 0, 1.0], 16],
	[T(32, 'krok') + 8, 8, [200, -60, 1.08], [120, -40, 1.04], 20],
	[T(33) + 4, 8, [0, 0, 1.0], [0, 0, 1.0], 14],
	[T(35) + 4, 8, [-80, -40, 1.08], [-60, -20, 1.04], 18],
];
const ROOMS: [number, number, React.FC<{f: number; v: boolean}>][] = [
	[0, T(5), R0],
	[T(5) - 14, T(9), R1],
	[T(9) - 14, T(13), R2],
	[T(13) - 14, T(15), R3],
	[T(15) - 14, T(19), R4],
	[T(19) - 14, T(24), R5],
	[T(24) - 14, T(29), ({f}) => <R6 f={f} />],
	[T(29) - 14, T(31), ({f}) => <R7 f={f} />],
	[T(31) - 14, 99999, R8],
];
const HITS = [T(0, 'próbka'), T(4, 'winien'), T(5, '1971'), T(8, 'pomocnik'), T(14, '500%'), T(17, 'sympatia'), T(21, 'wzajemności'), T(24, '578'), T(27, '2%'), T(31, 'rozpoznać'), T(35, 'umowy')].map((t) => [t, 0.7] as [number, number]);

const Scene: React.FC<{v?: boolean}> = ({v = false}) => (
	<Stage v={v} lines={LINES} vo="mp1_vo.wav" keys={shots(v, SHOTS(v))} hits={hitsAt(HITS)} head={<VHead i={0} />}>
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

export const ManipS1: React.FC = () => (
	<WithCard card={<TrickCard i={0} />}>
		<Scene />
	</WithCard>
);
export const S1_KEEP = keepFrom(LINES, [24, 25, 26, 27, 28, 29, 30], null, S1_FRAMES);
export const S1S_SCENE = keepLen(S1_KEEP);
export const ManipS1S: React.FC = () => (
	<ShortWithCta sceneFrames={S1S_SCENE} i={0}>
		<CutShort keep={S1_KEEP}>
			<Scene v />
		</CutShort>
	</ShortWithCta>
);
