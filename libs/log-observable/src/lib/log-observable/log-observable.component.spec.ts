import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogObservableComponent } from './log-observable.component';

describe('LogObservableComponent', () => {
  let component: LogObservableComponent;
  let fixture: ComponentFixture<LogObservableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogObservableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogObservableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
