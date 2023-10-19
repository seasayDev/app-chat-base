import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { HttpClient } from "@angular/common/http"; // Import HttpClient
import { firstValueFrom } from "rxjs"; // Import firstValueFrom
import { environment } from "../../environments/environment"; // Import environment

// Création de l'interface LoginResponse
export interface LoginResponse {
  token: string;
  // Ajoutez ici d'autres champs selon la réponse de votre backend
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor(private httpClient: HttpClient) {
    // Inject HttpClient
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }

  async login(userCredentials: UserCredentials) {
    const loginResponse = await firstValueFrom(
      this.httpClient.post<LoginResponse>(
        `${environment.backendUrl}/auth/login`,
        userCredentials,
        { withCredentials: true }
      )
    );
    localStorage.setItem(AuthenticationService.KEY, userCredentials.username);
    this.username.next(userCredentials.username);
  }

  async logout() {
    await firstValueFrom(
      this.httpClient.post(
        `${environment.backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      )
    );
    localStorage.removeItem(AuthenticationService.KEY);
    this.username.next(null);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
