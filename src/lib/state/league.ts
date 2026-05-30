/** League tiers, derived from total XP. Shared by the profile, the leaderboard
 *  page, and the /api/leaderboard endpoint. */
export const LEAGUES = ['Bronze', 'Silver', 'Gold', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];
export const LEAGUES_JA = ['ブロンズ', 'シルバー', 'ゴールド', 'サファイア', 'ルビー', 'エメラルド', 'ダイヤモンド'];

/** Total-XP threshold to ENTER each tier (index aligns with LEAGUES). */
export const LEAGUE_THRESHOLDS = [0, 500, 1500, 3000, 6000, 10000, 20000];

/** League index for a given total XP. */
export function leagueForXp(xp: number): number {
	let i = 0;
	for (let k = 0; k < LEAGUE_THRESHOLDS.length; k++) if (xp >= LEAGUE_THRESHOLDS[k]) i = k;
	return i;
}

/** XP needed to reach the next tier, or null at the top. */
export function nextThreshold(xp: number): number | null {
	const i = leagueForXp(xp);
	return i + 1 < LEAGUE_THRESHOLDS.length ? LEAGUE_THRESHOLDS[i + 1] : null;
}
