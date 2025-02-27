import { Component, effect, ElementRef, input, Signal, viewChild } from '@angular/core';
import { PkInputDirective } from './pk-input.directive';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'pk-input',
  imports: [PkInputDirective, NgClass, NgStyle],
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
    <label pkInput #container [ngStyle]="{ width: width() }" [ngClass]="{ disabled: disabled() }">
      <span>{{ label() }}</span>
      @if (withAsterisk()) {
        <span class="asterisk"> *</span>
      }
      <ng-content></ng-content>
      @if (error()) {
        <span class="error">{{ error() }}</span>
      } @else {
        <div class="error-placeholder"></div>
      }
    </label>
  `,
  styles: [``],
})
export class PkInputComponent {
  public label = input('');
  public withAsterisk = input(false);
  public error = input('');
  public disabled = input(false);
  public width = input('auto');
  public type = input<'text' | 'select'>('text');

  private container: Signal<ElementRef<HTMLLabelElement>> = viewChild.required('container');

  constructor() {
    effect(() => {
      const selector = this.type() === 'text' ? 'input' : this.type() === 'select' ? 'select' : '';
      const inputElement = this.container()?.nativeElement?.querySelector(selector) as
        | HTMLInputElement
        | HTMLSelectElement;
      if (!inputElement) return;
      inputElement.style.width = this.width();
      if (this.error()) {
        inputElement.classList.add('error');
      } else {
        inputElement.classList.remove('error');
      }
      if (this.disabled()) {
        inputElement.setAttribute('disabled', 'true');
      } else {
        inputElement.removeAttribute('disabled');
      }
    });
  }
}
