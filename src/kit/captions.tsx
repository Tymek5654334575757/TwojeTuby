// Napisy słowo po słowie (czasy z lektora). Kluczowe słowa na czerwono z podkreśleniem rysowanym na żywo.
import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {C, FONT} from './sketch';
export type VoWord = {w: string; s: number; e: number; key: boolean};
export type VoLine = {s: number; e: number; words: VoWord[]};

const chunk = (words: VoWord[], maxChars: number) => {
	const out: VoWord[][] = [];
	let cur: VoWord[] = [];
	let len = 0;
	for (const w of words) {
		if (cur.length && (len + w.w.length > maxChars || cur.length >= 4)) {
			out.push(cur);
			cur = [];
			len = 0;
		}
		cur.push(w);
		len += w.w.length + 1;
		if (/[,:]$/.test(w.w) && len > maxChars * 0.55) {
			out.push(cur);
			cur = [];
			len = 0;
		}
	}
	if (cur.length) out.push(cur);
	return out;
};

export const Captions: React.FC<{lines: VoLine[]; top: number; left: number; width: number; size: number; font?: string; weight?: number; color?: string; keyColor?: string; markColor?: string}> = ({
	lines,
	top,
	left,
	width,
	size,
	font = FONT,
	weight = 700,
	color = C.ink,
	keyColor = C.red,
	markColor = C.yellow,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const chunks = lines.flatMap((l) => chunk(l.words, 17).map((c) => ({c, lineEnd: l.e})));
	let active: VoWord[] | null = null;
	for (let i = 0; i < chunks.length; i++) {
		const start = chunks[i].c[0].s - (i === 0 ? 0.25 : 0.05);
		const next = chunks[i + 1]?.c[0].s ?? Infinity;
		const end = Math.min(next - 0.05, chunks[i].lineEnd + 0.45);
		if (t >= start && t < end) active = chunks[i].c;
	}
	if (!active) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: `0 ${size * 0.34}px`,
				fontFamily: font,
				fontWeight: weight,
				fontSize: size,
				lineHeight: 1.05,
				color,
				textAlign: 'center',
			}}
		>
			{active.map((w, i) => {
				const at = Math.round(w.s * fps) - (w.s < 0.3 ? 8 : 2);
				const p = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 190}});
				const under = interpolate(frame, [at + 2, at + 9], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const speaking = t >= w.s && t <= w.e + 0.05;
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: frame < at ? 0 : 1,
							scale: String(0.6 + 0.4 * p + (speaking ? 0.04 : 0)),
							rotate: `${(1 - p) * -8}deg`,
							color: w.key ? keyColor : color,
							backgroundImage: w.key ? `linear-gradient(${keyColor}, ${keyColor}), linear-gradient(${markColor}, ${markColor})` : undefined,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: '0 92%, 0 78%',
							backgroundSize: `${under}% 6px, ${Math.min(100, under * 1.2)}% 38%`,
							paddingBottom: 4,
						}}
					>
						{w.w}
					</span>
				);
			})}
		</div>
	);
};
