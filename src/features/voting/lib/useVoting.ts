import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { toast } from 'react-toastify';
import {
  BattleState, VoteStats, VoteData, WebSocketMessage,
  WebSocketEventType,
} from '../../../shared/types/pokemon';
import {
  getUserId, getBattleKey, hasUserVotedInBattle, markBattleAsVoted, saveBattleResult, getBattleResult,
} from '../../../shared/lib/utils';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';

type UseVotingProps = {
  pokemonIds: number[];
};

export function useVoting({ pokemonIds }: UseVotingProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    userVote: null,
    voteStats: {},
    totalVotes: 0,
    winners: [],
    hasVoted: false,
  });

  const [userId, setUserId] = useState<string>('');
  const processedVotesRef = useRef<Set<string>>(new Set());

  const battleKey = getBattleKey(pokemonIds);
  const {
    isConnected, subscribe, send, setBattleId: setWebSocketBattleId,
  } = useWebSocket();

  useEffect(() => {
    const initializeUser = async () => {
      const user = await getUserId();
      setUserId(user);
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (!battleKey) return;

    const existingResult = getBattleResult(battleKey);
    if (existingResult) {
      setBattleState((prev) => ({
        ...prev,
        voteStats: existingResult.voteStats,
        totalVotes: existingResult.totalVotes,
        winners: existingResult.winners,
      }));
    } else {
      setBattleState((prev) => ({
        ...prev,
        voteStats: {},
        totalVotes: 0,
        winners: [],
      }));
    }

    setWebSocketBattleId(battleKey);
  }, [battleKey, setWebSocketBattleId]);

  const calculateWinners = useCallback((stats: VoteStats, totalVotes: number): number[] => {
    if (totalVotes === 0) return [];

    const voteCounts = Object.values(stats).map((data) => data.votes);
    const maxVotes = Math.max(...voteCounts);
    const winners = Object.entries(stats)
      .filter(([, data]) => data.votes === maxVotes)
      .map(([pokemonId]) => Number(pokemonId));

    return winners;
  }, []);

  const updateVoteStats = useCallback((stats: VoteStats) => {
    const totalVotes = Object.values(stats).reduce((sum, { votes }) => sum + votes, 0);
    const winners = calculateWinners(stats, totalVotes);

    const updatedStats: VoteStats = {};
    Object.entries(stats).forEach(([pokemonId, data]) => {
      updatedStats[Number(pokemonId)] = {
        votes: data.votes,
        percentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0,
      };
    });

    const battleResult = {
      battleKey,
      voteStats: updatedStats,
      totalVotes,
      winners,
      timestamp: Date.now(),
    };

    saveBattleResult(battleResult);

    if (winners.length === 1 && battleState.winners.length !== 1) {
      toast.success(`🏆 We have a winner! Pokémon #${winners[0]} is leading the battle!`);
    } else if (winners.length > 1 && battleState.winners.length <= 1) {
      toast.info('🤝 It\'s a tie! The battle is heating up!');
    }

    setBattleState((prev) => ({
      ...prev,
      voteStats: updatedStats,
      totalVotes,
      winners,
    }));
  }, [battleState.winners, battleKey, calculateWinners]);

  const processVoteStats = useCallback((stats: VoteStats) => {
    const totalVotes = Object.values(stats).reduce((sum, { votes }) => sum + votes, 0);
    const winners = calculateWinners(stats, totalVotes);

    const updatedStats: VoteStats = {};
    Object.entries(stats).forEach(([pokemonId, data]) => {
      updatedStats[Number(pokemonId)] = {
        votes: data.votes,
        percentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0,
      };
    });

    if (totalVotes > 0) {
      const battleResult = {
        battleKey,
        winners,
        voteStats: updatedStats,
        totalVotes,
        timestamp: Date.now(),
      };
      saveBattleResult(battleResult);
    }

    return { updatedStats, totalVotes, winners };
  }, [battleKey, calculateWinners]);

  useEffect(() => {
    if (!isConnected) return undefined;

    const unsubscribe = subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case WebSocketEventType.VOTE: {
          const voteData = message.payload as VoteData;

          if (voteData.userId === userId) break;

          const voteKey = `${voteData.userId}-${voteData.pokemonId}-${voteData.timestamp}`;
          if (processedVotesRef.current.has(voteKey)) break;

          processedVotesRef.current.add(voteKey);

          setBattleState((prev) => {
            const newStats = { ...prev.voteStats };
            if (!newStats[voteData.pokemonId]) {
              newStats[voteData.pokemonId] = { votes: 0, percentage: 0 };
            }
            newStats[voteData.pokemonId].votes += 1;

            return { ...prev, voteStats: newStats };
          });

          setTimeout(() => {
            setBattleState((prev) => {
              const { updatedStats, totalVotes, winners } = processVoteStats(prev.voteStats);
              return {
                ...prev,
                voteStats: updatedStats,
                totalVotes,
                winners,
              };
            });
          }, 0);
          break;
        }
        case WebSocketEventType.NEW_BATTLE: {
          setBattleState((prev) => ({
            ...prev,
            userVote: null,
            voteStats: {},
            totalVotes: 0,
            winners: [],
            hasVoted: false,
          }));
          processedVotesRef.current.clear();

          break;
        }
        default:
          break;
      }
    });

    return unsubscribe;
  }, [isConnected, subscribe, updateVoteStats, userId, processVoteStats]);

  const vote = useCallback((pokemonId: number) => {
    if (!isConnected || battleState.hasVoted || !userId) return;

    const voteData: VoteData = {
      pokemonId,
      userId,
      timestamp: Date.now(),
    };

    const message: WebSocketMessage = {
      type: WebSocketEventType.VOTE,
      payload: voteData,
    };

    send(message);

    setBattleState((prev) => {
      const newStats = { ...prev.voteStats };

      if (!newStats[pokemonId]) {
        newStats[pokemonId] = { votes: 0, percentage: 0 };
      }
      newStats[pokemonId].votes += 1;

      const { updatedStats, totalVotes, winners } = processVoteStats(newStats);

      return {
        ...prev,
        userVote: pokemonId,
        hasVoted: true,
        voteStats: updatedStats,
        totalVotes,
        winners,
      };
    });

    markBattleAsVoted(battleKey);
    toast.success('Thanks for voting! Watch the results update in real-time.');
  }, [isConnected, battleState.hasVoted, userId, battleKey, send, processVoteStats]);

  const refreshStateFromStorage = useCallback(() => {
    const hasVoted = hasUserVotedInBattle(battleKey);
    const existingResult = getBattleResult(battleKey);

    if (existingResult) {
      setBattleState((prev) => ({
        ...prev,
        hasVoted,
        voteStats: existingResult.voteStats,
        totalVotes: existingResult.totalVotes,
        winners: existingResult.winners,
      }));
    } else {
      setBattleState((prev) => ({
        ...prev,
        hasVoted,
        voteStats: {},
        totalVotes: 0,
        winners: [],
      }));
    }
  }, [battleKey]);

  useEffect(() => {
    const handleWindowFocus = () => {
      refreshStateFromStorage();
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [refreshStateFromStorage]);

  return {
    ...battleState,
    vote,
    canVote: isConnected && !battleState.hasVoted && !!userId,
    isConnected,
    userId,
  };
}
