import * as angularCore from '@angular/core';
import { MultipleSourcesContainerComponent } from './multiple-sources-container.component';
import { PunkApiService } from '../service/punk-api.service';
import { Beer, Brews } from '../model/brews';
import { cold } from 'jest-marbles';
import { BrewDateForm } from '../model/form';
import {
  errorState,
  HttpRequestState,
  loadedState,
  loadingState,
} from 'ngx-http-request-state';
import { HttpErrorResponse } from '@angular/common/http';

describe('MultipleSourcesContainerComponent', () => {
  function setup(): {
    component: MultipleSourcesContainerComponent;
    service: jest.Mocked<PunkApiService>;
  } {
    const service = {
      brewedBefore: jest.fn(),
      brewedAfter: jest.fn(),
    } as unknown as jest.Mocked<PunkApiService>;

    const component = new MultipleSourcesContainerComponent(service);
    return { component, service };
  }

  describe('#beers$', () => {
    it('should emit search results after both streams have loaded', () => {
      const searches = '    --a----------b----';
      const beforeTiming = '  --(d|)';
      const afterTiming = '   ----(d|)';
      const expected = '    --L---a------L---b';

      const before: Beer[] = [
        { id: 'a', name: 'Duff', description: 'Duff beer' },
      ];
      const after: Beer[] = [
        { id: 'b', name: 'Stuff', description: 'Stuff beer' },
      ];

      const searchValues: Record<'a' | 'b', BrewDateForm> = {
        a: { year: '1985', month: '02' },
        b: { year: '2000', month: '10' },
      };

      const expectedValues: Record<
        string,
        HttpRequestState<Brews & BrewDateForm>
      > = {
        L: loadingState(),
        a: loadedState({
          before,
          after,
          ...searchValues.a,
        }),
        b: loadedState({
          before,
          after,
          ...searchValues.b,
        }),
      };

      const { component, service } = setup();

      service.brewedBefore.mockReturnValue(cold(beforeTiming, { d: before }));
      service.brewedAfter.mockReturnValue(cold(afterTiming, { d: after }));

      cold(searches, searchValues).subscribe((s) => component.search(s));

      expect(component.beers$).toBeObservable(cold(expected, expectedValues));
    });

    it('should continue to emit for new searches after an earlier error', () => {
      const searches = '    --a----------a----';
      const errorTiming = '   ------#';
      const beforeTiming = '             --(d|)';
      const afterTiming = '              ----(d|)';
      const expected = '    --L-----e----L---b';

      const before: Beer[] = [
        { id: 'a', name: 'Duff', description: 'Duff beer' },
      ];
      const after: Beer[] = [
        { id: 'b', name: 'Stuff', description: 'Stuff beer' },
      ];

      const searchValues: Record<'a', BrewDateForm> = {
        a: { year: '1985', month: '02' },
      };

      const error = new HttpErrorResponse({ status: 503 });

      const expectedValues: Record<
        string,
        HttpRequestState<Brews & BrewDateForm>
      > = {
        L: loadingState(),
        e: errorState(error),
        b: loadedState({
          before,
          after,
          ...searchValues.a,
        }),
      };

      const { component, service } = setup();

      service.brewedBefore.mockReturnValue(cold(beforeTiming, { d: before }));
      service.brewedAfter
        .mockReturnValueOnce(cold(errorTiming, {}, error))
        .mockReturnValue(cold(afterTiming, { d: after }));

      cold(searches, searchValues).subscribe((s) => component.search(s));

      expect(component.beers$).toBeObservable(cold(expected, expectedValues));
    });

    it('should drop inflight requests when a new search has been triggered', () => {
      const searches = '    --a----b----';
      const beforeTiming = '  ---(d|)';
      const afterTiming = '   ------(d|)';
      const expected = '    --L----L-----b';

      const before: Beer[] = [
        { id: 'a', name: 'Duff', description: 'Duff beer' },
      ];
      const after: Beer[] = [
        { id: 'b', name: 'Stuff', description: 'Stuff beer' },
      ];

      const searchValues: Record<'a' | 'b', BrewDateForm> = {
        a: { year: '1985', month: '02' },
        b: { year: '2000', month: '10' },
      };

      const expectedValues: Record<
        string,
        HttpRequestState<Brews & BrewDateForm>
      > = {
        L: loadingState(),
        a: loadedState({
          before,
          after,
          ...searchValues.a,
        }),
        b: loadedState({
          before,
          after,
          ...searchValues.b,
        }),
      };

      const { component, service } = setup();

      service.brewedBefore.mockReturnValue(cold(beforeTiming, { d: before }));
      service.brewedAfter.mockReturnValue(cold(afterTiming, { d: after }));

      cold(searches, searchValues).subscribe((s) => component.search(s));

      expect(component.beers$).toBeObservable(cold(expected, expectedValues));
    });
  });
});
