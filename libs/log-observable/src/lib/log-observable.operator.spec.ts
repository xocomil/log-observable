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

  describe('tag', () => {
    it('should add a tag to the log message', () => {
      const testTag = faker.word.words();

      const observerSpy = subscribeSpyTo(of(null).pipe(logObservable(testTag)));

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(`%c[${testTag} `),
        expect.any(String),
        null,
      );
      expect(logSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(`%c[${testTag}`),
        expect.any(String),
      );

      observerSpy.unsubscribe();
    });
  });

  describe('logger id', () => {
    it('should add a unique id to each logger instance', () => {
      const observerSpy1 = subscribeSpyTo(
        of(true).pipe(logObservable('first'), logObservable('second')),
      );

      console.log(logSpy.mock.calls);

      const [loggerId1] = logSpy.mock.calls[0][0].match(/\[first \[(\w+)\]:/);
      const [loggerId2] = logSpy.mock.calls[1][0].match(/\[second \[(\w+)\]:/);

      expect(loggerId1).not.toBe(loggerId2);

      observerSpy1.unsubscribe();
    });
  });
});
