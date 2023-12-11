import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";
import { inject } from "@angular/core";

export const loginPageGuard: CanActivateFn = (route, state) => {
  return inject(AuthenticationService).isConnected()
    ? inject(Router).parseUrl("/chat")
    : true;
};
