export const DEFAULT_POKEMON_IDS = {
  BULBASAUR: 1,
  PIKACHU: 25,
  GLOOM: 44,
} as const;

export const MAX_POKEMON_ID = 248;

export const DEFAULT_BATTLEFIELD_SIZE = 2;

export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2';

export const LOCAL_STORAGE_KEYS = {
  USER_ID: 'pokemon_battle_user_id',
  VOTED_BATTLES: 'pokemon_battle_voted_battles',
  CURRENT_BATTLE: 'pokemon_current_battle',
  BATTLE_RESULTS: 'pokemon_battle_results',
} as const;
