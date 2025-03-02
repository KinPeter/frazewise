import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[pkCheckbox]',
  standalone: true,
})
export class PkCheckboxDirective {
  @HostBinding('class') elementClass = 'pk-checkbox';
}
