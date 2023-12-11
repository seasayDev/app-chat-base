import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  @Output()
  login = new EventEmitter<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onLogin() {
    if (
      this.loginForm.valid &&
      this.loginForm.value.username &&
      this.loginForm.value.password
    ) {
      this.login.emit({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showMissingUsername() {
    return this.showMissing("username");
  }

  showMissingPassword() {
    return this.showMissing("password");
  }

  private showMissing(controlName: string) {
    return (
      this.loginForm.get(controlName)?.hasError("required") &&
      (this.loginForm.get(controlName)?.dirty ||
        this.loginForm.get(controlName)?.touched)
    );
  }
}
