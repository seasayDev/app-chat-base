import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { AuthenticationService } from "./authentication.service";
import { environment } from "src/environments/environment";
import { firstValueFrom } from "rxjs";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  const loginData = {
    username: "username",
    password: "pwd",
  };

  afterEach(() => {
    localStorage.clear();
  });

  describe("on login", () => {
    beforeEach(() => {
      localStorage.clear();
      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it("should call POST with login data to auth/login", async () => {
      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        `${environment.backendUrl}/auth/login`
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(loginData);
      req.flush({ username: loginData.username });

      // wait for the login to complete
      await loginPromise;
    });

    it("should store and emit the username", async () => {
      const loginPromise = service.login(loginData);
      const req = httpTestingController.expectOne(
        `${environment.backendUrl}/auth/login`
      );
      req.flush({ username: loginData.username });

      // wait for the login to complete
      await loginPromise;

      service.getUsername().subscribe((username) => {
        expect(username).toBe(loginData.username);
        expect(localStorage.getItem(AuthenticationService.KEY)).toBe(
          loginData.username
        );
      });
    });
  });

  describe("on logout", () => {
    beforeEach(() => {
      localStorage.setItem(AuthenticationService.KEY, loginData.username);

      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it("should call POST with login data to auth/logout", async () => {
      const logoutPromise = service.logout();

      const req = httpTestingController.expectOne(
        `${environment.backendUrl}/auth/logout`
      );
      expect(req.request.method).toBe("POST");
      req.flush({});

      // wait for the logout to complete
      await logoutPromise;
    });

    it("should remove the username from the service and local storage", async () => {
      const logoutPromise = service.logout();
      const req = httpTestingController.expectOne(
        `${environment.backendUrl}/auth/logout`
      );
      req.flush({});

      // wait for the logout to complete
      await logoutPromise;

      service.getUsername().subscribe((username) => {
        expect(username).toBeNull();
        expect(localStorage.getItem(AuthenticationService.KEY)).toBeNull();
      });
    });
  });
});
