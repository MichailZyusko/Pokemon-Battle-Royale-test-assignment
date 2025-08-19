import {
  getUserId,
  getBattleKey,
  hasUserVotedInBattle,
  markBattleAsVoted,
  getRandomPokemonIds,
  saveBattleResult,
  getBattleResult,
  type BattleResult,
} from '../utils';
import { LOCAL_STORAGE_KEYS, MAX_POKEMON_ID, DEFAULT_BATTLEFIELD_SIZE } from '../../constants/pokemon';

jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({ visitorId: 'test-user-123' }),
  }),
}));

describe('Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should return stored user ID if exists', async () => {
      localStorage.getItem.mockReturnValue('stored-user-456');

      const result = await getUserId();

      expect(result).toBe('stored-user-456');
    });
  });

  describe('getBattleKey', () => {
    it('should create battle key from sorted pokemon IDs', () => {
      const pokemonIds = [25, 1, 44];
      const result = getBattleKey(pokemonIds);

      expect(result).toBe('1_vs_25_vs_44');
    });

    it('should handle single pokemon ID', () => {
      const pokemonIds = [25];
      const result = getBattleKey(pokemonIds);

      expect(result).toBe('25');
    });

    it('should handle empty array', () => {
      const pokemonIds: number[] = [];
      const result = getBattleKey(pokemonIds);

      expect(result).toBe('');
    });
  });

  describe('hasUserVotedInBattle', () => {
    it('should return false if no voted battles exist', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = hasUserVotedInBattle('1_vs_25');

      expect(result).toBe(false);
    });

    it('should return true if battle exists in voted battles', () => {
      const votedBattles = ['1_vs_25', '44_vs_100'];
      localStorage.getItem.mockReturnValue(JSON.stringify(votedBattles));

      const result = hasUserVotedInBattle('1_vs_25');

      expect(result).toBe(true);
    });

    it('should return false if battle does not exist in voted battles', () => {
      const votedBattles = ['1_vs_25', '44_vs_100'];
      localStorage.getItem.mockReturnValue(JSON.stringify(votedBattles));

      const result = hasUserVotedInBattle('999_vs_1000');

      expect(result).toBe(false);
    });
  });

  describe('markBattleAsVoted', () => {
    it('should add battle to voted battles if not already present', () => {
      const existingBattles = ['1_vs_25'];
      localStorage.getItem.mockReturnValue(JSON.stringify(existingBattles));

      markBattleAsVoted('44_vs_100');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.VOTED_BATTLES,
        JSON.stringify(['1_vs_25', '44_vs_100']),
      );
    });

    it('should not add battle if already voted', () => {
      const existingBattles = ['1_vs_25', '44_vs_100'];
      localStorage.getItem.mockReturnValue(JSON.stringify(existingBattles));

      markBattleAsVoted('1_vs_25');

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should create new array if no voted battles exist', () => {
      localStorage.getItem.mockReturnValue(null);

      markBattleAsVoted('1_vs_25');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.VOTED_BATTLES,
        JSON.stringify(['1_vs_25']),
      );
    });
  });

  describe('getRandomPokemonIds', () => {
    it('should return default number of pokemon IDs', () => {
      const result = getRandomPokemonIds();

      expect(result).toHaveLength(DEFAULT_BATTLEFIELD_SIZE);
      result.forEach((id) => {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(MAX_POKEMON_ID);
      });
    });

    it('should return specified number of pokemon IDs', () => {
      const count = 5;
      const result = getRandomPokemonIds(count);

      expect(result).toHaveLength(count);
      result.forEach((id) => {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(MAX_POKEMON_ID);
      });
    });

    it('should return unique IDs', () => {
      const result = getRandomPokemonIds(10);

      const uniqueIds = new Set(result);
      expect(uniqueIds.size).toBe(result.length);
    });
  });

  describe('saveBattleResult', () => {
    it('should save battle result to localStorage', () => {
      localStorage.getItem.mockReturnValue(null);

      const battleResult: BattleResult = {
        battleKey: '1_vs_25',
        winners: [1],
        voteStats: { 1: { votes: 5, percentage: 100 }, 25: { votes: 0, percentage: 0 } },
        totalVotes: 5,
        timestamp: Date.now(),
      };

      saveBattleResult(battleResult);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.BATTLE_RESULTS,
        JSON.stringify({ '1_vs_25': battleResult }),
      );
    });

    it('should merge with existing battle results', () => {
      const existingResult: BattleResult = {
        battleKey: '44_vs_100',
        winners: [44],
        voteStats: { 44: { votes: 3, percentage: 100 }, 100: { votes: 0, percentage: 0 } },
        totalVotes: 3,
        timestamp: Date.now(),
      };

      localStorage.getItem.mockReturnValue(JSON.stringify({ '44_vs_100': existingResult }));

      const newResult: BattleResult = {
        battleKey: '1_vs_25',
        winners: [1],
        voteStats: { 1: { votes: 5, percentage: 100 }, 25: { votes: 0, percentage: 0 } },
        totalVotes: 5,
        timestamp: Date.now(),
      };

      saveBattleResult(newResult);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.BATTLE_RESULTS,
        JSON.stringify({
          '44_vs_100': existingResult,
          '1_vs_25': newResult,
        }),
      );
    });
  });

  describe('getBattleResult', () => {
    it('should return null if no battle results exist', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = getBattleResult('1_vs_25');

      expect(result).toBeNull();
    });

    it('should return battle result if exists', () => {
      const battleResult: BattleResult = {
        battleKey: '1_vs_25',
        winners: [1],
        voteStats: { 1: { votes: 5, percentage: 100 }, 25: { votes: 0, percentage: 0 } },
        totalVotes: 5,
        timestamp: Date.now(),
      };

      localStorage.getItem.mockReturnValue(JSON.stringify({ '1_vs_25': battleResult }));

      const result = getBattleResult('1_vs_25');

      expect(result).toEqual(battleResult);
    });

    it('should return null if battle key does not exist', () => {
      const battleResult: BattleResult = {
        battleKey: '1_vs_25',
        winners: [1],
        voteStats: { 1: { votes: 5, percentage: 100 }, 25: { votes: 0, percentage: 0 } },
        totalVotes: 5,
        timestamp: Date.now(),
      };

      localStorage.getItem.mockReturnValue(JSON.stringify({ '1_vs_25': battleResult }));

      const result = getBattleResult('999_vs_1000');

      expect(result).toBeNull();
    });
  });
});
