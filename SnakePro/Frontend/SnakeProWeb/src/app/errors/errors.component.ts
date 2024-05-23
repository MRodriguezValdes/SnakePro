import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SnakeCommunicationsService } from "../../services/snake-communications.service";

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() errorMessage: string = '';
  public backgroundcolor: string = '#ff4c4c';

  constructor(public snakeComunicationsService: SnakeCommunicationsService) { }

  ngOnInit() {
    /*
    this.snakeComunicationsService.errorOccurred.subscribe((error) => {
      this.errorMessage = error;
      console.log(error);
    }); */
  }

  closeErrors() {
    this.close.emit();
  }
}
