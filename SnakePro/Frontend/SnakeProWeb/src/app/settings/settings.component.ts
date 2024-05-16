import {Component, Output, EventEmitter, OnInit} from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  speed: number = 5;


  ngOnInit() {
    const savedSpeed = localStorage.getItem('snakeSpeed');
    if (savedSpeed !== null) {
      this.speed = +savedSpeed;
    }
  }
  saveSettings() {
    localStorage.setItem('snakeSpeed', this.speed.toString());
    console.log(this.speed.toString())
  }

  closeSettings() {
    this.close.emit();
  }
}
