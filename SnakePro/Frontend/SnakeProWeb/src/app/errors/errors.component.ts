import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SnakeComunicationsService } from "../../services/snake-comunications.service";

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() errorMessage: string = '';

  constructor(public snakeComunicationsService: SnakeComunicationsService) { }

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
