import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  static KEY = 'username';

  private username = new BehaviorSubject<string | null>(null);

  constructor() {
    this.username.next(localStorage.getItem(LoginService.KEY));
  }

  login(login: { username: string; password: string }) {
    // A faire
  }

  logout() {
    // A faire
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
