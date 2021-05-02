import { BasicSmartComponent } from './basic-smart.component';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { CatPic } from '../model/cat-pic';
import { cold } from 'jest-marbles';
import { errorState, loadedState, loadingState } from 'ngx-http-request-state';

describe('BasicSmartComponent', () => {
  function createComponent(): {
    component: BasicSmartComponent;
    mockClient: jest.Mocked<HttpClient>;
  } {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const mockClient = (<any>{
      get: jest.fn(),
    }) as jest.Mocked<HttpClient>;
    const component = new BasicSmartComponent(mockClient);
    return {
      component,
      mockClient,
    };
  }

  function randomCatPics(count: number): CatPic[] {
    const pics: CatPic[] = [];
    while (count--) {
      pics.push({
        url: Math.random().toString(),
        webpurl: Math.random().toString(),
      });
    }
    return pics;
  }

  function mockResponses(
    mockClient: jest.Mocked<HttpClient>,
    responses: (CatPic | HttpErrorResponse)[],
    delay: string = '--'
  ) {
    let calls = 0;
    mockClient.get.mockImplementation(() => {
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

  describe('catPic$', () => {
    it('should emit loading states in response to button clicks, ignoring repeated clicks until an HTTP response is received', () => {
      const { component, mockClient } = createComponent();
      const pics = randomCatPics(3);
      mockResponses(mockClient, pics, '-----');
      const clicks = '  --c----c-c-c---c-c-----|';
      const expected = 'l----a-l----b--l----c--|';
      cold(clicks).subscribe(component.reloadPic$);

      expect(component.catPic$).toBeObservable(
        cold(expected, {
          l: loadingState(),
          a: loadedState(pics[0]),
          b: loadedState(pics[1]),
          c: loadedState(pics[2]),
        })
      );
    });

    it('should continue to reload cats in response to clicks even after an HTTP error response', () => {
      const { component, mockClient } = createComponent();
      const error = new HttpErrorResponse({});
      const responses: (CatPic | HttpErrorResponse)[] = [
        ...randomCatPics(2),
        error,
        ...randomCatPics(1),
      ];

      mockResponses(mockClient, responses);

      const clicks = '  -----c----c----c----|';
      const expected = 'l-a--l-b--l-c--l-d--|';
      cold(clicks).subscribe(component.reloadPic$);

      expect(component.catPic$).toBeObservable(
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
