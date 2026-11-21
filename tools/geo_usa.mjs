// Generuje src/long/garaze/geo.gen.ts (Natural Earth przez world-atlas, d3-geo):
//  USA:  kontury USA, Kanady i Meksyku (1:50m) w rzucie stożkowym, szerokość kontynentalnych USA ok. 1500 j.; miasta; 50 punktów w USA.
//  BAY:  okolice Zatoki San Francisco (ląd 1:10m), szer. ok. 1000 j.; miasta Doliny Krzemowej.
//  WORLD: kontury świata (1:110m) w rzucie równoodległościowym, szer. 1600 j.; 45 punktów w krajach.
import fs from 'node:fs';
import {geoConicEqualArea, geoMercator, geoEquirectangular, geoPath, geoContains, geoCentroid, geoArea} from 'd3-geo';
import {feature} from 'topojson-client';
const rd = (d) => (d || '').replace(/-?\d+\.\d+/g, (m) => (+m).toFixed(1));
const load = (f) => JSON.parse(fs.readFileSync(`node_modules/world-atlas/${f}`, 'utf8'));

// --- USA ---
const c50 = load('countries-50m.json');
const fc50 = feature(c50, c50.objects.countries);
const by = (n) => fc50.features.find((f) => f.properties.name === n);
const usa = by('United States of America');
const conus = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [[[-125, 49.5], [-66, 49.5], [-66, 24], [-125, 24], [-125, 49.5]]]}};
const pUS = geoConicEqualArea().parallels([29.5, 45.5]).rotate([98, 0]).center([0, 38]);
pUS.fitWidth(1500, conus);
const o = pUS([-98, 38.5]);
pUS.translate([pUS.translate()[0] - o[0], pUS.translate()[1] - o[1]]);
pUS.clipExtent([pUS([-131, 56]).map((v) => v - 200), pUS([-60, 18]).map((v) => v + 200)]);
const pathUS = geoPath(pUS);
const usShapes = ['United States of America', 'Canada', 'Mexico', 'Cuba', 'Bahamas', 'Guatemala'].map((n) => ({n, d: rd(pathUS(by(n)))})).filter((x) => x.d.length > 10);
const pt = (p, lon, lat) => p([lon, lat]).map((v) => +v.toFixed(1));
const usCities = {
	la: pt(pUS, -118.24, 34.05), kc: pt(pUS, -94.58, 39.1), ny: pt(pUS, -74.0, 40.71), sea: pt(pUS, -122.33, 47.61), bay: pt(pUS, -122.1, 37.4),
	bellevue: pt(pUS, -122.2, 47.61), hollywood: pt(pUS, -118.33, 34.1),
};
// 50 punktów rozsianych po kontynentalnych USA (siatka, potem co n-ty)
const grid = [];
for (let lat = 47.5; lat > 26; lat -= 1.9) for (let lon = -123; lon < -69; lon += 2.6) if (geoContains(usa, [lon + (Math.round(lat) % 2) * 1.2, lat])) grid.push([lon + (Math.round(lat) % 2) * 1.2, lat]);
const step = grid.length / 50;
const usDots = Array.from({length: 50}, (_, i) => pt(pUS, ...grid[Math.floor(i * step)]));

// --- Zatoka San Francisco ---
const l10 = load('land-10m.json');
const land10 = feature(l10, l10.objects.land);
const bbox = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [[[-122.75, 37.95], [-121.75, 37.95], [-121.75, 37.15], [-122.75, 37.15], [-122.75, 37.95]]]}};
const pBay = geoMercator().fitWidth(1000, bbox);
const ob = pBay([-122.25, 37.55]);
pBay.translate([pBay.translate()[0] - ob[0], pBay.translate()[1] - ob[1]]);
pBay.clipExtent([pBay([-122.95, 38.1]), pBay([-121.55, 37.0])]);
const bayLand = rd(geoPath(pBay)(land10));
const bayCities = {
	sf: pt(pBay, -122.42, 37.77), paloalto: pt(pBay, -122.14, 37.44), menlo: pt(pBay, -122.18, 37.45), mtview: pt(pBay, -122.08, 37.39),
	losaltos: pt(pBay, -122.11, 37.38), cupertino: pt(pBay, -122.03, 37.32), stanford: pt(pBay, -122.17, 37.43),
};

// --- świat ---
const c110 = load('countries-110m.json');
const fc110 = feature(c110, c110.objects.countries);
const pW = geoEquirectangular().fitWidth(1600, {type: 'Sphere'});
const ow = pW([0, 10]);
pW.translate([pW.translate()[0] - ow[0], pW.translate()[1] - ow[1]]);
const pathW = geoPath(pW);
const world = fc110.features.filter((f) => f.properties.name !== 'Antarctica').map((f) => ({n: f.properties.name, d: rd(pathW(f))})).filter((x) => x.d.length > 10);
const big = fc110.features.filter((f) => !['Antarctica', 'United States of America'].includes(f.properties.name)).sort((a, b) => geoArea(b) - geoArea(a)).slice(0, 45);
const worldDots = big.map((f) => pt(pW, ...geoCentroid(f)));
const usW = rd(pathW(fc110.features.find((f) => f.properties.name === 'United States of America')));

fs.writeFileSync('src/long/garaze/geo.gen.ts', `// AUTO-GENERATED przez tools/geo_usa.mjs (Natural Earth przez world-atlas). Nie edytować ręcznie.
export const US_SHAPES: {n: string; d: string}[] = ${JSON.stringify(usShapes)};
export const US_CITIES: Record<string, [number, number]> = ${JSON.stringify(usCities)};
export const US_DOTS: [number, number][] = ${JSON.stringify(usDots)};
export const BAY_LAND = ${JSON.stringify(bayLand)};
export const BAY_CITIES: Record<string, [number, number]> = ${JSON.stringify(bayCities)};
export const WORLD: {n: string; d: string}[] = ${JSON.stringify(world)};
export const WORLD_US = ${JSON.stringify(usW)};
export const WORLD_DOTS: [number, number][] = ${JSON.stringify(worldDots)};
`);
console.log('us', usShapes.length, 'grid', grid.length, 'cities', usCities, 'bay', bayCities, 'world', world.length, 'bytes', fs.statSync('src/long/garaze/geo.gen.ts').size);
