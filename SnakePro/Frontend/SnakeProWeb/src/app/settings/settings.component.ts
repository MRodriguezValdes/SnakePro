import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {SnakeComunicationsService} from "../../services/snake-comunications.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  boardCols = new FormControl(20, [Validators.min(10), Validators.max(30)]);
  boardRows = new FormControl(20, [Validators.min(10), Validators.max(30)]);

  constructor(public snakeComunicationsService: SnakeComunicationsService) {
  }

  ngOnInit() {
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols.setValue(+savedboardCols);
    }
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows.setValue(+savedboardRows);
    }
  }

  saveSettings() {
    const boardColsItem = localStorage.getItem('boardCols');
    const boardRowsItem = localStorage.getItem('boardRows');
    const oldBoardColsValue = boardColsItem ? +boardColsItem : 20;
    const oldBoardRowsValue = boardRowsItem ? +boardRowsItem : 20;

    let newBoardColsValue = this.boardCols.value ?? oldBoardColsValue;
    let newBoardRowsValue = this.boardRows.value ?? oldBoardRowsValue;

    if (newBoardColsValue > 30) {
      newBoardColsValue = oldBoardColsValue;
    }
    if (newBoardRowsValue > 30) {
      newBoardRowsValue = oldBoardRowsValue;
    }

    localStorage.setItem('boardCols', newBoardColsValue.toString());
    localStorage.setItem('boardRows', newBoardRowsValue.toString());
    console.log(newBoardColsValue, newBoardRowsValue);
  }

  closeSettings() {
    this.close.emit();
    this.snakeComunicationsService.sendBoard(this.boardCols.value ?? 20, this.boardRows.value ?? 20);
  }
}
