import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

@Injectable({
  providedIn: "root",
})
export class LoginPageGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isConnected()) {
      return true;
    } else {
      this.router.navigate(["/chat"]);
      return false;
    }
  }
}
