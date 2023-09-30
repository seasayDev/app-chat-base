import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "./message.model";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor() {}

  postMessage(message: Message): void {
    // Récupérez le tableau de messages actuel
    const currentMessages = this.messages.getValue();
    // Ajoutez le nouveau message au tableau
    currentMessages.push(message);
    // Émettez le nouveau tableau de messages
    this.messages.next(currentMessages);
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }
}
