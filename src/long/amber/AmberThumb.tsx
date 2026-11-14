// Miniatury długiego filmu o Amber Gold (1280×720), trzy koncepcje do testu A/B w YouTube Studio.
// A: prawie pusty skarbiec z jedną małą sztabką, „1% ZŁOTA”. B: monety jako przynęta na pułapce, „851 MLN ZŁ”.
// C: monety odlatują z rozbitej świnki jako samolot, „GDZIE JEST ZŁOTO?”.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/baloo-2/800.css';
import {P, G, Coin, FText, GoldBar, Plane} from './kit';
import {Pile} from './AmberR2';

const useFont = () => {
	const [h] = useState(() => delayRender('font'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123456789%?').then(() => continueRender(h));
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
const Big: React.FC<{text: string; x: number; y: number; size: number; fill: string; anchor?: 'start' | 'middle' | 'end'; rot?: number}> = ({text, x, y, size, fill, anchor = 'start', rot = 0}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<FText text={text} x={x} y={y} size={size} fill={fill} stroke={P.navy} sw={size * 0.16} anchor={anchor} />
	</g>
);

export const AmberThumbA: React.FC = () => (
	<Frame bg={P.navy}>
		{/* otwarte drzwi skarbca i pusty środek */}
		<circle cx={470} cy={380} r={300} fill="#2C3C52" stroke={P.gold} strokeWidth={18} />
		<circle cx={470} cy={380} r={250} fill="#141C28" />
		{Array.from({length: 14}).map((_, i) => (
			<circle key={i} cx={470 + Math.cos((i / 14) * Math.PI * 2) * 275} cy={380 + Math.sin((i / 14) * Math.PI * 2) * 275} r={10} fill={P.goldDark} />
		))}
		<g transform="translate(800 380) scale(0.26 1)">
			<circle r={300} fill={P.gold} stroke={P.navy} strokeWidth={20} />
			<circle r={220} fill="none" stroke={P.goldDark} strokeWidth={16} />
		</g>
		<ellipse cx={470} cy={520} rx={170} ry={26} fill="#0B1018" />
		<G x={470} y={512}>
			<GoldBar w={110} glow={1} />
		</G>
		<Big text="1%" x={1070} y={330} size={230} fill={P.gold} anchor="middle" rot={-4} />
		<Big text="ZŁOTA" x={1070} y={470} size={120} fill={P.white} anchor="middle" rot={-4} />
	</Frame>
);

export const AmberThumbB: React.FC = () => (
	<Frame bg="#E8DCC6">
		{/* pułapka na myszy z monetami jako przynętą */}
		<rect x={0} y={0} width={1280} height={720} fill="#E8DCC6" />
		<path d="M 120 520 L 1000 520 L 1040 560 L 80 560 Z" fill="#D9B07A" stroke={P.navy} strokeWidth={9} strokeLinejoin="round" />
		<rect x={80} y={560} width={960} height={110} rx={12} fill="#C99A64" stroke={P.navy} strokeWidth={10} />
		<FText text="AMBER GOLD" x={560} y={640} size={70} fill={P.navy} />
		{[0, 1, 2, 3].map((i) => (
			<ellipse key={i} cx={350 + i * 22} cy={500} rx={16} ry={26} fill="none" stroke="#7D8A97" strokeWidth={9} />
		))}
		<line x1={390} y1={500} x2={120} y2={170} stroke={P.navy} strokeWidth={30} strokeLinecap="round" />
		<line x1={390} y1={500} x2={120} y2={170} stroke="#AEB8C2" strokeWidth={14} strokeLinecap="round" />
		<line x1={120} y1={170} x2={160} y2={260} stroke={P.navy} strokeWidth={30} strokeLinecap="round" />
		<line x1={120} y1={170} x2={160} y2={260} stroke="#AEB8C2" strokeWidth={14} strokeLinecap="round" />
		<rect x={600} y={498} width={300} height={26} rx={8} fill={P.goldLight} stroke={P.navy} strokeWidth={6} />
		<G x={750} y={470}>
			<Pile n={12} r={44} />
		</G>
		<Big text="851 MLN ZŁ" x={1240} y={170} size={128} fill={P.red} anchor="end" rot={-3} />
		<Big text="przynęta" x={1230} y={300} size={80} fill={P.white} anchor="end" rot={-3} />
	</Frame>
);

export const AmberThumbC: React.FC = () => (
	<Frame bg="#2C3C52">
		{/* rozbita złota świnka, monety lecą jako samolot */}
		<g transform="translate(250 580) scale(0.85)">
			<g transform="translate(-60 10) rotate(-14)">
				<path d="M -150 -120 Q -170 -10 -120 30 L 0 30 L -14 -60 L 10 -110 L -10 -170 Q -90 -190 -150 -120 Z" fill={P.gold} stroke={P.navy} strokeWidth={9} strokeLinejoin="round" />
			</g>
			<g transform="translate(80 10) rotate(12)">
				<path d="M 0 30 L 120 30 Q 180 0 170 -90 Q 150 -170 10 -170 L 30 -110 L 6 -60 Z" fill={P.gold} stroke={P.navy} strokeWidth={9} strokeLinejoin="round" />
				<ellipse cx={175} cy={-90} rx={30} ry={38} fill="#D9B46A" stroke={P.navy} strokeWidth={7} />
			</g>
			<ellipse cx={0} cy={40} rx={160} ry={20} fill="#1A2433" />
		</g>
		{Array.from({length: 9}).map((_, i) => {
			const t = i / 8;
			return (
				<G key={i} x={330 + t * 470} y={440 - t * 270 + Math.sin(i) * 20} r={i * 40}>
					<Coin r={30 - i} />
				</G>
			);
		})}
		<G x={950} y={180} s={1.15} r={-14}>
			<Plane body={P.gold} />
		</G>
		<Big text="GDZIE" x={1220} y={470} size={120} fill={P.white} anchor="end" rot={-3} />
		<Big text="JEST ZŁOTO?" x={1240} y={610} size={120} fill={P.gold} anchor="end" rot={-3} />
	</Frame>
);
