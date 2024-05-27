import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrl: './pause.component.css'
})
export class PauseComponent {
  @Output() close = new EventEmitter<void>();
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.close.emit();
  }
}
