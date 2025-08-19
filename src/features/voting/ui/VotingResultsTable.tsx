import { PokemonDTO } from '../../../shared/dto/pokemon.dto';
import { VoteStats } from '../../../shared/types/pokemon';
import { cn } from '../../../shared/lib/cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/Table';
import { StarIcon, ClockIcon } from '../../../assets/icons/index';

type VotingResultsTableProps = {
  pokemons: PokemonDTO[];
  voteStats: VoteStats;
  totalVotes: number;
  winners: number[];
};

export function VotingResultsTable({
  pokemons,
  voteStats,
  totalVotes,
  winners,
}: VotingResultsTableProps) {
  const tableData = pokemons.map((pokemon) => {
    const stats = voteStats[pokemon.id] || { votes: 0, percentage: 0 };
    const isWinner = winners.includes(pokemon.id);
    const isTied = winners.length > 1 && winners.includes(pokemon.id);

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
                  'bg-green-50 border-l-4 border-green-400': row.isWinner && !row.isTied,
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
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-900">
                      {row.stats.votes}
                    </span>
                    {row.isWinner && (
                    <StarIcon className="ml-2 h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {row.stats.percentage.toFixed(1)}
                    %
                  </span>
                </TableCell>
                <TableCell className="w-32">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn('h-2 rounded-full transition-all duration-500', {
                          'bg-yellow-500': row.isTied,
                          'bg-green-500': row.isWinner && !row.isTied,
                          'bg-blue-500': !row.isWinner && !row.isTied,
                        })}
                        style={{ width: `${row.stats.percentage}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {row.isWinner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {winners.length === 1 ? 'Winner!' : 'Tied!'}
                  </span>
                  )}
                  {row.isTied && !row.isWinner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Tied!
                  </span>
                  )}
                  {!row.isWinner && !row.isTied && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    Waiting
                  </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {winners.length > 0 && (
          <div className={cn('px-6 py-4 border-t', {
            'bg-green-50 border-green-200': winners.length === 1,
            'bg-yellow-50 border-yellow-200': winners.length > 1,
          })}
          >
            <div className={cn('text-center font-semibold', {
              'text-green-700': winners.length === 1,
              'text-yellow-700': winners.length > 1,
            })}
            >
              {winners.length === 1 ? (
                <>
                  🏆 Winner:
                  {' '}
                  {pokemons.find((p) => p.id === winners[0])?.name}
                </>
              ) : (
                <>
                  🤝 Draw between
                  {' '}
                  {winners.length}
                  {' '}
                  Pokémon
                  <div className="text-sm font-normal mt-1">
                    {winners.map((winnerId, index) => {
                      const pokemon = pokemons.find((p) => p.id === winnerId);
                      return (
                        <span key={winnerId}>
                          {pokemon?.name}
                          {index < winners.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
