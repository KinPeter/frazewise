import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[pkPageContent]',
  standalone: true,
})
export class PkPageContentDirective {
  @HostBinding('class') elementClass = 'pk-page-content';
}
