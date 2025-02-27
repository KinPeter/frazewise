import { Component, input, output, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { PkLoaderComponent } from './pk-loader.component';

export type PkButtonVariant = 'default' | 'filled' | 'outline' | 'link' | 'subtle';

@Component({
  selector: 'pk-button',
  imports: [NgStyle, PkLoaderComponent, NgClass],
  styles: [
    `
      button {
        background-color: var(--color-bg);
        color: var(--color-white);
        font-weight: 700;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-default);
        height: 2.5rem;
        padding: 0 1.5rem;
        display: block;
        cursor: pointer;
        font-size: 0.95rem;

        &.icon-prefix {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding-left: 1rem;
        }

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
          border: none;
          background-color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-hover);
          }

          &:disabled {
            background-color: var(--color-bg);
          }
        }

        &.outline {
          background-color: transparent;
          border-color: var(--color-primary);
          color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: transparent;
            }
          }
        }

        &.subtle {
          background-color: transparent;
          color: var(--color-primary);
          border: none;

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: transparent;
            }
          }
        }

        &.link {
          background-color: transparent;
          color: var(--color-primary);
          border: none;

          &:hover {
            text-decoration: underline;
          }

          &:disabled {
            color: var(--color-text-disabled);
            text-decoration: none;

            &:hover {
              background-color: transparent;
            }
          }
        }

        &.loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    `,
  ],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="variant()"
      [ngClass]="{
        pressed: pressed(),
        loading: loading(),
        'icon-prefix': iconPrefix(),
      }"
      [ngStyle]="{
        width: size() ? size() : 'auto',
      }"
      (click)="clicked.emit()"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (keydown.enter)="pressed.set(true)"
      (keydown.space)="pressed.set(true)"
      (keyup)="pressed.set(false)">
      @if (loading()) {
        <pk-loader [size]="'sm'" />
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
})
export class PkButtonComponent {
  public disabled = input(false);
  public type = input('button');
  public loading = input(false);
  public variant = input<PkButtonVariant>('default');
  public size = input('');
  public iconPrefix = input(false);

  public pressed = signal(false);

  public clicked = output<void>();
}
