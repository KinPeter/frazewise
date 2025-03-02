import { Component, effect, ElementRef, input, Signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { PkCheckboxDirective } from '../directives/pk-checkbox.directive';

@Component({
  selector: 'pk-checkbox',
  imports: [NgClass, PkCheckboxDirective],
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
    <label pkCheckbox #container [ngClass]="{ disabled: disabled() }">
      <ng-content></ng-content>
      <span>{{ label() }}</span>
    </label>
  `,
  styles: [``],
})
export class PkCheckboxComponent {
  public label = input('');
  public disabled = input(false);

  private container: Signal<ElementRef<HTMLLabelElement>> = viewChild.required('container');

  constructor() {
    effect(() => {
      const inputElement = this.container()?.nativeElement?.querySelector(
        'input'
      ) as HTMLInputElement;
      if (!inputElement) return;
      if (this.disabled()) {
        inputElement.setAttribute('disabled', 'true');
      } else {
        inputElement.removeAttribute('disabled');
      }
    });
  }
}
