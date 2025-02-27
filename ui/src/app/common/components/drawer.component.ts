import { AfterViewInit, Component, input, output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'pk-drawer',
  imports: [NgIcon],
  providers: [],
  styles: `
    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background-color: var(--color-bg-opaque);
      backdrop-filter: blur(3px);
      z-index: 1;
      display: none;

      &.open {
        display: block;
      }
    }

    .drawer {
      position: absolute;
      top: 0;
      left: -1000px;
      width: 100vw;
      height: 100vh;
      overflow-y: auto;
      z-index: var(--popup-content-z-index);
      background-color: var(--color-bg);
      border-right: 1px solid var(--color-border);
      box-shadow: 0 2px 8px 0 var(--color-black);
      padding: 0.2rem 1rem 1rem;
      transition:
        left 0.2s ease-in-out,
        width 0.2s ease-in-out;
      display: none;

      &.enabled {
        display: block;
      }

      &.sm {
        left: -370px;

        @media screen and (min-width: 350px) {
          width: 350px;
        }
      }

      &.md {
        left: -670px;

        @media screen and (min-width: 650px) {
          width: 650px;
        }
      }

      &.lg {
        left: -920px;

        @media screen and (min-width: 900px) {
          width: 900px;
        }
      }

      &.open {
        left: 0;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: -0.7rem;

        h1 {
          margin-top: 0.35rem;
        }

        > div {
          display: flex;
          gap: 0.5rem;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-disabled);
          font-size: 1.75rem;
          padding: 0.5rem;
          border-radius: 50%;

          &:hover {
            color: var(--color-text);
          }
        }
      }
    }
  `,
  template: `
    <div class="backdrop" [class.open]="open()" (click)="close.emit()"></div>
    <div class="drawer" [class.open]="open()" [class.enabled]="enabled()" [class]="size()">
      <div class="header">
        <h1>{{ name() }}</h1>
        <div>
          <button type="button" (click)="close.emit()">
            <ng-icon name="tablerX" />
          </button>
        </div>
      </div>
      <ng-content />
    </div>
  `,
})
export class DrawerComponent implements AfterViewInit {
  public open = input<boolean>(true);
  public name = input<string>('');
  public size = input<'sm' | 'md' | 'lg'>('md');

  public enabled = signal(false);

  public close = output<void>();

  ngAfterViewInit() {
    this.enabled.set(true);
  }
}
