import { Component, ElementRef, input, signal, viewChild, WritableSignal } from '@angular/core';

@Component({
  selector: 'pk-tooltip',
  providers: [],
  styles: `
    .tooltip {
      position: fixed;
      background-color: var(--color-bg-lighter);
      color: var(--color-text-stronger);
      border-radius: 0.2rem;
      padding: 0.5rem 1rem;
      font-size: 0.95rem;
      box-shadow: var(--tooltip-box-shadow);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      max-width: 250px;
    }
    .tooltip.show {
      opacity: 1;
    }
  `,
  template: `
    <div
      #tooltip
      class="tooltip"
      [class.show]="isVisible()"
      [style.top]="positionY() + 'px'"
      [style.left]="positionX() + 'px'">
      {{ text() }}
    </div>
  `,
})
export class TooltipComponent {
  public text = input<string>('');
  isVisible: WritableSignal<boolean> = signal(false);
  positionX: WritableSignal<number> = signal(0);
  positionY: WritableSignal<number> = signal(0);
  tooltipRef = viewChild.required<ElementRef<HTMLDivElement>>('tooltip');

  show({ left, top, height, width }: { left: number; top: number; height: number; width: number }) {
    this.isVisible.set(true);
    setTimeout(() => {
      const tooltipRect = this.tooltipRef().nativeElement.getBoundingClientRect();
      const iconCenterX = left + width / 2;
      const tooltipX = iconCenterX - tooltipRect.width / 2;
      const viewportHeight = window.innerHeight;
      let tooltipY = top + height;

      if (tooltipY + tooltipRect.height > viewportHeight) {
        tooltipY = top - tooltipRect.height;
      }
      this.positionX.set(tooltipX);
      this.positionY.set(tooltipY);
    });
  }
}
