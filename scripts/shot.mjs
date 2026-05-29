// Screenshot helper for visual iteration.
//   bun scripts/shot.mjs <path> <out.png> [settingsJSON]
// settingsJSON seeds localStorage 'tu-itak:settings:v1' before load, e.g.
//   '{"scriptMode":"kana","theme":"dark","locale":"en"}'
import { chromium } from 'playwright';

const path = process.argv[2] ?? '/';
const out = process.argv[3] ?? '/tmp/tu-shots/shot.png';
const settings = process.argv[4];
const prog = process.argv[5];
const url = `http://localhost:5173${path}`;

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 430, height: 932 },
	deviceScaleFactor: 2
});
if (settings) {
	await page.addInitScript((s) => localStorage.setItem('tu-itak:settings:v1', s), settings);
}
if (prog) {
	await page.addInitScript((s) => localStorage.setItem('tu-itak:progress:v1', s), prog);
}
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('shot →', out);
