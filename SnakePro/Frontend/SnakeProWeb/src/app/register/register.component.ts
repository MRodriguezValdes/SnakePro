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
  formReg: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('passwordConfirm')!.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  };

  onSubmit() {
    if (this.formReg.valid) {
      this.userService.register(this.formReg.value)
        .then(response =>
          this.router.navigate(['/login']))
        .catch(error => console.error(error));
    } else {
      console.error("Form is invalid or passwords do not match.");
    }
  }


  goBack() {
    this.router.navigate(['/login']);
  }

}
