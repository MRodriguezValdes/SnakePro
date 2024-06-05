import {Component, OnInit} from '@angular/core';
import { ContactService } from "../../services/contact.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{
  name: string = '';
  email: string = '';
  message: string = '';
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(private contactService: ContactService, private userService: UserService) {}

  ngOnInit() {
    console.log(this.userService.getToken());
  }

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
