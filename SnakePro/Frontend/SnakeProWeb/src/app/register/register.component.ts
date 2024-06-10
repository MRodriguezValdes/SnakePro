import {Component, ViewEncapsulation} from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { UserService } from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css',],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
  /**
   * formReg is a FormGroup instance that represents the registration form.
   */
  formReg: FormGroup;

  /**
   * errorMessage is a string that holds any error messages that occur during the registration process.
   */
  errorMessage: string | null = null;

  /**
   * The constructor for the RegisterComponent class.
   * It injects the UserService and Router services.
   * It also initializes the formReg property with form controls for email, password, and password confirmation.
   * @param {UserService} userService - The service for user-related operations.
   * @param {Router} router - The Angular router service.
   */
  constructor(private userService: UserService, private router: Router) {
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * The passwordMatchValidator method is a custom validator that checks if the password and password confirmation match.
   * @param {AbstractControl} formGroup - The form group that contains the password and password confirmation controls.
   * @returns { { [key: string]: boolean } | null } - Returns an object with a 'mismatch' key if the passwords do not match, or null if they do.
   */
  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('passwordConfirm')!.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  };

  /**
   * The onSubmit method is called when the registration form is submitted.
   * If the form is valid, it calls the register method of the UserService with the form values.
   * If the registration is successful, it navigates to the login page.
   * If an error occurs during the registration process, it sets the errorMessage property with a relevant message.
   */
  onSubmit() {
    if (this.formReg.valid) {
      this.userService.register(this.formReg.value)
        .then(response =>
          this.router.navigate(['/login']))
        .catch(error => {
          console.error(error)
          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'Email already in use';
          }
        });
    } else {
      console.error("Form is invalid or passwords do not match.");
    }
  }

  /**
   * The goBack method is used to navigate back to the login page.
   */
  goBack() {
    this.router.navigate(['/login']);
  }
}
