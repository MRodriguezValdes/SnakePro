import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import {Observable} from "rxjs";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup;

  constructor(private userService: UserService, private router: Router, private snakeCommunicationsService: SnakeCommunicationsService) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then(response => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.error(error));
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onGoogleLogin(){
    this.userService.loginWithGoogle()
      .then(response => {
        const user = response.user;
        if (user) {
          return user.getIdToken();
        } else {
          throw new Error('No user returned from Google sign-in.');
        }
      })
      .then(idToken => {
        console.log('idToken:', idToken);
        this.snakeCommunicationsService.sendToken(idToken).subscribe(() => console.log("Token send"));
      })
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.error(error));
  }

}
