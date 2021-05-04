import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export function maybeFakeAnErrorResponse<T>(
  probabilityOfError: number
): MonoTypeOperatorFunction<T> {
  return tap(() => {
    if (Math.random() < probabilityOfError) {
      throw new HttpErrorResponse({
        status: 500,
        statusText: 'Internal server error',
        error: {
          message: 'Something unexpected happened',
        },
      });
    }
  });
}
