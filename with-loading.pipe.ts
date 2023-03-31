import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Pipe({
  name: 'withStatus',
  standalone: true,
})
export class WithStatusPipe implements PipeTransform {
  transform<T>(value$: Observable<T>): Observable<WithStatus<T>> {
    return withStatus(value$);
  }
}

function withStatus<T>(source$: Observable<T>): Observable<WithStatus<T>> {
  const refreshSubject = new BehaviorSubject<void>(undefined);

  return new Observable<WithStatus<T>>((subscriber) => {
    const subscription = refreshSubject
      .asObservable()
      .pipe(
        tap(() => {
          subscriber.next({
            loading: true,
            refresh: () => refreshSubject.next(),
          });
        }),
        switchMap(() =>
          source$.pipe(
            tap((value) => {
              subscriber.next({
                value: value,
                refresh: () => refreshSubject.next(),
              });
            }),
            catchError((err) => {
              subscriber.next({
                error: err,
                refresh: () => refreshSubject.next(),
              });

              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        complete: () => subscriber.complete(),
      });

    return () => {
      refreshSubject.complete();
      subscription.unsubscribe();
    };
  });
}

interface WithStatus<T> {
  value?: T;
  error?: unknown;
  loading?: boolean;
  refresh?: () => void;
}
