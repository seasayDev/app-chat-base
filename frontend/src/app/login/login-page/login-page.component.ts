import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  loginErrorMessage: string | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onLogin(userCredentials: UserCredentials) {
    this.loginErrorMessage = null;
    try {
      await this.authenticationService.login(userCredentials);
      this.router.navigate(["/chat"]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.loginErrorMessage = "Mot de passe invalide";
      } else {
        this.loginErrorMessage = "Problème de connexion";
      }
    }
  }
}
