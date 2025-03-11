import { ComponentRef, Directive, HostListener, input, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from '../components/tooltip.component';

@Directive({
  selector: '[pkTooltip]',
})
export class TooltipDirective {
  public tooltipText = input<string>('', { alias: 'pkTooltip' });
  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;
  private tooltipInstance: TooltipComponent | null = null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    if (!this.tooltipComponentRef) {
      this.tooltipComponentRef = this.viewContainerRef.createComponent(TooltipComponent);
      this.tooltipInstance = this.tooltipComponentRef.instance;
      this.tooltipInstance.text = this.tooltipText;

      const hostElement = this.viewContainerRef.element.nativeElement;
      const hostCoords = hostElement.getBoundingClientRect();

      this.tooltipInstance.show(hostCoords);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
      this.tooltipInstance = null;
    }
  }
}
