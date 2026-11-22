// Generuje src/long/manip/geo.gen.ts: Afryka + Europa/Bliski Wschód (1:110m, Natural Earth przez world-atlas) w rzucie równoodległościowym,
// szer. ok. 760 j., środek w (0,0). AFRICA = kraje Afryki (jeden path), REST = sąsiednie lądy (tło).
import fs from 'node:fs';
import {geoEquirectangular, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
const rd = (d) => (d || '').replace(/-?\d+\.\d+/g, (m) => (+m).toFixed(1));
const c = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const fc = feature(c, c.objects.countries);
// kody ISO 3166-1 numeryczne państw Afryki
const AF = new Set(['012','024','204','072','854','108','132','120','140','148','174','178','180','262','818','226','232','748','231','266','270','288','324','624','384','404','426','430','434','450','454','466','478','480','504','508','516','562','566','646','678','686','690','694','706','710','728','729','834','768','788','800','894','716','732']);
const bbox = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [[[-20, 38], [55, 38], [55, -36], [-20, -36], [-20, 38]]]}};
const p = geoEquirectangular();
p.fitWidth(760, bbox);
const o = p([17.5, 1]);
p.translate([p.translate()[0] - o[0], p.translate()[1] - o[1]]);
p.clipExtent([p([-30, 48]), p([65, -40])]);
const path = geoPath(p);
const af = fc.features.filter((f) => AF.has(String(f.id).padStart(3, '0')));
const rest = fc.features.filter((f) => !AF.has(String(f.id).padStart(3, '0')));
const join = (fs) => rd(fs.map((f) => path(f) || '').join(' '));
fs.writeFileSync('src/long/manip/geo.gen.ts', `// Wygenerowane przez tools/geo_africa.mjs (Natural Earth 1:110m). Nie edytować ręcznie.\nexport const AFRICA = ${JSON.stringify(join(af))};\nexport const REST = ${JSON.stringify(join(rest))};\nexport const AF_COUNT = ${af.length};\n`);
console.log('afryka', af.length, 'krajów');
