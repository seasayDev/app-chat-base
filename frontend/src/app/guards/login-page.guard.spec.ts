import { TestBed } from "@angular/core/testing";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { of } from "rxjs";
import { LoginPageGuard } from "./login-page.guard";
import { AuthenticationService } from "../login/authentication.service";

describe("LoginPageGuard", () => {
  let guard: LoginPageGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("AuthenticationService", ["isConnected"]);

    TestBed.configureTestingModule({
      providers: [
        LoginPageGuard,
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: AuthenticationService, useValue: spy },
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(
      AuthenticationService
    ) as jasmine.SpyObj<AuthenticationService>;
    guard = TestBed.inject(LoginPageGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if user is not connected", () => {
    authService.isConnected.and.returnValue(false);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it("should redirect to chat if user is connected", () => {
    authService.isConnected.and.returnValue(true);
    spyOn(router, "navigate");
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    guard.canActivate(route, state);
    expect(router.navigate).toHaveBeenCalledWith(["/chat"]);
  });
});
