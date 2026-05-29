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
								id: 'u1n2',
								type: 'lesson',
								title: { ja: '人とアイヌ', en: 'People & Ainu' },
								levels: 2,
								vocab: ['v_aynu', 'v_menoko', 'v_hekattar'],
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
								sentences: ['s_006', 's_007']
							},
							{
								id: 'u1n5',
								type: 'review',
								title: { ja: '復習', en: 'Review' },
								vocab: ['v_irankarapte', 'v_aynu', 'v_hapo', 'v_mici', 'v_rehe'],
								sentences: ['s_002', 's_005', 's_007']
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
				ja: '出会ったときの基本のあいさつ。',
				en: 'The standard greeting on meeting someone.'
			}
		},
		v_iyairaykere: {
			id: 'v_iyairaykere',
			latin: 'iyairaykere',
			gloss: { ja: 'ありがとうございます', en: 'thank you very much' },
			category: 'interjection',
			pos: 'interj'
		},
		v_hioyoy: {
			id: 'v_hioyoy',
			latin: "hioy'oy",
			gloss: { ja: 'ありがとう', en: 'thank you' },
			category: 'interjection',
			pos: 'interj',
			note: {
				ja: 'iyairaykere より気軽な「ありがとう」。',
				en: 'A more casual "thanks" than iyairaykere.'
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
		v_hekattar: {
			id: 'v_hekattar',
			latin: 'hekattar',
			gloss: { ja: '子どもたち', en: 'children' },
			category: 'life',
			pos: 'n',
			note: {
				ja: 'hekaci「子」＋ utar「たち」。もともと複数。',
				en: 'From hekaci "child" + utar "-s"; inherently plural.'
			}
		},
		v_hapo: {
			id: 'v_hapo',
			latin: 'hapo',
			gloss: { ja: 'おかあさん、母', en: 'mother, mom' },
			category: 'life',
			pos: 'n'
		},
		v_totto: {
			id: 'v_totto',
			latin: 'totto',
			gloss: { ja: 'おかあさん（幼児語）', en: 'mom (children’s word)' },
			category: 'life',
			pos: 'n',
			note: {
				ja: 'hapo と並ぶ「母」の言い方（千歳など）。',
				en: 'Another word for "mother" (Chitose etc.), alongside hapo.'
			}
		},
		v_mici: {
			id: 'v_mici',
			latin: 'mici',
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
				ja: 'ku=kor mici「私の父」のように所有を表す。',
				en: 'Marks possession, e.g. ku=kor mici "my father".'
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
			latin: 'cape',
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
			latin: 'ku=kor hapo.',
			translation: { ja: '私のおかあさん。', en: 'My mother.' },
			vocab: ['v_kor', 'v_hapo', 'v_ku_pers'],
			blank: { answer: 'hapo', options: ['hapo', 'mici', 'aynu', 'cise'] }
		},
		s_005: {
			id: 's_005',
			latin: 'ku=mici iwanke wa.',
			translation: { ja: '私の父は元気ですよ。', en: 'My father is well, you know.' },
			vocab: ['v_mici', 'v_ku_pers'],
			dialect: '幌別',
			source: 'zaidan-radio/2001/4/21#1',
			blank: { answer: 'ku=mici', options: ['ku=mici', 'ku=hapo', 'ku=rehe', 'ku=cise'] }
		},
		s_006: {
			id: 's_006',
			latin: 'Maki sekor ku=rehe an.',
			translation: { ja: '私の名前はマキです。', en: 'My name is Maki.' },
			vocab: ['v_rehe', 'v_ku_pers'],
			dialect: '沙流',
			source: 'express-new/04#1',
			blank: { answer: 'ku=rehe', options: ['ku=rehe', 'ku=mici', 'ku=hapo', 'ku=cise'] }
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

		// --- Unit 2 ---
		s_008: {
			id: 's_008',
			latin: 'seta an.',
			translation: { ja: '犬がいる。', en: 'There is a dog.' },
			vocab: ['v_seta'],
			dialect: '沙流',
			source: 'ainu-times/015/1#3',
			blank: { answer: 'seta', options: ['seta', 'cape', 'cikap', 'yuk'] }
		},
		s_009: {
			id: 's_009',
			latin: 'tan cikap pirka.',
			translation: { ja: 'この鳥はきれいだ。', en: 'This bird is beautiful.' },
			vocab: ['v_cikap', 'v_pirka'],
			blank: { answer: 'cikap', options: ['cikap', 'cape', 'cep', 'nonno'] }
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
					speaker: 'hapo',
					latin: 'hemanta e=e rusuy?',
					translation: { ja: '何が食べたい？', en: 'What do you want to eat?' }
				},
				{
					speaker: 'poho',
					latin: 'cep ku=e rusuy.',
					translation: { ja: '魚を食べたい。', en: 'I want to eat fish.' }
				},
				{
					speaker: 'hapo',
					latin: 'sito ka an wa.',
					translation: { ja: '団子もあるよ。', en: 'There are dumplings too.' }
				},
				{
					speaker: 'poho',
					latin: 'wakka ku=ku rusuy.',
					translation: { ja: '水も飲みたい。', en: 'I also want to drink water.' }
				},
				{
					speaker: 'hapo',
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
