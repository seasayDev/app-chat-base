import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { Router } from "@angular/router";
import { WebSocketService } from "../../service/websocket.service"; 

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

  messages: Message[] = [];
  messagesSubscription: Subscription;

  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private webSocketService: WebSocketService 
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
    this.messagesSubscription = this.messages$.subscribe((m) => {
      this.messages = m;
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.messagesService.fetchMessages();
      // Connectez-vous au WebSocket et rafraichissez la liste de messages
      this.webSocketService.connect().subscribe((event) => {
        if (event === "notif") {
          this.messagesService.fetchMessages();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    // Déconnectez-vous du WebSocket
    this.webSocketService.disconnect();
  }

  onPublishMessage(message: string) {
    if (this.authenticationService.isLoggedIn()) {
      if (this.username != null) {
        const newMessage: Message = {
          id: Date.now(), 
          text: message,
          username: this.username,
          timestamp: Date.now(),
        };
        this.messagesService.postMessage(newMessage);
      }
    } else {
      
      console.log("Vous devez être connecté pour publier un message.");
      this.router.navigate(["/login"]);
    }
  }

  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(["/"]);
  }
}
