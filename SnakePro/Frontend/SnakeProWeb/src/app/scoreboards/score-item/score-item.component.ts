import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-score-item',
  templateUrl: './score-item.component.html',
  styleUrl: './score-item.component.css'
})
export class ScoreItemComponent {
/**
 * @Input() score is a property decorator that defines an input property.
 * It allows the value of this property to be set from the parent component.
 * The score property is an object with a 'player' property that represents the player's name and a 'points' property that represents the player's points.
 */
@Input() score!: { player: string, points: number };
}
