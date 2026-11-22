// Miniatury filmu „5 firm, które zaczęły w garażu” (1280×720), trzy koncepcje do testu A/B w YouTube Studio.
// A: pięć garaży, środkowy otwarty z wielkim „?”, napis „MIT GARAŻU?”. B: jeden garaż, w środku 5 nazw firm, „5 GIGANTÓW Z GARAŻU”.
// C: czek na 100 000 $ dla firmy, której nie było, „FIRMY JESZCZE NIE BYŁO”.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/baloo-2/800.css';
import {P, G, FText, Garage, Check} from './gkit';

const useFont = () => {
	const [h] = useState(() => delayRender('font'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123456789$?').then(() => continueRender(h));
	}, [h]);
};
const Frame: React.FC<{bg: string; children: React.ReactNode}> = ({bg, children}) => {
	useFont();
	return (
		<AbsoluteFill style={{background: bg}}>
			<svg width={1280} height={720} viewBox="0 0 1280 720">
				{children}
			</svg>
		</AbsoluteFill>
	);
};
const Big: React.FC<{text: string; x: number; y: number; size: number; fill: string; anchor?: 'start' | 'middle' | 'end'; rot?: number}> = ({text, x, y, size, fill, anchor = 'middle', rot = 0}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<FText text={text} x={x} y={y} size={size} fill={fill} stroke={P.navy} sw={size * 0.16} anchor={anchor} />
	</g>
);
const ROOFS = ['#A4473A', '#4F6B86', '#7A5A3A', '#4F6B86', '#4F6B86'];

export const GarThumbA: React.FC = () => (
	<Frame bg={P.sky}>
		<rect x={0} y={560} width={1280} height={160} fill="#CFC4B0" />
		{[0, 1, 3, 4].map((i) => (
			<G key={i} x={130 + i * 255} y={600} s={0.5}>
				<Garage w={420} h={300} roof={ROOFS[i]} id={`a${i}`} />
			</G>
		))}
		<G x={640} y={640} s={0.95}>
			<Garage w={460} h={330} roof="#A4473A" open={0.75} dark id="a2">
				<FText text="?" x={0} y={-30} size={230} fill={P.gold} stroke={P.navy} sw={18} />
			</Garage>
		</G>
		<Big text="MIT GARAŻU?" x={640} y={170} size={150} fill={P.white} rot={-3} />
	</Frame>
);

export const GarThumbB: React.FC = () => (
	<Frame bg="#E8DCC6">
		<rect x={0} y={600} width={1280} height={120} fill="#CFC4B0" />
		<G x={400} y={660} s={1.25}>
			<Garage w={460} h={330} roof="#A4473A" open={0.9} dark id="b">
				{['Disney', 'HP', 'Apple', 'Amazon', 'Google'].map((n, k) => (
					<g key={k} transform={`translate(${(k % 2 ? 1 : -1) * 70} ${-190 + k * 40}) rotate(${(k - 2) * 3})`}>
						<rect x={-80} y={-20} width={160} height={40} rx={8} fill={P.white} stroke={P.navy} strokeWidth={4} />
						<FText text={n} x={0} y={12} size={30} fill={P.navy} />
					</g>
				))}
			</Garage>
		</G>
		<Big text="5 GIGANTÓW" x={950} y={300} size={104} fill={P.gold} rot={-3} />
		<Big text="Z GARAŻU" x={950} y={430} size={112} fill={P.white} rot={-3} />
	</Frame>
);

export const GarThumbC: React.FC = () => (
	<Frame bg={P.navy}>
		<G x={1000} y={640} s={1.05}>
			<Garage w={460} h={330} roof="#4F6B86" open={0} id="c" />
		</G>
		<G x={450} y={520} s={1.5} r={-7}>
			<Check amount="100 000 $" to="Google Inc." w={420} />
		</G>
		<Big text="FIRMY" x={470} y={150} size={120} fill={P.white} rot={-3} />
		<Big text="JESZCZE NIE BYŁO" x={470} y={260} size={86} fill={P.gold} rot={-3} />
	</Frame>
);
