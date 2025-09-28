import myListReducer, { addToList, removeFromList, setList } from './myListSlice';

describe('myListSlice reducer', () => {
  const movieA = { id: 1, name: 'A' };
  const movieB = { id: 2, name: 'B' };

  it('should handle initial state', () => {
    const state = myListReducer(undefined, { type: '@@INIT' });
    expect(Array.isArray(state)).toBe(true);
  });

  it('should add a movie', () => {
    const state = myListReducer([], addToList(movieA));
    expect(state).toHaveLength(1);
    expect(state[0].id).toBe(1);
  });

  it('should not add duplicates', () => {
    const state1 = myListReducer([], addToList(movieA));
    const state2 = myListReducer(state1, addToList(movieA));
    expect(state2).toHaveLength(1);
  });

  it('should remove a movie', () => {
    const state1 = myListReducer([movieA, movieB], removeFromList(1));
    expect(state1).toHaveLength(1);
    expect(state1[0].id).toBe(2);
  });

  it('should set list', () => {
    const state = myListReducer([], setList([movieA, movieB]));
    expect(state).toHaveLength(2);
  });
});
