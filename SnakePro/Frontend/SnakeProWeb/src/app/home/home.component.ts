import {Component, HostListener, OnInit} from '@angular/core';
import {CellType, Direction, GameStates} from "../../common/Enums";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../common/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /**
   * The title of the application.
   * @type {string}
   */
  title = 'SnakeProWeb';

  /**
   * The 2D array representing the game board.
   * @type {CellType[][]}
   */
  public boardArray: CellType[][] = [];

  /**
   * A flag indicating if the game board is visible.
   * @type {boolean}
   */
  public visible: boolean = true;
  /**
   * A flag indicating if the settings screen is visible.
   * @type {boolean}
   */
  settingsVisible = false;

  /**
   * A flag indicating if the game over screen is visible.
   * @type {boolean}
   */
  gameOverVisible = false;

  /**
   * A flag indicating if the pause screen is visible.
   * @type {boolean}
   */
  pauseVisible: boolean = false;

  /**
   * The number of columns in the game board.
   * @type {number}
   */
  boardCols: number = 20;

  /**
   * The number of rows in the game board.
   * @type {number}
   */
  boardRows: number = 20;

  /**
   * The current score of the game.
   * @type {number}
   */
  score: number = 0;

  /**
   * The best score achieved in the game.
   * @type {number}
   */
  bestScore: number = 0;

  /**
   * The color of the snake in the game.
   * @type {string}
   */
  snakeColor: string = '#6dbb31';

  /**
   * The current direction of the snake's head.
   * @type {Direction}
   */
  snakeHeadDirection = Direction.Up;

  /**
   * A flag indicating if the snake has made its first move.
   * @type {boolean}
   */
  firstMove: boolean = true;

  /**
   * The current state of the game.
   * @type {GameStates}
   */
  public gameState: GameStates = GameStates.None;

  /**
   * The audio object for the game's background music.
   * @type {Audio}
   */
  audio = new Audio();

  /**
   * A flag indicating if the error message is visible.
   * @type {boolean}
   */
  public errorsVisible = false;

  /**
   * The current error message.
   * @type {string}
   */
  public errorMessage: string = '';

  /**
   * The constructor for the HomeComponent class.
   * It initializes the snakeCommunicationsService, http, and userService dependencies.
   * It also checks if the window object is defined (to ensure this isn't being run server-side),
   * and if so, retrieves the saved board dimensions from local storage.
   *
   * @param {SnakeCommunicationsService} snakeCommunicationsService - A service for handling communications with the snake game server.
   * @param {HttpClient} http - Angular's HttpClient for making HTTP requests.
   * @param {UserService} userService - A service for handling user operations.
   */
  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http: HttpClient, private userService: UserService) {
    if (typeof window !== 'undefined') {
      // Retrieve the saved board columns from local storage, if they exist.
      const savedboardCols = localStorage.getItem('boardCols');
      if (savedboardCols !== null) {
        this.boardCols = +savedboardCols;
      }
      // Retrieve the saved board rows from local storage, if they exist.
      const savedboardRows = localStorage.getItem('boardRows');
      if (savedboardRows !== null) {
        this.boardRows = +savedboardRows;
      }
    }
  }


  /**
   * A lifecycle hook that is called after Angular has initialized the component.
   * Here it's used to start the connection with the snake game server, subscribe to various game events,
   * handle errors, retrieve saved game settings from local storage, and manage the game's background music.
   */
  ngOnInit() {
    /**
     * Start the connection with the snake game server.
     * Once the connection is established, subscribe to various game events.
     */
    this.snakeCommunicationsService.startConnection().then(() => {
      /**
       * Subscribe to the snake board update event.
       * This event is triggered whenever the game board is updated.
       * The updated game board is assigned to this.boardArray.
       */
      this.snakeCommunicationsService.getSnakeBoardUpdate().subscribe((board) => {
        this.boardArray = board;
      });

      /**
       * Subscribe to the game state event.
       * This event is triggered whenever the game state changes.
       * The new game state is assigned to this.gameState.
       * If the game state is GameOver, the current score is saved and the gameStarted flag is removed from local storage.
       */
      this.snakeCommunicationsService.getGameStates().subscribe((gameState: GameStates) => {
        this.gameState = gameState;
        this.changeStateMessage(gameState);
        if (gameState === GameStates.GameOver) {
          this.snakeCommunicationsService.saveScore(this.score).subscribe(() => console.log("Score saved"));
          localStorage.removeItem('gameStarted');
        }
      });

      /**
       * Subscribe to the score event.
       * This event is triggered whenever the score changes.
       * The new score is assigned to this.score.
       * If the new score is greater than the best score, the best score is updated.
       */
      this.snakeCommunicationsService.getScore().subscribe((score) => {
        this.score = score;
        if (score > this.bestScore) {
          this.bestScore = score;
        }
      });

      /**
       * Get the best score from the server and assign it to this.bestScore.
       */
      this.snakeCommunicationsService.getBestScore(1).subscribe((bestScore) => {
        console.log(bestScore);
        this.bestScore = Number(Object.values(bestScore)[0]);
      });

      /**
       * Subscribe to the direction event.
       * This event is triggered whenever the direction of the snake's head changes.
       * The new direction is assigned to this.snakeHeadDirection.
       */
      this.snakeCommunicationsService.getDirection().subscribe((movement) => {
        this.snakeHeadDirection = movement;
      });
    });

    /**
     * Subscribe to the errorOccurred event.
     * This event is triggered whenever an error occurs.
     * When an error occurs, the error message is displayed and the gameStarted flag is removed from local storage.
     */
    this.snakeCommunicationsService.errorOccurred.subscribe((error) => {
      this.errorsVisible = true;
      this.errorMessage = error;
      localStorage.removeItem('gameStarted');
    });

    // Log the user's token.
    console.log(this.userService.getToken());

    /**
     * Retrieve the saved snake color from local storage.
     * If a saved color exists, use it.
     * Otherwise, use the default color and save it to local storage.
     */
    const savedColor = localStorage.getItem('snakeColor');
    if (savedColor) {
      this.snakeColor = savedColor;
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    } else {
      this.snakeColor = '#6dbb31';
      localStorage.setItem('snakeColor', this.snakeColor);
      document.documentElement.style.setProperty('--snake-color', this.snakeColor);
    }

    /**
     * Retrieve the saved snake head direction from local storage.
     * If a saved direction exists, use it.
     */
    const savedSnakeHeadDirection = localStorage.getItem('snakeHeadDirection');
    if (savedSnakeHeadDirection) {
      this.snakeHeadDirection = this.snakeHeadDirection = Direction[savedSnakeHeadDirection as keyof typeof Direction];
    }

    /**
     * Check if the game was paused.
     * If the game was paused, retrieve the saved game board from local storage and display the pause screen.
     */
    const gamePaused = localStorage.getItem('gamePaused');
    if (gamePaused === 'true') {
      const savedGameBoard = localStorage.getItem('gameBoard');
      if (savedGameBoard !== null) {
        this.boardArray = JSON.parse(savedGameBoard);
      }
      this.pauseVisible = true;
    }

    /**
     * Set up the game's background music.
     * If the music was playing when the game was last closed, resume playing the music from where it left off.
     */
    this.audio.src = "/assets/aves_4.mp3";
    this.audio.load();
    this.audio.loop = true;
    this.audio.play();
    const isMusicPlaying = localStorage.getItem('isMusicPlaying');
    if (isMusicPlaying === 'true') {
      const musicTime = localStorage.getItem('musicTime');
      if (musicTime !== null) {
        this.audio.currentTime = +musicTime;
      }
      this.audio.play();
    }

    /**
     * Every second, save the current state of the music (playing or paused) and the current time of the music to local storage.
     */
    setInterval(() => {
      localStorage.setItem('isMusicPlaying', this.audio.paused ? 'false' : 'true');
      localStorage.setItem('musicTime', this.audio.currentTime.toString());
    }, 1000);
  }

  /**
   * This method is used to change the visibility of the game over and pause screens based on the current game state.
   *
   * @param {GameStates} gameState - The current state of the game.
   */
  changeStateMessage(gameState: GameStates) {
    switch (gameState) {
      /**
       * If the game state is GameOver, the game over screen is made visible.
       */
      case GameStates.GameOver:
        this.gameOverVisible = true;
        break;
      /**
       * If the game state is Paused, the pause screen is made visible.
       */
      case GameStates.Paused:
        this.pauseVisible = true;
        break;
      /**
       * If the game state is Running, the pause screen is made invisible.
       */
      case GameStates.Running:
        this.pauseVisible = false;
        break;
      /**
       * If the game state is Win or None, no action is taken.
       */
      case GameStates.Win:
      case GameStates.None:
        break;
    }
  }

  /**
   * This method is used to determine the CSS class to apply to a cell on the game board, based on the cell's type.
   *
   * @param {number} row - The row index of the cell.
   * @param {number} col - The column index of the cell.
   * @returns {string} - The CSS class to apply to the cell.
   */
  colorCell(row: number, col: number): string {
    let cellClass = '';
    switch (this.boardArray[row][col]) {
      /**
       * If the cell is empty, apply the 'class-empty' CSS class.
       */
      case CellType.Empty:
        return 'class-empty';
      /**
       * If the cell is a block, apply the 'class-block' CSS class.
       */
      case CellType.Block:
        return 'class-block';
      /**
       * If the cell is food, apply the 'class-food' CSS class.
       */
      case CellType.Food:
        return 'class-food';
      /**
       * If the cell is special food, apply the 'class-special-food' CSS class.
       */
      case CellType.SpecialFood:
        return 'class-special-food';
      /**
       * If the cell is part of the snake's body, apply the 'class-snake' CSS class.
       */
      case CellType.SnakeBody:
        return 'class-snake';
      /**
       * If the cell is the snake's head, apply a CSS class based on the direction the snake is facing.
       */
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
      /**
       * If the cell is the snake's mouth (open), apply a CSS class based on the direction the snake is facing.
       */
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
      /**
       * If the cell is the snake's tail, apply the 'class-snake-tail' CSS class.
       */
      case CellType.SnakeTail:
        return 'class-snake-tail';
      /**
       * If the cell type is not recognized, apply the 'class-default' CSS class.
       */
      default:
        return 'class-default';
    }
    return cellClass;
  }


  /**
   * This method is used to hide the settings screen.
   * It sets the settingsVisible flag to false.
   */
  hideSettings() {
    this.settingsVisible = false;
  }

  /**
   * This method is used to start the game.
   * It first updates the board dimensions based on the saved values in local storage.
   * Then, it sends a request to the snake game server to start the game.
   * Once the game has started, it saves the current game board to local storage.
   * It also sets the firstMove flag to true and removes the gameStarted flag from local storage.
   * Finally, it starts playing the game's background music.
   */
  startGame(): void {
    // Update the board dimensions based on the saved values in local storage.
    this.updateBoardDimensions();

    // Send a request to the snake game server to start the game.
    this.snakeCommunicationsService.startGame(this.boardCols, this.boardRows).subscribe(() => {
      // Log that the game has started.
      console.log("Game started");

      // Save the current game board to local storage.
      localStorage.setItem('gameBoard', JSON.stringify(this.boardArray));
    });

    // Set the firstMove flag to true.
    this.firstMove = true;

    // Remove the gameStarted flag from local storage.
    localStorage.removeItem('gameStarted');

    // Start playing the game's background music.
    this.audio.play().catch((error) => {
      // Log any errors that occur while trying to play the music.
      console.log('Audio play failed due to', error);
    });
  }

  /**
   * This method is used to update the dimensions of the game board.
   * It retrieves the saved board dimensions from local storage and assigns them to this.boardCols and this.boardRows.
   * If no saved dimensions exist in local storage, the current values of this.boardCols and this.boardRows are not changed.
   */
  updateBoardDimensions(): void {
    /**
     * Retrieve the saved board columns from local storage.
     * If saved columns exist, assign them to this.boardCols.
     */
    const savedboardCols = localStorage.getItem('boardCols');
    if (savedboardCols !== null) {
      this.boardCols = +savedboardCols;
    }

    /**
     * Retrieve the saved board rows from local storage.
     * If saved rows exist, assign them to this.boardRows.
     */
    const savedboardRows = localStorage.getItem('boardRows');
    if (savedboardRows !== null) {
      this.boardRows = +savedboardRows;
    }
  }

  /**
   * This method is triggered when the start button is clicked.
   * It calls the startGame method to initiate the game.
   */
  handleStartClicked(): void {
    this.startGame();
  }

  /**
   * This method is triggered when the settings button is clicked.
   * It sets the settingsVisible flag to true, making the settings screen visible.
   */
  handleSettingsClicked(): void {
    this.settingsVisible = true;
  }

  /**
   * This method is a listener for keydown events on the document.
   * It handles the logic for changing the direction of the snake based on the arrow key pressed.
   * If the game is not over, it checks the key pressed and sets the new direction accordingly.
   * If the new direction is a valid move, it updates the snake's direction, sends the new direction to the server, and sets the firstMove flag to false.
   * If the 'p' key is pressed, it pauses the game and saves the current game state to local storage.
   * If the spacebar is pressed, it resumes the game and removes the saved game state from local storage.
   *
   * @param {KeyboardEvent} event - The keydown event.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.gameState !== GameStates.GameOver) {
      let newDirection = this.snakeHeadDirection;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = Direction.Up;
          break;
        case 'ArrowDown':
          newDirection = Direction.Down;
          break;
        case 'ArrowLeft':
          newDirection = Direction.Left;
          break;
        case 'ArrowRight':
          newDirection = Direction.Right;
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

  /**
   * This method is used to hide the error message.
   * It sets the errorsVisible flag to false, making the error message invisible.
   */
  hideErrors() {
    this.errorsVisible = false;
  }

  /**
   * This method is used to hide the game over screen and reset the score.
   * It sets the gameOverVisible flag to false, making the game over screen invisible.
   * It also resets the score to 0.
   */
  hideGameOver() {
    this.gameOverVisible = false;
    this.score = 0;
  }

  /**
   * This method is used to hide the pause screen.
   * It sets the pauseVisible flag to false, making the pause screen invisible.
   */
  hidePause() {
    this.pauseVisible = false;
  }

  /**
   * This method is used to determine if a proposed move is valid.
   *
   * A move is considered valid if it is the first move of the game, or if it does not result in the snake moving in the opposite direction to its current direction.
   *
   * If the move is the first move of the game, the 'gameStarted' flag is set to true in local storage.
   *
   * @param {Direction} newDirection - The proposed direction of the snake's movement.
   * @returns {boolean} - Returns true if the move is valid, false otherwise.
   */
  isValidMove(newDirection: Direction): boolean {

    if (this.firstMove) {
      localStorage.setItem('gameStarted', 'true');
      return true;
    }

    return !((this.snakeHeadDirection === Direction.Up && newDirection === Direction.Down) ||
      (this.snakeHeadDirection === Direction.Down && newDirection === Direction.Up) ||
      (this.snakeHeadDirection === Direction.Left && newDirection === Direction.Right) ||
      (this.snakeHeadDirection === Direction.Right && newDirection === Direction.Left));

  }
}
