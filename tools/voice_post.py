# Obróbka lektora: pauzy, tempo, de-esser, normalizacja; potem napisy (cyfry) i vo.gen.ts.
import json,subprocess,sys,re
cfg=json.load(open(sys.argv[1]))
T=cfg['tempo']; cuts=cfg['cuts']; src=cfg['raw']
fc=[];parts=[];prev=0;i=0
for c,sil in cuts:
    fc.append(f"[0:a]atrim={prev}:{c},asetpts=PTS-STARTPTS[a{i}]"); parts.append(f"[a{i}]")
    fc.append(f"anullsrc=r=44100:cl=mono,atrim=0:{sil}[s{i}]"); parts.append(f"[s{i}]")
    prev=c;i+=1
fc.append(f"[0:a]atrim={prev},asetpts=PTS-STARTPTS[a{i}]"); parts.append(f"[a{i}]")
fc.append(f"{''.join(parts)}concat=n={len(parts)}:v=0:a=1,aformat=channel_layouts=mono,atempo={T},deesser=i=0.5:m=0.5:f=0.5,equalizer=f=6500:t=q:w=1.4:g=-3,loudnorm=I=-16:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-filter_complex',';'.join(fc),'-map','[out]','-ar','44100',cfg['wav']],check=True)
W=json.load(open(cfg['words']))
m=lambda t: round((t+sum(s for c,s in cuts if t>=c))/T,3)
W=[[w,m(a),m(b)] for w,a,b in W]
groups=[(g['spoken'].split(),g['shown']) for g in cfg['groups']]
strip=lambda x: x.lower().strip(',.?:')
disp=[];i=0
while i<len(W):
    hit=False
    for pat,rep in groups:
        n=len(pat)
        if [strip(x[0]) for x in W[i:i+n]]==pat:
            tail=W[i+n-1][0]; punct=tail[len(tail.rstrip(',.?:')):]
            disp.append([rep+punct,W[i][1],W[i+n-1][2]]); i+=n; hit=True; break
    if not hit: disp.append(W[i]); i+=1
KEYS=set(k.lower() for k in cfg['keys'])
lines=[];cur=[]
for w,s,e in disp:
    cur.append({"w":w,"s":s,"e":e,"key":strip(w) in KEYS})
    if w[-1] in '.?':
        lines.append({"s":cur[0]["s"],"e":cur[-1]["e"],"words":cur}); cur=[]
if cur: lines.append({"s":cur[0]["s"],"e":cur[-1]["e"],"words":cur})
dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',cfg['wav']]))
open(cfg['ts'],'w').write(f"// AUTO-GENERATED przez tools/voice_post.py. Nie edytować ręcznie.\nexport type VoWord={{w:string;s:number;e:number;key:boolean}};\nexport type VoLine={{s:number;e:number;words:VoWord[]}};\nexport const VO_DURATION={dur:.2f};\nexport const LINES: VoLine[] = "+json.dumps(lines,ensure_ascii=False)+";\n")
for k,l in enumerate(lines): print(k, round(l['s'],2), round(l['e'],2), ' '.join(('*' if x['key'] else '')+x['w'] for x in l['words']))
print('dur',dur)
