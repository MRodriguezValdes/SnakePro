import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-starting-menu',
  templateUrl: './starting-menu.component.html',
  styleUrls: ['./starting-menu.component.css']
})
export class StartingMenuComponent implements OnInit {
  isMenuHidden = false;

  @Output() startClicked = new EventEmitter<void>();
  @Output() settingsClicked = new EventEmitter<void>();
  private hasErrorOccurred: boolean | undefined;

  constructor(private snakeCommunicationsService: SnakeCommunicationsService) { }


  ngOnInit() {
    // Suscríbete al observable y actualiza la variable cuando ocurra un error
    this.snakeCommunicationsService.errorOccurred.subscribe((error) => {
      this.hasErrorOccurred = true;
    });
  }

  closeMenu() {
    // Solo procede si no ha ocurrido ningún error
    if (!this.hasErrorOccurred) {
      this.isMenuHidden = true;
      setTimeout(() => {
        this.startClicked.emit();
      }, 1000);
    }
  }

  openSettings() {
    this.settingsClicked.emit();
  }

}
