import { Component, input, output } from '@angular/core';
import { PracticeRequest } from '../../../../../common/types/practice';
import { MultipleChoiceData } from './games.types';

@Component({
  selector: 'pk-multiple-choice-game',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class MultipleChoiceGameComponent {
  public data = input.required<MultipleChoiceData>();
  public result = output<PracticeRequest>();
}
