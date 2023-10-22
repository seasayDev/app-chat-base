import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http"; 
import { Message } from "./message.model";
import { environment } from "../../environments/environment"; 

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor(private httpClient: HttpClient) {} 

  fetchMessages(): void {
    this.httpClient
      .get<Message[]>(`${environment.backendUrl}/messages`, {
        withCredentials: true,
      }) 
      .subscribe((messages) => {
        if (messages) {
          this.messages.next(messages);
        }
      });
  }

  postMessage(message: Message): void {
    const newMessage = { ...message, id: Date.now() };
    this.httpClient
      .post(`${environment.backendUrl}/messages`, newMessage, {
        withCredentials: true,
      }) 
      .subscribe(() => {
        this.fetchMessages();
      });
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }
}
