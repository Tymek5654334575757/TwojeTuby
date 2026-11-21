// Klatki kontrolne z wielu kompozycji przy jednym bundlu.
// Użycie: node tools/frames_multi.mjs spec.json outDir [scale]
//   spec.json: {"Id": [klatki...], ...}; ujemna klatka = od końca. Pliki: outDir/<Id>/f0000.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [, , specPath, outDir = 'out/qa', scale = '0.3'] = process.argv;
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});
for (const [id, frames] of Object.entries(spec)) {
	const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
	const dir = `${outDir}/${id}`;
	fs.mkdirSync(dir, {recursive: true});
	for (const f of frames) {
		const fr = Math.min(comp.durationInFrames - 1, f < 0 ? comp.durationInFrames + f : f);
		try {
			await renderStill({serveUrl, composition: comp, frame: fr, output: `${dir}/f${String(fr).padStart(5, '0')}.png`, scale: Number(scale), puppeteerInstance: browser});
		} catch (e) {
			console.log('BŁĄD', id, fr, String(e).slice(0, 300));
			break;
		}
	}
	console.log('ok', id, comp.durationInFrames);
}
await browser.close({silent: true});
