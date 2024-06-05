import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-score-item',
  templateUrl: './score-item.component.html',
  styleUrl: './score-item.component.css'
})
export class ScoreItemComponent {
  @Input() score!: { player: string, points: number };
}
