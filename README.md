# TwojeTuby

Animacje kanałów Psychorożek i Szczęście Pieniędzy Nie Daje (Remotion, styl szkicowy).

- `src/kit/` — wspólne komponenty: kreski rough.js, tekst Caveat, postacie, generator, napisy.
- `src/shorts/<temat>/` — kompozycje shortów; `vo.gen.ts` generowany z czasów lektora.
- `tools/` — lektor (ElevenLabs), biblioteka efektów, miks, klatki kontrolne.
- `media/sfx/` — biblioteka efektów dźwiękowych (wielokrotnego użytku).

Klucz `ELEVENLABS_API_KEY` trzymaj tylko w `.env` (plik jest w `.gitignore`).

```
npm i
python3 tools/tts.py audio/<temat>.txt audio/<temat>_raw
node tools/frames.mjs <Kompozycja> 0,100,-1 out/qa 0.5
npx remotion render <Kompozycja> out/<plik>.mp4
```
