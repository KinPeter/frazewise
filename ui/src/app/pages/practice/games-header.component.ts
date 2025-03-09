import { Component, Signal } from '@angular/core';
import { TtsService } from '../../common/services/tts.service';
import { PkIconButtonComponent } from '../../common/components/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'pk-games-header',
  imports: [PkIconButtonComponent, NgIcon, TranslatePipe],
  providers: [],
  styles: `
    header {
      display: flex;
      justify-content: flex-end;
    }
  `,
  template: `
    <header>
      @if (isTtsBrowserEnabled()) {
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

  constructor(private ttsService: TtsService) {
    this.isTtsBrowserEnabled = ttsService.isBrowserEnabled;
    this.isVoiceEnabled = ttsService.isEnabled;
  }

  public toggleVoice(): void {
    this.ttsService.toggleVoice();
  }
}
