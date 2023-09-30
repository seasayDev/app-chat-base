import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { of} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor() {
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }

  login(userCredentials: UserCredentials) {
    // Stocker le nom d'utilisateur dans le localStorage
    localStorage.setItem(AuthenticationService.KEY, userCredentials.username);
    // Mettre à jour le nom d'utilisateur connecté
    this.username.next(userCredentials.username);
    // Pour l'instant, nous allons simplement retourner un Observable de true
    return of(true);
  }

  logout() {
    // Supprimer le nom d'utilisateur du localStorage
    localStorage.removeItem(AuthenticationService.KEY);
    // Mettre à jour le nom d'utilisateur connecté
    this.username.next(null);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
