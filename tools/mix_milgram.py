import json,re,subprocess
s=open('src/shorts/milgram/vo.gen.ts').read()
L=json.loads(s[s.index('= [')+2:s.rindex(';')])
def cue(li,w=None):
    if not w: return L[li]['s']
    for x in L[li]['words']:
        if re.sub(r'[,.?:]','',x['w'].lower()).startswith(w): return x['s']
    raise Exception(w)
mid=lambda a,b:(L[a]['e']+L[b]['s'])/2
B=[0,mid(0,1),mid(2,3),mid(4,5),L[7]['s']-0.1,L[10]['s']-0.1,mid(10,11),mid(12,13),mid(14,15),L[16]['e']+1.0]
fr=1/30
P=[]
def add(id,t,g): P.append((id,max(0,t),g))
# S1
add('hum-generator',0,-20); add('click-switch',cue(0,'450'),-8); add('zap-small',cue(0,'450')+0.15,-14); add('pencil-scratch',cue(0,'kitlu'),-15)
# S2
add('whoosh-soft',B[1]-0.1,-16); add('stamp',cue(1,'1961'),-8); add('pencil-scratch',cue(1,'1961')+0.2,-17)
for i in range(4): add('pop-soft',cue(2,'czterdziestu')+i*0.3,-17)
# S3
add('whoosh-soft',B[2]-0.1,-16); add('pencil-scratch',cue(3,'błędy'),-13)
for i in range(5): add('click-switch',cue(4,'piętnaście')+i*0.2,-12)
# S4
add('whoosh-soft',B[3]-0.1,-16); add('ding-soft',cue(5,'jeden'),-12); add('pencil-scratch',cue(6)-0.4,-12)
add('whoosh-soft',cue(6,'myślisz')+0.1,-12); add('tick-tock',cue(6,'myślisz')+0.75,-14)
# S5
add('whoosh-soft',B[4]-0.1,-16); add('click-switch',cue(7,'trzystu'),-10)
for i in range(3): add('pop-soft',cue(7,'wszyscy')+i*0.25,-17)
add('thud-wall',cue(8,'uderza'),-6); add('thud-wall',cue(8,'uderza')+11*fr,-6)
# S6
add('whoosh-soft',B[5]-0.1,-16)
for w in ['spokojnie','powtarza','proszę']: add('stamp',cue(10,w),-14)
# S7
add('whoosh-soft',B[6]-0.1,-16)
for i in range(5): add('pop-soft',cue(11,'26')+i*0.25,-16)
add('ding-soft',cue(12,'dwie')+0.7,-11)
# S8
add('record-scratch',cue(13,'uczeń')-0.05,-10); add('pencil-scratch',cue(13,'aktorem'),-14); add('stamp',cue(13,'aktorem')+10*fr,-8)
add('zap-small',cue(14,'nauczyciel'),-9); add('pop-soft',cue(14,'45'),-12)
# S9
add('whoosh-soft',B[8]-0.1,-16); add('hum-generator',B[8]+0.2,-22); add('pencil-scratch',cue(16,'kitlu'),-15)

# --- warstwa dynamiczna (v2) ---
add('riser-short',cue(0,'450')-1.45,-17); add('impact-soft',cue(0,'450'),-9)
for i in range(7): add('click-switch',cue(0,'450')+0.05+i*0.045,-17)
add('zap-small',cue(0,'450')+0.25,-15); add('zap-small',cue(0,'450')+0.9,-18)
add('swoosh-fast',cue(0,'kitlu'),-19)
add('impact-soft',cue(1,'1961'),-12); add('pen-tap',cue(1,'1961')+0.25,-15)
for i in range(0,40,3): add('pop-soft',cue(2,'czterdziestu')+i*0.03,-19)
add('swoosh-fast',cue(2,'czterdziestu'),-19); add('pen-tap',cue(2,'badania'),-16)
add('swoosh-fast',cue(3,'błędy'),-18); add('impact-soft',cue(3,'błędy')+0.13,-15)
add('pen-tap',cue(5,'przewidywali')-0.1,-16); add('swoosh-fast',cue(5,'jeden'),-18); add('impact-soft',cue(5,'jeden'),-17)
add('scribble-erase',cue(6)-0.4,-12); add('bloop-morph',cue(6,'myślisz')+0.25,-10)
add('impact-soft',cue(6,'myślisz')+0.47,-13); add('heartbeat',cue(6,'myślisz')+0.9,-11)
add('riser-short',cue(7)-1.0,-19); add('swoosh-fast',cue(7,'trzystu'),-18); add('impact-soft',cue(7,'trzystu'),-15); add('zap-small',cue(7,'trzystu')+0.1,-16)
add('impact-soft',cue(8,'uderza'),-11); add('impact-soft',cue(8,'uderza')+11/30,-11)
add('heartbeat',cue(9,'milknie')+0.2,-12)
add('paper-slide',B[5]-0.05,-15); add('pen-tap',cue(10,'spokojnie'),-16)
for w in ['powtarza','proszę']: add('swoosh-fast',cue(10,w),-19)
add('impact-soft',cue(11,'26')+0.13,-11)
for i in range(0,26,2): add('pop-soft',cue(11,'26')+i*0.047,-19)
add('pen-tap',cue(12,'dwie')-0.2,-15); add('impact-soft',cue(12,'dwie')+0.73,-13)
add('riser-short',cue(13,'uczeń')-1.5,-16); add('scribble-erase',cue(13,'aktorem')-0.05,-14)
add('impact-soft',cue(13,'aktorem')+10/30,-9)
add('impact-soft',cue(14,'45'),-12); add('pen-tap',cue(14,'45')+0.35,-16)
add('paper-slide',B[8]-0.05,-15); add('swoosh-fast',cue(16,'kitlu'),-19)
for b in B[1:9]: add('swoosh-fast',b-0.08,-20)

ins=['-i','public/milgram_vo.wav']; fc=[]; labs=['[0:a]']
for k,(id,t,g) in enumerate(P):
    ins+=['-i',f'media/sfx/{id}.wav']; ms=int(t*1000)
    fc.append(f'[{k+1}:a]volume={g}dB,adelay={ms}|{ms}[s{k}]'); labs.append(f'[s{k}]')
fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:dropout_transition=0,alimiter=limit=0.89[a]")
json.dump(P,open('audio/milgram_sfx_plan.json','w'),ensure_ascii=False,indent=0)
subprocess.run(['ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',';'.join(fc),'-map','[a]','-ar','48000','audio/milgram_mix.wav'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','out/milgram_v2.mp4','-i','audio/milgram_mix.wav','-map','0:v','-map','1:a','-c:v','copy','-af','apad','-c:a','aac','-b:a','192k','-shortest','out/milgram_short_v2.mp4'],check=True)
print(len(P),'cues')
