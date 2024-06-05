import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {UserService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuardian implements CanActivate {
  constructor(private loginService: UserService, private router: Router) {}

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
