import React, { useState, useEffect } from 'react';
import { PokemonCard } from '../../../entities/pokemon/ui/PokemonCard';
import { Button } from '../../../shared/ui/Button';
import { Alert, AlertDescription } from '../../../shared/ui/Alert';
import { useVoting } from '../lib/useVoting';
import { VotingResultsTable } from './VotingResultsTable';
import { PokemonDTO } from '../../../shared/dto/pokemon.dto';
import { cn } from '../../../shared/lib/cn';
import { WarningIcon, InfoIcon } from '../../../assets/icons/index';

type VotingInterfaceProps = {
  pokemons: PokemonDTO[];
  onNewBattle: () => void;
};

export function VotingInterface({
  pokemons,
  onNewBattle,
}: VotingInterfaceProps) {
  const voting = useVoting({
    pokemonIds: pokemons.map((p) => p.id),
  });

  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [showResultsAnimation, setShowResultsAnimation] = useState(false);

  // Check for duplicate votes
  useEffect(() => {
    const checkDuplicate = () => {
      const isDuplicate = voting.checkForDuplicateVote();
      if (isDuplicate) {
        setShowDuplicateWarning(true);
        setTimeout(() => setShowDuplicateWarning(false), 5000);
      }
    };

    const interval = setInterval(checkDuplicate, 3000);
    return () => clearInterval(interval);
  }, [voting]);

  // Show results animation after voting
  useEffect(() => {
    if (voting.hasVoted && voting.totalVotes > 0) {
      setShowResultsAnimation(true);
    }
  }, [voting.hasVoted, voting.totalVotes]);

  const handlePokemonSelect = (pokemonId: number) => {
    if (!voting.canVote) return;
    setSelectedPokemon(pokemonId);
  };

  const handleVote = () => {
    if (!selectedPokemon || !voting.canVote) return;
    voting.vote(selectedPokemon);
    setSelectedPokemon(null);
  };

  const handleNewBattle = () => {
    setSelectedPokemon(null);
    setShowResultsAnimation(false);

    onNewBattle();
  };

  const getConnectionStatus = () => {
    if (!voting.isConnected) {
      return (
        <Alert variant="warning" className="mb-8">
          <AlertDescription>
            <div className="flex items-center">
              <WarningIcon className="w-4 h-4 mr-2" />
              <span>Connecting to real-time voting server...</span>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert variant="success" className="mb-8">
        <AlertDescription>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" aria-hidden="true" />
            <span>🌍 Connected to real-time voting! Votes from other users will appear instantly.</span>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  const getDuplicateWarning = () => {
    if (!showDuplicateWarning) return null;

    return (
      <Alert variant="destructive" className="mb-4 animate-pulse">
        <AlertDescription>
          <div className="flex items-center">
            <InfoIcon className="w-4 h-4 mr-2" />
            <span>You&apos;ve already voted in this battle from another tab!</span>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <article className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Pokémon Battle Royale
        </h1>
        <p className="text-lg text-gray-600">
          Choose your champion and watch the votes roll in live!
        </p>
        {voting.totalVotes > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            🗳️
            {' '}
            <span className="font-semibold">{voting.totalVotes}</span>
            {' '}
            real votes from users worldwide
          </div>
        )}
      </header>

      {getConnectionStatus()}
      {getDuplicateWarning()}

      <section className="flex flex-col md:flex-row items-center justify-center mb-8" aria-label="Pokémon Battle Arena">
        {pokemons.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
            <div className={cn('transition-all duration-500', {
              'transform scale-105': showResultsAnimation,
            })}
            >
              <PokemonCard
                pokemon={pokemon}
                isSelected={selectedPokemon === pokemon.id}
                isWinner={voting.winner === pokemon.id}
                isTied={voting.winner === 'draw' && (voting.voteStats[pokemon.id]?.votes || 0) > 0}
                onClick={() => handlePokemonSelect(pokemon.id)}
                disabled={!voting.canVote}
              />
            </div>
            {index < pokemons.length - 1 && (
              <div className="flex items-center justify-center w-32 flex-shrink-0" aria-hidden="true">
                <div className="text-6xl font-bold text-gray-400 select-none">VS</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </section>

      <section className="text-center space-y-4" aria-label="Voting Controls">
        {!voting.hasVoted && voting.canVote && (
          <div>
            <Button
              onClick={handleVote}
              disabled={!selectedPokemon}
              size="large"
              className="px-8"
              aria-describedby="voting-instructions"
            >
              {selectedPokemon
                ? `Vote for ${pokemons.find((p) => p.id === selectedPokemon)?.name}!`
                : 'Select a Pokémon to vote'}
            </Button>
            <p id="voting-instructions" className="text-sm text-gray-500 mt-2">
              Click on a Pokémon card to select it, then vote!
            </p>
          </div>
        )}

        {voting.hasVoted && (
          <Button
            onClick={handleNewBattle}
            variant="secondary"
            size="large"
            className="px-8"
          >
            Start New Battle
          </Button>
        )}

        {!voting.isConnected && (
          <p className="text-sm text-gray-500">
            Waiting for connection to enable live voting...
          </p>
        )}
      </section>

      {/* Voting Results Table */}
      <VotingResultsTable
        pokemons={pokemons}
        voteStats={voting.voteStats}
        totalVotes={voting.totalVotes}
        winner={voting.winner}
      />

    </article>
  );
}
