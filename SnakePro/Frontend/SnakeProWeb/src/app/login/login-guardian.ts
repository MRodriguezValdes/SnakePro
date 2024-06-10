import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {UserService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuardian implements CanActivate {

  /**
   * The constructor for the LoginGuardian class.
   * It injects the UserService and Router services.
   * @param {UserService} loginService - The service for user-related operations.
   * @param {Router} router - The Angular router service.
   */
  constructor(private loginService: UserService, private router: Router) {}


  /**
   * The canActivate method is a guard that determines whether a route can be activated.
   * It checks if the user is authenticated by calling the getToken method of the UserService.
   * If the user is authenticated, it returns true and the route can be activated.
   * If the user is not authenticated, it navigates to the login page and returns false, preventing the route from being activated.
   * @param {ActivatedRouteSnapshot} route - The current route snapshot.
   * @param {RouterStateSnapshot} state - The current router state snapshot.
   * @returns {boolean} - A boolean indicating whether the route can be activated.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.loginService.getToken()) {
      console.log(this.loginService.getToken())
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
