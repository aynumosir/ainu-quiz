<script lang="ts">
	import { settings } from '$lib/settings/settings.svelte';
	import Sik from '$lib/components/motif/Sik.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';

	const ja = $derived(settings.locale === 'ja');

	interface Ref {
		title: string;
		note: string; // English gloss / description, shown under the title
		href?: string;
	}

	// Grammars & teaching materials the curriculum is sequenced from.
	const grammars: Ref[] = [
		{ title: '北海道ウタリ協会（1994）『アコㇿイタㇰ：テキストアイヌ語会話』', note: 'Hokkaido Utari Association — Akor Itak, a spoken-Ainu textbook.' },
		{ title: '田村すゞ子（1996）『アイヌ語入門』', note: 'Tamura Suzuko — An Introduction to Ainu.' },
		{ title: '佐藤知己（2008）『アイヌ語文法の基礎』', note: 'Satō Tomomi — Foundations of Ainu Grammar.' },
		{ title: '萱野茂（1987）『アイヌ語会話 初級編』', note: 'Kayano Shigeru — Ainu Conversation, Beginner.' },
		{ title: '金田一京助・知里真志保（1936）『アイヌ語法概説』', note: 'Kindaichi Kyōsuke & Chiri Mashiho — Outline of Ainu Grammar.' },
		{ title: 'Shibatani, Masayoshi (1990). The Languages of Japan.', note: 'Cambridge University Press — Ainu phonology & grammar.' },
		{ title: 'Ijas (2023). Basic Ainu Lessons.', note: 'Online grammar; used e.g. for the apunno farewell speaker/addressee distinction.' }
	];

	// Dictionaries consulted (and cited in word notes / sentence sources).
	const dictionaries: Ref[] = [
		{ title: '田村すず子（1996）『アイヌ語沙流方言辞典』', note: 'Tamura — Ainu (Saru dialect) – Japanese dictionary.' },
		{ title: '中川裕（1995）『アイヌ語千歳方言辞典』', note: 'Nakagawa Hiroshi — Ainu (Chitose dialect) – Japanese dictionary.' },
		{ title: '萱野茂（1996）『萱野茂のアイヌ語辞典』', note: "Kayano Shigeru — Kayano's Ainu dictionary." },
		{ title: '金澤庄三郎（1898）『トピック別アイヌ語会話辞典』', note: 'Kanazawa Shōzaburō — topical conversation dictionary (via NINJAL).' },
		{ title: '太田満（2022）『日本語‐アイヌ語辞典』', note: 'Ota Mitsuru — Japanese → Ainu dictionary.' },
		{ title: '千葉大学『鵡川方言 日本語‐アイヌ語辞典』', note: 'Chiba University — Mukawa-dialect dictionary.' },
		{ title: 'John Batchelor (1938). An Ainu–English–Japanese Dictionary (4th ed.).', note: 'Historical reference dictionary.' }
	];

	// Spoken / written corpora that example sentences are drawn from & verified against.
	const corpora: Ref[] = [
		{ title: '公益財団法人アイヌ民族文化財団 ラジオ講座', note: 'Foundation for Ainu Culture (FRPAC) radio Ainu lessons — transcribed.' },
		{ title: '『CDエクスプレス アイヌ語』／ アイヌ語エクスプレス', note: 'Spoken-Ainu course transcripts.' },
		{ title: '『アイヌタイムズ』', note: 'Ainu Times — Ainu-language newspaper.' },
		{ title: '国立国語研究所（NINJAL）アイヌ語コーパス', note: 'Folklore & topical-conversation corpora.' },
		{ title: 'ainu-corpora', note: 'Aggregated, sentence-aligned Ainu–Japanese corpus (~194k pairs) used for verification.', href: 'https://github.com/aynumosir' }
	];

	const tools: Ref[] = [
		{ title: 'Itak-uoeroskip glossary', note: 'Curated Ainu glossary (JA/EN/ZH) — the project term base.', href: 'https://itak.aynu.org' },
		{ title: 'ainconv', note: 'Latin ↔ Katakana ↔ Cyrillic Ainu script conversion.' },
		{ title: 'ainu-mcp', note: 'Programmatic access to the dictionaries, corpus & glossary — every lesson was checked against it.' },
		{ title: 'ainu-tts', note: 'Community-aligned Ainu TTS pipeline. Synthetic audio is NOT released pending community review.' }
	];

	const orgs: Ref[] = [
		{ title: '公益財団法人アイヌ民族文化財団', note: 'Foundation for Ainu Culture.', href: 'https://www.ff-ainu.or.jp' },
		{ title: '国立アイヌ民族博物館 ウポポイ', note: 'National Ainu Museum, Upopoy.', href: 'https://nam.go.jp' }
	];

	const dialects = '沙流 (Saru) · 千歳 (Chitose) · 幌別 (Horobetsu) · 白老 (Shiraoi) · 静内 (Shizunai) · 鵡川 (Mukawa) · 浦河 (Urakawa) · 様似 (Samani) · 十勝 (Tokachi)';
</script>

<div class="about">
	<header class="head">
		<Sik size={28} filled />
		<h1>{ja ? '出典・参考文献' : 'References & sources'}</h1>
	</header>

	<p class="intro">
		{#if ja}
			このコースの語彙・例文・文法は、下記の辞典・文法書・コーパスに基づいています。各項目は <strong>ainu-mcp</strong>
			を通して実際の辞典・コーパスと照合し、可能な限り出典（方言・典拠）を付しています。誤りがあればご指摘ください。
		{:else}
			Every word, sentence, and grammar point in this course is grounded in the dictionaries, grammars,
			and corpora below, and was checked against the real sources through <strong>ainu-mcp</strong>, with a
			dialect + citation kept wherever possible. Corrections are very welcome.
		{/if}
	</p>

	{#snippet list(heading_ja: string, heading_en: string, items: Ref[])}
		<section class="group">
			<h2>{ja ? heading_ja : heading_en}</h2>
			<ul>
				{#each items as r (r.title)}
					<li>
						{#if r.href}
							<a class="t" href={r.href} target="_blank" rel="noopener noreferrer">{r.title}</a>
						{:else}
							<span class="t">{r.title}</span>
						{/if}
						<span class="n">{r.note}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/snippet}

	{@render list('文法書・教科書', 'Grammars & textbooks', grammars)}
	{@render list('辞典', 'Dictionaries', dictionaries)}
	{@render list('コーパス・資料', 'Corpora & data', corpora)}
	{@render list('ツール・基盤', 'Tools & infrastructure', tools)}
	{@render list('協力・参考機関', 'Organizations referenced', orgs)}

	<section class="group">
		<h2>{ja ? '収録方言' : 'Dialects represented'}</h2>
		<p class="dialects">{dialects}</p>
	</section>

	<MoreuRule />

	<section class="group thanks">
		<h2>{ja ? '謝辞' : 'Acknowledgements'}</h2>
		<p>
			{#if ja}
				アイヌ語を今に伝えてくださった話者の方々、録音や辞典を守り継いできた方々に深く感謝します。本アプリは学習補助であり、権威ある資料の代わりではありません。合成音声は地域社会による確認が済むまで公開しません（<a
					href="https://github.com/aynumosir"
					target="_blank"
					rel="noopener noreferrer">ETHICS</a
				> 参照）。
			{:else}
				With gratitude to the speakers who carried the Ainu language to us, and to those who preserved the
				recordings and dictionaries. This app is a study aid, not a substitute for authoritative sources.
				Synthetic audio stays unreleased until community review (see <a
					href="https://github.com/aynumosir"
					target="_blank"
					rel="noopener noreferrer">ETHICS</a
				>).
			{/if}
		</p>
	</section>
</div>

<style>
	.about {
		max-width: 560px;
		margin: 0 auto;
		padding: var(--sp-5) var(--sp-4) var(--sp-8);
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	.head {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		color: var(--c-primary);
	}
	.head h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-xl);
		color: var(--c-ink);
	}
	.intro {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: var(--lh-relaxed, 1.6);
	}
	.group h2 {
		font-size: var(--fz-md);
		font-weight: 800;
		color: var(--c-primary);
		margin-bottom: var(--sp-3);
		padding-bottom: var(--sp-2);
		border-bottom: 2px solid var(--c-border);
	}
	.group ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.group li {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.t {
		font-weight: 700;
		color: var(--c-ink);
	}
	a.t {
		color: var(--c-primary);
		text-decoration: none;
	}
	a.t:hover {
		text-decoration: underline;
	}
	.n {
		font-size: var(--fz-sm);
		color: var(--c-ink-faint);
	}
	.dialects {
		color: var(--c-ink-soft);
		line-height: var(--lh-relaxed, 1.7);
	}
	.thanks p {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: var(--lh-relaxed, 1.6);
	}
	.thanks a {
		color: var(--c-primary);
	}
</style>
