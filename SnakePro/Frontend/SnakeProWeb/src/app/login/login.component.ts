import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;

  constructor() { }

  onSubmit() {
    if (this.email && this.password) {
      // Lógica de autenticación aquí
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    }
  }
}
