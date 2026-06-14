/**
 * Curated beginner (A1) course content for tu itak.
 *
 * Every Ainu form here is verified against the project's `ainu` MCP tools:
 *   - headwords / glosses: dictionary_reverse_lookup (Tamura Saru, Nakagawa Chitose,
 *     Kayano, Chiba Mukawa, Ota) and the Itak glossary
 *   - example sentences: corpus_search, drawn from Hokkaido dialects
 *     (沙流 Saru, 千歳 Chitose, 静内 Shizunai, 鵡川 Mukawa, 様似 Samani,
 *     白老 Shiraoi, 十勝 Tokachi, 幌別 Horobetsu). Sakhalin/Kuril avoided.
 *
 * Romanization is canonical lowercase Latin; `=` marks personal affixes
 * (ku= "I", e= "you sg."). The `sito ku=e` order (object + verb) reflects
 * the attested corpus forms.
 */

import type { ContentBundle } from './types';

export const bundle: ContentBundle = {
	course: {
		id: 'tu-itak-ain',
		target: 'ain',
		title: {
			ja: 'アイヌ語コース',
			en: 'Ainu course'
		},
		sections: [
			{
				id: 'sec_first_steps',
				cefr: 'A1',
				title: {
					ja: 'アイヌ イタㇰ — はじめて / Ainu first steps',
					en: 'aynu itak — Ainu first steps'
				},
				units: [
					{
						id: 'u1',
						accent: 'indigo',
						label: { ja: 'ユニット 1', en: 'Unit 1' },
						title: {
							ja: 'あいさつと人々',
							en: 'Greetings & people'
						},
						nodes: [
							{
								id: 'u1n1',
								type: 'lesson',
								title: { ja: 'こんにちは', en: 'Hello' },
								levels: 2,
								vocab: ['v_irankarapte', 'v_iyairaykere', 'v_hioyoy'],
								sentences: ['s_001', 's_002']
							},
							{
								id: 'u1n7',
								type: 'lesson',
								title: { ja: 'ご機嫌いかが', en: 'How are you?' },
								levels: 2,
								vocab: ['v_iwanke', 'v_an', 'v_e_pers', 'v_ku_pers', 'v_ruwe'],
								sentences: ['s_023', 's_024']
							},
							{
								id: 'u1n8',
								type: 'lesson',
								title: { ja: 'さようなら', en: 'Goodbyes' },
								levels: 2,
								vocab: [
									'v_apunno',
									'v_oka',
									'v_paye',
									'v_yan',
									'v_suy',
									'v_unukar',
									'v_an_pers',
									'v_ro'
								],
								sentences: ['s_025', 's_026', 's_027']
							},
							{
								id: 'u1n2',
								type: 'lesson',
								title: { ja: '人とアイヌ', en: 'People & Ainu' },
								levels: 2,
								vocab: ['v_aynu', 'v_menoko', 'v_okkayo', 'v_hekattar'],
								sentences: ['s_003']
							},
							{
								id: 'u1n3',
								type: 'lesson',
								title: { ja: 'おかあさん、おとうさん', en: 'Mother & father' },
								levels: 2,
								vocab: ['v_hapo', 'v_totto', 'v_mici', 'v_kor'],
								sentences: ['s_004', 's_005']
							},
							{
								id: 'u1n4',
								type: 'lesson',
								title: { ja: '私・あなた', en: 'I & you (ku= / e=)' },
								levels: 2,
								vocab: ['v_ku_pers', 'v_e_pers', 'v_rehe'],
								sentences: ['s_006', 's_007', 's_okkayo']
							},
							{
								id: 'u1n5',
								type: 'review',
								title: { ja: '復習', en: 'Review' },
								vocab: [
									'v_irankarapte',
									'v_aynu',
									'v_hapo',
									'v_mici',
									'v_rehe',
									'v_iwanke',
									'v_apunno',
									'v_unukar'
								],
								sentences: ['s_002', 's_005', 's_007', 's_024', 's_027']
							},
							{
								id: 'u1n6',
								type: 'story',
								title: { ja: 'お話：はじめまして', en: 'Story: Nice to meet you' },
								storyId: 'st_greet',
								legendary: true
							}
						]
					},
					{
						id: 'u2',
						accent: 'green',
						label: { ja: 'ユニット 2', en: 'Unit 2' },
						title: {
							ja: '動物と自然',
							en: 'Animals & nature'
						},
						nodes: [
							{
								id: 'u2n1',
								type: 'lesson',
								title: { ja: '動物', en: 'Animals' },
								levels: 2,
								vocab: ['v_seta', 'v_cape', 'v_cikap', 'v_cep'],
								sentences: ['s_008', 's_009']
							},
							{
								id: 'u2n2',
								type: 'lesson',
								title: { ja: 'シカと神', en: 'Deer & kamuy' },
								levels: 2,
								vocab: ['v_yuk', 'v_kamuy', 'v_poro'],
								sentences: ['s_010', 's_011']
							},
							{
								id: 'u2n3',
								type: 'lesson',
								title: { ja: '太陽と水', en: 'Sun & water' },
								levels: 2,
								vocab: ['v_cup', 'v_wakka', 'v_to', 'v_pet'],
								sentences: ['s_012', 's_013']
							},
							{
								id: 'u2n4',
								type: 'lesson',
								title: { ja: '花と山', en: 'Flowers & mountains' },
								levels: 2,
								vocab: ['v_nonno', 'v_nupuri', 'v_pirka', 'v_retar'],
								sentences: ['s_014', 's_015']
							},
							{
								id: 'u2n5',
								type: 'review',
								title: { ja: '復習', en: 'Review' },
								vocab: ['v_seta', 'v_cikap', 'v_kamuy', 'v_wakka', 'v_nonno'],
								sentences: ['s_009', 's_012', 's_014']
							},
							{
								id: 'u2n6',
								type: 'unitReview',
								title: { ja: 'ユニット復習', en: 'Unit review' },
								legendary: true,
								vocab: ['v_seta', 'v_cep', 'v_yuk', 'v_cup', 'v_pet', 'v_nupuri'],
								sentences: ['s_008', 's_010', 's_013', 's_015']
							}
						]
					},
					{
						id: 'u3',
						accent: 'red',
						label: { ja: 'ユニット 3', en: 'Unit 3' },
						title: {
							ja: '食べ物と暮らし',
							en: 'Food & daily life'
						},
						nodes: [
							{
								id: 'u3n1',
								type: 'lesson',
								title: { ja: '食べ物', en: 'Food' },
								levels: 2,
								vocab: ['v_sito', 'v_kam', 'v_amam', 'v_cep'],
								sentences: ['s_016', 's_017']
							},
							{
								id: 'u3n2',
								type: 'lesson',
								title: { ja: '食べる・飲む', en: 'Eat & drink' },
								levels: 2,
								vocab: ['v_e_eat', 'v_ipe', 'v_ku_drink', 'v_rusuy'],
								sentences: ['s_018', 's_019', 's_020']
							},
							{
								id: 'u3n3',
								type: 'lesson',
								title: { ja: '家と歌', en: 'House & song' },
								levels: 2,
								vocab: ['v_cise', 'v_upopo', 'v_kor'],
								sentences: ['s_021', 's_022']
							},
							{
								id: 'u3n4',
								type: 'review',
								title: { ja: '復習', en: 'Review' },
								vocab: ['v_sito', 'v_amam', 'v_e_eat', 'v_ku_drink', 'v_cise'],
								sentences: ['s_016', 's_018', 's_021']
							},
							{
								id: 'u3n5',
								type: 'story',
								title: { ja: 'お話：いただきます', en: 'Story: Let us eat' },
								storyId: 'st_ipe',
								legendary: true
							}
						]
					}
				]
			}
		]
	},

	vocab: {
		// --- Unit 1: greetings & people ---
		v_irankarapte: {
			id: 'v_irankarapte',
			latin: 'irankarapte',
			gloss: { ja: 'こんにちは（あいさつ）', en: 'hello (greeting)' },
			category: 'interjection',
			pos: 'interj',
			note: {
				ja: '語構成は i-ram-karap-te（あなたの・心に・触れ・させていただく）。本来はあらたまった席で男性が作法とともに述べる正式な挨拶で、気軽な「こんにちは」は近年の用法（萱野・中川）。',
				en: 'From i-ram-karap-te \'let me gently touch your heart\'. Originally a formal, seated greeting (men used set etiquette); the casual everyday \'hello\' sense is only recent (Kayano, Nakagawa).'
			}
		},
		v_iyairaykere: {
			id: 'v_iyairaykere',
			latin: 'iyairaykere',
			gloss: { ja: 'ありがとうございます', en: 'thank you very much' },
			category: 'interjection',
			pos: 'interj',
			note: {
				ja: '語構成は i-yay-rayke-re（自分を・殺す・させる）。「あなたの親切に、自分を殺してしまいそうなほど」という大げさな言い回しに由来する、ていねいな感謝の言葉。軽い「ありがとう」は hioy\'oy（田村1996）。',
				en: 'Built from i-yay-rayke-re (self + kill + causative) — a hyperbolic \'I could kill myself (over your kindness)\' that became the polite, formal \'thank you\'. For light, everyday thanks Ainu uses hioy\'oy instead (Tamura 1996).'
			}
		},
		v_hioyoy: {
			id: 'v_hioyoy',
			latin: "hioy'oy",
			gloss: { ja: 'ありがとう', en: 'thank you' },
			category: 'interjection',
			pos: 'interj',
			note: {
				ja: 'ちょっとしたことへの軽い「ありがとう」。中川（千歳）では iyairaykere の類義語とされる。ていねいに言うなら iyairaykere。',
				en: 'The light everyday \'thanks\' for small favors; Nakagawa\'s Chitose dictionary lists it as a synonym of iyairaykere. Use iyairaykere for fuller, more polite thanks.'
			}
		},
		v_aynu: {
			id: 'v_aynu',
			latin: 'aynu',
			gloss: { ja: '人、人間；アイヌ', en: 'person, human; Ainu' },
			category: 'life',
			pos: 'n'
		},
		v_menoko: {
			id: 'v_menoko',
			latin: 'menoko',
			gloss: { ja: '女、女性', en: 'woman' },
			category: 'life',
			pos: 'n'
		},
		v_okkayo: {
			id: 'v_okkayo',
			latin: 'okkayo',
			gloss: { ja: '男、男性', en: 'man' },
			category: 'life',
			pos: 'n',
			note: {
				ja: '女性 menoko に対する語。一人前の男を指す（萱野・田村）。',
				en: "Counterpart of menoko 'woman'; an adult man (Kayano / Tamura)."
			}
		},
		v_hekattar: {
			id: 'v_hekattar',
			latin: 'hekattar',
			gloss: { ja: '子どもたち', en: 'children' },
			category: 'life',
			pos: 'n',
			note: {
				ja: 'hekaci「子」＋ útar「たち」。もともと複数。',
				en: 'From hekaci "child" + útar "-s"; inherently plural.'
			}
		},
		v_hapo: {
			id: 'v_hapo',
			latin: 'hápo',
			gloss: { ja: 'おかあさん、母', en: 'mother, mom' },
			category: 'life',
			pos: 'n',
			note: {
				ja: '「母」のふつうの言い方。同義に totto（より口語的）や unu。千歳・幌別など一部の方言では「父」も hápo と言う（知里1987）。',
				en: 'The ordinary word for \'mother\'; near-synonyms are totto (more colloquial) and unu. In some Chitose/Horobetsu varieties hápo can also mean \'father\' (Chiri 1987).'
			}
		},
		v_totto: {
			id: 'v_totto',
			latin: 'totto',
			gloss: { ja: 'おかあさん（幼児語）', en: 'mom (children’s word)' },
			category: 'life',
			pos: 'n',
			note: {
				ja: 'hápo と並ぶ「母」の言い方（千歳など）。',
				en: 'Another word for "mother" (Chitose etc.), alongside hápo.'
			}
		},
		v_mici: {
			id: 'v_mici',
			latin: 'míci',
			gloss: { ja: 'おとうさん、父', en: 'father, dad' },
			category: 'life',
			pos: 'n',
			note: {
				ja: '沙流など太平洋岸で広く使う「父」。',
				en: 'Word for "father" common along the Pacific coast (Saru etc.).'
			}
		},
		v_kor: {
			id: 'v_kor',
			latin: 'kor',
			gloss: { ja: '〜を持つ；〜の', en: 'to have; ’s (possessive)' },
			category: 'general_verb',
			pos: 'vt',
			note: {
				ja: 'ku=kor míci「私の父」のように所有を表す。',
				en: 'Marks possession, e.g. ku=kor míci "my father".'
			}
		},
		v_ku_pers: {
			id: 'v_ku_pers',
			latin: 'ku=',
			gloss: { ja: '私が（人称接辞）', en: 'I (subject affix)' },
			pos: 'pers',
			note: {
				ja: '動詞の前につく一人称「私」。ku=e「私が食べる」。',
				en: 'First-person "I" prefixed to a verb: ku=e "I eat".'
			}
		},
		v_e_pers: {
			id: 'v_e_pers',
			latin: 'e=',
			gloss: { ja: 'あなたが（人称接辞）', en: 'you sg. (subject affix)' },
			pos: 'pers',
			note: {
				ja: '動詞の前につく二人称「あなた」。e=e「あなたが食べる」。',
				en: 'Second-person "you" prefixed to a verb: e=e "you eat".'
			}
		},
		v_rehe: {
			id: 'v_rehe',
			latin: 'rehe',
			gloss: { ja: '名前', en: 'name' },
			category: 'general_noun',
			pos: 'n',
			note: {
				ja: 're「名」の所属形。… sekor ku=rehe an「私の名は…です」。',
				en: 'Possessed form of re "name". "... sekor ku=rehe an" = "my name is ...".'
			}
		},

		// --- Unit 1: "how are you?" & goodbyes (MCP-verified greetings) ---
		v_iwanke: {
			id: 'v_iwanke',
			latin: 'iwanke',
			gloss: { ja: '元気だ、達者だ、健康だ', en: 'to be well, healthy' },
			category: 'general_verb',
			pos: 'vi',
			note: {
				ja: '副詞形 iwankeno「元気で」が挨拶の核。iwankeno e=an ruwe?「お元気ですか？」。',
				en: "Its adverbial form iwankeno ('in good health') is the core of the greeting iwankeno e=an ruwe? — 'Are you well?'."
			}
		},
		v_an: {
			id: 'v_an',
			latin: 'an',
			gloss: { ja: 'いる、ある、存在する（単数）', en: 'to be, exist, stay (singular)' },
			category: 'general_verb',
			pos: 'vi',
			note: {
				ja: '単数主語の存在動詞。複数主語には oka。e=an「あなたがいる」、k=an（=ku=an）「私がいる」。',
				en: "Singular existential verb; plural subjects take oka. e=an 'you are', k=an (= ku=an) 'I am'."
			}
		},
		v_an_pers: {
			id: 'v_an_pers',
			latin: '=an',
			gloss: { ja: '私たちが（一人称複数・包括／不定人称）', en: 'we (1pl-inclusive / indefinite subject affix)' },
			pos: 'pers',
			note: {
				ja: '自動詞に付く包括的一人称複数（不定人称）の主語接辞。unukar=an「私たちが会う」。勧誘の ro とともに使う。',
				en: "Inclusive 1pl (or indefinite) intransitive-subject affix: unukar=an 'we meet'. Often paired with the hortative ro."
			}
		},
		v_ruwe: {
			id: 'v_ruwe',
			latin: 'ruwe',
			gloss: { ja: '〜のだ／〜なの（ですか）（形式名詞）', en: 'nominalizer; final ruwe? softens a question' },
			pos: 'particle',
			note: {
				ja: '形式名詞。文末の ruwe? は「〜なの（ですか）」と確認するやわらかい問い。ruwe ne なら平叙「〜のだ」。',
				en: "Formal noun; sentence-final ruwe? makes a soft, evidential question, while ruwe ne is the declarative 'it is that…'."
			}
		},
		v_apunno: {
			id: 'v_apunno',
			latin: 'apunno',
			gloss: { ja: '穏やかに、無事に、静かに', en: 'peacefully, safely, quietly' },
			pos: 'adv',
			note: {
				ja: '別れの挨拶で使う副詞「無事に」。hapur「柔らかい」由来とする説は田村1996の推定にとどまる。',
				en: "Farewell adverb 'safely, without incident'. A derivation from hapur 'soft' is only Tamura's (1996) tentative conjecture."
			}
		},
		v_oka: {
			id: 'v_oka',
			latin: 'oka',
			gloss: { ja: 'いる、暮らす（複数主語）', en: 'to be / live / stay (plural subject)' },
			category: 'general_verb',
			pos: 'vi',
			note: {
				ja: '単数 an の複数形（補充形）。複数・敬意の相手に apunno oka yan「お元気で」。',
				en: "Suppletive plural of an (singular). For plural/polite addressees: apunno oka yan 'stay well'."
			}
		},
		v_paye: {
			id: 'v_paye',
			latin: 'paye',
			gloss: { ja: '行く（複数主語）', en: 'to go (plural subject)' },
			category: 'general_verb',
			pos: 'vi',
			note: {
				ja: '単数 arpa の複数形（補充形）。apunno paye yan「無事に行ってください」。',
				en: "Suppletive plural of singular arpa 'go'. apunno paye yan 'go safely'."
			}
		},
		v_yan: {
			id: 'v_yan',
			latin: 'yan',
			gloss: { ja: '〜なさい／〜てください（丁寧・複数の命令）', en: 'please … (polite / plural imperative particle)' },
			pos: 'particle',
			note: {
				ja: '命令の終助詞。複数の相手や目上の一人に丁寧に命じ、単複のある動詞は複数形（oka, paye）を取る。',
				en: 'Sentence-final imperative particle for plural addressees or a single superior; selects the plural verb stem (oka, paye).'
			}
		},
		v_suy: {
			id: 'v_suy',
			latin: 'suy',
			gloss: { ja: 'また、再び', en: 'again, once more' },
			pos: 'adv',
			note: {
				ja: '副詞「また」。kanna suy とも。suy unukar=an ro「また会いましょう」。',
				en: "Adverb 'again, once more' (also kanna suy). suy unukar=an ro 'let's meet again'."
			}
		},
		v_unukar: {
			id: 'v_unukar',
			latin: 'unukar',
			gloss: { ja: '互いに会う、顔を合わせる', en: 'to meet (each other)' },
			category: 'general_verb',
			pos: 'vi',
			note: {
				ja: 'u-（互い）＋ nukar（を見る）＝相会う。別れ際に suy unukar=an ro「また会いましょう」。',
				en: "u- (each other) + nukar (look at) = meet one another. At parting: suy unukar=an ro 'let's meet again'."
			}
		},
		v_ro: {
			id: 'v_ro',
			latin: 'ro',
			gloss: { ja: '〜しよう、〜しましょう（勧誘）', en: "let's … (hortative final particle)" },
			pos: 'particle',
			note: {
				ja: '文末の勧誘助詞。包括的一人称複数 =an とともに使うことが最も多い。paye=an ro「行きましょう」。',
				en: "Sentence-final hortative; most often used with the inclusive 1pl =an: paye=an ro 'let's go'."
			}
		},

		// --- Unit 2: animals & nature ---
		v_seta: {
			id: 'v_seta',
			latin: 'seta',
			gloss: { ja: '犬', en: 'dog' },
			category: 'biology_animals',
			pos: 'n'
		},
		v_cape: {
			id: 'v_cape',
			latin: 'cápe',
			gloss: { ja: '猫', en: 'cat' },
			category: 'biology_animals',
			pos: 'n'
		},
		v_cikap: {
			id: 'v_cikap',
			latin: 'cikap',
			gloss: { ja: '鳥', en: 'bird' },
			category: 'biology_animals',
			pos: 'n'
		},
		v_cep: {
			id: 'v_cep',
			latin: 'cep',
			gloss: { ja: '魚；サケ', en: 'fish; salmon' },
			category: 'biology_animals',
			pos: 'n',
			note: {
				ja: '語源は ci-e-p「我々が食べるもの」。',
				en: 'Literally "the thing we eat" (ci-e-p).'
			}
		},
		v_yuk: {
			id: 'v_yuk',
			latin: 'yuk',
			gloss: { ja: 'シカ', en: 'deer' },
			category: 'biology_animals',
			pos: 'n'
		},
		v_kamuy: {
			id: 'v_kamuy',
			latin: 'kamuy',
			gloss: { ja: '神；クマ', en: 'god, kamuy; bear' },
			category: 'nature',
			pos: 'n',
			note: {
				ja: '本来「神」。文脈によりヒグマも指す。',
				en: 'Primarily "god/spirit"; also "bear" in context.'
			}
		},
		v_poro: {
			id: 'v_poro',
			latin: 'poro',
			gloss: { ja: '大きい', en: 'big, large' },
			category: 'general_modifier',
			pos: 'vi',
			note: {
				ja: '自動詞。poro nupuri「大きな山」。',
				en: 'Intransitive verb: poro nupuri "a big mountain".'
			}
		},
		v_cup: {
			id: 'v_cup',
			latin: 'cup',
			gloss: { ja: '太陽；月', en: 'sun; moon' },
			category: 'nature',
			pos: 'n',
			note: {
				ja: 'tokap cup「太陽」、kunne cup「月」。',
				en: 'tokap cup "sun", kunne cup "moon".'
			}
		},
		v_wakka: {
			id: 'v_wakka',
			latin: 'wakka',
			gloss: { ja: '水', en: 'water' },
			category: 'nature',
			pos: 'n'
		},
		v_to: {
			id: 'v_to',
			latin: 'to',
			gloss: { ja: '湖、沼', en: 'lake, pond' },
			category: 'nature',
			pos: 'n'
		},
		v_pet: {
			id: 'v_pet',
			latin: 'pet',
			gloss: { ja: '川', en: 'river' },
			category: 'nature',
			pos: 'n'
		},
		v_nonno: {
			id: 'v_nonno',
			latin: 'nonno',
			gloss: { ja: '花', en: 'flower' },
			category: 'biology_plants',
			pos: 'n'
		},
		v_nupuri: {
			id: 'v_nupuri',
			latin: 'nupuri',
			gloss: { ja: '山', en: 'mountain' },
			category: 'nature',
			pos: 'n'
		},
		v_pirka: {
			id: 'v_pirka',
			latin: 'pirka',
			gloss: { ja: 'よい、美しい', en: 'good, beautiful' },
			category: 'general_modifier',
			pos: 'vi',
			note: {
				ja: '自動詞。「よい・きれい・元気だ」など幅広い。',
				en: 'Intransitive verb covering "good, beautiful, well".'
			}
		},
		v_retar: {
			id: 'v_retar',
			latin: 'retar',
			gloss: { ja: '白い', en: 'white' },
			category: 'colour',
			pos: 'vi'
		},

		// --- Unit 3: food & daily life ---
		v_sito: {
			id: 'v_sito',
			latin: 'sito',
			gloss: { ja: '団子、餅', en: 'dumpling, rice cake' },
			category: 'food',
			pos: 'n'
		},
		v_kam: {
			id: 'v_kam',
			latin: 'kam',
			gloss: { ja: '肉', en: 'meat' },
			category: 'food',
			pos: 'n'
		},
		v_amam: {
			id: 'v_amam',
			latin: 'amam',
			gloss: { ja: '穀物、米', en: 'grain, rice' },
			category: 'food',
			pos: 'n'
		},
		v_ipe: {
			id: 'v_ipe',
			latin: 'ipe',
			gloss: { ja: '食事する；食べ物', en: 'to have a meal; food' },
			category: 'food',
			pos: 'vi',
			note: {
				ja: '自動詞「食事をする」。目的語をとる「食べる」は e。',
				en: 'Intransitive "to dine"; transitive "to eat (sth)" is e.'
			}
		},
		v_e_eat: {
			id: 'v_e_eat',
			latin: 'e',
			gloss: { ja: '〜を食べる', en: 'to eat (sth)' },
			category: 'food',
			pos: 'vt',
			note: {
				ja: '他動詞。ku=e「私が食べる」、e=e「あなたが食べる」。',
				en: 'Transitive verb: ku=e "I eat", e=e "you eat".'
			}
		},
		v_ku_drink: {
			id: 'v_ku_drink',
			latin: 'ku',
			gloss: { ja: '〜を飲む', en: 'to drink (sth)' },
			category: 'food',
			pos: 'vt',
			note: {
				ja: '他動詞。wakka ku=ku「私が水を飲む」。',
				en: 'Transitive verb: wakka ku=ku "I drink water".'
			}
		},
		v_rusuy: {
			id: 'v_rusuy',
			latin: 'rusuy',
			gloss: { ja: '〜したい', en: 'to want to (do)' },
			category: 'general_verb',
			pos: 'aux',
			note: {
				ja: '動詞の後ろに置く。ku=e rusuy「私は食べたい」。',
				en: 'Placed after a verb: ku=e rusuy "I want to eat".'
			}
		},
		v_cise: {
			id: 'v_cise',
			latin: 'cise',
			gloss: { ja: '家', en: 'house, home' },
			category: 'place',
			pos: 'n'
		},
		v_upopo: {
			id: 'v_upopo',
			latin: 'upopo',
			gloss: { ja: '座り歌、ウポポ', en: 'sitting song (upopo)' },
			category: 'general_noun',
			pos: 'n',
			note: {
				ja: '輪になって器の蓋を叩きながら歌う伝統的な歌。',
				en: 'A traditional round-song sung while drumming a vessel lid.'
			}
		}
	},

	sentences: {
		// --- Unit 1 ---
		s_001: {
			id: 's_001',
			latin: 'irankarapte.',
			translation: { ja: 'こんにちは。', en: 'Hello.' },
			vocab: ['v_irankarapte'],
			dialect: '沙流',
			source: 'zaidan-radio/2023/1/01#0',
			convo: {
				prompt: '（人に会ったときの最初のあいさつ）',
				options: ['irankarapte.', 'iyairaykere.', "hioy'oy.", 'pirka.']
			}
		},
		s_002: {
			id: 's_002',
			latin: 'iyairaykere.',
			translation: { ja: 'ありがとうございます。', en: 'Thank you very much.' },
			vocab: ['v_iyairaykere'],
			convo: {
				prompt: '（何かをしてもらったときに言う言葉は？）',
				options: ['iyairaykere.', 'irankarapte.', 'aynu.', 'wakka.']
			}
		},
		s_003: {
			id: 's_003',
			latin: 'aynu ku=ne.',
			translation: { ja: '私は人間（アイヌ）です。', en: 'I am a person (Ainu).' },
			vocab: ['v_aynu', 'v_ku_pers'],
			blank: { answer: 'aynu', options: ['aynu', 'menoko', 'seta', 'cikap'] }
		},
		s_004: {
			id: 's_004',
			latin: 'ku=kor hápo.',
			translation: { ja: '私のおかあさん。', en: 'My mother.' },
			vocab: ['v_kor', 'v_hapo', 'v_ku_pers'],
			blank: { answer: 'hápo', options: ['hápo', 'míci', 'aynu', 'cise'] }
		},
		s_005: {
			id: 's_005',
			latin: 'ku=míci iwanke wa.',
			translation: { ja: '私の父は元気ですよ。', en: 'My father is well, you know.' },
			vocab: ['v_mici', 'v_ku_pers'],
			dialect: '幌別',
			source: 'zaidan-radio/2001/4/21#1',
			blank: { answer: 'ku=míci', options: ['ku=míci', 'ku=hápo', 'ku=rehe', 'ku=cise'] }
		},
		s_006: {
			id: 's_006',
			latin: 'Maki sekor ku=rehe an.',
			translation: { ja: '私の名前はマキです。', en: 'My name is Maki.' },
			vocab: ['v_rehe', 'v_ku_pers'],
			dialect: '沙流',
			source: 'express-new/04#1',
			blank: { answer: 'ku=rehe', options: ['ku=rehe', 'ku=míci', 'ku=hápo', 'ku=cise'] }
		},
		s_007: {
			id: 's_007',
			latin: 'menoko ku=ne.',
			translation: { ja: '私は女です。', en: 'I am a woman.' },
			vocab: ['v_menoko', 'v_ku_pers'],
			convo: {
				prompt: 'hemanta e=ne? （あなたは何ですか／だれですか？）',
				options: ['menoko ku=ne.', 'wakka ku=ku.', 'cep ku=e.', 'irankarapte.']
			}
		},
		s_okkayo: {
			id: 's_okkayo',
			latin: 'okkayo ku=ne.',
			translation: { ja: '私は男です。', en: 'I am a man.' },
			vocab: ['v_okkayo', 'v_ku_pers']
		},

		// --- Unit 1: "how are you?" & goodbyes ---
		s_023: {
			id: 's_023',
			latin: 'iwankeno e=an ruwe?',
			translation: { ja: 'お元気ですか？', en: 'How are you? (Are you well?)' },
			vocab: ['v_iwanke', 'v_e_pers', 'v_an', 'v_ruwe'],
			dialect: '沙流',
			source: 'ninjal-dict/060#35',
			blank: { answer: 'e=an', options: ['e=an', 'k=an', 'e=ne', 'e=kor'] }
		},
		s_024: {
			id: 's_024',
			latin: 'iyairaykere, iwankeno k=an wa.',
			translation: { ja: 'ありがとう。私は元気でいますよ。', en: "Thank you. I'm doing well, you know." },
			vocab: ['v_iyairaykere', 'v_iwanke', 'v_ku_pers', 'v_an'],
			dialect: '沙流',
			source: 'ninjal-dict/055#12',
			convo: {
				prompt: 'iwankeno e=an ruwe? （お元気ですか？）',
				options: [
					'iyairaykere, iwankeno k=an wa.',
					'apunno oka yan.',
					'suy unukar=an ro.',
					'menoko ku=ne.'
				]
			}
		},
		s_025: {
			id: 's_025',
			latin: 'apunno oka yan.',
			translation: {
				ja: 'お元気で（つつがなくいてくださいね）。※去る人が残る人に言う。',
				en: 'Goodbye — stay well. (Said by the one leaving to those staying.)'
			},
			vocab: ['v_apunno', 'v_oka', 'v_yan'],
			dialect: '沙流',
			source: 'kayano-dict/apunno-oka',
			convo: {
				prompt: '（その場を去るとき、残る人にかける別れの言葉は？）',
				options: ['apunno oka yan.', 'apunno paye yan.', 'irankarapte.', 'iwankeno k=an wa.']
			}
		},
		s_026: {
			id: 's_026',
			latin: 'apunno paye yan.',
			translation: {
				ja: '無事に行ってくださいね。※残る人が去る人に言う。',
				en: 'Goodbye — go safely. (Said by those staying to the one leaving.)'
			},
			vocab: ['v_apunno', 'v_paye', 'v_yan'],
			dialect: '沙流',
			source: 'express-cd/006#29',
			convo: {
				prompt: '（自分は残り、去っていく人を見送るときの別れの言葉は？）',
				options: ['apunno paye yan.', 'apunno oka yan.', 'irankarapte.', 'suy unukar=an ro.']
			}
		},
		s_027: {
			id: 's_027',
			latin: 'suy unukar=an ro.',
			translation: { ja: 'また会いましょう。', en: "Let's meet again. / See you again." },
			vocab: ['v_suy', 'v_unukar', 'v_an_pers', 'v_ro'],
			dialect: '沙流',
			source: 'zaidan-radio/2018/4/53#1',
			blank: { answer: 'ro', options: ['ro', 'wa', 'yan', 'ruwe'] }
		},

		// --- Unit 2 ---
		s_008: {
			id: 's_008',
			latin: 'seta an.',
			translation: { ja: '犬がいる。', en: 'There is a dog.' },
			vocab: ['v_seta'],
			dialect: '沙流',
			source: 'ainu-times/015/1#3',
			blank: { answer: 'seta', options: ['seta', 'cápe', 'cikap', 'yuk'] }
		},
		s_009: {
			id: 's_009',
			latin: 'tan cikap pirka.',
			translation: { ja: 'この鳥はきれいだ。', en: 'This bird is beautiful.' },
			vocab: ['v_cikap', 'v_pirka'],
			blank: { answer: 'cikap', options: ['cikap', 'cápe', 'cep', 'nonno'] }
		},
		s_010: {
			id: 's_010',
			latin: 'yuk an.',
			translation: { ja: 'シカがいる。', en: 'There is a deer.' },
			vocab: ['v_yuk'],
			blank: { answer: 'yuk', options: ['yuk', 'kamuy', 'seta', 'cep'] }
		},
		s_011: {
			id: 's_011',
			latin: 'kamuy poro.',
			translation: { ja: 'クマ（神）は大きい。', en: 'The bear (kamuy) is big.' },
			vocab: ['v_kamuy', 'v_poro'],
			blank: { answer: 'poro', options: ['poro', 'pirka', 'retar', 'an'] }
		},
		s_012: {
			id: 's_012',
			latin: 'wakka pirka.',
			translation: { ja: '水がきれいだ。', en: 'The water is clean.' },
			vocab: ['v_wakka', 'v_pirka'],
			blank: { answer: 'wakka', options: ['wakka', 'cup', 'to', 'kam'] }
		},
		s_013: {
			id: 's_013',
			latin: 'cup pirka.',
			translation: { ja: '太陽が美しい。', en: 'The sun is beautiful.' },
			vocab: ['v_cup', 'v_pirka'],
			blank: { answer: 'cup', options: ['cup', 'pet', 'to', 'wakka'] }
		},
		s_014: {
			id: 's_014',
			latin: 'toan nonno pirka ruwe.',
			translation: { ja: 'あの花はきれいだな。', en: 'That flower is beautiful.' },
			vocab: ['v_nonno', 'v_pirka'],
			dialect: '鵡川',
			source: 'chiba-mukawa/0#4406',
			blank: { answer: 'nonno', options: ['nonno', 'nupuri', 'cikap', 'cise'] }
		},
		s_015: {
			id: 's_015',
			latin: 'nupuri poro.',
			translation: { ja: '山が大きい。', en: 'The mountain is big.' },
			vocab: ['v_nupuri', 'v_poro'],
			blank: { answer: 'nupuri', options: ['nupuri', 'pet', 'to', 'nonno'] }
		},

		// --- Unit 3 ---
		s_016: {
			id: 's_016',
			latin: 'sito ku=e rusuy.',
			translation: { ja: '私は団子を食べたい。', en: 'I want to eat dumplings.' },
			vocab: ['v_sito', 'v_e_eat', 'v_ku_pers', 'v_rusuy'],
			dialect: '静内',
			source: 'zaidan-radio/2005/1/02#0',
			blank: { answer: 'sito', options: ['sito', 'kam', 'amam', 'cep'] }
		},
		s_017: {
			id: 's_017',
			latin: 'kamuy cep ku=e rusuy.',
			translation: { ja: '私はサケを食べたい。', en: 'I want to eat salmon.' },
			vocab: ['v_cep', 'v_e_eat', 'v_ku_pers', 'v_rusuy'],
			dialect: '十勝',
			source: 'zaidan-radio/2000/4/07#1',
			blank: { answer: 'cep', options: ['cep', 'sito', 'kam', 'wakka'] }
		},
		s_018: {
			id: 's_018',
			latin: 'wakka ku=ku.',
			translation: { ja: '私は水を飲む。', en: 'I drink water.' },
			vocab: ['v_wakka', 'v_ku_drink', 'v_ku_pers'],
			dialect: '様似',
			source: 'zaidan-radio/2006/1/08#0',
			blank: { answer: 'ku=ku', options: ['ku=ku', 'ku=e', 'ku=ne', 'ku=kor'] }
		},
		s_019: {
			id: 's_019',
			latin: 'cep ku=e.',
			translation: { ja: '私は魚を食べる。', en: 'I eat fish.' },
			vocab: ['v_cep', 'v_e_eat', 'v_ku_pers'],
			dialect: '浦河',
			source: 'zaidan-radio/2013/1/10#3',
			convo: {
				prompt: 'hemanta e=e rusuy? （あなたは何を食べたい？）',
				options: ['cep ku=e.', 'wakka ku=ku.', 'irankarapte.', 'seta an.']
			}
		},
		s_020: {
			id: 's_020',
			latin: 'wakka ku=ku rusuy.',
			translation: { ja: '私は水を飲みたい。', en: 'I want to drink water.' },
			vocab: ['v_wakka', 'v_ku_drink', 'v_ku_pers', 'v_rusuy'],
			dialect: '白老',
			source: 'zaidan-radio/2017/2/21#4',
			blank: { answer: 'rusuy', options: ['rusuy', 'wa', 'an', 'ne'] }
		},
		s_021: {
			id: 's_021',
			latin: 'tan cise poro.',
			translation: { ja: 'この家は大きい。', en: 'This house is big.' },
			vocab: ['v_cise', 'v_poro'],
			blank: { answer: 'cise', options: ['cise', 'cikap', 'nonno', 'sito'] }
		},
		s_022: {
			id: 's_022',
			latin: 'menoko upopo.',
			translation: { ja: '女がウポポ（座り歌）を歌う。', en: 'The women sing upopo.' },
			vocab: ['v_menoko', 'v_upopo'],
			dialect: '沙流',
			source: 'nakagawa-dict/upopo (N8806202.UP)',
			blank: { answer: 'upopo', options: ['upopo', 'cise', 'wakka', 'kam'] }
		}
	},

	stories: {
		st_greet: {
			id: 'st_greet',
			title: { ja: 'はじめまして', en: 'Nice to meet you' },
			lines: [
				{
					speaker: 'Maki',
					latin: 'irankarapte.',
					translation: { ja: 'こんにちは。', en: 'Hello.' }
				},
				{
					speaker: 'Kenji',
					latin: 'irankarapte. Kenji sekor ku=rehe an.',
					translation: { ja: 'こんにちは。私の名前はケンジです。', en: 'Hello. My name is Kenji.' }
				},
				{
					speaker: 'Maki',
					latin: 'Maki sekor ku=rehe an.',
					translation: { ja: '私の名前はマキです。', en: 'My name is Maki.' }
				},
				{
					speaker: 'Kenji',
					latin: 'aynu itak ku=eyaypakasnu.',
					translation: {
						ja: '私はアイヌ語を勉強しています。',
						en: 'I am learning the Ainu language.'
					}
				},
				{
					speaker: 'Maki',
					latin: "pirka! hioy'oy.",
					translation: { ja: 'いいですね！ありがとう。', en: 'Wonderful! Thank you.' }
				}
			],
			questions: [
				{
					prompt: { ja: '「私の名前は…です」はどれ？', en: 'Which one means "my name is ..."?' },
					answer: 'Kenji sekor ku=rehe an.',
					options: [
						'Kenji sekor ku=rehe an.',
						'wakka ku=ku.',
						'seta an.',
						'cep ku=e rusuy.'
					]
				},
				{
					prompt: { ja: 'ケンジは何をしている？', en: 'What is Kenji doing?' },
					answer: 'aynu itak ku=eyaypakasnu.',
					options: [
						'aynu itak ku=eyaypakasnu.',
						'sito ku=e rusuy.',
						'cup pirka.',
						'menoko upopo.'
					]
				}
			]
		},
		st_ipe: {
			id: 'st_ipe',
			title: { ja: 'いただきます', en: 'Let us eat' },
			lines: [
				{
					speaker: 'hápo',
					latin: 'hemanta e=e rusuy?',
					translation: { ja: '何が食べたい？', en: 'What do you want to eat?' }
				},
				{
					speaker: 'poho',
					latin: 'cep ku=e rusuy.',
					translation: { ja: '魚を食べたい。', en: 'I want to eat fish.' }
				},
				{
					speaker: 'hápo',
					latin: 'sito ka an wa.',
					translation: { ja: '団子もあるよ。', en: 'There are dumplings too.' }
				},
				{
					speaker: 'poho',
					latin: 'wakka ku=ku rusuy.',
					translation: { ja: '水も飲みたい。', en: 'I also want to drink water.' }
				},
				{
					speaker: 'hápo',
					latin: "pirka! hioy'oy.",
					translation: { ja: 'いいよ！ありがとう。', en: 'Good! Thank you.' }
				}
			],
			questions: [
				{
					prompt: { ja: '子どもは何を食べたい？', en: 'What does the child want to eat?' },
					answer: 'cep ku=e rusuy.',
					options: [
						'cep ku=e rusuy.',
						'wakka ku=ku.',
						'seta an.',
						'irankarapte.'
					]
				},
				{
					prompt: { ja: '子どもは何を飲みたい？', en: 'What does the child want to drink?' },
					answer: 'wakka ku=ku rusuy.',
					options: [
						'wakka ku=ku rusuy.',
						'sito ku=e rusuy.',
						'cup pirka.',
						'nupuri poro.'
					]
				}
			]
		}
	}
};
