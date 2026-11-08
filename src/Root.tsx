import {Composition, Still} from 'remotion';
import {MilgramThumb} from './thumbs/MilgramThumb';
import {MilgramShort, TOTAL_FRAMES} from './shorts/milgram/MilgramShort';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="MilgramShort" component={MilgramShort} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
			<Still id="MilgramThumb" component={MilgramThumb} width={1080} height={1920} />
		</>
	);
};
