import { Component, input, output } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { SentenceData } from './games.types';

@Component({
  selector: 'pk-sentence-game',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class SentenceGameComponent {
  public data = input.required<SentenceData>();
  public result = output<PracticeRequest>();
}
