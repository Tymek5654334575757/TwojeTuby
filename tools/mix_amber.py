import json,re,subprocess
s=open('src/shorts/amber/vo.gen.ts').read()
L=json.loads(s[s.index('= [')+2:s.rindex(';')])
n=lambda t: re.sub(r'[,.?:]','',t.lower())
def cue(li,w=None):
    if not w: return L[li]['s']
    for x in L[li]['words']:
        if n(x['w']).startswith(n(w)): return x['s']
    raise Exception(w)
mid=lambda a,b:(L[a]['e']+L[b]['s'])/2
END=L[13]['e']+0.35
B=[0,mid(1,2),mid(2,3),mid(4,5),mid(7,8),mid(8,9),mid(9,10),mid(11,12),mid(12,13),END,END+0.9]
fr=1/30; P=[]
def add(id,t,g): P.append((id,max(0,t),g))
# S1
add('hum-generator',0,-26)
for i in range(8): add('whoosh-soft',0.1+i*0.7,-24)
add('riser-short',cue(0,'851')-1.4,-17); add('ka-ching',cue(0,'851'),-9); add('impact-soft',cue(0,'851'),-12)
add('boing',cue(1,'pięciolatkowi'),-12); add('pop-soft',cue(1,'pięciolatkowi')+0.1,-13)
# S2
for b in B[1:10]: add('swoosh-fast',b-0.08,-17)
add('whoosh-soft',cue(2,'100'),-15); add('pop-soft',cue(2,'100')+0.4,-15)
add('ding-soft',cue(2,'złoto'),-13); add('boing',cue(2,'złoto'),-17)
add('paper-flip',cue(2,'rok'),-12)
add('ka-ching',cue(2,'116'),-11); add('impact-soft',cue(2,'116'),-14)
# S3
add('pop-soft',cue(3,'mniej'),-14)
for i in range(6): add('click-switch',cue(3,'mniej')+i*0.1,-20)
add('whoosh-soft',cue(3,'dajesz'),-15)
add('crowd-murmur',cue(4)+0.1,-15)
for i in range(8): add('pop-soft',cue(4)+0.15+i*0.18,-20)
add('impact-soft',cue(4,'18'),-11); add('ding-soft',cue(4,'18')+0.05,-15)
# S4
add('whoosh-soft',cue(5,'przynieśli'),-15); add('whoosh-soft',cue(5,'nowi')+0.13,-15)
for i in range(3): add('boing',cue(6,'przychodzą')-0.13+i*0.27,-15)
add('pop-soft',cue(6,'działa'),-13)
add('pen-tap',cue(7,'piramidą'),-14); add('riser-short',cue(7,'piramidą')-1.0,-20)
add('stamp',cue(7,'finansową'),-7); add('impact-soft',cue(7,'finansową'),-10)
# S5
add('coins-scatter',B[4]+0.2,-18)
for i in range(4): add('whoosh-soft',B[4]+0.1+i*0.35,-22)
add('ka-ching',cue(8,'300'),-12)
add('plane-takeoff',cue(8,'lotnicze')-0.2,-10)
add('impact-soft',cue(8,'express'),-15)
# S6
add('engine-sputter',B[5]+0.1,-11)
add('cartoon-fall',cue(9,'przestały')+1.0,-12); add('thud-wall',cue(9,'przestały')+1.0,-12)
add('paper-flip',cue(9,'sierpniu'),-14)
add('impact-soft',cue(9,'likwidację'),-9); add('cartoon-fall',cue(9,'likwidację')+0.1,-11); add('coins-scatter',cue(9,'likwidację')+0.1,-12)
# S7
add('vault-open',cue(10,'skarbcu')-0.2,-9)
for i in range(3): add('pop-soft',cue(11,'sztabki')+i*0.13,-15)
add('ding-soft',cue(11,'8'),-12); add('heartbeat',cue(11,'8')+0.3,-14)
# S8
add('swoosh-fast',cue(12,'dostał')-0.3,-14); add('gavel',cue(12,'dostał'),-6); add('impact-soft',cue(12,'dostał'),-11)
add('bars-clank',cue(12,'więzienia')-0.1,-10)
add('pop-soft',cue(12,'15'),-13); add('pop-soft',cue(12,'11,5'),-13)
# S9
add('whoosh-soft',B[8]+0.05,-14); add('pop-soft',cue(13,'więcej'),-15)
add('boing',cue(13,'zapytaj'),-14); add('bloop-morph',cue(13,'skąd'),-11); add('impact-soft',cue(13,'skąd'),-15)
add('paper-slide',B[9]-0.05,-15)
ins=['-i','public/amber_vo.wav']; fc=[]; labs=['[0:a]']
for k,(id,t,g) in enumerate(P):
    ins+=['-i',f'media/sfx/{id}.wav']; ms=int(t*1000)
    fc.append(f'[{k+1}:a]volume={g}dB,adelay={ms}|{ms}[s{k}]'); labs.append(f'[s{k}]')
fc.append(f"{''.join(labs)}amix=inputs={len(labs)}:normalize=0:dropout_transition=0,alimiter=limit=0.89[a]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',';'.join(fc),'-map','[a]','-ar','48000','audio/amber_mix.wav'],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','out/amber_v1.mp4','-i','audio/amber_mix.wav','-map','0:v','-map','1:a','-c:v','copy','-af','apad','-c:a','aac','-b:a','192k','-shortest','out/amber_short_v1.mp4'],check=True)
print(len(P),'cues')
