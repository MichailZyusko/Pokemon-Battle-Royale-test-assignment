import { load } from '@fingerprintjs/fingerprintjs';
import { DEFAULT_BATTLEFIELD_SIZE, LOCAL_STORAGE_KEYS, MAX_POKEMON_ID } from '../constants/pokemon';

export const getUserId = async (): Promise<string> => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
  if (stored) return stored;

  const agent = await load();
  const { visitorId } = await agent.get();

  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, visitorId);

  return visitorId;
};

export const getBattleKey = (pokemonIds: number[]): string => pokemonIds.sort((a, b) => a - b).join('_vs_');

export const hasUserVotedInBattle = (battleKey: string): boolean => {
  const voted = localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_BATTLES);
  if (!voted) return false;

  const votedBattles = JSON.parse(voted) as string[];

  return votedBattles.includes(battleKey);
};

export const markBattleAsVoted = (battleKey: string): void => {
  const voted = localStorage.getItem(LOCAL_STORAGE_KEYS.VOTED_BATTLES);
  const votedBattles = voted ? JSON.parse(voted) as string[] : [];

  if (!votedBattles.includes(battleKey)) {
    votedBattles.push(battleKey);
    localStorage.setItem(LOCAL_STORAGE_KEYS.VOTED_BATTLES, JSON.stringify(votedBattles));
  }
};

export const getRandomPokemonIds = (count: number = DEFAULT_BATTLEFIELD_SIZE): number[] => {
  const ids = new Set<number>();

  while (ids.size < count) {
    const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    ids.add(randomId);
  }

  return Array.from(ids);
};

// Battle result storage functions
export interface BattleResult {
  battleKey: string;
  winner: number | 'draw' | null;
  voteStats: { [pokemonId: number]: { votes: number; percentage: number } };
  totalVotes: number;
  timestamp: number;
}

export const saveBattleResult = (battleResult: BattleResult): void => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BATTLE_RESULTS);
    const results = stored ? JSON.parse(stored) as { [key: string]: BattleResult } : {};

    results[battleResult.battleKey] = battleResult;
    localStorage.setItem(LOCAL_STORAGE_KEYS.BATTLE_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Failed to save battle result:', error);
  }
};

export const getBattleResult = (battleKey: string): BattleResult | null => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BATTLE_RESULTS);
    if (!stored) return null;

    const results = JSON.parse(stored) as { [key: string]: BattleResult };

    return results[battleKey] || null;
  } catch (error) {
    console.error('Failed to get battle result:', error);

    return null;
  }
};
