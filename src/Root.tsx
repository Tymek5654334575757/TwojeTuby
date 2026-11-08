import {Composition} from 'remotion';
import {MilgramShort, TOTAL_FRAMES} from './shorts/milgram/MilgramShort';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="MilgramShort" component={MilgramShort} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
		</>
	);
};
