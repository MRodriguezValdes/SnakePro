import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {
  /**
   * @Output() decorator is used to mark a property in a child component as a doorway
   * through which data can travel from the child to the parent. Here it's used to emit
   * an event when the game over screen needs to be closed.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * @Input() decorator is used to allow data to flow from a parent component into a child component.
   * Here it's used to receive the final score from the parent component.
   */
  @Input() score!: number;

  /**
   * This method is used to emit the 'close' event, which should be handled by the parent component
   * to close the game over screen.
   */
  closeGameOver() {
    this.close.emit();
  }
}
