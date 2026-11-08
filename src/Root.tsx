import {Composition, Still} from 'remotion';
import {MilgramThumb} from './thumbs/MilgramThumb';
import {FlatKitTest} from './test/FlatKitTest';
import {AmberShort, TOTAL_FRAMES as AMBER_FRAMES} from './shorts/amber/AmberShort';
import {MilgramShort, TOTAL_FRAMES} from './shorts/milgram/MilgramShort';
import {PlanShort, TOTAL_FRAMES as PLAN_FRAMES} from './shorts/plan/PlanShort';
import {NokiaShort, TOTAL_FRAMES as NOKIA_FRAMES} from './shorts/nokia/NokiaShort';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="MilgramShort" component={MilgramShort} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="AmberShort" component={AmberShort} durationInFrames={AMBER_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="PlanShort" component={PlanShort} durationInFrames={PLAN_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="NokiaShort" component={NokiaShort} durationInFrames={NOKIA_FRAMES} fps={30} width={1080} height={1920} />
			<Still id="MilgramThumb" component={MilgramThumb} width={1080} height={1920} />
			<Still id="FlatKitTest" component={FlatKitTest} width={1080} height={1920} />
		</>
	);
};
