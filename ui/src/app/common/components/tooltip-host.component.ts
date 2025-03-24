import { Component, ViewContainerRef } from '@angular/core';
import { TooltipService } from '../services/tooltip.service';

@Component({
  selector: 'pk-tooltip-host',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class TooltipHostComponent {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private tooltipService: TooltipService
  ) {
    this.tooltipService.setHostContainerRef(this.viewContainerRef);
  }
}
