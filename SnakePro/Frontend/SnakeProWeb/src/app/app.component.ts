import { Component, OnInit } from '@angular/core';
import { SnakeComunicationsService } from '../services/snake-comunications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';

  rows = 20;
  cols = 40;
  board: number[][] = [];

  constructor(private snakeComunicationsService: SnakeComunicationsService,) { this.initializeBoard();}

  ngOnInit() {
    this.snakeComunicationsService.startConnection().then(() => {
      this.snakeComunicationsService.sendMessage("hola");
      this.snakeComunicationsService.sendBoard(2,2);
    });
  }



  initializeBoard(): void {
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
      }
    }
  }


}
