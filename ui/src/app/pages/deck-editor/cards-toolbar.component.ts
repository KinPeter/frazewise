import { Component, output, signal, WritableSignal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { NgIcon } from '@ng-icons/core';

export type CardsTab = 'cards' | 'addNew' | 'import' | 'export' | 'generate';

@Component({
  selector: 'pk-cards-toolbar',
  imports: [TranslatePipe, PkButtonComponent, NgIcon],
  providers: [],
  styles: `
    .toolbar {
      display: flex;
      background-color: var(--color-bg);
      border-radius: var(--radius-sm);
      padding: 0 0.5rem;
      margin-bottom: 0.5rem;
      overflow-x: auto;
    }

    .tab {
      border-bottom: 3px solid transparent;

      &.active {
        border-bottom: 3px solid var(--color-accent);
      }
    }
  `,
  template: `
    <nav class="toolbar">
      @for (item of items; track item.tab) {
        <div class="tab" [class.active]="selectedTab() === item.tab">
          <pk-button variant="link-accent" [iconPrefix]="true" (clicked)="selectTab(item.tab)">
            <ng-icon [name]="item.icon" size="1.2rem" />
            {{ 'cards.' + item.tab | translate }}
          </pk-button>
        </div>
      }
    </nav>
  `,
})
export class CardsToolbarComponent {
  public items: { tab: CardsTab; icon: string }[] = [
    { tab: 'cards', icon: 'tablerVersions' },
    { tab: 'addNew', icon: 'tablerPlus' },
    { tab: 'import', icon: 'tablerFileImport' },
    { tab: 'export', icon: 'tablerFileExport' },
    { tab: 'generate', icon: 'tablerSparkles' },
  ];
  public selectedTab: WritableSignal<CardsTab> = signal('cards');
  public tabChanged = output<CardsTab>();

  public selectTab(tab: CardsTab) {
    this.selectedTab.set(tab);
    this.tabChanged.emit(tab);
  }
}
