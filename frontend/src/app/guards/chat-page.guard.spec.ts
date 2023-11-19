import { TestBed } from "@angular/core/testing";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { of } from "rxjs";
import { ChatPageGuard } from "./chat-page.guard";
import { AuthenticationService } from "../login/authentication.service";

describe("ChatPageGuard", () => {
  let guard: ChatPageGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("AuthenticationService", ["isConnected"]);

    TestBed.configureTestingModule({
      providers: [
        ChatPageGuard,
        { provide: Router, useValue: { parseUrl: () => {} } },
        { provide: AuthenticationService, useValue: spy },
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(
      AuthenticationService
    ) as jasmine.SpyObj<AuthenticationService>;
    guard = TestBed.inject(ChatPageGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if user is connected", () => {
    authService.isConnected.and.returnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it("should redirect to home if user is not connected", () => {
    authService.isConnected.and.returnValue(false);
    spyOn(router, "parseUrl");
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    guard.canActivate(route, state);
    expect(router.parseUrl).toHaveBeenCalledWith("/");
  });
});
