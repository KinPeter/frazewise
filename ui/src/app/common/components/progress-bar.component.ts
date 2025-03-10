import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'pk-progress-bar',
  styles: `
    .progress-container {
      width: 100%;
      height: 6px;
      background-color: var(--color-bg);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      transition: width 0.3s ease;
      background-color: var(--color-primary);
    }
  `,
  template: `
    <div class="progress-container">
      <div class="progress-bar" [style.width.%]="progressPercentage()"></div>
    </div>
  `,
})
export class ProgressBarComponent {
  public total = input.required<number>();
  public current = input.required<number>();

  public progressPercentage = computed(() => {
    const total = this.total();
    const current = this.current();
    return total > 0 ? (current / total) * 100 : 0;
  });
}
