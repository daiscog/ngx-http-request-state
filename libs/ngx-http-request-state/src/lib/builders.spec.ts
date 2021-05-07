import { errorState, loadedState, loadingState } from './builders';
import { isErrorState, isLoadedState, isLoadingState } from './type-guards';

describe('builders', () => {
  describe('loadingState', () => {
    it('should return a new LoadingState with the given last-known value', () => {
      const value = { foo: 42 };
      const result = loadingState(value);
      expect(isLoadingState(result)).toBe(true);
      expect(result.value).toBe(value);
    });
    it('should return a new LoadingState with no value if given undefined', () => {
      const result = loadingState();
      expect(isLoadingState(result)).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('loadedState', () => {
    it('should return a new LoadedState wrapping the given value', () => {
      const value = { foo: 42 };
      const result = loadedState(value);
      expect(isLoadedState(result)).toBe(true);
      expect(result.value).toBe(value);
    });
    it('should return a new LoadedState with no value if given undefined', () => {
      const result = loadedState();
      expect(isLoadedState(result)).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('errorState', () => {
    it('should return a new ErrorState wrapping the given error and last-known value', () => {
      const error = Error();
      const value = { foo: 42 };
      const result = errorState(error, value);
      expect(isErrorState(result)).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBe(value);
    });
    it('should return a new ErrorState wrapping the given error and with no last-known value if given only an error', () => {
      const error = Error();
      const result = errorState(error);
      expect(isErrorState(result)).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBeUndefined();
    });
  });
});
