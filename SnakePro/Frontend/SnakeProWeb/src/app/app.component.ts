import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SnakeComunicationsService} from '../services/snake-comunications.service';
import {CellType} from "../common/Board";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'SnakeProWeb';
  public boardArray: CellType[][] = [];
  public visible: boolean = true;
  settingsVisible = false;
  boardCols: number = 20;
  boardRows: number = 20;
  score: number = 0;
  bestScore: number = 0;


  constructor(public snakeComunicationsService: SnakeComunicationsService) {
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedboardCols = localStorage.getItem('boardCols');
      if (savedboardCols !== null) {
        this.boardCols = +savedboardCols;
      }
      const savedboardRows = localStorage.getItem('boardRows');
      if (savedboardRows !== null) {
        this.boardRows = +savedboardRows;
      }
    }

    this.snakeComunicationsService.startConnection().then(() => {
      this.snakeComunicationsService.sendMessage("hola");
      this.snakeComunicationsService.sendBoard(this.boardCols, this.boardRows);
    });
  }

  updateBoardArray() {
    this.boardArray = this.snakeComunicationsService.getBoardArray();
    this.visible = false;
  }

  colorCell(row: number, col: number): string {
    switch (this.boardArray[row][col]) {
      case CellType.Empty:
        return 'green';
      case CellType.Block:
        return 'black';
      case CellType.Food:
        return 'red';
      case CellType.Snake:
        return 'yellow';
      default:
        return 'white';
    }
  }
  showSettings() {
    this.settingsVisible = true;
  }

  hideSettings() {
    this.settingsVisible = false;
    this.snakeComunicationsService.sendBoard(this.boardCols, this.boardRows);
  }
}
