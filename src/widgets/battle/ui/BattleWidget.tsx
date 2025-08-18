import { useQueryClient } from '@tanstack/react-query';
import { usePokemonArray } from '../../../shared/hooks/usePokemon';
import { ErrorMessage } from '../../../shared/ui/ErrorMessage';
import { VotingInterface } from '../../../features/voting/ui/VotingInterface';
import { useBattleManager } from '../lib/useBattleManager';
import { DEFAULT_BATTLEFIELD_SIZE } from '../../../shared/constants/pokemon';
import { BattleArenaSkeleton, VotingResultsSkeleton } from '../../../shared/ui/SkeletonLoader';

export function BattleWidget() {
  const queryClient = useQueryClient();
  const battleManager = useBattleManager();
  const {
    pokemons,
    isLoading,
    isError,
    error,
  } = usePokemonArray(battleManager.currentBattle.pokemonIds);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <article className="max-w-6xl mx-auto p-6">
          <header className="text-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pokémon Battle Royale
            </h1>
            <p className="text-lg text-gray-600">
              Choose your champion and watch the votes roll in live!
            </p>
          </header>

          <BattleArenaSkeleton pokemonCount={3} className="mb-8" />

          <div className="text-center space-y-4">
            <div className="h-12 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse" />
            <div className="h-12 w-32 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>

          <VotingResultsSkeleton rowCount={3} className="mt-8" />
        </article>
      </div>
    );
  }

  if (isError || !pokemons || pokemons.length < DEFAULT_BATTLEFIELD_SIZE) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <ErrorMessage
          title="Failed to load Pokémon"
          message={error?.message || 'Something went wrong while loading the battle'}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['pokemon'] })}
          retryText="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <VotingInterface
        pokemons={pokemons}
        onNewBattle={battleManager.startRandomBattle}
      />
    </div>
  );
}
