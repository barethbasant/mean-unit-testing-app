import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { Component, DebugElement, Renderer2 } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div [appHighlight]="isHighlighted">Test Element</div>`,
})
class TestComponent {
  isHighlighted!: boolean;
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugEl: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestComponent],
      providers: [Renderer2],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
  });

  it('should create an instance', () => {
    fixture = TestBed.createComponent(TestComponent);
    debugEl = fixture.debugElement;
    const directive = new HighlightDirective(
      debugEl.nativeElement,
      TestBed.inject(Renderer2)
    );
    expect(directive).toBeTruthy();
  });

  it(`should apply a highlight class when input is true`, () => {
    component.isHighlighted = true;
    fixture.detectChanges();
    const element = debugEl.query(By.directive(HighlightDirective));
    expect(element.nativeElement.classList.contains('highlight')).toBe(true);
  });

  it(`should remove highlight class when input is false`, () => {
    component.isHighlighted = false;
    fixture.detectChanges();
    const element = debugEl.query(By.directive(HighlightDirective));
    expect(element.nativeElement.classList.contains('highlight')).toBe(false);
  });
});
