import { isErrorState, isLoadedState, isLoadingState } from './type-guards';
import {
  ErrorState,
  HttpRequestState,
  LoadedState,
  LoadingState,
} from './model';

type StateName = 'LoadingState' | 'LoadedState' | 'ErrorState';

interface TestParams {
  function: (state?: HttpRequestState<unknown>) => boolean;
  LoadingState: boolean;
  LoadedState: boolean;
  ErrorState: boolean;
}

const testMatrix: TestParams[] = [
  {
    function: isLoadingState,
    LoadingState: true,
    LoadedState: false,
    ErrorState: false,
  },
  {
    function: isLoadedState,
    LoadingState: false,
    LoadedState: true,
    ErrorState: false,
  },
  {
    function: isErrorState,
    LoadingState: false,
    LoadedState: false,
    ErrorState: true,
  },
];

const testStates: Record<StateName, HttpRequestState<void>> = Object.freeze({
  LoadingState: Object.freeze<LoadingState<void>>({
    isLoading: true,
    error: undefined,
  }),
  LoadedState: Object.freeze<LoadedState<void>>({
    isLoading: false,
    error: undefined,
    value: undefined,
  }),
  ErrorState: Object.freeze<ErrorState<void>>({
    isLoading: false,
    error: Error(),
  }),
});

describe('type-guards', () => {
  testMatrix.forEach((testParams) => {
    describe(testParams.function.name, () => {
      Object.entries(testStates).forEach(([stateName, state]) => {
        const expectedResult = testParams[stateName as StateName];
        it(`should return ${expectedResult} when given a ${stateName}`, () => {
          expect(testParams.function(state)).toBe(expectedResult);
        });
      });
      it('should return false if given undefined', () => {
        expect(testParams.function(undefined)).toBe(false);
      });
    });
  });
});
