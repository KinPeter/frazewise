import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[pkCard]',
  standalone: true,
})
export class PkCardDirective {
  @HostBinding('class') elementClass = 'pk-card';
}
