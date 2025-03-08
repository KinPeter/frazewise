import { Component, input, output } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { MatchPairsData } from './games.types';

@Component({
  selector: 'pk-match-pairs-game',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class MatchPairsGameComponent {
  public data = input.required<MatchPairsData>();
  public result = output<PracticeRequest>();
}
