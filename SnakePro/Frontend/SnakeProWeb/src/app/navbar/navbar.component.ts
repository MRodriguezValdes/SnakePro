import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  /**
   * The constructor for the NavbarComponent class.
   * It injects the Router and UserService services.
   * @param {Router} router - The Angular router service.
   * @param {UserService} userService - The service for user-related operations.
   */
  constructor(private router: Router,  private userService: UserService) {}

  /**
   * The logout method is used to log out the user.
   * It performs the following steps:
   * 1. Calls the logout method of the UserService.
   * 2. If the logout is successful, it navigates to the login page.
   * 3. If any errors occur during this process, it logs the error to the console.
   */
  logout(): void {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.error(error));
  }
  

}
