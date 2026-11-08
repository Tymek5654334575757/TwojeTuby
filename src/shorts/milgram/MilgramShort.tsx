// Short #1 Psychorożek: Eksperyment Milgrama (1080×1920). Czasy scen i ruchów biorą się z lektora (vo.gen.ts).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, delayRender, continueRender, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, staticFile, random} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, FreezeCtx, Paper, Rough, Txt, Scribble, clamp01} from '../../kit/sketch';
import {Person, Mini, LabCoat, Generator, Learner, Mask, QMark, Speech} from '../../kit/figures';
import {Captions} from '../../kit/captions';
import {Camera, Bursts, SlideIn, Doodles, Sparks, Sweat, type Hit, type Burst, type Shot} from '../../kit/dynamics';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// --- czasy ---------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:]/g, '');
export const cue = (li: number, w?: string) => {
	const l = LINES[li];
	if (!w) return l.s;
	const hit = l.words.find((x) => norm(x.w).startsWith(norm(w)));
	if (!hit) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return hit.s;
};
const mid = (a: number, b: number) => (LINES[a].e + LINES[b].s) / 2;

const B = [0, mid(0, 1), mid(2, 3), mid(4, 5), LINES[7].s - 0.1, LINES[10].s - 0.1, mid(10, 11), mid(12, 13), mid(14, 15), LINES[16].e + 1.0];
export const TOTAL_FRAMES = Math.round(B[B.length - 1] * FPS);

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, dur: number) => interpolate(f, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const pop = (f: number, a: number) => (f < a ? 0 : spring({frame: f - a, fps: FPS, config: {damping: 9, stiffness: 170}}));
const shake = (f: number, a: number, dur: number, amp: number) => (f >= a && f < a + dur ? (random(`sh${f}`) - 0.5) * 2 * amp : 0);

const useScene = (sceneStart: number) => {
	const f = useCurrentFrame();
	const from = Math.round(sceneStart * FPS);
	const at = (li: number, w?: string) => Math.round(cue(li, w) * FPS) - from;
	return {f, at};
};

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
		{children}
	</svg>
);

// --- wspólny układ haczyka i pętli (scena 1 = scena 9) --------------------
const HookLayout: React.FC<{needle: number; lit: number; lamp: boolean; highlight: number; draw: number; gx: number; textScale: number; hand: number}> = ({
	needle,
	lit,
	lamp,
	highlight,
	draw,
	gx,
	textScale,
	hand,
}) => (
	<Svg>
		<g transform={`translate(400 520) scale(${textScale}) translate(-400 -520)`}>
			<Rough shape={{t: 'rect', x: 180, y: 540, w: 440, h: 40}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 12}} draw={draw} seed={301} />
			<Txt text="450 V" x={400} y={545} size={250} color={C.red} draw={draw} seed={302} />
		</g>
		<LabCoat x={790} y={560} s={1.1} highlight={highlight} draw={draw} seed={310} />
		<g transform={`translate(${gx} 0)`}>
			<Generator x={80} y={880} needle={needle} lit={lit} lamp={lamp} draw={draw} seed={330} />
		</g>
		<g transform={`translate(${hand * 4} ${hand * 6})`}>
			<Rough shape={{t: 'line', x1: 950, y1: 1320, x2: 862, y2: 1086}} o={{strokeWidth: 8}} draw={draw} seed={360} />
			<Rough shape={{t: 'circle', cx: 856, cy: 1066, d: 44}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 6}} draw={draw} seed={361} />
		</g>
	</Svg>
);

// --- Scena 1: haczyk (klatka 0 gotowa) ------------------------------------
const S1: React.FC = () => {
	const {f, at} = useScene(B[0]);
	const a450 = at(0, '450');
	const s = pop(f, a450);
	const sw = Math.min(1.05, s);
	return (
		<>
		<HookLayout
			needle={0.35 + 0.65 * sw}
			lit={Math.round(3 + 7 * clamp01(s))}
			lamp={f >= a450 + 8}
			highlight={prog(f, at(0, 'kitlu') - 2, 12)}
			draw={1}
			gx={shake(f, a450 - 5, 5, 7)}
			textScale={1 + 0.12 * Math.sin(Math.PI * clamp01((f - a450) / 10))}
			hand={Math.sin(Math.PI * clamp01((f - a450 + 4) / 8))}
		/>
		<Svg>
			<Sparks x={820} y={932} a={a450 + 6} b={a450 + 60} r={70} />
			<Sparks x={250} y={1080} a={a450 + 2} b={a450 + 40} r={55} color={C.red} />
		</Svg>
		</>
	);
};

// --- Scena 2: 1961, Yale, 40 mężczyzn -------------------------------------
const S2: React.FC = () => {
	const {f, at} = useScene(B[1]);
	const a61 = at(1, '1961');
	const a40 = at(2, 'czterdziestu');
	const st = pop(f, a61);
	const b = prog(f, a61 + 4, 24);
	const minis: React.ReactNode[] = [];
	for (let i = 0; i < 40; i++) {
		const p = pop(f, a40 + Math.round(i * 0.9));
		const x = 170 + (i % 8) * 92;
		const y = 830 + Math.floor(i / 8) * 102;
		minis.push(
			<g key={i} transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>
				<Mini x={x} y={y} s={1.2} seed={400 + i * 3} />
			</g>,
		);
	}
	return (
		<Svg>
			<g opacity={f < a61 ? 0 : 1} transform={`translate(195 300) rotate(-8) scale(${1.6 - 0.6 * Math.min(1, st)})`}>
				<Rough shape={{t: 'rect', x: -125, y: -62, w: 250, h: 124}} o={{stroke: C.red, strokeWidth: 8}} seed={380} />
				<Txt text="1961" x={0} y={30} size={100} color={C.red} seed={381} />
			</g>
			<Rough shape={{t: 'poly', pts: [[300, 470], [580, 340], [860, 470]]}} draw={b} seed={385} />
			<Rough shape={{t: 'rect', x: 330, y: 470, w: 500, h: 230}} draw={b} seed={386} />
			{[390, 500, 660, 770].map((x, i) => (
				<Rough key={i} shape={{t: 'line', x1: x, y1: 490, x2: x, y2: 690}} o={{strokeWidth: 5}} draw={clamp01(b * 1.3 - 0.2)} seed={387 + i} />
			))}
			<Rough shape={{t: 'line', x1: 300, y1: 720, x2: 860, y2: 720}} draw={b} seed={392} />
			<Txt text="YALE" x={580} y={450} size={56} draw={clamp01(b * 1.5 - 0.4)} seed={393} />
			{minis}
			<Txt text="„badanie pamięci”" x={490} y={1365} size={64} color={C.blue} draw={prog(f, at(2, 'badania') - 2, 14)} seed={395} />
		</Svg>
	);
};

// --- układ przekroju: nauczyciel | generator | ściana | uczeń -------------
const Section: React.FC<{draw: number[]; lit: number; wallX: number; wallOp: number; wallShake: number; learnerFace: number; learnerMood: 'pain' | 'calm'}> = ({
	draw,
	lit,
	wallX,
	wallOp,
	wallShake,
	learnerFace,
	learnerMood,
}) => (
	<>
		<Person x={170} y={560} s={0.9} arms="reach" draw={draw[0]} seed={500} />
		<Generator x={250} y={600} s={0.45} needle={(lit * 45 - 15) / 435} lit={lit} lamp={lit >= 10} draw={draw[1]} seed={520} />
		<g transform={`translate(${wallX + wallShake} 0)`} opacity={wallOp}>
			<Rough shape={{t: 'rect', x: 640, y: 420, w: 44, h: 740}} o={{fill: C.ink, fillStyle: 'hachure', hachureGap: 18, fillWeight: 4}} draw={draw[2]} seed={560} />
		</g>
		<Learner x={850} y={640} mood={learnerMood} face={learnerFace} draw={draw[3]} seed={580} />
	</>
);

// --- Scena 3: kary za błędy, +15 V ----------------------------------------
const S3: React.FC = () => {
	const {f, at} = useScene(B[2]);
	const aX = at(3, 'błędy');
	const a15 = at(4, 'piętnaście');
	const k = f < a15 ? 0 : Math.min(5, 1 + Math.floor((f - a15) / 6));
	const lastStep = a15 + (k - 1) * 6;
	return (
		<Svg>
			<Section draw={[prog(f, 0, 12), prog(f, 4, 14), prog(f, 8, 12), prog(f, 12, 14)]} lit={k} wallX={0} wallOp={1} wallShake={0} learnerFace={1} learnerMood="pain" />
			<Sweat x={170} y={560} a={a15 + 4} s={0.9} />
			<g opacity={f < aX ? 0 : 1}>
				<Rough shape={{t: 'line', x1: 800, y1: 470, x2: 900, y2: 380}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, aX, 5)} seed={600} />
				<Rough shape={{t: 'line', x1: 800, y1: 380, x2: 900, y2: 470}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, aX + 4, 5)} seed={601} />
			</g>
			{k > 0 && (
				<g>
					<Txt text={`${k * 15} V`} x={410} y={1000} size={150} color={C.red} seed={602} />
					<Txt text="+15 V" x={560} y={860 - 40 * clamp01((f - lastStep) / 6)} size={60} opacity={1 - clamp01((f - lastStep) / 6)} seed={603} />
				</g>
			)}
		</Svg>
	);
};

// --- Scena 4: przewidywania 1 na 100 → „A ty jak myślisz?” ----------------
const S4: React.FC = () => {
	const {f, at} = useScene(B[3]);
	const a1 = at(5, 'jeden');
	const aTy = at(6);
	const aM = at(6, 'myślisz');
	const bub = prog(f, 0, 14);
	const erase = prog(f, aTy - 12, 10);
	const bubOp = 1 - clamp01((f - (aTy - 3)) / 4);
	const dots: React.ReactNode[] = [];
	const red = 46;
	for (let i = 0; i < 100; i++) {
		const x = 275 + (i % 10) * 50 + (random(`d${i}${Math.floor(f / 3)}`) - 0.5) * 3;
		const y = 500 + Math.floor(i / 10) * 46;
		const isRed = i === red && f >= a1;
		dots.push(<circle key={i} cx={x} cy={y} r={isRed ? 13 : 9} fill={isRed ? C.red : C.ink} opacity={clamp01((f - 6 - i * 0.12) / 4)} />);
	}
	const rx = 275 + (red % 10) * 50;
	const ry = 500 + Math.floor(red / 10) * 46;
	const pShow = prog(f, aTy - 2, 8);
	const morph = clamp01((f - (aM + 4)) / 3);
	return (
		<Svg>
			<g opacity={bubOp}>
				<Txt text="Przewidywania: 1 na 100" x={500} y={360} size={76} color={C.blue} draw={prog(f, at(5, 'przewidywali') - 4, 16)} seed={700} />
				<Rough shape={{t: 'ellipse', cx: 500, cy: 710, w: 820, h: 600}} o={{stroke: C.blue, strokeWidth: 7}} draw={bub} seed={701} />
				<Rough shape={{t: 'circle', cx: 420, cy: 1060, d: 46}} o={{stroke: C.blue}} draw={bub} seed={702} />
				<Rough shape={{t: 'circle', cx: 380, cy: 1130, d: 26}} o={{stroke: C.blue}} draw={bub} seed={703} />
				{dots}
				<Rough shape={{t: 'circle', cx: rx, cy: ry, d: 64}} o={{stroke: C.red, strokeWidth: 6}} draw={prog(f, a1 + 2, 8)} seed={704} />
				<Mini x={340} y={1200} s={1.6} draw={bub} seed={705} />
			</g>
			<g opacity={1 - clamp01((f - (aTy - 1)) / 4)}>
				<Scribble x={120} y={380} w={760} h={820} draw={erase} seed={706} />
			</g>
			<g transform={`translate(${shake(f, aM - 2, 6, 10)} 0)`} opacity={1 - morph}>
				<Person x={500} y={600} s={1.4} arms="up" draw={pShow} seed={710} />
			</g>
			<Scribble x={380} y={520} w={240} h={420} draw={prog(f, aM + 2, 5)} seed={711} />
			<g opacity={1 - clamp01((f - (aM + 8)) / 3)}>
				<Scribble x={380} y={520} w={240} h={420} draw={f >= aM + 7 ? 1 : 0} seed={711} />
			</g>
			<QMark x={500} y={760} s={1.4} draw={prog(f, aM + 8, 16)} seed={712} />
			<Txt text="Ile osób doszło do 450 V?" x={490} y={1250} size={70} color={C.red} draw={prog(f, aM + 22, 18)} seed={713} />
		</Svg>
	);
};

// --- Scena 5: 300 V, uderzenia, cisza -------------------------------------
const S5: React.FC = () => {
	const {f, at} = useScene(B[4]);
	const a300 = at(7, 'trzystu');
	const aAll = at(7, 'wszyscy');
	const aHit = at(8, 'uderza');
	const aMil = at(9, 'milknie');
	const n = pop(f, a300);
	const frozen = f >= aMil + 2;
	const minis: React.ReactNode[] = [];
	for (let i = 0; i < 40; i++) {
		const x = 200 + (i % 8) * 72;
		const y = 430 + Math.floor(i / 8) * 78;
		minis.push(<Mini key={i} x={x} y={y} s={0.85} filled={f >= aAll + Math.round(i * 0.5)} draw={prog(f, i * 0.3, 8)} seed={800 + i * 3} />);
	}
	const hit = (a: number) => shake(f, a, 5, 12);
	const bangOp = frozen ? 1 - clamp01((f - aMil - 2) / 3) : 1;
	return (
		<FreezeCtx.Provider value={frozen}>
			<Svg>
				{minis}
				<Txt text="40 z 40 → 300 V" x={460} y={880} size={72} color={C.red} draw={prog(f, aAll, 14)} seed={900} />
				<Generator x={70} y={940} s={0.95} needle={0.35 + (0.655 - 0.35) * Math.min(1.04, n)} lit={f >= a300 ? 7 : 3} draw={prog(f, 0, 12)} seed={910} />
				<g transform={`translate(${hit(aHit) + hit(aHit + 11)} 0)`}>
					<Rough shape={{t: 'rect', x: 960, y: 380, w: 40, h: 860}} o={{fill: C.ink, fillStyle: 'hachure', hachureGap: 18, fillWeight: 4}} draw={prog(f, 4, 14)} seed={920} />
				</g>
				<g opacity={bangOp}>
					{[aHit, aHit + 11].map((a, k) => (
						<g key={k} opacity={f >= a ? 1 : 0}>
							<Rough shape={{t: 'lpath', pts: [[945, 520 + k * 200], [905, 500 + k * 200], [930, 480 + k * 200], [885, 455 + k * 200]]}} o={{strokeWidth: 6}} draw={prog(f, a, 4)} seed={930 + k} />
							<Txt text="ŁUP!" x={820} y={460 + k * 200} size={84} color={C.red} rotate={-10 + k * 14} draw={f >= a ? 1 : 0} seed={935 + k} />
						</g>
					))}
				</g>
				<Sparks x={232} y={1130} a={a300 + 2} b={a300 + 30} r={60} />
				<Txt text="…" x={870} y={560} size={130} draw={prog(f, aMil + 4, 10)} seed={940} />
			</Svg>
		</FreezeCtx.Provider>
	);
};

// --- Scena 6: „Proszę kontynuować.” ---------------------------------------
const S6: React.FC = () => {
	const {f, at} = useScene(B[5]);
	const a1 = at(10, 'spokojnie');
	const a2 = at(10, 'powtarza');
	const a3 = at(10, 'proszę');
	const stamp = (a: number) => 1.25 - 0.25 * Math.min(1, pop(f, a));
	return (
		<Svg>
			<LabCoat x={260} y={680} s={1.45} draw={prog(f, 0, 14)} seed={1000} />
			{[
				[a1, 470, 330, 1],
				[a2, 500, 640, 0.85],
				[a3, 530, 920, 0.72],
			].map(([a, x, y, s], i) => (
				<g key={i} opacity={f >= a ? 1 : 0} transform={`translate(${x + 240 * s} ${y + 120 * s}) scale(${stamp(a)}) translate(${-(x + 240 * s)} ${-(y + 120 * s)})`}>
					<Speech x={x} y={y} w={480} h={240} s={s} lines={['Proszę', 'kontynuować.']} size={70} tail={[-70, 50]} draw={i === 0 ? prog(f, a, 14) : 1} seed={1020 + i * 10} />
				</g>
			))}
		</Svg>
	);
};

// --- Scena 7: 26 z 40, dwie trzecie ---------------------------------------
const S7: React.FC = () => {
	const {f, at} = useScene(B[6]);
	const a26 = at(11, '26');
	const aP = at(12, 'dwie');
	const minis: React.ReactNode[] = [];
	for (let i = 0; i < 40; i++) {
		const x = 170 + (i % 8) * 92;
		const y = 420 + Math.floor(i / 8) * 100;
		const isRed = i < 26 && f >= a26 + Math.round(i * 1.4);
		minis.push(<Mini key={i} x={x} y={y} s={1.15} color={isRed ? C.red : C.ink} filled={isRed} draw={prog(f, i * 0.3, 8)} seed={1100 + i * 3} />);
	}
	const pie = prog(f, aP, 22);
	const c26 = pop(f, a26 + 4);
	return (
		<Svg>
			{minis}
			<g opacity={f >= a26 + 4 ? 1 : 0} transform={`translate(250 1060) scale(${Math.min(1.1, c26)}) translate(-250 -1060)`}>
				<Txt text="26" x={200} y={1120} size={230} color={C.red} seed={1200} />
				<Txt text="/ 40" x={330} y={1120} size={110} anchor="start" seed={1201} />
			</g>
			<Rough shape={{t: 'circle', cx: 790, cy: 1040, d: 270}} o={{strokeWidth: 6}} draw={prog(f, aP - 6, 10)} seed={1210} />
			{pie > 0.02 && (
				<Rough
					shape={{t: 'arc', cx: 790, cy: 1040, w: 270, h: 270, a0: -Math.PI / 2, a1: -Math.PI / 2 + 2 * Math.PI * 0.65 * pie, closed: true}}
					o={{stroke: C.red, strokeWidth: 5, fill: C.red, fillStyle: 'hachure', hachureGap: 12, fillWeight: 5}}
					seed={1211}
				/>
			)}
			<Txt text="65%" x={790} y={1275} size={96} color={C.red} draw={prog(f, aP + 16, 10)} seed={1212} />
			<Rough shape={{t: 'line', x1: 710, y1: 1292, x2: 870, y2: 1292}} o={{stroke: C.red, strokeWidth: 7}} draw={prog(f, aP + 24, 8)} seed={1213} />
		</Svg>
	);
};

// --- Scena 8: zwrot akcji – uczeń był aktorem, prąd dostał nauczyciel -----
const S8: React.FC = () => {
	const {f, at} = useScene(B[7]);
	const aU = at(13, 'uczeń');
	const aA = at(13, 'aktorem');
	const aN = at(14, 'nauczyciel');
	const a45 = at(14, '45');
	const slide = prog(f, aU, 14);
	const faceGone = clamp01((f - (aA + 2)) / 3);
	const sparkOn = f >= aN && f < aN + 20 && Math.floor(f / 2) % 2 === 0;
	return (
		<Svg>
			<Section
				draw={[prog(f, 0, 10), prog(f, 2, 10), prog(f, 4, 10), prog(f, 6, 10)]}
				lit={10}
				wallX={300 * slide}
				wallOp={1 - slide}
				wallShake={shake(f, aU - 4, 4, 8)}
				learnerFace={1 - faceGone}
				learnerMood="pain"
			/>
			<g transform={`translate(${shake(f, aA - 3, 4, 6)} 0)`}>
				<Scribble x={805} y={598} w={90} h={84} draw={prog(f, aA - 1, 4)} seed={1300} />
			</g>
			<g opacity={1 - clamp01((f - (aA + 5)) / 3)}>
				<Scribble x={805} y={598} w={90} h={84} draw={f >= aA + 3 ? 1 : 0} seed={1300} />
			</g>
			<Mask x={850} y={644} s={0.95} draw={prog(f, aA + 6, 12)} seed={1310} />
			<g opacity={f >= aA + 10 ? 1 : 0} transform={`translate(850 1050) rotate(-7) scale(${1.5 - 0.5 * Math.min(1, pop(f, aA + 10))})`}>
				<Rough shape={{t: 'rect', x: -130, y: -55, w: 260, h: 110}} o={{stroke: C.red, strokeWidth: 8}} seed={1320} />
				<Txt text="AKTOR" x={0} y={28} size={86} color={C.red} seed={1321} />
			</g>
			{sparkOn && (
				<Rough
					shape={{t: 'lpath', pts: [[300, 610], [282, 640], [310, 600], [270, 615], [292, 585], [265, 598]]}}
					o={{stroke: C.red, strokeWidth: 9, roughness: 2.4}}
					seed={1330 + (f % 4)}
				/>
			)}
			<Sweat x={170} y={560} a={aN + 6} s={0.9} />
			<g opacity={f >= a45 ? 1 : 0} transform={`translate(340 430) scale(${Math.min(1.08, pop(f, a45))}) translate(-340 -430)`}>
				<Rough shape={{t: 'circle', cx: 340, cy: 430, d: 170}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 6}} seed={1340} />
				<Txt text="45 V" x={340} y={452} size={64} seed={1341} />
			</g>
			<Txt text="na próbę" x={420} y={572} size={58} anchor="start" draw={prog(f, a45 + 10, 12)} seed={1342} />
		</Svg>
	);
};

// --- Scena 9: pętla do klatki 0 -------------------------------------------
const S9: React.FC = () => {
	const {f, at} = useScene(B[8]);
	const {durationInFrames} = useVideoConfig();
	const len = Math.round((B[9] - B[8]) * FPS);
	const back = prog(f, len - 26, 22);
	void durationInFrames;
	return (
		<HookLayout
			needle={1 - 0.65 * back}
			lit={Math.round(10 - 7 * back)}
			lamp={back < 0.5}
			highlight={prog(f, at(16, 'kitlu') - 2, 12) * (1 - prog(f, len - 22, 14))}
			draw={prog(f, 0, 12)}
			gx={0}
			textScale={1}
			hand={0}
		/>
	);
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

// --- dynamika: najazdy kamery, uderzenia, linie uderzeń --------------------
const f2s = (n: number) => n / FPS;
const SHOTS: Shot[] = B.slice(0, -1).map((from, i) => ({
	from,
	to: B[i + 1],
	ox: [400, 560, 540, 500, 480, 420, 480, 560, 400][i],
	oy: [760, 700, 700, 760, 900, 700, 900, 700, 760][i],
	zoom: i === 8 ? 1 : 1.06,
}));
const HITS: Hit[] = [
	{t: cue(0, '450'), kind: 'both', amp: 1.2},
	{t: cue(0, 'kitlu'), kind: 'punch', amp: 0.6},
	{t: cue(1, '1961'), kind: 'both'},
	{t: cue(2, 'czterdziestu'), kind: 'punch', amp: 0.7},
	{t: cue(3, 'błędy'), kind: 'punch', amp: 0.8},
	{t: cue(4, 'piętnaście'), kind: 'punch', amp: 0.6},
	{t: cue(5, 'jeden'), kind: 'punch', amp: 0.9},
	{t: cue(6, 'myślisz') + f2s(8), kind: 'punch', amp: 1.1},
	{t: cue(7, 'trzystu'), kind: 'punch', amp: 0.7},
	{t: cue(7, 'wszyscy'), kind: 'punch', amp: 0.7},
	{t: cue(8, 'uderza'), kind: 'shake', amp: 1.1},
	{t: cue(8, 'uderza') + f2s(11), kind: 'shake', amp: 1.1},
	{t: cue(10, 'powtarza'), kind: 'punch', amp: 0.6},
	{t: cue(10, 'proszę'), kind: 'punch', amp: 0.6},
	{t: cue(11, '26'), kind: 'both', amp: 0.9},
	{t: cue(12, 'dwie'), kind: 'punch', amp: 0.8},
	{t: cue(13, 'uczeń'), kind: 'punch', amp: 0.6},
	{t: cue(13, 'aktorem') + f2s(10), kind: 'both', amp: 1.1},
	{t: cue(14, 'nauczyciel'), kind: 'shake', amp: 0.8},
	{t: cue(14, '45'), kind: 'punch', amp: 0.9},
	{t: cue(16, 'kitlu'), kind: 'punch', amp: 0.6},
];
const BURSTS: Burst[] = [
	{t: cue(0, '450'), x: 400, y: 470, r: 230},
	{t: cue(1, '1961'), x: 195, y: 300, r: 150},
	{t: cue(3, 'błędy') + f2s(4), x: 850, y: 425, r: 80},
	{t: cue(5, 'jeden') + f2s(2), x: 575, y: 684, r: 50, color: C.red},
	{t: cue(6, 'myślisz') + f2s(14), x: 500, y: 760, r: 230, color: C.ink},
	{t: cue(7, 'trzystu'), x: 231, y: 1130, r: 110},
	{t: cue(8, 'uderza'), x: 940, y: 520, r: 70, color: C.ink},
	{t: cue(8, 'uderza') + f2s(11), x: 940, y: 720, r: 70, color: C.ink},
	{t: cue(11, '26') + f2s(4), x: 220, y: 1050, r: 140},
	{t: cue(12, 'dwie') + f2s(22), x: 790, y: 1040, r: 170},
	{t: cue(13, 'aktorem') + f2s(10), x: 850, y: 1050, r: 160},
	{t: cue(14, 'nauczyciel'), x: 270, y: 600, r: 70, color: C.yellow},
	{t: cue(14, '45'), x: 340, y: 430, r: 110},
];

const Kicker: React.FC = () => (
	<Svg>
		<Txt text="EKSPERYMENT MILGRAMA" x={490} y={210} size={66} seed={5} />
		<Rough shape={{t: 'line', x1: 230, y1: 232, x2: 750, y2: 232}} o={{stroke: C.red, strokeWidth: 6}} seed={6} />
	</Svg>
);

export const MilgramShort: React.FC = () => {
	const {fps} = useVideoConfig();
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		Promise.all([document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ'), document.fonts.load('700 80px Caveat', 'Abc')]).then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<Svg>
				<Paper w={W} h={H} />
			</Svg>
			<Kicker />
			<Doodles />
			<Camera shots={SHOTS} hits={HITS}>
				{SCENES.map((Scene, i) => {
					const from = Math.round(B[i] * fps);
					const dur = Math.round(B[i + 1] * fps) - from + (i < SCENES.length - 1 ? 7 : 0);
					return (
						<Sequence key={i} from={from} durationInFrames={dur} name={`Scena ${i + 1}`}>
							<SlideIn dur={dur} enter={i > 0} exit={i < SCENES.length - 1}>
								<Scene />
							</SlideIn>
						</Sequence>
					);
				})}
				<Bursts items={BURSTS} />
			</Camera>
			<Captions lines={LINES} top={1405} left={70} width={840} size={92} />
			<Audio src={staticFile('milgram_vo.wav')} />
		</AbsoluteFill>
	);
};
