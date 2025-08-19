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
  winners: number[];
  hasVoted: boolean;
};

export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: VoteData | VoteStats | { battleId: string } | unknown;
}

export enum WebSocketEventType {
  VOTE = 'vote',
  NEW_BATTLE = 'new_battle',
  HEARTBEAT = 'heartbeat',
}
