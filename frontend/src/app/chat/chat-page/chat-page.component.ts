import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { MessagesService } from "../messages.service";
import { Router } from "@angular/router";
import { WebSocketEvent, WebSocketService } from "../websocket.service";
import { NewMessageRequest, ChatImageData } from "../message.model";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.component.html",
  styleUrls: ["./chat-page.component.css"],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.authenticationService.getUsername();

  username: string | null = null;
  usernameSubscription: Subscription;

  notifications$: Observable<WebSocketEvent> | null = null;
  notificationsSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private webSocketService: WebSocketService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
  }

  ngOnInit() {
    this.notifications$ = this.webSocketService.connect();
    this.notificationsSubscription = this.notifications$.subscribe(() => {
      this.messagesService.fetchMessages();
    });
    this.messagesService.fetchMessages();
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  async onPublishMessage(message: {
    text: string;
    imageData: ChatImageData | null;
  }) {
    if (this.username != null) {
      await this.messagesService.postMessage({
        text: message.text,
        username: this.username,
        imageData: message.imageData,
      });
    }
  }

  onLogout() {
    this.webSocketService.disconnect();
    this.authenticationService.logout();
    this.messagesService.clear();
    this.router.navigate(["/"]);
  }
}
