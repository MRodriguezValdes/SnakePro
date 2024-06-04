import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formLogin: FormGroup;
  errorMessage: string | null = null;
  hidePassword: boolean = true;

  constructor(private userService: UserService, private router: Router, private snakeCommunicationsService: SnakeCommunicationsService) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then(response => {
        const user = response.user;
        if (user) {
          return user.getIdToken();
        } else {
          throw new Error('No user returned from email/password sign-in.');
        }
      })
      .then(idToken => {
        console.log('idToken:', idToken);
        this.snakeCommunicationsService.sendToken(idToken).subscribe((user) => console.log("user: ", user));
      })
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error(error)
        this.errorMessage = "Failed to login. Please check your email and password.";
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onGoogleLogin() {
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
        this.snakeCommunicationsService.sendToken(idToken).subscribe((user) => console.log("user: ", user));
      })
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error(error)
        this.errorMessage = "Failed to login with Google. Please try again.";
      });

  }

  onGithubLogin() {
    this.userService.loginWithGithub()
      .then(response => {
        const user = response.user;
        if (user) {
          return user.getIdToken();
        } else {
          throw new Error('No user returned from Github sign-in.');
        }
      })
      .then(idToken => {
        console.log('idToken:', idToken);
        this.snakeCommunicationsService.sendToken(idToken).subscribe((user) => console.log("user: ", user));
      })
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error(error)
        this.errorMessage = "Failed to login with Github. Please try again.";
      });

  }



  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
