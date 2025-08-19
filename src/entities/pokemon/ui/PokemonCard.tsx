import { PokemonDTO } from '../../../shared/dto/pokemon.dto';
import { cn } from '../../../shared/lib/cn';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/Card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../shared/ui/Tooltip';
import { StarIcon, ClockIcon } from '../../../assets/icons/index';

type PokemonStatsProps = {
  pokemon: PokemonDTO;
};

function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <section
      className="grid grid-cols-3 gap-4 mb-4 text-sm"
      aria-label={`${pokemon.name} statistics`}
    >
      <div className="text-center">
        <dt className="text-gray-500">Height</dt>
        <dd className="font-semibold">{pokemon.height}</dd>
      </div>
      <div className="text-center">
        <dt className="text-gray-500">Weight</dt>
        <dd className="font-semibold">{pokemon.weight}</dd>
      </div>
      <div className="text-center">
        <dt className="text-gray-500">Base XP</dt>
        <dd className="font-semibold">{pokemon.baseExperience}</dd>
      </div>
    </section>
  );
}

type PokemonCardStatusBadgeProps = {
  isWinner: boolean;
  isTied: boolean;
};

function PokemonCardStatusBadge({ isWinner, isTied }: PokemonCardStatusBadgeProps) {
  if (isTied && isWinner) {
    return (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-orange-400 text-orange-900 px-3 py-1 rounded-full text-sm font-bold flex items-center" role="status" aria-live="polite">
          <ClockIcon className="size-3" />
          Tied!
        </div>
      </div>
    );
  }

  if (isWinner) {
    return (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center" role="status" aria-live="polite">
          <StarIcon className="size-4" />
          Winner!
        </div>
      </div>
    );
  }

  return null;
}

type PokemonCardProps = {
  pokemon: PokemonDTO;
  isSelected?: boolean;
  isWinner?: boolean;
  isTied?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export function PokemonCard({
  pokemon,
  isSelected = false,
  isWinner = false,
  isTied = false,
  disabled = false,
  onClick,
}: PokemonCardProps) {
  const cardClasses = cn(
    'relative bg-white transition-all duration-300',
    {
      'cursor-pointer hover:shadow-xl hover:scale-105 transform': !disabled,
      'ring-4 ring-blue-500 ring-opacity-50': isSelected,
      'ring-4 ring-yellow-400 ring-opacity-75 bg-yellow-50': isWinner,
      'ring-4 ring-orange-400 ring-opacity-75 bg-orange-50': isTied && !isWinner,
      'opacity-60 cursor-not-allowed': disabled,
    },
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cardClasses}
            onClick={onClick}
            disabled={disabled}
            aria-label={`${pokemon.name} Pokémon card${isSelected ? ', selected' : ''}${isWinner && !isTied ? ', winner' : ''}${isTied && isWinner ? ', tied' : ''}`}
          >
            <Card className="h-full">
              <PokemonCardStatusBadge isWinner={isWinner} isTied={isTied} />
              <CardContent className="text-center">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-32 h-32 mx-auto object-contain"
                />
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{pokemon.name}</CardTitle>
                </CardHeader>
                <PokemonStats pokemon={pokemon} />
              </CardContent>
            </Card>
          </button>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent>
            <p>You can only vote once per battle</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
