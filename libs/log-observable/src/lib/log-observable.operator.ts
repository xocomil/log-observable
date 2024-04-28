// Operator based on article https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457

import { tap } from 'rxjs';
import { createColors } from './types/hsl.type';

const greenBase = { h: 120, s: 100, l: 30 } as const;
const redBase = { h: 0, s: 100, l: 30 } as const;
const blueBase = { h: 240, s: 100, l: 30 } as const;

const nextBackgroundColors = createColors(greenBase);
const errorBackgroundColors = createColors(redBase);
const completeBackgroundColors = createColors(blueBase);

const randomColor = (colors: string[]): string => {
  const randomIndex = Math.floor(Math.random() * (colors.length - 1));

  return colors[randomIndex];
};

export const logObservable = <T>(tag: string) => {
  const backgroundColor = randomColor(nextBackgroundColors);
  const errorBackgroundColor = randomColor(errorBackgroundColors);
  const completeBackgroundColor = randomColor(completeBackgroundColors);

  const messageKey = (Math.floor(Math.random() * 10000) + Date.now()).toString(
    36,
  );

  return tap<T>({
    next(value) {
      console.log(
        `%c[${tag} [${messageKey}]: Next]`,
        `background: ${backgroundColor}; color: #fff; padding: 3px; font-size: 9px;`,
        value,
      );
    },
    error(error) {
      console.log(
        `%c[${tag} [${messageKey}]: Error]`,
        `background: ${errorBackgroundColor}; color: #fff; padding: 3px; font-size: 9px;`,
        error,
      );
    },
    complete() {
      console.log(
        `%c[${tag}  [${messageKey}]]: Complete`,
        `background: ${completeBackgroundColor}; color: #fff; padding: 3px; font-size: 9px;`,
      );
    },
  });
};
