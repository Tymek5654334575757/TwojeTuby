// Shorty 9:16 wycięte z filmu „5 sztuczek polityków”: fragment rozdziału + tytuł sztuczki + napisy
// + zaproszenie do całego filmu na końcu. Jedna kompozycja na sztuczkę (Klip1–Klip5).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, staticFile, OffthreadVideo, Sequence, Freeze, interpolate} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/caveat/700.css';
import {C, Paper, Rough, Txt} from '../../kit/sketch';
import {Captions, type VoLine} from '../../kit/captions';
import {Glyph, prog, pk} from './common';
import {LINES as L1} from './vo1.gen';
import {LINES as L2} from './vo2.gen';
import {LINES as L3} from './vo3.gen';
import {LINES as L4} from './vo4.gen';
import {LINES as L5} from './vo5.gen';
import {LINES as CTA} from './cta.gen';

const FPS = 30;
const VY = 520; // górna krawędź wideo
const VH = 608;

// hold = ile sekund na starcie pokazać zatrzymaną klatkę z chwili a+hold (gdy fragment zaczyna się w trakcie przejazdu kamery)
type Clip = {lines: VoLine[]; from: number; to: number; name: string; i: number; hold: number};
const CLIPS: Clip[] = [
	{lines: L1, from: 23, to: 34, name: 'zdechły kot', i: 0, hold: 0},
	{lines: L2, from: 11, to: 21, name: 'dziel i rządź', i: 1, hold: 1},
	{lines: L3, from: 15, to: 28, name: 'rama', i: 2, hold: 0},
	{lines: L4, from: 9, to: 21, name: 'powtarzanie', i: 3, hold: 1},
	{lines: L5, from: 6, to: 22, name: 'plasterek po plasterku', i: 4, hold: 1},
];

const span = (c: Clip) => {
	const a = Math.max(0, c.lines[c.from].s - 0.12);
	const next = c.lines[c.to + 1];
	const b = Math.min(c.lines[c.to].e + 0.45, next ? next.s - 0.05 : 1e9);
	return {a, b};
};
const ctaLen = CTA[CTA.length - 1].e + 1.3;
export const klipFrames = (n: number) => {
	const {a, b} = span(CLIPS[n - 1]);
	return Math.round((b - a + ctaLen) * FPS);
};

const shift = (lines: VoLine[], d: number): VoLine[] => lines.map((l) => ({s: l.s + d, e: l.e + d, words: l.words.map((w) => ({...w, s: w.s + d, e: w.e + d}))}));

const Klip: React.FC<{n: number}> = ({n}) => {
	const f = useCurrentFrame();
	const [handle] = useState(() => delayRender('Ładowanie fontu Caveat'));
	useEffect(() => {
		document.fonts.load('700 80px Caveat', 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”…?!▶').then(() => continueRender(handle));
	}, [handle]);
	const c = CLIPS[n - 1];
	const {a, b} = span(c);
	const segF = Math.round((b - a) * FPS);
	const lines = [...shift(c.lines.slice(c.from, c.to + 1), -a), ...shift(CTA, b - a)];
	const cta = prog(f, segF - 4, 10);
	const nameSize = Math.min(170, 2000 / c.name.length);
	return (
		<AbsoluteFill style={{backgroundColor: C.paper}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				<Paper w={1080} h={1920} />
				{/* nagłówek: od klatki 0 */}
				<g transform="translate(465 70)">
					<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 3, strokeWidth: 7}} seed={600} />
					<Glyph i={c.i} />
				</g>
				<Txt text={`sztuczka ${n} z 5, których używają politycy`} x={540} y={290} size={56} seed={601} />
				<Txt text={c.name} x={540} y={430} size={nameSize} color={C.red} seed={602} />
				<Rough shape={{t: 'rect', x: 8, y: VY - 8, w: 1064, h: VH + 16}} o={{strokeWidth: 7}} seed={603} />
			</svg>
			{/* fragment filmu */}
			<Sequence durationInFrames={segF} layout="none">
				<div style={{position: 'absolute', left: 12, top: VY - 4, width: 1056, height: VH, overflow: 'hidden', opacity: 1 - cta}}>
					<OffthreadVideo
						src={staticFile(`klip${n}_seg.mp4`)}
						style={{width: 1056, height: 594, marginTop: 7}}
						volume={(lf) => interpolate(lf, [0, 4, segF - 8, segF], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
					/>
				</div>
			</Sequence>
			{c.hold > 0 && f < Math.round(c.hold * FPS) && (
				<div style={{position: 'absolute', left: 12, top: VY - 4, width: 1056, height: VH, overflow: 'hidden'}}>
					<Freeze frame={Math.round(c.hold * FPS)}>
						<OffthreadVideo src={staticFile(`klip${n}_seg.mp4`)} muted style={{width: 1056, height: 594, marginTop: 7}} />
					</Freeze>
				</div>
			)}
			{/* zaproszenie do całego filmu */}
			{cta > 0 && (
				<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, opacity: cta}}>
					{[0, 1, 2, 3, 4].map((i) => {
						const t0 = segF + Math.round(CTA[0].words[3].s * FPS) + i * 3;
						const me = i === c.i;
						return (
							<g key={i} transform={`translate(${130 + i * 205} ${VY + 170}) scale(${f >= t0 ? pk(f, t0) : 0}) translate(-75 -75)`}>
								<Rough shape={{t: 'rect', x: 0, y: 0, w: 150, h: 150}} o={{fill: C.yellow, fillStyle: 'hachure', hachureGap: 10, fillWeight: 3, strokeWidth: 7}} seed={610 + i} />
								<Glyph i={i} />
								{me && <Rough shape={{t: 'lpath', pts: [[18, 70], [60, 128], [150, -14]]}} o={{stroke: C.red, strokeWidth: 12}} draw={prog(f, t0 + 6, 8)} seed={620 + i} />}
							</g>
						);
					})}
					<Txt text="cały film" x={540} y={VY + 410} size={150} color={C.red} seed={630} draw={prog(f, segF + Math.round(CTA[1].words[4].s * FPS) - 4, 10)} />
					<g transform={`translate(540 ${VY + 520}) scale(${pk(f, segF + Math.round(CTA[1].words[7].s * FPS))})`}>
						<Rough shape={{t: 'rect', x: -330, y: -52, w: 660, h: 104}} o={{fill: C.ink, fillStyle: 'solid', strokeWidth: 6}} seed={631} />
						<Txt text="▶  na kanale Psychorożek" x={0} y={22} size={64} color={C.paper} seed={632} />
					</g>
				</svg>
			)}
			<Captions lines={lines} top={1185} left={70} width={940} size={88} />
			<Sequence from={segF} layout="none">
				<Audio src={staticFile('cta_vo.wav')} />
				<Audio src={staticFile('sfx_shimmer.wav')} volume={0.25} />
			</Sequence>
		</AbsoluteFill>
	);
};

export const Klip1: React.FC = () => <Klip n={1} />;
export const Klip2: React.FC = () => <Klip n={2} />;
export const Klip3: React.FC = () => <Klip n={3} />;
export const Klip4: React.FC = () => <Klip n={4} />;
export const Klip5: React.FC = () => <Klip n={5} />;
