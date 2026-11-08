import json,sys
a=json.load(open(sys.argv[1]))
ch,s,e=a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']
words=[];cur='';ws=None;pe=0
for c,cs,ce in zip(ch,s,e):
    if c.isspace():
        if cur: words.append((cur,ws,pe)); cur=''
        continue
    if not cur: ws=cs
    cur+=c; pe=ce
if cur: words.append((cur,ws,pe))
json.dump(words,open(sys.argv[2],'w'),ensure_ascii=False)
prev=0
for w,a1,b in words:
    if w[-1] in '.?,:' or a1-prev>0.3: print(f"{a1:6.2f}-{b:6.2f} gap {a1-prev:.2f} {w}")
    prev=b
