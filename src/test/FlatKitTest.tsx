import React, {useEffect, useState} from 'react';
import {AbsoluteFill, delayRender, continueRender} from 'remotion';
import '@fontsource/baloo-2/800.css';
import {P, G, Kid, LOOKS, Banknote, Coin, GoldBar, Bank, Plane, Cloud, Calendar, Tag, Stamp, Star, FText} from '../kit-flat/flat';
export const FlatKitTest: React.FC = () => {
	const [h] = useState(() => delayRender());
	useEffect(() => { document.fonts.load("800 60px 'Baloo 2'", 'ąęłńśźż').then(() => continueRender(h)); }, [h]);
	return (
		<AbsoluteFill style={{background: P.bg}}>
			<svg width={1080} height={1920}>
				<rect x={0} y={0} width={1080} height={1100} fill={P.sky} />
				<rect x={0} y={1100} width={1080} height={230} fill={P.grass} />
				<G x={300} y={1180}><Kid look={LOOKS.ty} armR={70} holdR={<Banknote w={120} />} /></G>
				<G x={740} y={1180}><Kid look={LOOKS.kolega} armL={150} talk holdL={<G y={10}><GoldBar w={160} label="ZŁOTO" /></G>} /></G>
				<G x={540} y={300}><Calendar top="ZA ROK" big="116 zł" w={260} /></G>
				<G x={180} y={560} s={0.8}><Bank /></G>
				<G x={760} y={560} s={0.9}><Plane /></G>
				<G x={900} y={180}><Cloud /></G>
				<G x={160} y={120}><Banknote face="sad" w={170} /></G>
				<G x={480} y={620}><Coin /></G>
				<G x={540} y={760}><Tag text="≈ 300 mln zł" w={330} /></G>
				<G x={540} y={1500}><Stamp lines={['PIRAMIDA FINANSOWA', 'wyrok sądu']} /></G>
				<G x={540} y={1720}><GoldBar w={300} label="AMBER GOLD" /></G>
				<G x={850} y={1620}><Star r={30} color={P.gold} /></G>
				<FText text="Zażółć gęślą jaźń 851 mln zł" x={540} y={1860} size={60} fill={P.red} stroke={P.white} />
			</svg>
		</AbsoluteFill>
	);
};
