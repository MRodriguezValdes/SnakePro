import { Component, OnInit ,HostListener} from '@angular/core';
import { SnakeCommunicationsService } from '../services/snake-communications.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';

  constructor(private snakeCommunicationsService: SnakeCommunicationsService, private http:HttpClient) { }

  ngOnInit() {
    this.snakeCommunicationsService.startConnection().then(() => {
      this.snakeCommunicationsService.sendMessage("hola");
      this.snakeCommunicationsService.sendBoard(2,2);
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    this.snakeCommunicationsService.sendKeyStroke(event.key).subscribe();
  }

}
