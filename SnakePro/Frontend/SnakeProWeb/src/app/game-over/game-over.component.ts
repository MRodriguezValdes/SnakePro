import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.css'
})
export class GameOverComponent {
  @Output() close = new EventEmitter<void>();
  @Input() score!: number;

  closeGameOver() {
    this.close.emit();
  }
}
