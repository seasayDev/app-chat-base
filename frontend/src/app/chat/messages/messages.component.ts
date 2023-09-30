import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../message.model";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  @Input() messages: Message[] = [];

  constructor() {}

  ngOnInit(): void {}

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */
  showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }
}
