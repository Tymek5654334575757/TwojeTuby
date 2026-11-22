import React from 'react';
import {Composition, Still} from 'remotion';
import {ManipThumbA, ManipThumbB, ManipThumbC} from './ManipThumb';
import {CARD, CTA_FRAMES} from './mkit';
import {ManipS1, ManipS1S, S1_FRAMES, S1S_SCENE} from './ManipS1';
import {ManipS2, ManipS2S, S2_FRAMES, S2S_SCENE} from './ManipS2';
import {ManipS3, ManipS3S, S3_FRAMES, S3S_SCENE} from './ManipS3';
import {ManipS4, ManipS4S, S4_FRAMES, S4S_SCENE} from './ManipS4';
import {ManipS5, ManipS5S, S5_FRAMES, S5S_SCENE} from './ManipS5';
import {ManipHak, HAK_FRAMES, ManipZ, Z_FRAMES, ManipFinal, FINAL_FRAMES} from './ManipEnds';

const H = {width: 1920, height: 1080, fps: 30};
const V = {width: 1080, height: 1920, fps: 30};

export const ManipRoot: React.FC = () => (
	<>
		<Still id="ManipThumbA" component={ManipThumbA} width={1280} height={720} />
		<Still id="ManipThumbB" component={ManipThumbB} width={1280} height={720} />
		<Still id="ManipThumbC" component={ManipThumbC} width={1280} height={720} />
		<Composition id="ManipHak" component={ManipHak} durationInFrames={HAK_FRAMES} {...H} />
		<Composition id="ManipZ" component={ManipZ} durationInFrames={Z_FRAMES} {...H} />
		<Composition id="ManipFinal" component={ManipFinal} durationInFrames={FINAL_FRAMES} {...H} />
		<Composition id="ManipS1" component={ManipS1} durationInFrames={CARD + S1_FRAMES} {...H} />
		<Composition id="ManipS1S" component={ManipS1S} durationInFrames={S1S_SCENE + CTA_FRAMES} {...V} />
		<Composition id="ManipS2" component={ManipS2} durationInFrames={CARD + S2_FRAMES} {...H} />
		<Composition id="ManipS2S" component={ManipS2S} durationInFrames={S2S_SCENE + CTA_FRAMES} {...V} />
		<Composition id="ManipS3" component={ManipS3} durationInFrames={CARD + S3_FRAMES} {...H} />
		<Composition id="ManipS3S" component={ManipS3S} durationInFrames={S3S_SCENE + CTA_FRAMES} {...V} />
		<Composition id="ManipS4" component={ManipS4} durationInFrames={CARD + S4_FRAMES} {...H} />
		<Composition id="ManipS4S" component={ManipS4S} durationInFrames={S4S_SCENE + CTA_FRAMES} {...V} />
		<Composition id="ManipS5" component={ManipS5} durationInFrames={CARD + S5_FRAMES} {...H} />
		<Composition id="ManipS5S" component={ManipS5S} durationInFrames={S5S_SCENE + CTA_FRAMES} {...V} />
	</>
);
