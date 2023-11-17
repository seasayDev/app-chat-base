import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

@Injectable({
  providedIn: "root",
})
export class ChatPageGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isConnected()) {
      return true;
    } else {
      return this.router.parseUrl("/");
    }
  }
}
