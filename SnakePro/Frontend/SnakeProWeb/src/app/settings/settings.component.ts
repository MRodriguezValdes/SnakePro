import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {SnakeComunicationsService} from "../../services/snake-comunications.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  boardCols: number = 20;
  boardRows: number = 20;

  constructor(public snakeComunicationsService: SnakeComunicationsService) {
  }

  ngOnInit() {
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols = +savedboardCols;
    }
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows = +savedboardRows;
    }
  }
  saveSettings() {


    localStorage.setItem('boardCols', this.boardCols.toString());
    localStorage.setItem('boardRows', this.boardRows.toString());
    console.log(this.boardCols,this.boardRows);
  }

  closeSettings() {
    this.close.emit();
    this.snakeComunicationsService.sendBoard(this.boardCols, this.boardRows);
  }
}
