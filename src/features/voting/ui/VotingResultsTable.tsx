import React from 'react';
import { VoteStats } from '../../../shared/types/pokemon';
import { PokemonDTO } from '../../../shared/dto/pokemon.dto';
import { cn } from '../../../shared/lib/cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/Table';
import { Badge } from '../../../shared/ui/Badge';
import { Progress } from '../../../shared/ui/Progress';
import { StarIcon, ClockIcon } from '../../../assets/icons/index';

type VotingResultsTableProps = {
  pokemons: PokemonDTO[];
  voteStats: VoteStats;
  totalVotes: number;
  winner: number | 'draw' | null;
};

export function VotingResultsTable({
  pokemons,
  voteStats,
  totalVotes,
  winner,
}: VotingResultsTableProps) {
  const tableData = pokemons.map((pokemon) => {
    const stats = voteStats[pokemon.id] || { votes: 0, percentage: 0 };
    const isWinner = winner === pokemon.id;
    const isTied = winner === 'draw' && stats.votes > 0;

    return {
      pokemon,
      stats,
      isWinner,
      isTied,
    };
  });

  return (
    <section className="mt-8 max-w-4xl mx-auto" aria-label="Voting Results">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">
            Live Voting Results
          </h2>
          <p className="text-blue-100 text-center text-sm mt-1">
            Total votes:
            {' '}
            {totalVotes}
          </p>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                Pokémon
              </TableHead>
              <TableHead className="text-center">
                Votes
              </TableHead>
              <TableHead className="text-center">
                Percentage
              </TableHead>
              <TableHead className="text-center">
                Progress
              </TableHead>
              <TableHead className="text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow
                key={row.pokemon.id}
                className={cn('transition-colors duration-200', {
                  'bg-green-50 border-l-4 border-green-400': row.isWinner,
                  'bg-yellow-50 border-l-4 border-yellow-400': row.isTied,
                  'hover:bg-gray-50': !row.isWinner && !row.isTied,
                })}
              >
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 object-contain"
                        src={row.pokemon.image}
                        alt={row.pokemon.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== row.pokemon.image) {
                            target.src = row.pokemon.image;
                          }
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {row.pokemon.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID:
                        {' '}
                        {row.pokemon.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {row.stats.votes}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {row.stats.percentage.toFixed(1)}
                    %
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Progress
                    value={row.stats.percentage}
                    className={cn('h-3', {
                      '[&>div]:bg-green-500': row.isWinner,
                      '[&>div]:bg-yellow-500': row.isTied,
                      '[&>div]:bg-blue-500': !row.isWinner && !row.isTied,
                    })}
                    aria-label={`Vote progress for ${row.pokemon.name}: ${row.stats.percentage.toFixed(1)}%`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  {(() => {
                    if (row.isWinner) {
                      return (
                        <Badge variant="winning" className="inline-flex items-center">
                          <StarIcon className="w-3 h-3 mr-1" />
                          Winning
                        </Badge>
                      );
                    }
                    if (row.isTied) {
                      return (
                        <Badge variant="tied" className="inline-flex items-center">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Tied
                        </Badge>
                      );
                    }
                    return (
                      <Badge variant="competing">
                        Competing
                      </Badge>
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {winner && (
          <footer className={cn('border-t px-6 py-3', {
            'bg-green-50 border-green-200': winner !== 'draw',
            'bg-yellow-50 border-yellow-200': winner === 'draw',
          })}
          >
            <div
              className={cn('flex items-center justify-center', {
                'text-green-700': winner !== 'draw',
                'text-yellow-700': winner === 'draw',
              })}
              role="status"
              aria-live="polite"
            >
              {winner === 'draw' ? (
                <>
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">
                    It&apos;s a draw! Multiple Pokémon are tied for the lead.
                  </span>
                </>
              ) : (
                <>
                  <StarIcon className="w-5 h-5 mr-2" />
                  <span className="font-semibold">
                    {pokemons.find((p) => p.id === winner)?.name}
                    {' '}
                    is currently winning!
                  </span>
                </>
              )}
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}
