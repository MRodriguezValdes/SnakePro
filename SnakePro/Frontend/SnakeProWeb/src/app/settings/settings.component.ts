import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  /**
   * @Output() close is an EventEmitter that emits an event when the settings are closed.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * boardCols is a FormControl that represents the number of columns in the game board.
   * It has a default value of 20 and it must be between 10 and 30.
   */
  boardCols = new FormControl(20, [Validators.min(10), Validators.max(30)]);

  /**
   * boardRows is a FormControl that represents the number of rows in the game board.
   * It has a default value of 20 and it must be between 10 and 30.
   */
  boardRows = new FormControl(20, [Validators.min(10), Validators.max(30)]);

  /**
   * snakeColor is a string that represents the color of the snake in the game.
   * It has a default value of '#6dbb31'.
   */
  snakeColor: string = '#6dbb31';

  /**
   * The constructor for the SettingsComponent class.
   * It injects the SnakeCommunicationsService service.
   * @param {SnakeCommunicationsService} snakeCommunicationsService - The service for snake game-related operations.
   */
  constructor(public snakeCommunicationsService: SnakeCommunicationsService) {
  }

  /**
   * The ngOnInit method is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * In this method, it retrieves the saved board columns, board rows, and snake color from the local storage and sets them to the respective form controls and properties.
   * It also subscribes to the value changes of the boardCols and boardRows form controls and sets the value of the other form control to the new value.
   */
  ngOnInit() {
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols.setValue(+savedboardCols);
    }
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows.setValue(+savedboardRows);
    }

    this.boardCols.valueChanges.subscribe(value => {
      this.boardRows.setValue(value, {emitEvent: false});
    });

    this.boardRows.valueChanges.subscribe(value => {
      this.boardCols.setValue(value, {emitEvent: false});
    });
    const savedColor = localStorage.getItem('snakeColor');
    if (savedColor) {
      this.snakeColor = savedColor;
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    } else {
      this.snakeColor = '#6dbb31';
      localStorage.setItem('snakeColor', this.snakeColor);
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    }
  }

  /**
   * The saveSettings method is called to save the settings.
   * It retrieves the saved board columns and board rows from the local storage and sets them to the respective form controls.
   * It also checks if the new values are within the valid range, and if not, it sets them to the old values.
   * Finally, it saves the new board columns, board rows, and snake color to the local storage and sets the snake color CSS variable.
   */
  saveSettings() {
    const boardColsItem = localStorage.getItem('boardCols');
    const boardRowsItem = localStorage.getItem('boardRows');
    const oldBoardColsValue = boardColsItem ? +boardColsItem : 20;
    const oldBoardRowsValue = boardRowsItem ? +boardRowsItem : 20;

    let newBoardColsValue = this.boardCols.value ?? oldBoardColsValue;
    let newBoardRowsValue = this.boardRows.value ?? oldBoardRowsValue;

    if (newBoardColsValue > 30 || newBoardColsValue < 10) {
      newBoardColsValue = oldBoardColsValue;
    }
    if (newBoardRowsValue > 30 || newBoardRowsValue < 10) {
      newBoardRowsValue = oldBoardRowsValue;
    }

    localStorage.setItem('boardCols', newBoardColsValue.toString());
    localStorage.setItem('boardRows', newBoardRowsValue.toString());
    localStorage.setItem('snakeColor', this.snakeColor);
    document.documentElement.style.setProperty('--snake-color', this.snakeColor);
  }

  /**
   * The closeSettings method is used to close the settings.
   * It emits the close event.
   */
  closeSettings() {
    this.close.emit();
  }
}
