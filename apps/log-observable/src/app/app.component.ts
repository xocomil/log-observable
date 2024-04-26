import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  template: `
    @for (color of nextBackgroundColors; track color) {
      <div class="light-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>
    @for (color of nextBackgroundColors; track color) {
      <div class="dark-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>
    @for (color of errorBackgroundColors; track color) {
      <div class="light-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>
    @for (color of errorBackgroundColors; track color) {
      <div class="dark-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>
    @for (color of completeBackgroundColors; track color) {
      <div class="light-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>
    @for (color of completeBackgroundColors; track color) {
      <div class="dark-text" [style.background-color]="color">{{ color }}</div>
    }
    <div></div>

    @for (color of greens(); track color) {
      <div class="light-text" [style.background-color]="color">{{ color }}</div>
    }
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly nextBackgroundColors = [
    '#009900',
    '#006600',
    '#336600',
    '#669900',
    '#009933',
    '#99cc00',
    '#00cc66',
  ];
  protected readonly errorBackgroundColors = [
    '#E91E63',
    '#cc3300',
    '#cc6600',
    '#ff9900',
    '#ff3300',
    '#ff0000',
    '#cc0000',
  ];
  protected readonly completeBackgroundColors = [
    '#000099',
    '#003399',
    '#0000cc',
    '#0033cc',
    '#0000ff',
    '#3333ff',
    '#333399',
  ];

  readonly #greenBase = { h: 120, s: 100, l: 20 };
  protected readonly greens = signal([
    ...[-2, 1, 0, 1].map((i) => {
      return `hsl(${this.#greenBase.h + i * 20}deg ${this.#greenBase.s}% ${this.#greenBase.l})`;
    }),
    ...[-2, 1, 0, 1].map((i) => {
      return `hsl(${this.#greenBase.h + i * 20}deg ${this.#greenBase.s}% ${this.#greenBase.l - 10})`;
    }),
  ]);

  constructor() {
    for (const colorGroup of [
      this.nextBackgroundColors,
      this.errorBackgroundColors,
      this.completeBackgroundColors,
    ]) {
      for (const color of colorGroup) {
        console.log(
          `%c[${color}]`,
          `background: ${color}; color: white; padding: 3px; font-size: 9px;`,
        );
        console.log(
          `%c[${color}]`,
          `background: ${color}; color: black; padding: 3px; font-size: 9px;`,
        );
      }
    }
  }
}
