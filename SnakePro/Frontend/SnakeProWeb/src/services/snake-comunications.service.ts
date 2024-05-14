import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {CellType} from "../common/Board";

@Injectable({
  providedIn: 'root'
})
export class SnakeComunicationsService {
  private hubConnection: signalR.HubConnection;

  constructor() {
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
}
