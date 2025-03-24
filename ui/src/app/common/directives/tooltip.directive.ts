import { Directive, HostListener, input, ViewContainerRef } from '@angular/core';
import { TooltipService } from '../services/tooltip.service';

@Directive({
  selector: '[pkTooltip]',
})
export class TooltipDirective {
  public tooltipText = input<string>('', { alias: 'pkTooltip' });

  constructor(
    private viewContainerRef: ViewContainerRef,
    private tooltipService: TooltipService
  ) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    const hostElement = this.viewContainerRef.element.nativeElement;
    const hostCoords = hostElement.getBoundingClientRect();
    this.tooltipService.showTooltip(this.tooltipText(), hostCoords);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.tooltipService.destroy();
  }
}
