import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [,, id, framesArg, outDir='out/qa', scale='0.5'] = process.argv;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const browser = await openBrowser('chrome', {browserExecutable});
const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
fs.mkdirSync(outDir, {recursive: true});
const frames = framesArg === 'last' ? [comp.durationInFrames - 1] : framesArg.split(',').map(Number);
for (const f of frames) {
  const fr = f < 0 ? comp.durationInFrames + f : f;
  await renderStill({serveUrl, composition: comp, frame: fr, output: `${outDir}/f${String(fr).padStart(4,'0')}.png`, scale: Number(scale), puppeteerInstance: browser});
  console.log('ok', fr);
}
await browser.close({silent: true});
console.log('total', comp.durationInFrames);
