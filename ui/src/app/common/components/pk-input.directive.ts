import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[pkInput]',
  standalone: true,
})
export class PkInputDirective {
  @HostBinding('class') elementClass = 'pk-input';
}
