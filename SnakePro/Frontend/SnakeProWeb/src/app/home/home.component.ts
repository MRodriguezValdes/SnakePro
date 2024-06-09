import { Component, HostListener, OnInit } from '@angular/core';
import {CellType, Direction, GameStates} from "../../common/Enums";
import { SnakeCommunicationsService } from "../../services/snake-communications.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../../common/User";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
  snakeHeadDirection = Direction.Up;
  firstMove: boolean = true;
  public gameState: GameStates = GameStates.None;

  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http: HttpClient, private userService: UserService) {
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
  }

  public errorsVisible = false;
  public errorMessage: string = '';

  ngOnInit() {
    this.snakeCommunicationsService.startConnection().then(() => {
      this.snakeCommunicationsService.getSnakeBoardUpdate().subscribe((board) => {
        this.boardArray = board;
      });
      this.snakeCommunicationsService.getGameStates().subscribe((gameState: GameStates) => {
        this.gameState = gameState;
        this.changeStateMessage(gameState);
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
        console.log(bestScore);
        this.bestScore = Number(Object.values(bestScore)[0]);
      });
      this.snakeCommunicationsService.getDirection().subscribe((movement) => {
        this.snakeHeadDirection = movement;
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
    const savedSnakeHeadDirection = localStorage.getItem('snakeHeadDirection');
    if (savedSnakeHeadDirection) {
      this.snakeHeadDirection = this.snakeHeadDirection = Direction[savedSnakeHeadDirection as keyof typeof Direction];
    }

    const gamePaused = localStorage.getItem('gamePaused');
    if (gamePaused === 'true') {
      const savedGameBoard = localStorage.getItem('gameBoard');
      if (savedGameBoard !== null) {
        this.boardArray = JSON.parse(savedGameBoard);
      }
      this.pauseVisible = true;
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
    let cellClass = '';
    switch (this.boardArray[row][col]) {
      case CellType.Empty:
        return 'class-empty';
      case CellType.Block:
        return 'class-block';
      case CellType.Food:
        return 'class-food';
      case CellType.SpecialFood:
        return 'class-special-food';
      case CellType.SnakeBody:
        return 'class-snake';
      case CellType.SnakeHead:
        if (this.snakeHeadDirection === Direction.Up) {
          cellClass = 'class-snake-head-up';
        } else if (this.snakeHeadDirection === Direction.Down) {
          cellClass = 'class-snake-head-down';
        } else if (this.snakeHeadDirection === Direction.Left) {
          cellClass = 'class-snake-head-left';
        } else if (this.snakeHeadDirection === Direction.Right) {
          cellClass = 'class-snake-head-right';
        }
        break;
      case CellType.SnakeMouthOpen:
        if (this.snakeHeadDirection === Direction.Up) {
          cellClass = 'class-snake-mouth-open-up';
        } else if (this.snakeHeadDirection === Direction.Down) {
          cellClass = 'class-snake-mouth-open-down';
        } else if (this.snakeHeadDirection === Direction.Left) {
          cellClass = 'class-snake-mouth-open-left';
        } else if (this.snakeHeadDirection === Direction.Right) {
          cellClass = 'class-snake-mouth-open-right';
        }
        break;
      case CellType.SnakeTail:
        return 'class-snake-tail';
      default:
        return 'class-default';
    }
    return cellClass;
  }

  showSettings() {
    this.settingsVisible = true;
  }

  hideSettings() {
    this.settingsVisible = false;
  }

  startGame(): void {
    this.updateBoardDimensions();
    this.snakeCommunicationsService.startGame(this.boardCols, this.boardRows).subscribe(() => {
      console.log("Game started");
      localStorage.setItem('gameBoard', JSON.stringify(this.boardArray));
    });
    this.firstMove = true;
    localStorage.removeItem('gameStarted');
  }

  updateBoardDimensions(): void {
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols = +savedboardCols;
    }
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows = +savedboardRows;
    }
  }

  handleStartClicked(): void {
    this.startGame();
  }

  handleSettingsClicked(): void {
    this.settingsVisible = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.gameState !== GameStates.GameOver) {
      let newDirection = this.snakeHeadDirection;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = Direction.Up;
          break;
        case 'ArrowDown':
          newDirection= Direction.Down;
          break;
        case 'ArrowLeft':
          newDirection = Direction.Left;
          break;
        case 'ArrowRight':
          newDirection= Direction.Right;
          break;
      }
      if (this.isValidMove(newDirection)) {
        this.snakeHeadDirection = newDirection;
        localStorage.setItem('snakeHeadDirection', Direction[this.snakeHeadDirection]);
        this.snakeCommunicationsService.setMovement(event.key).subscribe();
        this.firstMove = false;
      }

      if (event.key === 'p') {
        this.snakeCommunicationsService.pauseGame().subscribe(() => {
          localStorage.setItem('gamePaused', 'true');
          localStorage.setItem('gameBoard', JSON.stringify(this.boardArray));
        });
      } else if (event.key === ' ') {
        this.snakeCommunicationsService.resumeGame().subscribe(() => {
          localStorage.removeItem('gamePaused');
          localStorage.removeItem('gameBoard');
          localStorage.removeItem('snakeHeadDirection');
        });
      }
    }
  }

  hideErrors() {
    this.errorsVisible = false;
  }

  hideGameOver() {
    this.gameOverVisible = false;
    this.score = 0;
  }

  hidePause() {
    this.pauseVisible = false;
  }

  isValidMove(newDirection: Direction): boolean {
    // Permitir cualquier movimiento si es el primer movimiento
    if (this.firstMove) {
      localStorage.setItem('gameStarted', 'true');
      return true;
    }

    // No permitir que la serpiente se mueva en la dirección opuesta a su movimiento actual
    return !((this.snakeHeadDirection === Direction.Up && newDirection === Direction.Down) ||
      (this.snakeHeadDirection === Direction.Down && newDirection === Direction.Up) ||
      (this.snakeHeadDirection === Direction.Left && newDirection === Direction.Right) ||
      (this.snakeHeadDirection === Direction.Right && newDirection === Direction.Left));

  }
}
