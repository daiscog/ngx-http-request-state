import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { cold } from 'jest-marbles';
import { httpRequestStates } from './operators';
import { loadingState, loadedState, errorState } from './builders';

describe('operators', () => {
  describe('httpRequestStates', () => {
    describe('without a mapping function', () => {
      it('should emit loading, then the response body for a successful request', () => {
        const response = new HttpResponse({
          body: {
            foo: 'bar',
          },
        });
        const source = cold('  --------(b|)', { b: response });
        const expected = cold('l-------(b|)', {
          l: loadingState(),
          b: loadedState(response.body),
        });

        expect(source.pipe(httpRequestStates())).toBeObservable(expected);
      });

      it('should emit loading, then the error response for an unsuccessful request', () => {
        const error = new HttpErrorResponse({});
        const source = cold('  --------(#|)', {}, error);
        const expected = cold('l-------(e|)', {
          l: loadingState(),
          e: errorState(error),
        });

        expect(source.pipe(httpRequestStates())).toBeObservable(expected);
      });
    });

    describe('with a mapping function', () => {
      const mapper = (response) => `Hello, ${response.body.foo}`;

      it('should emit loading, then the result of applying the response mapper for a successful request', () => {
        const response = new HttpResponse({
          body: {
            foo: 'World',
          },
        });

        const source = cold('  --------(b|)', { b: response });
        const expected = cold('l-------(b|)', {
          l: loadingState(),
          b: loadedState(mapper(response)),
        });

        expect(source.pipe(httpRequestStates(mapper))).toBeObservable(expected);
      });

      it('should emit loading, then the request error for an unsuccessful request', () => {
        const error = new HttpErrorResponse({});
        const source = cold('  --------(#|)', {}, error);
        const expected = cold('l-------(e|)', {
          l: loadingState(),
          e: errorState(error),
        });

        expect(source.pipe(httpRequestStates(mapper))).toBeObservable(expected);
      });
    });
  });
});
