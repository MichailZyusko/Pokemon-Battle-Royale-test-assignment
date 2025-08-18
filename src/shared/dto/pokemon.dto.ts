import { Pokemon } from '../types/pokemon';

const formatPokemonName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

const formatWeight = (weight: number): string => `${(weight / 10).toFixed(1)} kg`;

const formatHeight = (height: number): string => `${(height / 10).toFixed(1)} m`;

export class PokemonDTO {
  readonly id: number;

  readonly name: string;

  readonly height: string;

  readonly weight: string;

  readonly baseExperience: number;

  readonly image: string;

  constructor(pokemon: Pokemon) {
    this.id = pokemon.id;
    this.name = formatPokemonName(pokemon.name);
    this.height = formatHeight(pokemon.height);
    this.weight = formatWeight(pokemon.weight);
    this.baseExperience = pokemon.base_experience;
    this.image = pokemon.sprites.front_default;
  }
}
