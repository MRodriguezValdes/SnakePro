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
  /**
   * formLogin is a FormGroup instance that represents the login form.
   */
  formLogin: FormGroup;

  /**
   * errorMessage is a string that holds any error messages that occur during login.
   */
  errorMessage: string | null = null;

  /**
   * hidePassword is a boolean that determines whether the password input field is of type password or text.
   */
  hidePassword: boolean = true;

  /**
   * token is a string that holds the user's ID token after successful login.
   */
  private token: string | null = null;

  /**
   * The constructor for the LoginComponent class.
   * It initializes the login form and injects the necessary services.
   *
   * @param {UserService} userService - The service for user-related operations.
   * @param {Router} router - The Angular router for navigation.
   * @param {SnakeCommunicationsService} snakeCommunicationsService - The service for snake game-related operations.
   */
  constructor(private userService: UserService, private router: Router, private snakeCommunicationsService: SnakeCommunicationsService) {
    /**
     * formLogin is a FormGroup instance that represents the login form.
     * It has two form controls: email and password.
     */
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  /**
   * The onSubmit method handles the form submission for email/password login.
   * It performs the following steps:
   * 1. Calls the login method of the UserService with the formLogin value.
   * 2. If a user is returned from the login method, it gets the user's ID token.
   * 3. If no user is returned, it throws an error.
   * 4. Sends the ID token to the server using the sendToken method of the SnakeCommunicationsService.
   * 5. Navigates to the home page.
   * 6. If any errors occur during this process, it sets the errorMessage property with a relevant message.
   */
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

  /**
   * The navigateToRegister method is used to navigate to the registration page.
   * It uses the Angular router's navigate method to change the route to '/register'.
   */
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * The onGoogleLogin method handles the Google login process.
   * It performs the following steps:
   * 1. Calls the loginWithGoogle method of the UserService.
   * 2. If a user is returned from the loginWithGoogle method, it gets the user's ID token.
   * 3. If no user is returned, it throws an error.
   * 4. Sends the ID token to the server using the sendToken method of the SnakeCommunicationsService.
   * 5. Navigates to the home page.
   * 6. If any errors occur during this process, it sets the errorMessage property with a relevant message.
   */
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

  /**
   * The onGithubLogin method handles the Github login process.
   * It performs the following steps:
   * 1. Calls the loginWithGithub method of the UserService.
   * 2. If a user is returned from the loginWithGithub method, it gets the user's ID token.
   * 3. If no user is returned, it throws an error.
   * 4. Sends the ID token to the server using the sendToken method of the SnakeCommunicationsService.
   * 5. Navigates to the home page.
   * 6. If any errors occur during this process, it sets the errorMessage property with a relevant message.
   */
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

  /**
   * togglePasswordVisibility is a method that toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
