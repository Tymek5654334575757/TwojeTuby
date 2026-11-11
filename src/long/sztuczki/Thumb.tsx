// Miniatury długiego filmu „5 sztuczek polityków” (1280×720). Trzy koncepcje do testu A/B w YouTube Studio.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough} from '../../kit/sketch';
import {Guy, DeadCat, Doc} from './common';
export {Guy};

const useFont = () => {
	const [h] = useState(() => delayRender('font'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ĄĆĘŁŃÓŚŹŻąćęłńóśźż?!').then(() => continueRender(h));
	}, [h]);
};

// Duży napis z grubym obrysem (czytelny w małym rozmiarze).
const Big: React.FC<{text: string; x: number; y: number; size: number; fill: string; stroke: string; rotate?: number; anchor?: 'start' | 'middle'}> = ({text, x, y, size, fill, stroke, rotate = 0, anchor = 'start'}) => (
	<g transform={`rotate(${rotate} ${x} ${y})`}>
		<text x={x} y={y} fontFamily="Caveat" fontWeight={700} fontSize={size} textAnchor={anchor} fill={fill} stroke={stroke} strokeWidth={size * 0.12} strokeLinejoin="round" paintOrder="stroke">
			{text}
		</text>
	</g>
);


// Uśmiechnięty polityk w niebieskim garniturze (postać ogólna, nie wzorowana na nikim).
// (x, y) = środek głowy; hl / hr = dłonie w układzie lokalnym (przed skalą).
const NAVY = '#2F5DA8';
const Grin: React.FC<{x: number; y: number; s?: number; hl: [number, number]; hr: [number, number]}> = ({x, y, s = 1, hl, hr}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{/* ręce */}
		<Rough shape={{t: 'lpath', pts: [[-80, 110], [(-80 + hl[0]) / 2 - 20, (110 + hl[1]) / 2 + 20], hl]}} o={{stroke: NAVY, strokeWidth: 34, roughness: 1}} seed={300} />
		<Rough shape={{t: 'lpath', pts: [[80, 110], [(80 + hr[0]) / 2 + 20, (110 + hr[1]) / 2 + 20], hr]}} o={{stroke: NAVY, strokeWidth: 34, roughness: 1}} seed={301} />
		<Rough shape={{t: 'circle', cx: hl[0], cy: hl[1], d: 40}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 5}} seed={302} />
		<Rough shape={{t: 'circle', cx: hr[0], cy: hr[1], d: 40}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 5}} seed={303} />
		{/* marynarka */}
		<Rough shape={{t: 'poly', pts: [[-95, 90], [95, 90], [85, 340], [-85, 340]]}} o={{fill: NAVY, fillStyle: 'solid', strokeWidth: 7}} seed={304} />
		<Rough shape={{t: 'poly', pts: [[-40, 88], [40, 88], [0, 190]]}} o={{fill: '#F8F4EC', fillStyle: 'solid', strokeWidth: 5}} seed={305} />
		<Rough shape={{t: 'poly', pts: [[0, 100], [-14, 120], [0, 200], [14, 120]]}} o={{fill: C.yellow, fillStyle: 'solid', strokeWidth: 4}} seed={306} />
		<Rough shape={{t: 'lpath', pts: [[-40, 88], [-20, 150], [-55, 120]]}} o={{strokeWidth: 5}} seed={307} />
		<Rough shape={{t: 'lpath', pts: [[40, 88], [20, 150], [55, 120]]}} o={{strokeWidth: 5}} seed={308} />
		{/* szyja i uszy */}
		<Rough shape={{t: 'rect', x: -24, y: 60, w: 48, h: 40}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 5}} seed={330} />
		<Rough shape={{t: 'ellipse', cx: -68, cy: 4, w: 24, h: 38}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 5}} seed={331} />
		<Rough shape={{t: 'ellipse', cx: 68, cy: 4, w: 24, h: 38}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 5}} seed={332} />
		{/* głowa, lekko owalna */}
		<Rough shape={{t: 'ellipse', cx: 0, cy: 0, w: 136, h: 164}} o={{fill: '#F2C9A0', fillStyle: 'solid', strokeWidth: 6, roughness: 1.1}} seed={309} />
		{/* blond włosy: przedziałek po lewej, zaczesane w prawo */}
		<Rough shape={{t: 'path', d: 'M -68 -8 C -74 -50 -56 -82 -28 -90 C 4 -98 52 -92 70 -58 C 78 -42 76 -22 70 -6 C 64 -30 48 -44 24 -50 C 4 -54 -14 -56 -28 -58 C -44 -50 -58 -32 -68 -8 Z'}} o={{fill: '#E8C25A', fillStyle: 'solid', strokeWidth: 5, roughness: 1.1}} seed={310} />
		<Rough shape={{t: 'lpath', pts: [[-28, -58], [-30, -76], [-26, -92]]}} o={{strokeWidth: 6, stroke: '#8A6A1E', roughness: 0.8}} seed={324} />
		<Rough shape={{t: 'arc', cx: 22, cy: -66, w: 96, h: 34, a0: Math.PI * 1.05, a1: Math.PI * 1.75}} o={{strokeWidth: 4, stroke: '#B8902E', roughness: 0.8}} seed={325} />
		<Rough shape={{t: 'arc', cx: 30, cy: -54, w: 80, h: 26, a0: Math.PI * 1.1, a1: Math.PI * 1.8}} o={{strokeWidth: 4, stroke: '#B8902E', roughness: 0.8}} seed={326} />
		{/* brwi */}
		<Rough shape={{t: 'arc', cx: -27, cy: -22, w: 34, h: 12, a0: Math.PI * 1.1, a1: Math.PI * 1.9}} o={{strokeWidth: 6, stroke: '#A07C24', roughness: 0.6}} seed={313} />
		<Rough shape={{t: 'arc', cx: 27, cy: -22, w: 34, h: 12, a0: Math.PI * 1.1, a1: Math.PI * 1.9}} o={{strokeWidth: 6, stroke: '#A07C24', roughness: 0.6}} seed={314} />
		{/* oczy */}
		<ellipse cx={-26} cy={-6} rx={6.5} ry={8.5} fill={C.ink} />
		<ellipse cx={26} cy={-6} rx={6.5} ry={8.5} fill={C.ink} />
		<circle cx={-24} cy={-9} r={2.2} fill="#F8F4EC" />
		<circle cx={28} cy={-9} r={2.2} fill="#F8F4EC" />
		{/* nos */}
		<Rough shape={{t: 'lpath', pts: [[2, 0], [-6, 22], [6, 25]]}} o={{strokeWidth: 4, roughness: 0.6}} seed={327} />
		{/* łagodny uśmiech */}
		<Rough shape={{t: 'arc', cx: 0, cy: 34, w: 60, h: 26, a0: Math.PI * 0.15, a1: Math.PI * 0.85}} o={{strokeWidth: 5, roughness: 0.6}} seed={315} />
		<Rough shape={{t: 'line', x1: -32, y1: 37, x2: -26, y2: 42}} o={{strokeWidth: 4, roughness: 0.4}} seed={322} />
		<Rough shape={{t: 'line', x1: 32, y1: 37, x2: 26, y2: 42}} o={{strokeWidth: 4, roughness: 0.4}} seed={323} />
	</g>
);

// Koncepcja A/C: polityk-lalkarz, na sznurkach skłócone grupy.
const Puppets: React.FC<{text: string[]}> = ({text}) => {
	useFont();
	const heads: [number, number, string][] = [
		[150, 470, C.blue],
		[330, 500, C.blue],
		[540, 470, C.red],
		[720, 500, C.red],
	];
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={1280} height={720} viewBox="0 0 1280 720">
				<Paper w={1280} h={720} />
				{/* sznurki */}
				{heads.map(([hx, hy], i) => (
					<Rough key={i} shape={{t: 'line', x1: 905 + i * 22, y1: 205, x2: hx, y2: hy - 40}} o={{strokeWidth: 4, stroke: '#6E655A'}} seed={20 + i} />
				))}
				{/* lalki */}
				{heads.map(([hx, hy, col], i) => (
					<Guy key={i} x={hx} y={hy} s={0.85} seed={40 + i * 5} arms="up" look={i < 2 ? 1 : -1} badge={col} />
				))}
				{/* polityk z krzyżakiem */}
				<Grin x={1060} y={300} hl={[-150, -95]} hr={[100, -95]} />
				<Rough shape={{t: 'poly', pts: [[920, 470], [1200, 470], [1170, 740], [950, 740]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} seed={80} />
				<Rough shape={{t: 'rect', x: 895, y: 440, w: 330, h: 40}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 8}} seed={81} />
				<Rough shape={{t: 'line', x1: 890, y1: 205, x2: 1210, y2: 205}} o={{strokeWidth: 14}} seed={96} />
				<Rough shape={{t: 'line', x1: 920, y1: 165, x2: 920, y2: 250}} o={{strokeWidth: 14}} seed={97} />
				{text.map((t, i) => (
					<Big key={i} text={t} x={40} y={(text.length > 1 ? 160 : 210) + i * 140} size={text.length > 1 ? 150 : 190} fill={i === text.length - 1 ? C.red : C.ink} stroke={C.paper} rotate={-3} />
				))}
			</svg>
		</AbsoluteFill>
	);
};

export const SzThumbA: React.FC = () => <Puppets text={['5 SZTUCZEK', 'POLITYKÓW']} />;
export const SzThumbC: React.FC = () => <Puppets text={['KTO TOBĄ', 'STERUJE?']} />;

// Koncepcja B: kot w świetle, ustawa w ciemności.
export const SzThumbB: React.FC = () => {
	useFont();
	return (
		<AbsoluteFill style={{backgroundColor: '#14110F'}}>
			<svg width={1280} height={720} viewBox="0 0 1280 720">
				<Paper w={1280} h={720} />
				<defs>
					<radialGradient id="tb">
						<stop offset="0.68" stopColor="black" />
						<stop offset="1" stopColor="white" />
					</radialGradient>
					<mask id="tbm" maskUnits="userSpaceOnUse" x={0} y={0} width={1280} height={720}>
						<rect x={0} y={0} width={1280} height={720} fill="white" />
						<circle cx={400} cy={430} r={300} fill="url(#tb)" />
						<circle cx={690} cy={290} r={230} fill="url(#tb)" />
					</mask>
				</defs>
				<Rough shape={{t: 'poly', pts: [[40, 540], [1240, 540], [1280, 600], [0, 600]]}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 9}} seed={10} />
				<DeadCat x={400} y={470} s={1.5} />
				<Doc x={1020} y={360} title="USTAWA" draw={1} stamp={1} seed={30} w={300} h={380} rot={6} />
				<Grin x={680} y={230} s={0.95} hl={[-170, 190]} hr={[300, 250]} />
				<rect x={0} y={0} width={1280} height={720} fill="#14110F" opacity={0.94} mask="url(#tbm)" />
				{/* ustawa ledwo widoczna */}
				<g opacity={0.5}>
					<Rough shape={{t: 'rect', x: 870, y: 170, w: 300, h: 380}} o={{stroke: C.paper, strokeWidth: 7}} seed={31} />
					<g transform="translate(1030 470) rotate(-14)">
						<Rough shape={{t: 'rect', x: -125, y: -40, w: 250, h: 80}} o={{stroke: C.red, strokeWidth: 8}} seed={32} />
					</g>
				</g>
				<Big text="USTAWA" x={1020} y={250} size={70} fill="none" stroke={C.paper} anchor="middle" rotate={6} />
				<Big text="PATRZ TUTAJ" x={60} y={150} size={150} fill={C.yellow} stroke="#14110F" rotate={-4} />
				<Rough shape={{t: 'lpath', pts: [[200, 180], [190, 280], [210, 370]]}} o={{stroke: C.yellow, strokeWidth: 14}} seed={40} />
				<Rough shape={{t: 'lpath', pts: [[160, 330], [210, 380], [250, 330]]}} o={{stroke: C.yellow, strokeWidth: 14}} seed={41} />
			</svg>
		</AbsoluteFill>
	);
};
