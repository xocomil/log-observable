import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { logObservable } from '@xocomil/log-observable';
import {
  from,
  interval,
  map,
  mergeMap,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

const outerTimeMs = 1000;
const innerTimeMs = 2000;
const fixedTimeMs = 50;
const numberToTake = 5;

@Component({
  standalone: true,
  imports: [AsyncPipe],
  selector: 'app-root',
  template: `
    <h1>Log Observable</h1>

    <p>Check out the browser console to see the output.</p>

    <h4>Simple Case:</h4>
    <pre>{{ simpleCase$ | async }}</pre>

    <h4>Map Case:</h4>
    <pre>{{ mapCase$ | async }}</pre>

    <h4>Simple Error Case:</h4>
    <pre>{{ simpleErrorCase$ | async }}</pre>

    <h4>
      Memory Leak Case:
      <button type="button" (click)="startMemLeak()">Start</button>
      <button type="button" (click)="stop()">Stop</button>
    </h4>
    <pre>{{ memoryLeakCase$ | async }}</pre>

    <h4>
      No Memory Leak No Complete Case:
      <button type="button" (click)="startNoComplete()">Start</button>
      <button type="button" (click)="stop()">Stop</button>
    </h4>
    <pre>{{ noMemoryLeakNoCompleteCase$ | async }}</pre>

    <h4>
      Fixed Memory Leak Case:
      <button type="button" (click)="startFixed()">Start</button>
    </h4>
    <pre>{{ fixedMemoryLeakCase$ | async }}</pre>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly simpleCase$ = from(
    Array.from({ length: 10 }, (_, i) => i),
  ).pipe(logObservable('Simple Case'));

  protected readonly mapCase$ = this.simpleCase$.pipe(
    map((value) => value ** 3),
    logObservable('Map Case'),
  );

  protected readonly simpleErrorCase$ = this.mapCase$.pipe(
    tap((value) => {
      if (value >= 300) {
        throw new Error('Value is too high');
      }
    }),
    logObservable('Simple Error Case'),
  );

  readonly #startMemLeak$ = new Subject<void>();
  readonly #stop$ = new Subject<void>();

  protected readonly memoryLeakCase$ = this.#startMemLeak$.pipe(
    mergeMap(() =>
      interval(outerTimeMs).pipe(
        logObservable('Memory Leak Case'),
        take(numberToTake),
        switchMap((count) =>
          interval(innerTimeMs).pipe(
            map(
              (innerCount) =>
                `Outer Count: ${count} Inner Count: ${innerCount}`,
            ),
            logObservable('Memory Leak Case Inner'),
          ),
        ),
        logObservable('Memory Leak Case After switchMap'),
        takeUntil(this.#stop$),
      ),
    ),
  );

  readonly #startNoComplete$ = new Subject<void>();

  protected readonly noMemoryLeakNoCompleteCase$ = this.#startNoComplete$.pipe(
    mergeMap(() =>
      interval(outerTimeMs).pipe(
        logObservable('No Memory Leak No Complete Case'),
        switchMap((count) =>
          interval(innerTimeMs).pipe(
            map(
              (innerCount) =>
                `Outer Count: ${count} Inner Count: ${innerCount}`,
            ),
            logObservable('No Memory Leak No Complete Case Inner'),
          ),
        ),
        take(numberToTake),
        logObservable('No Memory Leak No Complete Case After switchMap'),
        takeUntil(this.#stop$),
      ),
    ),
  );

  readonly #startFixed$ = new Subject<void>();

  protected readonly fixedMemoryLeakCase$ = this.#startFixed$.pipe(
    mergeMap(() =>
      interval(outerTimeMs).pipe(
        logObservable('Fixed Leak Case'),
        switchMap((count) =>
          interval(fixedTimeMs).pipe(
            map(
              (innerCount) =>
                `Outer Count: ${count} Inner Count: ${innerCount}`,
            ),
            logObservable('Fixed Leak Case Inner'),
          ),
        ),
        take(numberToTake),
        logObservable('Fixed Leak Case After switchMap'),
      ),
    ),
  );

  protected startMemLeak(): void {
    this.#startMemLeak$.next();
  }

  protected startNoComplete(): void {
    this.#startNoComplete$.next();
  }

  protected startFixed(): void {
    this.#startFixed$.next();
  }

  protected stop(): void {
    this.#stop$.next();
  }
}
