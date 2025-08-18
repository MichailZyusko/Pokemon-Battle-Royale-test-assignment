import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { toast } from 'react-toastify';
import {
  VoteData, VoteStats, WebSocketMessage, BattleState,
} from '../../../shared/types/pokemon';
import { useWebSocket } from '../../../shared/hooks/useWebSocket';
import {
  getUserId, getBattleKey, hasUserVotedInBattle, markBattleAsVoted, getBattleResult, saveBattleResult, BattleResult,
} from '../../../shared/lib/utils';

type UseVotingProps = {
  pokemonIds: number[];
};

export const useVoting = ({ pokemonIds }: UseVotingProps) => {
  const {
    subscribe, send, isConnected, setBattleId,
  } = useWebSocket();
  const [battleState, setBattleState] = useState<BattleState>({
    userVote: null,
    voteStats: {},
    totalVotes: 0,
    winner: null,
    hasVoted: false,
  });
  const [userId, setUserId] = useState<string>('');
  const processedVotesRef = useRef<Set<string>>(new Set());

  // For backward compatibility, use first two Pokemon IDs for battle key
  const battleKey = getBattleKey(pokemonIds);

  // Initialize userId
  useEffect(() => {
    const initUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    initUserId();
  }, []);

  // Initialize voting state and set battle ID for WebSocket
  useEffect(() => {
    const hasVoted = hasUserVotedInBattle(battleKey);

    // Clear processed votes for new battle
    processedVotesRef.current.clear();

    // Load existing battle result from localStorage
    const existingResult = getBattleResult(battleKey);

    if (existingResult) {
      // If we have a saved result, restore the battle state
      setBattleState((prev) => ({
        ...prev,
        hasVoted,
        voteStats: existingResult.voteStats,
        totalVotes: existingResult.totalVotes,
        winner: existingResult.winner,
      }));
    } else {
      // Reset state for new battle
      setBattleState((prev) => ({
        ...prev,
        hasVoted,
        voteStats: {},
        totalVotes: 0,
        winner: null,
      }));
    }

    // Set the battle ID for real-time communication
    setBattleId(battleKey);
  }, [battleKey, setBattleId]);

  // Calculate winner and stats
  const updateVoteStats = useCallback((stats: VoteStats) => {
    const totalVotes = Object.values(stats).reduce((sum, { votes }) => sum + votes, 0);
    let winner: number | 'draw' | null = null;

    if (totalVotes > 0) {
      const voteCounts = Object.values(stats).map((data) => data.votes);
      const maxVotes = Math.max(...voteCounts);
      const maxVoteCount = voteCounts.filter((votes) => votes === maxVotes).length;

      if (maxVoteCount > 1) {
        // There's a tie - multiple Pokémon have the same number of votes
        winner = 'draw';
      } else {
        // Find the winner
        const [winnerEntry] = Object.entries(stats).reduce(
          (a, b) => (stats[Number(a[0])].votes > stats[Number(b[0])].votes ? a : b),
        );
        winner = Number(winnerEntry);
      }
    }

    // Calculate percentages
    const updatedStats: VoteStats = {};
    Object.entries(stats).forEach(([pokemonId, data]) => {
      updatedStats[Number(pokemonId)] = {
        votes: data.votes,
        percentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0,
      };
    });

    // Save battle result
    const battleResult: BattleResult = {
      battleKey,
      voteStats: updatedStats,
      totalVotes,
      winner,
      timestamp: Date.now(),
    };

    saveBattleResult(battleResult);

    // Show winner notification
    if (winner && winner !== 'draw' && !battleState.winner) {
      toast.success(`🏆 We have a winner! Pokémon #${winner} is leading the battle!`);
    } else if (winner === 'draw' && battleState.winner !== 'draw') {
      toast.info('🤝 It\'s a tie! The battle is heating up!');
    }

    setBattleState((prev) => ({
      ...prev,
      voteStats: updatedStats,
      totalVotes,
      winner,
    }));
  }, [battleState.winner, battleKey]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    console.log('🚀 ~ isConnected:', isConnected);

    if (!isConnected) return undefined;

    const unsubscribe = subscribe((message: WebSocketMessage) => {
      console.log('🚀 ~ message:', message);

      switch (message.type) {
        case 'vote': {
          const voteData = message.payload as VoteData;

          // Skip processing votes from the current user (echoed messages)
          if (voteData.userId === userId) {
            console.log('🔄 Skipping echoed vote from current user');
            break;
          }

          // Skip if we've already processed this vote (additional safety check)
          const voteKey = `${voteData.userId}-${voteData.pokemonId}-${voteData.timestamp}`;
          if (processedVotesRef.current.has(voteKey)) {
            console.log('🔄 Skipping duplicate vote:', voteKey);
            break;
          }

          // Mark this vote as processed
          processedVotesRef.current.add(voteKey);

          console.log('✅ Processing external vote from user:', voteData.userId, 'for Pokémon:', voteData.pokemonId);

          // Update vote statistics
          setBattleState((prev) => {
            const newStats = { ...prev.voteStats };

            if (!newStats[voteData.pokemonId]) {
              newStats[voteData.pokemonId] = { votes: 0, percentage: 0 };
            }

            newStats[voteData.pokemonId].votes += 1;

            return { ...prev, voteStats: newStats };
          });

          // Recalculate stats after state update
          setTimeout(() => {
            setBattleState((prev) => {
              const totalVotes = Object.values(prev.voteStats).reduce((sum, { votes }) => sum + votes, 0);
              let winner: number | 'draw' | null = null;

              if (totalVotes > 0) {
                const voteCounts = Object.values(prev.voteStats).map((data) => data.votes);
                const maxVotes = Math.max(...voteCounts);
                const maxVoteCount = voteCounts.filter((votes) => votes === maxVotes).length;

                if (maxVoteCount > 1) {
                  // There's a tie - multiple Pokémon have the same number of votes
                  winner = 'draw';
                } else {
                  // Find the winner
                  const [winnerEntry] = Object.entries(prev.voteStats).reduce(
                    (a, b) => (prev.voteStats[Number(a[0])].votes > prev.voteStats[Number(b[0])].votes ? a : b),
                  );
                  winner = Number(winnerEntry);
                }
              }

              const updatedStats: VoteStats = {};
              Object.entries(prev.voteStats).forEach(([pokemonId, data]) => {
                updatedStats[Number(pokemonId)] = {
                  votes: data.votes,
                  percentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0,
                };
              });

              // Save battle result to localStorage when we have votes
              if (totalVotes > 0) {
                const battleResult: BattleResult = {
                  battleKey,
                  winner,
                  voteStats: updatedStats,
                  totalVotes,
                  timestamp: Date.now(),
                };
                saveBattleResult(battleResult);
              }

              return {
                ...prev,
                voteStats: updatedStats,
                totalVotes,
                winner,
              };
            });
          }, 0);
          break;
        }
        case 'stats': {
          const stats = message.payload as VoteStats;
          updateVoteStats(stats);
          break;
        }
        case 'new_battle': {
          // Reset voting state for new battle
          setBattleState((prev) => ({
            ...prev,
            userVote: null,
            voteStats: {},
            totalVotes: 0,
            winner: null,
            hasVoted: false,
          }));

          // Clear processed votes for new battle
          processedVotesRef.current.clear();

          // Note: We don't clear localStorage here because this could be triggered
          // by WebSocket messages from other users. The battle state will be
          // properly initialized when the component mounts with new pokemonIds.
          break;
        }
        default:
          // Handle unknown message types
          break;
      }
    });

    return unsubscribe;
  }, [isConnected, subscribe, updateVoteStats, battleKey, userId]);

  const vote = useCallback((pokemonId: number) => {
    // Early return if conditions are not met
    if (!isConnected || battleState.hasVoted || !userId) {
      return;
    }

    const voteData: VoteData = {
      pokemonId,
      userId,
      timestamp: Date.now(),
    };

    const message: WebSocketMessage = {
      type: 'vote',
      payload: voteData,
    };
    console.log('🚀 ~ message:', message);

    send(message);

    // Update local state to mark user as voted and update vote statistics
    setBattleState((prev) => {
      const newStats = { ...prev.voteStats };

      if (!newStats[pokemonId]) {
        newStats[pokemonId] = { votes: 0, percentage: 0 };
      }

      newStats[pokemonId].votes += 1;

      // Recalculate total votes and percentages
      const totalVotes = Object.values(newStats).reduce((sum, { votes }) => sum + votes, 0);

      Object.entries(newStats).forEach(([id, data]) => {
        newStats[Number(id)] = {
          ...data,
          percentage: totalVotes > 0 ? (data.votes / totalVotes) * 100 : 0,
        };
      });

      // Calculate winner
      let winner: number | 'draw' | null = null;
      if (totalVotes > 0) {
        const voteCounts = Object.values(newStats).map((data) => data.votes);
        const maxVotes = Math.max(...voteCounts);
        const maxVoteCount = voteCounts.filter((votes) => votes === maxVotes).length;

        if (maxVoteCount > 1) {
          // There's a tie - multiple Pokémon have the same number of votes
          winner = 'draw';
        } else {
          // Find the winner
          const [winnerEntry] = Object.entries(newStats).reduce(
            (a, b) => (newStats[Number(a[0])].votes > newStats[Number(b[0])].votes ? a : b),
          );
          winner = Number(winnerEntry);
        }
      }

      return {
        ...prev,
        userVote: pokemonId,
        hasVoted: true,
        voteStats: newStats,
        totalVotes,
        winner,
      };
    });

    // Save battle result to localStorage
    setTimeout(() => {
      setBattleState((prev) => {
        const battleResult: BattleResult = {
          battleKey,
          winner: prev.winner,
          voteStats: prev.voteStats,
          totalVotes: prev.totalVotes,
          timestamp: Date.now(),
        };
        saveBattleResult(battleResult);
        return prev;
      });
    }, 0);

    // Mark as voted in localStorage
    markBattleAsVoted(battleKey);

    toast.success('Thanks for voting! Watch the results update in real-time.');
  }, [isConnected, battleState.hasVoted, userId, battleKey, send]);

  const checkForDuplicateVote = useCallback(() => {
    // Check if user has voted in this battle from another tab
    const hasVoted = hasUserVotedInBattle(battleKey);
    if (hasVoted && !battleState.hasVoted) {
      setBattleState((prev) => ({
        ...prev,
        hasVoted: true,
      }));
      return true;
    }
    return false;
  }, [battleKey, battleState.hasVoted]);

  // Check for duplicate votes periodically
  useEffect(() => {
    const interval = setInterval(checkForDuplicateVote, 2000);
    return () => clearInterval(interval);
  }, [checkForDuplicateVote]);

  return {
    ...battleState,
    vote,
    canVote: isConnected && !battleState.hasVoted && !!userId,
    isConnected,
    checkForDuplicateVote,
    userId,
  };
};
