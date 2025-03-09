import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pk-game-card',
  imports: [NgClass],
  providers: [],
  styles: `
    button {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-default);
      padding: 1.5rem 1rem;
      background: none;
      width: 100%;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .alt-text {
        font-size: 0.9rem;
      }

      &.narrow {
        font-size: 1rem;

        @media (min-width: 600px) {
          font-size: 1.2rem;
        }
      }

      &.hanzi {
        font-size: 2rem;
      }

      &.success {
        border-color: var(--color-success);
        color: var(--color-success);
        box-shadow: 0 0 3px 2px var(--color-success);
      }

      &.miss {
        border-color: var(--color-error);
        color: var(--color-error);
        box-shadow: 0 0 3px 2px var(--color-error);
      }

      &.info {
        border-color: var(--color-info);
        color: var(--color-info);
        box-shadow: 0 0 3px 2px var(--color-info);
      }

      &.selected {
        border-color: var(--color-border);
        color: var(--color-text-accent);
        box-shadow: 0 0 3px 2px var(--color-accent-light);
      }
    }
  `,
  template: `
    <button
      [ngClass]="{
        success: success(),
        miss: miss(),
        info: info(),
        selected: selected(),
        narrow: narrow(),
        hanzi: lang() === 'zh',
      }"
      (click)="clicked.emit()">
      {{ text() }}
      @if (altText()) {
        <span class="alt-text">{{ altText() }}</span>
      }
    </button>
  `,
})
export class GameCardComponent {
  public lang = input.required<string>();
  public text = input.required<string>();
  public altText = input<string | null>();
  public success = input.required<boolean>();
  public miss = input.required<boolean>();
  public info = input.required<boolean>();
  public selected = input<boolean>();
  public narrow = input<boolean>();
  public clicked = output<void>();
}
