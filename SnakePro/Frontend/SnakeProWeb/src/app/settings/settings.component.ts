import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {SnakeComunicationsService} from "../../services/snake-comunications.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  boardWidth: number = 20;
  boardHeight: number = 20;

  constructor(public snakeComunicationsService: SnakeComunicationsService) {
  }

  ngOnInit() {
    const savedboardWidth = localStorage.getItem('boardWidth');
    if (savedboardWidth !== null) {
      this.boardWidth = +savedboardWidth;
    }
    const savedboardHeight = localStorage.getItem('boardHeight');
    if (savedboardHeight !== null) {
      this.boardHeight = +savedboardHeight;
    }
  }
  saveSettings() {
    localStorage.setItem('boardWidth', this.boardWidth.toString());
    localStorage.setItem('boardHeight', this.boardHeight.toString());
    console.log(this.boardWidth,this.boardHeight);
  }

  closeSettings() {
    this.close.emit();
    this.snakeComunicationsService.sendBoard(this.boardWidth, this.boardHeight);
  }
}
