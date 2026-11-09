// Short #3 Szczęście Pieniędzy Nie Daje: Blockbuster odrzucił Netflixa (1080×1920).
// Styl TED-Ed w płaskiej, stonowanej palecie i z dorosłymi postaciami: jeden świat z pięciu „pokoi”,
// kamera przejeżdża między nimi, obiekty przemieniają się (sklep → siatka 9000 sklepów, koperta → ekran).
// Każdy ruch startuje na słowie lektora (vo.gen.ts). Pętla: koniec wraca do sali spotkań w stanie z klatki 0.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/baloo-2/800.css';
import {P, FFONT, G, Adult, ADULTS, Calendar, Tag, Stamp, FText, FlatBurst, Coin, clamp01, prog, pop, arc} from '../../kit-flat/flat';
import {Camera, type Hit} from '../../kit/dynamics';
import {Captions} from '../../kit/captions';
import {LINES} from './vo.gen';

export const W = 1080;
export const H = 1920;
export const FPS = 30;
const STAGE = 1340;
const RW = 1080;
const FLOOR = 1180;

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
const TAIL_F = Math.round((LINES[10].e + 0.3) * FPS);
export const TOTAL_FRAMES = TAIL_F + 26;

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
const pk = (f: number, a: number) => Math.min(1.06, pop(f, a));
const live = (f: number, a: number, b: number, fade = 8) => prog(f, a, fade) * (1 - prog(f, b, fade));
const pulse = (f: number, a: number, dur = 10) => Math.sin(Math.PI * clamp01((f - a) / dur));
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const swing = (f: number, a: number, amp = 9) => Math.sin((f - a) / 6) * amp * Math.exp(-Math.max(0, f - a) / 30);

// --- rekwizyty -------------------------------------------------------------------
// Koperta z płytą (nazwa jako zwykły napis, bez logo).
const Envelope: React.FC<{w?: number; disc?: number}> = ({w = 260, disc = 0}) => {
	const h = w * 0.62;
	return (
		<g>
			{disc > 0 && (
				<g transform={`translate(0 ${-h * 0.45 * disc})`}>
					<circle cx={0} cy={0} r={h * 0.42} fill="#D9D4CA" stroke={P.navy} strokeWidth={6} />
					<circle cx={0} cy={0} r={h * 0.1} fill={P.bg} stroke={P.navy} strokeWidth={5} />
				</g>
			)}
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#A8443A" stroke={P.navy} strokeWidth={7} />
			<path d={`M ${-w / 2} ${-h / 2} L 0 ${h * 0.08} L ${w / 2} ${-h / 2}`} fill="none" stroke={P.navy} strokeWidth={6} strokeLinejoin="round" />
			<text x={0} y={h * 0.36} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={w * 0.14} fill={P.white}>
				NETFLIX
			</text>
		</g>
	);
};

// Wypożyczalnia; dark 0–1 = zgaszone światła, tilt = przekrzywiony szyld.
const Store: React.FC<{dark?: number; tilt?: number}> = ({dark = 0, tilt = 0}) => (
	<g>
		<rect x={-400} y={-560} width={800} height={560} fill={P.blue} stroke={P.navy} strokeWidth={8} />
		{/* witryny z kasetami */}
		{[-1, 1].map((side) => (
			<g key={side} transform={`translate(${side * 230} -300)`}>
				<rect x={-130} y={-120} width={260} height={230} fill="#DCE3E0" stroke={P.navy} strokeWidth={6} />
				{Array.from({length: 3}).map((_, r) =>
					Array.from({length: 6}).map((__, c) => <rect key={`${r}-${c}`} x={-110 + c * 37} y={-100 + r * 72} width={28} height={58} rx={4} fill={['#B5503A', '#C9A043', '#4F7A6A', '#5C6B7A'][(r + c) % 4]} />),
				)}
			</g>
		))}
		<rect x={-70} y={-230} width={140} height={230} fill="#2E3B4E" stroke={P.navy} strokeWidth={6} />
		<circle cx={45} cy={-115} r={9} fill={P.goldLight} />
		<rect x={-400} y={-560} width={800} height={560} fill="#0E1520" opacity={0.55 * dark} />
		{/* szyld */}
		<g transform={`rotate(${tilt} -330 -600)`}>
			<rect x={-360} y={-680} width={720} height={130} rx={18} fill={P.gold} stroke={P.navy} strokeWidth={8} />
			<text x={0} y={-592} textAnchor="middle" fontFamily={FFONT} fontWeight={800} fontSize={86} fill={P.navy}>
				BLOCKBUSTER
			</text>
		</g>
	</g>
);

const MiniStore: React.FC = () => (
	<g>
		<rect x={-36} y={-30} width={72} height={46} fill={P.blue} stroke={P.navy} strokeWidth={4} />
		<rect x={-40} y={-44} width={80} height={16} rx={4} fill={P.gold} stroke={P.navy} strokeWidth={4} />
		<rect x={-8} y={-4} width={16} height={20} fill="#2E3B4E" />
	</g>
);

const Register: React.FC = () => (
	<g>
		<rect x={-140} y={-110} width={280} height={150} rx={14} fill={P.slate} stroke={P.navy} strokeWidth={7} />
		<rect x={-110} y={-90} width={140} height={60} rx={6} fill={P.greenLight} stroke={P.navy} strokeWidth={5} />
		{Array.from({length: 6}).map((_, i) => (
			<circle key={i} cx={60 + (i % 2) * 34} cy={-80 + Math.floor(i / 2) * 32} r={11} fill={P.grey} />
		))}
		<rect x={-160} y={40} width={320} height={70} rx={10} fill={P.grey} stroke={P.navy} strokeWidth={7} />
	</g>
);

const Screen: React.FC<{w: number; h: number; play: number}> = ({w, h, play}) => (
	<g>
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#1A1F29" stroke={P.navy} strokeWidth={8} />
		<rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h - 36} rx={8} fill="#2E3B4E" />
		{play > 0 && (
			<g transform={`scale(${play})`}>
				<circle cx={0} cy={0} r={Math.min(w, h) * 0.2} fill="#A8443A" />
				<path d={`M ${-Math.min(w, h) * 0.06} ${-Math.min(w, h) * 0.1} L ${Math.min(w, h) * 0.11} 0 L ${-Math.min(w, h) * 0.06} ${Math.min(w, h) * 0.1} Z`} fill={P.white} />
			</g>
		)}
	</g>
);

// --- świat ------------------------------------------------------------------------
const World: React.FC = () => {
	const f = useCurrentFrame();

	const tSprz = T(0, 'sprzedać');
	const t50 = T(0, '50');
	const tOdm = T(1, 'odmówił');
	const t2 = T(2);
	const tPot = T(2, 'potęgą');
	const t9k = T(2, '9');
	const t6 = T(2, '6');
	const t3 = T(3);
	const tPlyty = T(3, 'płyty');
	const tPoczt = T(3, 'pocztą');
	const tStr = T(3, 'straty');
	const tDyr = T(4, 'dyrektora');
	const tSzef = T(4, 'szefowie');
	const tWys = T(4, 'wyśmiali');
	const t5 = T(5);
	const tZar = T(5, 'zarabiał');
	const tNien = T(5, 'nienawidzili');
	const tKar = T(5, 'karach');
	const tZwr = T(5, 'zwrot');
	const t6l = T(6);
	const t800 = T(6, '800');
	const t7 = T(7);
	const tRek = T(7, 'reklamę');
	const tInt = T(7, 'internetu');
	const t8 = T(8);
	const tBank = T(8, 'zbankrutował');
	const t9 = T(9);
	const t250 = T(9, '250');
	const tZlo = T(10, 'złości');
	const tPrz = T(10, 'przegrywa');
	const tUsu = T(10, 'usunie');

	// koperta na stole: przesuwana na „sprzedać”, wraca na „odmówił”
	const envX = kf(f, [
		[tSprz - 2, 470],
		[tSprz + 10, 600],
		[tOdm, 600],
		[tOdm + 8, 470],
	]);
	const laughing = f >= tWys && f < tWys + 50;

	// pokój 1: sklep → siatka 9000 → powrót sklepu przy bankructwie
	const toGrid = prog(f, t9k - 4, 14) * (1 - prog(f, t3 - 2, 1));
	const grid = Array.from({length: 48});

	// pokój 2: koperta → ekran
	const morph = prog(f, tInt - 4, 14);

	// pokój 3: złość klienta
	const angry = (f >= tNien && f < t6l + 20) || (f >= tZlo && f < tUsu);
	const calm = f >= tUsu;

	return (
		<g>
			{/* ============ TŁA ============ */}
			<rect x={-RW} y={0} width={RW * 2} height={STAGE} fill={P.paper} />
			<rect x={-RW} y={FLOOR} width={RW * 2} height={STAGE - FLOOR} fill={P.grey} />
			<rect x={RW} y={0} width={RW} height={STAGE} fill={P.sky} />
			<rect x={RW} y={FLOOR} width={RW} height={STAGE - FLOOR} fill="#A9A397" />
			<rect x={RW * 2} y={0} width={RW} height={STAGE} fill="#E7DED0" />
			<rect x={RW * 2} y={FLOOR} width={RW} height={STAGE - FLOOR} fill={P.grey} />
			<rect x={RW * 3} y={0} width={RW} height={STAGE} fill={P.goldLight} />
			<rect x={RW * 3} y={FLOOR} width={RW} height={STAGE - FLOOR} fill="#BBAE8F" />
			<rect x={RW * 4} y={0} width={RW * 2} height={STAGE} fill={P.bg} />

			{/* ============ POKÓJ 0: SALA SPOTKAŃ (haczyk, śmiech, pętla) ============ */}
			<g>
				<rect x={360} y={150} width={360} height={230} rx={8} fill={P.sky} stroke={P.navy} strokeWidth={7} />
				<line x1={540} y1={150} x2={540} y2={380} stroke={P.navy} strokeWidth={6} />
				<G x={220} y={250} r={-5}>
					<Calendar top="ROK" big="2000" w={200} />
				</G>
				<FText text="relacja ówczesnego dyrektora finansowego Netflixa" x={540} y={455} size={36} fill={P.slate} opacity={live(f, tDyr - 2, tWys + 40)} />
				{/* drugi szef wchodzi przy „szefowie” */}
				<g opacity={live(f, tSzef - 4, t5 - 6)}>
					<G x={kf(f, [[tSzef - 4, 1000], [tSzef + 10, 680]])} y={FLOOR} s={0.86}>
						<Adult look={ADULTS.szef2} laugh={laughing} armL={laughing ? 30 : 8} armR={laughing ? 30 : 8} seed={7} />
					</G>
				</g>
				<G x={850} y={FLOOR} s={0.9}>
					<Adult look={ADULTS.szef} armL={f >= tOdm - 2 && f < t2 ? 95 : laughing ? 30 : 10} armR={laughing ? 30 : 10} mood={f >= tOdm - 2 && f < t2 ? 'angry' : 'neutral'} laugh={laughing} talk={f >= tOdm - 2 && f < tOdm + 12} seed={3} />
				</G>
				{/* stół */}
				<rect x={340} y={960} width={440} height={34} rx={8} fill="#8C6A4A" stroke={P.navy} strokeWidth={7} />
				<rect x={370} y={994} width={26} height={FLOOR - 994} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
				<rect x={724} y={994} width={26} height={FLOOR - 994} fill="#6E5139" stroke={P.navy} strokeWidth={6} />
				{/* założyciele Netflixa */}
				<G x={190} y={FLOOR} s={0.86}>
					<Adult look={ADULTS.zalozyciel} armR={f >= tSprz - 2 && f < tOdm ? 70 : 12} mood={f >= tWys && f < T(5) ? 'sad' : 'neutral'} talk={f < tSprz + 6 && f > 6} seed={1} />
				</G>
				<G x={330} y={FLOOR} s={0.86}>
					<Adult look={ADULTS.zalozyciel2} armR={f >= tSprz - 2 && f < tOdm ? 85 : 12} mood={f >= tWys && f < T(5) ? 'sad' : f >= t50 && f < tOdm ? 'smile' : 'neutral'} seed={2} />
				</G>
				<G x={envX} y={905} s={1}>
					<Envelope w={220} />
				</G>
				<G x={envX} y={790} s={1 + 0.12 * pulse(f, t50, 10)}>
					<Tag text="50 mln $" w={250} color={P.gold} swing={swing(f, t50)} />
				</G>
				{/* ODMOWA */}
				{f >= tOdm && f < t2 + 4 && (
					<G x={560} y={880} s={interpolate(f, [tOdm, tOdm + 6], [2.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} r={-8} o={clamp01((f - tOdm) / 3)}>
						<Stamp lines={['ODMOWA']} w={420} />
					</G>
				)}
				{/* HA HA */}
				{laughing &&
					[
						[620, 610, 0],
						[880, 600, 5],
						[750, 530, 10],
					].map(([x, y, d], i) =>
						f >= tWys + d ? (
							<G key={i} x={x} y={y + Math.sin((f - tWys) / 3 + i) * 8} s={pk(f, tWys + d)} r={(i - 1) * 8}>
								<FText text="HA HA" x={0} y={0} size={70} fill={P.red} stroke={P.bg} />
							</G>
						) : null,
					)}
				<FlatBurst x={envX} y={800} at={t50} r={150} />
				<FlatBurst x={560} y={880} at={tOdm + 4} r={190} color={P.red} />
				<FlatBurst x={820} y={520} at={tWys} r={170} color={P.red} />
			</g>

			{/* ============ POKÓJ 1: IMPERIUM BLOCKBUSTERA ============ */}
			<g transform={`translate(${RW} 0)`}>
				<G x={540} y={FLOOR} s={(f < t9k ? 0.92 + 0.08 * pk(f, tPot) : 1) * (1 - 0.85 * toGrid)} o={1 - toGrid}>
					<Store dark={prog(f, tBank - 6, 10)} tilt={kf(f, [[tBank - 4, 0], [tBank + 6, 14]])} />
				</G>
				{/* siatka 9 000 sklepów */}
				{toGrid > 0 && (
					<g>
						{grid.map((_, i) => {
							const c = i % 8;
							const r = Math.floor(i / 8);
							return (
								<G key={i} x={150 + c * 112} y={420 + r * 110} s={pk(f, t9k - 2 + i * 0.5) * 1.15}>
									<MiniStore />
								</G>
							);
						})}
						<FText text={fmt(interpolate(f, [t9k, t9k + 22], [0, 9000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))} x={540} y={250} size={170} fill={P.navy} stroke={P.bg} sw={14} />
						<FText text="wypożyczalni" x={540} y={330} size={58} fill={P.navy} opacity={prog(f, t9k + 6, 8)} />
					</g>
				)}
				{/* 6 mld $ rocznie */}
				{f >= t6 - 2 && f < t3 && (
					<G x={540} y={1110} s={pk(f, t6 - 2)}>
						<rect x={-330} y={-80} width={660} height={150} rx={24} fill={P.gold} stroke={P.navy} strokeWidth={8} />
						<FText text="6 mld $ / rok" x={0} y={30} size={96} fill={P.navy} />
					</G>
				)}
				<FlatBurst x={540} y={1100} at={t6} r={220} />
				{/* 2010: bankructwo */}
				<G x={540} y={230} s={pk(f, t8)} o={f >= t8 ? 1 : 0} r={-4}>
					<Calendar top="ROK" big="2010" w={210} />
				</G>
				{f >= tBank && (
					<G x={540} y={880} s={interpolate(f, [tBank, tBank + 6], [2.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} r={-10} o={clamp01((f - tBank) / 3)}>
						<Stamp lines={['BANKRUCTWO']} w={640} />
					</G>
				)}
				<FlatBurst x={540} y={880} at={tBank + 4} r={230} color={P.red} />
			</g>

			{/* ============ POKÓJ 2: NETFLIX — POCZTA, STRATY, INTERNET ============ */}
			<g transform={`translate(${RW * 2} 0)`}>
				{/* skrzynka pocztowa */}
				<g opacity={1 - prog(f, t7 - 6, 8)}>
					<rect x={760} y={760} width={30} height={FLOOR - 760} fill={P.slate} stroke={P.navy} strokeWidth={6} />
					<path d="M 660 600 L 660 780 L 890 780 L 890 600 Q 890 520 775 520 Q 660 520 660 600 Z" fill={P.blue} stroke={P.navy} strokeWidth={8} />
					<rect x={700} y={620} width={150} height={20} rx={8} fill={P.navy} />
					{(() => {
						const p = clamp01((f - tPoczt + 4) / 18);
						if (f < tPlyty - 4 || p >= 1) return null;
						const q = arc(p, 250, 820, 775, 630, -260);
						return (
							<G x={f < tPoczt - 4 ? 250 : q.x} y={f < tPoczt - 4 ? 820 : q.y} s={1 - 0.5 * p} r={p * 30}>
								<Envelope w={240} disc={clamp01((f - tPlyty) / 8) * (1 - p)} />
							</G>
						);
					})()}
					{/* straty */}
					<g opacity={prog(f, tStr - 6, 6)}>
						<polyline
							points={[0, 1, 2, 3, 4]
								.map((i) => `${180 + i * 130},${300 + i * 80 + (i % 2) * 40}`)
								.slice(0, Math.max(2, Math.ceil(prog(f, tStr - 6, 14) * 5)))
								.join(' ')}
							fill="none"
							stroke={P.red}
							strokeWidth={14}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<FText text="straty" x={420} y={250} size={100} fill={P.red} stroke={P.bg} />
					</g>
				</g>
				<FlatBurst x={775} y={630} at={tPoczt + 14} r={140} color={P.navy} />
				{/* „bez kar” i przejście do internetu */}
				{f >= t7 - 4 && (
					<g>
						<G x={540} y={kf(f, [[t7 - 4, 640], [tInt - 4, 640], [tInt + 10, 620]])} s={1}>
							{morph < 1 && (
								<g opacity={1 - morph} transform={`scale(${1 + morph * 1.2})`}>
									<Envelope w={360} />
								</g>
							)}
							{morph > 0 && (
								<g opacity={morph}>
									<Screen w={360 + morph * 400} h={220 + morph * 230} play={pk(f, tInt + 4)} />
								</g>
							)}
						</G>
						{f >= tRek - 2 && f < tInt + 2 && (
							<G x={540} y={980} s={interpolate(f, [tRek - 2, tRek + 4], [2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} r={-6}>
								<Stamp lines={['BEZ KAR', 'ZA SPÓŹNIENIE']} w={520} color={P.green} />
							</G>
						)}
						<FText text="internet" x={540} y={1000} size={90} fill={P.navy} stroke={P.bg} opacity={prog(f, tInt + 6, 8)} />
					</g>
				)}
				<FlatBurst x={540} y={980} at={tRek + 2} r={200} color={P.green} />
				<FlatBurst x={540} y={620} at={tInt + 8} r={300} color={P.navy} />
			</g>

			{/* ============ POKÓJ 3: KARY ZA SPÓŹNIENIE ============ */}
			<g transform={`translate(${RW * 3} 0)`}>
				<rect x={560} y={900} width={460} height={FLOOR - 900} fill="#8C6A4A" stroke={P.navy} strokeWidth={7} />
				<G x={790} y={800} s={pk(f, tZar - 2)}>
					<Register />
				</G>
				<FText text="ZWROT" x={330} y={420} size={60} fill={P.navy} opacity={prog(f, t5, 8)} />
				<rect x={230} y={450} width={200} height={40} rx={10} fill={P.navy} opacity={prog(f, t5, 8)} />
				<G x={260} y={FLOOR} s={0.9}>
					<Adult look={ADULTS.klient} mood={calm ? 'smile' : angry ? 'angry' : 'neutral'} armR={f >= tZwr - 4 && f < t6l + 10 ? 100 : 12} seed={4} />
				</G>
				{/* para ze złości */}
				{angry &&
					[0, 1, 2].map((i) => {
						const k = (f + i * 8) % 24;
						return <circle key={i} cx={210 + i * 50} cy={720 - k * 5} r={18 + k} fill={P.red} opacity={(1 - k / 24) * 0.6} />;
					})}
				<G x={360} y={560} s={pk(f, tKar - 2)} o={live(f, tKar - 2, t7 - 10)}>
					<Tag text="KARA" w={200} color={P.red} swing={swing(f, tKar)} />
				</G>
				{/* 800 mln $ */}
				<G x={190} y={230} s={pk(f, t6l)} o={live(f, t6l, t7 - 10)} r={-5}>
					<Calendar top="ROK" big="2000" w={190} />
				</G>
				{f >= t800 - 4 &&
					f < t7 &&
					[0, 1, 2, 3, 4, 5].map((i) => {
						const p = clamp01((f - t800 + 4 - i * 3) / 14);
						const q = arc(p, 360, 700, 790, 760, -180);
						return p > 0 && p < 1 ? (
							<G key={i} x={q.x} y={q.y} s={0.9}>
								<Coin r={30} />
							</G>
						) : null;
					})}
				<G x={640} y={340} s={pk(f, t800)} o={live(f, t800, t7 - 10)}>
					<FText text={`${fmt(interpolate(f, [t800, t800 + 18], [0, 800], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))} mln $`} x={0} y={0} size={130} fill={P.red} stroke={P.bg} sw={14} />
					<FText text="z samych kar" x={0} y={80} size={56} fill={P.navy} />
				</G>
				{/* morał: ktoś usuwa złość */}
				{f >= tPrz - 4 && (
					<G x={kf(f, [[tPrz - 4, 1300], [tUsu - 2, 700]])} y={500} s={0.95}>
						<Screen w={420} h={270} play={1} />
					</G>
				)}
				<FlatBurst x={790} y={760} at={tZar} r={150} />
				<FlatBurst x={640} y={330} at={t800} r={220} color={P.red} />
				<FlatBurst x={260} y={760} at={tUsu} r={200} color={P.green} />
			</g>

			{/* ============ POKÓJ 4: 50 mln $ → 250 mld $ ============ */}
			<g transform={`translate(${RW * 4} 0)`}>
				<line x1={120} y1={1100} x2={960} y2={1100} stroke={P.navy} strokeWidth={8} />
				{/* 2000 */}
				<rect x={220} y={1094} width={160} height={6} fill={P.gold} stroke={P.navy} strokeWidth={4} />
				<FText text="50 mln $" x={300} y={1040} size={58} fill={P.navy} opacity={prog(f, t9 - 2, 8)} />
				<FText text="2000" x={300} y={1170} size={52} fill={P.slate} opacity={prog(f, t9 - 2, 8)} />
				{/* dziś */}
				{(() => {
					const hgt = kf(f, [
						[t9 + 4, 0],
						[t250 + 6, 760],
					]);
					return (
						<g>
							<rect x={600} y={1100 - hgt} width={220} height={hgt} rx={10} fill="#A8443A" stroke={P.navy} strokeWidth={8} />
							<FText text={`${fmt(interpolate(f, [t9 + 4, t250 + 6], [0, 250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))} mld $`} x={710} y={1060 - hgt} size={92} fill={P.navy} stroke={P.bg} sw={12} />
							<FText text="dziś" x={710} y={1170} size={52} fill={P.slate} opacity={prog(f, t9, 8)} />
						</g>
					);
				})()}
				<G x={330} y={560} s={pk(f, t250 + 8)} r={-6}>
					<FText text="×5 000" x={0} y={0} size={140} fill={P.red} stroke={P.bg} sw={14} />
				</G>
				<FlatBurst x={710} y={300} at={t250 + 6} r={200} color={P.red} />
			</g>

		</g>
	);
};

// Kamera świata: przejazdy między pokojami (lekkie oddalenie w połowie drogi).
const CamWorld: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t2 = T(2);
	const t3 = T(3);
	const t4 = T(4);
	const t5 = T(5);
	const t7 = T(7);
	const t8 = T(8);
	const t9 = T(9);
	const t10 = T(10);
	const room = (i: number) => 540 + RW * i + (i === 0 ? 20 : 0);
	const mv = (a: number, from: number, to: number, len = 18): [number, number][] => [
		[a - 8, room(from)],
		[a - 8 + len, room(to)],
	];
	const cx = kf(f, [[0, room(0)], ...mv(t2, 0, 1), ...mv(t3, 1, 2), ...mv(t4, 2, 0, 22), ...mv(t5, 0, 3, 24), ...mv(t7, 3, 2), ...mv(t8, 2, 1), ...mv(t9, 1, 4, 24), ...mv(t10, 4, 3), ...mv(TAIL_F + 8, 3, 0, 18)]);
	const dip = (a: number, d = 0.12, len = 18): [number, number][] => [
		[a - 8, 1],
		[a - 8 + len / 2, 1 - d],
		[a - 8 + len, 1],
	];
	const z = kf(f, [[0, 1], ...dip(t2), ...dip(t3), ...dip(t4, 0.2, 22), ...dip(t5, 0.25, 24), ...dip(t7), ...dip(t8), ...dip(t9, 0.25, 24), ...dip(t10), ...dip(TAIL_F + 8, 0.25, 18)]);
	// kadr powiększony o 15% i obniżony: postacie większe, mniej pustej ściany
	const zz = z * 1.15;
	return <g transform={`translate(${540 - cx * zz} ${700 - 670 * zz}) scale(${zz})`}>{children}</g>;
};

const HITS: Hit[] = [
	{t: cue(0, '50'), kind: 'punch', amp: 0.8},
	{t: cue(1, 'odmówił') + 0.13, kind: 'both', amp: 1.2},
	{t: cue(2, 'potęgą'), kind: 'punch', amp: 0.6},
	{t: cue(2, '9'), kind: 'punch', amp: 0.8},
	{t: cue(2, '6'), kind: 'both', amp: 0.9},
	{t: cue(3, 'straty'), kind: 'shake', amp: 0.7},
	{t: cue(4, 'wyśmiali'), kind: 'both', amp: 1.0},
	{t: cue(5, 'nienawidzili'), kind: 'shake', amp: 0.7},
	{t: cue(5, 'karach'), kind: 'punch', amp: 0.8},
	{t: cue(6, '800'), kind: 'both', amp: 1.0},
	{t: cue(7, 'reklamę'), kind: 'punch', amp: 0.8},
	{t: cue(7, 'internetu'), kind: 'punch', amp: 0.7},
	{t: cue(8, 'zbankrutował') + 0.13, kind: 'both', amp: 1.2},
	{t: cue(9, '250') + 0.2, kind: 'both', amp: 1.1},
	{t: cue(10, 'usunie'), kind: 'punch', amp: 0.9},
];

export const BbShort: React.FC = () => {
	const [handle] = useState(() => delayRender('Ładowanie fontu Baloo 2'));
	useEffect(() => {
		document.fonts.load("800 80px 'Baloo 2'", 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ0123$×').then(() => continueRender(handle));
	}, [handle]);
	return (
		<AbsoluteFill style={{backgroundColor: P.bg}}>
			<Camera shots={[{from: 0, to: 999, ox: 540, oy: 700, zoom: 1}]} hits={HITS}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
					<defs>
						<clipPath id="bbstage">
							<rect x={-200} y={-200} width={W + 400} height={STAGE + 200} />
						</clipPath>
					</defs>
					<g clipPath="url(#bbstage)">
						<CamWorld>
							<World />
						</CamWorld>
					</g>
				</svg>
			</Camera>
			<div style={{position: 'absolute', left: 0, top: STAGE, width: W, height: H - STAGE, background: P.bg}} />
			<Captions lines={LINES} top={1395} left={60} width={860} size={80} font={FFONT} weight={800} color={P.navy} keyColor={P.red} markColor={P.goldLight} />
			<Audio src={staticFile('bb_vo.wav')} />
		</AbsoluteFill>
	);
};
