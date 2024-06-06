import { Component } from '@angular/core';

@Component({
  selector: 'app-starting-menu',
  templateUrl: './starting-menu.component.html',
  styleUrl: './starting-menu.component.css'
})
export class StartingMenuComponent {
  isMenuHidden = false;

  closeMenu() {
    this.isMenuHidden = true;
  }
}
