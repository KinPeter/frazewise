import { Component, Signal } from '@angular/core';
import { TtsService } from '../../common/services/tts.service';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressBarComponent } from '../../common/components/progress-bar.component';
import { GamesService } from './games.service';

@Component({
  selector: 'pk-games-header',
  imports: [PkIconButtonComponent, NgIcon, TranslatePipe, ProgressBarComponent],
  providers: [],
  styles: `
    header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;

      pk-progress-bar {
        flex-grow: 1;
      }
    }
  `,
  template: `
    <header>
      @if (isTtsBrowserEnabled()) {
        <pk-progress-bar [total]="totalGames()" [current]="gameIndex()" />
        <pk-icon-button
          variant="default"
          [tooltip]="'practice.toggleVoice' | translate"
          (clicked)="toggleVoice()">
          <ng-icon [name]="isVoiceEnabled() ? 'tablerVolume' : 'tablerVolumeOff'" size="1.2rem" />
        </pk-icon-button>
      }
    </header>
  `,
})
export class GamesHeaderComponent {
  public isTtsBrowserEnabled: Signal<boolean>;
  public isVoiceEnabled: Signal<boolean>;
  public totalGames: Signal<number>;
  public gameIndex: Signal<number>;

  constructor(
    private ttsService: TtsService,
    private gamesService: GamesService
  ) {
    this.isTtsBrowserEnabled = this.ttsService.isBrowserEnabled;
    this.isVoiceEnabled = this.ttsService.isEnabled;
    this.totalGames = this.gamesService.gameCount;
    this.gameIndex = this.gamesService.gameIndex;
  }

  public toggleVoice(): void {
    this.ttsService.toggleVoice();
  }
}
