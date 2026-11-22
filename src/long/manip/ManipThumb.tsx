// Miniatury filmu „5 manipulacji z codziennego życia” (1280×720), trzy koncepcje do testu A/B w YouTube Studio.
// A: postać-marionetka na pięciu kolorowych sznurkach, „KTO TOBĄ STERUJE?”. B: przekreślona cena z kotwicą, „TO NIE PROMOCJA”.
// C: słoik z dwoma ciastkami i sięgające ręce, „ZOSTAŁY 2!”.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough} from '../../kit/sketch';
import {Hero, G, PriceTag, AnchorShape, ChainLink, Jar, Hand, SC} from './mkit';

const useFont = () => {
	const [h] = useState(() => delayRender('font'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ĄĆĘŁŃÓŚŹŻąćęłńóśźż?!0123456789').then(() => continueRender(h));
	}, [h]);
};
const Frame: React.FC<{children: React.ReactNode}> = ({children}) => {
	useFont();
	return (
		<AbsoluteFill style={{background: C.paper}}>
			<svg width={1280} height={720} viewBox="0 0 1280 720">
				<Paper w={1280} h={720} />
				{children}
			</svg>
		</AbsoluteFill>
	);
};
const Big: React.FC<{text: string; x: number; y: number; size: number; fill: string; rot?: number; anchor?: 'start' | 'middle'}> = ({text, x, y, size, fill, rot = 0, anchor = 'middle'}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<text x={x} y={y} fontFamily="Caveat" fontWeight={700} fontSize={size} textAnchor={anchor} fill={fill} stroke={C.ink} strokeWidth={size * 0.12} strokeLinejoin="round" paintOrder="stroke">
			{text}
		</text>
	</g>
);

export const ManipThumbA: React.FC = () => (
	<Frame>
		<Rough shape={{t: 'line', x1: 180, y1: 40, x2: 560, y2: 40}} o={{strokeWidth: 16, stroke: '#8A5A2B'}} seed={3} />
		<Rough shape={{t: 'line', x1: 370, y1: -40, x2: 370, y2: 110}} o={{strokeWidth: 16, stroke: '#8A5A2B'}} seed={4} />
		<Hero x={370} y={680} s={1.75} seed={540} mood="worry" arms="shrug" top={40} strings={(['head', 'l', 'r', 'lf', 'rf'] as const).map((at, k) => ({c: SC[k], at, p: 1, dx: [0, -40, 40, -30, 30][k]}))} />
		<Big text="KTO TOBĄ" x={900} y={300} size={150} fill={C.paper} rot={-4} />
		<Big text="STERUJE?" x={900} y={450} size={150} fill={C.red} rot={-4} />
	</Frame>
);

export const ManipThumbB: React.FC = () => (
	<Frame>
		<G x={330} y={250} s={1.8} r={-8}>
			<PriceTag text="999 zł" w={300} sub="499 zł" strike={1} size={86} />
		</G>
		<ChainLink x0={390} y0={410} x1={420} y1={560} sag={10} w={7} />
		<G x={420} y={630} s={0.62}>
			<AnchorShape fill={SC[2]} />
		</G>
		<Big text="TO NIE" x={990} y={300} size={160} fill={C.paper} rot={-4} />
		<Big text="PROMOCJA" x={990} y={460} size={140} fill={C.red} rot={-4} />
	</Frame>
);

export const ManipThumbC: React.FC = () => (
	<Frame>
		<G x={360} y={650} s={1.6}>
			<Jar n={2} w={240} />
		</G>
		{[
			[90, 330, 15],
			[620, 170, 150],
		].map(([x, y, r], k) => (
			<G key={k} x={x} y={y} r={r} s={1.2}>
				<Hand />
			</G>
		))}
		<Big text="ZOSTAŁY" x={960} y={300} size={150} fill={C.paper} rot={-4} />
		<Big text="TYLKO 2!" x={960} y={460} size={160} fill={C.red} rot={-4} />
	</Frame>
);
