import { nextGameState, resetGameState } from '../stateMachine';

describe('Game State Transitions', () => {
  it('progresses strictly in order through the 5 game phases', () => {
    let state = resetGameState();
    expect(state).toBe('consent');

    state = nextGameState(state);
    expect(state).toBe('calibration');

    state = nextGameState(state);
    expect(state).toBe('question');

    state = nextGameState(state);
    expect(state).toBe('interrogation');

    state = nextGameState(state);
    expect(state).toBe('verdict');

    // From verdict, it loops back to question or calibration for next suspect
    state = nextGameState(state);
    expect(state).toBe('calibration');
  });
});
