import { GameState } from '../types/telemetry';

export function resetGameState(): GameState {
  return 'consent';
}

export function nextGameState(current: GameState): GameState {
  switch (current) {
    case 'consent':
      return 'calibration';
    case 'calibration':
      return 'question';
    case 'question':
      return 'interrogation';
    case 'interrogation':
      return 'verdict';
    case 'verdict':
      return 'calibration';
    default:
      return 'consent';
  }
}
