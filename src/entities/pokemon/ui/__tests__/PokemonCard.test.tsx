import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from '../PokemonCard';
import { PokemonDTO } from '../../../../shared/dto/pokemon.dto';

const mockPokemon: PokemonDTO = {
  id: 1,
  name: 'Bulbasaur',
  height: '7 m',
  weight: '69 kg',
  baseExperience: 64,
  image: 'https://example.com/bulbasaur.png',
};

describe('PokemonCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pokemon information correctly', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={mockOnClick}
      />,
    );

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByText(mockPokemon.height)).toBeInTheDocument();
    expect(screen.getByText(mockPokemon.weight)).toBeInTheDocument();
    expect(screen.getByText(mockPokemon.baseExperience)).toBeInTheDocument();
    expect(screen.getByAltText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show selected state when isSelected is true', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isSelected
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-4');
    expect(button).toHaveAttribute('aria-label', 'Bulbasaur Pokémon card, selected');
  });

  it('should show winner state when isWinner is true', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isWinner
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-4', 'bg-yellow-50');
    expect(screen.getByText('Winner!')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Bulbasaur Pokémon card, winner');
  });

  it('should show tied state when isTied is true', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isTied
        isWinner
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-4', 'bg-yellow-50');
    expect(screen.getByText('Tied!')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Bulbasaur Pokémon card, tied');
  });

  it('should show disabled state when disabled is true', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        disabled
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-60', 'cursor-not-allowed');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        disabled
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should show tooltip when disabled', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        disabled
        onClick={mockOnClick}
      />,
    );

    const tooltip = document.querySelector('[data-state="closed"]');
    expect(tooltip).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Bulbasaur Pokémon card');
  });

  it('should have correct statistics section', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={mockOnClick}
      />,
    );

    const statsSection = screen.getByLabelText('Bulbasaur statistics');
    expect(statsSection).toBeInTheDocument();
  });

  it('should handle hover and focus states', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={mockOnClick}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer', 'hover:shadow-xl', 'hover:scale-105');
  });
});
