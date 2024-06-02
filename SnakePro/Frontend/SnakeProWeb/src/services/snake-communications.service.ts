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
  private gameStates = new Subject<GameStates>()
  public errorOccurred = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/snakegamehub")
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

    this.hubConnection.on("SnakeBoardUpdate", (boardArray: CellType [][]) => {
      this.snakeBoardUpdate.next(boardArray);
    });
    this.hubConnection.on("GameStates", (gameState: GameStates) => {
      this.gameStates.next(gameState);
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
  public getSnakeBoardUpdate(): Observable<any[][]> {
    return this.snakeBoardUpdate.asObservable();
  }

  public getGameStates(): Observable<GameStates> {
    return this.gameStates.asObservable();
  }

  public setMovement(key: string): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(key);
    return this.http.post('http://localhost:5273/api/Game/SetMovement', body, {'headers': headers});
  }

  public pauseGame(): Observable<any> {
    return this.http.post('http://localhost:5273/api/Game/PauseGame', null);
  }

  public resumeGame(): Observable<any> {
    return this.http.post('http://localhost:5273/api/Game/ResumeGame', null);
  }

  public startGame(columns: number, rows: number): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify({columns, rows});
    return this.http.post(`http://localhost:5273/api/Game/Start`, body, {'headers': headers});
  }

  sendToken(idToken: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( idToken );
    return this.http.post('http://localhost:5273/api/FirebaseDb/getUserData', body, { headers });
  }
}
