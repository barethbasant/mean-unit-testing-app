import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  @Input() set appHighlight(condition: boolean) {
    if (condition) {
      this.renderer.addClass(this.el.nativeElement, 'highlight');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'highlight');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
