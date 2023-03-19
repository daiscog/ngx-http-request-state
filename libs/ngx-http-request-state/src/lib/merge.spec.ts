import { loadedState, loadingState } from "./builders";
import { isLoadedState, isLoadingState } from "./type-guards";
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
})
