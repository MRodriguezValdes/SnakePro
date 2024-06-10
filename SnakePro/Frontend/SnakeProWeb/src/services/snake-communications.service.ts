import {EventEmitter, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType, Direction, GameStates} from "../common/Enums";
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from "../common/User";

@Injectable({
  providedIn: 'root'
})
export class SnakeCommunicationsService {
  /**
   * Represents a connection to the SignalR hub.
   * @type {signalR.HubConnection}
   */
  private hubConnection: signalR.HubConnection;

  /**
   * Subject that emits updates to the snake board.
   * @type {Subject<CellType[][]>}
   */
  private snakeBoardUpdate: Subject<CellType[][]> = new Subject<CellType[][]>()

  /**
   * Subject that emits updates to the game state.
   * @type {Subject<GameStates>}
   */
  private gameStates: Subject<GameStates> = new Subject<GameStates>()

  /**
   * Subject that emits updates to the score.
   * @type {Subject<number>}
   */
  private score: Subject<number> = new Subject<number>()

  /**
   * Subject that emits updates to the movement direction.
   * @type {Subject<Direction>}
   */
  private movement: Subject<Direction> = new Subject<Direction>()

  /**
   * Event emitter that emits when an error occurs.
   * @type {EventEmitter<string>}
   */
  public errorOccurred: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Constructor for the SnakeCommunicationsService class.
   * @param {HttpClient} http - The Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    /**
     * Initialize the SignalR hub connection.
     */
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/snakegamehub")
      .build();

    /**
     * Handle the 'close' event of the hub connection.
     * Emit an error message if there is an error.
     */
    this.hubConnection.onclose((error) => {
      console.log('Connection closed');
      if (error) {
        this.errorOccurred.emit(error.message);
      }
    });

    /**
     * Handle the 'reconnected' event of the hub connection.
     * Emit a message indicating that the connection has been reestablished.
     */
    this.hubConnection.onreconnected(() => {
      console.log('Connection reestablished');
      this.errorOccurred.emit('The connection has been reestablished');
    });

    /**
     * Handle the 'SnakeBoardUpdate' event of the hub connection.
     * Emit the updated snake board.
     */
    this.hubConnection.on("SnakeBoardUpdate", (boardArray: CellType [][]) => {
      this.snakeBoardUpdate.next(boardArray);
    });

    /**
     * Handle the 'GameStates' event of the hub connection.
     * Emit the updated game state.
     */
    this.hubConnection.on("GameStates", (gameState: GameStates) => {
      this.gameStates.next(gameState);
    });

    /**
     * Handle the 'Score' event of the hub connection.
     * Emit the updated score.
     */
    this.hubConnection.on("Score", (score: number) => {
      this.score.next(score);
    });

    /**
     * Handle the 'CurrentMovement' event of the hub connection.
     * Emit the updated movement direction.
     */
    this.hubConnection.on("CurrentMovement", (currentMovement: Direction) => {
      this.movement.next(currentMovement);
    });
  }

  /**
   * Starts the SignalR hub connection.
   *
   * This method attempts to start the hub connection and logs a message if the connection is successful.
   * If an error occurs during the connection attempt, it logs the error message and emits the error message
   * using the `errorOccurred` event emitter.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection is successfully started.
   * @throws {Error} If an error occurs while starting the connection.
   */
  public async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('Connection started');
    } catch (err) {
      if (err instanceof Error) {
        console.log('Error while starting connection: ' + err.message);
        this.errorOccurred.emit(err.message);
      } else {
        // Handle unexpected error type
        console.log('Unexpected error while starting connection: ' + err);
        this.errorOccurred.emit(String(err));
      }
    }
  }

  /**
   * Returns an Observable that emits updates to the snake board.
   * @returns {Observable<any[][]>} An Observable that emits updates to the snake board.
   */
  public getSnakeBoardUpdate(): Observable<any[][]> {
    return this.snakeBoardUpdate.asObservable();
  }

  /**
   * Returns an Observable that emits updates to the game state.
   * @returns {Observable<GameStates>} An Observable that emits updates to the game state.
   */
  public getGameStates(): Observable<GameStates> {
    return this.gameStates.asObservable();
  }

  /**
   * Returns an Observable that emits updates to the score.
   * @returns {Observable<number>} An Observable that emits updates to the score.
   */
  public getScore(): Observable<number> {
    return this.score.asObservable();
  }

  /**
   * Returns an Observable that emits updates to the movement direction.
   * @returns {Observable<Direction>} An Observable that emits updates to the movement direction.
   */
  public getDirection(): Observable<Direction> {
    return this.movement.asObservable();
  }

  /**
   * Sends a request to the server to pause the game.
   *
   * This method sends a POST request to the 'PauseGame' endpoint of the game API.
   * The server should respond by pausing the game and returning a response.
   *
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public pauseGame(): Observable<any> {
    return this.http.post('http://localhost:5273/api/Game/PauseGame', null);
  }

  /**
   * Sends a request to the server to resume the game.
   *
   * This method sends a POST request to the 'ResumeGame' endpoint of the game API.
   * The server should respond by resuming the game and returning a response.
   *
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public resumeGame(): Observable<any> {
    return this.http.post('http://localhost:5273/api/Game/ResumeGame', null);
  }

  /**
   * Sends a request to the server to get the best scores.
   *
   * This method sends a GET request to the 'GetTopScores' endpoint of the FirebaseDb API.
   * The server should respond by returning the top scores.
   *
   * @param {number} howMany - The number of top scores to retrieve.
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public getBestScore(howMany: number): Observable<any> {
    return this.http.get<number>(`http://localhost:5273/api/FirebaseDb/GetTopScores?count=${howMany}`);
  }

  /**
   * Sends a request to the server to set the movement direction.
   *
   * This method sends a POST request to the 'SetMovement' endpoint of the game API.
   * The server should respond by setting the movement direction and returning a response.
   *
   * @param {string} key - The key representing the movement direction.
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public setMovement(key: string): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(key);
    return this.http.post('http://localhost:5273/api/Game/SetMovement', body, {'headers': headers});
  }

  /**
   * Sends a request to the server to start the game.
   *
   * This method sends a POST request to the 'Start' endpoint of the game API.
   * The server should respond by starting the game and returning a response.
   *
   * @param {number} columns - The number of columns in the game board.
   * @param {number} rows - The number of rows in the game board.
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public startGame(columns: number, rows: number): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify({columns, rows});
    return this.http.post(`http://localhost:5273/api/Game/Start`, body, {'headers': headers});
  }

  /**
   * Sends a request to the server to get the user data.
   *
   * This method sends a POST request to the 'GetUserData' endpoint of the FirebaseDb API.
   * The server should respond by returning the user data.
   *
   * @param {string} idToken - The ID token of the user.
   * @returns {Observable<User>} An Observable that emits the server's response.
   */
  public sendToken(idToken: string): Observable<User> {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify(idToken);
    return this.http.post('http://localhost:5273/api/FirebaseDb/GetUserData', body, {headers});
  }

  /**
   * Sends a request to the server to save the score.
   *
   * This method sends a POST request to the 'SaveScore' endpoint of the FirebaseDb API.
   * The server should respond by saving the score and returning a response.
   *
   * @param {number} score - The score to save.
   * @returns {Observable<any>} An Observable that emits the server's response.
   */
  public saveScore(score: number): Observable<any> {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify(score);
    return this.http.post('http://localhost:5273/api/FirebaseDb/SaveScore', body, {headers});
  }
}
