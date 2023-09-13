import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onLogin(UserCredentials: UserCredentials) {
    // À faire
  }
}
