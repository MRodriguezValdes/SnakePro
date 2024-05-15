import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType} from "../common/Board";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SnakeCommunicationsService {
  private hubConnection: signalR.HubConnection;
  private readonly endpointUrl = 'http://localhost:5273/api/KeysStroke';

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5273/chathub")
      .build();

    this.hubConnection.on("ReceiveMessage", (message) => {
      console.log("Message received: ", message);
    });
    this.hubConnection.on("ReceiveBoard", (boardArray : CellType [][]) => {
      console.log("Board received: ", boardArray);
    });
  }

  public startConnection(): Promise<void> {
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

  public sendBoard(columns : number , rows : number): void {
    this.hubConnection
      .invoke("SendBoard", columns, rows)
      .catch(err => console.error(err));
  }

  public sendKeyStroke(key: string): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(key);
    return this.http.post(this.endpointUrl, body, { 'headers': headers });
  }
}
