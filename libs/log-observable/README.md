# log-observable

A simple observable logger based on [article](https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457) by Netanel Basal. It includes colors and seeds for different instances of the logger.

> [!TIP] `log-observable` is a library to help debug observables during development. You should avoid using it in production.

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

![Simple Logger Output](/images/SimpleCase.png)

```typescript
import { logObservable } from '@xocomil/log-observable';

const simpleCase$ = from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipe(logObservable('Simple Case')).subscrbe();
```
