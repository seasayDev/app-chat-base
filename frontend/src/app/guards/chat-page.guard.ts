import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

export const chatPageGuard: CanActivateFn = (route, state) => {
  return inject(AuthenticationService).isConnected()
    ? true
    : inject(Router).parseUrl("/login");
};
