import { BasicSmartComponent } from './basic-smart.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { cold } from 'jest-marbles';
import { errorState, loadedState, loadingState } from 'ngx-http-request-state';
import { Brewery } from '../model/brewery';
import { RandomBreweryService } from '../random-brewery.service';

describe('BasicSmartComponent', () => {
  function createComponent(): {
    component: BasicSmartComponent;
    mockService: jest.Mocked<RandomBreweryService>;
  } {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const mockService = (<any>{
      randomBrewery: jest.fn(),
    }) as jest.Mocked<RandomBreweryService>;

    const component = new BasicSmartComponent(mockService);
    return {
      component,
      mockService,
    };
  }

  function randomBreweries(count: number): Brewery[] {
    const breweries: Brewery[] = [];
    while (count--) {
      breweries.push({
        name: 'RandomBrew #' + Math.random().toString(),
      });
    }
    return breweries;
  }

  function mockResponses(
    mockService: jest.Mocked<RandomBreweryService>,
    responses: (Brewery | HttpErrorResponse)[],
    delay = '--'
  ) {
    responses.forEach((next) => {
      mockService.randomBrewery.mockImplementationOnce(() => {
        if (next instanceof HttpErrorResponse) {
          return cold(`${delay}#`, undefined, next);
        }
        const response = new HttpResponse({
          body: next,
        });
        return cold(`${delay}(r|)`, { r: response });
      });
    });
  }

  describe('#brewery$', () => {
    it('should emit loading states in response to button clicks, ignoring repeated clicks until an HTTP response is received', () => {
      const { component, mockService } = createComponent();
      const breweries = randomBreweries(3);
      mockResponses(mockService, breweries, '-----');
      const clicks = '  --c----c-c-c---c-c-----';
      const expected = 'l----a-l----b--l----c--';
      cold(clicks).subscribe(() => component.reload());

      expect(component.brewery$).toBeObservable(
        cold(expected, {
          l: loadingState(),
          a: loadedState(breweries[0]),
          b: loadedState(breweries[1]),
          c: loadedState(breweries[2]),
        })
      );
    });

    it('should continue to reload breweries in response to clicks even after an HTTP error response', () => {
      const { component, mockService } = createComponent();
      const error = new HttpErrorResponse({});
      const responses: (Brewery | HttpErrorResponse)[] = [
        ...randomBreweries(2),
        error,
        ...randomBreweries(1),
      ];

      mockResponses(mockService, responses);

      const clicks = '  -----c----c----c----';
      const expected = 'l-a--l-b--l-c--l-d--';
      cold(clicks).subscribe(() => component.reload());

      expect(component.brewery$).toBeObservable(
        cold(expected, {
          l: loadingState(),
          a: loadedState(responses[0]),
          b: loadedState(responses[1]),
          c: errorState(error),
          d: loadedState(responses[3]),
        })
      );
    });
  });
});
