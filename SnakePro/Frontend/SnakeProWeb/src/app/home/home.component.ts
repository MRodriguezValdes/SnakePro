import {Component, HostListener, ViewEncapsulation} from '@angular/core';
import {CellType, GameStates} from "../../common/Enums";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent {
  title = 'SnakeProWeb';
  public boardArray: CellType[][] = [];
  public visible: boolean = true;
  settingsVisible = false;
  gameOverVisible = false;
  pauseVisible: boolean = false;
  boardCols: number = 20;
  boardRows: number = 20;
  score: number = 0;
  bestScore: number = 0;

  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http: HttpClient) {
  }

  public errorsVisible = false;
  public errorMessage: string = '';

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
      this.snakeCommunicationsService.getSnakeBoardUpdate().subscribe((board) => {
        console.log("Board received: ", board)
        this.boardArray = board;
      });
      this.snakeCommunicationsService.getGameStates().subscribe((gameState: GameStates) => {
        console.log("Game state received: ", gameState)
        this.changeStateMessage(gameState)
      });
    });

    this.snakeCommunicationsService.errorOccurred.subscribe((error) => {
      this.errorsVisible = true;
      this.errorMessage = error;
    });

  }

  changeStateMessage(gameState: GameStates) {
    switch (gameState) {
      case GameStates.GameOver:
        this.score = 0;
        this.gameOverVisible = true;
        break;
      case GameStates.Paused:
        this.pauseVisible = true;
        break;
      case GameStates.Running:
        this.pauseVisible = false;
        break;
      case GameStates.Win:
      case GameStates.None:
        break;
    }
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
  }

  startGame(): void {
    this.snakeCommunicationsService.startGame(this.boardCols, this.boardRows).subscribe(() => console.log("Game started"));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'p') {
      this.snakeCommunicationsService.pauseGame().subscribe();
    } else if (event.key === ' ') {
      this.snakeCommunicationsService.resumeGame().subscribe();
    } else {
      this.snakeCommunicationsService.setMovement(event.key).subscribe();
    }
  }


  hideErrors() {
    this.errorsVisible = false;
  }

  hideGameOver() {
    this.gameOverVisible = false;
  }

  hidePause() {
    this.pauseVisible = false;
  }
}