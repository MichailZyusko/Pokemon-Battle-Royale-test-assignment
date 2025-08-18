export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
  };
};

export type VoteData = {
  pokemonId: number;
  userId: string;
  timestamp: number;
};

export type VoteStats = {
  [pokemonId: number]: {
    votes: number;
    percentage: number;
  };
};

export type BattleState = {
  userVote: number | null;
  voteStats: VoteStats;
  totalVotes: number;
  winner: number | 'draw' | null;
  hasVoted: boolean;
};

export interface WebSocketMessage {
  type: 'vote' | 'stats' | 'new_battle' | 'join_battle' | 'heartbeat';
  payload: VoteData | VoteStats | { pokemon1Id: number; pokemon2Id: number } | { battleId: string } | unknown;
}
