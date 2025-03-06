import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { DeckWithCards } from '../../../../../common/types/decks';

@Component({
  selector: 'pk-export-cards',
  imports: [TranslatePipe, NgIcon, PkButtonComponent],
  providers: [],
  styles: ``,
  template: `
    <h2>{{ 'cards.exportDeck' | translate }}</h2>
    <p>{{ 'cards.exportDeckInfo' | translate }}</p>
    <pk-button variant="outline" [iconPrefix]="true" (clicked)="onExportClick()">
      <ng-icon name="tablerFileDownload" size="1.2rem" />
      {{ 'cards.exportDeck' | translate }}
    </pk-button>
  `,
})
export class ExportCardsComponent {
  public deck = input.required<DeckWithCards>();

  public onExportClick(): void {
    const text = JSON.stringify(this.deck().cards, null, 2);
    // TODO check if there are cards
    // TODO map cards to export format
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    // TODO normalize and generate filename
    const filename = `frazewise-export-${date}.json`;
    const type = 'text/plain';

    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up after download
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
