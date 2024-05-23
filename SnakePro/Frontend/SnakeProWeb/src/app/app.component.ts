import {ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CellType, GameStates} from "../common/Enums";
import {SnakeCommunicationsService} from "../services/snake-communications.service";
import {HttpClient} from "@angular/common/http";

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

  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http:HttpClient) { }

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

    this.snakeCommunicationsService.startConnection().then(() => {
      this.snakeCommunicationsService.sendMessage("hola");
      this.snakeCommunicationsService.sendBoard(this.boardCols, this.boardRows);
      this.snakeCommunicationsService.getSnakeBoardUpdate().subscribe((board) => {
        console.log("Board received: ", board)
        this.boardArray = board;
      });
      this.snakeCommunicationsService.getGameStates().subscribe((gameState:GameStates) => {
        console.log("Game state received: ", gameState)
      });
    });
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
    this.snakeCommunicationsService.sendBoard(this.boardCols, this.boardRows);
  }
  startGame(): void {
    this.snakeCommunicationsService.startGame(10, 10).subscribe(()=>console.log("Game started"));
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    this.snakeCommunicationsService.setMovement(event.key).subscribe();
  }

}
