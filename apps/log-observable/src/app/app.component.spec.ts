import { createComponentFactory } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const createComponent = createComponentFactory({ component: AppComponent });

  it('should create', () => {
    const spectator = createComponent();

    expect(spectator).toBeTruthy();
  });
});
