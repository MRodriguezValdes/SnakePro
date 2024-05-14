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

  constructor(public snakeComunicationsService: SnakeComunicationsService) {}

  ngOnInit() {
    this.snakeComunicationsService.startConnection().then(() => {
      this.snakeComunicationsService.sendMessage("hola");
      this.snakeComunicationsService.sendBoard(20, 20);
    });
  }

  updateBoardArray() {
    this.boardArray = this.snakeComunicationsService.getBoardArray();
    this.visible = false;
    if (this.boardArray[0][0] == CellType.Empty){

    }
  }


}
