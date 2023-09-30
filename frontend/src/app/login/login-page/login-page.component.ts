import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router"; // Importez Router

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {} // Injectez Router) {}

  ngOnInit(): void {}

  onLogin(UserCredentials: UserCredentials) {
    this.authService.login(UserCredentials).subscribe(
      (success: boolean) => {
        if (success) {
          console.log("Connexion réussie");
          // Rediger la connexion vers le chat 
          this.router.navigate(["/chat"]); 
        } else {
          console.log("Échec de la connexion");
        }
      },
      (error: any) => {
        console.log("Une erreur s'est produite lors de la connexion", error);
      }
    );
  }
}
