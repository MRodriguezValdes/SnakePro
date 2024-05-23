import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType} from "../common/Board";
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SnakeCommunicationsService {
  private hubConnection: signalR.HubConnection;
  private snakeBoardUpdate = new Subject<CellType[][]>()

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/chathub")
      .build();

    this.hubConnection.on("ReceiveMessage", (message) => {
      console.log("Message received: ", message);
    });
    this.hubConnection.on("ReceiveTestBoard", (boardArray: CellType [][]) => {
      console.log(" Test Board received: ", boardArray);
    });
    this.hubConnection.on("SnakeBoardUpdate", (boardArray: CellType [][]) => {
      this.snakeBoardUpdate.next(boardArray);
    });
  }

  public async startConnection(): Promise<void> {
    return this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
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
