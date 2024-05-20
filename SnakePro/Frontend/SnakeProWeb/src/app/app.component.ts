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
      this.snakeCommunicationsService.getSnakeBoardUpdate().subscribe((board) => {
        console.log("Board received: ", board);
      });
    });
  }
  startGame(): void {
    this.snakeCommunicationsService.startGame(10, 10).subscribe(()=>console.log("Game started"));
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    this.snakeCommunicationsService.setMovement(event.key).subscribe();
  }

}
