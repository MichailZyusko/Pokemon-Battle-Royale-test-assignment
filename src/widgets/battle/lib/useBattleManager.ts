import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_BATTLEFIELD_SIZE, DEFAULT_POKEMON_IDS, LOCAL_STORAGE_KEYS } from '../../../shared/constants/pokemon';
import { getRandomPokemonIds } from '../../../shared/lib/utils';

type BattleConfig = {
  pokemonIds: number[];
};

const DEFAULT_BATTLE_MANAGER_STATE: BattleConfig = {
  pokemonIds: [
    DEFAULT_POKEMON_IDS.BULBASAUR,
    DEFAULT_POKEMON_IDS.PIKACHU,
    DEFAULT_POKEMON_IDS.GLOOM,
  ],
};

export const useBattleManager = () => {
  const [currentBattle, setCurrentBattle] = useState<BattleConfig>(DEFAULT_BATTLE_MANAGER_STATE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_BATTLE);

      if (stored) {
        const storedBattle = JSON.parse(stored) as BattleConfig;

        if (storedBattle.pokemonIds && storedBattle.pokemonIds.length >= DEFAULT_BATTLEFIELD_SIZE) {
          setCurrentBattle(storedBattle);
        }
      }
    } catch (error) {
      console.error('Failed to load current battle from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_BATTLE, JSON.stringify(currentBattle));
    } catch (error) {
      console.error('Failed to save current battle to localStorage:', error);
    }
  }, [currentBattle]);

  const startRandomBattle = useCallback(() => {
    const pokemonIds = getRandomPokemonIds(DEFAULT_BATTLEFIELD_SIZE);

    setCurrentBattle({ pokemonIds });

    toast.success('🎲 New random battle started!');
  }, []);

  return {
    currentBattle,
    startRandomBattle,
  };
};
