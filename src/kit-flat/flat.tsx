// Płaski, animowany zestaw kanału Szczęście Pieniędzy Nie Daje: wektorowe postacie i rekwizyty, płynny ruch, bez drgania linii.
import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

// Paleta kanału (od 9.11 stonowana, „dorosła”: bez jaskrawej zieleni i nasyconych barw z bajek).
export const P = {
	bg: '#EFE8DC',
	navy: '#1F2B3D',
	gold: '#C9A043',
	goldDark: '#9C7A2E',
	goldLight: '#E6D3A1',
	green: '#4F7A6A',
	greenLight: '#A9C2B5',
	red: '#B5503A',
	skin: '#E3BC9A',
	skin2: '#B98863',
	sky: '#B9CBD3',
	grass: '#8E9C7F',
	grassDark: '#6E7D61',
	white: '#F8F4EC',
	grey: '#CFC7B8',
	slate: '#5C6B7A',
	blue: '#4A6A8A',
	paper: '#E4DBCB',
	shadow: 'rgba(31,43,61,0.16)',
};
export const FFONT = "'Baloo 2'";
const OL = 7; // grubość konturu

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (f: number, a: number, dur: number) =>
	interpolate(f, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const pop = (f: number, a: number, fps = 30, damping = 9) => (f < a ? 0 : spring({frame: f - a, fps, config: {damping, stiffness: 180}}));
// Łuk lotu przedmiotu z punktu A do B (p 0–1).
export const arc = (p: number, ax: number, ay: number, bx: number, by: number, h: number) => ({
	x: ax + (bx - ax) * p,
	y: ay + (by - ay) * p - Math.sin(Math.PI * p) * h,
});

// Tekst z obrysem (Baloo 2).
export const FText: React.FC<{
	text: string;
	x: number;
	y: number;
	size: number;
	fill?: string;
	stroke?: string;
	sw?: number;
	anchor?: 'start' | 'middle' | 'end';
	rotate?: number;
	opacity?: number;
	weight?: number;
}> = ({text, x, y, size, fill = P.navy, stroke, sw = 10, anchor = 'middle', rotate = 0, opacity = 1, weight = 800}) => (
	<text
		x={x}
		y={y}
		fontFamily={FFONT}
		fontWeight={weight}
		fontSize={size}
		fill={fill}
		stroke={stroke}
		strokeWidth={stroke ? sw : 0}
		strokeLinejoin="round"
		paintOrder="stroke"
		textAnchor={anchor}
		opacity={opacity}
		transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
	>
		{text}
	</text>
);

// Grupa z pozycją, skalą, obrotem i rozciąganiem (sq > 1 = wyciągnięcie w górę). Punkt odniesienia: (x,y).
export const G: React.FC<{x?: number; y?: number; s?: number; r?: number; sq?: number; o?: number; children: React.ReactNode}> = ({
	x = 0,
	y = 0,
	s = 1,
	r = 0,
	sq = 1,
	o = 1,
	children,
}) => (
	<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s / Math.sqrt(sq)} ${s * sq})`} opacity={o}>
		{children}
	</g>
);

// --- postać dziecka ---------------------------------------------------------
export type KidLook = {shirt: string; hair: string; skin?: string; cap?: boolean; shades?: boolean};
// --- Dorosła postać (kanał biznesowy). (0,0) = stopy, wysokość ok. 480. ---
export type AdultLook = {suit: string; hair: string; skin?: string; tie?: string; shirt?: string; hairStyle?: 'short' | 'side' | 'bald'; glasses?: boolean};
export const ADULTS: Record<string, AdultLook> = {
	szef: {suit: '#2E3B4E', hair: '#8A8A8A', tie: '#B5503A', hairStyle: 'side'},
	szef2: {suit: '#3A4A5E', hair: '#3B2A20', tie: '#C9A043', hairStyle: 'short', glasses: true},
	zalozyciel: {suit: '#7A4E3A', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'short'},
	zalozyciel2: {suit: '#4F7A6A', hair: '#6B4A2E', shirt: '#E4DBCB', hairStyle: 'side', glasses: true},
	klient: {suit: '#8C7A5E', hair: '#2B2420', shirt: '#CFC7B8', hairStyle: 'short'},
};
export const Adult: React.FC<{
	look: AdultLook;
	armL?: number;
	armR?: number;
	talk?: boolean;
	walk?: boolean;
	mood?: 'neutral' | 'smile' | 'laugh' | 'sad' | 'shock' | 'angry';
	laugh?: boolean;
	seed?: number;
	holdR?: React.ReactNode;
}> = ({look, armL = 8, armR = 8, talk = false, walk = false, mood = 'neutral', laugh = false, seed = 0, holdR}) => {
	const f = useCurrentFrame();
	const skin = look.skin ?? P.skin;
	const breath = Math.sin((f + seed * 13) / 16) * 0.01;
	const bob = laugh ? Math.abs(Math.sin(f / 2.2)) * -10 : 0;
	const blink = (f + seed * 37) % 110 < 4;
	const talkOpen = talk && Math.floor(f / 3) % 2 === 0;
	const sw = walk ? Math.sin(f / 4) * 22 : 0;
	const tie = look.tie;
	const shirt = look.shirt ?? P.white;
	const dark = 'rgba(0,0,0,0.18)';
	const arm = (side: -1 | 1, ang: number, hold?: React.ReactNode) => (
		<g transform={`translate(${side * 74} -352) rotate(${side === -1 ? ang : -ang})`}>
			<rect x={-17} y={-8} width={34} height={150} rx={17} fill={look.suit} stroke={P.navy} strokeWidth={OL} />
			<circle cx={0} cy={160} r={18} fill={skin} stroke={P.navy} strokeWidth={OL - 1} />
			{hold && <g transform={`translate(0 175) rotate(${side === -1 ? -ang : ang})`}>{hold}</g>}
		</g>
	);
	let mouth: React.ReactNode;
	const my = -405;
	if (talkOpen || mood === 'laugh' || laugh) mouth = <path d={`M -16 ${my - 4} Q 0 ${my + 20} 16 ${my - 4} Z`} fill={P.navy} />;
	else if (mood === 'smile') mouth = <path d={`M -14 ${my - 4} Q 0 ${my + 8} 14 ${my - 4}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />;
	else if (mood === 'sad') mouth = <path d={`M -13 ${my + 4} Q 0 ${my - 8} 13 ${my + 4}`} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />;
	else if (mood === 'shock') mouth = <ellipse cx={0} cy={my} rx={9} ry={12} fill={P.navy} />;
	else if (mood === 'angry') mouth = <path d={`M -13 ${my + 2} L 13 ${my + 2}`} stroke={P.navy} strokeWidth={6} strokeLinecap="round" />;
	else mouth = <path d={`M -11 ${my} L 11 ${my}`} stroke={P.navy} strokeWidth={5} strokeLinecap="round" />;
	const brow = mood === 'angry' ? 8 : mood === 'sad' ? -6 : 0;
	return (
		<g transform={`translate(0 ${bob}) scale(${1 + breath} ${1 - breath})`}>
			<ellipse cx={0} cy={4} rx={70} ry={12} fill={P.shadow} />
			{/* nogi */}
			<g transform={`rotate(${sw} 0 -190)`}>
				<rect x={-44} y={-195} width={36} height={190} rx={10} fill={look.suit} stroke={P.navy} strokeWidth={OL} />
				<ellipse cx={-30} cy={-4} rx={30} ry={13} fill={P.navy} />
			</g>
			<g transform={`rotate(${-sw} 0 -190)`}>
				<rect x={8} y={-195} width={36} height={190} rx={10} fill={look.suit} stroke={P.navy} strokeWidth={OL} />
				<ellipse cx={30} cy={-4} rx={30} ry={13} fill={P.navy} />
			</g>
			{arm(-1, armL)}
			{/* tułów */}
			<path d="M -80 -362 Q -84 -260 -66 -180 L 66 -180 Q 84 -260 80 -362 Q 0 -384 -80 -362 Z" fill={look.suit} stroke={P.navy} strokeWidth={OL} strokeLinejoin="round" />
			<path d="M -30 -372 L 0 -300 L 30 -372 Z" fill={shirt} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
			{tie && <path d="M -9 -366 L 9 -366 L 13 -300 L 0 -284 L -13 -300 Z" fill={tie} stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />}
			<line x1={0} y1={-300} x2={0} y2={-190} stroke={dark} strokeWidth={4} />
			{arm(1, armR, holdR)}
			{/* głowa */}
			<rect x={-16} y={-392} width={32} height={26} fill={skin} stroke={P.navy} strokeWidth={5} />
			<circle cx={0} cy={-438} r={52} fill={skin} stroke={P.navy} strokeWidth={OL} />
			{look.hairStyle !== 'bald' && (
				<path
					d={look.hairStyle === 'side' ? 'M -54 -440 Q -56 -500 0 -496 Q 50 -496 54 -446 Q 30 -478 -20 -470 Q -40 -466 -54 -440 Z' : 'M -53 -444 Q -50 -498 0 -496 Q 50 -498 53 -444 Q 40 -470 0 -472 Q -40 -470 -53 -444 Z'}
					fill={look.hair}
					stroke={P.navy}
					strokeWidth={5}
					strokeLinejoin="round"
				/>
			)}
			{look.hairStyle === 'bald' && <path d="M -53 -430 Q -60 -460 -46 -462 M 53 -430 Q 60 -460 46 -462" stroke={look.hair} strokeWidth={10} fill="none" />}
			<line x1={-27} y1={-456 + brow} x2={-9} y2={-458} stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
			<line x1={27} y1={-456 + brow} x2={9} y2={-458} stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
			{laugh || mood === 'laugh' ? (
				<>
					<path d="M -26 -436 Q -18 -446 -10 -436" fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
					<path d="M 10 -436 Q 18 -446 26 -436" fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" />
				</>
			) : blink ? (
				<>
					<line x1={-25} y1={-438} x2={-11} y2={-438} stroke={P.navy} strokeWidth={5} />
					<line x1={11} y1={-438} x2={25} y2={-438} stroke={P.navy} strokeWidth={5} />
				</>
			) : (
				<>
					<circle cx={-18} cy={-438} r={mood === 'shock' ? 8 : 6} fill={P.navy} />
					<circle cx={18} cy={-438} r={mood === 'shock' ? 8 : 6} fill={P.navy} />
				</>
			)}
			{look.glasses && (
				<g fill="none" stroke={P.navy} strokeWidth={4}>
					<circle cx={-18} cy={-438} r={15} />
					<circle cx={18} cy={-438} r={15} />
					<line x1={-3} y1={-438} x2={3} y2={-438} />
				</g>
			)}
			{mouth}
		</g>
	);
};

export const LOOKS: Record<string, KidLook> = {
	ty: {shirt: P.green, hair: '#6B3E26'},
	kolega: {shirt: P.red, hair: '#2B1B12', cap: true, shades: true},
	a: {shirt: '#3A86FF', hair: '#E0A13A'},
	b: {shirt: '#9B5DE5', hair: '#2B1B12', skin: P.skin2},
	c: {shirt: P.gold, hair: '#6B3E26'},
	d: {shirt: '#00A6A6', hair: '#C2502A'},
};

// Dziecko; (0,0) = środek między stopami. armL/armR w stopniach (0 = w dół, 90 = poziomo na zewnątrz, 160 = w górę).
export const Kid: React.FC<{
	look: KidLook;
	armL?: number;
	armR?: number;
	talk?: boolean;
	walk?: boolean;
	seed?: number;
	holdR?: React.ReactNode;
	holdL?: React.ReactNode;
	mood?: 'smile' | 'o' | 'sad';
}> = ({look, armL = 15, armR = 15, talk = false, walk = false, seed = 0, holdR, holdL, mood = 'smile'}) => {
	const f = useCurrentFrame();
	const breath = Math.sin((f + seed * 13) / 14) * 0.012;
	const blink = (f + seed * 37 + 50) % 96 < 4;
	const mouthOpen = talk && Math.floor((f + seed) / 4) % 2 === 0;
	const step = walk ? Math.sin(f / 3.2) * 18 : 0;
	const skin = look.skin ?? P.skin;
	const arm = (side: -1 | 1, deg: number, hold?: React.ReactNode) => {
		const sx = side * 52;
		const sy = -232;
		const rad = ((side === 1 ? deg : -deg) * Math.PI) / 180;
		const hx = sx + Math.sin(rad) * 105;
		const hy = sy + Math.cos(rad) * 105;
		return (
			<g>
				<line x1={sx} y1={sy} x2={hx} y2={hy} stroke={P.navy} strokeWidth={30} strokeLinecap="round" />
				<line x1={sx} y1={sy} x2={hx} y2={hy} stroke={look.shirt} strokeWidth={16} strokeLinecap="round" />
				{hold && <g transform={`translate(${hx} ${hy})`}>{hold}</g>}
				<circle cx={hx} cy={hy} r={17} fill={skin} stroke={P.navy} strokeWidth={6} />
			</g>
		);
	};
	return (
		<g>
			<ellipse cx={0} cy={0} rx={74} ry={14} fill={P.shadow} />
			<g transform={`scale(${1 - breath} ${1 + breath})`}>
				<g transform={`rotate(${step} 0 -120)`}>
					<line x1={-22} y1={-120} x2={-22} y2={-6} stroke={P.navy} strokeWidth={24} strokeLinecap="round" />
				</g>
				<g transform={`rotate(${-step} 0 -120)`}>
					<line x1={22} y1={-120} x2={22} y2={-6} stroke={P.navy} strokeWidth={24} strokeLinecap="round" />
				</g>
				{arm(-1, armL, holdL)}
				<rect x={-62} y={-262} width={124} height={150} rx={44} fill={look.shirt} stroke={P.navy} strokeWidth={OL} />
				{arm(1, armR, holdR)}
				<circle cx={0} cy={-330} r={70} fill={skin} stroke={P.navy} strokeWidth={OL} />
				<path d="M -70 -335 Q -66 -410 0 -404 Q 66 -410 70 -335 Q 40 -372 0 -366 Q -40 -372 -70 -335 Z" fill={look.hair} stroke={P.navy} strokeWidth={5} />
				{look.cap && (
					<g>
						<path d="M -72 -345 Q -70 -418 0 -420 Q 70 -418 72 -345 Z" fill={P.gold} stroke={P.navy} strokeWidth={OL} />
						<path d="M 30 -350 Q 100 -352 112 -336 Q 80 -330 30 -338 Z" fill={P.goldDark} stroke={P.navy} strokeWidth={6} />
					</g>
				)}
				{look.shades ? (
					<g>
						<rect x={-50} y={-344} width={40} height={24} rx={8} fill={P.navy} />
						<rect x={8} y={-344} width={40} height={24} rx={8} fill={P.navy} />
						<line x1={-10} y1={-334} x2={8} y2={-334} stroke={P.navy} strokeWidth={5} />
						<rect x={-44} y={-340} width={12} height={5} rx={2} fill="#ffffff" opacity={0.6} />
					</g>
				) : (
					<g>
						<ellipse cx={-24} cy={-332} rx={9} ry={blink ? 1.5 : 11} fill={P.navy} />
						<ellipse cx={24} cy={-332} rx={9} ry={blink ? 1.5 : 11} fill={P.navy} />
					</g>
				)}
				<circle cx={-42} cy={-304} r={9} fill={P.red} opacity={0.25} />
				<circle cx={42} cy={-304} r={9} fill={P.red} opacity={0.25} />
				{mouthOpen || mood === 'o' ? (
					<ellipse cx={0} cy={-298} rx={13} ry={mouthOpen ? 10 : 12} fill={P.navy} />
				) : mood === 'sad' ? (
					<path d="M -16 -292 Q 0 -306 16 -292" stroke={P.navy} strokeWidth={6} fill="none" strokeLinecap="round" />
				) : (
					<path d="M -18 -302 Q 0 -284 18 -302" stroke={P.navy} strokeWidth={6} fill="none" strokeLinecap="round" />
				)}
			</g>
		</g>
	);
};

// --- rekwizyty ----------------------------------------------------------------
// Banknot (środek w 0,0). face: twarz maskotki.
export const Banknote: React.FC<{value?: string; face?: 'sad' | 'happy'; w?: number}> = ({value = '100', face, w = 150}) => {
	const h = w * 0.52;
	const f = useCurrentFrame();
	const blink = f % 80 < 4;
	return (
		<g>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.green} stroke={P.navy} strokeWidth={6} />
			<rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={6} fill="none" stroke={P.greenLight} strokeWidth={4} />
			{face ? (
				<g>
					<ellipse cx={-w * 0.14} cy={-h * 0.08} rx={6} ry={blink ? 1 : 8} fill={P.navy} />
					<ellipse cx={w * 0.14} cy={-h * 0.08} rx={6} ry={blink ? 1 : 8} fill={P.navy} />
					{face === 'sad' ? (
						<path d={`M ${-w * 0.12} ${h * 0.22} Q 0 ${h * 0.06} ${w * 0.12} ${h * 0.22}`} stroke={P.navy} strokeWidth={5} fill="none" strokeLinecap="round" />
					) : (
						<path d={`M ${-w * 0.12} ${h * 0.1} Q 0 ${h * 0.28} ${w * 0.12} ${h * 0.1}`} stroke={P.navy} strokeWidth={5} fill="none" strokeLinecap="round" />
					)}
					{face === 'sad' && <path d={`M ${w * 0.2} ${-h * 0.02} q 6 12 0 16 q -6 -4 0 -16 Z`} fill="#6EC6FF" />}
				</g>
			) : (
				<>
					<circle cx={0} cy={0} r={h * 0.26} fill={P.greenLight} stroke={P.navy} strokeWidth={4} />
					<text x={-w / 2 + 16} y={-h / 2 + 30} fontFamily={FFONT} fontWeight={800} fontSize={24} fill={P.white}>
						{value}
					</text>
				</>
			)}
		</g>
	);
};

export const Coin: React.FC<{r?: number}> = ({r = 26}) => (
	<g>
		<circle cx={0} cy={0} r={r} fill={P.gold} stroke={P.navy} strokeWidth={5} />
		<circle cx={0} cy={0} r={r * 0.62} fill="none" stroke={P.goldDark} strokeWidth={4} />
		<path d={`M ${-r * 0.35} ${-r * 0.5} q ${r * 0.2} -${r * 0.15} ${r * 0.4} 0`} stroke="#fff" strokeWidth={4} opacity={0.7} fill="none" strokeLinecap="round" />
	</g>
);

// Sztabka (środek dolnej krawędzi w 0,0).
export const GoldBar: React.FC<{w?: number; label?: string}> = ({w = 220, label}) => {
	const h = w * 0.42;
	const t = w * 0.18;
	return (
		<g>
			<path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - t} ${-h} L ${-w / 2 + t} ${-h} Z`} fill={P.gold} stroke={P.navy} strokeWidth={OL} strokeLinejoin="round" />
			<path d={`M ${-w / 2 + t + 8} ${-h + 10} L ${-w / 2 + t + 40} ${-h + 10} L ${-w / 2 + t + 18} ${-12} L ${-w / 2 + 22} ${-12} Z`} fill={P.goldLight} opacity={0.9} />
			{label && (
				<text x={0} y={-h * 0.36} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={w * 0.11} fill={P.navy}>
					{label}
				</text>
			)}
		</g>
	);
};

// Iskierka-gwiazdka.
export const Star: React.FC<{r?: number; color?: string}> = ({r = 22, color = P.white}) => (
	<path d={`M 0 ${-r} Q ${r * 0.15} ${-r * 0.15} ${r} 0 Q ${r * 0.15} ${r * 0.15} 0 ${r} Q ${-r * 0.15} ${r * 0.15} ${-r} 0 Q ${-r * 0.15} ${-r * 0.15} 0 ${-r} Z`} fill={color} />
);

// Bank (środek dolnej krawędzi w 0,0).
export const Bank: React.FC<{w?: number}> = ({w = 340}) => {
	const h = w * 0.7;
	return (
		<g>
			<rect x={-w / 2} y={-h * 0.72} width={w} height={h * 0.72} fill={P.white} stroke={P.navy} strokeWidth={OL} />
			<path d={`M ${-w / 2 - 20} ${-h * 0.72} L 0 ${-h} L ${w / 2 + 20} ${-h * 0.72} Z`} fill={P.grey} stroke={P.navy} strokeWidth={OL} strokeLinejoin="round" />
			{[-0.32, -0.11, 0.11, 0.32].map((k, i) => (
				<rect key={i} x={w * k - 14} y={-h * 0.62} width={28} height={h * 0.56} fill={P.bg} stroke={P.navy} strokeWidth={5} />
			))}
			<text x={0} y={-h * 0.78} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={w * 0.13} fill={P.navy}>
				BANK
			</text>
			<rect x={-w / 2 - 20} y={-10} width={w + 40} height={14} fill={P.grey} stroke={P.navy} strokeWidth={5} />
		</g>
	);
};

// Samolot (środek w 0,0, dziób w prawo).
export const Plane: React.FC<{w?: number; label?: string; prop?: number}> = ({w = 420, label = 'OLT', prop = 0}) => {
	const h = w * 0.2;
	return (
		<g>
			<path d={`M ${-w * 0.42} ${-h * 0.2} L ${-w * 0.5} ${-h * 1.4} L ${-w * 0.36} ${-h * 1.35} L ${-w * 0.26} ${-h * 0.4} Z`} fill={P.red} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
			<rect x={-w * 0.46} y={-h / 2} width={w * 0.9} height={h} rx={h / 2} fill={P.white} stroke={P.navy} strokeWidth={OL} />
			<path d={`M ${w * 0.36} ${-h * 0.32} Q ${w * 0.47} ${-h * 0.3} ${w * 0.47} 0 L ${w * 0.36} 0 Z`} fill="#6EC6FF" stroke={P.navy} strokeWidth={5} />
			{[-0.24, -0.14, -0.04, 0.06, 0.16].map((k, i) => (
				<circle key={i} cx={w * k} cy={-h * 0.1} r={h * 0.13} fill="#6EC6FF" stroke={P.navy} strokeWidth={4} />
			))}
			<path d={`M ${-w * 0.08} ${h * 0.1} L ${-w * 0.2} ${h * 1.3} L ${-w * 0.04} ${h * 1.3} L ${w * 0.1} ${h * 0.1} Z`} fill={P.grey} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
			<text x={-w * 0.1} y={h * 0.38} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={h * 0.5} fill={P.red}>
				{label}
			</text>
			<ellipse cx={w * 0.47} cy={0} rx={6} ry={h * 0.7 * Math.abs(Math.cos(prop))} fill={P.navy} opacity={0.6} />
		</g>
	);
};

export const Cloud: React.FC<{w?: number}> = ({w = 220}) => (
	<g>
		<path
			d={`M ${-w / 2} 0 Q ${-w / 2} ${-w * 0.22} ${-w * 0.28} ${-w * 0.22} Q ${-w * 0.2} ${-w * 0.42} 0 ${-w * 0.38} Q ${w * 0.22} ${-w * 0.46} ${w * 0.28} ${-w * 0.22} Q ${w / 2} ${-w * 0.22} ${w / 2} 0 Z`}
			fill={P.white}
			stroke={P.navy}
			strokeWidth={5}
		/>
	</g>
);

// Kalendarz z kartką (środek w 0,0).
export const Calendar: React.FC<{top: string; big: string; w?: number}> = ({top, big, w = 220}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.55} width={w} height={w * 1.05} rx={18} fill={P.white} stroke={P.navy} strokeWidth={OL} />
		<path d={`M ${-w / 2} ${-w * 0.55 + 18} Q ${-w / 2} ${-w * 0.55} ${-w / 2 + 18} ${-w * 0.55} L ${w / 2 - 18} ${-w * 0.55} Q ${w / 2} ${-w * 0.55} ${w / 2} ${-w * 0.55 + 18} L ${w / 2} ${-w * 0.25} L ${-w / 2} ${-w * 0.25} Z`} fill={P.red} stroke={P.navy} strokeWidth={OL} />
		<text x={0} y={-w * 0.32} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={w * 0.17} fill={P.white}>
			{top}
		</text>
		<text x={0} y={w * 0.3} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={w * 0.36} fill={P.navy}>
			{big}
		</text>
	</g>
);

// Metka z kwotą na sznurku (punkt zawieszenia w 0,0).
export const Tag: React.FC<{text: string; w?: number; color?: string; swing?: number}> = ({text, w = 240, color = P.gold, swing = 0}) => (
	<g transform={`rotate(${swing})`}>
		<line x1={0} y1={0} x2={0} y2={40} stroke={P.navy} strokeWidth={4} />
		<path d={`M ${-w / 2} 60 L ${-w / 2 + 20} 40 L ${w / 2} 40 L ${w / 2} 120 L ${-w / 2 + 20} 120 L ${-w / 2} 100 Z`} fill={color} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<circle cx={-w / 2 + 24} cy={80} r={8} fill={P.bg} stroke={P.navy} strokeWidth={4} />
		<text x={14} y={96} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={44} fill={P.navy}>
			{text}
		</text>
	</g>
);

// Pieczątka (środek w 0,0), wbija się od dużej skali.
export const Stamp: React.FC<{lines: string[]; w?: number; color?: string}> = ({lines, w = 600, color = P.red}) => {
	const h = 90 + (lines.length - 1) * 56;
	return (
		<g>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="rgba(255,255,255,0.6)" stroke={color} strokeWidth={10} />
			{lines.map((l, i) => (
				<text key={i} x={0} y={-h / 2 + 66 + i * 56} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={i === 0 ? 58 : 38} fill={color}>
					{l}
				</text>
			))}
		</g>
	);
};

// Płaskie linie uderzenia (bez drgania).
export const FlatBurst: React.FC<{x: number; y: number; at: number; r?: number; color?: string; n?: number}> = ({x, y, at, r = 120, color = P.gold, n = 12}) => {
	const f = useCurrentFrame();
	const k = f - at;
	if (k < 0 || k > 14) return null;
	const grow = interpolate(k, [0, 6], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const fade = interpolate(k, [8, 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<g opacity={fade}>
			{Array.from({length: n}).map((_, j) => {
				const a = (j / n) * Math.PI * 2;
				const r0 = r * (0.7 + 0.5 * grow);
				const r1 = r0 + (j % 2 ? 40 : 70) * grow;
				return <line key={j} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={12} strokeLinecap="round" />;
			})}
		</g>
	);
};

// Licznik kwoty: liczba rośnie od from do to w oknie [a, a+dur].
export const useCount = (from: number, to: number, a: number, dur: number) => {
	const f = useCurrentFrame();
	return Math.round(interpolate(f, [a, a + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
};

export const useFps = () => useVideoConfig().fps;
