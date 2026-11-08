// Short #1 Szczęście Pieniędzy Nie Daje: Afera Amber Gold jak dla pięciolatka (1080×1920, styl płaski). Czasy z lektora (vo.gen.ts).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, delayRender, continueRender, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, random} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/baloo-2/800.css';
import {P, FFONT, G, Kid, LOOKS, Banknote, Coin, GoldBar, Bank, Plane, Cloud, Calendar, Tag, Stamp, Star, FText, FlatBurst, clamp01, prog, pop, arc} from '../../kit-flat/flat';
import {Camera, SlideIn, type Hit, type Shot} from '../../kit/dynamics';
import {Captions} from '../../kit/captions';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
const FPS = 30;
const STAGE = 1340; // dolna krawędź sceny; niżej kremowe pole na napisy

const norm = (s: string) => s.toLowerCase().replace(/[,.?:]/g, '');
export const cue = (li: number, w?: string) => {
	const l = LINES[li];
	if (!w) return l.s;
	const hit = l.words.find((x) => norm(x.w).startsWith(norm(w)));
	if (!hit) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return hit.s;
};
const mid = (a: number, b: number) => (LINES[a].e + LINES[b].s) / 2;
const END = LINES[13].e + 0.35;
export const B = [0, mid(1, 2), mid(2, 3), mid(4, 5), mid(7, 8), mid(8, 9), mid(9, 10), mid(11, 12), mid(12, 13), END, END + 0.9];
export const TOTAL_FRAMES = Math.round(B[B.length - 1] * FPS);

const useScene = (start: number) => {
	const f = useCurrentFrame();
	const from = Math.round(start * FPS);
	const at = (li: number, w?: string) => Math.round(cue(li, w) * FPS) - from;
	return {f, at};
};

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
		{children}
	</svg>
);

// --- tła ------------------------------------------------------------------
const Playground: React.FC<{drift?: number}> = ({drift = 0}) => {
	const f = useCurrentFrame();
	const d = drift || f * 0.4;
	return (
		<g>
			<rect x={0} y={0} width={W} height={STAGE} fill={P.sky} />
			<circle cx={880} cy={300} r={90} fill={P.goldLight} stroke={P.gold} strokeWidth={10} />
			<G x={180 - (d % 1400)} y={250}>
				<Cloud w={240} />
			</G>
			<G x={1300 - ((d * 0.7) % 1600)} y={420}>
				<Cloud w={180} />
			</G>
			<path d={`M 0 1060 Q 270 1010 540 1050 Q 810 1090 1080 1040 L 1080 ${STAGE} L 0 ${STAGE} Z`} fill={P.grassDark} />
			<rect x={0} y={1120} width={W} height={STAGE - 1120} fill={P.grass} />
			<rect x={0} y={STAGE - 10} width={W} height={10} fill={P.grassDark} />
		</g>
	);
};

const NavyStage: React.FC = () => <rect x={0} y={0} width={W} height={STAGE} fill={P.navy} />;

// --- banknoty lecące strumieniem do celu (zapętlone) -------------------------
const Stream: React.FC<{tx: number; ty: number; n?: number; speed?: number; from?: 'sides' | 'left'; w?: number}> = ({tx, ty, n = 8, speed = 1, from = 'sides', w = 110}) => {
	const f = useCurrentFrame();
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const per = 46;
				const p = (((f * speed + (i * per) / n) % per) + per) % per / per;
				const left = from === 'left' || i % 2 === 0;
				const sx = left ? -120 : W + 120;
				const sy = 140 + (i * 97) % 520;
				const q = arc(Easing.in(Easing.quad)(p), sx, sy, tx, ty, -80);
				const sc = 1 - 0.55 * p;
				return (
					<G key={i} x={q.x} y={q.y} s={sc} r={(left ? 1 : -1) * (30 + p * 220) + i * 20} o={p < 0.08 ? p / 0.08 : p > 0.92 ? (1 - p) / 0.08 : 1}>
						<Banknote w={w} />
					</G>
				);
			})}
		</g>
	);
};

// --- haczyk i pętla ----------------------------------------------------------
const HookLayout: React.FC<{pulse: number; badge: number; kid: number}> = ({pulse, badge, kid}) => {
	const f = useCurrentFrame();
	return (
		<Svg>
			<NavyStage />
			<g transform={`translate(540 900) rotate(${f * 0.6})`} opacity={0.35}>
				{Array.from({length: 12}).map((_, i) => (
					<path key={i} d="M 0 0 L -60 -900 L 60 -900 Z" fill={P.gold} transform={`rotate(${i * 30})`} />
				))}
			</g>
			<Stream tx={540} ty={880} n={14} w={150} />
			<G x={540} y={1000} s={1 + 0.06 * Math.sin(f / 10)}>
				<GoldBar w={560} label="AMBER GOLD" />
			</G>
			<G x={300} y={760}>
				<Star r={28} color={P.goldLight} />
			</G>
			<G x={790} y={820} s={0.7 + 0.3 * Math.abs(Math.sin(f / 9))}>
				<Star r={30} color={P.white} />
			</G>
			<G x={540} y={470} s={1 + 0.14 * pulse}>
				<FText text="851 mln zł" x={0} y={0} size={170} fill={P.gold} stroke={P.navy} sw={6} />
			</G>
			<FText text="prawie" x={540} y={300} size={70} fill={P.white} opacity={0.85} />
			{badge > 0 && (
				<G x={620} y={1210} s={badge} r={-6}>
					<rect x={-250} y={-60} width={500} height={110} rx={26} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<text x={0} y={18} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={60} fill={P.red}>
						jak dla pięciolatka
					</text>
				</G>
			)}
			{kid > 0 && (
				<G x={170} y={STAGE + 20 + (1 - kid) * 300} s={0.9}>
					<Kid look={LOOKS.ty} armR={140 + 20 * Math.sin(f / 4)} seed={2} />
				</G>
			)}
		</Svg>
	);
};

const S1: React.FC = () => {
	const {f, at} = useScene(B[0]);
	const a = at(0, '851');
	const p5 = at(1, 'pięciolatkowi');
	return (
		<>
			<HookLayout pulse={Math.sin(Math.PI * clamp01((f - a) / 10))} badge={Math.min(1.06, pop(f, p5))} kid={prog(f, p5 - 6, 12)} />
			<Svg>
				<FlatBurst x={540} y={420} at={a} r={260} color={P.gold} />
			</Svg>
		</>
	);
};

const S10: React.FC = () => <HookLayout pulse={0} badge={0} kid={0} />;

// --- S2: kolega i obietnica 116 zł -------------------------------------------
const S2: React.FC = () => {
	const {f, at} = useScene(B[1]);
	const a100 = at(2, '100');
	const aZ = at(2, 'złoto');
	const aR = at(2, 'rok');
	const a116 = at(2, '116');
	const fly = prog(f, a100, 12);
	const flying = f >= a100 && f < a100 + 12;
	const q = arc(fly, 410, 1060, 640, 1060, 160);
	const raise = interpolate(pop(f, aZ), [0, 1], [15, 150]);
	const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
	const mi = Math.min(11, Math.max(0, Math.floor((f - aR) / 1.4)));
	const cal = pop(f, aR - 4);
	const big116 = pop(f, a116);
	return (
		<Svg>
			<Playground />
			<G x={330} y={1250}>
				<Kid look={LOOKS.ty} armR={f < a100 ? 70 : 20} holdR={f < a100 ? <G r={-10}><Banknote w={120} /></G> : undefined} seed={1} mood={f > a116 ? 'o' : 'smile'} />
			</G>
			<G x={760} y={1250}>
				<Kid
					look={LOOKS.kolega}
					talk={f > at(2) && f < at(2, '116') + 20}
					armL={f >= a100 + 12 ? 60 : 15}
					holdL={f >= a100 + 12 ? <G r={10}><Banknote w={120} /></G> : undefined}
					armR={raise}
					holdR={f >= aZ ? <G y={-10} s={Math.min(1.1, pop(f, aZ))}><GoldBar w={150} label="ZŁOTO" /></G> : undefined}
					seed={3}
				/>
			</G>
			{f >= aZ && f < aZ + 24 && (
				<G x={900} y={760} s={Math.sin(Math.PI * clamp01((f - aZ) / 24))}>
					<Star r={40} color={P.white} />
				</G>
			)}
			{flying && (
				<G x={q.x} y={q.y} r={fly * 360}>
					<Banknote w={120} />
				</G>
			)}
			{f >= aR - 4 && (
				<G x={540} y={470} s={Math.min(1.08, cal)} r={-3}>
					<Calendar top="ZA ROK" big={f < a116 ? months[mi] : '116 zł'} w={280} />
				</G>
			)}
			{f >= a116 && (
				<G x={800} y={330} s={Math.min(1.1, big116)} r={8}>
					<rect x={-110} y={-50} width={220} height={96} rx={24} fill={P.green} stroke={P.navy} strokeWidth={7} />
					<text x={0} y={22} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={64} fill={P.white}>
						+16 zł
					</text>
				</G>
			)}
			<FlatBurst x={540} y={470} at={a116} r={190} color={P.gold} />
		</Svg>
	);
};

// --- S3: bank daje mniej, 18 000 ludzi ----------------------------------------
const S3: React.FC = () => {
	const {f, at} = useScene(B[2]);
	const aM = at(3, 'mniej');
	const aD = at(3, 'dajesz');
	const a18 = at(4, '18');
	const aT = at(4);
	const zoom = interpolate(f, [aT, aT + 30], [1, 0.62], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const coinS = interpolate(f, [aM, aM + 10], [1, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const stack = Math.min(6, Math.max(0, Math.floor((f - aM) / 3)));
	const fly = prog(f, aD, 12);
	const q = arc(fly, 590, 1060, 760, 1060, 140);
	const crowd: React.ReactNode[] = [];
	const looks = [LOOKS.a, LOOKS.b, LOOKS.c, LOOKS.d];
	let ci = 0;
	for (let row = 0; row < 2; row++) {
		for (let x = -560 + row * 60; x <= 1640; x += 120) {
			if (row === 1 && x > 60 && x < 1000) continue;
			const i = ci++;
			const p = pop(f, aT + 4 + Math.abs(x - 540) / 60);
			crowd.push(
				<G key={i} x={x} y={1170 - row * 70} s={(0.62 - row * 0.08) * Math.min(1, p)}>
					<Kid look={looks[i % 4]} seed={i + 10} armR={i % 3 === 0 ? 150 : 20} />
				</G>,
			);
		}
	}
	return (
		<Svg>
			<Playground />
			<g transform={`translate(540 1250) scale(${zoom}) translate(-540 -1250)`}>
				{f >= aT && [...crowd].reverse()}
				<G x={210} y={1150} s={0.85}>
					<Bank />
				</G>
				<G x={210} y={760} s={coinS}>
					<Coin r={40} />
				</G>
				<FText text="bank" x={210} y={690} size={52} fill={P.navy} opacity={coinS > 0.5 ? 1 : 0.6} />
				{Array.from({length: stack}).map((_, i) => (
					<G key={i} x={930} y={1180 - i * 26}>
						<ellipse cx={0} cy={0} rx={50} ry={16} fill={P.gold} stroke={P.navy} strokeWidth={5} />
					</G>
				))}
				<G x={560} y={1250}>
					<Kid look={LOOKS.ty} armR={f < aD ? 70 : 20} holdR={f < aD ? <Banknote w={110} /> : undefined} seed={1} />
				</G>
				<G x={800} y={1250}>
					<Kid look={LOOKS.kolega} armL={f > aD + 12 ? 60 : 15} holdL={f > aD + 12 ? <Banknote w={110} /> : undefined} seed={3} />
				</G>
				{f >= aD && f < aD + 12 && (
					<G x={q.x} y={q.y} r={fly * 300}>
						<Banknote w={110} />
					</G>
				)}
			</g>
			{f >= a18 && (
				<G x={540} y={380} s={Math.min(1.08, pop(f, a18))}>
					<rect x={-300} y={-100} width={600} height={170} rx={40} fill={P.white} stroke={P.navy} strokeWidth={8} />
					<FText text="18 000+" x={0} y={30} size={120} fill={P.red} />
				</G>
			)}
			<FlatBurst x={540} y={370} at={a18} r={250} color={P.gold} />
		</Svg>
	);
};

// --- piramida z dzieci (wspólna dla S4 i S6) -----------------------------------
const PYR = [
	{y: 1260, xs: [315, 465, 615, 765]},
	{y: 1060, xs: [390, 540, 690]},
	{y: 860, xs: [465, 615]},
];
const Pyramid: React.FC<{rows: number[]; top: number; collapse?: number}> = ({rows, top, collapse = 0}) => {
	const looks = [LOOKS.a, LOOKS.b, LOOKS.c, LOOKS.d, LOOKS.ty];
	let k = 0;
	const fall = (x: number, y: number, i: number) => {
		const dir = random(`pd${i}`) > 0.5 ? 1 : -1;
		const c = Easing.in(Easing.quad)(collapse);
		return {x: x + dir * (60 + random(`px${i}`) * 160) * c, y: y + (1300 - y) * c, r: dir * 80 * c};
	};
	return (
		<g>
			{PYR.map((row, ri) =>
				row.xs.map((x) => {
					const i = k++;
					const p = rows[ri] ?? 0;
					const fl = fall(x, row.y, i);
					return (
						<G key={i} x={fl.x} y={fl.y} r={fl.r} s={0.55 * Math.min(1.05, p)} sq={p < 1 ? 1 + (1 - p) * 0.4 : 1}>
							<Kid look={looks[i % 5]} armL={60} armR={60} seed={i + 30} mood={collapse > 0.1 ? 'o' : 'smile'} />
						</G>
					);
				}),
			)}
			{top > 0 &&
				(() => {
					const fl = fall(540, 660, 99);
					return (
						<G x={fl.x} y={fl.y} r={fl.r} s={0.6 * Math.min(1.05, top)}>
							<Kid look={LOOKS.kolega} armL={150} armR={150} seed={3} mood={collapse > 0.1 ? 'o' : 'smile'} />
						</G>
					);
				})()}
		</g>
	);
};

// --- S4: oddaje pieniędzmi nowych, piramida ----------------------------------
const S4: React.FC = () => {
	const {f, at} = useScene(B[3]);
	const aP = at(5, 'przynieśli');
	const aN = at(5, 'nowi');
	const a6 = at(6);
	const aPr = at(6, 'przychodzą');
	const aDz = at(6, 'działa');
	const aPir = at(7, 'piramidą');
	const aFin = at(7, 'finansową');
	const trioOut = prog(f, a6 - 4, 10);
	const h1 = prog(f, aP, 14);
	const h2 = prog(f, aN + 4, 14);
	const q1 = arc(h1, 860, 1060, 560, 1060, 150);
	const q2 = arc(h2, 520, 1060, 220, 1060, 150);
	const outline = prog(f, aPir, 18);
	const st = pop(f, aFin);
	return (
		<Svg>
			<Playground />
			<g opacity={1 - trioOut} transform={`translate(0 ${trioOut * 200})`}>
				<G x={200} y={1250}>
					<Kid look={LOOKS.ty} armR={h2 >= 1 ? 70 : 20} holdR={h2 >= 1 ? <Banknote w={110} /> : undefined} seed={1} mood={h2 >= 1 ? 'o' : 'smile'} />
				</G>
				<G x={540} y={1250}>
					<Kid look={LOOKS.kolega} talk={f < aN} seed={3} armL={h1 >= 1 && h2 <= 0 ? 60 : 15} />
				</G>
				<G x={880} y={1250}>
					<Kid look={LOOKS.d} armL={f < aP ? 70 : 15} holdL={f < aP ? <Banknote w={110} /> : undefined} seed={5} />
				</G>
				<FText text="Ty" x={200} y={790} size={64} fill={P.navy} stroke={P.white} sw={8} />
				<FText text="nowy kolega" x={880} y={790} size={54} fill={P.navy} stroke={P.white} sw={8} />
				{h1 > 0 && h1 < 1 && (
					<G x={q1.x} y={q1.y} r={h1 * -300}>
						<Banknote w={110} />
					</G>
				)}
				{h2 > 0 && h2 < 1 && (
					<G x={q2.x} y={q2.y} r={h2 * -300}>
						<Banknote w={110} />
					</G>
				)}
			</g>
			{f >= a6 && <Pyramid rows={[pop(f, aPr - 4), pop(f, aPr + 4), pop(f, aPr + 12)]} top={pop(f, aDz)} />}
			{outline > 0 && (
				<path d="M 150 1300 L 930 1300 L 540 420 Z" fill="none" stroke={P.red} strokeWidth={14} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - outline} />
			)}
			{f >= aFin && (
				<G x={540} y={300} s={2.2 - 1.2 * Math.min(1, st)} r={-5}>
					<Stamp lines={['PIRAMIDA FINANSOWA', 'wyrok sądu']} w={680} />
				</G>
			)}
		</Svg>
	);
};

// --- S5: OLT Express ---------------------------------------------------------
const S5: React.FC = () => {
	const {f, at} = useScene(B[4]);
	const a300 = at(8, '300');
	const aL = at(8, 'lotnicze');
	const aE = at(8, 'express');
	const take = interpolate(f, [aL, aL + 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
	const px = 430 + take * 280;
	const py = 1110 - take * 560;
	const tag = pop(f, a300);
	return (
		<Svg>
			<rect x={0} y={0} width={W} height={STAGE} fill={P.sky} />
			{[0, 1, 2, 3].map((i) => (
				<G key={i} x={1250 - ((f * (3 + take * 14) + i * 380) % 1500)} y={200 + i * 150}>
					<Cloud w={160 + i * 30} />
				</G>
			))}
			<rect x={0} y={1180} width={W} height={STAGE - 1180} fill={P.grass} />
			<rect x={0} y={1150} width={W} height={70} fill="#8A8F9C" />
			{Array.from({length: 8}).map((_, i) => (
				<rect key={i} x={((i * 160 - f * (4 + take * 30)) % 1280 + 1280) % 1280 - 100} y={1180} width={80} height={10} fill={P.white} />
			))}
			{take < 0.15 && <Stream tx={px - 60} ty={py - 20} n={6} from="left" speed={1.2} w={90} />}
			<G x={px} y={py} r={-16 * take}>
				<Plane w={480} prop={f * 1.3} />
				{f >= a300 && (
					<G x={-60} y={60} s={Math.min(1.06, tag)}>
						<Tag text="≈ 300 mln zł" w={330} swing={Math.sin(f / 6) * 8} />
					</G>
				)}
			</G>
			<FlatBurst x={px} y={py} at={aE} r={200} color={P.gold} />
			<FText text="OLT Express" x={540} y={330} size={96} fill={P.red} stroke={P.white} sw={12} opacity={prog(f, aL - 4, 10)} />
		</Svg>
	);
};

// --- S6: samoloty stają, likwidacja ------------------------------------------
const S6: React.FC = () => {
	const {f, at} = useScene(B[5]);
	const aPrz = at(9, 'przestały');
	const aS = at(9, 'sierpniu');
	const aLik = at(9, 'likwidację');
	const down = interpolate(f, [aPrz, aPrz + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
	const px = 360 + down * 100;
	const py = 470 + down * 640;
	const land = f > aPrz + 30 && f < aPrz + 40 ? 1 - Math.sin(Math.PI * ((f - aPrz - 30) / 10)) * 0.12 : 1;
	const sign = pop(f, aLik, FPS, 6);
	const coll = prog(f, aLik + 2, 18);
	return (
		<Svg>
			<rect x={0} y={0} width={W} height={STAGE} fill={P.sky} />
			<rect x={0} y={1180} width={W} height={STAGE - 1180} fill={P.grass} />
			<g transform="translate(800 1270) scale(0.62) translate(-540 -1260)">
				<Pyramid rows={[1, 1, 1]} top={1} collapse={coll} />
			</g>
			{Array.from({length: 6}).map((_, i) => {
				const k = (f + i * 7) % 42;
				return <circle key={i} cx={px - 230 - k * 6} cy={py - 30 - k * 2} r={18 + k * 0.8} fill="#9AA0AA" opacity={(1 - k / 42) * (f > 4 ? 0.8 : 0)} />;
			})}
			<G x={px} y={py} r={20 * down * (1 - clamp01((f - aPrz - 28) / 6))} sq={land}>
				<Plane w={460} prop={f * (down < 1 ? 0.6 : 0.05)} />
			</G>
			<G x={190} y={380} r={-4}>
				<Calendar top={f < aS ? 'LIPIEC' : 'SIERPIEŃ'} big="2012" w={250} />
			</G>
			{f >= aLik && (
				<G x={640} y={120} r={Math.sin((f - aLik) / 4) * 14 * Math.exp(-(f - aLik) / 18)}>
					<line x1={-120} y1={0} x2={-120} y2={Math.min(1, sign) * 200} stroke={P.navy} strokeWidth={6} />
					<line x1={120} y1={0} x2={120} y2={Math.min(1, sign) * 200} stroke={P.navy} strokeWidth={6} />
					<G y={Math.min(1, sign) * 200 + 60}>
						<rect x={-230} y={-60} width={460} height={120} rx={20} fill={P.red} stroke={P.navy} strokeWidth={8} />
						<FText text="LIKWIDACJA" x={0} y={24} size={74} fill={P.white} />
					</G>
				</G>
			)}
			{coll > 0 &&
				Array.from({length: 10}).map((_, i) => {
					const a = (i / 10) * Math.PI - Math.PI;
					const d = coll * (160 + (i % 3) * 60);
					return (
						<G key={i} x={860 + Math.cos(a) * d} y={1150 + Math.sin(a) * d + coll * coll * 260} r={coll * 400}>
							<Coin r={22} />
						</G>
					);
				})}
		</Svg>
	);
};

// --- S7: skarbiec ---------------------------------------------------------------
const S7: React.FC = () => {
	const {f, at} = useScene(B[6]);
	const aSk = at(10, 'skarbcu');
	const aSz = at(11, 'sztabki');
	const a8 = at(11, '8');
	const wheel = interpolate(f, [aSk - 6, aSk + 14], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const open = prog(f, aSk + 14, 16);
	const ghost = 0.35 + 0.25 * Math.sin(f / 6);
	return (
		<Svg>
			<rect x={0} y={0} width={W} height={STAGE} fill="#2A3768" />
			{Array.from({length: 7}).map((_, i) => (
				<circle key={i} cx={90 + i * 150} cy={180} r={9} fill={P.navy} />
			))}
			<circle cx={540} cy={800} r={360} fill={P.navy} stroke="#111a33" strokeWidth={14} />
			<g opacity={open}>
				<path d="M 260 1060 Q 540 420 820 1060 Z" fill="none" stroke={P.gold} strokeWidth={8} strokeDasharray="22 18" opacity={ghost} />
				<FText text="851 mln zł" x={540} y={630} size={70} fill={P.gold} opacity={ghost + 0.2} />
				<FText text="tyle stracili klienci" x={540} y={685} size={40} fill={P.goldLight} opacity={ghost + 0.1} />
				{[0, 1, 2].map((i) => (
					<G key={i} x={480 + i * 60 - (i === 2 ? 30 : 0)} y={1060 - (i === 2 ? 50 : 0)} s={Math.min(1.05, pop(f, aSz + i * 4)) * 0.55}>
						<GoldBar w={200} />
					</G>
				))}
				{f >= a8 && (
					<G x={720} y={900} s={Math.min(1.06, pop(f, a8))} r={-8}>
						<Tag text="≈ 8 mln zł" w={280} swing={Math.sin(f / 7) * 6} />
					</G>
				)}
			</g>
			<g transform={`translate(${180 + 360 * (1 - open)} 800) scale(${1 - open * 0.86} 1) translate(-360 0)`}>
				<circle cx={360} cy={0} r={340} fill="#AEB4C2" stroke={P.navy} strokeWidth={10} />
				<circle cx={360} cy={0} r={270} fill="#C9CED9" stroke={P.navy} strokeWidth={6} />
				<g transform={`translate(360 0) rotate(${wheel})`}>
					{[0, 60, 120].map((r) => (
						<rect key={r} x={-130} y={-14} width={260} height={28} rx={14} fill={P.navy} transform={`rotate(${r})`} />
					))}
					<circle cx={0} cy={0} r={46} fill={P.gold} stroke={P.navy} strokeWidth={8} />
				</g>
			</g>
			<FlatBurst x={720} y={960} at={a8} r={150} color={P.gold} />
		</Svg>
	);
};

// --- S8: wyrok ----------------------------------------------------------------
const Silhouette: React.FC = () => (
	<g>
		<circle cx={0} cy={-330} r={70} fill={P.navy} />
		<rect x={-80} y={-250} width={160} height={250} rx={50} fill={P.navy} />
	</g>
);
const S8: React.FC = () => {
	const {f, at} = useScene(B[7]);
	const aD = at(12, 'dostał');
	const a15 = at(12, '15');
	const aW = at(12, 'więzienia');
	const a11 = at(12, '11,5');
	const swing = interpolate(f, [aD - 10, aD, aD + 3, aD + 8], [32, 0, -4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
	const bars = prog(f, aW - 4, 12);
	return (
		<Svg>
			<rect x={0} y={0} width={W} height={STAGE} fill="#F3E3C3" />
			<rect x={0} y={1040} width={W} height={STAGE - 1040} fill="#B9874E" />
			<G x={330} y={1250}>
				<Silhouette />
			</G>
			<G x={750} y={1250}>
				<Silhouette />
			</G>
			<g transform={`translate(0 ${(bars - 1) * 900})`}>
				<rect x={120} y={760} width={840} height={24} rx={10} fill="#5B6275" />
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={140 + i * 100} y={760} width={22} height={560} rx={10} fill="#5B6275" />
				))}
			</g>
			{f >= a15 && (
				<G x={330} y={780} s={Math.min(1.08, pop(f, a15))}>
					<rect x={-130} y={-60} width={260} height={110} rx={24} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="15 lat" x={0} y={22} size={68} fill={P.red} />
				</G>
			)}
			{f >= a11 && (
				<G x={750} y={780} s={Math.min(1.08, pop(f, a11))}>
					<rect x={-160} y={-60} width={320} height={110} rx={24} fill={P.white} stroke={P.navy} strokeWidth={7} />
					<FText text="11,5 roku" x={0} y={22} size={64} fill={P.red} />
				</G>
			)}
			<rect x={500} y={640} width={200} height={50} rx={14} fill="#8B5A2B" stroke={P.navy} strokeWidth={6} />
			<g transform={`translate(940 580) rotate(${swing})`}>
				<rect x={-300} y={-13} width={300} height={26} rx={12} fill="#8B5A2B" stroke={P.navy} strokeWidth={6} />
				<rect x={-360} y={-62} width={110} height={124} rx={22} fill="#A86B34" stroke={P.navy} strokeWidth={7} />
			</g>
			<FlatBurst x={635} y={640} at={aD} r={90} color={P.navy} />
			<FText text="wyrok prawomocny" x={300} y={480} size={54} fill={P.navy} opacity={prog(f, aD + 4, 10)} />
		</Svg>
	);
};

// --- S9: morał ----------------------------------------------------------------
const S9: React.FC = () => {
	const {f, at} = useScene(B[8]);
	const aW = at(13, 'więcej');
	const aZ = at(13, 'zapytaj');
	const aSk = at(13, 'skąd');
	const fly = prog(f, 0, 24);
	const q = arc(fly, 1200, 120, 560, 520, -60);
	const pulse = 1 + 0.1 * Math.abs(Math.sin((f - aW) / 4)) * (f >= aW ? 1 : 0);
	const qm = pop(f, aSk);
	const glass = (
		<G r={-20}>
			<line x1={0} y1={0} x2={0} y2={-60} stroke={P.navy} strokeWidth={14} strokeLinecap="round" />
			<circle cx={0} cy={-100} r={46} fill="rgba(191,227,245,0.7)" stroke={P.navy} strokeWidth={10} />
		</G>
	);
	return (
		<Svg>
			<Playground />
			<G x={320} y={1250}>
				<Kid look={LOOKS.ty} armR={f >= aZ ? interpolate(pop(f, aZ), [0, 1], [20, 140]) : 20} holdR={f >= aZ ? glass : undefined} seed={1} />
			</G>
			<G x={770} y={1250}>
				<Kid look={LOOKS.kolega} armL={150} talk={f < aW + 10} seed={3} />
			</G>
			<G x={650} y={720} s={pulse} r={-6}>
				<rect x={-130} y={-62} width={260} height={110} rx={20} fill={P.gold} stroke={P.navy} strokeWidth={7} />
				<FText text="116 zł!" x={0} y={20} size={66} fill={P.navy} />
			</G>
			{f >= aSk && (
				<G x={300} y={640} s={Math.min(1.1, qm)} r={8}>
					<FText text="?" x={0} y={0} size={300} fill={P.red} stroke={P.white} sw={14} />
				</G>
			)}
			<G x={q.x} y={q.y + Math.sin(f / 8) * 14} r={Math.sin(f / 10) * 8}>
				<Banknote face="sad" w={180} />
			</G>
			<FlatBurst x={300} y={540} at={aSk} r={150} color={P.gold} />
		</Svg>
	);
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

const SHOTS: Shot[] = B.slice(0, -1).map((from, i) => ({from, to: B[i + 1], ox: 540, oy: [900, 900, 1100, 900, 700, 800, 800, 800, 900, 900][i], zoom: i === 0 || i === 9 ? 1 : 1.05}));
const HITS: Hit[] = [
	{t: cue(0, '851'), kind: 'both', amp: 1.1},
	{t: cue(1, 'pięciolatkowi'), kind: 'punch', amp: 0.7},
	{t: cue(2, '100'), kind: 'punch', amp: 0.5},
	{t: cue(2, 'złoto'), kind: 'punch', amp: 0.7},
	{t: cue(2, '116'), kind: 'both', amp: 0.9},
	{t: cue(3, 'mniej'), kind: 'punch', amp: 0.5},
	{t: cue(4, '18'), kind: 'both', amp: 0.9},
	{t: cue(5, 'nowi'), kind: 'punch', amp: 0.5},
	{t: cue(6, 'działa'), kind: 'punch', amp: 0.6},
	{t: cue(7, 'finansową'), kind: 'both', amp: 1.1},
	{t: cue(8, '300'), kind: 'punch', amp: 0.7},
	{t: cue(8, 'express'), kind: 'punch', amp: 0.8},
	{t: cue(9, 'likwidację'), kind: 'both', amp: 1.1},
	{t: cue(10, 'skarbcu'), kind: 'punch', amp: 0.7},
	{t: cue(11, '8'), kind: 'both', amp: 0.9},
	{t: cue(12, 'dostał'), kind: 'shake', amp: 1.2},
	{t: cue(12, '15'), kind: 'punch', amp: 0.6},
	{t: cue(12, '11,5'), kind: 'punch', amp: 0.6},
	{t: cue(13, 'zapytaj'), kind: 'punch', amp: 0.6},
	{t: cue(13, 'skąd'), kind: 'both', amp: 0.9},
];

export const AmberShort: React.FC = () => {
	const {fps} = useVideoConfig();
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123').then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: P.bg}}>
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
			</Camera>
			<div style={{position: 'absolute', left: 0, top: STAGE, width: W, height: H - STAGE, background: P.bg}} />
			<Captions lines={LINES} top={1395} left={60} width={860} size={80} font={FFONT} weight={800} color={P.navy} keyColor={P.red} markColor={P.goldLight} />
			<Audio src={staticFile('amber_vo.wav')} />
		</AbsoluteFill>
	);
};
