import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { TestHelper } from "../TestHelper";

import { LoginFormComponent } from "./login-form.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("LoginFormComponent", () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);
    fixture.detectChanges();
  });

  it("devrait émettre le nom d'utilisateur et le mot de passe", () => {
    let username: string;
    let password: string;

    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const usernameInput = testHelper.getInput("username-input");
    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(usernameInput, "username");
    testHelper.writeInInput(passwordInput, "pwd");

    const submitButton = testHelper.getButton("submit-button");
    submitButton.click();

    expect(username!).toBe("username");
    expect(password!).toBe("pwd");
    expect(component.loginForm.valid).toBe(true);
  });

  it("ne devrait pas émettre lorsque le nom d'utilisateur est manquant", () => {
    let emitted = false;

    component.login.subscribe(() => {
      emitted = true;
    });

    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(passwordInput, "pwd");

    const submitButton = testHelper.getButton("submit-button");
    submitButton.click();

    expect(emitted).toBe(false);
    const usernameErrors = component.loginForm.get("username")?.errors;
    if (usernameErrors) {
      expect(usernameErrors["required"]).toBe(true);
    }
  });

  it("ne devrait pas émettre lorsque le mot de passe est manquant", () => {
    let emitted = false;

    component.login.subscribe(() => {
      emitted = true;
    });

    const usernameInput = testHelper.getInput("username-input");
    testHelper.writeInInput(usernameInput, "username");

    const submitButton = testHelper.getButton("submit-button");
    submitButton.click();

    expect(emitted).toBe(false);
    const passwordErrors = component.loginForm.get("password")?.errors;
    if (passwordErrors) {
      expect(passwordErrors["required"]).toBe(true);
    }
  });

  it("ne devrait pas émettre lorsque le nom d'utilisateur et le mot de passe sont manquants", () => {
    let emitted = false;

    component.login.subscribe(() => {
      emitted = true;
    });

    const submitButton = testHelper.getButton("submit-button");
    submitButton.click();

    expect(emitted).toBe(false);
    const usernameErrors = component.loginForm.get("username")?.errors;
    if (usernameErrors) {
      expect(usernameErrors["required"]).toBe(true);
    }
    const passwordErrors = component.loginForm.get("password")?.errors;
    if (passwordErrors) {
      expect(passwordErrors["required"]).toBe(true);
    }
  });
});
