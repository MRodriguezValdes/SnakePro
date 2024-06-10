import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SnakeCommunicationsService } from "../../services/snake-communications.service";

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent{
  /**
   * @Output() decorator is used to mark a property in a child component as a doorway
   * through which data can travel from the child to the parent. Here it's used to emit
   * an event when the error message needs to be closed.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * @Input() decorator is used to allow data to flow from a parent component into a child component.
   * Here it's used to receive the error message from the parent component.
   */
  @Input() errorMessage: string = '';

  /**
   * The background color of the error message box.
   * @type {string}
   */
  public backgroundcolor: string = '#ff4c4c';

  /**
   * This method is used to emit the 'close' event, which should be handled by the parent component
   * to close the error message.
   */
  closeErrors() {
    this.close.emit();
  }
}
