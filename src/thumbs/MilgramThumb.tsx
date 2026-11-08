// Miniatura shorta Milgram (1080×1920). Kluczowe elementy w środkowym pasie ok. 3:2 (y 600–1320), bo tak przycina część widoków YouTube.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt} from '../kit/sketch';
import {LabCoat, Generator} from '../kit/figures';

const W = 1080;
const H = 1920;

const Rays: React.FC<{x: number; y: number; r: number; color: string; n?: number; len?: number; seed: number}> = ({x, y, r, color, n = 12, len = 80, seed}) => (
	<g>
		{Array.from({length: n}).map((_, j) => {
			const a = (j / n) * Math.PI * 2 + 0.2;
			const l = j % 2 === 0 ? len : len * 0.6;
			return (
				<Rough
					key={j}
					shape={{t: 'line', x1: x + Math.cos(a) * r, y1: y + Math.sin(a) * r, x2: x + Math.cos(a) * (r + l), y2: y + Math.sin(a) * (r + l)}}
					o={{stroke: color, strokeWidth: 9, roughness: 1}}
					seed={seed + j}
				/>
			);
		})}
	</g>
);

export const MilgramThumb: React.FC = () => {
	const [handle] = useState(() => delayRender('Font Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźż').then(() => continueRender(handle));
	}, [handle]);
	const gx = 60;
	const gy = 980;
	const s = 1.18;
	const swX = gx + (330 + 9 * 44 + 16) * s;
	const swY = gy + 180 * s;
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<Paper w={W} h={H} />
				<g transform="translate(0 150)">
				<Txt text="Czy ty byś" x={540} y={250} size={130} seed={1} />
				<Rough shape={{t: 'rect', x: 170, y: 360, w: 740, h: 70}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 14}} seed={2} />
				<Txt text="nacisnął?" x={540} y={420} size={200} color={C.red} seed={3} />
				<LabCoat x={830} y={600} s={1.2} highlight={1} seed={10} />
				<Rays x={330} y={800} r={190} color={C.red} len={70} seed={40} />
				<Rough shape={{t: 'rect', x: 120, y: 820, w: 450, h: 46}} o={{stroke: 'none', fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 14}} seed={60} />
				<Txt text="450 V" x={340} y={850} size={250} color={C.red} rotate={-4} seed={61} />
				<Generator x={gx} y={gy} s={s} needle={1} lit={10} lamp seed={70} />
				<Rays x={swX} y={swY - 20} r={70} color={C.yellow} n={10} len={60} seed={90} />
				<Rough shape={{t: 'lpath', pts: [[swX - 30, swY - 80], [swX - 60, swY - 120], [swX - 20, swY - 140], [swX - 55, swY - 185]]}} o={{stroke: C.red, strokeWidth: 8}} seed={110} />
				<Rough shape={{t: 'lpath', pts: [[swX + 40, swY - 60], [swX + 70, swY - 95], [swX + 45, swY - 120]]}} o={{stroke: C.yellow, strokeWidth: 8}} seed={111} />
				<Rough shape={{t: 'line', x1: 1090, y1: 1640, x2: swX + 12, y2: swY - 6}} o={{strokeWidth: 12}} seed={120} />
				<Rough shape={{t: 'circle', cx: swX, cy: swY - 24, d: 84}} o={{fill: C.paper, fillStyle: 'solid', strokeWidth: 8}} seed={121} />
				<Txt text="EKSPERYMENT MILGRAMA · 1961" x={480} y={1480} size={64} seed={130} />
				<Rough shape={{t: 'line', x1: 120, y1: 1505, x2: 840, y2: 1505}} o={{stroke: C.red, strokeWidth: 6}} seed={131} />
				</g>
			</svg>
		</AbsoluteFill>
	);
};
