import axios from 'axios';
import { Pokemon } from '../types/pokemon';
import { POKEMON_API_BASE_URL } from '../constants/pokemon';
import { PokemonDTO } from '../dto/pokemon.dto';

const pokemonApi = axios.create({
  baseURL: POKEMON_API_BASE_URL,
  timeout: 10_000,
});

export const getPokemonById = async (id: number) => {
  const { data: pokemon } = await pokemonApi.get<Pokemon>(`/pokemon/${id}`);

  return new PokemonDTO(pokemon);
};
