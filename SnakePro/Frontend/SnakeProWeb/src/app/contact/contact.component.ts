import {Component, OnInit} from '@angular/core';
import { ContactService } from "../../services/contact.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{
  /**
   * The name of the user sending the message.
   * @type {string}
   */
  name: string = '';

  /**
   * The email of the user sending the message.
   * @type {string}
   */
  email: string = '';

  /**
   * The message that the user wants to send.
   * @type {string}
   */
  message: string = '';

  /**
   * A flag indicating if the message was sent successfully.
   * @type {boolean}
   */
  isSuccess: boolean = false;

  /**
   * A flag indicating if there was an error sending the message.
   * @type {boolean}
   */
  isError: boolean = false;

  /**
   * @param {ContactService} contactService - A service for handling contact form operations.
   * @param {UserService} userService - A service for handling user operations.
   */
  constructor(private contactService: ContactService, private userService: UserService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized the component.
   * Here it's used to log the user's token.
   */
  ngOnInit() {
    console.log(this.userService.getToken());
  }

  /**
   * This method is called when the user submits the contact form.
   * It sends the contact form to the server and handles the response.
   */
  onSubmit() {
    const contactForm = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    this.contactService.sendContactForm(contactForm).subscribe(
      (response: any) => {
        this.isSuccess = true;
        this.isError = false;
        console.log('Mail sent correctly', response);
        this.name = '';
        this.email = '';
        this.message = '';
      },
      (error: any) => {
        this.isSuccess = false;
        this.isError = true;
        console.error('Error sending mail', error);
      }
    );
  }
}
