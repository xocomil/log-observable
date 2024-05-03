import { faker } from '@faker-js/faker';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { catchError, of, throwError } from 'rxjs';
import { logObservable } from './log-observable.operator';

describe('LogObservableOperator', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    logSpy.mockReset();
    logSpy.mockRestore();
  });

  describe('logging values', () => {
    [
      {
        desc: 'string',
        valueToLog: faker.word.words({ count: { min: 1, max: 20 } }),
      },
      { desc: 'number', valueToLog: faker.number.int() },
      { desc: 'boolean', valueToLog: faker.datatype.boolean() },
      { desc: 'null', valueToLog: null },
      { desc: 'undefined', valueToLog: undefined },
      { desc: 'symbol', valueToLog: Symbol('test') },
      { desc: 'object', valueToLog: { test: faker.word.words() } },
      {
        desc: 'array',
        valueToLog: Array.from({ length: 5 }, faker.word.words),
      },
    ].forEach(({ desc, valueToLog }) => {
      it(`should log a ${desc}`, () => {
        const observerSpy = subscribeSpyTo(
          of(valueToLog).pipe(logObservable('test')),
        );

        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(
          1,
          expect.stringContaining(': Next]'),
          expect.any(String),
          valueToLog,
        );

        observerSpy.unsubscribe();
      });
    });
  });

  describe('logging errors', () => {
    it('should log an error', () => {
      const error = new Error('Test error');
      const observerSpy = subscribeSpyTo(
        throwError(() => error).pipe(
          logObservable('test'),
          catchError(() => of(null)),
        ),
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(': Error]'),
        expect.any(String),
        error,
      );

      observerSpy.unsubscribe();
    });
  });

  describe('logging completion', () => {
    it('should log completion', () => {
      const observerSpy = subscribeSpyTo(of(null).pipe(logObservable('test')));

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(': Complete'),
        expect.any(String),
      );

      observerSpy.unsubscribe();
    });
  });
});
