import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrl: './pause.component.css'
})
export class PauseComponent {
/**
 * The PauseComponent class is an Angular component that represents the pause functionality in a game.
 */

/**
 * @Output() close is an EventEmitter that emits an event when the game is resumed.
 */
@Output() close = new EventEmitter<void>();

/**
 * @HostListener('window:keydown', ['$event']) is a decorator that listens for the 'keydown' event on the window object.
 * When a keydown event occurs, it calls the handleKeyDown method with the event object.
 */
@HostListener('window:keydown', ['$event'])

/**
 * The handleKeyDown method handles the keydown event.
 * If the key pressed is the space bar (' '), it calls the resumeGame method.
 * @param {KeyboardEvent} event - The keydown event object.
 */
handleKeyDown(event: KeyboardEvent) {
  if (event.key === ' ') {
    this.resumeGame();
  }
}

/**
 * The resumeGame method emits the close event, indicating that the game should be resumed.
 */
resumeGame() {
  this.close.emit();
}
}
