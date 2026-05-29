// Drive a lesson end-to-end, capturing the result banner + summary.
//   bun scripts/shot-flow.mjs <nodeId> <outDir> [settingsJSON]
import { chromium } from 'playwright';

const nodeId = process.argv[2] ?? 'u1n1';
const dir = process.argv[3] ?? '/tmp/tu-shots';
const settings = process.argv[4] ?? '{"scriptMode":"both","theme":"light","locale":"en"}';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
await page.addInitScript((s) => localStorage.setItem('tu-itak:settings:v1', s), settings);
	await page.addInitScript(() => localStorage.setItem('tu-itak:progress:v1', JSON.stringify({ unlimitedHearts: true, hearts: 5, gems: 30 })));
await page.goto(`http://localhost:5173/lesson/${nodeId}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

let bannerShot = false;
for (let step = 0; step < 30; step++) {
	if (await page.locator('.summary').count()) break;

	// answer the current exercise
	const opt = page.locator('.opt').first();
	const tile = page.locator('.bank .tile:not(.ghost)');
	if (await opt.count()) {
		await opt.click();
	} else if (await tile.count()) {
		const n = await tile.count();
		for (let i = 0; i < n; i++) await page.locator('.bank .tile:not(.ghost)').first().click();
	} else if (await page.locator('.match').count()) {
		// brute-force match: try every left×right combination until all clear
		for (let a = 0; a < 6; a++) {
			const L = page.locator('.col').first().locator('.cell:not(.matched)');
			if (!(await L.count())) break;
			await L.first().click();
			const R = page.locator('.col').last().locator('.cell:not(.matched)');
			const rn = await R.count();
			for (let r = 0; r < rn; r++) {
				await page.locator('.col').last().locator('.cell:not(.matched)').nth(r).click();
				if (await page.locator('.col').first().locator('.cell.matched').count()) break;
				await page.waitForTimeout(60);
			}
		}
		await page.waitForTimeout(500);
		continue;
	}

	const check = page.getByRole('button', { name: 'CHECK', exact: false }).first();
	if (await check.count()) {
		await check.click();
		await page.waitForTimeout(350);
		if (!bannerShot) {
			await page.screenshot({ path: `${dir}/30-banner.png` });
			bannerShot = true;
		}
		// continue / got it lives in the banner
		await page.locator('.banner button').first().click();
		await page.waitForTimeout(250);
	}
}

if (await page.locator('.summary').count()) {
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(300);
	await page.screenshot({ path: `${dir}/31-summary.png` });
	console.log('captured banner + summary');
} else {
	console.log('did not reach summary');
}
await browser.close();
