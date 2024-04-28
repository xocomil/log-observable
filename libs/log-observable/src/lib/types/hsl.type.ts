export type hslColor = {
  h: number;
  s: number;
  l: number;
};

export function createColors(colorBase: hslColor): string[] {
  const range = [-2, -1, 0, 1];
  const colorOffset = 20;
  const darkerColorModifier = 10;

  return range.reduce((prevValue, curValue) => {
    const newColors = [
      `hsl(${colorBase.h + curValue * colorOffset}deg ${colorBase.s}% ${colorBase.l})`,
      `hsl(${colorBase.h + curValue * colorOffset}deg ${colorBase.s}% ${colorBase.l - darkerColorModifier})`,
    ];

    return prevValue.concat(newColors);
  }, [] as string[]);
}
