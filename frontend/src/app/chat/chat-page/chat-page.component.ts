import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.component.html",
  styleUrls: ["./chat-page.component.css"],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.authenticationService.getUsername();

  messageForm = this.fb.group({
    msg: "",
  });

  username: string | null = null;
  usernameSubscription: Subscription;

  messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  onPublishMessage() {
    if (this.username && this.messageForm.valid && this.messageForm.value.msg) {
      this.messagesService.postMessage({
        text: this.messageForm.value.msg,
        username: this.username,
        timestamp: Date.now(),
      });
    }
    this.messageForm.reset();
  }

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

  onLogout() {
    // À faire
  }
}
