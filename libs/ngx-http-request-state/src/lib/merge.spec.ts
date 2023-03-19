import { errorState, loadedState, loadingState } from "./builders";
import { isErrorState, isLoadedState, isLoadingState } from "./type-guards";
import { mergeStates} from "./merge"

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)

describe('merge', () => {
  it('should return a loadingState if one of the inputs are loading state', () => {
    const loading = loadingState<number>();
    const loaded = loadedState(42);

    const mergedLoadingLoading = mergeStates([loading, loading], sum);
    expect(isLoadingState(mergedLoadingLoading)).toBe(true);

    const mergedLoadingLoaded = mergeStates([loading, loaded], sum);
    expect(isLoadingState(mergedLoadingLoaded)).toBe(true);

    const mergeLoadedLoading = mergeStates([loaded, loading], sum);
    expect(isLoadingState(mergeLoadedLoading)).toBe(true);
  });

  it('should return merged loadedState if all inputs are loaded state', () => {
    const s1 = loadedState(42);
    const s2 = loadedState(1337);

    const merged = mergeStates([s1, s2], sum);

    expect(isLoadedState(merged)).toBe(true);
    expect(merged.value).toBe(42 + 1337)
  });

  it('should return error state if one state fails', () => {
    const loading = loadingState();
    const loaded = loadedState(42);
    const error = errorState(new Error("Test"))

    const mergedLoadingError = mergeStates([loading, error], sum);

    expect(isErrorState(mergedLoadingError)).toBe(true);
    expect(mergedLoadingError.error.message).toBe("Test");

    const mergedLoadedError = mergeStates([loaded, error], sum);

    expect(isErrorState(mergedLoadedError)).toBe(true);
    expect(mergedLoadedError.error.message).toBe("Test");
  });


  it('should return error state with custom error in case mergeErrors is supplied', () => {
    const loaded = loadedState(42);
    const error1 = errorState(new Error("Goodbye"));
    const error2 = errorState(new Error("world"));

    const mergedLoadingError = mergeStates([loaded, error1, error2], sum, (errors) => {
      const msg = errors.map(error => error.message).join(" ")
      return new Error(msg)
    });

    expect(isErrorState(mergedLoadingError)).toBe(true);
    expect(mergedLoadingError.error.message).toBe("Goodbye world");
  });
})
