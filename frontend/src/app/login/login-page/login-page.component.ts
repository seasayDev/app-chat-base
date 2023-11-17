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
  errorMessage: string | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onLogin(userCredentials: UserCredentials) {
    try {
      await this.authenticationService.login(userCredentials);
      this.router.navigate(["/chat"]);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          this.errorMessage = "Mot de passe invalide";
        } else {
          this.errorMessage = "Problème de connexion";
        }
      } else {
        this.errorMessage = "Une erreur inattendue s'est produite";
      }
    }
  }
}
