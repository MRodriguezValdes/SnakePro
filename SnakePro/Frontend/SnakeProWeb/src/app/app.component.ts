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
  boardWidth: number = 20;
  boardHeight: number = 20;


  constructor(public snakeComunicationsService: SnakeComunicationsService) {
  }

ngOnInit() {
  this.snakeComunicationsService.startConnection().then(() => {
    this.snakeComunicationsService.sendMessage("hola");
    this.snakeComunicationsService.sendBoard(this.boardWidth, this.boardHeight);
    const savedboardWidth = localStorage.getItem('boardWidth');
    if (savedboardWidth !== null) {
      this.boardWidth = +savedboardWidth;
    }
    const savedboardHeight = localStorage.getItem('boardHeight');
    if (savedboardHeight !== null) {
      this.boardHeight = +savedboardHeight; // Corregido aquí
    }
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
    this.snakeComunicationsService.sendBoard(this.boardWidth, this.boardHeight);
  }




}
