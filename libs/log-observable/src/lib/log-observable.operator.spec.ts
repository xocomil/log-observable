import { faker } from '@faker-js/faker';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of } from 'rxjs';
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
    describe('primitive values', () => {
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
      ].forEach(({ desc, valueToLog }) => {
        it(`should log a ${desc}`, () => {
          const observerSpy = subscribeSpyTo(
            of(valueToLog).pipe(logObservable('test')),
          );

          expect(logSpy).toHaveBeenCalledTimes(2);
          expect(logSpy).toHaveBeenNthCalledWith(
            1,
            expect.any(String),
            expect.any(String),
            valueToLog,
          );

          observerSpy.unsubscribe();
        });
      });
    });
  });
});
