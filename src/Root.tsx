import {Composition, Still} from 'remotion';
import {Sala1, SALA1_FRAMES} from './long/sztuczki/Sala1';
import {SzThumbA, SzThumbB, SzThumbC} from './long/sztuczki/Thumb';
import {Klip1, Klip2, Klip3, Klip4, Klip5, klipFrames} from './long/sztuczki/Klip';
import {Sala2, SALA2_FRAMES} from './long/sztuczki/Sala2';
import {Sala3, SALA3_FRAMES} from './long/sztuczki/Sala3';
import {Sala4, SALA4_FRAMES} from './long/sztuczki/Sala4';
import {Sala5, SALA5_FRAMES} from './long/sztuczki/Sala5';
import {MilgramThumb} from './thumbs/MilgramThumb';
import {FlatKitTest} from './test/FlatKitTest';
import {AmberShort, TOTAL_FRAMES as AMBER_FRAMES} from './shorts/amber/AmberShort';
import {MilgramShort, TOTAL_FRAMES} from './shorts/milgram/MilgramShort';
import {PlanShort, TOTAL_FRAMES as PLAN_FRAMES} from './shorts/plan/PlanShort';
import {NokiaShort, TOTAL_FRAMES as NOKIA_FRAMES} from './shorts/nokia/NokiaShort';
import {DkShort, TOTAL_FRAMES as DK_FRAMES} from './shorts/dk/DkShort';
import {BbShort, TOTAL_FRAMES as BB_FRAMES} from './shorts/bb/BbShort';
import {BelfortShort, TOTAL_FRAMES as BELFORT_FRAMES} from './shorts/belfort/BelfortShort';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="MilgramShort" component={MilgramShort} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="AmberShort" component={AmberShort} durationInFrames={AMBER_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="PlanShort" component={PlanShort} durationInFrames={PLAN_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="NokiaShort" component={NokiaShort} durationInFrames={NOKIA_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="DkShort" component={DkShort} durationInFrames={DK_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="Klip1" component={Klip1} durationInFrames={klipFrames(1)} fps={30} width={1080} height={1920} />
			
<Composition id="Klip2" component={Klip2} durationInFrames={klipFrames(2)} fps={30} width={1080} height={1920} />
			
<Composition id="Klip3" component={Klip3} durationInFrames={klipFrames(3)} fps={30} width={1080} height={1920} />
			
<Composition id="Klip4" component={Klip4} durationInFrames={klipFrames(4)} fps={30} width={1080} height={1920} />
			
<Composition id="Klip5" component={Klip5} durationInFrames={klipFrames(5)} fps={30} width={1080} height={1920} />
			<Composition id="Sala1" component={Sala1} durationInFrames={SALA1_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="Sala2" component={Sala2} durationInFrames={SALA2_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="Sala3" component={Sala3} durationInFrames={SALA3_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="Sala4" component={Sala4} durationInFrames={SALA4_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="Sala5" component={Sala5} durationInFrames={SALA5_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="BbShort" component={BbShort} durationInFrames={BB_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="BelfortShort" component={BelfortShort} durationInFrames={BELFORT_FRAMES} fps={30} width={1080} height={1920} />
			<Still id="SzThumbA" component={SzThumbA} width={1280} height={720} />
			<Still id="SzThumbB" component={SzThumbB} width={1280} height={720} />
			<Still id="SzThumbC" component={SzThumbC} width={1280} height={720} />
			<Still id="MilgramThumb" component={MilgramThumb} width={1080} height={1920} />
			<Still id="FlatKitTest" component={FlatKitTest} width={1080} height={1920} />
		</>
	);
};
