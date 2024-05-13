import { Component, OnInit } from '@angular/core';
import { SnakeComunicationsService } from '../services/snake-comunications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(private snakeComunicationsService: SnakeComunicationsService) { }

  ngOnInit() {
    this.snakeComunicationsService.startConnection().then(() => {
      this.snakeComunicationsService.sendMessage("hola");
    });
  }
}
