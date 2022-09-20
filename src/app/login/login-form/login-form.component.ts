import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  loginForm = this.fb.group({
    username: '',
    password: '',
  });

  @Output()
  login = new EventEmitter<{ username: string; password: string }>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onLogin() {
    // A faire
  }
}
