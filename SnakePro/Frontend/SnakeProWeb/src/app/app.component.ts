import { Component, OnInit ,HostListener} from '@angular/core';
import { SnakeComunicationsService } from '../services/snake-comunications.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(private snakeComunicationsService: SnakeComunicationsService, private http:HttpClient) { }

  ngOnInit() {
    this.snakeComunicationsService.startConnection().then(() => {
      this.snakeComunicationsService.sendMessage("hola");
      this.snakeComunicationsService.sendBoard(2,2);
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.http.post('http://localhost:5273/api/KeysStrokeController', event.key).subscribe();
  }

}
