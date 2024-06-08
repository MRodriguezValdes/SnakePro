import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CellType, GameStates} from "../../common/Enums";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../common/User";
import {UserService} from "../../services/user.service";
import {concatWith} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit{
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
  snakeColor: string = '#6dbb31';
  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http: HttpClient, private userService: UserService) {
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
        this.boardArray = board;
      });
      this.snakeCommunicationsService.getGameStates().subscribe((gameState: GameStates) => {
        this.changeStateMessage(gameState)
        if (gameState === GameStates.GameOver) {
          this.snakeCommunicationsService.saveScore(this.score).subscribe(() => console.log("Score saved"));
          localStorage.removeItem('gameStarted');
        }
      });
      this.snakeCommunicationsService.getScore().subscribe((score) => {
        this.score = score;
        if (score > this.bestScore) {
          this.bestScore = score;
        }
      });
      this.snakeCommunicationsService.getBestScore(1).subscribe((bestScore) => {
        console.log(bestScore)
        this.bestScore = Number(Object.values(bestScore)[0]);
      });
    });

    this.snakeCommunicationsService.errorOccurred.subscribe((error) => {
      this.errorsVisible = true;
      this.errorMessage = error;
      localStorage.removeItem('gameStarted');
    });
    console.log(this.userService.getToken());

    const savedColor = localStorage.getItem('snakeColor');
    if (savedColor) {
      this.snakeColor = savedColor;
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    } else {
      this.snakeColor = '#6dbb31'; // default snake color
      localStorage.setItem('snakeColor', this.snakeColor);
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    }
  }

  changeStateMessage(gameState: GameStates) {
    switch (gameState) {
      case GameStates.GameOver:
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
        return 'class-empty';
      case CellType.Block:
        return 'class-block';
      case CellType.Food:
        return 'class-food';
      case CellType.Snake:
        return 'class-snake';
      default:
        return 'class-default';
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

  handleStartClicked(): void {
    this.startGame();
  }

  handleSettingsClicked(): void {
    this.settingsVisible = true;
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
    this.score=0;
  }

  hidePause() {
    this.pauseVisible = false;
  }
}
