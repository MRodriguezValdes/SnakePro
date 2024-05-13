import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

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
}
