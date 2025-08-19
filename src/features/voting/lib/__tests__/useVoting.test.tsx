import { renderHook, waitFor } from '@testing-library/react';
import { useVoting } from '../useVoting';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('../../../../shared/lib/utils', () => ({
  getUserId: jest.fn().mockResolvedValue('test-user-123'),
  getBattleKey: jest.fn().mockReturnValue('1_vs_25'),
  hasUserVotedInBattle: jest.fn().mockReturnValue(false),
  markBattleAsVoted: jest.fn(),
  saveBattleResult: jest.fn(),
  getBattleResult: jest.fn().mockReturnValue(null),
}));

const mockUseWebSocket = jest.fn().mockReturnValue({
  isConnected: true,
  subscribe: jest.fn().mockReturnValue(jest.fn()),
  send: jest.fn(),
  setBattleId: jest.fn(),
});

jest.mock('../../../../shared/hooks/useWebSocket', () => ({
  useWebSocket: mockUseWebSocket,
}));

describe('useVoting', () => {
  const mockPokemonIds = [1, 25];
  const mockSubscribe = jest.fn().mockReturnValue(jest.fn());
  const mockSend = jest.fn();
  const mockSetBattleId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      subscribe: mockSubscribe,
      send: mockSend,
      setBattleId: mockSetBattleId,
    });
  });

  it('should not allow voting when disconnected', async () => {
    mockUseWebSocket.mockReturnValue({
      isConnected: false,
      subscribe: mockSubscribe,
      send: mockSend,
      setBattleId: mockSetBattleId,
    });

    const { result } = renderHook(() => useVoting({ pokemonIds: mockPokemonIds }));

    await waitFor(() => {
      expect(result.current.canVote).toBe(false);
    });
  });

  it('should handle WebSocket message subscription', async () => {
    renderHook(() => useVoting({ pokemonIds: mockPokemonIds }));

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalled();
    });
  });
});
