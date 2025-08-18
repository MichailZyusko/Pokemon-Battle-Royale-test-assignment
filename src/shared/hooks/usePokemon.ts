import { useQueries } from '@tanstack/react-query';
import { getPokemonById } from '../api/pokemon';
import { PokemonDTO } from '../dto/pokemon.dto';

export const usePokemonArray = (ids: number[]) => {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => getPokemonById(id),
    })),
  });

  const pokemons = queries.map((query) => query.data).filter(Boolean) as PokemonDTO[];
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error;

  return {
    pokemons,
    isLoading,
    isError,
    error,
  };
};
