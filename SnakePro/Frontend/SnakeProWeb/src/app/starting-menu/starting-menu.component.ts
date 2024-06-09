import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SnakeCommunicationsService} from "../../services/snake-communications.service";
import {GameStates} from "../../common/Enums";

@Component({
  selector: 'app-starting-menu',
  templateUrl: './starting-menu.component.html',
  styleUrls: ['./starting-menu.component.css']
})
export class StartingMenuComponent implements OnInit {

/**
 * Flag to indicate if the menu is hidden or not.
 * @type {boolean}
 */
isMenuHidden = false;

/**
 * Event emitter for the start click event.
 * @type {EventEmitter<void>}
 */
@Output() startClicked = new EventEmitter<void>();

/**
 * Event emitter for the settings click event.
 * @type {EventEmitter<void>}
 */
@Output() settingsClicked = new EventEmitter<void>();

/**
 * Flag to indicate if an error has occurred.
 * @type {boolean | undefined}
 */
private hasErrorOccurred: boolean | undefined;

/**
 * Constructor for the StartingMenuComponent.
 * @param {SnakeCommunicationsService} snakeCommunicationsService - The service to communicate with the snake game.
 */
constructor(private snakeCommunicationsService: SnakeCommunicationsService) {

}

/**
 * Angular lifecycle hook that is called after data-bound properties of a directive are initialized.
 * Here, it subscribes to the errorOccurred event from the snakeCommunicationsService.
 */
ngOnInit() {
  this.snakeCommunicationsService.errorOccurred.subscribe((error) => {
    this.hasErrorOccurred = true;
  });

  const gameStarted = localStorage.getItem('gameStarted');
  if (gameStarted === 'true') {
    this.isMenuHidden = true;
  }

  this.snakeCommunicationsService.getGameStates().subscribe((gameState) => {
    if (gameState === GameStates.Running) {
      this.isMenuHidden = true;
    }
  });
}

/**
 * Method to close the menu. If no error has occurred, it hides the menu and emits the startClicked event after 1 second.
 */
closeMenu() {
  if (!this.hasErrorOccurred) {
    this.isMenuHidden = true;
      this.startClicked.emit();
    }

}

/**
 * Method to open the settings. It emits the settingsClicked event.
 */
openSettings() {
  this.settingsClicked.emit();
}

}
