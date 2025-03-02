import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[pkFocusFirst]' })
export class FocusFirstDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  public ngAfterViewInit(): void {
    const nativeElement = this.el.nativeElement;
    if (
      nativeElement.tagName.toLowerCase() === 'button' ||
      nativeElement.tagName.toLowerCase() === 'input'
    ) {
      nativeElement.focus();
    } else {
      const focusableElement = nativeElement.querySelector('button, input');
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }
}
