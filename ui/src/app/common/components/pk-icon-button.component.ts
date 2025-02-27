import { Component, input, output, signal } from '@angular/core';

export type PkIconButtonVariant = 'default' | 'filled' | 'outline' | 'subtle' | 'ghost';

@Component({
  selector: 'pk-icon-button',
  imports: [],
  styles: [
    `
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        width: auto;
        padding: 0.375rem;
        border: 1px solid transparent;
        border-radius: 50%;
        background: none;
        color: var(--color-text);
        cursor: pointer;

        &:hover {
          background-color: var(--color-border);
        }

        &:focus-visible {
          outline: none;
          box-shadow: var(--focus-box-shadow);
        }

        &:disabled {
          color: var(--color-text-disabled);
          cursor: not-allowed;

          &:hover {
            background-color: var(--color-bg);
          }
        }

        &.pressed {
          position: relative;
          top: 1px;
        }

        &.filled {
          border: 1px solid transparent;
          background-color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-hover);
          }

          &.accent {
            background-color: var(--color-accent);

            &:hover {
              background-color: var(--color-accent-hover);
            }
          }

          &:disabled {
            background-color: var(--color-bg);
          }
        }

        &.outline {
          border-width: 1px;
          border-style: solid;
          border-color: var(--color-primary);
          color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &.accent {
            border-color: var(--color-accent);
            color: var(--color-accent);

            &:hover {
              background-color: var(--color-accent-outline-hover);
            }
          }

          &:disabled {
            color: var(--color-text-disabled);
            border-color: var(--color-text-disabled);

            &:hover {
              background-color: var(--color-bg);
            }
          }
        }

        &.subtle {
          background-color: transparent;
          color: var(--color-primary);
          border: 1px solid transparent;

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &.accent {
            color: var(--color-accent);

            &:hover {
              background-color: var(--color-accent-outline-hover);
            }
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: var(--color-bg);
            }
          }
        }

        &.ghost {
          background-color: transparent;
          color: var(--color-text);
          border: 1px transparent;

          &:hover {
            color: var(--color-primary-light);
          }

          &.accent:hover {
            color: var(--color-accent-light);
          }

          &:disabled {
            color: var(--color-text-disabled);
          }
        }
      }
    `,
  ],
  template: `
    <button
      [type]="type()"
      [title]="tooltip()"
      [disabled]="disabled()"
      [class]="variant()"
      [class.pressed]="pressed()"
      [class.accent]="accent()"
      (click)="clicked.emit()"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (keydown.enter)="pressed.set(true)"
      (keydown.space)="pressed.set(true)"
      (keyup)="pressed.set(false)">
      <ng-content></ng-content>
    </button>
  `,
})
export class PkIconButtonComponent {
  public disabled = input(false);
  public type = input('button');
  public variant = input<PkIconButtonVariant>('default');
  public accent = input(false);
  public tooltip = input<string | undefined>();

  public pressed = signal(false);

  public clicked = output<void>();
}
