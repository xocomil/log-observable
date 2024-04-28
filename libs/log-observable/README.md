# log-observable

A simple observable logger based on [article](https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457) by Netanel Basal. It includes colors and seeds for different instances of the logger.

> [!TIP]
> `log-observable` is a library to help debug observables during development. You should avoid using it in production.

## Installation

**npm**

```bash
npm install @xocomil/log-observable --save-dev
```

**pnpm**

```bash
pnpm install @xocomil/log-observable -D
```

**yarn**

```bash
yarn add @xocomil/log-observable -D
```

## Usage

### Basic Usage

<img src="/images/SimpleCase.png" alt="Basic Usage" width="600" />

The simplest case is just logging what your observable emits. You can add `logObservable('some tag')` anywhere in your observable pipe to see what is being emitted at that point.

```typescript
import { logObservable } from '@xocomil/log-observable';

from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipe(logObservable('Simple Case')).subscribe();
```

### Multiple Loggers in Same Pipe

<img alt="Multiple Loggers Output" src="/images/MultipleLoggers.png" width="600" />

Each logger is given a unique ID and one of 8 colors to help differentiate between them. You can add multiple loggers to the same pipe to see what is happening at different points.

```typescript
import { logObservable } from '@xocomil/log-observable';

from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .pipe(
    logObservable('Simple Case'),
    map((value) => value ** 3),
    logObservable('Map Case'),
  )
  .subscribe();
```
### Handling Errors

<img alt="Error Handling" src="/images/ErrorLogger.png" width="600" />

The logger handles errors and logs them in red. This can help you see where an error is occurring in your observable pipes.

```typescript
import { logObservable } from '@xocomil/log-observable';

from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  .pipe(
    logObservable('Simple Case'),
    map((value) => value ** 3),
    logObservable('Map Case'),
    tap((value) => {
      if (value >= 300) {
        throw new Error('Value is too high');
      }
    }),
    logObservable('Simple Error Case'),
  )
  .subscribe();
```
