import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon } from '@ng-icons/core';
import { PkButtonComponent } from '../../common/components/pk-button.component';
import { DeckWithCards } from '../../../../../common/types/decks';

@Component({
  selector: 'pk-export-cards',
  imports: [TranslatePipe, NgIcon, PkButtonComponent],
  providers: [],
  styles: `
    p {
      margin-bottom: 1rem;
    }
  `,
  template: `
    <h2>{{ 'cards.exportDeck' | translate }}</h2>
    <p>{{ 'cards.exportDeckInfo' | translate }}</p>
    <pk-button
      variant="outline"
      [iconPrefix]="true"
      [disabled]="deck().cards.length === 0"
      (clicked)="onExportClick()">
      <ng-icon name="tablerFileDownload" size="1.2rem" />
      {{ 'cards.exportNCards' | translate: { count: deck().cards.length } }}
    </pk-button>
  `,
})
export class ExportCardsComponent {
  public deck = input.required<DeckWithCards>();

  public onExportClick(): void {
    if (this.deck().cards.length === 0) return;
    const toExport = this.deck().cards.map(card => ({
      source: card.source,
      target: card.target,
      targetAlt: this.deck().hasTargetAlt ? card.targetAlt : null,
    }));
    const text = JSON.stringify(toExport, null, 2);
    const deckName = this.toFilename(this.deck().name);
    const filename = `${deckName}-frazewise-export.json`;
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

  private toFilename(filename: string) {
    // Replace spaces with hyphens
    filename = filename.replace(/\s+/g, '-');
    // Remove special characters
    filename = filename.replace(/[^a-zA-Z0-9-]/g, '');
    return filename;
  }
}
