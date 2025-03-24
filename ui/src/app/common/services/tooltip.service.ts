import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from '../components/tooltip.component';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private hostContainerRef: ViewContainerRef | null = null;
  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;
  private tooltipInstance: TooltipComponent | null = null;

  public setHostContainerRef(hostContainerRef: ViewContainerRef): void {
    this.hostContainerRef = hostContainerRef;
  }

  public showTooltip(text: string, hostCoords: DOMRect): void {
    if (this.tooltipComponentRef) {
      this.destroy();
    }

    if (this.hostContainerRef) {
      this.tooltipComponentRef = this.hostContainerRef.createComponent(TooltipComponent);
      this.tooltipInstance = this.tooltipComponentRef.instance;
      this.tooltipInstance.show({ text, ...hostCoords.toJSON() });
    }
  }

  public destroy(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
      this.tooltipInstance = null;
    }
  }
}
