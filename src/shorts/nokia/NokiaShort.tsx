// Short #2 Szczęście Pieniędzy Nie Daje: Nokia i prototyp w szufladzie (1080×1920).
// Styl TED-Ed w płaskiej animacji: jeden świat złożony z „pokoi”, kamera przejeżdża między nimi,
// motyw szuflady spina początek i koniec (pętla). Każdy ruch startuje na słowie lektora (vo.gen.ts).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/baloo-2/800.css';
import {P, FFONT, G, Kid, LOOKS, Calendar, Tag, Stamp, Star, FText, FlatBurst, Coin, clamp01, prog, pop, arc} from '../../kit-flat/flat';
import {Camera, type Hit} from '../../kit/dynamics';
import {Captions} from '../../kit/captions';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
const STAGE = 1340;
const RW = 1080; // szerokość „pokoju” w świecie

// --- czasy -------------------------------------------------------------------
const norm = (s: string) => s.toLowerCase().replace(/[,.?:!]/g, '');
export const cue = (li: number, w?: string) => {
	const l = LINES[li];
	if (!w) return l.s;
	const hit = l.words.find((x) => norm(x.w).startsWith(norm(w)));
	if (!hit) throw new Error(`cue: brak słowa "${w}" w linii ${li}`);
	return hit.s;
};
const T = (li: number, w?: string) => Math.round(cue(li, w) * FPS);
const END_F = Math.round((LINES[9].e + 0.25) * FPS);
export const TOTAL_FRAMES = END_F + 20;

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const kf = (f: number, pts: [number, number][]) => {
	if (f <= pts[0][0]) return pts[0][1];
	for (let i = 1; i < pts.length; i++) {
		if (f <= pts[i][0]) {
			const [a, va] = pts[i - 1];
			const [b, vb] = pts[i];
			return va + (vb - va) * ease(clamp01((f - a) / Math.max(1, b - a)));
		}
	}
	return pts[pts.length - 1][1];
};
const pulse = (f: number, a: number, dur = 10) => Math.sin(Math.PI * clamp01((f - a) / dur));

// --- rekwizyty -------------------------------------------------------------------
const BOSS = {shirt: '#5C6B8A', hair: '#B9B9B9'};

// Prototyp z 2004 r.: duży dotykowy ekran, internet (globus), dotyk (fala).
const Proto: React.FC<{tap: number; globe: number; glow?: number}> = ({tap, globe, glow = 0}) => (
	<g>
		{glow > 0 && <circle cx={0} cy={0} r={260} fill={P.goldLight} opacity={0.35 * glow} />}
		<rect x={-115} y={-185} width={230} height={370} rx={34} fill={P.navy} stroke={P.navy} strokeWidth={7} />
		<rect x={-95} y={-160} width={190} height={300} rx={14} fill={P.sky} />
		<g transform={`translate(0 -20) scale(${1 + 0.15 * globe})`}>
			<circle cx={0} cy={0} r={62} fill={P.green} stroke={P.navy} strokeWidth={6} />
			<ellipse cx={0} cy={0} rx={28} ry={62} fill="none" stroke={P.navy} strokeWidth={5} />
			<line x1={-62} y1={0} x2={62} y2={0} stroke={P.navy} strokeWidth={5} />
			<path d="M -54 -30 Q 0 -18 54 -30 M -54 30 Q 0 18 54 30" fill="none" stroke={P.navy} strokeWidth={5} />
		</g>
		{tap > 0 && tap < 1 && (
			<g opacity={1 - tap}>
				<circle cx={40} cy={80} r={14 + tap * 50} fill="none" stroke={P.white} strokeWidth={8} />
				<circle cx={40} cy={80} r={8} fill={P.white} />
			</g>
		)}
		<circle cx={0} cy={162} r={9} fill={P.grey} />
	</g>
);

// Klasyczna Nokia z klawiaturą i „Wężem”.
const Brick: React.FC<{w?: number}> = ({w = 130}) => {
	const s = w / 130;
	return (
		<g transform={`scale(${s})`}>
			<rect x={30} y={-160} width={22} height={40} rx={8} fill={P.navy} />
			<rect x={-65} y={-150} width={130} height={300} rx={36} fill={P.navy} />
			<rect x={-46} y={-122} width={92} height={78} rx={8} fill="#A7C957" />
			{[
				[-30, -100],
				[-18, -100],
				[-6, -100],
				[-6, -88],
				[-6, -76],
				[6, -76],
			].map(([x, y], i) => (
				<rect key={i} x={x} y={y} width={11} height={11} fill="#2F3E1C" />
			))}
			<rect x={24} y={-64} width={10} height={10} fill="#2F3E1C" />
			{Array.from({length: 12}).map((_, i) => (
				<circle key={i} cx={-30 + (i % 3) * 30} cy={-10 + Math.floor(i / 3) * 34} r={11} fill={P.grey} />
			))}
		</g>
	);
};

// Zwykły telefon z 2007 r. (inne marki).
const Plain: React.FC = () => (
	<g>
		<rect x={-55} y={-130} width={110} height={260} rx={26} fill={P.grey} stroke={P.navy} strokeWidth={6} />
		<rect x={-38} y={-106} width={76} height={70} rx={6} fill={P.white} />
		{Array.from({length: 9}).map((_, i) => (
			<circle key={i} cx={-24 + (i % 3) * 24} cy={0 + Math.floor(i / 3) * 30} r={9} fill={P.white} />
		))}
	</g>
);

// Smartfon z dotykowym ekranem i siatką ikon (bez logo).
const Smart: React.FC = () => {
	const cols = ['#E4572E', '#F2B705', '#2E9E6B', '#3A86FF', '#9B5DE5', '#00A6A6'];
	return (
		<g>
			<rect x={-120} y={-235} width={240} height={470} rx={40} fill="#15161A" stroke={P.navy} strokeWidth={7} />
			<rect x={-100} y={-195} width={200} height={360} rx={10} fill="#22324F" />
			{Array.from({length: 16}).map((_, i) => (
				<rect key={i} x={-84 + (i % 4) * 46} y={-180 + Math.floor(i / 4) * 52} width={34} height={34} rx={9} fill={cols[i % cols.length]} />
			))}
			<circle cx={0} cy={200} r={18} fill="none" stroke="#555" strokeWidth={5} />
		</g>
	);
};

// Biurko z szufladą; open 0–1, glow 0–1, lock 0–1.
const Desk: React.FC<{open: number; glow: number; lock: number}> = ({open, glow, lock}) => {
	const f = useCurrentFrame();
	const dy = open * 52;
	const sc = 1 + 0.09 * open;
	return (
		<g>
			<rect x={240} y={958} width={600} height={40} rx={10} fill="#C98A4B" stroke={P.navy} strokeWidth={7} />
			<rect x={275} y={996} width={530} height={304} fill="#B5743A" stroke={P.navy} strokeWidth={7} />
			{/* wnętrze szuflady i światło */}
			{open > 0.01 && (
				<g>
					<polygon points={`360,1036 720,1036 ${720 + 20 * open},${1036 + dy} ${360 - 20 * open},${1036 + dy}`} fill={P.navy} />
					{glow > 0 && (
						<g opacity={glow * (0.8 + 0.2 * Math.sin(f / 5))}>
							<polygon points={`380,1040 700,1040 980,300 100,300`} fill={P.goldLight} opacity={0.32} />
							<polygon points={`440,1040 640,1040 760,420 320,420`} fill={P.goldLight} opacity={0.35} />
						</g>
					)}
				</g>
			)}
			<g transform={`translate(540 ${1110 + dy}) scale(${sc}) translate(-540 -1110)`}>
				<rect x={360} y={1036} width={360} height={150} rx={10} fill="#C98A4B" stroke={P.navy} strokeWidth={7} />
				<rect x={490} y={1098} width={100} height={20} rx={10} fill={P.navy} />
			</g>
			{lock > 0 && (
				<g transform={`translate(540 1150) scale(${lock})`}>
					<path d="M -34 -20 L -34 -48 Q -34 -84 0 -84 Q 34 -84 34 -48 L 34 -20" fill="none" stroke={P.navy} strokeWidth={14} />
					<rect x={-52} y={-24} width={104} height={84} rx={14} fill={P.gold} stroke={P.navy} strokeWidth={7} />
					<circle cx={0} cy={12} r={10} fill={P.navy} />
				</g>
			)}
		</g>
	);
};

// Ostrzeżenie (trójkąt z wykrzyknikiem).
const Warn: React.FC = () => (
	<g>
		<path d="M 0 -90 L 90 70 L -90 70 Z" fill={P.gold} stroke={P.navy} strokeWidth={8} strokeLinejoin="round" />
		<rect x={-9} y={-40} width={18} height={70} rx={8} fill={P.navy} />
		<circle cx={0} cy={50} r={11} fill={P.navy} />
	</g>
);

// --- świat ------------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();

	// klatki kluczowe
	const tDot = T(0, 'dotykowym');
	const tInt = T(0, 'internetem');
	const tTrzy = T(0, 'trzy');
	const tSkas = T(1, 'skasowała');
	const t2 = T(2);
	const t07 = T(2, '2007');
	const t25 = T(2, '2');
	const tNok = T(2, 'Nokia');
	const t3 = T(3);
	const t04 = T(3, '2004');
	const tMen = T(3, 'menedżera');
	const tProto = T(3, 'prototyp');
	const tDot2 = T(3, 'dotykowy');
	const tInt2 = T(3, 'internet');
	const tSzef = T(4);
	const tDrogi = T(4, 'drogi');
	const tRyzy = T(4, 'ryzykowny');
	const tTraf = T(5, 'trafił');
	const tSzuf = T(5, 'szuflady');
	const t6 = T(6);
	const tApple = T(6, 'Apple');
	const tIph = T(6, "iPhone'a");
	const t7 = T(7);
	const tPog = T(7, 'pogoń');
	const tPoz = T(7, 'późno');
	const t8 = T(8);
	const t40 = T(8, '40%');
	const t15 = T(8, '15');
	const tMs = T(8, 'Microsoft');
	const t55 = T(8, '5,5');
	const t9 = T(9);
	const tPom = T(9, 'pomysł');
	const tSch = T(9, 'schowała');
	const tSzuf2 = T(9, 'szuflady');

	// --- POKÓJ 0: biurko i szuflada ---
	// szuflada: otwarta w haczyku, zamknięta od „skasowała”, otwarta na chwilę przy „trafił”, otwarta na końcu
	const open = kf(f, [
		[0, 1],
		[tSkas + 4, 1],
		[tSkas + 10, 0],
		[tTraf - 6, 0],
		[tTraf + 4, 1],
		[tSzuf + 2, 1],
		[tSzuf + 8, 0],
		[tSch - 2, 0],
		[tSch + 10, 1],
	]);
	const glow = f < tSkas + 6 ? 1 : f > tPom ? prog(f, tPom, 20) : 0;
	const lock = f >= tSzuf + 8 && f < tPom + 6 ? Math.min(1.08, pop(f, tSzuf + 8)) * (1 - prog(f, tPom, 8)) : 0;

	// prototyp: unosi się nad szufladą (haczyk), wpada do szuflady, wraca w rękach zespołu, znowu wpada, a na końcu wychodzi
	const bob = Math.sin(f / 9) * 12;
	let px = 540;
	let py = 690 + bob;
	let ps = 1;
	let po = 1;
	if (f >= tSkas - 2 && f < t3) {
		const p = prog(f, tSkas - 2, 10);
		py = 690 + (1080 - 690) * p;
		ps = 1 - 0.6 * p;
		po = p < 1 ? 1 : 0;
	} else if (f >= t3 && f < tTraf) {
		const p = pop(f, tProto);
		px = 540;
		py = 665;
		ps = Math.min(1.05, p);
		po = f >= tProto ? 1 : 0;
	} else if (f >= tTraf && f < t9) {
		const p = prog(f, tTraf + 2, 14);
		const q = arc(p, 540, 665, 540, 1080, 160);
		px = q.x;
		py = q.y;
		ps = 1 - 0.6 * p;
		po = p < 1 ? 1 : 0;
	} else if (f >= t9) {
		const p = prog(f, tSzuf2 - 4, 18);
		py = 1080 + (690 + bob - 1080) * p;
		ps = 0.4 + 0.6 * p;
		po = f >= tSzuf2 - 4 ? 1 : 0;
	}
	const tap = f < t3 ? clamp01((f - tDot) / 14) : clamp01((f - tDot2) / 14);
	const globe = f < t3 ? pulse(f, tInt) : pulse(f, tInt2);

	// --- POKÓJ 1: rynek 2007 ---
	const morph2 = pop(f, t25);

	// --- POKÓJ 3: wyścig ---
	const smartX = kf(f, [
		[t7, 380],
		[tPog, 420],
		[tPoz, 980],
	]);
	const brickX = kf(f, [
		[t7, 120],
		[tPog, 120],
		[tPoz + 10, 520],
	]);
	const run = f >= tPog && f < tPoz + 14;

	// --- POKÓJ 4: wykres i sprzedaż ---
	const bar = kf(f, [
		[t40 - 4, 0],
		[t40 + 8, 40],
		[t15 - 2, 40],
		[t15 + 14, 15],
	]);

	return (
		<g>
			{/* ============ TŁA POKOI ============ */}
			<rect x={-RW} y={0} width={RW * 2} height={STAGE} fill="#F9E4BF" />
			<rect x={-RW} y={1300} width={RW * 2} height={40} fill="#D9A066" />
			<rect x={RW} y={0} width={RW} height={STAGE} fill={P.sky} />
			<rect x={RW * 2} y={0} width={RW} height={STAGE} fill={P.navy} />
			<rect x={RW * 3} y={0} width={RW} height={STAGE} fill={P.sky} />
			<rect x={RW * 4} y={0} width={RW * 2} height={STAGE} fill={P.bg} />

			{/* ============ POKÓJ 0: BIURKO ============ */}
			<g>
				{/* tapeta */}
				{Array.from({length: 9}).map((_, i) => (
					<line key={i} x1={i * 130 + 20} y1={0} x2={i * 130 + 20} y2={958} stroke="#F1D3A2" strokeWidth={10} />
				))}
				<G x={170} y={250} s={pop(f, 0) > 0 ? 1 : 1} r={-6}>
					<Calendar top="ROK" big="2004" w={210} />
				</G>
				<G x={910} y={250} s={Math.min(1.06, pop(f, tTrzy))} r={6}>
					<Calendar top="iPhone" big="2007" w={210} />
				</G>
				{f >= tTrzy && f < t2 && (
					<g opacity={prog(f, tTrzy + 4, 8)}>
						<path d="M 300 260 Q 540 170 780 260" fill="none" stroke={P.red} strokeWidth={10} strokeLinecap="round" />
						<path d="M 752 232 L 784 262 L 744 276" fill="none" stroke={P.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						<FText text="3 lata wcześniej" x={540} y={160} size={64} fill={P.red} stroke={P.bg} />
					</g>
				)}
				<FText text="według byłego menedżera Nokii" x={540} y={395} size={44} fill={P.navy} opacity={prog(f, tMen, 10) * (1 - prog(f, tSzef, 10))} />
				<Desk open={open} glow={glow} lock={lock} />
				{/* zespół i szef */}
				<g opacity={prog(f, t04, 10) * (1 - prog(f, tTraf + 16, 10))}>
					<G x={140} y={1300} s={0.82}>
						<Kid look={LOOKS.a} armR={f > tProto ? 125 : 30} talk={f > tProto && f < tInt2 + 20} seed={2} />
					</G>
				</g>
				<g opacity={prog(f, tSzef - 2, 8) * (1 - prog(f, tTraf + 16, 10))}>
					<G x={kf(f, [[tSzef - 2, 1060], [tSzef + 10, 930]])} y={1300} s={0.82}>
						<Kid look={BOSS} armL={f > tDrogi ? 70 : 20} armR={f > tRyzy ? 70 : 20} mood={f > tDrogi ? 'sad' : 'smile'} talk={f > tSzef + 4 && f < tRyzy + 14} seed={5} />
						<path d="M -10 -256 L 10 -256 L 16 -176 L 0 -156 L -16 -176 Z" fill={P.red} stroke={P.navy} strokeWidth={5} />
					</G>
					<G x={760} y={470} s={Math.min(1.08, pop(f, tDrogi))}>
						<Tag text="za drogi" w={250} color={P.gold} swing={Math.sin((f - tDrogi) / 6) * 8 * Math.exp(-Math.max(0, f - tDrogi) / 30)} />
					</G>
					<G x={880} y={760} s={Math.min(1.08, pop(f, tRyzy))}>
						<Warn />
					</G>
				</g>
				{/* prototyp */}
				<G x={px} y={py} s={ps} o={po}>
					<Proto tap={tap} globe={globe} glow={f < tSkas || f > tSzuf2 ? 1 : 0} />
				</G>
				{/* SKASOWANY */}
				{f >= tSkas + 8 && f < t2 + 4 && (
					<G x={540} y={1110} s={interpolate(f, [tSkas + 8, tSkas + 14], [2.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} r={-8} o={clamp01((f - tSkas - 8) / 3)}>
						<Stamp lines={['SKASOWANY']} w={520} />
					</G>
				)}
				<FlatBurst x={540} y={1110} at={tSkas + 12} r={150} color={P.red} />
				<FlatBurst x={540} y={1110} at={tSzuf + 8} r={150} color={P.navy} />
				<FlatBurst x={540} y={665} at={tProto} r={170} color={P.gold} />
				<FlatBurst x={540} y={1060} at={tSch + 6} r={170} color={P.gold} />
			</g>

			{/* ============ POKÓJ 1: RYNEK 2007 ============ */}
			<g transform={`translate(${RW} 0)`}>
				<G x={540} y={240} s={Math.min(1.06, pop(f, t07))}>
					<Calendar top="ROK" big="2007" w={230} />
				</G>
				<rect x={60} y={1010} width={960} height={36} rx={10} fill="#C98A4B" stroke={P.navy} strokeWidth={7} />
				{[0, 1, 2, 3, 4].map((i) => {
					const x = 140 + i * 200;
					const isN = i === 1 || i === 3;
					const app = Math.min(1.05, pop(f, t07 + 4 + i * 3));
					const m = isN ? morph2 : 0;
					return (
						<G key={i} x={x} y={860} s={app * (1 + 0.15 * (isN ? pulse(f, t25 + 2, 10) : 0))}>
							{m < 0.5 ? <Plain /> : <Brick w={130} />}
							{isN && f >= tNok && (
								<G x={0} y={-215} s={Math.min(1.1, pop(f, tNok + i))}>
									<path d="M -50 30 L -50 -20 L -25 5 L 0 -30 L 25 5 L 50 -20 L 50 30 Z" fill={P.gold} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
								</G>
							)}
						</G>
					);
				})}
				<FText text="2 na 5" x={540} y={1220} size={150} fill={P.gold} stroke={P.navy} sw={14} opacity={prog(f, t25, 8)} />
				<FlatBurst x={340} y={860} at={t25 + 2} r={150} />
				<FlatBurst x={740} y={860} at={t25 + 4} r={150} />
			</g>

			{/* ============ POKÓJ 2: SCENA I PREMIERA ============ */}
			<g transform={`translate(${RW * 2} 0)`}>
				<path d="M 0 0 L 170 0 Q 120 600 160 1340 L 0 1340 Z" fill={P.red} />
				<path d="M 1080 0 L 910 0 Q 960 600 920 1340 L 1080 1340 Z" fill={P.red} />
				<rect x={0} y={1150} width={1080} height={190} fill="#2C3A66" />
				<polygon points="440,0 640,0 860,1150 220,1150" fill={P.goldLight} opacity={0.18 + 0.12 * prog(f, tApple, 10)} />
				<G x={540} y={300} s={Math.min(1.06, pop(f, t6))}>
					<Calendar top="ROK" big="2007" w={210} />
				</G>
				<G x={540} y={kf(f, [[tApple, 1400], [tIph + 4, 760]])} s={1 + 0.06 * pulse(f, tIph + 4, 12)}>
					<Smart />
				</G>
				{[
					[230, 560, 0],
					[860, 460, 5],
					[300, 930, 9],
					[820, 900, 13],
				].map(([x, y, d], i) => {
					const k = f - (tIph + d);
					return k >= 0 && k < 8 ? (
						<G key={i} x={x} y={y} s={1 + k * 0.15} o={1 - k / 8}>
							<Star r={50} color={P.white} />
						</G>
					) : null;
				})}
				<FlatBurst x={540} y={760} at={tIph + 4} r={280} color={P.white} n={16} />
			</g>

			{/* ============ POKÓJ 3: POGOŃ ============ */}
			<g transform={`translate(${RW * 3} 0)`}>
				<rect x={0} y={1000} width={1080} height={340} fill={P.grass} />
				<rect x={0} y={1060} width={1080} height={160} fill="#8D93A1" />
				{Array.from({length: 7}).map((_, i) => (
					<rect key={i} x={((i * 180 - (f * 14) % 180) + 1080) % 1080 - 60} y={1132} width={90} height={16} rx={8} fill={P.white} />
				))}
				{/* meta */}
				<g>
					<rect x={1000} y={760} width={14} height={340} fill={P.navy} />
					{Array.from({length: 8}).map((_, i) => (
						<rect key={i} x={1014 + (i % 2) * 30} y={760 + Math.floor(i / 2) * 30} width={30} height={30} fill={(i + Math.floor(i / 2)) % 2 ? P.white : P.navy} />
					))}
				</g>
				<G x={smartX} y={900} s={0.55} r={-6}>
					<Smart />
				</G>
				{f > tPog &&
					[0, 1, 2].map((i) => <rect key={i} x={smartX - 200 - i * 40} y={820 + i * 50} width={120 - i * 20} height={10} rx={5} fill={P.white} opacity={0.8} />)}
				<G x={brickX} y={1010} s={0.8}>
					{/* nogi biegnącej Nokii */}
					<g transform={`rotate(${run ? Math.sin(f / 2.5) * 30 : 0} 0 130)`}>
						<line x1={-20} y1={130} x2={-20} y2={200} stroke={P.navy} strokeWidth={18} strokeLinecap="round" />
					</g>
					<g transform={`rotate(${run ? -Math.sin(f / 2.5) * 30 : 0} 0 130)`}>
						<line x1={20} y1={130} x2={20} y2={200} stroke={P.navy} strokeWidth={18} strokeLinecap="round" />
					</g>
					<g transform={`rotate(${run ? 8 : 0})`}>
						<Brick w={130} />
					</g>
					{run &&
						[0, 1].map((i) => {
							const k = (f + i * 9) % 18;
							return <circle key={i} cx={70 - i * 130} cy={-120 + k * 3} r={9} fill="#3A86FF" opacity={1 - k / 18} />;
						})}
				</G>
				<G x={600} y={450} s={interpolate(f, [tPoz, tPoz + 6], [2.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} r={-8} o={f >= tPoz ? 1 : 0}>
					<Stamp lines={['ZA PÓŹNO']} w={520} />
				</G>
				<FlatBurst x={980} y={880} at={tPoz} r={140} color={P.gold} />
			</g>

			{/* ============ POKÓJ 4: 2013, WYKRES I SPRZEDAŻ ============ */}
			<g transform={`translate(${RW * 4} 0)`}>
				{Array.from({length: 6}).map((_, i) => (
					<line key={i} x1={80} y1={1150 - i * 130} x2={620} y2={1150 - i * 130} stroke={P.grey} strokeWidth={4} />
				))}
				<G x={190} y={250} s={Math.min(1.06, pop(f, t8))} r={-5}>
					<Calendar top="ROK" big="2013" w={200} />
				</G>
				<rect x={180} y={1150 - bar * 17} width={240} height={bar * 17} rx={12} fill={f >= t15 ? P.red : P.navy} stroke={P.navy} strokeWidth={7} />
				<FText text={`${Math.round(bar)}%`} x={300} y={1150 - bar * 17 - 30} size={110} fill={f >= t15 ? P.red : P.navy} stroke={P.bg} opacity={bar > 1 ? 1 : 0} />
				<FText text="udział w rynku" x={300} y={1230} size={52} opacity={prog(f, t40, 8)} />
				{/* pudełko z działem telefonów */}
				<G x={800} y={kf(f, [[tMs - 4, 1750], [tMs + 8, 1000]])} s={1}>
					<rect x={-150} y={-60} width={300} height={200} rx={10} fill="#C98A4B" stroke={P.navy} strokeWidth={7} />
					<path d="M -150 -60 L -110 -120 L 110 -120 L 150 -60 Z" fill="#E0A866" stroke={P.navy} strokeWidth={7} />
					<G x={0} y={-130} s={0.6}>
						<Brick w={130} />
					</G>
					<FText text="dział telefonów" x={0} y={60} size={38} fill={P.navy} />
				</G>
				<FText text="Microsoft kupuje" x={800} y={kf(f, [[tMs - 4, 1750], [tMs + 8, 760]])} size={58} fill={P.navy} stroke={P.bg} />
				<G x={800} y={380} s={Math.min(1.08, pop(f, t55))}>
					<Tag text="≈ 5,5 mld €" w={330} color={P.gold} swing={Math.sin((f - t55) / 6) * 10 * Math.exp(-Math.max(0, f - t55) / 30)} />
				</G>
				{f >= t55 &&
					[0, 1, 2, 3, 4].map((i) => {
						const p = prog(f, t55 + 4 + i * 3, 16);
						const q = arc(p, 800, 520, 600 + i * 90, 1250, -120);
						return p > 0 && p < 1 ? (
							<G key={i} x={q.x} y={q.y} s={0.9}>
								<Coin r={28} />
							</G>
						) : null;
					})}
				<FlatBurst x={300} y={1150 - 15 * 17 - 60} at={t15} r={130} color={P.red} />
				<FlatBurst x={800} y={460} at={t55} r={160} />
			</g>
		</g>
	);
};

// Kamera świata: przejazdy między pokojami z lekkim oddaleniem w połowie drogi.
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t2 = T(2);
	const t3 = T(3);
	const t6 = T(6);
	const t7 = T(7);
	const t8 = T(8);
	const t9 = T(9);
	const tProto = T(3, 'prototyp');
	const tTraf = T(5, 'trafił');
	const move = (a: number, from: number, to: number): [number, number][] => [
		[a - 8, from],
		[a + 10, to],
	];
	const cx = kf(f, [[0, 540], ...move(t2, 540, 540 + RW), ...move(t3, 540 + RW, 540), ...move(t6, 540, 540 + RW * 2), ...move(t7, 540 + RW * 2, 540 + RW * 3), ...move(t8, 540 + RW * 3, 540 + RW * 4), [t9 - 10, 540 + RW * 4], [t9 + 14, 540]]);
	const dip = (a: number, d = 0.12, len = 10): [number, number][] => [
		[a - 8, 1],
		[a + 1, 1 - d],
		[a + len, 1],
	];
	const z = kf(f, [[0, 1], ...dip(t2), [tProto - 2, 1], [tProto + 10, 1.06], [tTraf, 1.06], [tTraf + 10, 1], ...dip(t6), ...dip(t7), ...dip(t8), [t9 - 10, 1], [t9 + 2, 0.75], [t9 + 14, 1]]);
	const cy = 670;
	return <g transform={`translate(${540 - cx * z} ${cy - cy * z}) scale(${z})`}>{children}</g>;
};

const HITS: Hit[] = [
	{t: cue(0, 'dotykowym'), kind: 'punch', amp: 0.6},
	{t: cue(0, 'trzy'), kind: 'punch', amp: 0.8},
	{t: cue(1, 'skasowała') + 0.4, kind: 'both', amp: 1.2},
	{t: cue(2, '2'), kind: 'punch', amp: 0.9},
	{t: cue(2, 'Nokia'), kind: 'punch', amp: 0.5},
	{t: cue(3, 'prototyp'), kind: 'punch', amp: 0.8},
	{t: cue(4, 'drogi'), kind: 'punch', amp: 0.6},
	{t: cue(4, 'ryzykowny'), kind: 'shake', amp: 0.7},
	{t: cue(5, 'szuflady') + 0.27, kind: 'both', amp: 1.1},
	{t: cue(6, "iPhone'a") + 0.13, kind: 'both', amp: 1.0},
	{t: cue(7, 'późno'), kind: 'both', amp: 1.1},
	{t: cue(8, '40%'), kind: 'punch', amp: 0.7},
	{t: cue(8, '15'), kind: 'shake', amp: 0.9},
	{t: cue(8, 'Microsoft'), kind: 'punch', amp: 0.6},
	{t: cue(8, '5,5'), kind: 'punch', amp: 0.9},
	{t: cue(9, 'szuflady'), kind: 'punch', amp: 0.8},
];

export const NokiaShort: React.FC = () => {
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123≈€%').then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: P.bg}}>
			<Camera shots={[{from: 0, to: 999, ox: 540, oy: 700, zoom: 1}]} hits={HITS}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
					<defs>
						<clipPath id="nstage">
							<rect x={-200} y={-200} width={W + 400} height={STAGE + 200} />
						</clipPath>
					</defs>
					<g clipPath="url(#nstage)">
						<CamWorld>
							<World />
						</CamWorld>
					</g>
				</svg>
			</Camera>
			<div style={{position: 'absolute', left: 0, top: STAGE, width: W, height: H - STAGE, background: P.bg}} />
			<Captions lines={LINES} top={1395} left={60} width={860} size={80} font={FFONT} weight={800} color={P.navy} keyColor={P.red} markColor={P.goldLight} />
			<Audio src={staticFile('nokia_vo.wav')} />
		</AbsoluteFill>
	);
};
