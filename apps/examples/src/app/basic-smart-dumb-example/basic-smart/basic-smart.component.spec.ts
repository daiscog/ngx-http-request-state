import { BasicSmartComponent } from './basic-smart.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { cold } from 'jest-marbles';
import { errorState, loadedState, loadingState } from 'ngx-http-request-state';
import { RandomImage } from '../model/random-image';
import { RandomImageService } from '../random-image.service';

describe('BasicSmartComponent', () => {
  function createComponent(): {
    component: BasicSmartComponent;
    mockService: jest.Mocked<RandomImageService>;
  } {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const mockService = (<any>{
      getImage: jest.fn(),
    }) as jest.Mocked<RandomImageService>;
    const component = new BasicSmartComponent(mockService);
    return {
      component,
      mockService,
    };
  }

  function randomImages(count: number): RandomImage[] {
    const pics: RandomImage[] = [];
    while (count--) {
      pics.push({
        image: Math.random().toString(),
      });
    }
    return pics;
  }

  function mockResponses(
    mockService: jest.Mocked<RandomImageService>,
    responses: (RandomImage | HttpErrorResponse)[],
    delay: string = '--'
  ) {
    let calls = 0;
    mockService.getImage.mockImplementation(() => {
      const next = responses[calls++];
      if (next instanceof HttpErrorResponse) {
        return cold(`${delay}#`, undefined, next);
      }
      const response = new HttpResponse({
        body: next,
      });
      return cold(`${delay}(r|)`, { r: response });
    });
  }

  describe('imageDetails$', () => {
    it('should emit loading states in response to button clicks, ignoring repeated clicks until an HTTP response is received', () => {
      const { component, mockService } = createComponent();
      const pics = randomImages(3);
      mockResponses(mockService, pics, '-----');
      const clicks = '  --c----c-c-c---c-c-----|';
      const expected = 'l----a-l----b--l----c--|';
      cold(clicks).subscribe(component.loadNewImage$);

      expect(component.imageDetails$).toBeObservable(
        cold(expected, {
          l: loadingState(),
          a: loadedState(pics[0]),
          b: loadedState(pics[1]),
          c: loadedState(pics[2]),
        })
      );
    });

    it('should continue to reload images in response to clicks even after an HTTP error response', () => {
      const { component, mockService } = createComponent();
      const error = new HttpErrorResponse({});
      const responses: (RandomImage | HttpErrorResponse)[] = [
        ...randomImages(2),
        error,
        ...randomImages(1),
      ];

      mockResponses(mockService, responses);

      const clicks = '  -----c----c----c----|';
      const expected = 'l-a--l-b--l-c--l-d--|';
      cold(clicks).subscribe(component.loadNewImage$);

      expect(component.imageDetails$).toBeObservable(
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
