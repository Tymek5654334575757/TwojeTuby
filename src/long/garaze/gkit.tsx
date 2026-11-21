// Zestaw filmu „5 firm, które zaczęły w garażu” (Szczęście Pieniędzy Nie Daje). Bazuje na src/long/amber/kit:
// ta sama scena z kamerą (16:9 i 9:16), napisy, pokoje ułożone w rzędzie. Tu: garaż z drzwiami uchylnymi
// (motyw przewodni), łańcuch między historiami, mapy USA / Zatoki / świata, rekwizyty z lat 1923–1998
// oraz CutShort: short = ten sam film z wyciętymi zdaniami [tylko film] (dźwięk i obraz tną się razem).
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {AmberStage, ip, pk, EOUT, EIN, EIO, EBACK, P, G, FText, clamp01, prog, hsh, endOf, Room, VW, VH, HW, HH, type VoLine} from '../amber/kit';
import {Calendar, LAY, type Lay} from '../amber/AmberR2';
import {LINES as CTA_LINES} from './gacta.gen';
import {US_SHAPES, BAY_LAND, WORLD} from './geo.gen';

export {AmberStage as Stage, WithCard, makeT, endOf, ip, pk, live, swing, hsh, arcPt, fmt, EIO, EOUT, EIN, EBACK, P, FFONT, G, Adult, Coin, FText, clamp01, prog, pop, Room, Plate, Mini, Crowd, Columns, Envelope, Gear, HW, HH, VW, VH, FPS} from '../amber/kit';
export type {CK, Hit, VoLine, AdultLook} from '../amber/kit';
export {LAY, kk, Calendar, Pile, fall, FloorDeco, type Lay} from '../amber/AmberR2';
export {Tag, Stamp, Banknote, FlatBurst} from '../../kit-flat/flat';

// --- postacie (ogólne, bez podobieństwa do prawdziwych osób) -----------------------------------------
export const LOOK = {
	walt: {suit: '#7A5A3E', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'side' as const},
	wuj: {suit: '#5C6B7A', hair: '#C9C2B5', shirt: '#E4DBCB', hairStyle: 'bald' as const, glasses: true},
	roy: {suit: '#4A5A6E', hair: '#6B4A2E', shirt: '#E4DBCB', hairStyle: 'short' as const, glasses: true},
	winkler: {suit: '#7A4E5A', hair: '#2B2420', shirt: '#E4DBCB', hairStyle: 'long' as const},
	hewlett: {suit: '#6E7D61', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'short' as const},
	packard: {suit: '#33445A', hair: '#8C6A3E', shirt: '#E4DBCB', hairStyle: 'side' as const},
	lucile: {suit: '#8C5A4A', hair: '#6B4A2E', shirt: '#E4DBCB', hairStyle: 'long' as const},
	woz: {suit: '#5C4A3A', hair: '#2B2420', shirt: '#CFC7B8', hairStyle: 'short' as const, glasses: true},
	jobs: {suit: '#3B4A42', hair: '#2B2420', shirt: '#E4DBCB', hairStyle: 'side' as const},
	wayne: {suit: '#8C7A5E', hair: '#8A8A8A', shirt: '#E4DBCB', hairStyle: 'side' as const, glasses: true},
	terrell: {suit: '#4A5A6E', hair: '#A07850', shirt: '#E4DBCB', hairStyle: 'short' as const, tie: '#B5503A'},
	bezos: {suit: '#2E3B4E', hair: '#6B4A2E', shirt: '#E4DBCB', hairStyle: 'side' as const, tie: '#9C7A2E'},
	prawnik: {suit: '#3A4A5E', hair: '#8A8A8A', shirt: '#E4DBCB', hairStyle: 'short' as const, tie: '#5C6B7A', glasses: true},
	page: {suit: '#5C6B7A', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'short' as const},
	brin: {suit: '#7A4E3A', hair: '#2B2420', shirt: '#E4DBCB', hairStyle: 'side' as const},
	andy: {suit: '#33445A', hair: '#C9C2B5', shirt: '#E4DBCB', hairStyle: 'side' as const, glasses: true},
	susan: {suit: '#4F6A7A', hair: '#3B2A20', shirt: '#E4DBCB', hairStyle: 'long' as const},
	mama: {suit: '#8C6A5A', hair: '#A07850', shirt: '#E4DBCB', hairStyle: 'long' as const},
	tata: {suit: '#5C6B7A', hair: '#8A8A8A', shirt: '#E4DBCB', hairStyle: 'short' as const, glasses: true},
};

// --- garaż: motyw przewodni ----------------------------------------------------------------------------
// Środek podstawy w 0,0. open 0..1: skrzydło drzwi unosi się pod strop. children = wnętrze (widoczne, gdy otwarte).
export const Garage: React.FC<{w?: number; h?: number; open?: number; wall?: string; door?: string; roof?: string; label?: string; labelSize?: number; dark?: boolean; children?: React.ReactNode; id?: string}> = ({
	w = 460,
	h = 330,
	open = 0,
	wall = '#D9C9AE',
	door = '#B9A98F',
	roof = '#8C4A3A',
	label,
	labelSize,
	dark = false,
	children,
	id = 'g',
}) => {
	const dw = w * 0.74;
	const dh = h * 0.72;
	const dx = -dw / 2;
	const dy = -dh;
	const lift = clamp01(open);
	const panel = dh * (1 - lift);
	return (
		<g>
			<ellipse cx={0} cy={6} rx={w * 0.62} ry={18} fill={P.shadow} />
			<rect x={-w / 2} y={-h} width={w} height={h} fill={wall} stroke={P.navy} strokeWidth={7} />
			{[0.25, 0.5, 0.75].map((k) => (
				<line key={k} x1={-w / 2} x2={w / 2} y1={-h * k} y2={-h * k} stroke={P.navy} strokeWidth={2} opacity={0.12} />
			))}
			<path d={`M ${-w / 2 - 34} ${-h + 4} L 0 ${-h - h * 0.42} L ${w / 2 + 34} ${-h + 4} Z`} fill={roof} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
			<defs>
				<clipPath id={`gd-${id}`}>
					<rect x={dx} y={dy} width={dw} height={dh} />
				</clipPath>
			</defs>
			<rect x={dx} y={dy} width={dw} height={dh} fill={dark ? '#0E1520' : '#2A3646'} />
			<g clipPath={`url(#gd-${id})`}>
				<rect x={dx} y={dy} width={dw} height={dh} fill={dark ? '#0E1520' : '#3A4656'} opacity={0.6} />
				<g opacity={lift > 0.05 ? 1 : 0}>{children}</g>
				{/* skrzydło: dolna krawędź podnosi się, u góry chowa się pod strop */}
				<rect x={dx} y={dy} width={dw} height={panel} fill={door} stroke={P.navy} strokeWidth={5} />
				{Array.from({length: 6}).map((_, i) => {
					const y = dy + ((i + 1) * dh) / 7 - dh * lift;
					return y > dy + 2 && y < dy + panel - 2 ? <line key={i} x1={dx + 8} x2={dx + dw - 8} y1={y} y2={y} stroke={P.navy} strokeWidth={4} opacity={0.35} /> : null;
				})}
				{panel > 26 && <rect x={-dw * 0.08} y={dy + panel - 22} width={dw * 0.16} height={9} rx={4} fill={P.navy} opacity={0.7} />}
			</g>
			<rect x={dx} y={dy} width={dw} height={dh} fill="none" stroke={P.navy} strokeWidth={7} />
			{label && (
				<g>
					<rect x={-w * 0.36} y={-h - h * 0.3} width={w * 0.72} height={h * 0.2} rx={10} fill={P.white} stroke={P.navy} strokeWidth={5} />
					<FText text={label} x={0} y={-h - h * 0.3 + h * 0.16} size={labelSize ?? Math.min(h * 0.14, (w * 0.66) / (0.55 * label.length))} fill={P.navy} />
				</g>
			)}
		</g>
	);
};

// Łańcuch od (x0,y0) do (x1,y1) z ugięciem; p = ile już widać (0..1); glow = ochrowy blask.
export const Chain: React.FC<{x0: number; y0: number; x1: number; y1: number; sag?: number; p?: number; link?: number; glow?: number; tension?: number}> = ({x0, y0, x1, y1, sag = 80, p = 1, link = 26, glow = 0, tension = 0}) => {
	const len = Math.hypot(x1 - x0, y1 - y0);
	const n = Math.max(2, Math.floor(len / (link * 0.78)));
	const s = sag * (1 - tension);
	const out: React.ReactNode[] = [];
	for (let i = 0; i < n; i++) {
		const t = i / (n - 1);
		if (t > p) break;
		const x = x0 + (x1 - x0) * t;
		const y = y0 + (y1 - y0) * t + s * 4 * t * (1 - t);
		const t2 = Math.min(1, t + 0.01);
		const ang = (Math.atan2(y0 + (y1 - y0) * t2 + s * 4 * t2 * (1 - t2) - y, x0 + (x1 - x0) * t2 - x) * 180) / Math.PI;
		out.push(
			<g key={i} transform={`translate(${x} ${y}) rotate(${ang})`}>
				{i % 2 === 0 ? (
					<ellipse rx={link * 0.62} ry={link * 0.34} fill="none" stroke={glow > 0 ? P.gold : '#7D8A97'} strokeWidth={link * 0.2} />
				) : (
					<line x1={-link * 0.55} x2={link * 0.55} y1={0} y2={0} stroke={glow > 0 ? P.goldDark : '#5C6B7A'} strokeWidth={link * 0.22} strokeLinecap="round" />
				)}
			</g>,
		);
	}
	return (
		<g>
			{glow > 0 && <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + s * 2} ${x1} ${y1}`} fill="none" stroke={P.goldLight} strokeWidth={link * 1.6} opacity={0.35 * glow} strokeLinecap="round" />}
			{out}
		</g>
	);
};

// --- rekwizyty --------------------------------------------------------------------------------------------
export const Sign: React.FC<{text: string; w?: number; fill?: string; color?: string; ang?: number; size?: number}> = ({text, w = 360, fill = P.white, color = P.navy, ang = 0, size}) => (
	<g transform={`rotate(${ang})`}>
		<rect x={-w / 2} y={-w * 0.17} width={w} height={w * 0.34} rx={12} fill={fill} stroke={P.navy} strokeWidth={7} />
		<FText text={text} x={0} y={w * 0.07} size={size ?? Math.min(w * 0.17, (w * 0.86) / (0.56 * text.length))} fill={color} />
	</g>
);
// Tabliczka na słupku (stopa słupka w 0,0).
export const Plaque: React.FC<{lines: string[]; w?: number}> = ({lines, w = 380}) => (
	<g>
		<rect x={-12} y={-w * 0.75} width={24} height={w * 0.75} fill={P.slate} stroke={P.navy} strokeWidth={5} />
		<rect x={-w / 2} y={-w * 0.75 - w * 0.5} width={w} height={w * 0.5} rx={14} fill="#7A5A3E" stroke={P.navy} strokeWidth={7} />
		<rect x={-w / 2 + 14} y={-w * 0.75 - w * 0.5 + 14} width={w - 28} height={w * 0.5 - 28} rx={8} fill="none" stroke={P.goldLight} strokeWidth={4} />
		{lines.map((t, i) => (
			<FText key={i} text={t} x={0} y={-w * 0.75 - w * 0.5 + w * 0.17 + i * w * 0.14} size={w * (i === 0 ? 0.075 : 0.065)} fill={i === 0 ? P.goldLight : P.white} />
		))}
	</g>
);
// Paragon / rachunek: pozycje pojawiają się po kolei (shown = ile pozycji). Góra w 0,0.
export const Receipt: React.FC<{items: string[]; shown: number; w?: number; total?: string}> = ({items, shown, w = 300, total}) => {
	const rows = Math.max(1, items.length + (total ? 1 : 0));
	const h = 60 + rows * w * 0.14;
	return (
		<g>
			<path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2} ${h} ${Array.from({length: 8}).map((_, i) => `L ${w / 2 - ((i + 0.5) * w) / 8} ${h + (i % 2 ? 0 : 14)}`).join(' ')} L ${-w / 2} ${h} Z`} fill={P.white} stroke={P.navy} strokeWidth={5} strokeLinejoin="round" />
			{items.map((t, i) => (
				<FText key={i} text={t} x={-w / 2 + 24} y={44 + i * w * 0.14} size={w * 0.085} fill={P.navy} anchor="start" opacity={clamp01(shown - i)} />
			))}
			{total && <line x1={-w / 2 + 20} x2={w / 2 - 20} y1={32 + items.length * w * 0.14} y2={32 + items.length * w * 0.14} stroke={P.navy} strokeWidth={3} opacity={clamp01(shown - items.length)} />}
			{total && <FText text={total} x={w / 2 - 24} y={44 + items.length * w * 0.14 + 16} size={w * 0.11} fill={P.goldDark} anchor="end" opacity={clamp01(shown - items.length)} />}
		</g>
	);
};
// Czek (środek w 0,0); write 0..1 = wypisywanie kwoty.
export const Check: React.FC<{amount: string; to: string; w?: number; write?: number}> = ({amount, to, w = 420, write = 1}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.22} width={w} height={w * 0.44} rx={10} fill="#E6E0C8" stroke={P.navy} strokeWidth={6} />
		<rect x={-w / 2} y={-w * 0.22} width={w} height={w * 0.07} rx={6} fill={P.grass} opacity={0.6} />
		<FText text="dla:" x={-w / 2 + 22} y={-w * 0.04} size={w * 0.05} fill={P.slate} anchor="start" />
		<FText text={to} x={-w / 2 + 80} y={-w * 0.04} size={w * 0.07} fill={P.navy} anchor="start" opacity={clamp01(write * 2)} />
		<line x1={-w / 2 + 76} x2={w * 0.2} y1={-w * 0.02} y2={-w * 0.02} stroke={P.navy} strokeWidth={2} opacity={0.4} />
		<rect x={w * 0.08} y={w * 0.04} width={w * 0.36} height={w * 0.1} rx={6} fill={P.white} stroke={P.navy} strokeWidth={3} />
		<FText text={amount} x={w * 0.26} y={w * 0.12} size={w * 0.07} fill={P.goldDark} opacity={clamp01(write * 2 - 1)} />
		<path d={`M ${-w * 0.4} ${w * 0.14} q 20 -24 40 0 t 40 0 t 40 0`} fill="none" stroke={P.navy} strokeWidth={4} strokeDasharray={200} strokeDashoffset={200 * (1 - clamp01(write * 2 - 1))} />
	</g>
);
// Prosty pociąg (lokomotywa + wagon), dziób w prawo, koła na 0.
export const Train: React.FC<{f: number; w?: number}> = ({f, w = 520}) => {
	const s = w / 520;
	return (
		<g transform={`scale(${s})`}>
			<rect x={-250} y={-150} width={210} height={120} rx={10} fill="#7A4E3A" stroke={P.navy} strokeWidth={7} />
			{[0, 1, 2].map((i) => (
				<rect key={i} x={-232 + i * 64} y={-130} width={44} height={40} rx={6} fill={P.goldLight} stroke={P.navy} strokeWidth={4} />
			))}
			<rect x={-20} y={-120} width={200} height={90} rx={12} fill="#33445A" stroke={P.navy} strokeWidth={7} />
			<rect x={120} y={-200} width={90} height={170} rx={8} fill="#33445A" stroke={P.navy} strokeWidth={7} />
			<rect x={136} y={-184} width={56} height={44} rx={6} fill={P.goldLight} stroke={P.navy} strokeWidth={4} />
			<rect x={10} y={-180} width={40} height={60} fill="#1F2B3D" />
			<path d="M 180 -30 L 250 -30 L 210 -70 Z" fill={P.slate} stroke={P.navy} strokeWidth={5} />
			{[-210, -90, 30, 100, 170].map((x, i) => (
				<g key={i} transform={`translate(${x} -20) rotate(${f * 9})`}>
					<circle r={26} fill={P.slate} stroke={P.navy} strokeWidth={6} />
					<line x1={-20} x2={20} y1={0} y2={0} stroke={P.navy} strokeWidth={4} />
				</g>
			))}
			{[0, 1, 2].map((i) => {
				const k = ((f * 1.6 + i * 22) % 66) / 66;
				return <circle key={i} cx={30 - k * 120} cy={-200 - k * 110} r={18 + k * 34} fill={P.white} opacity={0.55 * (1 - k)} />;
			})}
		</g>
	);
};
// Mikrobus bez znaków (przód w prawo), koła na 0.
export const Van: React.FC<{f?: number; w?: number; color?: string}> = ({f = 0, w = 360, color = '#B9CBD3'}) => (
	<g transform={`scale(${w / 360})`}>
		<path d="M -170 -24 L -170 -150 Q -170 -186 -134 -186 L 120 -186 Q 172 -186 176 -130 L 180 -24 Z" fill={P.white} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		<path d="M -170 -24 L -170 -100 L 180 -100 L 180 -24 Z" fill={color} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		{[-140, -70, 0, 70].map((x) => (
			<rect key={x} x={x} y={-170} width={56} height={52} rx={8} fill="#5C6B7A" stroke={P.navy} strokeWidth={4} />
		))}
		<path d="M 130 -170 L 160 -170 Q 168 -150 168 -118 L 130 -118 Z" fill="#5C6B7A" stroke={P.navy} strokeWidth={4} />
		{[-110, 120].map((x) => (
			<g key={x} transform={`translate(${x} -20) rotate(${f * 12})`}>
				<circle r={30} fill={P.navy} />
				<circle r={12} fill={P.grey} />
				<line x1={-10} x2={10} y1={0} y2={0} stroke={P.navy} strokeWidth={4} />
			</g>
		))}
	</g>
);
// Samochód osobowy bez znaków (przód w prawo), koła na 0.
export const Car: React.FC<{f?: number; w?: number; color?: string}> = ({f = 0, w = 340, color = P.red}) => (
	<g transform={`scale(${w / 340})`}>
		<path d="M -160 -24 L -164 -80 Q -160 -100 -120 -104 L -70 -160 L 70 -160 L 120 -104 Q 166 -100 168 -70 L 166 -24 Z" fill={color} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		<path d="M -56 -146 L -86 -106 L -6 -106 L -6 -146 Z M 8 -146 L 8 -106 L 96 -106 L 62 -146 Z" fill="#B9CBD3" stroke={P.navy} strokeWidth={4} />
		{[-100, 104].map((x) => (
			<g key={x} transform={`translate(${x} -20) rotate(${f * 12})`}>
				<circle r={28} fill={P.navy} />
				<circle r={11} fill={P.grey} />
				<line x1={-9} x2={9} y1={0} y2={0} stroke={P.navy} strokeWidth={4} />
			</g>
		))}
	</g>
);
// Ciężarówka skrzyniowa (przód w prawo).
export const Truck: React.FC<{f?: number; w?: number}> = ({f = 0, w = 420}) => (
	<g transform={`scale(${w / 420})`}>
		<rect x={-200} y={-200} width={270} height={176} rx={8} fill={P.white} stroke={P.navy} strokeWidth={7} />
		<path d="M 80 -24 L 80 -140 L 150 -140 L 196 -80 L 196 -24 Z" fill={P.red} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		<path d="M 98 -124 L 144 -124 L 176 -84 L 98 -84 Z" fill="#B9CBD3" stroke={P.navy} strokeWidth={4} />
		{[-150, -60, 140].map((x) => (
			<g key={x} transform={`translate(${x} -20) rotate(${f * 12})`}>
				<circle r={28} fill={P.navy} />
				<circle r={11} fill={P.grey} />
			</g>
		))}
	</g>
);
// Dom z dwuspadowym dachem (środek podstawy w 0,0).
export const House: React.FC<{w?: number; h?: number; wall?: string; roof?: string; lit?: number}> = ({w = 420, h = 280, wall = '#E4DBCB', roof = '#5C6B7A', lit = 0}) => (
	<g>
		<rect x={-w / 2} y={-h} width={w} height={h} fill={wall} stroke={P.navy} strokeWidth={7} />
		<path d={`M ${-w / 2 - 30} ${-h + 4} L 0 ${-h - h * 0.55} L ${w / 2 + 30} ${-h + 4} Z`} fill={roof} stroke={P.navy} strokeWidth={7} strokeLinejoin="round" />
		{[-0.28, 0.28].map((k) => (
			<g key={k}>
				<rect x={w * k - w * 0.11} y={-h * 0.78} width={w * 0.22} height={h * 0.26} fill={lit ? P.goldLight : '#B9CBD3'} stroke={P.navy} strokeWidth={5} />
				<line x1={w * k} x2={w * k} y1={-h * 0.78} y2={-h * 0.52} stroke={P.navy} strokeWidth={3} />
			</g>
		))}
		<rect x={-w * 0.08} y={-h * 0.42} width={w * 0.16} height={h * 0.42} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
	</g>
);
// Biurowiec / wieżowiec (środek podstawy w 0,0).
export const Tower: React.FC<{w?: number; h?: number; fill?: string; lit?: number; seed?: number}> = ({w = 180, h = 620, fill = '#5C6B7A', lit = 0.4, seed = 1}) => {
	const cols = 4;
	const rows = Math.floor(h / 60);
	return (
		<g>
			<rect x={-w / 2} y={-h} width={w} height={h} fill={fill} stroke={P.navy} strokeWidth={6} />
			{Array.from({length: rows}).map((_, r) =>
				Array.from({length: cols}).map((_, c) => (
					<rect key={`${r}-${c}`} x={-w / 2 + 14 + c * ((w - 28) / cols)} y={-h + 20 + r * 60} width={(w - 28) / cols - 12} height={30} fill={hsh(seed * 100 + r * 7 + c) < lit ? P.goldLight : '#33445A'} />
				)),
			)}
		</g>
	);
};
// Biurko z lampą (blat na wysokości ok. -150, środek podstawy w 0,0).
export const Desk: React.FC<{w?: number; lamp?: number; children?: React.ReactNode}> = ({w = 420, lamp = 0, children}) => (
	<g>
		<rect x={-w / 2} y={-160} width={w} height={22} rx={6} fill="#A87B4A" stroke={P.navy} strokeWidth={6} />
		<rect x={-w / 2 + 16} y={-138} width={18} height={138} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
		<rect x={w / 2 - 34} y={-138} width={18} height={138} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
		{lamp > 0 && <path d={`M ${w * 0.34} -300 L ${w * 0.05} -160 L ${w * 0.5} -160 Z`} fill={P.goldLight} opacity={0.35 * lamp} />}
		<g transform={`translate(${w * 0.34} -160)`}>
			<line x1={0} y1={0} x2={-20} y2={-110} stroke={P.navy} strokeWidth={8} />
			<line x1={-20} y1={-110} x2={20} y2={-150} stroke={P.navy} strokeWidth={8} />
			<path d="M 0 -170 L 46 -150 L 30 -120 L -10 -140 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} />
			<ellipse cx={0} cy={0} rx={30} ry={8} fill={P.navy} />
		</g>
		<g transform="translate(0 -160)">{children}</g>
	</g>
);
// Monitor kineskopowy (środek podstawy w 0,0); screen = zawartość ekranu w układzie (-90..90, -150..-40).
export const Crt: React.FC<{screen?: React.ReactNode; s?: number}> = ({screen, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-110} y={-176} width={220} height={160} rx={18} fill="#CFC7B8" stroke={P.navy} strokeWidth={6} />
		<rect x={-92} y={-160} width={184} height={124} rx={10} fill="#1F2B3D" />
		<g>{screen}</g>
		<rect x={-40} y={-16} width={80} height={16} fill="#AEA594" stroke={P.navy} strokeWidth={5} />
	</g>
);
// Płytka drukowana; draw 0..1 rysuje ścieżki, chips 0..1 dokłada układy scalone. Środek w 0,0.
export const Pcb: React.FC<{w?: number; draw?: number; chips?: number; lit?: number}> = ({w = 320, draw = 1, chips = 1, lit = 0}) => {
	const h = w * 0.62;
	const tr = [
		`M ${-w * 0.42} ${-h * 0.3} L ${-w * 0.1} ${-h * 0.3} L ${-w * 0.02} ${-h * 0.16} L ${w * 0.38} ${-h * 0.16}`,
		`M ${-w * 0.42} ${0} L ${-w * 0.2} 0 L ${-w * 0.12} ${h * 0.12} L ${w * 0.4} ${h * 0.12}`,
		`M ${-w * 0.3} ${h * 0.34} L ${w * 0.1} ${h * 0.34} L ${w * 0.18} ${h * 0.24} L ${w * 0.4} ${h * 0.24}`,
		`M ${w * 0.1} ${-h * 0.4} L ${w * 0.1} ${h * 0.3}`,
	];
	return (
		<g>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.grassDark} stroke={P.navy} strokeWidth={6} />
			{tr.map((d, i) => (
				<path key={i} d={d} fill="none" stroke={P.goldLight} strokeWidth={w * 0.014} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(draw * 1.3 - i * 0.1)} strokeLinecap="round" strokeLinejoin="round" />
			))}
			{[
				[-w * 0.26, -h * 0.08, w * 0.2],
				[w * 0.14, -h * 0.02, w * 0.16],
				[-w * 0.04, h * 0.22, w * 0.12],
				[w * 0.3, h * 0.36, w * 0.08],
			].map(([x, y, cw], i) => (
				<g key={i} opacity={clamp01(chips * 4 - i)} transform={`translate(${x} ${y})`}>
					<rect x={-cw / 2} y={-cw * 0.3} width={cw} height={cw * 0.6} rx={3} fill={P.navy} />
					{Array.from({length: 4}).map((_, k) => (
						<line key={k} x1={-cw / 2 + ((k + 0.5) * cw) / 4} x2={-cw / 2 + ((k + 0.5) * cw) / 4} y1={-cw * 0.3} y2={-cw * 0.42} stroke={P.grey} strokeWidth={3} />
					))}
				</g>
			))}
			{lit > 0 && <circle cx={w * 0.4} cy={-h * 0.36} r={w * 0.03} fill={P.gold} opacity={lit} />}
		</g>
	);
};
// Generator dźwięku z pokrętłem; knob 0..1 zmienia gęstość fali na ekranie. Środek podstawy w 0,0.
export const ToneGen: React.FC<{f: number; knob?: number; on?: number; w?: number}> = ({f, knob = 0.3, on = 1, w = 300}) => {
	const h = w * 0.62;
	const cycles = 1.5 + knob * 6;
	let d = '';
	for (let i = 0; i <= 60; i++) {
		const x = -w * 0.22 + (i / 60) * w * 0.44;
		const y = -h * 0.62 + Math.sin((i / 60) * cycles * Math.PI * 2 + f / 3) * h * 0.12 * on;
		d += `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)} `;
	}
	return (
		<g>
			<rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill="#AEA594" stroke={P.navy} strokeWidth={7} />
			<rect x={-w * 0.3} y={-h * 0.86} width={w * 0.6} height={h * 0.48} rx={10} fill="#1F2B3D" stroke={P.navy} strokeWidth={5} />
			<path d={d} fill="none" stroke={P.goldLight} strokeWidth={4} />
			<g transform={`translate(${-w * 0.22} ${-h * 0.2}) rotate(${-120 + knob * 240})`}>
				<circle r={w * 0.08} fill={P.navy} />
				<line x1={0} y1={0} x2={0} y2={-w * 0.07} stroke={P.gold} strokeWidth={5} strokeLinecap="round" />
			</g>
			<circle cx={w * 0.2} cy={-h * 0.2} r={w * 0.035} fill={on > 0.5 ? P.gold : P.slate} stroke={P.navy} strokeWidth={4} />
			<FText text="200A" x={w * 0.02} y={-h * 0.14} size={w * 0.07} fill={P.navy} />
		</g>
	);
};
// Wiertarka stołowa (stopa w 0,0).
export const DrillPress: React.FC<{s?: number; spin?: number}> = ({s = 1, spin = 0}) => (
	<g transform={`scale(${s})`}>
		<rect x={-80} y={-24} width={160} height={24} rx={6} fill={P.slate} stroke={P.navy} strokeWidth={6} />
		<rect x={30} y={-300} width={26} height={276} fill="#7D8A97" stroke={P.navy} strokeWidth={6} />
		<rect x={-70} y={-110} width={150} height={20} rx={4} fill="#7D8A97" stroke={P.navy} strokeWidth={5} />
		<path d="M -60 -340 L 80 -340 L 80 -250 L -20 -250 L -60 -280 Z" fill={P.red} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<rect x={-30} y={-250} width={20} height={50} fill={P.slate} stroke={P.navy} strokeWidth={4} />
		<path d={`M -20 -200 L -20 -150`} stroke={P.navy} strokeWidth={6} strokeDasharray="6 6" strokeDashoffset={spin} />
		<line x1={80} y1={-300} x2={130} y2={-260} stroke={P.navy} strokeWidth={7} strokeLinecap="round" />
	</g>
);
// Kalkulator (środek w 0,0).
export const Calc: React.FC<{w?: number}> = ({w = 120}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.85} width={w} height={w * 1.7} rx={12} fill="#5C4A3A" stroke={P.navy} strokeWidth={5} />
		<rect x={-w * 0.38} y={-w * 0.7} width={w * 0.76} height={w * 0.3} rx={4} fill="#8E9C7F" />
		{Array.from({length: 12}).map((_, i) => (
			<rect key={i} x={-w * 0.36 + (i % 3) * w * 0.26} y={-w * 0.28 + Math.floor(i / 3) * w * 0.26} width={w * 0.2} height={w * 0.18} rx={3} fill={i % 3 === 2 ? P.gold : P.grey} />
		))}
	</g>
);
// Kamera filmowa na korbkę (środek w 0,0).
export const FilmCam: React.FC<{f?: number; w?: number}> = ({f = 0, w = 200}) => (
	<g transform={`scale(${w / 200})`}>
		<rect x={-80} y={-50} width={140} height={100} rx={10} fill={P.navy} />
		<circle cx={-40} cy={-80} r={40} fill="#33445A" stroke={P.navy} strokeWidth={6} />
		<circle cx={30} cy={-80} r={40} fill="#33445A" stroke={P.navy} strokeWidth={6} />
		<rect x={60} y={-20} width={50} height={40} rx={6} fill="#5C6B7A" stroke={P.navy} strokeWidth={5} />
		<g transform={`translate(-80 10) rotate(${f * 8})`}>
			<line x1={0} y1={0} x2={-40} y2={0} stroke={P.slate} strokeWidth={8} strokeLinecap="round" />
		</g>
	</g>
);
// Szpula filmu (środek w 0,0).
export const Reel: React.FC<{r?: number; spin?: number}> = ({r = 60, spin = 0}) => (
	<g transform={`rotate(${spin})`}>
		<circle r={r} fill="#5C6B7A" stroke={P.navy} strokeWidth={6} />
		{[0, 1, 2, 3, 4].map((i) => (
			<circle key={i} cx={Math.cos((i / 5) * Math.PI * 2) * r * 0.55} cy={Math.sin((i / 5) * Math.PI * 2) * r * 0.55} r={r * 0.2} fill={P.bg} stroke={P.navy} strokeWidth={4} />
		))}
		<circle r={r * 0.12} fill={P.navy} />
	</g>
);
// Walizka (środek podstawy w 0,0), open 0..1 odchyla wieko.
export const Suitcase: React.FC<{w?: number; open?: number; children?: React.ReactNode}> = ({w = 260, open = 0, children}) => {
	const h = w * 0.6;
	return (
		<g>
			<rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill="#8C5A3A" stroke={P.navy} strokeWidth={7} />
			<g transform={`translate(0 ${-h})`}>{children}</g>
			<g transform={`translate(${-w / 2} ${-h}) rotate(${-open * 110})`}>
				<rect x={0} y={-h * 0.28} width={w} height={h * 0.28} rx={12} fill="#9C6A48" stroke={P.navy} strokeWidth={7} />
			</g>
			<path d={`M ${-w * 0.14} ${-h - (open > 0.2 ? 0 : 6)} q ${w * 0.14} ${-w * 0.16} ${w * 0.28} 0`} fill="none" stroke={P.navy} strokeWidth={8} opacity={open > 0.2 ? 0 : 1} />
			{[-0.3, 0.3].map((k) => (
				<rect key={k} x={w * k - 10} y={-h - 6} width={20} height={16} rx={3} fill={P.gold} stroke={P.navy} strokeWidth={3} />
			))}
		</g>
	);
};
// Paczka kartonowa z taśmą (środek podstawy w 0,0).
export const Box: React.FC<{w?: number; open?: number; label?: string}> = ({w = 160, open = 0, label}) => (
	<g>
		<rect x={-w / 2} y={-w * 0.7} width={w} height={w * 0.7} fill="#C99A64" stroke={P.navy} strokeWidth={6} />
		<g transform={`translate(${-w / 2} ${-w * 0.7}) rotate(${-open * 130})`}>
			<rect x={0} y={-6} width={w / 2} height={12} fill="#B88A54" stroke={P.navy} strokeWidth={4} />
		</g>
		<g transform={`translate(${w / 2} ${-w * 0.7}) rotate(${open * 130})`}>
			<rect x={-w / 2} y={-6} width={w / 2} height={12} fill="#B88A54" stroke={P.navy} strokeWidth={4} />
		</g>
		<rect x={-w * 0.08} y={-w * 0.7} width={w * 0.16} height={w * 0.7} fill="#D9B07A" opacity={1 - open} />
		{label && <FText text={label} x={0} y={-w * 0.25} size={w * 0.13} fill={P.navy} />}
	</g>
);
// Książka (grzbiet w 0,0, leży płasko) – okładka z tytułem.
export const Book: React.FC<{w?: number; color?: string; title?: string}> = ({w = 140, color = P.blue, title}) => (
	<g>
		<rect x={-w / 2} y={-w * 1.3} width={w} height={w * 1.3} rx={6} fill={color} stroke={P.navy} strokeWidth={5} />
		<rect x={-w / 2} y={-w * 1.3} width={w * 0.12} height={w * 1.3} fill={P.navy} opacity={0.3} />
		{title && <FText text={title} x={w * 0.05} y={-w * 0.8} size={w * 0.16} fill={P.white} />}
	</g>
);
// Duża skrzynka na listy na słupku (stopa w 0,0); bulge 0..1 wybrzusza.
export const Mailbox: React.FC<{w?: number; bulge?: number; flag?: number}> = ({w = 220, bulge = 0, flag = 0}) => (
	<g>
		<rect x={-12} y={-w * 0.9} width={24} height={w * 0.9} fill="#7A5A3E" stroke={P.navy} strokeWidth={5} />
		<path d={`M ${-w / 2} ${-w * 0.9} L ${-w / 2} ${-w * 1.4 - bulge * 20} Q 0 ${-w * 1.75 - bulge * 40} ${w / 2} ${-w * 1.4 - bulge * 20} L ${w / 2} ${-w * 0.9} Z`} fill="#5C6B7A" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<g transform={`translate(${w / 2 - 10} ${-w * 1.2}) rotate(${-90 * flag})`}>
			<rect x={0} y={-8} width={60} height={16} fill={P.red} stroke={P.navy} strokeWidth={4} />
		</g>
	</g>
);
// Stół do ping-ponga (środek podstawy w 0,0); ball = pozycja piłeczki 0..1 w poprzek.
export const PingPong: React.FC<{w?: number; ball?: number}> = ({w = 420, ball = 0.5}) => (
	<g>
		<path d={`M ${-w / 2} -140 L ${w / 2} -140 L ${w / 2 - 30} -170 L ${-w / 2 + 30} -170 Z`} fill="#4F6A7A" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
		<rect x={-w / 2} y={-140} width={w} height={16} fill="#3F5A6A" stroke={P.navy} strokeWidth={5} />
		<line x1={0} y1={-196} x2={0} y2={-140} stroke={P.white} strokeWidth={4} />
		<rect x={-4} y={-196} width={8} height={30} fill={P.white} opacity={0.6} />
		{[-0.42, 0.42].map((k) => (
			<rect key={k} x={w * k - 8} y={-124} width={16} height={124} fill={P.slate} stroke={P.navy} strokeWidth={4} />
		))}
		<circle cx={-w * 0.4 + ball * w * 0.8} cy={-180 - Math.abs(Math.sin(ball * Math.PI * 3)) * 70} r={9} fill={P.white} stroke={P.navy} strokeWidth={3} />
	</g>
);
// Wykres kołowy udziałów (środek w 0,0). parts: [udział 0..1, kolor]; pull = wysunięcie kawałka o indeksie pullI.
export const Pie: React.FC<{r?: number; parts: [number, string][]; pullI?: number; pull?: number}> = ({r = 140, parts, pullI = -1, pull = 0}) => {
	let a0 = -Math.PI / 2;
	return (
		<g>
			{parts.map(([q, c], i) => {
				const a1 = a0 + q * Math.PI * 2;
				const mid = (a0 + a1) / 2;
				const dx = i === pullI ? Math.cos(mid) * pull : 0;
				const dy = i === pullI ? Math.sin(mid) * pull : 0;
				const large = q > 0.5 ? 1 : 0;
				const d = `M ${dx} ${dy} L ${dx + Math.cos(a0) * r} ${dy + Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${dx + Math.cos(a1) * r} ${dy + Math.sin(a1) * r} Z`;
				a0 = a1;
				return <path key={i} d={d} fill={c} stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />;
			})}
		</g>
	);
};
// Waga szalkowa (podstawa w 0,0); tilt -1..1 (dodatni = prawa szala niżej).
export const Scale: React.FC<{w?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode}> = ({w = 420, tilt = 0, left, right}) => {
	const a = tilt * 14;
	const r = (a * Math.PI) / 180;
	const lx = -w / 2;
	const ly = -300 - Math.sin(r) * (w / 2);
	const rx = w / 2;
	const ry = -300 + Math.sin(r) * (w / 2);
	return (
		<g>
			<path d="M -70 0 L 70 0 L 20 -30 L -20 -30 Z" fill={P.slate} stroke={P.navy} strokeWidth={6} />
			<rect x={-10} y={-300} width={20} height={270} fill="#7D8A97" stroke={P.navy} strokeWidth={5} />
			<line x1={lx} y1={ly} x2={rx} y2={ry} stroke={P.navy} strokeWidth={12} strokeLinecap="round" />
			{[
				[lx, ly, left],
				[rx, ry, right],
			].map(([x, y, c], i) => (
				<g key={i} transform={`translate(${x as number} ${y as number})`}>
					<line x1={-50} y1={70} x2={0} y2={0} stroke={P.navy} strokeWidth={3} />
					<line x1={50} y1={70} x2={0} y2={0} stroke={P.navy} strokeWidth={3} />
					<path d="M -80 70 Q 0 110 80 70 Z" fill={P.gold} stroke={P.navy} strokeWidth={5} />
					<g transform="translate(0 70)">{c as React.ReactNode}</g>
				</g>
			))}
			<circle cy={-300} r={14} fill={P.gold} stroke={P.navy} strokeWidth={5} />
		</g>
	);
};
// Kartka kalendarza z rokiem (środek w 0,0); flip 0..1 animuje odwracanie (od starej do nowej liczby).
export const YearFlip: React.FC<{from?: string; to: string; flip?: number; w?: number; top?: string}> = ({from, to, flip = 1, w = 200, top}) => {
	const p = clamp01(flip);
	if (!from || p >= 1) return <Calendar text={to} w={w} top={top} />;
	return (
		<g>
			<Calendar text={to} w={w} top={top} />
			<g transform={`translate(0 ${-w * 0.55}) scale(1 ${Math.max(0.02, 1 - p * 2)}) translate(0 ${w * 0.55})`} opacity={p < 0.5 ? 1 : 0}>
				<Calendar text={from} w={w} top={top} />
			</g>
		</g>
	);
};

// --- mapy ---------------------------------------------------------------------------------------------------
// USA (jednostki z geo.gen: kontynentalne USA ok. 1500 j. szerokości, (0,0) w środku). hl = podświetlenie USA.
export const UsMap: React.FC<{hl?: number}> = ({hl = 0}) => (
	<g>
		{US_SHAPES.map((s) => (
			<path key={s.n} d={s.d} fill={s.n === 'United States of America' ? (hl > 0 ? '#D9C9AE' : '#E4DBCB') : '#CFC7B8'} stroke={P.navy} strokeWidth={s.n === 'United States of America' ? 4 : 2.5} strokeLinejoin="round" opacity={s.n === 'United States of America' ? 1 : 0.75} />
		))}
	</g>
);
export const BayMap: React.FC = () => <path d={BAY_LAND} fill="#E4DBCB" stroke={P.navy} strokeWidth={4} strokeLinejoin="round" />;
export const WorldMap: React.FC<{usHl?: number}> = () => (
	<g>
		{WORLD.map((s) => (
			<path key={s.n} d={s.d} fill={s.n === 'United States of America' ? '#D9C9AE' : '#E4DBCB'} stroke={P.navy} strokeWidth={1.6} strokeLinejoin="round" />
		))}
	</g>
);
// Pinezka (grot w 0,0) z podpisem; s = skala pojawienia.
export const Pin: React.FC<{label?: string; s?: number; color?: string; size?: number; side?: 'r' | 'l' | 't'}> = ({label, s = 1, color = P.red, size = 40, side = 'r'}) =>
	s <= 0.01 ? null : (
		<g transform={`scale(${s})`}>
			<path d={`M 0 0 C ${-size * 0.2} ${-size * 0.5} ${-size * 0.55} ${-size * 0.7} ${-size * 0.55} ${-size * 1.05} A ${size * 0.55} ${size * 0.55} 0 1 1 ${size * 0.55} ${-size * 1.05} C ${size * 0.55} ${-size * 0.7} ${size * 0.2} ${-size * 0.5} 0 0 Z`} fill={color} stroke={P.navy} strokeWidth={size * 0.12} />
			<circle cy={-size * 1.05} r={size * 0.2} fill={P.white} />
			{label && (
				<FText
					text={label}
					x={side === 'r' ? size * 0.75 : side === 'l' ? -size * 0.75 : 0}
					y={side === 't' ? -size * 1.9 : -size * 0.8}
					size={size * 0.62}
					fill={P.navy}
					stroke={P.bg}
					sw={size * 0.16}
					anchor={side === 'r' ? 'start' : side === 'l' ? 'end' : 'middle'}
				/>
			)}
		</g>
	);
// Trasa rysowana od a do b z łukiem; p 0..1.
export const Route: React.FC<{a: [number, number]; b: [number, number]; p: number; h?: number; w?: number; color?: string}> = ({a, b, p, h = 120, w = 8, color = P.red}) =>
	p <= 0 ? null : (
		<path d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 - h} ${b[0]} ${b[1]}`} fill="none" stroke={color} strokeWidth={w} pathLength={100} strokeDasharray={`${100 * clamp01(p)} 200`} strokeLinecap="round" />
	);

// --- plansza historii (tylko film 16:9): garaż z nazwą i rokiem otwiera się ---------------------------------
export const CARD = 54;
export const GarageCard: React.FC<{num: number; name: string; year: string}> = ({num, name, year}) => {
	const f = useCurrentFrame();
	const open = ip(f, 18, 44, 0, 1, EIO);
	return (
		<AbsoluteFill style={{backgroundColor: P.navy}}>
			<svg width={HW} height={HH} viewBox={`0 0 ${HW} ${HH}`}>
				<rect x={0} y={760} width={HW} height={320} fill="#162130" />
				<g transform={`translate(${HW / 2} 780) scale(${1.25 + ip(f, 0, CARD, 0, 0.08, EIO)})`}>
					<Garage w={560} h={400} open={open} dark id={`card${num}`}>
						<g opacity={open}>
							<FText text={year} x={0} y={-140} size={120} fill={P.gold} />
						</g>
					</Garage>
				</g>
				<FText text={`${num}`} x={HW / 2 - 560} y={560} size={200} fill={P.gold} opacity={prog(f, 2, 8)} />
				<FText text={name} x={HW / 2 + 440} y={540} size={110} fill={P.bg} opacity={prog(f, 6, 8)} anchor="start" />
			</svg>
		</AbsoluteFill>
	);
};

// --- short: wycięcie zdań [tylko film] ---------------------------------------------------------------------------
// keep = przedziały klatek filmu [od, do), które zostają; obraz i dźwięk sceny przesuwają się razem.
export const CutShort: React.FC<{keep: [number, number][]; children: React.ReactNode}> = ({keep, children}) => {
	let at = 0;
	const parts = keep.map(([a, b], i) => {
		const el = (
			<Sequence key={i} from={at} durationInFrames={b - a} layout="none">
				<Sequence from={-a} layout="none">
					{children}
				</Sequence>
			</Sequence>
		);
		at += b - a;
		return el;
	});
	return <AbsoluteFill>{parts}</AbsoluteFill>;
};
// Przedziały do zachowania z listy linii do wycięcia (indeksy linii lektora) i początku ogona.
export const keepFrom = (lines: VoLine[], cut: number[], tailFrom: number | null, end: number): [number, number][] => {
	const fr = (s: number) => Math.round(s * 30);
	const out: [number, number][] = [];
	let a = 0;
	const stops = [...cut.map((i) => [fr(lines[i].s) - 4, i + 1 < lines.length ? fr(lines[i + 1].s) - 4 : end] as [number, number])];
	for (const [s, e] of stops) {
		out.push([a, s]);
		a = e;
	}
	out.push([a, tailFrom != null ? fr(lines[tailFrom].s) - 4 : end]);
	return out.filter(([s, e]) => e - s > 2);
};
export const keepLen = (k: [number, number][]) => k.reduce((s, [a, b]) => s + b - a, 0);

// Końcówka shortu: zaproszenie do całego filmu (lektor gacta).
export const CTA_FRAMES = endOf(CTA_LINES) + 30;
export const CtaScene: React.FC = () => (
	<AmberStage v lines={CTA_LINES} vo="gacta_vo.wav" keys={[{f: 0, x: 540, y: 760, z: 1.06}, {f: CTA_FRAMES, x: 540, y: 760, z: 1}]}>
		{(f) => (
			<g>
				<Room w={VW} h={VH} floor={1120} dark />
				{[0, 1, 2, 3, 4].map((i) => (
					<g key={i} transform={`translate(${150 + i * 195} ${1120}) scale(${0.36 * pk(f, i * 3)})`}>
						<Garage w={460} h={330} open={ip(f, 10 + i * 4, 30 + i * 4, 0, 1)} dark id={`cta${i}`}>
							<circle cx={0} cy={-120} r={40} fill={P.gold} opacity={0.8} />
						</Garage>
					</g>
				))}
				<Chain x0={110} y0={1010} x1={970} y1={1010} sag={40} p={ip(f, 20, 60, 0, 1)} link={22} glow={1} />
				<G x={540} y={620} s={pk(f, 26)}>
					<circle r={130} fill={P.gold} stroke={P.navy} strokeWidth={8} />
					<path d="M -40 -64 L 70 0 L -40 64 Z" fill={P.navy} />
				</G>
				<FText text="cały film" x={540} y={330} size={120} fill={P.gold} stroke={P.navy} sw={12} opacity={prog(f, 6, 8)} />
			</g>
		)}
	</AmberStage>
);
export const ShortWithCta: React.FC<{sceneFrames: number; children: React.ReactNode}> = ({sceneFrames, children}) => (
	<AbsoluteFill>
		<Sequence durationInFrames={sceneFrames} layout="none">
			{children}
		</Sequence>
		<Sequence from={sceneFrames} layout="none">
			<CtaScene />
		</Sequence>
	</AbsoluteFill>
);
export const lay = LAY;
export type {Lay as GLay};
