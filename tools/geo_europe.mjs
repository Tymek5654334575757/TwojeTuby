// Generuje src/long/amber/europe.gen.ts: kontury krajów Europy (Natural Earth 1:50m, world-atlas) w rzucie Merkatora.
// Jednostki mapy: Polska ma ok. 1000 j. szerokości; (0,0) = środek Polski.
import fs from 'node:fs';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));
const fc = feature(topo, topo.objects.countries);
const pl = fc.features.find((f) => f.properties.name === 'Poland');
const proj = geoMercator().fitWidth(1000, pl);
const c = proj([19.4, 52.0]);
proj.translate([proj.translate()[0] - c[0], proj.translate()[1] - c[1]]);
const ext = [proj([-45, 76]), proj([80, 22])];
proj.clipExtent(ext);
const path = geoPath(proj);
const round = (d) => (d || '').replace(/\d+\.\d+/g, (m) => (+m).toFixed(1));
const out = [];
for (const f of fc.features) {
	const d = round(path(f));
	if (!d || d.length < 20) continue;
	out.push({n: f.properties.name, d});
}
const pt = (lon, lat) => proj([lon, lat]).map((v) => +v.toFixed(1));
const cities = {
	warszawa: pt(21.01, 52.23), gdansk: pt(18.65, 54.35), krakow: pt(19.94, 50.06), wroclaw: pt(17.03, 51.11), poznan: pt(16.93, 52.41),
	katowice: pt(19.02, 50.26), szczecin: pt(14.55, 53.43), rzeszow: pt(22.0, 50.04), lodz: pt(19.46, 51.76), bydgoszcz: pt(18.0, 53.12), lublin: pt(22.57, 51.25), olsztyn: pt(20.49, 53.78),
};
// punkty poglądowe w Europie (bez podpisów) i kierunki wakacyjne na południu
const eu = [[2.35, 48.86], [-0.13, 51.5], [13.4, 52.52], [4.9, 52.37], [12.5, 41.9], [-3.7, 40.4], [16.37, 48.21], [14.42, 50.09], [8.68, 50.11], [11.58, 48.14], [6.96, 50.94], [9.99, 53.55], [10.75, 59.91], [18.07, 59.33], [12.57, 55.68], [24.94, 60.17], [-6.26, 53.35], [4.35, 50.85], [8.54, 47.37], [-9.14, 38.72], [9.19, 45.46], [2.17, 41.39]].map(([a, b]) => pt(a, b));
const south = [[23.73, 37.98], [33.0, 34.7], [25.4, 35.3], [27.2, 36.9], [30.7, 36.9], [14.5, 35.9], [2.65, 39.57], [15.98, 43.51], [18.1, 42.65], [27.9, 43.2], [10.2, 36.8], [20.0, 39.6], [24.0, 35.5], [-4.4, 36.7], [3.1, 39.9], [13.36, 38.12], [16.4, 41.1], [28.2, 36.4]].map(([a, b]) => pt(a, b));
const pld = round(path(pl));
fs.writeFileSync('src/long/amber/europe.gen.ts', `// AUTO-GENERATED przez tools/geo_europe.mjs (Natural Earth 1:50m przez world-atlas). Nie edytować ręcznie.\nexport const COUNTRIES: {n: string; d: string}[] = ${JSON.stringify(out)};\nexport const POLAND = ${JSON.stringify(pld)};\nexport const CITIES: Record<string, [number, number]> = ${JSON.stringify(cities)};\nexport const EU_PTS: [number, number][] = ${JSON.stringify(eu)};\nexport const SOUTH_PTS: [number, number][] = ${JSON.stringify(south)};\nexport const EXTENT = ${JSON.stringify(ext.map((p) => p.map((v) => +v.toFixed(1))))};\n`);
console.log('countries', out.length, 'bytes', fs.statSync('src/long/amber/europe.gen.ts').size, 'ext', ext, 'pl', cities.warszawa, cities.gdansk, 'south0', south[0]);
