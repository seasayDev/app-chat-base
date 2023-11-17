import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import { Message, NewMessageRequest } from "./message.model";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  private messages = new BehaviorSubject<Message[]>([]);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async postMessage(message: NewMessageRequest): Promise<Message> {
    try {
      return await firstValueFrom(
        this.httpClient.post<Message>(
          `${environment.backendUrl}/messages`,
          message,
          {
            withCredentials: true,
          }
        )
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.authService.logout();
        this.router.navigate(["/"]);
      }
      throw error;
    }
  }

  async fetchMessages() {
    try {
      const lastMessageId =
        this.messages.value.length > 0
          ? this.messages.value[this.messages.value.length - 1].id
          : null;

      const isIncrementalFetch = lastMessageId != null;
      let queryParameters = isIncrementalFetch
        ? new HttpParams().set("fromId", lastMessageId)
        : new HttpParams();

      const messages = await firstValueFrom(
        this.httpClient.get<Message[]>(`${environment.backendUrl}/messages`, {
          params: queryParameters,
          withCredentials: true,
        })
      );
      this.messages.next(
        isIncrementalFetch ? [...this.messages.value, ...messages] : messages
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.authService.logout();
        this.router.navigate(["/"]);
      }
      throw error;
    }
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  clear() {
    this.messages.next([]);
  }
}
