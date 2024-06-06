import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-starting-menu',
  templateUrl: './starting-menu.component.html',
  styleUrls: ['./starting-menu.component.css']
})
export class StartingMenuComponent {
  isMenuHidden = false;

  @Output() startClicked = new EventEmitter<void>();

  closeMenu() {
    this.isMenuHidden = true;
    setTimeout(() => {
      this.startClicked.emit();
    }, 5000);
  }
}
