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
import {AmberHak, HAK_FRAMES} from './long/amber/AmberHak';
import {AmberR1, R1_FRAMES} from './long/amber/AmberR1';
import {GarDisney, GarDisneyS, D_FRAMES, DS_SCENE} from './long/garaze/GarDisney';
import {CTA_FRAMES as G_CTA} from './long/garaze/gkit';
import {GarHP, GarHPS, H_FRAMES as GH_FRAMES, HS_SCENE as GHS_SCENE, GarZ, Z_FRAMES as GZ_FRAMES} from './long/garaze/GarHP';
import {GarApple, GarAppleS, A_FRAMES as GA_FRAMES, AS_SCENE as GAS_SCENE} from './long/garaze/GarApple';
import {GarAmazon, GarAmazonS, M_FRAMES as GM_FRAMES, MS_SCENE as GMS_SCENE} from './long/garaze/GarAmazon';
import {GarGoogle, GarGoogleS, O_FRAMES as GO_FRAMES, OS_SCENE as GOS_SCENE} from './long/garaze/GarGoogle';
import {GarHak, HAK_FRAMES as GHAK_FRAMES, GarFinal, FINAL_FRAMES as GFIN_FRAMES} from './long/garaze/GarEnds';
import {AmberR2, AmberS2, R2_FRAMES, S2_FRAMES} from './long/amber/AmberR2';
import {AmberZ, Z_FRAMES} from './long/amber/AmberZ';
import {AmberR3, AmberS1, R3_FRAMES, S1_FRAMES} from './long/amber/AmberR3';
import {AmberK, K_FRAMES} from './long/amber/AmberK';
import {AmberR4, AmberS3, R4_FRAMES, S3_FRAMES} from './long/amber/AmberR4';
import {AmberL9, L9_FRAMES} from './long/amber/AmberL9';
import {AmberR5, R5_FRAMES} from './long/amber/AmberR5';
import {AmberR6, AmberS4, R6_FRAMES, S4_FRAMES} from './long/amber/AmberR6';
import {AmberE, E_FRAMES} from './long/amber/AmberE';
import {AmberThumbA, AmberThumbB, AmberThumbC} from './long/amber/AmberThumb';
import {GarThumbA, GarThumbB, GarThumbC} from './long/garaze/GarThumb';

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
			<Composition id="AmberHak" component={AmberHak} durationInFrames={HAK_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR1" component={AmberR1} durationInFrames={R1_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR2" component={AmberR2} durationInFrames={R2_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberZ" component={AmberZ} durationInFrames={Z_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR3" component={AmberR3} durationInFrames={R3_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberS1" component={AmberS1} durationInFrames={S1_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="AmberK" component={AmberK} durationInFrames={K_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR4" component={AmberR4} durationInFrames={R4_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberS3" component={AmberS3} durationInFrames={S3_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="AmberL9" component={AmberL9} durationInFrames={L9_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR5" component={AmberR5} durationInFrames={R5_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberR6" component={AmberR6} durationInFrames={R6_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="AmberS4" component={AmberS4} durationInFrames={S4_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="AmberE" component={AmberE} durationInFrames={E_FRAMES} fps={30} width={1920} height={1080} />
			<Still id="GarThumbA" component={GarThumbA} width={1280} height={720} />
			<Still id="GarThumbB" component={GarThumbB} width={1280} height={720} />
			<Still id="GarThumbC" component={GarThumbC} width={1280} height={720} />
			<Still id="AmberThumbA" component={AmberThumbA} width={1280} height={720} />
			<Still id="AmberThumbB" component={AmberThumbB} width={1280} height={720} />
			<Still id="AmberThumbC" component={AmberThumbC} width={1280} height={720} />
			<Composition id="AmberS2" component={AmberS2} durationInFrames={S2_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="GarDisney" component={GarDisney} durationInFrames={D_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarDisneyS" component={GarDisneyS} durationInFrames={DS_SCENE + G_CTA} fps={30} width={1080} height={1920} />
			<Composition id="GarHak" component={GarHak} durationInFrames={GHAK_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarHP" component={GarHP} durationInFrames={GH_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarHPS" component={GarHPS} durationInFrames={GHS_SCENE + G_CTA} fps={30} width={1080} height={1920} />
			<Composition id="GarZ" component={GarZ} durationInFrames={GZ_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarApple" component={GarApple} durationInFrames={GA_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarAppleS" component={GarAppleS} durationInFrames={GAS_SCENE + G_CTA} fps={30} width={1080} height={1920} />
			<Composition id="GarAmazon" component={GarAmazon} durationInFrames={GM_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarAmazonS" component={GarAmazonS} durationInFrames={GMS_SCENE + G_CTA} fps={30} width={1080} height={1920} />
			<Composition id="GarGoogle" component={GarGoogle} durationInFrames={GO_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="GarGoogleS" component={GarGoogleS} durationInFrames={GOS_SCENE + G_CTA} fps={30} width={1080} height={1920} />
			<Composition id="GarFinal" component={GarFinal} durationInFrames={GFIN_FRAMES} fps={30} width={1920} height={1080} />
			<Still id="SzThumbA" component={SzThumbA} width={1280} height={720} />
			<Still id="SzThumbB" component={SzThumbB} width={1280} height={720} />
			<Still id="SzThumbC" component={SzThumbC} width={1280} height={720} />
			<Still id="MilgramThumb" component={MilgramThumb} width={1080} height={1920} />
			<Still id="FlatKitTest" component={FlatKitTest} width={1080} height={1920} />
		</>
	);
};
