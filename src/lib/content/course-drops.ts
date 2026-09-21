/**
 * Vocabulary topics adapted from Drops, with dictionary-based spellings and senses.
 * Hand-curated separately from scripts/build-course.ts.
 */
import type { Section, Vocab } from './types';

export const dropsVocab: Record<string, Vocab> = {
	"v_sapa": {
		"id": "v_sapa",
		"latin": "sapa",
		"gloss": {
			"ja": "頭（人・獣・鳥・魚などの首から上の頭部全体）",
			"en": "head"
		},
		"category": "body",
		"pos": "n"
	},
	"v_otop": {
		"id": "v_otop",
		"latin": "otop",
		"gloss": {
			"ja": "髪、毛髪（頭髪）",
			"en": "hair (on the head)"
		},
		"category": "body",
		"pos": "n"
	},
	"v_nan": {
		"id": "v_nan",
		"latin": "nan",
		"gloss": {
			"ja": "顔",
			"en": "face"
		},
		"category": "body",
		"pos": "n"
	},
	"v_kisar": {
		"id": "v_kisar",
		"latin": "kisar",
		"gloss": {
			"ja": "耳（また鍋・行器・鉢などの両側の突起）",
			"en": "ear(s)"
		},
		"category": "body",
		"pos": "n"
	},
	"v_sik": {
		"id": "v_sik",
		"latin": "sik",
		"gloss": {
			"ja": "目",
			"en": "eye(s)"
		},
		"category": "body",
		"pos": "n"
	},
	"v_etu": {
		"id": "v_etu",
		"latin": "etu",
		"gloss": {
			"ja": "鼻（また、くちばし、先端）",
			"en": "nose; beak; tip"
		},
		"category": "body",
		"pos": "n"
	},
	"v_par": {
		"id": "v_par",
		"latin": "par",
		"gloss": {
			"ja": "口",
			"en": "mouth"
		},
		"category": "body",
		"pos": "n"
	},
	"v_nimak": {
		"id": "v_nimak",
		"latin": "nimak",
		"gloss": {
			"ja": "歯",
			"en": "tooth"
		},
		"category": "body",
		"pos": "n"
	},
	"v_parunpe": {
		"id": "v_parunpe",
		"latin": "parunpe",
		"gloss": {
			"ja": "舌",
			"en": "tongue"
		},
		"category": "body",
		"pos": "n"
	},
	"v_tek": {
		"id": "v_tek",
		"latin": "tek",
		"gloss": {
			"ja": "手",
			"en": "hand"
		},
		"category": "body",
		"pos": "n"
	},
	"v_askepet": {
		"id": "v_askepet",
		"latin": "askepet",
		"gloss": {
			"ja": "（手の）指",
			"en": "finger"
		},
		"category": "body",
		"pos": "n"
	},
	"v_am": {
		"id": "v_am",
		"latin": "am",
		"gloss": {
			"ja": "爪（人・けもの・鳥）",
			"en": "(finger/toe)nail; (animal) claw, talon"
		},
		"category": "body",
		"pos": "n"
	},
	"v_cikiri": {
		"id": "v_cikiri",
		"latin": "cikiri",
		"gloss": {
			"ja": "（動物・人間以外の）足、（動物の）後ろ足。所属形（概念形は cikir）",
			"en": "the leg/foot of (an animal, or non-human)"
		},
		"category": "body",
		"pos": "n"
	},
	"v_netopa": {
		"id": "v_netopa",
		"latin": "netopa",
		"gloss": {
			"ja": "体、身体、胴体（所属形は netopake / netopakehe）",
			"en": "body, trunk (possessed form: netopake / netopakehe)"
		},
		"category": "body",
		"pos": "n"
	},
	"v_rakko": {
		"id": "v_rakko",
		"latin": "rakko",
		"gloss": {
			"ja": "ラッコ",
			"en": "sea otter"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_cironnup": {
		"id": "v_cironnup",
		"latin": "cironnup",
		"gloss": {
			"ja": "キツネ、狐",
			"en": "fox"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_ecinke": {
		"id": "v_ecinke",
		"latin": "ecinke",
		"gloss": {
			"ja": "カメ、亀",
			"en": "turtle, tortoise"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_erum": {
		"id": "v_erum",
		"latin": "érum",
		"gloss": {
			"ja": "ネズミ",
			"en": "mouse; rat"
		},
		"category": "biology_animals",
		"pos": "n",
		"note": {
			"ja": "知里『分類アイヌ語辞典』動物編の北海道形érum。",
			"en": "Hokkaido érum in Chiri’s animal dictionary."
		}
	},
	"v_isepo": {
		"id": "v_isepo",
		"latin": "isepo",
		"gloss": {
			"ja": "ウサギ（兎）",
			"en": "rabbit; hare"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_humpe": {
		"id": "v_humpe",
		"latin": "humpe",
		"gloss": {
			"ja": "鯨（クジラ）",
			"en": "whale"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_kopeca": {
		"id": "v_kopeca",
		"latin": "kopeca",
		"gloss": {
			"ja": "アヒル、（カモ・シギ・カイツブリの類の）水鳥；マガモ",
			"en": "a duck; a water bird (mallard)"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_kusuyep": {
		"id": "v_kusuyep",
		"latin": "kusuyep",
		"gloss": {
			"ja": "キジバト（山バト）",
			"en": "Oriental turtle dove (turtledove)"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_tannu": {
		"id": "v_tannu",
		"latin": "tannu",
		"gloss": {
			"ja": "イルカ",
			"en": "dolphin"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_amuspe": {
		"id": "v_amuspe",
		"latin": "amuspe",
		"gloss": {
			"ja": "カニ",
			"en": "crab"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_atuinne": {
		"id": "v_atuinne",
		"latin": "atuinne",
		"gloss": {
			"ja": "タコ",
			"en": "octopus"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_aykotcep": {
		"id": "v_aykotcep",
		"latin": "aykotcep",
		"gloss": {
			"ja": "アカエイ（エイ）",
			"en": "ray, stingray"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_epetpetke": {
		"id": "v_epetpetke",
		"latin": "epetpetke",
		"gloss": {
			"ja": "イカ",
			"en": "squid"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_mokorir": {
		"id": "v_mokorir",
		"latin": "mokorir",
		"gloss": {
			"ja": "巻貝、タニシ",
			"en": "spiral shell, conch, snail"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_otakarip": {
		"id": "v_otakarip",
		"latin": "otakarip",
		"gloss": {
			"ja": "ヒトデ（海星）",
			"en": "starfish"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_sey": {
		"id": "v_sey",
		"latin": "sey",
		"gloss": {
			"ja": "貝、貝類；二枚貝（の貝がら）",
			"en": "shell; shellfish; a bivalve (and its shell)"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_humpeetor": {
		"id": "v_humpeetor",
		"latin": "humpeetor",
		"gloss": {
			"ja": "クラゲ",
			"en": "jellyfish"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_kiparpar": {
		"id": "v_kiparpar",
		"latin": "kiparpar",
		"gloss": {
			"ja": "ギンナンソウ（海藻の一種）、クロバギンナンソウ",
			"en": "a type of seaweed (Chiri: kurobaginnansō)"
		},
		"category": "biology_animals",
		"pos": "n"
	},
	"v_kina": {
		"id": "v_kina",
		"latin": "kina",
		"gloss": {
			"ja": "草、（食用・薬用などの有用な）草、山菜；（鵡川・旭川）ござ",
			"en": "grass"
		},
		"category": "food",
		"pos": "n"
	},
	"v_karus": {
		"id": "v_karus",
		"latin": "karus",
		"gloss": {
			"ja": "きのこ（茸）の総称、シイタケ",
			"en": "mushroom (general term); shiitake"
		},
		"category": "food",
		"pos": "n"
	},
	"v_kimi": {
		"id": "v_kimi",
		"latin": "kími",
		"gloss": {
			"ja": "トウモロコシ（とうきび）",
			"en": "corn, maize"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「とうきび」からの借用語（田村1996）。",
			"en": "A loan from Japanese tōkibi, “maize” (Tamura 1996)."
		}
	},
	"v_atane": {
		"id": "v_atane",
		"latin": "atane",
		"gloss": {
			"ja": "カブ（センダイカブラ）",
			"en": "turnip (Sendai turnip variety)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_siyamam": {
		"id": "v_siyamam",
		"latin": "siyamam",
		"gloss": {
			"ja": "米、稲",
			"en": "rice (plant); rice (grain)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_topenpe": {
		"id": "v_topenpe",
		"latin": "tópenpe",
		"gloss": {
			"ja": "甘いもの、菓子の類、砂糖",
			"en": "sweet thing; sweets; (also) sugar"
		},
		"category": "food",
		"pos": "n"
	},
	"v_rur": {
		"id": "v_rur",
		"latin": "rur",
		"gloss": {
			"ja": "汁、汁気、だし汁、だし、あく、塩気",
			"en": "soup; juice; stock/broth (also a salty, strong taste)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_nok": {
		"id": "v_nok",
		"latin": "nok",
		"gloss": {
			"ja": "（鳥の）たまご",
			"en": "egg (of a bird)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_nikaop": {
		"id": "v_nikaop",
		"latin": "níkaop",
		"gloss": {
			"ja": "木になる実、くだもの（果実）",
			"en": "fruit (esp. that which grows on a tree)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_cipor": {
		"id": "v_cipor",
		"latin": "cipor",
		"gloss": {
			"ja": "（魚の）卵、筋子（サケ・マスなどの魚卵）",
			"en": "fish roe; salmon roe (suziko)"
		},
		"category": "food",
		"pos": "n"
	},
	"v_urar": {
		"id": "v_urar",
		"latin": "úrar",
		"gloss": {
			"ja": "霧、もや",
			"en": "fog, mist"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_konru": {
		"id": "v_konru",
		"latin": "konru",
		"gloss": {
			"ja": "氷",
			"en": "ice"
		},
		"category": "nature",
		"pos": "n",
		"note": {
			"ja": "田村（1996）は日本語「氷」との関係を疑問付きで示している。",
			"en": "Tamura (1996) tentatively relates the word to Japanese kōri, “ice”."
		}
	},
	"v_ruyanpe": {
		"id": "v_ruyanpe",
		"latin": "ruyanpe",
		"gloss": {
			"ja": "嵐、大雨、雨",
			"en": "storm; heavy rain; rain"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_sak": {
		"id": "v_sak",
		"latin": "sak",
		"gloss": {
			"ja": "夏",
			"en": "summer"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_cuk": {
		"id": "v_cuk",
		"latin": "cuk",
		"gloss": {
			"ja": "秋",
			"en": "autumn"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_paykar": {
		"id": "v_paykar",
		"latin": "paykar",
		"gloss": {
			"ja": "春",
			"en": "spring"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_rikunmosir": {
		"id": "v_rikunmosir",
		"latin": "rikunmosir",
		"gloss": {
			"ja": "天界、上界（神々の住む天上の世界）",
			"en": "heaven, the world above (the upper world where gods dwell)"
		},
		"category": "nature",
		"pos": "n",
		"note": {
			"ja": "天上の世界。神々の住む上界。",
			"en": "The world above, where the kamuy dwell."
		}
	},
	"v_yaunmosir": {
		"id": "v_yaunmosir",
		"latin": "yaunmosir",
		"gloss": {
			"ja": "北海道、（原義）こちら側の陸地・故国（ya-un-mosir 陸・の・国）",
			"en": "Hokkaido; lit. 'the land on this side', the homeland"
		},
		"category": "nature",
		"pos": "n",
		"note": {
			"ja": "「こちら側の大地」＝北海道。",
			"en": "\"The land on this side\" — Hokkaido."
		}
	},
	"v_cupka": {
		"id": "v_cupka",
		"latin": "cupka",
		"gloss": {
			"ja": "東（cup-ka 太陽・の上）",
			"en": "east (the direction of the rising sun)"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_cuppok": {
		"id": "v_cuppok",
		"latin": "cuppok",
		"gloss": {
			"ja": "西、日の沈む方角（cup「太陽」+ pok「下」）",
			"en": "west (the direction of the setting sun)"
		},
		"category": "nature",
		"pos": "n"
	},
	"v_siwnin": {
		"id": "v_siwnin",
		"latin": "siwnin",
		"gloss": {
			"ja": "緑である（少し青みのある黄色～緑～青の範囲）。沙流では草色を典型とし黄から紫まで広がる。汚い（顔色の形容にも）",
			"en": "to be green"
		},
		"category": "color",
		"pos": "vi"
	},
	"v_ruhure": {
		"id": "v_ruhure",
		"latin": "ruhure",
		"gloss": {
			"ja": "やや赤い、赤っぽい（ピンクや薄赤い色）",
			"en": "to be pinkish/reddish, light red"
		},
		"category": "color",
		"pos": "vi"
	},
	"v_ruretar": {
		"id": "v_ruretar",
		"latin": "ruretar",
		"gloss": {
			"ja": "やや白い、白っぽい（薄い灰色・ねずみ色）",
			"en": "to be whitish / light gray"
		},
		"category": "color",
		"pos": "vi"
	},
	"v_rayoci": {
		"id": "v_rayoci",
		"latin": "rayoci",
		"gloss": {
			"ja": "虹",
			"en": "rainbow"
		},
		"category": "color",
		"pos": "n"
	},
	"v_iruska": {
		"id": "v_iruska",
		"latin": "iruska",
		"gloss": {
			"ja": "腹を立てる、怒る、気を悪くする",
			"en": "to get angry, be irate, be in a bad mood"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_ruska": {
		"id": "v_ruska",
		"latin": "ruska",
		"gloss": {
			"ja": "～のことで腹を立てる、～に怒る",
			"en": "to get angry at / be displeased about (something)"
		},
		"category": "description",
		"pos": "vt"
	},
	"v_mismu": {
		"id": "v_mismu",
		"latin": "mismu",
		"gloss": {
			"ja": "寂しく思う、退屈する、人恋しい",
			"en": "to be lonely; to long for company; to be bored"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_ratci": {
		"id": "v_ratci",
		"latin": "ratci",
		"gloss": {
			"ja": "静かである／になる、落ち着く、穏やかだ；（澱粉が）沈澱する、（水が）澄む",
			"en": "to be/become calm, settle down"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_yaypira": {
		"id": "v_yaypira",
		"latin": "yaypira",
		"gloss": {
			"ja": "落胆する、がっかりする",
			"en": "to be disappointed, to be let down"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_ekastek": {
		"id": "v_ekastek",
		"latin": "ekastek",
		"gloss": {
			"ja": "〜に飽きる、食べ飽きる",
			"en": "to be tired of / fed up with (food or work)"
		},
		"category": "description",
		"pos": "vt"
	},
	"v_kinrakar": {
		"id": "v_kinrakar",
		"latin": "kinrakar",
		"gloss": {
			"ja": "もの狂いする、興奮していきりたつ、異常な行動をする",
			"en": "to go into a frenzy; to become wildly excited/agitated"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_kimatek": {
		"id": "v_kimatek",
		"latin": "kimatek",
		"gloss": {
			"ja": "驚く、びっくりする、あわてる、狼狽する",
			"en": "to be startled/frightened; to panic; to be in a fluster"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_hotasnu": {
		"id": "v_hotasnu",
		"latin": "hotasnu",
		"gloss": {
			"ja": "不安である、心配で気がかりだ、心構えする（萱野では「お産をする」の意味もある）",
			"en": "to be uneasy / anxious, have something on one's mind"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_ramutuy": {
		"id": "v_ramutuy",
		"latin": "ramutuy",
		"gloss": {
			"ja": "驚く、びっくりする",
			"en": "to be surprised"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_uwepirka": {
		"id": "v_uwepirka",
		"latin": "uwepirka",
		"gloss": {
			"ja": "共々に幸せに/裕福になる、一緒によく暮らす",
			"en": "to become happy / well-off together, live well together"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_osikkote": {
		"id": "v_osikkote",
		"latin": "osikkote",
		"gloss": {
			"ja": "（異性に）惚れる、を愛する",
			"en": "to fall in love with, love (a person)"
		},
		"category": "description",
		"pos": "vt"
	},
	"v_eramunupekus": {
		"id": "v_eramunupekus",
		"latin": "eramunupekus",
		"gloss": {
			"ja": "～を悲しむ、～について心泣きする",
			"en": "to feel sad over, grieve about, feel sorry for"
		},
		"category": "description",
		"pos": "vt"
	},
	"v_ciitasare": {
		"id": "v_ciitasare",
		"latin": "ciitasare",
		"gloss": {
			"ja": "気が狂う、正気を失う",
			"en": "to go mad, lose one's mind"
		},
		"category": "description",
		"pos": "vi"
	},
	"v_attus": {
		"id": "v_attus",
		"latin": "attus",
		"gloss": {
			"ja": "厚司（アットゥㇱ）；オヒョウニレの皮の繊維で織った布・着物",
			"en": "attus; cloth/garment woven from elm (ohyo) bark fibre"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "オヒョウなどの樹皮繊維で織った布や衣服。",
			"en": "Cloth or clothing woven from tree-bark fibres, including elm."
		}
	},
	"v_tamasay": {
		"id": "v_tamasay",
		"latin": "tamasay",
		"gloss": {
			"ja": "首飾り、玉飾り（玉を連ねて輪にした女性の首飾り）。＜tama「玉」say「連・弧状の列」",
			"en": "bead necklace (traditional Ainu beaded neck ornament)"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "女性が胸に下げる玉の首飾り。",
			"en": "A woman’s beaded necklace worn over the chest."
		}
	},
	"v_ninkari": {
		"id": "v_ninkari",
		"latin": "ninkari",
		"gloss": {
			"ja": "耳飾り、耳輪（金属製の耳環）",
			"en": "earring(s); traditional metal ear ring"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "輪の耳飾り。田村（1996）は日本語「みみかね」からの借用という説を紹介している。",
			"en": "Ring earrings. Tamura (1996) records a proposed origin in Japanese mimikane."
		}
	},
	"v_sapanpe": {
		"id": "v_sapanpe",
		"latin": "sapanpe",
		"gloss": {
			"ja": "冠（男子が正装で頭につける儀礼用の冠）",
			"en": "ceremonial crown/headwear worn by men in formal dress"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "儀礼のとき男性がかぶる冠。",
			"en": "A ceremonial crown worn by men in formal dress."
		}
	},
	"v_rekutunpe": {
		"id": "v_rekutunpe",
		"latin": "rekutunpe",
		"gloss": {
			"ja": "首飾り布、チョーカー（女性の装身具の一つ）。＜rekut「のど」un「につく」pe「もの」",
			"en": "choker; cloth neckband worn at the throat"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "のどもとに当てる布の首飾り。",
			"en": "A cloth neckband worn at the throat."
		}
	},
	"v_matanpusi": {
		"id": "v_matanpusi",
		"latin": "matanpusi",
		"gloss": {
			"ja": "髪止めの鉢巻",
			"en": "headband"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "男性が髪を押さえる鉢巻き。刺繍を施す。",
			"en": "An (often embroidered) headband men wear to hold their hair."
		}
	},
	"v_emus": {
		"id": "v_emus",
		"latin": "emus",
		"gloss": {
			"ja": "刀、剣（片刃の太刀）",
			"en": "sword (single-edged)"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "刀。儀礼や宝物（イコㇿ）としても重んじられた。",
			"en": "A sword, also prized as a ceremonial treasure (ikor)."
		}
	},
	"v_makiri": {
		"id": "v_makiri",
		"latin": "makiri",
		"gloss": {
			"ja": "マキリ、小刀、小さい刃物",
			"en": "makiri; a (small) knife, short sword"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "小刀。田村（1996）は日本語からの借用語としている。",
			"en": "A small knife, identified as a Japanese loan in Tamura (1996)."
		}
	},
	"v_mukkur": {
		"id": "v_mukkur",
		"latin": "mukkur",
		"gloss": {
			"ja": "口琴（竹で作った楽器）",
			"en": "mukkuri, a jaw/mouth harp (bamboo idioglot lamellophone)"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "竹製の口琴（ムックリ）。",
			"en": "The mukkuri, a bamboo mouth harp."
		}
	},
	"v_tonkori": {
		"id": "v_tonkori",
		"latin": "tonkori",
		"gloss": {
			"ja": "トンコリ（弦楽器）",
			"en": "tonkori (traditional Ainu stringed instrument)"
		},
		"category": "culture",
		"pos": "n",
		"note": {
			"ja": "樺太アイヌの弦楽器。",
			"en": "A stringed instrument of the Sakhalin Ainu."
		}
	},
	"v_kamuynomi": {
		"id": "v_kamuynomi",
		"latin": "kamuynomi",
		"gloss": {
			"ja": "神に酒（おみき）をあげて祈とうの儀式をする；神への祈り",
			"en": "to perform a prayer ceremony to the gods (offering sacred sake)"
		},
		"category": "culture",
		"pos": "vi",
		"note": {
			"ja": "神々に祈りを捧げる儀式（カムイ＋ノミ「祈る」）。",
			"en": "A prayer ceremony to the kamuy (gods): kamuy + nómi \"pray\"."
		}
	},
	"v_cisenomi": {
		"id": "v_cisenomi",
		"latin": "cisenomi",
		"gloss": {
			"ja": "新築祝いの神祈りをする；新築祝い",
			"en": "to perform the new-house prayer ceremony"
		},
		"category": "culture",
		"pos": "vi",
		"note": {
			"ja": "新築の家の祈りの祝い（チセ「家」＋ノミ）。",
			"en": "A new-house prayer ceremony: cise \"house\" + nómi \"pray\"."
		}
	},
	"v_utomnukar": {
		"id": "v_utomnukar",
		"latin": "utomnukar",
		"gloss": {
			"ja": "結婚する、夫婦になる",
			"en": "to marry, to become a married couple"
		},
		"category": "culture",
		"pos": "vi",
		"note": {
			"ja": "夫婦になること、結婚。",
			"en": "To marry; to become husband and wife."
		}
	},
	"v_tup": {
		"id": "v_tup",
		"latin": "tup",
		"gloss": {
			"ja": "二、二つ（二個・二匹・二羽…）",
			"en": "two (counter)"
		},
		"category": "number",
		"pos": "n"
	},
	"v_rep": {
		"id": "v_rep",
		"latin": "rep",
		"gloss": {
			"ja": "三、三つ（三個・三匹・三羽）",
			"en": "three (as a counter; standalone numeral)"
		},
		"category": "number",
		"pos": "n"
	},
	"v_inep": {
		"id": "v_inep",
		"latin": "ínep",
		"gloss": {
			"ja": "四、四個、四つ",
			"en": "four (counter)"
		},
		"category": "number",
		"pos": "n"
	},
	"v_asiknep": {
		"id": "v_asiknep",
		"latin": "asiknep",
		"gloss": {
			"ja": "五個、五つ（数えるときの形）",
			"en": "five items, five (counter form)"
		},
		"category": "number",
		"pos": "n"
	},
	"v_iwanpe": {
		"id": "v_iwanpe",
		"latin": "iwanpe",
		"gloss": {
			"ja": "六個（六つのもの）",
			"en": "six (six things/pieces); counter form of iwan"
		},
		"category": "number",
		"pos": "n"
	},
	"v_arwanpe": {
		"id": "v_arwanpe",
		"latin": "arwanpe",
		"gloss": {
			"ja": "七個（七つのもの）",
			"en": "seven items (seven as a counter); counter form of arwan"
		},
		"category": "number",
		"pos": "n"
	},
	"v_tupesanpe": {
		"id": "v_tupesanpe",
		"latin": "tupesanpe",
		"gloss": {
			"ja": "八つ、八個、八匹",
			"en": "eight things or animals"
		},
		"category": "number",
		"pos": "n"
	},
	"v_sinepesanpe": {
		"id": "v_sinepesanpe",
		"latin": "sinepesanpe",
		"gloss": {
			"ja": "九個（九つのもの）",
			"en": "nine things/pieces (counter form of sinepesan \"nine\")"
		},
		"category": "number",
		"pos": "n"
	},
	"v_wanpe": {
		"id": "v_wanpe",
		"latin": "wanpe",
		"gloss": {
			"ja": "十個（十のもの）",
			"en": "ten things/pieces; the counter form of wan (\"ten\")"
		},
		"category": "number",
		"pos": "n"
	},
	"v_hotnep": {
		"id": "v_hotnep",
		"latin": "hotnep",
		"gloss": {
			"ja": "二十個（二十のもの）",
			"en": "twenty things/pieces"
		},
		"category": "number",
		"pos": "n"
	},
	"v_rehotnep": {
		"id": "v_rehotnep",
		"latin": "rehotnep",
		"gloss": {
			"ja": "六十、六十個",
			"en": "sixty; sixty (things), counter"
		},
		"category": "number",
		"pos": "n"
	},
	"v_inehot": {
		"id": "v_inehot",
		"latin": "ínehot",
		"gloss": {
			"ja": "八十",
			"en": "eighty (4×20)"
		},
		"category": "number",
		"pos": "numeral"
	},
	"v_perapasuy": {
		"id": "v_perapasuy",
		"latin": "perapasuy",
		"gloss": {
			"ja": "ひらさじ（平匙）、スプーン",
			"en": "(flat) spoon"
		},
		"category": "general",
		"pos": "n"
	},
	"v_aptokikunpe": {
		"id": "v_aptokikunpe",
		"latin": "aptokikunpe",
		"gloss": {
			"ja": "雨具、傘",
			"en": "rainwear, umbrella"
		},
		"category": "general",
		"pos": "n"
	},
	"v_assap": {
		"id": "v_assap",
		"latin": "assap",
		"gloss": {
			"ja": "舟の櫂（オール）",
			"en": "oar, paddle"
		},
		"category": "general",
		"pos": "n"
	},
	"v_hempara": {
		"id": "v_hempara",
		"latin": "hempara",
		"gloss": {
			"ja": "いつ（疑問副詞）",
			"en": "when (interrogative)"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_nekon": {
		"id": "v_nekon",
		"latin": "nékon",
		"gloss": {
			"ja": "どう、どのように、どの程度（疑問）",
			"en": "how, in what way; to what degree (interrogative)"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_nep": {
		"id": "v_nep",
		"latin": "nep",
		"gloss": {
			"ja": "何（疑問代名詞）；また不定代名詞として「何か・何も（…ない）」",
			"en": "what (interrogative)"
		},
		"category": "general",
		"pos": "pron"
	},
	"v_nep_kusu": {
		"id": "v_nep_kusu",
		"latin": "nep kusu",
		"gloss": {
			"ja": "なぜ、どうして（nep「何」+ kusu「～のために、～だから（理由）」）",
			"en": "why, how come (lit. because of what)"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_newa": {
		"id": "v_newa",
		"latin": "newa",
		"gloss": {
			"ja": "〜と（名詞並列の接続詞）、および",
			"en": "and (coordinating conjunction, joining noun phrases)"
		},
		"category": "general",
		"pos": "conj"
	},
	"v_hene": {
		"id": "v_hene",
		"latin": "hene",
		"gloss": {
			"ja": "～でも、～なり（一例として提示）、～もまた；（X hene Y hene）～でも～でも",
			"en": "even…; either…or…"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_ponno": {
		"id": "v_ponno",
		"latin": "ponno",
		"gloss": {
			"ja": "少し、わずか、ちょっと",
			"en": "a little, a bit, slightly"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_kanna": {
		"id": "v_kanna",
		"latin": "kanna",
		"gloss": {
			"ja": "また、再び、重ねて、繰り返し（kanna kanna 何度も何度も）",
			"en": "again, once more, repeatedly"
		},
		"category": "general",
		"pos": "adv"
	},
	"v_hayta": {
		"id": "v_hayta",
		"latin": "hayta",
		"gloss": {
			"ja": "足りない、不足する；（知恵が）足りない、馬鹿である",
			"en": "(vi) to be lacking/insufficient"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_kuani": {
		"id": "v_kuani",
		"latin": "kuani",
		"gloss": {
			"ja": "私（一人称単数）",
			"en": "I (1sg)"
		},
		"category": "general",
		"pos": "pron"
	},
	"v_yupo": {
		"id": "v_yupo",
		"latin": "yúpo",
		"gloss": {
			"ja": "兄；（女性が）恋人（男性）を呼ぶ語",
			"en": "elder brother; (used by a woman) her male lover/sweetheart"
		},
		"category": "general",
		"pos": "n"
	},
	"v_tures": {
		"id": "v_tures",
		"latin": "tures",
		"gloss": {
			"ja": "（兄から見た）妹〔雅〕。血縁の妹に限らず、いとしむ女性（恋人・妻）にもいう。所属形は turesi（〜の妹）",
			"en": "younger sister (of an elder brother) [literary/poetic]"
		},
		"category": "general",
		"pos": "n"
	},
	"v_onautari": {
		"id": "v_onautari",
		"latin": "onautari",
		"gloss": {
			"ja": "両親、親たち",
			"en": "parents"
		},
		"category": "general",
		"pos": "n"
	},
	"v_piski": {
		"id": "v_piski",
		"latin": "piski",
		"gloss": {
			"ja": "〜を数える",
			"en": "to count"
		},
		"category": "general",
		"pos": "vt"
	},
	"v_yaykosiramsuye": {
		"id": "v_yaykosiramsuye",
		"latin": "yaykosiramsuye",
		"gloss": {
			"ja": "考える、思いめぐらす",
			"en": "to think, consider"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_inu": {
		"id": "v_inu",
		"latin": "inu",
		"gloss": {
			"ja": "聞く、聴く（聴覚・触覚・味覚・嗅覚・心中の感じに用い、視覚には用いない）；～wa inu で「～してみる」",
			"en": "to hear, to listen"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_ere": {
		"id": "v_ere",
		"latin": "ére",
		"gloss": {
			"ja": "食べさせる",
			"en": "to feed; to cause/let (someone) eat"
		},
		"category": "general",
		"pos": "vd",
		"note": {
			"ja": "「〜に〜を食べさせる」という複他動詞（田村1996）。",
			"en": "A ditransitive verb: feed someone something (Tamura 1996)."
		}
	},
	"v_usi": {
		"id": "v_usi",
		"latin": "usi",
		"gloss": {
			"ja": "（…に…を）つける、塗る、塗りつける、まぶす",
			"en": "to apply/smear/paint/attach (sth) onto"
		},
		"category": "general",
		"pos": "vd"
	},
	"v_hoyupu": {
		"id": "v_hoyupu",
		"latin": "hoyupu",
		"gloss": {
			"ja": "（一人が）走る。複数形は hoyuppa",
			"en": "to run (singular subject; plural hoyuppa)"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_tumikor": {
		"id": "v_tumikor",
		"latin": "tumikor",
		"gloss": {
			"ja": "戦う、いくさをする、戦争する。＜tumi（戦）＋kor（を持つ）",
			"en": "to fight, do battle, make war"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_oha": {
		"id": "v_oha",
		"latin": "oha",
		"gloss": {
			"ja": "からっぽである／になる、空いている",
			"en": "to be empty"
		},
		"category": "general",
		"pos": "vi"
	},
	"v_sirwen": {
		"id": "v_sirwen",
		"latin": "sirwen",
		"gloss": {
			"ja": "天気が悪い；天気が悪くなる、荒天になる",
			"en": "the weather is bad; the weather turns bad / becomes stormy"
		},
		"category": "general",
		"pos": "vc"
	},
	"v_umma": {
		"id": "v_umma",
		"latin": "umma",
		"gloss": {
			"ja": "ウマ（馬）",
			"en": "horse"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「馬」からの借用語（田村1996）。",
			"en": "A loan from Japanese uma, “horse” (Tamura 1996)."
		}
	},
	"v_puta": {
		"id": "v_puta",
		"latin": "puta",
		"gloss": {
			"ja": "ブタ（豚）",
			"en": "pig"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「豚」からの借用語（田村1996）。",
			"en": "A loan from Japanese buta, “pig” (Tamura 1996)."
		}
	},
	"v_peko": {
		"id": "v_peko",
		"latin": "peko",
		"gloss": {
			"ja": "ウシ（牛）",
			"en": "cow"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語の方言形「べこ」（牛）からの借用語。peko tópeで「牛乳」。",
			"en": "A loan from dialectal Japanese beko, “cow”. Peko tópe means “cow’s milk”."
		}
	},
	"v_niyatori": {
		"id": "v_niyatori",
		"latin": "niyatori",
		"gloss": {
			"ja": "ニワトリ",
			"en": "chicken"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「にわとり」からの借用語（知里『分類アイヌ語辞典』動物編）。",
			"en": "A loan from Japanese niwatori, “chicken” (Chiri’s animal dictionary)."
		}
	},
	"v_menyo": {
		"id": "v_menyo",
		"latin": "menyo",
		"gloss": {
			"ja": "ひつじ（緬羊）",
			"en": "sheep"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「緬羊」からの借用語。田村（1996）はmen-yoの形で載せている。",
			"en": "A loan from Japanese men’yō, “sheep”, recorded as men-yo in Tamura (1996)."
		}
	},
	"v_kanpoca": {
		"id": "v_kanpoca",
		"latin": "kanpoca",
		"gloss": {
			"ja": "かぼちゃ",
			"en": "pumpkin"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「かぼちゃ」からの借用語。富田のオンライン辞典に記載がある。",
			"en": "A loan from Japanese kabocha, “pumpkin”, recorded in Tomita’s online dictionary."
		}
	},
	"v_kaypeci": {
		"id": "v_kaypeci",
		"latin": "kaypeci",
		"gloss": {
			"ja": "キャベツ",
			"en": "cabbage"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「キャベツ／カイベツ」（英語 cabbage 由来）からの借用語。接触後に入った野菜の名前。",
			"en": "A loanword from Japanese kyabetsu / kaibetsu (ultimately English 'cabbage'); a post-contact vegetable name."
		}
	},
	"v_kosoymi": {
		"id": "v_kosoymi",
		"latin": "kosoymi",
		"gloss": {
			"ja": "じゃがいも（ジャガタライモ、塊茎）",
			"en": "potato"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「ごしょいも」からの借用語（知里『分類アイヌ語辞典』植物編）。",
			"en": "A loan from Japanese gosho-imo, “potato” (Chiri’s plant dictionary)."
		}
	},
	"v_pan": {
		"id": "v_pan",
		"latin": "pan",
		"gloss": {
			"ja": "パン",
			"en": "bread"
		},
		"category": "food",
		"pos": "n",
		"note": {
			"ja": "日本語「パン」からの借用語。",
			"en": "A loan from Japanese pan, “bread”."
		}
	},
	"v_ikari": {
		"id": "v_ikari",
		"latin": "ikari",
		"gloss": {
			"ja": "いかり（錨）",
			"en": "anchor"
		},
		"category": "object",
		"pos": "n",
		"note": {
			"ja": "日本語「錨」からの借用語（田村1996）。",
			"en": "A loan from Japanese ikari, “anchor” (Tamura 1996)."
		}
	},
	"v_konkani": {
		"id": "v_konkani",
		"latin": "konkani",
		"gloss": {
			"ja": "金（黄金）",
			"en": "gold"
		},
		"category": "object",
		"pos": "n",
		"note": {
			"ja": "日本語「黄金」からの借用語。沙流・千歳にはkonkaneの形がある（中川1995）。",
			"en": "A loan from Japanese kogane, “gold”. The form konkane occurs in Saru and Chitose (Nakagawa 1995)."
		}
	},
	"v_sirokane": {
		"id": "v_sirokane",
		"latin": "sirokane",
		"gloss": {
			"ja": "銀、銀色",
			"en": "silver"
		},
		"category": "object",
		"pos": "n",
		"note": {
			"ja": "日本語「しろかね」（銀）からの借用語。sirokaniという形もある。",
			"en": "A loan from Japanese shirokane, “silver”; sirokani is another form."
		}
	},
	"v_nikapiro": {
		"id": "v_nikapiro",
		"latin": "níkapiro",
		"gloss": {
			"ja": "オレンジ色（木の皮の色）",
			"en": "the colour orange"
		},
		"category": "object",
		"pos": "n",
		"note": {
			"ja": "田村（1996）の見出しはníkap-iro。樹皮で染めた色を指す。iroは日本語「色」から。",
			"en": "Recorded as níkap-iro in Tamura (1996), referring to the colour of bark dye. Iro comes from Japanese “colour”."
		}
	},
	"v_hukinane": {
		"id": "v_hukinane",
		"latin": "hukinane",
		"gloss": {
			"ja": "みどり",
			"en": "green"
		},
		"category": "object",
		"pos": "n/vi",
		"note": {
			"ja": "バチェラー（1938）にFukinaneの綴りで記載されている。",
			"en": "Recorded as Fukinane in Batchelor (1938), p. 147."
		}
	},
	"v_sikerpepeus": {
		"id": "v_sikerpepeus",
		"latin": "sikerpepeus",
		"gloss": {
			"ja": "きいろ",
			"en": "yellow"
		},
		"category": "object",
		"pos": "vi",
		"note": {
			"ja": "「黄色」を表す自動詞（アイヌ文化振興・研究推進機構、石狩川『単語リスト（アイヌ語・日本語）』5頁）。",
			"en": "An intransitive colour verb listed as “yellow” in the Foundation for Research and Promotion of Ainu Culture’s Ishikarigawa Ainu–Japanese word list, p. 5."
		}
	},
	"v_hureatane": {
		"id": "v_hureatane",
		"latin": "húreatane",
		"gloss": {
			"ja": "ニンジン",
			"en": "carrot"
		},
		"category": "object",
		"pos": "n",
		"note": {
			"ja": "田村（1996）に記載されたニンジンの名。húre「赤い」とatane「カブ」からなる。",
			"en": "A word for carrot recorded in Tamura (1996), formed from húre “red” and atane “turnip”."
		}
	}
};

export const dropsSections: Section[] = [
	{
		"id": "sec10",
		"cefr": "A1",
		"title": {
			"ja": "暮らしと自然のことば",
			"en": "Everyday life and nature"
		},
		"units": [
			{
				"id": "u40",
				"label": {
					"ja": "ユニット 40",
					"en": "Unit 40"
				},
				"title": {
					"ja": "からだ",
					"en": "The body"
				},
				"accent": "indigo",
				"grammar": {
					"ja": "体の部位の語。多くは単独形（概念形）で覚える。",
					"en": "Body-part words, learned in their absolute form."
				},
				"nodes": [
					{
						"id": "u40n1",
						"type": "lesson",
						"title": {
							"ja": "からだ 1",
							"en": "The body 1"
						},
						"levels": 1,
						"vocab": [
							"v_sapa",
							"v_otop",
							"v_nan",
							"v_kisar",
							"v_sik"
						]
					},
					{
						"id": "u40n2",
						"type": "lesson",
						"title": {
							"ja": "からだ 2",
							"en": "The body 2"
						},
						"levels": 1,
						"vocab": [
							"v_etu",
							"v_par",
							"v_nimak",
							"v_parunpe",
							"v_tek"
						]
					},
					{
						"id": "u40n3",
						"type": "lesson",
						"title": {
							"ja": "からだ 3",
							"en": "The body 3"
						},
						"levels": 1,
						"vocab": [
							"v_askepet",
							"v_am",
							"v_cikiri",
							"v_netopa"
						]
					},
					{
						"id": "u40n4",
						"type": "review",
						"title": {
							"ja": "復習：からだ",
							"en": "Review: The body"
						},
						"levels": 1,
						"vocab": [
							"v_sapa",
							"v_otop",
							"v_nan",
							"v_kisar",
							"v_sik",
							"v_etu",
							"v_par",
							"v_nimak",
							"v_parunpe",
							"v_tek",
							"v_askepet",
							"v_am",
							"v_cikiri",
							"v_netopa"
						]
					}
				]
			},
			{
				"id": "u41",
				"label": {
					"ja": "ユニット 41",
					"en": "Unit 41"
				},
				"title": {
					"ja": "どうぶつ",
					"en": "Animals"
				},
				"accent": "green",
				"grammar": {
					"ja": "身近な動物の名（在来のもの）。",
					"en": "Names of familiar native animals."
				},
				"nodes": [
					{
						"id": "u41n1",
						"type": "lesson",
						"title": {
							"ja": "どうぶつ 1",
							"en": "Animals 1"
						},
						"levels": 1,
						"vocab": [
							"v_rakko",
							"v_cironnup",
							"v_ecinke",
							"v_erum",
							"v_isepo"
						]
					},
					{
						"id": "u41n2",
						"type": "lesson",
						"title": {
							"ja": "どうぶつ 2",
							"en": "Animals 2"
						},
						"levels": 1,
						"vocab": [
							"v_humpe",
							"v_kopeca",
							"v_kusuyep",
							"v_tannu"
						]
					},
					{
						"id": "u41n3",
						"type": "review",
						"title": {
							"ja": "復習：どうぶつ",
							"en": "Review: Animals"
						},
						"levels": 1,
						"vocab": [
							"v_rakko",
							"v_cironnup",
							"v_ecinke",
							"v_erum",
							"v_isepo",
							"v_humpe",
							"v_kopeca",
							"v_kusuyep",
							"v_tannu"
						]
					}
				]
			},
			{
				"id": "u42",
				"label": {
					"ja": "ユニット 42",
					"en": "Unit 42"
				},
				"title": {
					"ja": "海のいきもの",
					"en": "Sea life"
				},
				"accent": "red",
				"grammar": {
					"ja": "海と川の生きもの。",
					"en": "Creatures of the sea and rivers."
				},
				"nodes": [
					{
						"id": "u42n1",
						"type": "lesson",
						"title": {
							"ja": "海のいきもの 1",
							"en": "Sea life 1"
						},
						"levels": 1,
						"vocab": [
							"v_amuspe",
							"v_atuinne",
							"v_aykotcep",
							"v_epetpetke",
							"v_mokorir"
						]
					},
					{
						"id": "u42n2",
						"type": "lesson",
						"title": {
							"ja": "海のいきもの 2",
							"en": "Sea life 2"
						},
						"levels": 1,
						"vocab": [
							"v_otakarip",
							"v_sey",
							"v_humpeetor",
							"v_kiparpar"
						]
					},
					{
						"id": "u42n3",
						"type": "review",
						"title": {
							"ja": "復習：海のいきもの",
							"en": "Review: Sea life"
						},
						"levels": 1,
						"vocab": [
							"v_amuspe",
							"v_atuinne",
							"v_aykotcep",
							"v_epetpetke",
							"v_mokorir",
							"v_otakarip",
							"v_sey",
							"v_humpeetor",
							"v_kiparpar"
						]
					}
				]
			},
			{
				"id": "u43",
				"label": {
					"ja": "ユニット 43",
					"en": "Unit 43"
				},
				"title": {
					"ja": "くさ・たべもの",
					"en": "Plants & food"
				},
				"accent": "wood",
				"grammar": {
					"ja": "植物や食べものの名前。kinaは草や有用植物を広く指す。",
					"en": "Names of plants and foods. Kina is a broad word for grass and useful plants."
				},
				"nodes": [
					{
						"id": "u43n1",
						"type": "lesson",
						"title": {
							"ja": "くさ・たべもの 1",
							"en": "Plants & food 1"
						},
						"levels": 1,
						"vocab": [
							"v_kina",
							"v_karus",
							"v_atane",
							"v_siyamam",
							"v_topenpe"
						]
					},
					{
						"id": "u43n2",
						"type": "lesson",
						"title": {
							"ja": "くさ・たべもの 2",
							"en": "Plants & food 2"
						},
						"levels": 1,
						"vocab": [
							"v_rur",
							"v_nok",
							"v_nikaop",
							"v_cipor",
							"v_hureatane"
						]
					},
					{
						"id": "u43n3",
						"type": "review",
						"title": {
							"ja": "復習：くさ・たべもの",
							"en": "Review: Plants & food"
						},
						"levels": 1,
						"vocab": [
							"v_kina",
							"v_karus",
							"v_atane",
							"v_siyamam",
							"v_topenpe",
							"v_rur",
							"v_nok",
							"v_nikaop",
							"v_cipor",
							"v_hureatane"
						]
					}
				]
			},
			{
				"id": "u44",
				"label": {
					"ja": "ユニット 44",
					"en": "Unit 44"
				},
				"title": {
					"ja": "てんき・きせつ・くに",
					"en": "Weather, seasons & land"
				},
				"accent": "indigo",
				"grammar": {
					"ja": "天気・季節・大地と方角。方角は太陽で表す：cupka「東＝日の昇る方」, cuppok「西」。",
					"en": "Weather, seasons, land and directions, named by the sun: cupka \"east\", cuppok \"west\"."
				},
				"nodes": [
					{
						"id": "u44n1",
						"type": "lesson",
						"title": {
							"ja": "てんき・きせつ・くに 1",
							"en": "Weather, seasons & land 1"
						},
						"levels": 1,
						"vocab": [
							"v_urar",
							"v_konru",
							"v_ruyanpe",
							"v_sak",
							"v_cuk"
						]
					},
					{
						"id": "u44n2",
						"type": "lesson",
						"title": {
							"ja": "てんき・きせつ・くに 2",
							"en": "Weather, seasons & land 2"
						},
						"levels": 1,
						"vocab": [
							"v_paykar",
							"v_rikunmosir",
							"v_yaunmosir",
							"v_cupka",
							"v_cuppok"
						]
					},
					{
						"id": "u44n3",
						"type": "review",
						"title": {
							"ja": "復習：てんき・きせつ・くに",
							"en": "Review: Weather, seasons & land"
						},
						"levels": 1,
						"vocab": [
							"v_urar",
							"v_konru",
							"v_ruyanpe",
							"v_sak",
							"v_cuk",
							"v_paykar",
							"v_rikunmosir",
							"v_yaunmosir",
							"v_cupka",
							"v_cuppok"
						]
					}
				]
			},
			{
				"id": "u45",
				"label": {
					"ja": "ユニット 45",
					"en": "Unit 45"
				},
				"title": {
					"ja": "いろ",
					"en": "Colours"
				},
				"accent": "green",
				"grammar": {
					"ja": "色の語。siwnin は青〜緑〜黄を含む広い語。",
					"en": "Colour words. siwnin spans blue–green–yellow."
				},
				"nodes": [
					{
						"id": "u45n1",
						"type": "lesson",
						"title": {
							"ja": "いろ 1",
							"en": "Colours 1"
						},
						"levels": 1,
						"vocab": [
							"v_siwnin",
							"v_ruhure",
							"v_ruretar",
							"v_rayoci",
							"v_hukinane"
						]
					},
					{
						"id": "u45n2",
						"type": "lesson",
						"title": {
							"ja": "いろ 2",
							"en": "Colours 2"
						},
						"levels": 1,
						"vocab": [
							"v_sikerpepeus"
						]
					},
					{
						"id": "u45n3",
						"type": "review",
						"title": {
							"ja": "復習：いろ",
							"en": "Review: Colours"
						},
						"levels": 1,
						"vocab": [
							"v_siwnin",
							"v_ruhure",
							"v_ruretar",
							"v_rayoci",
							"v_hukinane",
							"v_sikerpepeus"
						]
					}
				]
			},
			{
				"id": "u46",
				"label": {
					"ja": "ユニット 46",
					"en": "Unit 46"
				},
				"title": {
					"ja": "きもち",
					"en": "Feelings"
				},
				"accent": "red",
				"grammar": {
					"ja": "気持ちを表す動詞。多くは「〜である／〜になる」。",
					"en": "Emotion verbs, mostly \"to be / become …\"."
				},
				"nodes": [
					{
						"id": "u46n1",
						"type": "lesson",
						"title": {
							"ja": "きもち 1",
							"en": "Feelings 1"
						},
						"levels": 1,
						"vocab": [
							"v_iruska",
							"v_ruska",
							"v_mismu",
							"v_ratci",
							"v_yaypira"
						]
					},
					{
						"id": "u46n2",
						"type": "lesson",
						"title": {
							"ja": "きもち 2",
							"en": "Feelings 2"
						},
						"levels": 1,
						"vocab": [
							"v_ekastek",
							"v_kinrakar",
							"v_kimatek",
							"v_hotasnu",
							"v_ramutuy"
						]
					},
					{
						"id": "u46n3",
						"type": "lesson",
						"title": {
							"ja": "きもち 3",
							"en": "Feelings 3"
						},
						"levels": 1,
						"vocab": [
							"v_uwepirka",
							"v_osikkote",
							"v_eramunupekus",
							"v_ciitasare"
						]
					},
					{
						"id": "u46n4",
						"type": "review",
						"title": {
							"ja": "復習：きもち",
							"en": "Review: Feelings"
						},
						"levels": 1,
						"vocab": [
							"v_iruska",
							"v_ruska",
							"v_mismu",
							"v_ratci",
							"v_yaypira",
							"v_ekastek",
							"v_kinrakar",
							"v_kimatek",
							"v_hotasnu",
							"v_ramutuy",
							"v_uwepirka",
							"v_osikkote",
							"v_eramunupekus",
							"v_ciitasare"
						]
					}
				]
			},
			{
				"id": "u47",
				"label": {
					"ja": "ユニット 47",
					"en": "Unit 47"
				},
				"title": {
					"ja": "アイヌ文化",
					"en": "Ainu culture & ceremony"
				},
				"accent": "wood",
				"grammar": {
					"ja": "衣服、装飾品、楽器、儀礼に関わることば。",
					"en": "Words for clothing, adornment, musical instruments, and ceremonies."
				},
				"nodes": [
					{
						"id": "u47n1",
						"type": "lesson",
						"title": {
							"ja": "アイヌ文化 1",
							"en": "Ainu culture & ceremony 1"
						},
						"levels": 1,
						"vocab": [
							"v_attus",
							"v_tamasay",
							"v_ninkari",
							"v_sapanpe",
							"v_rekutunpe"
						]
					},
					{
						"id": "u47n2",
						"type": "lesson",
						"title": {
							"ja": "アイヌ文化 2",
							"en": "Ainu culture & ceremony 2"
						},
						"levels": 1,
						"vocab": [
							"v_matanpusi",
							"v_emus",
							"v_mukkur",
							"v_tonkori",
							"v_kamuynomi"
						]
					},
					{
						"id": "u47n3",
						"type": "lesson",
						"title": {
							"ja": "アイヌ文化 3",
							"en": "Ainu culture & ceremony 3"
						},
						"levels": 1,
						"vocab": [
							"v_cisenomi",
							"v_utomnukar"
						]
					},
					{
						"id": "u47n4",
						"type": "review",
						"title": {
							"ja": "復習：アイヌ文化",
							"en": "Review: Ainu culture & ceremony"
						},
						"levels": 1,
						"vocab": [
							"v_attus",
							"v_tamasay",
							"v_ninkari",
							"v_sapanpe",
							"v_rekutunpe",
							"v_matanpusi",
							"v_emus",
							"v_mukkur",
							"v_tonkori",
							"v_kamuynomi",
							"v_cisenomi",
							"v_utomnukar"
						]
					}
				]
			},
			{
				"id": "u48",
				"label": {
					"ja": "ユニット 48",
					"en": "Unit 48"
				},
				"title": {
					"ja": "かぞえる",
					"en": "Counting things"
				},
				"accent": "indigo",
				"grammar": {
					"ja": "物を数える形：基数に -p / -pe をつけた数え名詞。",
					"en": "Counting forms: counter nouns from numerals + -p / -pe."
				},
				"nodes": [
					{
						"id": "u48n1",
						"type": "lesson",
						"title": {
							"ja": "かぞえる 1",
							"en": "Counting things 1"
						},
						"levels": 1,
						"vocab": [
							"v_tup",
							"v_rep",
							"v_inep",
							"v_asiknep",
							"v_iwanpe"
						]
					},
					{
						"id": "u48n2",
						"type": "lesson",
						"title": {
							"ja": "かぞえる 2",
							"en": "Counting things 2"
						},
						"levels": 1,
						"vocab": [
							"v_arwanpe",
							"v_tupesanpe",
							"v_sinepesanpe",
							"v_wanpe",
							"v_hotnep"
						]
					},
					{
						"id": "u48n3",
						"type": "lesson",
						"title": {
							"ja": "かぞえる 3",
							"en": "Counting things 3"
						},
						"levels": 1,
						"vocab": [
							"v_rehotnep",
							"v_inehot"
						]
					},
					{
						"id": "u48n4",
						"type": "review",
						"title": {
							"ja": "復習：かぞえる",
							"en": "Review: Counting things"
						},
						"levels": 1,
						"vocab": [
							"v_tup",
							"v_rep",
							"v_inep",
							"v_asiknep",
							"v_iwanpe",
							"v_arwanpe",
							"v_tupesanpe",
							"v_sinepesanpe",
							"v_wanpe",
							"v_hotnep",
							"v_rehotnep",
							"v_inehot"
						]
					}
				]
			},
			{
				"id": "u49",
				"label": {
					"ja": "ユニット 49",
					"en": "Unit 49"
				},
				"title": {
					"ja": "どうぐ・たずねる・ことば",
					"en": "Tools, asking & words"
				},
				"accent": "green",
				"grammar": {
					"ja": "道具・疑問詞（hempara, nékon, nep）・よく使う語と動詞。",
					"en": "Tools, question words (hempara, nékon, nep) and other high-frequency words and verbs."
				},
				"nodes": [
					{
						"id": "u49n1",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 1",
							"en": "Tools, asking & words 1"
						},
						"levels": 1,
						"vocab": [
							"v_perapasuy",
							"v_aptokikunpe",
							"v_assap",
							"v_hempara",
							"v_nekon"
						]
					},
					{
						"id": "u49n2",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 2",
							"en": "Tools, asking & words 2"
						},
						"levels": 1,
						"vocab": [
							"v_nep",
							"v_nep_kusu",
							"v_newa",
							"v_hene",
							"v_ponno"
						]
					},
					{
						"id": "u49n3",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 3",
							"en": "Tools, asking & words 3"
						},
						"levels": 1,
						"vocab": [
							"v_kanna",
							"v_hayta",
							"v_kuani",
							"v_yupo",
							"v_tures"
						]
					},
					{
						"id": "u49n4",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 4",
							"en": "Tools, asking & words 4"
						},
						"levels": 1,
						"vocab": [
							"v_matkaci",
							"v_onautari",
							"v_eramasu",
							"v_piski",
							"v_yaykosiramsuye"
						]
					},
					{
						"id": "u49n5",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 5",
							"en": "Tools, asking & words 5"
						},
						"levels": 1,
						"vocab": [
							"v_inu",
							"v_ere",
							"v_usi",
							"v_hoyupu",
							"v_tumikor"
						]
					},
					{
						"id": "u49n6",
						"type": "lesson",
						"title": {
							"ja": "どうぐ・たずねる・ことば 6",
							"en": "Tools, asking & words 6"
						},
						"levels": 1,
						"vocab": [
							"v_oha",
							"v_sirwen",
							"v_e_yes"
						]
					},
					{
						"id": "u49n7",
						"type": "review",
						"title": {
							"ja": "復習：どうぐ・たずねる・ことば",
							"en": "Review: Tools, asking & words"
						},
						"levels": 1,
						"vocab": [
							"v_perapasuy",
							"v_aptokikunpe",
							"v_assap",
							"v_hempara",
							"v_nekon",
							"v_nep",
							"v_nep_kusu",
							"v_newa",
							"v_hene",
							"v_ponno",
							"v_kanna",
							"v_hayta",
							"v_kuani",
							"v_yupo",
							"v_tures",
							"v_matkaci",
							"v_onautari",
							"v_eramasu",
							"v_piski",
							"v_yaykosiramsuye",
							"v_inu",
							"v_ere",
							"v_usi",
							"v_hoyupu",
							"v_tumikor",
							"v_oha",
							"v_sirwen",
							"v_e_yes"
						]
					}
				]
			}
		]
	},
	{
		"id": "sec11",
		"cefr": "A1",
		"title": {
			"ja": "借用語",
			"en": "Borrowed words"
		},
		"units": [
			{
				"id": "u50",
				"label": {
					"ja": "ユニット 50",
					"en": "Unit 50"
				},
				"title": {
					"ja": "借用語：動物と食べもの",
					"en": "Borrowed animal and food names"
				},
				"accent": "red",
				"grammar": {
					"ja": "日本語から取り入れた動物や食べものの名前。たとえばumma「馬」は日本語の「馬」に由来する。",
					"en": "Animal and food names borrowed from Japanese. For example, umma “horse” comes from Japanese uma."
				},
				"nodes": [
					{
						"id": "u50n1",
						"type": "lesson",
						"title": {
							"ja": "借用語：動物と食べもの 1",
							"en": "Borrowed animal and food names 1"
						},
						"levels": 1,
						"vocab": [
							"v_umma",
							"v_puta",
							"v_peko",
							"v_niyatori",
							"v_menyo"
						]
					},
					{
						"id": "u50n2",
						"type": "lesson",
						"title": {
							"ja": "借用語：動物と食べもの 2",
							"en": "Borrowed animal and food names 2"
						},
						"levels": 1,
						"vocab": [
							"v_kanpoca",
							"v_kaypeci",
							"v_kosoymi",
							"v_pan",
							"v_kimi"
						]
					},
					{
						"id": "u50n3",
						"type": "review",
						"title": {
							"ja": "復習：借用語：動物と食べもの",
							"en": "Review: Borrowed animal and food names"
						},
						"levels": 1,
						"vocab": [
							"v_umma",
							"v_puta",
							"v_peko",
							"v_niyatori",
							"v_menyo",
							"v_kanpoca",
							"v_kaypeci",
							"v_kosoymi",
							"v_pan",
							"v_kimi"
						]
					}
				]
			},
			{
				"id": "u51",
				"label": {
					"ja": "ユニット 51",
					"en": "Unit 51"
				},
				"title": {
					"ja": "借用語：道具、金属、色",
					"en": "Borrowed words for tools, metals, and colour"
				},
				"accent": "wood",
				"grammar": {
					"ja": "道具や金属、色の借用語。sirokane「銀」のように長く使われてきた語もある。",
					"en": "Borrowed words for tools, metals, and colour, including long-established terms such as sirokane “silver”."
				},
				"nodes": [
					{
						"id": "u51n1",
						"type": "lesson",
						"title": {
							"ja": "借用語：道具、金属、色",
							"en": "Borrowed words for tools, metals, and colour"
						},
						"levels": 1,
						"vocab": [
							"v_ikari",
							"v_konkani",
							"v_sirokane",
							"v_nikapiro",
							"v_makiri"
						]
					},
					{
						"id": "u51n2",
						"type": "review",
						"title": {
							"ja": "復習：借用語：道具、金属、色",
							"en": "Review: Borrowed words for tools, metals, and colour"
						},
						"levels": 1,
						"vocab": [
							"v_ikari",
							"v_konkani",
							"v_sirokane",
							"v_nikapiro",
							"v_makiri"
						]
					}
				]
			}
		]
	}
];
