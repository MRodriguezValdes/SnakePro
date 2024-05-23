import {EventEmitter, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType, GameStates} from "../common/Enums";
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SnakeCommunicationsService {
  private hubConnection: signalR.HubConnection;
  private snakeBoardUpdate = new Subject<CellType[][]>()
  private gameStares = new Subject<GameStates>()
  public errorOccurred = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/chathub")
      .build();

    this.hubConnection.onclose((error) => {
      console.log('Connection closed');
      if (error) {
        this.errorOccurred.emit(error.message);
      }
    });


    this.hubConnection.onreconnected((connectionId) => {
      console.log('Connection reestablished');
      this.errorOccurred.emit('La conexión ha sido restablecida');
    });



    this.hubConnection.on("ReceiveMessage", (message) => {
      console.log("Message received: ", message);
    });
    this.hubConnection.on("ReceiveTestBoard", (boardArray: CellType [][]) => {
      console.log(" Test Board received: ", boardArray);
    });
    this.hubConnection.on("SnakeBoardUpdate", (boardArray: CellType [][]) => {
      this.snakeBoardUpdate.next(boardArray);
    });
    this.hubConnection.on("GameStates", (gameState: GameStates) => {
      this.gameStares.next(gameState);
    });
  }

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

  public sendMessage(message: string): void {
    this.hubConnection
      .invoke("SendMessage", message)
      .catch(err => console.error(err));
  }

  public sendBoard(columns: number, rows: number): void {
    this.hubConnection
      .invoke("SendTestBoard", columns, rows)
      .catch(err => console.error(err));
  }

  public getSnakeBoardUpdate(): Observable<any[][]> {
    return this.snakeBoardUpdate.asObservable();
  }

  public getGameStates(): Observable<GameStates> {
    return this.gameStares.asObservable();
  }
  public setMovement(key: string): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(key);
    return this.http.post('http://localhost:5273/api/Game/SetMovement', body, {'headers': headers});
  }

  public startGame(columns: number, rows: number): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify({columns, rows});
    return this.http.post(`http://localhost:5273/api/Game/start`, body, {'headers': headers});
  }
}
